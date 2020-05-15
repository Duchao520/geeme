<template>
  <div class="order-search-wrapper">
    <a-form class="form first" layout="inline">
      <div>
        <a-button-group style="margin: 0 11px 0 0;">
          <a-button type="primary">今天</a-button>
          <a-button>近3天</a-button>
          <a-button>近7天</a-button>
        </a-button-group>
        <a-range-picker :placeholder="['开始日期', '结束日期']"/>
      </div>
      <a-input-search placeholder="搜索品牌名称" style="width: 280px" enterButton/>
    </a-form>
    <a-form class="form" layout="inline">
      <G-Form-Item class="item" v-bind="form.tradeId"/>
      <G-Form-Item class="item" v-bind="form.city"/>
      <G-Form-Item class="item" v-bind="form.salesCompany"/>
      <G-Form-Item class="item" v-bind="form.salesman"/>
      <a-button type="primary" style="margin: 0 10px 0 17px;">查询</a-button>
      <button class="clear">清空条件</button>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    const selectWidth = 170
    return {
      form: {
        tradeId: {
          name: "tradeId",
          label: "所属行业",
          value: -1,
          initValue: -1,
          list: [{ name: "全部", id: -1 }],
          kind: "select",
          selectWidth
        },
        city: {
          name: "city",
          label: "所在城市",
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectWidth
        },
        salesCompany: {
          name: "salesCompany",
          label: "销售公司",
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectWidth
        },
        salesman: {
          name: "salesman",
          label: "隶属销售",
          value: 'ALL',
          initValue: 'ALL',
          list: [{ name: "全部", id: 'ALL' }],
          kind: "select",
          selectWidth
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.order-search-wrapper:extend(.normal-content-one) {
  margin: 0 0 15px 0;
  padding: 15px 20px 15px 20px;
  .form {
    display: flex;
    align-items: center;
    &.first {
      justify-content: space-between;
      margin: 0 0 15px 0;
    }
    .clear {
      font-size:14px;
      color: #999999;
      cursor: pointer;
    }
  }
}
</style>
