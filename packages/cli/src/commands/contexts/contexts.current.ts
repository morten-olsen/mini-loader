import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const current = new Command('current');
current.action(async () => {
  const { config } = getApi(current);
  console.log(config.context);
});

export { current };
