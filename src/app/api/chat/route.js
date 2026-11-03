import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit, clientIp } from '../../../lib/rate-limit';
import { buildSystemPrompt } from '../../../lib/assistant-prompt';

// Initialize Deepseek client using the OpenAI SDK with a custom base URL.
const deepseek = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })
  : null;

// Abuse limits. Every request here costs money.
const REQUESTS_PER_WINDOW = 10;
const WINDOW_MS = 60_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_HISTORY_MESSAGES = 10;

const SYSTEM_PROMPT = buildSystemPrompt();

export async function POST(req) {
  if (!deepseek) {
    return NextResponse.json({ error: 'Deepseek API key not configured' }, { status: 503 });
  }

  const { allowed, retryAfter } = rateLimit(
    clientIp(req),
    REQUESTS_PER_WINDOW,
    WINDOW_MS
  );

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many messages. Give me a minute.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await req.json();
    const incoming = body?.messages;

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Only ever forward well-formed turns, capped in both count and size, so a
    // caller cannot smuggle a giant payload (or a fake system turn) upstream.
    const messages = incoming
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

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 });
    }

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    const answer =
      completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Deepseek API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
