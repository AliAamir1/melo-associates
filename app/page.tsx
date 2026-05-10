import { InterviewScreen } from '@/components/interview-screen';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-10 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Interview prep
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Generate role-specific interview questions.
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a job title and get three thoughtful questions tailored to the role,
          with a short rationale for each.
        </p>
      </header>

      <InterviewScreen />

      <footer className="mt-auto border-t pt-6 text-xs text-muted-foreground">
        Powered by Gemini 2.0 Flash via Vercel AI SDK.
      </footer>
    </main>
  );
}
