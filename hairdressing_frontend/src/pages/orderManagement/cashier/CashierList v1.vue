<template>
  <component :is="activity" @suberEmit="toChangeComponent"></component>
</template>
<script>
import init from './_initializedCashierPage'
import backout from './_backoutCashierPage'

export default {
  name: 'cashier-main',
  data() {
    return {
      activity: 'init', // 
    }
  },
  methods: {
    toChangeComponent(name) {
      this.activity = name
    }
  },
  components: {init, backout}
}
</script>
<style lang='scss' scoped>

</style>
