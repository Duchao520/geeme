<template>
  <div class="filter-area">
    <div class="left-area">
      <div class="filter-line">
        <span>选择时间: </span>
        <el-date-picker
          size="medium"
          class="date-picker"
          v-model="dateRange"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          :clearable='false'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="handleDateRangeChanged"
        ></el-date-picker>
      </div>
      <div class="filter-line">
        <span v-if="currentEntry === 'brand'">
          <!-- <span style="color: red;">*</span> -->
          选择门店: 
        </span>
        <el-select
          v-model="form.shopIdInBrand"
          placeholder="选择门店" 
          size="medium"
          clearable
          v-if="currentEntry === 'brand'"
          @change="handleShopIdChanged"
          style="margin-right: 12px;"
        >
          <!-- <el-option :label="'全部门店'" :value="null"></el-option> -->
          <el-option v-for="shop in shopsOptions" :key="shop.storeId" :label="shop.storeName" :value="shop.storeId"></el-option>
        </el-select>
        <span>员工职务: </span>
        <el-select v-model="form.levelId" placeholder="员工职务" clearable size="medium">
          <el-option v-for="lev in levelList" :key="lev.id" :label="lev.name" :value="lev.id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="right-area">
      <div>
        <el-button class="normal_blue_btn" @click="lookup">查 询</el-button>
        <span class="gray-text" @click="handleClearFilters">清空条件</span>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      dateRange: [],
      levelList: [],
      form: {
        levelId: '',
        occurDate: '',
        occurDateEnd: '',
        shopIdInBrand: null,
      },
      shopsOptions: {},
    }
  },
  created() {
    // 品牌端 获取门店列表
    this.currentEntry === 'brand' && this.getShopsInBrand()
    // - 获取品牌员工职级列表(品牌下通用)
    this.getStaffLevels()
    //  初始化时间为本月月初到今日
    let today = new Date().format('yyyy-MM-dd')
    let monthStart = today.slice(0, -2) + '01'
    this.dateRange = [monthStart, today]
    this.form.occurDate = monthStart
    this.form.occurDateEnd = today
    this.lookup()
  },
  methods: {
    async getShopsInBrand() {
      let res = await axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`)
      this.shopsOptions = res.storeBasicInfoList
    },
    lookup() {
      this.$emit('filterChanged', JSON.parse(JSON.stringify(this.form))) // 避免直接发送引用对象
    },
    handleShopIdChanged(shopId) {
      this.form.shopIdInBrand = shopId
      this.lookup()
    },
    async getStaffLevels() {
      let res = await axios.get(`/getAllSimpleStoreStaffLevelList/${this.currentInfo.brandId}`)
      this.levelList = res.levelList
    },
    handleClearFilters() {
      this.form = {
        levelId: '',
        occurDate: '',
        occurDateEnd: '',
      }
      //  初始化时间为本月月初到今日
      let today = new Date().format('yyyy-MM-dd')
      let monthStart = today.slice(0, -2) + '01'
      this.dateRange = [monthStart, today]
      this.form.occurDate = monthStart
      this.form.occurDateEnd = today
      this.lookup()
    },
     handleDateRangeChanged() {
      if (this.dateRange.length) {
        this.form.occurDate = this.dateRange[0]
        this.form.occurDateEnd = this.dateRange[1]
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
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
  flex-direction: row;
  flex-wrap: nowrap;
}
.left-area {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.filter-line {
  font-size: 14px;
}
.right-area {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-left: 30px;
  .normal_blue_btn {
    padding: 10px 20px;
    margin-right: 10px;
  }
  .gray-text {
    color: #999;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
