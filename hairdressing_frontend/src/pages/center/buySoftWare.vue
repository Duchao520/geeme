<template lang="pug">
.center-soft__wrap
  .content-container
    center-nav(
      :list="navList",
      :current="current",
      @click="changeNav"
    )
    component(:is="componentId" :ref="componentId") 
</template>
<script>
import CenterNav from '@/components/center/nav'
import system from '@/components/center/buySoftWare/system'
import records from '@/components/center/buySoftWare/records'
export default {
  data() {
    return {
      current: 1, // 当前操作的信息
      navList: [
        {
          id: 1,
          name: '商家运营系统'
        }, {
          id: 2,
          name: '消费记录'
        }
      ], // 导航列表
      componentId: null
    }
  },
  components: {
    'center-nav': CenterNav,
    system,
    records
  },
  mounted() {
    this.componentId = 'system'
  },
  methods: {
      // 改变导航
    changeNav(item) {
      this.current = item.id
      this.componentId = item.id ===1 ? 'system' : 'records'
    },
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.center-soft{
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