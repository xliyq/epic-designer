import type { ComponentSchema } from '@ies/designer';

import type { PropType } from 'vue';

import { defineComponent, h, renderSlot } from 'vue';

import { ElCard } from 'element-plus';

export default defineComponent({
  props: {
    componentSchema: {
      default: () => ({}),
      required: true,
      type: Object as PropType<ComponentSchema>,
    },
  },
  setup(props, { slots }) {
    return () => {
      const componentSchema = {
        ...props.componentSchema,
        header: props.componentSchema?.label ?? '',
      } as ComponentSchema;
      const children = componentSchema.children ?? [];
      delete componentSchema.children;
      const isGrid = componentSchema.props?.gridEnable;
      const gridCols = componentSchema.props?.gridCols ?? 2;

      const gridAttrs = isGrid
        ? { class: 'grid-content', style: { display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '16px' } }
        : {};     
      
      let vNodeClildren: any = null;
      vNodeClildren =
        children.length > 0
          ? () =>
              children.map((node: ComponentSchema) =>
                renderSlot(slots, 'node', { componentSchema: node }),
              )
          : () => [renderSlot(slots, 'default')];
      return h(ElCard, componentSchema, {
        default: () =>
          h('div', gridAttrs, renderSlot(slots, 'edit-node', {}, vNodeClildren)),
        header: () => renderSlot(slots, 'header'),
      });
    };
    },
});
