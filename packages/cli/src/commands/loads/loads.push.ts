import { Command } from 'commander';
import { resolve } from 'path';
import { bundle } from '../../bundler/bundler.js';
import { getApi } from '../../utils/command.js';

const push = new Command('push');

push
  .argument('script')
  .option('-i, --id <id>', 'Load id')
  .option('-n, --name <name>')
  .option('-r, --run', 'Run the load')
  .option('-ai, --auto-install', 'Auto install dependencies', false)
  .action(async (script) => {
    const opts = push.opts();
    const { step, log, client } = getApi(push);
    const location = resolve(script);
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
    await log(`created load with id ${id}`);
    if (opts.run) {
      const runId = await step('Creating run', async () => {
        return await client.runs.create.mutate({ loadId: id });
      });
      await log(`created run with id ${runId}`);
    }
  });

export { push };
