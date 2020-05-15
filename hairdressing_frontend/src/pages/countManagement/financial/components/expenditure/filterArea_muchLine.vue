<template>
  <div class="filter-area">
    <div class="filter-left-box">
      <div class="top-line">
        <el-radio-group 
          v-model="currentDate" 
          @change="currentDataChanged" 
          style="margin-right: 10px;"
        >
          <el-radio-button label="WEEK">本周</el-radio-button>
          <el-radio-button label="CURRENT_MONTH">本月</el-radio-button>
          <el-radio-button label="LAST_MONTH">上月</el-radio-button>
        </el-radio-group>
        <el-date-picker
          size="medium"
          v-model="timeValue"
          @change="changeTimeArea"
          type="datetimerange"
          :clearable="false"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="bottom-line">
        <div class="select-item" v-if="currentEntry === 'brand'">
          <span class="lable-title">选择门店: </span>
          <el-select
            v-model="shopIdInBrand"
            placeholder="选择门店" 
            size="medium"
            @change="lookup"
          >
            <!-- <el-option :label="'全部门店'" :value="null"></el-option> -->
            <el-option v-for="shop in shopsOptions" :key="shop.storeId" :label="shop.storeName" :value="shop.storeId"></el-option>
          </el-select>
        </div>
        <div class="select-item">
          <span class="lable-title">项目类型: </span>
          <el-select v-model="projectType" placeholder="请选择" size="medium">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="房租" :value="0"></el-option>
            <el-option label="水电费" :value="1"></el-option>
            <el-option label="物业费" :value="2"></el-option>
            <el-option label="办公费" :value="3"></el-option>
            <el-option label="管理费" :value="4"></el-option>
            <el-option label="工资提成" :value="5"></el-option>
            <el-option label="固定资产分摊" :value="6"></el-option>
            <el-option label="产品材料" :value="7"></el-option>
            <el-option label="财务费用" :value="8"></el-option>
            <el-option label="其他费用" :value="9"></el-option>
          </el-select>
        </div>
        <div class="select-item">
          <span class="lable-title">支付类型: </span>
          <el-select v-model="consumerType" placeholder="请选择" size="medium">
            <el-option
              v-for="type in consumerTypeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-item">
          <span class="lable-title">支付方式: </span>
          <el-select v-model="payType" placeholder="请选择" size="medium">
            <el-option
              v-for="type in payTypeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="filter-right-box">
      <el-button class="normal_blue_btn" size='medium' @click="lookup">查询</el-button>
      <span class="condition-clear" @click="clearFilter">清空条件</span>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      shopIdInBrand: null, // 品牌端， 门店id
      shopsOptions: [], // 门店下拉选项
      timeValue: [], // 开始和结束时间
      currentDate: 'WEEK', // 本周、本月、上月 - WEEK, CURRENT_MONTH, LAST_MONTH
      // 支出类型 及 选项
      consumerTypeOptions: [
        {value: null, label: '全部'},
        {value: 'BUSINESS_EXPENSE', label: '营收支出'},
        {value: 'CUSTOMER_REBATE', label: '客户返利'},
        {value: 'STAFF_COMMISSION', label: '员工提成'},
      ],
      consumerType: null,
      // 支出方式 及 选项
      payTypeOptions: [
        {value: null, label: '全部'},
        {value: 'CAMP_COLLECTION', label: '预收款'},
        {value: 'REVOLVING_FUND', label: '备用金'},
      ],
      payType: null,
      projectType: null, // 项目类型
    }
  },
  created() {
    this.currentEntry === 'brand' && this.getShopsInBrand()
    this.lookup()
  },
  methods: {
    async getShopsInBrand() {
      let res = await axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`)
      this.shopsOptions = res.storeBasicInfoList || []
    },
    // 时间组件切换到单选组件
    currentDataChanged(currentDate) {
      this.timeValue = []
      this.lookup()
    },
    // 时间组件变化
    changeTimeArea(arr) {
      if (arr && arr.length) {
        this.currentDate = null
        this.lookup()
      } else {
        // 时间组件-清空
        this.currentDate = 'WEEK'
        this.currentDataChanged(this.currentDate)
      }
    },
    // 清空条件
    clearFilter() {
      this.payType = null
      this.timeValue = null
      this.consumerType = null
      this.projectType = null
      this.currentDate = 'WEEK'
      this.lookup()
    },
    // 查询
    lookup(){
      this.$emit('filterChanged', this.params)
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    params() {
      return {
        shopIdInBrand: this.currentEntry === 'brand' ? this.shopIdInBrand : null, // 如果是品牌端 需要发送当前选择的门店id
        payType: this.payType,
        consumerType: this.consumerType,
        beginDay: this.currentDate ? null : this.timeValue[0],
        endDay: this.currentDate ? null : this.timeValue[1],
        currentDate: this.currentDate,
        projectType: this.projectType,
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.filter-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  .filter-left-box {
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .bottom-line {
      display: flex;
      .select-item {margin-right: 10px;}
    }
  }
  .filter-right-box {
    flex: 1;
    display: flex;
    padding-left: 25px;
    align-items: flex-end;
    border-left: 1px solid #F0F1F4;
    * {
      cursor: pointer;
      margin-right: 20px;
    }
    span {
      height: 35px;
      color: #999;
      display: block;
      line-height: 35px;
    }
  }
}
</style>
