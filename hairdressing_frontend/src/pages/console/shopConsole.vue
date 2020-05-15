<template>
  <div id="gm_console" v-loading.fullscreen="fullscreenLoading">
    <!-- 今日实时 -->
    <div class="con_title">
      <img src="/static/images/console/icon_home_realtime.png" />
      <span>每日统计</span>
      <div class="title-rotate-box">
        <!-- <div class="loaded-box"
          v-if="refreshStatus"
          v-loading="refreshStatus"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#f4f5f9"
        ></div>
        <i v-else class="icon iconfont" :class="refreshStatus ? 'icon-jiazai' : 'icon-icon_refresh'" @click="refreshTodayData"></i>-->
        <el-date-picker
          style="margin-left: 10px;"
          v-model="todayForm.date"
          type="date"
          placeholder="选择日期"
          @change="dateChange"
          :default-value="new Date()"
          :picker-options="pickerOptions"
          :clearable="false"
        ></el-date-picker>
      </div>
    </div>
    <div class="today_data">
      <ul>
        <li>
          <img src="/static/images/console/icon_xianjin.png" />
          <div>
            <p>{{ todayDataList && todayDataList.cashPerformance || 0 }}</p>
            <span>现金业绩</span>
          </div>
        </li>
        <li>
          <img src="/static/images/console/icon_daodian.png" />
          <div>
            <p>{{ todayDataList && todayDataList.storeCustomer || 0 }}</p>
            <span>到店客数</span>
          </div>
        </li>
        <li>
          <img src="/static/images/console/icon_zhiding.png" />
          <div>
            <p>{{ todayDataList && todayDataList.specifiedCustomer || 0 }}</p>
            <span>预约客数</span>
          </div>
        </li>
        <li>
          <img src="/static/images/console/icon_xinzeng.png" />
          <div>
            <p>{{ todayDataList && todayDataList.dailyNewMembers || 0 }}</p>
            <span>新增会员数</span>
          </div>
        </li>
      </ul>
      <ul class="second">
        <li>
          <img src="/static/images/console/icon_laodong.png" />
          <div>
            <p>{{ todayDataList && todayDataList.laborPerformance || 0 }}</p>
            <span>劳动业绩</span>
          </div>
        </li>
        <li>
          <img src="/static/images/console/icon_chanping.png" />
          <div>
            <p>{{ todayDataList && todayDataList.productPerformance || 0 }}</p>
            <span>产品业绩</span>
          </div>
        </li>
        <li>
          <img src="/static/images/console/icon_chongka.png" />
          <div>
            <p>{{ todayDataList && todayDataList.rechargeableCardPerformance || 0 }}</p>
            <span>售卡业绩</span>
          </div>
        </li>
        <li>
          <img src="/static/images/console/icon_kajin.png" />
          <div>
            <p>{{ todayDataList && todayDataList.cardConsumption || 0 }}</p>
            <span>卡金消耗</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 快捷操作 -->
    <div class="con_title">
      <img src="/static/images/console/icon_home_shortcut.png" />
      <span>快捷操作</span>
    </div>
    <div class="quick_operation">
      <ul>
        <li
          v-for="(item, index) in quickOperationList"
          :key="index"
          :class="{'locked': !checkHasBtnPermission(item.permissionFlag)}"
          @click="checkHasBtnPermission(item.permissionFlag) && quickArrive(item)"
        >
          <img :src="item.img" />
          <p>{{ item.title }}</p>
          <i
            v-if="!checkHasBtnPermission(item.permissionFlag)"
            class="icon iconfont icon-icon_ope_lock"
          ></i>
        </li>
      </ul>
    </div>
    <!-- 快捷操作 -->
    <div class="con_title">
      <img src="/static/images/console/icon_home_wait.png" />
      <span>待办事项</span>
    </div>
    <div class="quick_operation">
      <ul>
        <li
          v-for="(item, index) in todoList"
          :key="index"
          :class="{'locked': !checkHasBtnPermission(item.permissionFlag)} && item.title !== '期待更多'"
          @click="checkHasBtnPermission(item.permissionFlag) && quickArrive(item)"
        >
          <img :src="item.img" />
          <p>{{ item.title }}</p>
          <i
            v-if="!checkHasBtnPermission(item.permissionFlag) && item.title !== '期待更多'"
            class="icon iconfont icon-icon_ope_lock"
          ></i>
        </li>
      </ul>
    </div>
    <!-- 图表 -->
    <div class="today_chart">
      <div class="chart-box">
        <!-- 门店营收 -->
        <div class="today_collection" v-loading="pieLoading">
          <div class="coll_title">
            <p class="title">门店营收</p>
            <div class="filter-line">
              <el-select
                v-model="income"
                placeholder="请选择"
                style="width: 160px;margin-right: 10px"
                @change="dataTypeChanged"
              >
                <el-option
                  v-for="item in collectionList"
                  :value="item.key"
                  :key="item.value"
                  :label="item.value"
                ></el-option>
              </el-select>
              <dateBox @dateFromSuber="dateFromSuber" />
            </div>
          </div>
          <!-- 比例图 -->
          <div class="pie_area">
            <div id="con_pie" style="width:100%;height:100%;"></div>
          </div>
          <!-- <div class="legend">
            <ul>
              <li>
                <span class="legend1"></span>商品收入
              </li>
              <li>
                <span class="legend2"></span>美发收入
              </li>
              <li>
                <span class="legend3"></span>服务收入
              </li>
            </ul>
          </div>-->
        </div>
        <!-- 趋势图 -->
        <div class="today_tendency_chart" v-loading="lineLoading">
          <div class="coll_title">
            <p class="title">
              趋势图
              <span>月总业绩{{lineChartData[performanceType] && lineChartData[performanceType].totalPerformance || 0}}元</span>
            </p>
            <div class="filter-line">
              <el-select
                style="margin-right: 10px"
                v-model="performanceType"
                placeholder="请选择"
                @change="categoryDataTypeChanged"
              >
                <el-option
                  v-for="item in tendencyList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.value"
                ></el-option>
              </el-select>
              <dateBox
                unit="month"
                valueFormat="yyyy-MM"
                @dateFromSuber="dateFromSuberForLineChart"
                :defaultDate="new Date().format('yyyy-MM')"
              />
            </div>
          </div>
          <!-- 折线图 -->
          <div class="line_area">
            <div id="con_line" style="width:100%;height:100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import { returnStatement } from "babel-types";
import { clearInterval } from "timers";
import dateBox from "./components/dateBoxWithArrow";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入饼图组件
require("echarts/lib/chart/pie");
// 引入折线图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/graphic");
require("echarts/lib/component/grid");
require("echarts/lib/component/title");
// legend 不起作用
// import '../../../node_modules/echarts/lib/component/legend'
require("echarts/lib/component/legend");

export default {
  name: "GmConsole",
  data() {
    return {
      utils,
      visible: false,
      fullscreenLoading: false,
      pieLoading: false,
      lineLoading: false,
      // -门店营收-饼图-
      income: "payTypeBean",
      collectionList: [
        { key: "payTypeBean", value: "支付方式" },
        { key: "storeIncomeBean", value: "营收分类" }
      ],
      // =门店营收-饼图=
      todayIncomeList: {}, // 今日收款数据
      // 接口查询到的门店营收数据
      incomeResultData: {
        payTypeBean: {
          totalAliPayIncome: 0,
          totalCashPayIncome: 0,
          totalIncome: 0,
          totalPrePaidCardPayIncome: 0,
          totalSelfDefinePayIncome: 0,
          totalWechatPayIncome: 0
        },
        storeIncomeBean: {
          countCardTotalIncome: 0,
          identityCardTotalIncome: 0,
          prePaidCardCashIncome: 0,
          productTotalIncome: 0,
          serviceTotalIncome: 0,
          timeCardTotalIncome: 0,
          totalIncome: 0
        }
      },
      todayDataList: {}, // 今日实时数据
      quickOperationList: [
        {
          url: "/shop-inner/choose-person",
          img: require("../../../static/images/console/icon_desk_order.png"),
          title: "快速开单",
          permissionFlag: "shop_console_quickOperate_newOrder"
        },
        {
          url: "/shop-inner/cashier-dask/cashier-list",
          img: require("../../../static/images/console/icon_desk_pay.png"),
          title: "取单结算",
          permissionFlag: "shop_console_quickOperate_getOrder"
        },
        {
          url: "/shop-inner/appo-addnew",
          img: require("../../../static/images/console/icon_desk_book01.png"),
          title: "新增预约",
          permissionFlag: "shop_console_quickOperate_newAppointment"
        },
        {
          url: "/shop-inner/customer/customer-list",
          img: require("../../../static/images/console/icon_desk_customer.png"),
          title: "新增客户",
          permissionFlag: "shop_console_quickOperate_newCustomer"
        },
        {
          url: "/shop-inner/choose-service?openGoodsType=card",
          img: require("../../../static/images/console/icon_desk_card.png"),
          title: "快速开卡",
          permissionFlag: "shop_console_quickOperate_newCard"
        },
        {
          url: "/shop-inner/choose-service?openGoodsType=renewal_card",
          img: require("../../../static/images/console/icon_desk_recharge.png"),
          title: "会员充值/续费",
          permissionFlag: "shop_console_quickOperate_recharge"
        }
      ], // 快速开单
      // 代办事项
      todoList: [
        {
          url: "/shop-inner/appo/appo-list?shortcut=true",
          img: require("../../../static/images/console/icon_desk_confirmed.png"),
          title: "预约待确认",
          permissionFlag: "shop_console_todo_appointment"
        },
        {
          url: "/shop-inner/order/product-order?shortcut=WAITING_DELIVER",
          img: require("../../../static/images/console/icon_desk_shipped.png"),
          title: "产品待发货",
          permissionFlag: "shop_console_todo_product"
        },
        {
          url: "/shop-inner/order/service-order?shortcut=COMPLETED",
          img: require("../../../static/images/console/icon_desk_reply.png"),
          title: "评价待回复",
          permissionFlag: "shop_console_todo_appraise"
        },
        {
          url:
            "/shop-inner/order/service-order?shortcut=REFUNDING_OR_AFTER_SALES",
          img: require("../../../static/images/console/icon_desk_refund.png"),
          title: "退款待处理",
          permissionFlag: "shop_console_todo_refund"
        },
        {
          url:
            "/shop-inner/order/product-order?shortcut=REFUNDING_OR_AFTER_SALES",
          img: require("../../../static/images/console/icon_desk_service.png"),
          title: "售后待处理",
          permissionFlag: "shop_console_todo_afterSale"
        },
        {
          url: "#",
          // img: require("../../../static/images/console/icon_desk_leave.png"),
          // title: "请假待审批"
          img: require("../../../static/images/console/icon_desk_more.png"),
          title: "期待更多"
        }
      ],
      // -业绩折线图数据-
      performanceType: "serviceBean",
      tendencyList: [
        { key: "serviceBean", value: "劳动业绩" },
        { key: "productBean", value: "产品业绩" },
        { key: "cashBean", value: "现金业绩" },
        { key: "cardBean", value: "售卡业绩" }
      ],
      lineChartData: {},
      // =业绩折线图数据=
      todayDataTimer: null, // 今日数据定时器
      refreshStatus: false, // 刷新状态
      todayForm: {
        date: null
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    lineChartStyle() {
      switch (this.performanceType) {
        case "serviceBean":
          return "#67d3f5";
        case "productBean":
          return "#41cac0";
        case "cashBean":
          return "#f55d4f";
        case "cardBean":
          return "#719aff";
        default:
          return "#ff8474";
      }
    }
  },
  watch: {
    'currentInfo.shopId': {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (!o) return;
        this.todayForm.date = this.utils.formatDate(new Date());
        // 获取今日实时数据
        this.getRealTimeToday();
        // this.todayDataTimer = setInterval(this.getRealTimeToday, 30000); // 5min = 300000ms
        this.init();
      }
    }
  },
  created() {
    this.todayForm.date = this.utils.formatDate(new Date());
    // 获取今日实时数据
    this.getRealTimeToday();
    this.todayDataTimer = setInterval(this.getRealTimeToday, 30000); // 5min = 300000ms
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions([
      "clearBillInfo",
      "setBillChooseGoodsType",
      "setProtectedGoodsType",
      "saveCurrentInfo",
      "setIsCount",
      'setCurrentLeftType', // 左侧导航栏 - 快速开卡、 会员充值/续费
    ]),
    init() {
      this.drawPie({});
      this.drawLine({});
      window.addEventListener("resize", function() {});
      this.setBillChooseGoodsType(null);
      this.setProtectedGoodsType(null);
    },
    refreshTodayData() {
      this.refreshStatus = true;
      this.getRealTimeToday();
    },

    dateChange(val) {
      this.todayForm.date = val ? this.utils.formatDate(val) : null;
      this.refreshTodayData();
    },

    // 获取今日实时
    getRealTimeToday() {
      axios
        .post(`/getStoreRealtimeData`, {
          ...this.todayForm,
          storeId: this.currentInfo.shopId,
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          // test： storeId = 28
          this.refreshStatus &&
            this.$message({ type: "success", message: "数据更新成功" });
          this.todayDataList = res.storeRealtimeDataInfo;
          this.refreshStatus = false;
        });
    },
    // 门店营收的时间来源 - 饼图
    dateFromSuber(date) {
      this.pieLoading = true;
      axios
        .post("/getStoreIncomeByCondition", {
          storeId: this.currentInfo.shopId,
          date
        })
        .then(res => {
          this.incomeResultData = {
            payTypeBean: res.payTypeBean || {
              totalAliPayIncome: 0,
              totalCashPayIncome: 0,
              totalIncome: 0,
              totalPrePaidCardPayIncome: 0,
              totalSelfDefinePayIncome: 0,
              totalWechatPayIncome: 0
            },
            storeIncomeBean: res.storeIncomeBean || {
              countCardTotalIncome: 0,
              identityCardTotalIncome: 0,
              prePaidCardCashIncome: 0,
              productTotalIncome: 0,
              serviceTotalIncome: 0,
              timeCardTotalIncome: 0,
              totalIncome: 0
            }
          };
          this.pieLoading = false;
          this.drawPie(this.incomeResultData[this.income]);
        })
        .catch(err => {
          this.pieLoading = false;
        });
    },
    // - 门店营收 数据类型切换
    dataTypeChanged(type) {
      this.drawPie(this.incomeResultData[this.income]);
    },
    // 饼图
    drawPie(_data) {
      let conPie = echarts.init(document.getElementById("con_pie"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}：{c}元"
        },
        graphic: {
          elements: [
            {
              type: "text",
              style: {
                text: _data.totalIncome + "\n",
                textAlign: "center",
                textVerticalAlign: "top",
                color: "#333",
                fontSize: "30",
                fontWeight: "400"
              },
              left: "center",
              top: "center"
            },
            {
              type: "text",
              style: {
                text: "\n\n总收入",
                textAlign: "center",
                textVerticalAlign: "bottom",
                color: "#333",
                fontSize: "20",
                fontWeight: "400"
              },
              left: "center",
              top: "center"
            }
          ]
        },
        legend: {
          show: false, // 这玩意不要了，偶尔会遮挡数据
          orient: "vertical",
          icon: "circle",
          x: "left",
          data:
            this.income === "payTypeBean"
              ? [
                  "支付宝支付",
                  "现金支付",
                  "储值卡支付",
                  "微信支付",
                  "自定义支付"
                ]
              : [
                  "身份卡收入",
                  "储值卡收入",
                  "时间卡收入",
                  "次卡收入",
                  "产品收入",
                  "服务收入"
                ],
          zlevel: 2,
          textStyle: {
            color: "#666",
            fontSize: "12"
          }
        },
        series: [
          {
            name: "门店营收",
            type: "pie",
            symbolSize: 1,
            color:
              this.income === "payTypeBean"
                ? ["#58c9f3", "#f55d4f", "#ffcd02", "#57e0b6", "#8075c4"]
                : [
                    "#ffcd02",
                    "#719aff",
                    "#8075c4",
                    "#ff8474",
                    "#41cac0",
                    "#67d3f5"
                  ],
            radius: ["45%", "55%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                formatter: "￥{c}\n{b}"
                // position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "400",
                  color: "#333333"
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data:
              this.income === "payTypeBean"
                ? [
                    {
                      value: _data.totalAliPayIncome,
                      name: "支付宝支付"
                    },
                    {
                      value: _data.totalCashPayIncome,
                      name: "现金支付"
                    },
                    {
                      value: _data.totalPrePaidCardPayIncome,
                      name: "储值卡支付"
                    },
                    {
                      value: _data.totalWechatPayIncome,
                      name: "微信支付"
                    },
                    {
                      value: _data.totalSelfDefinePayIncome,
                      name: "自定义支付"
                    }
                  ]
                : [
                    {
                      value: _data.identityCardTotalIncome,
                      name: "身份卡收入"
                    },
                    {
                      value: _data.prePaidCardCashIncome,
                      name: "储值卡收入"
                    },
                    {
                      value: _data.timeCardTotalIncome,
                      name: "时间卡收入"
                    },
                    {
                      value: _data.countCardTotalIncome,
                      name: "次卡收入"
                    },
                    {
                      value: _data.productTotalIncome,
                      name: "产品收入"
                    },
                    {
                      value: _data.serviceTotalIncome,
                      name: "服务收入"
                    }
                  ]
          }
        ]
      };
      conPie.setOption(option);
      // 自适应
      window.addEventListener("resize", function() {
        setTimeout(function() {
          conPie.resize();
        }, 300);
      });
    },
    // 趋势图 - 折线
    dateFromSuberForLineChart(date) {
      this.lineLoading = true;
      axios
        .post("/getStorePerformanceByMonth", {
          storeId: this.currentInfo.shopId,
          dateStart: `${date}-01`
        })
        .then(res => {
          this.lineChartData = res;
          this.drawLine(res[this.performanceType]);
          this.lineLoading = false;
        })
        .catch(err => {
          this.lineLoading = false;
        });
    },
    // 折线图类型切换
    categoryDataTypeChanged(type) {
      this.drawLine(this.lineChartData[type]);
    },
    // 图表标签显示
    labelDataShow(num, unit) {
      // return 0
      // 含单位就带单位
      return !!unit ? (num || 0) + unit : num || 0;
    },
    // 折线图
    drawLine(_data) {
      let conLine = echarts.init(document.getElementById("con_line"));
      let option = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "#4ADAAB",
          padding: 10,
          position: "top",
          textStyle: {
            color: "#fff",
            fontSize: "20",
            fontWeight: "400"
          },
          axisPointer: {
            // type: 'cross',
            label: {
              backgroundColor: "#4ADAAB"
            }
          },
          formatter: "{c}元"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "7%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            rotate: -75
          },
          data: _data.dateList || []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}"
          }
        },
        series: [
          {
            data: _data.performanceList || [],

            type: "line",
            symbol: "circle",
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: this.lineChartStyle // 圆点色值
              }
            },
            smooth: true,
            lineStyle: {
              normal: {
                color: this.lineChartStyle, // 线条
                width: 2,
                shadowColor: this.lineChartStyle,
                shadowBlur: 100,
                shadowOffsetY: 30
              }
            }
          }
        ]
      };
      conLine.setOption(option);
      // 自适应
      window.addEventListener("resize", function() {
        setTimeout(function() {
          conLine.resize();
        }, 300);
      });
    },
    quickArrive(item) {
      let url = ''
      if (item.url.indexOf("choose-person") !== -1 || item.url.indexOf("choose-service") !== -1) {
        this.clearBillInfo();
        this.saveCurrentInfo({cpLevelId: null})
        this.setIsCount(true); // - 设置计客数
      }
      if (item.url.indexOf("openGoodsType") !== -1) {
        let type = item.url.split("=").pop();
        // this.setBillChooseGoodsType(type);
        this.setCurrentLeftType(type)
        url = '/shop-inner/choose-service'
      }
      if (item.url.indexOf("customer-list") !== -1) {
        // 存一个一次性的新增客户
        this.saveCurrentInfo({
          newCustomer: true
        });
      }
      this.$router.push(url || item.url);
    }
  },
  beforeDestroy() {
    window.clearInterval(this.todayDataTimer);
    this.todayDataTimer = null;
  },
  components: { dateBox }
};
</script>

<style lang="scss" scoped>
.flex_row {
  display: flex;
  flex-direction: row;
}
.flex_column {
  display: flex;
  flex-direction: column;
}
.flex_column_center {
  @extend .flex_column;
  justify-content: center;
  align-items: center;
}
.flex_row_center {
  @extend .flex_row;
  justify-content: center;
  align-items: center;
}
@mixin img($size, $margin) {
  width: $size;
  height: $size;
  display: inline-block;
  margin: 0 $margin;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.61, 0.25, 0.24, 0.85);
  &:hover {
    transform: scale(1.25);
  }
}
.icon-icon_refresh {
  cursor: pointer;
}
#gm_console {
  .header {
    padding: 14px 40px 14px 20px;
    display: flex;
    flex-direction: row;
    .head_left {
      flex: 1;
      line-height: 36px;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .head_right {
      .head_img {
        width: 36px;
        vertical-align: middle;
        margin-right: 11px;
      }
      .icon_img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .item {
        position: relative;
        margin-right: 60px;
        .msg_count {
          position: absolute;
          top: -7px;
          left: 10px;
          width: 22px;
          height: 18px;
          background: rgba(226, 44, 55, 1);
          border-radius: 9px;
          color: #fff;
          text-align: center;
          font-size: 14px;
        }
      }
      span {
        display: inline-block;
        font-size: 16px;
        margin-right: 14px;
      }
      i {
        display: inline-block;
      }
    }
  }
  padding-right: 20px;
  .con_title {
    margin-left: 6px;
    font-weight: 400;
    font-size: 20px;
    img {
      width: 55px;
      height: 55px;
      vertical-align: middle;
    }
  }
  .today_data {
    ul {
      margin-bottom: 10px;
      @extend .flex_row;
      margin-left: 20px;
      li {
        position: relative;
        height: 120px;
        flex: 1;
        margin-right: 1%;
        background: #fff;
        box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.06);
        border-radius: 6px;
        @extend .flex_row_center;
        &:last-child {
          margin-right: 0;
        }
        img {
          @include img(75px, 4%);
        }
        div {
          flex: 1;
          p {
            font-size: 28px;
            font-weight: 400;
          }
          span {
            font-size: 16px;
            color: #606266;
          }
        }
        // 功能上线删除
        // &::after {
        //   content: '暂未开放';
        //   position: absolute;
        //   bottom: 10px;
        //   right: 10px;
        //   font-size: 12px;
        // }
      }
    }
  }
  .quick_operation {
    margin-left: 20px;
    ul {
      margin-bottom: 10px;
      @extend .flex_row;
      li {
        position: relative;
        box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.06);
        border-radius: 6px;
        height: 145px;
        background-color: #ffffff;
        flex: 1;
        margin-right: 1%;
        @extend .flex_column_center;
        &.locked {
          position: relative;
          &:hover {
            &:before {
              content: "暂无权限";
              color: #fff;
              height: 100%;
              width: 100%;
              background: rgba(0, 0, 0, 0.5);
              position: absolute;
              text-align: center;
              z-index: 99;
              line-height: 150px;
            }
            .icon-icon_ope_lock {
              position: absolute;
              left: 50%;
              margin-left: -8px;
              top: 44px;
              z-index: 100;
              color: #fff;
            }
          }
          .icon-icon_ope_lock {
            position: absolute;
            right: 8px;
            bottom: 8px;
          }
        }
        &:last-child {
          margin-right: 0;
        }
        cursor: pointer;
        img {
          @include img(56px, 0);
        }
        p {
          font-size: 20px;
          padding-top: 14px;
        }
      }
    }
  }
  .today_chart {
    margin: 40px 0 20px 20px;
    div.chart-box {
      width: 100%;
      height: 100%;
      @extend .flex_row;
    }
    .today_collection {
      position: relative;
      border-radius: 6px;
      box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.06);
      margin-right: 1.1%;
      flex: 1;
      background: #fff;
      // width: 400px;
      height: 482px;
      display: flex;
      flex-direction: column;
      .coll_title {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        @extend .flex_row_center;
        p {
          // text-align: center;
          flex: 1;
        }
        .title {
          font-size: 22px;
          margin-left: 48px;
        }
      }
      .pie_area {
        // margin-left: 10%;
        // margin-top: 10%;
        // width: 80%;
        // height: 80%;
        flex: 1;
        padding: 10px;
      }
      // 自定义lengend
      .legend {
        /* ul {
          width: 90%;
          margin-left: 6%;
          @extend .flex_row;
          li {
            flex: 1;
            font-size: 14px;
            text-align: center;
            span {
              display: inline-block;
              width: 10px;
              height: 10px;
              margin-right: 10px;
              border-radius: 50%;
            }
            .legend1 {
              background: #4edbac;
            }
            .legend2 {
              background: #6b95ff;
            }
            .legend3 {
              background: #ffc606;
            }
            .legend4 {
              background: #41cac0;
            }
            .legend5 {
              background: #67d3f5;
            }
          }
        } */
      }
    }
    .today_tendency_chart {
      position: relative;
      border-radius: 6px;
      box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.06);
      flex: 2.02;
      background: #fff;
      @extend .flex_column;
      height: 482px;
      // margin-left: 1%;
      .coll_title {
        margin: 30px 20px 0 40px;
        @extend .flex_row;
        p {
          flex: 1;
          font-size: 22px;
          line-height: 43px;
          span {
            color: #9b9b9b;
            font-size: 14px;
            padding-left: 20px;
            vertical-align: middle;
          }
        }
      }
      .line_area {
        flex: 1;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.el-popover {
  padding: 0 !important;
}
#gm_console .el-select .el-input .el-select__caret {
  color: #e22c37 !important;
  font-size: 24px;
}
#gm_console .el-input__inner {
  width: 125px;
  border-radius: 20px;
}
.popver_title {
  color: #9b9b9b;
  font-size: 14px;
  margin-top: 10px;
}
.user_msg {
  width: 245px;
  height: 88px;
  padding-left: 17px;
  padding-top: 5px;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  .user_oper {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    p {
      cursor: pointer;
      flex: 1;
      img {
        width: 14px;
        height: 14px;
        margin-right: 12px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
    }
  }
}
.user_subscibe {
  height: 100px;
  padding-left: 17px;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  .user_edition {
    margin: 15px 0;
    span {
      margin-left: 4px;
    }
  }
  .subscibe_oper {
    span {
      color: #e22c37;
      margin-right: 32px;
      cursor: pointer;
    }
  }
}
.user_help {
  padding-top: 5px;
  padding-left: 17px;
  height: 138px;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  .user_phone {
    margin: 15px 0 20px 0;
  }
  .help_manage {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    img {
      width: 36px;
      height: 36px;
      display: inline-block;
      border-radius: 50%;
      margin-right: 15px;
    }
  }
}
.user_btn {
  display: flex;
  flex-direction: row;
  p {
    flex: 1;
    text-align: center;
    line-height: 44px;
    height: 44px;
    cursor: pointer;
  }
  .logout {
    color: #c4c7cd;
    border-left: 1px solid #ebebeb;
  }
}
.title-rotate-box {
  width: 40px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  display: inline-block;
  .loaded-box {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
.deving {
  &::before {
    content: "暂未开放";
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 12px;
  }
}
.filter-line {
  display: flex;
  margin-right: 20px;
}
</style>
