<template lang="pug">
span.g-sbtn(
  :class="[type]",
  class="btn",
) {{ name }}
</template>
<script>
export default {
  props: {
    name: String,
    type: String
  }
};
</script>
<style lang="scss" scoped>
.g-sbtn {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 8px;
  box-sizing: border-box;
  white-space: nowrap;
  &.btn {
    color: #fff;
  }
  &.sgrey {
    background: #707171;
    color: #fff;
  }
  &.grey {
    background: #bec3c6;
    color: #fff;
  }
  &.green {
    background: #a9d86e;
    color: #fff;
  }
  &.blue {
    background: #58c9f3;
    color: #fff;
  }
  // 浅蓝
  &.sblue {
    background: #41CAC0;
    color: #fff;
  }
  &.orange {
    background: #ff6d61;
    color: #fff;
  }
  // 橙色1
  &.orange1 {
    background: #FCB322;
    color: #fff;
  }
  &.mred {
    background: #f52d56;
    color: #fff;
  }
  &.lan {
    background: #92dcf8;
    color: #fff;
  }
  &.lu {
    background: #a0dc85;
    color: #fff;
  }
  &.huang {
    background: #f4d552;
    color: #fff;
  }
  &.hei {
    background: #707171;
    color: #fff;
  }
  &.hui {
    background: #bec3c6;
    color: #fff;
  }
  &.hong {
    background: #e22c37;
    color: #fff;
  }
  &.delete {
    background: #C1C0C9;
    color: #fff;
  }
}
</style>
