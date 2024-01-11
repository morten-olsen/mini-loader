import { Command } from 'commander';
import { list } from './logs.list.js';

const logs = new Command('logs');
logs.addCommand(list);

export { logs };
