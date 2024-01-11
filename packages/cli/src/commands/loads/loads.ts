import { Command } from 'commander';
import { push } from './loads.push.js';
import { list } from './loads.list.js';

const loads = new Command('loads');

loads.addCommand(push);
loads.addCommand(list);

export { loads };
