<template>
  <div class="pages-main-box scrollbar">
    <div class="pages-edit-container">
      <div class="record-history-box" v-loading="pageLoading">
        <div class="no-info" v-if="noData">
          <img :src="require('@/assets/img/bg_default_goods.png')" />
          <p>该客户暂无消费哦～</p>
        </div>
        <div class="has-record">
          <div class="record-item" v-for="(item, index) in historyData" :key="item.id">
            <el-row
              type="flex"
              justify="center"
              align="middle"
              class="cicle"
              :class="{f1: index % 4 === 0, f2: index % 4 === 1, f3: index % 4 === 2, f4: index % 4 === 3}"
            >
              <span></span>
            </el-row>
            <!-- <div class="item-bill-date">{{item.serviceTime}}</div> -->
            <div class="item-view-box">
              <!-- v1 辅助工位版 -->
              <!-- <div
                class="goods-item-box"
                v-for="goods in item.goodsList"
                :key="goods.consumerOrderId + goods.snapshotId"
              >
                <el-row class="item-goods-info item-type">
                  <label>{{goods.goodsType|goodsTypeFilter}}</label>
                  {{goods.goodsName}}
                </el-row>
                <el-row class="item-goods-info item-men" v-if="goods.goodsType === 'service'">
                  <label>服务者:</label>
                  {{goods.serverName}}
                  <label style="margin-left: 8px;">辅助工位:</label>
                  {{goods.assistantOrSellers.join(',')}}
                </el-row>
                <el-row class="item-goods-info item-men" v-else>
                  <label>销售人:</label>
                  {{goods.assistantOrSellers.join(',')}}
                </el-row>
                <el-row class="item-goods-info item-notes">
                  <label>备注:</label>
                  {{goods.orderNote}}
                </el-row>
              </div> -->
              <!-- <el-row class="item-goods-info">
                <label>消费:</label>
                <span class="red-font">￥{{item.price}}</span>
              </el-row> -->
              <el-row class="item-goods-info">
                <label>服务时间:</label>
                {{item.serviceTime}}
                <g-button class="right-top-btn" :name="'详情'" :type="'detail'" :icon="'icon_operate_eyes'" @click="getOrderInfo(item.id)"></g-button>
              </el-row>
              <el-row class="item-goods-info">
                <label>消费门店:</label>
                {{item.storeCity}}&nbsp;&nbsp;{{item.storeName}}
              </el-row>
              <!-- v2  多工位版 -->
              <el-table :data="item.goodsList" stripe>
                <el-table-column prop="goodsName" label="项目/产品/卡项"></el-table-column>
                <el-table-column label="金额">
                  <template slot-scope="scope">
                    {{scope.row.goodsType === 'card' ? "" : `￥${scope.row.finalTempPrice}`}} ({{scope.row.paymentTypeName}})
                  </template>
                </el-table-column>
                <el-table-column label="工位1(服务)">
                  <template slot-scope="scope">
                    {{(scope.row.stationOne || []).join('、')}}
                  </template>
                </el-table-column>
                <el-table-column label="工位2(服务)/销售人">
                <template slot-scope="scope">
                    {{(scope.row.assistantOrSellers || []).join('、')}}
                  </template></el-table-column>
                <el-table-column label="工位3(服务)">
                  <template slot-scope="scope">
                    {{(scope.row.stationThree || []).join('、')}}
                  </template>
                </el-table-column>
                <el-table-column prop="orderNote" label="备注"></el-table-column>
              </el-table>
              <el-row class="item-goods-info" style="margin-top: 4px;">
                <label>消费总额:</label>
                ￥{{item.price}}
              </el-row>
              <el-row class="photos-box" style="margin-top: 12px;">
                <div class="label">影集:</div>
                <div class="photo-list">
                  <!-- <div
                    class="img"
                    v-for="i in item.image"
                    :key="i"
                    :style="{
                      backgroundImage:`url(${utils.formatPicImg(i,'style', 146)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }"
                  ></div> -->
                  <img  
                    v-for="(i, idx) in item.image" 
                    :key="idx" 
                    :preview="item.id" 
                    :preview-text="''" 
                    :src="utils.formatPicImg(i,'style', 146)" 
                    style="object-fit: cover; object-position: center center;"
                  >
                </div>
              </el-row>
            </div>
            <div class="filler-box"></div>
          </div>
          <div class="bottom-line">
            <el-pagination
              style="margin: 5px 20px 5px 0;"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <service-order-detail
      v-if="ShowServiceOrderDetail"
      :infoVisible="ShowServiceOrderDetail"
      @handleClose="ShowServiceOrderDetail=false"
      :detail="orderInfo"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import { parse } from 'path';
import ServiceOrderDetail from "@/components/order/billDetail/ServiceOrderDetail.vue";
export default {
  name: "recordhisroty",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      utils: utils,
      pageLoading: false,
      ShowServiceOrderDetail: false, // - 订单详情
      orderInfo: {}, // - 订单详情
      historyData: [],
      total: 0,
      noData: false, // 缺省页
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let url =
        this.currentEntry === "shop"
          ? "/customerConsumerOrderAchieves"
          : "/brandCustomerConsumerOrderAchieves";
      let params = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      };
      if (this.currentEntry === "shop") {
        // Object.assign(params, { customerId: this.beautyRecordId });
        Object.assign(params, { customerId: this.$route.params.id * 1 });
      } else {
        // Object.assign(params, { brandCustomerId: this.beautyRecordId });
        Object.assign(params, { brandCustomerId: this.$route.params.id * 1 });
      }
      this.pageLoading = true;
      axios.post(url, params).then(res => {
        this.pageLoading = false;
        this.historyData = res.consumerOrderList;
        this.noData = !res.consumerOrderList.length
        this.total = res.total;
      });
    },
    // 页码切换
    handleCurrentChange(page) {
      this.currentPage = page;
      this.init();
    },
    getOrderInfo(id) {
      this.ShowServiceOrderDetail = false;
      axios.get(`/getConsumerOrderInfoById/${id}`).then(res => {
        this.orderInfo = res;
        this.ShowServiceOrderDetail = true;
      });
    },
  },
  computed: {
    ...mapState({
      // beautyRecordId: state => state.queryParams.beautyRecordId,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  components: {ServiceOrderDetail},
  filters: {
    goodsTypeFilter(type) {
      let typeMap = {
        service: "服务项目: ",
        product: "商品: ",
        card: "卡项: "
      };
      return typeMap[type];
    }
  }
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
$red: #ef7066;
$green: #39b6ae;
$blue: #56c9f5;
$purple: #8074c5;
.record-history-box {
  position: relative;
  padding: 20px 70px 40px 80px;
  // font-size: 14px;
  max-width: 1440px;
  // min-height: 100%;
  min-height: calc(100vh - 105px);
  box-sizing: border-box;
  // padding: 40px 70px;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  .record-item {
    border-left: 2px solid #e8e8e8;
    position: relative;
    .cicle {
      position: absolute;
      top: 22px;
      left: -9px;
      width: 15px;
      height: 15px;
      border: 2px solid rgba(239, 112, 102, 1);
      border-radius: 50%;
      span {
        display: block;
        width: 7px;
        height: 7px;
        background: rgba(239, 112, 102, 1);
        border-radius: 50%;
      }
      &.f1 {
        span {
          background-color: $red;
        }
        border-color: $red;
      }
      &.f2 {
        span {
          background-color: $green;
        }
        border-color: $green;
      }
      &.f3 {
        span {
          background-color: $blue;
        }
        border-color: $blue;
      }
      &.f4 {
        span {
          background-color: $purple;
        }
        border-color: $purple;
      }
    }
    .item-bill-date {
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .item-view-box {
      border: 1px solid #e3e6ed;
      margin-left: 20px;
      border-radius: 4px;
      padding: 18px 20px 20px;
      position: relative;
      .goods-item-box {
        width: 50%;
        border-bottom: 1px dashed #ddd;
        margin-bottom: 9px;
      }
      .item-goods-info {
        margin-bottom: 10px;
      }
    }
    .filler-box {
      height: 20px;
    }
    label,
    .label {
      color: #999;
    }
    .red-font {
      color: $red;
    }
    .photos-box {
      display: flex;
      .label {
        width: 40px;
      }
    }
    .photo-list {
      display: flex;
      flex-wrap: wrap;
      .img, img {
        width: 140px;
        height: 140px;
        margin-left: 20px;
        border-radius: 8px;
        cursor: pointer;
        //   test
        //   background: red;
      }
    }
  }
}
.bottom-line {
  position: absolute;
  // bottom: 0;
  // right: 0;
  // bottom: -22px;
  bottom: 12px;
  right: 70px;
  .el-pagination {
    margin: 0 !important;
    padding-right: 0 !important;
  }
}
.no-info {
  text-align: center;
  img {
    width: 276px;
    margin-top: 200px;
  }
  p {
    color: rgba(153, 153, 153, 1);
    font-size: 16px;
    text-align: center;
    margin-top: 40px;
  }
}
.right-top-btn {
  float: right;
}
</style>
