import { Command } from 'commander';
import { list } from './artifacts.list.js';

const artifacts = new Command('artifacts');
artifacts.addCommand(list);

export { artifacts };
