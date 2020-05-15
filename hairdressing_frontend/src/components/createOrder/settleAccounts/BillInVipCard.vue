<template>
  <div class="main-con-cards">
    <div v-if="showReminder" class="reminder-wrap">
      <card-error-reminder :errorInfo="reminderDetail"></card-error-reminder>
    </div>
    <div class="card-info-content"  v-if="!showReminder">
      <div
        class="radio-item"
        :style="{'backgroundImage':`url(${utils.formatPicImg(selectedVipCardDiscountInfo.cardCover,'style',146)})`}"
      >
        <div class="card-info">
          <img class="brand-logo" :src="utils.formatPicImg(currentInfo.brandLogo,'circle',40)" alt/>
          <p class="card-name">{{selectedVipCardDiscountInfo.cardName}}</p>
        </div>
        <!-- 结算给的是prePaid 取单给的是prepaid; orz -->
        <div class="money" v-if="['prepaid', 'prePaid'].includes(selectedVipCardDiscountInfo.type)">
          <h5 class="total-money">
            ￥{{(selectedVipCardDiscountInfo.rechargeMoney + selectedVipCardDiscountInfo.giftMoney).toFixed(2)}}
          </h5>
          <p class="gift-money">(含赠送金：￥{{selectedVipCardDiscountInfo.giftMoney}})</p>
        </div>
        <!--<div>???</div>-->
      </div>
      <p class="tip">
        <span>本单实付金额：</span>
        <!-- <span>￥{{selectedVipCardDiscountInfo.finalTotalCharge}}</span> -->
        <span>￥{{finalPrice}}</span>
      </p>
      
      <!-- 储值卡的灵活支付， 此处要排除次卡时间卡 -->
      <el-row 
        type="flex" 
        justify="center" 
        align="middle" 
        v-if="['prepaid', 'prePaid'].includes(selectedVipCardDiscountInfo.type)"
      >
        <el-col :span="3" class="align-right">
          支付
        </el-col>
        <el-col :span="6">
          <el-input 
            v-model.number="form.rechargeMoneyPay" 
            @change="handleRechargeMoneyChanged" 
            @input="handleRechargeMoneyChanged" 
            placeholder="储值金"
            @blur="handleRechargeBlur"
          >
          </el-input>
        </el-col>
        <el-col :span="1" class="align-center">
          +
        </el-col>
        <el-col :span="6">          
          <el-input 
            v-model.number="form.giftMoneyPay" 
            @change="handleGiftMoneyChanged" 
            @input="handleGiftMoneyChanged" 
            placeholder="赠送金"
            @blur="handleGiftBlur"
          >
          </el-input>          
        </el-col>
        <el-col :span="7" class="align-left">
          = {{finalPrice}}
        </el-col>
      </el-row>
      
    </div>
    <div class="bottom-content bottom-button-info" v-if="!showReminder">
      <el-button
        :disabled="buttonDisabled"
        class="button"
        @click="confirmSettleAccountsInPrePaidCard"
      >确认支付
      </el-button>
      <!--<p v-else>该用户已设置支付密码，须由本人前往小程序自行支付。</p>-->
    </div>
  </div>
</template>

<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";
  import {mapState, mapGetters} from "vuex";
  import CardErrorReminder from "@/components/createOrder/settleAccounts/payErrorReminder/CardErrorReminder";
  export default {
    props: {
      finalPrice: {
        type: Number
      }
    },
    components:{CardErrorReminder},
    data() {
      return {
        utils,
        buttonDisabled: false,
        // 储值卡支付 指定储值金或者赠送金
        form: {
          giftMoneyPay: null,
          rechargeMoneyPay: null,
        },
        inputError: false, // 数字输入错误
      };
    },
    computed: {
      ...mapGetters(["selectedVipCardDiscountInfo","alreadySelectedType","alreadySelectedCard"]),
      ...mapState({
        billInfo: state => state.bill,
        currentInfo: state => state.manage.currentInfo
      }),
      isInCard() {
        let goodsType = this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
        return goodsType === "card" || goodsType === "cardAdd";
      },
      showReminder(){
        // return this.isInCard || !this.alreadySelectedCard || this.alreadySelectedType==="identity"; // 卡不能买卡
        return !this.alreadySelectedCard || this.alreadySelectedType==="identity"; // 卡买卡
      },
      reminderDetail(){
        // 卡不能买卡 需要注释
        // if(this.isInCard){
        //   return {
        //     title:"不可使用会员卡",
        //     reason:"储值卡不支持产品服务以外产品"
        //   }
        // }else 
        
        if(!this.alreadySelectedCard){
          return {
            title:"不可使用会员卡",
            reason:"请返回上一步选择会员卡"
          }
        }else if(this.alreadySelectedType==="identity"){
          return {
            title:"不可使用会员卡",
            reason:"身份卡和会员卡不可同时使用"
          }
        }
      },
      // - 储值金的最大支付额度
      maxRechargePay() {
        return this.selectedVipCardDiscountInfo.rechargeMoney - this.finalPrice >= 0 ? this.finalPrice : this.selectedVipCardDiscountInfo.rechargeMoney
      },
      // - 赠送金的最大支付额度
      maxGiftPay() {
        return this.selectedVipCardDiscountInfo.giftMoney - this.finalPrice >= 0 ? this.finalPrice : this.selectedVipCardDiscountInfo.giftMoney
      },
    },
    methods: {
      confirmSettleAccountsInPrePaidCard() {
        console.log(this.form)
        if (this.form.giftMoneyPay == null && this.form.giftMoneyPay === null) {
          // 焦点框激活又没输入的bug， 暂时怎么改，反正马上要重构.
        } else if (this.inputError) {
          return this.$message({
            type: 'error',
            message: '金额输入有误，请不要输入两位小数以上的数字',
          })
        }
        this.buttonDisabled = true;
        axios
          .post("/billingByPrepaidCard", {
            billId: this.billInfo.billId,
            giftMoneyPay: this.form.giftMoneyPay >= 0 ? this.form.giftMoneyPay * 1 : null,
            rechargeMoneyPay: this.form.rechargeMoneyPay >= 0 ? this.form.rechargeMoneyPay * 1 : null,
          })
          .then(res => {
            this.buttonDisabled = false;
            if (res.success) {
              this.$message({
                type: "success",
                message: "结算成功"
              });
              if (this.$route.path === '/shop-inner/cashier-dask/cashier-list') {
                this.$root.$emit('initCashierListPage')
              } else {
                this.$router.push("/shop-inner/cashier-dask/cashier-list");
              }
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          }).catch(err => {
            this.buttonDisabled = false;
          })
      },
      // - 重置赠送金输入
      handleGiftMoneyChanged(val) {
        if (val >= 0) {
          this.form.giftMoneyPay = val > this.maxGiftPay ? this.maxGiftPay : val
        } else {
          this.form.giftMoneyPay = 0
        }
      },
      // - 重置储值金输入
      handleRechargeMoneyChanged(val) {
        if (val >= 0) {
          this.form.rechargeMoneyPay = val > this.maxRechargePay ? this.maxRechargePay : val
        } else {
          this.form.rechargeMoneyPay = 0
        }
      },
      // - 储值金失焦
      handleRechargeBlur() {
        if (/^(\d*(\.\d{0,2})?)$/.test(this.form.rechargeMoneyPay) || this.form.rechargeMoneyPay == 0) {
          this.form.giftMoneyPay = (this.finalPrice - this.form.rechargeMoneyPay).toFixed(2) * 100 / 100
          this.inputError = false
        } else {
          this.inputError = true
        }
      },
      // - 赠送金失焦
      handleGiftBlur() {
        if (/^(\d*(\.\d{0,2})?)$/.test(this.form.giftMoneyPay) || this.form.giftMoneyPay == 0) {
          this.form.rechargeMoneyPay = (this.finalPrice - this.form.giftMoneyPay).toFixed(2) * 100 / 100
          this.inputError = false
        } else {
          this.inputError = true
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .main-con-cards {
    box-sizing: border-box;
    margin-top: 80px;
    padding-bottom: 90px;
    height: calc(100% - 80px);
    position: relative;
    text-align: left;
    .card-info-content {
      padding-left: 35px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .radio-item {
        width: 200px;
        height: 128px;
        border-radius: 5px;
        overflow: hidden;
        color: white;
        box-sizing: border-box;
        padding: 11px 14px 9px 11px;
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #fff;

        .card-info {
          display: flex;
          align-items: center;

          .brand-logo {
            flex: 0 0 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 6px;
          }

          .card-name {
            font-size: 18px;
          }
        }

        .money {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .total-money {
            line-height: 28px;
            font-size: 20px;
          }

          .gift-money {
            line-height: 17px;
            font-size: 12px;
          }
        }
      }

      .tip {
        line-height: 36px;

        span:nth-child(1) {
          color: #666666;
        }

        span:nth-child(2) {
          color: #f52d56;
        }
      }
    }

    .bottom-button-info {
      background: white;
      height: 90px;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-top: 1px solid #f0f1f4;

      .button {
        width: 200px;
        height: 40px;
        border-radius: 4px;
        padding: 0;
        background-color: rgba(245, 45, 86, 1);
        line-height: 40px;
        color: rgba(255, 255, 255, 1);
        font-size: 18px;
        text-align: center;
        cursor: pointer;
        margin-left: 60px;
      }

      p {
        color: #333333;
        font-size: 16px;
        width: 245px;
        text-align: center;
        line-height: 26px;
      }
    }

    .reminder-wrap{
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .align-right {
      text-align: right;
      padding-right: 2px;
    }
    .align-center {
      text-align: center;
    }
    .align-left {
      text-align: left;
      padding-left: 2px;
    }
  }
</style>
