<script setup>
// 在这里引入依赖
import { ref, watch, onMounted } from 'vue';
// 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
// import '@/content'

// 控制是否显示（绑定到 el-switch）
const isHidden = ref(false)

// 在组件挂载时，从 chrome.storage 读取已保存的值（若存在）
onMounted(() => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['isHidden'], (res) => {
        if (res && typeof res.isHidden !== 'undefined') {
          isHidden.value = !!res.isHidden
        }
      })

      // 当 storage 中的 isHidden 在其他地方被修改时，同步到当前 popup（可选）
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.isHidden) {
          isHidden.value = !!changes.isHidden.newValue
        }
      })
    }
  } catch (e) {
    // 某些环境下 chrome 可能不可用，保持容错
    // console.warn('chrome.storage not available in this environment', e)
  }
})

// 当开关变化时，保存到 chrome.storage 并发送 runtime message，insert.js 可以通过 storage.onChanged 或 runtime.onMessage 接收
const onHiddenChange = (value) => {
  // 将值持久化到扩展存储
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ isHidden: !!value })
    }
    // 发送 runtime 消息（内容脚本也可通过 chrome.runtime.onMessage 接收）
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'isHiddenChanged', isHidden: !!value })
    } else {
      console.warn('chrome.runtime not available in this environment')
    }
  } catch (e) {
    // ignore
  }
}
</script>

<template>
  <div class="popup">
    <div>隐藏锁定条目</div>
    <el-switch
    v-model="isHidden"
    size="large"
    active-text="开启"
    inactive-text="关闭"
    @change="onHiddenChange"
  />
  </div>
</template>

<style lang="scss" scoped>
@use '@/common/styles/frame.scss';

.popup {
    position: relative;
    width: 400px;
    height: 850px;
}
</style>
