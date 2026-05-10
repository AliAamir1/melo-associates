import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <ul className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      {[0, 1, 2].map((i) => (
        <li key={i}>
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-3 w-8" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
