import cac from 'cac';

import { defineCheckCompiledCommand } from './check-compiled';
import { defineVersionCommand } from './version';
// 创建 epic 实例
const epic = cac('epic');

defineCheckCompiledCommand(epic);
defineVersionCommand(epic);

// 解析命令行参数
epic.parse();
