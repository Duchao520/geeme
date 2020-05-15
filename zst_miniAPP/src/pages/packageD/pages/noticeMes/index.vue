<template>
    <div class="page">
        <div class="logo_inner">
          <img :src="storeLogo" alt="">
          <span>{{storeName}}</span>
        </div>
        <div class="nofound_page">
          <div class="all_inner">
             <div class="inner_top">
               <img src="../../static/img/notice.png" alt="">
             </div>
             <div class="inner_top" style="margin-top:20rpx;">
                <div class="msg_notice">
                  该商家未开通收银系统和卡主功能
                </div>
             </div>
             <div class="btn_goindex" @click="howMoneyer">
                <div class="btn_gogo" style="background:#FEB623;">
                    如何开通收银系统?
                </div>
             </div>

            <div class="btn_goindex" style="margin-top: 60rpx;" @click="howCarder">
              <div class="btn_gogo">
                  如何开通卡主功能?
              </div>
            </div>

            <div class="btn_index" @click="goindex">
                回到首页
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    import { getSignIn , getQuery} from '@/common/js/comm';
    export default {
        name: "index",
        data(){
          return {
             msg:'',
             storeLogo:'',
             storeName:''
          }
        },
        mounted(){
          let par = getQuery();
          console.log(par);
          this.storeName = par.storeName;
          this.storeLogo = par.storeLogo;
        },
        methods:{
          howMoneyer(){
            wx.navigateTo({
              url:'/pages/packageD/pages/howOpenMoney/main'
            })
          },
          howCarder(){
            wx.navigateTo({
              url:'/pages/packageA/pages/svipRules/main'
            })
          },
          goindex(){
            wx.switchTab({
              url:'/pages/index/main'
            })
          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  position: absolute;
  left:0;right:0;
  bottom:0;top:0;
  display:flex;
  justify-content: center;
  align-items: center;
  .logo_inner{
    position: fixed;
    left:0;
    top:0;
    width:670rpx;
    height:140rpx;
    background:#f2f2f2;
    padding:0 40rpx;
    display: flex;
    align-items: center;
    img{
      width:100rpx;
      height:100rpx;
      display: block;
      border-radius: 50%;
    }
    span{
      color:#000;
      font-size: 48rpx;
      margin-left:20rpx;
    }
  }
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
        .msg_notice{
          width:600rpx;
          text-align: center;
        }
        img{
          width:482rpx;
          height:190rpx;
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
      .btn_index{
        margin-top:20rpx;
        width:100%;
        text-align: center;
        color:#F7094D;
        text-decoration: underline ;
      }
    }
  }
}
</style>
