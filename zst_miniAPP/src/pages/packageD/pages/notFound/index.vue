<template>
    <div class="page">
        <div class="nofound_page">
          <div class="all_inner">
             <div class="inner_top">
               <img src="../../static/img/404.png" alt="">
             </div>
             <div class="inner_top">
                <div class="msg_notice">
                    {{msg}}
                </div>
             </div>
             <div class="btn_goindex" @click="goindex">
                <div class="btn_gogo">
                    去往首页
                </div>
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
             msg:''
          }
        },
        mounted(){
            var par =getQuery();
            console.log(par.msg);
            this.msg = par.msg;
        },
        methods:{
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
          width:500rpx;
          height:324rpx;
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
