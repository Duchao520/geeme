<template>
  <el-dialog title="卡项详情" :visible="visible" :before-close="handleClose" width="960px">
    <div class="customer-card-details-box">
      <!-- 左侧 -->
      <div class="normal-info text-for-copy">
        <div class="card-smallInfo">
          <div class="card-detail">
            <p>{{info.cardName}}</p>
            <p class="card-type">{{info.giftCard ? '礼品卡' : formatCardType(info.cardType)}}</p>
          </div>
          <img :src="formatPicImage(brandLogo, 'style', 70, 'brandLogo')" class="brand-logo" />
          <img class="card-cover" :src="formatPicImage(info.cardCover, 'style', 70, 'brandLogo')" />
          <div class="card-price-one" v-if="info.cardType !== 1">
            <p><span style="font-weight: 400;font-size: 16px;">售价:</span>￥{{info.cardPrice}}</p>
          </div>
          <div class="card-price-two" v-if="info.cardType === 1">
            <p><span style="font-weight: 400;font-size: 16px;">余额:</span>￥{{(info.rechargeMoney + info.giftMoney).toFixed(0)}}</p>
            <p>
              <span>含赠送金:</span>
              ￥{{info.giftMoney}}
            </p>
          </div>
        </div>
        <div class="info-item">
          <div class="item-label">卡项名称：</div>
          <div class="item-value">{{info.cardName}}</div>
        </div>
        <div class="info-item">
          <div class="item-label">卡项类型：</div>
          <div class="item-value">{{info.giftCard ? '礼品卡' : formatCardType(info.cardType)}}</div>
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
          <div class="item-label">有效期：</div>
          <div class="item-value">{{info.validPermanent ? '永久有效' : judgeFirst(info.finishTime)}}</div>
        </div>
        <div class="info-item">
          <div class="item-label">适用门店：</div>
          <!-- <template v-if="info.cardType < 2"> -->
          <div class="item-value">{{info.suitStoreStrategy|suitShopFilter}}</div>
          <!-- <span class="suit-store-details" v-if="info.suitStoreStrategy === 2" @click="showSuitShops">详情</span> -->
          <!-- </template> -->
          <!-- <template v-else> -->
          <!-- <div class="item-value">{{info.suitStore.storeIdList[0].storeName}}</div> -->
          <!-- </template> -->
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
        <!-- <div class="rights-content" v-if="info.cardType < 2">
          <div class="right-title">续卡规则</div>
          <ul class="card-rule" v-if="showCardRule">
            <li
              v-for="item in info.listCardRenewalRule"
              :key="JSON.stringify(item)"
            >{{formatRuleLine(info, item)}}</li>
          </ul>
        </div>-->

        <!-- 会员卡说明 -->
        <div class="rights-content">
          <div class="right-title">使用说明</div>
          <ul class="card-rule" v-if="instruction.length > 0">
            <li v-for="item in instruction" :key="JSON.stringify(item)">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="transaction-record" v-if="info.cardType === 1 || info.cardType === 2">
      <h3>交易记录</h3>
      <div class="transaction-table-box">
        <el-table :data="tableData" height="calc(40vh)">
          <el-table-column label="交易时间" prop="tradingTime" width="100"></el-table-column>
          <el-table-column label="交易类型" prop="tradingType"></el-table-column>
          <el-table-column label="交易说明">
            <template slot-scope="{row}">
              <p>{{row.tradingInstruction.name}}</p>
              <p>{{row.tradingInstruction.online}}</p>
            </template>
          </el-table-column>
          <!-- 储值卡 只显示卡的储值金和赠送金的变动 取extendContext字段内的 -->
          <!-- info.cardType 1储值卡 2次卡 -->

          <!-- 储值卡 专属字段-->
          <el-table-column label="交易金额" v-if="info.cardType === 1">
            <template slot-scope="{row}">
              <p v-if="row.extendContext.chargeMoneyCost">
                <span
                  class="transaction-money"
                  :class="{'positive-num': row.extendContext.chargeMoneyCost > 0}"
                >￥{{row.extendContext.chargeMoneyCost}}</span>
                <span>(储值金)</span>
              </p>
              <p v-if="row.extendContext.giftMoneyCost">
                <span
                  class="transaction-money"
                  :class="{'positive-num': row.extendContext.chargeMoneyCost > 0}"
                >￥{{row.extendContext.giftMoneyCost}}</span>
                <span>(赠送金)</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="储值金余额(￥)"
            prop="extendContext.chargeMoney"
            v-if="info.cardType === 1"
          ></el-table-column>
          <el-table-column
            label="赠送金余额(￥)"
            prop="extendContext.giftMoney"
            v-if="info.cardType === 1"
          ></el-table-column>
          <!-- 储值卡 专属字段-->

          <!-- 次卡 专属字段-->
          <el-table-column label="交易金额" v-if="info.cardType === 2" prop="transactionAmount"></el-table-column>
          <el-table-column label="次数变动" v-if="info.cardType === 2">
            <template
              slot-scope="{row}"
            >{{row.extendContext.timeChange || row.extendContext.totalCountLimitChange}}</template>
          </el-table-column>
          <el-table-column label="次数余额" v-if="info.cardType === 2">
            <template
              slot-scope="{row}"
            >{{row.extendContext.timeRemain === null ? row.extendContext.totalCountLimitRemain : row.extendContext.timeRemain}}</template>
          </el-table-column>
          <!-- 次卡 专属字段-->

          <el-table-column label="交易前有效期" prop="preTransactionPeriod" width="100"></el-table-column>
          <el-table-column label="交易后有效期" prop="postTransactionPeriod" width="100"></el-table-column>
          <el-table-column label="交易门店" prop="storeMessage"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import cardInfo from "@/pages/goodsManagement/component/vipCardInfo";
import rightsTable from "@/pages/goodsManagement/component/rightsTable";
import rightsTableTimeCard from "@/pages/goodsManagement/component/rightsTable_timeCard";
import * as utils from "@/assets/js/utils";
import { assertForXStatement } from "babel-types";
import * as axios from "@/util/axios";
export default {
  name: "cardsDetails",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage,
      // - 交易记录相关
      tableLoading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    // 请求消费记录
    this.cardTransactionList();
    console.log(this.info);
  },
  methods: {
    // 区分是否为首次使用卡
    judgeFirst(data) {
      return data
        ? new Date(data).format("yyyy-MM-dd hh:mm:ss")
        : `使用后${this.info.validUsedNum}${this.datetrans(
            this.info.validUnit
          )}内有效`;
    },
    // 英文年月日转为中文
    datetrans(date) {
      switch (date) {
        case "year":
          return "年";
        case "month":
          return "月";
        default:
          return "日";
      }
    },
    handleClose() {
      this.$emit("closeDialog");
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
    // 是否展示折扣权益
    showDiscountStrategy(type) {
      const strategy = this.info[`part${type}DiscountStrategy`];
      return (
        this.info.cardDiscountStrategy === 2 &&
        strategy instanceof Array &&
        strategy.length > 0
      );
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
    },
    // 消费记录
    cardTransactionList() {
      if (this.info.cardType === 0 || this.info.cardType === 3) {
        return;
      } // 时间卡、身份卡暂时没有消费记录
      let params = {
        membershipCardId: this.info.id,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.tableLoading = true;
      axios
        .post("/getListByCardId", params)
        .then(res => {
          this.total = res.total;
          this.tableData = res.changeRecordResponseList || [];
          this.tableLoading = false;
        })
        .catch(err => {
          this.total = 0;
          this.tableData = [];
          this.tableLoading = false;
        });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.cardTransactionList();
    }
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
  filters: {
    suitShopFilter(status) {
      let map = {
        0: "所有门店",
        1: "所有直营店",
        2: "指定门店"
      };
      return map[status];
    }
  },
  components: { cardInfo, rightsTable, rightsTableTimeCard }
};
</script>
<style lang='scss' scoped>
.customer-card-details-box {
  display: flex;
}
.normal-info {
  margin: 0 15px 0 0;
  position: relative;
  .card-smallInfo {
    display: inline-block;
    position: relative;
    .card-detail {
      position: absolute;
      color: #fff;
      top: 10px;
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
      bottom: 33px;
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
      top: 8px;
      left: 8px;
      width: 30px;
      height: 30px;
      border-radius: 15px;
    }
    .card-cover {
      width: 230px;
      height: 145px;
      margin: 0 0 21px 0;
      border-radius: 8px;
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
// 交易金额
.transaction-money {
  color: #ff6d61;
  &.positive-num {
    color: #75c74f;
  }
}
.pagination-box {
  height: 45px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>