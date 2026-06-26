/**
 * 使用示例 - 账务接口数据转 epic-designer 表单 schema
 */

import { generateFormSchema } from '../utils/form-schema-converter.ts';
import fs from 'fs';

// 读取 1.json
const data1 = JSON.parse(fs.readFileSync('d:/DevSpace/qzsc/bboss/designer/epic-designer/examples/temp/1.json', 'utf-8'));

// 生成表单 schema
const formSchema = generateFormSchema(data1);

// 保存到 out.json
fs.writeFileSync('d:/DevSpace/qzsc/bboss/designer/epic-designer/examples/temp/out.json', JSON.stringify(formSchema, null, 2), 'utf-8');
console.log('转换完成，结果已保存到 out1.json');

// 打印结构信息
console.log('\n输出结构:');
console.log(`- 顶层节点: ${formSchema[0].type}, label: ${formSchema[0].label}`);
console.log(`- 子节点数量: ${formSchema[0].children.length}`);
formSchema[0].children.forEach((card, index) => {
    console.log(`  ${index + 1}. ${card.label} (${card.children.length} 个字段)`);
    card.children.forEach(field => {
        console.log(`     - ${field.label} (${field.type})`);
    });
});
