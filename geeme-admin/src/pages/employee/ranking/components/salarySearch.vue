<template>
  <div class="search-wrapper">
    <div class="line">
      <div class="left">
        <!-- <a-row> -->
          <a-col :span=6><G-Form-Item class="item" v-bind="form.tradeId" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.city" @s-change="onChange"/></a-col>
          <a-col :span=6 style="visibility:hidden;"><G-Form-Item class="item" v-bind="form.city" @s-change="onChange"/></a-col>
          <a-col :span=6 style="visibility:hidden;"><G-Form-Item class="item" v-bind="form.city" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.version" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.salesCompany" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.salesman" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.test1" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.test2" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.test3" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.test4" @s-change="onChange"/></a-col>
          <a-col :span=6><G-Form-Item class="item" v-bind="form.test5" @s-change="onChange"/></a-col>
        <!-- </a-row> -->
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
        version: {
          name: 'version',
          label: '门店新购数',
          value: -1,
          initValue: -1,
          list: [{ name: "￥20001-30000", id: -1 },{ name: "标准版", id: 1 },{ name: "专业版", id: 2 },{ name: "旗舰版", id: 3 }],
          kind: "select",
          selectLayout,
        },
        salesCompany: {
          name: 'salesCompany',
          label: '门店新购业绩',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "￥30001-50000", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
        salesman: {
          name: 'salesman',
          label: '门店续费业绩',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "￥10000-30000", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
        test1: {
          name: 'salesman',
          label: '门店升级业绩',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "101-200人", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
        test2: {
          name: 'salesman',
          label: '供应商新购数',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "￥20001-30000", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
        test3: {
          name: 'salesman',
          label: '供应商新购业绩',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "￥30001-50000", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
        test4: {
          name: 'salesman',
          label: '供应商续费业绩',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "￥10000-30000", id: 'ALL' }],
          kind: "select",
          selectLayout,
        },
        test5: {
          name: 'salesman',
          label: '提成薪酬业绩',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "101-200人", id: 'ALL' }],
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
    .left {
      width: 94%;
      border-right: 1px solid #F0F1F4;
      .item {
        overflow: hidden;
        height: 36px;
      }
    }
    .right {
      width: 6%;
      padding: 38px 0 0 10px;
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