import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const version = process.argv[2];
if (!version) {
  throw new Error('Version is required');
}

const packages = await findWorkspacePackages(process.cwd());

for (const { manifest, dir } of packages) {
  console.log(dir, version);
  manifest.version = version;
  await writeFile(join(dir, 'package.json'), JSON.stringify(manifest, null, 2));
}
