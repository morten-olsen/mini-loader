import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { rootRouter } from './router/router.js';
import { createContext } from './router/router.utils.js';

const server = createHTTPServer({
  router: rootRouter,
  createContext: await createContext(),
});

server.listen(4500);
console.log('Started');

export type { Runtime } from './runtime/runtime.js';
export type { RootRouter } from './router/router.js';
