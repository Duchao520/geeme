<template>
  <div class="supplier-list-wrapper">
    <SupplierSearch />

    <G-NavBar :navList="navList" @change="onNavChange"/>

    <div class="content">

    </div>

    <router-view />
  </div>
</template>

<script>
import SupplierSearch from '../components/supplierSearch'
export default {
  components: {
    SupplierSearch,
  },
  data() {
    return {
      navList: [{id: -1, title: '全部'}, {id: 1, title: '营业中'}, {id: 2, title: '已下线'}, {id: 3, title: '已到期'}, {id: 0, title: '已禁用'}]
    }
  },
  methods: {
    onNavChange() {}
  }
}
</script>

<style lang="less" scoped>
.supplier-list-wrapper {
  height: @mainContentH;
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    .ant-table-content();
    overflow-y: auto;
    height: calc(100% - 208px);
    padding: 0 20px 20px 20px;
    border-radius: 0 0 4px 4px;
  }
}
</style>