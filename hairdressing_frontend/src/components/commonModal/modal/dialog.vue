<template lang="pug">
transition(
  name="fade"
)
  section.g-modal(
    v-show="showDialog"
  )
    .g-modal-container
      .modal-header
        .title {{ title }}
        .close(
          @click="$emit('close')"
        ) 
          i.icon.iconfont.icon-icon_close
      .body
        slot
      .footer
        .btn-group
          el-button(
            @click="$emit('close')"
          ) {{ firstBtn }}
          el-button(
            type="primary",
            @click="$emit('confirm')"
          ) {{ secondBtn }}
          
</template>

<script>
  export default {
    props: {
      title: { // 弹框标题
        type: String,
        default: ''
      },
      name: { // 弹框名称
        type: String,
        default: ''
      },
      showDialog: {
        type: Boolean,
        default: true
      },
      firstBtn: {
        type: String,
        default: '取消'
      },
      secondBtn: {
        type: String,
        default: '确认'
      },
    },
  }
</script>
<style lang="scss">
  .g-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
    background: rgba(0, 0, 0, 0.5);
    &-container {
      width: 500px;
      position: absolute;
      top: 257px;
      left: 50%;
      background: #fff;
      border-radius: 4px;
      box-sizing: border-box;
      transform: translate(-50%,-50%);
      font-size: 18px;
      color: #333333;
      overflow: hidden;
      .modal-header {
        position: relative;
        border: 1px solid rgba(240, 241, 244, 1);
        height: 52px;
        .title {
          padding: 15px 20px 15px 20px;
        }
        .close {
          position: absolute;
          right: 0;
          top: 0;
          padding: 15px 12px 15px 20px;
          cursor: pointer;
          .icon {
            font-size: 20px;
          }
        }
      }
      .body {
        padding: 20px;
        text-align: center;
      }
      .footer {
        position: relative;
        height: 60px;
        .btn-group {
          position: absolute;
          right: 4%;
        }
      }
    }
  }
     // 动画
// .fade-enter, .fade-leave-active {
//   opacity: 0;
// }
// .fade-enter-active, .fade-leave-active {
//   transition: all 1s ease-in-out;
//   -webkit-transition: all 1s ease-in-out;
//   -moz-transition: all 1s ease-in-out;
//   -ms-transition: all 1s ease-in-out;
//   -o-transition: all 1s ease-in-out;
// }
</style>