import { Command } from 'commander';
import { createClient } from '../../client/client.js';

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
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { runId, loadId, offset, limit } = list.opts();
    const client = await createClient();
    const artifacts = await client.artifacts.find.query({
      runId,
      loadId,
      offset: toInt(offset),
      limit: toInt(limit),
    });
    console.table(artifacts);
  });

export { list };
