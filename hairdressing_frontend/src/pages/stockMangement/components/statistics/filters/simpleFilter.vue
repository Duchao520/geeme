<template>
  <div class="simple-filter-line">
    <div class="letf-part">
      <!-- 选择门店： -->
      <div class="select-item" v-if="currentEntry === 'brand'">
        <span class="lable-title">门店：</span>
        <el-select v-model="storeIdInBrand" @change="handleShopIdChanged">
          <el-option label="全部" :value="null"></el-option>
          <el-option v-for="store in storeOptions" :key="store.storeId" :label="store.storeName" :value="store.storeId"></el-option>
        </el-select>
      </div>
      <!-- 品牌筛选 -->
      <div class="select-item" v-if="currentType !== 'orderGoods'">
        <span class="lable-title">品牌: </span>
        <el-select
          clearable
          size="medium"
          placeholder="选择品牌" 
          v-model="productBrandSelected"
          @change="handleSelectChange"
        >
          <!-- <el-option v-if="!productBrandOption.length" label="-选择品牌-" :value="null"></el-option> -->
            <!-- v-else -->
          <el-option 
            v-for="brand in productBrandOption" 
            :label="brand.productBrandName"
            :value="brand.productBrandId"
            :key="brand.productBrandId" 
          ></el-option>
        </el-select>
      </div>
      <!-- 产品分类 -->
      <div class="select-item" v-if="productBrandSelected && currentType !== 'orderGoods'">
        <span class="lable-title">分类: </span>
        <el-cascader
          clearable
          :options="productClassOption"
          v-model="productClassSelected"
          :props="cascaderProps"
          @change="handleCascaderChange"
        ></el-cascader>
      </div>
      <div class="select-item">
        <span class="lable-title">时间：</span>
        <el-date-picker
          size="medium"
          v-model="timeValue"
          unlink-panels
          type="datetimerange"
          :clearable="currentType === 'stockIO'"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTimeArea"
        ></el-date-picker>
      </div>
      <!-- 仅当产品收发页面 有重算功能 -->
      <div class="select-item" v-if="showResetBtn">
        <el-button 
          plain 
          size="small" 
          class="plain_pink_btn" 
          @click="resetTableData"
        >
          重算
        </el-button>
      </div>
    </div>
    <div class="right-btns">
      <input-search
        width="auto"
        :placeholder="placeholder"
        v-model="searchKey"
        @search="searchData"
      />
    </div>
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    currentType: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '搜索出入库单号'
    },
  },
  data() {
    return {
      productClassOption: [], // 产品分类数据
      cascaderProps: {}, // 分类组件的prop 
      productClassSelected: [], // 产品分类级联选中值
      productBrandOption: [], // 产品品牌数据
      productBrandSelected: null, // 产品品牌选中值

      storeOptions:[],  // 品牌下的门店列表
      storeIdInBrand: null, // 品牌下选择的门店

      timeValue: [], // 
      searchKey: '',
    }
  },
  created() {
    if (this.currentType === 'productRS' || this.currentType === 'stockIO' || this.currentType === 'orderGoods') {
      let today = new Date().format('yyyy-MM-dd')
      let month = new Date().format('yyyy-MM')
      this.timeValue = [`${month}-01 00:00:00`, `${today} 23:59:59`]
      this.handleFilterChange()
    }
    // 加载产品品牌选项
    this.initProductBrandOption()
    if(this.currentEntry === 'brand'){
      this.getStores()
    }
  },
  methods: {
    // 获取门店列表
    getStores(){
      axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`).then(res => {
        this.storeOptions = res.storeBasicInfoList
      })
    },
    // 根据所选的产品品牌，请求可用的产品分类数据
    async initProductClassByChoosedBrand() {
      let res = await axios.post('/getStockProductLevelTwoInfos', {
        productBrandId: this.productBrandSelected,
        brandId: this.currentInfo.brandId,
      })
      this.cascaderProps = { label: "levelName", value: "levelId", children: "listStockProductLevelTwoInfo" }; // 分类组件的prop
      this.productClassOption = res.listStockProductLevelInfo
    },
    // 产品品牌
    async initProductBrandOption() {
      let res = await axios.post('/getStockProductBrandInfos', {brandId: this.currentInfo.brandId})
      this.productBrandOption = res.listStockProductBrandInfo || [];
    },
    handleShopIdChanged(id) {
      this.handleFilterChange(1)
    },
    searchData(key) {
      this.handleFilterChange(1)
    },
    // 分类级联切换
    handleCascaderChange(arr) {
      this.handleFilterChange(1)
    },
    changeTimeArea(time) {
      if (this.currentType === 'productRS' && !time) {
        return this.$message.error('请输入时间才能查询此表')
      }
      this.handleFilterChange(1)
    },
    handleSelectChange(brandId) {
      // 切换要清除已选的产品分类，并且重新请求分类数据
      this.productClassSelected = [];
      this.productClassOption = [];
      if (this.productClassSelected) {
        this.handleFilterChange(1);
        !!brandId && this.initProductClassByChoosedBrand();
      }
    },
    handleFilterChange() {
      this.$emit('handleFilterChange', this.params)
    },
    resetTableData() {
      this.$emit('resetTableData', new Date(this.timeValue[0]).format('yyyy-MM-dd'))
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    params() {
      return {
        searchKey: this.searchKey,
        storeId: this.storeIdInBrand,
        productBrandId: this.productBrandSelected,
        productLevelOne: this.productClassSelected && this.productClassSelected.length ? this.productClassSelected[0] : null,
        productLevelTwo: this.productClassSelected && this.productClassSelected.length ? this.productClassSelected[1] : null,
        endDay: this.timeValue && this.timeValue.length ? this.timeValue[1] : null,
        startDay: this.timeValue && this.timeValue.length ? this.timeValue[0] : null,
      }
    },
    showResetBtn() {
      if (this.currentType === 'productRS' ) {
        if (this.timeValue && this.timeValue.length) {
          let start = new Date(this.timeValue[0]).format('yyyy-MM-dd')
          let end = new Date(this.timeValue[1]).format('yyyy-MM-dd')
          return start === end
        }
      }
      return false
    }
  },
}
</script>

<style lang='scss' scoped>
.simple-filter-line {
  margin: 20px 20px 0;
  display: flex;
  height: 75px;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  background: #fff;
  .select-item {margin-right: 10px;}
  // .lable-title {display:  none;}
  .letf-part {
    display: flex;
    align-items: center;
  }
  .right-btns {margin-right: 20px;}
}
</style>