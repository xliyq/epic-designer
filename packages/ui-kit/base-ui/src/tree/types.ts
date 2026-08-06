import type { ComponentSchema } from '@ies/types';

export interface TreeProps {
  draggable?: boolean;
  hoverKey?: string;
  options: ComponentSchema[];
  selectedKeys: string[];
}
