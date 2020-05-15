<template>
  <div>

  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {}
    },
    mounted(){
      let appid = 'wxb558efbf4e896c75';
      let redirect_uri = 'http://biz.geeme.cn';
      let component_appid = 'wx2e41818145a653f9';
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_base&state=STATE&component_appid=${component_appid}#wechat_redirect`;
      window.location.href=url
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
