import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { quote, source } = await request.json();

    if (!quote || !source) {
      return NextResponse.json(
        { error: 'Quote and source text are required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a quote verification assistant. Analyze if the quote appears in the source text.
          
Respond with a JSON object containing:
- "found": boolean (true if quote is found/verified, false if not)
- "confidence": number (0-100)
- "context": string (surrounding text if found, or explanation if not found)
- "reasoning": string (brief explanation of your analysis)`
        },
        {
          role: 'user',
          content: `Quote to verify: "${quote}"

Source text:
${source}`
        }
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json({
      found: result.found || false,
      confidence: result.confidence || 0,
      context: result.context || '',
      reasoning: result.reasoning || '',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify quote' },
      { status: 500 }
    );
  }
}
