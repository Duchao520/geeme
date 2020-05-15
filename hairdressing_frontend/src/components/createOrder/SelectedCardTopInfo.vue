<template>
  <div class="card-item-root" v-loading="dialogLoading">
    <!-- 新购时的身份卡和储值卡的显示 -->
    <div class="card-table-box" v-if="showInfo(0,[0,1])">
      <div class="box-item name">
        <p class="box-item-top">
          卡项名称
          <span class="img-tag" v-if="cardInfo.operateType === 0">开</span>
          <span class="img-tag renewal" v-if="cardInfo.operateType === 1">续</span>
          <span class="img-tag free" v-if="cardInfo.operateType === 2">自</span>
        </p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
          <p class="card-no" v-if="cardInfo.operateType!==1">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p
          class="box-item-bottom"
          style="color:#FF6D61"
        >￥{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item add" v-if="cardInfo.cardType===1">
        <p class="box-item-top">充值金</p>
        <!--cardFirstRechargeNum：新购时的价格  -->
        <p class="box-item-bottom">{{cardInfo.cardFirstRechargeNum}}</p>
        <!-- <p class="box-item-bottom">
          <number-input v-model="cardInfo.chargeMoney" @input="changePrepaidChargeMoney"></number-input>
        </p> -->
      </div>
      <div class="box-item give" v-if="cardInfo.cardType===1">
        <p class="box-item-top">赠送金</p>
        <p class="box-item-bottom">{{cardInfo.cardGiftNum}}</p>
        <!-- <p class="box-item-bottom">
          <number-input v-model="cardInfo.giftMoney" @input="changePrepaidGiftMoney"></number-input>
        </p> -->
      </div>
      <div class="box-item" v-if="cardInfo.cardType===0">
        <p class="box-item-top">有效期限</p>
        <p class="box-item-bottom">
          <span v-if="cardInfo.validPermanent">永久有效</span>
          <span
            v-else
          >{{cardTime}}{{cardInfo.validUnit==='month'?'个月':(cardInfo.validUnit==='year'?'年':'天')}}</span>
        </p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!-- 新购的时候时间卡的显示 -->
    <div class="card-table-box" v-if="showInfo(0,[3])">
      <div class="box-item name">
        <p class="box-item-top">
          卡项名称
          <span class="img-tag" v-if="cardInfo.operateType === 0">开</span>
          <span class="img-tag renewal" v-if="cardInfo.operateType === 1">续</span>
          <span class="img-tag free" v-if="cardInfo.operateType === 2">自</span>
        </p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
          <p class="card-no" v-if="cardInfo.operateType!==1">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p
          class="box-item-bottom"
          style="color:#FF6D61"
        >￥{{cardInfo.cardPrice || cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item">
        <p class="box-item-top">有效期限</p>
        <p class="box-item-bottom">
          <span v-if="cardInfo.validPermanent">永久有效</span>
          <span
            v-else
          >{{cardTime}}{{cardInfo.validUnit==='month'?'个月':(cardInfo.validUnit==='year'?'年':'天')}}</span>
        </p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!-- 新购的时候次卡的显示 -->
    <div class="card-table-box" v-if="showInfo(0,[2])">
      <div class="box-item name">
        <p class="box-item-top">
          卡项名称
          <span class="img-tag" v-if="cardInfo.operateType === 0">开</span>
          <span class="img-tag renewal" v-if="cardInfo.operateType === 1">续</span>
          <span class="img-tag free" v-if="cardInfo.operateType === 2">自</span>
        </p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
          <p class="card-no" v-if="cardInfo.operateType!==1">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p class="box-item-bottom" style="color:#FF6D61">￥{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item">
        <p class="box-item-top">次数</p>
        <p class="box-item-bottom">{{countLimit}}次</p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom">
          <i
            class="icon iconfont icon-icon_operate_edit"
            style="color: #58C9F3;"
            @click="editCountCard"
          ></i>
        </p>
      </div>
    </div>
    <!-- 续卡时的身份卡和储值卡的显示 -->
    <div class="card-table-box" v-if="showInfo(1,[0,1])">
      <div class="box-item name">
        <p class="box-item-top">
          卡项名称
          <span class="img-tag" v-if="cardInfo.operateType === 0">开</span>
          <span class="img-tag renewal" v-if="cardInfo.operateType === 1">续</span>
          <span class="img-tag free" v-if="cardInfo.operateType === 2">自</span>
        </p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
          <p class="card-no" v-if="cardInfo.operateType!==1">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </p>
        </div>
      </div>
      <div class="box-item add" v-if="cardInfo.cardType===1">
        <p class="box-item-top">充值金</p>
        <p class="box-item-bottom">{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item give" v-if="cardInfo.cardType===1">
        <p class="box-item-top">赠送金</p>
        <p class="box-item-bottom">{{cardInfo.giftMoney}}</p>
      </div>
      <div class="box-item add">
        <p class="box-item-top">期限延长</p>
        <p class="box-item-bottom">{{cardInfo.validPermanent?'永久有效': cardInfo.extendTime}}</p>
      </div>
      <div class="box-item add" v-if="cardInfo.cardType===0">
        <p class="box-item-top">续卡费用</p>
        <p class="box-item-bottom">{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!--自由卡之储值卡 -->
    <div class="card-table-box" v-if="showInfo(2,[1])">
      <div class="box-item name">
        <p class="box-item-top">
          卡项名称
          <span class="img-tag" v-if="cardInfo.operateType === 0">开</span>
          <span class="img-tag renewal" v-if="cardInfo.operateType === 1">续</span>
          <span class="img-tag free" v-if="cardInfo.operateType === 2">自</span>
        </p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
          <p class="card-no" v-if="cardInfo.operateType!==1">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p class="box-item-bottom" style="color:#FF6D61">￥{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item add">
        <p class="box-item-top">充值金</p>
        <p class="box-item-bottom">
          <number-input v-model="cardInfo.chargeMoney" @input="changePrepaidChargeMoney"></number-input>
        </p>
      </div>
      <div class="box-item give">
        <p class="box-item-top">赠送金</p>
        <p class="box-item-bottom">
          <number-input v-model="cardInfo.giftMoney"></number-input>
        </p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!--自由卡之次卡v-if="showInfo(2,[2])"-->
    <div class="card-table-box" v-if="showInfo(2,[2])">
      <div class="box-item name">
        <p class="box-item-top">
          卡项名称
          <span class="img-tag" v-if="cardInfo.operateType === 0">开</span>
          <span class="img-tag renewal" v-if="cardInfo.operateType === 1">续</span>
          <span class="img-tag free" v-if="cardInfo.operateType === 2">自</span>
        </p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
          <p class="card-no" v-if="cardInfo.operateType!==1">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p class="box-item-bottom" style="color:#FF6D61">￥{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item">
        <p class="box-item-top">次数</p>
        <p class="box-item-bottom">{{countLimit}}次</p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom">
          <i
            class="icon iconfont icon-icon_operate_edit"
            style="color: #58C9F3;"
            @click="editCountCard"
          ></i>
        </p>
      </div>
    </div>

    <!-- 次卡自由卡的弹窗 -->
    <!-- <free-count-card
      ref="freeCountCard"
      :visible="freeCountCardVisible"
      :cardInfo="cardInfo"
      @close="freeCountCardVisible = false"
      @modifyCountCard="modifyCountCard"
    ></free-count-card> -->

    <!-- 次卡自由开卡 -v2- 动态修改权益 -->
    <newFreeCountCard
      :dialogVisible="freeCountCardVisible"
      v-if="freeCountCardVisible"
      :suberCardInfo="suberCardInfo"
      @close="freeCountCardVisible = false"
      @suberTableData="modifyCountCard"
      :index="index"
    />
  </div>
</template>
<script>
/**
 * 会员卡的类型:      0–身份卡，1–储值卡，2–次卡，3–时间卡
 * operateType:      0-开卡，1-续期，2-自由卡
 */
import FreeCountCard from "@/components/createOrder/rightListGoods/FreeCountCard";
import newFreeCountCard from "@/components/createOrder/rightListGoods/freeCountCard_v2";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";

export default {
  components: { FreeCountCard, newFreeCountCard },
  props: {
    cardInfo: Object,
    index: Number
  },
  data() {
    return {
      freeCountCardVisible: false,
      suberCardInfo: {}, // v2
      // 会员卡时间
      cardTime: "",
      dialogLoading: false,
      storeRemarkCardNo: "" //统一备注卡号
    };
  },
  created() {
    this.storeRemarkCardNo = this.cardInfo.storeRemarkCardNo;
  },
  computed: {
    countLimit() {
      //支持一种服务 || 支持多种服务，分别设定 || 支持多种服务，设定总数
      let list = this.cardInfo.listServiceCountInfo || [];
      let listCountLimit = list.map(item => item.countLimit); //支持多种服务，分别设定  或： 单种服务
      let separatelySetTotal = 0;
      listCountLimit.forEach(item => {
        separatelySetTotal += item;
      }); //这里为什么我不用reduce呢？因为数组为[]的时候reduce会报错
      let allSetTotal = this.cardInfo.totalCountLimit; //支持多种服务，设定总数
      // let allSetTotal = this.cardInfo.countLimit; //支持多种服务，设定总数
      return allSetTotal > 0 ? allSetTotal : separatelySetTotal;
    },
    billInfo() {
      return this.$store.state.bill;
    }
  },
  methods: {
    ...mapActions(["deleteSelectedCards", "setSelectedCardsValue"]),
    deleteGoods(detail, index) {
      // 将该卡在vuex删除
      // 需要把已经删除的过滤掉
      if (detail.id) {
        this.setSelectedCardsValue({ deleted: true, index: index });
        this.$forceUpdate();
      } else {
        this.deleteSelectedCards(index);
      }
      this.$emit("deleteGoods", detail, index);
    },
    showInfo(operateType, cardType) {
      /*
       * operateType : 卡的操作： 0-开卡，1-续期，自由卡-2
       * */
      let cardInfo = this.cardInfo;
      return (
        cardType.includes(cardInfo.cardType) &&
        operateType === cardInfo.operateType
      );
    },
    async editCountCard() {
      let cardInfo = JSON.parse(JSON.stringify(this.cardInfo));
      this.dialogLoading = true; 
      // 在这里为自由卡开次卡的开项信息配置门店价
      if (cardInfo.cardType == 2) {
        let serviceIds = cardInfo.listServiceCountInfo.map(
          i => i.serviceSpecificationId
        );
        try {
          const res = await axios.post(
            "/getServiceSpecificationInfoListByIds",
            {
              idList: serviceIds
            }
          );
          res.serviceInfoSpecificationByIdsList.forEach(item => {
            cardInfo.listServiceCountInfo.some(i => {
              if (i.serviceSpecificationId == item.id) {
                i.shopPrice = item.shopPrice;
              }
            });
          });
        } finally {
          this.dialogLoading = false;
        }
      }
      // - v1 -
      // this.$refs.freeCountCard.cardInfo = {
      //   ...cardInfo,
      //   countLimit: cardInfo.countLimit > 0 ? cardInfo.countLimit : null
      // };
      // if (cardInfo.countLimit > 0) {
      //   this.$refs.freeCountCard.numberSharing = true
      // }
      // - v2 -
      this.suberCardInfo = {
        ...cardInfo,
        totalCountLimit:
          cardInfo.totalCountLimit > 0 ? cardInfo.totalCountLimit : null,
        countLimitStatus: cardInfo.totalCountLimit > 0
      };
      this.freeCountCardVisible = true;
    },
    // - 子组件数据变化 -
    modifyCountCard(data) {
      if (data.operateType == 2) {
        this.setSelectedCardsValue({
          operateType: 2,
          index: this.index
        });
      }
      for (let key in data) {
        this.setSelectedCardsValue({ [key]: data[key], index: this.index });
      }
      this.setSelectedCardsValue({
        memberPrice: data.chargeMoney,
        index: this.index
      });
      // 自由卡不涉及门店优惠
      this.setSelectedCardsValue({
        tempFinalPrice: data.chargeMoney,
        index: this.index
      });

      this.freeCountCardVisible = false;
    },
    // 自由卡储值卡价格变化事件
    changePrepaidChargeMoney(num) {
      this.setSelectedCardsValue({
          chargeMoney: num,
          index: this.index
        });
        // 变为自由卡
        this.setSelectedCardsValue({
          operateType: 2,
          index: this.index
        });
        // 售价跟随变化
        this.setSelectedCardsValue({
          tempFinalPrice: num,
          index: this.index
        });
    },
    changePrepaidGiftMoney(num) {
      this.setSelectedCardsValue({
          giftMoney: num,
          index: this.index
        });
        // 变为自由卡
        this.setSelectedCardsValue({
          operateType: 2,
          index: this.index
        });
    },
  },
  mounted() {
    // 避免改变原来数组用新的数据展示会员卡卡时间
    this.cardTime =
      this.cardInfo.validUsedNum > 0
        ? "使用后" + this.cardInfo.validUsedNum
        : this.cardInfo.validNum;
  },
  watch: {
    storeRemarkCardNo: {
      handler: function(v, o) {
        this.setSelectedCardsValue({
          storeRemarkCardNo: v,
          index: this.index
        });
      },
      deep: true,
      immediate: true
    },
    // 储值卡开自由卡字段监听
    "cardInfo.giftMoney"(v, o) {
      if (this.cardInfo.cardType == 1) {
        console.log(1)
        this.setSelectedCardsValue({
          giftMoney: v,
          index: this.index
        });
        // 变为自由卡
        this.setSelectedCardsValue({
          operateType: 2,
          index: this.index
        });
      }
    },
    // 储值卡开自由卡字段监听
    "cardInfo.chargeMoney"(v, o) {
      if (this.cardInfo.cardType == 1) {
        this.setSelectedCardsValue({
          chargeMoney: v,
          index: this.index
        });
        // 变为自由卡
        this.setSelectedCardsValue({
          operateType: 2,
          index: this.index
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.card-item-root {
  .card-table-box {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    .box-item {
      flex: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .box-item-top {
        line-height: 30px;
        font-size: 12px;
        color: #999999;
        box-sizing: border-box;
        padding: 0 10px;
      }

      .box-item-bottom {
        flex: 1;
        font-size: 13px;
        min-height: 50px;
        box-sizing: border-box;
        padding: 5px;
        color: #333333;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        border-top: 1px solid #f0f1f4;

        flex-direction: column;

        /deep/ .el-input__inner {
          height: 32px;
          width: 90px;
        }
        /deep/ .number-root .el-input__inner {
          height: 32px;
          width: 60px;
        }

        .card-name {
          white-space: nowrap;
          width: 75px;
          margin-bottom: 4px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }

    .box-item.name {
      flex: 0 0 100px;
      overflow: hidden;
    }

    .box-item.price {
      flex: 1;
    }
    .box-item.add,
    .box-item.give {
      flex: 1;
    }

    .del {
      flex: 0 0 30px;
      text-align: right;
      i {
        cursor: pointer;
        transition: all 0.6s;
        line-height: 1;

        &:hover {
          color: #787878;
        }
      }
    }
  }
}
.img-tag {
  display: inline-block;
  background-color: #75c74f; /*开*/
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  &.renewal {
    background-color: #58c9f3; /*续*/
  }
  &.free {
    background-color: #fd9d6b; /*自由*/
  }
}
</style>
