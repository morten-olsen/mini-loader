import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const list = new Command('list');

list
  .alias('ls')
  .description('List loads')
  .action(async () => {
    const { output, step, client } = getApi(list);
    const loads = await step('Getting data', async () => {
      return await client.loads.find.query({});
    });
    await output(loads);
  });

export { list };
