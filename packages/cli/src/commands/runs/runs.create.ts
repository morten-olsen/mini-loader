import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';

const create = new Command('create');

create
  .description('Create a new run')
  .argument('load-id', 'Load ID')
  .action(async (loadId) => {
    const context = new Context();
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    await step('Creating run', async () => {
      await client.runs.create.mutate({ loadId });
    });
  });

export { create };
