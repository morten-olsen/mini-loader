import { Command } from 'commander';
import inquirer from 'inquirer';
import { getApi } from '../../utils/command.js';

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
    const { step, client } = getApi(remove);
    const { loadId, offset, limit } = remove.opts();
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
