import { initTRPC } from '@trpc/server';
import { resolve } from 'path';
import { mkdir } from 'fs/promises';
import superjson from 'superjson';
import { Runtime } from '../runtime/runtime.js';

const createContext = async () => {
  await mkdir(resolve(process.cwd(), 'data'), { recursive: true });
  const runtime = new Runtime({
    database: {
      client: 'sqlite3',
      connection: {
        filename: resolve(process.cwd(), 'data', 'database.sqlite'),
      },
      useNullAsDefault: true,
    },
  });

  return async () => {
    return {
      runtime,
    };
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const { router, procedure: publicProcedure } = initTRPC.context<Context>().create({
  transformer: superjson,
});

export { createContext, router, publicProcedure };
