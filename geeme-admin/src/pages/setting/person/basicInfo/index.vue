<template>
  <div class="basic-info-wrapper">
    <!-- 头像 -->
    <G-Form-Item v-bind="form.avatar"></G-Form-item>
    <!-- 姓名 -->
    <G-Form-Item v-bind="form.name"></G-Form-item>
    <!-- 昵称 -->
    <G-Form-Item v-bind="form.nickName"></G-Form-item>
    <!-- 性别 -->
    <G-Form-Item v-bind="form.gender"></G-Form-item>
    <!-- 生日 -->
    <G-Form-Item v-bind="form.birthday"></G-Form-item>
    <!-- 登陆手机号 -->
    <G-Form-Line v-bind="form.mobile"></G-Form-Line>
    <!-- 个人简介 -->
    <G-Form-Item v-bind="form.introduction"></G-Form-item>

    <a-row>
      <a-col :span="21" :offset="3">
        <a-button type="primary" style="width:100px;">保存</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 3 } }
    return {
      form: {
        avatar: {
          name: 'avatar',
          kind: 'avatar',
          label: '头像',
          value: '',
          initValue: '',
          avatarLayout: layout,
        },
        name: {
          name: 'name',
          label: '姓名',
          inputLayout: layout,
          value: '',
          initValue: '',
        },
        nickName: {
          name: 'nickName',
          label: '昵称',
          inputLayout: layout,
          value: '',
          initValue: '',
        },
        gender: {
          name: 'gender',
          label: '性别',
          value: 1,
          initValue: 1,
          kind: 'select',
          list: [{name: '男', id: 1}, {name: '女', id: 0}],
          selectLayout: layout,
        },
        birthday: {
          name: 'birthday',
          label: '生日',
          value: '',
          initValue: '',
          kind: 'datepicker',
          datepickerLayout: layout,
        },
        mobile: {
          label: '登陆手机号',
          initValue: 17767081992,
          layout: layout,
        },
        introduction: {
          name: 'introduction',
          label: '个人简介',
          value: '',
          initValue: '',
          kind: 'textarea',
          textareaLayout: { labelCol: { span: 3 }, wrapperCol: { span: 6 } },
          limit: 30,
        }
      }
    }
  },
}
</script>

<style lang="less" scoped>
.basic-info-wrapper {
  padding: 52px 0 0 0;
}
</style>
