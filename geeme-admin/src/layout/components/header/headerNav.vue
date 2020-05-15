<template>
  <ul class="header-nav" ref="headerNav">
    <router-link
      tag="li"
      v-for="item in list"
      :key="item.title"
      :to="item.link"
    >
    {{item.title}}
    </router-link>
    <div class="slider-bar" ref="sliderBar"></div>
  </ul>
</template>

<script>
/* TODO 该组件方法再整合优化一下 */
export default {
  props: {
    list: Array
  },
  data() {
    return {
      observer: null,
    }
  },
  mounted() {
    this.initSliderBar()
    let targetNode = this.$refs.headerNav
    this.observer = new MutationObserver(this.mutationCallback)
    this.observer.observe(targetNode, {attributes: true, subtree: true})
  },
  updated() {
    this.initSliderBar()
  },
  methods: {
    mutationCallback(mutationsList) {
      let left
      let width
      mutationsList.forEach(i => {
        if (i.target.classList.value.indexOf('router-link-active') > -1) {
          left = i.target.offsetLeft
          width = i.target.offsetWidth - parseInt(window.getComputedStyle(i.target).paddingRight)
        }
      })
      this.$refs.sliderBar.style.left = `${left}px`
      this.$refs.sliderBar.style.width = `${width}px`
    },
    initSliderBar() {
      if (this.list.length === 0) {
        this.$refs.sliderBar.style.left = `0px`
        this.$refs.sliderBar.style.width = `0px`
        return
      }
      let arr = this.$refs.headerNav.children
      let left
      let width
      for (let i of arr) {
        if (i.classList.value.indexOf('router-link-active') > -1) {
          left = i.offsetLeft
          width = i.offsetWidth - parseInt(window.getComputedStyle(i).paddingRight)
          break
        }
      }
      this.$refs.sliderBar.style.left = `${left}px`
      this.$refs.sliderBar.style.width = `${width}px`
    }
  }
}
</script>

<style lang="less" scoped>
  .header-nav {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0 0 0 30px;
    position: relative;
    li {
      font-size: 15px;
      color: #999999;
      padding: 0 40px 0 0;
      cursor: pointer;
      height: 100%;
      line-height: @headerH;
      white-space: nowrap;
      &.router-link-active {
        color: #333333;
      }
    }
    .slider-bar {
      position: absolute;
      /* width: 60px; */
      height: 3px;
      background: #333333;
      border-radius: 4px;
      /* left: 0; */
      top: 50px;
      transition: all 0.3s;
    }
  }
</style>
