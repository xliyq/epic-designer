import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/',
  description: '低代码可视化设计器及生成器',
  head: [
    ['link', { href: '/favicon.ico', rel: 'epic-icon', type: 'image/x-icon' }],
  ],
  lang: 'zh-CN',
  sitemap: {
    hostname: 'https://github.com/xliyq/epic-designer',
  },
  themeConfig: {
    outline: {
      level: [2, 3],
      label: '目录',
    },
    editLink: {
      pattern: 'https://github.com/xliyq/epic-designer/issues',
      text: '为此页提供修改建议',
    },
    footer: {
      copyright: `基于 MIT 协议开源`,
    },

    logo: '/logo.png',
    nav: [
      {
        activeMatch: '/guide/start/index',
        link: '/guide/start/index',
        text: '文档',
      },
      { activeMatch: '/updateLog', link: '/updateLog', text: '更新日志' },
      {
        text: '相关链接',
        items: [
          {
            link: 'https://cn.vuejs.org/',
            text: 'Vue3',
          },
          {
            link: 'https://cn.vitejs.dev/',
            text: 'Vite',
          },
          {
            link: 'https://www.typescriptlang.org/',
            text: 'TypeScript',
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            {
              link: '/guide/start/index',
              text: '简介',
            },
            {
              link: '/guide/start/quick-start',
              text: '快速上手',
            },
            {
              link: '/guide/start/i18n-cn',
              text: 'UI组件国际化',
            },
            {
              link: '/guide/start/theme',
              text: '定制主题',
            },
            {
              link: '/guide/start/dark-mode',
              text: '暗黑模式',
            },
            {
              link: '/guide/start/layoutGuide',
              text: '布局指南',
            },
            {
              link: '/guide/other/hotkeys',
              text: '快捷键',
            },
            {
              link: '/guide/other/schema',
              text: 'Schema 参考',
            },
          ],
        },
        {
          text: '组件',
          items: [
            {
              link: '/guide/components/EDesigner',
              text: 'Designer 设计器',
            },
            {
              link: '/guide/components/EBuilder',
              text: 'Builder 生成器',
            },
            {
              link: '/guide/components/EMultiViewDesigner',
              text: 'MultiViewDesigner 多视图设计器',
            },
          ],
        },
        {
          text: '事件动作',
          items: [
            {
              link: '/guide/action/presetActions',
              text: '预制动作',
            },
            {
              link: '/guide/action/customFunctions',
              text: '自定义函数',
            },
          ],
        },
        {
          text: '扩展',
          items: [
            {
              link: '/guide/extensions/icon',
              text: 'Icon 图标',
            },
            {
              link: '/guide/extensions/component',
              text: '组件扩展',
            },
            {
              link: '/guide/extensions/activityBar',
              text: '活动栏扩展',
            },
            {
              link: '/guide/extensions/dataSource',
              text: '数据源扩展',
            },
            {
              link: '/guide/extensions/rightSidebar',
              text: '右侧边栏扩展',
            },
            {
              link: '/guide/extensions/publicMethods',
              text: '公共函数',
            },
          ],
        },
        {
          text: '管理器',
          items: [
            {
              link: '/guide/utils/pluginManager',
              text: 'pluginManager 插件管理器',
            },
            {
              link: '/guide/utils/pageManager',
              text: 'pageManager 页面管理器',
            },
          ],
        },
        {
          text: '组合式 API',
          items: [
            {
              link: '/guide/compositionApi/useFormItem',
              text: 'useFormItem',
            },
            {
              link: '/guide/compositionApi/useEventBus',
              text: 'useEventBus',
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xliyq/epic-designer' },
    ],
  },
  // 网站标题
  title: 'EpicDesigner文档',
});
