import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { createRequire } from 'module';
import type { Runtime } from '@morten-olsen/mini-loader-server';
import type { RootRouter } from '@morten-olsen/mini-loader-server';
import { Context } from '../context/context.js';
import { readFile } from 'fs/promises';

const require = createRequire(import.meta.url);

const pkg = JSON.parse(await readFile(require.resolve('#pkg'), 'utf-8'));
const createClient = (context: Context) => {
  if (!context.host || !context.token) {
    throw new Error('Not signed in');
  }
  const client = createTRPCProxyClient<RootRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${context.host}/trpc`,
        headers: {
          'x-version': pkg.version,
          authorization: `Bearer ${context.token}`,
        },
      }),
    ],
  });

  return client;
};

type Client = ReturnType<typeof createClient>;

export type { Client, Runtime };
export { createClient };
