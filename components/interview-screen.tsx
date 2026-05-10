'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { toast } from 'sonner';
import { JobTitleForm } from '@/components/job-title-form';
import { QuestionList } from '@/components/question-list';
import { ErrorState } from '@/components/error-state';
import { questionsSchema } from '@/lib/schemas';

const PROVIDER_ERROR_MESSAGE =
  'The AI provider returned no questions. This is usually an API key or quota issue — check the server logs.';

export function InterviewScreen() {
  const [lastJobTitle, setLastJobTitle] = useState<string | null>(null);
  const [providerError, setProviderError] = useState<string | null>(null);

  const { object, submit, isLoading, error, stop } = useObject({
    api: '/api/questions',
    schema: questionsSchema,
    onError: (err) => {
      toast.error(err.message ?? 'Something went wrong.');
    },
    onFinish: ({ object: finalObject }) => {
      if (!finalObject || finalObject.questions.length === 0) {
        setProviderError(PROVIDER_ERROR_MESSAGE);
        toast.error(PROVIDER_ERROR_MESSAGE);
      }
    },
  });

  function handleSubmit(jobTitle: string) {
    setLastJobTitle(jobTitle);
    setProviderError(null);
    submit({ jobTitle });
  }

  function handleRetry() {
    if (lastJobTitle) {
      setProviderError(null);
      submit({ jobTitle: lastJobTitle });
    }
  }

  const visibleError = error?.message ?? providerError;

  return (
    <div className="flex flex-col gap-8">
      <JobTitleForm isLoading={isLoading} onSubmit={handleSubmit} />

      {visibleError ? (
        <ErrorState message={visibleError} onRetry={handleRetry} />
      ) : (
        <QuestionList data={object} isLoading={isLoading} />
      )}

      {isLoading ? (
        <button
          type="button"
          onClick={stop}
          className="self-start text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Cancel
        </button>
      ) : null}
    </div>
  );
}
