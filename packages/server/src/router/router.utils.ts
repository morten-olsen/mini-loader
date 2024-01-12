import { initTRPC } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import superjson from 'superjson';
import { Runtime } from '../runtime/runtime.js';

type ContextOptions = {
  runtime: Runtime;
};

const createContext = async ({ runtime }: ContextOptions) => {
  return async ({ req }: CreateFastifyContextOptions) => {
    const { authorization } = req.headers;
    const { auth } = runtime;
    if (!authorization) {
      throw new Error('No authorization header');
    }
    const [, token] = authorization.split(' ');
    await auth.validateToken(token);
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
