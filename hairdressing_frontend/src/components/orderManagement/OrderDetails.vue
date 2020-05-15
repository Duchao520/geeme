<template>
  <div class="root" v-if="goodsInfoForOrder">
    <h3>订单明细</h3>
    <table class="table">
      <tr>
        <td>商品</td>
        <td>{{isProduct?'销售人':'服务者'}}</td>
        <!-- v1 辅助工位 辅助销售 -->
        <!-- <td v-if="!isProduct">辅助工位</td> -->
        <td>{{isProduct ? '专柜价' : '门店价'}}</td>
        <!-- <td>会员价</td> -->
        <td></td>
        <td>数量</td>
        <td>金额</td>
      </tr>
      <tr class="detail-info">
        <td>
          <div class="goods-info">
            <div class="infoBox" v-if="goodsInfoForOrder">
              <img
                :src="utils.formatPicImage(goodsInfoForOrder.image, 'style', 70)"
                alt="图片"
                class="img"
              >
              <div class="img-tag" v-if="orderInfo.orderStatus === 'GROUP_BUY_WAIT'">
                拼
              </div>
              <div class="goodsInfo">
                <p
                  class="goodsName"
                >{{goodsInfoForOrder.serviceName || goodsInfoForOrder.productName}}</p>
                <p class="grey">{{goodsInfoForOrder.specificationName || '默认'}}</p>
                <span
                  class="grey"
                  v-if="!isProduct&&goodsInfoForOrder.serverTime"
                >{{goodsInfoForOrder.serverTime}}分钟</span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="tab-bottom" v-if="!isProduct">
            <!-- v1 -->
            <!-- {{orderInfo.staffName || '-'}} -->
            <p>工位1: {{(orderInfo.stationOne || []).map(i=> {return `${i.staffName} ${shopStaffsInfo[i.staffId] ? `(${shopStaffsInfo[i.staffId]})` : ''}`}).join(' / ')}}</p>
            <p>工位2: {{(orderInfo.stationTwo || []).map(i=> {return `${i.staffName} ${shopStaffsInfo[i.staffId] ? `(${shopStaffsInfo[i.staffId]})` : ''}`}).join(' / ')}}</p>
            <p>工位3: {{(orderInfo.stationThree || []).map(i=> {return `${i.staffName} ${shopStaffsInfo[i.staffId] ? `(${shopStaffsInfo[i.staffId]})` : ''}`}).join(' / ')}}</p>
          </div>
          <div class="tab-bottom" v-if="isProduct">
            <p>{{orderInfo.assistants?orderInfo.assistants.join("，"):'-'}}</p>
          </div>
        </td>
        <!-- <td v-if="!isProduct">
          {{orderInfo.assistants&&orderInfo.assistants.length>0?orderInfo.assistants.join("、"):"-"}}
        </td> -->
        <td>￥{{goodsInfoForOrder.storePrice}}</td>
        <!-- <td>￥{{goodsInfoForOrder.price}}</td> -->
        <td></td>
        <td>X{{goodsInfoForOrder.count}}</td>
        <td>￥{{goodsInfoForOrder.storePrice * goodsInfoForOrder.count}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.storePreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">门店优惠：</td>
        <td class="received-money">￥{{orderInfo.storePreference }}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.identityCardPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">身份卡优惠：</td>
        <td class="received-money">￥{{orderInfo.identityCardPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.prepaidCardPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">储值卡优惠：</td>
        <td class="received-money">￥{{orderInfo.prepaidCardPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.countCardPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">次卡优惠：</td>
        <td class="received-money">￥{{orderInfo.countCardPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.timeCardPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">时间卡优惠：</td>
        <td class="received-money">￥{{orderInfo.timeCardPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.memberPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">{{orderInfo.levelName}}{{orderInfo.isBirthday ? '生日' : ''}}优惠：</td>
        <td class="received-money">￥{{orderInfo.memberPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.redPacketPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">红包优惠：</td>
        <td class="received-money">￥{{orderInfo.redPacketPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.couponPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">优惠券优惠：</td>
        <td class="received-money">￥{{orderInfo.couponPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.groupBuyPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">拼团优惠：</td>
        <td class="received-money">￥{{orderInfo.groupBuyPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.unPaidOrderPreference">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">改价优惠：</td>
        <td class="received-money">￥{{orderInfo.unPaidOrderPreference || '-'}}</td>
      </tr>
      <tr class="discount" v-if="orderInfo.usePointsNum">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">积分优惠({{orderInfo.usePointsNum}}积分)：</td>
        <td class="received-money">￥{{orderInfo.pointsDeductMoney}}</td>
      </tr>
      <tr class="discount real">
        <td :colspan="isProduct?4:5"></td>
        <td class="received">实收款：</td>
        <td class="received-money">￥{{orderInfo.received}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as api from "@/assets/js/interface";
  import * as axios from "@/util/axios";
  import {mapActions, mapState} from "vuex";

  export default {
    data() {
      return {
        utils: utils
      };
    },
    props: {
      orderInfo: Object,
      isProduct: Boolean,
    },
    computed: {
      ...mapState({
        shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      }),
      goodsInfoForOrder() {
        return this.orderInfo.serviceInfoForOrder
          ? this.orderInfo.serviceInfoForOrder
          : this.orderInfo.productInfoForOrder;
      },
    },
    methods: {
      cancel() {
        axios
          .get(api.salerCancelUnPayOrder.URL + this.orderInfo.id, {})
          .then(res => {
            this.$message({
              type: res.success ? "success" : "warning",
              message: res.success ? "取消成功" : res.message
            });
            if (res.success) {
              this.$router.go(-1);
            }
          });
      }
    },
    beforeRouteLeave(to, from, next) {
      // console.log(to);
      to.meta.keepAlive = true;
      next();
    }
  };
</script>
<style lang="scss" scoped>
  .root {
    overflow: hidden;
  }

  h3 {
    font-size: 14px;
    margin: 12px 0;
  }

  .table {
    min-width: 760px;
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ebecf0;
    .detail-info{
      td{
        border-bottom: 1px solid #ebecf0;
      }
    }
    > tr {
      width: 100%;
      > td {
        padding-left: 25px;
        font-size: 12px;
        color: #5f6368;

        .goods-info {
          padding: 10px 0;
        }
      }
    }

    > tr:nth-child(1) {
      background: #dee1e6;
      height: 34px;
    }

    > .discount {
      td {
        line-height: 30px;
      }
    }

    > .discount:nth-child(1) {
      td {

      }
    }

    > .discount.real {
      td {
        line-height: 30px;
        font-size: 14px;
        color: #ff6d61;
      }
    }
  }

  .infoBox {
    display: flex;
    position: relative;
    img {
      display: inline-block;
      width: 70px;
      height: 70px;
      border-radius: 5px;
      margin-right: 8px;
      border: none;
    }
    .img-tag {
      position: absolute;
      top: -5px;
      left: 56px;
      background: red;
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
    }
    .goodsInfo {
      .goodsName {
        line-height: 20px;
        max-width: 170px;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        flex-direction: column;
      }

      .grey {
        color: #999999;
        line-height: 24px;
      }
    }
  }
</style>
