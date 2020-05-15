<template>
  <el-dialog :visible="true" width="800px" :before-close="handleClose" :append-to-body="true">
    <p class="title" slot="title">选择订单</p>
    <div class="top-line"></div>
    <div class="choose-order-root">
      <p style="line-height:32px">查选的该顾客在本店有{{unServicedOrderLists.length}}笔尚未服务/发货订单，是否选择：</p>
      <div
        class="orders"
        v-for="(item,index) in unServicedOrderLists"
        :key="index"
        :style="{'background':!item.available?'#F4F5F7':'white','border':`1px solid${!item.available?'transparent':'#DEE1E6'}`}"
      >
        <div class="title">
          <span>订单号：{{item.serialCode}}</span>
          <span>{{item.orderTime}}</span>
        </div>
        <div class="content-box">
          <el-checkbox v-model="item.selected" :disabled="item.disabled || !item.orderEnable"></el-checkbox>
          <img :src="utils.formatPicImage(item.image, 'style', 70, 'someone')" alt="图片" class="img" />
          <div class="detail">
            <p>{{item.serviceName}}</p>
            <span>
              {{item.specificationName}}
              <span
                v-if="item.goodsType==='service'&&item.serverTime"
              >{{item.serverTime}}分钟</span>
            </span>
          </div>
          <div class="price">
            <div> ￥{{item.shopPrice}}</div>
            <div>{{item.goodsType === 'service' ? '门店价' : '专柜价'}}</div>
          </div>
          <div class="number">X{{item.count}}</div>
          <div class="received">
            <div> ￥{{item.paymentStatus ? item.received || 0 : '-'}}</div>
            <div>{{item.paymentStatus ? '实收款' : '未支付'}}</div>
          </div>
          <div class="status-text">
            <status-text :type="bgColor[item.orderStatus]" :name="item.orderStatus" class="btn"></status-text>
          </div>
        </div>
        <div class="warning-tip" v-if="!item.orderEnable">该订单客户已申请退款，无法开单，建议您找客户沟通后，再做后续操作。</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as datas from "@/assets/js/datas";
import { mapState } from "vuex";
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import { mapActions } from "vuex";
import * as axios from "@/util/axios";


export default {
  name: "ChooseOrder",
  data() {
    return {
      bgColor: {
        待发货: "hong",
        待服务: "blue"
      },
      utils: utils
    };
  },
  props: {
    unServicedOrderLists: Array,
    levelId: Number,
    origin: String,
    showReBillingButton: {
      type: Boolean,
      default: true
    },
    staffInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    currentRouter() {
      return this.$route.path;
    }
  },
  methods: {
    ...mapActions(["saveOnTheWayOrderIds", "saveStaffInfo", "setSelectedGoods"]),
    handleClose() {
      this.$emit("close");
    },

    async confirm() {
      let selectedUnservicedOrder = this.unServicedOrderLists.filter(item => {
        return item.selected;
      });
      if (this.currentRouter.split("/").pop() === "choose-service") {
        this.$emit("chooseUnServicedServices", selectedUnservicedOrder);
        this.$emit("close");
        return;
      }
      this.saveOnTheWayOrderIds(
        selectedUnservicedOrder.map(item => {
          return {
            id: item.goodsOrderId,
            type: item.goodsType
          };
        })
      );
      // 在这里做v2的vuex数据处理
      console.log(this.staffInfo)
      let idAndTypeLen = selectedUnservicedOrder.map(item => {
          return {
            id: item.goodsOrderId,
            type: item.goodsType
          };
        })
      try {
        const res = await axios.post('createConsumerOrderFromAppointment', {
          appointmentId: this.staffInfo.id,
          productOrderIds: idAndTypeLen.filter(i => i.type == 'product').map(i => i.id),
          serviceOrderIds: idAndTypeLen.filter(i => i.type == 'service').map(i => i.id)
        })
        let serviceInfos = res.serviceInfos.map(i => {
          return {
            ...i, // 这行不要写在下方[需覆盖]后面
            id: this.staffInfo.id, // 预约取单id？
            deleted: false, // 是否删除
            name: i.serviceName,
            memberPrice: i.price, // 对应的规格的会员价
            storeRemark: this.staffInfo.frontDeskNotes, // 门店备注
            storePreference: 0, // 门店优惠
            shopPrice: i.storePrice, // 对应的规格的门店价
            enableCardDiscount: true, // 是否允许卡打折???
            tempFinalPrice: i.paymentStatus ? 0 : i.price * i.count, // 临时最终价 - 同规格会员价(这个数字是要乘数量的)
            staffId: this.staffInfo.staffId, // 作为开单人
            staffName: this.staffInfo.staffName, // 作为开单人
            assistantOrSalers: [], // 工位2， 销售人?
            stationThree: [], // 工位3
            stationOne: [
              // 工位1
              {
                // 开单人自动加入第一工位
                ratio: 100, // 业绩比例
                isChosen: true, // 非指定
                staffName: this.staffInfo.staffName,
                staffId: this.staffInfo.staffId,
                shopNum: 100,
                levelId: this.staffInfo.staffLevelId,
                headPortrait: "",
                levelName: ""
              }
            ]
          };
        });
        this.setSelectedGoods(serviceInfos);
        this.$router.push("/shop-inner/choose-person");
      } finally {

      }
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  color: #333333;
  font-weight: 600;
}

/deep/ .el-dialog__body {
  padding: 0;

  .top-line {
    width: 100%;
    border-top: 1px solid #f0f1f4;
    margin: 10px 0;
  }

  .choose-order-root {
    width: 100%;
    margin-top: -20px;
    box-sizing: border-box;
    padding: 20px;
    max-height: 540px;
    overflow-y: auto;

    .orders {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 20px;
      border-radius: 5px 5px 0 0;

      .title {
        background: #dee1e6;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        color: #5f6368;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 15px;
        border-radius: 5px 5px 0 0;
      }

      .content-box {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .img {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          border: 1px solid #efefee;
          margin: 0 8px 0 15px;
        }

        .detail {
          font-size: 12px;
          color: #333333;
          width: 174px;

          p {
            line-height: 18px;
          }

          span {
            color: #999999;
            line-height: 24px;
          }
        }

        .price {
          // line-height: 84px;
          margin: 0 20px 0 20px;
          // color: #ff6d61;
        }
        .received {
          margin: 0 20px 0 20px;
          color: #ff6d61;
        }
        .btn {
          margin-left: 80px;
        }
        .status-text{
          padding-right: 20px;
        }
      }

      .warning-tip {
        line-height: 17px;
        font-size: 12px;
        color: #f52d56;
        padding-bottom: 10px;
        margin: -10px 0 0 50px;
      }
    }
  }
}
</style>
