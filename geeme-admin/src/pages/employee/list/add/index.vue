<template>
  <G-FullPage title="新增员工" @back="back">
    <div class="add-employee-content">
      <!-- 基本信息 -->
      <G-Border-Content title="个人信息" class="content-wrapper">
        <div class="info">
          <!-- 姓名-->
          <G-Form-Item v-bind="form.name"></G-Form-item>
          <!-- 昵称-->
          <G-Form-Item v-bind="form.nickName" class="inline"></G-Form-item>
           <!-- 昵称-->
          <G-Form-Item v-bind="form.gender" class="inline"></G-Form-item>
        </div>
      </G-Border-Content>

      <!-- 职务权限 -->
      <G-Border-Content title="职务权限" class="content-wrapper">
        <div class="info">
          <!-- 是否上线 -->
          <G-Form-Item v-bind="form.position"></G-Form-item>
          <!-- 入职时间-->
          <G-Form-Item v-bind="form.entryTime" class="inline"></G-Form-item>
          <!-- 部门/分公司-->
          <G-Form-Item v-bind="form.department" class="inline"></G-Form-item>
          <!-- 职务身份-->
          <G-Form-Item v-bind="form.job"></G-Form-item>
          <!-- 授予角色-->
          <G-Form-Item v-bind="form.role"></G-Form-item>
          <!-- 状态-->
          <G-Form-Item v-bind="form.status"></G-Form-item>
        </div>
      </G-Border-Content>

      <!-- 账号信息 -->
      <G-Border-Content title="账号信息" class="content-wrapper">
        <div class="info">
          <!-- 登陆手机号-->
          <G-Form-Item v-bind="form.phone"></G-Form-item>
        </div>
      </G-Border-Content>

      <!-- 其他 -->
      <G-Border-Content title="其他" class="content-wrapper">
        <div class="info">
          <!-- 备注头像 -->
          <AvatarUpload />
          <!-- 身份证号码-->
          <G-Form-Item v-bind="form.idCardNum" class="inline"></G-Form-item>
          <!-- 生日-->
          <G-Form-Item v-bind="form.birthday" class="inline"></G-Form-item><br />
          <!-- 籍贯 -->
          <G-Form-Item v-bind="form.birthPlace" class="inline"></G-Form-item>
          <!-- 婚姻状况 -->
          <G-Form-Item v-bind="form.marital" class="inline"></G-Form-item><br />
          <!-- 血型 -->
          <G-Form-Item v-bind="form.bloodGroup" class="inline"></G-Form-item>
          <!-- 学历-->
          <G-Form-Item v-bind="form.education" class="inline"></G-Form-item>
          <!-- 备注 -->
          <G-Form-Item v-bind="form.remark"></G-Form-item>
        </div>
      </G-Border-Content>

      <div class="operation">
        <a-button type="primary" style="margin:0 20px 0 0">保存</a-button>
        <a-button>取消</a-button>
      </div>
    </div>
  </G-FullPage>
</template>

<script>
import AvatarUpload from './components/avatarUpload'
export default {
  data() {
    const inputLayout = { labelCol: { span: 3 }, wrapperCol: { span: 4 } }
    return {
      form: {
        name: {
          name: 'name',
          label: '姓名',
          placeholder: '请输入姓名',
          required: true,
          inputLayout: inputLayout,
          value: '',
          initValue: '',
        },
        nickName: {
          name: 'nickName',
          label: '昵称',
          placeholder: '请输入店内昵称',
          inputLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
          value: '',
          initValue: '',
        },
        gender: {
          name: 'gender',
          label: '性别',
          required: true,
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '男', id: 1}, {name: '女', id: 0}],
          selectLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        position: {
          name: 'position',
          required: true,
          label: '职务类别',
          value: true,
          initValue: true,
          kind: 'radioG',
          list: [{label: '业绩岗位', value: true}, {label: '非业绩岗位', value: false}]
        },
        entryTime: {
          name: 'entryTime',
          label: '入职时间',
          required: true,
          value: '',
          initValue: '',
          kind: 'datepicker',
          datepickerLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        department: {
          name: 'department',
          label: '部门/分公司',
          required: true,
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '部门A', id: 1}, {name: '部门B', id: 0}],
          selectLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        job: {
          name: 'job',
          label: '职务身份',
          required: true,
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '职务A', id: 1}, {name: '职务B', id: 0}],
          selectLayout: inputLayout,
        },
        role: {
          name: 'role',
          label: '授予角色',
          required: true,
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '角色A', id: 1}, {name: '角色B', id: 0}],
          selectLayout: inputLayout,
        },
        status: {
          name: 'position',
          label: '状态',
          value: true,
          initValue: true,
          kind: 'radioG',
          list: [{label: '启用', value: true}, {label: '禁用', value: false}]
        },
        phone: {
          name: 'phone',
          label: '登陆手机号',
          placeholder: '请输入手机号',
          required: true,
          inputLayout: inputLayout,
          value: '',
          initValue: '',
        },
        idCardNum: {
          name: 'idCardNum',
          label: '身份证号码',
          placeholder: '请输入身份证号码',
          inputLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
          value: '',
          initValue: '',
        },
        birthday: {
          name: 'birthday',
          label: '生日',
          value: '',
          initValue: '',
          kind: 'datepicker',
          datepickerLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        birthPlace: {
          name: 'birthPlace',
          label: '祖籍籍贯',
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '地区A', id: 1}, {name: '地区B', id: 0}],
          selectLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        marital: {
          name: 'marital',
          label: '婚姻状况',
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '已婚', id: 1}, {name: '未婚', id: 0}],
          selectLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        bloodGroup: {
          name: 'bloodGroup',
          label: '血型',
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: 'A', id: 1}, {name: 'B', id: 0}],
          selectLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        education: {
          name: 'education',
          label: '学历',
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '本科', id: 1}, {name: '专科', id: 0}],
          selectLayout: { labelCol: { span: 9 }, wrapperCol: { span: 4 } },
        },
        remark: {
          name: 'remark',
          label: '备注',
          placeholder: '请输入备注',
          value: '',
          initValue: '',
          kind: 'textarea',
          textareaStyle: {width: '420px', height: '100px'}
        },
      }
    }
  },
  methods: {
    back() {
      this.$router.push("/app/employee/list");
    }
  },
  components: {
    AvatarUpload,
  }
};
</script>

<style lang="less" scoped>
.add-employee-content {
  .common-scrollbar();
  overflow-y: auto;
  padding: 30px 40px 40px 40px;
  height: calc(100vh - 105px);
  .content-wrapper {
    margin: 0 0 20px 0;
    .info {
      padding: 20px 0 0 0;
    }
    .item {
      margin: 0 0 20px 0;
    }
  }
  .operation {
    margin: 40px 0 0 0;
    button {
      width: 100px;
      height: 40px;
    }
  }
  .inline {
    width:450px;display: inline-block;
  }
}
</style>