<template>
  <div class="menu-icon" :class="{open: !isOpen}" @click="toggle()">
    <span></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
      this.$emit('isOpen', this.isOpen)
    }
  }
};
</script>

<style lang="less" scoped>
@menuIconB: #979797;
@menuIconW: 12px;
@menuIconH: 16px;
@menuIconLineSpace: 5px;

.menu-line() {
  position: absolute;
  width: 100%;
  height: 1.5px;
  background: @menuIconB;
  left: 0;
}

.menu-icon {
  position: relative;
  width: @menuIconW;
  height: @menuIconH; /* 估计 */
  cursor: pointer;
  transition: @siderTransi;

  > span {
    .menu-line;
    top: 50%;
    transform: translateY(-50%);

    &::before {
      .menu-line;
      content: "";
      display: block;
      top: @menuIconLineSpace;
    }

    &::after {
      .menu-line;
      content: "";
      display: block;
      bottom: @menuIconLineSpace;
    }
  }

  &.open {
    transform: rotate(90deg);
  }
}
</style>