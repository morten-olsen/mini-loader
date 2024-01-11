import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';

const set = new Command('set');

set
  .argument('<id>')
  .argument('[value]')
  .action(async (id, value) => {
    const client = await step('Connecting to server', async () => {
      return createClient();
    });
    await step('Setting secret', async () => {
      await client.secrets.set.mutate({
        id,
        value,
      });
    });
  });

export { set };
