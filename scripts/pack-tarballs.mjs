/**
 * 打包脚本：构建 @ies/designer 和 @ies/element-plus，生成 tgz 到项目根目录的上级目录
 *
 * 执行顺序：
 * 1. stub（刷新 workspace 链接）
 * 2. 构建 @ies/designer（element-plus 依赖 designer 的 dist）
 * 3. 构建 @ies/element-plus（alias 指向 designer dist）
 * 4. npm pack 生成 tgz 到各自包目录
 * 5. 移动 tgz 到上级目录（designer/）
 */

import { execSync } from 'node:child_process';
import { existsSync, renameSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dest = resolve(root, '..');

const packages = [
  { name: '@ies/designer', dir: 'packages/epic-designer' },
  { name: '@ies/element-plus', dir: 'packages/ui/elementPlus' },
];

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

// 1. stub
run('pnpm -r run stub --if-present');

// 2-3. 构建（designer 必须先于 element-plus）
run('pnpm --filter @ies/designer build');
run('pnpm --filter @ies/element-plus build');

// 4-5. pack 并移动 tgz
for (const pkg of packages) {
  const pkgDir = join(root, pkg.dir);
  const pkgJson = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
  const tgzName = `${pkgJson.name.replace(/^@/, '').replace('/', '-')}-${pkgJson.version}.tgz`;

  run('npm pack', pkgDir);

  const src = join(pkgDir, tgzName);
  const dst = join(dest, tgzName);

  if (existsSync(dst)) {
    console.log(`覆盖旧文件: ${dst}`);
  }
  renameSync(src, dst);
  console.log(`✓ ${tgzName} -> ${dst}`);
}

console.log('\n打包完成');
