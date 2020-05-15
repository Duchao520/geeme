<template>
  <div class="order-statistics">
    <!-- 表格单选区域 -->
    <div class="radio-group">
      <el-radio-group v-model="params.goodsType" size="small">
        <el-radio-button label="1">产品</el-radio-button>
        <el-radio-button label="2">服务</el-radio-button>
        <el-radio-button label="3">卡项</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 表格主体 -->
    <div class="table-main">
      <el-table stripe :data="orderData" height="calc(100vh - 404px)" v-loading="loading">
        <el-table-column prop="activityName" label="订单商品" width="220">
          <template slot-scope="{row}">
              <!-- <div class="service_msg">
                <div class="service_img">
                  <img :src="utils.formatPicImage(row.cycleImage[0], 'style', 70, 'brandLogo')" />
                </div>
                <div class="service_info">
                  <p class="ser_name">{{row.goodsName}}</p>
                </div>
              </div> -->
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
                    <!-- <img :src="utils.formatPicImage(row.cycleImageList[0], 'style', 70, 'brandLogo')" /> -->

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
        <el-table-column prop="orderNo" label="订单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="开始时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="finishTime" label="结算时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="门店价">
          <template slot-scope="{row}">
            <p>￥{{row.price.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template slot-scope="{row}">
            <p>{{getPayType(row.payType)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="下单门店" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandCustomerName" label="客户" show-overflow-tooltip>
          <template slot-scope="{row}">
            <p>{{row.brandCustomerName}}</p>
            <span>{{row.brandCustomerMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sellerName" label="推客" show-overflow-tooltip>
          <template slot-scope="{row}">
            <p>{{row.sellerName}}</p>
            <span>{{row.sellerMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="parentSellerName" label="邀请人" show-overflow-tooltip>
          <template slot-scope="{row}">
            <p>{{row.parentSellerName || '-'}}</p>
            <span>{{row.parentSellerMobile || '-'}}</span>
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
        <el-table-column prop="status" label="结算状态">
          <template slot-scope="{row}">
            <status-text type="orange1" v-if="row.status === 0" name="待结算"></status-text>
            <status-text type="green" v-else-if="row.status === 1" name="已结算"></status-text>
            <status-text type="mred" v-else name="已扣回"></status-text>
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
      utils,
      loading: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        keyword: "",
        goodsType:'1'
      },
      total: 0,
      // 订单数据
      orderData: []
    };
  },
  mounted() {
    // this.getOrderList()
  },
  methods: {
    // 获取订单统计数据
    async getOrderList(data,flag) {
      // 父组件调用时，如果有来自父组件的参数改动， 则让请求参数变化
      if (data) {
        if(flag === 'time'){
          this.params.startTime = data.startTime
          this.params.endTime = data.endTime
        } else {
          this.params.keyword = data.keyword;
        }
      }
      this.loading = true
      const res =  await axios.post('/getSellOrderInfo',{
        ...this.params,
        brandId:this.currentInfo.brandId,
      })
      this.loading = false
      this.total = res.total
      this.orderData = res.sellOrderPerformanceList
      this.params.keyword = ''
    },
    // 分页切换
    handlePageChanged(index) {
      this.params.pageNum = index;
      this.getOrderList();
    },
    // 根据支付方式号，返回支付方式名称
    getPayType(num) {
      switch (num) {
        case 0:
          return '微信支付'
        case 1:
          return '支付宝支付'
        case 2:
          return '现金支付'
        case 3:
          return '储值卡支付'
        case 4:
          return '自定义支付'
        case 5:
          return '次卡支付'
        case 6:
          return '时间卡支付'
        case 7:
          return '赠送方式支付'
        default:
          return '余额支付'
      }
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
    'params.goodsType'() {
      this.getOrderList()
    },
    'timeRetrieval.startTime'(val) {
      if(val) {
        this.params.startTime = val
        this.params.endTime = this.timeRetrieval.endTime
      } else {
        this.params.startTime = null
        this.params.endTime = null
      }
      // this.getOrderList()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    /* 当前品牌Logo */
    brandLogo() {
      return this.$store.state.manage.currentInfo.brandLogo;
    }
  }
};
</script>

<style  lang='scss' scoped>
.order-statistics {
  padding: 20px 20px 0;
}

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