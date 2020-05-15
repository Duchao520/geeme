<template>
    <div class="noVip" v-if="showNovip">
          <div class="noVip_msg">
              <div class="close_img" @click="closeBtn">
                <img src="@/assets/imgs/common/close.png" alt="">
              </div>
              <div class="noVip_img">
                  <div class="img_msg">
                     <img src="@/assets/imgs/svip/background.png" alt="">
                      <div class="msg_text">
                        {{title}}
                      </div>
                  </div>
              </div>

              <div class="img_text">
                 {{no_con}}
              </div>

              <div class="noVip_btn">
                  <div class="no_btn" @click="goPayPage">马上升级VIP</div>
              </div>
          </div>
    </div>
</template>

<script>
    export default {
        props:['showNovip','title','no_con'],
        name: "noVipPop",
        data(){
          return {
            showNoVip:true,
          }
        },
      methods:{
        goPayPage(){
          window.location.href=`https://zst.tenzhao.com/zst-wap/vipRecharge/index.html#/index`;
        },
        closeBtn(){
           this.showNoVip = false;
           this.$emit("noVipBool",this.showNoVip);
        }
      }

    }
</script>

<style lang="scss" scoped>
.noVip{
  position: absolute;
  left:0;right:0;
  bottom:0;top:0;
  background:rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .noVip_msg{
    width:6.36rem;
    height:5.1rem;
    background:#fff;
    position: relative;
    .close_img{
      position: absolute;
      right:-0.3rem;
      top:-0.68rem;
      width:0.55rem;
      height:0.54rem;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .noVip_img{
       width:100%;
       height:1.99rem;
       display: flex;
       justify-content: center;
       align-items: center;
       margin-bottom:0.45rem;
      .img_msg{
        width:5.11rem;
        height:1.99rem;
        margin-top:0.39rem;
        position: relative;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .msg_text{
            position: absolute;
            left:-0.31rem;
            top:0.2rem;
            color:#D9A76A;
            font-size: .3rem;
        }
      }
    }
    .img_text{
      font-size:.3rem;
      text-align: center;
    }
    .noVip_btn{
      width:100%;
      height:0.8rem;
      display:flex;
      justify-content: center;
      align-items: center;
      margin-top:0.69rem;
      .no_btn{
        width:4.55rem;
        height:0.8rem;
        background:#FF0049;
        font-size: .36rem;
        line-height: 0.8rem;
        text-align: center;
        color:#fff;
        border-radius: 0.4rem;
      }
    }
  }
}
</style>
