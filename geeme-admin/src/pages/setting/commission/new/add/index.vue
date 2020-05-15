<template>
  <G-FullPage title="新增提成方案" @back="back">
    <div class="add-newcommission-content">
      <!-- 方案名称 -->
      <G-Form-Item v-bind="form.name"></G-Form-item>
      <!-- 适用员工职务-->
      <G-Form-Item v-bind="form.position"></G-Form-item>
      <!-- explanation -->
      <a-row class="explanation">
        <a-col :span="21" :offset="3">
          <p>设置成功后，该职务的员工默认适用该提成方案。如需修改个人提成方案，请前往“<span>员工提成配置</span>”。</p>
        </a-col>
      </a-row>

      <!-- 计算方式-->
      <G-Form-Item v-bind="form.calculation"></G-Form-item>
      <!-- explanation -->
      <a-row class="explanation">
        <a-col :span="21" :offset="3">
          <p>指的是提成不随其他因素变化。</p>
        </a-col>
      </a-row>

      <!-- content -->
      <div class="program">
        <Fixed />
      </div>

      <!-- operation -->
      <div class="operation">
        <a-button type="primary" style="margin:0 20px 0 0">保存</a-button>
        <a-button>取消</a-button>
      </div>
    </div>
  </G-FullPage>
</template>

<script>
import Fixed from '../../components/fixed'
export default {
  data() {
    const inputLayout = { labelCol: { span: 3 }, wrapperCol: { span: 6 } }
    return {
      form: {
        name: {
          name: 'name',
          label: '方案名称',
          placeholder: '请输入方案名称',
          required: true,
          inputLayout: inputLayout,
          value: '',
          initValue: '',
          inputWidth: 420,
        },
        position: {
          name: 'position',
          label: '适用员工职务',
          required: true,
          placeholder: '请选择',
          value: undefined,
          initValue: undefined,
          kind: 'select',
          list: [{name: '职务A', id: 1}, {name: '职务B', id: 0}],
          selectLayout: inputLayout,
        },
        calculation: {
          name: 'calculation',
          required: true,
          label: '计算方式',
          value: 1,
          initValue: 1,
          kind: 'radioG',
          list: [{label: '固定式', value: 1}, {label: '阶梯式', value: 2}, {label: '阶段式', value: 3}]
        },
      },
    }
  },
  methods: {
    back() {
      this.$router.push('/app/setting/commission/new')
    }
  },
  components: {
    Fixed,
  }
};
</script>

<style lang="less" scoped>
.add-newcommission-content {
  .common-scrollbar();
  overflow-y: auto;
  padding: 40px 0 0 0;
  height: calc(100vh - 105px);
  .explanation {
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    margin: -18px 0 10px 0;
    span {
      color: #58C9F3;
      cursor: pointer;
    }
  }
  .program {
    width: 1260px;
    height: 842px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
    margin: 20px auto 40px auto;
    padding: 0 10px;
  }
  .operation {
    width: 1260px;
    margin: 0 auto 40px auto;
    button {
      width: 100px;
      height: 40px;
    }
  }
}
</style>