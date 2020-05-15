<template>
  <div class="price-content">
    <div class="title">
      <div style="width: 25%; padding: 30px 0 20px 20px;">行业版本</div>
      <div style="width: 25%;">店数</div>
      <div style="width: 25%;">标准版</div>
      <div style="width: 25%;">专业版</div>
    </div>
    <div class="price-wrapper" v-for="item in renewal" :key="item.industry">
      <div class="item">{{item.industry}}</div>
      <div class="item">
        <p class="title">基准价</p>
        <a-input class="input price" addonAfter="元"/>
      </div>
      <div class="item">
        <p class="title">基准价</p>
        <a-input class="input price" addonAfter="元"/>
      </div>
      <div class="item">
        <p class="title">基准价</p>
        <a-input class="input price" addonAfter="元"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      renewal: [
        {
          industry: "经销商版",
          price: { standard: 1500, profession: 3000, ultimate: 5000 }
        },
        {
          industry: "厂商版",
          price: { standard: 1500, profession: 3000, ultimate: 5000 }
        },
        {
          industry: "医院版",
          price: { standard: 1500, profession: 3000, ultimate: 5000 }
        },
        {
          industry: "同城服务版",
          price: { standard: 1500, profession: 3000, ultimate: 5000 }
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.price-content {
  .title {
    display: flex;
    div {
      padding: 30px 0 20px 0;
      font-size: 14px;
      color: #333333;
    }
  }
  .price-wrapper {
    height: 60px;
    display: flex;
    border: 1px solid #f0f1f4;
    border-bottom: none;
    font-size: 14px;
    color: #333333;
    &:last-child {
      border-bottom: 1px solid #f0f1f4;
    }
    .item {
      width: 25%;
      height: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      &:first-child {
        padding: 0 0 0 20px;
      }
      p.title {
        width: 45px;
        text-align: right;
        margin: 0 20px 0 0;
      }
      .input {
        /deep/ .ant-input-group-addon {
          color: #ffffff;
          background: #d5dadf;
        }
        &.price {
          width: 100px;
        }
      }
    }
  }
}
</style>