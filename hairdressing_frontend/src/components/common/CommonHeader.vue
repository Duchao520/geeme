<template>
  <el-row type="flex" justify="center" class="header-wrap">
    <div class="head" :style="{maxWidth:width,paddingLeft:padding}">
    <h1 style="font-weight:600;">{{title}}</h1>
    <p @click="$emit('click')">
      <span>
        <i class="icon iconfont icon-icon_back"></i>
      </span>
      <span>{{buttonText}}</span>
    </p>
  </div>
  </el-row>
</template>
<script>
export default {
    props: {
        title:String,
        buttonText:String,
        width: String,
        padding: String
    }
};
</script>

<style lang="scss" scoped>
.header-wrap{
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 8px 0 rgba($color: #aeb8e5, $alpha: 0.3);
}
.head {
  // max-width: 1440px;
  height: 65px;
  flex:auto;
  box-sizing: border-box;
  h1 {
    font-size: 18px;
    line-height: 44px;
    color: #333333;
  }
  p {
    font-size: 12px;
    line-height: 14px;
    color: #959595;
    &:hover {
      cursor: pointer;
    }
    .icon-icon_back {
      font-size: 12px;
    }
  }
}
</style>
