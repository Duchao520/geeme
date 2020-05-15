<template>
  <section>
    <div class="list-root">
      <div class="calc" v-if="!inBackout">
        <div class="button">
          <el-button
            class="button_"
            type="primary"
            size="mini"
            style="background:#58C9F3;border:none;cursor:auto"
          >统计</el-button>
        </div>
        <div class="text">
          <p class="income-data">
            <span>总收入: {{incomeStatistics.totalIncome}}元;</span>
            <span>现金类总收入: {{
                (incomeStatistics.totalCashPayIncome +
                incomeStatistics.totalWechatPayIncome +
                incomeStatistics.totalAliPayIncome +
                incomeStatistics.totalSelfDefinePayIncome).toFixed(2)
              }}元;
            </span>
          </p>
          <p class="income-data">
            <span>服务总收入: {{incomeStatistics.serviceTotalIncome}}元;</span>
            <span>产品总收入: {{incomeStatistics.productTotalIncome}}元;</span>
            <span>会员卡总收入: {{incomeStatistics.cardTotalIncome}}元;</span>
            <span>身份卡总收入: {{incomeStatistics.identityCardTotalIncome}}元;</span>
            <span>储值卡总收入: {{incomeStatistics.prePaidCardTotalCashIncome}}元;</span>
            <span>次卡总收入: {{incomeStatistics.countCardTotalIncome}}元;</span>
            <span>时间卡总收入: {{incomeStatistics.timeCardTotalIncome}}元;</span>
            <span class="like-link" style="color: rgb(88, 201, 243);" @click="handleDialogOpen">收入明细</span>
          </p>
        </div>
      </div>
      <!-- 撤单里不需要统计了 但是高度样式需要后期再调整 -->
      <div class="calc" v-if="inBackout">
        <div class="button">
          <el-button
            class="button_"
            type="primary"
            size="mini"
            style="background:#58C9F3;border:none;cursor:auto"
          >统计</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="orderList" style="width: 100%" stripe>
          <el-table-column prop="serviceOrderCode" label="服务单号" width="width">
            <template slot-scope="scope">
              <p>{{scope.row.serviceOrderCode}}</p>
              <p>纸单号: {{scope.row.paperOrderId || '无'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="serviceOrderCode" label="客户信息" width="width">
            <template slot-scope="scope">
              <div class="customer-info">
                <div>
                  <span style="color:#333333">{{scope.row.customerName}}</span>
                  <img
                    :src="headImage(scope.row.customerSex)"
                    style="display:inline-block;width:15px"
                  >
                </div>
                <p>{{scope.row.mobile}}</p>
                <p>{{scope.row.memberLevel}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderTime" label="开单时间" width="width"></el-table-column>
          <el-table-column prop="staffName" label="开单人" width="width"></el-table-column>
          <el-table-column v-if="!inRecycle" prop="settleTime" label="结算时间" width="width"></el-table-column>
          <el-table-column prop="serviceOrderCode" :border="true" label="服务项目/产品/卡项" width="380px">
            <template slot-scope="scope">
              <div
                class="goods-detail"
                v-for="(item,index) in goodsDetails(scope.row)"
                :key="index"
              >
                <p class="goods-name" :title="item.goodsName">{{item.goodsName}}</p>
                <p class="money-detail">
                  <span style="color:#999999">金额：</span>
                  <span style="color:#FF6D61">￥{{item.unitTotal}}</span>
                  <span style="color:#999999">入账：</span>
                  <span style="color:#FF6D61">￥{{item.finalPrice}}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column label="服务者/计入业绩" width="width">
            <template slot-scope="scope">
              <div v-for="(item,index) in goodsDetails(scope.row)" :key="index">
                <span>{{item.staffName}}/￥{{item.performance}}</span>
              </div>
            </template>
          </el-table-column>-->
          <el-table-column
            prop="serviceOrderCode"
            label="操作"
            width="width"
            v-if="checkHasBtnPermission('shop_cashier_billDetails')"
          >
            <template slot-scope="scope">
              <div class="btns-box">
                <g-button
                  class="button"
                  :name="'撤单'"
                  :padding="'6.25px 8px'"
                  :type="'cancel'"
                  :icon="'icon_ope_revoke'"
                  v-if="checkHasBtnPermission('shop_cashier_billDetails')&&!inBackout&&!inRecycle"
                  @click="prepareRepealOrder(scope.row.id)"
                ></g-button>

                <look-service-order-detail-button :id="scope.row.id"></look-service-order-detail-button>

                <g-button
                  class="button"
                  :name="'恢复'"
                  :padding="'6.25px 8px'"
                  :type="'mgreen'"
                  :icon="'icon_operate_recover'"
                  v-if="inRecycle && checkHasBtnPermission('shop_cashier_deleteOrder')"
                  @click="restore(scope.row.id)"
                  :loading="restoreButtonLoading"
                ></g-button>
              </div>
              <div class="reason-info" v-if="inBackout || inRecycle">
                <span v-if="scope.row.deleteReason && inRecycle">删单理由: {{scope.row.deleteReason}}</span>
                <span v-if="scope.row.rescindReason && inBackout">撤单理由: {{scope.row.rescindReason}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <incomeDialog 
      v-if="dialogVisible"
      :dialogVisible="dialogVisible" 
      @close="dialogVisible = false"
      :data="incomeStatistics"
      :date="params"
      :shopId="currentInfo.shopId"
    />
  </section>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import LookServiceOrderDetailButton from "@/components/order/LookServiceOrderDetailButton.vue";
import incomeDialog from '../statistics_line/incomeDialog'
import { mapState } from "vuex"
export default {
  components: {
    "look-service-order-detail-button": LookServiceOrderDetailButton,
    incomeDialog,
  },
  props: {
    orderList: Array,
    inBackout: {
      type: Boolean,
      default: false
    },
    inRecycle: {
      type: Boolean,
      default: false
    },
    filterTime: { // 统计数据用的时间参数
      type: Object
    }
  },
  created() {
    this.getStoreDailyIncome()
  },
  data() {
    return {
      utils: utils,
      dialogVisible: false,
      orderDetailLoading: false,
      restoreButtonLoading: false,
      cashOrderInfo: null,
      incomeStatistics: {}, // 统计数据
    };
  },
  methods: {
    goodsDetails(data) {
      var isServiceOrProduct =
        Array.isArray(data.details) && data.details.length > 0;
      if (isServiceOrProduct) {
        return data.details;
      } else {
        return data.consumerOrderCardInfo.map(item => {
          return {
            goodsName: item.cardName,
            unitTotal: item.chargeMoney,
            finalPrice: item.chargeMoney,
          };
        });
      }
    },
    headImage(sex) {
      return require(sex === "男"
        ? "@/assets/img/male_tip.png"
        : "@/assets/img/female_tip.png");
    },
    // 预撤单
    async prepareRepealOrder(id) {
      let res = await axios.get(`/rescindConsumerOrderCheck/${id}`)
      this.$emit('checkCanBackout', {id: id, success: res.success, message: res.message})
    },
    // 回收单恢复.
    restore(id) {
      this.restoreButtonLoading = true;
      axios.post(api.renewConsumerOrder.url, {id: id}).then(res => {
        this.$message({
          type: res.success ? "success" : "warning",
          message: res.message
        });
        this.restoreButtonLoading = false;
        this.$emit("afterRestore");
      });
    },
    // 请求统计数据
    async getStoreDailyIncome() {
      if (!this.filterTime.begin) { return }
      let data = {
        ...this.params,
        storeId: this.currentInfo.shopId,
        brandId: this.currentInfo.brandId,
      }
      this.incomeStatistics = await axios.post('/getStoreDailyIncomeStatisticsList', data)

    },
    handleDialogOpen() {
      // - 
      this.dialogVisible = true
    },
  },
  computed: {
    // 计算统计的请求时间
    params() {
      let today = new Date().format('yyyy-MM-dd')
      if (this.filterTime.timeDay === 0) {
        return {
          beginDay: today,
          endDay: today,
        }
      } else if (this.filterTime.timeDay === -1) {
        let yesterday = new Date(+(new Date()) - 8.64e7).format('yyyy-MM-dd')
        return {
          beginDay: yesterday,
          endDay: yesterday,
        }
      } else if (this.filterTime.timeDay === -7) {
        let lastDay = new Date(+(new Date()) - (8.64e7 * 6)).format('yyyy-MM-dd')
        return {
          beginDay: lastDay,
          endDay: today,
        }
      } else {
        return {
          beginDay: new Date(this.filterTime.begin).format('yyyy-MM-dd'),
          endDay: new Date(this.filterTime.end).format('yyyy-MM-dd'),
        }
      }
    },
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
  },
  watch: {
    filterTime: {
      handler: function(v, o) {
        this.getStoreDailyIncome()
      },
      immediate: true,
      deep: true,
    }
  }
};
</script>
<style lang="scss" scoped>
.list-root {
  width: 100%;

  .calc {
    box-sizing: border-box;
    margin: 15px 0;
    background: #ffffff;
    border-radius: 4px;
    padding: 10px 15px;
    display: flex;

    .button {
      display: flex;
      align-items: center;

      .button_ {
        height: 28px;
      }
    }

    .text {
      box-sizing: border-box;
      padding-left: 15px;
      color: #999999;
      font-size: 12px;
      line-height: 23px;

      span {
        color: #333333;
      }
    }
  }

  .table {
    background: #ffffff;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 20px;

    .customer-info {
      p {
        color: #666666;
      }
    }

    .goods-detail {
      display: flex;
      font-size: 12px;
      .goods-name,
      .money-detail {
        white-space: nowrap;
      }

      .goods-name {
        color: #333333;
        flex: 0 0 50%;
        box-sizing: border-box;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .money-detail {
        box-sizing: border-box;
        padding-right: 5px;
      }
    }
  }
  .btns-box {
    display: flex;
    flex-wrap: nowrap;
    & > * {
      margin-right: 12px;
    }
  }
}
.income-data span {
  margin-right: 6px;
  &.like-link {
    cursor: pointer;
    color: rgb(88, 201, 243);
  }
}
</style>
