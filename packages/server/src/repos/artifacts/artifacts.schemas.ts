import { z } from 'zod';

const addArtifactSchema = z.object({
  name: z.string(),
  runId: z.string(),
  loadId: z.string(),
  data: z.string(),
});

const findArtifactsSchema = z.object({
  ids: z.array(z.string()).optional(),
  runId: z.string().optional(),
  loadId: z.string().optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
});

type AddArtifactOptions = z.infer<typeof addArtifactSchema>;
type FindArtifactsOptions = z.infer<typeof findArtifactsSchema>;

export type { AddArtifactOptions, FindArtifactsOptions };
export { addArtifactSchema, findArtifactsSchema };
