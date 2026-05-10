'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { toast } from 'sonner';
import { JobTitleForm } from '@/components/job-title-form';
import { QuestionList } from '@/components/question-list';
import { ErrorState } from '@/components/error-state';
import { questionsSchema } from '@/lib/schemas';

export function InterviewScreen() {
  const [lastJobTitle, setLastJobTitle] = useState<string | null>(null);

  const { object, submit, isLoading, error, stop } = useObject({
    api: '/api/questions',
    schema: questionsSchema,
    onError: (err) => {
      toast.error(err.message ?? 'Something went wrong.');
    },
  });

  function handleSubmit(jobTitle: string) {
    setLastJobTitle(jobTitle);
    submit({ jobTitle });
  }

  function handleRetry() {
    if (lastJobTitle) {
      submit({ jobTitle: lastJobTitle });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <JobTitleForm isLoading={isLoading} onSubmit={handleSubmit} />

      {error ? (
        <ErrorState
          message={error.message ?? 'The request failed. Please try again.'}
          onRetry={handleRetry}
        />
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
