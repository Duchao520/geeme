<template>
  <div class="filter-area">
    <div class="filter-left-box">
      <div class="top-line">
        <span class="lable-title">选择时间: </span>
        <el-select v-model="searchType" @change="handleDateTypeChanged" size="medium">
          <el-option :value="1" label="日报"></el-option>
          <el-option :value="2" label="月报"></el-option>
        </el-select>
        <el-date-picker
          size="medium"
          v-model="date"
          :type="unit"
          :clearable="false"
          :value-format='valueFormat'
          placeholder="选择日期"
          @change="handleDateChanged"
        >
        </el-date-picker>
      </div>
      <div class="bottom-line">
        <div class="select-item" v-if="currentEntry === 'brand'">
          <span class="lable-title">选择门店: </span>
          <el-select
            v-model="shopIdInBrand"
            placeholder="选择门店" 
            size="medium"
            @change="handleShopIdChanged"
          >
            <!-- <el-option :label="'全部门店'" :value="null"></el-option> -->
            <el-option v-for="shop in shopsOptions" :key="shop.storeId" :label="shop.storeName" :value="shop.storeId"></el-option>
          </el-select>
        </div>
        <div class="select-item">
          <span class="lable-title">员工姓名: </span>
          <el-select
            v-model="currentStaffId"
            placeholder="选择员工" 
            size="medium"
            clearable
            @change="handleStaffIdChanged"
          >
            <!-- <el-option :label="'全部员工'" :value="null"></el-option> -->
            <el-option v-for="staff in staffList" :key="staff.id" :label="staff.name" :value="staff.id"></el-option>
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
      staffList: [], // 门店下员工列表
      currentStaffId: null,
      searchType: 1, // 1日报  2月报
      date: '',
    }
  },
  created() {
    this.date = new Date().format('yyyy-MM-dd')
    if (this.currentEntry === 'brand') {
      this.getShopsInBrand()
      // 没有指定门店不给查询
    } else {
      this.getStaffsInShop(this.currentInfo.shopId)
      this.lookup()
    }
  },
  methods: {
    // 品牌下门店列表 - 品牌端
    async getShopsInBrand() {
      let res = await axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`)
      this.shopsOptions = res.storeBasicInfoList || []
    },
    // 门店员工列表 - 品牌、门店
    async getStaffsInShop(id) {
      let res = await axios.get(`/getSimpleStaffListByShopId/${id}`)
      this.staffList = res.staffList || []
    },
    // 时间类型切换
    handleDateTypeChanged(type) {
      let  today = new Date()
      if (type === 1) {
        this.date = today.format('yyyy-MM-dd')
      } else {
        this.date = today.format('yyyy-MM')
      }
      this.lookup()
    },
    // 时间变化
    handleDateChanged(date) {
      this.lookup()
    },
    // 品牌门店切换 - 品牌端
    handleShopIdChanged(shopId) {
      this.currentStaffId = null // 重置已经选的员工id（如果有的话）
      this.getStaffsInShop(shopId) // 请求对应的门店员工接口
      // this.$emit('clearParams') // 清理页码
      this.lookup()
    },
    // 员工切换
    handleStaffIdChanged(staffId) {
      // this.currentStaffId = staffId
      // this.$emit('clearParams') // 清理页码
      // this.lookup() // 如果业务不带清理页码, 这里不想自动查询了
    },
    // 清空条件
    clearFilter() {
      this.searchType = 1
      this.date = new Date().format('yyyy-MM-dd')
      this.shopIdInBrand = null
      this.currentStaffId = null
      // this.$emit('clearParams') // 清理页码
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
    valueFormat() {
      return this.searchType === 1 ? 'yyyy-MM-dd' : 'yyyy-MM'
    },
    unit() {
      return this.searchType === 1 ? 'date' : 'month'
    },
    params() {
      return {
        date: this.searchType === 1 ? this.date : `${this.date}-01`,
        searchType: this.searchType,
        staffId: this.currentStaffId,
        shopIdInBrand: this.shopIdInBrand,
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.filter-area {
  height: 80px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  padding: 15px 0  15px 20px;
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
