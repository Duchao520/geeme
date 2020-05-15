<template>
  <div>

  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {
        appid: this.$route.query.appid,   //公众号appid
        redirect_uri: this.$route.query.redirect_uri, //重定向uri
        component_appid:  'wx2e41818145a653f9'      //第三方平台appid
      }
    },
    mounted(){
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${encodeURIComponent(this.redirect_uri)}&response_type=code&scope=snsapi_base&state=STATE&component_appid=${this.component_appid}#wechat_redirect`;
      window.location.replace(url)
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
