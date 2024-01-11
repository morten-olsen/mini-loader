import { Command } from 'commander';
import { push } from './loads.push.js';
import { list } from './loads.list.js';
import { local } from './loads.local.js';

const loads = new Command('loads');

loads.addCommand(push);
loads.addCommand(list);
loads.addCommand(local);

export { loads };
