<template>
  <a-modal :visible="visible" :title="title" @cancel="onCancel" :destroyOnClose=true width="800px">

    <G-Form-Item v-bind="form.parentId" @s-change="onSChange"></G-Form-item>

    <G-Form-Item v-bind="form.name" @blur="onBlur"></G-Form-item>

    <IconUpload :groupKey="1" ref="iconUpload" v-bind="form.icon" @success="onSuccess"/>

    <template slot="footer" class="test-test">
      <a-button key="back" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="submit" :loading=loading>确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  addServiceClass,
  retriveServiceClass,
  editServiceClass,
  getFirstServiceClass,
} from '@/api/class'
import { validateItem, validateAll } from '@/utils/validation'
import IconUpload from '../../components/iconUpload'
export default {
  components: {
    IconUpload
  },
  props: {
    operation: String,
    visible: Boolean,
    id: Number,
  },
  computed: {
    title() {
      if (this.operation === 'add') {
        return '新增二级分类'
      } else if (this.operation === 'edit') {
        return '修改二级分类'
      }
    }
  },
  created() {
     if (this.operation === 'edit') {
      this.form.parentId.disabled = true
    }
  },
  mounted() {
    this.getLevelOneClass()
    if (this.operation === 'edit') {
      this.retrive()
    }
  },
  data() {
    return {
      form: {
        parentId: {
          name: 'parentId',
          label: '一级分类',
          required: true,
          status: null,
          help: '',
          tip: '请选择一级分类',
          list: [],
          value: null,
          initValue: null,
          kind: 'select',
          selectLayout: { labelCol: { span: 4 }, wrapperCol: { span: 6} }
        },
        name: {
          name: 'name',
          label: '二级分类名称',
          placeholder: '请输入分类名称',
          required: true,
          status: null,
          help: '',
          tip: '分类名称必填且不能超过10个字符',
          value: '',
          initValue: '',
          mode: 'className',
          inputLayout: { labelCol: { span: 4 }, wrapperCol: { span: 7 } }
        },
        id: {
          value: null,
          initValue: null,
        },
        icon: {
          required: true,
          status: null,
          help: '',
          tip: '请输入分类图标',
          value: '',
          initValue: '',
          layout: { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
        },
      },
      loading: false,
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel', 'two')
    },
    onBlur(data) {
      const obj = this.form[data.name]
      obj.value = data.value
      validateItem(obj)
    },
    onSChange(data) {
      const obj = this.form[data.name]
      obj.value = data.value
      validateItem(obj)
    },
    async submit() {
      if (!validateAll(this.form)) {
        return false
      }
      const param = {}
      Object.keys(this.form).forEach(i => {
        param[i] = this.form[i].value
      })
      param.iconOrigin = this.$refs.iconUpload.iconOrigin;
      let res = {}
      this.loading = true
      try {
        if (this.operation === 'add') {
          res = await addServiceClass(param)
        } else if (this.operation === 'edit') {
          res = await editServiceClass(param)
        }
      } finally {
        this.loading = false
      }
      if (res.code === 1200) {
        this.$message.success('操作成功')
        this.$emit('success')
      }
    },
    async retrive() {
      const res = await retriveServiceClass(this.id);
      Object.keys(this.form).forEach(i => {
        this.form[i].initValue = res.data[i]
        this.form[i].value = this.form[i].initValue
      });
      if (res.data.iconOrigin) {
        this.$refs.iconUpload.init(res.data);
        this.form.icon.value = this.form.icon.initValue = "";
      }
    },
    async getLevelOneClass() {
      const res = await getFirstServiceClass()
      this.form.parentId.list = res.data
      console.log(res)
    },
    onSuccess(key) {
      this.form.icon.value = key
    }
  }
}
</script>

<style lang="less" scoped>

</style>
