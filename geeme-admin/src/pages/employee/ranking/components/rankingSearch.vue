<template>
  <div class="search-wrapper">
    <div class="line">
      <a-col :span=6><G-Form-Item class="item" v-bind="form.tradeId" @s-change="onChange"/></a-col>
      <a-col :span=6><G-Form-Item class="item" v-bind="form.city" @s-change="onChange"/></a-col>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String, /* shop or brand */
  },
  data() {
    const selectLayout = { labelCol: { span: 9 }, wrapperCol: { span: 10} }
    return {
      form: {
        tradeId: {
          name: 'tradeId',
          label: '选择职务',
          value: -1,
          initValue: -1,
          list: [{ name: '全部', id: -1 }],
          kind: 'select',
          selectLayout,
        },
        city: {
          name: 'city',
          label: '选择时间',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "月报", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
      },
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    reset() {
      this.$emit('reset')
    },
    search() {
      const param = {}
      Object.keys(this.form).forEach(i => {
        param[i] = this.form[i].value
      })
      param.type = this.type
      this.$emit('search', param)
    },
    onChange(data) {
      const obj = this.form[data.name]
      obj.value = data.value
    }
  }
};
</script>

<style lang="less" scoped>
.search-wrapper:extend(.normal-content-one) {
  margin: 0 0 15px 0;
  padding: 15px 20px 20px 20px;
  .line {
    display: flex;
    .item {
      overflow: hidden;
      height: 36px; 
    }
  }
}
</style>