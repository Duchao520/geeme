<template>
  <div style="overflow: hidden">
    <!--标题栏-->
    <header class="bg-f" style="width: 100%" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">取款</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
      <router-link to="/withdrawList" tag="div" class="icon fc-r fz15">提现记录</router-link>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--内容页-->
    <div class="bg-c main">
      <div class="list bg-f clearfix">
        <div class="clearfix flex-box" style="align-items: center">
          <div class="flex-box">
            <input type="radio" name='payway' id="payway1" checked="checked"/>
            <label class="radio" for="payway1" @click="selectZFB"></label>
          </div>
          <img src="@/assets/imgs/partnerCenter/zfb.png"/>
          <span class="fz15">{{accountNum || ""}}</span>
        </div>
        <div class="clearfix flex-box"  style="align-items: center">
          <div class="flex-box">
            <input type="radio" name='payway' id="payway2"/>
            <label class="radio" for="payway2" @click="selectWX"></label>
          </div>
          <img class="fl-l" src="@/assets/imgs/partnerCenter/wx.png"/>
          <div class="fl-l">
            <p class="fz12">当前绑定助商通对应的微信</p>
            <p class="fc-c fz12">助商通ID({{userIfo.username}})</p>
          </div>
        </div>
      </div>
      <!--提现现金-->
      <div class="bg-f box">
        <p class="fz17">提现金额</p>
        <div class="border-buttom input-box relative flex-box">
          <span class="fw-6 fz15">￥</span>
          <input type="number" class="fz15" placeholder="请输入提现金额" v-model="money"/>
        </div>
        <!--冻结资金说明部分-->
        <div class="fz12 fc-r pd-lr-10">
          <p class="fz12 fw-6 tip-num fc-black">最多可提现
            <span
              v-if="Number(moneyInfo.frozenMoney).toFixed(2) > 0">{{Number(moneyInfo.frozenMoney).toFixed(2)}}</span><span
              v-else>0</span>元，
            账号总金额{{Number(moneyInfo.canPostalAmounts).toFixed(2) || 0}}元</p>
          <p class="">注：每年服务商净收入的{{$accMul(Number(moneyInfo.refereeIncomeRatio),100)}}%需作为服务支持作用</p>
          <p class="">注：提现需要扣除{{$accMul(Number(moneyInfo.serviceRate),100)}}%手续费</p>
          <p>&nbsp</p>
          <p>&nbsp</p>
          <div v-show="frozenState">
            <p class="">账户总额：{{moneyInfo.canPostalAmounts || 0}}元（冻结比例{{moneyInfo.amountsFreezRatio*100}}%）</p>
            <p class="">您的加盟费还需补缴：{{moneyInfo.agentFee-moneyInfo.receivedAgentFee || 0}}元</p>
            <p>&nbsp</p>
            <p class="clearfix fc-c" v-show="rangeLen != '100%'">
              <!--<span class="fl-l" v-show="Number(moneyInfo.frozenMoney)>0">冻结资金{{Math.floor((moneyInfo.canPostalAmounts - moneyInfo.frozenMoney )*100)/100}}元</span>
                            <span class="fl-l" v-show="Number(moneyInfo.frozenMoney)<=0">冻结资金{{moneyInfo.canPostalAmounts || 0}}元</span>-->
              <span
                class="fl-l">冻结资金{{Math.floor((moneyInfo.canPostalAmounts - moneyInfo.frozenMoney )*100)/100 || 0}}元</span>
              <span class="fl-r" v-if="Number(moneyInfo.frozenMoney)>0">加油！您还剩{{Math.floor((moneyInfo.agentFee-moneyInfo.receivedAgentFee-(moneyInfo.canPostalAmounts - moneyInfo.frozenMoney ))*100)/100}}元</span>
              <span class="fl-r" v-else>加油！您还剩{{moneyInfo.agentFee-moneyInfo.receivedAgentFee-moneyInfo.canPostalAmounts || 0}}元</span>
            </p>
            <p class="clearfix fc-c" v-show="rangeLen == '100%'">
              <span class="fl-l">冻结资金{{moneyInfo.agentFee-moneyInfo.receivedAgentFee || 0}}元</span>
              <span class="fl-r">加油！您还剩0元</span>
            </p>
            <!--进度条-->
            <div class="range">
              <div class="rangeLen" :style="{width:rangeLen}"></div>
            </div>
            <p class="clearfix fc-c"><span class="fl-l">0</span><span class="fl-r">{{moneyInfo.agentFee-moneyInfo.receivedAgentFee || 0}}</span>
            </p>
            <p v-show="rangeLen == '100%'"><span class="fc-r btn-border" @click="overPayAgent" v-if="overPayAgentClick">恭喜您已完成任务</span><span
              class="fc-r btn-border" v-else>恭喜您已完成任务</span></p>
          </div>
        </div>
        <!---->
        <button type="button" class="btn fz20" @click="showPrompt" v-if="Number(moneyInfo.frozenMoney).toFixed(2) > 0">
          申请提现
        </button>
        <button type="button" class="btn fz20 btn-opcity" v-else>申请提现</button>
        <p class="fc-c fz10 tip">预计三个工作日内到账</p>
      </div>
    </div>
    <!--prompt 提示框-->
    <div v-show="promptState">
      <div class="mask v-modal-enter"></div>
      <div class="prompt-wrapper fz14 v-modal-enter" :class="!promptState?'v-modal-leave':''">
        <div class="prompt-head">
          <h4>点击获取验证码，验证码发送至手机号码为{{userIfo.phone}}，请注意查收</h4>
        </div>
        <div class="prompt-con">
          <div class="relative">
            <input type="number" placeholder="请输入验证码" class="fz14" v-model="smsCode"/>
            <button type="button" class="btn-code" @click="getSmsCode" v-show="!computedTime">获取验证码</button>
            <button type="button" class="btn-code " v-show="computedTime">倒计时（{{computedTime}}）</button>
            <!--<button type="button" class="btn-code">获取验证码</button>-->
          </div>
        </div>
        <div class="prompt-foot ">
          <div class="flex-box border-top fz16">
            <button class="border-right item" type="button" @click="hidePrompt">取消</button>
            <button type="button" class="btn-reset item" v-if="resetBtn">确定</button>
            <button class="item fc-r" type="button" @click="postCash" v-else>确定</button>
          </div>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {putCashCode , withdraw , overPayAgent , getFrozen , getUserInfo} from '@/assets/js/getData';
  import {postColor , closeWebView} from "@/assets/js/jsBridge";
  import {rule , isNVL} from "@/assets/js/deal";

  let _setTime; //关闭webview定时器
  export default {
    props: ['partnerToken'],
    data() {
      return {
        money: '',
        userIfo: {}, //代理商信息
        phone: '',
        ID: '',
        accountNum: '',
        payway: '1', //支付方式
        promptState: false, //获取提现验证码的弹窗状态
        smsCode: '', //短信验证码
        computedTime: 0,
        resetBtn: false, //禁止多次申请提现
        rangeLen: '0%',//进度条的长度
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        moneyInfo: {},
        frozenState: true,//是否冻结金额完毕
        overPayAgentClick: true,
      }
    },
    watch: {
      $route(to, from) {
        if (to.path == '/') {
          console.log('路由已经跳转')
        } else {
          console.log('关闭页面')
        }
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        if (window.history.length <= 1) {
          closeWebView(); //关闭webview
        } else {
          this.$route.query.close == 1 ? closeWebView() : this.$router.go(-1);//返回上一层
        }
        //上面都没执行就说明卡在当前页不是最后一条， histroy记录数量大于1，又没有回退记录，只能返关闭webview
        //如果上面都执行了 页面都跳走了，这个也就不用管了
        /* this.timer = setInterval(() => {
             comm.toast('关闭webview ')
             //comm.closeWebView(); //关闭webview
         },500);*/
      },
      /*验证码倒计时*/
      sendMess() {
        let _self = this;
        _self.computedTime = 60;
        //倒计时
        _self.timer = setInterval(() => {
          _self.computedTime--;
          if (_self.computedTime == 0) {
            clearInterval(_self.timer)
          }
        }, 1000);
      },
      //获取短信验证码
      getSmsCode() {
        let _self = this;
        let _data = {
          token: _self.token,
          type: 8
        };
        _self.sendMess();
        _self.$getSignIn(_data).then(sec => {
          putCashCode(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {

            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      /*点击按钮出现prompt*/
      showPrompt() {
        let _self = this;
        if (rule.empty(_self.money, '金额不能为空') && rule.testSum(_self.money) && _self.payway != '') {
          if (Number(_self.money) <= Number(_self.moneyInfo.frozenMoney)) {
            _self.promptState = true;
          } else {
            _self.toast('不能超过最大提现金额');
          }
        } else if (_self.payway == '') {
          _self.toast('请选择支付方式');
        }
      },
      hidePrompt() {
        this.resetBtn = false;
        this.promptState = false;
        this.smsCode = '';
      },
      /*提交提现申请*/
      postCash() {
        let _self = this;
        let _data = {
          token: _self.token,
          transMoney: _self.money, //提现的金额
          //accountNum : '' , //支付宝提现时，支付宝的提现账号
          accountType: _self.payway, //1支付宝 2微信 3银行
          smsCode: _self.smsCode, //短信验证码
        };

        if (rule.empty(_self.smsCode, '验证码不能为空')) {
          _self.resetBtn = true;
          _self.$getSignIn(_data).then(sec => {
            withdraw(_data,sec).then(res => {
              let _data = res.data;
              if (_data.state == 1) {
                _self.promptState = false; //提交提现申请成功，隐藏弹窗
                _self.smsCode = '';
                _self.money = '';
                _self.toast("提现成功，等待到账");
                _self.getFrozenInfo();
                _self.getUserInfo();
              } else {
                _self.toast(decodeURIComponent(_data.msg));
              }
              _self.resetBtn = false;
            }).catch(function (error) {
              _self.toast(error);
            });
          })
        }
      },
      //选择微信提现方式
      selectWX() {
        this.payway = 2;
        //comm.getWXOpenId();
      },
      //选择支付宝提现方式
      selectZFB() {
        this.payway = 1;
      },
      //跳转app支付宝账号列表
      goZFBWebview() {
        // comm.openZFBList();
      },
      //补缴代理费
      overPayAgent() {
        let _self = this;
        let _data = {
          token: _self.token,
        };
        _self.overPayAgentClick = false;
        _self.$getSignIn(_data).then(sec => {
          overPayAgent(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.frozenState = false;
              _self.overPayAgentClick = true;
              _self.getFrozenInfo();

            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //获取冻结的相关信息
      getFrozenInfo() {
        let _self = this;
        let _data = {
          token: _self.token,
        };
        _self.$getSignIn(_data).then(sec => {
          getFrozen(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.amountsFreezRatio == 0) {
                _self.frozenState = false;
              }
              if (_data.data.agentFee - _data.data.receivedAgentFee > (_data.data.canPostalAmounts - _data.data.frozenMoney)) { //未缴服务费 > 冻结的金额
                //_self.frozenState = true ;
                _self.rangeLen = (((_data.data.canPostalAmounts - _data.data.frozenMoney) / (_data.data.agentFee - _data.data.receivedAgentFee)) * 100).toFixed(2) + "%";
              } else { //代理商冻结费用小于可提现金额
                //_self.frozenState = false ;
                _self.rangeLen = '100%';
              }
              _self.moneyInfo = _data.data;
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //获取账号信息
      getUserInfo() {
        let _self = this;
        let _data = {
          token: _self.token
        };
        _self.$getSignIn(_data).then(sec => {
          getUserInfo(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.userIfo = _data.data;
              Number(_data.data.frozenMoney) < 0 ? _data.data.frozenMoney = 0 : _data.data.frozenMoney = _data.data.frozenMoney;
              _self.accountNum = isNVL(_data.data.accountNum[0].accountNum, "");
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getFrozenInfo();
        _self.getUserInfo();
      });
    },
    mounted() {
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
      let _self = this;
      // window.ZSTGetZFB = comm.ZSTGetZFB;
      // window.ZSTGetOpenid = comm.ZSTGetOpenid;
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/partner_base.css';
  .icon {
    line-height: 44px;
  }

  .main {
    padding: 10px 5px;
  }

  .list {
    margin-bottom: 5px;
    padding: 9px 0;
  }

  .list > div {
    padding: 12px 0;
  }

  .list span {
    vertical-align: top;
  }

  .list img {
    height: 29px;
    margin-right: 15px;
  }

  .right-arrow {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -7px;
  }

  .box {
    padding: 0 10px;
  }

  .box .fz17 {
    padding-left: 15px;
    line-height: 44px;
    margin-bottom: 10px;
  }

  .input-box {
    padding: 20px 0 10px 35px;
  }

  .input-box span {
    position: absolute;
    left: 14px;
    top: 30px;
  }

  .box input {
    font-size: 28px;
  }

  .tip {
    text-align: center;
    padding-bottom: 20px;
  }

  .tip-num {
    padding: 20px 0 10px 0;
  }


  .btn-code {
    right: 18px;
    top: 0px;
    width: 100px;
    right: 0;
  }

  .radio {
    margin: 0 18px 0 13px;
  }

  /*进度条*/
  .range {
    background: #eee;
    border-radius: 9px;
    width: 100%;
    height: 9px;
    overflow: hidden;
    margin: 2px auto;
  }

  .rangeLen {
    height: 9px;
    border-radius: 9px;
    background: #ffb415;
  }

  .btn-border {
    border: 1px solid #F7094D;
    border-radius: 5px;
    line-height: 2;
    display: inline-block;
    width: 135px;
    position: relative;
    top: -12px;
    left: 50%;
    margin-left: -67px;
    text-align: center;
  }

</style>

