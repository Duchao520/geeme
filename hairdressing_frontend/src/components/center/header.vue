<template lang="pug">
  section.center-header__wrap
    .header-container.media
      .header-left
        img.logo(
          src="/static/images/geeme-logo.svg"
          @click="toSite" class="to-web-site"
        )
        .title 个人中心
      .header-right
        .back(
          @click="back"
        ) 返回首页
</template>
<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    back() {
      this.$router.push('/center');
    },
    toSite (){
      window.open('https://www.geeme.cn')
    } 
  },
}
</script>
<style lang="scss" scoped>
 .to-web-site {
    &:hover {
      cursor: pointer;
    }
  }
</style>
