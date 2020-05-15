<template>
  <div class="search-wrapper">
    <div class="search">
      <a-input-search
        placeholder="搜索门店名称/编码"
        style="width: 280px"
        enterButton
        @search="search"
      />
    </div>
    <div class="content">
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
  data() {
    const selectLayout = { labelCol: { span: 7 }, wrapperCol: { span: 7} }
    const selectWidth = 170
    return {
      form: {
        tradeId: {
          name: 'tradeId',
          label: '所属行业',
          value: -1,
          initValue: -1,
          list: [{ name: '全部', id: -1 }],
          kind: 'select',
          selectLayout,
          selectWidth
        },
        city: {
          name: 'city',
          label: '所在城市',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        version: {
          name: 'version',
          label: '系统版本',
          value: 1,
          initValue: 1,
          list: [{ name: "1.0", id: 1 }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        salesCompany: {
          name: 'salesCompany',
          label: '销售公司',
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectLayout,
          selectWidth
        },
        salesman: {
          name: 'salesman',
          label: '隶属销售',
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
  methods: {
    search() {},
    reset() {},
    onChange() {},
  }
};
</script>

<style lang="less" scoped>
.search-wrapper {
  margin: 0 0 15px 0;
  .search {
    display: flex;
    flex-direction: row-reverse;
    margin: 0 0 20px 0;
  }
  .content:extend(.normal-content-one) {
    padding: 20px 0 20px 15px;
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