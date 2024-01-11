import { findLoadsSchema, setLoadSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const set = publicProcedure.input(setLoadSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { loads } = repos;

  const load = await loads.set(input);
  return load;
});

const find = publicProcedure.input(findLoadsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { loads } = repos;

  const load = await loads.find(input);
  return load;
});

const loadsRouter = router({
  set,
  find,
});

export { loadsRouter };
