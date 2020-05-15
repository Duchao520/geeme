<template>
  <div class="cashier-root" v-loading.fullscreen="pageLoading">
    <!-- 顶部 -->
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
          @click="() => {rechargeDialogVisible=true}"
        ></red-button>
      </div>
      <span v-if="!checkHasBtnPermission('/shop-inner/choose-person','path')"></span>
      <input-search
        width="320px"
        placeholder="搜索客户姓名/服务单号/开单人/纸单号"
        v-model="keyword"
        @search="esConsumerOrderList()"
        :currentStatus="currentStatus"
      ></input-search>
    </div>
    <!-- 中间筛选组件 -->
    <order-header
      @changeShowType="changeShowType"
      ref="orderHeader"
      :billNumberInfo="billNumberInfo"
      @change="change"
      :currentStatus="currentStatus"
      :headLoad="headLoad"
    ></order-header>
    <!-- 列表 -->
    <component
      ref="componentRef"
      :is="activity"
      :showTypeConfrim="showTypeConfrim"
      :currentStatus="currentStatus"
      :billNumberInfo="billNumberInfo"
      @changeBillNumberInfo="changeBillNumberInfo"
      :keyword="keyword"
      @clearKeyWord="clearKeyWord"
      @headCountLoad="headCountLoadChange"
    ></component>
    <!-- 预收款充值对话框 -->
    <advances-received
      :visible="rechargeDialogVisible"
      @closeAdvances="rechargeDialogVisible = false"
    ></advances-received>
  </div>
</template>
<script>
import init from "./_initializedCashierPage";
import backout from "./_backoutCashierPage";
import orderHeader from "@/components/order/orderHeader.vue";
import AdvancesReceived from "./components/advancesReceived";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  name: "cashier-main",
  data() {
    return {
      activity: "init",
      // 预收款充值对话框标识
      rechargeDialogVisible: false,
      currentStatus: "cashier", // 开单页、已删除订单、已撤销订单页的标识
      showTypeConfrim: "card",
      billNumberInfo: {},
      keyword: null,
      headLoad: false,
      pageLoading: false, // 此页面的整体加载

      // 
      code: '',
      lastTime: '',
      nextTime: '',
      lastCode: '',
      nextCode: '',
    };
  },
  mounted() {
    this.clearBillInfo();
    this.saveCurrentInfo({ cpLevelId: null });
    this.initPageListener();
  },
  methods: {
    ...mapActions([
      "setIsCount",
      "setUsbReaderCode",
      "setSelectedGoods",
      "saveSelectedCard",
      "setBillId",
      "setPaperId",
      "setIsCount",
      "saveStaffInfo",
      "setProtectedGoodsType",
      "setCurrentLeftType",
      "setCreateTime",
      "setServiceTime",
      "setSerialCode",
      "saveCustomerInfo",
      "setConsumerOrderId",
      "clearBillInfo",
      "saveCurrentInfo",
    ]),
    // 读卡器事件监听
    initPageListener() {
      this.code = ''
      this.lastTime = ''
      this.nextTime = ''
      this.lastCode = ''
      this.nextCode = ''
      window.addEventListener(
        "keypress",
        this.keyPressEvent
      );
    },
    keyPressEvent() {
      let e = arguments[0]
      if (this.billInfo.billId || this.rechargeDialogVisible) {
        console.log("");
        console.log("我应该在车底，不应该在这里...");
      } else {
        this.nextCode = e.which;
        this.nextTime = new Date().getTime();
        if (
          this.lastCode != null &&
          this.lastTime != null &&
          this.nextTime - this.lastTime <= 30
        ) {
          this.code += String.fromCharCode(this.lastCode);
        } else if (
          this.lastCode != null &&
          this.lastTime != null &&
          this.nextTime - this.lastTime > 100
        ) {
          this.code = "";
        }
        this.lastCode = this.nextCode;
        this.lastTime = this.nextTime;
        if (e.which === 13) {
          this.code && this.afterCardReaderCodes(this.code);
          this.code = "";
        }
      }
    },
    // 读卡器识别后请求接口， 视回调去取单或者新开单
    afterCardReaderCodes(codes) {
      this.pageLoading = true;
      axios
        .get(`/getConsumerOrderInfoByHandCode/${codes}`)
        .then(res => {
          if (res.success) {
            // 存储codes到手牌号handCode
            this.setUsbReaderCode(codes);
            if (res.id) {
              // 这是取单... 数据转换...
              this.setBillId(res.billId); // 新的统一处理账单id
              this.setPaperId(res.paperOrderId); // - 纸单
              this.setIsCount(res.isCount); // - 设置计客数
              this.saveStaffInfo({
                id: res.staffId,
                name: res.staffName,
                headPortrait: res.staffHeadPortrait,
                levelId: res.levelId || "",
                levelName: res.levelName || ""
              });
              this.setCreateTime(
                new Date(res.createTime).format("yyyy-MM-dd hh:mm")
              );
              this.setServiceTime(
                new Date(res.serviceTime).format("yyyy-MM-dd hh:mm")
              ); // 服务单时间, 时间格式要处理
              this.setSerialCode(res.serialCode); // 服务单号
              this.saveCustomerInfo({
                headPortrait: res.customerHeadPortrait,
                name: res.customerName,
                sex: res.customerSex,
                mobile: res.mobile,
                memberLevel: res.customerMemberLevel,
                id: res.customerId
              });
              this.setConsumerOrderId(res.id);
              let goodsList = res.consumerGoodsOrderInfoList || [];
              let cardsList = res.listConsumerOrderCardInfo || [];
              if (!goodsList.length) {
                cardsList.map(i => {
                  i.memberPrice = i.tempFinalPrice - i.storePreference || 0;
                  i.goodsType = "card";
                  i.count = 1;
                  // 辅助销售字段修改补充
                  i.cardSellerList.map(item => {
                    item.ratio = item.percent;
                    item.levelId = item.postId;
                    item.levelName = item.postName;
                    item.staffId = item.sellerStaffId;
                    item.name = item.staffName;
                    // 删除的字段后续处理
                  });
                  i.deleted = false; // 坑逼后端没给,额外赋值...
                  i.validPermanent = !(i.validNum > 0); // 坑逼后端没给,额外赋值...
                });
                this.setProtectedGoodsType("card");
                this.setCurrentLeftType("card"); // 左侧导航类型 - new -
                this.saveSelectedCard(cardsList);
              } else {
                goodsList.map(i => {
                  i.staffId = i.serverId;
                  i.staffName = i.server;
                  i.name = i.serviceName;
                  i.storeRemark = i.note || null;
                  i.received = i.paymentStatus ? i.unitFinalPrice : null;
                  i.shopPrice = i.oldPrice;
                  i.memberPrice =
                    Number(i.unitFinalPrice + (i.storePreference || 0)) /
                    i.count; // 会员价
                  i.tempFinalPrice = i.unitFinalPrice;
                  i.deleted = false; // 坑逼后端没给,额外赋值...
                  delete i.note;
                  delete i.server;
                  delete i.oldPrice;
                  delete i.serverId;
                  delete i.unitPrice;
                  delete i.serviceName;
                  delete i.unitFinalPrice;
                  delete i.unitTotalPrice;
                });
                this.setProtectedGoodsType("goods");
                this.setCurrentLeftType("service"); // 左侧导航类型 - new -
                // 工位、销售人字段处理一下
                let arr = ["stationOne", "assistantOrSalers", "stationThree"];
                arr.map(item => {
                  goodsList.map(i => {
                    if (i[item]) {
                      i[item].map(item => {
                        item.name = item.staffName;
                      });
                    }
                  });
                });
                this.setSelectedGoods(goodsList);
              }
              // 跳转取单页面...
              this.$router.push("/shop-inner/choose-service");
            } else {
              // 这是新开单... 跳转选择开单人...
              this.$router.push("/shop-inner/choose-person");
            }
            window.removeEventListener('keypress', this.keyPressEvent)
            this.keyPressEvent = null
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {})
        .then(() => {
          this.pageLoading = false;
        });
    },
    // 头部数据加载
    headCountLoadChange(flag) {
      this.headLoad = flag;
    },
    toChoosePerson() {
      this.setIsCount(true); // - 设置计客数
      this.$router.push("/shop-inner/choose-person");
    },
    // 卡片列表or表格列表
    changeShowType(showType) {
      this.showTypeConfrim = showType;
    },
    // 子-》父订单信息
    changeBillNumberInfo(res) {
      this.billNumberInfo = {
        allCount: res.realAllCount,
        paidCount: res.realPaidCountt,
        unPaidCount: res.realUnPaidCount,
        unBillingCount: res.realUnBillingCount,
        deletedCount: res.deletedCount,
        repealCount: res.repealCount
      };
      this.headLoad = false;
    },
    change(params) {
      // 前四个标签都归为cashier
      if (params.scope == "delete") {
        this.currentStatus = "recycle";
      } else if (params.scope == "repeal") {
        this.currentStatus = "backout";
      } else {
        this.currentStatus = "cashier";
      }
      this.$nextTick(() => {
        this.$refs.componentRef.paramsChange(params);
      });
      this.headLoad = true;
    },
    clearKeyWord() {
      this.keyword = null;
      this.$refs.orderHeader.clearAndrefresh();
    },
    esConsumerOrderList() {
      this.$refs.componentRef.esConsumerOrderList();
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    })
  },
  components: { "order-header": orderHeader, init, backout, AdvancesReceived }
};
</script>
<style lang='scss' scoped>
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

.header-btns {
  display: flex;
  .first-btn {
    margin-top: 2px;
    height: 36px;
    padding: 9px 17px;
    border-radius: 18px;
    background-color: #f52d56;
    &:hover {
      background-color: #e02047;
    }
    &:active {
      background-color: #d11d42;
    }
  }
}
</style>
