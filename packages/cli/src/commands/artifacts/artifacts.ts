import { Command } from 'commander';
import { list } from './artifacts.list.js';
import { remove } from './artifacts.remove.js';
import { pull } from './artifacts.pull.js';

const artifacts = new Command('artifacts');
artifacts.addCommand(list);
artifacts.addCommand(remove);
artifacts.addCommand(pull);

export { artifacts };
