import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const list = new Command('list');

list
  .alias('ls')
  .description('Find a run')
  .argument('[load-id]', 'Load ID')
  .action(async (loadId) => {
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const runs = await step('Getting runs', async () => {
      return await client.runs.find.query({ loadId });
    });
    console.table(runs);
  });

export { list };
