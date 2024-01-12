import { rollup } from 'rollup';
import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import auto from '@rollup/plugin-auto-install';
import { resolve } from 'path';

const fix = <T extends { default: any }>(f: T) => f as T['default'];

type BundleOptions = {
  entry: string;
  autoInstall?: boolean;
};

const bundle = async ({ entry, autoInstall }: BundleOptions) => {
  const entryFile = resolve(entry);
  const codeBundler = await rollup({
    plugins: [
      fix(json)(),
      fix(sucrase)({
        transforms: ['typescript', 'jsx'],
      }),
      ...[autoInstall ? fix(auto) : []],
      nodeResolve({ preferBuiltins: true, extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
      fix(commonjs)({ include: /node_modules/ }),
    ],
    input: entryFile,
  });
  const { output: codeOutput } = await codeBundler.generate({
    format: 'cjs',
  });
  if (codeOutput.length > 1) {
    throw new Error('Multiple outputs are not supported');
  }
  const [codeResult] = codeOutput;

  const { code } = codeResult;
  return code;
};

export { bundle };
