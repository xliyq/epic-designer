<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: Record<string, any>;
}>();

const emit = defineEmits(['update:modelValue']);

// 内部响应式配置对象
const config = computed({
  get: () => props.modelValue ?? {},
  set: (val) => emit('update:modelValue', val),
});

// 更新某个字段
function updateField(key: string, value: any) {
  config.value = { ...config.value, [key]: value };
}

// 请求参数编辑
const paramsText = computed({
  get: () => JSON.stringify(config.value.params ?? {}, null, 2),
  set: (val: string) => {
    try {
      const parsed = JSON.parse(val);
      updateField('params', parsed);
    } catch {
      // 解析失败时不更新
    }
  },
});

// 联动字段文本（逗号分隔）
const watchFieldsText = computed({
  get: () => (config.value.watchFields ?? []).join(', '),
  set: (val: string) => {
    const fields = val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateField('watchFields', fields);
  },
});
</script>

<template>
  <div class="ep-remote-config">
    <!-- 请求地址 -->
    <div class="ep-remote-config__row">
      <label class="ep-remote-config__label">请求地址</label>
      <input
        class="ep-remote-config__input"
        type="text"
        placeholder="/api/dict/options"
        :value="config.url"
        @input="updateField('url', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- 请求方法 -->
    <div class="ep-remote-config__row">
      <label class="ep-remote-config__label">请求方法</label>
      <div class="ep-remote-config__radio-group">
        <label class="ep-remote-config__radio">
          <input
            type="radio"
            value="GET"
            :checked="config.method === 'GET'"
            @change="updateField('method', 'GET')"
          />
          <span>GET</span>
        </label>
        <label class="ep-remote-config__radio">
          <input
            type="radio"
            value="POST"
            :checked="config.method === 'POST'"
            @change="updateField('method', 'POST')"
          />
          <span>POST</span>
        </label>
      </div>
    </div>

    <!-- 请求参数 -->
    <div class="ep-remote-config__row ep-remote-config__row--column">
      <label class="ep-remote-config__label">
        请求参数
        <span class="ep-remote-config__hint">
          支持 ${'${formData.field}'} 引用表单值
        </span>
      </label>
      <textarea
        class="ep-remote-config__textarea"
        :value="paramsText"
        @blur="paramsText = ($event.target as HTMLTextAreaElement).value"
        rows="4"
        placeholder='{"type": "city"}'
      />
    </div>

    <!-- 响应数据路径 -->
    <div class="ep-remote-config__row">
      <label class="ep-remote-config__label">数据路径</label>
      <input
        class="ep-remote-config__input"
        type="text"
        placeholder="data.list"
        :value="config.dataPath"
        @input="updateField('dataPath', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- 字段映射 -->
    <div class="ep-remote-config__row ep-remote-config__row--two">
      <div class="ep-remote-config__col">
        <label class="ep-remote-config__label">Label 字段</label>
        <input
          class="ep-remote-config__input"
          type="text"
          placeholder="label"
          :value="config.labelKey"
          @input="updateField('labelKey', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="ep-remote-config__col">
        <label class="ep-remote-config__label">Value 字段</label>
        <input
          class="ep-remote-config__input"
          type="text"
          placeholder="value"
          :value="config.valueKey"
          @input="updateField('valueKey', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- 联动字段 -->
    <div class="ep-remote-config__row">
      <label class="ep-remote-config__label">
        联动字段
        <span class="ep-remote-config__hint">逗号分隔，值变化时重新请求</span>
      </label>
      <input
        class="ep-remote-config__input"
        type="text"
        placeholder="provinceId, parentId"
        :value="watchFieldsText"
        @input="watchFieldsText = ($event.target as HTMLInputElement).value"
      />
    </div>

    <!-- 高级选项 -->
    <div class="ep-remote-config__row ep-remote-config__row--two">
      <div class="ep-remote-config__col">
        <label class="ep-remote-config__label">自动加载</label>
        <label class="ep-remote-config__switch">
          <input
            type="checkbox"
            :checked="config.autoLoad"
            @change="updateField('autoLoad', ($event.target as HTMLInputElement).checked)"
          />
          <span class="ep-remote-config__slider"></span>
        </label>
      </div>
      <div class="ep-remote-config__col">
        <label class="ep-remote-config__label">缓存结果</label>
        <label class="ep-remote-config__switch">
          <input
            type="checkbox"
            :checked="config.cache"
            @change="updateField('cache', ($event.target as HTMLInputElement).checked)"
          />
          <span class="ep-remote-config__slider"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-remote-config {
  width: 100%;

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;

    &--column {
      flex-direction: column;
      align-items: stretch;
    }

    &--two {
      flex-direction: row;
      gap: 8px;

      .ep-remote-config__col {
        flex: 1;
      }
    }
  }

  &__label {
    flex-shrink: 0;
    min-width: 70px;
    font-size: 12px;
    color: var(--ep-text-color, #606266);
    line-height: 1.4;
  }

  &__hint {
    display: block;
    font-size: 11px;
    color: var(--ep-text-color-secondary, #909399);
    font-weight: normal;
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--ep-border-color, #dcdfe6);
    border-radius: 4px;
    font-size: 12px;
    color: var(--ep-text-color-primary, #303133);
    background: var(--ep-bg-color, #fff);
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--ep-color-primary, #409eff);
    }
  }

  &__textarea {
    width: 100%;
    min-height: 70px;
    padding: 6px 8px;
    border: 1px solid var(--ep-border-color, #dcdfe6);
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: var(--ep-text-color-primary, #303133);
    background: var(--ep-bg-color, #fff);
    resize: vertical;
    box-sizing: border-box;
    outline: none;

    &:focus {
      border-color: var(--ep-color-primary, #409eff);
    }
  }

  &__radio-group {
    display: flex;
    gap: 12px;
  }

  &__radio {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    cursor: pointer;
    color: var(--ep-text-color, #606266);

    input {
      margin: 0;
    }
  }

  &__switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 18px;
    cursor: pointer;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    input:checked + .ep-remote-config__slider {
      background-color: var(--ep-color-primary, #409eff);
    }

    input:checked + .ep-remote-config__slider::before {
      transform: translateX(14px);
    }
  }

  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--ep-border-color, #dcdfe6);
    border-radius: 18px;
    transition: 0.3s;

    &::before {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      left: 2px;
      bottom: 2px;
      background-color: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }
  }
}
</style>
