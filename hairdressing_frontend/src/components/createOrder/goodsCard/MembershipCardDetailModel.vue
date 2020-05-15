<template>
  <el-dialog
    :visible="visible"
    append-to-body
    width="800px"
    custom-class="custom-class"
    @close="$emit('close')"
  >
    <h5 slot="title">卡项详情</h5>
    <div class="detail-content">
      <div class="left-area">
        <div class="card-style">
          <img class="img-background" :src="utils.formatPicImg(cardInfo.cardCover)" />
          <div class="name">
            <div
              class="img-logo"
              :style="{backgroundImage:`url(${utils.formatPicImg(currentInfo.brandLogo,'circle',40)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
              }"
            ></div>
            <p>{{cardInfo.cardName}}</p>
          </div>
          <div class="price">￥{{cardPrice}}</div>
        </div>
        <table class="card-info">
          <tr>
            <td>卡项名称：</td>
            <td>{{cardInfo.cardName}}</td>
          </tr>
          <tr>
            <td>卡项类型：</td>
            <td>{{cardType[cardInfo.cardType]}}</td>
          </tr>
          <tr v-if="cardInfo.cardType===1">
            <td>首次充值：</td>
            <td>{{cardInfo.cardFirstRechargeNum}}</td>
          </tr>
          <tr v-if="cardInfo.cardType===1">
            <td>赠送金：</td>
            <td>{{cardInfo.cardGiftNum}}</td>
          </tr>
          <tr v-if="cardInfo.cardType!==1">
            <td>售价：</td>
            <td>{{cardInfo.cardPrice}}</td>
          </tr>
          <tr>
            <td>有效期：</td>
            <td>{{validityPeriod}}</td>
          </tr>
        </table>
      </div>
      <div class="right-area">
        <!-- 身份卡  储值卡 -->
        <div class="discount-detail" v-if="cardInfo.cardType<2">
          <h5>折扣权益</h5>
          <template>
            <template
              v-if="checkArray(cardInfo.partProductDiscountStrategy) || checkArray(cardInfo.partServiceDiscountStrategy)"
            >
              <el-table
                v-if="checkArray(cardInfo.partServiceDiscountStrategy)"
                header-row-class-name="header-row-class-name"
                cell-class-name="cell-class-name"
                :data="cardInfo.partServiceDiscountStrategy || []"
                max-height="300"
                style="width: 100%;"
              >
                <el-table-column prop="typeOneName" label="一级分类" width="180"></el-table-column>
                <el-table-column prop="typeTwoName" label="二级分类" width="180"></el-table-column>
                <el-table-column label="折扣">
                  <template slot-scope="scope">
                    <span>{{scope.row.discount}}折</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                v-if="checkArray(cardInfo.partProductDiscountStrategy)"
                header-row-class-name="header-row-class-name"
                cell-class-name="cell-class-name"
                :data="cardInfo.partProductDiscountStrategy || []"
                max-height="300"
                style="width: 100%;margin-top: 10px;"
              >
                <el-table-column prop="typeOneName" label="一级分类" width="180"></el-table-column>
                <el-table-column prop="typeTwoName" label="二级分类" width="180"></el-table-column>
                <el-table-column label="折扣">
                  <template slot-scope="scope">
                    <span>{{scope.row.discount}}折</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <ul v-else>
              <li
                class="list-item"
              >所有服务{{cardInfo.cardDiscountStrategy ? cardInfo.cardServiceDiscount : '不打'}}折</li>
              <li
                class="list-item"
              >所有产品{{cardInfo.cardDiscountStrategy ? cardInfo.cardProductDiscount : '不打'}}折</li>
            </ul>
          </template>
        </div>
        <div class="discount-detail" v-if="cardInfo.cardType===1">
          <h5>续卡规则</h5>
          <template>
            <ul v-if="checkArray(cardInfo.listCardRenewalRule)">
              <li
                class="list-item"
                v-for="(item,index) in (cardInfo.listCardRenewalRule || [])"
                :key="index"
              >充{{item.cardRechargeNum}}元赠{{item.cardGiftNum}}元</li>
            </ul>
            <span v-else>不支持续卡</span>
          </template>
        </div>
        <div class="discount-detail" v-if="cardInfo.cardType===0">
          <h5>续卡规则</h5>
          <template>
            <ul v-if="checkArray(cardInfo.listCardRenewalRule)">
              <li
                class="list-item"
                v-for="(item,index) in (cardInfo.listCardRenewalRule || [])"
                :key="index"
              >充{{item.cardPrice}}元续期{{item.validNum}}{{unitType[item.validUnit]}}</li>
            </ul>
            <span v-else>不支持续卡</span>
          </template>
        </div>
        <!-- 次卡  时间卡 -->
        <div class="discount-detail" v-if="cardInfo.cardType===2">
          <h5>享受权益</h5>
          <el-table
            v-if="checkArray(cardInfo.listServiceCountInfo)"
            header-row-class-name="header-row-class-name"
            cell-class-name="cell-class-name"
            :data="cardInfo.listServiceCountInfo || []"
            :show-summary="cardInfo.totalCountLimit>0"
            :summary-method="getSummaries"
            max-height="300"
            style="width: 100%;"
          >
            <el-table-column prop="serviceName" label="服务项目" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceSpecificationName" label="规格" show-overflow-tooltip></el-table-column>
            <el-table-column label="单次耗卡业绩" show-overflow-tooltip width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.servicePerformance">￥{{scope.row.servicePerformance}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="是否赠送" show-overflow-tooltip>
              <template slot-scope="scope">
                <p>{{ scope.row.isGift ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column label="次数" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.countLimit">{{scope.row.countLimit}}次</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="discount-detail" v-if="cardInfo.cardType===3">
          <h5>享受权益</h5>
          <el-table
            v-if="checkArray(cardInfo.listServiceCountInfo)"
            header-row-class-name="header-row-class-name"
            cell-class-name="cell-class-name"
            :data="cardInfo.listServiceCountInfo || []"
            max-height="300"
            style="width: 100%;"
          >
            <el-table-column prop="serviceName" label="服务项目" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceSpecificationName" label="规格" show-overflow-tooltip></el-table-column>
            <el-table-column label="单次耗卡业绩" show-overflow-tooltip width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.servicePerformance">￥{{scope.row.servicePerformance}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="是否赠送" show-overflow-tooltip>
              <template slot-scope="scope">
                <p>{{ scope.row.isGift ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column label="次数">
              <template slot-scope="scope">
                <span v-if="scope.row.countLimit">{{scope.row.countLimit}}次</span>
                <span v-else>无限次</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="discount-detail"
          v-if="cardInfo.cardType > 1 && (cardInfo.bindProductInfoList || []).length"
        >
          <h5>
            绑定产品
            <el-checkbox v-model="cardInfo.isOverSell" disabled>库存不足时允许销售（库存减为负数）</el-checkbox>
          </h5>
          <el-table :data="cardInfo.bindProductInfoList">
            <el-table-column label="产品名称" show-overflow-tooltip prop="productName"></el-table-column>
            <el-table-column label="规格" prop="productSpecificationName"></el-table-column>
            <el-table-column label="专柜价" prop="shopPrice"></el-table-column>
            <el-table-column label="数量(件)" prop="count"></el-table-column>
          </el-table>
        </div>
        <!-- 工共部分 -->
        <div class="discount-detail" v-if="cardInfo.cardInstruction">
          <h5>使用说明</h5>
          <p v-for="(text, index) in cardInfo.cardInstruction.split('\n')" :key="index">{{text}}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";

export default {
  props: {
    visible: Boolean,
    cardId: Number
  },
  data() {
    return {
      utils,
      cardType: { 0: "身份卡", 1: "储值卡", 2: "次卡", 3: "时间卡" },
      unitType: { year: "年", month: "月", day: "日" },
      cardInfo: {}
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    cardPrice() {
      let card = this.cardInfo;
      if (card.remainingSum) {
        return card.remainingSum;
      }
      switch (card.cardType) {
        case 1:
          return card.cardFirstRechargeNum;
          break;
        default:
          return card.cardPrice;
          break;
      }
    },
    validityPeriod() {
      // 深拷贝区分
      let card = JSON.parse(JSON.stringify(this.cardInfo));
      if (card.validPermanent) {
        return "永久有效";
      } else {
        // 区分开卡后计时 还是 首次使用后计时
        card.validNum =
          card.validNum > 0 ? card.validNum : "使用后" + card.validUsedNum;
        let match = {
          year: "年",
          month: "月",
          day: "日"
        };
        return card.validNum + match[card.validUnit];
      }
    }
  },
  methods: {
    checkArray(data) {
      if (!data) {
        return false;
      } else {
        if (Array.isArray(data) && data.length > 0) {
          return true;
        }
        return false;
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      let sums = [];
      columns.forEach(() => {
        sums[0] = "共用次数";
        sums[4] = this.cardInfo.totalCountLimit + "次";
      });
      return sums;
    },
    getCardDetail() {
      axios.get("/getCardKindDetailInfo/" + this.cardId).then(res => {
        this.cardInfo = res;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin font-style($lh, $fs, $col) {
  line-height: $lh;
  font-size: $fs;
  color: $col;
}

/deep/ .el-dialog__header {
  padding: 0 20px;
  border-bottom: 1px solid #f0f1f4;

  h5 {
    @include font-style(60px, 18px, #333333);
  }
}

/deep/ .el-dialog__body {
  padding: 23px 26px 40px;

  .detail-content {
    display: flex;
    justify-content: space-between;

    .left-area {
      .card-style {
        width: 230px;
        height: 145px;
        border-radius: 8px;
        overflow: hidden;
        margin: 0 30px 20px 0;
        color: white;
        position: relative;
        box-sizing: border-box;
        background-position: center;
        background-size: cover;

        .img-background {
          width: 100%;
          height: 100%;
        }

        .name {
          line-height: 1;
          font-size: 14px;
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;

          .img-logo {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 7px;
          }
        }

        .price {
          position: absolute;
          right: 10px;
          bottom: 10px;
          line-height: 1;
          font-size: 16px;
        }
      }

      .card-info {
        tr {
          td {
            line-height: 30px;
            vertical-align: top;
          }

          td:nth-child(1) {
            color: #999999;
            width: 110px;
          }

          td:nth-child(2) {
            color: #333333;
            width: 120px;
          }
        }
      }
    }

    .right-area {
      flex: auto;

      h5 {
        margin-top: 10px;
      }

      .discount-detail {
        color: #333333;

        h5 {
          @include font-style(42px, 16px, #333333);
        }

        .header-row-class-name {
          th {
            background: #f4f5f7;
            color: #333333;
          }
        }

        .cell-class-name {
          color: #333333;
        }

        /deep/ .has-gutter {
          .is-leaf {
            color: #333333;
          }
        }

        .list-item {
          list-style: disc;
          @include font-style(24px, 14px, #333333);
          transform: translateX(18px);
        }

        &:nth-child(1) {
          h5 {
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>
