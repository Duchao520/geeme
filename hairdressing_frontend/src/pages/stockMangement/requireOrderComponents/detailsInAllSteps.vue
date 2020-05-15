<template>
  <full-single-page title="订货单详情" type="stock" origin="otherTags" v-loading="pageLoading">
    <div class="page-main">
      <div class="steps-box">
        <order-steps
          class="step"
          :steps="orderStepsOption"
        />
      </div>
      <div class="main-info-box">
        <div class="main-left">
          <orderInfoLeft :info="restData"/>
        </div>
        <div class="main-right">
          <orderInfoRight :info="restData" :table="tableData" @init="init"/>
        </div>
      </div>
    </div>
  </full-single-page>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';

import orderInfoLeft from './orderInfoLeft';
import orderInfoRight from './orderInfoRight';

export default {
  data() {
    return {
      pageLoading: false,
      tableData: [], // 订货单表格数据
      topData: {
        deleted: 0,
        newOrderStatus: 1,
      },
      restData: {},
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$root.$on('needRefreshPage', data => {
      this.init()
    })
  },
  methods: {
    init() {
      this.pageLoading = true
      axios.post('/getProductInvoiceDetailInfo',{productInvoiceId: this.productInvoiceId}).then(res => {
        let data = res.productInvoiceInfo
        // 表格
        this.tableData = data.listProductInvoiceSubInfo
        // 自己编的进度条
        this.topData.deleted = data.deleted
        this.topData.newOrderStatus = data.newOrderStatus
        // 左侧、表格下方的剩余数据
        let _data = JSON.parse(JSON.stringify(data))
        delete _data.listProductInvoiceSubInfo
        this.restData = _data
        this.pageLoading = false

      })
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      productInvoiceId: state => state.stockGoods.productInvoiceId,
    }),
    orderStepsOption() {
      switch(this.topData.newOrderStatus) {
        case 1:
          return [
            {completed: true, name: '门店订货', time: ''},
            {completed: false, name: '总部审核', time: ''},
            {completed: false, name: '门店确认', time: ''},
            {completed: false, name: '总部发货', time: ''},
            {completed: false, name: '门店入库', time: ''}
          ]
        case 2:
        case 3:
          return [
            {completed: true, name: '门店订货', time: ''},
            {completed: true, name: '总部审核', time: ''},
            {completed: false, name: '门店确认', time: ''},
            {completed: false, name: '总部发货', time: ''},
            {completed: false, name: '门店入库', time: ''}
          ]
        case 4:
        case 5:
        case 6:
        case 7:
          return [
            {completed: true, name: '门店订货', time: ''},
            {completed: true, name: '总部审核', time: ''},
            {completed: true, name: '门店确认', time: ''},
            {completed: false, name: '总部发货', time: ''},
            {completed: false, name: '门店入库', time: ''}
          ]
        case 8:
        case 9:
        case 10:
          return [
            {completed: true, name: '门店订货', time: ''},
            {completed: true, name: '总部审核', time: ''},
            {completed: true, name: '门店确认', time: ''},
            {completed: true, name: '总部发货', time: ''},
            {completed: false, name: '门店入库', time: ''}
          ]
        case 11:
          return [
            {completed: true, name: '门店订货', time: ''},
            {completed: true, name: '总部审核', time: ''},
            {completed: true, name: '门店确认', time: ''},
            {completed: true, name: '总部发货', time: ''},
            {completed: true, name: '门店入库', time: ''}
          ]
        default: 
          return [
            {completed: true, name: '门店订货', time: ''},
            {completed: false, name: '总部审核', time: ''},
            {completed: false, name: '门店确认', time: ''},
            {completed: false, name: '总部发货', time: ''},
            {completed: false, name: '门店入库', time: ''}
          ] 
      }
    },
  },
  components: { orderInfoLeft, orderInfoRight},
  beforeDestroy() {
    this.$root.$off("needRefreshPage")
  },
}
</script>
<style lang='scss' scoped>
.page-main {
  padding: 20px;
}
.steps-box{
  border: 1px solid #f0f1f4;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.step {
  width: 100%;
}

.main-info-box {
  border: 1px solid #f0f1f4;
  border-radius: 5px;
  display: flex;
}
.main-left {
  width: 320px;
  border-right: 1px solid #f0f1f4;
  color: #666666;
  padding: 10px 20px;
  font-size: 12px;
}
.main-right {
  flex: 1;
}
</style>
