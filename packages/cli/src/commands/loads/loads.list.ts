import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';

const list = new Command('list');

list
  .alias('ls')
  .description('List loads')
  .action(async () => {
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    const loads = step('Getting data', async () => {
      await client.loads.find.query({});
    });
    console.table(loads);
  });

export { list };
