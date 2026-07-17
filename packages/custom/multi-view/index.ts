export { default as MultiViewDesigner } from './components/MultiViewDesigner.vue';
export { resolveViewSchema, resolveFieldSchema } from './composables/useViewSchema';
export { useViewDesigner } from './composables/useViewDesigner';
export { defaultViewTypes, createDemoSchema } from './presets/defaultData';

export type {
  ViewTypeConfig,
  FieldOverride,
  ViewConfig,
  MultiViewPageSchema,
  DesignerMode,
  MultiViewContext,
} from './types';
