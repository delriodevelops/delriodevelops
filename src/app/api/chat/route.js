import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '../../../lib/rate-limit';
import { loadSystemPrompt } from '../../../lib/assistant-context';
import { createOpenCodeClient } from '../../../lib/opencode';
import { countToday, logChat, visitorId } from '../../../lib/chat-log';

// DeepSeek through OpenCode Go (see lib/opencode)
const llm = createOpenCodeClient();

// Abuse limits. The endpoint is public and runs on a subscription meant for
// light use, so it is throttled per minute (per isolate) and per day (global, in D1).
const REQUESTS_PER_WINDOW = 6;
const WINDOW_MS = 60_000;
const QUESTIONS_PER_VISITOR_PER_DAY = 40;
const QUESTIONS_PER_DAY = 800;
const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_MESSAGES = 10;
// Room for the model's reasoning plus an answer of ~300 words; the prompt asks for less.
const MAX_TOKENS = 1_500;
const MAX_ANSWER_LENGTH = 4_000;

const tooMany = (error, retryAfter) =>
  NextResponse.json({ error }, { status: 429, headers: retryAfter ? { 'Retry-After': String(retryAfter) } : {} });

export async function POST(req) {
  if (!llm) {
    return NextResponse.json({ error: 'The assistant is not configured.' }, { status: 503 });
  }

  const ip = clientIp(req);
  const { allowed, retryAfter } = rateLimit(ip, REQUESTS_PER_WINDOW, WINDOW_MS);
  if (!allowed) return tooMany('Too many messages. Give me a minute.', retryAfter);

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Only ever forward well-formed turns, capped in both count and size, so a
  // caller cannot smuggle a giant payload (or a fake system turn) upstream.
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter(
      (message) =>
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0 || messages.at(-1).role !== 'user') {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 });
  }

  const visitor = await visitorId(ip);
  const today = await countToday(visitor).catch(() => null);
  if (today && today.visitor >= QUESTIONS_PER_VISITOR_PER_DAY) {
    return tooMany("That's all the questions for today. Write to me on LinkedIn or by email and I'll answer myself.");
  }
  if (today && today.all >= QUESTIONS_PER_DAY) {
    return tooMany('The assistant is resting for today. Reach me on LinkedIn or by email.');
  }

  const entry = {
    visitor,
    country: req.headers.get('cf-ipcountry'),
    page: (() => {
      try {
        return new URL(req.headers.get('referer') || '').pathname;
      } catch {
        return null;
      }
    })(),
    question: messages.at(-1).content,
  };

  try {
    const completion = await llm.chat.completions.create({
      model: 'deepseek-v4.1-flash', // overridden by OPENCODE_MODELS
      messages: [{ role: 'system', content: await loadSystemPrompt() }, ...messages],
      max_tokens: MAX_TOKENS,
      temperature: 0.5,
    });

    const answer = (completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.')
      .trim()
      .slice(0, MAX_ANSWER_LENGTH);

    await logChat({ ...entry, answer, model: completion.model }).catch((error) => console.error('Chat log failed:', error));
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('OpenCode API error:', error);
    await logChat({ ...entry, status: 'error', answer: String(error?.message || error).slice(0, 500) }).catch(() => {});
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
