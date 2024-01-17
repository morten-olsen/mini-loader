import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const use = new Command('use');

use.argument('<name>').action(async (name) => {
  const { config } = getApi(use);
  await config.setContext(name);
});

export { use };
