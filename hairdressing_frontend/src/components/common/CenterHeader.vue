<template lang="pug">
  section.center-header__wrap
    .header-container.media
      .header-left
        img.logo(
          src="/static/images/geeme-logo.svg"
          @click="toSite" class="to-web-site"
        )
        .title {{ title }}
      .header-right
        .back(
          @click="back"
        ) {{ backing }}
</template>
<script>
export default {
  props: {
    title: String,
    backing: String,
    isSelfSite: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {

    }
  },
  methods: {
    back() {
      //跳转至官网首页
      // this.$router.push('/center');
      if (this.isSelfSite) {
        this.$router.go(-1)
      } else {
        window.open('https://www.geeme.cn', '_blank')
      }
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
