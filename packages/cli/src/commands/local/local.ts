import { Command } from 'commander';
import { run } from './local.run.js';

const local = new Command('local');

local.addCommand(run);

export { local };
