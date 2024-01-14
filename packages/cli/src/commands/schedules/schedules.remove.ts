import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import inquirer from 'inquirer';
import { Config } from '../../config/config.js';

const remove = new Command('remove');

const toInt = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return parseInt(value, 10);
};

remove
  .alias('ls')
  .description('LRemove schedules')
  .option('-i, --ids <ids...>', 'Load IDs')
  .option('-l, --load-ids <loadIds...>', 'Load IDs')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { ids, loadIds, offset, limit } = remove.opts();
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const response = await step('Preparing to delete', async () => {
      return await client.schedules.prepareRemove.query({
        ids,
        loadIds,
        offset: toInt(offset),
        limit: toInt(limit),
      });
    });

    if (!response.ids.length) {
      console.log('No logs to delete');
      return;
    }
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete ${response.ids.length} schedules?`,
      },
    ]);

    if (!confirm) {
      return;
    }

    await step('Deleting artifacts', async () => {
      await client.artifacts.remove.mutate(response);
    });
  });

export { remove };
