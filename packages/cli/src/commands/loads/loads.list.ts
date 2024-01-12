import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';

const list = new Command('list');

list
  .alias('ls')
  .description('List loads')
  .action(async () => {
    const context = new Context();
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const loads = await step('Getting data', async () => {
      return await client.loads.find.query({});
    });
    console.table(loads);
  });

export { list };
