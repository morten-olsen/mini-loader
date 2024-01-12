import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const sharedData = JSON.parse(await readFile(join(process.cwd(), 'scripts/shared-data.json')));

const version = process.argv[2];
if (!version) {
  throw new Error('Version is required');
}

const packages = await findWorkspacePackages(process.cwd());

for (const { manifest, dir } of packages) {
  console.log(dir, version);
  for (let [key, value] of Object.entries(sharedData || {})) {
    manifest[key] = value;
  }
  manifest.version = version;
  await writeFile(join(dir, 'package.json'), JSON.stringify(manifest, null, 2));
}
