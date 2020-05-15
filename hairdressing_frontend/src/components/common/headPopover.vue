<template>
  <div class="gemee-popover" v-show="popoverVisible" ref="gpopover">
    <slot></slot>
  </div>
</template>
<script>
import util from "@/util/base.js";
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      popoverVisible: this.visible
    };
  },
  created() {},
  mounted() {
    document.addEventListener("click", event => {
      if (this.popoverVisible) {
        this.popoverVisible = false;
      }
    });
    this.$refs.gpopover.addEventListener("click", event => {
      event.stopPropagation();
      event.cancelBubble = true;
    });
    this.$refs.gpopover.addEventListener("mouseenter", event => {
      this.popoverVisible = true
    });
  },
  watch: {
    visible(val, oldVal) {
      this.changeVisible(val)
     /*  setTimeout(() => {
        this.popoverVisible = val
      }, 0) */
    }
  },
  methods: {
    changeVisible: util.debounce(function() {
      console.log(arguments[0][0])
      this.popoverVisible = arguments[0][0]
    }, 100)
  }
};
</script>
<style lang="scss" scoped>
.gemee-popover {
  /* height: 374px; */
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
}
.gemee-popover::after {
  content: "";
  position: absolute;
  bottom: 100%;
  right: 10%;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #9DA8CC transparent;
}
</style>