import { z } from 'zod';
import { createRunSchema, findRunsSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const create = publicProcedure.input(createRunSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { runs } = repos;
  const id = await runs.create(input);
  return id;
});

const find = publicProcedure.input(findRunsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { runs } = repos;
  const results = await runs.find(input);
  return results;
});

const prepareRemove = publicProcedure.input(findRunsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { runs } = repos;
  return await runs.prepareRemove(input);
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
    const { runs } = repos;
    for (const id of input.ids) {
      const instance = runtime.runner.getInstance(id);
      if (instance) {
        await instance.run?.teardown();
      }
    }
    await runs.remove(input.hash, input.ids);
  });

const terminate = publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { runner } = runtime;
  const instance = runner.getInstance(input);
  if (!instance || !instance.run) {
    return;
  }
  await instance.run.teardown();
});

const runsRouter = router({
  create,
  find,
  remove,
  prepareRemove,
  terminate,
});

export { runsRouter };
