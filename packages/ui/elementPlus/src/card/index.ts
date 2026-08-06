import type { ComponentConfigModel } from '@ies/designer';

export default {
  component: () => import('./card'),
  config: {
    attribute: [
      {
        field: 'label',
        label: '标题',
        type: 'input',
      },
      {
        field: 'props.shadow',
        label: '阴影时机',
        props: {
          clearable: true,
          options: [
            {
              label: 'always',
              value: 'always',
            },
            {
              label: 'hover',
              value: 'hover',
            },
            {
              label: 'never',
              value: 'never',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
      },
     {
        field:'props.gridEnable',
        label:'网格布局',
        type:'switch',
        onChange: ({ value, values }) => {
          const props = values.props ?? {}
          if(value){
            props.gridCols = 2;
          }else{
            delete props.gridCols;
          }
        }
      },
      {
        field:'props.gridCols',
        label:'栅格列数',
        props:{
          min:2,
          max:4,
        },
        show:({ values }) => values.props?.gridEnable,
        type:'number',
      }
    ],
  },
  defaultSchema: {
    label: '卡片布局',
    props: {},
    type: 'card',
    children: [],
  },
  groupName: '布局',
  icon: 'icon--epic--wysiwyg-rounded',
  sort: 700,
} as ComponentConfigModel;
