'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { jobTitleSchema } from '@/lib/schemas';

type Props = {
  isLoading: boolean;
  onSubmit: (jobTitle: string) => void;
};

export function JobTitleForm({ isLoading, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = jobTitleSchema.safeParse({ jobTitle: value });
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? 'Invalid input.');
          return;
        }
        setError(null);
        onSubmit(parsed.data.jobTitle);
      }}
      className="flex flex-col gap-3"
      noValidate
    >
      <Label htmlFor="job-title" className="text-sm font-medium">
        Job title
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="job-title"
          name="jobTitle"
          placeholder="e.g. Customer Success Manager"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
          autoFocus
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'job-title-error' : 'job-title-hint'}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={isLoading || value.trim().length === 0}>
          {isLoading ? 'Generating…' : 'Generate questions'}
        </Button>
      </div>
      {error ? (
        <p id="job-title-error" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p id="job-title-hint" className="text-xs text-muted-foreground">        
        </p>
      )}
    </form>
  );
}
