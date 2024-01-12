import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

const path = process.env.INPUT_PATH;
const hasInput = path ? existsSync(path) : false;

const get = () => {
  if (!hasInput || !path) {
    return undefined;
  }
  return readFile(path, 'utf-8');
};

const input = {
  get,
};

export { input };
