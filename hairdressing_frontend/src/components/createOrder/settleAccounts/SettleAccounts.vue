<template>
  <div class="settle-accounts">
      <!-- :modal-append-to-body="false" -->
    <el-dialog 
      width="1000px" 
      :visible="visible" 
      append-to-body
      :before-close="handleClose"
      @close="$emit('closeSettleAccounts')" top="5vh" 
    >
      <div class="content-area">
        <div class="left">
          <account-detail :detail="detail"></account-detail>
          <pay-types :billDetail="detail" :paymentModes="paymentModes" v-model="payTypeNumber"></pay-types>
        </div>
        <div class="right">
          <settle-accounts-right
            v-if="visible"
            :canWindUpAnAccount="visible"
            :detail="detail"
            :payTypeNumber="payTypeNumber"
            :currentPayType="currentPayType"
            :paymentModes="paymentModes"
          ></settle-accounts-right>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AccountDetail from "@/components/createOrder/settleAccounts/AccountDetail";
import SettleAccountsRight from "@/components/createOrder/settleAccounts/SettleAccountsRight";
import PayTypes from "@/components/createOrder/settleAccounts/PayTypes";
import * as axios from "@/util/axios";
import {mapActions,mapGetters} from "vuex";
export default {
  components: {
    "settle-accounts-right": SettleAccountsRight,
    "account-detail": AccountDetail,  // 这个是结算的详情组件,  还有一个类似的备注为： // 这个是收款台的详情组件
    "pay-types": PayTypes
  },
  props: {
    visible: Boolean,
    detail: Object,
    billId: [String, Number]
  },
  data() {
    return {
      value: "",
      paymentModes:[]
    };
  },
  computed: {
    ...mapGetters(["alreadySelectedType"]),
    billInfo() {
      return this.$store.state.bill;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    payTypeNumber:{
      get() {
        return this.$store.state.bill.settleAccountsInfo.payTypeNumber;
      },
      set(num) {
        this.setPayType(num);
      }
    },
    currentPayType() {
      let paymentModeId = this.billInfo.paymentModeId;
      return this.paymentModes.filter(item => item.id === paymentModeId)[0];
    }
  },
  mounted() {
    this.getEnabledBrandBillTypeInfos();
  },
  methods: {
    ...mapActions(["setPayType","setPaymentModeId"]),
    getEnabledBrandBillTypeInfos() {
      axios
        .post("/getEnabledBrandBillTypeInfos", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          // this.paymentModes = res.listBillTypeInfos.filter(item=>item.openAccount).concat(res.listBillTypeInfos.filter(item=>!item.openAccount));
          this.paymentModes = res.listBillTypeInfos.filter(item=>item.openAccount)
          this.payTypeNumber = 2;
          this.setPaymentModeId(null);
        });
    },
    initPayType(){
      /*
      * 3是会员卡
      * 2是现金
      * */
      this.payTypeNumber = ["prepaid","countCard","timeCard"].includes(this.alreadySelectedType) ? 3 : 2;
    },
    handleClose(callback){
      this.setPaymentModeId(null);
      // callback();
      if (this.$route.path === '/shop-inner/cashier-dask/cashier-list') {
        this.$root.$emit('initCashierListPage')
      } else {
        this.$router.push("/shop-inner/cashier-dask/cashier-list");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  // .settle-accounts{
    /deep/ .el-dialog {
      border-radius: 5px;
      overflow: hidden;
      .el-dialog__body {
        padding: 0;
        max-width: 1000px;
      }
    }
    .content-area {
      height: 730px;
      display: flex;
      margin-top: -30px;
      box-sizing: border-box;
      border-radius: 5px;
      color: #999999;
      font-size: 12px;
      .left {
        width: 657px;
        box-sizing: border-box;
        padding: 20px;
        background: #f1f2f7;
        display: flex;
      }
      .right {
        width: 343px;
      }
    }
  // }

</style>
