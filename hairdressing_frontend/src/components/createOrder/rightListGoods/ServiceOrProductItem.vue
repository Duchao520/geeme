<template>
  <div>
    <table class="service-product-table">
      <tr>
        <td colspan="2">
          <div class="top-detail">
            <div class="img" :style="{ backgroundImage:`url(${utils.formatPicImage(detail.image, 'style', 40)})` }"></div>
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
                <span class="member-level-name" v-if="memberLevelPriceInfo&&memberLevelPriceInfo.memberLevelName">{{memberLevelPriceInfo.memberLevelName}}价</span>
                <!-- 这里显示的是：会员价（普通会员价或者会员级别会员价||或者是生日专享价） -->
                <span class="member-price">￥<dynamic-num :number="goodsPriceInfo.memberPrice"></dynamic-num></span>
                <span class="shop-price">¥{{ detail.shopPrice }}</span>
              </p>
            </div>
            <div class="detail-right">
              <i
                class="icon iconfont icon-icon_operate_delete"
                @click="deleteGoods(detail,index)"
                title="删除"
              ></i>
              <!-- 如果是产品 这里的数量不能超过库存 -->
              <span class="num">
              <number-input 
                :disabled="detail.paymentStatus" 
                v-model="detail.num" 
                :min="1" 
                :max=" detail.stock|| 10000"
                :decimal="false"
              ></number-input>
            </span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <!--  v-if="detail.goodsType==='service'" 暂时取消主销售人 添加的条件-->
        <!-- <td class="second-line-detail staff-open" v-if="detail.goodsType==='service'">
          <div @click="editServerOrMasterSeller(detail)">
            <span class="name">{{ detail.staffName||(detail.goodsType==='service'?'选择服务者':'选择主销售人') }}</span>
            <i class="icon iconfont icon-icon_operate_edit"></i>
          </div>
        </td> -->
        <td class="service-staff-line" v-if="detail.goodsType==='service'">
          <div class="service-work-stations">
            <div class="service-work-stations-content" v-for="n in detail.workStationCount" :key="n">
              <!-- 3个工位组件 -->
              <service-staff 
                :total="detail.workStationCount"
                :count="n" 
                :staffList="n === 1 ? (detail.stationOne || []) : n === 2 ? (detail.assistantOrSalers || []) : (detail.stationThree || [])"
                @setStationStaff="handleSetStationStaff"
              >
              </service-staff>
            </div>
          </div>
        </td>
        <td class="second-line-detail commission" v-else>
          <div class="staff-commission" @click="addAssistOrSalesman(detail,index)">
            <div class="assist-items">
              <span 
                v-if="detail.assistantOrSalers&&detail.assistantOrSalers.length>0" 
                class="assist-detail"
              >
                {{commissionPercentage}}
              </span>
             
              <span
                style="color:#C7CAD1"
                v-else
              >
                <!-- 选择{{detail.goodsType==='service'?'辅助工位':'辅助销售'}} -->
                选择销售
              </span>
            </div>
            <g-clickbtn :icon="'icon_ope_append'"></g-clickbtn>
          </div>
        </td>
      </tr>
      <tr v-if="!detail.paymentStatus">
        <td class="store-preference" colspan="2">
          <div>
            <p>门店优惠</p>
            <p class="input">
              <span>-</span>
              <number-input v-model="detail.storePreference" :max="realPrice*(detail.num || 1)"></number-input>
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="detail-footer">
            <div class="order-type">
              <span>{{detail.online?'线上订单':'门店开单'}}</span>
              <div
                class="order-status"
                :class="{already:detail.paymentStatus}"
              >{{detail.paymentStatus?'已支付':'未支付'}}
              </div>
            </div>
            <span class="pay">
            {{receivedOrShouldPayMoney.payText}}
            <span class="money">
              ¥
              <dynamic-num
                :number="receivedOrShouldPayMoney.shouldPay"
              ></dynamic-num>
            </span>
            {{discountText}}
          </span>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="remark">
          <div class="remark-content">
            <span>备注：</span>
            <input
              class="input"
              maxlength="127"
              v-model="detail.remarks"
              type="text"
              placeholder="添加备注"
            >
            <el-radio-group v-model="detail.sendType" v-if="detail.goodsType==='production'" :disabled="detail.paymentStatus">
               <el-radio-button :label="0">自提</el-radio-button>
               <el-radio-button :label="1">物流</el-radio-button>
             </el-radio-group>
          </div>
        </td>
      </tr>
    </table>
    <!-- 辅助工位、辅助销售： v2 - 多工位/销售  -->
    <!-- 组件没有销毁， 选中的服务者还在 , 工位2、销售 用 -->
    <choose-add-assist
      ref="addAssistants"
      :isService="detail.goodsType==='service'"
      :availableAssistantsOrStaff="availableAssistantsOrStaff"
      :showAddAssistants="showAddAssistants"
      :mainStaffId="detail.staffId"
      @close="showAddAssistants = false"
      @confirmSelectStaff="confirmAddAssist"
    ></choose-add-assist>
    <!-- 第一工位用 组件不能销毁 -->
    <choose-add-assist
      ref="addAssistantsOne"
      :isService="detail.goodsType==='service'"
      :availableAssistantsOrStaff="availableAssistantsOrStaff"
      :showAddAssistants="showAddAssistantsOne"
      @close="showAddAssistantsOne = false"
      @confirmSelectStaff="confirmAddAssistOne"
    ></choose-add-assist>
    <!-- 第3工位用 组件不能销毁 -->
    <choose-add-assist
      ref="addAssistantsThree"
      :isService="detail.goodsType==='service'"
      :availableAssistantsOrStaff="availableAssistantsOrStaff"
      :showAddAssistants="showAddAssistantsThree"
      @close="showAddAssistantsThree = false"
      @confirmSelectStaff="confirmAddAssistThree"
    ></choose-add-assist>
    <!-- 主服务者 - v2 弃用 -->
    <!-- <choose-change-staff
      ref="changeStaff"
      :goodsType="detail.goodsType"
      :changeDialogVisible="changeDialogVisible"
      :list="staffList"
      :staffId="detail.staffId"
      :assistList="(detail.assistantOrSalers||[]).concat(detail.assistantOrSalers)"
      @close="changeDialogVisible = false"
      @confirm="changeServer"
    ></choose-change-staff> -->
  </div>

</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";
  import {mapGetters, mapState, mapActions} from "vuex";
  import chooseAddAssist from "@/components/createOrder/chooseAddAssist";
  import chooseChangeStaff from "@/components/createOrder/chooseChangeStaff";
  import serviceStaff from './components/serviceStaff';
  export default {
    components: {
      chooseAddAssist,
      chooseChangeStaff,
      serviceStaff, // 服务工位员工
    },
    props: {
      detail: Object,
      index: Number
    },
    data() {
      return {
        utils: utils,
        availableAssistantsOrStaff: [],
        staffList: [],
        showAddAssistants: false, // 销售及第2工位
        showAddAssistantsOne: false, // 工位1
        showAddAssistantsThree: false, // 工位3
        changeDialogVisible: false,
        currentStationIndex: 0, // 第几个工位员工 1 stationOne, 2 assistantOrSalers, 3 stationThree
      };
    },
    computed: {
      ...mapGetters(["identityCardDiscountInfo", "alreadySelectedCard"]),
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        listOfMemberLevelPrices: state => state.bill.listOfMemberLevelPrices,
        shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      }),
      memberLevelPriceInfo() {
        /*
        * 相匹配的价格是在每次添加之后才出现的，在请求未到达之前，会出现无对应数据的情况
        * */
        let matchedPrice = this.listOfMemberLevelPrices.filter(item => {
          let detail = this.detail;
          return detail.goodsType === item.goodsType && detail.specificationId === item.specificationId
        })[0];
        return matchedPrice
      },
      cardDiscountInfo() {
        let cardDiscountInfo = this.identityCardDiscountInfo.filter(item => {
          let specificationsSnapshotId = item.serviceSpecificationsSnapshotId || item.productSpecificationsSnapshotId;
          return item.goodsType === this.detail.goodsType && specificationsSnapshotId === this.detail.snapshotId
        })[0];
        return cardDiscountInfo
      },
      /*
       * 商品详情那里显示的价格
       *  --为什么不能直接使用memberLevelPriceInfo？因为在未选择顾客的情况下，memberLevelPriceInfo是没有的
        * */
      goodsPriceInfo() {
        let memberLevelPriceInfo = this.memberLevelPriceInfo;
        let info = {};
        if (memberLevelPriceInfo) {
          if (memberLevelPriceInfo.isVip) {
            info = {
              memberPrice: memberLevelPriceInfo.discountPrice,
              levelName: memberLevelPriceInfo.levelName
            }
          } else {
            info = {
              memberPrice: memberLevelPriceInfo.discountPrice,
            }
          }
        } else {
          info = {
            memberPrice: this.detail.memberPrice
          }
        }
        return {...info, shopPrice: this.detail.shopPrice}
      },
      /* 实付/应付/会员卡折后价的钱 ；  new -> 持卡会员价的折扣或实付金额 */
      receivedOrShouldPayMoney() {
        let shouldPay = 0, payText = "";
        if (this.detail.paymentStatus) {
          shouldPay = this.detail.received || this.detail.unitFinalPrice; // unitFinalPrice 后端可能用的这个字段，且已经乘上了数量
          payText = "实付"
        } else {
          if (this.cardDiscountInfo) {
            if (this.detail.enableCardDiscount) {
              // 这里用的是卡本身的折扣设置
              /* 会员卡折扣的价格 */
              shouldPay = this.cardDiscountInfo.price * this.detail.num * this.cardDiscountInfo.discount - (this.detail.storePreference || 0);
            } else {
              // 这里用的是固定的持卡会员价
              shouldPay = this.cardDiscountInfo.finalPrice
            }
            payText = "会员卡"
          } else {
            /*
            * 会员本身对应的价格
            * */
            shouldPay = this.goodsPriceInfo.memberPrice * this.detail.num - (this.detail.storePreference || 0);
            payText = "应付"
          }
        }
        /*
        * 这个作为记录账单价格的参数将传给后端
        * */
        this.$set(this.detail, 'tempFinalPrice', shouldPay) // 取单时后端没有这个字段  需要响应式监听总价
        return {shouldPay, payText}
      },
      /*
      * 真实价格：
      *   1.有卡优惠的时候是卡优惠的价格
      *   2.无卡优惠的时候是会员价（普通会员价或者是其他会员级别的会员价）
      * */
      realPrice() {
        if (this.cardDiscountInfo) {
          return this.cardDiscountInfo.finalPrice
        } else {
          return this.goodsPriceInfo.memberPrice
        }
      },
      discountText() {
        if (!this.cardDiscountInfo || this.cardDiscountInfo.discount === 1) {
          return ""
        } else {
          return `（${Math.round(this.cardDiscountInfo.discount * 1000) / 100}折）`
        }
      },
      commissionPercentage() {
        let list = this.detail.assistantOrSalers;
        let s = "";
        list.forEach((assists) => {
          let shopNum = this.shopStaffsInfo[assists.id||assists.staffId] ? `(${this.shopStaffsInfo[assists.id||assists.staffId]})` : ''
          s += (assists.staffName + shopNum + ' ' + Math.round(assists.ratio * 100) / 100 + "%；")
        });
        return s
      },
    },
    methods: {
      ...mapActions(['setSelectedVipCardId']),
      deleteGoods(detail, index) {
        this.$emit("deleteGoods", detail, index);
      },
      
      // 选择辅助销售/辅助工位 -V2 隔离服务,仅销售
      addAssistOrSalesman(item) {
        let currentSelectedStaff = item.assistantOrSalers || [];
        let ids = currentSelectedStaff.map(item => item.id || item.staffId); // 注意取单时是 staffId
        this.$refs.addAssistants.checkedStaffIds = ids; // 从辅助销售取到的数据赋值给子组件 渲染勾选的员工

        // if (item.goodsType === "service") {
        //   this.chooseAssist();
        // } else {
          this.chooseSaleMan();
        // }
      },
      
      // 销售人
      chooseSaleMan() {
        axios.get("/getSimpleStaffListByShopId/" + this.currentInfo.shopId, {}).then(res => {
          this.$refs.addAssistants.currentStaffType = "saleMan";
          this.$refs.addAssistants.getPerformanceAllocation("sales");
          this.availableAssistantsOrStaff = res.staffList;
          this.showAddAssistants = true;
        });
      },
      confirmAddAssist(data) {
        Object.assign(this.detail, {assistantOrSalers: data})
        this.showAddAssistants = false;
      },
      // 第一工位 V2
      confirmAddAssistOne(data) {
        Object.assign(this.detail, {stationOne: data})
        this.showAddAssistantsOne = false
      },
      // 第3工位 V2
      confirmAddAssistThree(data) {
        Object.assign(this.detail, {stationThree: data})
        this.showAddAssistantsThree = false
      },
      // 编辑服务工位员工对话框
      handleSetStationStaff(n) {
        this.currentStationIndex = n

        // - 获取已选工位员工的指定值为真的员工id
        let isChosenStaffIds = []

        // 赋值勾选状态
        if (n === 1) {
          // 从辅助销售取到的数据赋值给子组件 渲染勾选的员工
          let currentSelectedStaff = this.detail.stationOne || [];
          let ids = currentSelectedStaff.map(item => item.id || item.staffId);
          this.$refs.addAssistantsOne.checkedStaffIds = ids;
          isChosenStaffIds = currentSelectedStaff.map( i => {
            if (i.isChosen) {
              return i.id || i.staffId
            } 
          })
        } else if (n === 2) {
          // 从辅助销售取到的数据赋值给子组件 渲染勾选的员工
          let currentSelectedStaff = this.detail.assistantOrSalers || [];
          let ids = currentSelectedStaff.map(item => item.id || item.staffId);
          this.$refs.addAssistants.checkedStaffIds = ids;
          isChosenStaffIds = currentSelectedStaff.map( i => {
            if (i.isChosen) {
              return i.id || i.staffId
            } 
          })
        } else {
          // 从辅助销售取到的数据赋值给子组件 渲染勾选的员工
          let currentSelectedStaff = this.detail.stationThree || [];
          let ids = currentSelectedStaff.map(item => item.id || item.staffId);
          this.$refs.addAssistantsThree.checkedStaffIds = ids;
          isChosenStaffIds = currentSelectedStaff.map( i => {
            if (i.isChosen) {
              return i.id || i.staffId
            } 
          })
        }
        // 将id赋值给子组件， 触发勾选状态
        axios.post('/getStaffListCanDoService', {serviceId: this.detail.serviceId, workStation: n}).then(res => {
          if (n === 1) {
            this.$refs.addAssistantsOne.currentStaffType = "assistant";
            this.$refs.addAssistantsOne.getPerformanceAllocation("service");
          } else if (n === 2) {
            this.$refs.addAssistants.currentStaffType = "assistant";
            this.$refs.addAssistants.getPerformanceAllocation("service");
          } else {
            this.$refs.addAssistantsThree.currentStaffType = "assistant";
            this.$refs.addAssistantsThree.getPerformanceAllocation("service");
          }
          let list = res.staffList || [];
          // - 注入是否指定值 - 默认非指定? =>  || !isChosenStaffIds.length 去掉就是非指定 加上就是指定
          list.map(i => { 
            // if (isChosenStaffIds.includes(i.id) || !isChosenStaffIds.length) { // 默认指定
            if (isChosenStaffIds.includes(i.id)) { // 默认非指定
              Object.assign(i, {isChosen: true})
            } else {
              Object.assign(i, {isChosen: false})
            }
          })
          this.availableAssistantsOrStaff = list
          if (this.availableAssistantsOrStaff.length) {
            if (n === 1) {
              this.showAddAssistantsOne = true
            } else if (n === 2) {
              this.showAddAssistants = true
            } else {
              this.showAddAssistantsThree = true  
            }
          } else {
            this.$message({
              type: 'error',
              message: '该工位暂时无员工'
            })
          }
        })
      },
      // 主服务者 V2弃用
      /* changeServer(data) {
        this.detail.staffName = data.name;
        this.detail.staffId = data.id;
        this.changeDialogVisible = false;
      }, */
      // V2弃用
      /* chooseAssist() {
        // axios.post("/getAssistantList", {storeId: this.currentInfo.shopId})
        axios.get("/getSimpleStaffListByShopId/" + this.currentInfo.shopId, {}).then(res => {
          this.$refs.addAssistants.currentStaffType = "assistant";
          this.$refs.addAssistants.getPerformanceAllocation("service");
          // 原来的过滤主服务者 -----------------------------------------
          // this.availableAssistantsOrStaff = (res.staffList || []).filter(item => item.id !== this.detail.staffId);
          this.availableAssistantsOrStaff = res.staffList || [];
          this.showAddAssistants = true;
        });
      }, */
      // 主服务者、销售， v2弃用
      /* editServerOrMasterSeller(detail) {
        this.$refs.changeStaff.selectedStaffId = detail.staffId;
        if(detail.goodsType === "service"){
          axios.post("/getSimpleStaffListByStoreIdAndServiceId", {serviceId:  detail.id, storeId: this.currentInfo.shopId}).then(res => {
            this.changeDialogVisible = true;
            this.staffList = res.staffList;
          });
        }else{
          axios.get("/getSimpleStaffListByShopId/" + this.currentInfo.shopId).then(res => {
            this.changeDialogVisible = true;
            this.staffList = res.staffList;
          });
        }
      }, */
    },
    watch: {
      // 此处仅监听服务和产品数量和门店改价的变动导致的会员卡清空， 如果后续会员卡可以买会员卡 则需要在会员卡页面清空相关数据
      'detail.storePreference': {
        handler: function(v, o) {
          // console.log('门店优惠修改')
          // console.log(v, o)
          // if (v > o || o === undefined) {
            this.setSelectedVipCardId({}) // 如果门店优惠改小了 ， 则可能导致已选会员卡不能使用
          // }
        },
        immediate: true,
        deep: true
      },
      'detail.num': {
        handler: function(v, o) {
          // console.log('商品数量')
          // console.log(v, o)
          // if (v > o || o === undefined) {
            this.setSelectedVipCardId({}) // 如果商品数量改变 ， 则可能导致已选会员卡不能使用
          // }
        },
        immediate: true,
        deep: true
      },
    }
  };
</script>
<style lang="scss" scoped>
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
            color: #FF6D61;
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
          border-color: #58C9F3;
        }

        /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: #58C9F3;
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
</style>
