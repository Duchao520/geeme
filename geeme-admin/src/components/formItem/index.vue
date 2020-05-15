<template>
  <!-- 所有 input select datepicker 的默认长度统一为 200px -->
  <div class="geeme-form-item-wrap">
    <!-- input -->
    <a-form-item
      v-if="kind === 'input'"
      has-feedback
      :label="label"
      :validate-status="status"
      :help="help"
      :required="required"
      v-bind="inputLayout"
    >
      <a-input 
        :placeholder="placeholder"
        :style="{width: inputWidth + 'px'}"
        @blur="onBlur" 
        @input="onInput" 
        :value="value"
      />
    </a-form-item>

    <!-- select-->
    <!-- 注： 选择器要想展示出 placeholder，选将默认值设置为 undefined -->
    <a-form-item
      v-if="kind === 'select'"
      :label="label"
      :required="required"
      v-bind="selectLayout"
      has-feedback
      :validate-status="status"
      :help="help"
    >
      <a-select :style="{width: selectWidth + 'px'}" @change="handleChange" :value="value" :disabled="disabled" :placeholder="placeholder">
        <a-select-option 
          v-for="item in list"
          :key="item.id"
          :value="item.id"
        >
        {{item.name}}
        </a-select-option>
      </a-select>
    </a-form-item>
    <!-- selectInput -->
    <a-form-item
      v-if="kind === 'selectInput'"
      :label="label"
      :required="required"
      v-bind="selectLayout"
      has-feedback
      :validate-status="status"
      :help="help"
    >
      <a-select
        showSearch
        optionFilterProp="children"
        :filterOption="filterOption"
        :style="{width: selectWidth + 'px'}" @change="handleChange" :value="value" :disabled="disabled" :placeholder="placeholder"
      >
        <a-select-option 
        v-for="item in list"
        :key="item.id"
        :value="item.id"
        >
        {{item.name}}
        </a-select-option>
      </a-select>
    </a-form-item>
    <!-- checkbox group -->
    <a-form-item
      v-if="kind === 'checkboxG'"
      :label="label"
      :validate-status="status"
      :help="help"
      :required="required"
      v-bind="checkboxGLayout"
    >
      <a-checkbox-group @change="onCheckChange" :value="value">
        <a-row style="padding-top: 4px;">
          <a-col
            style="margin-top: 5px;"
            :span="4" 
            v-for="item in list" 
            :key="item.id" 
          >
          <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
        </a-col>
        </a-row>
      </a-checkbox-group>
    </a-form-item>

    <!-- textArea -->
    <a-form-item
      v-if="kind === 'textarea'"
      :label="label"
      :validate-status="status"
      :help="help"
      :required="required"
      v-bind="textareaLayout"
    >
      <div style="position: relative;display: inline-block;">
        <a-textarea v-model="value" :style="textareaStyle" :placeholder="placeholder" @blur="onBlur" @input="onTextAreaInput"/>
        <span class="word-count">{{wordCount}}/{{limit}}</span>
      </div>
    </a-form-item>

    <!-- radio group -->
    <a-form-item
      v-if="kind === 'radioG'"
      :label="label"
      :validate-status="status"
      :help="help"
      :required="required"
      v-bind="radioGLayout"
      >
        <a-radio-group :options="list" @change="onRadioChange" v-model="value" />
      </a-form-item>

      <!-- avatar -->
      <a-form-item
        v-if="kind === 'avatar'"
        :label="label"
        :required="required"
        v-bind="avatarLayout"
      > 
        <G-Upload-Pic 
          :size=1
          type="avatar"
          style="margin: -13px 0 0 0;"
        >
        </G-Upload-Pic> 
      </a-form-item>

      <!-- datepicker -->
      <a-form-item
        v-if="kind === 'datepicker'"
        :label="label"
        :required="required"
        v-bind="datepickerLayout"
      >
        <a-date-picker :style="{width: datepickerWidth + 'px'}" />
      </a-form-item>

  </div>
</template>

<script>
// TODO 该表单组件集合有点乱，里面的方法数据还需要再整理一遍
export default {
  props: {
    /* 标识fromitem的渲染类别 */
    kind: {
      type: String,
      default: "input"
    },
    /* 是否必填 */
    required: {
      type: Boolean,
      default: false
    },
    /* 是否禁用 */
    disabled: {
      type: Boolean,
      default: false
    },
    /* 以下为各组件的布局 */
    inputLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 7 } })
    },
    selectLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 8 }, wrapperCol: { span: 16} })
    },
    checkboxGLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    radioGLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    textareaLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    avatarLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    datepickerLayout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    textareaStyle: {
      type: Object,
      default: () => ({ width: '420px', height: '100px' })
    },
    /* textarea 专用字数限制 */
    limit: {
      type: Number,
      default: 500,
    },
    /* formitem 的标签文案 */
    label: String,
    status: String,
    help: String,
    name: String,
    placeholder: String,
    list: Array,
    initValue: [String, Number, Array, Boolean],
    /* 以下为各组件的单独样式 */
    selectWidth: {
      type: Number,
      default: 200,
    },
    inputWidth: {
      type: Number,
      default: 200,
    },
    datepickerWidth: {
      type: Number,
      default: 200,
    }
  },
  data() {
    return {
      value: this.initValue,
    }
  },
  watch: {
    initValue(val) {
      this.value = val
    }
  },
  computed: {
    // 此处要防止因为值为 null 引起的报错
    wordCount() {
      return (this.value || '').length
    }
  },
  methods: {
    onInput(e) {
      this.value = e.target.value;
    },
    onBlur(e) {
      this.$emit('blur', {
        name: this.name,
        value: e.target.value,
      })
    },
    /* checkbox Group */
    onCheckChange(checkedValues) {
      this.value = checkedValues
      this.$emit('change', {
        name: this.name,
        value: checkedValues
      })
    },
    /* select */
    handleChange(value) {
      this.value = value
      this.$emit('s-change', {
        name: this.name,
        value: value,
      })
    },
    onRadioChange(e) {
      this.value = e.target.value
      this.$emit('r-change', {
        name: this.name,
        value: this.value,
      })
    },
    onTextAreaInput() {
      this.wordCount > this.limit && (this.value = this.value.slice(0, this.limit))
      this.$emit('textAreaChange', {value: this.value})
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
};
</script>

<style lang="less" scoped>
.normal-form-item();
.word-count {
  position: absolute;
  color: rgba(199, 202, 209, 1);
  font-size: 14px;
  line-height: 14px;
  bottom: 10px;
  right: 10px;
}
/* 重写 textarea 滚动条样式 */
/deep/ textarea {
  .common-scrollbar();
}
</style>