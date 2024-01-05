import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {
    const { content, threadId } = await req.json();

    await openai.beta.threads.messages.create(threadId, { role: 'user', content });

    let run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID });

    while (run.status !== 'completed') {
        new Promise(resolve => setTimeout(resolve, 500));
        run = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    const messages = await openai.beta.threads.messages.list(threadId);

    const answer = messages.data[0].content[0].text.value;

    return NextResponse.json({ answer })
}