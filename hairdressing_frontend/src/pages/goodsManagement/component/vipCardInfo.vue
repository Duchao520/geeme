<template>
  <div class="vip-card-info">
    <div v-if="cacheMaxId > cardKindId" class="history-card-info">
      <span>
        当前显示的是创建于 {{historyModifyTime}} 的历史卡项，查看
        <span class="blue-text">最新卡项</span> 请点击:
      </span>
      <el-button plain class="plain_blue_btn" size="mini" @click="getNewestCardDetailsInfo">最新卡项</el-button>
    </div>
    <!-- 左侧 -->
    <div class="normal-info text-for-copy">
      <div class="card-smallInfo">
        <div class="card-detail">
          <p>{{info.cardName}}</p>
          <p class="card-type">{{ info.giftCard ? '礼品卡' : formatCardType(info.cardType)}}</p>
        </div>
        <img :src="formatPicImage(brandLogo, 'style', 70, 'brandLogo')" class="brand-logo" />
        <img class="card-cover" :src="formatPicImage(info.cardCover, 'style', 70, 'brandLogo')" />
        <div class="card-price-one"  v-if="info.cardType !== 1">
          <p>￥{{info.cardPrice}}</p>
        </div>
        <div class="card-price-two"  v-if="info.cardType === 1">
          <p>￥{{info.cardFirstRechargeNum + info.cardGiftNum}}</p>
          <p><span>含赠送金：</span>￥{{info.cardGiftNum}}</p>
        </div>
      </div>
      <div class="info-item">
        <div class="item-label">卡项名称：</div>
        <div class="item-value">{{info.cardName}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">卡项类型：</div>
        <div class="item-value">{{  info.giftCard ? '礼品卡' : formatCardType(info.cardType) }}</div>
      </div>
      <div class="info-item" v-if="info.cardType === 1">
        <div class="item-label">首次充值：</div>
        <div class="item-value">￥{{info.cardFirstRechargeNum}}</div>
      </div>
      <div class="info-item" v-if="info.cardType === 1">
        <div class="item-label">赠送金：</div>
        <div class="item-value">￥{{info.cardGiftNum}}</div>
      </div>
      <div class="info-item" v-if="info.cardType !== 1">
        <div class="item-label">售价：</div>
        <div class="item-value">￥{{info.cardPrice}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">状态：</div>
        <div class="item-value">{{formatStatus(info.upperStatus)}}</div>
        <span style="margin-left: 4px;">{{info.upperStatus === 1 ? '(' + info.upperTime + ')': ''}}</span>
      </div>
      <div class="info-item">
        <div class="item-label">适用门店：</div>
        <template v-if="info.cardType < 2">
          <div class="item-value">{{formatStoreStrategy(info.suitStoreStrategy)}}</div>
          <span
            class="suit-store-details"
            v-if="info.suitStoreStrategy === 2"
            @click="showSuitShops"
          >详情</span>
        </template>
        <template v-else>
          <div class="item-value">{{info.suitStore.storeIdList[0].storeName}}</div>
        </template>
      </div>
      <div class="info-item">
        <div class="item-label">网店展示：</div>
        <div class="item-value">{{formatOnlineShow(info.onlineStoreShow)}}</div>
      </div>
      <br />
      <div class="info-item">
        <div class="item-label">创建/修改人：</div>
        <div class="item-value">{{info.userName}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">创建/修改时间：</div>
        <div class="item-value">{{info.modifyTime}}</div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="card-rights text-for-copy">
      <!-- 身份卡、储值卡 -->
      <div class="rights-content" v-if="info.cardType < 2">
        <div class="right-title">折扣权益</div>
        <!-- v-if -->
        <rights-table
          v-if="showDiscountStrategy('Service')"
          :list="info.partServiceDiscountStrategy"
        ></rights-table>
        <!-- v-if -->
        <rights-table
          v-if="showDiscountStrategy('Product')"
          :list="info.partProductDiscountStrategy"
        ></rights-table>
        <!-- 所有服务折扣 -->
        <div
          class="all-discount"
          v-if="info.cardDiscountStrategy === 1"
        >所有服务{{info.cardServiceDiscount}}折</div>
        <!-- 所有产品折扣 -->
        <div
          class="all-discount"
          v-if="info.cardDiscountStrategy === 1"
        >所有产品{{info.cardProductDiscount}}折</div>

        <div v-else></div>
      </div>

      <!-- 次卡、时间卡 -->
      <div class="rights-content" v-if="info.cardType > 1">
        <div class="right-title">享受权益</div>
        <rights-table-time-card
          :list="info.listServiceCountInfo"
          :cardType="info.cardType"
          :totalLimit="info.totalCountLimit"
        />
      </div>
      <!-- 次卡、时间卡 -->
      <div
        class="rights-content"
        v-if="info.cardType > 1 && (info.bindProductInfoList || []).length"
      >
        <div class="right-title">
          绑定产品
          <el-checkbox v-model="info.isOverSell" disabled>库存不足时允许销售（库存减为负数）</el-checkbox>
        </div>
        <el-table :data="info.bindProductInfoList">
          <el-table-column label="产品名称" show-overflow-tooltip prop="productName"></el-table-column>
          <el-table-column label="规格" prop="productSpecificationName"></el-table-column>
          <el-table-column label="专柜价" prop="shopPrice"></el-table-column>
          <el-table-column label="数量(件)" prop="count"></el-table-column>
        </el-table>
      </div>
      <!-- 续卡规则 -->
      <div class="rights-content" v-if="info.cardType < 2">
        <div class="right-title">续卡规则</div>
        <ul class="card-rule" v-if="showCardRule">
          <li
            v-for="item in info.listCardRenewalRule"
            :key="JSON.stringify(item)"
          >{{formatRuleLine(info, item)}}</li>
        </ul>
      </div>

      <!-- 会员卡说明 -->
      <div class="rights-content">
        <div class="right-title">使用说明</div>
        <ul class="card-rule" v-if="instruction.length > 0">
          <li v-for="item in instruction" :key="JSON.stringify(item)">{{item}}</li>
        </ul>
      </div>
    </div>
    <el-dialog title="适用门店" :visible.sync="showShopsDialog">
      <el-table max-height="600" v-if="info.suitStore" :data="info.suitStore.storeIdList">
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import * as api from "@/assets/js/interface";
import rightsTable from "./rightsTable";
import rightsTableTimeCard from "./rightsTable_timeCard";
import * as utils from "@/assets/js/utils";
export default {
  components: {
    "rights-table": rightsTable,
    rightsTableTimeCard
  },
  props: {
    id: Number,
    cacheMaxId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage,
      info: { suitStore: { storeIdList: [{ storeName: "" }] } },
      cardKindId: this.id,
      showShopsDialog: false, // 适用门店详情
      historyModifyTime: null // 历史卡项的修改时间
    };
  },
  computed: {
    instruction() {
      if (!this.info.cardInstruction) {
        return [];
      }
      return this.info.cardInstruction.split("\n");
    },
    // 是否展示续卡规则
    showCardRule() {
      const rule = this.info.listCardRenewalRule;
      return (
        rule instanceof Array &&
        rule.length > 0 &&
        (!this.info.validPermanent || this.info.cardType === 1)
      );
    },
    /* 当前品牌Logo */
    brandLogo() {
      return this.$store.state.manage.currentInfo.brandLogo;
    }
  },
  watch: {
    id(val) {
      this.cardKindId = val;
      this.getCardSnapshotDetail();
    }
  },
  mounted() {
    this.getCardDetail();
  },
  methods: {
    // 是否展示折扣权益
    showDiscountStrategy(type) {
      const strategy = this.info[`part${type}DiscountStrategy`];
      return (
        this.info.cardDiscountStrategy === 2 &&
        strategy instanceof Array &&
        strategy.length > 0
      );
    },
    getCardDetail() {
      axios
        .get(`${api.getCardKindDetailInfo.URL}/${this.cardKindId}`)
        .then(res => {
          this.info = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCardSnapshotDetail() {
      axios
        .get(`${api.getCardKindSnapshotDetailInfo.URL}/${this.cardKindId}`)
        .then(res => {
          console.log(res)
          this.info = res;
          this.historyModifyTime = res.modifyTime;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getNewestCardDetailsInfo() {
      this.$emit("refreshTabs", this.cacheMaxId);
    },
    showSuitShops() {
      this.showShopsDialog = true;
    },
    /* format 会员卡类别 */
    formatCardType(type) {
      switch (type) {
        case 0:
          return "身份卡";
        case 1:
          return "储值卡";
        case 2:
          return "次卡";
        case 3:
          return "时间卡";
      }
    },
    /* format 金额*/
    /* formatPrice(num) {
      switch (num) {
        case "0":
          return `￥${num}`;
        case "1":
          return `￥${num}`;
      }
    }, */
    formatStatus(status) {
      switch (status) {
        case 0:
          return "已上架";
        case 1:
          return "指定时间上架";
        case 2:
          return "已下架";
      }
    },
    formatStoreStrategy(type) {
      switch (type) {
        case 0:
          return "所有门店";
        case 1:
          return "所有直营店";
        case 2:
          return "指定门店";
      }
    },
    formatOnlineShow(bool) {
      let result = bool ? "展示" : "隐藏";
      return result;
    },
    formatRuleLine(info, item) {
      if (info.cardType === 0) {
        let unit = "";
        switch (item.validUnit) {
          case "year":
            unit = "年";
            break;
          case "month":
            unit = "月";
            break;
          case "day":
            unit = "日";
            break;
        }
        return `充${item.cardPrice}续期${item.validNum}${unit}`;
      } else if (info.cardType === 1) {
        return `充${item.cardRechargeNum}赠${item.cardGiftNum}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vip-card-info {
  padding: 50px 0 30px 41px;
  position: relative;
  display: flex;
  .history-card-info {
    position: absolute;
    top: 10px;
    width: calc(100% - 84px);
    font-size: 14px;
    .blue-text {
      color: #58c9f3;
    }
  }
  .normal-info {
    margin: 0 195px 0 0;
    position: relative;
    .card-smallInfo {
      display: inline-block;
      position: relative;
      .card-detail {
        position: absolute;
        color: #fff;
        top: 12px;
        left: 45px;
        font-size: 14px;
        .card-type {
          display: inline-block;
          margin-top: 2px;
          padding:0 5px;
          border: 1px solid #fff;
          border-radius: 10px;
        }
      }
      .card-price-one {
        position: absolute;
        bottom: 30px;
        right: 15px;
        color: #fff;
        font-size: 20px;
        font-weight: 700;
      }
      .card-price-two {
        position: absolute;
        bottom: 38px;
        right: 12px;
        color: #fff;
        font-size: 20px;
        font-weight: 700;
        text-align: right;
        :nth-child(2) {
          font-size: 12px;
          font-weight: normal;
        }
      }
      .brand-logo {
        position: absolute;
        top: 12px;
        left: 10px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
      .card-cover {
        width: 230px;
        height: 145px;
        margin: 0 0 21px 0;
      }
    }
    .info-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin: 0 0 10px 0;
      .item-label {
        width: 110px;
        color: #999999;
      }
      .info-value {
        color: #333333;
      }
    }
  }

  .card-rights {
    .rights-content {
      margin: 0 0 28px 0;
      .right-title {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        margin: 0 0 10px 0;
      }
      ul.card-rule {
        margin-left: 14px;
        font-size: 14px;
        color: #333333;
        li {
          position: relative;
          &::before {
            content: "";
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background: #333333;
            position: absolute;
            left: -9px;
            top: 7px;
          }
        }
      }
      .all-discount {
        position: relative;
        margin: 0 0 0 10px;
        &::before {
          content: "";
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background: #333333;
          position: absolute;
          left: -9px;
          top: 7px;
        }
      }
    }
  }
  .suit-store-details {
    color: #58c9f3;
    margin-left: 4px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>