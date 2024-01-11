import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';

const list = new Command('list');

const toInt = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return parseInt(value, 10);
};

list
  .alias('ls')
  .description('List logs')
  .option('-r, --run-id <runId>', 'Run ID')
  .option('-l, --load-id <loadId>', 'Load ID')
  .option('--severities <severities...>', 'Severities')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .option('-s, --sort <order>', 'Sort', 'desc')
  .action(async () => {
    const { runId, loadId, severities, offset, limit, order } = list.opts();
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    const logs = await step('Getting logs', async () => {
      return await client.logs.find.query({
        runId,
        loadId,
        severities,
        offset: toInt(offset),
        limit: toInt(limit),
        order,
      });
    });
    console.table(logs.reverse());
  });

export { list };
