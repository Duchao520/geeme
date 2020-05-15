<template>
  <div class="bargainRules">
    <v-head :title="'活动规则'"></v-head>
    <div class="box_padding" style="padding: .39rem .28rem">
      <h3 class="fz-38 fc-0D0D0F" style="margin-bottom: .45rem">卡友帮低折扣砍价，好礼免费拿</h3>
      <div class="flex_box justify_space_between"
           style="margin-bottom: .5rem">
        <span class="num fc-ffffff fz-34">1</span>
        <div style="width: 6.3rem">
          <p class="fz-30 fc-0D0D0F font-weight">消费满足商家砍价门槛，即会弹出砍价页面，点击进入即可</p>
          <p class="fz-28 fc-0D0D0F">注:或在APP首页点击<i class="fc-F7094D">【卡友帮】</i>入口进入砍价页面参与活动</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: .5rem">
        <span class="num fc-ffffff fz-34">2</span>
        <div style="width: 6.3rem">
          <p class="fz-30 fc-0D0D0F font-weight">每次砍价金额随机，参与的好友越多越容易成功，每一个好友只能帮助砍价一次。</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: .5rem">
        <span class="num fc-ffffff fz-34">3</span>
        <div style="width: 6.3rem">
          <p class="fz-30 fc-0D0D0F font-weight">砍价成功后，即可在活动页面领取奖品。</p>
          <p class="fz-28 fc-0D0D0F">注：所有的奖品都是以核销码的形式展现，获奖用户可以向该活动商家出示，待商家核销成
            功后即可享受该活动内容。</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: .5rem">
        <span class="num fc-ffffff fz-34">4</span>
        <div style="width: 6.3rem">
          <p class="fz-30 fc-0D0D0F font-weight">活动中赠送的共享会员卡和优惠券的使用 方法：</p>
          <p class="fz-34 fc-0D0D0F"
             style="line-height: .6rem">(1)打开助商通APP或助商通小程序找到<i class="fc-F7094D">【卡主】-【收藏的卡】</i>中找到收藏的共
            享会员卡；</p>
          <p class="fz-34 fc-0D0D0F"
             style="line-height: .5rem">(2)打开助商通APP或助商通小程序找到<i class="fc-F7094D">【优惠券】</i>中找到赠送的优惠券。</p>
          <p class="fz-28 fc-0D0D0F">注：共享会员卡可在该卡所属的商家使用，享会员折扣。</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: .5rem">
        <span class="fc-F7094D fz-48">*</span>
        <p class="fz-30 fc-0D0D0F" style="width: 6.3rem;letter-spacing: .03rem">本活动解释权归浙江腾朝互联有限公司所有
          全国服务热线<a href="tel:400-8090-775" class="fc-F7094D">400-8090-775</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head'
  export default {
    name: "bargainRules",
    components: {
      vHead
    }
  }
</script>

<style lang="scss" scoped>
.bargainRules{
  .num{
    display: block;
    width: .45rem;
    height: .45rem;
    border-radius: 50%;
    background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));
    text-align: center;
    line-height: .45rem;
  }
}
</style>
