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
  .description('List schedules')
  .option('-l, --load-ids <loadIds...>', 'Load ID')
  .option('-o, --offset <offset>', 'Offset')
  .option('-a, --limit <limit>', 'Limit', '1000')
  .action(async () => {
    const { step, output, client } = getApi(list);
    const { loadIds, offset, limit } = list.opts();
    const schedules = await step('Getting schedules', async () => {
      return await client.schedules.find.query({
        loadIds,
        offset: toInt(offset),
        limit: toInt(limit),
      });
    });
    output(schedules);
  });

export { list };
