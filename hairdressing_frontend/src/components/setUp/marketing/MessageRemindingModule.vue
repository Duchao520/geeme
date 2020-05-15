<template>
  <div class="message-module-root">
    <div class="title-line">
      <span class="title">{{data.title}}</span>
      <span class="look" style="color:#58C9F3">查看模板</span>
    </div>
    <div class="buttons">
      <div class="button-box" v-if="data.shortMessgaeOrApplet==='shortMessage'">
        <span>短信通知</span>
        <switch-on-off class="on-off" v-model="data.shortMessgae"></switch-on-off>
      </div>
      <div class="button-box">
        <span>公众号推送</span>
        <switch-on-off class="on-off" v-model="data.publicAccount"></switch-on-off>
      </div>
      <div class="button-box" v-if="data.shortMessgaeOrApplet==='Applet'">
        <span>小程序服务通知</span>
        <switch-on-off class="on-off" v-model="data.Applet"></switch-on-off>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.message-module-root {
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  max-width: 365px;
  min-width: 330px;
  height: 100px;
  box-sizing: border-box;
  padding: 15px;
  margin: 0 20px 20px 0;
  .title-line {
    color: #3a3a3a;
    font-size: 18px;
    display: flex;
    align-items: center;
    .look {
      color: #58c9f3;
      font-size: 14px;
      vertical-align: center;
      margin-left: 10px;
    }
  }
  .buttons {
    display: flex;
    .button-box {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      line-height: 52px;
      font-size: 14px;
      color: #a9a9a9;
      .on-off {
        margin-left: 10px;
      }
    }
  }
}
</style>
