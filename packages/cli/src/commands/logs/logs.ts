import { Command } from 'commander';
import { list } from './logs.list.js';
import { remove } from './logs.remove.js';

const logs = new Command('logs');
logs.addCommand(list);
logs.addCommand(remove);

export { logs };
