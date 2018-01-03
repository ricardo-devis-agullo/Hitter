import typescript from 'rollup-plugin-typescript';

export default {
  entry: './src/main.ts',
  output: {
    file: './dist/bundle.js',
    format: 'iife',
    name: 'Hitter',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
};
