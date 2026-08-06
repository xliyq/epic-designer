import type { PluginManager } from '@ies/manager'

import { createActionPresets } from '../actions/presets'

export function setupExtensions(pluginManager: PluginManager): void {
  // 注册预制动作
  const presets = createActionPresets(pluginManager)
  for (const method of presets) {
    pluginManager.publicMethods.add(method)
  }
}
