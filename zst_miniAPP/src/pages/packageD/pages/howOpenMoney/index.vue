<template>
    <div class="page">
       <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/88/a03786418750fc4084fe767a22d63370.png" alt="">
       <div class="bot_btn">
          <div class="bot_btn_le">
             具体如何开通可致电客服热线或者助商通微信客服
          </div>
          <div class="bot_btn_ri">
             <div class="tn_le" @click="getInner">
                  复制微信号
             </div>
             <div class="tn_ri" @click="orderPhone">
                  联系客服
             </div>
          </div>
       </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return {

          }
        },
        mounted(){

        },
        methods:{
          getInner(){
            wx.setClipboardData({
              data: 'zhushangtong01',
              success(res) {
                wx.getClipboardData({
                  success(res) {
                    console.log(res.data) // data
                  }
                })
              }
            })
          },
          orderPhone(){
            wx.makePhoneCall({
              phoneNumber: '400-8090-775' // 仅为示例，并非真实的电话号码
            })
          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  position: absolute;
  left:0;right:0;
  top:0;
  padding-bottom: 100rpx;
  img{
    width:750rpx;
    height:3590rpx;
    display: block;
  }
  .bot_btn{
    position: fixed;
    left:0;
    bottom:0;
    right:0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background:#fff;
    width:730rpx;
    height:80rpx;
    padding:10rpx;
    z-index: 999;
    .bot_btn_le{
      width:50%;
      font-size: 24rpx;
      font-weight: bold;
    }
    .bot_btn_ri{
      width:50%;
      display:flex;
      justify-content: center;
      align-items: center;
      height:70rpx;
      .tn_le{
        background:#F7A09D;
        font-size: 28rpx;
        color:#fff;
        font-weight: bold;
        padding:10rpx 10rpx;
        padding-left:20rpx;
        border-top-left-radius: 30rpx;
        border-bottom-left-radius: 30rpx;
      }
      .tn_ri{
        background:#20528B;
        font-size: 28rpx;
        color:#fff;
        font-weight: bold;
        padding:10rpx 10rpx;
        padding-right:30rpx;
        border-top-right-radius: 30rpx;
        border-bottom-right-radius: 30rpx;
      }
    }
  }
}
</style>
