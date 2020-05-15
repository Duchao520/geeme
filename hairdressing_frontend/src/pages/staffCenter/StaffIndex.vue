<template>
  <div id="gm_staff_index">

    <router-view></router-view>
  </div>
</template>

<script>
import "@/assets/css/base.scss";
export default {
  name: "GmStaffIndex",
  data() {
    return {

    };
  },
  mounted() {},
  methods: {

  }
};
</script>
<style lang="scss">
#gm_customer_index .add_area .el-date-editor.el-input {
  width: 100%;
}
#gm_customer_index .add_area .el-form-item {
  width: 49%;
  display: inline-block;
}
#gm_customer_index .add_area .el-form-item.desc_item {
  width: 100%;
  .el-textarea {
    max-width: 100% !important;
  }
}
#gm_customer_index .add_dialog.el-dialog {
  min-width: 800px;
}
</style>

<style lang="scss" scoped>
#gm_staff_index{
  width: 100%;
  height: calc(100vh - 55px);
  overflow: hidden;
}
</style>


