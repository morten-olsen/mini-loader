import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const list = new Command('list');

list
  .alias('ls')
  .description('List loads')
  .action(async () => {
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const loads = await step('Getting data', async () => {
      return await client.loads.find.query({});
    });
    console.table(loads);
  });

export { list };
