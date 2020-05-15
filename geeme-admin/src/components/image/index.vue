<template>
  <div class="image"
       :style="{
      backgroundSize:size,
      backgroundImage:`url(${src})`,
      width:width,
      height:height,
      borderWidth:border?'1px':'0'
    }"
       v-on="$listeners"
  ></div>
</template>
<script>
  export default {
    props: {
      src: String,
      size: {
        type: String,
        default: "cover"
      },
      width: {
        type: String,
        default: '80px'
      },
      height: {
        type: String,
        default: '80px'
      },
      border:{
        type:Boolean,
        default:false
      }
    }
  }
</script>
<style lang="less" scoped>
  .image {
    background-position: center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    border-color: #efefef;
    border-style: solid;
  }
</style>
