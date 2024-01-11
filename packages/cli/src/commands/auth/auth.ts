import { Command } from 'commander';
import { login } from './auth.login.js';

const auth = new Command('auth');
auth.addCommand(login);

export { auth };
