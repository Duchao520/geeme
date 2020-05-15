<template>
  <div class="root">
    <div class="input-box">
      <el-input @input="change" maxlength="5" :placeholder="0" v-model="price.from"></el-input>
    </div>
    <div>至</div>
    <div class="input-box">
      <el-input @input="change" maxlength="5" :placeholder="1000" v-model="price.to"></el-input>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      price: {
        from: 0,
        to: 1000
      }
    };
  },
  props:{
    title:String
  },
  methods: {
    change() {
      this.$emit("input", {
        price: Number(this.price.from),
        to: Number(this.price.to)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.root {
  width: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  > div {
    margin: 0 5px;
  }
  .input-box {
    width: 70px;
    /deep/ .el-input__inner{
      padding: 4px;
    }
  }
}
</style>
