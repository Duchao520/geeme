<template>
  <div class="employee-list-wrapper">
    <div class="operation">
      <div>
        <a-button 
          @click="add"
          style="background:#F52D56;
          border:none;
          color: #ffffff;
          margin: 0 15px 0 0;">
          新增员工
        </a-button>
        <a-button 
          style="background:#41CAC0;
          border:none;
          color: #ffffff;">
          批量导入
        </a-button>
      </div>
      <a-input-search placeholder="请输入员工姓名/手机号/员工编号" style="width: 280px" enterButton/>
    </div>
    <ListSearch v-if="searchReset" @reset="onReset" @search="onSearch"/>
    <G-NavBar :navList="statusNavList" @change="onNavChange"/>
    <div class="content">

    </div>

    <router-view />
  </div>
</template>

<script>
import ListSearch from './components/listSearch'
export default {
  components: {
    ListSearch
  },
  data() {
    const statusNavList = [{id: 1, title: '已启用'}, {id: 2, title: '已禁用'}, {id: 3, title: '已删除'}]
    return {
      searchReset: true,
      statusNavList,
    }
  },
  methods: {
    onReset() {
      this.searchReset = false
      this.$nextTick(() => this.searchReset = true)
    },
    onSearch() {},
    onNavChange() {},
    add() {
      this.$router.push('/app/employee/list/add')
    }
  }
}
</script>

<style lang="less" scoped>
.employee-list-wrapper {
  height: @mainContentH;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    overflow: hidden;
    height: calc(100% - 203px);
    padding: 0 20px 20px 20px;
    border-radius: 0 0 4px 4px;
  }
}
</style>