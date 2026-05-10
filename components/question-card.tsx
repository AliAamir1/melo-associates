import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  index: number;
  question: string | undefined;
  rationale: string | undefined;
};

export function QuestionCard({ index, question, rationale }: Props) {
  const label = String(index + 1).padStart(2, '0');

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-1 duration-300">
      <CardHeader className="pb-3">
        <span className="text-xs font-medium tracking-widest text-muted-foreground">
          {label}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {question ? (
          <p className="text-base font-medium leading-relaxed text-foreground">
            {question}
          </p>
        ) : (
          <Skeleton className="h-5 w-11/12" />
        )}
        {rationale ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{rationale}</p>
        ) : (
          <Skeleton className="h-3 w-5/6" />
        )}
      </CardContent>
    </Card>
  );
}
