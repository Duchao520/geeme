<template>
  <div class="pages-main-box scrollbar" v-loading="loading">
    <div class="pages-edit-container">
      <div class="customer-wallet">
        <div class="header-boxs">
          <div class="item-box" v-for="item in headerData" :key="item.desc">
            <img :src="item.path" />
            <div class="right-info">
              <div class="h3" :title="item.money">{{item.money}}</div>
              <p>{{item.desc}}</p>
            </div>
          </div>
        </div>
        <div class="container-info">
          <div class="main-box">
            <el-table :data="tableData" stripe height="calc(100vh - 304px)">
              <el-table-column label="交易时间" prop="createTime"></el-table-column>
              <el-table-column label="交易类型">
                <template slot-scope="{row}">{{row.type | typeFilter}}</template>
              </el-table-column>
              <el-table-column label="交易金额(￥)">
                <template slot-scope="{row}">
                  <p
                    class="green"
                    :class="{ 'red': row.type === 2 || row.type === 3 || row.type === 4 || row.type === 8}"
                  >{{ (row.type === 2 || row.type === 3 || row.type === 4 || row.type === 8) ? `-${row.amount }`: row.amount}}</p>
                </template>
              </el-table-column>
              <el-table-column label="交易后余额(￥)" prop="walletMoney"></el-table-column>
              <el-table-column label="交易门店">
                <template slot-scope="{row}">{{row.storeName || '-'}}</template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{row}">
                  <g-button
                    v-if="row.consumerOrderId"
                    name="查看消费账单"
                    type="detail"
                    :icon="'icon_operate_detail'"
                    @click="toDetail(row.consumerOrderId)"
                  ></g-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pages-box">
              <el-pagination
                class="pagination"
                @current-change="handleCurrentChange"
                :current-page="ppageNum"
                :page-size="pageSize"
                :pager-count="5"
                layout="total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <service-order-detail
      v-if="ShowOrderDetail"
      :infoVisible="ShowOrderDetail"
      @handleClose="ShowOrderDetail=false"
      :detail="orderInfo"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import ServiceOrderDetail from "@/components/order/billDetail/ServiceOrderDetail.vue";
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],

      orderInfo: {},
      ShowOrderDetail: false,

      loading: false,
      headerData: [
        {
          money: 0,
          desc: "钱包余额",
          path:
            "/static/images/ordermanagement/icon_Accumulated_withdrawal_and_transfer.png"
        },
        {
          money: 0,
          desc: "累计钱包充值",
          path: "/static/images/ordermanagement/icon_Total_wallet _recharge.png"
        },
        {
          money: 0,
          desc: "累计钱包提现",
          path: "/static/images/ordermanagement/icon_Order_amount.png"
        },
        {
          money: 0,
          desc: "累计钱包消费",
          path:
            "/static/images/ordermanagement/icon_Accumulated_application_for_withdrawal.png"
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      let params = {
        brandCustomerId: this.$route.params.id * 1,
        brandId: this.currentInfo.brandId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      let res = await axios.post(
        "/getWalletMoneyRecordByBrandCustomerId",
        params
      );
      this.total = res.total;
      this.tableData = res.recordInfoList || [];
      this.headerData[0].money = res.walletMoney || 0; // 余额
      this.headerData[1].money = res.totalCashInAmount || 0; // 充值
      this.headerData[2].money = res.totalCashOutAmount || 0; // 提现
      this.headerData[3].money = res.totalUseAmount || 0; // 消费
      this.loading = false;
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.init();
    },
    toDetail(id) {
      this.ShowOrderDetail = false;
      axios.get(`/getConsumerOrderInfoById/${id}`).then(res => {
        this.orderInfo = res;
        this.ShowOrderDetail = true;
      });
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry,
      currentInfo: state => state.manage.currentInfo
    })
  },
  filters: {
    typeFilter(type) {
      let map = {
        1: "充值",
        2: "提现",
        3: "线上订单",
        4: "门店开单",
        5: "商家返现",
        6: "撤单",
        7: "分销",
        8: "礼品卡奖励",
        9: "分销撤单",
        10: "权益金转入"
      };
      return map[type];
    }
  },
  components: { ServiceOrderDetail }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}

.customer-wallet {
  max-width: 1440px;
  min-height: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  // background: #fff;
  border-radius: 6px;
  .header-boxs {
    padding: 12px 0;
    height: 90px;
    // background: red;
    margin-bottom: 10px;
    border-radius: 6px;
    display: flex;
    background: #fff;
  }
  .container-info {
    width: 100%;
    max-width: 1440px;
    // min-height: calc(100vh - 287px); // 165 112
    box-sizing: content-box;
    border-radius: 8px;
    flex-flow: column nowrap;
    background: #fff;
  }
  .main-box {
    margin: 0 10px;
  }
}

.item-box {
  width: 25%;
  display: flex;
  align-items: center;
  img {
    width: 60px;
    height: 60px;
    margin: 0 6%;
  }
  div.right-info {
    flex: 1;
    margin-right: 16px;
    overflow: hidden;
    .h3 {
      width: 100%;
      font-weight: normal;
      color: rgba(153, 153, 153, 1);
      font-size: 32px;
      text-align: left;
      font-family: PingFangSC-Light;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      color: rgba(102, 102, 102, 1);
      font-size: 16px;
      text-align: left;
      font-family: PingFangSC-Regular;
    }
  }
}
.item-box + .item-box {
  border-left: 2px solid rgb(233, 233, 233);
}
.pages-box {
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}


.green {
  color: green;
  &.red {
    color: red;
  }
}
</style>