<template>
<!-- 打算废弃 -->
  <div class="fmk-shop-box">
    门店
    {{tags.nodeName}}
    {{tags.nodeId}}
    {{tags.nodeDesc}}
  </div>
</template>

<script>
export default {
 props: {
    tags: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log('我在这里请求行门店id，用于获取门店数据', this.tags.nodeId)
  },
  watch: {
    'tags.nodeId': (v, o) => {
      console.log('我在这里监听门店id变化,用新的参数重新请求数据', v)
    }
  }
}
</script>

<style>

</style>
 