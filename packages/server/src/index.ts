import 'reflect-metadata';
import { Command } from 'commander';
import { Runtime } from './runtime/runtime.js';
import { createServer } from './server/server.js';
import { ContainerInstance } from 'typedi';

const createServerCli = (container: ContainerInstance) => {
  const program = new Command();

  const start = new Command('start');
  start.action(async () => {
    const port = 4500;
    const runtime = container.get(Runtime);
    await runtime.scheduler.start();
    const server = await createServer(container);
    await server.listen({
      port,
      host: '0.0.0.0',
    });

    console.log(`Server listening on port ${port}`);
  });

  const createToken = new Command('create-token');
  createToken.action(async () => {
    const runtime = container.get(Runtime);
    const token = await runtime.auth.createToken({
      policy: {
        '*:*': ['*'],
      },
    });
    console.log(token);
  });

  program.addCommand(start);
  program.addCommand(createToken);
  return program;
};

export { createServerCli, createServer, Runtime };
export { Config } from './config/config.js';
export type { RootRouter } from './router/router.js';
