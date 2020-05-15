<template>
  <div class="wallet-box" v-loading="loading">
    <div class="top-search">
      <div class="top-search-left">
        <p v-if="currentType == 'rollOut'">申请时间：</p>
        <el-date-picker
          :clearable="true"
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <!-- 操作门店 -->
        <div class="select-box" v-if="currentType === 'income' && currentEntry === 'brand'">
          操作门店：
          <el-select v-model="filterData.storeId" placeholder="操作门店" @change="shopChangeSelect">
            <el-option
              v-for="item in shopsOptions"
              :key="item.storeId"
              :label="item.city ? item.city + ' ' + item.storeName : item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <input-search
        width="320px"
        :placeholder="currentType == 'storeAccount' ? '请输入门店名称' : '请输入客户姓名/手机号'"
        @search="searchData"
        v-model="filterData.keyWord"
      ></input-search>
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
          :keyWord="keyWord"
          @changeFlag="changeFlag"
        />
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState, mapActions } from "vuex";
import income from "./components/income";
import rollOut from "./components/rollOut";
import storeAccount from "./components/storeAccount";

export default {
  data() {
    return {
      date: [],
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
      shopsOptions: [],
      top_money: [
        {
          id: 0,
          text: "累计权益金收入",
          path: "/static/images/ordermanagement/icon_rights01.png",
          money: ""
        },
        {
          id: 1,
          text: "累计权益金转出",
          path: "/static/images/ordermanagement/icon_rights02.png",
          money: ""
        },
        {
          id: 2,
          text: "客户权益金余额",
          path: "/static/images/ordermanagement/icon_rights03.png",
          money: ""
        }
      ],
      currentType: "income",
      filterData: {
        keyWord: null,
        timeFrom: null,
        timeTo: null,
        storeId: null
      },
      // 搜索框数据
      keyWord: "",
      loading: false
    };
  },
  created() {
    if (this.isBrand) {
      this.getShopList();
    }
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
      `${paramsDateYear}-${paramsDateMonth}-01`,
      `${paramsDateYear}-${paramsDateMonth}-${paramsDateDay}`
    ];
    // this.getCashSum();
  },
  methods: {
    // 获取门店列表
    async getShopList() {
      const res = await axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`);
      this.shopsOptions = JSON.parse(JSON.stringify(res.storeBasicInfoList || []));
      this.shopsOptions.unshift({
        storeId: null,
        storeName: "全部"
      });
    },
    // 子向父传事件
    changeFlag() {
      this.dateFlag = false;
    },
    // 获取记录数据
    async getCashSum() {
      try {
        this.loading = true;
        console.log(this.date);
        const res = await axios.post("/getPreMoneySumInfoForPc", {
          brandId: this.currentInfo.brandId,
          storeId: this.isBrand
            ? this.filterData.storeId
            : this.currentInfo.shopId,
          dateFrom: (this.date && this.date.length && this.date[0]) || null,
          dateTo: (this.date && this.date.length && this.date[1]) || null
        });
        this.top_money[0].money = this.setToPriceNumber(res.moneyIn);
        this.top_money[1].money = this.setToPriceNumber(res.moneyOut); // 这个字段 后端会给null
        this.top_money[2].money = this.setToPriceNumber(res.preMoney);
      } finally {
        this.loading = false;
      }
    },
    // 获取门店结算数据， 仅总部
    async getAccountSum() {
      try {
        this.loading = true;
        console.log(this.date);
        const res = await axios.post("/getPreMoneyBillSumInfo", {
          brandId: this.currentInfo.brandId,
          dateFrom: (this.date && this.date.length && this.date[0]) || null,
          dateTo: (this.date && this.date.length && this.date[1]) || null
        });
        this.top_money[0].money = this.setToPriceNumber(res.applyWalletOut);
        this.top_money[1].money = this.setToPriceNumber(res.waitingBillAmount); 
        this.top_money[2].money = this.setToPriceNumber(res.waitingDealAmount);
        this.top_money[3].money = this.setToPriceNumber(res.walletBilledMoney);
      } finally {
        this.loading = false;
      }
    },
    setToPriceNumber(num = 0) {
      return Number(num).toFixed(2);
    },
    // 搜索事件
    searchData(data) {
      this.filterData.keyWord = data;
      this.$refs.componentRef.getIncomeRecord();
    },
    // tab切换事件
    changeTab() {},
    // 门店切换
    shopChangeSelect(val) {
      this.filterData.storeId = val
      this.$nextTick(() => {
        if (this.currentType == 'storeAccount') {
          this.getAccountSum()
        } else {
          this.getCashSum()
        }
        this.$refs.componentRef.getIncomeRecord();
      })
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    isBrand() {
      return this.currentEntry == "brand";
    },
    selectStatus() {
      if (this.currentEntry === "brand") {
        return [
          { code: "income", value: "收入记录" },
          { code: "rollOut", value: "转出记录" },
          { code: "storeAccount", value: "门店结算" }
        ];
      } else {
        return [
          { code: "income", value: "收入记录" },
          { code: "rollOut", value: "转出记录" }
          // { code: "costRecord", value: "消费记录" },
        ];
      }
    }
  },
  watch: {
    date: {
      handler(val, o) {
        this.filterData.timeFrom = val ? val[0] : "";
        this.filterData.timeTo = val ? val[1] : "";
        if (this.currentType == 'storeAccount') {
          this.getAccountSum()
        } else {
          this.getCashSum();
        }
        this.$nextTick(() => {
          this.$refs.componentRef.getIncomeRecord();
        });
      },
      deep: true
    },
    currentType(val, o) {
      this.filterData.storeId = null;
      this.filterData.keyWord = null;
      // this.getShopList();
      if (val == "storeAccount") {
        this.top_money = [
          {
            id: 0,
            text: "累计申请转入钱包金额",
            path: "/static/images/ordermanagement/icon_rights04.png",
            money: ""
          },
          {
            id: 1,
            text: "累计待处理金额",
            path: "/static/images/ordermanagement/icon_rights05.png",
            money: ""
          },
          {
            id: 2,
            text: "累计已结算金额",
            path: "/static/images/ordermanagement/icon_rights06.png",
            money: ""
          },
          {
            id: 3,
            text: "累计待结算金额",
            path: "/static/images/ordermanagement/icon_rights07.png",
            money: ""
          }
        ];
        this.getAccountSum()
      }
      // 从tag1=》tag2在品牌端也需要刷新顶部数据
      if (o == "storeAccount" || (o == 'income' && this.isBrand)) {
        this.top_money = [
          {
            id: 0,
            text: "累计权益金收入",
            path: "/static/images/ordermanagement/icon_rights01.png",
            money: ""
          },
          {
            id: 1,
            text: "累计权益金转出",
            path: "/static/images/ordermanagement/icon_rights02.png",
            money: ""
          },
          {
            id: 2,
            text: "客户权益金余额",
            path: "/static/images/ordermanagement/icon_rights03.png",
            money: ""
          }
        ];
        this.getCashSum();
      }
      this.$nextTick(() => {
        this.$refs.componentRef.getIncomeRecord();
      });
    }
  },
  filters: {},
  components: { income, rollOut, storeAccount }
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
