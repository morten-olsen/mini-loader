import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';

const create = new Command('create');

create
  .description('Create a new run')
  .argument('load-id', 'Load ID')
  .action(async (loadId) => {
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    await step('Creating run', async () => {
      await client.runs.create.mutate({ loadId });
    });
  });

export { create };
