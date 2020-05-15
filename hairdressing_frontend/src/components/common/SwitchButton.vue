<template>
  <div @click="$emit('click')" class="box-wrap" :style="{'background':active?activeColor:inactiveColor,'border-color':active?activeColor:inactiveColor}">
    <div class="dot" :class="{activeClass:active}"></div>
  </div>
</template>
<script>
export default {
  props: {
    active: Boolean,
    activeColor: String,
    inactiveColor: String
  }
};
</script>
<style lang="scss" scoped>
.box-wrap{
    display: inline-block;
    box-sizing: border-box;
    width: 40px;
    height: 24px;
    border: 1px solid red;
    border-radius: 17px;
    position: relative;
    cursor: pointer;
    .dot{
        width: 22px;
        height: 22px;
        transition: all 0.6s;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        background: #fff;
    }
    .activeClass{
        left: 16px;
    }
}
</style>
