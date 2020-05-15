<template>
  <div class="scan-to-pay" v-loading.fullscreen="loading">
    <div class="need-pay-money">
      <span>￥</span>
      <span class="money-num">{{needPay}}</span>
    </div>
    <div class="code-input">
      <el-input 
        ref="codeInput"
        id="codeInput"
        :disabled="!needPay"
        maxlength="18" 
        autofocus
        v-model.trim="code" 
        placeholder="扫描或者输入付款码"
      />
    </div>
    <div class="info">
      扫码自动录入, 手动输入完成请按回车键。
      <br>
      (扫码时请确认上方输入框处于编辑状态)
      <br>
      <span class="red-text" v-if="!needPay">
        待付金额为0,不能使用扫码支付
      </span>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      utils,
      code: '',
      loading: false,
    }
  },
  mounted() {
    this.focusInput()
    this.initInput()
  },
  methods: {
    focusInput() {
      this.code = ''
      this.$refs.codeInput.focus()
    },
    initInput() {
      let _this = this;
      let code = '';
      let lastTime, nextTime;
      let lastCode, nextCode;
      let dom = document.getElementById('codeInput')
      dom.onkeypress = function (e) {
        nextCode = e.which;
        nextTime = new Date().getTime();
        if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
          code += String.fromCharCode(lastCode);
          _this.code = code;
        } else if (
          lastCode != null &&
          lastTime != null &&
          nextTime - lastTime > 100
        ) {
          code = '';
        }
        lastCode = nextCode;
        lastTime = nextTime;
        if (e.which === 13) { // 回车键, 扫码枪自带; 或者手动输入时按回车键
          _this.payByScanCode(code + '' || _this.code);
          code = '';
        }
      };
    },
    payByScanCode(code) {
      if (!this.needPay) { return this.$message.error('待付金额为0，请用现金结算')}
      if (!code) { return }
      this.code = code.slice(0, this.maxlength)
      this.createBillAndPay()
    },
    // 创建订单并完成支付
    createBillAndPay() {
      let params = {
        mixBill: true,
        createBill: true,
        storeId: this.currentInfo.shopId,
        isCount: this.billInfo.isCount,
        tempFinalPrice: this.needPay,
        id: this.billInfo.consumerOrderId, // 挂单的id
        appointmentId: this.billInfo.appointId,
        serviceTime: this.billInfo.serviceTime,
        paperOrderId: this.billInfo.paperOrderId,
        customerId: this.billInfo.customerInfo.id,
        staffId: this.billInfo.billingStaff.staffId,
      }
      if (this.notInCard) {
        params.consumerOrderCardInfoInfoList = []
        params.consumerOrderDetails = this.$attrs.currentGoodsList
        // 给商品列表加索引 卡项不需要 deleted true 不要
        params.consumerOrderDetails.map((i,index) => {
          i.orderIndex = index + 1
        })
      } else {
        params.consumerOrderCardInfoInfoList = this.$attrs.currentGoodsList
        params.consumerOrderDetails = []
      }
      this.utils.levelIdAdd(params.consumerOrderDetails)
      this.loading = true
      axios.post('/createConsumerOrder', params).then(res => {
        if (res.success) {
          this.afterBill(res.billId)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    afterBill(billId) {
      let url = ''
      if (this.$attrs.active.billType === 0) { // 微信
        url = '/billingByPaymentCode'
      }
      if (this.$attrs.active.billType === 1) { // 支付宝
        url = '/billingByAliPaymentCode'
      }
      axios.post(url, {authCode: this.code, billId: billId}).then(res => {
        this.afterPay(res)
      }).catch(err => {
        this.refreshOrTurnToPage()
      })
    },
    afterPay(res) {
      if (res.success) {
        this.$message.success('支付成功')
      } else {
        this.$message.error(res.message)
      }
      this.refreshOrTurnToPage()
    },
    refreshOrTurnToPage() {
      this.loading = false
      if (this.$route.path === '/shop-inner/cashier-dask/cashier-list') { // 此结算组件不会在收款台的未支付状态出现了
        // 刷新收款台页面
        // ...
      } else {
        this.$router.push("/shop-inner/cashier-dask/cashier-list")
      }
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    notInCard() {
      return ['service', 'product'].includes(this.billInfo.currentLeftType)
    },
    needPay() {
      let money = 0
      this.$attrs.currentGoodsList.map(i => {
        if (!i.paymentStatus && !i.deleted) {
          money += i.tempFinalPrice
        }
      })
      this.money = money
      return money
    },
  },
  watch: {
    /* needPay: {
      handler: function(v, o) {
        if (v) {
          // this.$refs.codeInput.focus() // 这里的监听还是不要了 ，可能门店优惠输入的时候导致这里焦点
        }
      },
    } */
  }
}
</script>
<style lang='scss' scoped>
.scan-to-pay {
  margin: 95px 44px 0 34px;
  font-size: 14px;
}
.need-pay-money {
  color: #F52D56;
  .money-num {
    font-size: 24px;
    font-weight: 600;
  }
}
.code-input {
  margin-top: 50px;
}
.info {
  text-align: justify;
  font-size: 13px;
  color: #999;
  margin-top: 12px;
}

.red-text {
  color: #F52D56;
}
</style>
