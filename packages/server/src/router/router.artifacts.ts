import { findArtifactsSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const find = publicProcedure.input(findArtifactsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { artifacts } = repos;

  const result = await artifacts.find(input);
  return result;
});

const remove = publicProcedure.input(findArtifactsSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { artifacts } = repos;

  await artifacts.remove(input);
});

const artifactsRouter = router({
  find,
  remove,
});

export { artifactsRouter };
