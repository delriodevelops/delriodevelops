import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {
    const { threadId } = await req.json();
    const messages = await openai.beta.threads.messages.list(threadId);
    const formattedMessages = messages.data.map(({ role, content }) => ({ role, content: content[0].text.value }))
    return NextResponse.json(formattedMessages.reverse())
}