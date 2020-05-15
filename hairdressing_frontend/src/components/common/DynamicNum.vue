<template>
  <span>{{ animatedNumber || computedNumber}}</span>
</template>
<script>
import { TweenLite } from "gsap/TweenMax";
export default {
  props: {
    number: { type: Number, default: 0 },
    timelong: {
      //自定义时间渐变长度
      type: Number,
      default: 0.3
    }
  },
  data() {
    return { tweenedNumber: 0 };
  },
  computed: {
    animatedNumber: function() {
      return Math.round(this.tweenedNumber * 100) / 100;
    },
    computedNumber(){
      return Math.round(this.number * 1000) / 1000;
    }
  },
  watch: {
    number: function(newValue) {
      TweenLite.to(this.$data, this.timelong, { tweenedNumber: newValue });
    }
  }
};
</script>
