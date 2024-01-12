import { Command } from 'commander';
import { Config } from '../../config/config.js';

const use = new Command('use');

use.argument('<name>').action(async (name) => {
  const config = new Config();
  await config.setContext(name);
});

export { use };
