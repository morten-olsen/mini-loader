import { Command } from 'commander';
import inquerer from 'inquirer';
import { getApi } from '../../utils/command.js';

const login = new Command('login');

login.description('Login to your account');
login.option('--host <host>', 'The host of your server');
login.option('--token <token>', 'The token of your account');
login.action(async () => {
  let { host, token } = login.opts();
  const { step, context } = getApi(login);
  if (!host) {
    const answers = await inquerer.prompt([
      {
        type: 'input',
        name: 'host',
        message: 'Enter the host of your server',
        default: context.host || 'http://localhost:4500',
      },
    ]);
    host = answers.host;
  }

  if (!token) {
    const answers = await inquerer.prompt([
      {
        type: 'password',
        name: 'token',
        message: 'Enter your token',
      },
    ]);
    token = answers.token;
  }

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
