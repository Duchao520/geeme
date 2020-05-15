<template>
  <div class="selected-service-item">
    <table class="service-product-table">
      <tr>
        <td colspan="2">
          <div class="top-detail">
            <div
              class="img"
              :style="{ backgroundImage:`url(${utils.formatPicImage(detail.image, 'style', 40)})` }"
            ></div>
            <div class="detail">
              <p class="service-name">
                <span>{{ detail.name }}</span>
              </p>
              <p class="meal">
                {{ detail.specificationName}} &nbsp;&nbsp;
                <span
                  v-show="detail.goodsType==='service' && detail.specificationTime"
                >{{ detail.specificationTime }}分钟</span>
              </p>
              <p class="price">
                <span class="member-level-name">{{billInfo.customerInfo.memberLevel || '会员'}}价</span>
                <!-- 这里显示的是：会员价（普通会员价或者会员级别会员价||或者是生日专享价） -->
                <span class="member-price">
                  ￥
                  <dynamic-num
                    :number="billInfo.compareMemberLevelPrice[key] ? billInfo.compareMemberLevelPrice[key].price : detail.memberPrice"
                  ></dynamic-num>
                </span>
                <span class="shop-price">¥{{ detail.shopPrice }}</span>
              </p>
            </div>
            <div class="detail-right">
              <i class="icon iconfont icon-icon_operate_delete" @click="deleteGoods" title="删除"></i>
              <span class="num">
                <number-input
                  :disabled="detail.paymentStatus"
                  v-model="count"
                  :min="1"
                  :max=" detail.stock|| 10000"
                  :decimal="false"
                  @input="handleServiceCountChange"
                ></number-input>
              </span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="service-staff-line">
          <div class="service-work-stations">
            <div
              class="service-work-stations-content"
              v-for="n in detail.workStationCount"
              :key="n"
            >
              <!-- 3个工位组件 -->
              <service-staff
                :total="detail.workStationCount"
                :count="n"
                :index="index"
                :staffList="n === 1 ? (detail.stationOne || []) : n === 2 ? (detail.assistantOrSalers || []) : (detail.stationThree || [])"
                @setStationStaff="handleSetStationStaff"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr v-if="!detail.paymentStatus">
        <td class="store-preference" colspan="2">
          <div>
            <p>门店优惠</p>
            <p class="input">
              <span>-</span>
              <number-input
                v-model="storePreference"
                :max="tempPrice * (detail.count || 1)"
                @input="handleStorePreferenceChanged"
              />
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="detail-footer">
            <div class="order-type">
              <span>{{detail.online ? '线上订单' : '门店开单'}}</span>
              <div
                class="order-status"
                :class="{already: detail.paymentStatus}"
              >{{detail.paymentStatus ? '已支付' : '未支付'}}</div>
            </div>
            <span class="pay">
              {{detail.paymentStatus ? '实付' : '应付'}}
              <span class="money">
                ¥
                <dynamic-num
                  :number="detail.paymentStatus ? detail.received : Number((tempPrice * detail.count - detail.storePreference).toFixed(2))"
                />
              </span>
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="remark">
          <div class="remark-content">
            <span>备注：</span>
            <el-input
              type="text"
              maxlength="120"
              placeholder="添加备注"
              v-model.trim="storeRemark"
              class="input remark-input"
              @change="handleRemarksChanged"
            />
          </div>
        </td>
      </tr>
    </table>
    <DutyAndPerformanceDialog
      :goods="detail"
      v-if="showDialog === 'dutyDialog'"
      :visible="showDialog === 'dutyDialog'"
      :workStationIndex="editWorkStationIndex"
      :workStation="currentIndexStaffs"
      @close="showDialog = null"
      @editStaffsForGoods="handleGetEditedWorkStations"
    />
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapState, mapActions } from "vuex";
import serviceStaff from "./serviceStaff";
import DutyAndPerformanceDialog from "./dutyAndPerformanceDialog.vue";
export default {
  props: {
    detail: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      utils,
      count: null,
      storeRemark: null,
      storePreference: null,
      stationOne: [],
      stationThree: [],

      // 工位编辑
      showDialog: null, // 'dutyDialog'
      editWorkStationIndex: null, // 1.2.3
      currentIndexStaffs: [] // 编辑工位员工的当前vuex值
    };
  },
  mounted() {
    // 生命周期不要改
    this.count = this.detail.count;
    this.storeRemark = this.detail.storeRemark;
    this.storePreference = this.detail.storePreference;
    this.stationOne = this.detail.stationOne;
    this.stationThree = this.detail.stationThree;
    this.assistantOrSalers = this.detail.assistantOrSalers;
  },
  methods: {
    ...mapActions(["setSelectedGoodsValue"]),
    // 编辑工位弹窗
    handleSetStationStaff(n) {
      // 赋值第几工位弹窗
      this.editWorkStationIndex = n;
      this.showDialog = "dutyDialog";
      let arr = ["stationOne", "assistantOrSalers", "stationThree"];
      let currentKey = arr[n - 1];
      this.currentIndexStaffs = this.detail[currentKey];
      this.currentIndexStaffs.map(i => {
        i.name = i.staffName
      })
    },
    // 工位员工及业绩比例数据回调
    handleGetEditedWorkStations(data) {
      // editWorkStationIndex 当前操作的工位
      console.log(data);
      data.map(i => {
        i.percent = i.ratio;
        i.postId = i.levelId;
        i.postName = i.levelName;
        i.sellerStaffId = i.staffId;
        i.staffName = i.name;
      });
      let arr = ["stationOne", "assistantOrSalers", "stationThree"];
      let currentKey = arr[this.editWorkStationIndex - 1];
      this.setSelectedGoodsValue({
        index: this.index,
        [currentKey]: data
      });
      this.showDialog = null;
    },
    // 删除服务（可能是取单的, delete => true）
    deleteGoods() {
      this.$emit("toDeleteGoods");
    },
    // 规格数量变化
    handleServiceCountChange(n) {
      this.setSelectedGoodsValue({
        count: n,
        index: this.index,
        tempFinalPrice: Number(
          (n * this.tempPrice - this.detail.storePreference).toFixed(2)
        )
      });
    },
    // 门店优惠变化
    handleStorePreferenceChanged(price) {
      this.setSelectedGoodsValue({
        index: this.index,
        storePreference: price,
        tempFinalPrice: Number(
          (this.detail.count * this.tempPrice - price).toFixed(2)
        )
      });
    },
    // 门店备注
    handleRemarksChanged(value) {
      this.setSelectedGoodsValue({ index: this.index, storeRemark: value });
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
    key() {
      return `${this.detail.goodsType}_${this.detail.specificationId}`;
    },
    tempPrice() {
      let price =
        this.billInfo.compareMemberLevelPrice[this.key] && this.billInfo.compareMemberLevelPrice[this.key].price >= 0 // 注意undefined
          ? this.billInfo.compareMemberLevelPrice[this.key].price
          : this.detail.memberPrice;
      return price;
    }
  },
  watch: {
    tempPrice: {
      handler: function(v, o) {
        // 监听一下就行了, 不监听会有问题
        // console.log('未服务的订单会到这里...')
        this.handleServiceCountChange(this.detail.count);
        this.handleStorePreferenceChanged(this.detail.storePreference);
      },
      immediate: true
    },
    // 'billInfo.customerInfo.id': { // 这里监听没用， 在index.vue加了3行代码暂时应付...
    //   handler: function(v, o) {
    //     // 监听一下
    //     // this.handleServiceCountChange(this.detail.count)
    //     // this.handleStorePreferenceChanged(this.detail.storePreference)
    //   },
    // }

    // 结算组件的改变
    "detail.storePreference": {
      handler: function(v, o) {
        this.storePreference = v;
      },
      immediate: true
    },
    "detail.storeRemark": {
      handler: function(v, o) {
        this.storeRemark = v;
      },
      immediate: true
    }
  },
  components: { serviceStaff, DutyAndPerformanceDialog }
};
</script>
<style lang='scss' scoped>
.service-product-table {
  width: calc(100% - 2px);
  border-collapse: collapse;
  box-sizing: border-box;
  font-size: 12px;
  > tr {
    > td {
      border: 1px solid #f0f1f4;
    }
  }
  .top-detail {
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .img {
      width: 65px;
      height: 65px;
      display: inline-block;
      vertical-align: top;
      background-position: center;
      background-size: cover;
    }
    .detail {
      flex: auto;
      box-sizing: border-box;
      padding: 0 10px;
      .service-name {
        font-size: 14px;
      }
      .meal {
        color: #999999;
        line-height: 24px;
      }
      .price {
        .member-level-name {
          display: inline-block;
          line-height: 18px;
          border-radius: 9px;
          font-size: 12px;
          color: #ff6d61;
          background-color: rgba(255, 109, 97, 0.2);
          padding: 0 7px;
        }
        .member-price {
          color: #ff6d61;
          font-size: 14px;
          margin-right: 6px;
        }
        .shop-price {
          color: #999999;
          position: relative;
          text-decoration: line-through;
        }
      }
    }
    .detail-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      .iconfont {
        color: #bec3c6;
        cursor: pointer;
        border: 5px solid transparent;
        border-top: none;
        transition: all 0.6s;
        &:hover {
          color: #999999;
        }
      }
      /deep/ .el-input__inner {
        width: 45px;
        height: 32px;
        text-align: center;
      }
    }
  }
  .second-line-detail {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    > div {
      box-sizing: border-box;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      .iconfont {
        color: #58c9f3;
      }
    }
  }
  .second-line-detail.staff-open {
    min-width: 100px;
  }
  .second-line-detail.commission {
    max-width: 72%;

    .assist-items {
      // width: 180px;
      width: 300px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .store-preference {
    > div {
      box-sizing: border-box;
      padding: 0 10px;
      line-height: 40px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .input {
        display: flex;
        span {
          margin-right: 5px;
        }
        /deep/ .el-input__inner {
          width: 45px;
          height: 32px;
          text-align: center;
        }
      }
    }
  }
  .detail-footer {
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 10px;
    .order-type {
      display: flex;
      align-items: center;
      .order-status {
        width: 50px;
        height: 18px;
        line-height: 18px;
        margin-left: 10px;
        background: #ff6d61;
        text-align: center;
        border-radius: 9px;
        color: white;
      }

      .already {
        background: #a9d86e;
      }
    }
    .pay {
      .money {
        color: #ff6d61;
      }
    }
  }
  .remark {
    height: 40px;
    line-height: 40px;
    .remark-content {
      box-sizing: border-box;
      padding: 0 10px;
      display: flex;
      align-items: center;
      white-space: nowrap;
      .input {
        border: none;
        font-size: 12px;
        outline: none;
        display: block;
        transition: all 0.4s;
        flex: auto;
        margin-right: 10px;
        &::placeholder {
          color: #bbb;
        }
        &:focus {
          flex: auto;
        }
      }
      .iconfont {
        color: #58c9f3;
        cursor: pointer;
      }
      /deep/ .el-radio-button__inner {
        padding: 0 8px;
        line-height: 22px;
        font-size: 12px;
        border-color: #58c9f3;
      }
      /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: #58c9f3;
      }
      // 物流&自提  禁用的字体 ↓↓↓
      /deep/ .is-disabled span {
        color: rgb(96, 98, 102);
      }
      /deep/ .is-active.is-disabled span {
        color: #fff;
      }
      // 物流&自提  禁用的字体 ↑↑↑
    }
  }
}

// 工位
.service-staff-line {
  padding: 4px;
  .service-work-stations {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    align-content: center;
    justify-content: space-between;
  }
  .service-work-stations-content {
    flex: 1;
    min-height: 50px;
    max-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
  }
  .service-work-stations-content + .service-work-stations-content {
    border-left: 1px solid #f0f1f4;
  }
}

.remark-input /deep/ .el-input__inner {
  border: none;
  font-size: 12px;
  outline: none;
  display: block;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  -webkit-box-flex: 1;
  -ms-flex: auto;
  flex: auto;
  margin-right: 10px;
}
</style>
