import type { CAC } from 'cac';

import fs from 'node:fs';
import path from 'node:path';

import { getPackagesSync } from '../utils';

const INTERNAL_PKG_PREFIX = '@ies/';

const INITIAL_VERSION = '0.0.1';

interface SyncOptions {
  dryRun?: boolean;
  force?: boolean;
}

interface CheckOptions {
  force?: boolean;
}

function readPackageJson(dir: string): Record<string, any> {
  const pkgPath = path.join(dir, 'package.json');
  const content = fs.readFileSync(pkgPath, 'utf-8');
  return JSON.parse(content);
}

function writePackageJson(dir: string, pkg: Record<string, any>): void {
  const pkgPath = path.join(dir, 'package.json');
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

function isInternalPackage(name: string): boolean {
  return name.startsWith(INTERNAL_PKG_PREFIX);
}

function syncDependencyVersions(
  pkg: Record<string, any>,
  newVersion: string,
): { changed: boolean; deps: string[] } {
  const depFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ] as const;
  const updatedDeps: string[] = [];
  let changed = false;

  for (const field of depFields) {
    const deps = pkg[field];
    if (!deps || typeof deps !== 'object') continue;

    for (const [depName, depVersion] of Object.entries(deps)) {
      if (!isInternalPackage(depName)) continue;

      const versionStr = String(depVersion);
      if (versionStr === 'workspace:*' || versionStr === 'catalog:') continue;

      if (versionStr.startsWith('>=')) {
        const newValue = `>=${newVersion}`;
        if (versionStr === newValue) continue;
        deps[depName] = newValue;
        updatedDeps.push(`${depName} (${field}: ${versionStr} -> ${newValue})`);
        changed = true;
      } else if (versionStr === '*' || versionStr === 'latest') {
        continue;
      } else if (versionStr !== newVersion) {
        deps[depName] = newVersion;
        updatedDeps.push(`${depName} (${field}: ${versionStr} -> ${newVersion})`);
        changed = true;
      }
    }
  }

  return { changed, deps: updatedDeps };
}

async function syncVersion(options: SyncOptions = {}, overrideVersion?: string) {
  const { dryRun } = options;
  const { packages, rootPackage } = getPackagesSync();

  if (!rootPackage) {
    console.error('无法找到根 package.json');
    process.exit(1);
  }

  const targetVersion = overrideVersion ?? rootPackage.packageJson.version;
  console.log(`\n目标版本号: ${targetVersion}\n`);

  let versionUpdatedCount = 0;
  let depsUpdatedCount = 0;

  for (const pkg of packages) {
    const pkgJson = { ...pkg.packageJson };
    const pkgName = pkgJson.name || pkg.dir;
    let pkgChanged = false;
    const changes: string[] = [];

    if (pkgJson.version && pkgJson.version !== targetVersion) {
      changes.push(`version: ${pkgJson.version} -> ${targetVersion}`);
      pkgJson.version = targetVersion;
      pkgChanged = true;
      versionUpdatedCount++;
    }

    const { changed: depsChanged, deps } = syncDependencyVersions(
      pkgJson,
      targetVersion,
    );
    if (depsChanged) {
      changes.push(...deps);
      pkgChanged = true;
      depsUpdatedCount += deps.length;
    }

    if (pkgChanged) {
      console.log(`  ${pkgName}`);
      changes.forEach((c) => console.log(`    - ${c}`));

      if (!dryRun) {
        writePackageJson(pkg.dir, pkgJson);
      }
    }
  }

  console.log(
    `\n${dryRun ? '[预览模式] ' : ''}同步完成: ${versionUpdatedCount} 个包版本已更新, ${depsUpdatedCount} 个依赖引用已更新\n`,
  );
}

async function setVersion(newVersion: string, options: SyncOptions = {}) {
  const { dryRun } = options;
  const { rootPackage } = getPackagesSync();

  if (!rootPackage) {
    console.error('无法找到根 package.json');
    process.exit(1);
  }

  const rootPkgJson = { ...rootPackage.packageJson };
  const oldVersion = rootPkgJson.version;
  rootPkgJson.version = newVersion;

  console.log(`\n根版本号: ${oldVersion} -> ${newVersion}\n`);

  if (!dryRun) {
    writePackageJson(rootPackage.dir, rootPkgJson);
  }

  console.log('正在同步到所有子包...\n');
  await syncVersion(options, newVersion);
}

async function checkVersion(options: CheckOptions = {}) {
  const { force } = options;
  const { rootPackage } = getPackagesSync();

  if (!rootPackage) {
    console.error('无法找到根 package.json');
    process.exit(1);
  }

  const currentVersion = rootPackage.packageJson.version;

  if (currentVersion === INITIAL_VERSION) {
    console.log('');
    console.log('⚠️  当前版本号为 0.0.1，这是初始版本号。');
    console.log('');
    console.log('   打包前请先更新版本号，例如:');
    console.log('     pnpm version:set 0.0.2');
    console.log('     pnpm version:set 0.1.0');
    console.log('     pnpm version:set 1.0.0');
    console.log('');

    if (force) {
      console.log('已使用 --force 跳过检查，继续打包...\n');
      return;
    }

    process.exit(1);
  }

  console.log(`✓ 版本号检查通过: ${currentVersion}\n`);
}

export function defineVersionCommand(cac: CAC) {
  cac
    .command('version [newVersion]', '同步或设置所有包的版本号')
    .option('--dry-run', '预览模式，不实际修改文件')
    .action(async (newVersion?: string, options?: SyncOptions) => {
      if (newVersion) {
        await setVersion(newVersion, options);
      } else {
        await syncVersion(options);
      }
    });

  cac
    .command('version:check', '打包前检查版本号是否已更新')
    .option('--force', '跳过检查，强制继续')
    .action(async (options?: CheckOptions) => {
      await checkVersion(options);
    });
}
