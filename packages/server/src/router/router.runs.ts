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

const remove = publicProcedure.input(findRunsSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { runs } = repos;
  await runs.remove(input);
});

const runsRouter = router({
  create,
  find,
  remove,
});

export { runsRouter };
