import { Command } from 'commander';
import inquerer from 'inquirer';

const login = new Command('login');

login.description('Login to your account');
login.action(async () => {
  const { host, token } = await inquerer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Enter the host of your server',
      default: 'http://localhost:4500',
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your token',
    },
  ]);

  console.log(host, token);
});

export { login };
