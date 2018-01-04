import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default {
  entry: './src/main.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
};
