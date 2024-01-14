import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { Runtime } from '@morten-olsen/mini-loader-server';
import type { RootRouter } from '@morten-olsen/mini-loader-server';
import pkg from '../../package.json';
import { Context } from '../context/context.js';

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
