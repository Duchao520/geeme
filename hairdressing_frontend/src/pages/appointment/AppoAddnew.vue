<template>
  <div style="padding-top:70px;" ref="pages">
    <seed-header :title="'新增预约'" :hasTabs="false"></seed-header>
    <div class="con_">
      <div class="main-con">
        <el-form ref="form" :model="form" :rules="formRules">
          <div class="form-line">
            <div class="form-title">
              <span class="xing">选择客户</span>
            </div>
            <div class="form-con">
              <el-form-item prop="customerId" class="choose-customer"
                :rules="[{ required: true, trigger: 'change', validator: customerIdValidator }]"
              >
                <select-customer
                  :phone="customer.searchPhone"
                  width="450px"
                  @choose="chooseCustomer"
                  ref='customerPopover'
                ></select-customer>
                <div class="addButton" @click="showAddCustomer = true" style="margin-left:15px;">
                  <i style="margin-right:2px;" class="icon iconfont icon-icon_ope_append"></i>
                  <span>新增客户</span>
                </div>
              </el-form-item>
            </div>
          </div>

          <div class="form-line user-box" v-if="!!customerInfo.length">
            <div class="form-title"></div>
            <div class="form-con">
              <user-box :list="customerInfo"></user-box>
            </div>
          </div>
          <div class="form-line" v-if="showAddCustomer">
            <div class="form-title"></div>
            <div class="form-con">
              <el-form ref="formAddNew" :model="formAddNew" :rules="formAddNewRules">
                <div style="display:flex">
                  <el-form-item prop="name" style="width:220px;margin-right:10px">
                    <el-input v-model="formAddNew.name" maxlength="16" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-form-item prop="sex" style="width:220px;">
                    <el-select v-model="formAddNew.sex" placeholder="性别" ref="sexSelect">
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item prop="mobilePhone" style="width:450px;">
                  <!-- <el-input v-model.number="formAddNew.mobilePhone" placeholder="请输入新客户手机号码"></el-input> -->
                  <div class="el-input" id="customer-add-input-box">
                    <input type="text"  placeholder="请输入新客户手机号码" v-model.number="formAddNew.mobilePhone" @keyup="checkoutIsExist" maxlength="11">
                  </div>
                </el-form-item>
                <div style="margin-bottom:20px;">
                  <el-button class="normal_blue_btn" @click="confirmCustomer">添加</el-button>
                  <el-button class="normal_gray_btn" @click="showAddCustomer = false">取消</el-button>
                </div>
              </el-form>
            </div>
          </div>
          <div class="form-line">
            <div class="form-title">
              <span class="xing">预约到店时间</span>
            </div>
            <div class="form-con date-time" id="date-time">
              <el-form-item prop="date" style="margin-right:10px;">
                <el-date-picker
                  v-model="form.date"
                  type="date"
                  placeholder="请选择日期"
                  @change="dateChange"
                  :disabled="disabled"
                  :clearable="false"
                  ref ='elDatepicker'
                  :picker-options="setDisabledDate"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="time">
                <el-select ref="elTimeSelect" v-model="form.time" :disabled="disabled" placeholder="请选择时间" @change="selectTime" :popper-append-to-body='false'>
                  <el-option
                    v-for="item in appoWeekDay.availableAppointTimes"
                    :key="item"
                    :label="item"
                    :value="item"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <br>
            </div>
          </div>
          <div class="form-line" style="margin:-15px 0;">
            <div class="form-title"></div>
            <div class="form-con">
              <span style="font-size: 14px;color: #606266;">可预约时间：{{canWeekDayTip}}</span>
            </div>
          </div>
          <div class="form-line">
            <div class="form-title">
              <span class="xing">服务者和服务</span>
            </div>
            <div class="form-con">
              <el-form-item style="width:220px" prop="staffId">
                <el-cascader
                  placeholder="请选择服务者"
                  :props="optionsConfig"
                  :disabled="disabled || !form.customerId"
                  :options="staffList"
                  v-model="currentStaff"
                  ref='elCascaderP'
                  @change="changeStaff">
                </el-cascader>
              </el-form-item>
              <div class="services-lists">
                <div class="services-list">
                  <el-form-item
                    v-for="(serviceItem,index) in form.appointmentServiceInfoList"
                    :key="index"
                    :prop="'appointmentServiceInfoList.' + index + '.currentService'"
                    :rules="{required:true,validator:validateServiceName,trigger:'change'}"
                  >
                    <el-cascader
                      :ref ='`elCascader${index}`'
                      placeholder="请选择服务"
                      :props="optionsConfig"
                      :disabled="!form.customerId"
                      :options="formatDataForService(serviceList)"
                      v-model="serviceItem.currentService"
                      @change="handleServiceSected(serviceItem.currentService, index)"
                    >
                    </el-cascader>
                  </el-form-item>
                </div>
                <div class="services-list">
                  <el-form-item
                    v-for="(serviceItem,index) in form.appointmentServiceInfoList"
                    :key="index"
                    :prop="'appointmentServiceInfoList.' + index + '.specificationId'"
                    :rules="{required:true,message:'请选择服务规格',trigger:'change'}"
                  >
                    <el-select :disabled="!form.customerId" :ref="`elSpSelect${index}`" v-model="serviceItem.specificationId" placeholder="请选择规格" :popper-append-to-body='false'>
                      <el-option
                        v-for="(item,specificationIndex) in serviceItem.specificationLists"
                        :key="specificationIndex"
                        :label="item.name"
                        :value="item.id"
                        @click.native="chooseSpecific(item,index)"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="services-list">
                  <el-form-item
                    v-for="(serviceItem,index) in form.appointmentServiceInfoList"
                    :key="index"
                    :prop="'appointmentServiceInfoList.' + index + '.count'"
                    :rules="{required:true,validator:countVali,trigger:'change'}"
                  >
                    <input-number :editable="!!form.customerId" :max="1000" :min="1" v-model="serviceItem.count" ></input-number>
                    <i
                      v-if="index!==0"
                      style="margin-left:2px;cursor:pointer;color:#BEC3C6"
                      @click="delServiceItem(index)"
                      class="icon iconfont icon-icon_operate_delete"
                    ></i>
                  </el-form-item>
                </div>
              </div>
              <div class="addButton" @click="addService" v-if="form.appointmentServiceInfoList.length < 10">
                <i style="margin-right:2px;" class="icon iconfont icon-icon_ope_append"></i>
                <span>添加服务</span>
              </div>
            </div>
          </div>
          <!-- 预约金额不再显示 - 改为仅在预约详情展示(客户更换后可能导致金额计算不正确, 需要重新遍历) -->
          <!-- <div class="form-line">
            <div class="form-title">
              合计金额
            </div>
            <div class="form-con">
              <span>{{(getTotalPrice).toFixed(2)}}元</span>
            </div>
          </div> -->

          <!--  1.0 预约金不做
          <div class="form-line">
            <div class="form-title">
              预约金
            </div>
            <div class="form-con">
              <span>{{inAll.bookingInAll}}元</span>
              <span style="color:#FF6D61;margin-left:10px;">未支付</span>
            </div>
          </div>
           -->
          <div class="form-line">
            <div class="form-title">
              <span>备注</span>
            </div>
            <div class="form-con">
              <el-form-item>
                <input-with-count v-model="form.notes" placeholder="请输入备注" style="width:420px" :autosize="{minRows: 5, maxRows: 100}"></input-with-count>
              </el-form-item>
            </div>
          </div>
          <div class="form-line">
            <div class="form-title"></div>
            <div class="form-con">
              <el-button class="normal_blue_btn" :loading="submitLoading" @click="openBill">确定</el-button>
              <el-button plain class="plain_gray_btn" @click="$router.go(-1)">取消</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios';
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { reg, checkReg } from "@/assets/js/RegExp";
import SeedHeader from "@/components/common/SeedHeader";
import UserBox from "@/components/appoModule/userBox";
import SelectCustomer from "@/components/appoModule/selectCustomer";
import SelectStaff from "@/components/appoModule/selectStaff";
import InputWithCount from "@/components/common/InputWithCount";
import InputNumber from "@/components/common/InputNumber";
import {mapActions, mapState} from 'vuex'
import { variableDeclaration } from 'babel-types';

export default {
  components: {
    "seed-header": SeedHeader,
    "select-staff": SelectStaff,
    "input-with-count": InputWithCount,
    "select-customer": SelectCustomer,
    "user-box": UserBox,
    'input-number':InputNumber
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (value && !checkReg(reg["phone"], value)) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    let validateSpecificationId = (rule, value, callback) => {
      if (!checkReg(reg["positiveInteger"], value)) {
        callback(new Error("请选择服务规格"));
      } else {
        callback();
      }
    };
    let validateServiceName = (rule, value, callback) => {
      if (value && value.length) {
        callback();
      } else {
        callback(new Error("请选择服务项目"));
      }
    };
    let countVali = (rule, value, callback) => {
      console.log(value)
      if(value>=1 && value<=1000){
        callback()
      }
      else{
        callback("请输入1到1000之间的数字")
      }
    };
    return {
      submitLoading: false, // 按钮的加载状态
      validateServiceName,
      countVali,
      disabled: false,
      form: {
        mobile: "",
        date: "",
        time: "",
        levelName: "",
        levelId: null,
        storeId: 0,
        customerId: null,
        staffId: null,
        appointmentServiceInfoList: [
          {
            count: 1,
            specificationId: null,
            serviceName: null,
            bookingAmount: 0,
            price: 0,
            specificationLists: [
              { id: null, name: null, price: null, bookingAmount: null }
            ]
          }
        ],
        amount: 0,
        notes: ""
      },
      formRules: {
        date: [{ required: true, trigger: "blur", message: "请选择日期" }],
        time: [{ required: true, trigger: "blur", message: "请选择时间" }],
        staffId: [
          { required: true, trigger: "change", message: "请选择服务者" }
        ],
        levelId: [
          { required: true, trigger: "blur", message: "请选择服务项目" }
        ]
      },
      formAddNew: {
        name: null,
        sex: null,
        mobilePhone: null
      },
      formAddNewRules: {
        // name: [{ required: true, trigger: "blur", message: "请填写姓名" }],
        sex: [{ required: true, trigger: "change", message: "请填写性别" }],
        mobilePhone: [
          { required: false, trigger: "change", validator: validatePhone }
        ]
      },
      customer: { searchPhone: "", name: null, sex: null, mobile: null },
      optionsConfig: {
        value: 'id',
        label: 'name',
        children: 'list',
      },
      staffList: [], // 服务者下拉列表
      currentStaff: [], // 当前的服务者 [levelId, staffId]
      serviceList: [],
      selectedServices: [],
      showAddCustomer: false,
      canWeekDayTip: "",
      customerInfo: [],
      appoWeekDay: {availableAppointTimes:[]},
      timerPicker: { start: null, step: null, end: null },
      priceCompare: {},
    };
  },
  computed: {
    getTotalPrice() {
      let price = 0
      this.form.appointmentServiceInfoList.forEach(service => {
        service.specificationId && (price += this.priceCompare[service.specificationId] * service.count)
      })
      return isNaN(price) ? 0 : price
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    inAll() {
      var serviceList = this.form.appointmentServiceInfoList;
      if (serviceList.length === 0) {
        return {
          inAll: 0,
          bookingInAll: 0
        };
      } else {
        var inAll = 0;
        var bookingInAll = 0;
        serviceList.forEach(element => {
          inAll += element.price * element.count;
          bookingInAll += element.bookingAmount * element.count;
        });
        return {
          inAll: Math.round(Number(inAll) * 100) / 100,
          bookingInAll: Math.round(Number(bookingInAll) * 100) / 100
        };
      }
    },
    clickEnter() {
      return this.$store.state.appointment.appoEntry
    },
    appointment() {
      return this.$store.state.appointment
    },
    setDisabledDate() {
      return {
        disabledDate: (time) => {
          // 指定客需要开发之前的时间
          // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > +(new Date(this.maxDate))
          return time.getTime() > +(new Date(this.maxDate))
        }
      }
    },
  },
  created() {
    this.init();
  },
  mounted() {
    let dom = document.getElementsByTagName('body')[0]
    dom.addEventListener('scroll', this.scrollFunc, false)
  },
  beforeDestroy() {
    let time = {orderTime: new Date().format('yyyy-MM-dd')}
    this.saveCurrentInfo({...time})
    if (document.removeEventListener)
      document.removeEventListener('mousewheel',this.scrollFunc, false);
    else if (document.deattachEvent) {               /*IE*/
      document.deattachEvent('onmousewheel',this.scrollFunc);
    }
  },
  methods: {
    ...mapActions([
      'saveCurrentInfo'
    ]),
    scrollFunc(e) {
      // v2.12.0  toggleDropDownVisible ; 旧的- handleClickoutside
      this.$refs.customerPopover && this.$refs.customerPopover.handleClose() // 选择客户 [type: popover]
      this.$refs.sexSelect && this.$refs.sexSelect.handleClose() // 性别 [type: select]
      this.$refs.elDatepicker && this.$refs.elDatepicker.handleClose() // 日期 [type: datepicker]
      this.$refs.elTimeSelect && this.$refs.elTimeSelect.handleClose() // 时间  [type: select]
      this.$refs.elCascaderP && this.$refs.elCascaderP.toggleDropDownVisible(false) // 服务者 [type: cascader]
      this.form.appointmentServiceInfoList.map((item, idx) => {
        // [0] !!
        this.$refs[`elCascader${idx}`][0] && this.$refs[`elCascader${idx}`][0].toggleDropDownVisible(false) // 服务 [type: cascader]
        this.$refs[`elSpSelect${idx}`][0] && this.$refs[`elSpSelect${idx}`][0].handleClose() // 规格 [type: select]
      })
    },
    init() {
      if (this.clickEnter === "edit") {
        this.form.date = this.currentInfo.orderTime;
        this.form.time = this.currentInfo.appoTime;
        this.form.staffId = this.$store.state.appointment.currentAppo.cpStaffId
        this.form.levelId = this.$store.state.appointment.currentAppo.staffLevel
        this.currentStaff = [this.form.levelId, this.form.staffId]
        this.disabled = true
        // this.changeStaff({
        //   id: this.form.staffId,
        //   levelId: this.form.levelId
        // });
      }
      this.selectTime();
      axios.post(
        `/getAvailableAppointTimeByStoreId`,
        { storeId: this.currentInfo.shopId }
      ).then(res => {
        this.getAppoTimeRes(res)
      })
    },
    getAppoTimeRes(res) {
      this.appoWeekDay = res;
      // 日期组件结束时间 // 该时间这里暂时不是动态的, 后端是动态的
      this.maxDate = +(new Date(res.maxAppointTime))
      this.getCanWeekDayTip(this.appoWeekDay.availableAppointDays);
    },
    getCanWeekDayTip(data) {
      let result = [];
      let beforeToString = [];
      let sortMap = {
        MONDAY: { name: "周一", idx: 1 },
        TUESDAY: { name: "周二", idx: 2 },
        WEDNESDAY: { name: "周三", idx: 3 },
        THURSDAY: { name: "周四", idx: 4 },
        FRIDAY: { name: "周五", idx: 5 },
        SATURDAY: { name: "周六", idx: 6 },
        SUNDAY: { name: "周日", idx: 7 }
      };
      data.map(v => {
        result.push(sortMap[v]);
      });
      result = utils.jsonSort(result, "idx");
      result.map(v => {
        beforeToString.push(v.name);
      });
      this.canWeekDayTip = beforeToString.join("、");
    },
    dateChange(data) {
      if (!data) return;
      if (!utils.isInString(this.canWeekDayTip, datas.WEEKDAY[data.getDay()])) {
        this.form.date = null;
        utils.showTip(this, {
          // msg: "可预约时间为" + this.canWeekDayTip,
          msg: "该时间不在门店的营业时间范围内，不可预约!",
          type: "error"
        });
        return;
      }
      this.selectDataChanged('date')
    },
    chooseCustomer(data) {
      this.customerInfo = [data];
      this.form.customerId = data.id;
      this.$refs.form.validateField("customerId");
      // - 如果是编辑预约 （加号进入）
      if (this.clickEnter === "edit") {
        let params = {
          storeId: this.currentInfo.shopId,
          storeCustomerId: data.id,
          levelId: this.form.levelId
        };
        axios.post(
          `/getServiceListByStoreIdAndSortOneAndLevel`,
          params
        ).then(res => {
          this.getServerListRes(res);
        })
      }
    },
    selectTime() {
      if (this.form.date && this.form.time) {
        if (this.form.date.length === 10) {
          var params = {
            storeId: this.currentInfo.shopId,
            arriveTime: this.form.date + " " + this.form.time
          };
        } else {
          var params = {
            storeId: this.currentInfo.shopId,
            arriveTime:
              utils.formatDateTimeYYR(this.form.date) + " " + this.form.time
          };
        }
        this.selectDataChanged('time')
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在查询可用的服务者和服务',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.1)'
        // });
        axios.post(`/getAvailableSimpleStaffList`, params).then(res => {
          // this.dataBeanList = res.dataBeanList;
          // loading.close();
          // 格式化数据成级联数据
          let arr = []
          res.dataBeanList.forEach(item => {
            let level = {id: item.levelId, name: item.name, list: item.staffList}
            arr.push(level)
          })
          this.staffList = arr
        });
      }
    },
    changeStaff(data) {
      this.selectDataChanged('staff')
      this.form.staffId = data[1]
      this.form.levelId = data[0]
      let params = {
        storeId: this.currentInfo.shopId,
        storeCustomerId: this.form.customerId,
        levelId: data[0]
      };
      axios.post(
        `/getServiceListByStoreIdAndSortOneAndLevel`,
        params
      ).then(res => {
        this.getServerListRes(res);
      })
    },
    getServerListRes(res) {
      console.log(res);
      this.serviceList = res.service;
      let arr = []
      res.service.forEach(item => {
        let service = {id: item.levelOneId, name: item.levelOneName, list: item.serviceForAppointments}
        arr.push(service)
      })
      arr.forEach(lv1 => {
        lv1.list && lv1.list.forEach(lv2 => {
          lv2.specification && lv2.specification.forEach(sp => {
            this.priceCompare[sp.id] = sp.price
          })
        })
      })
    },
    chooseSpecific(data, index) {
      this.selectDataChanged('sp', index)
      this.form.appointmentServiceInfoList[index].bookingAmount =
        data.bookingAmount;
      this.form.appointmentServiceInfoList[index].price = data.price;
      this.form.appointmentServiceInfoList[index].specificationId = data.id;
      if (this.selectedServices.indexOf(data) !== -1) {
        return;
      }
      this.selectedServices.push(data);
    },
    addService() {
      // if (this.form.appointmentServiceInfoList.length >= 10) {
      //   utils.showTip(this, { msg: '服务项目最多10个', type: "warning" })
      //   return false
      // }
      this.form.appointmentServiceInfoList.push({
        count: 1,
        specificationId: null,
        serviceName: null,
        bookingAmount: 0,
        price: 0,
        specificationLists: [
          { id: null, name: null, price: null, bookingAmount: null }
        ]
      });
    },
    openBill() {
      // 需要增加校验服务规格是否重复!
      let ready = []
      this.form.appointmentServiceInfoList.forEach(item => {
        item.specificationId && ready.push(item.specificationId)
      })
      ready = [...new Set(ready)]
      if (ready.length !== this.form.appointmentServiceInfoList.length) {
        // 这里是不合法的提交，有重复的规格（新旧快照id只存在一个时可以提交）
        utils.showTip(this, {msg: '您选择的服务有重复或者服务规格不完整，请确认后再提交', type: 'error'})
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = this.form;
          let appointmentServiceInfoList = [];
          form.appointmentServiceInfoList.forEach(element => {
            appointmentServiceInfoList.push({
              count: element.count,
              specificationId: element.specificationId,
              // status: false,
              id: element.id
            });
          });
          let params = {
            storeId: this.currentInfo.shopId,
            customerId: form.customerId,
            staffId: this.disabled ? this.currentInfo.cpStaffId : form.staffId,
            appointmentServiceInfoList: appointmentServiceInfoList,
            dueTime:
              this.form.date.length === 10
                ? form.date + " " + form.time
                : utils.formatDateTimeYYR(form.date) + " " + form.time,
            amount: this.inAll.bookingInAll,
            notes: form.notes
          };
          this.submitLoading = true
          axios.post(
            `/createAppointment`,
            params
          ).then(res => {
            this.submitLoading = false
            this.createAppointmentRes(res)
          }).catch(err => {
            this.submitLoading = false
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createAppointmentRes(res) {
      if (res.success) {
        utils.showTip(this, { msg: res.message, type: "success" });
        let date = new Date().format('yyyy-MM-dd')
        this.saveCurrentInfo({orderTime: date})
        // this.$router.push("/shop-inner/appo/appo-time");
        this.$router.go(-1)
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    confirmCustomer() {
      this.$refs.formAddNew.validate(valid => {
        if (valid) {
          let params = {
            name: this.formAddNew.name,
            mobile: this.formAddNew.mobilePhone || null,
            sex: this.formAddNew.sex,
            storeId: this.currentInfo.shopId
          };
          axios.post(
            '/addCustomerForAppointment',
            params
          ).then(res => {
            this.addCustomerRes(res)
          })
        }
      });
    },
    addCustomerRes(res) {
      if (res.success) {
        this.showAddCustomer = false;
        utils.showTip(this, { msg: res.message, type: "success" });
        this.form.customerId = res.id;
        // - 如果是编辑预约 （加号进入）
        if (this.clickEnter === "edit") {
          let params = {
            storeId: this.currentInfo.shopId,
            storeCustomerId: res.id,
            levelId: this.form.levelId
          };
          axios.post(
            `/getServiceListByStoreIdAndSortOneAndLevel`,
            params
          ).then(res => {
            this.getServerListRes(res);
          })
        }
        this.form.mobile = this.formAddNew.mobilePhone;
        this.formAddNew = { name: null, sex: null, mobilePhone: null };
        this.$nextTick(()=> {
          this.customerInfo = [res.customer]
        })
        // axios.post('/listCustomerLikeMobile', {likeMobile: this.form.mobile, storeId: this.currentInfo.shopId}).then(res => {
        //   this.$nextTick(()=> {
        //     this.customerInfo = res.customerForAppointments
        //   })
        // })
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    delServiceItem(index) {
      var newArr = [];
      var appointmentServiceInfoList = this.form.appointmentServiceInfoList;
      for (let i = 0; i < appointmentServiceInfoList.length; i++) {
        if (index !== i) {
          newArr.push(appointmentServiceInfoList[i]);
        }
      }
      this.form.appointmentServiceInfoList = JSON.parse(JSON.stringify(newArr));
    },
    changeCount(index) {
      if (!index) {
        this.form.appointmentServiceInfoList[index].count = 1;
      }
    },
    handleServiceSected(data, index) {
      this.selectDataChanged('service', index)
      let serviceList = this.formatDataForService(this.serviceList)
      let options = [] // 当前规格选项
      serviceList.forEach(lv1 => {
        if (lv1.id === data[0]) {
          lv1.list.forEach(lv2 => {
            if (lv2.id === data[1]) {
              options = lv2.specification
            }
          })
        }
      })
      this.form.appointmentServiceInfoList[index].id = data[1]
      this.form.appointmentServiceInfoList[index].specificationLists = options
    },
    // 监听选择的数据变化 日期 -> 数量 , 并逐级往下重置
    selectDataChanged(type, index=0) {
      switch(type) {
        case 'date':
          this.form.time = null
        case 'time':
          if(this.disabled) {
            this.form.levelId = this.currentStaff[0]
            this.form.staffId = this.currentStaff[1]
          } else {
            this.currentStaff = []
            this.form.levelId = null
            this.form.staffId = null
          }
          this.serviceList = []
        case 'staff':
          this.form.appointmentServiceInfoList =  [{
            count: 1, // 数量
            specificationId: '', // 选中的规格id
            currentService: [], // 选中的服务id （1，2级）
            specificationLists: [{ id: null, name: '' }] // 规格选项数组
          }]
        case 'service':
          this.form.appointmentServiceInfoList[index].specificationId = null
        case 'sp':
          this.form.appointmentServiceInfoList[index].count = 1
          break
        default:
          console.log('error')
      }
    },
    formatDataForService(apiRes) {
      let arr = []
      apiRes.forEach(item => {
        let service = {id: item.levelOneId, name: item.levelOneName, list: item.serviceForAppointments}
        arr.push(service)
      })
      return arr
    },
    checkoutIsExist: utils.debounce(
      function() {
        if (this.formAddNew.mobilePhone.toString().length === 11) {
          let params = {brandId: this.currentInfo.brandId, mobile: this.formAddNew.mobilePhone, storeId: this.currentInfo.shopId}
          axios.post('/getCustomerInfoByMobile', params).then(res => {
            if (res.hit) {
              let data = {
                headPortrait: res.headPortrait,
                id: res.customerId,
                memberLevel: res.memberLevel,
                mobile: res.telephone,
                name: res.customerName,
                sex: res.sex,
              }
              this.chooseCustomer(data)
            } else {
              // 不处理...
            }
          })
        }
      },
      200
    ),
    customerIdValidator(rule, value, cb) {
      if (this.form.customerId > 0) {
        cb();
      } else {
        cb(new Error("请输入正确的手机号并选择客户"));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.xing:before {
  content: "*";
  color: #e6333f;
}
.con_ {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  line-height: 40px;
  font-size: 14px;

  .main-con {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    width: 100%;
    box-sizing: border-box;
    padding: 55px 44px;
    max-width: 1440px;
    min-height: calc(100vh - 115px);
    margin: 0 auto;
    border-radius: 8px;
  }
  .user-box {
    margin: -5px 0 10px 0;
  }
  .form-line {
    display: flex;
    line-height: 40px;
    min-height: 60px;
    .form-title {
      width: 120px;
      text-align: right;
    }
    .form-con {
      margin-left: 20px;
      flex: auto;
      .select-service {
        display: flex;
        /deep/ .el-select {
          width: 220px;
          margin-right: 20px;
        }
      }
      .choose-customer {
        display: flex;
        /deep/ .el-form-item__content {
          display: flex;
        }
      }
    }
  }
}
.addButton {
  color: #58c9f3;
  font-size: 14px;
  display: inline;
  cursor: pointer;
}
#date-time {
  display: flex;
  /deep/ input {
    width: 220px;
  }
}
.services-lists {
  display: flex;
  .services-list {
    margin-right: 10px;
    /deep/ .el-input-number {
      width: 125px;
      .el-input {
        width: 125px;
        .el-input__inner {
          width: 125px;
        }
      }
    }
  }
}
#customer-add-input-box {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  input {
    width: 100%;
    height: 40px;
    line-height: 40px;
    outline: none;
    border: none;
    text-indent: 14px;
    &::placeholder{
      color: #bbb;
    }
  }
}
</style>
