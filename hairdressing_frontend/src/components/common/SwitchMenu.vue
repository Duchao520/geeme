<template>
  <div class="icon-wrap">
    <div :class=" active ? 'active-icon' : 'unactive-icon'" @click="switchAppearance('card')">
      <i class="icon iconfont icon-icon_switch_block"></i>
    </div>
    <div
      class="icon2"
      :class=" !active ? 'active-icon' : 'unactive-icon'"
      @click="switchAppearance('list')"
    >
      <i style="font-size:10px" class="icon iconfont icon-icon_switch_list"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "card"
    },
  },
  computed: {
    active() {
      return this.value === "card";
    }
  },
  methods: {
    switchAppearance(appearance) {
      this.$emit("input", appearance);
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-wrap {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  width: 66px;
  > div {
    width: 33px;
    height: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.6s;
    cursor: pointer;
  }
  .active-icon {
    background: #409EFF;
    color: #ffffff;
  }

  .active-shop-icon {
    background: #409EFF;
    color: #ffffff;
  }

  .unactive-icon {
    background: #ffffff;
    color: #dcdfe6;
  }
}
</style>
