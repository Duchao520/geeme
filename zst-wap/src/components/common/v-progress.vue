<template>
  <div class="v-progress"
       :style="{height: height ? height + 'rem' : '.1rem','border-radius': height ? height/2 + 'rem' : '.05rem'}">
    <div class="progress" :style="{width: rate ? rate : 0,background: progressBg ? progressBg : '#4045D5'}">

    </div>
  </div>
</template>

<script>
  export default {
    name: "v-progress",
    props: ['height','rate','progressBg']
  }
</script>

<style lang="scss" scoped>
  .v-progress{
    width: 100%;
    height: .1rem;
    border-radius: .05rem;
    background: #E7E7E7;
    overflow: hidden;
    .progress{
      height: 100%;
      width: 40%;
      background: #4045D5;
    }
  }
</style>
