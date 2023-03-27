import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

export default {
  input: 'src/index.ts',
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript({ module: 'ESNext' }), json()],
};
