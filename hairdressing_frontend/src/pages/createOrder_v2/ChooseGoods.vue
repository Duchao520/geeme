<template>
  <div class="choose-goods-page">
    <chooseGoodsHeader/>
    <chooseGoodsTypeNav/>
    <chooseGoodsCenter/>
    <chooseGoodsRight/>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
/** 子组件按页面区域分文件夹存放 **/
import chooseGoodsHeader from './components/page2/top/header.vue'
import chooseGoodsTypeNav from './components/page2/left/leftNav.vue'
import chooseGoodsCenter from './components/page2/center/index.vue'
import chooseGoodsRight from './components/page2/right/index.vue'
export default {
  data() {
    return {
      
    }
  },
  created() {
    
  },
  methods: {

  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    })
  },
  components: { chooseGoodsHeader, chooseGoodsTypeNav, chooseGoodsCenter, chooseGoodsRight }
}
</script>
<style lang='scss' scoped>

</style>
