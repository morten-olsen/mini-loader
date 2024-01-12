import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { RootRouter, rootRouter } from '../router/router.js';
import { createContext } from '../router/router.utils.js';
import { Runtime } from '../runtime/runtime.js';

const createServer = async (runtime: Runtime) => {
  const server = fastify({});
  server.get('/', async () => {
    return { hello: 'world' };
  });

  server.get('/health', async (req) => {
    let authorized = false;
    try {
      const { authorization } = req.headers;
      if (authorization) {
        const [, token] = authorization.split(' ');
        await runtime.auth.validateToken(token);
        authorized = true;
      }
    } catch (error) {}
    return { authorized, status: 'ok' };
  });

  server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: rootRouter,
      createContext: await createContext({ runtime }),
      onError({ error }) {
        console.error(error);
      },
    } satisfies FastifyTRPCPluginOptions<RootRouter>['trpcOptions'],
  });
  await server.ready();

  return server;
};

export { createServer };
