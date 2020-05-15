<template>
  <el-dialog title="选择商品" :visible="visible" :before-close="handleClose" width="900px">
    <div class="select-goods-box">
      <div class="dialog-body-filter-line">
        <div class="level-filter-box">
          <div class="select-item">
            <span class="lable-title">品牌: </span>
            <el-select
              clearable
              size="medium"
              placeholder="选择品牌" 
              v-model="params.productBrandId"
              @change="handleSelectChange"
            >
              <el-option 
                v-for="brand in productBrandOption" 
                :label="brand.productBrandName"
                :value="brand.productBrandId"
                :key="brand.productBrandId" 
              ></el-option>
            </el-select>
          </div>
          <!-- 产品分类 -->
          <div class="select-item">
            <span class="lable-title">产品分类: </span>
            <el-cascader
              clearable
              placeholder="需先选择产品品牌"
              :options="productClassOption"
              v-model="productClassSelected"
              :props="cascaderProps"
            ></el-cascader>
          </div>
        </div>
        <div class="search-box">
          <g-search :placeholder='"搜索产品名称"' v-on:search="handleSearch"></g-search>
        </div>
      </div>
      <el-table 
        stripe 
        height="50vh" 
        v-loading="tableLoading"
        :data="tableData" 
        ref="goodsTable"
        :header-cell-style="headerRowStyle" 
        @selection-change="handleSelectionChange" 
      >
        <el-table-column type="selection" width="42px" :selectable="handleCheckSelectable"></el-table-column>
        <el-table-column label="一级分类" show-overflow-tooltip prop="stockProductInfo.productLevelOneName"></el-table-column>
        <el-table-column label="二级分类" show-overflow-tooltip prop="stockProductInfo.productLevelTwoName"></el-table-column>
        <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductInfo.simpleTitle"></el-table-column>
        <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
        <el-table-column label="单位" prop="specificationUnit"></el-table-column>
        <el-table-column v-if="needCheckStock" label="可用库存" prop="redeploymentStock">
          <template slot-scope="{row}">
            <span :class="{'red' : !row.redeploymentStock}">
              {{row.redeploymentStock || 0}}  
            </span>
          </template>
        </el-table-column>
        <!-- 以下 区分门店和品牌 -->
        <!-- 品牌 -->
        <el-table-column v-if="currentEntry === 'brand'" label="供货价" show-overflow-tooltip prop="givePrice"></el-table-column>
        <el-table-column v-if="currentEntry === 'brand'" label="成本价" show-overflow-tooltip prop="costPrice"></el-table-column>
        <!-- 门店 -->
        <el-table-column v-if="currentEntry === 'shop'" label="进货价" show-overflow-tooltip prop="givePrice"></el-table-column>
      </el-table>
      <div class="bottom-line">
        <!-- 仅产品分页数 不是规格, 规格可能更多 -->
        <div>总计 {{total}} 个产品，本页 {{tableData.length}} 个规格</div>
        <el-pagination
          style="margin: 5px 20px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          :pager-count="5"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>  
    </div> 
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" plain class="plain_gray_btn">关 闭</el-button>
      <el-button class="normal_blue_btn" @click="sendData">保存当前页</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择产品'
    },
    // 选中项
    superCheckedGoods: {
      type: Set,
      required: true
    },
    needCheckStock: {
      type: Boolean,
      default: false
    },
    origin: {
      type: String,
      default: 'brand'
    }
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        searchWord: null,
        productBrandId: null, // 产品品牌id
        productLevelOne: null, // 产品1级分类id 依赖产品品牌id
        productLevelTwo: null // 产品2级分类id 依赖产品品牌id
      },
      productBrandOption: [], // 产品品牌数据
      productClassOption: [], // 产品分类数据
      cascaderProps: {}, // 分类组件的prop 
      productClassSelected: [], // 分类选中值
      tableData: [],
      total: 0,
      tableLoading: false,
      headerRowStyle: { background: '#f4f5f7' }, // 表头样式
      multipleSelection: [], // 组件自带的勾选数组对象
      checkedIds: [], // 选中的id们, 用于匹配输入框直接输入的文本是不是打勾了
    }
  },
  created() {
    // 加载产品品牌选项
    this.initProductBrandOption()
    this.init()
  },
  methods: {
    init() {
      this.tableLoading = true
      let params = JSON.parse(JSON.stringify(this.params))
      let url = this.needCheckStock ? '/getStockProductSpecificationInfoWithStockList' : '/getStockProductSpecificationInfoList'
      axios.post(
        url, 
        {
          ...params,
          brandId: this.currentInfo.brandId, 
          storeId: this.origin === 'shop' ? this.currentInfo.shopId : null, 
        }
      ).then(res => {
        this.tableData = res.listStockProductSpecificationInfo || []
        this.total = res.total
        this.tableLoading = false
        this.$nextTick(() => {
          this.tableData.map(i => {
            this.superCheckedGoods.has(i.stockProductSpecificationId) && this.$refs.goodsTable.toggleRowSelection(i, true)
          })
        })
      })
    },
    // 第一列勾选的变化
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows
    },
    handleSelectChange(brandId) {
      // 切换要清除已选的产品分类，并且重新请求分类数据
      this.initProductClassByChoosedBrand(brandId)
      this.productClassSelected = []
      // this.params.productLevelOne = null
      // this.params.productLevelTwo = null
      // this.handleCurrentChange(1)
    },
    // 产品品牌
    async initProductBrandOption() {
      let res = await axios.post('/getStockProductBrandInfos', {brandId: this.currentInfo.brandId})
      this.productBrandOption = res.listStockProductBrandInfo || [];
    },
    // 根据所选的产品品牌，请求可用的产品分类数据
    async initProductClassByChoosedBrand(brandId) {
      if (!brandId) { return }
      let res = await axios.post('/getStockProductLevelTwoInfos', {
        productBrandId: brandId,
        brandId: this.currentInfo.brandId,
      })
      this.cascaderProps = { label: "levelName", value: "levelId", children: "listStockProductLevelTwoInfo" }; // 分类组件的prop
      this.productClassOption = res.listStockProductLevelInfo
    },
    handleClose() {
      this.$emit('close')
    },
    sendData() {
      // 比对数据
      let difference = this.tableData.filter(v => !this.multipleSelection.map(i => i.stockProductSpecificationId).includes(v.stockProductSpecificationId))
      let template = {
        no: difference, // 没选中的数据
        yes: this.multipleSelection // 选中的数据
      }
      this.$emit('suberData', template)
    },
    handleCurrentChange(page) {
      this.params.pageNum = page
      this.init()
    },
    handleSearch(searchWord) {
      this.params.searchWord = searchWord
      this.handleCurrentChange(1)
    },
    handleCheckSelectable(row, index) {
      if (this.needCheckStock) {
        return row.redeploymentStock
      }
      return true
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  watch: {
    'multipleSelection'(rows, old) {
      this.checkedIds = []
      rows.map(i => {
        this.checkedIds.push(i.stockProductSpecificationId)
      })
    },
    // 监听分类切换事件 及 品牌变更导致的分类清理
    productClassSelected(v, o) {
      if (v && v.length) {
        this.params.productLevelOne = v[0]
        this.params.productLevelTwo = v[1]
      } else {
        this.params.productLevelOne = null
        this.params.productLevelTwo = null
      }
      this.handleCurrentChange(1)
    }
  }
}
</script>
<style lang='scss' scoped>
$blue: #58c9f3;
$gray: #d5dadf;

#suber-component-dialog {
  /deep/ .el-dialog__body {
    border-top: 1px solid #F0F1F4;
    padding: 18px 20px;
  }
}

.select-goods-box {
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
}

.dialog-body-filter-line {
  padding: 22px 20px 15px 10px;
  display: flex;
  justify-content: space-between;
  .level-filter-box {
    display: flex;
    align-items: center;
    .select-item {margin-right: 10px;}
  }
  .search-box {
    width: 220px;
  }
}
.bottom-line {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &>div{
    height: 45px;
    line-height: 45px;
    margin-right: 8px;
  }
}
#app .el-pagination{
  margin-top: 15px !important;
  padding: 0;
}
.red {
  color: red;
}
</style>
