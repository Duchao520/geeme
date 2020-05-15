<template>
  <el-dialog 
    width="500px" 
    :visible="delTagDialogVisible" 
    :lock-scroll="false" :before-close="dialogBeforeClose"
    append-to-body
  >
    <!-- :modal-append-to-body="modalAppendToBody"  -->
    <div class="con">
      <div class="con-center">
        <p class="icon-wrap" :style="{'color':iconColor?iconColor:'#FF6D61'}">
          <i :style="{'font-size': '50px'}" :class="['icon', 'iconfont', `icon-${icon}`]"></i>
        </p>
        <div class="text">
          <p class="title">{{title}}</p>
          <div class="context">
            <slot name="content">
              <span v-if="content">{{content}}</span>
            </slot>
          </div>

        </div>
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button v-if="showConcelBtn" @click="$emit('close')">{{concelButton}}</el-button>
      <el-button
        :loading="btnLoad"
        v-if="showConfirmBtn"
        style="background:#58C9F3;border-color:transparent"
        type="primary"
        @click="$emit('confirm')"
      >{{confirmButton}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    delTagDialogVisible: Boolean,
    title: String,
    content: String,
    icon: String,
    iconColor: String,
    concelButton: {
      type: String,
      default: "取消"
    },
    confirmButton: {
      type: String,
      default: "确定"
    },
    showConcelBtn: {
      type: Boolean,
      default: true
    },
    showConfirmBtn: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    btnLoad: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    dialogBeforeClose() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.con {
  display: flex;
  justify-content: center;
  margin-top: -10px;
  .con-center {
    display: flex;
    align-items: center;
    .icon-wrap {
      font-size: 50px;
      color: #ff6d61;
      margin-right: 15px;
    }
    .text {
      width: 275px;
      .title {
        font-size: 20px;
        color: #333333;
        font-weight: 600;
        line-height: 30px;
      }
      .context {
        font-size: 14px;
        color: #666666;
      }
    }
  }
}
.footer {
  margin-top: -30px;
  // margin-bottom: -10px;
}
</style>
