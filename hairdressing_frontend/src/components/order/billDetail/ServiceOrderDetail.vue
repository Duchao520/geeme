<template>
  <el-dialog :visible="infoVisible" width="380px" @close="$emit('handleClose')">
    <div class="container_">
      <div class="contain_">
        <div class="close" @click="$emit('handleClose')">
          <i class="icon iconfont icon-icon_close"></i>
        </div>
        <div class="leftInner">
          <img src="@/assets/img/bg_order_top_long.png" class="bgimg"/>
          <div class="title">
            <h4 style="font-size:18px;margin-right:6px;color:#333333">{{detail.brandName}}</h4>
            <p style="font-size:16px;color:#666666">{{detail.shopName}}</p>
          </div>
          <div class="detail-line">
            <div class="circle cl"></div>
            <div class="circle cr"></div>
            <div class="inline"></div>
            <p>消费明细</p>
            <div class="inline"></div>
          </div>
          <div class="detail-box">
            <div class="detail-container-product-service">
              <goods-detail :cardName="detail.cardName" :goodsList="goodsList"></goods-detail>
            </div>
            <div class="detail-container-card">
              <card-detail :cardList="cardList"></card-detail>
            </div>
          </div>
          <div class="money-info" style="margin-top:10px;">
            <div class="order-info-line">
              <div></div>
              <span>消费总金额</span>
              <div></div>
            </div>
            <h3>￥{{detail.finalPrice}}</h3>
          </div>
          <div class="money-info">
            <div class="order-info-line">
              <div></div>
              <span>服务单信息</span>
              <div></div>
            </div>
            <div class="order-info-d">
              <p>
                <span>下单时间</span>
                <span>{{detail.createTime}}</span>
              </p>
              <p>
                <span>服务时间</span>
                <span>{{detail.serviceTime}}</span>
              </p>
              <p>
                <span>服务单号</span>
                <span>{{detail.serialCode}}</span>
              </p>
              <p>
                <span>纸单号</span>
                <span>{{detail.paperOrderId || '-'}}</span>
              </p>
              <p>
                <span>客户姓名</span>
                <span>{{detail.customerName}}</span>
              </p>
              <p>
                <span>客户手机号</span>
                <span>{{detail.mobile}}</span>
              </p>
              <p>
                <span>开单人</span>
                <span>{{detail.staffName || '-'}}</span>
              </p>
              <p>
                <span>收银员</span>
                <span>{{detail.cashierName}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  // 这个是收款台的详情组件
  import * as utils from "@/assets/js/utils";
  import GoodsDetail from "./GoodsDetail";
  import CardDetail from "./CardDetail";
  import {mapState} from "vuex";
  export default {
    components: {CardDetail, GoodsDetail},
    data() {
      return {
        utils: utils
      };
    },
    props: {
      infoVisible: Boolean,
      detail: Object
    },
    computed: {
      goodsList() {
        return (this.detail.consumerGoodsOrderInfoList || []);
      },
      cardList() {
        return (this.detail.listConsumerOrderCardInfo || []);
      },
      ...mapState({
        userInfo:state=>state.manage.userInfo
      }),
    },
    methods: {
      transfer(img) {
        if (!img) {
          return "";
        } else {
          return img.replace(/[\[,\]]/g, "").split(" ")[0];
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  /deep/ .el-dialog__body {
    padding: 0;
    background: transparent;
    margin-top: -54px;
  }

  .container_ {
    width: 100%;
    height: 750px;
    background: #f1f2f7;
    box-sizing: border-box;
    padding: 20px 16px;
    border-radius: 5px;
    color: #999999;

    .contain_ {
      width: 100%;
      height: 100%;
      background: #fff;
      position: relative;

      .close {
        position: absolute;
        top: 15px;
        right: 10px;
        cursor: pointer;
        z-index: 9;

        .icon-icon_close {
          font-size: 20px;
        }
      }
    }
  }

  .leftInner {
    width: 343px;
    height: 686px;
    background: white;
    position: relative;

    .bgimg {
      position: absolute;
      width: 105%;
      left: -2%;
    }

    .title {
      box-sizing: border-box;
      padding-left: 16px;
      display: flex;
      line-height: 56px;
    }

    .detail-line {
      position: relative;
      box-sizing: border-box;
      padding: 0 16px;
      display: flex;
      align-items: center;

      .circle {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f1f2f7;
      }

      .cl {
        left: -10px;
      }

      .cr {
        right: -10px;
      }

      p {
        margin: 0 10px;
      }

      .inline {
        flex: auto;
        border-top: 1px dashed #efeff4;
      }
    }
  }

  .detail-box {
    // height: 335px;
    height: 310px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .detail-box::-webkit-scrollbar {
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }

  .detail-box::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  .detail-box::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .detail-container-product-service {
    box-sizing: border-box;
    padding: 0 15px;
  }

  .detail-container-card {
    box-sizing: border-box;
    padding: 5px 15px 0;
  }


  .money-info {
    box-sizing: border-box;
    padding: 0 16px;

    .order-info-line {
      display: flex;
      align-items: center;

      div {
        flex: auto;
        border-top: 1px dashed #efeff4;
      }

      span {
        margin: 0 10px;
      }
    }

    h3 {
      flex: auto;
      text-align: center;
      font-size: 20px;
      line-height: 60px;
      color: #f52d56;
    }

    .order-info-d {
      margin-top: 10px;

      p {
        display: flex;
        flex: auto;
        justify-content: space-between;
        line-height: 25px;

        span:nth-child(2) {
          color: #333333;
        }
      }
    }
  }
</style>
