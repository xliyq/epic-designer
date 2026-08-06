import type { PluginManager } from '@ies/manager'
import type { ComponentSchema, PublicMethodModel } from '@ies/types'

function arg(field: string, label: string, type: string, props?: Record<string, any>): ComponentSchema {
  return { field, label, type, props: props ?? {} } as ComponentSchema
}

export function createActionPresets(pluginManager: PluginManager): PublicMethodModel[] {
  const $message = pluginManager.global.$message ?? {}
  return [
    {
      name: 'showNotification',
      description: '提示消息',
      argsConfigs: [
        arg('0', '消息类型', 'select', {
          options: [
            { label: '成功', value: 'success' },
            { label: '信息', value: 'info' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' },
          ],
        }),
        arg('1', '提示内容', 'input', { placeholder: '请输入提示内容' }),
      ],
      handler: (type: string, message: string) => {
        if ($message[type as keyof typeof $message]) {
          ($message[type as keyof typeof $message] as Function)(message)
        } else {
          $message.info?.(message)
        }
      },
    },
    {
      name: 'openLink',
      description: '打开链接',
      argsConfigs: [
        arg('0', '链接地址', 'input', { placeholder: '请输入URL' }),
        arg('1', '打开方式', 'select', {
          defaultValue: '_blank',
          options: [
            { label: '新窗口', value: '_blank' },
            { label: '当前窗口', value: '_self' },
          ],
        }),
      ],
      handler: (url: string, target: string = '_blank') => {
        window.open(url, target)
      },
    },
    {
      name: 'callApi',
      description: '调用API',
      argsConfigs: [
        arg('0', '请求地址', 'input', { placeholder: '请输入API地址' }),
        arg('1', '请求方式', 'select', {
          defaultValue: 'GET',
          options: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' },
          ],
        }),
        arg('2', '请求参数(JSON)', 'input', { placeholder: '可选，JSON格式' }),
      ],
      handler: async (url: string, method: string = 'GET', data?: string) => {
        const options: RequestInit = {
          method,
          headers: { 'Content-Type': 'application/json' },
        }
        if (data && method !== 'GET') {
          if (typeof data === 'string') {
            try { data = JSON.parse(data) } catch { /* keep as string */ }
          }
          options.body = JSON.stringify(data)
        }
        const response = await fetch(url, options)
        return response.json()
      },
    },
    {
      name: 'showConfirm',
      description: '确认对话框',
      argsConfigs: [
        arg('0', '提示内容', 'input', { placeholder: '请输入提示内容' }),
        arg('1', '标题', 'input', { defaultValue: '提示', placeholder: '请输入标题' }),
      ],
      handler: (message: string, title: string = '提示') => {
        return Promise.resolve(window.confirm(`${title}\n${message}`))
      },
    },
    {
      name: 'downloadFile',
      description: '下载文件',
      argsConfigs: [
        arg('0', '文件地址', 'input', { placeholder: '请输入文件URL' }),
        arg('1', '文件名', 'input', { placeholder: '可选，默认自动识别' }),
      ],
      handler: (url: string, filename?: string) => {
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename ?? url.split('/').pop() ?? 'download'
        anchor.click()
      },
    },
    {
      name: 'copyToClipboard',
      description: '复制到剪贴板',
      argsConfigs: [
        arg('0', '文本内容', 'input', { placeholder: '请输入要复制的内容' }),
      ],
      handler: (text: string) => {
        navigator.clipboard.writeText(text)
        $message.success?.('已复制到剪贴板')
      },
    },
    {
      name: 'consoleLog',
      description: '控制台输出',
      argsConfigs: [
        arg('0', '输出内容', 'input', { placeholder: '请输入要输出的内容' }),
      ],
      handler: (...args: any[]) => {
        console.log('[EpicDesigner]', ...args)
      },
    },
    {
      name: 'setLocalStorage',
      description: '设置本地存储',
      argsConfigs: [
        arg('0', '键名', 'input', { placeholder: '请输入存储键名' }),
        arg('1', '存储值', 'input', { placeholder: '请输入存储值' }),
      ],
      handler: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value))
      },
    },
    {
      name: 'getLocalStorage',
      description: '获取本地存储',
      argsConfigs: [
        arg('0', '键名', 'input', { placeholder: '请输入要获取的键名' }),
      ],
      handler: (key: string) => {
        const value = localStorage.getItem(key)
        try {
          return value ? JSON.parse(value) : null
        } catch {
          return value
        }
      },
    },
  ]
}
