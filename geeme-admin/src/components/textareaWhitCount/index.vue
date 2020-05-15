<template>
  <div class="text-area-with-count">
    <el-input
      type="textarea"
      :autosize="autosize?autosize:{ minRows: 2, maxRows: 100}"
      :placeholder="!!placeholder?placeholder:'请输入备注'"
      :value="value"
      @input="change"
      v-on="$listeners"
      :maxlength="!!length?length:150"
      :disabled="disabled"
    ></el-input>
    <p class="number">{{number}}/{{!!length?length:150}}</p>
  </div>
</template>
<script>
export default {
  name: "text-area-with-count",
  props: {
    length: Number,
    placeholder: String,
    value: String || Number,
    autosize: Object,
    disabled: Boolean
  },
  computed: {
    number() {
      return this.value ? this.value.length : 0;
    }
  },
  methods: {
    change(text) {
      this.$emit("input", text);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-textarea__inner {
  width: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.text-area-with-count {
  max-width: 2000px;
  position: relative;
  .number {
    width: 80px;
    text-align: right;
    color: #c7cad1;
    font-size: 14px;
    padding-right: 5px;
    box-sizing: border-box;
    position: absolute;
    bottom: 5px;
    right: 25px;
    line-height: 20px;
  }
}
</style>
