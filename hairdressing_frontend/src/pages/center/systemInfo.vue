<template lang="pug">
.center-system__wrap
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
import all from '@/components/center/systemInfo/all'
export default {
  data() {
    return {
      current: 1, // 当前操作的信息
      navList: [
        {
          id: 1,
          name: '全部'
        },
        {
          id: 2,
          name: '服务通知'
        },
        {
          id: 3,
          name: '产品消息'
        }
      ], // 导航列表
      componentId: 'all'
    }
  },
  components: {
    'center-nav': CenterNav,
    all
  },
  created() {

  },
  methods: {
      // 改变导航
    changeNav(id) {
      this.current = id
      // this.componentId = id===1? 'all' : 'all'
    },
  },
}
</script>
<style lang="scss" scoped>
.center-system{
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