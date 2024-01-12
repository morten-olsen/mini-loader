import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const create = new Command('create');

create
  .description('Create a new run')
  .argument('load-id', 'Load ID')
  .action(async (loadId) => {
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    await step('Creating run', async () => {
      await client.runs.create.mutate({ loadId });
    });
  });

export { create };
