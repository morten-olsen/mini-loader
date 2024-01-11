import { z } from 'zod';

const runStatusSchema = z.enum(['running', 'succeeded', 'failed']);

const createRunSchema = z.object({
  loadId: z.string(),
  config: z.any().optional(),
  data: z.any().optional(),
});

const updateRunSchema = z.object({
  status: runStatusSchema,
  error: z.string().optional(),
});

const findRunsSchema = z.object({
  loadId: z.string().optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
});

type RunStatus = z.infer<typeof runStatusSchema>;
type CreateRunOptions = z.infer<typeof createRunSchema>;
type UpdateRunOptions = z.infer<typeof updateRunSchema>;
type FindRunsOptions = z.infer<typeof findRunsSchema>;

export type { RunStatus, CreateRunOptions, UpdateRunOptions, FindRunsOptions };
export { runStatusSchema, createRunSchema, updateRunSchema, findRunsSchema };
