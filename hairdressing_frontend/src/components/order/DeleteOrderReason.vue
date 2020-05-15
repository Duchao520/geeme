<template>
  <el-dialog class="dialog-box" :visible="dialogVisible" width="500px" @close="$emit('close')">
    <div class="dialog-item dialog-icon icon iconfont icon-icon_popup_question"></div>
    <div class="dialog-item dialog-title">确定删除吗？</div>
    <div class="dialog-item dialog-info">服务单删除后，用户移动端“我的-消费账单”中，将同步删除。</div>
    <div class="dialog-item dialog-reason">
      <span>*</span> 删除原因
      <el-select
        class="select-item"
        v-model="reason"
        placeholder="请选择删除原因"
        size="small"
      >
        <el-option
          v-for="item in reasonOptions"
          :key="item.text"
          :label="item.text"
          :value="item.text"
        ></el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="$emit('deleteConsumerOrder',reason)">确定删除</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      reasonOptions: [{ text: "开单重复了" }, { text: "客户未消费" }],
      reason:null
    };
  }
};
</script>
<style lang="scss" scoped>
.dialog-box {
  font-family: PingFangSC-Regular;
  .dialog-item {
    position: relative;
    display: inline-block;
  }
  .dialog-icon {
    font-size: 50px;
    color: #ff6d61;
    top: -14px;
    left: 40px;
  }
  .dialog-title {
    font-family: PingFangSC-Medium;
    top: -40px;
    left: 50px;
    width: 120px;
    height: 28px;
    line-height: 28px;
    font-size: 20px;
    text-align: left;
    color: #333;
  }
  .dialog-info {
    top: 5px;
    left: -75px;
    width: 272px;
    color: #ff6d61;
    font-size: 14px;
  }
  .dialog-reason {
    span {
      display: inline-block;
      width: 7px;
      height: 18px;
      line-height: 18px;
      color: #ff6d61;
    }
    top: 24px;
    left: 102px;
  }
  .select-item {
    margin-left: 20px;
  }
}
</style>
