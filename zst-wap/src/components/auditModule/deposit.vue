<template>
  <div class="deposit">
    <toast ref="toast" :tip="tip"></toast>
    <transition name="alertMsg">
      <div class="bg" v-show="isPass || reject">
        <div class="isPass" v-if="isPass">
          <div class="close" @click="close">
            <img src="@/assets/imgs/common/close.png" alt="">
          </div>
          <p style="font-size: .34rem">审核提示</p>
          <p style="font-size: .3rem">确定同意该笔提现申请?</p>
          <div class="submit">
            <button @click="close">否</button>
            <button @click="submit(1)">是</button>
          </div>
        </div>
        <div class="reject" v-if="reject">
          <div class="close" @click="close">
            <img src="@/assets/imgs/common/close.png" alt="">
          </div>
          <p>请输入拒绝审核的原因</p>
          <textarea v-model="auditRemark" placeholder="如提现账号与名字不一致"></textarea>
          <div class="btns">
            <button @click="close">取消</button>
            <button @click="submit(-1)">拒绝审核</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="detail">
      <div class="detail-item">提现类型：{{typeName}}提现</div>
      <div class="detail-item">提现金额：{{detail.transMoney}}元</div>
      <div class="detail-item">提现方式：{{detail.accountType == 1 ? '支付宝' : '微信'}}</div>
      <div class="detail-item">提现账号：{{detail.accountNum}}</div>
      <div class="detail-item">提现用户名：{{detail.accountRealName}}</div>
      <div class="detail-item">昵称：{{detail.nick}}</div>
      <div class="detail-item">用户ID：{{detail.username}}</div>
      <div class="detail-item dashed">状态：<i>{{detail.state == 0 ? '待审核' : detail.state == 1 ? '审核通过' : '审核失败'}}</i></div>
      <div class="detail-item failed" v-if="detail.state == -1">失败原因：{{detail.auditRemark}}</div>
      <div class="detail-item space_between" v-if="detail.state == 0&&way!=1"><span>可提现金额：{{canPostalAmounts}}元</span>
        <router-link tag="p" :to="{name: 'depositList',query:{type: type,withdrawUserId: detail.withDrawUserId}}">审核提现明细<i class="iconfont icon-youjiantou"></i></router-link></div>
      <div class="detail-item space_between" v-if="detail.state == 0&&way!=1"><span>总收益金额：{{hisTradeCommission}}元</span>
        <router-link tag="p" :to="{name: 'earnList',query:{type: type,withdrawUserId: detail.withDrawUserId}}">审核收益明细<i class="iconfont icon-youjiantou"></i></router-link></div>
    </div>
    <div class="btns" v-if="detail.state == 0&&way!=1">
      <button @click="reject = true">拒绝</button>
      <button @click="isPass = true">同意</button>
    </div>
  </div>
</template>

<script>
  import {depositDetail , depositAudit} from "@/assets/js/comm";
  import {getSignIn , postTitle , reqAuditStatus} from "@/assets/js/jsBridge";
  import toast from "@/components/common/toast";

  export default {
    name: "deposit",
    components: {
      toast
    },
    data() {
      return {
        isPass: false,
        reject: false,
        withDrawid: this.$route.query.withDrawid,
        type: this.$route.query.type,
        pushnewsId: this.$route.query.pushnewsId,
        pushLogId: this.$route.query.pushLogId,
        auditorImAccount: this.$route.query.auditorImAccount,
        way: this.$route.query.way,
        typeName: '',
        detail: '',
        canPostalAmounts: '',
        hisTradeCommission: '',
        auditRemark: '',
        tip: '审核结果已提交'
      }
    },
    methods: {
      close() {
        var _self = this;
        _self.isPass = false;
        _self.reject = false;
      },
      init() {
        var _self = this;
        if(_self.way == 1){
          postTitle('提现详情')
        }else{
          postTitle('审核详情')
        }
        _self.typeInit();
        _self.getDetail();
      },
      typeInit(){
        var _self = this;
        if(_self.type == 1){
          _self.typeName = '用户'
        }else if(_self.type == 2){
          _self.typeName = '商家'
        }else if(_self.type == 3){
          _self.typeName = '服务商'
        }
      },
      //获取明细
      getDetail() {
        var _self = this;
        var _data = {
          withDrawid: String(_self.withDrawid),
          type: String(_self.type)
        };
        getSignIn(_data).then(sec => {
          depositDetail(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.detail = res.data.data;
              _self.canPostalAmounts = res.data.canPostalAmounts;
              _self.hisTradeCommission = res.data.hisTradeCommission;
            }
          })
        })
      },
      //同意或拒绝
      submit(state){
        var _self = this;
        var _data;
        if(state == 1){
          _data = {
            state: String(state),
            withDrawid: String(_self.withDrawid),
            auditorImAccount: String(_self.auditorImAccount),
            type: String(_self.type)
          }
        }else if(state == -1){
          _data = {
            state: String(state),
            withDrawid: String(_self.withDrawid),
            type: String(_self.type),
            auditRemark: String(_self.auditRemark),
            auditorImAccount: String(_self.auditorImAccount)
          }
        }
        getSignIn(_data).then(sec => {
          depositAudit(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.getDetail();
              var status;
              if(state == 2){
                status = -1
              }else{
                status = 1
              }
              _data = {
                newsId: _self.pushLogId,
                state: status
              };
              reqAuditStatus(_data);
            }else{
              _self.tip = decodeURI(res.data.msg);
            }
            _self.close();
            _self.$refs.toast.toast()
          })
        })
      }
    },
    mounted() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .deposit {
    box-sizing: border-box;
    padding: .41rem .29rem;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background: rgba(12, 12, 12, .5);

      .isPass {
        width: 5.5rem;
        height: 3.3rem;
        box-sizing: border-box;
        padding-top: .62rem;
        border-radius: .1rem;
        background: #FFFFFF;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;

        .close {
          width: .55rem;
          height: .55rem;
          position: absolute;
          top: -1rem;
          right: -.55rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        p {
          text-align: center;
          margin-bottom: .47rem;
        }

        .submit {
          width: 100%;
          height: .9rem;
          display: flex;
          position: absolute;
          bottom: 0;
          border-bottom-left-radius: .1rem;
          border-bottom-right-radius: .1rem;
          overflow: hidden;

          button {
            width: 50%;
            display: block;
            height: 100%;
            font-size: .34rem;
          }

          button:first-child {
            background: #E5E5E5;
            color: #94969B;
          }

          button:last-child {
            background: #FF0049;
            color: #FFFFFF;
          }
        }
      }

      .reject {
        width: 100%;
        height: 5rem;
        box-sizing: border-box;
        padding: .29rem .33rem;
        background: #FFFFFF;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: .2rem;

        .close {
          width: .55rem;
          height: .55rem;
          position: absolute;
          top: -.64rem;
          right: .44rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        p {
          font-size: .3rem;
          margin-bottom: .29rem;
        }

        textarea {
          display: block;
          width: 100%;
          height: 2.71rem;
          overflow-y: auto;
          font-size: .3rem;
          resize: none;
          border: 1px solid #E5E5E5;
          box-sizing: border-box;
          padding: .22rem .31rem;
        }

        textarea::placeholder {
          color: #94969B;
          font-size: .3rem;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
        }

        .btns {
          background: #FFFFFF;
          border-radius: .2rem;
        }
      }
    }

    .detail {
      .detail-item {
        width: 100%;
        display: flex;
        font-size: .3rem;
        margin-bottom: .3rem;
      }
      .failed{
        background: #E5E5E5;
        border-radius: .05rem;
        color: #94969B;
      }
      .dashed {
        padding-bottom: .36rem;
        border-bottom: .01rem dashed #E5E5E5;
        margin-bottom: .36rem;

        i {
          color: #FF034B;
        }
      }

      .space_between {
        justify-content: space-between;

        p {
          font-size: .28rem;
          color: #94969B;
          align-items: flex-end;

          i {
            font-size: .2rem;
            margin-left: .08rem;
          }
        }
      }
    }

    .btns {
      width: 100%;
      height: 1.2rem;
      box-sizing: border-box;
      padding: .18rem .53rem;
      display: flex;
      justify-content: space-between;
      background: #EEEEEE;
      position: absolute;
      bottom: 0;
      left: 0;

      button {
        display: block;
        width: 3rem;
        height: .85rem;
        color: #FFFFFF;
        border-radius: .1rem;
        font-size: .36rem;
      }

      button:first-child {
        background: #FF0049;
      }

      button:last-child {
        background: #FEB623;
      }
    }
  }
</style>
