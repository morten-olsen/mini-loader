import { Command } from 'commander';
import { list } from './secrets.list.js';
import { set } from './secrets.set.js';
import { remove } from './secrets.remove.js';

const secrets = new Command('secrets');
secrets.addCommand(list);
secrets.addCommand(set);
secrets.addCommand(remove);

export { secrets };
