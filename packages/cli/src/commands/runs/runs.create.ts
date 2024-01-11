import { Command } from 'commander';
import { createClient } from '../../client/client.js';

const create = new Command('create');

create
  .description('Create a new run')
  .argument('load-id', 'Load ID')
  .action(async (loadId) => {
    const client = await createClient();
    await client.runs.create.mutate({ loadId });
  });

export { create };
