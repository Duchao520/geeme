<template>
  <el-dialog title="取消预约" :popper-append-to-body="false" :visible="cancelVisible" width="500px" @close="$emit('cancelAppoint')">
    <div class="con">
      <div class="line"></div>
      <div class="lineBox">
        <span style="margin-right:20px;"><span class="xing"></span> 取消理由</span>
        <el-select v-model="reason.reason" placeholder="请选择" @change="changeReason">
          <el-option
            v-for="(item) in options"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-show="tip" class="red">必填项不能为空!</span>
      </div>
      <div class="lineBox box2">
        <span style="margin-right:20px;">添加备注</span>
        <v-input-with-count v-model="reason.note"></v-input-with-count>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancelAppoint')">取 消</el-button>
      <el-button type="primary" @click="emitEvent">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import InputWithCount from "@/components/common/InputWithCount"
export default {
  components: { "v-input-with-count": InputWithCount },
  data() {
    return {
      reason: {
        reason: "",
        note: "",
      },
      tip: false, 
      options: [
        { value: "临时有事" },
        { value: "不想来了" },
        { value: "重新预约" },
        { value: "其他" },
      ]
    };
  },
  props: {
    cancelVisible: Boolean
  },
  methods: {
    emitEvent() {
      if (!!this.reason.reason) {
        this.$emit('confirmCancelAppoint', this.reason)
      } else {
        this.tip = true
      }
    },
    changeReason() {
      this.tip = false
    }
  }
}
</script>
<style lang="scss" scoped>
.xing{
  position: absolute;
  left: -10px;
  top:14px;
  &::before  {
    content: "*";
    color: #e6333f;
  }
}
.red {
  color: #e6333f;
  margin-left: 10px;
}
.line {
  width: 100%;
  border-top: 1px solid #f0f1f4;
  margin-bottom: 16px;
}
.con {
  box-sizing: border-box;
  margin-top: -30px;
  padding: 5px;
}
.lineBox{
    display: flex;
    align-items: center;
    position: relative;
}
.box2{
    margin-top: 10px;
    align-items: flex-start;
    /deep/ .el-textarea__inner{
        flex: auto;
        width: 370px;
    }
}
</style>
