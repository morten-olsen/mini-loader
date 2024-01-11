import { z } from 'zod';
import { publicProcedure, router } from './router.utils.js';
import { findSecretsSchema, setSecretSchema } from '../repos/secrets/secrets.schemas.js';

const find = publicProcedure.input(findSecretsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { secrets } = repos;

  const result = await secrets.find(input);
  return result;
});

const set = publicProcedure.input(setSecretSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { secrets } = repos;

  await secrets.set(input);
});

const remove = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { runtime } = ctx;
    const { repos } = runtime;
    const { secrets } = repos;

    await secrets.remove(input.id);
  });

const secretsRouter = router({
  find,
  set,
  remove,
});

export { secretsRouter };
