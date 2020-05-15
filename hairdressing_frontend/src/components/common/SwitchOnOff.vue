<template>
  <div
    class="on-off-root"
    @click="clickFn"
    :style="{
            'justifyContent': value?'flex-end':'flex-start',
            'background':value?'#65BD63':'#fff',
            'borderColor':value?'#65BD63':'#DFDFDF'
        }"
  >
    <div class="core" :style="pos"></div>
  </div>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  computed: {
    pos() {
      let o = {};
      o.left = this.value ? "12px" : "0px";
      return o;
    }
  },
  methods: {
    clickFn() {
      this.$emit("input", !this.value);
      this.$emit("change");
    }
  }
};
</script>
<style lang="scss" scoped>
.on-off-root {
  width: 35px;
  height: 23px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 11px;
  background: red;
  position: relative;
  cursor: pointer;
  transition: all 0.6s;
  .core {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background: #ffffff;
    transition: all 0.6s;
    position: absolute;
    top: 0;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  }
}
</style>
