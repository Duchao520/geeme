<template>
  <el-dialog
    title="收入明细"
    :visible="dialogVisible"
    width="1100px"
    :before-close="handleClose"
  >
    <!-- :close-on-click-modal="false" -->
    
    <el-date-picker
      :clearable="false"
      v-model="currentDate"
      type="daterange"
      unlink-panels
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="handleDateChanged"
    >
    </el-date-picker>

    <el-table :data="tableData" stripe header-cell-class-name="header-cell" v-loading="loading" show-summary>
      <el-table-column label="收入名称" prop="name"></el-table-column>
      <el-table-column label="总收入" prop="total"></el-table-column>
      <el-table-column label="现金类总收入" prop="totalCashPay"></el-table-column>
      <el-table-column label="卡扣类总收入" prop="totalCardPay"></el-table-column>
      <el-table-column label="储值金" prop="rechargeMoney"></el-table-column>
      <el-table-column label="赠送金" prop="giftMoney"></el-table-column>
      <el-table-column label="现金" prop="cash"></el-table-column>
      <el-table-column label="微信" prop="wechat"></el-table-column>
      <el-table-column label="支付宝" prop="aliPay"></el-table-column>
      <el-table-column label="自定义支付" prop="custom"></el-table-column>
    </el-table>

    <div class="echart-box">
      <div>
        <h3>收入汇总</h3>
        <div id="total-income"></div>
      </div>
      <div>
        <h3>现金类收入统计</h3>
        <div id="cash-income"></div>
      </div>
      <div>
        <h3>服务总收入统计</h3>
        <div id="service-income"></div>
      </div>
      <div>
        <h3>会员卡分类统计</h3>
        <div id="card-income"></div>
      </div>
    </div>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState } from "vuex";
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 表格组件
    data: {
      type: Object,
      required: true
    },
    // 初始化时间
    date: {
      type: Object,
      required: true
    },
    shopId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      filterTime: {}, 
      currentDate: [], 
      loading: false,
      tableData: [], 
    }
  },
  mounted() {
    this.currentDate = [this.date.beginDay, this.date.endDay]
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleDateChanged(date) {
      this.filterTime = {
        beginDay: date[0],
        endDay: date[1],
      }
      this.getStoreDailyIncome()
    },
    // 根据日期变化,请求数据
    async getStoreDailyIncome() {
      if (!this.filterTime.beginDay) { return }
      let params = {
        ...this.filterTime,
        storeId: this.shopId,
        brandId: this.currentInfo.brandId,
      }
      this.loading = true
      this.tableData = []
      let res = await axios.post('/getStoreDailyIncomeStatisticsList', params)
      this.formatedData(res)
      this.loading = false
    },
    // - 格式化后端数据到表格 - 
    formatedData(data) {
      this.tableData = [
        {
          name: '服务总收入',
          total: data.serviceTotalIncome, // 总 - 收入 
          totalCashPay: data.serviceTotalCashIncome, // 总 - 现金类 
          totalCardPay: data.serviceTotalCardpayIncome, // 总 - 卡扣类 
          rechargeMoney: data.serviceRechargeIncome, // 储值金 
          giftMoney: data.serviceGiftIncome, // 赠送金 
          cash: data.serviceCashIncome, // 现金 
          wechat: data.serviceWepayIncome, // 微信 
          aliPay: data.serviceAlipayIncome, // 支付宝 
          custom: data.serviceSelfdefIncome, // 自定义 
        },
        {
          name: '产品总收入',
          total: data.productTotalIncome, // 总 - 收入 
          totalCashPay: data.productTotalCashIncome, // 总 - 现金类 
          totalCardPay: data.productTotalCardpayIncome, // 总 - 卡扣类 
          rechargeMoney: data.productRechargeIncome, // 储值金 
          giftMoney: data.productGiftIncome, // 赠送金 
          cash: data.productCashIncome, // 现金 
          wechat: data.productWepayIncome, // 微信 
          aliPay: data.productAlipayIncome, // 支付宝 
          custom: data.productSelfdefIncome, // 自定义 
        },
        {
          name: '储值卡总收入',
          total: data.prePaidCardTotalCashIncome, // 总 - 收入 
          totalCashPay: data.prePaidCardTotalCashIncome, // 总 - 现金类
          totalCardPay: '-', // 总 - 卡扣类 
          rechargeMoney: '-', // 储值金 
          giftMoney: '-', // 赠送金 
          cash: data.prePaidCardCashIncome, // 现金 
          wechat: data.prePaidCardWepayIncome, // 微信 
          aliPay: data.prePaidCardAlipayIncome, // 支付宝 
          custom: data.prePaidCardSelfdefIncome, // 自定义  
        },
        {
          name: '身份卡总收入',
          total: data.identityCardTotalIncome, // 总 - 收入 
          totalCashPay: data.identityCardTotalCashIncome, // 总 - 现金类
          totalCardPay: data.identityCardTotalCardpayIncome, // 总 - 卡扣类
          rechargeMoney: data.identityCardRechargeIncome, // 储值金  
          giftMoney: data.identityCardGiftIncome, // 赠送金 
          cash: data.identityCardCashIncome, // 现金 
          wechat: data.identityCardWepayIncome, // 微信 
          aliPay: data.identityCardAlipayIncome, // 支付宝 
          custom: data.identityCardSelfdefIncome, // 自定义 
        },
        {
          name: '次卡总收入',
          total: data.countCardTotalIncome, // 总 - 收入 
          totalCashPay: data.countCardTotalCashIncome, // 总 - 现金类
          totalCardPay: data.countCardTotalCardpayIncome, // 总 - 卡扣类
          rechargeMoney: data.countCardRechargeIncome, // 储值金 
          giftMoney: data.countCardGiftIncome, // 赠送金 
          cash: data.countCardCashIncome, // 现金 
          wechat: data.countCardWepayIncome, // 微信 
          aliPay: data.countCardAlipayIncome, // 支付宝 
          custom: data.countCardSelfdefIncome, // 自定义 
        },
        {
          name: '时间卡总收入',
          total: data.timeCardTotalIncome, // 总 - 收入 
          totalCashPay: data.timeCardTotalCashIncome, // 总 - 现金类
          totalCardPay: data.timeCardTotalCardpayIncome, // 总 - 卡扣类
          rechargeMoney: data.timeCardRechargeIncome, // 储值金  
          giftMoney: data.timeCardGiftIncome, // 赠送金 
          cash: data.timeCardCashIncome, // 现金 
          wechat: data.timeCardWepayIncome, // 微信 
          aliPay: data.timeCardAlipayIncome, // 支付宝 
          custom: data.timeCardSelfdefIncome, // 自定义 
        },
      ]
      this.drawIncomePie('total-income', data)
      this.drawIncomePie('cash-income', data)
      this.drawIncomePie('service-income', data)
      this.drawIncomePie('card-income', data)
    },
    // - 详情 - 画图表 - 业绩
    drawIncomePie (id, data) {
      const PIE =  echarts.init(document.getElementById(id))
      let _data = this.pieData(id, data)
      // console.log(_data)
      let option = {
        title : { // 标题
          show: false, 
          x: 'center',
          text: _data.title, // 主标题
          // subtext: _data.title, // 副标题
          textStyle: {
            lineHeight: 54,
            height: 54,
          },
          padding: [12, 0]
        },
        tooltip : { // 提示框 [鼠标悬浮]
          show: true,
          trigger: 'item',
          formatter: "{b}:\n{c} [{d}%]"
        },
        series : [ // 图表类型
          {
            name: '',
            type: 'pie',
            radius : '55%',
            center: ['50%', '54%'],
            data: _data.data,
            color: _data.color,
            label: {
              show: true,
              formatter: '{b}:\n{c} [{d}%]', // 数据名: 数据值 百分比
              emphasis: { // 鼠标悬浮时 高亮的扇区和标签样式
                show: true,
                textStyle: {
                  fontSize: "16",
                }
              }
            },
          },
        ]
      }
      PIE.setOption(option)
      window.addEventListener("resize", function() {
        setTimeout(function() {
          PIE.resize();
        }, 300);
      })
    },
    // 业绩表
    pieData(id, data) {
      switch (id) {
        case 'total-income':
          return {
            title: '收入汇总',
            color: ['#ffe782', '#ffe4c8', '#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0'],
            data: [
              {
                name: '储值金', // 不能买储值卡
                value: (
                  data.serviceRechargeIncome + // 服务
                  data.productRechargeIncome + // 产品
                  data.identityCardRechargeIncome + // 身份卡
                  data.countCardRechargeIncome + // 次卡 
                  data.timeCardRechargeIncome // 时间卡
                ).toFixed(2)
              },
              {
                name: '赠送金', // 不能买储值卡
                value: (
                  data.serviceGiftIncome + // 服务
                  data.productGiftIncome + // 产品
                  data.identityCardGiftIncome + // 身份卡
                  data.countCardGiftIncome + // 次卡
                  data.timeCardGiftIncome // 时间卡
                ).toFixed(2)
              },
              {
                name: '现金',
                value: (
                  data.serviceCashIncome + // 服务
                  data.productCashIncome + // 产品
                  data.prePaidCardCashIncome + // 储值卡
                  data.identityCardCashIncome + // 身份卡
                  data.countCardCashIncome + // 次卡
                  data.timeCardCashIncome // 时间卡
                ).toFixed(2)
              },
              {
                name: '微信',
                value: (
                  data.serviceWepayIncome + // 服务
                  data.productWepayIncome + // 产品
                  data.prePaidCardWepayIncome + // 储值卡
                  data.identityCardWepayIncome + // 身份卡
                  data.countCardWepayIncome + // 次卡
                  data.timeCardWepayIncome // 时间卡
                ).toFixed(2)
              },
              {
                name: '支付宝',
                value: (
                  data.serviceAlipayIncome + // 服务
                  data.productAlipayIncome + // 产品
                  data.prePaidCardAlipayIncome + // 储值卡
                  data.identityCardAlipayIncome + // 身份卡
                  data.countCardAlipayIncome + // 次卡 
                  data.timeCardAlipayIncome // 时间卡
                ).toFixed(2)
              },
              {
                name: '自定义支付',
                value: (
                  data.serviceSelfdefIncome + // 服务
                  data.productSelfdefIncome + // 产品
                  data.prePaidCardSelfdefIncome + // 储值卡
                  data.identityCardSelfdefIncome + // 身份卡
                  data.countCardSelfdefIncome + // 次卡
                  data.timeCardSelfdefIncome // 时间卡
                ).toFixed(2)
              },
            ],
          }
        case 'cash-income':
          return {
            title: '现金类收入统计',
            color: ['#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0'],
            data: [
              {
                name: '现金',
                value: (
                  data.serviceCashIncome +
                  data.productCashIncome +
                  data.prePaidCardCashIncome +
                  data.identityCardCashIncome +
                  data.countCardCashIncome +
                  data.timeCardCashIncome
                ).toFixed(2)
              },
              {
                name: '微信',
                value: (
                  data.serviceWepayIncome +
                  data.productWepayIncome +
                  data.prePaidCardWepayIncome +
                  data.identityCardWepayIncome +
                  data.countCardWepayIncome +
                  data.timeCardWepayIncome
                ).toFixed(2)
              },
              {
                name: '支付宝',
                value: (
                  data.serviceAlipayIncome +
                  data.productAlipayIncome +
                  data.prePaidCardAlipayIncome +
                  data.identityCardAlipayIncome +
                  data.countCardAlipayIncome +
                  data.timeCardAlipayIncome
                ).toFixed(2)
              },
              {
                name: '自定义',
                value: (
                  data.serviceSelfdefIncome +
                  data.productSelfdefIncome +
                  data.prePaidCardSelfdefIncome +
                  data.identityCardSelfdefIncome +
                  data.countCardSelfdefIncome +
                  data.timeCardSelfdefIncome
                ).toFixed(2)
              },
            ],
          }  
        case 'service-income':
          return {
            title: '服务总收入统计',
            color: ['#ffe782', '#ffe4c8', '#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0'],
            data: [
              {
                name: '储值金',
                value: data.serviceRechargeIncome 
              },
              {
                name: '赠送金',
                value: data.serviceGiftIncome
              },
              {
                name: '现金',
                value: data.serviceCashIncome
              },
              {
                name: '微信',
                value: data.serviceWepayIncome
              },
              {
                name: '支付宝',
                value: data.serviceAlipayIncome
              },
              {
                name: '自定义支付',
                value: data.serviceSelfdefIncome
              },
            ]
          }
        case 'card-income':
          return {
            title: '会员卡分类统计',
            color: ['#ffe782', '#72f0f8', '#a584ff', '#fb9aa0'],
            data: [
              {
                name: '储值卡',
                value: data.prePaidCardTotalCashIncome
              },
              {
                name: '身份卡',
                value: data.identityCardTotalIncome
              },
              {
                name: '次卡',
                value: data.countCardTotalIncome
              },
              {
                name: '时间卡',
                value: data.timeCardTotalIncome
              },
            ],
          }    
        default: 
          return {
            title: 'icbc 爱存不存',
          } 
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
  },
  watch: {
    date: {
      handler: function(v, o) {
        if (v.beginDay) {
          this.filterTime = v
          this.getStoreDailyIncome()
        }
      },
      deep: true,
      immediate: true
    }
  }
  /** 颜色参考:
   * 支付方式 
   * ['储值金', '赠送金', '次卡', '时间卡', '现金', '微信', '支付宝', '自定义']
   * ['#ffe782', '#ffe4c8', '#72f0f8', '#a584ff', '#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0']
   * 卡项
   * ['储值卡', '身份卡', '次卡', '时间卡']
   * ['#ffe782', '#72f0f8', '#a584ff', '#fb9aa0']
   * 项目
   * ['服务', '产品', '卡项']
   * ['#80c2ff', '#b2ffb9', '#fb9aa0']
   * **/
}
</script>
<style lang='scss' scoped>
.el-table {
  margin-top: 12px;
  /deep/ .header-cell {
    background: rgb(244, 245, 247);
  }
}
.echart-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  & > div {
    margin-top: 12px;
    width: 49%;
    & > div {
      width: 100%;
      height: 370px;
      margin-top: 4px;
      box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    }
  }
}
</style>
