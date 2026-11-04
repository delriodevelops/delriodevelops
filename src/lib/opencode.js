/**
 * LLM access through OpenCode Go (opencode.ai), an OpenAI-compatible endpoint.
 *
 * `opencodeFetch` is handed to the OpenAI SDK as its `fetch`: it sends each chat
 * request to the models in OPENCODE_MODELS in order, moving to the next one when a
 * model fails (DeepSeek needs "Global" regions enabled in the OpenCode workspace,
 * for instance), and adds the session header Go uses for routing.
 */
import OpenAI from 'openai';

export const OPENCODE_BASE_URL = process.env.OPENCODE_BASE_URL || 'https://opencode.ai/inference/go/openai/v1';

const MODELS = (process.env.OPENCODE_MODELS || 'deepseek-v4.1-flash,glm-5.3-flash')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);

const USER_AGENT = 'iamdelrio-portfolio/1.0';

export async function opencodeFetch(url, init = {}) {
  let body;
  try {
    body = JSON.parse(init.body);
  } catch {
    return fetch(url, init);
  }
  if (!body?.model) return fetch(url, init);

  const headers = new Headers(init.headers);
  headers.delete('content-length'); // the body changes with each model
  headers.set('user-agent', USER_AGENT);
  if (!headers.has('x-opencode-session')) headers.set('x-opencode-session', crypto.randomUUID());

  let response;
  for (const model of MODELS) {
    response = await fetch(url, { ...init, headers, body: JSON.stringify({ ...body, model }) });
    if (response.ok) return response;
    console.warn(`OpenCode model ${model} failed with ${response.status}: ${(await response.clone().text()).slice(0, 200)}`);
  }
  return response;
}

/** An OpenAI SDK client on OpenCode Go, or null without OPENCODE_API_KEY. */
export function createOpenCodeClient() {
  if (!process.env.OPENCODE_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENCODE_API_KEY, baseURL: OPENCODE_BASE_URL, fetch: opencodeFetch });
}
