import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function GET() {
    const { id } = await openai.beta.threads.create();
    return NextResponse.json(id)
}