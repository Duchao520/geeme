<template>
  <div class="card-detail-list">
    <div class="card-detail" v-for="(detail,index) in cardList" :key="index">
      <div class="card-title-info">
        <div class="card-price-left">
          <span class="card-name">{{detail.cardName}}</span>
          <p class="add-card" v-if="detail.operateType===1">续卡</p>
          <p class="open-card" v-if="detail.operateType!==1">开卡</p>
          <p class="is-upgrade" v-if="detail.isUpgrade">升级</p>
        </div>
        <span class="price">￥{{detail.chargeMoney}}</span>
      </div>
      <div class="grey-info" v-if="detail.cardNumber">卡号：{{detail.cardNumber}}</div>
      <div class="grey-info" v-if="detail.storeRemarkCardNo">备注卡号：{{detail.storeRemarkCardNo}}</div>
      <div class="grey-info" v-if="detail.cardSellerList && detail.cardSellerList.length">销售人：
        <span v-for="people in detail.cardSellerList" :key="people.sellerStaffId">{{people.staffName}} &nbsp;&nbsp;</span>
      </div>
      <!--<div class="grey-info" v-if="detail.operateType===0">有效期至：</div>-->
      <!--<div class="grey-info" v-if="detail.operateType===1">充值后有效期：</div>-->
      <div
        class="grey-info note-text"
        v-if="detail.remarks"
        :title="detail.remarks"
      >备注：{{detail.remarks}}
      </div>
      <div class="upgraded-card-name" v-if="detail.isUpgrade">
        <i class="icon iconfont icon-icon_order_upgrade"></i>
        <div class="some-other">升级为：</div>
        <div :title="detail.upgradeCardKindName" class="last-card-name">
          {{detail.upgradeCardKindName}}
        </div>
      </div>
      <p class="discount-info" v-for="(discount,index) in discounts(detail)" :key="index">
        <span>{{discount.name}}</span>
        <span>￥{{discount.value}}</span>
      </p>
      <div class="reveiced-money">
        <p class="empty"></p>
        <!-- <p class="money-pay">实付款</p> -->
        <p>
          <span>
            {{detail.paymentStatus ? '实付款: ' : '应收款: '}}
          </span>
          <span class="real-money">￥{{realPrice(detail)}}</span>
        </p>
      </div>
      <div class="gift-money" v-if="detail.giftMoney">
        <p class="empty"></p>
        <p class="money-pay"></p>
        <p class="gift-money">赠送金￥{{detail.giftMoney}}</p>
      </div>
      <div class="pay-type">
        <span>门店开单</span>
        <span style="color: #979797;">|</span>
        <span>
          {{detail.paymentStatus ? '已支付' : '未支付'}}
          <span v-if="detail.paymentTypeName">（{{detail.paymentTypeName}}）</span>
        </span>
      </div>
      <div class="level-line"></div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      cardList: [Array, Object]
    },
    methods: {
      discounts(data) {
        var discounts = data.preferentialInfo;
        let discountArr = [];
        if (discounts) {
          let discountsName = {
            storePreference: "门店优惠", //以后有什么优惠内容，直接在此配置即可
            identityCardPreference: "身份卡优惠"
          };
          for (let i in discounts) {
            if (discounts[i]) {
              discountArr.push({
                name: discountsName[i],
                value: discounts[i]
              })
            }
          }
        }
        return discountArr;
      },
      realPrice(data){
        let money = data.chargeMoney;
        for(let i in data.preferentialInfo){
          if(data.preferentialInfo[i]){
            money -= data.preferentialInfo[i];
          }
        }
        return money;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .card-detail-list {
    box-sizing: border-box;

    .card-detail {
      .card-title-info {
        display: flex;
        justify-content: space-between;

        .card-price-left {
          display: flex;
          align-items: center;

          .card-name {
            color: #333333;
            line-height: 25px;
          }

          .open-card,
          .is-upgrade,
          .add-card {
            height: 17px;
            width: 38px;
            text-align: center;
            box-sizing: border-box;
            line-height: 17px;
            font-size: 12px;
            border: 1px solid transparent;
            border-radius: 3px;
            margin-left: 5px;
          }
          /* 开卡 */
          .open-card {
            border-color: #f52d56;
            background: rgba($color: #f52d56, $alpha: 0.1);
            color: #f52d56;
          }
          /* 续卡 */
          .add-card {
            border-color: rgba(88, 201, 243, 1);
            background: rgba(88, 201, 243, 0.1);
            color: rgba(88, 201, 243, 1);
          }
          /* 续卡 */
          .is-upgrade {
            border-color: rgba(117, 199, 79, 1);
            background: rgba(117, 199, 79, 0.1);
            color: rgba(117, 199, 79, 1);
          }
        }

        .price {
          color: #333333;
        }
      }

      .grey-info,
      .reveiced-money,
      .gift-money {
        font-size: 12px;
        line-height: 25px;
      }

      .note-text.grey-info {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .reveiced-money,
      .gift-money {
        display: flex;
        justify-content: space-between;
        color: #333333;

        .empty {
          flex: 0 0 40%;
        }

        .money-pay {
          flex: auto;
        }

        .real-money {
          color: #f52d56;
          font-size: 14px;
        }
      }

      .discount-info {
        line-height: 25px;
        display: flex;
        justify-content: space-between;
      }

      .pay-type {
        display: flex;
        justify-content: flex-end;

        > span {
          margin: 0 5px;
          font-size: 12px;
          color: #333333;
        }

        span:nth-last-child(1) {
          margin-right: 0;
        }
      }

      .level-line {
        border-top: 1px dashed #EFEFF4;
        margin: 10px 0 10px;
      }
    }

    .card-detail:last-child {
      .level-line {
        display: none;
      }
    }
  }

  .upgraded-card-name {
    display: flex;
    flex-wrap: nowrap;
    font-size: 12px;
    .icon {
      color: #75C74F;
    }
    div {
      color: #333;
    }
    .some-other {
      margin-left:5px; 
      width:48px;
    }
    .last-card-name {
      flex: 1;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>
