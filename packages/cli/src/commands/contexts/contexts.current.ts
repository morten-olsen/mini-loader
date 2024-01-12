import { Command } from 'commander';
import { Config } from '../../config/config.js';

const current = new Command('current');
current.action(async () => {
  const config = new Config();
  console.log(config.context);
});

export { current };
