import { program, Command } from 'commander';
import { Runtime } from './runtime/runtime.js';
import { createServer } from './server/server.js';

const start = new Command('start');
start.action(async () => {
  const port = 4500;
  const runtime = await Runtime.create();
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
  const token = await runtime.auth.createToken({});
  console.log(token);
});

program.addCommand(start);
program.addCommand(createToken);

await program.parseAsync(process.argv);

export type { Runtime } from './runtime/runtime.js';
export type { RootRouter } from './router/router.js';
