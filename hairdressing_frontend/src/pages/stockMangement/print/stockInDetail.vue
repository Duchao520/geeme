<template>
  <div>
    <el-button 
      plain 
      size="mini"
      class="plain_blue_btn" 
      icon="icon iconfont icon-icon_ope_print" 
      @click="print"
    > 打 印</el-button>
    <div class="print-box" ref="print">
      <el-table
        :data="table"
      >
        <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
        <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
        <el-table-column label="规格" prop="specificationName"></el-table-column>
        <el-table-column label="录入数量" prop="signNum"></el-table-column>
        <el-table-column label="成本价" prop="buyingPrice"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    table: {
      type: Object,
      required: true
    }
  },
  methods: {
    
    print() {
      this.$print(this.$refs.print, '随便试试？')
    }
  }
}
</script>
<style lang='scss' scoped>
.print-box {
  display: none;
}
@page {
  // size: A4 landscape; // landscape 横
  size: A4 portrait; // 竖 /* 210mm * 297mm */
}
</style>
