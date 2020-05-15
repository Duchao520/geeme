<template>
  <el-dialog 
    title="门店备注" 
    :visible="visible" 
    append-to-body 
    width="450px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <!--  -->
    <InputWithCount v-model="newRemark" :length="120"/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleEditRemark">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    remark: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      newRemark: ''
    }
  },
  mounted() {
    this.newRemark = this.remark
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleEditRemark() {
      this.$emit('edit', this.newRemark)
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
