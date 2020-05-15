<template>
  <div class="submitOrder">
    <v-head :title="'确认订单'"
            :borderBtm="true"></v-head>
    <section class="flex_box align_center">
      <i class="iconfont icon-dizhi2 fz-48 fc-0D0D0F" style="margin-right: .38rem"></i>
      <div class="flex_box fz-30 fc-0D0D0F address flex_column"
           style="margin-right: .25rem">
        <div class="flex_box justify_space_between mb-12">
          <p class="txt-ellipsis" style="width: 2.5rem">收货人:叶丽</p>
          <p>13934410514</p>
        </div>
        <p class="txt-overflow">收货地址：浙江省杭州市萧山区宁围街道</p>
      </div>
      <i class="iconfont icon-arrow-right fz-32 fc-8D8E98"></i>
    </section>
    <section>
      <h4 class="fz-30 flex_box align_center"
          style="margin-bottom: .4rem">
        <i class="iconfont icon-shangjia1 fz-48"
           style="color: #9A9DA5;margin-right: .14rem"></i>浙江和米通讯
      </h4>
      <div class="goods flex_box justify_space_between">
        <img src="" alt="" class="thumb">
        <div class="detail flex_box flex_column justify_space_between">
          <p class="txt-overflow fz-30 fc-0D0D0F">Apple/苹果 iPhone X 苹果8x 美版日版全网通移动联通电信4G手机</p>
          <div class="flex_box justify_space_between fc-F7094D" style="align-items: flex-end">
            <p class="iconfont icon-renminbi fz-48 flex_box" style="align-items: center">0</p>
            <p class="fz-28">x1</p>
          </div>
        </div>
      </div>
    </section>
    <section style="padding-bottom: 0">
      <div class="order-item flex_box justify_space_between fz-28">
        <p>支付类型</p>
        <div class="radio-container flex_box">
          <div class="flex_box align_center"
               style="margin-right: 1rem">
            <i class="radio-item active"></i>
            <p>微信</p>
          </div>
          <div class="flex_box align_center">
            <i class="radio-item"></i>
            <p>支付宝</p>
          </div>
        </div>
      </div>
      <div class="order-item flex_box justify_space_between fz-28">
        <p>运费</p>
        <p>包邮</p>
      </div>
      <div class="order-item flex_box justify_space_between fz-28">
        <p>商品金额</p>
        <p class="iconfont icon-renminbi">2999*1</p>
      </div>
      <div class="order-item flex_box justify_space_between fz-28">
        <p>砍价折扣</p>
        <p>-2999</p>
      </div>
      <div class="order-item flex_box justify_space_between fz-28" style="border-bottom: none">
        <p>实付款</p>
        <div class="flex_box align_center">
          <p>共一件商品</p>
          <p class="flex_box align_center">总额:<i class="iconfont icon-renminbi fc-F7094D fz-36 flex_box justify_space_between">0</i></p>
        </div>
      </div>
    </section>
    <footer class="flex_box justify_space_between align_center">
      <p class="fz-24 fc-8D8E98">共1件</p>
      <div class="flex_box align_center">
        <p class="fz-30" style="margin-right: .35rem">合计: <i class="fc-F7094D">0</i></p>
        <button class="bg-F7094D fc-ffffff fz-30">立即下单</button>
      </div>
    </footer>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head'
  export default {
    name: "submitOrder",
    components: {
      vHead
    }
  }
</script>

<style lang="scss" scoped>
  .submitOrder{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F4F5F6;
    section{
      box-sizing: border-box;
      padding: .29rem .23rem;
      background: #FFFFFF;
      margin-bottom: .1rem;
      .address{
        width: 5.65rem;
      }
      .goods{
        .thumb{
          display: block;
          width: 2rem;
          height: 2rem;
          border: .02rem solid #EEEEEE;
        }
        .detail{
          width: 4.78rem;
        }
      }
      .order-item{
        padding: .24rem 0;
        border-bottom: .02rem solid #E5E5E5;
        .radio-container{
          .radio-item{
            display: block;
            width: .3rem;
            height: .3rem;
            box-sizing: border-box;
            border: .02rem solid #D2D2D2;
            border-radius: 50%;
            padding: .04rem;
            margin-right: .12rem;
          }
          .radio-item::before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #D2D2D2;
          }
          .active {
            border-color: #F3B949;
          }

          .active::before {
            background: #F3B949;
          }
        }
      }
    }
    footer{
      position: fixed;
      bottom: 0;
      left: 0;
      background: #FFFFFF;
      width: 100%;
      height: 1rem;
      box-sizing: border-box;
      padding: 0 .29rem;
      button{
        display: block;
        width: 2.1rem;
        height: .75rem;
        border-radius: .38rem;
      }
    }
  }
</style>
