<template>
  <p :style="{
    color:timeLong?activeColor:color,fontSize:fontSize
  }">
    <span class="icon iconfont icon-icon_ope_clock" :style="{
    color:timeLong?activeColor:color,fontSize:fontSize
  }"></span>
    <span>{{timeDifference}}</span>
  </p>
</template>
<script>
  import * as utils from "@/assets/js/utils.js";

  export default {
    props: {
      time: String,
      color: {
        type: String,
        default: "#9EABBE"
      },
      activeColor: {
        type: String,
        default: "#F52D56"
      },
      fontSize: {
        type: String,
        default: "12px"
      }
    },
    data() {
      return {
        timeDifference: "",
        timeLong: false,
        timer:null
      }
    },
    mounted() {
      this.calcTime();
      this.timer = setInterval(() => {
        this.calcTime();
      }, 1000)
    },
    methods: {
      calcTime() {
        this.timeDifference = utils.formatTimeDifference(this.time).formatTime;
        this.timeLong = utils.formatTimeDifference(this.time).diff >= 18000000;
      }
    },
    beforeDestroy() {
      window.clearInterval(this.timer);
    }
  }
</script>
