<script setup>
// 在这里引入依赖
import { ref } from 'vue';
// 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
import '@/content'

// 控制是否显示（绑定到 el-switch）
const isHidden = ref(false)

const onHiddenChange = (value) => {
  console.log('隐藏锁定条目状态改变:', value);
  // 在这里可以添加更多逻辑来处理状态改变
  // chrome.runtime.sendMessage('Hello', function(response) {
  //       document.write(response);
  // });
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
