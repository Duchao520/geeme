<template>
  <div class="filter-area">
    <el-select
      v-model="shopIdInBrand"
      placeholder="选择门店" 
      size="small"
      v-if="currentEntry === 'brand'"
      @change="handleShopIdChanged"
    >
      <el-option :label="'全部门店'" :value="null"></el-option>
      <el-option v-for="shop in shopsOptions" :key="shop.storeId" :label="shop.storeName" :value="shop.storeId"></el-option>
    </el-select>
    <el-select 
      v-model="dataType" 
      placeholder="请选择" 
      size="small"
      @change="handleTypeChanged"
    >
      <el-option :label="'日趋势'" :value="'DATE'"></el-option>
      <el-option :label="'月趋势'" :value="'MONTH'"></el-option>
    </el-select>

      <!-- unlink-panels -->
      <!-- 整个组件用到的地方都设置了最多连选一个月， 所以确保日历联动是最好的 -->
    <el-date-picker
      size="small"
      class="date-picker"
      v-model="date"
      :type="currentDataObj.type"
      range-separator="至"
      :clearable='false'
      :start-placeholder="currentDataObj.sp"
      :end-placeholder="currentDataObj.ep"
      @change="handleDateRangeChanged"
      :value-format="currentDataObj.format"
      :picker-options="pickerOption"
    ></el-date-picker>
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
      dataType: 'DATE', // - 日期类型
      date: [], // - 日期选择器的值
      pickerOption: {
        onPick: ( date => {
          this.disabledMinTime = +(new Date(date.minDate))
        }),
        disabledDate: (time => {
          if (this.disabledMinTime) {
            if (this.dataType === 'DATE') {
              return (time.getTime() > this.disabledMinTime + 31 * 8.64e7) || (time.getTime() < this.disabledMinTime - 31 * 8.64e7)
            } else if (this.dataType === 'MONTH') {
              // 365 - 28 粗略计算
              return (time.getTime() > this.disabledMinTime + 337 * 8.64e7) || (time.getTime() < this.disabledMinTime - 337 * 8.64e7)
            }
          } else {
            return false
          }
        })
      },
      disabledMinTime: null, // - 缓存的禁用时间最小值,反选选完后的问题无伤大雅.
    }
  },
  created() {
    // 品牌端 获取门店列表
    this.currentEntry === 'brand' && this.getShopsInBrand()
    // 初始化时间选择器
    let today = new Date().format('yyyy-MM-dd')
    this.date = [today.slice(0, -2) + '01', today]
    this.handleDateRangeChanged(this.date)
  },
  methods: {
    async getShopsInBrand() {
      let res = await axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`)
      this.shopsOptions = res.storeBasicInfoList || []
    },
    handleDateRangeChanged(arr) {
      // 发送事件请求数据
      this.$emit('filterChanged', {
        type: this.dataType,
        date: arr,
        shopIdInBrand: this.currentEntry === 'brand' ? this.shopIdInBrand : null, // 如果是品牌端 需要发送当前选择的门店id
      })
      // 选完后让整个日历处于任一天可以选
      this.disabledMinTime = null
      
    },
    handleTypeChanged(type) {
      if (type === 'MONTH') {
        let time = new Date()
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let lastYearTime = month === 12 ? `${year}-01` : `${year - 1}-${month + 1}`
        this.date = [lastYearTime, `${year}-${month}`]
        this.handleDateRangeChanged(this.date)
      } else {
        // 初始化时间选择器
        let today = new Date().format('yyyy-MM-dd')
        this.date = [today.slice(0, -2) + '01', today]
        this.handleDateRangeChanged(this.date)
      }
      this.disabledMinTime = null
    },
    handleShopIdChanged(shopId) {
      this.$emit('filterChanged', {
        type: this.dataType,
        date: this.date,
        shopIdInBrand: this.currentEntry === 'brand' ? shopId : null, // 如果是品牌端 需要发送当前选择的门店id
      })
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    currentDataObj() {
      if (this.dataType === 'DATE') {
        return {
          type: 'daterange',
          sp: '开始日期',
          ep: '结束日期',
          format: 'yyyy-MM-dd'
        }
      } else if (this.dataType === 'MONTH')  {
        return {
          type: 'monthrange',
          sp: '开始月份',
          ep: '结束月份',
          format: 'yyyy-MM'
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
