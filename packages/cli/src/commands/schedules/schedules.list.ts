import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const list = new Command('list');

const toInt = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return parseInt(value, 10);
};

list
  .alias('ls')
  .description('List schedules')
  .option('-l, --load-ids <loadIds...>', 'Load ID')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { loadIds, offset, limit } = list.opts();
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    const schedules = await step('Getting schedules', async () => {
      return await client.schedules.find.query({
        loadIds,
        offset: toInt(offset),
        limit: toInt(limit),
      });
    });
    console.table(schedules);
  });

export { list };
