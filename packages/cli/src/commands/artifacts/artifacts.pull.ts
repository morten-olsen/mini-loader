import { Command } from 'commander';
import { dirname, resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getApi } from '../../utils/command.js';

const pull = new Command('pull');

pull
  .description('Download artifact')
  .argument('<artifact-id>', 'Artifact ID')
  .argument('<file>', 'File to save')
  .action(async (id, file) => {
    const { step, client } = getApi(pull);
    const target = resolve(file);
    const artifact = await step('Getting artifact', async () => {
      const result = await client.artifacts.get.query(id);
      if (!result) {
        throw new Error('Artifact not found');
      }
      return result;
    });
    await mkdir(dirname(target), { recursive: true });
    const data = Buffer.from(artifact.data, 'base64').toString('utf-8');
    await writeFile(target, data, 'utf-8');
  });

export { pull };
