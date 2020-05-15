<template>
  <div class="cashier-root">
    <div v-loading.fullscreen.lock="loading">
      <div class="top-search">
        <div class="header-btns">
          <red-button
          v-if="checkHasBtnPermission('/shop-inner/choose-person','path')"
          buttonText="快速开单"
          @click="toChoosePerson"
        ></red-button>
          <red-button
          style="margin-left: 20px;"
          buttonText="预收款充值"
          :iconVisible="false"
          @click="() => {rechargeDialogVisible=true; timer = new Date().getTime()}"
        ></red-button>
        </div>
        <span v-if="!checkHasBtnPermission('/shop-inner/choose-person','path')"></span>
        <input-search
          v-if="currentStatus === 'cashier'"
          width="320px"
          placeholder="搜索客户姓名/服务单号/开单人/纸单号"
          v-model="keyword"
          @search="esConsumerOrderList()"
          :currentStatus="currentStatus"
        ></input-search>
      </div>
      <order-header
        @changeShowType="changeShowType"
        ref="orderHeader"
        :type="type"
        :billNumberInfo="billNumberInfo"
        @change="change"
        @go-back="backToCashier"
        :currentStatus="currentStatus"
        @goToRecycle="goToRecycle"
        @goToRepealOrders="goToRepealOrders"
      ></order-header>
      <div>
        <el-row v-if="showType==='card'" id="con" class="cash-list-card">
          <div class="CashierList" v-show="orderList&&orderList.length>0">
            <!-- takeOrder 取单, superToPay 支付 -->
            <checkout-counter-card
              v-for="(data,index) in orderList"
              :key="index"
              :orderData="data"
              @takeOrder="takeOrder"
              @superToPay="handleToPay"
              @deleteOrder="deleteOrder"
              :currentStatus="currentStatus"
              @afterRestore="esConsumerOrderList"
              @checkCanBackout="handleCheckCanBackout"
            ></checkout-counter-card>

            <div
              v-for="index in 30"
              :key="index+Math.random()"
              style="visibility:hidden;width:227px;margin: 0 20px 0 0;"
            ></div>
          </div>
          <!-- 这个缺省仅限今天使用，今天彻底没有单！（情况一：1.有单(todayCount!==0)2.今日彻底无单3.除了今日彻底无单之外的无单）
                1、有单：total！==0  显示即可
                2、今日无单 todayCount===0&&params.timeDay===0，无单且今天
                3、筛选无单
          -->
          <cashier-default
            :currentStatus="currentStatus ==='cashier'?'cashierList':'recycle'"
            v-if="todayCount===0&&params.timeDay===0"
            @openBill="toChoosePerson"
          ></cashier-default>
          <!-- 非：查到了单、今日无单 -->
          <div class="search-default" v-if="!(total!==0 || todayCount===0&&params.timeDay===0)">
            <search-default style="margin:10% 0" @clear-back="clearBack"></search-default>
          </div>
        </el-row>
        <div v-if="showType==='list'">
          <!-- 统计组件 -->
          <cashier-card-list
            :filterTime="timeAndTypeParams"
            :orderList="orderList"
            :inRecycle="currentStatus==='recycle'"
            @afterRestore="esConsumerOrderList"
            @checkCanBackout="handleCheckCanBackout"
          ></cashier-card-list>
        </div>
      </div>
      <div class="footer" :style="{'background':showType==='list'?'#fff':'transparent'}">
        <div class="left-btns">
          <!-- 以下按钮移动到 order-header 组件 -->
          <!-- <g-button
            class="button"
            :name="'服务单回收站'"
            :padding="'6.25px 8px'"
            :type="'cancel'"
            :icon="'icon_operate_delete'"
            v-if="showType==='card' && currentStatus ==='cashier' && checkHasBtnPermission('shop_cashier_deleteOrder')"
            @click="goToRecycle"
          ></g-button>

          <g-button
            class="button"
            :name="'已撤销服务单'"
            :padding="'6.25px 8px'"
            :type="'cancel'"
            :icon="'icon_ope_revoke'"
            v-if="showType==='card' && currentStatus ==='cashier' && checkHasBtnPermission('shop_cashier_deleteOrder')"
            @click="goToRepealOrders"
          ></g-button>-->
        </div>

        <div
          v-if="!(showType==='card' && currentStatus ==='cashier' && checkHasBtnPermission('shop_cashier_deleteOrder'))"
        ></div>
        <div class="footer-right" v-if="total">
          <cash-pagination
            :pageSize="pageSize"
            :currentPage="currentPage"
            :totalCount="total"
            @handleCurrentChange="handleCurrentChange"
          ></cash-pagination>
        </div>
      </div>
      <!-- v-if 重置原因 -->
      <delete-order-reason
        :dialogVisible="dialogVisible"
        v-if="dialogVisible"
        @close="dialogVisible=false"
        @deleteConsumerOrder="deleteConsumerOrder"
      ></delete-order-reason>
    </div>
    <!-- 订单结算 -->
    <settle-accounts
      ref="settleAccountsRef"
      :visible="visible"
      :detail="settleAccountsDetail"
      @closeSettleAccounts="visible=false"
    ></settle-accounts>
    <!-- 撤单的对话框 -->
    <g-dialog-with-slot
      :dialogVisible="slotDialogVisible"
      v-if="slotDialogVisible"
      :color="backoutInfo.color"
      :title="backoutInfo.title"
      :icon="backoutInfo.icon"
      @close="slotDialogVisible = false"
      @resolve="handleBackoutOrder"
    >
      <div>{{backoutInfo.text}}</div>

      <!-- 新加的撤单理由， 暂时用标题处理显示.. -->
      <el-form
        ref="backoutForm"
        v-if="backoutInfo.title === '确定撤单吗？'"
        :model="backoutForm"
        :rules="backoutFormRules"
        class="backout-form"
      >
        <el-form-item label="撤单原因" prop="reason">
          <el-select v-model="backoutForm.reason" placeholder="请选择撤单原因">
            <el-option label="客户钱扣错了" value="客户钱扣错了"></el-option>
            <el-option label="会员卡选错了" value="会员卡选错了"></el-option>
            <el-option label="员工选错了" value="员工选错了"></el-option>
            <el-option label="业绩比例不对" value="业绩比例不对"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </g-dialog-with-slot>
    <!-- 预收款充值 -->
    <!-- <el-dialog title="预收款充值" class="recharge" :visible.sync="rechargeDialogVisible" width="960px" @close="()=>{this.$refs.advancesRef.resetInfo()}"> -->
      <advances-received :visible="rechargeDialogVisible" :detail="settleAccountsDetail" @closeAdvances="rechargeDialogVisible = false"></advances-received>
    <!-- </el-dialog> -->
  </div>
</template>
<script>
import orderHeader from "@/components/order/orderHeader.vue";
import Cashpagination from "@/components/order/Cashpagination.vue";
import CashierListList from "@/components/order/CashierListList.vue";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import base from "@/util/base";
import { mapActions } from "vuex";
import CheckoutCounterCard from "@/components/order/CheckoutCounterCard.vue";
import DeleteOrderReason from "@/components/order/DeleteOrderReason.vue";
import CashierDefault from "@/components/order/CashierDefault.vue";
import SettleAccounts from "@/components/createOrder/settleAccounts/SettleAccounts";
import AdvancesReceived from "./components/advancesReceived";
import "@/assets/css/base.scss";

export default {
  name: "cashierList",
  components: {
    "order-header": orderHeader,
    "cash-pagination": Cashpagination,
    "cashier-card-list": CashierListList,
    "checkout-counter-card": CheckoutCounterCard,
    "delete-order-reason": DeleteOrderReason,
    "cashier-default": CashierDefault,
    SettleAccounts,AdvancesReceived
  },
  data() {
    return {
      dialogVisible: false,
      formatTime: utils.formatDateTimeFromYearToMinute,
      orderToDelId: null,
      type: "CashierList",
      orderList: [],
      currentPage: 1,
      pageSize: 10,
      allCount: 0,
      total: 0,
      todayCount: 0,
      cashOrderInfo: {},
      keyword: null,
      timeAndTypeParams: {},
      showType: "card",
      // scope: "ALL",
      scope: "All",
      currentStatus: "cashier",
      billNumberInfo: {},
      loading: true,
      firstEnter: true,
      // 支付相关
      visible: false, // 支付模态框
      settleAccountsDetail: {}, // 订单内容对象
      slotDialogVisible: false, // 撤单
      backoutInfo: {
        title: "",
        icon: "",
        text: "",
        color: ""
      },
      canBackoutInfo: {}, // 能否撤单的数据
      backoutForm: {
        reason: ""
      },
      backoutFormRules: {
        reason: [{ required: true, message: "请选择撤单原因", trigger: "blur" }]
      },
      // 预收款充值对话框标识
      rechargeDialogVisible: false,
      // 让子组件每次重新加载
      timer: '',
    };
  },

  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    params() {
      let pageSize = (this.pageSize =
        this.showType === "list" ? 10 : this.pageSize);
      if (utils.isEmptyObject(this.timeAndTypeParams)) {
        return {
          storeId: this.currentInfo.shopId,
          currentPage: this.currentPage - 1,
          pageSize: pageSize,
          keyword: this.keyword,
          begin: utils.getZeroTime(0),
          end: utils.getZeroTime(1),
          // scope: this.showType === "list" ? "PAID" : this.scope,
          // scope: this.showType === "list" ? "Paid" : this.scope,
          scope:
            this.currentStatus === "recycle"
              ? "All"
              : this.showType === "list"
              ? "Paid"
              : this.scope,
          deleted: this.currentStatus !== "cashier",
          timeDay: 0
        };
      } else {
        return {
          deleted: this.currentStatus !== "cashier",
          storeId: this.currentInfo.shopId,
          ...this.timeAndTypeParams,
          currentPage: this.currentPage - 1,
          // scope: this.currentStatus === 'recycle' ? 'All' : this.showType === "list" ? 'Paid' : this.scope,
          scope: this.scope,
          pageSize: pageSize,
          keyword: this.keyword
        };
      }
    }
  },
  mounted() {
    this.initSomeValue();
    this.sizeChange();
    let _this = this;
    window.onresize = base.debounce(function() {
      _this.sizeChange();
    });
    // 支付按钮支付成功后
    this.$root.$on("initCashierListPage", () => {
      this.firstEnter = true;
      this.esConsumerOrderList();
      this.visible = false;
    });
  },
  methods: {
    ...mapActions([
      "saveBillInfo",
      "setBillId",
      "setPaperId",
      "setIsCount",
      "clearBillInfo",
      "saveCustomerInfo",
      "saveStaffInfo",
      "setBillOrigin",
      "setConsumerOrderId",
      "saveCurrentInfo",
      "setBillChooseGoodsType",
      "setProtectedGoodsType",
      "setSelectedVipCardId",
      "clearVipCardInfo",
      "setCustomerHasCard",
      "setCustomerHasPrepaidCard",
      "setTheTotalBill",
      "setAvailableVipCardList",
      "setPayType"
    ]),
    initSomeValue() {
      this.setProtectedGoodsType(null);
      // 卡买服务、产品
      this.setCustomerHasCard(false);
      // 卡买卡
      this.setCustomerHasPrepaidCard(false);
      this.clearVipCardInfo();
      this.clearBillInfo();
    },
    sizeChange() {
      this.$nextTick(() => {
        let DOM = document.getElementById("con");
        if (!DOM) {
          return;
        }
        let w = DOM.clientWidth;
        let pageSize = Math.floor(w / 247) * 3;
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.esConsumerOrderList();
      });
    },
    changeShowType(showType) {
      this.showType = showType;
      if (showType === "list" && this.currentStatus == "cashier") {
        //当切换至卡片式时，自动请求已结单的单子
        // this.scope = "PAID";
        this.scope = "Paid";
        this.orderList = [];
      } else {
        // this.scope = "ALL";
        this.scope = "All";
        this.orderList = [];
      }
      this.esConsumerOrderList();
    },
    backToCashier() {
      this.currentStatus = "cashier";
      this.$refs.orderHeader.showType = "card"; // 这样重置下...
      this.esConsumerOrderList();
    },
    esConsumerOrderList() {
      this.loading = true;
      this.clearVipCardInfo();
      this.clearBillInfo();
      setTimeout(
        () => {
          axios.post(api.esConsumerOrderList.url, this.params).then(res => {
            this.esConsumerOrderListRes(res);
          });
        },
        this.firstEnter ? 500 : 0
      );
    },
    esConsumerOrderListRes(res) {
      this.orderList = res.consumerOrders;
      this.total = res.total;
      this.allCount = res.allCount;
      this.loading = false;
      this.todayCount = res.todayCount;
      this.firstEnter = false;
      this.billNumberInfo = {
        allCount: res.allCount,
        paidCount: res.paidCount,
        unPaidCount: res.unPaidCount,
        unBillingCount: res.unBillingCount
      };
    },
    change(params) {
      this.timeAndTypeParams = params;
      this.currentPage = 1;
      if (this.currentStatus === "recycle") {
        this.orderList = [];
      } else {
        this.scope = params.scope;
      }
      this.esConsumerOrderList();
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.esConsumerOrderList();
    },
    deleteOrder(data) {
      this.dialogVisible = true;
      this.orderToDelId = data.id;
    },
    deleteConsumerOrder(reason) {
      if (reason) {
        axios
          .post(api.deleteConsumerOrder.url, {
            id: this.orderToDelId,
            reason: reason
          })
          .then(res => {
            this.deleteConsumerOrderRes(res);
          });
      } else {
        this.$message({
          type: "error",
          message: "请选择删除原因"
        });
      }
    },
    deleteConsumerOrderRes(res) {
      this.dialogVisible = false;
      this.firstEnter = true;
      this.esConsumerOrderList();
      this.$message({
        type: res.success ? "success" : "warning",
        message: res.success ? "删除服务单成功" : res.message
      });
    },
    takeOrder(data) {
      this.saveStaffInfo({
        id: data.staffId,
        headPortrait: data.staffHeadPortrait,
        levelId: data.levelId,
        name: data.staffName
      });
      axios.get("/getConsumerOrderInfoById/" + data.id).then(res => {
        this.takeOrderCallback(res);
        this.setBillId(res.billId); // 新的统一处理账单id
        this.setPaperId(res.paperOrderId); // - 纸单
        this.setIsCount(res.isCount); // - 设置计客数
      });
    },
    takeOrderCallback(res) {
      if (
        Array.isArray(res.listConsumerOrderCardInfo) &&
        res.listConsumerOrderCardInfo.length
      ) {
        this.setBillChooseGoodsType("card"); //是开卡的
        this.setProtectedGoodsType("card");
      } else {
        this.setProtectedGoodsType("goods");
      }
      this.saveBillInfo(res);
      this.saveCustomerInfo({
        headPortrait: res.customerHeadPortrait,
        name: res.customerName,
        sex: res.customerSex,
        mobile: res.mobile,
        memberLevel: res.customerMemberLevel,
        id: res.customerId
      });
      this.setBillOrigin("cashierList");
      this.setConsumerOrderId(res.id);
      this.saveCardId(res);
      this.$router.push("/shop-inner/choose-service");
    },
    saveCardId(res) {
      if (res.identityCardId) {
        this.setSelectedVipCardId({ type: "identity", id: res.identityCardId });
      } else if (res.prepaidCardId) {
        this.setSelectedVipCardId({ type: "prePaid", id: res.prepaidCardId });
      } else if (res.timeCardId) {
        this.setSelectedVipCardId({ type: "timeCard", id: res.timeCardId });
      } else if (res.countCardId) {
        this.setSelectedVipCardId({ type: "countCard", id: res.countCardId });
      }
    },
    toChoosePerson() {
      this.setIsCount(true); // - 设置计客数
      this.$router.push("/shop-inner/choose-person");
    },
    goToRecycle() {
      this.currentStatus = "recycle";
      this.scope = "All";
      this.orderList = [];
      this.total = 0;
      this.esConsumerOrderList();
    },
    clearBack() {
      this.keyword = null;
      this.$refs.orderHeader.clearAndrefresh();
    },
    // 支付
    async handleToPay(order) {
      let res = await axios.get(`/getConsumerOrderInfoById/${order.id}`);
      this.settleAccountsDetail = res;
      this.setBillId(res.billId); // 新的统一处理账单id
      this.setPaperId(res.paperOrderId); // - 纸单
      this.setTheTotalBill(res.finalPrice);
      this.$refs.settleAccountsRef.initPayType();
      this.setBillOrigin("cashierList");
      this.setConsumerOrderId(res.id);
      this.saveCardId(res); // 显示使用的会员卡用的
      let id =
        res.identityCardId ||
        res.prepaidCardId ||
        res.countCardId ||
        res.timeCardId;
      this.setPayType(2);
      if (id) {
        this.getCardInfoForPayByCardId(id);
        if (!res.identityCardId) {
          this.setPayType(3); // 身份卡以外的其他卡支付
        }
      }
      this.visible = true;
    },
    async getCardInfoForPayByCardId(id) {
      let res = await axios.get(`/getCustomerCardDetailInfo/${id}`);
      let type = "";
      //  0 身份卡 1 储值卡 2 次卡 3 时间卡
      switch (res.cardType) {
        case 0:
          type = "identity";
          break;
        case 1:
          type = "prepaid";
          break;
        case 2:
          type = "countCard";
          break;
        case 3:
          type = "timeCard";
          break;
      }
      let obj = {
        canPay: true,
        type: type,
        customerCardId: id,
        ...res
      };
      this.setAvailableVipCardList([obj]);
    },
    // ====== 撤单 ======
    goToRepealOrders() {
      this.$emit("suberEmit", "backout");
    },
    // 确认撤单按钮
    handleBackoutOrder() {
      if (this.canBackoutInfo.success) {
        this.$refs.backoutForm.validate(valid => {
          if (valid) {
            // 请求撤单接口
            this.loading = true;
            axios
              .post("/rescindConsumerOrder", {
                id: this.canBackoutInfo.id,
                reason: this.backoutForm.reason
              })
              .then(res => {
                this.$message({
                  type: res.success ? "success" : "error",
                  message: res.message
                });
                this.slotDialogVisible = false;
                this.firstEnter = true;
                this.esConsumerOrderList();
                this.backoutForm.reason = ""; // 重置原因
                this.loading = false;
              })
              .catch(err => {
                this.loading = false;
              });
          }
        });
      } else {
        this.slotDialogVisible = false;
        this.backoutForm.reason = ""; // 重置原因
      }
    },
    // 获取到是否可以撤单的回调
    handleCheckCanBackout(data) {
      this.canBackoutInfo = data;
      this.slotDialogVisible = true;
      // 可以撤单
      if (data.success) {
        this.backoutInfo = {
          title: "确定撤单吗？",
          icon: "icon_popup_question",
          text: "撤单后，服务单相关业绩提成数据将一并撤回，且不可恢复。",
          color: "#FF6D61"
        };
      } else {
        this.backoutInfo = {
          title: "该服务单暂时不能撤销！",
          icon: "icon_popup_plaint",
          text: data.message,
          color: "#FCB322"
        };
      }
    },
  },
  beforeDestroy() {
    this.$root.$off("initCashierListPage");
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";

.cashier-root {
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
}

* {
  box-sizing: border-box;
}

.cash-list-card {
  .CashierList {
    min-height: calc(100vh - 310px);
    padding: 16px 10px 0px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;

  .footer-right {
    #pagination {
      margin: 0;
    }
  }
}

.backout-form {
  margin-top: 20px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}

.header-btns {
  display: flex;
  .first-btn {
    margin-top: 2px;
    height: 36px;
    padding: 9px 17px;
    border-radius: 18px;
    background-color: #F52D56;
    &:hover{
      background-color: #E02047;
    }
    &:active{
      background-color: #D11D42;
    }
  }
}

</style>
