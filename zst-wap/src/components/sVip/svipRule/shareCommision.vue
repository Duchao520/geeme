<template>
  <div class="svipRules">
    <div class="module" v-for="(module,idx) in modules" :key="idx">
      <div class="module-title fl-l">{{module.title}}</div>
      <div class="clearfix"></div>
      <div class="module-item" v-for="(item,index) in module.lists" :key="index">
        {{item}}
      </div>
    </div>
  </div>
</template>

<script>
  import {postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "shareCommision",
    data() {
      return {
        modules: [
          {
            title: '如何创建共享卡赚钱?',
            lists: [
              '1、首先你需要是助商通联盟商家的卡主（通过参加联盟商家预充值活动成为卡主）;',
              '2、当卡主的会员折扣小于9.4折后，就可以创建助商通共享卡，比如您的卡主折扣为8.0折，则您可以创建折扣为8.5折的共享卡;',
              '3、将创建的共享卡发布到平台，其他会员就可以在该卡主所属的联盟商家的门店里看到你发布的共享卡，如果他使用您发布的共享卡进行消费，您就可以或者消费差价的奖励;',
              '4、消费差价直接转入助商通可提现账户，您就可以通过微信或支付宝进行提现。'
            ]
          },
          {
            title: '什么是共享卡佣金?',
            lists: [
              '在您创建共享卡时，可设置分享人佣金。比如：你设置了分享人佣金为10%，您的好友或者您将这张共享卡发布到门店，则看到这张共享卡的人将此卡分享给他他们的好友，他们好友使用了这张共享卡在该卡所属商家进行了消费，则分享这样卡的人可赚取差价10%的佣金；设置分享佣金，会让更多的人帮你分享。'
            ]
          }
        ]
      }
    },
    mounted() {
      // postTitle('助商通SVIP会员')
    }
  }
</script>

<style lang="scss" scoped>
  .svipRules {
    box-sizing: border-box;
    padding: .35rem;

    .module {
      width: 100%;
      margin-bottom: .8rem;

      .module-title {
        display: inline;
        padding: .11rem .2rem;
        font-size: .3rem;
        color: #FFFFFF;
        background: #343C53;
        border-radius: .25rem;
      }

      .module-item {
        font-size: .3rem;
        color: #343C53;
        line-height: .6rem;
      }
    }
  }
</style>
