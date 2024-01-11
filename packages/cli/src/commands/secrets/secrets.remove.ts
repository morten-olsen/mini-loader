import { Command } from 'commander';
import { createClient } from '../../client/client.js';

const remove = new Command('remove');

remove
  .alias('rm')
  .argument('<id>')
  .action(async (id) => {
    const client = await createClient();
    await client.secrets.remove.mutate({
      id,
    });
  });

export { remove };
