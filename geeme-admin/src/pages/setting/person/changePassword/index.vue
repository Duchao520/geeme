<template>
  <div class="change-password-wrapper">
    <G-Normal-Input v-bind="form.oldPassword"/>
    <G-Normal-Input v-bind="form.newPassword"/>
    <G-Normal-Input v-bind="form.confirm"/>
    <a-button type="primary" style="width:354px; height: 40px; margin: 40px 0 0 0;">保存修改</a-button>
    <div class="forget"><span>忘记密码？</span></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        oldPassword: {
          name: "oldPassword",
          placeholder: "请输入旧的密码",
          value: "",
          type: "password"
        },
        newPassword: {
          name: "newPassword",
          placeholder: "请输入新的密码",
          value: "",
          type: "password"
        },
        confirm: {
          name: "confirm",
          placeholder: "请确认新的密码",
          value: "",
          type: "password"
        }
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.change-password-wrapper {
  padding: 40px 0 0 40px;
  .forget {
    width: 354px;
    margin: 10px 0 0 0;
    text-align: right;
    color: #58C9F3;
    span {
      cursor: pointer;
    }
  }
}
</style>