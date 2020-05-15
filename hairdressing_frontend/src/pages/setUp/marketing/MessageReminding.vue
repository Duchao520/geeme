<template>
  <div class="message-reminding-root">
      <div class="module" v-for="(item,index) in message" :key="index" :data="item">
          <p class="title">{{item.title}}</p>
          <div class="module-content">
              <message-reminding-module v-for="(module,index) in item.content" :key="index" :data="module"></message-reminding-module>
          </div>
      </div>
    
  </div>
</template>
<script>
import MessageRemindingModule from "@/components/setUp/marketing/MessageRemindingModule";
export default {
  components: {
    MessageRemindingModule
  },
  data() {
    return {
      message: [
        {
          title: "交易提醒",
          content: [
            {
              title: "订单支付提醒",
              shortMessgaeOrApplet: "shortMessage",
              shortMessgae: true,
              publicAccount: true,
              Applet: true,
              id:1
            },
            {
              title: "订单支付提醒",
              shortMessgaeOrApplet: "shortMessage",
              shortMessgae: true,
              publicAccount: true,
              Applet: true,
              id:2
            },
            {
              title: "订单支付提醒",
              shortMessgaeOrApplet: "shortMessage",
              shortMessgae: true,
              publicAccount: true,
              Applet: true,
              id:1
            },
            {
              title: "订单支付提醒",
              shortMessgaeOrApplet: "shortMessage",
              shortMessgae: true,
              publicAccount: true,
              Applet: true,
              id:2
            }
          ]
        },
        {
          title: "预约提醒",
          content: [
            {
              title: "预约成功",
              shortMessgaeOrApplet: "shortMessage",
              shortMessgae: null,
              publicAccount: true,
              Applet: true,
              id:3
            },
            {
              title: "修改预约",
              shortMessgaeOrApplet: "shortMessage",
              shortMessgae: true,
              publicAccount: true,
              Applet: null,
              id:4
            }
          ]
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.message-reminding-root {
  box-sizing: border-box;
  padding: 20px 40px;
  .module{
      .title{
          line-height: 42px;
          color: #333333;
          font-weight: 600;
      }
      .module-content{
          display: flex;
          flex-wrap: wrap;
      }
  }
}
</style>
