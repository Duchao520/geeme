<template>
  <div id="gm_quick_set" class="scrollbar">
    <el-form :model="quickForm">
      <!-- 时间选择 -->
      <div class="time_choose">
        <p class="quick_title"><i class="red_tip">*</i>时间选择</p>
        <el-form-item label="可约时间:" :label-width="formLabelWidth">
          <el-row>
            <el-col>
              <!-- 选择可约时间 弹窗 -->
              <el-popover
              placement="bottom-start"
              trigger="click"
              v-model="visible">
                <div class="weekday_popover">
                  <el-checkbox-group v-model="quickForm.executeDate" size="large">
                    <el-checkbox :label="value" border v-for="(value, key) in quickForm.workDays" :key="key">
                      {{weekToChina[value]}}
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-button type="primary" @click="visible = false">确定</el-button>
                </div> 
                <el-input 
                  v-model="weekDay" 
                  style="width:460px"
                  readonly="readonly" 
                  placeholder="请选择可约时间" 
                  slot="reference"
                >
                </el-input>
              </el-popover>
            </el-col>
          </el-row>
          <!-- end -->
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <el-time-select prop="startTime" ref="startTime"
            placeholder="起始时间"
            v-model="quickForm.executeTimeRange.startTime"
            :picker-options="{
              step: '00:30',
              start: quickForm.workTimeBegin,
              end: quickForm.workTimeEnd,
              maxTime: quickForm.executeTimeRange && quickForm.executeTimeRange.endTime || quickForm.workTimeEnd
            }">
          </el-time-select>
          —
          <el-time-select prop="endTime" ref="endTime"
            placeholder="结束时间"
            v-model="quickForm.executeTimeRange.endTime"
            :picker-options="{
              step: '00:30',
              start: quickForm.workTimeBegin,
              end: quickForm.workTimeEnd,
              minTime: quickForm.executeTimeRange && quickForm.executeTimeRange.startTime
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="预约时间间隔:" :label-width="formLabelWidth">
          自开始时间起，每
          <el-select v-model="quickForm.timeInterval">
            <el-option label="30分钟" value="30"></el-option>
            <el-option label="60分钟" value="60"></el-option>
            <el-option label="90分钟" value="90"></el-option>
            <el-option label="2小时" value="120"></el-option>
            <el-option label="3小时" value="180"></el-option>
            <el-option label="4小时" value="240"></el-option>
          </el-select>
          为一个预约时间间隔
        </el-form-item>
        <!-- 提前预约时间 -->
        <el-radio-group v-model="quickForm.aheadAppoTime">
          <el-form-item label="提前预约时间:" :label-width="formLabelWidth">
              <el-radio :label="false">不限制</el-radio>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
              <el-radio :label="true" disabled>
                须至少提前 
                <el-select v-model="quickForm.aheadAppoTimeData" disabled>
                  <el-option label="30分钟" value="30"></el-option>
                  <el-option label="60分钟" value="60"></el-option>
                  <el-option label="90分钟" value="90"></el-option>
                  <el-option label="2小时" value="120"></el-option>
                </el-select>
                才能预约
              </el-radio>
          </el-form-item>
        </el-radio-group>

        <!-- 此块暂时隐藏 -->
        <!-- <el-form-item label="占用时长:" :label-width="formLabelWidth" v-show="false">
          每次预约占用时长统一为
          <el-select v-model="quickForm.useTime">
            <el-option label="30分钟" :value=30></el-option>
            <el-option label="60分钟" :value=60></el-option>
          </el-select>
        </el-form-item> -->
        <!-- end -->
        <el-form-item label="最长预约跨度:" :label-width="formLabelWidth">
          最长可预约的时间跨度为
          <el-select v-model="quickForm.maxTimeSpan">
            <el-option label="1个月" :value=1></el-option>
            <el-option label="3个月" :value=3></el-option>
            <el-option label="6个月" :value=6></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排除时间:" :label-width="formLabelWidth">
          <div class='time_list_item' v-for="(item,key) in quickForm.nonexecuteTime" :key='key'>
            <el-time-select
            placeholder="起始时间"
            v-model="item.startTime"
            :picker-options="{
              step: '00:30',
              start: quickForm.executeTimeRange && quickForm.executeTimeRange.startTime,
              end: quickForm.executeTimeRange && quickForm.executeTimeRange.endTime,
              maxTime: item.endTime
            }">
          </el-time-select>
          —
          <el-time-select
            placeholder="结束时间"
            v-model="item.endTime"
            :picker-options="{
              step: '00:30',
              start: quickForm.executeTimeRange && quickForm.executeTimeRange.startTime,
              end: quickForm.executeTimeRange && quickForm.executeTimeRange.endTime,
              minTime: item.startTime
            }">
          </el-time-select>
            <i class="el-icon-delete" @click="removeTime(key)"></i>
          </div>
          <el-button @click="addNewTime" :class="{'has-margin-top': quickForm.nonexecuteTime.length}">
            添加
          </el-button>
        </el-form-item>
      </div>
      <!-- 预约要素 -->
      <div class="sub_ele">
        <p class="quick_title">预约要素</p>
        <el-form-item label="服务者:" :label-width="formLabelWidth">
          <el-checkbox v-model="quickForm.chooseHairdresser">必须选择服务者</el-checkbox>
        </el-form-item>
        <el-form-item label="服务项目:" :label-width="formLabelWidth">
          <el-checkbox v-model="quickForm.chooseService" disabled>必须选择服务项目</el-checkbox>
        </el-form-item>
        <el-form-item label="人数限制:" :label-width="formLabelWidth">
          每位服务者每个时间段最多可预约
          <el-select v-model="quickForm.maxCustomerPerTime">
            <el-option label="1人" :value=1></el-option>
            <el-option label="2人" :value=2></el-option>
            <el-option label="3人" :value=3></el-option>
            <el-option label="4人" :value=4></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 提醒与取消 -->
      <div class="quick_oper">
        <p class="quick_title"><i class="red_tip">*</i>提醒与取消</p>
        <el-form-item label="到店提醒:" :label-width="formLabelWidth">
          预约到店时间前
          <el-select v-model="quickForm.remindTimeBefore">
            <el-option label="1小时" :value=1></el-option>
            <el-option label="2小时" :value=2></el-option>
          </el-select>
          提醒客户准时到店
        </el-form-item>
        <!-- 取消限制 -->
        <el-radio-group v-model="quickForm.cancelTimeModel">
          <el-form-item label="取消限制:" :label-width="formLabelWidth">
            <el-radio :label=false>客户可以随时取消或修改预约单</el-radio>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-radio :label=true>
              预约到店时间前
              <el-select v-model="quickForm.cancelTimeLess" ref="cancelTimeLess">
                <el-option label="30分钟" :value=30></el-option>
                <el-option label="60分钟" :value=60></el-option>
                <el-option label="90分钟" :value=90></el-option>
                <el-option label="2小时" :value=120></el-option>
              </el-select>
              以内不可取消
            </el-radio>
          </el-form-item>
        </el-radio-group>
        <el-form-item label="超时时间:" :label-width="formLabelWidth">
          超过预约时间
          <el-select v-model="quickForm.timeOut" ref="timeOut">
            <el-option label="30分钟" :value=30></el-option>
            <el-option label="60分钟" :value=60></el-option>
            <el-option label="90分钟" :value=90></el-option>
            <el-option label="2小时" :value=120></el-option>
          </el-select>
          以上未开单则预约作废
        </el-form-item>
        <!-- end -->
        <el-form-item label="" :label-width="formLabelWidth">
          <el-button :loading="uploading" class="normal_blue_btn" v-show="checkHasBtnPermission('shop_appoint_quick_save')" @click="updateForm">保存修改</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as axios from '@/util/axios'
import * as api from '@/assets/js/interface'
import * as utils from '@/assets/js/utils'
export default {
  name:'GmQuickSet',
  data(){
    return {
      uploading: false,
      formLabelWidth:'120px',
      visible:false,
      weekToChina: {
        MONDAY: '周一',
        TUESDAY: '周二', 
        WEDNESDAY: '周三',
        THURSDAY: '周四',
        FRIDAY: '周五',
        SATURDAY: '周六',
        SUNDAY: '周日'
      },
      weekDay: null,
      // 接口正式字段
      quickForm:{
        workDays: [], // 门店的营业时间 星期 -- 固化
        workTimeBegin: null, // 门店的营业起始时间 -- 固化
        workTimeEnd: null, // 门店的营业结束时间 -- 固化
        executeDate: [], // 可操作的星期范围
        executeTimeRange: { // 可操作的预约时间范围
          startTime: null,
          endTime: null
        },
        timeInterval: null, //  时长间隔(分)->step 
        useTime: null, // 预约占用时长(分)
        maxTimeSpan: null, // 预约跨度(月)
        nonexecuteTime: [], // 排除时间
        chooseHairdresser: false, // 是否需要手艺人 false:默认不需要, true:需要 
        chooseService: true, // 服务项目 false:不需要, true:默认需要 1.0版本禁止修改
        maxCustomerPerTime: null, // 手艺人单位时间内接受的服务数 1-4
        remindTimeBefore: null, // 提醒时间(小时)
        cancelTimeModel: true, // 客户取消 false: 随时,  true: 指定时间内
        cancelTimeLess: null, // cancelTimeModel 为ture时, (分)
        timeOut: null, // 超时自动取消预约(分)
      }
    }
  },
  mounted(){},
  watch: {
    'quickForm.executeDate'(val) {
      this.weekDay = utils.weekDaySort(val).join('、');
    }
  },
  created() {
    this.getAppointmentSettingByShopId()
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    }
  },
  methods:{
    // 新增时间
    addNewTime(){
      this.quickForm.nonexecuteTime.push({
          startTime: null,
          endTime: null
      })
    },
    // 删除时间
    removeTime(key){
      this.quickForm.nonexecuteTime.splice(key, 1);
    },
    getAppointmentSettingByShopId() {
      axios.get(
        api.getStoreAppointmentSettingByStoreId.URL + this.currentInfo.shopId,
      ).then(res => {
        this.appointmentSettingRes(res)
      })
    },
    appointmentSettingRes(res) {
      this.quickForm = res
      if (!res.executeTimeRange) {
        this.quickForm.executeTimeRange = {
          startTime: null,
          endTime: null
        }
      }
      this.quickForm.workDays = utils.weekDaySort(res.workDays, true)
      this.quickForm.chooseService = true // 1.0版本强制执行服务项目为必选

      this.quickForm.aheadAppoTime = false // 1.0版本  提前预约时间 flase 
      this.quickForm.aheadAppoTimeData = 30 // 1.0版本  30分钟

      if (!res.nonexecuteTime) {
        this.quickForm.nonexecuteTime = []
      }
    },
    updateForm() {
      if (this.uploading) {return false}
      let start = this.quickForm.executeTimeRange.startTime
      let end = this.quickForm.executeTimeRange.endTime
      if (start && end && end > start) {
        if (this.quickForm.cancelTimeModel && !this.quickForm.cancelTimeLess) {
          // 验证预约到店取消时间
          this.$refs['cancelTimeLess'].focus()
          utils.showTip(this, {msg: '自定义取消预约时，时间不能为空', type: 'error'})
        } else if (!this.quickForm.timeOut) {
          // 验证超时时长
          this.$refs['timeOut'].focus()
          utils.showTip(this, {msg: '超时作废订单时长不能为空', type: 'error'})
        } else {
          // 验证排除时间是否空了一半
          let canSubmit = true
          this.quickForm.nonexecuteTime.map(item => {
            if (!item.endTime||!item.startTime) {
              canSubmit = false
              utils.showTip(this, {msg: '排除时间内容不完整', type: 'error', time: '3000'})
            }
          })
          if (canSubmit) {
            this.uploading = true
            if (this.quickForm.id < 1) { this.quickForm.id = null }
            if (this.quickForm.storeId < 1) { this.quickForm.storeId = this.currentInfo.shopId }
            axios.post(
              api.updateStoreAppointmentSetting.URL, 
              this.quickForm
            ).then(res => {
              this.updateRes(res)
            })
          }
        }
      } else {
        if (start) {
          this.$refs['endTime'].focus()
        } else {
          this.$refs['startTime'].focus()
        }
        utils.showTip(this, {msg: '可约时间不合法', type: 'error'})
      }
    },
    updateRes(res) {
      this.uploading = false
      utils.showTip(this, {msg: res.message, type: 'success'})
    }
  }
}
</script>

<style lang="scss">

#gm_quick_set .el-form .el-select{
  max-width: 112px;
}
.weekday_popover{
  max-width:400px;
  margin:20px;
  .el-checkbox{
    // margin-bottom:10px;
    margin:0 10px 10px 0;
  }
  .el-checkbox.is-bordered + .el-checkbox.is-bordered{
    margin-left:0;
  }
  .el-checkbox.is-bordered .el-checkbox__inner{
    display:none;
  }
}
</style>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
  .quick_title{
    width: 110px;
    text-align: right;
    font-size:16px;
    padding-top: 20px;
    padding-bottom:10px;
    .red_tip{
      color: #E22C37;
      vertical-align: middle;
      font-size:18px;
      padding-right: 5px;
    }
  }
  .time_list_item + .time_list_item{
    margin-top:10px;
  }
  .time_list_item{
    i{
      cursor:pointer;
      font-size:16px;
      color: #aaa;
      padding-left:20px;
      &:hover {
        color: #E5424B;
      }
    }
  }
  #gm_quick_set{
    // padding-bottom:50px;
    height: calc(100vh - 167px);
    overflow: auto;
  }
  .has-margin-top {
    margin-top: 12px;
  }
</style>

