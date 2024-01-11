import { z } from 'zod';

const addLogSchema = z.object({
  runId: z.string(),
  loadId: z.string(),
  severity: z.enum(['info', 'warning', 'error']),
  message: z.string(),
  data: z.any().optional(),
});

const findLogsSchema = z.object({
  runId: z.string().optional(),
  loadId: z.string().optional(),
  severities: z.array(z.enum(['debug', 'info', 'warn', 'error'])).optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

type AddLogOptions = z.infer<typeof addLogSchema>;
type FindLogsOptions = z.infer<typeof findLogsSchema>;

export type { AddLogOptions, FindLogsOptions };
export { addLogSchema, findLogsSchema };
