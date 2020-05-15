<template>
  <div id="gm_customer_index">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "GmCustomerIndex",
  data() {
    return {
    };
  },
  mounted() {
  },
  components: {
  },
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
