<template>
  <ul class="geeme-types-wrapper">
    <li 
      class="type-item"
      :class="{active: item.id === activeId}"
      v-for="item in list" 
      :key="item.id"
      @click.stop="select(item)"
    >
      {{ item.name+'（'+item.mediaNum+'）' }}<a-icon class='close' @click.stop='close(item)' type="close-circle" />
    </li>
  </ul>
</template>

<script>

export default {
  props: {
    list: Array,
  },
  data() {
    return {
      activeId: null
    }
  },
  watch: {
    activeId(val) {
      this.$emit('select', val)
    },
    list(val) {
      if (val.length> 0) {
        this.activeId = val[0].id
      }
    }
  },
  methods: {
    select(item) {
      this.activeId = item.id
    },
    close(item) {
      this.$emit('click',item)
    }
  }
}
</script>

<style lang="less" scoped>
.geeme-types-wrapper {
  display: flex;
  flex-wrap: wrap;
  .type-item {
    flex-shrink: 0;
    height: 28px;
    padding: 0 20px;
    font-size: 12px;
    color: #6C757D;
    cursor: pointer;
    line-height: 28px;
    margin: 0 15px 10px 0;
    border: 1px solid rgba(206, 212, 218, 1);
    border-radius: 14px;
    &:hover{
      .close{
        opacity: 1;
      }
    }
    .close{
      opacity: 0;
    }
    &.active {
      color: #FF6D61;
      border: 1px solid #FF6D61;
    }
  }
}
</style>