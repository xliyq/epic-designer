import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import VueDevTools from 'vite-plugin-vue-devtools';
import nlsPlugin, { Languages, esbuildPluginMonacoEditorNls } from './vite-plugins/nls.js'
import zh_hans from './vite-plugins/zh.json'
const __dirname = import.meta.dirname;
export default defineConfig({
  base: '/',
  plugins: [
    VueDevTools(),
    vue(),
    // 生产环境汉化
    nlsPlugin({
      locale: Languages.zh_hans,
      localeData: zh_hans,
    }),
    UnoCSS(),
    (monacoEditorPlugin as any).default({
      languageWorkers: ['editorWorkerService', 'json', 'typescript'],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        // 开发环境下通过esbuild插件进行汉化
        esbuildPluginMonacoEditorNls({
          locale: Languages.zh_hans,
          localeData: zh_hans,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 开发模式直接指向源码，避免使用过期的 dist 产物
      '@ies/designer': resolve(__dirname, '../packages/epic-designer/index.ts'),
      '@ies/element-plus': resolve(__dirname, '../packages/ui/elementPlus/src/index.ts'),
    },
  },
  server: {
    port: 9980,
  },
});
