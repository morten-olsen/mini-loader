import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { RootRouter, rootRouter } from '../router/router.js';
import { createContext } from '../router/router.utils.js';
import { Runtime } from '../runtime/runtime.js';
import { gateway } from '../gateway/gateway.js';
import { createRequire } from 'module';
import { readFile } from 'fs/promises';

const require = createRequire(import.meta.url);

const createServer = async (runtime: Runtime) => {
  const pkgLocation = require.resolve('#pkg');
  const pkg = JSON.parse(await readFile(pkgLocation, 'utf-8'));

  const server = fastify({
    maxParamLength: 10000,
    bodyLimit: 30 * 1024 * 1024,
    logger: {
      level: 'warn',
    },
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
    return { authorized, status: 'ok', version: pkg.version };
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

  server.register(gateway, {
    runtime,
  });

  server.addHook('onError', async (request, reply, error) => {
    console.error(error);
  });
  await server.ready();

  return server;
};

export { createServer };
