import { createRouter, createWebHistory } from 'vue-router';

import BaseLayout from '@/layout/baseLayout.vue';
import BuilderLayout from '@/layout/builderLayout.vue';
import Layout from '@/layout/index.vue';

// 定义每个 UI 框架的子路由信息
export const frameworkRoutes = [
  {
    component: BaseLayout,
    meta: {
      title: '设计器',
    },
    name: 'designer',
    path: '/:ui/designer',
    children: [
      {
        path: 'basic',
        name: 'basic',
        component: () => import('@/views/designer/basic/index.vue'),
        meta: {
          title: '基础用法',
        },
      },
      {
        path: 'loadData',
        name: 'loadData',
        component: () => import('@/views/designer/loadData/index.vue'),
        meta: {
          title: '数据回显',
        },
      },
      {
        path: 'formMode',
        name: 'formMode',
        component: () => import('@/views/designer/formMode/index.vue'),
        meta: {
          title: '表单模式',
        },
      },
      {
        path: 'undoHistory',
        name: 'undoHistory',
        component: () => import('@/views/designer/undoHistory/index.vue'),
        meta: {
          title: '历史操作管理',
        },
      },
      {
        path: 'publicMethod',
        name: 'publicMethod',
        component: () => import('@/views/designer/publicMethod/index.vue'),
        meta: {
          title: '公共方法',
        },
      },
      {
        path: 'customValidate',
        name: 'customValidate',
        component: () => import('@/views/designer/customValidate/index.vue'),
        meta: {
          title: '自定义校验组件',
        },
      },
      {
        path: 'panel',
        name: 'panel',
        component: () => import('@/views/designer/panel/index.vue'),
        meta: {
          title: '自定义面板',
        },
      },
    ],
  },
  {
    component: BuilderLayout,
    meta: {
      title: '生成器',
    },
    name: 'builder',
    path: '/:ui/builder',
    children: [
      {
        path: 'basic',
        name: 'builderBasic',
        component: () => import('@/views/builder/basic/index.vue'),
        meta: {
          title: '基础用法',
        },
      },
      {
        path: 'loadData',
        name: 'builderLoadData',
        component: () => import('@/views/builder/loadData/index.vue'),
        meta: {
          title: '数据回显',
        },
      },
      {
        path: 'loadFormData',
        name: 'builderLoadFormData',
        component: () => import('@/views/builder/loadFormData/index.vue'),
        meta: {
          title: '数据回显2',
        },
      },
      {
        path: 'disableDisplay',
        name: 'disableDisplay',
        component: () => import('@/views/builder/disableDisplay/index.vue'),
        meta: {
          title: '禁用隐藏',
        },
      },
      {
        path: 'sum',
        name: 'sum',
        component: () => import('@/views/builder/sum/index.vue'),
        meta: {
          title: '计算求和',
        },
      },
      {
        path: 'fieldStates',
        name: 'fieldStates',
        component: () => import('@/views/builder/fieldStates/index.vue'),
        meta: {
          title: '字段状态',
        },
      },
    ],
  },
  {
    component:BaseLayout,
    meta:{
      title:'demo',
    },
    name:'demo',
    path:'/:ui/demo',
    children:[
      {
        path: 'formList',
        name: 'formList',
        component: () => import('@/views/demo/formList.vue'),
        meta: {
          title: '表单列表',
        },
      },
      {
        path: 'formPreview',
        name: 'formPreview',
        component: () => import('@/views/demo/preview.vue'),
        meta: {
          title: '表单预览',
          hidden:true
        },
      },
    ]
  },
];

const routes = [
  {
    component: Layout,
    name: 'uiFrameworks',
    path: '/',
    redirect: '/element-plus/designer/basic',
    children: frameworkRoutes,
  },
  // Resolve refresh page, route warnings
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
