import { Command } from 'commander';
import inquerer from 'inquirer';
import { Context } from '../../context/context.js';
import { step } from '../../utils/step.js';

const login = new Command('login');

login.description('Login to your account');
login.action(async () => {
  const context = new Context();
  const { host, token } = await inquerer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Enter the host of your server',
      default: context.host ?? 'http://localhost:4500',
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your token',
    },
  ]);

  const healthResponse = await step('Getting auth status', async () => {
    return await fetch(`${host}/health`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  });

  if (!healthResponse.ok) {
    throw new Error('Invalid token');
  }
  const health = await healthResponse.json();
  if (!health.authorized) {
    throw new Error('Invalid token');
  }

  await step('Saving login', async () => {
    await context.saveLogin(host, token);
  });
});

export { login };
