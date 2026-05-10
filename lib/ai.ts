import 'server-only';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    'GOOGLE_GENERATIVE_AI_API_KEY is not set. Copy .env.example to .env.local and add your key.',
  );
}

export const google = createGoogleGenerativeAI({ apiKey });

export const MODEL_ID = 'gemini-2.0-flash';
