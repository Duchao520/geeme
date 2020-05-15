<template>
  <div class="filter-area">
    <div class="filter-left-box">
      <div class="top-line">
        <el-radio-group 
          v-model="currentDate" 
          @change="currentDataChanged" 
          style="margin-right: 10px;"
        >
          <el-radio-button label="currentDateFlag">今天</el-radio-button>
          <el-radio-button label="currentWeekFlag">本周</el-radio-button>
          <el-radio-button label="currentMonthFlag">本月</el-radio-button>
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
          <span class="lable-title">消费类型: </span>
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
      currentDate: 'currentDateFlag', // 本日 currentDateFlag， 本周 currentWeekFlag， 本月 currentMonthFlag
      // 消费类型 及 选项
      consumerTypeOptions: [
        {value: 0, label: '全部'},
        {value: 1, label: '产品'},
        {value: 2, label: '服务'},
        {value: 3, label: '卡项'},
      ],
      consumerType: 0,
      // 支付方式 及 选项
      payTypeOptions: [
        {value: null, label: '全部'},
        {value: 0, label: '微信'},
        {value: 1, label: '支付宝'},
        {value: 2, label: '现金'},
        {value: 3, label: '储值卡'},
        {value: 4, label: '自定义'},
        {value: 5, label: '次卡'},
        {value: 6, label: '时间卡'},
        {value: 8, label: '余额支付'},
      ],
      payType: null,
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
        this.currentDate = 'currentDateFlag'
        this.currentDataChanged(this.currentDate)
      }
    },
    // 清空条件
    clearFilter() {
      this.payType = null
      this.timeValue = null
      this.consumerType = 0
      this.currentDate = 'currentDateFlag'
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
      let flag = this.currentDate ? {[this.currentDate]: true} : {}
      return {
        shopIdInBrand: this.currentEntry === 'brand' ? this.shopIdInBrand : null, // 如果是品牌端 需要发送当前选择的门店id
        payType: this.payType,
        consumerType: this.consumerType,
        beginDay: this.currentDate ? null : this.timeValue[0],
        endDay: this.currentDate ? null : this.timeValue[1],
        ...flag
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
