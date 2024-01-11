import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { Runtime } from '@morten-olsen/mini-loader-server';
import type { RootRouter } from '@morten-olsen/mini-loader-server';

const createClient = () => {
  return createTRPCProxyClient<RootRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: 'http://localhost:4500',
      }),
    ],
  });
};

type Client = ReturnType<typeof createClient>;

export type { Client, Runtime };
export { createClient };
