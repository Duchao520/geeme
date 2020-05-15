 <template>
  <div class="cotainer">
    <!-- 标准版 -->
    <div class="standard">
      <div class="standard-title">
        <div class="standardIconTitle"></div>
        <div class="s-t-text">标准版</div>
      </div>
      <div class="standard-items">
        <!-- 活动红包 智能红包开发中 -->
        <!-- <div class="s-i-item" @click="redPacket(1)">
          <div class="standardIconItemOne"></div>
          <div class="s-right">
            <div class="s-name">智能红包</div>
            <div class="s-des">新人/老客/生日红包，智能自动派发</div>
          </div>
          <div class="icon-lock" v-if="currentEntry === 'shop'"><i class="icon iconfont icon-icon_ope_unlock"></i> </div>
        </div>

        <div class="s-i-item" @click="redPacket(0)">
          <div class="standardIconItemOne"></div>
          <div class="s-right">
            <div class="s-name">活动红包</div>
            <div class="s-des">多种红包模版可选，秒级派发</div>
          </div>
          <div class="icon-lock" v-if="currentEntry === 'shop'"><i class="icon iconfont icon-icon_ope_unlock"></i> </div>
        </div>-->

        <div class="s-i-item" @click="redPacket">
          <div v-if="currentEntry === 'shop'">
            <div class="sign-text">总部</div>
            <div class="sign"></div>
          </div>
          <div class="standardIconItemOne"></div>
          <div class="s-right">
            <div class="s-name">智能/活动红包</div>
            <div class="s-des">多种红包模版可选，智能自动派发</div>
          </div>
          <!-- <div class="icon-lock" v-if="currentEntry === 'shop'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>-->
        </div>

        <!-- 红包开发中 暂时用这个 v1 -->
        <!-- <div class="s-i-item" @click="redPacketa(1)">
          <div v-if="currentEntry === 'shop'">
            <div class="sign-text">总部</div>
            <div class="sign"></div>
          </div>
          <div class="standardIconItemOne"></div>
          <div class="s-right">
            <div class="s-name">智能红包</div>
            <div class="s-des">新人/老客/生日红包，智能自动派发</div>
          </div>
          <div class="icon-lock" v-if="currentEntry === 'shop'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>-->

        <!-- 功能未完善 v2 -->
        <!-- <div class="s-i-item" @click="redPacketa(0)">
          <div v-if="currentEntry === 'shop'">
            <div class="sign-text">总部</div>
            <div class="sign"></div>
          </div>
          <div class="s-i-item">
          <div class="standardIconItemOne"></div>
          <div class="s-right">
            <div class="s-name">活动红包</div>
            <div class="s-des">多种红包模版可选，秒级派发</div>
          </div>
        </div>-->
        <!-- <div class="icon-lock" v-if="currentEntry === 'shop'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
        </div>-->
        <!-- <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
        </div>-->

        <div class="s-i-item" @click="goToCoupon">
          <div v-if="currentEntry === 'brand'">
            <div class="sign-text">门店</div>
            <div class="sign"></div>
          </div>
          <div class="standardIconItemTwo"></div>
          <div class="s-right">
            <div class="s-name">优惠券</div>
            <div class="s-des">各种优惠券模版，傻瓜式操作</div>
          </div>
          <!-- <div class="icon-lock" v-if="currentEntry === 'brand'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>-->
        </div>

        <div class="s-i-item" @click="identityMemberPrice">
          <div v-if="currentEntry === 'shop'">
            <div class="sign-text">总部</div>
            <div class="sign"></div>
          </div>
          <div class="identityMemberPrice"></div>
          <div class="s-right">
            <div class="s-name">身份会员价</div>
            <div class="s-des">设定会员等级与权益，良性留客</div>
          </div>
        </div>
        
        <div class="s-i-item" @click="memberIntegral">
          <div v-if="currentEntry === 'shop'">
            <div class="sign-text">总部</div>
            <div class="sign"></div>
          </div>
          <div class="memberIntegral"></div>
          <div class="s-right">
            <div class="s-name">会员积分</div>
            <div class="s-des">多途径获取积分，可用于消费抵扣</div>
          </div>
        </div>

        <div class="s-i-item">
          <div class="sendShortMessages"></div>
          <div class="s-right">
            <div class="s-name">发短信</div>
            <div class="s-des">向指定人群群发短信</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

      </div>
    </div>
    <!-- 专业版 -->
    <div class="standard">
      <div class="standard-title">
        <div class="professionalTitle"></div>
        <div class="s-t-text">专业版</div>
      </div>
      <div class="standard-items">
        <div class="s-i-item" @click="newUserPrice">
          <div v-if="currentEntry === 'brand'">
            <div class="sign-text">门店</div>
            <div class="sign"></div>
          </div>
          <div class="professionalItemFour"></div>
          <div class="s-right">
            <div class="s-name">新人体验价</div>
            <div class="s-des">低门槛吸引新用户，拓客必备</div>
          </div>
          <!-- <div class="icon-lock" v-if="currentEntry === 'brand'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>-->
        </div>

        <div class="s-i-item">
          <div class="voucher"></div>
          <div class="s-right">
            <div class="s-name">代金券</div>
            <div class="s-des">特价抵扣现金券，提前收取现金</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item">
          <div class="professionalItemOne"></div>
          <div class="s-right">
            <div class="s-name">限时抢购</div>
            <div class="s-des">限时限量秒杀，快速收钱促销神器</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item" @click="groupBuy">
          <div v-if="currentEntry === 'brand'">
            <div class="sign-text">门店</div>
            <div class="sign"></div>
          </div>
          <div class="professionalItemTwo"></div>
          <div class="s-right">
            <div class="s-name">好物拼团</div>
            <div class="s-des">支持不同人数拼团，一键设置</div>
          </div>
          <!-- <div class="icon-lock" v-if="currentEntry === 'brand'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>-->
        </div>

        <div class="s-i-item">
          <div class="integralStore"></div>
          <div class="s-right">
            <div class="s-name">积分商城</div>
            <div class="s-des">积分当钱花，服务产品任意购</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <!-- <div class="s-i-item">
          <div class="professionalItemThree"></div>
          <div class="s-right">
            <div class="s-name">分享立减</div>
            <div class="s-des">吸引力标题模版，轻松提高点击率</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div> -->

        <div class="s-i-item">
          <div class="recommend"></div>
          <div class="s-right">
            <div class="s-name">推荐有礼</div>
            <div class="s-des">推荐好友购买，双方均可获赠好礼</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item">
          <div class="earnestSwell"></div>
          <div class="s-right">
            <div class="s-name">定金膨胀</div>
            <div class="s-des">定金数倍膨胀，提前锁定销量</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item">
          <div class="flagshipItemTwo"></div>
          <div class="s-right">
            <div class="s-name">老带新优惠</div>
            <div class="s-des">顾客裂变利器，简单易用效果好</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item">
          <div class="flagshipItemThree"></div>
          <div class="s-right">
            <div class="s-name">幸运抽奖</div>
            <div class="s-des">参与感的趣味抽奖，病毒式传播</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 旗舰版 -->
    <div class="standard">
      <div class="standard-title">
        <div class="flagshipTitle"></div>
        <div class="s-t-text">旗舰版</div>
      </div>
      <div class="standard-items">
        <div class="s-i-item" @click="seller">
          <div v-if="currentEntry === 'brand'">
            <div class="sign-text">门店</div>
            <div class="sign"></div>
          </div>
          <div class="flagshipItemSeller"></div>
          <div class="s-right">
            <div class="s-name">推广返佣</div>
            <div class="s-des">推广销售，支持二级分销返佣</div>
          </div>
          <!-- <div class="icon-lock" v-if="currentEntry === 'brand'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>-->
        </div>

        <div class="s-i-item" @click="giftCard">
          <div v-if="currentEntry === 'brand'">
            <div class="sign-text">门店</div>
            <div class="sign"></div>
          </div>
          <div class="flagshipItemgiftCard"></div>
          <div class="s-right">
            <div class="s-name">礼品卡</div>
            <div class="s-des">顾客分享给朋友，吸纳更多新客</div>
          </div>
          <!-- <div class="icon-lock" v-if="currentEntry === 'brand'">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>-->
        </div>

        <div class="s-i-item">
          <div class="enjoyYourself"></div>
          <div class="s-right">
            <div class="s-name">好友助力</div>
            <div class="s-des">邀请好友助力，增加活动曝光</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item" @click="shareholder">
          <div class="shareholder"></div>
          <div class="s-right">
            <div class="s-name">股东分红</div>
            <div class="s-des">让顾客成为股东，轻松赚钱</div>
          </div>
        </div>

        <div class="s-i-item">
          <div class="staffMoney"></div>
          <div class="s-right">
            <div class="s-name">员工分红</div>
            <div class="s-des">员工成交，长期参与利润分红</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <!-- <div class="s-i-item">
          <div class="flagshipItemOne"></div>
          <div class="s-right">
            <div class="s-name">新人专享</div>
            <div class="s-des">特定商品加新人标签，拓客神器</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div>

        <div class="s-i-item">
          <div class="flagshipItemTwo"></div>
          <div class="s-right">
            <div class="s-name">老带新优惠</div>
            <div class="s-des">顾客裂变利器，简单易用效果好</div>
          </div>
          <div class="icon-lock">
            <i class="icon iconfont icon-icon_ope_unlock"></i>
          </div>
        </div> -->

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { types } from "util";
export default {
  data() {
    return {};
  },
  methods: {
    // 红包 - 标准版
    redPacketa(type) {
      if (this.currentEntry === "brand") {
        let url = !!type
          ? "/brand-inner/market/market-list/red-packet"
          : "/brand-inner/market/market-list/activity-red-packet";
        this.$router.push(url);
      } else {
        this.$message({ type: "error", message: "该业务请前往总部管理台操作" });
      }
    },
    redPacket() {
      if (this.currentEntry === "brand") {
        let url = "/brand-inner/market/market-list/activity-red-packet";
        this.$router.push(url);
      } else {
        this.$message({ type: "error", message: "该业务请前往总部管理台操作" });
      }
    },
    // 团购 - 专业版校验待开发
    groupBuy() {
      if (process.env.NODE_ENV === "release") return false; // 上线删除
      if (this.currentEntry === "shop") {
        this.$router.push("/shop-inner/market/market-list/group-buying");
      } else {
        this.$message({ type: "error", message: "该业务请前往门店管理台操作" });
      }
    },
    // 新人体验价
    newUserPrice() {
      if (this.currentEntry === "shop") {
        this.$router.push("/shop-inner/market/market-list/new-user-price");
      } else {
        this.$message({ type: "error", message: "该业务请前往门店管理台操作" });
      }
    },
    // 推广返佣
    seller() {
      if (this.currentEntry === "shop") {
        this.$router.push(
          "/shop-inner/market/market-list/promotion-commission"
        );
      } else {
        this.$message({ type: "error", message: "该业务请前往门店管理台操作" });
      }
    },
    // 礼品卡
    giftCard() {
      if (this.currentEntry === "shop") {
        this.$router.push("/shop-inner/market/market-list/gift-vip-card");
      } else {
        this.$message({ type: "error", message: "该业务请前往门店管理台操作" });
      }
    },
    // 股东分红
    shareholder() {
      if (this.currentEntry === "shop") {
        this.$router.push("/shop-inner/market/market-list/shareholder-profit");
      } else {
        this.$router.push("/brand-inner/market/market-list/shareholder-profit");
      }
    },
    // 优惠券
    goToCoupon() {
      if (this.currentEntry === "shop") {
        this.$router.push("/shop-inner/market/market-list/coupon-index");
      } else {
        this.$message({ type: "error", message: "该业务请前往门店管理台操作" });
      }
    },
    // 身份会员价
    identityMemberPrice() {
      if (this.currentEntry === "shop") {
        this.$message({ type: "error", message: "该业务请前往总部管理台操作" });
      } else {
        this.$router.push("/brand-inner/setting/member-set/member-level");
      }
    },
    // 会员积分
    memberIntegral() {
      if (this.currentEntry === "shop") {
        this.$message({ type: "error", message: "该业务请前往总部管理台操作" });
      } else {
        this.$router.push("/brand-inner/setting/member-set/member-points");
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>

 <style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.cotainer {
  width: 100%;
  height: auto;
  padding-top: 42px;
  .standard {
    width: 100%;
    height: auto;
    margin-bottom: 30px;
    .standard-title {
      height: 28px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      margin-bottom: 13px;
      .s-t-icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        border-radius: 6px;
      }
      .s-t-text {
        color: #3a3a3a;
        font-size: 20px;
        line-height: 24px;
      }
    }
    .standard-items {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .s-i-item {
        cursor: pointer;
        position: relative;
        width: 330px;
        height: 100px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
        border-radius: 5px;
        margin-right: 15px;
        margin-bottom: 15px;
        padding: 15px 5px 15px 15px;
        display: flex;
        position: relative;
        flex-wrap: nowrap;
        justify-content: flex-start;
        .sign-text {
          position: absolute;
          top: 0;
          right: 15px;
          width: 50px;
          height: 22px;
          font-size: 15px;
          line-height: 25px;
          text-align: center;
          background-color: #f52d56;
          color: #fff;
        }
        .sign {
          // background-color: #f52d56;
          position: absolute;
          top: 22px;
          right: 15px;
          width: 0;
          height: 0;
          border-width: 0px 25px 10px;
          border-style: none solid solid;
          border-color: transparent transparent #f52d56;
          transform: rotate(180deg);
        }
        .s-left {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          margin-right: 10px;
        }
        .s-right {
          padding-top: 15px;
          .s-name {
            color: #3a3a3a;
            font-size: 18px;
            line-height: 25px;
            margin-bottom: 3px;
          }
          .s-des {
            color: #a9a9a9;
            font-size: 14px;
          }
        }
        .icon-lock {
          position: absolute;
          bottom: 5px;
          right: 5px;
          display: none;
          color: #a9a9a9;
        }
        &:hover {
          .icon-lock {
            display: block;
          }
        }
      }
    }
  }
}

.standardIconTitle {
  @extend .s-t-icon;
  background-color: #e6333f;
  background: url("../../../static/images/marketcenter/icon_marketing_standard.png")
    no-repeat center center/100% auto;
  background-size: 34px 34px;
  background-position-x: -6px;
  background-position-y: -3px;
}
.standardIconItemOne {
  @extend .s-left;
  background-color: rgba(255, 109, 97, 1);
  background: url("../../assets/img/icon_marketing01.png") no-repeat center
    center/100% auto;
}
.standardIconItemTwo {
  @extend .s-left;
  background-color: #63cff5;
  background: url("../../assets/img/icon_marketing02.png") no-repeat center
    center/100% auto;
}

.professionalTitle {
  @extend .s-t-icon;
  background-color: #e6333f;
  background: url("../../../static/images/marketcenter/icon_marketing_profession.png")
    no-repeat center center/100% auto;
  background-size: 34px 34px;
  background-position-x: -6px;
  background-position-y: -3px;
}
.professionalItemOne {
  @extend .s-left;
  background-color: #fcb322;
  background: url("../../assets/img/icon_marketing03.png") no-repeat center
    center/100% auto;
}
.professionalItemTwo {
  @extend .s-left;
  background-color: #63cff5;
  background: url("../../assets/img/icon_marketing04.png") no-repeat center
    center/100% auto;
}
.professionalItemThree {
  @extend .s-left;
  background-color: #4ad0c7;
  background: url("../../assets/img/icon_marketing05.png") no-repeat center
    center/100% auto;
}
.professionalItemFour {
  @extend .s-left;
  background-color: #8f5bff;
  background: url("../../assets/img/icon_marketing09.png") no-repeat center
    center/100% auto;
}

.flagshipTitle {
  @extend .s-t-icon;
  background-color: #e6333f;
  background: url("../../../static/images/marketcenter/icon_marketing_flagship.png")
    no-repeat center center/100% auto;
  background-size: 34px 34px;
  background-position-x: -6px;
  background-position-y: -3px;
}
.flagshipItemSeller {
  @extend .s-left;
  background-color: #63cff5;
  background: url("../../assets/img/icon_marketing10.png") no-repeat center
    center/100% auto;
}

.flagshipItemgiftCard {
  @extend .s-left;
  background-color: #63cff5;
  background: url("../../assets/img/icon_marketing11.png") no-repeat center
    center/100% auto;
}

.flagshipItemShareholder {
  @extend .s-left;
  background-color: #63cff5;
  background: url("../../assets/img/icon_marketing24.png") no-repeat center
    center/100% auto;
}

.flagshipItemOne {
  @extend .s-left;
  background-color: #63cff5;
  background: url("../../assets/img/icon_marketing06.png") no-repeat center
    center/100% auto;
}
.flagshipItemTwo {
  @extend .s-left;
  background-color: #80ce59;
  background: url("../../assets/img/icon_marketing07.png") no-repeat center
    center/100% auto;
}
.shareholder {
  @extend .s-left;
  background-color: #8F5BFF;
  background: url("../../assets/img/icon_marketing24.png") no-repeat center
    center/100% auto;
}
.flagshipItemThree {
  @extend .s-left;
  background-color: #fcb322;
  background: url("../../assets/img/icon_marketing08.png") no-repeat center
    center/100% auto;
}

.identityMemberPrice {
  @extend .s-left;
  background-color: #63CFF5;
  background: url("../../assets/img/icon_marketing14.png") no-repeat center
    center/100% auto;
}

.memberIntegral {
  @extend .s-left;
  background-color: #8F5BFF;
  background: url("../../assets/img/icon_marketing13.png") no-repeat center
    center/100% auto;
}

.sendShortMessages {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing16.png") no-repeat center
    center/100% auto;
}

.voucher {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing12.png") no-repeat center
    center/100% auto;
}

.integralStore {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing15.png") no-repeat center
    center/100% auto;
}

.recommend {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing05.png") no-repeat center
    center/100% auto;
}

.earnestSwell {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing17.png") no-repeat center
    center/100% auto;
}

.enjoyYourself {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing23.png") no-repeat center
    center/100% auto;
}

.staffMoney {
  @extend .s-left;
  background-color: #80CE59;
  background: url("../../assets/img/icon_marketing25.png") no-repeat center
    center/100% auto;
}
</style>
