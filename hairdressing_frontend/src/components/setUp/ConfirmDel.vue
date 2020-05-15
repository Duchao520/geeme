<template>
  <el-dialog :visible.sync="delDialogVisible" width="500px" :before-close="dialogBeforeClose">
    <div class="main-con">
      <div class="center-con">
        <div class="icon">
          <i style="margin-right:2px;" class="icon iconfont icon-icon_popup_question"></i>
        </div>
        <div class="right">
          <span style="color:#333333;font-size:20px;font-weight:600;line-height:34px">确定要删除吗？</span><br/>
          <span style="color:#666666;font-size:14px;">删除后，该提成方案相关的已生效提成结算数据不会失效！</span>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button class="button" @click="$emit('close')">取 消</el-button>
      <el-button class="button" type="primary" @click="$emit('confirm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    delDialogVisible: Boolean
  },
  methods: {
    dialogBeforeClose() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.main-con {
  margin-top: -20px;
  margin-bottom: -40px;
  display: flex;
  justify-content: center;
  .center-con {
    width: 340px;
    display: flex;
    align-items: center;
    .icon {
      color: red;
      font-size: 50px;
    }
    .right {
      margin-left: 10px;
    }
  }
}
.button{
    width: 70px;
    height: 40px;
}
</style>
