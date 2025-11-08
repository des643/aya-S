
<script setup>
</script>

<template>
    <el-config-provider namespace="CRX-el">
            <div class="CRX-content">
                <div class="content-entry"></div>
            </div>
       </el-config-provider>
</template>

<style lang="scss" scoped>
.CRX-content {
  .content-entry {
    position: fixed;
    z-index: 9999;
    bottom: 100px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: url('images/content-icon.png');
    background-size: 100% 100%;
    cursor: pointer;
  }
}
</style>