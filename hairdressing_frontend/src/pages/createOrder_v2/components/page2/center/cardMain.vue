<template>
  <div class="card-main" v-loading.fullscreen="loading">
    <commonSearchLine @search="handleSearch"/>
    <cardList :list="list" @loadGoods="loadGoods" :totle="totle" :loading="lazyLoad" ref="scrollbarRef"/>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import commonSearchLine from './commonSearchLine.vue';
import cardList from './cardList.vue';
export default {
  data() {
    return {
      keyword: '',
      loading: false, 
      list: [],
      pageNum: 1,
      pageSize: 30,
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
      this.loading = true
      axios.post('/pagedQueryStoreCardKindBasicInfo', {
        brandId: this.currentInfo.brandId,
        cardName: this.keyword,
        giftCard: false, // 过滤礼品卡
        storeId: this.currentInfo.shopId,
        queryType: this.billInfo.currentTopStatus.card, // 顶部导航栏的分类id
        queryCondition: 0,
        pageNum: this.pageNum - 1,
        pageSize: this.pageSize
      }).then(res => {
        this.list = res.listCardKindBasicInfo || []
        this.totle = res.total
      }).then(() => {
        this.loading = false
      })
    },
    loadGoods() {
      this.lazyLoad = true
      this.loading = true
      this.pageNum ++
      axios.post('/pagedQueryStoreCardKindBasicInfo', {
        brandId: this.currentInfo.brandId,
        cardName: this.keyword,
        giftCard: false, // 过滤礼品卡
        storeId: this.currentInfo.shopId,
        queryType: this.billInfo.currentTopStatus.card, // 顶部导航栏的分类id
        queryCondition: 0,
        pageNum: this.pageNum - 1 ,
        pageSize: this.pageSize
      }).then(res => {
        res.listCardKindBasicInfo && res.listCardKindBasicInfo.length && this.list.push(...res.listCardKindBasicInfo)
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
    }
  },
  components: { commonSearchLine, cardList }
}
</script>
<style lang='scss' scoped>

</style>
