<template>
  <div class="approveTeach">
    <div class="border_box">
      <p class="fzr36 fc-8B4302 mb32 fw-6">重要！淘宝授权问题解决方案汇总</p>
      <p class="fzr34 mb32">由于淘宝需对渠道加强精细化管理，邀请您进行淘宝身份认证操作，届时没有进行身份认证的，将可能无法分享推广淘宝商品功能请您提前认证</p>
      <p class="fzr36 fc-8B4302 mb32 fw-6">授权操作流程如下：</p>
    </div>
    <div class="long_Img mb32">
      <img src="@/assets/imgs/taobao/approveProcess.png" alt="">
    </div>
    <div class="border_box">
      <p class="fzr36 mb32 fw-6">常见问题及回答</p>
      <p class="fzr34 mb32">在授权过程中，少数情况会遇到以下问题，请自行核对解决：</p>
      <div v-for="(item,index) in questionList" :key="index">
        <div class="quest mb32">
          <i class="fzr34 fc-ffffff">问</i>
          <p class="fzr34 right">{{item.question}}</p>
        </div>
        <div class="answer mb32">
          <p class="fzr34 left">{{item.answer}}</p>
          <i class="fzr34 fw-6">答</i>
        </div>
      </div>
      <div style="height: 2rem"></div>
      <button class="foot fzr36 fc-ffffff" @click="callAppMethod('23')">去授权</button>
    </div>
  </div>
</template>

<script>
  import {callAppMethod} from "@/assets/js/jsBridge";

  export default {
    name: "approveTeach",
    data() {
      return {
        questionList: [
          {
            question: '是不是只有助商通需要授权，其他平台不用授权？',
            answer: '本次是阿里官方调整，全网所有优惠券平台都需要进行账号授权。'
          },
          {
            question: '我授权失败了，提示账号异常，怎么办？',
            answer: '您需要更换淘宝账号授权，可以重新注册新的淘宝账号(注意新账号需要通过实名认证)。'
          },
          {
            question: '我授权失败了，页面提示当前登录的手机淘宝账号已经授权过其他助商通账号，怎么处理？',
            answer: '一个淘宝账号不支持重复授权。这个账号之前被授权过，因此无法再次授权成功。'
          },
          {
            question: '换了几个账号都没授权成功，这是为什么？',
            answer: '所有授权读取状态均为联盟判断，如被判断账号异常，就无法授权成功。'
          },
          {
            question: '授权失败了，提示“请补充实名信息”怎么办？',
            answer: '淘宝账号未通过实名认证，需进入淘宝操作' +
              '实名认证再重新进行授权。淘宝账号实名认证步骤：进入手机淘宝登陆后，' +
              '进入我的淘宝-设置(右上角)-账户与安全-安全中心，看到“您的账号未通过实名认证”点击立' +
              '即处理，进入支付宝登录页面注意：目前只支持网页版进行实名认证，需要电脑上进行支付宝实名' +
              '验证，实名验证成功后，手机重新关机启动，再操作淘宝授权。'
          },
          {
            question: '助商通账号授权过淘宝账号了，可以删除重新授权其他淘宝账号吗？',
            answer: '不可以'
          },

        ]
      }
    },
    methods: {
      /**
       * 吊起授权界面
       */
      callAppMethod(code){
        callAppMethod(code);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .approveTeach {
    .border_box {
      box-sizing: border-box;
      padding: .34rem .28rem;
      .quest {
        width: 6.5rem;
        display: flex;
        align-items: center;

        i {
          display: block;
          width: .6rem;
          height: .6rem;
          background: #F7084C;
          border-radius: 50%;
          text-align: center;
          line-height: .6rem;
          margin-right: .15rem;
        }

        .right {
          width: 5.5rem;
        }
      }

      .answer {
        width: 6.5rem;
        display: flex;
        float: right;
        justify-content: right;
        i {
          margin-top: .2rem;
          display: block;
          width: .6rem;
          height: .6rem;
          background: #E5E5E5;
          border-radius: 50%;
          text-align: center;
          line-height: .6rem;
          margin-left: .15rem;
        }

        .left {
          width: 5.5rem;
          box-sizing: border-box;
          background: #E5E5E5;
          padding: .18rem;
          margin-left: .18rem;
          border-radius: .05rem;
        }
      }
    }

    .fzr36 {
      font-size: .36rem;
    }

    .fzr34 {
      font-size: .34rem;
    }

    .fc-8B4302 {
      color: #8B4302;
    }

    .fc-ffffff {
      color: #FFFFFF;
    }

    .mb32 {
      margin-bottom: .32rem;
    }

    .long_Img {
      width: 100%;
      height: 15.78rem;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .foot{
      width: 100%;
      height: 1rem;
      background: #F7094D;
      border-radius: .1rem;
      position: fixed;
      bottom: 0;
      left: 0;
    }
  }
</style>
