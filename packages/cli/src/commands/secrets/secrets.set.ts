import { Command } from 'commander';
import { createClient } from '../../client/client.js';

const set = new Command('set');

set
  .argument('<id>')
  .argument('[value]')
  .action(async (id, value) => {
    const client = await createClient();
    await client.secrets.set.mutate({
      id,
      value,
    });
  });

export { set };
