<template lang="pug">
  .remark-Info
    ul.info-list
      li.list-item(
        v-for="item in notes"
      )
        .left
          span.name {{ item.name }}
          span.name(v-show="item.job") ({{ item.job }})
          .time {{ item.time }}
        .right {{ item.remark }}
</template>
<script>
export default {
  props: {
    notes: Array
  },
  data() {
    return {
      /**
       *  现在的备注只有一条信息（一个字符串），应该是一个数组，就好了
       */
      // list: [
      //   {
      //     name: '王晓飞',
      //     job: '客户',
      //     time: '2018-12-12 12:12',
      //     remark: '请给我准备一条毛巾'
      //   }
      // ]
    }
  }
}
</script>
<style lang="scss" scoped>
  .remark-Info {
    .info-list {
      .list-item {
        color: #666666;
        font-size: 14px;
        margin: 15px 0 8px 0;
        .left, 
        .right {
          display: inline-block;
          vertical-align: top;
        }
        .left {
          width: 20%; 
          text-align: right;
          margin-right: 30px;
          .time {
            color: #999999;
            font-size: 12px;
            margin-top: 5px;
          }
        }
        .right {
          color: #333333;
          width: 70%;
        }
      }
    }
  }
</style>