<template>
  <div class="bargainRules">
    <div class="box_padding" style="padding: 38rpx 28rpx">
      <h3 class="fz-38 fc-0D0D0F" style="margin-bottom: 45rpx">卡友帮低折扣砍价，好礼免费拿</h3>
      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">1</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">什么是卡友帮？</p>
          <p class="fz-30 fc-0D0D0F">答:卡友帮是助商通联盟商家推出的针对商家会员的优惠或低折扣或免费的活动套餐，您可以发起砍价，通过微信分享给您的好友或相关微信群帮你砍价的商家促销活动。
          </p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">2</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">参与“卡友帮”有什么好处？</p>
          <p>答:1.如果自己发起邀请好友砍价活动，则有机会低折扣或免费获得商家的活动奖品；</p>
          <p>2、自己发起砍价或者参与帮好友砍价，都有机会得到商家赠送的现金抵扣券，使用抵扣券可以到活动商家消费，直接抵扣现金；</p>
          <p> 3、自己发起砍价或者参与帮好友砍价，更有机会获得助商通联盟商家通用的“共享打折卡”,在所有支持“助商通联盟商家”享受会员折扣。</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">3</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">如何参加商家的联盟的“卡友帮”活动？</p>
          <p>答:1、可进入开展“卡友帮”活动的助商通联盟商家消费，消费付款后会弹出活动入口；</p>
          <p>2、进入开展“卡友帮”活动的助商通联盟商家消费，扫码门店内的活动二维码即可参加活动；</p>
          <p>3、好友已经发起砍价，并邀请你砍价，您砍价完成后，也可以自己参加活动。</p>
        </div>
      </div>

      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">4</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">“卡友帮”活动如何砍成?</p>
          <p>答:活动页面有砍价的进度条，当砍价所需金额都被好友砍光后，即可领取奖项。</p>
        </div>
      </div>

      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">5</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">我发起的“卡友帮”正在进行的活动在哪里？如何再次邀请要有助力？</p>
          <p class="fz-28 fc-0D0D0F">答：您发起的正在参加的活动可以到<span class="fc-F7094D">【首页】</span>中，点击<span class="fc-F7094D">【卡友帮】</span>版块可以看到正在参加的活动， 点击活动进入活动页面即可邀请好友进行砍价。</p>
        </div>
      </div>

      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">6</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">参与活动的优惠券在哪里查看？并且如何使用?</p>
          <p>答：1、可以在助商通的微信小程序打开进入<span class="fc-F7094D">【首页】</span>
            ，找<span class="fc-F7094D">【优惠券】</span>栏目可看到你使用的优惠券 </p>
          <p> 2、到支持活动商家消费，直接扫付款码进行付款，可以自动匹配优惠券。</p>
        </div>
      </div>

      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="num fc-ffffff fz-34">7</span>
        <div style="width: 630rpx">
          <p class="fz-30 fc-0D0D0F font-weight">“卡友帮”活动砍价成功后如何领奖？</p>
          <p>答：如果发起的活动砍成，可以<span class="fc-F7094D">【卡友帮】</span>选中该活动，并领取核销码，使用核销码可以到活动商家进行消费和核销。砍成的记录可以在<span class="fc-F7094D">【卡友帮】</span>页面右上角的<span class="fc-F7094D">【砍成记录】</span>查看</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="margin-bottom: 50rpx">
        <span class="fc-F7094D fz-48">*</span>
        <p class="fz-30 fc-0D0D0F" style="width: 630rpx;letter-spacing: 3rpx">本活动解释权归浙江腾朝互联有限公司所有
          全国服务热线<a class="fc-F7094D" @click="putPhone">400-8090-775</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bargainRules",
    data(){
      return {

      }
    },
    methods:{
      putPhone(){
        wx.makePhoneCall({
          phoneNumber: '400-8090-775' //仅为示例，并非真实的电话号码
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .bargainRules{
    .num{
      display: block;
      width: 45rpx;
      height: 45rpx;
      border-radius: 50%;
      background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));
      text-align: center;
      line-height: 45rpx;
    }
  }
</style>
