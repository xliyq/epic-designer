import alias from '@rollup/plugin-alias';
import vue from '@vitejs/plugin-vue';
import postcss from 'rollup-plugin-postcss';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['./src/index'],
  externals: ['vue', 'naive-ui', '@ies/designer'],
  failOnWarn: false,
  hooks: {
    'rollup:options': function (ctx, options) {
      if (!options.plugins) options.plugins = [];

      options.plugins.push(
        vue({
          include: [/\.vue$/],
          script: {
            defineModel: true,
          },
          template: {
            compilerOptions: {},
          },
        }),
        postcss({
          extensions: ['.css', '.less'],
          inject: true,
          use: ['less'],
        }),
        alias({
          entries: [
            { find: '@ies/base-ui', replacement: '@ies/designer' },
            { find: '@ies/core', replacement: '@ies/designer' },
            { find: '@ies/hooks', replacement: '@ies/designer' },
            { find: '@ies/manager', replacement: '@ies/designer' },
            { find: '@ies/panel-ui', replacement: '@ies/designer' },
            { find: '@ies/types', replacement: '@ies/designer' },
            { find: '@ies/utils', replacement: '@ies/designer' },
          ],
        }),
      );
    },
  },
  rollup: {
    emitCJS: true,
    esbuild: {
      loaders: {
        '.ts': 'ts',
        '.vue': 'ts',
      },
      target: 'es2018',
    },
  },
});
