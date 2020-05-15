<template>
  <div>
    <el-dialog title="回复客户" :visible="visible" width="470px" @close="$emit('close')">
      <div class="root-content">
        <div class="line-content">
          <div class="title">售后编号</div>
          <div class="value">{{afterSaleInfo.code}}</div>
        </div>
        <div class="line-content">
          <div class="title">申请时间</div>
          <div class="value">{{afterSaleInfo.createTime}}</div>
        </div>
        <div class="line-content">
          <div class="title">服务类型</div>
          <div class="value">{{afterSaleInfo.refundReason}}</div>
        </div>
        <div class="line-content">
          <div class="title">客户诉求</div>
          <div
            class="value"
            style="line-content-height:24px;margin-top:4px;"
          >{{afterSaleInfo.customerAsk}}</div>
        </div>
        <div class="line-content">
          <div class="title">处理结果</div>
          <div class="value">{{afterSaleInfo.salerHandle}}</div>
        </div>
        <div class="line-content">
          <div class="title">回复客户</div>
          <div class="value" style="margin-top:4px;">
            <input-with-count class="input" v-model="text" :autosize="{minRows:4,maxRows:100}"></input-with-count>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="$emit('confirmReply',text)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: ""
    };
  },
  props: {
    visible: Boolean,
    afterSaleInfo: Object
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}
.root-content {
  box-sizing: border-box;
  padding: 20px 25px 0;
  border-top: 1px solid#F0F1F4;
  .line-content {
    line-height: 30px;
    display: flex;
    width: 100%;
    .title {
      min-width: 70px;
    }
    .value {
      flex: auto;
      color: #333333;
      .input {
        /deep/ .el-textarea__inner {
          font-size: 14px;
        }
      }
    }
  }
}
.dialog-footer {
  margin-top: 15px;
}
</style>
