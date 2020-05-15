<template>
  <el-dialog
    :visible="changeDialogVisible"
    width="800px"
    custom-class="custom-class"
    @close="$emit('close')"
    append-to-body
  >
    <h6 slot="title" class="title">
      {{goodsType === 'service' ? '选择服务者' : '选择主销售人'}}
    </h6>
    <div class="staffs">
      <p class="please">请选择</p>
      <el-radio-group v-model="selectedStaffId">
        <el-radio
          v-for="(item, index) in list"
          :label="item.id"
          :key="index"
          :disabled="disabled(item.id)"
        >
          <div class="radio-content">
            <el-image
              style="width: 35px; height: 35px"
              fit="cover"
              :src="utils.formatPicImage(item.headPortrait, 'style', 40)"
            ><div slot="error"></div></el-image>
            <div class="name">
              <p :title="item.name">{{item.name}}</p>
              <p :title="item.levelName">{{item.levelName}}</p>
            </div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>
    <div slot="footer" class="footer">
      <el-button 
        plain 
        @click="clearStaff"
        class="plain_gray_btn" 
        v-if="selectedStaffId && goodsType !== 'service'" 
      >
        清空选择
      </el-button>
      <el-button class="plain_gray_btn" @click="$emit('close')">取消</el-button>
      <el-button class="normal_blue_btn" @click="confirm">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import * as utils from "@/assets/js/utils";

  export default {
    props: {
      list: Array,
      staffId: [Number, Object],
      changeDialogVisible: Boolean,
      assistList: {
        type: Array
      },
      goodsType: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        utils,
        selectedStaffId: null
      };
    },
    watch: {
      staffId(id) {
        this.selectedStaffId = id;
      }
    },
    methods: {
      confirm() {
        let tempArr = this.list;
        for (let index = 0; index < tempArr.length; index++) {
          const element = tempArr[index];
          if (element.id === this.selectedStaffId) {
            element.staffName = element.name;
            this.$emit("confirm", element);
            break;
          }
        }
      },
      clearStaff() {
        this.$emit('confirm', {
          staffName: null,
          staffId: null,
        })
      },
      disabled(id) {
        let ids = []
        this.assistList.map(i => {
          try {
            i.id && ids.push(i.id)
          } catch(err) {

          }
        })
        return ids.includes(id)
      }
    },
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  @mixin font-style($lh,$fs,$col) {
    line-height: $lh;
    font-size: $fs;
    color: $col;
  }

  @mixin one-line($w) {
    width: $w;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @mixin flex-center{
    display: flex;
    align-items: center;
  }
  /deep/ .el-dialog__header {
    padding: 4px 20px 0;
    border-bottom: 1px solid #F0F1F4;
  }
  /deep/ .el-dialog__body {
    padding: 15px 20px;
  }
  .custom-class {
    .title {
      @include font-style(56px, 18px, #333333);
    }

    .staffs {

      background: #F4F5F7;
      box-sizing: border-box;
      padding: 0 14px;

      .please {
        @include font-style(40px, 14px, #666666);
      }
      .el-radio-group{
        height: 340px;
        overflow-y: auto;
        @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
        align-content: flex-start;
        @include flex-center;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding-left: 15px;
        .el-radio{
          @include flex-center;
          flex: 0 0 190px;
          overflow: hidden;
          height: 35px;
          margin-bottom: 20px;
          margin-left: 0;
          /deep/ .radio-content{
            @include flex-center;
            .el-image{
              margin-right: 10px;
              margin-left: 7px;
              img{
                width: 35px;
                height: 35px;
                border-radius: 50%;
              }
            }
            .name{
              p:nth-child(1){
                @include font-style(21px,15px,#333333);
              }
              p:nth-child(2){
                @include font-style(16px,12px,#999999);
              }
              p{
                @include one-line(110px);
              }
            }
          }
        }
      }
    }
  }
</style>
