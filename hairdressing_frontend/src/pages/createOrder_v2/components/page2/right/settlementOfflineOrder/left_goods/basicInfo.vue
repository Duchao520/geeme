<template>
  <div class="basic-info">
    <div class="money-info">
      <div class="order-info-line">
        <div></div>
        <span>服务单信息</span>
        <div></div>
      </div>
      <div class="order-info-d">
        <p>
          <span>下单时间</span>
          <span>{{bill.createTime || '-'}}</span>
        </p>
        <p>
          <span>服务时间</span>
          <span>{{bill.serviceTime}}</span>
        </p>
        <!-- new 点击结算不生成服务单号 -->
        <p v-if="bill.serialCode">
          <span>服务单号</span>
          <span>{{bill.serialCode || '-'}}</span>
        </p>
        <p>
          <span>纸单号</span>
          <span>{{bill.paperOrderId || '-'}}</span>
        </p>
        <p>
          <span>客户姓名</span>
          <span>{{bill.customerInfo.name}}</span>
        </p>
        <p>
          <span>客户手机号</span>
          <span>{{bill.customerInfo.mobile}}</span>
        </p>
        <p>
          <span>开单人</span>
          <span>{{bill.billingStaff.name || '-'}}</span>
        </p>
        <p>
          <span>收银员</span>
          <span>{{userInfo.username}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  methods: {},
  computed: {
    ...mapState({
      bill: state => state.bill,
      userInfo:state=>state.manage.userInfo // 以前从这里取的收银员
    })
  }
};
</script>
<style lang='scss' scoped>
// .basic-info {
//   background: yellow;
//   height: 150px;
// }

.money-info {
  box-sizing: border-box;
  padding: 0 16px;
  color: #999;
  .order-info-line {
    display: flex;
    align-items: center;

    div {
      flex: auto;
      border-top: 1px dashed #efeff4;
    }

    span {
      margin: 0 10px;
    }
  }

  .order-info-d {
    margin-top: 10px;

    p {
      display: flex;
      flex: auto;
      justify-content: space-between;
      line-height: 25px;

      span:nth-child(2) {
        // color: #333333;
      }
    }
  }
}
</style>
