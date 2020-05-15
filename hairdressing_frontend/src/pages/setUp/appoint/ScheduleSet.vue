<template>
  <div id="gm_schedule_set">
    <!-- 筛选条件 -->
    <div class="select_condition">
      <div class="label_area_single">
        <!-- 1.0版 无门店 -->
        <!-- <span>
          <label>选择门店：</label>
          <el-select v-model="shop" @change='handleShopChange'>
            <el-option v-for="item in myShopList" :key='item.id' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span> -->
        <span>
          <label>选择职务：</label>
          <el-select v-model="staff" @change="handleFilterDutys">
              <el-option v-for="item in myStaffList" :key='item.id' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
      </div>
    </div>
    <!-- 新的排版表头 -->
    <div class="new_appo_header_container">
      <ul class="first-ul">
        <!-- 第一列固定的标题 -->
        <li class="first-col">
          <ul>
            <li style="font-weight: bold;">单周</li>
            <li class="list-item odd">周一</li>
            <li class="list-item evel">周二</li>
            <li class="list-item odd">周三</li>
            <li class="list-item evel">周四</li>
            <li class="list-item odd">周五</li>
            <li class="list-item evel">周六</li>
            <li class="list-item odd">周日</li>
          </ul>
        </li>
        <!-- 已有员工的列表 -->
        <li v-for="staffInfo in allStaffDutyList" :key='staffInfo.staffId'>
          <ul>
            <li>
              <div class='flex_div'>
                <img :src="utils.formatPicImg(staffInfo.staffHeadPortrait,'circle',40)"/>
                <span class="item_name over">
                  {{staffInfo.staffName}}
                  {{shopStaffsInfo[staffInfo.staffId] ? `(${shopStaffsInfo[staffInfo.staffId]})` : ''}}
                </span>
              </div>
            </li>
            <li class="list-item" v-for="(duty, day) in staffInfo.shifts" :key='day'  :class="{odd: day%2==0, evel: day%2!=0}">
              <!-- 这里有多种状态待补充 -->
              <p v-if="duty.name == '店铺休息'" style="color:#999;cursor:not-allowed;">{{duty.name}}</p>
              <p v-else class='can-hover' @click="checkHasBtnPermission('shop_appoint_schedule_edit') && editDuty(staffInfo.staffId, duty.id, day)">
                <span>
                  {{duty.name}}
                  <i class="icon iconfont icon-icon_operate_edit icon-info"
                    v-show="checkHasBtnPermission('shop_appoint_schedule_edit')"
                  ></i>
                </span>
              </p>
            </li>
          </ul>
        </li>
        <!-- 关闭新增员工入口 -->
        <!-- <li class="last-col">
          <ul>
            <li>
              <div class='add-staff' @click='addStaff'>
                <p><i class="icon iconfont icon-icon_ope_append"></i> 新增员工</p>
              </div>
            </li>
            <li class="list-item odd"></li>
            <li class="list-item evel"></li>
            <li class="list-item odd"></li>
            <li class="list-item evel"></li>
            <li class="list-item odd"></li>
            <li class="list-item evel"></li>
            <li class="list-item odd"></li>
          </ul>
        </li> -->
      </ul>
    </div>

    <!-- 选择班次 弹窗 待完善-->
    <el-dialog @close="close" :closeOnClickModal="false" title="选择班次" :visible.sync="dialogVisible">
        <div class="choose_class">
          <!-- 左侧 -->
          <div class="tab_left">
            <ul>
              <li v-for="(item,index) in shopDutyListFromApi" :key="index" :class="{checked:item.id == num}" @click="tab(item.id)">
                <span>{{item.name}}</span>
              </li>
              <!-- 新增班次 -->
              <!-- 1.0 注释 -->
              <!-- <li :class="{checked: num === -1}" @click="tab(-1)">
                <span>新增班次<i class="el-icon-circle-plus-outline" style="padding-left:5px;"></i></span>
              </li> -->
            </ul>
          </div>
          <!-- 右侧 -->
          <div class="detail_area" style="min-height: 400px;">
              <el-form :model="classForm">
                <el-form-item label="班次名称:" :label-width="formLabelWidth">
                    <el-row :gutter="8">
                      <el-col :xl="8">
                        <el-input 
                          v-model="classForm.name"
                          :disabled="classForm.type !== 'OTHER'" 
                          placeholder="请输入班次名称" maxlength="6"
                        >
                        </el-input>
                      </el-col>
                    </el-row>
                </el-form-item>
                <!-- 默认班次的时间从创建店铺获取 -->
                <el-form-item label="班次时间:" :label-width="formLabelWidth">
                    <el-time-select
                      placeholder="起始时间"
                      :disabled="classForm.type === 'DEFAULT'" 
                      v-model="classForm.shiftsTimeRange.startTime"
                      :picker-options="{
                        start: shopWorkTimes.start,
                        end: shopWorkTimes.end,
                        step: '00:30',
                        maxTime: classForm.shiftsTimeRange.endTime
                      }">
                    </el-time-select>
                    —
                    <el-time-select
                      placeholder="结束时间"
                      :disabled="classForm.type === 'DEFAULT'" 
                      v-model="classForm.shiftsTimeRange.endTime"
                      :picker-options="{
                        start: shopWorkTimes.start,
                        end: shopWorkTimes.end,
                        step: '00:30',
                        minTime: classForm.shiftsTimeRange.startTime
                      }">
                    </el-time-select>
                </el-form-item>
                <!-- 1.0 提示 -->
                <p style="color:red;padding-left: 50px;">1.0版本暂时只支持默认班次，其他自定义班次时间正在开发中</p>
                <!-- 1.0 注释 -->
                <!-- <el-form-item label="休息时间:" :label-width="formLabelWidth">
                  <template v-if="classForm.shiftsRestTimeRange.length" >
                    <div class="break_item" v-for="(item,key) in classForm.shiftsRestTimeRange" :key='key' style="margin-bottom:10px;">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item.startTime"
                          :picker-options="{
                            step: '00:30',
                            start: classForm.shiftsTimeRange.startTime,
                            end: classForm.shiftsTimeRange.endTime,
                            maxTime: item.endTime
                          }">
                        </el-time-select>
                        —
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.endTime"
                          :picker-options="{
                            start: classForm.shiftsTimeRange.startTime,
                            end: classForm.shiftsTimeRange.endTime,
                            step: '00:30',
                            minTime: item.startTime
                          }">
                        </el-time-select>
                        <i class="el-icon-delete delete_icon" @click="removeTime(key)"></i>
                    </div>
                  </template>
                </el-form-item> -->
                <!-- 1.0 注释 -->
                <!-- <el-form-item label="" :label-width='formLabelWidth'>
                  <el-button @click="addNewTime">新增休息时间<i class="el-icon-circle-plus-outline" style="padding-left:5px;"></i></el-button>
                </el-form-item> -->
                <!-- 1.0 注释 -->
                <!-- <el-form-item  label="" :label-width='formLabelWidth'>
                  <el-button type="primary" :loading="saveLoading" @click="saveDutyRules">保存班次</el-button>
                  <el-button v-if="classForm.type === 'OTHER' && classForm.id" :loading="delLoading" @click="delDutyRules">删除班次</el-button>
                </el-form-item> -->
              </el-form>
          </div>
        </div>
        <!-- 1.0 注释 -->
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" :loading="updateLoading" @click="handleEditDuty">确认选择</el-button>
        </span> -->
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/assets/js/interface'
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapActions, mapState } from 'vuex'
export default {
  name:'GmScheduleSet',
  data(){
    return{
      utils:utils,
      saveLoading: false, // 保存班次 加载
      delLoading: false, // 删除班次 加载
      updateLoading: false, // 修改员工班次 加载
      shopWorkTimes: {}, // 门店的初始上下班时间
      isAfterAddRule: false, // 新增班次后让焦点跳到最后班次的开关
      shop: null,
      staff: '', // 职级id 不是员工id
      uid: '', // 员工id
      week: '',
      weekMap: {
        1: 'MONDAY',
        2: 'TUESDAY',
        3: 'WEDNESDAY',
        4: 'THURSDAY',
        5: 'FRIDAY',
        6: 'SATURDAY',
        7: 'SUNDAY'
      },
      myShopList: [],
      myStaffList: [],
      dialogVisible: false,
      formLabelWidth: '120px',
      num: 0,
      classForm:{
        name: '默认班次',
        id: 1,
        shiftsTimeRange: {
          startTime: '',
          endTime: ''
        },
        shiftsRestTimeRange:[
          {
            startTime: '',
            endTime: ''
          }
        ]
      },
      // 从后端获取的店内通用班次数据列表
      shopDutyListFromApi: [
        {
          name: '默认班次',
          id: 1,
          shiftsTimeRange: {
            startTime: '',
            endTime: ''
          },
          shiftsRestTimeRange:[
            {
              startTime: '',
              endTime: ''
            }
          ]
        }
      ],
      // 门店内的员工工作日班次列表
      allStaffDutyList: []
    }
  },
  computed: {
    ...mapState({
      shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
    }),
    currentInfo() {
      return this.$store.state.manage.currentInfo
    }
  },
  mounted(){

  },
  created() {
    // 获取当前品牌的所有店铺 1.0版本，门店不做
    // axios.get(api.getStoreListByFilter.URL + this.currentInfo.brandId).then(res => {
    //   this.listShopByBrandIdRes(res)
    // })

    // 1.0 指定门店
    this.shop = this.currentInfo.shopId
    this.handleShopChange()
    this.handleFilterDutys()
  },
  methods:{
    // 获取该品牌的所有状态店铺信息  1.0版本，门店不做
    listShopByBrandIdRes(res) {
      res.shopSummaries.map((item, idx) => {
        this.$set(this.myShopList, idx, {id: item.shopId, name: item.name})
      })
    },
    // 1.0版 无门店切换选择，但是有指定门店
    handleShopChange() {
      this.staff = ''
      this.myStaffList = []
      // 获取员工职级列表
      axios.get(api.getStaffLevelListByStoreId.URL + this.shop).then(res => {
        res.staffLevelList.map((item, idx) => {
          this.$set(this.myStaffList, idx, {id: item.id, name: item.name})
        })
      })
    },
    // 
    handleFilterDutys() {
      axios.post(
        api.getStoreStaffShifts.URL, 
        { levelId: this.staff, storeId: this.shop }
      ).then(res => {
        this.getStoreStaffShifts(res)
      })
    },
    // 获取班次列表
    getStoreStaffShifts(res) {
      // for test --->
      /* res = {
       "shiftDetails": [
          {
            "staffId": 67,
            "staffName": "皮特",
            "staffHeadPortrait": "2f8e5d6ed1134167b65ff7d0c3a0e8bf",
            "shifts": [
              {
                "id": 0,
                "name": "店铺休息"
              },
              {
                "id": 1,
                "name": "默认班次"
              },
              {
                "id": 2,
                "name": "早班"
              },
              {
                "id": 1,
                "name": "默认班次"
              },
              {
                "id": 2,
                "name": "早班"
              },
              {
                "id": 1,
                "name": "默认班次"
              },
              {
                "id": 4,
                "name": "其他班次"
              }
            ]
          },
          {
            "staffId": 68,
            "staffName": "特皮",
            "staffHeadPortrait": "2f8e5d6ed1134167b65ff7d0c3a0e8bf",
            "shifts": [
              {
                "id": 0,
                "name": "店铺休息"
              },
              {
                "id": 3,
                "name": "晚班"
              },
              {
                "id": 3,
                "name": "晚班"
              },
              {
                "id": 1,
                "name": "默认班次"
              },
              {
                "id": 3,
                "name": "晚班"
              },
              {
                "id": 1,
                "name": "默认班次"
              },
              {
                "id": 3,
                "name": "晚班"
              }
            ]
          },
          {
            "staffId": 69,
            "staffName": "亨利",
            "staffHeadPortrait": "2f8e5d6ed1134167b65ff7d0c3a0e8bf",
            "shifts": [
              {
                "id": 0,
                "name": "店铺休息"
              },
              {
                "id": 2,
                "name": "早班"
              },
              {
                "id": 2,
                "name": "早班"
              },
              {
                "id": 3,
                "name": "晚班"
              },
              {
                "id": 2,
                "name": "早班"
              },
              {
                "id": 1,
                "name": "默认班次"
              },
              {
                "id": 3,
                "name": "晚班"
              }
            ]
          }
        ]
      } */
      // <--- for test
      this.allStaffDutyList = res.shiftDetails
    },
    // 班期设置面板
    editDuty(staff, duty, day){
      console.log('员工号:', staff, '班次号:', duty, '星期:', day + 1)
      this.week = this.weekMap[day + 1]
      this.uid = staff
      this.num = duty
      // 请求门店的所有班次列表
      this.getDutyListByShopId()
    },
    // 获取门店的全部班次列表（弹窗内）
    getDutyListByShopId() {
      axios.get(api.getStoreShiftsTimeByStoreId.URL + this.shop).then(res => {
        this.getStoreShiftsTimeByStoreIdRes(res)
      })
    },
    getStoreShiftsTimeByStoreIdRes(res) {
      // for test --->
      /* let o = res
      res = {
        "storeShiftTimeInfos": [
          {
            "id": 1,
            "name": "默认班次",
            "type": "DEFAULT",
            "shiftsRestTimeRange": [
              {
                "endTime": '13:00',
                "startTime": '12:00'
              }
            ],
            "shiftsTimeRange": {
              "endTime": '22:00',
              "startTime": '08:00'
            },
            "storeId": 114
          },
          {
            "id": 2,
            "name": "早班",
             "type": "MORNING",
            "shiftsRestTimeRange": [
              {
                "endTime": '10:30',
                "startTime": '10:00'
              }
            ],
            "shiftsTimeRange": {
              "endTime": '12:00',
              "startTime": '8:00'
            },
            "storeId": 114
          },
          {
            "id": 3,
            "name": "晚班",
            "type": "EVENING",
            "shiftsRestTimeRange": [
              {
                "endTime": '15:30',
                "startTime": '15:00'
              },
              {
                "endTime": '19:00',
                "startTime": '18:00'
              }
            ],
            "shiftsTimeRange": {
              "endTime": '22:00',
              "startTime": '13:00'
            },
            "storeId": 114
          },
          {
            "id": 4,
            "name": "其他班次",
            "type": "OTHER",
            "shiftsRestTimeRange": [
              {
                "endTime": '15:30',
                "startTime": '15:00'
              }
            ],
            "shiftsTimeRange": {
              "endTime": '17:00',
              "startTime": '12:00'
            },
            "storeId": 114
          },
        ],
        workTimeBegin: "08:00",
        workTimeEnd: "22:00"
      }
      res.storeShiftTimeInfos = res.storeShiftTimeInfos.concat(o.storeShiftTimeInfos) */
      // <---for test

      this.dialogVisible = true
      this.shopWorkTimes = {
        start: res.workTimeBegin,
        end: res.workTimeEnd
      }
      this.shopDutyListFromApi = res.storeShiftTimeInfos
      if (this.isAfterAddRule) {
        let id = this.shopDutyListFromApi[this.shopDutyListFromApi.length - 1].id
        this.num = id
        // Object.assign(this.classForm, {id: id, storeId: this.shop}) 
        this.isAfterAddRule = false
      }
      this.shopDutyListFromApi.map((item, idx) => {
        if (item.id === this.num) {
          this.classForm = item
        }
      })
    },
    tab(index) {
      this.num = index;
      switch (index) {
        case -1:
          this.classForm = {
            name: '',
            type: 'OTHER',
            shiftsRestTimeRange: [],
            shiftsTimeRange: {
              startTime: '',
              endTime:''
            }
          }
          break
        default: 
          this.shopDutyListFromApi.map((item, idx) => {
            if (item.id === this.num) {
              this.classForm = item
            }
          })
      }
    },
    // 新增时间
    addNewTime(){
      this.classForm.shiftsRestTimeRange.push({
        startTime: '',
        endTime:'',
      })
    },
    // 删除时间
    removeTime(key){
      this.classForm.shiftsRestTimeRange.splice(key, 1);
    },
    // 新增员工
    addStaff() {
      this.$router.push('/shop-inner/staff-add')
    },
    // 保存班次(让已经使用本班次的同事生效) || 新增
    saveDutyRules() {
      if (!this.saveLoading) {
        let tpl = {...this.classForm}
        if (tpl.type !== 'OTHER') {
          delete tpl.name
        }
        if (tpl.type === 'DEFAULT') {
          delete tpl.shiftsTimeRange
        }
        this.saveLoading = true
        if (!tpl.id) {
          // 新增
          Object.assign(tpl, {storeId: this.shop})
          axios.post(api.addStoreShift.URL, tpl).then(res => {
            this.addStoreShiftRes(res)
          })
        } else {
          // 编辑
          axios.post(api.updateStoreShift.URL, tpl).then(res => {
            this.updateStoreShiftRes(res)
          })
        }
      }
    },
    addStoreShiftRes(res) {
      this.saveLoading = false
      utils.showTip(this, {msg: res.message, type: 'success'})
      this.isAfterAddRule = true // 开启跳转许可
      // 重新获取门店班次列表
      this.getDutyListByShopId()
    },
    updateStoreShiftRes(res) {
       this.saveLoading = false
       utils.showTip(this, {msg: res.message, type: 'success'})
    },
    // 删除班次(后端需校验有使用者，不能删除)
    delDutyRules() {
      if (!this.delLoading) {
        this.delLoading = true
        axios.get(api.deleteStoreShift.URL + this.classForm.id).then(res => {
          this.deleteStoreShiftRes(res)
        })
      }
    },
    deleteStoreShiftRes(res) {
      this.delLoading = false
      utils.showTip(this, {msg: res.message, type: 'success'})
      // 重新获取门店班次列表
      this.getDutyListByShopId()
      this.num = this.shopDutyListFromApi[0].id // 让焦点回到列表第一个
    },
    handleEditDuty() {
      if (!this.updateLoading) {
        if (this.num === -1) {
          utils.showTip(this, {msg: '请选择一个现存的班次进行操作!', type: 'error'})
          return false
        }
        if (!this.checkTimesInForm()) {
          return false
        }
        this.updateLoading = true
        let tpl = {
          dayOfWeek: this.week,
          shiftsId: this.classForm.id,
          staffId: this.uid,
          storeId: this.shop
        }
        axios.post(
          api.updateStoreStaffShifts.URL, 
          tpl
        ).then(res => {
          this.updateStoreStaffShiftsRes(res)
        })
      }
    },
    updateStoreStaffShiftsRes(res) {
      this.updateLoading = false
      this.dialogVisible = false
      this.handleFilterDutys()
      utils.showTip(this, {msg: res.message, type: 'success'})
    },
    close() {
      this.dialogVisible = false
      this.saveLoading = false
      this.delLoading = false
      this.updateLoading = false
    },
    checkTimesInForm() {
      let r = false
      if (!this.classForm.shiftsTimeRange.endTime || !this.classForm.shiftsTimeRange.startTime) {
        utils.showTip(this, {msg: '班次时间不完整!', type: 'error'})
        return r
      } else {
        this.classForm.shiftsRestTimeRange.map(item => {
          if (!item.startTime || !item.endTime) {
            r = true
          }
        })
        if (r) {
          utils.showTip(this, {msg: '休息时间不完整!', type: 'error'})
          return false
        }
        return true
      }
    }
  }
}
</script>
<style lang="scss">
.week_change{
  width:176px;
  height:97px;
  text-align:center;
  .el-select{
    margin-top: 10px;
    width: 80px;
    .el-input--suffix .el-input__inner{
      border: none;
      font-size: 16px;
      color: #E22C37;
    }
  }
  p{
    color: #9B9B9B;
    font-size:14px;
  }
}
#gm_schedule_set .el-dialog__body{
  padding:0;
}
</style>

<style lang="scss" scoped>
  .select_condition{
    padding-left: 20px;
  }
  .flex_row{
    display: flex;
    flex-direction: row;
  }
  .flex_column{
    display: flex;
    flex-direction: column;
  }
  .flex_column_center{
    @extend .flex_column;
    justify-content: center;
    align-items: center;
  }
  .flex_row_center{
    @extend .flex_row;
    justify-content: center;
    align-items: center;
  }
  .icon-info {
    color: #58C9F3;
  }
  #gm_schedule_set{
    // margin-bottom:;
    padding-bottom: 20px;
    height: calc(100vh - 187px);
    overflow: auto;
    position: relative;
    .new_appo_header_container {
      width: 98%;
      height: 500px;
      margin-left: 1%;
      overflow-x: auto;
      display: flex;
      left: 226px;
      box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
      /*滚动条样式*/
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
      & > ul {
        width: 100%;
        display: flex;
        & > li {
          flex: auto;
          height: 76px;
          min-width: 160px;
          max-width: 160px;
          line-height: 76px;
          text-align: center;
          border-right: 1px solid rgba(240, 241, 244, 1);
          .flex_div{
            @extend .flex_row;
          }
          img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: inline-block;
            // position: relative;
            // left: 15px;
            // top: 19px;
            margin: 19px 10px 0 15px;;
          }
          .img_no_item{
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: inline-block;
          }
          .item_name{
            // flex:1;
            // display:flex;
            align-items:center;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
        }
      }
      .first-col {
        width: 118px;
        flex:0 0 auto;
      }
      .last-col {
        .add-staff {
          text-align: center;
          color: #58C9F3;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .can-hover {
        & > .icon-info  {
          display: none;
        }
        &:hover > .icon-info  {
          display: inline-block;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .list-item {
        height: 60px;
        line-height: 60px;
        border-right: 1px solid rgba(240, 241, 244, 1);
        & span {
          position: relative;
          & > i {
            position: absolute;
            top: 0;
            right: -18px;
            line-height: 18px;
            visibility: hidden;
          }
        }
        & > p:hover {
          cursor: pointer;
          & i {
            visibility: visible;
          }
        }
        &.odd {
          background: rgba(246, 246, 248, .8);
        }
      }
    }
    // 待修改 start...
    .appo_header_container{
      position: relative;
      width: 100%;
      background: #fff;
      .header_status{
        height: 60px;
        display: flex;
        justify-content: flex-end;
        ul{
          margin-right: 90px;
          li{
            display: inline-block;
            font-size: 14px;
            margin-left: 20px;
            line-height: 60px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            span{
              width:10px;
              height:10px;
              display: inline-block;
              margin-right: 10px;
              border-radius:50%;
            }
          }
        }
      }
    }
    .appo_tab_container{
      position: relative;
      display: flex;
      .left_header_bar{
            display: inline-block;
            width: 176px;
            height: calc(100vh - 280px);
            overflow: hidden;
            position: relative;
            background: #fff;
      }
      .left_container{
            position: absolute;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
      }
      .time{
            width: 176px;
            height: 98px;
            @extend .flex_column_center;
            color: #9B9B9B;
      }
      .right_panel{
        box-sizing: border-box;
        width: calc(100% - 176px);
        max-height: calc(100vh  - 280px);
        display: inline-block;
        vertical-align: top;
        overflow: auto;
        border:1px solid #EBEBEB;
        border-top: none;
      }
      .content_container{
        @extend .flex_column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        background-color: #F4F5F9;
      }
      .content-row{
        @extend .flex_row;
      }
      .content-cell {
          -ms-flex-negative: 0;
          flex-shrink: 0;
          width: 200px;
          height: 98px !important;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          @extend .flex_column_center;
          border:1px solid #EBEBEB;
          border-left: none;
          border-top: none;
          overflow: auto;
          .data_area{
            // width: 100%;
            max-height: 100%;
            // overflow: auto;
          }
          .data_content+.data_content{
            margin-top: 2px;
          }
          .data_content{
            width:176px;
            height:44px;
            background:#fff;
            box-shadow:0px 3px 16px 0px rgba(85,85,85,0.06);
            border-radius:0px 6px 6px 0px;
            @extend .flex_row;

            .data_status{
              width: 8px;
              height: 100%;
            }
            .data_img{
              position: relative;
              .img_head{
                width: 30px;
                height: 30px;
                margin:7px 0 7px 8px;
                border-radius: 50%;
                display: inline-block;
              }
              .img_tip{
                width: 14px;
                height: 14px;
                position:absolute;
                top: 7px;
                right: -9px;
              }
            }
            .data_msg{
              margin-left: 18px;
              p{margin-top: 2px;}
              h6{
                font-size:14px;
                color: #9B9B9B;
                font-weight: 400;
              }
              .data_level{
                position: relative;
                margin-top: 1px;
                vertical-align: middle;
                display: inline-block;
                img{
                  width: 27px;
                  height: 16px;
                }
                i{
                  position: absolute;
                  right: 4px;
                  top: 3px;
                  color: #fff;
                  font-size: 8px;
                  font-style: normal;
                }
              }
            }
          }
      }
    }
    // 待修改 end...
    .add_class{
      i{padding-right:5px;}
      color:#409EFF;
      cursor:pointer;
    }
    .holiday_class,.no_class{
      display:inline-block;
      width:98px;
      height:40px;
      border-radius:4px;
      text-align:center;
      line-height:40px;
    }
    .holiday_class{
      background:#FFF0DD;
      color:#E6A23C;
    }
    .no_class{
      background:#FDDFE6;
      color:#F56C6C;
    }
    .edit_class{
      color:#409EFF;
      font-size:16px;
      cursor:pointer;
      vertical-align:middle;
    }
  }
  .choose_class{
    display:flex;
    border-bottom:1px solid #E8E8E8;
  }
  .tab_left{
    border-top:1px solid #E8E8E8;
    // border-right:1px solid #E8E8E8;
    box-sizing:border-box;
    ul{
      li{
        width:124px;
        height:48px;
        border-bottom:1px solid #E8E8E8;
        text-align:center;
        line-height:48px;
        cursor:pointer;

      }
      .checked{
        color:#fff;
        background:#409EFF;
      }
    }
  }
  .detail_area{
    flex:1;
    border-top:1px solid #E8E8E8;
    border-left:1px solid #E8E8E8;
    padding:20px 20px 30px 0;
    .delete_icon{
      color:#aaa;
      font-size:18px;
      cursor:pointer;
      padding-left:5px;
      &:hover {
        color:#E22C37;
      }
    }
  }
</style>

