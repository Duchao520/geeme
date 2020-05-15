<template>
  <div class="wallet-box">
    <div class="top-search">
      <div class="top-search-left">
        <el-date-picker
          :clearable="true"
          v-model="date"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <div class="select-box" v-if="currentType === 'withdraw'">
          状态筛选：
          <el-select
            v-model="filterData.status"
            placeholder="所有状态"
            clearabled
            @change="changeSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 充值渠道 -->
        <div class="select-box" v-if="currentType === 'reCharge' && currentEntry === 'brand'">
          充值渠道：
          <el-select
            v-model="filterData.storeId"
            placeholder="充值渠道"
            @change="channelChangeSelect"
          >
            <el-option
              v-for="item in channelsOptions"
              :key="item.storeId"
              :label="item.city ? item.city + ' ' + item.storeName : item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>
        <!-- 操作门店 -->
        <div class="select-box"  v-if="currentType === 'withdraw' && currentEntry === 'brand'">
        操作门店：
          <el-select
            v-model="filterData.storeId"
            placeholder="操作门店"
            @change="shopChangeSelect"
          >
            <el-option
              v-for="item in shopsOptions"
              :key="item.storeId"
              :label="item.city ? item.city + ' ' + item.storeName : item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <input-search width="320px" placeholder="请输入客户姓名/手机号" @search="searchData" v-model="keyword"></input-search>
    </div>
    <ul class="top-money">
      <li v-for="item in top_money" :key="item.id" :style="{width: `${100 / top_money.length}%`}">
        <div class="content-info">
          <img :src="item.path" />
          <div class="right-info">
            <div class="h3" :title="item.money">{{item.money}}</div>
            <p>{{item.text}}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="customer_container container_normal" style="border-radius:8px;overflow:hidden">
      <div class="user-defined-tab">
        <el-tabs v-model="currentType" type="card" ref="tabsRef" @tab-click="changeTab">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="item.code"
            :ref="item.code+'Ref'"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-box">
        <component
          ref="componentRef"
          :is="currentType"
          :filterData="filterData"
          :keyword="keyword"
          :dateFlag="dateFlag"
          @changeFlag="changeFlag"
          @changeData="changeData"
        />
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState, mapActions } from "vuex";
import reCharge from "./components/record/reCharge_table";
import withdraw from "./components/record/withdraw_table";

export default {
  data() {
    return {
      // 日期切换标识
      dateFlag: false,
      date: [],
      formDisabled: false,
      options: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "1",
          label: "待处理"
        },
        {
          value: "2",
          label: "已拒绝"
        },
        {
          value: "3",
          label: "已转账"
        },
        {
          value: "4",
          label: "已取消"
        }
      ],
      channelsOptions: [],
      shopsOptions: [],
      // channelsShopOptions: [
      //   {
      //     value: 0,
      //     label: "线上自助"
      //   },
      //   {
      //     value: 1,
      //     label: "线下门店"
      //   }
      // ],
      top_money: [
        {
          id: 0,
          text: "累计钱包充值",
          path:
            "/static/images/ordermanagement/icon_Total_wallet _recharge.png",
          money: ""
        },
        {
          id: 1,
          text: "钱包充值余额",
          path:
            "/static/images/ordermanagement/icon_Accumulated_withdrawal_and_transfer.png",
          money: ""
        },
        {
          id: 2,
          text: "累计申请提现",
          path:
            "/static/images/ordermanagement/icon_Accumulated_application_for_withdrawal.png",
          money: ""
        },
        {
          id: 3,
          text: "累计提现转账",
          path: "/static/images/ordermanagement/icon_Order_amount.png",
          money: ""
        }
      ],
      currentType: "reCharge",
      // selectStatus: [
      //   { code: "reCharge", value: "充值记录" },
      //   { code: "withdraw", value: "提现记录" }
      // ],
      filterData: {
        mobile: null,
        pageNum: 0,
        pageSize: 10,
        username: null,
        storeId: null,
        status: null
      },
      // 搜索框数据
      keyword: ""
    };
  },
  created() {
    this.getShopList();
    // 默认获取当月的的Money信息
    let paramsDate = new Date();
    let paramsDateYear = paramsDate.getFullYear();
    let paramsDateMonth = paramsDate.getMonth() + 1;
    let paramsDateDay = utils.formatDateMonthDay(
      paramsDateYear,
      paramsDateMonth
    );
    paramsDateMonth =
      (paramsDateMonth + "").length == 1
        ? `0${paramsDateMonth}`
        : paramsDateMonth;
    // 获取该月的天数
    this.date = [
      `${paramsDateYear}-${paramsDateMonth}-01 00:00:00`,
      `${paramsDateYear}-${paramsDateMonth}-${paramsDateDay} 23:59:59`
    ];
    // this.getCashSum();
  },
  methods: {
    // 获取门店列表
    async getShopList() {
      const res = await axios.post("/getCashInOutStoreInfo", {
        brandId: this.currentInfo.brandId,
        type: this.currentType == "reCharge" ? 1 : 2
      });
      this.channelsOptions = JSON.parse(JSON.stringify(res.cityInfoList || []));
      this.shopsOptions = JSON.parse(JSON.stringify(res.cityInfoList || []));
      this.channelsOptions.unshift(
        {
          storeId: null,
          storeName: "全部"
        },
        {
          storeId: 0,
          storeName: "线上自助"
        }
      );
      this.shopsOptions.unshift({
        storeId: null,
        storeName: "全部"
      },{
        storeId: 0,
        storeName: "总部"
      });
    },
    // 子向父传事件
    changeFlag() {
      this.dateFlag = false;
    },
    getCashSum() {
      if (this.currentEntry === "brand") {
        this.getCashSum_Brand();
        this.top_money = [
          {
            id: 0,
            text: "累计钱包充值",
            path:
              "/static/images/ordermanagement/icon_Total_wallet _recharge.png",
            money: ""
          },
          {
            id: 1,
            text: "钱包充值余额",
            path:
              "/static/images/ordermanagement/icon_Accumulated_withdrawal_and_transfer.png",
            money: ""
          },
          {
            id: 2,
            text: "累计钱包消费",
            path:
              "/static/images/ordermanagement/icon_Accumulated_application_for_withdrawal.png",
            money: ""
          },
          {
            id: 3,
            text: "累计提现转账",
            path: "/static/images/ordermanagement/icon_Order_amount.png",
            money: ""
          }
        ];
      } else {
        this.getCashSum_shop();
        this.top_money = [
          {
            id: 0,
            text: "本店累计钱包充值",
            path:
              "/static/images/ordermanagement/icon_Total_wallet _recharge.png",
            money: ""
          },
          {
            id: 1,
            text: "本店累计钱包消费",
            path:
              "/static/images/ordermanagement/icon_Accumulated_application_for_withdrawal.png",
            money: ""
          },
          {
            id: 2,
            text: "本店累计钱包提现",
            path: "/static/images/ordermanagement/icon_Order_amount.png",
            money: ""
          }
        ];
      }
    },
    // 获取统计结果 - 品牌专用
    async getCashSum_Brand() {
      // this.date = this.date ? this.date : []
      let params = {
        brandId: this.currentInfo.brandId
        // storeId: this.currentInfo.shopId
      };
      params.startTime = this.date && this.date.length && this.date[0];
      params.endTime = this.date && this.date.length && this.date[1];
      const res = await axios.post("/getCashOutSumInfo", params);
      this.top_money[0].money = this.setToPriceNumber(res.totalCashInAmount);
      this.top_money[1].money = this.setToPriceNumber(res.restCashInAmount); // 这个字段 后端会给null
      this.top_money[2].money = this.setToPriceNumber(res.totalUseAmount);
      this.top_money[3].money = this.setToPriceNumber(res.totalTransferAmount);
    },
    // 获取统计数据 - 门店
    async getCashSum_shop() {
      let params = {
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        startTime: this.date && this.date.length && this.date[0],
        endTime: this.date && this.date.length && this.date[1],
        pageNum: 1,
        pageSize: 1
      };
      let res = await axios.post("/getCashInRecordForStoreStaff", params);
      this.top_money[0].money = this.setToPriceNumber(res.totalCashInAmount);
      this.top_money[1].money = this.setToPriceNumber(res.totalUseAmount);
      this.top_money[2].money = this.setToPriceNumber(res.totalCashOutAmount);
    },
    setToPriceNumber(num = 0) {
      return Number(num).toFixed(2);
    },
    // 搜索事件
    searchData(data) {
      this.keyword = data;
    },
    // tab切换事件
    changeTab() {
      this.value = "";
      // 当tab为充值记录时，调用子组件事件实现数据刷新
      if (this.currentType === "reCharge") {
        this.$nextTick(() => {
          this.$refs.componentRef.getRecharge();
        });
      }
    },
    // 清除状态筛选
    changeSelect(val) {
      this.$refs.componentRef.getCashOut();
    },
    shopChangeSelect(val) {
      this.$refs.componentRef.getCashOut();
    },
    channelChangeSelect() {
      this.$refs.componentRef.getRecharge_brand();
    },
    changeData() {
      this.getCashSum_shop()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    selectStatus() {
      if (this.currentEntry === "brand") {
        return [
          { code: "reCharge", value: "充值记录" },
          { code: "withdraw", value: "提现记录" }
          // { code: "costRecord", value: "消费记录" },
        ];
      } else {
        return [
          { code: "reCharge", value: "充值记录" },
          { code: "withdraw", value: "提现记录" }
          // { code: "costRecord", value: "消费记录" },
        ];
      }
    }
  },
  watch: {
    date: {
      handler(val) {
        this.filterData.startTime = val ? val[0] : "";
        this.filterData.endTime = val ? val[1] : "";
        this.dateFlag = true;
        this.getCashSum();
      },
      deep: true
    },
    currentType() {
      this.filterData.storeId = null
      this.getShopList();
    }
  },
  filters: {},
  components: { reCharge, withdraw }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";

.wallet-box {
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .top-search {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 20px 0;

    .top-search-left {
      display: flex;
      align-items: center;
      .select-box {
        margin-left: 21px;
      }
    }
  }

  .search-default {
    border-radius: 4px;
    margin-top: 20px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 320px);
  }

  //中间钱包列表
  .top-money {
    background-color: #fff;
    width: 100%;
    height: 92px;
    display: flex;
    // justify-content: space-around;
    padding: 10px 0;
    li {
      height: 100%;
      // background: red;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      overflow: hidden;
      & > div.content-info {
        display: flex;
        align-items: center;
        width: 100%;
        img {
          width: 60px;
          height: 60px;
          margin: 0 6%;
        }
        div.right-info {
          flex: 1;
          margin-right: 16px;
          overflow: hidden;
          .h3 {
            width: 100%;
            font-weight: normal;
            color: rgba(153, 153, 153, 1);
            font-size: 32px;
            text-align: left;
            font-family: PingFangSC-Light;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            color: rgba(102, 102, 102, 1);
            font-size: 16px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
        }
      }
      // i {
      //   height: 90px;
      //   width: 2px;
      //   border-radius: 2px;
      //   background-color: rgba(233, 233, 233, 1);
      // }
    }
    li + li {
      border-left: 2px solid rgb(233, 233, 233);
    }
  }
}
</style>
