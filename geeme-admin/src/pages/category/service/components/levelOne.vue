<template>
  <a-modal :visible="visible" :title="title" @cancel="onCancel" :destroyOnClose=true width="800px">

    <G-Form-Item v-bind="form.name" @blur="onBlur"></G-Form-item>

    <G-Form-Item v-bind="professionList" @change="onChange"></G-Form-item>

    <IconUpload :groupKey="1" ref="iconUpload" v-bind="form.icon" @success="onSuccess"/>

    <template slot="footer" class="test-test">
      <a-button key="back" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="submit" :loading=loading>确定</a-button>
    </template>
  </a-modal>
</template>

<script>
  import {
    getIndustryList,
    addServiceClass,
    retriveServiceClass,
    editServiceClass,
  } from '@/api/class'
  import {validateItem, validateAll} from '@/utils/validation'
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
          return '新增一级分类'
        } else if (this.operation === 'edit') {
          return '修改一级分类'
        }
      }
    },
    mounted() {
      this.getIndustryList()
      if (this.operation === 'edit') {
        this.retrive()
      }
    },
    data() {
      return {
        form: {
          name: {
            name: 'name',
            label: '分类名称',
            placeholder: '请输入分类名称',
            required: true,
            status: null,
            help: '',
            tip: '分类名称必填且不能超过10个字符',
            mode: 'className',
            value: '',
            initValue: '',
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
          },
          parentId: {
            value: 0,
            initValue: 0,
          },
        },
        professionList: {
          name: 'professionList',
          kind: 'checkboxG',
          label: '所属行业',
          required: true,
          status: null,
          help: '',
          tip: '请选择所属行业',
          value: [],
          list: [],
          initValue: [],
        },
        loading: false,
      }
    },
    methods: {
      onCancel() {
        this.$emit('cancel')
      },
      onBlur(data) {
        const obj = this.form[data.name];
        obj.value = data.value;
        validateItem(obj)
      },
      /* 所属行业选择 */
      onChange(data) {
        this.professionList.value = data.value
      },
      /* 检查所属行业 */
      checkProfession() {
        const obj = this.professionList;
        if (obj.value.length === 0) {
          obj['status'] = 'error';
          obj['help'] = obj['tip'];
          return false
        } else {
          obj['status'] = null;
          obj['help'] = '';
          return true
        }
      },
      async submit() {
        const queue = [];
        queue.push(validateAll(this.form));
        queue.push(this.checkProfession());
        if (queue.indexOf(false) > -1) {
          return false
        }
        /* 验证完毕 */
        const param = {};
        Object.keys(this.form).forEach(i => {
          param[i] = this.form[i].value
        });
        let arr = this.professionList.list;
        param.professionList = arr.filter(i => this.professionList.value.indexOf(i.id) > -1);
        param.iconOrigin = this.$refs.iconUpload.iconOrigin;
        let res = {};
        this.loading = true;
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
          this.$message.success('操作成功');
          this.$emit('success')
        }
      },
      /* 获取分类详情 */
      async retrive() {
        let res = await retriveServiceClass(this.id);
        Object.keys(this.form).forEach(i => {
          this.form[i].value = this.form[i].initValue = res.data[i];
          this.professionList.value = this.professionList.initValue = (res.data.professionList || []).map(i => i = i.id);
        });
        if (res.data.iconOrigin) {
          this.$refs.iconUpload.init(res.data);
          this.form.icon.value = this.form.icon.initValue = "";
        }
      },
      /* 获取行业列表 */
      async getIndustryList() {
        const res = await getIndustryList();
        this.professionList.list = res.data;
      },
      onSuccess(key) {
        this.form.icon.value = key
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
