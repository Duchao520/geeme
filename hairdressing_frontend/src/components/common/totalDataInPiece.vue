<template>
  <div class="total-data-in-piece">
    <div 
      class="data-item" 
      :style="{
        ...pieceStyle,
        'max-width': maxWidth
      }" 
      :class="pieceClass" 
      v-for="item in list" 
      :key="item[options.label]"
    >
      <div class="data-box" :title="item[options.value]">{{item[options.value]}}</div>
      <div class="label-box">{{item[options.label]}}</div>
      <slot v-if="item.showSlot" name="header-edit"></slot>
      <slot v-if="item.showSlot" name="bottom"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {
          label: 'name',
          value: 'value',
        }
      }
    },
    pieceStyle: {
      type: Object,
      required: false
    },
    pieceClass: {
      type: [String, Array, Object],
      required: false
    }
  },
  computed: {
    maxWidth() {
      return (100 - this.list.length + 1) / this.list.length + "%"
    },
  }
}
</script>
<style lang='scss' scoped>
.total-data-in-piece {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.data-item {
  height: 120px;
  flex: 1;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  position: relative;
  .data-box {
    font-size: 32px;
    color: #333;
    font-weight: bold;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .label-box {
    font-size: 16px;
    color: #666;
  }
}
.data-item + .data-item {
  margin-left: 1%;
}
</style>
