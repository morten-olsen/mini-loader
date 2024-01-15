import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

const ENV_PREFIX = 'ML_S_';

const readSecrets = async () => {
  let secretLocation = join(process.cwd(), '.secrets');

  let secrets: Record<string, string> = {};

  if (existsSync(secretLocation)) {
    const content = await readFile(secretLocation, 'utf-8');
    secrets = dotenv.parse(content);
  }
  for (const key in process.env) {
    if (key.startsWith(ENV_PREFIX)) {
      secrets[key.replace(ENV_PREFIX, '')] = process.env[key]!;
    }
  }
  return secrets;
};

export { readSecrets };
