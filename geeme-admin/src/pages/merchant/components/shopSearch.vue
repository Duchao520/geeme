<template>
  <div class="search-wrapper">
    <div class="line first">
      <a-button-group>
        <a-button type="primary" style="width: 98px;">门店</a-button>
        <a-button style="width: 98px;" @click="$emit('change')">品牌</a-button>
      </a-button-group>
      <a-input-search placeholder="搜索门店名称/编号" style="width: 280px" enterButton @search="search"/>
    </div>
    <div class="line second">
      <div class="left">
        <!-- <a-row> -->
        <G-Form-Item class="item" v-bind="form.brandName" @s-change="onChange"/>
        <G-Form-Item class="item" v-bind="form.tradeId" @s-change="onChange"/>
        <G-Form-Item class="item" v-bind="form.city" @s-change="onChange"/>
        <G-Form-Item class="item" v-bind="form.version" @s-change="onChange"/>
        <G-Form-Item class="item" v-bind="form.salesCompany" @s-change="onChange"/>
        <G-Form-Item class="item" v-bind="form.salesman" @s-change="onChange"/>
        <G-Form-Item class="item" v-bind="form.dueTime" @s-change="onChange"/>
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
    const selectLayout = { labelCol: { span: 6 }, wrapperCol: { span: 7} }
    const selectWidth = 190
    return {
      form: {
        brandName: {
          name: 'brandName',
          label: '所属品牌',
          value: null,
          initValue: null,
          list: [{ name: '全部', id: -1 }],
          kind: 'selectInput',
          selectLayout,
          selectWidth,
        },
        tradeId: {
          name: 'tradeId',
          label: '所属行业',
          value: null,
          initValue: null,
          list: [{ name: '全部', id: -1 }],
          kind: 'select',
          selectLayout,
          selectWidth,
        },
        city: {
          name: 'city',
          label: '所在城市',
          value: '',
          initValue: '',
          kind: "input",
          inputLayout: { labelCol: { span: 7 }, wrapperCol: { span: 7 } },
          inputWidth: 170,
          placeholder:'全部',
        },
        version: {
          name: 'version',
          label: '系统版本',
          value: '',
          initValue: '全部',
          list: [{ name: "全部", id: '' },{ name: "标准版", id: 1 },{ name: "专业版", id: 2 },{ name: "旗舰版", id: 3 }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        salesCompany: {
          name: 'salesCompany',
          label: '销售公司',
          value: null,
          initValue: null,
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        salesman: {
          name: 'salesman',
          label: '隶属销售',
          value: null,
          initValue: null,
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        dueTime: {
          name: 'dueTime',
          label: '到期时间',
          value: 0,
          initValue: '全部',
          list: [{ name: "一个月以内", id: 30 },{ name: "15天以内", id: 15 },{ name: "7天以内", id: 7 },],
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
      // param.type = this.type
      this.$emit('search', param)
    },
    onChange(data) {
      console.log(data);
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
    &.first {
      justify-content: space-between;
    }
    &.second {
      margin: 13px 0 0 0;
    }
    .left {
      width: 85%;
      border-right: 1px solid #F0F1F4;
      /* margin: 12px 0 0 0; */
      .item {
        // overflow: hidden;
        height: 36px;
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
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