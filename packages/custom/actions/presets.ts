import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import type { PublicMethodModel } from '@ies/types'

export function createActionPresets(): PublicMethodModel[] {
  return [
    {
      name: 'showNotification',
      description: '提示消息',
      handler: (type: string, message: string) => {
        ElNotification({ type: type as any, title: message })
      },
    },
    {
      name: 'openLink',
      description: '打开链接',
      handler: (url: string, target: string = '_blank') => {
        window.open(url, target)
      },
    },
    {
      name: 'callApi',
      description: '调用API',
      handler: async (url: string, method: string = 'GET', data?: Record<string, any>) => {
        const options: RequestInit = {
          method,
          headers: { 'Content-Type': 'application/json' },
        }
        if (data && method !== 'GET') {
          options.body = JSON.stringify(data)
        }
        const response = await fetch(url, options)
        return response.json()
      },
    },
    {
      name: 'showConfirm',
      description: '确认对话框',      handler: (message: string, title: string = '提示') => {
        return ElMessageBox.confirm(message, title)
      },
    },
    {
      name: 'downloadFile',
      description: '下载文件',
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
      handler: (text: string) => {
        navigator.clipboard.writeText(text)
        ElMessage.success('已复制到剪贴板')
      },
    },
    {
      name: 'consoleLog',
      description: '控制台输出',      handler: (...args: any[]) => {
        console.log('[EpicDesigner]', ...args)
      },
    },
    {
      name: 'setLocalStorage',
      description: '设置本地存储',
      handler: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value))
      },
    },
    {
      name: 'getLocalStorage',
      description: '获取本地存储',
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
