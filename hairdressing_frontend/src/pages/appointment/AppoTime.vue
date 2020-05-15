<template lang="pug">
  section.appo-table-container(
    v-loading="fullscreenLoading"
  )
    .appo-container
      // 时间表的第一行，包含时间选择
      .appo-header
        // 时间选择器
        .data-change
          v-date-check(
          :order-time="currentInfo.orderTime",
          @change="dateChange"
          )
        ul.header-list(
        :style="headStyle",
        )
          li.header-item(
          v-for="(stafflist, index) in tableData.staffAppointments"
          )
            div(
            v-if="index !== tableData.staffAppointments.length - 1"
            )
              img.avatar.h-item(
              :src="formatPicImage(stafflist.appointmentStaffInfo.headPortrait, 'circle', 35, 'someone', stafflist.appointmentStaffInfo.sex)"
              )
              .detail.h-item
                el-tooltip(
                  :content="stafflist.appointmentStaffInfo.name"
                )
                  .name {{ stafflist.appointmentStaffInfo.name}}
                .percent {{ stafflist.appointmentStaffInfo.appointmentRate }}%
              .status(
              :class="[stafflist.appointmentStaffInfo.recommend ? 'active' : '']",
              @click="changeRecommend(stafflist.appointmentDetails, index)"
              ) {{ stafflist.appointmentStaffInfo.recommend ? '已推荐' : '未推荐' }}
            div(
            v-if="index === tableData.staffAppointments.length - 1"
            )
              img.avatar.h-item(
              src="static/images/order/icon_undistributed.png"
              )
              .detail.h-item
                .name 未分配
      .appo-time(
      :style="timeStyle"
      )
        ul.time-list
          li.time-item(
          v-for="time in tableData.timeList"
          :class="[checkOppoStatus((checkDate + ' ' + time), nowTimer.date) ? 'disabled' : '']",
          :style="timeBoxStyle"
          ) {{ time }}
      .appo-time-empty(
      :style="timeStyle"
      )
      // 预约列表内容
      .appo-body(
      :style="bodyStyle",
      @scroll.stop="bodyScroll"
      )
        .body-content
          .body-info(
          v-for="(stafflist, index) in tableData.staffAppointments"
          )
            ul.info-list(
              v-for="(clientlist, ind) in stafflist.appointmentDetails",
              :class="[checkOppoStatus((checkDate + ' ' + clientlist.time), nowTimer.date) ? 'disabled' : '', clientlist.time]",
              v-if="index !== tableData.staffAppointments.length - 1"
            )
              // 预约信息
              li.list-item(
              v-for="key in ((clientlist.capacity - clientlist.dued) < 0 ? clientlist.capacity : clientlist.dued)",
              :class="[clientlist.available === false ? 'disabled' : '',bgColor[clientlist.appointmentCustomers[key - 1].status]]",
              @click="intoDetail(clientlist.appointmentCustomers[key - 1], clientlist)"
              )
                img.avatar.h-item(
                :src="formatPicImage(clientlist.appointmentCustomers[key - 1].headPortrait, 'circle', 40, 'someone', clientlist.appointmentCustomers[key - 1].sex)"
                )
                img.sex(
                v-show="clientlist.appointmentCustomers[key - 1].sex === '女'",
                src="@/assets/img/female_tip.png"
                )
                img.sex(
                v-show="clientlist.appointmentCustomers[key - 1].sex === '男'",
                src="@/assets/img/male_tip.png"
                )
                .detail.h-item
                  el-tooltip(
                    :content="clientlist.appointmentCustomers[key - 1].name"
                  )
                    .name {{ clientlist.appointmentCustomers[key - 1].name }}
                  .phone {{ clientlist.appointmentCustomers[key - 1].mobile }}
              // 锁框
              li.add-item.add(
              v-for="key in (clientlist.occupation < 0 ? 0 : clientlist.occupation)",
              v-if="clientlist.available === true"
              )
                i.lock-icon.icon.iconfont.icon-icon_ope_lock(
                title="解除占用",
                @click="toLockup(clientlist, false, index, ind)"
                )

              // 加号,待解锁
              li.add-item.add(
              v-for="key in ((clientlist.capacity - clientlist.dued - clientlist.occupation) < 0 ? 0 : (clientlist.capacity - clientlist.dued - clientlist.occupation))",
              v-if="clientlist.available === true"
              )
                i.icon.iconfont.icon-icon_ope_add(
                @click="addNewOrder(clientlist)"
                )
                i.unlock-icon.iconfont.icon-icon_ope_unlock(
                title="占用",
                @click="toLockup(clientlist, true, index, ind)"
                )
              // 已过期的预约，是没有icon
              li.add-item.add(
              v-for="key in ((clientlist.capacity - clientlist.dued) < 0 ? 0 : (clientlist.capacity - clientlist.dued))",
              v-if="clientlist.available === false"
              )
                i.icon.no-icon
            // 未分配部分
            .noappo-list(
            v-for="clientlist in stafflist.appointmentDetails",
            v-if="index === tableData.staffAppointments.length - 1"
            )
              ul.info-list.noappo-ul(
              v-for="(myClient, ind) in (Math.ceil(clientlist.appointmentCustomers.length / clientlist.capacity)) || 1"
              @click="intoDetail(clientlist.appointmentCustomers[ind], clientlist)"
              )
                // 预约信息
                li.list-item.noappo-item.huang(
                  v-for="key in clientlist.capacity",
                  v-if="clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1]"
                  :class="[clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1].status === '已超时' ? 'time-out' : '']"
                )
                  img.avatar.h-item(
                  :src="formatPicImage(clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1].headPortrait, 'circle', 40, 'someone', clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1].sex)"
                  )
                  .detail.h-item
                    el-tooltip(
                      :content="clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1].name"
                    )
                      .name {{ clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1].name }}
                    .phone {{ clientlist.appointmentCustomers[ind * clientlist.capacity + key - 1].mobile }}
                li.list-item.noappo-item.add(
                :class="[clientlist.available ? 'able' : 'empty']"
                v-else
                )
    //- //已服务的预约详情
    v-order-detail(
      v-if="showDetailDialog",
      :list="detailData",
      :show="showDetailDialog",
      @close="showDetailDialog=false",
      @modify="toModify"
    )
    //- //修改预约或者待服务者的订单详情
    v-order-modify(
      ref="orderModifyRef"
      v-if="showModifyDialog",
      :show="showModifyDialog",
      :list="detailData",
      @close="showModifyDialog=false",
      @billFromAppoint="billFromAppoint",
      @cancelOrder="cancelOrder",
      :currentAppointmentId="currentAppointmentId",
      @callSuperCreateAppointmentApi="handleUpdate"
      @giveStaffInfo="getStaffInfo"
    )
    //- //在预约管理页面快速开单之选择订单
    v-choose-order(
      v-if="showChooseDialog",
      @close="showChooseDialog=false"
      @reBilling="reBilling"
      :unServicedOrderLists="unServicedOrderLists"
      :staffInfo="staffInfo"
    )
    //- 取消预约弹窗
    v-cancel-appoint(
      :cancelVisible="cancelModelVisible"
      @cancelAppoint="cancelModelVisible=false"
      @confirmCancelAppoint="confirmCancelAppoint"
    )
</template>
<script>
import DateCheck from "@/components/appoModule/DateCheck";
import OrderDetail from "./orderDetail";
import OrderModify from "./AppoModify";

import ChooseOrder from "./ChooseOrder";
import CancelAppoint from "@/components/appoints/CancelAppoint";
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import base from "@/util/base";
import { mapActions, mapState } from "vuex";
import { setTimeout } from "timers";
import * as axios from "@/util/axios";

export default {
  components: {
    "v-date-check": DateCheck,
    "v-order-detail": OrderDetail,
    "v-order-modify": OrderModify,
    "v-choose-order": ChooseOrder,
    "v-cancel-appoint": CancelAppoint
  },
  data() {
    return {
      fullscreenLoading: false,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      isRequest: false, // 是否正在请求数据
      bgColor: datas.SERVER_STATUS,
      showModifyDialog: false, // 预约详情的修改
      showDetailDialog: false, // 详情页是否显示
      showChooseDialog: false, //选择订单页面是否显示
      detailData: {}, // 表格数据
      tableData: {},
      nowTimer: {}, // 当前时间，包括日期和时间
      checkDate: null, // 用户选择的日期
      timeItemHeight: "", // 每个时间高度自动撑开
      headStyle: {}, // 头部
      timeStyle: {}, // 左侧时间
      timeBoxStyle: {}, //每个时间点
      bodyStyle: {}, // 预约内容区域
      scroll: {
        top: 0, // 滚动条滚动的纵向距离
        left: 0, // 滚动条滚动的横向距离
        e: null // 正在滚动的元素
      }, // 记录滚动条的位置
      lineStyle: {}, // 不能点击的高度
      unServicedOrderLists: [], //未服务订单
      cancelModelVisible: false,
      id_delete: 0,
      currentAppointmentId: null, //当前的预约ID
      hasOnlionOrder: false, // 该客户有无线上订单的标识
      staffInfo: {}
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  watch: {
    // 监听滚动的距离
    "scroll.left"(val) {
      // 如果为水平
      // 设置头部列表的滚动距离
      document.getElementsByClassName(
        "header-list"
      )[0].scrollLeft = this.scroll.left;
      // 设置时间列表的纵向滚动距离
      document.getElementsByClassName(
        "appo-body"
      )[0].scrollLeft = this.scroll.left;
      // }
    },
    "scroll.top"(val) {
      // 设置头部列表的滚动距离
      document.getElementsByClassName(
        "appo-time"
      )[0].scrollTop = this.scroll.top;
      // 设置头部列表的滚动距离
      document.getElementsByClassName(
        "appo-body"
      )[0].scrollTop = this.scroll.top;
      // }
    },
    "currentInfo.appoLevelId"() {
      this.dateChange(this.currentInfo.orderTime);
    },
    "$store.state.manage.menuShow"(v) {
      this.getAppoTimeHeight(500);
    }
  },
  created() {
    let _date = new Date();
    this.nowTimer = { date: _date.format("yyyy-MM-dd hh:mm") };
    if (_date.format("yyyy-MM-dd") !== this.currentInfo.orderTime) {
      this.clearTime();
    }
  },
  mounted() {
    let _this = this;
    window.onresize = base.debounce(function() {
      _this.getAppoTimeHeight(500);
    });
  },
  methods: {
    ...mapActions([
      "saveCurrentInfo",
      "saveOperate",
      "clearTime",
      "saveCustomerInfo", // 旧的预约统一存储，manage [待删除]
      "setBillOrigin",
      "setAppointId",
      "setCurrentAppo", // 独立的预约业务数据
      "setAppoEntry", // 独立的预约编辑/新增入口 (编辑其实是带了服务者id和时间的新增预约)
      "saveOnTheWayOrderIds",
      "clearBillInfo",
      "setIsCount",
      "saveStaffInfo",
      "setSelectedGoods",
      "saveCurrentInfo"
    ]),
    bodyScroll(e) {
      e.stopPropagation();
      e.preventDefault();
      let event = e.target;
      // console.log(this.scroll.left, e.target.scrollLeft)
      // 判断是否是水平还是垂直
      if (this.scroll.left !== event.scrollLeft) {
        // 为水平
        this.scroll.e = "h"; // 为水平
        this.scroll.left = event.scrollLeft;
      } else if (this.scroll.top !== event.scrollTop) {
        // 为垂直
        this.scroll.e = "v"; // 为垂直
        this.scroll.top = event.scrollTop;
      }
    },
    // 动态设置预约时间的高度
    getAppoTimeHeight(ms = 0) {
      // this.$nextTick
      // 测试发现500毫秒才能获取到正确的dom渲染
      setTimeout(() => {
        let container = document.getElementsByClassName("appo-container")[0];
        if (!container) {
          return;
        }
        // 总容器的宽度
        let containerW = container.offsetWidth;
        // 总容器的宽度
        let containerH = container.offsetHeight;
        // 选择日期的宽度
        let pickerW = document.getElementsByClassName("date_area")[0]
          .offsetWidth;
        // 选择日期的宽度
        let pickerH = document.getElementsByClassName("date_area")[0]
          .offsetHeight;
        // 一个预约点的高度
        let timeH = document.getElementsByClassName("info-list")[0]
          .offsetHeight;
        // 不能点击的高度，红线的距离
        this.lineStyle = {
          top:
            document.querySelectorAll(".time-item.disabled").length * timeH +
            "px"
        };
        var stopSetTime = false;
        // 头部列表限定长度
        this.headStyle = {
          width: containerW - pickerW + "px" // 两者差值
        };
        // 左侧时间列表限定高度
        this.timeStyle = {
          height: containerH - pickerH + "px", // 两者差值
          marginTop: pickerH + "px" // 两者差值
        };
        // 左侧时间列表的每个时间限定高度
        this.timeBoxStyle = {
          height: timeH - 1 + "px", // 两者差值
          lineHeight: timeH - 1 + "px" // 两者差值
        };
        this.bodyStyle = {
          marginTop: pickerH + "px", // 两者差值
          width: containerW - pickerW + "px", // 两者差值
          height: containerH - pickerH + "px" // 两者差值
        };
        let vm = this;
        var timer = null;
        if (!document.getElementsByClassName("appo-body")[0]) {
          return;
        }
        if (this.checkDate == utils.formatDate(new Date())) {
          window.setTimeout(function() {
            var realAim =
              parseInt(vm.lineStyle.top) -
              document.querySelectorAll(".time-item.disabled")[
                document.querySelectorAll(".time-item.disabled").length - 1
              ].offsetHeight;
            document.getElementsByClassName("appo-body")[0].scrollTop = realAim;
          }, 5);
        } else {
          document.getElementsByClassName("appo-body")[0].scrollTop = 0;
        }
      }, ms);
    },
    checkOppoStatus(time, newTime) {
      if (utils.formatToStamp(time) < utils.formatToStamp(newTime)) {
        return true;
      } else {
        return false;
      }
    },
    dateChange(date) {
      // 这个方法以后改成 this.setCurrentAppo({orderTime: date})
      this.saveCurrentInfo({ orderTime: date });
      let that = this;
      this.checkDate = date;
      let params = {
        levelId: this.currentInfo.appoLevelId,
        localDate: date,
        storeId: this.currentInfo.shopId
      };
      this.isRequest = true;
      this.fullscreenLoading = true;
      axios
        .post(api.getAppointmentDailyData.URL, params)
        .then(res => {
          this.appoDailyRes(res);
        })
        .catch(() => {
          this.fullscreenLoading = false;
        });
    },
    // 处理预约日历数据
    appoDailyRes(res) {
      this.tableData = res;
      this.getAppoTimeHeight();
      this.isRequest = false;
      this.fullscreenLoading = false;
    },
    // 显示预约详情
    intoDetail(data, info) {
      this.currentAppointmentId = data.appointmentId;
      this.id_delete = data.appointmentId; //待删除id
      axios.get("/getAppointmentById/" + data.appointmentId).then(res => {
        this.getAppointmentDetailRes(res);
      });
    },
    // 获取预约详情回调
    getAppointmentDetailRes(res) {
      this.detailData = res;
      // 对话框需要显示预约开单信息，故v2以后在此清除vuex数据(原本应该在更后面的逻辑中清除的)
      this.clearBillInfo();
      this.saveCurrentInfo({cpLevelId: null})
      this.setIsCount(true); // 计客数默认
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
    },
    // 解锁,调用解除占用接口
    toLockup(data, status, i, j) {
      this.fullscreenLoading = true;
      // 如果type为add,则调用加锁
      // 如果type为remove,则调用解锁
      let params = {
        status: status,
        occupyTime: this.currentInfo.orderTime + " " + data.time,
        staffId: data.staffId
      };
      // 开始加锁
      axios.post(api.addAppointmentOccupation.URL, params).then(res => {
        if (res.success) {
          if (status) {
            // 改变现有的列表显示
            this.tableData.staffAppointments[i].appointmentDetails[j]
              .occupation++;
          } else {
            // 改变现有的列表显示
            this.tableData.staffAppointments[i].appointmentDetails[j]
              .occupation--;
          }
          // 提示
          utils.showTip(this, { msg: res.message, type: "success" });
        } else {
          // 提示
          utils.showTip(this, { msg: res.message, type: "error" });
        }
        this.fullscreenLoading = false;
      });
    },
    // 新增预约
    addNewOrder(data) {
      // 根据员工id获取员工信息
      axios.get(api.getStoreStaffInfo.URL + data.staffId).then(res => {
        // 记录点击预约列表的新增时预约时间
        let _data = {
          time: data.time,
          level: res.level,
          userName: res.userName,
          staffId: data.staffId
        };
        this.toRecordInfo(_data);

        // 区别是带了预约的服务者和时间段
        this.saveOperate({ clickEnter: "edit" }); // 旧的通用的入口
        this.setAppoEntry("edit"); // 新的独立入口
        this.$router.push("/shop-inner/appo-addnew?");
      });
    },
    toRecordInfo(data) {
      this.saveCurrentInfo({
        appoTime: data.time,
        staffLevel: data.level,
        staffName: data.userName,
        cpStaffId: data.staffId,
        appointmentId: data.appointmentId
      });
      // 独立出来的预约业务数据
      this.setCurrentAppo({
        appoTime: data.time,
        staffLevel: data.level,
        staffName: data.userName,
        cpStaffId: data.staffId,
        appointmentId: data.appointmentId
      });
    },
    // 修改员工的推荐状态
    changeRecommend(appo, index) {
      let params = {
        id: appo[0].staffId,
        recommended: !this.tableData.staffAppointments[index]
          .appointmentStaffInfo.recommend
      };
      // 调用修改员工的推荐状态
      axios.post(api.updateStaffRecommendStatus.URL, params).then(res => {
        if (res.success) {
          let status = this.tableData.staffAppointments[index]
            .appointmentStaffInfo.recommend;
          // 直接修改列表中当前员工的推荐状态
          this.tableData.staffAppointments[
            index
          ].appointmentStaffInfo.recommend = !status;
          // 提示
          utils.showTip(this, { msg: res.message, type: "success" });
        } else {
          // 提示
          utils.showTip(this, { msg: res.message, type: "success" });
        }
      });
    },
    hiddenDialog(data) {
      this[data] = false;
      if (data === "showModifyDialog") {
        this.dateChange(this.currentInfo.orderTime);
      }
    },
    // 去修改预约信息
    toModify() {
      // 先隐藏预约详情弹窗
      this.hiddenDialog("showDetailDialog");
      // 再显示预约修改弹窗
      this.showModifyDialog = true;
    },
    // 预约详情进入开单入口的判断方法
    billFromAppoint() {
      let params = {
        customerId: this.detailData.customer.id,
        staffId: this.detailData.appointment.staffId,
        storeId: this.currentInfo.shopId,
        serviceOrderId: this.detailData.appointment.serviceOrderId
      };
      // 查询线上订单
      axios.post("/getUnservicedOrderList", params).then(res => {
        this.saveOnTheWayOrderIds([]);
        this.handleGetUnservicedLists(res);
      });
    },
    handleGetUnservicedLists(res) {
      // 在这里将v2需要的新数据存入vuex中
      // 。。。这里要从子(孙)组件中拿数据。。
      this.$nextTick(() => {
        // 存入开单人信息
        this.$refs.orderModifyRef.getSonStaffInfo();
      });
      if (res.orderList.length === 0) {
        this.hasOnlionOrder = false;
        // 这里不可以直接到选择服务， 游湖体验
        // this.$router.push("/shop-inner/choose-person");
      } else {
        this.hasOnlionOrder = true;
        // 以前的页面 这个要关一下。。父dialog是自己封装的
        this.showModifyDialog = false;
        // 有线上订单的需要去叔组件处理。。。为什么不用vuex？ 这一块state已经有上百个数据了
        this.unServicedOrderLists = res.orderList.map(item => {
          item.disabled = item.selected || !item.orderEnable || false;
          return item;
        });
        this.showChooseDialog = true;
      }
    },
    // 在此获取孙组件的服务人信息。。
    getStaffInfo(data) {
      // 终于拿到了。然后存进v2的vuex中
      if (this.hasOnlionOrder) {
        // 如果有订单。将数据给孙组件的叔组件处理。。
        this.staffInfo = data;
      } else {
        console.log(data);
        // 存入商品信息。做数据
        this.setSelectedGoods();
        this.makesetSelectedGoods(data)
      }
    },
    // 做数据
    async makesetSelectedGoods(data) {
      // 做数据之前先请求接口。。不然缺少字段 createConsumerOrderFromAppointment
      let serviceInfos = [];
      try {
        const res = await axios.post("createConsumerOrderFromAppointment", {
          appointmentId: data.id,
          productOrderIds: [],
          serviceOrderIds: []
        });
        serviceInfos = res.serviceInfos.map(i => {
          return {
            ...i, // 这行不要写在下方[需覆盖]后面
            id: data.id, // 预约取单id？
            deleted: false, // 是否删除
            name: i.serviceName,
            memberPrice: i.price, // 对应的规格的会员价
            storeRemark: data.frontDeskNotes, // 门店备注
            storePreference: 0, // 门店优惠
            shopPrice: i.storePrice, // 对应的规格的门店价
            enableCardDiscount: true, // 是否允许卡打折???
            tempFinalPrice: i.paymentStatus ? 0 : i.price * i.count, // 临时最终价 - 同规格会员价(这个数字是要乘数量的)
            staffId: data.staffId, // 作为开单人
            staffName: data.staffName, // 作为开单人
            assistantOrSalers: [], // 工位2， 销售人?
            stationThree: [], // 工位3
            stationOne: [
              // 工位1
              {
                // 开单人自动加入第一工位
                ratio: 100, // 业绩比例
                isChosen: true, // 非指定
                staffName: data.staffName,
                staffId: data.staffId,
                shopNum: 100,
                levelId: data.staffLevelId,
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
      }
    },
    reBilling() {
      this.showModifyDialog = false;
      this.showChooseDialog = false;
    },
    cancelOrder() {
      this.cancelModelVisible = true;
    },
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
    cancelAppointmentRes(res) {
      this.cancelModelVisible = false;
      if (res.success) {
        this.dateChange(this.currentInfo.orderTime);
        this.$message({
          type: "success",
          message: res.message
        });
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    handleUpdate(data) {
      axios.post(api.createAppointment.URL, data).then(res => {
        this.modifyAppointmentRes(res);
      });
    },
    modifyAppointmentRes(res) {
      if (res.success) {
        utils.showTip(this, { msg: res.message, type: "success" });
        this.dateChange(this.currentInfo.orderTime);
        this.showModifyDialog = false;
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.noappo-list {
  text-align: left;
  .info-list {
    display: inline-block;
  }
}
.name {
  width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

