<template>
  <div class="e-coupon-main">
    <div class="radio-line">
      <div class="left-btns">
        <el-radio-group v-model="activity">
          <el-radio-button label="history">派发记录</el-radio-button>
          <el-radio-button label="model">优惠券模板</el-radio-button>
        </el-radio-group>
        <el-button v-if="activity === 'model'" class="normal_red_btn" @click="handleCreateModel">新增模板</el-button>
      </div>
      <div class="search-box">
        <g-search ref="search" :placeholder='"搜索优惠券名称"' v-on:search="handleSearch"></g-search>
      </div>
    </div>
    <component :ref="activity" class="bottom-component" :name="name" :is="activity"></component>
  </div>
</template>
<script>
import history from './history'
import model from './model'
export default {
  data() {
    return {
      activity: 'history',
      name: ''
    }
  },
  methods: {
    handleSearch(key) {
      this.name = key
    },
    //
    handleCreateModel() {
      this.$refs.model.templateVisible = true
    },
  },
  watch: {
    activity: {
      handler: function (v, o) {
        this.name = ''
        this.$refs['search'].resetKeyWord()
      }
    }
  },
  components: {
    history,
    model
  }
}
</script>
<style lang='scss' scoped>
.e-coupon-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  .radio-line {
    height: 35px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    /deep/ .el-radio-button {
      .el-radio-button__inner {
        padding: 9.5px 20px;
        &:hover {
          color: #58C9F3;
        }
      }
      &.is-active {
        .el-radio-button__inner {
          padding: 9.5px 20px;
          background: #58C9F3;
          border-color: #58C9F3;
          color: #fff;
        }
      }
    }
    .normal_red_btn {
      padding: 9.5px 20px;
      margin-left: 20px;
    }
  }
  .bottom-component {
    flex: 1;
  }
}
</style>
