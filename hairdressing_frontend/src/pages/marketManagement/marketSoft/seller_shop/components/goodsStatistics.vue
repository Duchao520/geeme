<template>
  <div class="order-statistics">
    <!-- 表格主体 -->
    <div class="table-main">
      <el-table stripe :data="orderData" height="calc(100vh - 352px)" v-loading="loading">
        <el-table-column prop="activityName" label="订单商品" width="300">
          <template slot-scope="{row}">
            <div class="service_msg">
                  <div class="service_img" v-if="row.goodsType !== 3" @click="goodsDetail(row)">
                    <img
                      :src="
                      utils.formatPicImage(
                        row.cycleImage[0],
                        'style',
                        70,
                        'brandLogo'
                      )
                    "
                    />
                  </div>
                  <div class="card_img" v-else @click="goodsDetail(row)">
                    <!-- <img :src="utils.formatPicImage(row.cycleImage[0], 'style', 70, 'brandLogo')" /> -->

                    <img
                      :src="
                      utils.formatPicImage(brandLogo, 'style', 70, 'brandLogo')
                    "
                      class="brand-logo"
                    />
                    <img
                      :src="
                      utils.formatPicImage(
                        row.cycleImage[0],
                        'style',
                        70,
                        'brandLogo'
                      )
                    "
                    />
                  </div>
                  <div class="service_info" @click="goodsDetail(row)">
                    <el-tooltip class="item" effect="dark" :content="row.goodsName" placement="top">
                      <p class="ser_name">{{ row.goodsName }}</p>
                    </el-tooltip>
                    <!-- <p class="ser_code">{{row.goodsId}}</p> -->
                  </div>
                </div>
          </template>
        </el-table-column>
        <el-table-column prop="specificationName" label="规格" width="150">
          <template slot-scope="{row}">
            <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.specificationName || '会员卡'"
                  placement="top"
                >
                  <P class="specification-text">{{row.specificationName || '会员卡'}}</P>
                </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="开始时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="finishTime" label="结算时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="门店价">
          <template slot-scope="{row}">
            <p>￥{{row.price.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="sellCount" label="销量"></el-table-column>
        <el-table-column prop="orderMoney" label="销售金额">
          <template slot-scope="{row}">
            <p v-if="row.orderMoney">￥{{row.orderMoney.toFixed(2)}}</p>
            <p v-else>￥0.00</p>
          </template>
        </el-table-column>
        <el-table-column prop="sellAmount" label="推广提成">
          <template slot-scope="{row}">
            <p v-if="row.sellAmount">￥{{row.sellAmount.toFixed(2)}}</p>
            <p v-else>￥0.00</p>
          </template>
        </el-table-column>
        <el-table-column prop="inviteAmount" label="邀请奖励">
          <template slot-scope="{row}">
            <p v-if="row.inviteAmount">￥{{row.inviteAmount.toFixed(2)}}</p>
            <p v-else>￥0.00</p>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      brandLogo:'',
      utils,
      loading: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        keyword: ""
      },
      total: 0,
      // 订单数据
      orderData: []
    };
  },
  mounted() {
    this.brandLogo = this.$store.state.manage.currentInfo.brandLogo;
    // this.getGoodsList();
  },
  methods: {
    // 获取订单统计数据
    async getGoodsList(data,flag) {
      this.loading = true;
      // 父组件调用时，如果有来自父组件的参数改动， 则让请求参数变化
      if (data) {
        if(flag === 'time'){
          this.params.startTime = data.startTime
          this.params.endTime = data.endTime
        } else {
          this.params.keyword = data.keyword;
        }
      }
      const res = await axios.post("/getSellGoodsInfo", {
        ...this.params,
        brandId: this.currentInfo.brandId
      });
      this.loading = false;
      this.total = res.total;
      this.orderData = res.sellGoodsPerformanceList;
      this.params.keyword = "";
      // this.params.startTime = "";
      // this.params.endTime = "";
    },
    // 分页切换
    handlePageChanged(index) {
      this.params.pageNum = index;
      this.getGoodsList();
    },
    // 商品详情
    goodsDetail(row) {
      // 产品
      if (row.goodsType == 1) {
        window.open("#/shop-inner/product-detail?id=" + Base64.encode(row.goodsId), "_blank");
      } else if (row.goodsType == 2) {
        window.open(
          "#/shop-inner/service-detail?serviceId=" + Base64.encode(row.goodsId),
          "_blank"
        );
      } else {
        // 新标签打开详情
        this.toPagesInNewTags(`/shop-inner/vip-card-details`, {id: row.goodsId})
      }
    },
  },
  watch: {
    "timeRetrieval.startTime"(val) {
      if (val) {
        this.params.startTime = val;
        this.params.endTime = this.timeRetrieval.endTime;
      } else {
        this.params.startTime = null;
        this.params.endTime = null;
      }
      // this.getGoodsList()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>

<style  lang='scss' scoped>
.pages-line {
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service_msg {
  display: inline-block;
  display: flex;
  .service_img {
    margin-right: 10px;
    cursor: pointer;
    img {
      width: 64px;
      height: 62px;
    }
  }
  .card_img {
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    .brand-logo {
      position: absolute;
      top: 6px;
      left: 5px;
      width: 15px;
      height: 15px;
      border-radius: 7.5px;
    }
    img {
      display: block;
      width: 100px;
      height: 62px;
      border-radius: 5px;
    }
  }
  .service_info {
    display: flex;
    align-items: center;
    cursor: pointer;
    // flex: 1;
    .ser_name {
      &:hover {
        color: #409eff;
      }
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>