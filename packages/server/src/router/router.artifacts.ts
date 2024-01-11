import { z } from 'zod';
import { findArtifactsSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const find = publicProcedure.input(findArtifactsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { artifacts } = repos;

  const result = await artifacts.find(input);
  return result;
});

const prepareRemove = publicProcedure.input(findArtifactsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { artifacts } = repos;

  await artifacts.prepareRemove(input);
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
    const { artifacts } = repos;

    await artifacts.remove(input.hash, input.ids);
  });

const artifactsRouter = router({
  find,
  remove,
  prepareRemove,
});

export { artifactsRouter };
