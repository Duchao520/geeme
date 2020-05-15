<template>
  <div class="con_page">
    <div class="img_icon">

      <div class="img_con_top">
        <div class="img_con_con" @touchstart="touchStart" @touchend="touchEnd">
          <img src="/static/img/zst_logo.png" alt="">
        </div>
        <div class="img_con_bot">
          2.2.1
        </div>
      </div>
    </div>
    <div class="all_con">
      <div class="con_le">
        <span>公司官网</span>
        <span>www.tenzhao.com</span>
      </div>

      <div class="con_le">
        <span>客服电话</span>
        <span>400-8090-775</span>
      </div>

      <div class="con_le">
        <span>官方邮箱</span>
        <span>kefu@tenzhao.com</span>
      </div>

      <div class="con_le">
        <span>微信公众号</span>
        <span>助商通</span>
      </div>
    </div>

    <div class="con_footer">
      <div style="color:#F70B4D;">助商通软件许可及服务</div>
      <div>CopyRight©腾朝互联 版权所有</div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import {SERVE_ENV}  from '../../../../store/mutation-types'
  import {ENV_COLLECT} from "../../../../utils/apiUtil";
  import Tips from '@/common/js/tips'

  export default {
    name: "index",
    data() {
      return {
        total: 0,
        timer: '',
        time: 0
      }
    },
    mounted(){
      console.log(this.SERVE_ENV_STATUS);
    },
    methods: {
      ...mapMutations({
        serve_env: 'SERVE_ENV'
      }),
      touchStart(){
        var _self = this;
        _self.timer = setInterval(() =>{
          _self.time++;
          if(_self.time == 3){
            Tips.confirm(_self.$store.state.serve_env ? '测试服务器' : '正式服务器').then(res => {
              _self.serve_env(this.$store.state.serve_env ? 0 : 1);
              ENV_COLLECT(_self.$store.state.serve_env);
              wx.clearStorage({
                success(res){
                  Tips.toast('清除成功', 'none');
                },
                fail(res){
                  console.log(res)
                }
              })
              const url = `/pages/loginpage/main`;
              wx.navigateTo({url})
            })
          }
        },1000);
      },
      touchEnd(){
        var _self = this;
        clearInterval(_self.timer);
        _self.time = 0;
      },
      addTotal(){
        var _self = this;
      }
    },
    watch: {
      total(){
        if(this.total == 10){

        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.con_page{
  position: absolute;
  left:0;top:0;
  right:0;bottom:0;
  background:#f6f6f6;
  .img_icon{
    width:100%;
    height:300rpx;
    background:#fff;
    .img_con_top{
       width:750rpx;
       height:300rpx;
       background:#fff;
       display: flex;
       justify-content: center;
       align-items: center;
      flex-direction: column;
      .img_con_con{
        width:120rpx;
        height:120rpx;
        margin-bottom:10rpx;
        border-radius: 8rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          border-radius: 50%;
        }
      }

    }
  }
  .all_con{
    display: block;
    overflow: hidden;
    width:710rpx;
    padding:20rpx 20rpx;
  }
  .con_le{
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    padding:10rpx 0;
  }
  .con_footer{
    position: absolute;
    bottom:40rpx;
    left:0;
    right:0;
    margin:0 auto;
    div{
      width:100%;
      text-align: center;
      font-size: 28rpx;
    }
  }
}
</style>
