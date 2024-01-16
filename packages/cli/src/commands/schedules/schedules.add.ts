import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const add = new Command('add');

add
  .description('Add schedule')
  .argument('<load-id>', 'Load ID')
  .argument('<cron>', 'Cron')
  .option('-n, --name <name>', 'Name')
  .action(async (loadId, cron) => {
    const { step, client } = getApi(add);
    const { name } = add.opts();
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
