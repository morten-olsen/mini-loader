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
  .option('-r, --run-id <runId>', 'Run ID')
  .option('-l, --load-id <loadId>', 'Load ID')
  .option('--severities <severities...>', 'Severities')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .option('-s, --sort <order>', 'Sort', 'desc')
  .action(async () => {
    const { step, client } = getApi(remove);
    const { runId, loadId, severities, offset, limit, order } = remove.opts();
    const response = await step('Preparing to delete', async () => {
      return await client.logs.prepareRemove.query({
        runId,
        loadId,
        severities,
        offset: toInt(offset),
        limit: toInt(limit),
        order,
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

    await step('Deleting logs', async () => {
      await client.logs.remove.mutate(response);
    });
  });

export { remove };
