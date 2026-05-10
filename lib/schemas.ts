import { z } from 'zod';

export const jobTitleSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(2, 'Job title must be at least 2 characters.')
    .max(100, 'Job title must be 100 characters or fewer.'),
});

export type JobTitleInput = z.infer<typeof jobTitleSchema>;

export const questionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .describe('Interview question. Specific to the role. Ends with a question mark.'),
        rationale: z
          .string()
          .describe('1–2 sentences explaining what this question probes for.'),
      }),
    )
    .length(3),
});

export type QuestionsOutput = z.infer<typeof questionsSchema>;
