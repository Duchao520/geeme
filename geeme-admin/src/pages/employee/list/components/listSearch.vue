<template>
  <div class="search-wrapper">
    <div class="line">
      <div class="left">
        <a-col :span=6><G-Form-Item class="item" v-bind="form.tradeId" @s-change="onChange"/></a-col>
        <a-col :span=6><G-Form-Item class="item" v-bind="form.city" @s-change="onChange"/></a-col>
        <a-col :span=6><G-Form-Item class="item" v-bind="form.version" @s-change="onChange"/></a-col>
        <a-col :span=6><G-Form-Item class="item" v-bind="form.salesCompany" @s-change="onChange"/></a-col>
        <a-col :span=6><G-Form-Item class="item" v-bind="form.salesman" @s-change="onChange"/></a-col>
      </div>
      <div class="right">
        <button class="clear" @click="reset">清空条件</button>
        <a-button type="primary" @click="search">查询</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String, /* shop or brand */
  },
  data() {
    const selectLayout = { labelCol: { span: 7 }, wrapperCol: { span: 7} }
    const selectWidth = 170
    return {
      form: {
        tradeId: {
          name: 'tradeId',
          label: '所属公司',
          value: -1,
          initValue: -1,
          list: [{ name: '全部', id: -1 }],
          kind: 'select',
          selectLayout,
          selectWidth
        },
        city: {
          name: 'city',
          label: '部门',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        version: {
          name: 'version',
          label: '职务身份',
          value: -1,
          initValue: -1,
          list: [{ name: "全部", id: -1 },{ name: "标准版", id: 1 },{ name: "专业版", id: 2 },{ name: "旗舰版", id: 3 }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        salesCompany: {
          name: 'salesCompany',
          label: '入职时间',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        salesman: {
          name: 'salesman',
          label: '生日月份',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
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
    .left {
      width: 85%;
      border-right: 1px solid #F0F1F4;
      .item {
        overflow: hidden;
        height: 36px;
      }
    }
    .right {
      width: 15%;
      padding: 0 0 0 25px;
      box-sizing: border-box;
      .clear {
        display: block;
        font-size:14px;
        color: #999999;
        margin: 0 0 17px 0;
        cursor: pointer;
      }
    }
  }
}
</style>
