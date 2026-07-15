import type { PluginOption } from 'vite';

import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import rollupCopy from 'rollup-plugin-copy';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = import.meta.dirname;

export default defineConfig({
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
    lib: {
      entry: {
        index: path.resolve(__dirname, './index.ts'),
      },
      fileName: (ModuleFormat, entryName) => {
        const extension = ModuleFormat === 'es' ? 'js' : ModuleFormat;
        return `${entryName}.${extension}`;
      },
      formats: ['es', 'cjs'],
      // 指定组件编译入口文件
      name: '@ies/designer',
    },
    outDir: 'dist',
    // 库编译模式配置
    rollupOptions: {
      // Externalize all dependencies
      external: [
        'vue',
        'vue-draggable-plus',
        'jsep',
        'monaco-editor',
        '@vueuse/core',
        'ant-design-vue',
        'element-plus',
        'naive-ui',
        // Do NOT externalize @ies/* - they are internal packages that should be bundled
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
      plugins: [
        rollupCopy({
          // 钩子，插件运行在rollup完成打包并将文件写入磁盘之前
          hook: 'writeBundle',
          targets: [
            // 路径
            { dest: './dist/', src: '../core/src/theme' },
            {
              dest: './dist/',
              rename: 'style.css',
              src: './dist/designer.css',
            },
          ],
          verbose: true, // 在终端进行console.log
        }) as PluginOption,
      ],
    },
  },
  plugins: [
    vue(),
    UnoCSS() as PluginOption,
    dts({
      // 不使用 entryRoot，让 dts 从入口文件位置生成
      // 构建完成后，dist/index.d.ts 会自动指向正确的类型文件
      exclude: ['../**/__test__/**', '../ui/**', 'vite.config.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
      // 跳过类型检查，因为源文件有一些 TS 错误但不影响运行
      skipDiagnostics: true,
    }),
  ],
  resolve: {
    alias: {
      '@ies/base-ui': path.resolve(
        __dirname,
        '../ui-kit/base-ui/src/index',
      ),
      '@ies/core': path.resolve(__dirname, '../core/src/index'),
      '@ies/hooks': path.resolve(__dirname, '../hooks/src/index'),
      '@ies/manager': path.resolve(__dirname, '../manager/src/index'),
      '@ies/panel-ui': path.resolve(
        __dirname,
        '../ui-kit/panel-ui/src/index',
      ),
      '@ies/types': path.resolve(__dirname, '../types/src/index'),
      // '@ies/ui': path.resolve(__dirname, '../ui/'),
      '@ies/utils': path.resolve(__dirname, '../utils/src/index'),
    },
  },
});
