import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import babel from '@rollup/plugin-babel';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    postcss({
      extensions: ['.css'],
    }),
    url(),
    svgr(),
    babel({babelHelpers: 'bundled'}),
    json(),
    resolve(),
    commonjs(),
  ],
};
