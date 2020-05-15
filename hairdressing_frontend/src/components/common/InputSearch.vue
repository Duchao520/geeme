<template>
  <el-input
    :placeholder="placeholder?placeholder:'搜索方案名称/通用职务 '"
    :value="value"
    :style="{'width':width?width:'220px'}"
    @input="search"
    @keydown.native="keydown_search"
  >
    <div slot="append" @click="clickIcon">
      <i style="margin-right:2px;" class="icon iconfont icon-icon_search"></i>
    </div>
  </el-input>
</template>
<script>
  export default {
    props: {
      width: String,
      placeholder: String,
      value: String || Number,
      emitOnInput: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {};
    },
    methods: {
      keydown_search(e) {
        if (e.keyCode === 13) {
          this.$emit("search", this.value);
        }
      },
      search(text) {
        this.$emit("input", text);//实现v-model
        this.emitOnInput && this.$emit("search", text);
      },
      clickIcon() {
        this.$emit('search', this.value)
      }
    }
  };
</script>
<style lang="scss" scoped>
  /deep/ .el-input-group__append {
    background: #58c9f3;
    width: 40px;
    padding: 0;
    text-align: center;
    color: white;
    cursor: pointer;
    border: none;

    .iconfont {
      font-size: 23px;
    }
  }

  /deep/ .el-input__inner {
    height: 35px;
    border-right: none;
  }
</style>
