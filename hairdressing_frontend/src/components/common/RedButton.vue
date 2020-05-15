<template>
  <button class="button-root" type="primary" @click="$emit('click')" :style="!iconVisible ? 'padding: 0 18px;' : ''">
    {{buttonText}}
    <i v-if="iconVisible" class="icon iconfont icon-icon_add add_btn"></i>
  </button>
</template>
<script>
import "@/assets/css/base.scss";

export default {
    props:{
        icon:String,
        buttonText:String,
        // icon 显示的标识
        iconVisible:{
          type: Boolean,
          default: true
        }
    },
}
</script>
<style lang="scss" scoped>
.button-root{
    box-sizing: border-box;
    padding: 0 9px 0 18px;
    border-radius: 20px;
    background: linear-gradient(to right,#F52D56,#FB598F);
    line-height: 40px;
    height: 40px;
    font-size: 16px;
    color: white;
    display: flex;
    align-items: center;
    .icon{
        display: inline-block;
        background: #F6315B;
        border-radius: 12px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        margin-left: 8px;
    }
}
</style>
