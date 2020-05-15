<template>
  <div class="cardMaster">
    <div class="top">
      <p>卡主身份,你值得拥有！！！</p>
      <img src="@/assets/imgs/sVip/cardMaster.png" alt="">
    </div>
    <div class="bottom">
      <div class="title"><span>卡主是什么?</span></div>
      <div class="desc">
        <div class="desc-item">您可以理解为传统会员储值卡功能的电子化，享受助
          商通联盟商家超级VIP折扣，简称SVIP卡 , 拥有SVIP
          卡的用户，助商通平台称之为卡主
        </div>
      </div>
      <div class="title"><span>卡主有哪些优势</span></div>
      <div class="desc">
        <div class="desc-item">
          1、会员不担心充值的压力，不担心消费不完；
        </div>
        <div class="desc-item">
          2、传统储值卡需要携卡或者报手机号码消费，卡主不
          需要，只要一部手机，统统搞定；
        </div>
        <div class="desc-item">
          3、传统储值卡只能自己消费，因此不是高频消费场景
          不会储值，卡主可将自己的SVIP共享给好友或者发布
          到平台，服务于他人的同时，自己能快速回流资金，
          还能获取额外收益；
        </div>
        <div class="desc-item">
          4、SVIP卡可分享到微信使用，不需要安装助商通也。
        </div>
      </div>
      <div class="title"><span>如何成为卡主？及如何收益？</span></div>
      <div class="desc">
        <div class="desc-item">
          1、卡主的招募者为助商通联盟商家，若您熟悉的商家
          还没有加入助商通联盟商家，您可以推荐他加入联盟
          商家，入驻成功，您可获得300元/家奖励；
        </div>
        <div class="desc-item">
          2、联盟商家需在后台设置预充值活动，前提是助商通
          联盟商家需要开通收银通道，即在助商通平台发布招募
          卡主的信息；
        </div>
        <div class="desc-item">
          3、到店消费的助商通会员可参加招募卡主活动，充值
          成功获得一张SVIP卡，自己使用可以享受超级VIP折扣；
        </div>
        <div class="desc-item">
          4、SVIP卡主可以自己创建SVIP分享卡，可自主设置SVIP分享卡折扣，设置分享佣金，可分享给微信好友
          或发布到平台；
        </div>
        <div class="desc-item">
          5、其他顾客使用SVIP分享卡到店消费，您的资金能快
          速回流，并且还能获得额外收益；
        </div>
        <div class="desc-item">
          6、如果您设置了分享奖励，其他助商通用户分享给好
          友也能获得奖励。
        </div>
      </div>
    </div>
    <div class="download">
      <div class="btns" onclick="window.location.href='http://tenzhao.com/zhushangtong/'">
        <button class="left">下载助商通，马上享受卡主权益</button>
        <button class="right"><span>马上下载</span></button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "cardMaster"
  }
</script>

<style lang="scss" scoped>
  .cardMaster {
    background: linear-gradient(0deg, rgba(129, 81, 45, 1), rgba(127, 72, 46, 1));
    width: 100%;

    .top {
      padding-top: .51rem;
      padding-bottom: 1rem;

      p {
        font-size: .42rem;
        font-family: BDZYJT--GB1-0;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        text-shadow: .05rem .05rem .06rem rgba(34, 23, 83, 0.2);
        background: linear-gradient(180deg, rgba(255, 240, 197, 1) 20.85546875%, rgba(191, 142, 95, 1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: .62rem;
      }

      img {
        display: block;
        width: 100%;
        height: 3.11rem;
      }
    }

    .bottom {
      box-sizing: border-box;
      padding: 0 .25rem;

      .title {
        width: 100%;
        border-radius: .1rem;
        background: rgba(254, 237, 208, 1);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height: .6rem;
        margin-bottom: .31rem;

        span {
          font-size: .34rem;
          font-weight: bold;
          color: rgba(254, 220, 150, 1);
          background: linear-gradient(173deg, rgba(219, 153, 118, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .desc{
        padding-bottom: .7rem;
        .desc-item{
          font-size: .28rem;
          color: #FEE1A5;
          line-height: .48rem;
        }
      }
    }
    .download{
      width: 100%;
      box-sizing: border-box;
      padding: .25rem;
      background: #FFFFFF;
      .btns{
        width: 100%;
        height: .66rem;
        border-radius: .1rem;
        overflow: hidden;
        display: flex;
        box-shadow:0 0 .24rem 0 rgba(188,188,188,0.64);
        .left{
          display: block;
          width: 5rem;
          background:linear-gradient(173deg,rgba(219,153,118,1),rgba(127,80,44,1));
          font-size: .28rem;
          color: #FFFFFF;
        }
        .right{
          width: 2rem;
          background:linear-gradient(0deg,rgba(33,33,33,1),rgba(18,18,18,1));
          span{
            background:linear-gradient(0deg,rgba(239,170,132,1) 0.2685546875%, rgba(127,80,44,1) 100%);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
          }
        }
      }
    }
  }
</style>
