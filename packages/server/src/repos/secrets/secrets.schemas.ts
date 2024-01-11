import { z } from 'zod';

const setSecretSchema = z.object({
  id: z.string(),
  value: z.string(),
});

const findSecretsSchema = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
});

type SetSecretOptions = z.infer<typeof setSecretSchema>;
type FindSecretOptions = z.infer<typeof findSecretsSchema>;

export type { SetSecretOptions, FindSecretOptions };
export { setSecretSchema, findSecretsSchema };
