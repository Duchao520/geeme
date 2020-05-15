<template>
  <el-form ref="appoForm" :disabled="!editable">
    <el-form-item label="预约到店时间:" class="pointer">
      <el-date-picker class="form-gap" 
        v-model="myForm.date"
        type="date"
        :clearable="false"
        placeholder="请选择日期"
        @change="dateChange"
        :picker-options="setDisabledDate"
      ></el-date-picker>
      <el-select v-model="myForm.time" placeholder="请选择时间" @change="timeChange">
        <el-option
          v-for="item in appoWeekDay.availableAppointTimes"
          :key="item"
          :label="item"
          :value="item"
          >
        </el-option>
      </el-select>
    </el-form-item>
    <div class="form-tip">可预约时间：{{ weekString }}</div>
    <el-form-item label="服务者和服务:" class="services-project">
      <el-cascader
        placeholder="请选择服务者"
        :props="optionsConfig"
        :options="staffList"
        v-model="currentStaff"
        @change="changeStaff">
      </el-cascader>
      <span class='warnTips' style="color: red;margin-left:10px;" v-if="warnTips">更改服务者将清空已选择的服务！</span>
    </el-form-item>
    <el-form-item v-for="(serviceItem, index) in finalServiceInfo" :key="index" class="indent-item"> 
      <div class="select-item form-gap">
        <label class="service-label">
          <div class="porps-service-info" :class="{'opacity': !serviceItem.apiServiceName, 'disabled': !editable}">{{serviceItem.apiServiceName}}</div>
          <el-cascader
            placeholder="请选择服务"
            :props="optionsConfig"
            :options="serviceList"
            v-model="serviceItem.currentService"
            @change="changeProject(serviceItem.currentService, index)">
          </el-cascader>
        </label>
      </div>
      <div class="select-item-sub">
        <el-select 
          v-model="serviceItem.specificationId" 
          placeholder="请选择服务规格" 
          @change='handleOnSpChange(serviceItem.currentService, index)'
        >
          <el-option
            v-for="item in serviceItem.otherSpecification"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <input-number
        :editable="editable"
        :max="100"
        :min="1" 
        v-model="serviceItem.count"
      />
      <i
        v-if="index!==0 && editable"
        style="margin-left:2px;cursor:pointer;color:#BEC3C6"
        @click="delServiceItem(index)"
        class="icon iconfont icon-icon_operate_delete"
      ></i>
    </el-form-item>
    <el-form-item class="indent-item" style="margin-bottom: 4px;" v-if="editable">
      <div class="add-button" @click="addService" v-if="finalServiceInfo.length < 10">
        <i style="margin-right:2px;" class="icon iconfont icon-icon_ope_append"></i>
        <span>添加服务</span>
      </div>
    </el-form-item>
    <el-form-item class="no-form-bottom" label="合计金额:">
      <span> {{getTotalPrice}} 元</span>&nbsp;&nbsp;<span :class="{nopay: !info.payStatus}">{{info.payStatus|payStatusFilter}}</span>
    </el-form-item>
  </el-form>
</template>
<script>
import * as api from '@/assets/js/interface'
import * as axios from '@/util/axios';
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
import SelectSpecification from '@/components/appoModule/selectSpecification'
import InputNumber from "@/components/common/InputNumber"
export default {
  name: 'appo-details-service-info',
  props: {
    info: {
      type: Object, // 新增时： 快速预约没有，从加号新增有部分值，编辑时肯定有
    },
    editable: Boolean,
    customerId: Number, // 门店客户id
  },
  data() {
    return {
      appoWeekDay: {availableAppointTimes:[]},
      canWeekDayTip: null,
      myForm: {
        date: '',
        time: '',
        staffId: '',
        levelId: '',
      },
      currentStaff: [],
      timerPicker: { // 时间选择器的格式
        start: null, // 起始时间
        step: null, // 时间间隔
        end: null // 结束时间
      },
      maxDate: '',
      staffList: [], // 服务者列表
      optionsConfig: {
        value: 'id',
        label: 'name',
        children: 'list',
      },
      serviceList: [], // 服务项目的分类列表
      finalServiceInfo: [], // 渲染到页面的服务数据
      priceCompare: {}, // 规格价格比对
      warnTips: false, // modify 且 可编辑状态为true
      weekString: '', // 测试的日期
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    },
    setDisabledDate() {
      return {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > +(new Date(this.maxDate))
        }
      }
    },
    getTotalPrice() {
      let price = 0
      this.finalServiceInfo.forEach(service => {
        service.specificationId && (price += this.priceCompare[service.specificationId] * 100 * service.count / 100)
      })
      return isNaN(price) ? 0 : price
    }
  },
  watch: {},
  created() {
    if (this.$store.state.appointment.appoEntry === 'modify') {
      // AppoModify.vue
      // 初始化props里的预约时间
      let time = new Date(this.$props.info.dueTime)
      this.myForm.date = time.format('yyyy-MM-dd')
      this.myForm.time = time.format('hh:mm')
      this.myForm.id = this.$props.info.id
      this.myForm.orderId = this.$props.info.orderId
      this.myForm.staffId = this.$props.info.staffId
      this.myForm.levelId = this.$props.info.staffLevelId
      this.currentStaff = [this.myForm.levelId, this.myForm.staffId]
      this.formatPropsService(this.$props.info.serviceInfoForAppointments)
      this.warnTips = true
    } else {
      // 新增 AppoAddNew.vue
    }

    axios.post(api.getAvailableAppoTime.URL, {storeId: this.currentInfo.shopId}).then(res => {
      this.getAppoTimeRes(res);
    })
    let params = {
      storeId: this.currentInfo.shopId,
      storeCustomerId: this.customerId,
      levelId: this.myForm.levelId
    }
    this.getServiceListByLevel(params)
  },
  methods: {
    // 处理可预约的时间
    getAppoTimeRes(res) {
      this.appoWeekDay = res
      // 日期组件结束时间 // 该时间这里暂时不是动态的, 后端是动态的
      this.maxDate = +(new Date(res.maxAppointTime))
      // 整理预约到店时间
      if (res.availableAppointTimes.length) {
        this.timerPicker = {
          start: res.availableAppointTimes[0],
          step: utils.twoTimeDif(res.availableAppointTimes[1], res.availableAppointTimes[0]),
          end: res.availableAppointTimes[res.availableAppointTimes.length - 1]
        }
      }
      // 整理提示
      this.getCanWeekDayTip(res.availableAppointDays)
      let params = {
        storeId: this.currentInfo.shopId,
        staffId: this.$props.info.staffId,
        arriveTime: this.myForm.date + ' ' + this.myForm.time
      }
      this.getStaffList(params)
    },
    // 提示:将英文周几转为中文周几,并按顺序排列
    getCanWeekDayTip(data) {
      let arr = []
      for(let key in datas.WEEKTOCHINA) {
        data.includes(key) && arr.push(datas.WEEKTOCHINA[key])
      }
      this.canWeekDayTip = arr.join('、')
      this.weekString = utils.weekListFunc(this.canWeekDayTip.split('、'))
    },
    // 选择日期
    dateChange(data) {
      this.selectDataChanged('date')
      this.myForm.date = new Date(data).format('yyyy-MM-dd')
      if (!data) return
      // 如果选择的日期不在后台返回的星期里面，则提示重选
      if (!utils.isInString(this.canWeekDayTip, datas.WEEKDAY[data.getDay()])) {
        // 清空日期输入框
        this.myForm.date = null
        // 提示
        utils.showTip(this, {msg: '可预约时间为' + this.canWeekDayTip, type: 'error'})
      } else {
        // 如果有时间再切换日期，直接请求服务者接口
        this.myForm.time && this.timeChange(this.myForm.time)
      }
    },
    // 选择时间
    timeChange(data) {
      this.selectDataChanged('time')
      this.myForm.time = data
      // 如果日期未选择，提示
      if (!!this.myForm.date) {
        let params = {
          storeId: this.currentInfo.shopId,
          staffId: this.$props.info.staffId,
          arriveTime: this.myForm.date + ' ' + data
        }
        // 选择完时间获取服务者
        data && this.getStaffList(params)
      } else {
        // 提示选择日期
        utils.showTip(this, {msg: '请选择预约日期', type: 'error'})
      }
    },
    getStaffList(params) {
      axios.post(api.getAvailableSimpleStaffList.URL, params).then(res => {
        this.getStaffListRes(res);
      })
    },
    // 获取服务者
    getStaffListRes(res) {
      // 格式化数据成级联数据
      let arr = []
      res.dataBeanList.forEach(item => {
        let level = {id: item.levelId, name: item.name, list: item.staffList}
        arr.push(level)
      })
      this.staffList = arr

      if (this.currentStaff[0] && this.currentStaff[1]) { // 如果是没选择服务者的异常预约this.currentStaff 为[null, null]
        let inStaffInOptions = false
        // 已经选过服务者, 变更时间, 判断服务者是否在新的选项
        for(let i = 0, len = arr.length; i < len; i++) {
          if (arr[i].id === this.currentStaff[0]) {
            for(let j = 0, _len = arr[i].list.length; j < _len; j++) {
              if (arr[i].list[j].id === this.currentStaff[1]) {
                inStaffInOptions = true
                break
              }
            }
            break
          }
        }
        // 如果当前服务者不在新的列选项列表内，
        if(!inStaffInOptions) {
          this.currentStaff = []
          this.serviceList = []
          this.selectDataChanged('staff')
        }
        
      }
    },
    // 选择完服务者
    changeStaff(data) {
      this.selectDataChanged('staff')
      this.currentStaff = data
      this.myForm.staffId = data[1]
      this.myForm.levelId = data[0]
      let params = {
        storeId: this.currentInfo.shopId,
        storeCustomerId: this.customerId,
        levelId: data[0]
      }
      // 开始根据选择的手艺人列出可选服务项目
      this.getServiceListByLevel(params)
    },
    getServiceListByLevel(data) {
      axios.post(`/getServiceListByStoreIdAndSortOneAndLevel`, data).then(res => {
        this.getServerListRes(res);
      })
    },
    getServerListRes(res) {
      // 格式化数据成级联数据
      let arr = []
      res.service.forEach(item => {
        let service = {id: item.levelOneId, name: item.levelOneName, list: item.serviceForAppointments}
        arr.push(service)
      })
      this.serviceList = arr
      arr.forEach(lv1 => {
        lv1.list && lv1.list.forEach(lv2 => {
          lv2.specification && lv2.specification.forEach(sp => {
            this.priceCompare[sp.id] = sp.price
          })
        })
      })
    },
    // 选择服务
    changeProject(data, index) {
      this.selectDataChanged('service', index)
    },
    // 选择服务规格
    handleOnSpChange(data, index) {
      this.selectDataChanged('sp', index)
    },
    addService() {
      this.finalServiceInfo.push({
        count: 1, // 数量
        specificationId: '', // 选中的规格id
        currentService: [], // 选中的服务id （1，2级）
        otherSpecification: [{ id: null, name: '' }] // 规格选项数组
      })
    },
    delServiceItem(index) {
      this.finalServiceInfo.splice(index, 1)
    },
    // 监听选择的数据变化 日期 -> 数量 , 并逐级往下重置
    selectDataChanged(type, index=0) {
      switch(type) {
        case 'date':
          // this.myForm.time = null // 暂时变更时间不清理次级内容, 代码勿删！如要恢复请删除下方break
          break
        case 'time':
          // this.currentStaff = []  // 暂时变更时间不清理次级内容, 代码勿删！如要恢复请删除下方break
          // this.serviceList = []   // 暂时变更时间不清理次级内容, 代码勿删！如要恢复请删除下方break
          break
        case 'staff':
          this.finalServiceInfo =  [{
            count: 1, // 数量
            specificationId: '', // 选中的规格id
            currentService: [], // 选中的服务id （1，2级）
            otherSpecification: [{ id: null, name: '' }] // 规格选项数组
          }]
        case 'service':
          this.finalServiceInfo[index].specificationId = null
          this.finalServiceInfo[index].apiServiceName = null
          // 重置规格选项为当前服务选项的子数组
          this.finalServiceInfo[index].currentService.length && this.reset_SP_options(this.finalServiceInfo[index].currentService, index)
        case 'sp':
          this.finalServiceInfo[index].count = 1
          this.finalServiceInfo[index].specificationName = null
          break
        default:
          console.log('error')
      }
    },
    // 处理数据格式
    formatPropsService(services) {
      this.finalServiceInfo = []
      services.forEach(item => {
        this.priceCompare[item.specificationId] = item.price
        this.finalServiceInfo.push({
          id: item.id, // 如果是原来接口给的数据，这个id要提交, 如果是新增的其他服务则没有这个id
          count: item.count,
          price: item.price,
          specificationId: item.specificationId,
          otherSpecification: item.otherSpecification,
          currentService: [item.sortLevelOneId, item.serviceId],
          specificationName: item.specificationName,
          apiServiceName: `${item.sortLevelOne} / ${item.serviceName}`,
        })
      })
    },
    // 服务变更后重置规格项的选项
    reset_SP_options(arr, index) {
      let opt = []
      for(let i = 0, len = this.serviceList.length; i < len; i++) {
        if (this.serviceList[i].id === arr[0]) {
          for(let j = 0, _len = this.serviceList[i].list.length; j < _len; j++) {
            if (this.serviceList[i].list[j].id === arr[1]) {
              opt = this.serviceList[i].list[j].specification
              break
            }
          }
        }
      }
      this.finalServiceInfo[index].otherSpecification = opt
    },
    // 父组件的事件
    submitEvent() {
      if (!this.myForm.date || !this.myForm.time) {
        // 提示
        utils.showTip(this, {msg: '选择时间有误', type: 'error'})
        return
      }
      if (!this.myForm.staffId) {
        utils.showTip(this, {msg: '请选择服务者', type: 'error'})
        return
      }
      let ready = []
      this.finalServiceInfo.forEach(item => {
        item.specificationId && ready.push(item.specificationId)
      })
      ready = [...new Set(ready)]
      if (ready.length === this.finalServiceInfo.length) {
        // 这里是合法的提交,需要将数据处理过        
        let a = JSON.parse(JSON.stringify(this.$props.info.serviceInfoForAppointments)) || []
        let b = JSON.parse(JSON.stringify(this.finalServiceInfo))
        for (let i = 0; i < a.length; i++){
          a[i].status = false
          for (let j = 0; j < b.length; j++){
              if(a[i].id == b[j].id){
                  a[i].status = a[i].specificationId == b[j].specificationId
                  if(!a[i].status) delete b[j].id
                  break;
              }
          }
          if(!a[i].status) b.push(a[i])
        }
        b.forEach(item => {
          delete item.price
          delete item.serviceId
          delete item.serviceName
          delete item.sortLevelOne
          delete item.sortLevelOneId
          delete item.apiServiceName
          delete item.currentService
          delete item.specificationName
          delete item.otherSpecification
        })
        let params = {appointmentServiceInfoList: b, ...this.myForm}
        this.$emit('appoSubmitFromDetails', params)
      } else {
        // 这里是不合法的提交，有重复的规格（新旧快照id只存在一个时可以提交）
        utils.showTip(this, {msg: '您选择的服务有重复或者服务规格不完整，请确认后再提交', type: 'error'})
      }
    },
    getStaffInfo() {
      this.$emit('giveStaffInfo', this.info)
    }
  },
  components: {
    'select-specification': SelectSpecification,
    'input-number': InputNumber
  },
  filters: {
    payStatusFilter(status) {
      let statusMap = {
        true: '已支付',
        false: '未支付',
      }
      return statusMap[status]
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin el-item-require($v, $h) {
  position: relative;
  &::before {
    content: "*";
    color: #f56c6c;
    position: absolute;
    top: $v;
    left: $h;
  }
}
.pointer, .services-project {
  margin-left: 12px;
  @include el-item-require(14px, -12px);
  .warnTips {
      display: none;
    }
  &:hover {
    .warnTips {
      display: inline-block;
    }
  }
}
.el-form-item {
  // margin-left: 1.05rem;
}
.indent-item {
  margin-left: 1.08rem;
}
#gm_index .form-tip {
  margin-left: 1.08rem;
}
.select-item-sub {
  display: inline-block;
}
.select-item.form-gap {
  position: relative;
}
.porps-service-info {
  position: absolute;
  width: 176px;
  height: 38px;
  top: 1px;
  left: 16px;
  background: #fff;
  line-height: 38px;
  text-align: left;
  z-index: 10;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  &.opacity {
    background: none;
  }
  &.disabled {
    background: #f5f7fa;
    color: #c0c4cc;
  }
}
.add-button {
  color: #58c9f3;
  font-size: 14px;
  display: inline;
  cursor: pointer;
}
.form-gap {
  margin: 0;
}
.no-form-bottom {
  text-indent: 42px;
}
.service-label {
  display: inline-block;
  height: 40px;
  width: 217px;
}
</style>
 