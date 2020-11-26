require('dotenv').config()

import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'

const mode = process.env.NODE_ENV || 'development'
const dev = mode === 'development'

const onwarn = (warning, onwarn) =>
  (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  (warning.code !== 'THIS_IS_UNDEFINED' && onwarn(warning))

export default {
  client: {
    input: config.client.input().replace(/\.js$/, '.ts'),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.PORT': JSON.stringify(process.env.PORT),
        'process.env.EMAIL_ADDRESS': JSON.stringify(process.env.EMAIL_ADDRESS),
        'process.env.PAYPAL_ID': JSON.stringify(process.env.PAYPAL_ID),
      }),
      svelte({
        dev,
        hydratable: true,
        preprocess: sveltePreprocess(),
        emitCss: true,
      }),
      typescript({ sourceMap: dev }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      !dev &&
        terser({
          module: true,
        })
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, '.ts') },
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      svelte({
        generate: 'ssr',
        hydratable: true,
        preprocess: sveltePreprocess(),
        dev,
      }),
      typescript({ sourceMap: !!dev }),
      resolve({
        dedupe: ['svelte'],
      }),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
}
