<template>
  <div class="newbuy-wrap">
    <center-header :title="'个人中心'" :backing="'返回'" :isSelfSite="true" />
    <div class="newbuy-wrap_main">
      <h1>门店新开券</h1>
      <div class="newbuy-wrap_content">
        <section>
          <strong>品牌名称</strong>
          <!-- <el-select v-model="brandId" placeholder="请选择">
              <el-option
                v-for="item in brandNames"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <span>{{brandSoft.name}}</span>
        </section>
        <section>
          <strong>行业</strong>
          <span>{{brandSoft.tradeName}}</span>
        </section>
        <section v-if="supporFlag">
          <strong>进销存版</strong>
          <span>
            <el-radio-group v-model="supporLier">
              <el-radio
                v-for="(item,index) in [{label:'NORMAL',name:'否'},{label:'SUPPLIER',name:'是'}]"
                :label="item.label"
                :key="index"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </span>
        </section>
        <section>
          <strong>购买版本</strong>
          <span>{{versionName}}</span>
          <!-- <span class="blue-span" @click="editVision">修改版本</span> -->
        </section>
        <section v-if="false">
          <strong>购买版本</strong>
          <el-select disabled v-model="version" placeholder="请选择">
            <el-option
              v-for="item in versionSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <span class="blue-span" @click="editVision">修改版本</span> -->
        </section>
        <section>
          <strong>开通时长</strong>
          <!-- <el-select disabled v-model="time" placeholder="请选择">
            <el-option
              v-for="item in times"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
          <span>一年</span>
        </section>
        <section>
          <strong>价格</strong>
          <span class="info-span">{{price}}元</span>
        </section>
        <el-row type="flex" align="middle">
          <strong>购买数量</strong>
          <el-input placeholder="请输入内容" v-model="num" @blur="numBlur" class="input-with-select">
            <el-button
              slot="prepend"
              icon="el-icon-minus"
              @click="num--"
              @touchstart="num--"
              size="mini"
              :disabled="num<=1"
            ></el-button>
            <el-button
              slot="append"
              icon="el-icon-plus"
              @click="num++"
              @touchstart="num++"
              size="mini"
            ></el-button>
          </el-input>
        </el-row>
        <section>
          <strong>应付金额</strong>
          <span class="red-text">{{account | filterPrice}}元</span>
          <br />
          <!-- <span class="small-text" v-if="num>=5">购买数量超过5家，享受9折优惠</span> -->
        </section>
        <el-row type="flex">
          <strong>付款方式</strong>
          <div class="tab-card">
            <el-row type="flex" class="tab-card-pay" justify="space-between">
              <el-row
                type="flex"
                justify="center"
                align="middle"
                @click.native="checkItem(index,item.value)"
                v-bind:class="{active:index==isActive}"
                v-for="(item, index) in btnData"
                :key="item.title"
                class="pay-btn"
              >
                <img :src="item.img" class="pay-img" alt />
                <span v-text="item.title"></span>
                <img src="static/images/default/icon_choose_blue.png" />
              </el-row>
            </el-row>
            <div class="check-pay">
              <div v-if="isActive===2" class="check-pay_box">
                <div class="box-body">
                  <h3>请将款项汇至如下账户：</h3>
                  <p>
                    户名： 杭州及美网络科技有限公司
                    <br />账号： 3301 04016 0008 787289
                    <br />开户行： 杭州银行杭州滨江支行
                  </p>
                  <h3>汇款成功后，请填写：</h3>
                  <el-form ref="form" class="form-body" :model="payForm.form" label-width="100px">
                    <el-form-item label="付款方户名">
                      <el-input
                        class="input"
                        placeholder="请填写付款公司或个人全称"
                        v-model="payForm.form.name"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="付款方账号">
                      <el-input class="input" placeholder="请准确填写付款账号" v-model="payForm.form.ccount"></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间">
                      <el-date-picker
                        v-model="payForm.form.time"
                        type="date"
                        placeholder="选择日期"
                        :append-to-body="false"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">确认提交</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <el-button
                v-if="isActive !=2"
                :loading="createLoading"
                type="primary"
                class="pay-button"
                @click="selectPay"
              >立即支付</el-button>
            </div>
          </div>
        </el-row>
      </div>
    </div>
    <g-del-model
      :delTagDialogVisible="warningModelVisible"
      @close="backNewBuy"
      @confirm="createShop"
      :title="initData.title"
      :content="initData.content"
      :icon="initData.icon"
      :iconColor="initData.iconColor"
      :confirmButton="initData.btn"
    ></g-del-model>
    <g-del-model
      :delTagDialogVisible="closeOrderDialog"
      @close="closeOrder"
      @confirm="closeOrderDialog = false"
      :title="closeData.title"
      :content="closeData.content"
      :icon="closeData.icon"
      :iconColor="closeData.iconColor"
      :confirmButton="closeData.confirm"
      :concelButton="closeData.concel"
    ></g-del-model>
    <el-dialog
      :visible.sync="qrcodeDialog"
      class="orderInfo"
      width="800px"
      title="确认订单"
      :close-on-click-modal="false"

      :close-on-press-escape="false"
      @close="closeQrcode('manual')"
    >
      <section>
        <strong>商品名称</strong>
        <span>商家运营系统-门店新开券</span>
      </section>
      <section>
        <strong>订单号</strong>
        <span>{{code}}</span>
      </section>
      <section>
        <strong>付款方式</strong>
        <span>{{payWay == "AlI_PAY" ? "支付宝" : payWay == "WE_CHAT" ? "微信" : payWay == "BANK" ? "银行转账" : '其他'}}</span>
      </section>
      <section>
        <strong>当前品牌</strong>
        <span>{{brandSoft.name}}</span>
      </section>
      <section>
        <strong>行业</strong>
        <span>{{brandSoft.tradeName}}</span>
      </section>
      <section v-if="supporFlag">
        <strong>进销存版</strong>
        <span>{{transSupporLier}}</span>
      </section>
      <section>
        <strong>购买版本</strong>
        <span>{{versionName}}</span>
      </section>
      <section>
        <strong>开通时长</strong>
        <span>1年</span>
      </section>
      <section>
        <strong>价格</strong>
        <span class="price">{{price}}元</span>
      </section>
      <section>
        <strong>购买数量</strong>
        <span>{{num}}</span>
      </section>
      <section>
        <strong>应付金额</strong>
        <span class="Totalprice">{{account | filterPrice}}元</span>
      </section>
      <div id="qrcode" style="width:160px;margin: auto;"></div>
      <p
        style="text-align: center; padding-top: 10px;"
      >请使用{{payWay == 'WE_CHAT'? '微信': payWay == 'AlI_PAY' ? '支付宝' : ''}}扫码完成支付</p>
    </el-dialog>
  </div>
</template>
<script>
import centerHeader from "@/components/common/CenterHeader";
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { setInterval, clearInterval, setTimeout } from "timers";
import QRCode from "qrcodejs2";
var timer = null;
export default {
  name: "newbuy",
  components: { centerHeader },
  data() {
    return {
      warningModelVisible: false,
      qrcodeDialog: false,
      closeOrderDialog: false,
      initData: {
        title: "购买成功",
        content: "门店新开券购买成功，立即创建门店",
        icon: "icon_popup_success",
        iconColor: "#00CF82",
        btn: "创建门店"
      },
      closeData: {
        title: "确定要放弃支付吗？",
        content: "放弃后，该交易将自动关闭。",
        icon: "icon_popup_question",
        iconColor: "#FCB322",
        confirm: "继续支付",
        concel: "放弃支付"
      },
      versionSelect: [
        {
          label: "标准版",
          value: 1
        },
        {
          label: "专业版",
          value: 2
        },
        {
          label: "旗舰版",
          value: 3
        }
      ],
      times: [
        {
          label: "1年",
          value: 1
        },
        {
          label: "2年",
          value: 2
        },
        {
          label: "3年",
          value: 3
        }
      ],
      version: 1,
      softInfoId: 0, // 软件啥啥啥id
      isActive: 0,
      btnData: [
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
      time: 1,
      num: 1,
      price: null, // 价格
      payForm: {
        form: {
          name: "",
          ccount: "",
          time: ""
        }
      },
      payWay: "WE_CHAT",
      versions: [],
      brandNames: [],
      brandId: null,
      versionName: "",
      status: "init", // init 初始， create 创建订单  over 订单结束
      code: "",
      createLoading: false,
      // 是否拥有供应商的权利的标识
      supporFlag: false,
      // 门店营收类型
      supporLier:'NORMAL'
    };
  },
  filters: {
    filterPrice(value) {
      return value.toFixed(2);
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    // 门店营收类型
    transSupporLier(){
      return this.supporLier === 'NORMAL' ? '否' : '是'
    },
    ...mapState({
      brandSoft: state => state.soft.brandSoft,
      shopSoft: state => state.soft.shopSoft
    }),
    account() {
      return this.price * this.num;
    }
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "saveOperate"]),
    checkItem(index, item) {
      if (this.status == "init") {
        if (index === 2) {
          return utils.showTip(this, {
            msg: "暂不支持",
            type: "info"
          });
        }
        this.isActive = index;
        this.payWay = item;
      }
    },
    /**初始化数据 */
    init(lier) {
      this.brandId = this.brandSoft.brandId;
      let senData = {
        brandId: this.brandId,
        type: "BUY_NEW",
        supportedStore: lier
      };
      axios.post(api.getSoftInfoBuySoft.URL, senData).then(res => {
        this.version = res.curVersion;
        console.log(res)
        this.softInfoId =
          this.version === 1
            ? res.strandard[0].id
            : this.version === 2
            ? res.specialty[0].id
            : res.flagShip[0].id;
        if (this.version === 1) {
          this.versionName = "标准版";
        } else if (this.version === 2) {
          this.versionName = "专业版";
        } else {
          this.versionName = "旗舰版";
        }
        this.versions.push(res.flagShip[0], res.specialty[0], res.strandard[0]);
        this.price =
          this.version === 1
            ? res.strandard[0].price
            : this.version === 2
            ? res.specialty[0].price
            : res.flagShip[0].price;
      });
      // axios.get(api.myMGbrand.URL).then(res => {
      //   this.getSelectData(res)
      // })
    },
    numBlur(val) {
      if (this.num <= 0) {
        utils.showTip(this, { msg: "购买数量必须大于0", type: "info" });
        this.num = 1;
      }
    },
    getSelectData(res) {
      this.brandNames = res.brandList.map(item => {
        let data = {};
        data.label = item.name;
        data.value = item.id;
        return data;
      });
    },
    /**修改版本- 跳转到编辑品牌页面 */
    editVision() {
      this.saveOperate({ clickEnter: "edit" });
      this.saveCurrentInfo({
        brandId: this.brandId
      });
      this.$router.push("/brand-inner/edit/brands");
    },
    /**创建支付订单 */
    selectPay() {
      this.createLoading = true;

      let params = {
        brandId: this.brandId,
        num: this.num,
        payWay: this.payWay,
        softInfoId: this.softInfoId,
        type: "BUY_NEW"
      };
      axios.post("/createSoftOrder", params).then(res => {
        this.selectPayRes(res);
        this.createLoading = false;
      });
    },
    /**返回支付结果 */
    selectPayRes(res) {
      if (res.success) {
        this.status = "create";
        this.code = res.code;
        this.qrcodeDialog = true;
        let that = this;
        this.getOrderStatus();
        setTimeout(function() {
          that.Drawqrcode(res.codeUrl);
        }, 200);
      } else {
        utils.showTip(this, {
          msg: res.message,
          type: res.success ? "success" : "error"
        });
      }
    },
    // 查询支付状态
    getOrderStatus() {
      let that = this;
      timer = setInterval(function() {
        if (that.status == "over") {
          clearInterval(timer);
          timer = null;
        } else {
          axios.get("/getOrderStatus/" + that.code).then(res => {
            if (res.orderStatus != 1) {
              that.status = "over";
              clearInterval(timer);
              timer = null;
              if (res.orderStatus == 2) {
                that.warningModelVisible = true;
              } else if (res.orderStatus == 3) {
                utils.showTip(that, { msg: "支付失败", type: "error" });
              }
            }
          });
        }
      }, 2000);
    },
    createShop() {
      this.warningModelVisible = false;
      // 默认将购买开店券的品牌id携带过去
      let brandId = this.brandSoft.brandId
      this.$router.push({
        path:"/brand-inner/create/shops",
        query:{
          brandId
        }
      });
    },
    backNewBuy() {
      this.warningModelVisible = false;
      this.$router.push("/center/buySoftware");
    },
    // 生成二维码
    Drawqrcode(codeUrl) {
      document.getElementById("qrcode").innerHTML = "";
      let qrcode = new QRCode("qrcode", {
        width: 160,
        height: 160, // 高度
        text: codeUrl // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      });
    },
    // 调起关闭订单弹框
    closeQrcode(type) {
      if (type) {
        this.closeOrderDialog = true;
        this.qrcodeDialog = true;
      }
    },
    // 关闭订单
    closeOrder() {
      axios.get("/closeOrder/" + this.code).then(res => {
        this.closeOrderDialog = false;
        this.qrcodeDialog = false;
        if (res.success) {
          this.status = "over";
          clearInterval(timer);
          timer = null;
          this.status = "init";
          //this.$router.push('/center/buySoftware')
        }
        this.$message({
          type: res.success ? "success" : "error",
          message: res.message
        });
      });
    }
  },
  mounted() {
    // 标识控制券的默认类型
    this.supporFlag = this.$route.query.supporFlag;
    this.supporLier = this.$route.query.supporFlagTwo ? 'SUPPLIER' : 'NORMAL'
    this.init(this.supporLier);
  },
  watch: {
    supporLier(val) {
      this.init(val)
    }
  },
  destroyed() {
    clearInterval(timer);
    timer = null;
  }
};
</script>
<style lang="scss">
.el-table .warning-row {
  background: #f4f5f7;
}

.el-table .success-row {
  background: #ffff;
}
.el-input-group__prepend,
.el-input-group__append {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.orderInfo {
  /deep/ .el-dialog {
    border-radius: 4px;
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #f0f1f4;
  }
  section {
    padding: 10px 0px;
  }
  strong {
    width: 100px;
    text-align: right;
    padding-right: 20px;
    color: #666;
    display: inline-block;
  }
  span {
    color: #333;
    &.price {
      font-weight: bold;
      font-size: 20px;
    }
    &.Totalprice {
      color: #e6333f;
      font-size: 20px;
    }
  }
}
.pay-button {
  border: none;
}
.input-with-select {
  width: 150px;
  height: 33px;
  padding-left: 4px;
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.el-input-number {
  position: relative;
  display: inline-block;
  width: 145px;
  line-height: 38px;
}
.newbuy-wrap {
  max-width: 1440px;
  margin: 85px auto;
  &_main {
    flex: auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    padding: 32px 78px;
    min-height: calc(100vh - 180px);
  }
  &_content {
    margin: 3px 0 0 0;
    section {
      margin: 20px 0;
    }
    h1 {
      height: 30px;
      color: rgba(51, 51, 51, 1);
      font-size: 22px;
      text-align: left;
    }
    strong {
      display: inline-block;
      width: 70px;
      height: 20px;
      color: rgba(102, 102, 102, 1);
      font-size: 14px;
      text-align: right;
      margin-right: 20px;
    }
    span {
      color: rgba(51, 51, 51, 1);
      font-size: 14px;
      text-align: left;
    }
  }
  .info-span {
    font-size: 20px;
    text-align: left;
  }
  .blue-span {
    color: rgba(88, 201, 243, 1);
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    &:active {
      color: red;
    }
  }
  .red-text {
    color: rgba(230, 51, 63, 1);
    font-size: 20px;
  }
  .small-text {
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    text-align: left;
    padding-left: 96px;
  }
}
.el-table-re {
  width: 100%;
  padding: 0 20px 20px 20px;
  border-radius: 6px;
}
.pay-box {
  width: 183px;
  height: 200px;
  margin-left: 96px;
  border: 1px solid red;
}
.pagination {
  margin-top: 10px;
}
.delete-btn {
  cursor: pointer;
  i {
    font-size: 20px;
    color: #bec3c6;
  }
  &:hover,
  &:active {
    i {
      color: red;
    }
  }
}
.tab-card {
  width: 40%;
  display: flex;
  flex-direction: column;
  &-pay {
    width: 100%;
    margin-bottom: 20px;
  }
}
.pay-img {
  width: 25px;
  height: 25px;
  margin-right: 8px;
}
.pay-btn {
  width: 150px;
  height: 50px;
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  img:first-child {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
  img:last-child {
    width: 35px;
    height: 22px;
    display: none;
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
  input {
    width: 100%;
    height: 100%;
    border: none;
  }
}
.active {
  border: 1px solid rgba(88, 201, 243, 1);
  img:last-child {
    display: block;
  }
}
.check-pay {
  &_box {
    width: 700px;
    height: 472px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(220, 223, 230, 1);
  }
  .box-body {
    padding: 30px;
    h3 {
      color: rgba(51, 51, 51, 1);
      font-size: 16px;
    }
    p:nth-child(2) {
      padding: 10px 0 30px 19px;
      line-height: 30px;
    }
    .input {
      width: 250px;
    }
    .form-body {
      padding-top: 20px;
    }
  }
  button {
    background: #58c9f3;
  }
}
.shop-input {
  width: 200px;
  height: 40px;
}
</style>
