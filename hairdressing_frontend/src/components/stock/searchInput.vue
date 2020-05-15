<template>
  <div class="searchInput">
    <el-input @input="change" :placeholder="placeholder"></el-input>
    <el-button type="primary" icon="el-icon-search" id="button"></el-button>
  </div>
</template>
<style lang="scss" scoped>
.searchInput {
  // width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  border-radius: 4px;
  overflow: hidden;
}

#button {
  width: 40px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  background-color: #58c9f3;
  height: 35px;
  border-radius: 0%;
  border: 0;
  padding: 0;
}

/deep/ .el-input__inner {
  // width: auto;
  height: 100%;
  border: 0;
}
</style>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    change(e) {
      this.$emit("searchChange", e);
    }
  },
  props: {
    placeholder: String
  }
};
</script>