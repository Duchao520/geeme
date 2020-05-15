<template>
  <div class="bind-client">
    <!-- 表格单选区域 -->
    <div class="radio-group">
      <el-radio-group v-model="params.invite" size="small">
        <el-radio-button :label="false">推广订单</el-radio-button>
        <el-radio-button :label="true">邀请订单</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 表格主体 -->
    <div class="table-main">
      <el-table stripe :data="orderData" height="calc(100vh - 423px)" v-loading="loading">
        <el-table-column prop="orderNo" label="订单编号">
        </el-table-column>
        <el-table-column prop="createTime" label="订单时间">
        </el-table-column>
        <el-table-column prop="goodsName" label="订单商品">
        </el-table-column>
        <el-table-column prop="brandCustomerName" label="客户信息">
          <template slot-scope="{row}">
            <p>{{row.brandCustomerName}}</p>
            <p style="color: #7E7E7E">{{row.brandCustomerMobile}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="parentSellerName" label="推客信息" v-if="params.invite">
          <template slot-scope="{row}">
            <p>{{row.parentSellerName}}</p>
            <p style="color: #7E7E7E">{{row.parentSellerMobile}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="sellAmount" label="推广提成" v-if="!params.invite">
          <template slot-scope="{row}">
            <p>{{row.sellAmount}}元</p>
          </template>
        </el-table-column>
        <el-table-column prop="inviteAmount" label="邀请奖励" v-if="params.invite">
          <template slot-scope="{row}">
            <p>￥{{row.inviteAmount.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="结算状态">
          <template slot-scope="{row}">
            <status-text type="orange1" v-if="row.status === 0" name="待结算"></status-text>
            <status-text type="green" v-else-if="row.status === 1" name="已结算"></status-text>
            <status-text type="mred" v-else name="已扣回"></status-text>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages-line">
      <div class="batch-btn"></div>
      <el-pagination
        style="margin-right: 12px;"
        class="pagination"
        @current-change="handlePageChanged"
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  props: {
    sellerId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      utils,
      loading: false,
      // 订单数据
      orderData: [],
      // 请求参数
      params: {
        pageNum: 1,
        pageSize: 10,
        invite: false
      },
      total: null,
      // 选中的客户
      currentClient:null,
    };
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    // 根据sellerid获取订单列表
    async getOrderList() {
      this.loading = true
      const res = await axios.post('/getSellOrderInfoBySellerId',{
        ...this.params,
        sellerId: this.sellerId
      })
      this.loading = false
      this.total = res.total
      this.orderData = res.sellOrderPerformanceList
    },
    // 分页切换
    handlePageChanged(index) {
      this.params.pageNum = index;
      this.getOrderList();
    },
  },
  watch: {
    "params.invite"(val) {
      this.getOrderList();
    }
  },
  computed: {
    
  },
};
</script>

<style  lang='scss' scoped>
.bind-client {
  padding: 20px 20px 0;
}

.pages-line {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
// 拷贝来的用户信息，可能有冗余
.client_area {
  display: flex;
  .check_single {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .client_msg {
    display: flex;
    align-items: center;
    width: 80%;
    .client_img {
      margin-left: 5px;
      margin-right: 15px;
      position: relative;
    }
    .client_info {
      width: 95%;
      p {
        text-align: left;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .sex_icon {
      position: absolute;
      width: 14px;
      height: 14px;
      left: 22px;
      top: 0;
    }
  }
}
</style>