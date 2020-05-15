<template>
  <div id="gm_appo_list" class="margin_main" v-loading.fullscreen="btnLoad">
    <div class="appo_list_condition">
      <div class="condition_left">
        <label>到店时间：</label>
        <el-radio-group v-model="arrivalTime" @change="getAppoList">
          <el-radio-button :label="0">今日</el-radio-button>
          <el-radio-button :label="1">明天</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="timeValue"
          @change="changeTimeArea"
          type="datetimerange"
          :clearable="false"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="appo_list_container">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="bookingStatus" @tab-click="changeTabStatus()">
          <el-tab-pane
            v-for="(item, index) in orderStatus"
            :key="index"
            :label="item.value"
            v-model="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <el-table :data="tableData" stripe class="appo_table" height="calc(100vh - 296px)">
        <el-table-column label="预约人" width="220">
          <template slot-scope="scope">
            <span class="table_imgs">
              <img
                :src="formatPicImage(scope.row.headPortrait, 'circle', 70, 'someone', scope.row.sex)"
                class="img_head"
              />
              <img v-show="scope.row.sex === '女'" src="@/assets/img/female_tip.png" class="img_sex" />
              <img v-show="scope.row.sex === '男'" src="@/assets/img/male_tip.png" class="img_sex" />
            </span>
            <span class="tables_name">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约服务">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.serviceName"
              :key="index"
            >{{item.serviceName}}&nbsp;&nbsp;x{{item.count}}</p>
          </template>
        </el-table-column>
        <el-table-column label="服务者" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.staffName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="duedTime"
          label="预约到店时间"
          show-overflow-tooltip
          style="margin-left:-50px;"
        ></el-table-column>
        <!-- <el-table-column prop="storeName" label="预约门店"></el-table-column> -->
        <!-- <el-table-column label="预约金" width="80">
          <template slot-scope="scope">{{ scope.row.amount || 0 }}元</template>
        </el-table-column>-->
        <el-table-column prop="customerNotes" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <status-text
              :type="bgColor[scope.row.status]"
              :name="scope.row.status === '已服务' ? '已开单' : scope.row.status"
            ></status-text>
            <p
              v-show="scope.row.abnormalReason"
              style="color: #f52d56;"
            >{{scope.row.abnormalReason}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="lastServiceTime" label="上次服务时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <div class="buttons">
              <g-button
                class="button"
                :name="'详情'"
                :title="'预约详情'"
                type="detail"
                :icon="'icon_operate_eyes'"
                @click="getDeatil(scope.row)"
                :btnLoad="btnLoad"
              ></g-button>
              <g-button
                class="button"
                v-show="scope.row.status==='待服务' && !scope.row.abnormal"
                :name="'开单'"
                :title="'立即开单'"
                type="open-bill"
                :icon="'icon_operate_bill'"
                @click="toOpenBill(scope.row)"
                :btnLoad="btnLoad"
              ></g-button>
              <g-button
                class="button"
                v-show="/待服务|已超时/.test(scope.row.status)"
                :name="'取消'"
                :title="'取消预约'"
                type="cancel"
                :icon="'icon_ope_cancel'"
                @click="toOpera(scope.row.appointmentId)"
              ></g-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin: 5px 20px 5px 0;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
    <!-- 已服务者的预约详情 -->
    <v-order-detail
      v-if="showDetailDialog"
      :show="showDetailDialog"
      :list="detailData"
      @close="hiddenDialog"
      @modify="toModify"
    ></v-order-detail>
    <!-- 修改预约或者待服务者的订单详情 -->
    <v-order-modify
      v-if="showModifyDialog"
      :show="showModifyDialog"
      :list="detailData"
      @close="hiddenDialog"
      @billFromAppoint="billFromAppoint"
      @cancelOrder="cancelOrder"
      :currentAppointmentId="currentAppointmentId"
      @callSuperCreateAppointmentApi="handleUpdate"
    ></v-order-modify>
    <!-- //在预约管理页面快速开单之选择订单 -->
    <v-choose-order
      v-if="showChooseDialog"
      @close="showChooseDialog=false"
      @reBilling="showChooseDialog=false"
      :unServicedOrderLists="unServicedOrderLists"
      :staffInfo="staffInfo"
    ></v-choose-order>
    <!-- 取消预约弹窗 -->
    <cancel-appoint
      :cancelVisible="cancelModelVisible"
      @cancelAppoint="cancelModelVisible=false"
      @confirmCancelAppoint="confirmCancelAppoint"
    ></cancel-appoint>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import ChooseOrder from "./ChooseOrder";
import { mapActions, mapState } from "vuex";
import OrderDetail from "./orderDetail.vue";
import OrderModify from "./AppoModify";
import CancelAppoint from "@/components/appoints/CancelAppoint";

export default {
  name: "GmAppoList",
  data() {
    return {
      cancelModelVisible: false,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      bgColor: datas.SERVER_STATUS, // 预约状态
      arrivalTime: 0,
      timeValue: [], // 开始和结束时间
      totalCount: 0,
      currentPage: 1, // 当前页面
      pageSize: 20, // 每页显示行数
      keywords: "",
      bookingStatus: 0, // 服务类型
      showModifyDialog: false, // 预约详情的修改
      showDetailDialog: false, // 详情页是否显示
      detailData: {}, // 表格数据
      formLabelWidth: "120px",
      // dialogVisibleDeatil:false,
      showChooseDialog: false,
      form: {
        phone: "17687767889",
        name: "222",
        shop: "ssd",
        date: "2018-10-19",
        time: "10:30",
        desc: "",
        sex: 1,
        service: [
          { name: "s1", person: "p2" },
          { name: "s2", person: "p1" }
        ]
      },
      orderStatus: [
        { code: 0, value: "全部" },
        { code: 1, value: "待服务" },
        { code: 2, value: "已开单" },
        { code: 3, value: "已超时" },
        // { code: 4, value: "已完成" },
        { code: 5, value: "已取消" },
        { code: 6, value: "异常预约" }
      ],
      tableData: [],
      startTimeGroup: "2018-12-12 08:00:00",
      endTimeGroup: "2019-12-12 08:00:00",
      keywordPhone: "",
      id_delete: 0,
      currentAppointmentId: null, //当前的预约ID
      unServicedOrderLists: [],
      staffInfo: {},
      btnLoad: false
    };
  },
  components: {
    "v-order-detail": OrderDetail,
    "v-order-modify": OrderModify,
    "v-choose-order": ChooseOrder,
    "cancel-appoint": CancelAppoint
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    params() {
      let begin;
      let end;
      switch (this.arrivalTime) {
        case 0:
          begin = utils.getZeroTime(0);
          end = utils.getZeroTime(1);
          this.timeValue = [];
          break;
        case 1:
          begin = utils.getZeroTime(1);
          end = utils.getZeroTime(2);
          this.timeValue = [];
          break;
        case "week":
          let day = new Date().getDay();
          begin = utils.getZeroTime(1 - day);
          end = utils.getZeroTime(8 - day);
          this.timeValue = [];
          break;
        default:
          begin = this.timeValue[0];
          end = this.timeValue[1];
          break;
      }
      return {
        storeId: this.currentInfo.shopId,
        begin: begin,
        end: end,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status:
          this.orderStatus[this.bookingStatus].value === "已开单"
            ? "已服务"
            : this.orderStatus[this.bookingStatus].value,
        keyword: this.keywordPhone
      };
    }
  },
  mounted() {
    let vm = this;
    if (this.$route.query.shortcut) {
      this.bookingStatus = "1";
    }
    this.$root.$on("searchValue", function(res) {
      vm.keywordPhone = res;
      vm.currentPage = 1;
      vm.getAppoList();
    });
    // this.$root.$on('needRefreshPage', data => {
    //   console.log('')
    //   console.log('获得了某些数据apoo')
    //   console.log(data)
    // })
  },
  beforeDestroy() {
    this.$root.$off("searchValue");
    // this.$root.$off("needRefreshPage")
  },
  created() {
    this.getAppoList();
  },
  methods: {
    ...mapActions([
      "saveCurrentInfo",
      "saveOperate",
      "setIsCount",
      "saveCustomerInfo",
      "setBillOrigin",
      "setAppointId",
      "setAppoEntry",
      "saveOnTheWayOrderIds",
      "clearBillInfo",
      "saveCurrentInfo",
      "setSelectedGoods"
    ]),
    toOpera(id) {
      this.cancelModelVisible = true;
      this.id_delete = id;
    },
    cancelAppointmentRes(res) {
      if (res.success) {
        this.getAppoList();
        this.cancelModelVisible = false;
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    getAppoList() {
      this.tableData = [];
      axios.post(api.appointmentList.URL, this.params).then(res => {
        this.appointmentListRes(res);
      });
    },
    appointmentListRes(res) {
      this.tableData = res.appointmentCustomers;
      this.totalCount = res.total;
    },
    // 搜索用户列表
    searchInfo() {},
    // 获取预约客户列表
    getSearchInfo(res) {
      // console.log(res);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // 判断是否可调接口
      if (val > this.totalCount || val <= 0) return;
      this.getAppoList();
      // console.log(`当前页: ${val}`);
    },
    // 处理向后台发送请求处理
    subConfirmCancel(res) {
      this.dialogVisibleCancel = false;
    },
    // 隐藏弹窗
    hiddenDialog(data) {
      this[data] = false;
    },
    // 去修改预约信息
    toModify() {
      // 先隐藏预约详情弹窗
      this.hiddenDialog("showDetailDialog");
      // 再显示预约修改弹窗
      this.showModifyDialog = true;
    },
    //详情
    getDeatil(data) {
      this.btnLoad = true;
      // 清理所有数据
      this.clearBillInfo();
      this.saveCurrentInfo({ cpLevelId: null });
      this.setIsCount(true); // - 设置计客数
      this.currentAppointmentId = data.appointmentId;
      this.id_delete = data.appointmentId;
      this.saveCurrentInfo({
        appointmentId: data.appointmentId
      });
      // 获取预约详情
      axios.get("/getAppointmentById/" + data.appointmentId).then(res => {
        // 传给子组件的数据 ， 有线上订单的客户， 在子组件中完成数据存储
        this.staffInfo = res.appointment;
        this.getAppointmentDetailRes(res);
      });
    },
    // 获取预约详情回调
    getAppointmentDetailRes(res) {
      // 记录点击预约列表的新增时预约时间,为了修改预约使用
      this.saveCurrentInfo({
        staffId: res.appointment.staffId,
        appoTime: new Date(res.appointment.dueTime).format("hh:mm"),
        staffLevel: res.appointment.staffLevelId,
        staffName: res.appointment.staffName
      });
      this.detailData = res;
      // 开始显示弹窗
      if (res.appointment.status === "待服务") {
        this.saveCustomerInfo({
          /* 2.保存开单顾客信息 */
          headPortrait: res.customer.headPortrait,
          name: res.customer.name,
          sex: res.customer.sex,
          mobile: res.customer.mobile,
          memberLevel: res.customer.memberLevel,
          id: res.customer.id
        });
        // 可以编辑的预约详情
        this.setAppointId(res.appointment.id); /* 4.保存预约id */
        this.saveCurrentInfo({ staffId: res.appointment.staffId }); // 居然要用vuex
        this.setBillOrigin("appointment"); /* 3.保存开单来源 */
        this.saveOperate({ clickEnter: "modify" });
        this.setAppoEntry("modify"); // 新的独立入口
        this.showModifyDialog = true;
      } else {
        // 不可编辑的预约详情(已超时；已开单；已取消等)
        this.showDetailDialog = true;
      }
      this.btnLoad = false;
    },
    // 新增服务
    addNewService() {
      this.form.service.push({
        name: "",
        person: ""
      });
    },
    // 删除服务
    removeService(key) {
      this.form.service.splice(key, 1);
    },
    changeTimeArea(date) {
      this.arrivalTime = null;
      this.currentPage = 1;
      this.getAppoList();
    },
    changeTabStatus() {
      this.currentPage = 1;
      this.getAppoList();
    },
    toOpenBill(data) {
      this.btnLoad = true;
      // 清理所有数据
      this.clearBillInfo();
      this.saveCurrentInfo({ cpLevelId: null });
      this.setIsCount(true); // - 设置计客数
      axios.get("/getAppointmentById/" + data.appointmentId).then(res => {
        this.getAppointmentDetailRes_(res);
      });
    },
    getAppointmentDetailRes_(res) {
      this.saveCustomerInfo({
        /* 2.保存开单顾客信息 */
        headPortrait: res.customer.headPortrait,
        name: res.customer.name,
        sex: res.customer.sex,
        mobile: res.customer.mobile,
        memberLevel: res.customer.memberLevel,
        id: res.customer.id
      });
      this.setBillOrigin("appointment"); /* 3.保存开单来源 */
      this.setAppointId(res.appointment.id); /* 4.保存预约id */
      console.log(res);
      // 传给子组件的数据 ， 有线上订单的客户， 在子组件中完成数据存储
      this.staffInfo = res.appointment;
      let params = {
        customerId: res.customer.id,
        staffId: res.appointment.staffId,
        storeId: this.currentInfo.shopId,
        serviceOrderId: res.appointment.serviceOrderId
      };
      console.log(params);
      axios.post("/getUnservicedOrderList", params).then(res => {
        this.handleGetUnservicedLists(res);
      });
    },
    billFromAppoint() {
      let params = {
        customerId: this.detailData.customer.id,
        staffId: this.detailData.appointment.staffId,
        storeId: this.currentInfo.shopId,
        serviceOrderId: this.detailData.appointment.serviceOrderId
      };
      axios.post("/getUnservicedOrderList", params).then(res => {
        this.handleGetUnservicedLists(res);
      });
    },
    async handleGetUnservicedLists(res) {
      this.saveOnTheWayOrderIds([]);
      if (res.orderList.length === 0) {
        // 没有线上订单在此请求接口，完成数据完整的获取，再存储
        let serviceInfos = [];
        try {
          const res = await axios.post("createConsumerOrderFromAppointment", {
            appointmentId: this.staffInfo.id,
            productOrderIds: [],
            serviceOrderIds: []
          });
          serviceInfos = res.serviceInfos.map(i => {
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
        } finally {
          this.showModifyDialog = false;
          this.$router.push("/shop-inner/choose-person");
          this.btnLoad = false
        }
      } else {
        this.showModifyDialog = false;
        this.unServicedOrderLists = res.orderList.map(item => {
          item.disabled = item.selected || !item.orderEnable || false;
          return item;
        });
        this.showChooseDialog = true;
        this.btnLoad = false
      }
    },
    cancelOrder() {
      this.cancelModelVisible = true;
    },
    /* 确认取消预约 */
    confirmCancelAppoint(data) {
      axios
        .post(api.cancelAppoint.URL, {
          id: this.id_delete,
          ...data
        })
        .then(res => {
          this.cancelAppointmentRes(res);
        });
    },
    handleUpdate(data) {
      axios.post(api.createAppointment.URL, data).then(res => {
        this.modifyAppointmentRes(res);
      });
    },
    modifyAppointmentRes(res) {
      if (res.success) {
        utils.showTip(this, { msg: res.message, type: "success" });
        this.showModifyDialog = false;
        this.getAppoList();
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    }
  }
};
</script>

<style lang="scss">
#gm_appo_list {
  .abreast_item {
    .el-select,
    .el-input {
      width: 49%;
      max-width: 196px;
    }
    .el-select {
      .el-input {
        width: 100%;
      }
    }
  }
  .el-radio-button.is-active {
    .el-radio-button__inner {
      background-color: #58c9f3;
      border-color: #58c9f3;
    }
  }
}
</style>

<style lang="scss" scoped>
.flex_row {
  display: flex;
  flex-direction: row;
}
.buttons {
  display: flex;
  width: 200px;
  .button {
    min-width: 62px;
    height: 28px;
    margin-right: 5px;
  }
}
.flex_column {
  display: flex;
  flex-direction: column;
}
.flex_column_center {
  @extend .flex_column;
  justify-content: center;
  align-items: center;
}
.flex_row_center {
  @extend .flex_row;
  justify-content: center;
  align-items: center;
}
.oper {
  cursor: pointer;
}
.blue {
  color: #409eff;
}
.green {
  color: #67c23a;
}
.red {
  color: #e22c37;
}
.appo_list_condition {
  @extend .flex_row;
  label {
    font-size: 14px;
  }
  .condition_left {
    flex: 1;
  }
  .condition_right {
    margin-right: 40px;
    .con_phone {
      width: 180px;
    }
  }
}
@function computeHeight($n) {
  @return calc(100vh - #{$n + 20 + 60});
}
.appo_list_container {
  border: 1px solid rgba(235, 235, 234, 1);
  border-radius: 0px 0px 6px 6px;
  background-color: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  height: computeHeight(141px);
  .appo_table {
    margin: 0 20px;
    width: auto;
  }
  .table_imgs {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .img_head {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
  }
  .img_sex {
    width: 14px;
    height: 14px;
    position: absolute;
    right: -7px;
    top: 0;
  }
  .tables_name {
    display: inline-block;
    margin-left: 8px;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-defined-tab {
    /deep/ .el-tabs--card {
      background: rgba(174, 184, 229, 0.3);
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      height: 32px;
      .el-tabs__nav {
        border: 0;
      }
      .el-tabs__header {
        border: 0;
      }
      .el-tabs__item {
        border: 0;
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
      }
      .el-tabs__header .el-tabs__item.is-active {
        background: #fff;
        border-radius: 8px 8px 0 0;
        position: relative;
        &::before {
          content: "";
          display: block;
          position: absolute;
          width: 8px;
          height: 8px;
          background: url("../../assets/images/bgImages/icon_tab_left.png");
          background-size: 100%;
          left: -8px;
          bottom: 0;
        }
        &::after {
          content: "";
          display: block;
          position: absolute;
          width: 8px;
          height: 8px;
          background: url("../../assets/images/bgImages/icon_tab_right.png");
          background-size: 100%;
          right: -8px;
          bottom: 0;
        }
      }
    }
  }
}
</style>

