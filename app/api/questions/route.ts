import { streamObject } from 'ai';
import { google, MODEL_ID } from '@/lib/ai';
import { jobTitleSchema, questionsSchema } from '@/lib/schemas';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt';
import { checkRateLimit, ipFromRequest } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = ipFromRequest(req);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many requests. Please try again in a minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = jobTitleSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  const { jobTitle } = parsed.data;

  try {
    const result = streamObject({
      model: google(MODEL_ID),
      schema: questionsSchema,
      system: SYSTEM_PROMPT,
      prompt: buildUserPrompt(jobTitle),
      onError: ({ error }) => {
        console.error('streamObject error:', error);
      },
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error('streamObject threw synchronously:', err);
    return Response.json(
      { error: 'The AI provider failed. Please try again.' },
      { status: 502 },
    );
  }
}
