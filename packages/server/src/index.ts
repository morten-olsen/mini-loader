import { program, Command } from 'commander';
import { Runtime } from './runtime/runtime.js';
import { createServer } from './server/server.js';

const start = new Command('start');
start.action(async () => {
  const port = 4500;
  const runtime = await Runtime.create();
  await runtime.scheduler.start();
  const server = await createServer(runtime);
  await server.listen({
    port,
    host: '0.0.0.0',
  });

  console.log(`Server listening on port ${port}`);
});

const createToken = new Command('create-token');
createToken.action(async () => {
  const runtime = await Runtime.create();
  const token = await runtime.auth.createToken({
    policy: {
      '*:*': ['*'],
    },
  });
  console.log(token);
});

program.addCommand(start);
program.addCommand(createToken);

await program.parseAsync(process.argv);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

export type { Runtime } from './runtime/runtime.js';
export type { RootRouter } from './router/router.js';
