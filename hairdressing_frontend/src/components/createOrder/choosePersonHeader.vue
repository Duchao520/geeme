<template lang="pug">
el-row.order_header-wrap(
  type="flex",
  justify="center"
)
  section.order-header
    .header-left
      .title {{ title }}
      .back(
        @click="close"
      ) 关闭
    .header-middle
      g-tabpane(
        :list="list",
        @change="tabChange",
        :current="current"
      )
    .header-right
      el-checkbox(
        v-model="check",
        @change="checkedChange"
      ) 只显示30分钟内有空

</template>
<script>
export default {
  props: {
    title: String,
    list: Array,
    current: [Number, String],
    checked: Boolean
  },
  data() {
    return {
      check: false
    }
  },
  created() {
    this.check = this.checked
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
    tabChange(data) {
      this.$emit('tab-change', data)
    },
    checkedChange(data) {
      this.$emit('checked-change', data)
    }
  },
}
</script>
<style lang="scss">
.order_header-wrap{
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 3000;
  box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  background: #fff;
}
  .order-header {
    padding-left:23px;
    height: 65px;
    position: relative;
    flex: auto;
    .header-left {
      float: left;
      padding-top: 10px;
      .title {
        font-size: 18px;
        color: #333333;
        font-weight: 600;
      }
      .back {
        position: relative;
        padding-left: 15px;
        font-size: 14px;
        color: #959595;
        width: 100px;
        cursor: pointer;
        width: 100%;
        &:before {
          content: '';
          width: 7px;
          height: 7px;
          position: absolute;
          left: 3px;
          top: 6px;
          bottom: 0;
          transform: rotate(-45deg);
          border-left: 2px solid #959595;
          border-top: 2px solid #959595;
          border-bottom-left-radius: 2px;
          border-bottom-right-radius: 2px;
        }
      }
    }
    .header-middle {
      float: left;
      height: 65px;
      line-height: 65px;
      margin-left: 40px;
    }
    .header-right {
      position: absolute;
      top: 0;
      right: 23px;
      height: 65px;
      line-height: 65px;
      &.tab-left {
        left: 100px;
      }
    }
  }
</style>