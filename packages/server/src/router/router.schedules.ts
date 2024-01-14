import { z } from 'zod';
import { addScheduleSchema, findSchedulesSchema } from '../repos/repos.js';
import { publicProcedure, router } from './router.utils.js';

const add = publicProcedure.input(addScheduleSchema).mutation(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { schedules } = repos;

  const result = await schedules.add(input);
  return result;
});

const find = publicProcedure.input(findSchedulesSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { schedules } = repos;

  const result = await schedules.find(input);
  return result;
});

const prepareRemove = publicProcedure.input(findSchedulesSchema).query(async ({ input, ctx }) => {
  const { runtime } = ctx;
  const { repos } = runtime;
  const { schedules } = repos;

  return await schedules.prepareRemove(input);
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

const schedulesRouter = router({
  add,
  find,
  remove,
  prepareRemove,
});

export { schedulesRouter };
