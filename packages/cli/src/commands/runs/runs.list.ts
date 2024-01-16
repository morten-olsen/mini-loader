import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const list = new Command('list');

list
  .alias('ls')
  .description('Find a run')
  .argument('[load-id]', 'Load ID')
  .action(async (loadId) => {
    const { step, output, client } = getApi(list);
    const runs = await step('Getting runs', async () => {
      return await client.runs.find.query({ loadId });
    });
    await output(runs);
  });

export { list };
