<template>
  <span
    class="auth-tag"
    :style="{
    background: data.bgColor,
     border: `1px solid ${data.bdColor || data.bgColor}`,
     color: data.textColor
    }"
  >{{data.content}}</span>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default: function () {
          return {
            bgColor: '#58C9F3',
            bdColor: '#58C9F3',
            content: '默认',
            textColor: '#fff'
          }
        }
      }
    },
  };
</script>

<style lang="less" scoped>
  .auth-tag {
    word-break: keep-all;
    padding: 1px 6px;
    font-size: 12px;
    line-height: 17px;
    //background: #58c9f3;
    border-radius: 10px;
    color: #ffffff;
  }
</style>
