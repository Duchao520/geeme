<template>
  <div class="total-tip-list-line">
    <div class="flex-item" :style="{width: width}" v-for="item in superData" :key="item.name">
      <div class="weight">{{item.num}}</div>
      <div>{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    superData: {
      type: Array,
      required: true
    }
  },
  computed: {
    width() {
      return 100 / this.superData.length + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.total-tip-list-line {
  height: 75px;
  margin: 20px 20px 0px;
  background: #fff;
  display: flex;
  align-items: center;
}
.flex-item {
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > div {
    text-align: center;
    font-size: 12px;
  }
  .weight {
    font-weight: bold;
    font-size: 24px;
  }
}
.flex-item + .flex-item {
  border-left: 1px solid #e9e9e9;
}
</style>