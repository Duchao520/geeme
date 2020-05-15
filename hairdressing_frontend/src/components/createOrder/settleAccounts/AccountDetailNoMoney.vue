<template>
  <el-dialog :visible="noMoneyVisible" width="370px" :before-close="dialogBeforeClose" append-to-body top="5vh">
    <div class="content-wrap">
      <div class="account-detail">
        <account-detail :detail="detail"></account-detail>
      </div>
      <div class="button">
        <el-button class="confirm" :loading="buttonLoading" @click="verifyGoodsOrder">确认核销</el-button>
        <span class="text">线上已支付订单，门店确认核销即可</span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import * as axios from "@/util/axios";
  import AccountDetail from "@/components/createOrder/settleAccounts/AccountDetail";
export default {
  components: { AccountDetail },
  props: {
    noMoneyVisible: Boolean,
    detail: Object
  },
  data() {
    return {
      buttonLoading: false
    };
  },
  methods: {
    dialogBeforeClose() {
      this.$emit("close");
    },
    verifyGoodsOrder(){
      axios.post("/verifyGoodsOrder",{consumerOrderId:this.detail.id}).then(res=>{
        if(res.success){
          this.$router.push("/shop-inner/cashier-dask/cashier-list")
        }
        this.$message({type:res.success?'success':'warning',message:res.message})
      })
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  padding: 0;
  background: #f1f2f7;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    display: flex;
    justify-content: center;
    padding: 15px 20px;
    .content-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      .account-detail {
        padding-bottom: 20px;
        background: #ffffff;
      }
      .button {
        display: flex;
        flex-direction: column;
        align-items: center;
        .confirm {
          border: none;
          background: #f52d56;
          color: white;
          font-size: 18px;
          width: 200px;
          line-height: 40px;
          padding: 0;
          margin-top: 15px;
        }
        .text {
          font-size: 12px;
          line-height: 25px;
          color: #999999;
          margin-bottom: -5px;
        }
      }
    }
  }
}
</style>
