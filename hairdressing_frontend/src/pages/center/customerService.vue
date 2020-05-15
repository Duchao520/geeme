<template lang="pug">
.center-service__wrap
  .content-container
    center-nav(
      :list="navList",
      :current="current",
      @click="changeNav"
    )
    component(:is="componentId") 
</template>
<script>
import CenterNav from '@/components/center/nav'
import adviser from '@/components/center/adviser'
export default {
  data() {
    return {
      current: 1, // 当前操作的信息
      navList: [
        {
          id: 1,
          name: '客服顾问'
        }
      ], // 导航列表
      componentId: 'adviser'
    }
  },
  components: {
    'center-nav': CenterNav,
    adviser
  },
  created() {

  },
  methods: {
      // 改变导航
    changeNav(id) {
      this.current = id
      this.componentId = id===1? 'system' : 'records'
    },
  },
}
</script>
<style lang="scss" scoped>
.center-service{
  &__wrap{
    padding: 0 20px;
    height: 100%;
    overflow: hidden;
  }
  &__content{
    padding: 0 20px;
  }
}
.content-container{
  height: 100%;
}
</style>