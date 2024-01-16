import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const create = new Command('create');

create
  .description('Create a new run')
  .argument('load-id', 'Load ID')
  .action(async (loadId) => {
    const { step, client } = getApi(create);
    await step('Creating run', async () => {
      await client.runs.create.mutate({ loadId });
    });
  });

export { create };
