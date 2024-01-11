import { Command } from 'commander';
import { createClient } from '../../client/client.js';

const list = new Command('list');

list
  .alias('ls')
  .description('List loads')
  .action(async () => {
    const client = await createClient();
    const loads = await client.loads.find.query({});
    console.table(loads);
  });

export { list };
