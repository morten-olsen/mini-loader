import { Command } from 'commander';
import { resolve } from 'path';
import { createClient } from '../../client/client.js';
import { bundle } from '../../bundler/bundler.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const push = new Command('push');

push
  .argument('script')
  .option('-i, --id <id>', 'Load id')
  .option('-n, --name <name>')
  .option('-r, --run', 'Run the load')
  .option('-ai, --auto-install', 'Auto install dependencies', false)
  .action(async (script) => {
    const opts = push.opts();
    const config = new Config();
    const context = new Context(config.context);
    const location = resolve(script);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const code = await step('Bundling', async () => {
      return await bundle({ entry: location, autoInstall: opts.autoInstall });
    });
    const id = await step(`Creating load ${(code.length / 1024).toFixed(0)}`, async () => {
      return await client.loads.set.mutate({
        id: opts.id,
        name: opts.name,
        script: code,
      });
    });
    console.log('created load with id', id);
    if (opts.run) {
      const runId = await step('Creating run', async () => {
        return await client.runs.create.mutate({ loadId: id });
      });
      console.log('created run with id', runId);
    }
  });

export { push };
