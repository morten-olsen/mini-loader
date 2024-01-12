import { z } from 'zod';
import { findLogsSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const find = publicProcedure.input(findLogsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { logs } = repos;

  const result = await logs.find(input);
  return result;
});

const prepareRemove = publicProcedure.input(findLogsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { logs } = repos;

  return await logs.prepareRemove(input);
});

const remove = publicProcedure
  .input(
    z.object({
      hash: z.string(),
      ids: z.array(z.string()),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { runtime } = ctx;
    const { repos } = runtime;
    const { logs } = repos;

    await logs.remove(input.hash, input.ids);
  });

const logsRouter = router({
  find,
  remove,
  prepareRemove,
});

export { logsRouter };
