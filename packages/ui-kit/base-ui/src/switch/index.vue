<script lang="ts" setup>
import { computed, ref } from 'vue'

export type SwitchValue = boolean | string | number

const props = withDefaults(defineProps<{
  modelValue?: SwitchValue
  disabled?: boolean
  loading?: boolean
  size?: 'large' | 'default' | 'small'
  width?: number
  inlinePrompt?: boolean
  activeIcon?: string
  inactiveIcon?: string
  activeActionIcon?: string
  inactiveActionIcon?: string
  activeText?: string
  inactiveText?: string
  activeValue?: SwitchValue
  inactiveValue?: SwitchValue
  name?: string
  beforeChange?: () => boolean | Promise<boolean>
  id?: string
  tabindex?: string | number
  ariaLabel?: string
}>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  size: 'default',
  width: undefined,
  inlinePrompt: false,
  activeIcon: '',
  inactiveIcon: '',
  activeActionIcon: '',
  inactiveActionIcon: '',
  activeText: '',
  inactiveText: '',
  activeValue: true,
  inactiveValue: false,
  name: '',
  ariaLabel: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: SwitchValue]
  'change': [value: SwitchValue]
}>()

const inputRef = ref<HTMLInputElement>()

const isChecked = computed(() => props.modelValue === props.activeValue)
const switchDisabled = computed(() => props.disabled || props.loading)

/* 各尺寸数值 */
const sizeMap = {
  large: { coreWidth: 50, coreHeight: 24, coreRadius: 12, btnSize: 20, contentPadding: 6, fontSize: 14 },
  default: { coreWidth: 40, coreHeight: 20, coreRadius: 10, btnSize: 16, contentPadding: 4, fontSize: 14 },
  small: { coreWidth: 30, coreHeight: 16, coreRadius: 8, btnSize: 12, contentPadding: 2, fontSize: 12 },
}

const dims = computed(() => {
  const s = props.size || 'default'
  const base = sizeMap[s]
  if (props.width) {
    return { ...base, coreWidth: props.width }
  }
  return base
})

const coreStyle = computed(() => {
  const style: Record<string, string> = {
    height: `${dims.value.coreHeight}px`,
    borderRadius: `${dims.value.coreRadius}px`,
  }
  /* 用户指定 width 时固定宽度，否则由 min-width + 内容撑开 */
  if (props.width) {
    style.width = `${props.width}px`
  }
  return style
})

const innerStyle = computed(() => ({
  padding: `0 ${dims.value.contentPadding}px 0 ${dims.value.btnSize + 2}px`,
  height: `${dims.value.btnSize}px`,
}))

const innerCheckedStyle = computed(() => ({
  padding: `0 ${dims.value.btnSize + 2}px 0 ${dims.value.contentPadding}px`,
}))

const actionStyle = computed(() => ({
  width: `${dims.value.btnSize}px`,
  height: `${dims.value.btnSize}px`,
}))

const actionCheckedLeft = computed(() =>
  `calc(100% - ${dims.value.btnSize + 1}px)`,
)

async function handleChange() {
  if (switchDisabled.value) return
  if (props.beforeChange) {
    try {
      const shouldChange = await Promise.resolve(props.beforeChange())
      if (!shouldChange) return
    } catch {
      return
    }
  }
  const newVal = isChecked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', newVal)
  emit('change', newVal)
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus, checked: isChecked })
</script>

<template>
  <label
    class="ep-switch"
    :class="[
      `ep-switch--${size}`,
      {
        'is-disabled': switchDisabled,
        'is-checked': isChecked,
        'is-loading': loading,
      },
    ]"
  >
    <!-- 左侧标签 -->
    <span
      v-if="!inlinePrompt"
      class="ep-switch__label ep-switch__label--left"
      :class="{ 'is-active': !isChecked }"
    >
      <slot name="inactive">
        <span v-if="inactiveIcon" :class="inactiveIcon" />
        <span v-else-if="inactiveText">{{ inactiveText }}</span>
      </slot>
    </span>

    <!-- 核心开关 -->
    <span
      class="ep-switch__core"
      :style="coreStyle"
    >
      <input
        ref="inputRef"
        type="checkbox"
        :checked="isChecked"
        :disabled="switchDisabled"
        :name="name"
        :id="id"
        :tabindex="tabindex"
        :aria-label="ariaLabel || undefined"
        @change="handleChange"
      />

      <!-- inline-prompt 内容 -->
      <span
        v-if="inlinePrompt"
        class="ep-switch__inner"
        :style="isChecked ? innerCheckedStyle : innerStyle"
      >
        <span v-if="isChecked" class="ep-switch__inner-wrapper">
          <slot name="active">
            <span v-if="activeIcon" :class="activeIcon" />
            <span v-else-if="activeText">{{ activeText }}</span>
          </slot>
        </span>
        <span v-else class="ep-switch__inner-wrapper">
          <slot name="inactive">
            <span v-if="inactiveIcon" :class="inactiveIcon" />
            <span v-else-if="inactiveText">{{ inactiveText }}</span>
          </slot>
        </span>
      </span>

      <!-- 旋钮 -->
      <span
        class="ep-switch__action"
        :style="{
          ...actionStyle,
          left: isChecked ? actionCheckedLeft : '1px',
        }"
      >
        <slot :name="isChecked ? 'active-action' : 'inactive-action'">
          <span v-if="isChecked && activeActionIcon" :class="activeActionIcon" />
          <span v-else-if="!isChecked && inactiveActionIcon" :class="inactiveActionIcon" />
        </slot>
        <span v-if="loading" class="ep-switch__loading" />
      </span>
    </span>

    <!-- 右侧标签 -->
    <span
      v-if="!inlinePrompt"
      class="ep-switch__label ep-switch__label--right"
      :class="{ 'is-active': isChecked }"
    >
      <slot name="active">
        <span v-if="activeIcon" :class="activeIcon" />
        <span v-else-if="activeText">{{ activeText }}</span>
      </slot>
    </span>
  </label>
</template>

<style scoped>
/* ── 容器 ── */
.ep-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
}
.ep-switch--large { font-size: 14px; height: 40px; line-height: 24px; }
.ep-switch--default { font-size: 14px; height: 32px; line-height: 20px; }
.ep-switch--small { font-size: 12px; height: 24px; line-height: 16px; }

.ep-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ── 外部标签 ── */
.ep-switch__label {
  display: inline-flex;
  align-items: center;
  height: inherit;
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
  color: var(--ep-text-primary);
  transition: color 0.3s;
}
.ep-switch__label.is-active {
  color: var(--ep-primary);
}
.ep-switch__label--left { margin-right: 10px; }
.ep-switch__label--right { margin-left: 10px; }

/* ── input ── */
.ep-switch__core input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}
.ep-switch__core input:focus-visible ~ .ep-switch__action {
  outline: 2px solid var(--ep-switch-on-color, var(--ep-primary));
  outline-offset: 1px;
}

/* ── 核心轨道 ── */
.ep-switch__core {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 40px;
  height: 20px;
  border: 1px solid var(--ep-switch-border-color, var(--ep-switch-off-color, var(--ep-border)));
  border-radius: 10px;
  outline: none;
  box-sizing: border-box;
  background: var(--ep-switch-off-color, var(--ep-border));
  cursor: pointer;
  transition:
    border-color 0.3s,
    background-color 0.3s;
  flex-shrink: 0;
}

.ep-switch.is-checked .ep-switch__core {
  border-color: var(--ep-switch-border-color, var(--ep-switch-on-color, var(--ep-primary)));
  background: var(--ep-switch-on-color, var(--ep-primary));
}

/* ── inline-prompt 内部文字 ── */
.ep-switch__inner {
  width: 100%;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.ep-switch__inner-wrapper {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fff;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 旋钮 ── */
.ep-switch__action {
  position: absolute;
  left: 1px;
  border-radius: 50%;
  transition: all 0.3s;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--ep-switch-off-color, var(--ep-border));
}
.ep-switch.is-checked .ep-switch__action {
  color: var(--ep-switch-on-color, var(--ep-primary));
}

/* ── 加载动画 ── */
.ep-switch__loading {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid var(--ep-text-secondary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: ep-switch-spin 0.6s linear infinite;
}
@keyframes ep-switch-spin {
  to { transform: rotate(360deg); }
}
</style>
