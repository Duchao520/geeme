<template>
  <div class="approveSuccess">
    <section class="banner">
      <img src="@/assets/imgs/common/banner_recruit.png" alt="">
    </section>
    <section class="content">
      <p>恭喜您,授权成功</p>
      <span>现在就能跟随助商通一起分享推广赚收益</span>
      <div class="button" @click="GoAPPIndex">
        <img src="@/assets/imgs/taobao/approve_back.png" alt="">
      </div>
    </section>
  </div>
</template>

<script>
  import {postTitle , ZSTShut , getUserAgentType} from "@/assets/js/jsBridge";
  export default {
    name: "approveSuccess",
    data(){
      return{
        web_title: '授权成功'
      }
    },
    methods: {
      GoAPPIndex(){
        var _type = getUserAgentType();
        if(_type == 1){
          ZSTShut();
        }else{
          var uri = window.location.href;
          var redirect_uri = uri + '?status=123';
          window.location.href = redirect_uri;
        }
      }
    },
    mounted() {
      var _self = this;
      postTitle(_self.web_title);
    }
  }
</script>

<style lang="scss" scoped>
  .approveSuccess{
    .banner{
      width: 100%;
      height: 3.39rem;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .content{
      box-sizing: border-box;
      padding: .72rem .58rem;
      p{
        font-size: .36rem;
        text-align: center;
        margin-bottom: .43rem;
      }
      span{
        display: block;
        text-align: center;
        font-size: .3rem;
        margin-bottom: .62rem;
      }
      .button{
        width: 100%;
        height: 1.07rem;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
