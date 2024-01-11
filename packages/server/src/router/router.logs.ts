import { findLogsSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const find = publicProcedure.input(findLogsSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { logs } = repos;

  const result = await logs.find(input);
  return result;
});

const remove = publicProcedure.input(findLogsSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { logs } = repos;

  await logs.remove(input);
});

const logsRouter = router({
  find,
  remove,
});

export { logsRouter };
