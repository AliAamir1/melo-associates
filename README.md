# Melo Associates Technical Screen — Interview Question Generator

A single-page Next.js app that takes a job title and streams three role-specific interview questions (with a short rationale for each) using the Vercel AI SDK and Gemini 2.0 Flash.

**Live URL:** _[paste the Vercel URL after deploy]_
**Loom walkthrough:** _[paste the Loom URL after recording]_

## Run locally

```bash
pnpm install
cp .env.example .env.local
# add your GOOGLE_GENERATIVE_AI_API_KEY (free at https://aistudio.google.com/apikey)
pnpm dev
```

Open http://localhost:3000.

## Architecture

```
[browser]                 [server]                       [provider]
JobTitleForm ─submit──►  POST /api/questions  ─stream──►  Gemini 2.0 Flash
                          │
                          ├─ zod input validation
                          ├─ in-memory rate limit (5 req/min/IP)
                          └─ streamObject(schema)  ──text-stream─►
                                                                  │
useObject ◄────────────────── partial JSON chunks ────────────────┘
   │
QuestionList → QuestionCard × 3   (cards fade in as fields arrive)
```

## Folder map

```
app/
  api/questions/route.ts   # POST handler — streamObject, server-only
  page.tsx                 # server component, renders <InterviewScreen/>
  layout.tsx               # fonts, metadata, <Toaster/>
components/
  ui/                      # shadcn primitives (untouched)
  interview-screen.tsx     # client root, owns the useObject hook
  job-title-form.tsx       # form + client-side zod validation
  question-list.tsx        # streaming-aware list
  question-card.tsx        # card with partial-field guards
  loading-skeleton.tsx     # 3 placeholder cards
  error-state.tsx          # error w/ retry button
lib/
  ai.ts                    # google provider, model id (server-only)
  prompt.ts                # system + user prompt builders
  rate-limit.ts            # in-memory token bucket
  schemas.ts               # zod input + output schemas
  utils.ts                 # cn() helper (shadcn default)
```

## Security notes

- `GOOGLE_GENERATIVE_AI_API_KEY` is read only inside `lib/ai.ts`, which is guarded by `import 'server-only'`. Importing it from a client module fails the build.
- Input is validated with Zod on both the client (UX) and server (trust boundary). The server is authoritative.
- The output schema is enforced by `streamObject` during decode; the model cannot exfiltrate prose.
- A simple per-IP token bucket (`5 req / min`) protects the free tier. **Production should swap this for Upstash Redis** — the in-memory map does not survive process restarts and does not work across Vercel's serverless instances.
- The system prompt instructs the model to ignore instructions embedded inside the job title.

## Provider + model

- **Provider:** Google Generative AI via `@ai-sdk/google`.
- **Model:** `gemini-2.0-flash`.
- **Why:** Free tier eligibility per the task brief, fast time-to-first-token, well-supported structured output. Swap is a one-line change in `lib/ai.ts` (`MODEL_ID`).

## What I would improve with more time

- Production-grade rate limiting via Upstash Redis.
- Lightweight eval harness — a fixture of job titles plus heuristics to flag generic outputs ("Tell me about yourself") so prompt edits can regress safely.
- Per-question regenerate ("give me a different one of these") and a copy-to-clipboard affordance.
- Accessibility audit — keyboard focus order, screen-reader announcements when each card streams in.
- Tighter mobile polish (the page works on small screens but the form layout could earn another pass).

## Testing

This is a 30-minute screen, so there is no unit/e2e harness. Verification = manual browser flows + `pnpm tsc --noEmit` + `pnpm lint` + `pnpm build`. With more time the first thing to add would be the eval harness above.

## AI usage disclosure

Per the brief: I used Claude Code as a pair-programming assistant for project structure, prompt iteration, and small refactors. The code in this repo was reviewed and edited by hand — none of it was committed unread.

## License

MIT.
