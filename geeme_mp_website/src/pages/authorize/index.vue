<template>
  <div>
    <img class="thumb" src="@/assets/imgs/authorize/top_thumb.png">
    <div class="text-center fc-666666 fz-32 font-weight mb-24">绑定会员身份，可以获得如下好处：</div>
    <ul class="module">
      <li class="flex_box">
        <i class="spot"></i>
        <p class="fz-28 fc-666666 mb-24" style="width: 5.8rem">及时接收预约提醒、消费通知、订单提醒、会员权益通知等消息推送；</p>
      </li>
      <li class="flex_box">
        <i class="spot"></i>
        <p class="fz-28 fc-666666 mb-24" style="width: 5.8rem"> 第一时间获取门店优惠信息；</p>
      </li>
      <li class="flex_box">
        <i class="spot"></i>
        <p class="fz-28 fc-666666 mb-24" style="width: 5.8rem">首次绑定会员，登录小程序，有机会获取新人红包大礼包。</p>
      </li>
    </ul>
    <div class="footer">
      <div class="fc-cccccc fz-24 text-center mb-24">及美提供技术支持</div>
      <button class="bind" @click="bindCustomer">确认绑定或注册会员</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {
        appid: this.$route.query.appid,

      }
    },
    methods: {
      bindCustomer(){
        let redirect_uri = process.env.VUE_APP_AUTHURL + "bindPhone";
        redirect_uri = encodeURIComponent(redirect_uri);
        // this.$router.push({
        //   name: 'wxAuthorize',
        //   query: {
        //     appid: this.appid,
        //     redirect_uri: redirect_uri
        //   }
        // })
        window.location.href= "https://mp-develop.geeme.cn/#/wxAuthorize?appid=" + this.appid + "&redirect_uri=" + redirect_uri
      }
    }
  }
</script>

<style lang="scss" scoped>
  .thumb{
    display: block;
    width: 5.28rem;
    height: 3.68rem;
    background: #36E9BB;
    margin: .16rem auto .48rem;
  }
  .module{
    margin: 0 .68rem;
    li{
      .spot{
        display: block;
        width: .12rem;
        height: .12rem;
        border-radius: 50%;
        background: #F52D56;
        margin-right: .22rem;
        margin-top: .22rem;
      }
      p{
        line-height: .6rem;
      }
    }

  }
  .footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 .33rem .48rem;
    box-sizing: border-box;
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
</style>
