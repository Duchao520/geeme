<template>
  <div class="nonsupport box_padding" style="padding: 2.35rem .59rem">
    <img src="@/assets/imgs/svip/notChanel.png" alt="">
    <p class="fz-36 text-center">当前不支持查询<span class="fc-F7094D">【{{companyName}}】</span>物流信息</p>
    <p class="fz-30 text-center" style="margin-bottom: .98rem">如需查询请点击第三方进行查询</p>
    <button class="fz-36 fc-ffffff bg-F7094D" @click="query">第三方查询</button>
  </div>
</template>

<script>
  import {postTitle , ctxPath} from "@/assets/js/jsBridge";

  export default {
    name: "nonsupport",
    data(){
      return{
        companyName: this.$route.query.companyName,
        logisticCode: this.$route.query.logisticCode,
        com: this.$route.query.com
      }
    },
    methods: {
      query(){
        var callbackurl = ctxPath + '/zst-wap/index.html#/closeWebView';
        var uri = 'https://m.kuaidi100.com/app/query/?nu=' + this.logisticCode + '&com=' + this.com + '&coname=zst' + '&callbackurl=' + encodeURIComponent(callbackurl);
        window.location.href = uri;
      }
    },
    mounted() {
      postTitle('物流信息')
    }
  }
</script>

<style scoped>
  img {
    display: block;
    width: 4.82rem;
    height: 1.91rem;
    margin: 0 auto;
    margin-bottom: .52rem;
  }

  button {
    display: block;
    width: 5.56rem;
    height: .86rem;
    border-radius: .43rem;
    margin: 0 auto;
  }
</style>
