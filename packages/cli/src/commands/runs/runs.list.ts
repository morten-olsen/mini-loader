import { Command } from 'commander';
import { createClient } from '../../client/client.js';

const list = new Command('create');

list
  .alias('ls')
  .description('Find a run')
  .argument('[load-id]', 'Load ID')
  .action(async (loadId) => {
    const client = await createClient();
    const runs = await client.runs.find.query({ loadId });
    console.table(runs);
  });

export { list };
