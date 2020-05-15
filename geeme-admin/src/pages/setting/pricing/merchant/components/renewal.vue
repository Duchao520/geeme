<template>
  <div class="price-content">
    <div class="title">
      <div style="width: 17.8%; padding: 30px 0 20px 20px;">行业版本</div>
      <div style="width: 20.55%;padding: 30px 0 20px 40px;">店数</div>
      <div style="width: 20.55%;">标准版</div>
      <div style="width: 20.55%;">专业版</div>
      <div style="width: 20.55%;">旗舰版</div>
    </div>
    <div class="price-wrapper" v-for="item in newForm" :key="item.industry">
      <div class="industry">{{item.industry}}</div>
      <div class="detail">
        <div class="item">
          <div class="version"></div>
          <div class="version">
            <p class="title">基准价</p>
            <a-input class="input price" addonAfter="元/店"/>
          </div>
          <div class="version">
            <p class="title">基准价</p>
            <a-input class="input price" addonAfter="元/店"/>
          </div>
          <div class="version">
            <p class="title">基准价</p>
            <a-input class="input price" addonAfter="元/店"/>
          </div>
        </div>
        <div class="item" v-for="i in item.discount" :key="i.range">
          <div class="version">{{i.range}}</div>
          <div class="version">
            <p class="title">折扣</p>
            <a-input class="input discount" addonAfter="折"/>
          </div>
          <div class="version">
            <p class="title">折扣</p>
            <a-input class="input discount" addonAfter="折"/>
          </div>
          <div class="version">
            <p class="title">折扣</p>
            <a-input class="input discount" addonAfter="折"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newForm: [
        {
          industry: "专业美发；美容美发；美甲店；养发馆",
          price: { standard: 1500, profession: 3000, ultimate: 5000 },
          discount: [
            { range: "1年", standard: 7, profession: 7, ultimate: 7 },
            { range: "2年", standard: 7, profession: 7, ultimate: 7 },
            { range: "3年", standard: 7, profession: 7, ultimate: 7 },
          ]
        },
        {
          industry: "专业美容",
          price: { standard: 1500, profession: 3000, ultimate: 5000 },
          discount: [
            { range: "1年", standard: 7, profession: 7, ultimate: 7 },
            { range: "2年", standard: 7, profession: 7, ultimate: 7 },
            { range: "3年", standard: 7, profession: 7, ultimate: 7 },
          ]
        },
        {
          industry: "整形医院；口腔医院",
          price: { standard: 1500, profession: 3000, ultimate: 5000 },
          discount: [
            { range: "1年", standard: 7, profession: 7, ultimate: 7 },
            { range: "2年", standard: 7, profession: 7, ultimate: 7 },
            { range: "3年", standard: 7, profession: 7, ultimate: 7 },
          ]
        }
      ]
    };
  }
};
</script>

<style lang="less" soped>
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
    display: flex;
    margin: -1px 0;
    .industry {
      width: 17.8%;
      border: 1px solid #f0f1f4;
      border-bottom: none;
      padding: 0 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333333;
    }
    &:last-child .industry {
      border-bottom: 1px solid #f0f1f4;
    }
    .detail {
      width: 82.2%;
      margin: 1px 0;
      .item {
        border: 1px solid #f0f1f4;
        border-left: none;
        height: 60px;
        margin: -1px 0;
        /*  */
        display: flex;
        .version {
          width: 25%;
          height: 100%;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          &:first-child {
            padding: 0 0 0 40px;
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
              width: 120px;
            }
            &.discount {
              width: 100px;
            }
          }
        }
      }
    }
  }
}
</style>