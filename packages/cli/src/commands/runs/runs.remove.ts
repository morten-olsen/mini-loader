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
  .description('List logs')
  .option('-l, --load-id <loadId>', 'Load ID')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { loadId, offset, limit } = remove.opts();
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const response = await step('Preparing to delete', async () => {
      return await client.runs.prepareRemove.query({
        loadId,
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
        message: `Are you sure you want to delete ${response.ids.length} logs?`,
      },
    ]);

    if (!confirm) {
      return;
    }

    await step('Deleting artifacts', async () => {
      await client.runs.remove.mutate(response);
    });
  });

export { remove };
