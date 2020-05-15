<template lang="pug">
.g-table
  .title 学习课程
  el-table(
    :data="tableData",
    style="width: 100%",
    max-height="240",
    stripe
  )
    <template slot-scope="scope">
      el-table-column(
        prop="scene",
        label="学习场景",
        align="left",
        fixed
      )
      el-table-column(
        prop="classify",
        label="课程分类",
        align="left"
      )
      el-table-column(
        prop="className",
        label="课程名称",
        align="left"
      )
      el-table-column(
        prop="price",
        label="课程费用",
        align="left"
      )
      el-table-column(
        prop="process",
        label="学习进度",
        align="left"
      )
    </template>
</template>
<script>
  export default {
    data() {
      return {
        title: 'xxx',
        tableData: [{
          scene: '在线课程', // 课程场景
          classify: '技术类',
          className: '《发型师的自我修养》',
          price: '298',
          process: '85%'
        }, {
          scene: '在线课程1', // 课程场景
          classify: '技术类',
          className: '《发型师的自我修养》',
          price: '298',
          process: '85%'
        }, {
          scene: '在线课程2', // 课程场景
          classify: '技术类',
          className: '《发型师的自我修养》',
          price: '298',
          process: '85%'
        }]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .g-table {
    padding: 20px;
    -webkit-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    -o-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    -ms-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    .title {
      font-size: 16px;
      color: #333333;
      margin-left: 10px;
    }
  }
</style>