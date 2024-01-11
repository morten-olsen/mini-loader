import { Command } from 'commander';
import { resolve } from 'path';
import { createClient } from '../../client/client.js';
import { bundle } from '../../bundler/bundler.js';

const push = new Command('push');

push
  .argument('script')
  .option('-i, --id <id>', 'Load id')
  .option('-n, --name <name>')
  .option('-r, --run', 'Run the load')
  .option('-ai, --auto-install', 'Auto install dependencies', false)
  .action(async (script) => {
    const opts = push.opts();
    const location = resolve(script);
    const client = await createClient();
    const code = await bundle({ entry: location, autoInstall: opts.autoInstall });
    const id = await client.loads.set.mutate({
      id: opts.id,
      name: opts.name,
      script: code,
    });
    console.log('created load with id', id);
    if (opts.run) {
      client.runs.create.mutate({ loadId: id });
    }
  });

export { push };
