<template>
  <el-dialog
    title="提示"
    :visible="visible"
    width="800px"
    @close="$emit('close')"
  >
    <h6 slot="title">选择图标</h6>
    <div class="menu-icons-content">
      <div
        class="two-icon-images"
        v-for="(item,index) in iconImages"
        :key="index"
        :class="{active:iconId===item.id}"
        @click="iconId = item.id"
      >
        <div class="icon-item">
          <p><img :src="item.deActiveImage"></p>
          <p>未选中</p>
        </div>
        <div class="icon-item">
          <p><img :src="item.activeImage"></p>
          <p>选中</p>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')" class="normal_gray_btn">取 消</el-button>
      <el-button @click="confirmChooseIcon" class="normal_blue_btn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    props: {
      visible: Boolean,
      themeId: {
        type: Number,
        default: 1
      },
      iconTypeToChange: Object
    },
    data() {
      return {
        iconId: 0
      }
    },
    computed: {
      iconImages() {
        let arr = [], n = 1;
        do {
          let n_ = n < 10 ? "0" + n : n;
          arr.push({
            activeImage: `https://image.geeme.cn/icon_nav24_9/icon_nav0${this.themeId}_${n_}.png`,
            deActiveImage: `https://image.geeme.cn/icon_nav24_9/icon_nav00_${n_}.png`,
            id: n
          });
          n++;
        } while (n <= 48); // 主题icon数量
        return arr;
      }
    },
    methods: {
      confirmChooseIcon() {
        this.$emit('setIconId', {
          type: this.iconTypeToChange.type,
          iconId: this.iconId
        })
      },

    }
  }
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #F0F1F4;
    padding: 20px;

    h6 {
      line-height: 20px;
      font-size: 18px;
    }
  }

  /deep/ .el-dialog__body {
    padding: 16px 28px 0;
    height: 560px;
    overflow-y: auto;
    @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));

    .menu-icons-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .two-icon-images {
        display: flex;
        width: 170px;
        height: 120px;
        border-radius: 4px;
        border: 1px solid rgba(213, 218, 223, 1);
        box-sizing: border-box;
        padding: 15px;
        margin-bottom: 15px;
        cursor: pointer;

        .icon-item {
          margin-right: 20px;

          p:nth-child(1) {
            border: 1px dashed #D5DADF;
            width: 60px;
            height: 60px;
          }

          p:nth-child(2) {
            text-align: center;
            line-height: 40px;
            color: #999999;
          }
        }
      }

      .active {
        border-color: #F52D56;
      }
    }
  }

</style>
