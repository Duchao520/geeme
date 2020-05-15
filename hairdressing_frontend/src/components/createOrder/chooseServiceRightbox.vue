<template>
  <section
    class="choose-service-rightbox"
    :style="{paddingBottom:showSelectedVipCard || showSelectedPrepaidCard ? '126px' : '76px'}"
  >
    <div class="top-content">
      <div class="info-list">
        <!-- <div class="list-item" style="margin-bottom:0; padding-bottom: 0;">
          <span class="title">开单人员</span>
          <img :src="utils.formatPicImage(billingStaff.image, 'style', 40, 'someone')"/>
          <span class="name">{{ billingStaff.name }} {{shopStaffsInfo[billingStaff.staffId] ? `(${shopStaffsInfo[billingStaff.staffId]})` : ''}}</span>
        </div> -->
        <div class="list-item service-time" v-if="!currentInfo.serviceTime" style="margin-bottom:0; padding-bottom: 0;">
          <span class="span">服务时间</span>
          <el-date-picker
            ref="datePicker"
            align="center"
            v-model="time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :placeholder="utils.formatDateTimeFromYearToMinute(new Date())"
            :clearable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <i
            @click="$refs.datePicker.focus()"
            class="icon iconfont icon-icon_operate_edit"
            style="color: #58C9F3;margin-left: 10px;cursor:pointer;"
          ></i>
        </div>
        <div
          class="list-item"
          v-if="billInfo.consumerServiceOrderInfo.serialCode && fromCashierList"
        >
          <span class="title">服务单号</span>
          <span class="value">{{billInfo.consumerServiceOrderInfo.serialCode}}</span>
        </div>
        <div class="list-item paper-order-id">
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="5">
              <span class="title">纸单单号</span>
            </el-col>
            <el-col :span="12">
              <el-input v-model.trim="paperOrderId" size="small" placeholder="如有纸单，请输入" :maxlength="18"></el-input>
            </el-col>
            <el-col :span="7"></el-col>
          </el-row>
        </div>
      </div>
      <div class="info-box select-customer">
        <!-- <div class="title is-count">
          <span>
            {{!showUserBox?'选择客户：':'已选客户：' }}
          </span>
          <el-checkbox v-model="isCount">计客数</el-checkbox>
        </div> -->
        <div class="customer-content">
          <div v-show="!showSearchCustomer">
            <span style="font-size: 12px;">
              {{!showUserBox?'选择客户：':'已选客户：' }}
            </span>
            <div class="box-item">
              <select-customer ref="selectCustomer" :size="'small'" @choose="getUnServicedOrderList"></select-customer>
            </div>
            <div class="box-item">
              <g-clickbtn title="新增" icon="icon_ope_append" @click="dialog = 'addCustomer'"></g-clickbtn>
            </div>
          </div>
          <history-customers v-show="!showSearchCustomer"  @choose="getUnServicedOrderList"></history-customers>
          <div class="box-item-userbox" v-if="showUserBox">
            <user-box :list="customerInfo"></user-box>
            <i v-show="!showSearchCustomer" class="icon iconfont icon-icon_operate_delete" @click="clearCustomerInfo"></i>
            <el-checkbox v-model="isCount">计客数</el-checkbox>
          </div>
        </div>
      </div>
      <div class="info-box selected-lists" id="rightlist" ref="carPosition">
        <div class="title-service">
          <span class="title">已选{{isInCard?'卡项':'服务/产品'}}({{ alreadySelectedListsLen }})</span>
          <span class="clear" @click="$refs.rightlist.clearService()">清空</span>
        </div>
        <choose-service-right-list :list="list" ref="rightlist" v-on="$listeners"></choose-service-right-list>
      </div>
    </div>
    <div class="info-footer">
      <select-vip-card v-if="showSelectedVipCard" :selectedGoodsList="list"></select-vip-card>
      <selectPrepaidCard v-if="showSelectedPrepaidCard" :selectedGoodsList="list"/>

      <div class="info-footer-settle-accounts">
        <the-total-price :goodsList="list" ref="totalPrice"></the-total-price>
        <div class="buttons">
          <el-button
            class="up"
            @click="createConsumerOrder(true)"
            :loading="upBillLoading"
            :disabled="upBillLoading || openBillLoading"
          >挂单
          </el-button>
          <el-button
            class="get open"
            @click="handleSettleAccounts"
            :loading="openBillLoading"
            :disabled="openBillLoading || upBillLoading"
          >结算
          </el-button>
        </div>
      </div>
    </div>
    <choose-add-customer v-if="dialog === 'addCustomer'" :visible="dialog === 'addCustomer'" @close="dialog=null"></choose-add-customer>
    <!-- 订单结算 -->
    <settle-accounts
      ref="settleAccounts"
      :visible="visible"
      :detail="settleAccountsDetail"
      @closeSettleAccounts="visible=false"
    ></settle-accounts>
    <!-- 线上已付款订单，无需再支付 -->
    <account-detail-no-money
      :detail="settleAccountsDetail"
      :noMoneyVisible="noMoneyVisible"
      @close="noMoneyVisible=false"
    ></account-detail-no-money>
    <choose-order
      v-if="showChooseDialog"
      @close="showChooseDialog=false"
      @chooseUnServicedServices="chooseUnServicedServices"
      :unServicedOrderLists="unServicedOrderLists"
      :showReBillingButton="false"
    ></choose-order>
    <g-del-model
      :delTagDialogVisible="warningModelVisible"
      @close="warningModelVisible=false"
      @confirm="warningModelVisible=false"
      :title="modelInfo.title"
      :modalAppendToBody="false"
      :content="modelInfo.content"
      :icon="modelInfo.icon"
      :iconColor="modelInfo.iconColor"
    ></g-del-model>
    <!-- 计算会员优惠价的组件， 订单变化 -->
    <the-request-of-member-price :goodsList="list"></the-request-of-member-price>
  </section>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";
  import rightBoxParamConvert from "./rightBoxParamConvert";
  import SelectCustomer from "@/components/appoModule/selectCustomer";
  import ChooseServiceRightList from "./chooseServiceRightList";
  // import ChooseAddCustomer from "./chooseAddCustomer"; // old
  import ChooseAddCustomer from "./chooseAddCustomer_order";
  import SettleAccounts from "@/components/createOrder/settleAccounts/SettleAccounts";
  import UserBox from "@/components/appoModule/userBox";
  import ChooseOrder from "@/pages/appointment/ChooseOrder";
  import AccountDetailNoMoney from "@/components/createOrder/settleAccounts/AccountDetailNoMoney";
  import selectVipCard from "@/components/createOrder/selectedCard/selectVipCard";
  import selectPrepaidCard from "@/components/createOrder/selectedCard/selectPrepaidCard";
  import {mapActions, mapGetters, mapState} from "vuex";
  import {formatDateTimeFromYearToMinute} from "@/assets/js/utils";
  import TheRequestOfMemberPrice from "@/components/createOrder/chooseRightBox/TheRequestOfMemberPrice";
  import TheTotalPrice from "@/components/createOrder/chooseRightBox/TheTotalPrice";
  import historyCustomers from "./chooseRightBox/historyCustomers";
  export default {
    components: {
      SelectCustomer,
      UserBox,
      ChooseAddCustomer,
      ChooseServiceRightList,
      SettleAccounts,
      ChooseOrder,
      AccountDetailNoMoney,
      selectVipCard,
      TheRequestOfMemberPrice,
      TheTotalPrice,
      historyCustomers,
      selectPrepaidCard, // 储值卡买卡
    },
    props: {
      list: Array
    },
    data() {
      return {
        visible: false,
        noMoneyVisible: false,
        utils: utils,
        dialog: null,
        settleAccountsDetail: {},
        bill: false,
        upBillLoading: false,
        openBillLoading: false,
        unServicedOrderLists: [],
        showChooseDialog: false,
        warningModelVisible: false,
        modelInfo: {},
        pickerOptions: {
          disabledDate(time) {
            return (
              time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
            );
          },
          // selectableRange: `00:00:00 - ${new Date().getHours()}:${new Date().getMinutes() + 1}:00`
        }
      };
    },
    computed: {
      ...mapGetters(["identityCardDiscountInfo"]),
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        billingStaff: state => state.bill.billingStaff,
        billInfo: state => state.bill,
        selectedVipCardInfo: state => state.bill.billCardInfo.selectedVipCardInfo,
        shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      }),
      alreadySelectedListsLen() {
        let count = 0;
        this.list.forEach(item => {
          if (!item.deleted) {
            count++;
          }
        });
        return count;
      },
      isInCard() {
        let sortGoodsType = this.billInfo.currentChooseTypeAndSortOneId
          .sortGoodsType;
        return ["card","cardAdd","freeCard"].includes(sortGoodsType);
      },
      showUserBox() {
        return this.customerInfo.length > 0;
      },
      customerInfo() {
        let customer = this.$store.state.bill.customerInfo;
        return customer.id ? [this.$store.state.bill.customerInfo] : [];
      },
      showSearchCustomer() {
        let origin = this.billInfo.billOrigin;
        return (
          origin === "cashierList" ||
          origin === "appointment" ||
          origin === "customerList" ||
          this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType === "cardAdd"
        );
      },
      fromCashierList() {
        return this.billInfo.billOrigin === "cashierList";
      },
      time: {
        get() {
          return this.$store.state.bill.serviceTime;
        },
        set(time) {
          this.setServiceTime(time);
        }
      },
      showSelectedVipCard() {
        return this.billInfo.billCardInfo.customerHasVipCard && !this.isInCard;
      },
      // 计算是否可以用储值卡买卡  卡买卡
      showSelectedPrepaidCard() {
        if (this.isInCard && this.billInfo.billCardInfo.customerHasPrepaidCard && this.list.length) {
          let hasPrepaidInList = this.list.some(i => i.cardType === 1)
          return !hasPrepaidInList
        }
        return false
      },
      // - 纸单号
      paperOrderId: {
        get() {
          return this.$store.state.bill.paperOrderId;
        },
        set(id) {
          this.setPaperId(id||null);
        }
      },
      // - 纸单号
      isCount: {
        get() {
          return this.$store.state.bill.isCount;
        },
        set(boolean) {
          this.setIsCount(boolean);
        }
      },
    },
    mounted() {
      console.log(this.list)
      this.initPosition();
    },
    methods: {
      ...mapActions([
        "setServiceTime",
        "setCarPosition",
        "saveBillInfo",
        "setBillOrigin",
        "setConsumerOrderId",
        "setBillId",
        "setPaperId",
        "setIsCount",
        "saveCustomerInfo",
        "setProtectedGoodsType",
        "saveOnTheWayOrderIds",
        "setTheTotalBill",
        "setCustomerHasCard",
        "setCustomerHasPrepaidCard",
        "clearVipCardInfo",
        "setSelectedVipCardId", // 加入产品或者服务的时候 清空已经选的卡，避免新加的东西不能用该卡支付 | 订单生产的id可能触发了这里的重置
      ]),
      getUnServicedOrderList(data) {
        if (this.isInCard) {
          return;
        }
        axios
          .post("/getUnservicedOrderList", {
            customerId: data.id,
            staffId: null,
            storeId: this.currentInfo.shopId,
            serviceOrderId: null
          })
          .then(res => {
            this.saveOnTheWayOrderIds([]);
            if (res.orderList.length > 0) {
              this.showChooseDialog = true;
              this.unServicedOrderLists = res.orderList.filter(i => i.paymentStatus); // 仅显示已经支付的?
              // 未支付的来源可能是服务版的扫码开单...
            }
          });
      },
      chooseUnServicedServices(data) {
        let tempRightListArr = rightBoxParamConvert.chooseUnServicedServices(
          data
        );
        let list = JSON.parse(JSON.stringify(this.list));
        list = list.concat(tempRightListArr);
        this.$emit("change", list);
        this.showChooseDialog = false;
      },
      createConsumerOrder(needCheck) {
        if (needCheck) {
          this.bill = false  // 挂单的时候不能结算,
        }
        if (!this.showUserBox) { // 挂单的时候可以没商品, 必须有客户
          this.$message({message: "请选择客户", type: "warning"});
        }
        if (!needCheck && !this.validateSelectedGoods()) {
          return;
        }
        let params = {};
        if (this.isInCard) {
          params.consumerOrderCardInfoInfoList = this.convertCardsInfo();
          params.consumerOrderDetails = [];
          this.setProtectedGoodsType("card");
        } else {
          params.consumerOrderDetails = rightBoxParamConvert.convertGoodParams(
            this.list
          );
          params.consumerOrderCardInfoInfoList = [];
          this.setProtectedGoodsType("goods");
        }
        let chargeOff = params.consumerOrderDetails.length > 0 && params.consumerOrderDetails.every(
          item => item.goodsOrderId
        );

        let tempFinalPrice = this.$refs.totalPrice.accountBill.moneyToBePaid;

        /*if (tempFinalPrice === 0 && !chargeOff) {
          this.$message({type: "warning", message: "应付金额不能为0"});
          return;
        }*/

        // 以前不能用卡买卡 
        /* if (this.isInCard) {
          this.setSelectedVipCardId({})
        } */

        params = {
          ...params,
          id: this.fromCashierList ? this.billInfo.consumerOrderId : null,
          createBill: this.bill ? true : false,
          appointmentId: this.billInfo.appointId || null,
          storeId: this.currentInfo.shopId,
          customerId: this.billInfo.customerInfo.id,
          staffId: this.billingStaff.staffId,
          serviceTime: this.time,
          tempFinalPrice: tempFinalPrice,
          paperOrderId: this.paperOrderId, // - 纸单号追加
          isCount: this.isCount, // - 纸单号追加
          // - 购卡续卡等不能用卡支付
          identityCardId: this.selectedVipCardInfo.identityCardId || 0,
          prepaidCardId: this.selectedVipCardInfo.prepaidCardId || 0,
          timeCardId: this.selectedVipCardInfo.timeCardId || 0,
          countCardId: this.selectedVipCardInfo.countCardId || 0,
        };
        this.upBillLoading = this.bill ? false : true;
        this.openBillLoading = this.bill ? true : false;
        axios.post("/createConsumerOrder", params).then(res => {
          if (res.success) {
            if (this.bill) {
              this.setBillId(res.billId);
              this.setPaperId(res.paperOrderId); // - 纸单
              this.setIsCount(res.isCount); // - 计客数
              this.settleAccounts(res, chargeOff);
              this.bill = false;
            } else {
              this.createConsumerOrderRes(res);
            }
          } else {
            this.clearButtonLoading()
            this.$message.error(res.message)
          }
        }).catch(err => {
          this.clearButtonLoading()
        })
      },
      handleSettleAccounts() {
        this.bill = true;
        this.createConsumerOrder();
      },
      settleAccounts(res, isWriteOff) {
        if (!res.success) {
          this.$message({type: "warning", message: res.message});
          this.clearButtonLoading();
          return;
        }
        axios.get("/getConsumerOrderInfoById/" + res.id, {}).then(res => {
          /* 模拟从收款台取单的过程（防止对同一份数据进行重复的开单） */
          this.settleAccountsDetail = res;
          this.setBillId(res.billId) // 新的统一处理账单id
          this.setPaperId(res.paperOrderId); // - 纸单
          this.setIsCount(res.isCount); // - 纸单
          this.saveBillInfo(res);
          this.setBillOrigin("cashierList");
          this.setConsumerOrderId(res.id);
          // this.$emit("save-bill-info"); // 注释是尝试阻止结算时刷新订单列表  如果有bug，请恢复这行代码
          this.clearButtonLoading();
          this.setTheTotalBill(res.finalPrice); // 输入框用的 ，为什么没用prop
          if (res.finalPrice === 0 && isWriteOff) {
            this.noMoneyVisible = true
          } else {
            this.visible = true;
            this.$refs.settleAccounts.initPayType();
          }
        });
      },
      createConsumerOrderRes(res) {
        this.clearButtonLoading();
        if (res.success) {
          this.$message({
            message: "挂单成功",
            type: "success"
          });
        }
        this.$router.push("/shop-inner/cashier-dask/cashier-list"); //点击挂单的话会引起跳转
      },
      convertCardsInfo() {
        let serviceTime = this.time;
        return rightBoxParamConvert.convertCardsInfo(
          this.list,
          serviceTime,
          this.billInfo.customerInfo.id,
          this.billingStaff.staffId,
          this.currentInfo.shopId,
          this.fromCashierList,
          this.billInfo.consumerOrderId
        );
      },
      clearButtonLoading() {
        this.openBillLoading = false;
        this.upBillLoading = false;
      },
      validateSelectedGoods() {
        /*1. 检测有没有客户 */
        if (!this.showUserBox) {
          this.$message({message: "请选择客户", type: "warning"});
          this.clearButtonLoading();
          return false;
        }
        let hasAvailableProductOrService = false;
        this.list.forEach(element => {
          if (!element.deleted) {
            hasAvailableProductOrService = true;
          }
        });
        /* 2.检测有没有可开单的商品 */
        if (
          !hasAvailableProductOrService ||
          (!this.list || this.list.length === 0)
        ) {
          this.$message({message: "请选择服务", type: "warning"});
          this.clearButtonLoading();
          return false;
        }
        /* 3.检测有没有未选择服务者的服务 */
        let hasUnselectedStaff = false;
        this.list.forEach(element => {
          // v1 主服务者
          // if (element.goodsType === "service" && !element.staffId) {
          //   hasUnselectedStaff = true;
          // }
          // v2 第一工位
          if (element.goodsType === "service" && (element.stationOne === null || !element.stationOne.length)) {
            hasUnselectedStaff = true;
          }
        });
        if (hasUnselectedStaff) {
          this.modelInfo = {
            title: "请选择服务者！",
            content: "发现有服务项目尚未选择服务者，暂时不能挂单或者结算。",
            icon: "icon_popup_plaint",
            iconColor: "#FCB322"
          };
          this.warningModelVisible = true;
          return false;
        }
        return true;
      },
      initPosition() {
        this.getCarPosition();
        window.onresize = function () {
          this.getCarPosition();
        }.bind(this);
      },
      getCarPosition() {
        const position = this.$refs.carPosition.getBoundingClientRect();
        this.setCarPosition({x: position.x, y: position.y});
      },
      // - 清空客户
      clearCustomerInfo() {
        this.saveCustomerInfo({})
        // 卡买产品、服务
        this.setCustomerHasCard(false);
        // 卡买卡
        this.setCustomerHasPrepaidCard(false);
        this.clearVipCardInfo()
      },
    },
    watch: {
      // 这里重置选中的会员卡 // !!! 加入持卡会员价后 这里不再好监听数据清除已选卡 改为增加项目及其数量时清空
      // list: {
      //   handler: function(v, o) {
      //     v && this.setSelectedVipCardId({}) // ...结算也会进入这里...
      //   },
      //   deep: true,
      //   immediate: true
      // },

      // 是否在卡类的切换  需要清空当前选择的卡（可能存在的）
      isInCard(v, o) {
        this.setSelectedVipCardId({})
      },
    }
  };
</script>

<style lang="scss" scoped>
  .service-time {
    /deep/ .el-input--prefix .el-input__inner {
      border: none;
      padding: 0;
      background: transparent;
    }

    /deep/ .el-input--prefix .el-input__inner::-webkit-input-placeholder {
      color: #333333;
    }

    /deep/
    .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--datetime {
      width: 120px;
    }

    /deep/ .el-input__prefix,
    /deep/ .el-input__suffix {
      display: none;
    }
  }


  .box-item-userbox {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    position: relative;
    .icon-icon_operate_delete {
      margin-left: 12px;
      cursor: pointer;
    }
    /deep/ .el-checkbox { /* 计客数 挪动 */
      position: absolute;
      right: 20px;
    }
  }
  .is-count { /* 计客数 旧版 */
    padding-right: 18px;
    display: flex;
    justify-content: space-between;
  }
</style>



