<template>
  <el-dialog
    width="800px" 
    append-to-body
    :visible="visible"
    :before-close="close"
    :title="title"
    v-loading="loading"
  >
    <div class="staff-main">
      <div class="left-for-selected">
        <p>请选择</p>
        <div class="list-for-selected">
          <el-checkbox-group 
            v-model="checkedStaffIds"
            @change="checkedStaffIdsChanged"
          >
            <div 
              class="single-staff" 
              v-for="staff in staffList"
              :key="staff.staffId"
            >
              <el-checkbox :label="staff.staffId">
                <div class="staff-info">
                  <img :src="utils.formatPicImg(staff.headPortrait)">
                  <div class="staff-text-info">
                    <div class="staff-name" :title="`${staff.name} ${staff.shopNum ? `(${staff.shopNum})` : ''}`">
                      {{staff.name}} {{staff.shopNum ? `(${staff.shopNum})` : ''}}
                    </div>
                    <div class="staff-level-name">
                      <div class="level-name" :title="staff.levelName">
                        {{staff.levelName}}
                      </div>
                      <div class="empty-box" v-if="goods.goodsType === 'service'">
                        <!-- 这个div是给服务的指定非指定占位用的 -->
                      </div>
                    </div>
                  </div>
                </div>
              </el-checkbox>
              <div class="tag-box" v-if="goods.goodsType === 'service'">
                <span 
                  class="send-type-tags text-cant-copy" 
                  :class="{active: staff.isChosen}" 
                  @click.stop="staff.isChosen = !staff.isChosen"
                  v-if="checkedStaffIds.includes(staff.staffId)"
                >
                  {{staff.isChosen ? '指 定' : '非指定'}}
                </span>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="staffs-selected">
        <p>配置业绩分配比例</p>
        <div class="list-selected">
          <div 
            class="single-selected-staff" 
            v-for="(staff, index) in currentStatus"
            :key="staff.staffId"

          >
            <div class="icon-box">
              <i class="iconfont icon icon-icon_sort_up arrow" v-if="index !== 0" @click="sortStaff(index)"></i>
            </div>
            <div class="staff-info">
              <img :src="utils.formatPicImg(staff.headPortrait)">
              <div class="staff-text-info">
                <div class="staff-name" :title="`${staff.name} ${staff.shopNum ? `(${staff.shopNum})` : ''}`">
                  {{staff.name}} {{staff.shopNum ? `(${staff.shopNum})` : ''}}
                </div>
                <div class="staff-level-name">
                  <div class="level-name" :title="staff.levelName">
                    {{staff.levelName}}
                  </div>
                </div>
              </div>
            </div>
            <div class="ratio-input">
              <el-input v-model="staff.ratio" disabled>
                <span slot="append">%</span>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="select-identity-footer">
      <el-button plain class="plain_gray_btn" @click="close">取消</el-button>
      <el-button class="normal_blue_btn" @click="confirm">确认选择</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapState, mapActions } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    goods: {
      type: Object,
      required: true
    },
    workStationIndex: { // 服务才传， 产品，卡项不传
      type: Number,
    },
    workStation: { // 当前vuex中存的工位员工数据
      type: Array,
    },
  },
  data() {
    return {
      utils,
      loading: false,
      currentStatus: [], // 组件内编辑的工位/销售业绩状态， 需要提交给父组件
      checkedStaffIds: [], // 
      staffList: [],
      performanceCompareObj: {}, // 业绩比对数据
      staffIdCompareObj: {}, // 员工id比对数据
      limit: null, // 按规则数量取
      firstLoad: true,
    }
  },
  created() {
    this.currentStatus = JSON.parse(JSON.stringify(this.workStation))
    this.checkedStaffIds = this.workStation.map(i => i.staffId) || []
    this.init()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      // 数据发送到外层再保存到vuex
      if (this.goods.goodsType === 'service') { // 服务要处理下指定、非指定
        // 处理指定字段匹配
        let obj = {}
        this.staffList.map(staff => {
          if (this.checkedStaffIds.includes(staff.staffId)) {
            obj[staff.staffId] = staff.isChosen
          }
        })
        // 赋值
        this.currentStatus.map(i => {
          i.isChosen = obj[i.staffId]
          // i.staffName = i.name
        })
      }
      this.$emit('editStaffsForGoods', this.currentStatus)
    },
    // 加载员工和业绩
    init() {
      this.loading = true
      Promise.all([this.getStaffList(), this.getPerformanceList()]).then(([staffListRes, performanceRes]) => {
        this.staffList = staffListRes.staffList.map(i => {
          this.staffIdCompareObj[i.id] = {
            ...i,
            staffId: i.id,
            ratio: null,
          } // 存储id比对员工数据
          return {
            ...i,
            staffId: i.id,
            isChosen: this.checkedStaffIds.includes(i.id) ? 
              (
                this.currentStatus.length && this.currentStatus.filter(superI => superI.staffId === i.id)[0].isChosen ? 
                  this.currentStatus.filter(superI => superI.staffId === i.id)[0].isChosen : false
              )
              : false,
          }
        })
        // 手动设置 - 暂时没有这个设置了
        // 自动平分
        if (performanceRes.autoAllocate) {
          this.limit = 5
          this.performanceCompareObj = {
            1: {0: 100},
            2: {0: 50, 1: 50},
            3: {0: 34, 1: 33, 2: 33},
            4: {0: 25, 1: 25, 2: 25, 3: 25},
            5: {0: 20, 1: 20, 2: 20, 3: 20, 4: 25},
          }
        } else {
          let obj = {}
          performanceRes.allocationModel.map(i => {
            switch(i.numberOfPeople) {
              case 2:
                obj[i.numberOfPeople] = {
                  0: i.allocationModel.first,
                  1: i.allocationModel.second,
                }
                break
              case 3:
                obj[i.numberOfPeople] = {
                  0: i.allocationModel.first,
                  1: i.allocationModel.second,
                  2: i.allocationModel.third,
                }
                break
              case 4:
                obj[i.numberOfPeople] = {
                  0: i.allocationModel.first,
                  1: i.allocationModel.second,
                  2: i.allocationModel.third,
                  3: i.allocationModel.forth,
                }
                break
              case 5:
                obj[i.numberOfPeople] = {
                  0: i.allocationModel.first,
                  1: i.allocationModel.second,
                  2: i.allocationModel.third,
                  3: i.allocationModel.forth,
                  4: i.allocationModel.fifth,
                }
                break
            }
          })
          obj[1] = { 0: 100 }
          this.performanceCompareObj = obj
          this.limit = performanceRes.allocationModel.length + 1 // 赋值规则最多的人数
        }
        this.firstLoad = false
        this.loading = false
      })
      .catch(err => {
        this.$message.error('接口请求失败，请稍后再试')
      })
    },
    // 获取服务者/销售列表
    getStaffList() {
      if (this.goods.goodsType === 'service') {
        return axios.post('/getStaffListCanDoService', {
          serviceId: this.goods.serviceId,
          workStation: this.workStationIndex
        })
        .then(res => res)
      } else {
        return axios.get(`/getSimpleStaffListByShopId/${this.currentInfo.shopId}`).then(res => res)
      }
    },
    // 获取业绩分配数据
    getPerformanceList() {
      return axios.post('/getPerformanceAllocation', 
        {storeId: this.currentInfo.shopId, type: this.goods.goodsType === 'service' ? 'service' : 'sales'}
      ).then(res => res)
    },
    // 勾选变化
    checkedStaffIdsChanged(staffIds) {
      if (this.checkedStaffIds.length > this.limit) {
        this.checkedStaffIds = this.checkedStaffIds.splice(0, this.limit)
        return this.$message.error(`最多可以选择${this.limit}人`)
      }
    },
    // 排序
    sortStaff(index) {
      let currentStaff = this.currentStatus.splice(index, 1)[0]
      this.currentStatus.splice(index - 1, 0, currentStaff);
      this.resetStaffPerformance()
    },
    // 重算业绩比例
    resetStaffPerformance() {
      let length = this.currentStatus.length
      this.currentStatus.map((staff, index) => {
        staff.ratio = this.performanceCompareObj[length][index]
      })
    },
  },
  watch: {
    checkedStaffIds: {
      handler: function(v, o) {
        if (this.firstLoad) return;
        // 当前变化肯定是增加一个或者删除一个
        if (v.length === 0) {
          this.currentStatus = []
        } else if (v.length > o.length) {
          if (this.currentStatus.length >= this.limit) return;
          let addId = v.filter(i => !o.includes(i))[0]
          this.currentStatus.push(this.staffIdCompareObj[addId])
          this.resetStaffPerformance()
        } else {
          let removeId = o.filter(i => !v.includes(i))[0]
          let findIndex = 0;
          for (let i = 0; i < this.currentStatus.length; i++) {
            if (this.currentStatus[i].staffId === removeId) {
              findIndex = i
            }
          }
          this.currentStatus.splice(findIndex, 1)
          this.resetStaffPerformance()
        }
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    title() {
      return this.goods.goodsType === 'service' ? `选择工位` : '选择销售'
    },
  },
  components: {}
}
</script>
<style lang='scss' scoped>
@mixin over-flow() {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
/deep/ .el-dialog__body {
  padding: 15px 20px;
}
.staff-main {
  display: flex;
  // flex-direction: row;
  flex-wrap: nowrap;
  .staffs-selected {
    width: 290px;
    background: #e8eaed;
    p { 
      text-indent: 46px; 
      line-height: 40px;
    }
  }
  .left-for-selected {
    flex: 1;
    background: #f4f5f7;
    p { 
      text-indent: 26px; 
      line-height: 40px;
    }
  }
}
img {
  object-fit: cover;
  object-position: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.list-for-selected /deep/ .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  .el-checkbox {
    display: flex;
    align-items: center;
    .el-checkbox__label {flex: 1;}
  }
}

.single-staff {
  width: 200px;
  overflow: hidden;
  margin: 8px 0 8px 20px;
  position: relative;
  .staff-info {
    display: flex;
    width: 176px;
  }
  .staff-text-info {
    margin-left: 4px;
    width: 137px;
    display: flex;
    flex-direction: column;
  }
  .staff-name, .level-name {
    @include over-flow;
  }
  .staff-level-name {
    display: flex;
    flex-wrap: nowrap;
  }
  .level-name {
    flex: 1;
  }
  .empty-box {
    width: 52px;
  }
}

.tag-box {
  width: 52px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
}
.send-type-tags {
  border-radius: 12px;
  padding: 0px 4px;
  font-size: 10px;
  display: inline-block;
  width: 50px;
  height: 18px;
  text-align: center;
  cursor: pointer;
  // border: 1px solid rgba(193, 192, 201, 1);
  color: #fff;
  background: #BEC3C6;
  &.active {
    background: #58C9F3;
  }
}

.single-selected-staff {
  display: flex;
  flex-wrap: nowrap;
  margin: 10px 0;
  .icon-box {
    width: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #00CF82;
    .arrow {
      cursor: pointer;
    }
  }
  .staff-info {
    display: flex;
    width: 190px;
  }
  .staff-text-info {
    margin-left: 4px;
    width: 150px;
    display: flex;
    flex-direction: column;
  }
  .staff-name, .level-name {
    @include over-flow;
  }
  .staff-level-name {
    display: flex;
    flex-wrap: nowrap;
  }
  .level-name {
    flex: 1;
  }
  .ratio-input {
    margin-right: 10px;
    width: 60px;
    /deep/ .el-input__inner {
      padding: 0;
      text-align: center;
    }
    /deep/ .el-input-group__append {
      padding: 0 4px;
    }
  }
}
</style>
