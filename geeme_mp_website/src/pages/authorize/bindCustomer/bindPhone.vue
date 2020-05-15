<template>
  <div class="container">
    <div class="fc-333333 fz-56" style="margin-bottom: .88rem">绑定会员手机号</div>
    <div class="form-input">
      <input type="tel" placeholder="请输入手机号" v-model="mobile">
    </div>
    <div class="form-input" style="margin-bottom: .18rem">
      <input type="text" placeholder="请输入验证码" v-model="smsCode">
      <p class="fc-F52D56 fz-26" v-if="timerFlag">{{time}}s</p>
      <p class="fc-F52D56 fz-26" @click="getVerifyCodeForOfficialBind" v-else>获取验证码</p>
    </div>
    <div class="flex_box align_center" style="margin-bottom: .54rem;">
      <img src="@/assets/imgs/authorize/icon_warning.png" style="display: block;width: .28rem;height: .28rem;margin-right: .04rem;">
      <p class="fz-24 fc-999999">请使用在门店会员登记的手机号</p>
    </div>
    <button class="bind" @click="bindOpenId">确认绑定</button>
  </div>
</template>

<script>
  import {bindOpenId , getVerifyCodeForOfficialBind} from "@/api/authorize";
  import {phoneReg} from "@/assets/js/regExp";
  import {request} from "@/assets/js/jsBridge";

  export default {
    props: {},
    data() {
      return {
        appid: this.$route.query.appid,
        code: this.$route.query.code,
        mobile: null,
        smsCode: null,    //短信验证码
        timer: null,
        timerFlag: false,
        time: 60
      }
    },
    mounted (){
      this.appid = request['appid'];
      this.code = request['code'];
      console.log(this.appid)
      console.log(this.code)
    },
    methods: {
      bindOpenId(){
        if(!this.appid){
          this.$toast.center('缺少公众号appId');
          return;
        }
        if(!this.code){
          this.$toast.center('缺少用户授权code');
          return;
        }
        if(!this.mobile){
          this.$toast.center('请输入手机号');
          return;
        }
        if(!phoneReg(this.mobile)){
          this.$toast.center('手机号输入有误');
          return;
        }
        if(!this.smsCode){
          this.$toast.center('请输入验证码');
          return;
        }
        let params = {
          code: this.code,
          mobile: this.mobile,
          officialAppId: this.appid,
          smsCode: this.smsCode
        };
        bindOpenId(params).then(res => {
          if(res.success){
            this.$toast.center('绑定成功')
          }else{
            this.$toast.center(res.message);
          }
        })
      },
      /**
       * 获取验证码
       */
      getVerifyCodeForOfficialBind(){
        if(!this.mobile){
          this.$toast.center('请输入手机号');
          return;
        }
        if(!phoneReg(this.mobile)){
          this.$toast.center('手机号输入有误');
          return;
        }
        this.setIntervalTimer()
        let params = {
          mobile: this.mobile,
        };
        getVerifyCodeForOfficialBind(params).then(res => {
          if(!res.success){
            this.$toast.center(res.message);
            clearInterval(this.timer);
          }
        })
      },
      /**
       * 倒计时
       */
      setIntervalTimer(){
        this.timerFlag = true;
        this.timer = setInterval(() => {
          this.time--
          if(this.time == 0){
            this.timerFlag = false;
            clearInterval(this.timer);
            this.time = 60;
          }
        },1000)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    box-sizing: border-box;
    padding: .48rem .73rem;
    .form-input{
      width: 100%;
      height: .9rem;
      border-bottom: .02rem solid #EFEFF4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      input{
        display: block;
        width: 4rem;
        height: .44rem;
        font-size: .32rem;
      }
      input::placeholder{
        color: #cccccc;
      }
    }
    .bind{
      display: block;
      width: 100%;
      height: 1rem;
      border-radius: .5rem;
      background: #F52D56;
      line-height: 1rem;
      color: #FFFFFF;
      font-size: .34rem;
      font-weight: bold;
    }
  }
  .fz-56{
    font-size: .56rem;
  }
</style>
