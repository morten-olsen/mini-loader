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
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { offset, limit } = list.opts();
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    const secrets = await step('Getting secrets', async () => {
      return await client.secrets.find.query({
        offset: toInt(offset),
        limit: toInt(limit),
      });
    });
    console.table(secrets);
  });

export { list };
