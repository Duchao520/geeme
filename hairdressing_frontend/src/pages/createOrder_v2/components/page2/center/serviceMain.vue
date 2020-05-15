<template>
  <div class="service-main" v-loading.fullscreen="loading">
    <commonSearchLine @search="handleSearch"/>
    <serviceList :list="list" @loadGoods="loadGoods" :totle="totle" :loading="lazyLoad" ref="scrollbarRef"/>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import commonSearchLine from './commonSearchLine.vue';
import serviceList from './serviceList.vue';
export default {
  data() {
    return {
      keyword: '',
      loading: false, 
      list: [],
      pageNum: 1,
      pageSize: 84,
      totle: null,
      lazyLoad: false,
    }
  },
  methods: {
    handleSearch(keyword) {
      this.pageNum = 1
      this.keyword = keyword
      this.init()
    },
    init() {
      if (this.loading) return
      this.loading = true
      axios.post('/getSimpleServiceListForOrder', {
        keyword: this.keyword,
        storeId: this.currentInfo.shopId,
        levelId: this.billInfo.billingStaff.levelId, // 开单人职级id
        sortOne: this.billInfo.currentTopStatus.service, // 顶部导航栏的分类id
        pageNum: this.pageNum,
        pageSize:  this.pageSize
      }).then(res => {
        this.list = res.serviceInfoList
        this.totle = res.total
      }).then(() => {
        this.loading = false
      })
    },
    loadGoods() {
      this.lazyLoad = true
      this.loading = true
      this.pageNum ++
      axios.post('/getSimpleServiceListForOrder', {
        keyword: this.keyword,
        storeId: this.currentInfo.shopId,
        levelId: this.billInfo.billingStaff.levelId, // 开单人职级id
        sortOne: this.billInfo.currentTopStatus.service, // 顶部导航栏的分类id
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        res.serviceInfoList && res.serviceInfoList.length && this.list.push(...res.serviceInfoList)
      }).then(() => {
        this.lazyLoad = false
        this.loading = false
      })
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
  },
  watch: {
    'billInfo.currentTopStatus': { // 监听顶部导航变化
      handler: function(v, o) {
        this.$nextTick(() => {
          this.$refs.scrollbarRef.returnTop()
        })
        this.pageNum = 1
        this.init()
      },
      deep: true,
      immediate: true
    },
  },
  components: { commonSearchLine, serviceList }
}
</script>
<style lang='scss' scoped>

</style>
