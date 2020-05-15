<template>
  <el-dialog
    title="业绩明细"
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
      <el-table-column label="业绩名称" prop="name"></el-table-column>
      <el-table-column label="总业绩" prop="total"></el-table-column>
      <el-table-column label="现金类总业绩" prop="totalCashPay"></el-table-column>
      <el-table-column label="卡扣类总业绩" prop="totalCardPay"></el-table-column>
      <el-table-column label="储值金业绩" prop="rechargeMoney"></el-table-column>
      <el-table-column label="赠送金业绩" prop="giftMoney"></el-table-column>
      <el-table-column label="次卡业绩" prop="countCard"></el-table-column>
      <el-table-column label="时间卡业绩" prop="timeCard"></el-table-column>
      <el-table-column label="现金业绩" prop="cash"></el-table-column>
      <el-table-column label="微信业绩" prop="wechat"></el-table-column>
      <el-table-column label="支付宝业绩" prop="aliPay"></el-table-column>
      <el-table-column label="自定义支付业绩" prop="custom"></el-table-column>
    </el-table>

    <div class="echart-box">
      <div>
        <h3>业绩汇总</h3>
        <div id="total-performance"></div>
      </div>
      <div>
        <h3>劳动业绩统计</h3>
        <div id="service-performance"></div>
      </div>
      <div>
        <h3>卡项业绩统计</h3>
        <div id="card-performance"></div>
      </div>
      <div>
        <h3>现金类业绩统计</h3>
        <div id="cash-performance"></div>
      </div>
      <div>
        <h3>线上订单业绩</h3>
        <div id="online-performance"></div>
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
      this.getStoreDailyPerformance()
    },
    // 根据日期变化,请求数据
    async getStoreDailyPerformance() {
      if (!this.filterTime.beginDay) { return }
      let params = {
        ...this.filterTime,
        storeId: this.shopId,
        brandId: this.currentInfo.brandId,
      }
      this.loading = true
      this.tableData = []
      let res = await axios.post('/getStoreDailyPerformanceStatisticsBasicInfo', params)
      this.formatedData(res)
      this.loading = false
    },
    // - 格式化后端数据到表格 - 
    formatedData(data) {
      this.tableData = [
        {
          name: '劳动业绩',
          total: data.serviceTotalPerformance, // 总 - 业绩
          totalCashPay: data.serviceCashPerformance, // 总 - 现金类
          totalCardPay: data.serviceCardPerformance, // 总 - 卡扣类
          rechargeMoney: data.serviceRechargeMoneyPerformance, // 储值金
          giftMoney: data.serviceGiftMoneyPerformance, // 赠送金
          countCard: data.serviceCountCardpayPerformance, // 次卡
          timeCard: data.serviceTimeCardpayPerformance, // 时间卡
          cash: data.serviceCashpayPerformance, // 现金
          wechat: data.serviceWepayPerformance, // 微信
          aliPay: data.serviceAlipayPerformance, // 支付宝
          custom: data.serviceSelfdefPerformance, // 自定义 
        },
        {
          name: '产品业绩',
          total: data.productTotalPerformance, // 总 - 业绩
          totalCashPay: data.productCashPerformance, // 总 - 现金类
          totalCardPay: data.productCardPerformance, // 总 - 卡扣类
          rechargeMoney: data.productRechargeMoneyPerformance, // 储值金
          giftMoney: data.productGiftMoneyPerformance, // 赠送金
          countCard: '-', // 次卡
          timeCard: '-', // 时间卡
          cash: data.productCashpayPerformance, // 现金
          wechat: data.productWepayPerformance, // 微信
          aliPay: data.productAlipayPerformance, // 支付宝
          custom: data.productSelfdefPerformance, // 自定义 
        },
        {
          name: '储值卡业绩',
          total: (data.prepaidCardOpenTotalPerformance + data.prepaidCardRenewalTotalPerformance).toFixed(2), // 总 - 业绩
          totalCashPay: (data.prepaidCardOpenCashPerformance + data.prepaidCardRenewalCashPerformance).toFixed(2), // 总 - 现金类
          totalCardPay: '-', // 总 - 卡扣类
          rechargeMoney: '-', // 储值金
          giftMoney: '-', // 赠送金
          countCard: '-', // 次卡
          timeCard: '-', // 时间卡
          cash: (data.prepaidCardOpenCashpayPerformance + data.prepaidCardRenewalCashpayPerformance).toFixed(2), // 现金
          wechat: (data.prepaidCardOpenWepayPerformance + data.prepaidCardRenewalWepayPerformance).toFixed(2), // 微信
          aliPay: (data.prepaidCardOpenAlipayPerformance + data.prepaidCardRenewalAlipayPerformance).toFixed(2), // 支付宝
          custom: (data.prepaidCardOpenSelfdefPerformance + data.prepaidCardRenewalSelfdefPerformance).toFixed(2), // 自定义 
        },
        {
          name: '身份卡业绩',
          total: (data.identityCardOpenTotalPerformance + data.identityCardRenewalTotalPerformance).toFixed(2), // 总 - 业绩
          totalCashPay: (data.identityCardOpenCashPerformance + data.identityCardRenewalCashPerformance).toFixed(2), // 总 - 现金类
          totalCardPay: '-', // 总 - 卡扣类
          rechargeMoney: (data.identityCardOpenRechargeMoneyPerformance + data.identityCardRenewalRechargeMoneyPerformance).toFixed(2), // 储值金 
          giftMoney: (data.identityCardOpenGiftMoneyPerformance + data.identityCardRenewalGiftMoneyPerformance).toFixed(2), // 赠送金
          countCard: '-', // 次卡
          timeCard: '-', // 时间卡
          cash: (data.identityCardOpenCashpayPerformance + data.identityCardRenewalCashpayPerformance).toFixed(2), // 现金
          wechat: (data.identityCardOpenWepayPerformance + data.identityCardRenewalWepayPerformance).toFixed(2), // 微信
          aliPay: (data.identityCardOpenAlipayPerformance + data.identityCardRenewalAlipayPerformance).toFixed(2), // 支付宝
          custom: (data.identityCardOpenSelfdefPerformance + data.identityCardRenewalSelfdefPerformance).toFixed(2), // 自定义 
        },
        {
          name: '次卡业绩',
          total: (data.countCardOpenTotalPerformance + data.countCardRenewalTotalPerformance).toFixed(2), // 总 - 业绩
          totalCashPay: (data.countCardOpenCashPerformance + data.countCardRenewalCashPerformance).toFixed(2), // 总 - 现金类
          totalCardPay: '-', // 总 - 卡扣类
          rechargeMoney: (data.countCardOpenRechargeMoneyPerformance + data.countCardRenewalRechargeMoneyPerformance).toFixed(2), // 储值金 
          giftMoney: (data.countCardOpenGiftMoneyPerformance + data.countCardRenewalGiftMoneyPerformance).toFixed(2), // 赠送金
          countCard: '-', // 次卡
          timeCard: '-', // 时间卡
          cash: (data.countCardOpenCashpayPerformance + data.countCardRenewalCashpayPerformance).toFixed(2), // 现金
          wechat: (data.countCardOpenWepayPerformance + data.countCardRenewalWepayPerformance).toFixed(2), // 微信
          aliPay: (data.countCardOpenAlipayPerformance + data.countCardRenewalAlipayPerformance).toFixed(2), // 支付宝
          custom: (data.countCardOpenSelfdefPerformance + data.countCardRenewalSelfdefPerformance).toFixed(2), // 自定义
        },
        {
          name: '时间卡业绩',
          total: (data.timeCardOpenTotalPerformance + data.timeCardRenewalTotalPerformance).toFixed(2), // 总 - 业绩
          totalCashPay: (data.timeCardOpenCashPerformance + data.timeCardRenewalCashPerformance).toFixed(2), // 总 - 现金类
          totalCardPay: '-', // 总 - 卡扣类
          rechargeMoney: (data.timeCardOpenRechargeMoneyPerformance + data.timeCardRenewalRechargeMoneyPerformance).toFixed(2), // 储值金 
          giftMoney: (data.timeCardOpenGiftMoneyPerformance + data.timeCardRenewalGiftMoneyPerformance).toFixed(2), // 赠送金
          countCard: '-', // 次卡
          timeCard: '-', // 时间卡
          cash: (data.timeCardOpenCashpayPerformance + data.timeCardRenewalCashpayPerformance).toFixed(2), // 现金
          wechat: (data.timeCardOpenWepayPerformance + data.timeCardRenewalWepayPerformance).toFixed(2), // 微信
          aliPay: (data.timeCardOpenAlipayPerformance + data.timeCardRenewalAlipayPerformance).toFixed(2), // 支付宝
          custom: (data.timeCardOpenSelfdefPerformance + data.timeCardRenewalSelfdefPerformance).toFixed(2), // 自定义
        },
      ]
      this.drawPerformancePie('total-performance', data)
      this.drawPerformancePie('service-performance', data)
      this.drawPerformancePie('card-performance', data)
      this.drawPerformancePie('cash-performance', data)
      this.drawPerformancePie('online-performance', data)
    },
    // - 详情 - 画图表 - 业绩
    drawPerformancePie (id, data) {
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
        case 'total-performance':
          return {
            title: '业绩汇总',
            color: ['#ffe782', '#ffe4c8', '#72f0f8', '#a584ff', '#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0'],
            data: [
              {
                name: '储值金',
                value: (
                  data.serviceRechargeMoneyPerformance + // 服务
                  data.productRechargeMoneyPerformance + // 产品
                  // 储值卡本身不能开储值卡
                  data.identityCardOpenRechargeMoneyPerformance + // 身份卡 开卡 
                  data.identityCardRenewalRechargeMoneyPerformance + // 身份卡 续卡
                  data.countCardOpenRechargeMoneyPerformance + // 次卡 开卡 
                  data.countCardRenewalRechargeMoneyPerformance + // 次卡 续卡
                  data.timeCardOpenRechargeMoneyPerformance + // 时间卡 开卡
                  data.timeCardRenewalRechargeMoneyPerformance // 时间卡 续卡
                ).toFixed(2)
              },
              {
                name: '赠送金',
                value: (
                  data.serviceGiftMoneyPerformance + // 服务
                  data.productGiftMoneyPerformance + // 产品
                  // 储值卡本身不能开储值卡
                  data.identityCardOpenGiftMoneyPerformance + // 身份卡 开卡 
                  data.identityCardRenewalGiftMoneyPerformance + // 身份卡 续卡 
                  data.countCardOpenGiftMoneyPerformance + // 次卡 开卡 
                  data.countCardRenewalGiftMoneyPerformance + // 次卡 续卡 
                  data.timeCardOpenGiftMoneyPerformance + // 时间卡 开卡 
                  data.timeCardRenewalGiftMoneyPerformance // 时间卡 续卡 
                ).toFixed(2)
              },
              {
                name: '次卡',
                value: data.serviceCountCardpayPerformance, // 仅服务有次卡,
              },
              {
                name: '时间卡',
                value: data.serviceTimeCardpayPerformance, // 仅服务有时间卡
              },
              {
                name: '现金',
                value: (
                  data.serviceCashpayPerformance + // 服务
                  data.productCashpayPerformance + // 产品
                  data.prepaidCardOpenCashpayPerformance + // 储值卡 开卡
                  data.prepaidCardRenewalCashpayPerformance + // 储值卡 续卡
                  data.identityCardOpenCashpayPerformance + // 身份卡 开卡
                  data.identityCardRenewalCashpayPerformance + // 身份卡 续卡
                  data.countCardOpenCashpayPerformance + // 次卡 开卡
                  data.countCardRenewalCashpayPerformance + // 次卡 续卡
                  data.timeCardOpenCashpayPerformance + // 时间卡 开卡
                  data.timeCardRenewalCashpayPerformance // 时间卡 续卡
                ).toFixed(2)
              },
              {
                name: '微信',
                value: (
                  data.serviceWepayPerformance + // 服务
                  data.productWepayPerformance + // 产品
                  data.prepaidCardOpenWepayPerformance + // 储值卡 开卡
                  data.prepaidCardRenewalWepayPerformance + // 储值卡 续卡
                  data.identityCardOpenWepayPerformance + // 身份卡 开卡
                  data.identityCardRenewalWepayPerformance + // 身份卡 续卡
                  data.countCardOpenWepayPerformance + // 次卡 开卡
                  data.countCardRenewalWepayPerformance + // 次卡 续卡
                  data.timeCardOpenWepayPerformance + // 时间卡 开卡
                  data.timeCardRenewalWepayPerformance // 时间卡 续卡
                ).toFixed(2)
              },
              {
                name: '支付宝',
                value: (
                  data.serviceAlipayPerformance + // 服务
                  data.productAlipayPerformance + // 产品
                  data.prepaidCardOpenAlipayPerformance + // 储值卡 开卡
                  data.prepaidCardRenewalAlipayPerformance + // 储值卡 续卡
                  data.identityCardOpenAlipayPerformance + // 身份卡 开卡
                  data.identityCardRenewalAlipayPerformance + // 身份卡 续卡
                  data.countCardOpenAlipayPerformance + // 次卡 开卡
                  data.countCardRenewalAlipayPerformance + // 次卡 续卡
                  data.timeCardOpenAlipayPerformance + // 时间卡 开卡
                  data.timeCardRenewalAlipayPerformance // 时间卡 续卡
                ).toFixed(2)
              },
              {
                name: '自定义支付',
                value: (
                  data.serviceSelfdefPerformance + // 服务
                  data.productSelfdefPerformance + // 产品
                  data.prepaidCardOpenSelfdefPerformance + // 储值卡 开卡
                  data.prepaidCardRenewalSelfdefPerformance + // 储值卡 续卡
                  data.identityCardOpenSelfdefPerformance + // 身份卡 开卡
                  data.identityCardRenewalSelfdefPerformance + // 身份卡 续卡
                  data.countCardOpenSelfdefPerformance + // 次卡 开卡
                  data.countCardRenewalSelfdefPerformance + // 次卡 续卡
                  data.timeCardOpenSelfdefPerformance + // 时间卡 开卡
                  data.timeCardRenewalSelfdefPerformance // 时间卡 续卡
                ).toFixed(2)
              },
            ],
          }
        case 'service-performance':
          return {
            title: '劳动业绩统计',
            color: ['#ffe782', '#ffe4c8', '#72f0f8', '#a584ff', '#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0'],
            data: [
              {
                name: '储值金',
                value: data.serviceRechargeMoneyPerformance
              },
              {
                name: '赠送金',
                value: data.serviceGiftMoneyPerformance
              },
              {
                name: '次卡',
                value: data.serviceCountCardpayPerformance, // 仅服务有次卡,
              },
              {
                name: '时间卡',
                value: data.serviceTimeCardpayPerformance, // 仅服务有时间卡
              },
              {
                name: '现金',
                value: data.serviceCashpayPerformance
              },
              {
                name: '微信',
                value: data.serviceWepayPerformance
              },
              {
                name: '支付宝',
                value: data.serviceAlipayPerformance
              },
              {
                name: '自定义支付',
                value: data.serviceSelfdefPerformance
              },
            ],
          }  
        case 'card-performance':
          return {
            title: '卡项业绩统计',
            color: ['#ffe782', '#72f0f8', '#a584ff', '#fb9aa0'],
            data: [
              {
                name: '储值卡',
                value: (data.prepaidCardOpenTotalPerformance + data.prepaidCardRenewalTotalPerformance).toFixed(2)
              },
              {
                name: '身份卡',
                value: (data.identityCardOpenTotalPerformance + data.identityCardRenewalTotalPerformance).toFixed(2)
              },
              {
                name: '次卡',
                value: (data.countCardOpenTotalPerformance + data.countCardRenewalTotalPerformance).toFixed(2),
              },
              {
                name: '时间卡',
                value: (data.timeCardOpenTotalPerformance + data.timeCardRenewalTotalPerformance).toFixed(2),
              },
            ],
          }  
        case 'cash-performance':
          return {
            title: '现金类业绩统计',
            color: ['#ffb884', '#b2ffb9', '#80c2ff', '#fb9aa0'],
            data: [
              {
                name: '现金',
                value: (
                  data.serviceCashpayPerformance +
                  data.productCashpayPerformance +
                  data.prepaidCardOpenCashpayPerformance + 
                  data.prepaidCardRenewalCashpayPerformance +
                  data.identityCardOpenCashpayPerformance + 
                  data.identityCardRenewalCashpayPerformance +
                  data.countCardOpenCashpayPerformance + 
                  data.countCardRenewalCashpayPerformance +
                  data.timeCardOpenCashpayPerformance + 
                  data.timeCardRenewalCashpayPerformance
                ).toFixed(2)
              },
              {
                name: '微信',
                value: (
                  data.serviceWepayPerformance +
                  data.productWepayPerformance +
                  data.prepaidCardOpenWepayPerformance + 
                  data.prepaidCardRenewalWepayPerformance +
                  data.identityCardOpenWepayPerformance + 
                  data.identityCardRenewalWepayPerformance +
                  data.countCardOpenWepayPerformance + 
                  data.countCardRenewalWepayPerformance +
                  data.timeCardOpenWepayPerformance + 
                  data.timeCardRenewalWepayPerformance
                ).toFixed(2)
              },
              {
                name: '支付宝',
                value: (
                  data.serviceAlipayPerformance +
                  data.productAlipayPerformance +
                  data.prepaidCardOpenAlipayPerformance + 
                  data.prepaidCardRenewalAlipayPerformance +
                  data.identityCardOpenAlipayPerformance + 
                  data.identityCardRenewalAlipayPerformance +
                  data.countCardOpenAlipayPerformance + 
                  data.countCardRenewalAlipayPerformance +
                  data.timeCardOpenAlipayPerformance + 
                  data.timeCardRenewalAlipayPerformance
                ).toFixed(2)
              },
              {
                name: '自定义',
                value: (
                  data.serviceSelfdefPerformance +
                  data.productSelfdefPerformance +
                  data.prepaidCardOpenSelfdefPerformance + 
                  data.prepaidCardRenewalSelfdefPerformance +
                  data.identityCardOpenSelfdefPerformance + 
                  data.identityCardRenewalSelfdefPerformance +
                  data.countCardOpenSelfdefPerformance + 
                  data.countCardRenewalSelfdefPerformance +
                  data.timeCardOpenSelfdefPerformance + 
                  data.timeCardRenewalSelfdefPerformance
                ).toFixed(2)
              },
            ],
          }  
        case 'online-performance':
          return {
            title: '线上订单业绩',
            color: ['#80c2ff', '#72f0f8', '#fb9aa0'],
            data: [
              {
                name: '服务',
                value: data.onlineServiceTotalPerformance
              },
              {
                name: '产品',
                value: data.onlineProductTotalPerformance
              },
              {
                name: '卡项',
                value: data.onlineCardTotalPerformance
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
          this.getStoreDailyPerformance()
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
