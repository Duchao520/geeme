<template>
  <el-dialog :visible="changeDialogVisible" width="500px" :before-close="dialogBeforeClose">
    <div slot="title">
      <h2>选择门店</h2>
    </div>
    <div>
      <g-address @select="addressChange"></g-address>
        <div class="shop-header-right">
          <div class="search">
            <input-search v-model="name" placeholder="搜索门店名称" @search="search"></input-search>
          </div>
        </div>
    </div>
    <div slot="footer" class="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button style="background:#58C9F3;border-color:transparent;color:white" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'chooseShop',
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
h2{
  font-size: 20px;
  padding-bottom: 5px;
}
.el-dialog__header{
  border-bottom: 1px solid #cdcdcd4d !important;
}
</style>
