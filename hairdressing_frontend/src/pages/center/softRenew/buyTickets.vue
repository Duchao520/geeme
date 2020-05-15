<template>
  <full-single-page>
    <div class="page-body" v-loading="pageLoading">
      <h2>门店续期券</h2>
      <br />
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="品牌名称:">
          <!-- <el-select v-model="form.brandId">
            <el-option v-for="year in yearsOption" :key="year.value" :label="year.label" :value="year.value"></el-option>
          </el-select>-->
          {{brandSoft.name}}
        </el-form-item>
        <el-form-item label="行业:">{{brandSoft.tradeName}}</el-form-item>
        <el-form-item label="进销存版:" v-if="supporFlag">
          <el-radio-group v-model="supporLier">
            <el-radio
              v-for="(item,index) in [{label:'NORMAL',name:'否'},{label:'SUPPLIER',name:'是'}]"
              :label="item.label"
              :key="index"
            >{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="购买版本:">{{brandSoft.version|versionFilter}}</el-form-item>
        <el-form-item label="开通时长:" prop="years">
          <!-- <el-select v-model="form.years">
            <el-option v-for="year in yearsOption" :key="year.value" :label="year.label" :value="year.value"></el-option>
          </el-select>-->
          一年
        </el-form-item>
        <el-form-item label="价格:">
          <strong>{{form.price}}元</strong>
        </el-form-item>
        <el-form-item label="购买数量:" prop="num">
          <div class="input-box">
            <!-- <el-input-number size="small" :min="1" :max="9999" v-model="form.total"></el-input-number> -->
            <input-number :max="9999" :min="1" v-model="form.num" />
          </div>
        </el-form-item>
        <el-form-item label="应付金额:">
          <strong>{{total}}元</strong>
        </el-form-item>
        <el-form-item label="付款方式:">
          <div class="payment-type-line">
            <div
              class="payment-type-box"
              v-for="type in payment"
              :key="type.value"
              :class="{active: active === type.value}"
              @click="changePaymentType(type)"
            >
              <img class="icon-img" :src="type.img" />
              <span>{{type.title}}</span>
              <img
                class="active-icon"
                v-show="active === type.value"
                src="static/images/default/icon_choose_blue.png"
              />
            </div>
          </div>
          <div class="scan-pay pay-line" v-show="active !== 'BANK'">
            <el-button class="normal_blue_btn" @click="scanToPay">立即支付</el-button>
          </div>
          <div class="bank-pay pay-line" v-show="active === 'BANK'">
            <div class="geeme-account">
              <div class="title">请将款项汇至如下账户：</div>
              <div class="indent account-name">户名： 杭州及美网络科技有限公司</div>
              <div class="indent account-number">账号： 3301 04016 0008 787289</div>
              <div class="indent account-bank">开户行： 杭州银行杭州滨江支行</div>
            </div>
            <div class="customer-account">
              <div class="title">汇款成功后，请填写：</div>
              <el-form ref="accountForm" :model="accountForm" label-width="120px">
                <el-form-item label="付款方户名">
                  <div class="limit-width">
                    <el-input v-model="accountForm.name" placeholder="请填写付款公司或个人全称" maxlength="48"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="付款方账号">
                  <div class="limit-width">
                    <el-input v-model="accountForm.account" placeholder="请准确填写付款账号" maxlength="36"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="付款时间">
                  <el-date-picker
                    v-model="accountForm.time"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                  <br />
                  <el-button class="normal_blue_btn" @click="payByBank">确认提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="确认订单" :visible="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="dialogForm" class="dialogForm" :model="dialogForm" label-width="100px">
        <el-form-item label="商品名称:">商家运营系统-门店续期券</el-form-item>
        <el-form-item label="订单号:" prop="code">{{dialogForm.code}}</el-form-item>
        <el-form-item label="付款方式:">{{active|paymentType}}</el-form-item>
        <el-form-item label="当前品牌:">{{brandSoft.name}}</el-form-item>
        <el-form-item label="行业:">{{brandSoft.tradeName}}</el-form-item>
        <el-form-item label="进销存版:" v-if="supporFlag">{{transSupporLier}}</el-form-item>
        <el-form-item label="购买版本:">{{brandSoft.version|versionFilter}}</el-form-item>
        <el-form-item label="开通时长:" prop="years">一年</el-form-item>
        <el-form-item label="价格:">
          <strong>{{form.price}}元</strong>
        </el-form-item>
        <el-form-item label="购买数量:">{{form.num}}</el-form-item>
        <el-form-item label="应付金额:">
          <b>{{total}}元</b>
        </el-form-item>
        <div class="qrcode-box">
          <div id="qrcode"></div>
          <p>使用 {{active === 'WE_CHAT'? '微信': '支付宝'}} 扫码完成支付</p>
        </div>
      </el-form>
    </el-dialog>
  </full-single-page>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState, mapActions } from "vuex";
import QRCode from "qrcodejs2";
import InputNumber from "@/components/common/InputNumber";
import { setInterval, clearInterval } from "timers";
export default {
  name: "",
  data() {
    return {
      form: {
        // years: 1, // 时长,
        price: 0,
        num: 1,
        id: 0 //
      },
      yearsOption: [
        { label: "一年", value: 1 }
        // {label: '两年', value: 2},
      ],
      payment: [
        {
          title: "微信支付",
          img: require("@/assets/images/icon_pay_weixin.png"),
          value: "WE_CHAT"
        },
        {
          title: "支付宝",
          img: require("@/assets/images/icon_pay_alipay.png"),
          value: "AlI_PAY"
        },
        {
          title: "银行汇款",
          img: require("@/assets/images/icon_pay_bank.png"),
          value: "BANK"
        }
      ],
      active: "WE_CHAT",
      dialogVisible: false, // 对话框
      pageLoading: false, // 页面加载
      dialogForm: {
        code: "",
        codeUrl: ""
      },
      timer: null,
      // 银行付款信息
      accountForm: {
        name: "",
        account: "",
        time: ""
      },
      // 是否拥有供应商的权利的标识
      supporFlag: false,
      // 门店营收类型
      supporLier: "NORMAL"
    };
  },
  watch: {
    supporLier(val) {
      this.getTicketsNum(val)
    }
  },
  created() {
    // 标识控制券的默认类型
    this.supporFlag = this.$route.query.supporFlag;
    this.supporLier = this.$route.query.supporFlagTwo ? "SUPPLIER" : "NORMAL";
    this.getTicketsNum(this.supporLier);
  },
  methods: {
    ...mapActions(["setBrandSoft"]),
    async getTicketsNum(lier) {
      this.pageLoading = true;
      let res = await axios.post("/getSoftInfo4BuySoft", {
        brandId: this.brandSoft.brandId,
        type: "RENEWAL",
        supportedStore: lier
      });
      console.log(res);
      console.log(this.brandSoft);
      let tag =
        this.brandSoft.version === 1
          ? "strandard"
          : this.brandSoft.version === 2
          ? "specialty"
          : "flagShip";
      this.form.price = res[tag][0].price; // 后续加的 懒得清空vuex了
      // this.setBrandSoft({
      //   price: res[tag][0].price
      // })
      this.form.id = res[tag][0].id;
      this.pageLoading = false;
    },
    changePaymentType(type) {
      if (type.value === "BANK") {
        this.$message({
          type: "info",
          message: "暂未开放"
        });
        return;
      }
      if (this.active !== type.value) {
        this.active = type.value;
      }
    },
    // 扫描立即支付
    async scanToPay() {
      if (this.active === "BANK") return false;
      let data = {
        num: this.form.num,
        payWay: this.active,
        brandId: this.brandSoft.brandId,
        softInfoId: this.form.id,
        type: "RENEWAL"   
      };
      let res = await axios.post("/createSoftOrder", data);
      if (res.success) {
        this.dialogVisible = true;
        this.dialogForm = {
          code: res.code,
          codeUrl: res.codeUrl
        };
        this.$nextTick(() => {
          this.Drawqrcode(res.codeUrl);
        });
        this.checkPayStatus();
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    checkPayStatus() {
      this.timer = setInterval(() => {
        axios.get("/getOrderStatus/" + this.dialogForm.code).then(res => {
          if (res.orderStatus !== 1) {
            this.clearIntervalFn();
            this.$message({
              type: res.orderStatus === 2 ? "success" : "error",
              message:
                res.orderStatus === 2
                  ? "支付成功，已为您跳转续期页面"
                  : res.message
            });
            this.$router.go(-1);
          }
        });
      }, 2000);
    },
    payByBank() {
      this.$message({
        type: "error",
        message: "该功能还未开放，请使用其他方式完成支付。"
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.clearIntervalFn();
    },
    clearIntervalFn() {
      clearInterval(this.timer);
      this.timer = null;
    },
    // 生成二维码
    Drawqrcode(codeUrl) {
      document.getElementById("qrcode").innerHTML = "";
      let qrcode = new QRCode("qrcode", {
        width: 160,
        height: 160, // 高度
        text: codeUrl // 二维码内容
      });
    }
  },
  beforeDestroy() {
    this.clearIntervalFn();
  },
  filters: {
    versionFilter(v) {
      let map = {
        1: "标准版",
        2: "专业版",
        3: "旗舰版"
      };
      return map[v];
    },
    paymentType(t) {
      let map = {
        WE_CHAT: "微信",
        AlI_PAY: "支付宝",
        BANK: "银行转账"
      };
      return map[t];
    }
  },
  components: { InputNumber },
  computed: {
    // 门店营收类型
    transSupporLier(){
      return this.supporLier === 'NORMAL' ? '否' : '是'
    },
    ...mapState({
      brandSoft: state => state.soft.brandSoft
    }),
    total() {
      return (this.form.price * 100 * this.form.num) / 100;
    }
  }
};
</script>
<style lang='scss' scoped>
.page-body {
  margin: 32px 78px 20px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .input-box {
    width: 140px;
    display: flex;
  }
  strong {
    font-size: 20px;
  }
  .payment-type-line {
    display: flex;
    flex-wrap: nowrap;
  }
  .payment-type-box {
    width: 150px;
    height: 50px;
    margin-right: 20px;
    border-radius: 4px;
    border: 1px solid rgba(220, 223, 230, 1);
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      border-color: #58c9f3;
    }
    img.icon-img {
      width: 32px;
      height: 32px;
    }
    span {
      color: #333;
      font-size: 16px;
      margin-left: 8px;
    }
    .active-icon {
      width: 35px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .pay-line {
    margin-top: 24px;
  }
}
.dialogForm {
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  b {
    color: red;
  }
  .qrcode-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }
  #qrcode {
    width: 160px;
    height: 160px;
    margin-bottom: 10px;
  }
}
.bank-pay {
  width: 700px;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(220, 223, 230, 1);
  display: flex;
  flex-direction: column;
  padding: 30px 30px 20px;
  .title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
  }
  .indent {
    text-indent: 16px;
  }
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  .limit-width {
    width: 300px;
  }
  .normal_blue_btn {
    margin-top: 12px;
  }
}
</style>
