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
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { offset, limit } = list.opts();
    const client = await createClient();
    const secrets = await client.secrets.find.query({
      offset: toInt(offset),
      limit: toInt(limit),
    });
    console.table(secrets);
  });

export { list };
