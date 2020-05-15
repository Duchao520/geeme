<template>
  <div class="product-main" v-loading.fullscreen="loading">
    <commonSearchLine @search="handleSearch"/>
    <productList :list="list" @loadGoods="loadGoods" :totle="totle" :loading="lazyLoad" ref="scrollbarRef" />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import commonSearchLine from './commonSearchLine.vue';
import productList from './productList.vue';
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
      axios.post('/getSimpleProductListForOrder', {
        keyword: this.keyword,
        storeId: this.currentInfo.shopId,
        levelId: this.billInfo.billingStaff.levelId, // 开单人职级id
        sortOne: this.billInfo.currentTopStatus.product, // 顶部导航栏的分类id
        pageNum: this.pageNum,
        pageSize: this.keyword ? 99999 : this.pageSize
      }).then(res => {
        this.list = res.productInfoList
        this.totle = this.keyword ? res.total : res.initTotal
      }).then(() => {
        this.loading = false
      })
    },
    loadGoods() {
      if (this.lazyLoad) return
      this.lazyLoad = true
      this.loading = true
      this.pageNum ++
      axios.post('/getSimpleProductListForOrder', {
        keyword: this.keyword,
        storeId: this.currentInfo.shopId,
        levelId: this.billInfo.billingStaff.levelId, // 开单人职级id
        sortOne: this.billInfo.currentTopStatus.product, // 顶部导航栏的分类id
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        res.productInfoList && res.productInfoList.length && this.list.push(...res.productInfoList)
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
        // if (this.list.length >)
        this.$nextTick(() => {
          this.$refs.scrollbarRef.returnTop()
        })
        this.pageNum = 1
        this.init()
      },
      deep: true,
      immediate: true
    },
    // 'billInfo.selectedGoods': { // 
    //   handler: function(v, o) {
    //     console.log(1)
    //     this.list.map(i => {
    //       i.specificationInfoList.map(ele => {
    //         v.map(item => {
    //           if (ele.id == item.specificationId) {
    //             console.log(ele)
    //             ele.stock = item.stock
    //           }
    //         })
    //       })
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // },
  },
  components: { commonSearchLine, productList }
}
</script>
<style lang='scss' scoped>

</style>
