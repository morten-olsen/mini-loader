import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';

const remove = new Command('remove');

remove
  .alias('rm')
  .argument('<id>')
  .action(async (id) => {
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    await step('Removing', async () => {
      await client.secrets.remove.mutate({
        id,
      });
    });
  });

export { remove };
