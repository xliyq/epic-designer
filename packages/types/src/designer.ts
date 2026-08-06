import { PageSchema } from '@ies/types';

export interface TableColumn {
  columnName: string;
  columnRemark: string;
}
export interface TableMeta {
  primaryKey: string;
  tableColumn: TableColumn[];
  tableName: string;
  tableRemark: string;
  tableType: string;
}
/**
 * attribute-group 运行时需要的 API 属性定义数据。
 * key = attribute-group 的 field 名，value = 该属性组的 API 定义数组
 */
export type AttributeMeta = Record<string, any[]>;

export interface DesignerProps {
  canvasMode?: 'desktop' | 'mobile' | 'tablet';
  canvasPadding?: number | string;
  defaultSchema?: PageSchema;
  disabledZoom?: boolean;
  draggable?: boolean;
  formMode?: boolean;
  hiddenHeader?: boolean;
  hidePreviewConfirm?: boolean;
  lockDefaultSchemaEdit?: boolean;
  showHiddenItems?: boolean;
  sourceCodeReadOnly?: boolean;
  tableJson?: TableMeta[];
  title?: string;
}
