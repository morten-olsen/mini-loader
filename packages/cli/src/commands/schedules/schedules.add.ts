import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const add = new Command('add');

add
  .description('Add schedule')
  .argument('<load-id>', 'Load ID')
  .argument('<cron>', 'Cron')
  .option('-n, --name <name>', 'Name')
  .action(async (loadId, cron) => {
    const config = new Config();
    const context = new Context(config.context);
    const { name } = add.opts();
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const id = await step('Adding schedule', async () => {
      return await client.schedules.add.mutate({
        name,
        load: loadId,
        cron,
      });
    });

    console.log(`Schedule added with ID ${id}`);
  });

export { add };
