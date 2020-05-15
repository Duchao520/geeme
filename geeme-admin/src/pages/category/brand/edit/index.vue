<template>
  <G-FullPage :title="title" @back="back">
    <a-spin :spinning="detailLoading" tip="品牌详情获取中...">
      <div class="edit-brand-content">
        <!-- 品牌名称 -->
        <G-Form-Item v-bind="form.brandName" @blur="onBlur"></G-Form-item>
        <!-- 品牌编号 编辑可见 -->
        <G-Form-Line v-bind="form.brandCode" v-if="inEdit"></G-Form-Line>
        <!-- 品牌标志 -->
        <LogoUpload v-bind="form.logo" @success="onSuccess"/>
        <!-- 产品分类 -->
        <ClassSelect v-bind="form.levelList" @change="onChange"/>
        <!-- 商标证书 -->
        <CertiUpload v-bind="form.certificate" @remove="onRemove" @success="onSuccess"/>
        <!-- 品牌持有人 -->
        <G-Form-Item v-bind="form.brandOwner" @blur="onBlur"></G-Form-item>
        <!-- 电话 -->
        <G-Form-Item v-bind="form.phone" @blur="onBlur"></G-Form-item>
        <!-- 品牌简介 -->
        <G-Form-Item v-bind="form.description" @blur="onBlur"></G-Form-item>
        <!-- 创建人 编辑可见 -->
        <G-Form-Line v-bind="form.createUserName" v-if="inEdit"></G-Form-Line>
        <!-- 创建人电话 编辑可见 -->
        <G-Form-Line v-bind="form.createUserPhone" v-if="inEdit"></G-Form-Line>
        <!-- 创建人备注 编辑可见 -->
        <G-Form-Line v-bind="form.remark" v-if="inEdit"></G-Form-Line>
        <!-- 备注说明 -->
        <G-Form-Item v-bind="form.sysRemark" @blur="onBlur"></G-Form-item>
        <!-- 是否上线 -->
        <G-Form-Item v-bind="form.online" @r-change="onChange"></G-Form-item>

        <a-row>
          <a-col :span="21" :offset="3">
            <a-button type="primary" @click="submit" style="margin-right: 20px;" :loading="submitLoading">确认提交</a-button>
            <a-button @click="back">取消</a-button>
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </G-FullPage>
</template>

<script>
import { validateItem, validateAll } from '@/utils/validation'
import LogoUpload from './components/logoUpload'
import ClassSelect from './components/classSelect'
import CertiUpload from './components/certiUpload'
import { addBrand, queryBrandDetail, editBrand} from '@/api/brand'
export default {
  components: {
    LogoUpload,
    ClassSelect,
    CertiUpload,
  },
  data() {
    return {
      form: {
        brandName: {
          name: 'brandName',
          label: '品牌名称',
          placeholder: '请输入品牌名称',
          required: true,
          status: null,
          help: '',
          tip: '品牌名称必填且不能超过16个字符',
          mode: 'brandName',
          inputLayout: { labelCol: { span: 3 }, wrapperCol: { span: 4 } },
          value: '',
          initValue: '',
        },
        logo: {
          name: 'logo',
          label: '品牌标志',
          required: true,
          status: null,
          help: '',
          tip: '请上传完整品牌标志',
          mode: 'brandLogo',
          value: '',
          initValue: '',
        },
        levelList: {
          name: 'levelList',
          label: '覆盖产品分类',
          required: true,
          status: null,
          help: '',
          tip: '请选择产品分类',
          value: [],
          initValue: [],
        },
        certificate: {
          name: 'certificate',
          value: '',
          initValue: '',
        },
        brandOwner: {
          name: 'brandOwner',
          label: '品牌持有人',
          placeholder: '请输入品牌持有公司全称',
          inputLayout: { labelCol: { span: 3 }, wrapperCol: { span: 4 } },
          value: '',
          initValue: '',
        },
        phone: {
          name: 'phone',
          label: '电话',
          placeholder: '品牌持有公司联系电话',
          inputLayout: { labelCol: { span: 3 }, wrapperCol: { span: 4 } },
          value: '',
          initValue: '',
        },
        description: {
          name: 'description',
          label: '品牌简介',
          placeholder: '请填写品牌简介，所有人可见',
          value: '',
          initValue: '',
          kind: 'textarea',
          textareaStyle: {width: '700px', height: '150px'}
        },
        sysRemark: {
          name: 'sysRemark',
          label: '备注说明',
          placeholder: '请填写备注说明，仅审核工作人员可见',
          value: '',
          initValue: '',
          kind: 'textarea',
        },
        online: {
          name: 'online',
          required: true,
          label: '是否上线',
          value: true,
          initValue: true,
          kind: 'radioG',
          list: [{label: '上线', value: true}, {label: '下线', value: false}]
        },
        /* 以下数据在编辑模式下仅供展示 */
        brandCode: {
          label: '品牌编号',
          initValue: null,
        },
        createUserName: {
          label: '创建人',
          initValue: null,
        },
        createUserPhone: {
          label: '创建人电话',
          initValue: null,
        },
        remark: {
          label: '创建人备注',
          initValue: null,
        }
      },
      submitLoading: false,
      detailLoading: false,
    }
  },
  computed: {
    title() {
      if (this.$route.path.search('edit') > -1) {
        return '编辑品牌'
      } else if (this.$route.path.search('add') > -1) {
        return '新增品牌'
      }
    },
    inEdit() {
       if (this.$route.path.search('edit') > -1) {
        return true
      } else if (this.$route.path.search('add') > -1) {
        return false
      }
    },
    id() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.inEdit && this.queryBrandDetail(this.id)
  },
  methods: {
    back() {
      this.$router.push('/app/category/brand')
    },
    onBlur(data) {
      const obj = this.form[data.name]
      obj.value = data.value
      validateItem(obj)
    },
    onChange(data) {
      const obj = this.form[data.name]
      obj.value = data.value
    },
    onSuccess(data) {
      const obj = this.form[data.name]
      obj.value = data.value
    },
    onRemove(name) {
      this.form[name].value = null;
    },
    async submit() {
      if (!validateAll(this.form)) {
        return false
      }
      const param = {}
      const logo = this.form.logo.value.split('&')
      Object.keys(this.form).forEach(i => {
        param[i] = this.form[i].value
      })
      param.logoRectangle = logo[0]
      param.logoSquare = logo[1]
      this.submitLoading = true
      let res = {}
      try {
        if (!this.inEdit) {
          res = await addBrand(param)
        } else {
          param.id = this.id
          res = await editBrand(param)
        }
        if (res.code !== 1200) {
          this.$message.error('操作失败')
          return
        }
      } finally {
        this.submitLoading = false
      }
      this.$message.success('操作成功')
      this.back()
    },
    async queryBrandDetail(id) {
      this.detailLoading = true
      let res = {}
      try {
        res = await queryBrandDetail(id)
      } catch(e) {
        this.$message.error('未能查询到相关品牌详情')
        this.back()
      } finally {
        this.detailLoading = false
      }
      const data = res.data.productBrand
      if (data == null) {
        this.$message.error('未能查询到相关品牌详情')
        this.back()
        return
      }
      this.initForm(data)
    },
    initForm(data) {
      Object.keys(this.form).forEach(i => {
        this.form[i].initValue = data[i]
        this.form[i].value = this.form[i].initValue
      })
      this.form.logo.value = this.form.logo.initValue = `${data.logoRectangle}&${data.logoSquare}`
    }
  }
};
</script>

<style lang="less" scoped>
.edit-brand-content {
  .common-scrollbar();
    overflow-y: auto;
    padding: 50px 0 40px 0;
    height: calc(100vh - 105px);
}
</style>