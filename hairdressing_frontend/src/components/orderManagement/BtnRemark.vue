<template>
  <div>
    <el-dialog
      :closeOnClickModal="false"
      title="备注"
      :visible="btnReamrkVisible"
      width="500px"
      @close="$emit('closeRemark')"
    >
      <input-with-count v-model="remark" :autosize="{minRows:4,maxRows:100}"></input-with-count>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('closeRemark')">关 闭</el-button>
        <el-button type="primary" @click="$emit('confirmRemark',remark)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      remark: ""
    };
  },
  props: {
    btnReamrkVisible: Boolean
  }
};
</script>

