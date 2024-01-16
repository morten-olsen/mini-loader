import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const list = new Command('list');

const toInt = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return parseInt(value, 10);
};

list
  .alias('ls')
  .description('List secrets')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { step, client } = getApi(list);
    const { offset, limit } = list.opts();
    const secrets = await step('Getting secrets', async () => {
      return await client.secrets.find.query({
        offset: toInt(offset),
        limit: toInt(limit),
      });
    });
    console.table(secrets);
  });

export { list };
