<template>
  <div class="red-packet-details-box" v-loading="loading">
    <!-- <seed-header title="红包详情" :hasTabs="false"></seed-header> -->
    <details-header title="红包详情" />
    <div class="red-packet-main-box scrollbar">
      <div class="red-packet-container">
        <!-- <div class="red-packet-body"></div> -->
        <div class="top-details-box">
          <div class="red-view-box scrollbar">
            <singlePacket
              :superData="commonSuperInfo"
              :singleData="i"
              class="single-packet"
              v-for="i in data.listRedPacketDetail"
              :key="i.redPacketDetailId"
            />
          </div>
          <div class="details-info">
            <el-button
              size="small"
              v-if="data.packetStatus !== 3"
              class="top-btn"
              :class="data.packetStatus === 4 ? 'normal_green_btn' : 'normal_silvery_gray_btn'"
              @click="handleTaggleStatus(data.packetStatus)"
            >{{data.packetStatus === 4 ? '恢复启用' : '暂停启用'}}</el-button>
            <p>
              <span class="gray">红包名称:</span>
              <span class="text-info">{{data.packetName}}</span>
            </p>
            <p>
              <span class="gray">红包类型:</span>
              <span class="text-info">{{data.packetTypeName}}</span>
            </p>
            <p>
              <span class="gray">红包总额:</span>
              <span class="text-info">{{data.totalMoney}} 元</span>
            </p>
            <p>
              <span class="gray">启用状态:</span>
              <span class="text-info">{{data.packetStatus|statusFilter}}</span>
            </p>
            <p class="more-margin-bottom">
              <span class="gray">适用门店:</span>
              <span class="text-info">{{data.suitStoreStrategy|shopsFilter}}</span>
              <span v-if="data.suitStoreStrategy === 2" class="btn-text" @click="shopsDetails">详情</span>
            </p>
            <p>
              <span class="gray">领取数量:</span>
              <span class="text-info">开发中...</span>
            </p>
            <p>
              <span class="gray">使用数量:</span>
              <span class="text-info">开发中...</span>
            </p>
            <p>
              <span class="gray">消费金额:</span>
              <span class="text-info">开发中...</span>
            </p>
            <p>
              <span class="gray">抵扣金额:</span>
              <span class="text-info">开发中...</span>
            </p>
            <p class="more-margin-bottom">
              <span class="gray">实收金额:</span>
              <span class="text-info">开发中...</span>
            </p>
            <p>
              <span class="gray">派发人:</span>
              <span class="text-info">{{data.senderName}}</span>
            </p>
            <p>
              <span class="gray">派发时间:</span>
              <span class="text-info">{{data.createTime}}</span>
            </p>
          </div>
        </div>
        <div class="bottom-details-box">
          <div class="part-title">领取明细</div>
          <div class="table-con-box">
            <el-table :data="tableData" stripe height="528px" v-loading="tableLoading">
              <el-table-column label="领取人" prop="brandCustomerName" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <p>{{row.brandCustomerName}}</p>
                  <p>{{row.brandCustomerPhone}}</p>
                </template>
              </el-table-column>
              <el-table-column label="红包名称/金额" prop="redPacketsName" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <p>{{row.redPacketsName}}</p>
                  <p>{{row.redPacketsMoney.toFixed(2)}}元</p>
                </template>
              </el-table-column>
              <el-table-column label="领取时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="使用时间" prop="modifyTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="购买商品" prop="user" show-overflow-tooltip></el-table-column>
              <el-table-column label="购买门店" prop="useStoreName" show-overflow-tooltip></el-table-column>
              <el-table-column label="状态" prop="used">
                <template slot-scope="{row}">
                  <p v-if="row.used === 0" class="unUsed">待使用</p>
                  <p v-else class="used">已使用</p>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="user">
                <template slot-scope="{row}">
                  <g-button
                    v-if="row.used === 1"
                    @click="goDetail(row)"
                    :name="'相关订单'"
                    :type="'green'"
                    :icon="'icon_operate_eyes'"
                  ></g-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="bottom-page-line">
              <i></i>
              <el-pagination
                style="margin: 5px 0px 5px 0;"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
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
    <el-dialog :visible.sync="dialogVisible" title="适用门店">
      <el-table :data="shopsTable" height="530" stripe>
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
        <el-table-column show-overflow-tooltip label="所在城市">
          <template slot-scope="scope">{{`${scope.row.province}/${scope.row.city}`}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="门店性质" width="80">
          <template slot-scope="scope">{{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="门店创建时间" width="160">
          <template
            slot-scope="scope"
          >{{new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm:ss')}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <DelModel
      title="确定停用吗?"
      content="停用后，该红包不再派发，已领取的红包不影响使用。"
      :icon="'icon_popup_question'"
      :iconColor="'#ff6d61'"
      :delTagDialogVisible="delTagDialogVisible"
      @confirm="closeDialog"
      @close="delTagDialogVisible=false"
    />
    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible">
      <order-details v-if="orderInfo" :orderInfo="orderInfo" :isProduct="isProduct"></order-details>
    </el-dialog>
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import singlePacket from "./components/singleRedPacket";
import OrderDetails from "@/components/orderManagement/OrderDetails";
export default {
  name: "red-packet-details",
  data() {
    return {
      utils,
      data: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      tableLoading: false,
      shopsTable: [], // 对话框里的门店列表
      dialogVisible: false,
      delTagDialogVisible: false, // 停用
      tableData: [], // 领取明细数据
      commonSuperInfo: {},
      id: this.$route.query.id * 1,
      // 订单数据
      orderInfo: {},
      orderDialogVisible: false,
      isProduct:Boolean,
    };
  },
  created() {
    this.init();
    this.getRedPacketDetail();
  },
  methods: {
    // 获取红包领取明细
    async getRedPacketDetail() {
      const res = await axios.post(`/getRedPacketTakeRecord`, {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        redPacketId: this.id,
        usedFlag: null
      });
      this.tableData = res.redPacketTakeRecordList;
      this.total = res.total;
      console.log(this.tableData);
    },
    // 红包明细相关详情
    async goDetail(row) {
      console.log(row);
      this.orderDialogVisible = true;
      let res = null;
      if (row.orderType === "SERVICE") {
        res = await axios.get(`/getServiceOrderDetailsById/${row.orderId}`);
        this.isProduct = false
      } else {
        res = await axios.post(`/getProductOrderDetailsById`, {
          online: true,
          orderId: row.orderId,
          productOrderType: "PRODUCT_ORDER"
        });
        this.isProduct = true
      }
      this.orderInfo = res.orderInfo;
    },
    init() {
      this.loading = true;
      axios
        .post("/getRedPacketDetailInfo", { redPacketId: this.id })
        .then(res => {
          this.data = res;
          this.loading = false;
          this.commonSuperInfo = {
            packetTypeName: res.packetTypeName,
            packetName: res.packetName,
            validTimeStrategy: res.validTimeStrategy,
            validDay: res.validDay,
            useWithCoupons: res.useWithCoupons,
            suitStoreStrategy: res.suitStoreStrategy,
            partSuitStoreStrategy: res.partSuitStoreStrategy
          };
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 指定门店详情
    shopsDetails() {
      this.loading = true;
      this.shopsTable = [];
      axios
        .post("/getRedPacketPartSuitStore", { redPacketId: this.id })
        .then(res => {
          this.loading = false;
          this.dialogVisible = true;
          this.shopsTable = Object.freeze(res.listSuitStoreInfo);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getRedPacketDetail();
      this.init();
    },
    handleTaggleStatus(status) {
      if (status === 4) {
        this.loading = true;
        axios
          .post("/recoverRedPacket", { redPacketId: this.id })
          .then(res => {
            this.init();
          })
          .catch(err => {
            this.loading = false;
          });
      } else {
        this.delTagDialogVisible = true;
      }
    },
    closeDialog() {
      axios
        .post("/disableRedPacket", { redPacketId: this.id })
        .then(res => {
          this.delTagDialogVisible = false;
          this.init();
        })
        .catch(err => {
          this.delTagDialogVisible = false;
        });
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
      // id: state => state.marketing.redPacket.id
    })
  },
  filters: {
    shopsFilter(type) {
      let typeMap = {
        0: "所有门店",
        1: "所有直营店",
        2: "指定门店"
      };
      return typeMap[type];
    },
    statusFilter(status) {
      let map = {
        1: "已生效",
        2: "未生效",
        3: "已停用",
        4: "暂停使用"
      };
      return map[status];
    }
  },
  components: { singlePacket,"order-details": OrderDetails }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
$blue: #58c9f3;
$gray: #d5dadf;
// - 滚动条在外侧的4层布局:
.red-packet-details-box {
  display: flex;
  justify-content: center;
  .red-packet-main-box {
    width: calc(100vw - 40px);
    min-width: 1400px;
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
  }
  .red-packet-container {
    min-height: calc(100vh - 105px);
  }
  /* .red-packet-body {
    max-width: 1440px;
    box-sizing: border-box;
    padding: 36px 72px 85px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
  } */
  .top-details-box {
    max-width: 1440px;
    height: 560px;
    background: #fff;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 6px;
    padding: 40px 20px 52px 40px;
    display: flex;
    .red-view-box {
      overflow-y: auto;
      width: 384px; /* (165 + 20) * 2 + 10 */
      display: flex;
      flex-wrap: wrap;
      margin-right: 74px;
    }
    .details-info {
      flex: 1;
      position: relative;
      .top-btn {
        position: absolute;
        top: 0;
        right: 0;
      }
      p {
        margin-bottom: 10px;
        font-size: 14px;
      }
      .more-margin-bottom {
        margin-bottom: 20px;
      }
      .gray {
        width: 70px;
        color: #999;
        display: inline-block;
      }
      .text-info {
        margin-left: 44px;
      }
      .btn-text {
        color: #58c9f3;
        margin-left: 4px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .single-packet {
      width: 165px;
      height: 214px;
      margin-right: 20px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
  }
  .bottom-details-box {
    max-width: 1440px;
    margin: 0 auto;
    margin-top: 24px;
    .part-title {
      height: 32px;
      font-size: 14px;
      font-weight: bold;
      line-height: 32px;
    }
    .table-con-box {
      height: 605px;
      background: #fff;
      border-radius: 4px;
      padding: 4px 10px 0;
    }
    .bottom-page-line {
      height: 78px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.used {
  display: inline-block;
  color: #fff;
  background-color: #a9d86e;
  border-radius: 10px;
  padding: 0 8px;
}
.unUsed {
  display: inline-block;
  color: #fff;
  background-color: #fcb322;
  border-radius: 10px;
  padding: 0 8px;
}

.table {
  min-width: 760px;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebecf0;
  .detail-info {
    td {
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

