<template>
  <div class="page">
    <div class="nofound_page">
      <div class="all_inner">
        <div class="inner_top">
          <img src="/static/img/svipCard/cardinner.png" alt="">
        </div>
        <div class="inner_top">
          <div class="msg_notice">
            正在获取商家付款信息，请稍后.....
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getQuery } from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  export default {
    name: "index",
    data() {
      return {
        urlSrc:''
      }
    },
    mounted(){
      const pages = getQuery();
      if (pages.q) {
        pages.q = decodeURIComponent(pages.q);
        var num = pages.q.split('/');
        var numLen = num.length;
        this.$http.goreDiPage(num[numLen-2],num[numLen-1]).then(res=>{
          if(res.state ==1) {
            wx.reLaunch({
              url: `../packageB/pages/payMoney/main?${res.data}`
            })
          }else{
            Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
          }
        })
      }
    },
    methods: {

    }

  }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    .nofound_page{
      width:100vw;
      height:100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top:-200rpx;
      .all_inner{
        width:100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .inner_top{
          width:100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom:20rpx;
          .msg_notice{
            width:600rpx;
            text-align: center;
          }
          img{
            width:150rpx;
            height:232rpx;
            display: block;
          }
        }
        .btn_goindex{
          width:100%;
          height:80rpx;
          margin-top:94rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .btn_gogo{
            width:650rpx;
            height:80rpx;
            background:#F7094D;
            color: #ffffff;
            text-align: center;
            line-height: 80rpx;
            border-radius: 8rpx;
          }
        }
      }
    }
  }
</style>
