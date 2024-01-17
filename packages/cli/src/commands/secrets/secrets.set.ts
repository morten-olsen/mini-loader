import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const set = new Command('set');

set
  .argument('<id>')
  .argument('[value]')
  .action(async (id, value) => {
    const { step, client } = getApi(set);
    await step('Setting secret', async () => {
      await client.secrets.set.mutate({
        id,
        value,
      });
    });
  });

export { set };
