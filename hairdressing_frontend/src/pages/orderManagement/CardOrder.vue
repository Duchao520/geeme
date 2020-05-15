<template>
  <div id="gm_service_order" class="service_list_condition-con">
    <div class="service_list_condition">
      <div class="condition-left">
        <div class="label_area">
          <div class="head-first-line">
            <div class="first-line-filter">
              <div class="first-line-filter-item">
                <span class="span">交易场景：</span>
                <el-select v-model="orderSource" placeholder="全部" @change="query()">
                  <el-option
                    v-for="(item,index) in [{en:'全部',value:-1},{en:'线上订单',value:1},{en:'门店订单',value:0} ]"
                    :key="index"
                    :label="item.en"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="first-line-filter-item">
                <span class="span">卡项类型</span>
                <el-select v-model="cardType" placeholder="全部" @change="query()">
                  <el-option
                    v-for="(item,index) in [{en:'全部',value:-1},{en:'身份卡',value:0},{en:'储值卡',value:1},{en:'次卡',value:2},{en:'时间卡',value:3}]"
                    :key="index"
                    :label="item.en"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <input-search
              width="280px"
              placeholder="订单号/客户姓名/手机号"
              @search="query()"
              v-model="searchString"
            ></input-search>
          </div>
          <div class="head-second-line">
            <span class="orderTime" v-if="isBrand">所属门店：</span>
            <el-select v-model="pitchStoreId" placeholder="请选择" v-if="isBrand">
              <el-option
                v-for="item in storeOptions"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              ></el-option>
            </el-select>
            <span class="orderTime" style="margin-left: 10px;">下单时间：</span>
            <el-radio-group v-model="timeLimit" @change="query()">
              <el-radio-button
                :label="item.value"
                style="margin-left:0;"
                v-for="(item,index) in [{en:'全部',value:'all'},{en:'近3天',value:'threeDay'},{en:'近7天',value:'sevenDay'}]"
                :key="index"
              >{{item.en}}</el-radio-button>
            </el-radio-group>
            <el-date-picker
              @change="query()"
              style="margin-left:10px;"
              v-model="timeLimit"
              :clearable="false"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="data-static" v-loading="staticLoad">
      <p class="static-text">统计</p>
      <div class="sort-title">
        <span class="span_1">客户数：</span>
        <span class="span_2">{{staticData.customerCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">订单数：</span>
        <span class="span_2">{{staticData.orderCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">卡项数：</span>
        <span class="span_2">{{staticData.goodsCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">订单金额：</span>
        <span class="span_2">{{'￥' + (staticData.totalAmount || '0.00')}}</span>
      </div>
    </div>

    <div class="service_container" v-loading="tableLoading" style="margin-top:10px;">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="tabStatus" @tab-click="query()">
          <el-tab-pane
            v-for="(item, index) in [{code:'openCard',en:'开卡'},{code:'addCard',en:'续卡充值'},{code:'freeCard',en:'自由卡'}]"
            :key="index"
            :name="item.code"
            :label="item.en"
            v-model="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-contain">
        <div class="table-wrapper">
          <table cellspacing="0" cellpadding="0" class="table">
            <tr class="table-head">
              <th class="align-left">卡项名称</th>
              <th>基本权益</th>
              <th>有效期限</th>
              <th>售价/充值</th>
              <th>赠送</th>
              <th>实收款</th>
              <th>客户</th>
              <th>销售人</th>
              <th>操作</th>
            </tr>
            <tbody v-for="(order, index) in cardOrderList" :key="index" class="table-body">
              <tr class="title-tr">
                <td colspan="9" class="td-title align-left">
                  <i
                    class="icon iconfont icon-icon_tag_online icon_top_store"
                    v-if="order.orderSource === 1"
                  ></i>
                  <i
                    class="icon iconfont icon-icon_top_store icon_top_store"
                    v-if="order.orderSource === 0"
                  ></i>
                  <span style="margin:0 20px 0 0;" v-if="order.orderSource === 1">线上订单</span>
                  <span style="margin:0 20px 0 0;" v-if="order.orderSource === 0">门店开卡</span>
                  <span>订单号：{{order.orderNo}}</span>
                  <span style="margin:0 15px;">{{order.createTime}}</span>
                  <span
                    v-if="isBrand"
                  >下单门店：{{currentShopInfo.brandName}}&nbsp;&nbsp;{{order.storeName}}</span>
                </td>
              </tr>
              <tr class="tr-list">
                <td class="info-image">
                  <div class="info-box">
                    <div class="info-image-inner">
                      <img
                        :src="utils.formatPicImg(order.cardCover,'style',70)"
                        alt="会员卡"
                        class="card-image"
                      />
                      <p class="card-type">{{cardTypeMatch[order.cardType]}}</p>
                    </div>
                    <div class="text" style="position: relative;">
                      <p>{{order.cardName}}</p>
                      <span>{{order.cardNo}}</span>
                      <div class="img-tag" v-if="order.isUpgrade">升</div>
                    </div>
                  </div>
                </td>
                <td>
                  <p v-for="(item,index) in order.discountInfo.split(' ')" :key="index">{{item}}</p>
                </td>
                <td>{{order.validTime}}</td>
                <td class="big-text">{{order.chargeNum}}</td>
                <td class="big-text">{{order.giftNum}}</td>
                <td>
                  <div>
                    <p style="color:#FF6D61;font-size:14px">{{order.received}}</p>
                    <p style="color:#41CAC0">{{order.payType}}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{{order.businessName}}</p>
                    <p>{{order.customerPhone}}</p>
                  </div>
                </td>
                <td>
                  <p
                    v-for="(item,index) in (JSON.parse(order.sellers)|| []).map(item=>{return item})"
                    :key="index"
                  >{{item.staffName}} {{shopStaffsInfo[item.sellerStaffId] ? `(${shopStaffsInfo[item.sellerStaffId]})` : ''}}</p>
                </td>
                <td>
                  <p class="orderDetail" @click="lookDetail(order)">订单详情</p>
                </td>
              </tr>
              <tr class="button-tr">
                <td colspan="9">
                  <g-button
                    type="remark"
                    name="备注"
                    icon="icon_operate_edit"
                    @click="remarkOrder(order)"
                  ></g-button>
                </td>
              </tr>
              <tr style="height:20px;" v-if="index!==cardOrderList.length-1">
                <td colspan="9"></td>
              </tr>
            </tbody>
            <tr>
              <td colspan="9">
                <order-default-text
                  v-if="cardOrderList&&cardOrderList.length===0 || !cardOrderList"
                ></order-default-text>
              </td>
            </tr>
          </table>
        </div>

        <el-pagination
          style="margin-top:20px;"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="page.totalCount"
        ></el-pagination>
      </div>
    </div>
    <v-btn-remark
      ref="btnRemark"
      :btnReamrkVisible="showBtnRemark"
      @closeRemark="showBtnRemark=false"
      @confirmRemark="submitDesc"
    ></v-btn-remark>
  </div>
</template>

<script>
import "@/assets/css/base.scss";
import "@/assets/css/tab.scss";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import BtnRemark from "@/components/orderManagement/BtnRemark";
import OrderDefaultText from "@/components/order/OrderDefaultText";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    "v-btn-remark": BtnRemark,
    "order-default-text": OrderDefaultText
  },
  data() {
    return {
      utils: utils,
      pitchStoreId: null,
      // 门店列表
      storeOptions: [],
      cardType: -1,
      tabStatus: "openCard",
      showBtnRemark: false,
      orderSource: -1,
      timeLimit: "all",
      searchString: "",
      payway: "ALL",
      page: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 20
      },
      cardOrderList: [],
      tableLoading: false,
      cardTypeMatch: {
        0: "身份卡",
        1: "储值卡",
        2: "次卡",
        3: "时间卡"
      },
      orderId: null,
      staticData: {},
      staticLoad: false
    };
    /**
     * [{en:'全部',value:-1},{en:'身份卡',value:0},{en:'储值卡',value:1},{en:'次卡',value:2},{en:'时间卡',value:3}]
     */
  },
  computed: {
    ...mapState({
      shopStaffsInfo: state => state.shopStaffsInfo.infoMap // -员工编号
    }),
    params() {
      let start, end;
      if (Array.isArray(this.timeLimit)) {
        end = this.timeLimit[1];
        start = this.timeLimit[0];
      } else {
        end = utils.getZeroTime(1);
        switch (this.timeLimit) {
          case "threeDay":
            start = utils.getZeroTime(-2);
            break;
          case "sevenDay":
            start = utils.getZeroTime(-6);
            break;
          case "all":
            start = "2019-01-01 00:00:00";
            break;
          case null:
            start = "2019-01-01 00:00:00";
            break;
        }
      }
      return {
        beginDay: start,
        cardType: this.cardType,
        endDay: end,
        lastDays: null,
        orderSource: this.orderSource,
        pageNum: this.page.currentPage - 1,
        pageSize: this.page.pageSize,
        searchString: this.searchString,
        storeId: this.isBrand ? this.pitchStoreId : this.currentInfo.shopId,
        brandId: this.currentInfo.brandId
      };
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    // 品牌标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
    currentShopInfo() {
      return this.$store.state.manage.currentShopInfo;
    }
  },
  mounted() {
    this.getDataStatic();
    this.getStores();
    this.query();
    if (!this.isBrand) {
      this.setStaffsInfo();
    }
  },
  methods: {
    ...mapActions([
      "setStaffsInfo" // - 员工的店内编号
    ]),
    // 获取门店列表
    getStores() {
      axios
        .get(`/getStoreListByBrandId/${this.currentInfo.brandId}`)
        .then(res => {
          this.storeOptions = res.storeBasicInfoList || [];
          this.storeOptions.unshift({
            storeId: null,
            storeName: "全部"
          });
        });
    },
    // 获取统计数据
    async getDataStatic() {
      this.staticLoad = true
      try {
        let params = {
          beginDay: this.params.beginDay,
          brandId: this.currentInfo.brandId,
          goodsType: 3,
          cardType: this.cardType,
          endDay: this.params.endDay,
          orderSource: this.orderSource,
          storeId: this.params.storeId
        };
        const res = await axios.post("/getOrderSumInfo", params);
        this.staticData = res;
      } finally {
      this.staticLoad = false
      }
    },
    query() {
      // var url =
      //   this.tabStatus === "openCard"
      //     ? api.pagedQueryBasicCreateCardOrderInfo.URL
      //     : api.pagedQueryBasicRenewalCardOrderInfo.URL;
      this.getDataStatic()
      let url = "";
      switch (this.tabStatus) {
        case "openCard":
          url = "/pagedQueryBasicCreateCardOrderInfo";
          break;
        case "addCard":
          url = "/pagedQueryBasicRenewalCardOrderInfo";
          break;
        case "freeCard":
          url = "/pagedQueryBasicFreeCreateCardOrderInfo";
          break;
      }
      this.tableLoading = true;
      axios.post(url, this.params).then(res => {
        this.tableLoading = false;
        this.cardOrderList = res.listBasicCreateCardOrderInfo;
        this.page.totalCount = res.total;
        console.log(this.cardOrderList);
      });
    },
    handleCurrentChange(page) {
      this.page.currentPage = page;
      this.query();
    },
    lookDetail(data) {
      let position = this.isBrand ? 'brand' : 'shop'
      window.open(
        `#/${position}-inner/card-order-detail?orderId=${data.orderId}`,
        "_blank"
      );
    },
    submitDesc(remarks) {
      axios
        .put(api.modifyCardOrderRemarks.URL, {
          remarks: remarks,
          orderId: this.orderId
        })
        .then(res => {
          this.showBtnRemark = false;
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.success ? "修改备注成功" : res.message
          });
          this.query();
        });
    },
    remarkOrder(data) {
      this.orderId = data.orderId;
      this.showBtnRemark = true;
      this.$refs.btnRemark.remark = data.remarks;
    }
  },
  watch: {
    pitchStoreId(val) {
      this.handleCurrentChange(1);
    }
  },
};
</script>
<style lang="scss" scoped>
.service_list_condition-con {
  box-sizing: border-box;
  padding: 20px;

  .service_list_condition {
    background: white;
    box-sizing: border-box;
    padding: 15px;
    padding-bottom: 5px;
    border-radius: 5px;

    .condition-left {
      flex: 1;

      /deep/ .el-radio-button__inner {
        padding: 10px 20px;
      }
    }
  }

  .service_container {
    border-radius: 8px 8px 0 0;
    margin-top: 15px;
    background: #fff;
    padding-bottom: 20px;
  }

  .align-left {
    text-align: left !important;
  }

  .table-contain {
    margin: 0 20px;

    .table {
      width: 100%;
      color: #333333;

      .table-head {
        height: 50px;
      }

      .table-body,
      .table-head {
        th {
          font-size: 14px;
          font-weight: 400;
        }

        td {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
        }

        .title-tr {
          height: 32px;
          border: 2px solid red;
          color: #9b9b9b;


          .td-title {
            border: 1px solid #ebebeb;
            font-size: 12px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            background: #dee1e6;
          }
        }

        .tr-list {
          td:nth-child(1) {
            border-left: 1px solid #ebecf0;
          }

          td:last-child {
            border-right: 1px solid #ebecf0;
          }

          td {
            line-height: 24px;
            font-size: 12px;
          }

          .info-image {
            padding: 15px 0 15px 15px;
            text-align: left;

            .info-box {
              display: flex;

              .info-image-inner {
                position: relative;
                height: 60px;

                .card-image {
                  display: inline-block;
                  width: 94px;
                  height: 60px;
                  border-radius: 4px;
                }

                .card-type {
                  position: absolute;
                  bottom: 8px;
                  right: 7px;
                  width: 48px;
                  height: 17px;
                  border-radius: 8px;
                  color: #666666;
                  font-size: 12px;
                  line-height: 17px;
                  text-align: center;
                  background: #ffffff;
                }
              }

              .text {
                padding-left: 15px;

                p {
                  font-size: 16px;
                  line-height: 28px;
                  color: #333333;
                }

                span {
                  font-size: 12px;
                  height: 20px;
                  color: #999999;
                }
              }
            }
          }

          .big-text {
            font-size: 14px;
          }
        }

        .button-tr {
          height: 48px;

          td {
            border: 1px solid #ebecf0;
            text-align: right;
            vertical-align: middle;
            padding-right: 5px;

            .btn {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }

  .head-first-line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    .first-line-filter {
      display: flex;

      .first-line-filter-item {
        margin-right: 20px;

        .span {
          font-size: 14px;
        }

        /deep/ .el-input__inner {
          width: 140px;
          height: 35px;
        }

        /deep/ .el-select .el-input .el-select__caret {
          line-height: 35px;
        }
      }
    }
  }

  .head-second-line {
    display: flex;
    align-items: center;

    .orderTime {
      font-size: 14px;
      color: #333333;
    }

    /deep/ .el-input__icon,
    /deep/ .el-input__inner {
      height: 36px;
      line-height: 36px;

      .el-range-separator {
        line-height: 28px;
      }
    }
  }

  .icon_top_store {
    color: white;
    background: rgba(0, 207, 130, 1);
    margin-left: 10px;
    border-radius: 3px;
  }

  .iconfont {
    margin-right: 4px;
  }

  .orderDetail {
    line-height: 12px;
    color: #58c9f3;
    cursor: pointer;
  }
}
.img-tag {
  position: absolute;
  top: 4px;
  right: -20px;
  background: #75c74f;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
}

.data-static {
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: #fff;
  .static-text {
    padding: 5px 14px;
    background-color: #58c9f3;
    color: #fff;
    border-radius: 3px;
    font-size: 13px;
    text-align: center;
    line-height: 15px;
    margin-right: 20px;
  }
  .sort-title {
    font-size: 14px;
    margin-right: 20px;
    .span_1 {
      color: #B2B2B2;
    }
    .span_2 {
      color: #353535;
    }
  }
}
</style>
