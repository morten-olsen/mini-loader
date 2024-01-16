import { z } from 'zod';

const setLoadSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  script: z.string(),
});

const findLoadsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

type SetLoadOptions = z.infer<typeof setLoadSchema>;
type FindLoadsOptions = z.infer<typeof findLoadsSchema>;

export type { SetLoadOptions, FindLoadsOptions };
export { setLoadSchema, findLoadsSchema };
