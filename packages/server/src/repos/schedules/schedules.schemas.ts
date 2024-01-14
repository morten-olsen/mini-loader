import { z } from 'zod';

const addScheduleSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  load: z.string(),
  cron: z.string(),
  input: z.string().optional(),
});

const findSchedulesSchema = z.object({
  ids: z.array(z.string()).optional(),
  loadIds: z.array(z.string()).optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
});

type AddScheduleOptions = z.infer<typeof addScheduleSchema>;
type FindSchedulesOptions = z.infer<typeof findSchedulesSchema>;

export type { AddScheduleOptions, FindSchedulesOptions };
export { addScheduleSchema, findSchedulesSchema };
