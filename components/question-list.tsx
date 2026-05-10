import { QuestionCard } from '@/components/question-card';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import type { QuestionsOutput } from '@/lib/schemas';

type PartialQuestions =
  | { questions?: Array<{ question?: string; rationale?: string } | undefined> }
  | undefined;

type Props = {
  data: PartialQuestions;
  isLoading: boolean;
};

export function QuestionList({ data, isLoading }: Props) {
  const items = data?.questions;

  if (isLoading && (!items || items.length === 0)) {
    return <LoadingSkeleton />;
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((q, i) => (
        <li key={i}>
          <QuestionCard index={i} question={q?.question} rationale={q?.rationale} />
        </li>
      ))}
    </ul>
  );
}

export type { QuestionsOutput };
