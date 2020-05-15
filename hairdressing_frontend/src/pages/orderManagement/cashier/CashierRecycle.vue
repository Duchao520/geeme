<template>
  <div>
    <!-- 头部 -->
    <order-header :type="type" @change="change"></order-header>

    <!-- 主体 -->
    <div class="CashierList">
      <div class="item" v-for="(item,index) in orderList" :key="index">
        <div class="i-h-bg"></div>
        <div class="i-b-bg"></div>
        <!-- 章 -->
        <div class="seal" v-if="index === 1"></div>
        <!-- 发型师信息 -->
        <div class="staffInfo">
          <p>{{item.staffName}}</p>
          <span>{{item.serviceTime}}</span>
        </div>
        <!-- 用户信息 -->
        <div class="userInfo">
          <div class="u-top">
            <p>服务单号：</p>
            <span>{{item.serviceOrderCode}}</span>
          </div>
          <div class="u-bottom">
            <p>
              <span>客</span>
              <span>户：</span>
            </p>
            <span>{{item.customerName}} {{item.mobile}}</span>
          </div>
        </div>
        <!-- 商品信息 -->
        <div class="productList">
          <div class="productTitle">
            <p>项目/产品</p>
            <span>金额</span>
          </div>
          <div class="productItem" v-for="(i ,index) in item.details" :key="index">
            <p>{{i.goodsName}}</p>
            <span style="color:#9EABBE">X{{i.count}}</span>
            <span>¥{{i.price}}</span>
          </div>
        </div>
        <!-- 合计 -->
        <div class="totalPrice">
          <p>
            合计
            <i>￥</i>
            <span>{{item.total}}</span>
          </p>
        </div>
        <!-- 底部按钮 -->
        <div class="buttons">
          <div class="detail" @click="restore(item.id)">
            <span class="icon iconfont icon-icon_operate_recover"></span>
            <i>恢复</i>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="params.pageParam.currentPage"
      :page-size="20"
      :pager-count="5"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>
<script>
import orderHeader from "@/components/order/orderHeader.vue";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as api from "@/assets/js/interface";

export default {
  components: {
    "order-header": orderHeader
  },
  data() {
    return {
      type: "CashierRecycle",
      orderList: [],
      totalCount: 0,
      params: {
        storeId: 0,
        date: utils.formatDateTimeYYR(new Date()),
        pageParam: {
          currentPage: 1,
          pageSize: 20
        }
      }
    };
  },
  mounted() {
    this.params.storeId = Number(this.$route.query.storeId);
    console.log(this.params);
    this.getListInfo();
  },
  methods: {
    getListInfo() {
      axios.post(api.getDeletedConsumerOrderList.url, this.params).then(res => {
        this.setOrderList(res);
      });
    },
    change(e) {
      this.params.date = utils.formatDateTimeYYR(e);
      this.params.pageParam.currentPage = 1;
      this.getListInfo();
    },
    setOrderList(res) {
      console.log(res);
      this.orderList = res.consumerOrders;
      this.totalCount = res.total;
    },
    handleCurrentChange(i) {
      this.params.pageParam.currentPage = i;
      this.getListInfo();
      console.log(this.params);
    },
    /**
     * 恢复消费账单
     */
    restore(id) {
      axios.post(api.renewConsumerOrder.url, { id: id }).then(() => {
        this.getListInfo();
        this.$message({ type: "success", message: "恢复账单成功" });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.CashierList {
  margin-right: 20px;
  padding: 16px 4px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .item {
    width: 227px;
    height: 303px;
    position: relative;
    padding: 21px 15px 7px 15px;
    background-color: white;
    margin-right: 18px;
    margin-bottom: 40px;
    .seal {
      width: 90.16px;
      height: 90.16px;
      background: url("../../../assets/img/icon_seal.png") no-repeat center
        center/100% auto;
      background-size: 70px 70px;
      position: absolute;
      bottom: 20px;
      left: 16px;
    }
    .i-h-bg {
      width: 236px;
      height: 12px;
      background: url("../../../assets/img/bg_order_top.png") no-repeat center
        center/100% auto;
      background-position-x: 1px;
      position: absolute;
      top: -4px;
      right: -3px;
    }
    .i-b-bg {
      width: 227px;
      height: 19.15px;
      background: url("../../../assets/img/bg_order_bottom.png") no-repeat
        center center/100% auto;
      position: absolute;
      bottom: -11px;
      right: 0;
      left: 0;
      margin: auto;
    }
    .staffInfo {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      margin-bottom: 2px;
      line-height: 22px;
      p {
        color: #4c495b;
        font-size: 16px;
      }
      span {
        color: #9eabbe;
        font-size: 12px;
      }
    }
    .userInfo {
      width: 100%;
      height: auto;
      padding: 8px 0 9px 0;
      border-top: 1px dashed #f0f1f4;
      border-bottom: 1px dashed #f0f1f4;
      div {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
      .u-top {
        margin-bottom: 7px;
        p {
          width: 60px;
          color: #4c495b;
          font-size: 12px;
        }
        span {
          color: #9eabbe;
          font-size: 12px;
        }
      }
      .u-bottom {
        p {
          width: 60px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          span {
            color: #4c495b;
          }
        }
        span {
          color: #9eabbe;
          font-size: 12px;
        }
      }
    }
    .productList {
      width: 100%;
      height: 125px;
      padding-top: 11px;
      overflow-y: auto;
      overflow-x: hidden;
      border-bottom: 1px dashed #f0f1f4;
      margin-bottom: 10px;
      overflow-y: auto;
      overflow-x: hidden;
      .productTitle {
        width: 100%;
        line-height: 17px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        font-size: 12px;
        color: #333333;
      }
      .productItem {
        width: 100%;
        line-height: 17px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        color: #333333;
        font-size: 12px;
        margin-top: 10px;
      }
    }

    .totalPrice {
      width: 100%;
      height: 19px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-end;
      margin-bottom: 10px;
      p {
        color: #999999;
        font-size: 12px;
        i {
          color: #ff671a;
          font-size: 8px;
          font-style: normal;
        }
        span {
          color: #ff671a;
          font-size: 12px;
        }
      }
    }
    .buttons {
      width: 100%;
      height: 32px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-end;
      position: relative;
      .delete {
        line-height: 32px;
        color: #e6e7e9;
        font-size: 20px;
        border-radius: 2px;
        position: absolute;
        left: 0;
        bottom: -2px;
      }
      .detail {
        cursor: pointer;
        width: 62px;
        line-height: 32px;
        color: white;
        font-size: 12px;
        text-align: center;
        background-color: #75c74f;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        i {
          font-style: normal;
          display: block;
          margin-left: 4px;
        }
      }
      .single {
        width: 62px;
        line-height: 32px;
        color: white;
        font-size: 12px;
        text-align: center;
        background-color: #f52d56;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-style: normal;
          margin-right: 4px;
          display: block;
        }
      }
    }
  }
}
/*滚动条样式*/
.productList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.productList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.productList::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.footer {
  margin-right: 20px;
  height: 119px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  position: relative;
  .footer-right {
    #pagination {
      margin: 0;
    }
  }
}
</style>




