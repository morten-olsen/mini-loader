import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';

const list = new Command('create');

list
  .alias('ls')
  .description('Find a run')
  .argument('[load-id]', 'Load ID')
  .action(async (loadId) => {
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    const runs = await step('Getting runs', async () => {
      return await client.runs.find.query({ loadId });
    });
    console.table(runs);
  });

export { list };
