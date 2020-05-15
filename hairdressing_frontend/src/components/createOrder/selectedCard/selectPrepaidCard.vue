<template>
  <div class="select-vip-card-root">
    <div class="selected-content">
      <p class="text-reminder">选择储值卡</p>
      <el-button
        class="text-already-selected"
        @click="getAvailableVipCards(true)"
        :loading="buttonLoading"
      >
        <span>
          {{selectedIdentityCardName}}
          <i class="el-icon-arrow-right"></i>
        </span>
      </el-button>
    </div>
      <!-- :modal-append-to-body="false" -->
    <el-dialog
      width="800px"
      append-to-body
      class="selected-content-dialog"
      :visible.sync="selectIdentityCardVisible"
      @close="selectIdentityCardVisible=false"
    >
      <p class="title" slot="title">选择会员卡</p>
      <div class="select-vip-card-content">
        <!-- <p class="should-pay-text">
          应付金额：
          <span>￥{{shouldPay||'0'}}</span>
        </p> -->
        <div class="identity-card-list">
          <owned-vip-card
            v-for="(card,index) in listIdentityGoodsCountInfo"
            :key="index"
            :cardInfo="card"
            :index="index"
            origin="card"
            v-model="vipCardId"
          ></owned-vip-card>
        </div>
      </div>
      <div slot="footer" class="select-identity-footer">
        <el-button class="cancel-button" @click="selectIdentityCardVisible = false">取消</el-button>
        <el-button class="confirm-button" @click="confirm">确认选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import OwnedVipCard from "@/components/createOrder/selectedCard/OwnedVipCard";
  import {mapActions, mapGetters, mapState} from "vuex";

  export default {
    components: {OwnedVipCard},
    props: {
      selectedGoodsList: Array,
      billDetail:Object
    },
    watch: {
      selectedGoodsList(newList) {
        if (newList.length !== 0 && this.alreadySelectedCard && this.isInCard) {
          this.getAvailableVipCards(false);
        }
      },
      // 这里操作不了， 不需要监听 只要重置客户存储的已选会员卡即可
      // - 如果客户信息更换， 需要重置会员卡信息
      // customerInfo: {
        //   handler: function(v, o) {
          //     // - 监听选中的客户信息变化，或者新增了客户
      //     if (o && v.id !== o.id) {
        //       this.getAvailableVipCards(false)
      //     }
      //   },
      //   deep: true,
      //   immediate: true
      // }
    },
    data() {
      return {
        selectIdentityCardVisible: false,
        buttonLoading: false,
        listIdentityGoodsCountInfo: [],
        vipCardId: null
      };
    },
    computed: {
      ...mapGetters(["selectedVipCardDiscountInfo", "alreadySelectedCard"]),
      // 这里操作不了， 不需要监听 只要重置客户存储的已选会员卡即可
      // ...mapState({
      //   customerInfo: state => state.bill.customerInfo, // 监听这个数据， 说明有选择操作
      // }),
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      billInfo() {
        return this.$store.state.bill;
      },
      selectedIdentityCardName() {
        return this.selectedVipCardDiscountInfo.cardName || "请选择";
      },
      shouldPay() {
        let identityCard = this.listIdentityGoodsCountInfo.filter(
          item => item.customerCardId === this.vipCardId
        )[0];
        return (identityCard && identityCard.finalTotalCharge) || null;
      },
      isInCard() {
        let sortGoodsType = this.billInfo.currentChooseTypeAndSortOneId
          .sortGoodsType;
        return sortGoodsType === "card" || sortGoodsType === "cardAdd";
      }
    },
    mounted() {
      this.initCardDiscount();
    },
    methods: {
      ...mapActions(["setSelectedVipCardId", "setAvailableVipCardList"]),
      confirm() {
        let selectedCardInfo = this.listIdentityGoodsCountInfo.filter(
          item => item.customerCardId === this.vipCardId
        )[0];
        this.setSelectedVipCardId(
          selectedCardInfo
            ? {
              type: selectedCardInfo.type,
              id: selectedCardInfo.customerCardId
            }
            : this.vipCardId
        );
        this.selectIdentityCardVisible = false;
      },
      initCardDiscount() {
        if (
          this.alreadySelectedCard &&
          this.selectedGoodsList &&
          this.selectedGoodsList.length > 0
        ) {
          this.getAvailableVipCards(false);
        }
      },
      getAvailableVipCards(showModel) {
        this.buttonLoading = true;
        let availableGoodsList = this.selectedGoodsList.filter(
          item => !item.deleted && !item.paymentStatus
        );
        let params = {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          customerId: this.billInfo.customerInfo.id,
          countCardInfoList: availableGoodsList
            // .filter(item => item.goodsType === "service")
            .map(item => {
              return {
                amount: item.num || 1,
                cardKindId: item.cardKindId,
                cardKindSnapshotId: item.cardKindSnapshotId,
                storePreference: item.storePreference || 0,
              };
            })
        };
        axios.post("/getPrePaidCardPayCardCountInfo", params).then(res => {
          /**
           * 打开弹窗：点击选择卡片的那次对卡的请求
           * 不打开弹窗：增减商品的请求
           * */
          this.selectIdentityCardVisible = showModel;
          this.buttonLoading = false;

          let cardList = (res.listCardPayGoodsCountInfo || [])
            .map(item => {
              return {...item, type: "prePaid"};
            })
          this.listIdentityGoodsCountInfo = cardList;
          this.setAvailableVipCardList(cardList);
          /*
           * 没有选择卡片
           * */
          if (!this.alreadySelectedCard) {
            let optimalVipCard = cardList.filter(item => item.canPay)[0];
            if (optimalVipCard) {
              this.setSelectedVipCardId({
                type: optimalVipCard.type,
                id: optimalVipCard.customerCardId
              });
            }
            this.vipCardId = (optimalVipCard || {}).customerCardId;
          } else {
            let cardId = null;
            let cardIdObj = this.billInfo.billCardInfo.selectedVipCardInfo;
            for (let i in cardIdObj) {
              if (cardIdObj[i]) {
                cardId = cardIdObj[i];
                break;
              }
            }
            this.vipCardId = cardId;
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  .selected-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 50px;
    font-size: 14px;
    border-top: 1px solid #f0f1f4;
    box-sizing: border-box;
    padding: 0 18px 0 20px;

    .text-reminder {
      color: #333333;
      font-weight: 900;
    }

    .text-already-selected {
      color: #999999;
      margin: 0;
      border: none;
      padding: 0;
    }
  }

  // .select-vip-card-root {
    /deep/ .el-dialog__header {
      padding: 0;

      .title {
        line-height: 56px;
        font-size: 18px;
        font-weight: 600;
        border-bottom: 1px solid #f0f1f4;
        padding-left: 30px;
      }
    }

    .selected-content-dialog {
      /deep/ .el-dialog__body {
        padding: 5px 30px;

        .select-vip-card-content {
          .should-pay-text {
            line-height: 40px;
            font-size: 14px;
            color: #999999;

            span {
              color: #333333;
            }
          }

          .identity-card-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            height: 390px;
            overflow-y: auto;
            @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));

            &:after {
              content: "";
              width: 230px;
            }
          }
        }
      }

      .select-identity-footer {
        .cancel-button {
          border-color: #c6c6c6;
          color: #666666;
        }

        .confirm-button {
          background: #58c9f3;
          border: none;
          color: #fff;

          &:hover {
            background: #53bee6;
          }

          &:active {
            background: #54b1d3;
          }
        }
      }
    }
  // }
</style>
