<template>
  <div class="choose-goods-right-index">
    <!-- 单据信息部分 -->
    <div class="top-info">
      <!-- 服务时间 -->
      <div class="info-item service-time">
        <div v-if="billInfo.usbReaderCode">
          <div class="sign-text">
            <p class="sign-code">{{ billInfo.usbReaderCode.substring(billInfo.usbReaderCode.length - 3) }}</p>
            <p>服务号</p>
          </div>
          <div class="sign"></div>
        </div>
        <span class="item-title">服务时间:</span>
        <span class="item-value">
          <el-date-picker
            ref="datePicker"
            align="center"
            v-model="time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择服务时间"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="handleTimerChanged"
          ></el-date-picker>
        </span>
        <i class="icon iconfont icon-icon_operate_edit" @click="$refs.datePicker.focus()"></i>
      </div>
      <!-- 服务单号 -->
      <div class="info-item bottom-space" v-if="billInfo.serialCode">
        <span class="item-title">服务单号:</span>
        <span class="item-value">{{billInfo.serialCode}}</span>
      </div>
      <!-- 纸单单号 -->
      <div class="info-item">
        <span class="item-title">纸单单号:</span>
        <el-input
          v-model.trim="paperOrderId"
          style="width: 195px;"
          size="small"
          placeholder="如有纸单，请输入"
          :maxlength="18"
        />
      </div>
    </div>
    <!-- 客户信息部分 -->
    <div class="customer-info">
      <!-- 客户姓名 -->
      <div class="customer-info-item" v-if="!billInfo.serialCode">
        <span class="item-title">{{billInfo.customerInfo.id ? '已选' : '选择'}}客户:</span>
        <div class="box-item">
          <SelectCustomer ref="selectCustomer" :size="'small'" @choose="getUnServicedOrderList" />
        </div>
        <div class="box-item">
          <g-clickbtn title="新增" icon="icon_ope_append" @click="dialog = 'addCustomer'"></g-clickbtn>
        </div>
      </div>
      <!-- 最近客户 -->
      <div class="customer-info-item bottom-space">
        <div class="box-item">
          <HistoryCustomers v-show="!billInfo.consumerOrderId" @choose="getUnServicedOrderList" />
        </div>
      </div>
      <!-- 客户头像组件及是否计客 -->
      <div class="customer-info-item box-item-userbox" v-show="billInfo.customerInfo.id">
        <UserBox :list="[billInfo.customerInfo]" v-show="billInfo.customerInfo.id" />
        <!-- 取单时不可删除该单客户 -->
        <i
          v-show="billInfo.customerInfo.id && !billInfo.consumerOrderId"
          class="icon iconfont icon-icon_operate_delete"
          @click="clearCustomerInfo"
        ></i>
        <el-checkbox v-model="isCount" @change="handleIsCountChanged">计客数</el-checkbox>
      </div>
    </div>
    <!-- 商品列表部分 -->
    <div class="selected-goods-list scrollbar" ref="carPosition">
      <div class="goods-list">
        <div class="controler-line">
          <span
            class="list-count"
          >已选{{currentSelectedList === 'SelectedCardInCart' ? `卡项(${alreadySelectedListsLen})` : `服务/产品(${alreadySelectedListsLen})`}}</span>
          <span class="like-link" @click="handleClearCart">清空</span>
        </div>
        <component :is="currentSelectedList" />
      </div>
    </div>
    <!-- 结算按钮部分 -->
    <div class="footer-price-info">
      <BottomBillPrice />
    </div>
    <!-- 其他弹窗组件 -->
    <!-- 增加客户 -->
    <ChooseAddCustomer
      v-if="dialog === 'addCustomer'"
      :visible="dialog === 'addCustomer'"
      @close="dialog = null"
    />
    <!-- 未结算/服务 线上订单 -->
    <ChooseOrder
      v-if="dialog === 'unServicedOrder'"
      :visible="dialog === 'unServicedOrder'"
      @close="dialog = null"
      @chooseUnServicedServices="handleChooseUnServicedServices"
      :unServicedOrderLists="customerUnServicedOrderLists"
      :showReBillingButton="false"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import SelectCustomer from "@/components/appoModule/selectCustomer";
import ChooseAddCustomer from "./addCustomerDialog.vue"; // 复制自 chooseAddCustomer_order.vue
import HistoryCustomers from "./historyCustomers";
import UserBox from "@/components/appoModule/userBox";

import SelectedServiceOrProductInCart from "./selectedServiceOrProductInCart";
import SelectedCardInCart from "./selectedCardInCart";
import BottomBillPrice from "./suber/bottomBillPrice.vue";

import ChooseOrder from "@/pages/appointment/ChooseOrder";
export default {
  data() {
    return {
      utils,
      time: "", // 处理 ‘此刻’ 按钮 不能直接绑定数据到vuex
      isCount: true, // 是否计客数
      paperOrderId: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > +new Date();
        }
      },
      dialog: null, // 对应的弹窗
      customerUnServicedOrderLists: []
    };
  },
  mounted() {
    this.init();
    this.initPosition();
  },
  methods: {
    ...mapActions([
      "setServiceTime",
      "setIsCount",
      "saveCustomerInfo",
      "setCarPosition",
      "setSelectedGoods", // 保存当前选择的服务、产品
      "saveSelectedCard", // 保存当前选择的卡项
      "setCompareMemberLevelPrice",
      "deleteSelectedGoods",
      "setPaperId", // 纸单号
      "setSelectedCardsValue"
    ]),
    // 初始化服务数据 - 时间、计客数、单号...
    init() {
      // 服务时间
      if (this.billInfo.serviceTime) {
        this.time = this.billInfo.serviceTime;
      } else {
        let t = new Date().format("yyyy-MM-dd hh:mm");
        this.setServiceTime(t);
        this.time = t;
      }
      // 计客数
      this.isCount = this.billInfo.isCount;
      // 纸单号
      this.paperOrderId = this.billInfo.paperOrderId;
    },
    initPosition() {
      this.getCarPosition();
      window.onresize = function() {
        this.getCarPosition();
      }.bind(this);
    },
    getCarPosition() {
      const position = this.$refs.carPosition.getBoundingClientRect();
      this.setCarPosition({ x: position.x, y: position.y });
    },
    // 服务时间变化
    handleTimerChanged(time) {
      this.setServiceTime(time);
    },
    // 获取客户未核销的服务、产品订单(来自小程序的)
    getUnServicedOrderList() {
      let noCardGoods = ["service", "product"].includes(
        this.billInfo.currentLeftType
      );
      if (noCardGoods) {
        let params = {
          customerId: this.billInfo.customerInfo.id,
          storeId: this.currentInfo.shopId
        };
        axios.post("/getUnservicedOrderList", params).then(res => {
          if (!res.orderList || !res.orderList.length) return;
          let beforeArr = res.orderList.filter(i => i.paymentStatus);
          let afterArr = beforeArr.map(i => {
            let o = {
              ...i,
              name: i.serviceName,
              memberPrice: i.price,
              id: null,
              shopPrice: i.storePrice,
              specificationTime: i.serverTime,
              staffId: null,
              deleted: false,
              staffName: null
            };
            delete o.serviceName;
            delete o.price;
            delete o.serviceSnapshotId;
            delete o.storePrice;
            delete o.serverTime;
            return o;
          });
          this.customerUnServicedOrderLists = afterArr;
          if (afterArr.length) {
            this.dialog = "unServicedOrder";
          }
        });
      } else {
        // 将客户id存入卡项数据中， // 接口需要
        this.billInfo.selectedCard.map(i => {
          i.customerId = this.billInfo.customerInfo.id;
        });
      }
    },
    // 选择了线上订单的回调, 已付商品不需要请求对应的价格比对信息, 直接放入购物车即可
    handleChooseUnServicedServices(data) {
      // 追加部分需要编辑的字段, 以便后续监听
      let goods = data.map(i => {
        return {
          ...i,
          storeRemark: "", // 门店备注
          // storePreference: null, // 线上已经支付,不需要这个
          stationOne: i.stationOne || [],
          stationThree: i.stationThree || [],
          assistantOrSalers: i.assistantOrSalers || [],
          tempFinalPrice: i.received
        };
      });
      this.getCompareMemberLevelPrice(
        this.billInfo.customerInfo.id,
        goods,
        true
      ); // true 将数据放入vuex(购物车)
      this.customerUnServicedOrderLists = [];
    },
    // 清空已选客户, 在监听中统一处理已选商品
    clearCustomerInfo() {
      this.saveCustomerInfo({});
    },
    // 切换计客数
    handleIsCountChanged(bool) {
      this.setIsCount(bool);
    },
    // 清空当前购物车商品(服务、产品； 卡项); 取单时全部商品标记为 delete: true
    handleClearCart() {
      let noCardGoods = ["service", "product"].includes(
        this.billInfo.currentLeftType
      );
      let inOrder = !!this.billInfo.consumerOrderId;
      if (noCardGoods) {
        this.clearGoods(inOrder);
      } else {
        this.clearCards(inOrder);
      }
    },
    clearGoods(bool) {
      if (bool) {
        // 服务、产品 - 在订单取单
        let needSavedGoods = [];
        this.billInfo.selectedGoods.map(i => {
          if (i.id) {
            needSavedGoods.push({ ...i, deleted: true });
          }
        });
        this.setSelectedGoods(); // 做完数据后先清空再添加
        this.setSelectedGoods(needSavedGoods); // 数组是直接覆盖, 引用地址改变，部分后续操作需要强制更新页面!!!
      } else {
        this.setSelectedGoods(); // 空是直接覆盖, 不要传空数组
      }
    },
    // 删除卡项商品， 功能暂时没做...........
    clearCards(bool) {
      if (bool) {
        // 服务、产品 - 在订单取单
        let needSavedGoods = [];
        this.billInfo.selectedCard.map(i => {
          if (i.id) {
            needSavedGoods.push({ ...i, deleted: true });
          }
        });
        this.saveSelectedCard(); // 做完数据后先清空再添加
        this.saveSelectedCard(needSavedGoods); // 空是直接覆盖, 不要传空数组
      } else {
        this.saveSelectedCard(); // 空是直接覆盖, 不要传空数组
      }
    },
    // 无用户变有用户，且列表有商品时，获取服务、产品的比对价格; 卡项没有会员价变动; 此函数也给线上订单使用
    getCompareMemberLevelPrice(customerId, goods, needAdd2Vuex) {
      let goodsSearch = goods.map(i => {
        return {
          specificationId: i.specificationId,
          goodsTypeScopeEnum: i.goodsType.toUpperCase()
        };
      });
      let data = { goodsSearch, storeCustomerId: customerId };
      axios.post("/getBrandCustomerGoodsLevelPrice", data).then(res => {
        res.goodsInfo.map(i => {
          this.setCompareMemberLevelPrice(i);
        });
        if (needAdd2Vuex) {
          this.setSelectedGoods(goods);
        } else {
          this.setSelectedGoods({ goodsType: "service" }); // 触发列表价格计算属性用的，暂时不要删
          let length = this.billInfo.selectedGoods.length; // 触发列表价格计算属性用的，暂时不要删
          this.deleteSelectedGoods(length - 1); // 触发列表价格计算属性用的，暂时不要删
        }
      });
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
    currentSelectedList() {
      // 计算动态购物车组件
      if (["service", "product"].includes(this.billInfo.currentLeftType))
        return "SelectedServiceOrProductInCart";
      return "SelectedCardInCart";
    },
    alreadySelectedListsLen() {
      let count = 0;
      let list = ["service", "product"].includes(this.billInfo.currentLeftType)
        ? this.billInfo.selectedGoods || []
        : this.billInfo.selectedCard || [];
      list.forEach(item => {
        if (!item.deleted) {
          count++;
        }
      });
      return count;
    }
  },
  watch: {
    "billInfo.customerInfo.id": {
      handler: function(v, o) {
        // 先清空比对数据
        this.setCompareMemberLevelPrice({});
        // 如果是取单的， 可能要阻止以下操作
        if (v && !o) {
          // 无用户到有用户时保留数据， 计算动态会员价
          // 不管用户当前是在卡还是服务、产品，只要goods数组有数据都要处理（可能是无客户时，先添加了商品，再切换到卡，此时也需要保持比对数据）
          this.billInfo.selectedGoods.length &&
            this.getCompareMemberLevelPrice(v, this.billInfo.selectedGoods);
        } else {
          // 有用户到切换用户或者清除已选用户, 清空所有的数据
          this.setSelectedGoods();
          this.saveSelectedCard();
        }
      },
      immediate: true
    },
    paperOrderId(val) {
      this.setPaperId(val || null);
    }
  },
  components: {
    SelectCustomer,
    ChooseAddCustomer,
    HistoryCustomers,
    UserBox,
    SelectedServiceOrProductInCart,
    SelectedCardInCart,
    BottomBillPrice,
    ChooseOrder
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.choose-goods-right-index {
  top: 0;
  right: 0;
  z-index: 1;
  height: 100%;
  width: 410px;
  margin: 0 20px;
  position: fixed;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
  display: flex;
  flex-direction: column;
}
.top-info,
.customer-info {
  padding: 10px 20px 10px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f1f4;
}
// 顶部通用样式 srt -
.icon-icon_operate_edit {
  cursor: pointer;
  color: #58c9f3;
}
.item-title,
.item-value {
  font-size: 14px;
}
.bottom-space {
  margin-bottom: 10px;
}
// 顶部通用样式 end -
.selected-goods-list {
  flex: 1;
  overflow-y: auto;
}

.goods-list {
  margin: 12px 10px 0;
  .controler-line {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .list-count {
      font-weight: 600;
    }
  }
}
.footer-price-info {
  height: 75px;
}
// -
.customer-info-item {
  display: flex;
  align-items: center;
}

.service-time {
  position: relative;
  .sign-text {
    position: absolute;
    top: -10px;
    right: 0;
    width: 50px;
    height: 40px;
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    // background-color: #f52d56;
    background: linear-gradient(to bottom, #FA5589 0%,#F5305A 100%);
    color: #fff;
    padding-top: 5px;
    .sign-code {
      margin-bottom: 5px;
      font-size: 18px;
    line-height: 15px;
    }
  }
  .sign {
    // background-color: #f52d56;
    position: absolute;
    top: 35px;
    right: 0;
    width: 0;
    height: 0;
    border-width: 0px 25px 10px;
    border-style: none solid solid;
    border-color: transparent transparent #f52d56;
    transform: rotate(180deg);
  }
  /deep/ .el-input--prefix .el-input__inner {
    border: none;
    padding: 0;
    background: transparent;
  }
  /deep/ .el-input--prefix .el-input__inner::-webkit-input-placeholder {
    color: #333333;
  }
  /deep/
    .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--datetime {
    width: 120px;
  }
  /deep/ .el-input__prefix,
  /deep/ .el-input__suffix {
    display: none;
  }
}

.box-item-userbox {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
  min-height: 24px;
  .icon-icon_operate_delete {
    margin-left: 12px;
    cursor: pointer;
  }
  /deep/ .el-checkbox {
    /* 计客数 挪动 */
    position: absolute;
    right: 0px;
  }
}
</style>
