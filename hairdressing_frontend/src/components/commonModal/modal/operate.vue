<template lang="pug">
transition(
  name="fade"
)
  section.g-modal(
    v-show="showDialog"
  )
    .g-modal-container
      .header
        .close(
          @click="close('close')"
        ) 
          i.icon.iconfont.icon-icon_close
      .body
        .m-success
          i.icon.iconfont.icon-icon_popup_success
          .text-box
            .title {{ title }}
            span.txt 立即
            span.txt.todo(
              @click="close('confirm')"
            ) 创建门店
            span.txt ，开启您的成功旅程
      .footer
        .btn-group
          .group-item
            g-btn(
              :type="'blue1'",
              :size="'large'",
              :name="firstBtn",
              @click.native="close('confirm')"
            )
          .group-item
            g-btn(
              :type="'black'",
              :size="'large'",
              :name="secondBtn",
              @click.native="close('close')"
            )
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
    methods: {
      close(type) {
        let params = {
          name: this.name,
          type: type
        }
        this.$emit('close', params)
      }
    }
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
      width: 470px;
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
      .header {
        height: 50px;
        position: relative;
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
        // text-align: center;
        .m-success {
          padding-bottom: 20px;
          text-align: center;
          .icon, .text-box {
            display: inline-block;
            vertical-align: middle;
          }
          .icon {
            font-size: 50px;
            color: #00CF82;
          }
          .text-box {
            text-align: left;
            margin-left: 16px;
            .title {
              font-size: 20px;
              color: #333333;
              font-weight: 600;
            }
            .txt {
              font-size: 14px;
              color: #666666;
              &.todo {
                color: #58C9F3;
                cursor: pointer;
              }
            }
          }
        }
      }
      .footer {
        position: relative;
        height: 60px;
        .btn-group {
          position: absolute;
          right: 4%;
          .group-item {
            display: inline-block;
            &:first-child {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
</style>