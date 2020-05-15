<template>
  <div class="stock-product" v-loading="pageLoading">
    <!-- 品牌仅有， 门店的搜索下挪 -->
    <div class="header-line" v-if="currentEntry === 'brand'">
      <div class="left-btns">
        <el-button 
          v-if="checkRolesAuthorityInPage('/brand-inner/stock/stock-product-add', 'path')"
          class="normal_red_btn" 
          @click="handleToAddProd"
        >
          新增产品
        </el-button>
      </div>
      <div class="right-btns">
        <input-search
          :placeholder="'搜索产品名称'"
          width="auto"
          v-model="searchWord"
          @search="searchData"
        />
      </div>
    </div>
    <div class="filter-line">
      <div class="left-part">
        <!-- 品牌筛选 -->
        <div class="select-item">
          <span class="lable-title">品牌: </span>
          <el-select
            clearable
            size="medium"
            placeholder="选择品牌" 
            v-model="productBrandSelected"
            @change="handleSelectChange"
          >
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="brand in productBrandOption" 
              :label="brand.brandName"
              :value="brand.productBrandId"
              :key="brand.productBrandId" 
            ></el-option>
          </el-select>
        </div>
        <!-- 产品分类 -->
        <div class="select-item" v-if="productBrandSelected">
          <span class="lable-title">产品分类: </span>
          <el-cascader
            clearable
            :options="productClassOption"
            v-model="productClassSelected"
            :props="cascaderProps"
            @change="handleCascaderChange"
          ></el-cascader>
        </div>
      </div>
      <div class="right-btns" v-if="currentEntry === 'shop'">
        <input-search
          :placeholder="'搜索产品名称'"
          width="auto"
          v-model="searchWord"
          @search="searchData"
        />
      </div>
    </div>
    <div class="table-main">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentType" v-if="currentEntry === 'brand'">
          <el-tab-pane
            v-for="item in dataTypes"
            :key="item.code"
            :name="item.code"
            :label="item.value"
          ></el-tab-pane>
        </el-tabs>
        <div class="table-box">
          <el-table 
            stripe
            :data="tableData"
            :height="currentEntry === 'brand' ? 'calc(100vh - 342px)' : 'calc(100vh - 255px)'"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" v-if="currentEntry === 'brand'"></el-table-column>
            <el-table-column label="排序" width="80" prop="weight" v-if="currentEntry === 'brand'"></el-table-column>
            <el-table-column label="产品名称" prop="title" width="240">
              <template slot-scope="{row}">
                <div class="table-title">
                  <div class="up">
                    <div class="left">
                      <img
                        v-if="row.cycleImages"
                        :src="utils.formatPicImage(JSON.parse(row.cycleImages)[0], 'style', 146, 'brandLogo')" 
                        class="image"
                        :preview="Math.random()" 
                        :preview-text="''"
                      >
                    </div>
                    <div class="right">
                      <div class="simple-title">{{row.simpleTitle}}</div>
                      <div class="serial-no">{{row.serialNo}}</div>
                    </div>
                  </div>
                  <!-- <div class="down">
                    <p>产品编号: {{row.serialNo}}</p>
                  </div> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column label="产品品牌" show-overflow-tooltip prop="productBrandName">
              <template slot-scope="{ row }">
                <p>{{ row.productBrandName || getProName(row.productBrandId)}}</p>
              </template>
            </el-table-column>
            <el-table-column label="产品类型" prop="productLevelTwoName"></el-table-column>
            <el-table-column label="规格">
              <template slot-scope="{row}">
                <ul class="psp">
                  <li v-for="pSp in row.listBrandStockProductSpecification" :key="pSp.stockProductSpecificationId">
                    {{pSp.specificationName}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template slot-scope="{row}">
                <ul class="psp">
                  <li v-for="pSp in row.listBrandStockProductSpecification" :key="pSp.stockProductSpecificationId">
                    {{pSp.specificationUnit}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <!-- api 可调拨库存 =》 可用库存 -->
            <el-table-column label="可用库存">
              <template slot-scope="{row}">
                <ul class="psp">
                  <li v-for="pSp in row.listBrandStockProductSpecification" :key="pSp.stockProductSpecificationId">
                    {{pSp.redeploymentStock || 0}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="成本价" v-if="currentEntry === 'brand'">
              <template slot-scope="{row}">
                <ul class="psp">
                  <li v-for="pSp in row.listBrandStockProductSpecification" :key="pSp.stockProductSpecificationId">
                    ￥{{pSp.costPrice}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="供货价">
              <template slot-scope="{row}">
                <ul class="psp">
                  <li v-for="pSp in row.listBrandStockProductSpecification" :key="pSp.stockProductSpecificationId">
                    ￥{{pSp.givePrice}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="建议零售价">
              <template slot-scope="{row}">
                <ul class="psp">
                  <li v-for="pSp in row.listBrandStockProductSpecification" :key="pSp.stockProductSpecificationId">
                    ￥{{pSp.salesPrice}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <!-- 上架及删除 门店仅有详情 -->
                <g-button
                  v-if="currentType !== '1' && checkRolesAuthorityInPage(`/${currentEntry}-inner/stock/stock-product-detail`, 'path')"
                  :name="'详情'"
                  type="detail"
                  :icon="'icon_operate_eyes'"
                  @click="todetailProduct(row.stockProductId)"
                ></g-button>

                <!-- 仅上架 -->
                <g-button
                  :name="'下架'"
                  type="cancel"
                  v-if="currentType === '0' && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_product_upDown')"
                  :icon="'icon_operate_down'"
                  @click="toUnshelveProduct([row], 1)"
                ></g-button>

                <!-- 仅下架 -->
                <g-button
                  :name="'编辑'"
                  type="green"
                  v-if="currentType === '1' && currentEntry === 'brand' && checkRolesAuthorityInPage('/brand-inner/stock/stock-product-edit', 'path')"
                  :icon="'icon_operate_edit'"
                  @click="toEditProduct(row.stockProductId)"
                ></g-button>
                <!-- 仅下架 -->
                <g-button
                  :name="'上架'"
                  type="mgreen"
                  v-if="currentType === '1' && currentEntry === 'brand' && row.cycleImages && checkRolesAuthorityInPage('brand_stock_product_upDown')"
                  :icon="'icon_operate_up'"
                  @click="toUnshelveProduct([row], 0)"
                ></g-button>
                <!-- 仅下架 -->
                <g-button
                  v-if="currentType === '1' && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_product_delete')"
                  :name="'删除'"
                  type="orange"
                  :icon="'icon_operate_disable'"
                  @click="todelProduct(row.stockProductId)"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-line">
            <div>
              <el-button v-if="currentType === '1' && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_product_upDown')" class="foot-btn normal_green_btn" @click="multipleUpGoods">批量上架</el-button>
              <el-button v-if="currentType === '0' && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_product_upDown')" class="foot-btn normal_silvery_gray_btn" @click="multipleDownGoods">批量下架</el-button>
            </div>
            <el-pagination
              style="margin: 5px 20px 5px 0;"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <g-dialog-with-slot
      v-if="delDialogVisible"
      :dialogVisible="delDialogVisible"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确认删除吗?'"
      @resolve="deleteProduct"
      @close="delDialogVisible=false"
    >
      <div>删除后，该产品无法恢复!</div>
    </g-dialog-with-slot>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import '@/assets/css/tab.scss';
import { Base64 } from 'js-base64'
// import util from "@/util/base.js";
export default {
  data() {
    return {
      utils,
      searchWord: '',
      pageLoading: false, 
      delDialogVisible: false, 
      productClassOption: [], // 产品分类数据
      cascaderProps: {}, // 分类组件的prop 
      productClassSelected: [], // 产品分类级联选中值
      productBrandOption: [], // 产品品牌数据
      productBrandSelected: '', // 产品品牌选中值

      currentType: '0',
      tableData: [], // 
      pageNum: 1,
      pageSize: 10,
      total: 0,
      currentOperateId: null, // 预删除的产品id / 编辑的id
      currentCheckedRows: [], // 批量选择的对象
    }
  },
  created() {
    // 加载分类选项
    // this.initProductClassOption() // 这个接口请求的东西是依赖门店端新增产品的、不满足库存产品需求  - 提示用 勿删 -
    // 加载产品品牌选项
    this.initProductBrandOption()
    // 加载表格
    this.init()
  },
  methods: {
    ...mapActions(['setBrandProduct']),
    async init() {
      this.pageLoading = true
      let res = await axios.post('/getBrandStockProductList', this.pargms)
      this.tableData = res.listBrandStockProduct || []
      this.total = res.total
      this.pageLoading = false
    },
    // 产品分类 [旧] 这个接口请求的东西是依赖门店端新增产品的、不满足库存产品需求  - 提示用 勿删 -
    // async initProductClassOption() { 
    //   let res = await axios.post('/getProductSortListByNameAndBrandId', {brandId: this.currentInfo.brandId})
    //   this.cascaderProps = { value: 'id',  label: 'sortName', children: 'sortTwo' } // 分类组件的prop 
    //   this.productClassOption = res.sortInfos || []
    // },
    // 产品分类 [新]
    // 根据所选的产品品牌，请求可用的产品分类数据  !!!此处不需要过滤未入库的产品!!!
    // 根据所选的产品品牌，请求可用的产品分类数据  !!!此处不需要过滤未入库的产品!!!
    // 根据所选的产品品牌，请求可用的产品分类数据  !!!此处不需要过滤未入库的产品!!!
    async initProductClassByChoosedBrand() {
      let res = await axios.get(`/getProductClass/${this.productBrandSelected}`)
      this.cascaderProps = { label:'name', value:'id', children:'subClass' } // 分类组件的prop 
      this.productClassOption = res.data.map(item => {
        let subClass = item.subClass.map(i => {
          let sortTwoSubClass = i
          delete sortTwoSubClass.subClass
          return sortTwoSubClass
        })
        item.subClass = subClass
        return item
      })
    },
    // 产品品牌
    async initProductBrandOption() {
      let res = await axios.get(`/getAllProductBrandManage/${this.currentInfo.brandId}`)
      this.productBrandOption = res.productBrandManageList || []
    },
    // 编辑产品
    toEditProduct(id) {
      this.setBrandProduct({
        [this.currentInfo.brandId]: id 
      })
      this.$router.push('/brand-inner/stock/stock-product-edit')
    },
    // 上、下架产品
    async toUnshelveProduct(rows, status) {
      if (rows.length) {
        let ids = rows.map(i => i.stockProductId)
        this.pageLoading = true
        let res = await axios.post('/batchUpperShelfStockProduct', {setBrandStockProductIds: ids, status: status})
        this.init()
      } else {
        this.$message.error('请至少选择一个产品')
      }
    },
    handleSelectionChange(arr) {
      this.currentCheckedRows = arr
    },
    // 批量上架
    multipleUpGoods() {
      if (this.currentCheckedRows.length) {
        this.toUnshelveProduct(this.currentCheckedRows, 0)
      } else {
        this.$message.error('需要至少一条数据才能操作')
      }
    },
    // 批量下架
    multipleDownGoods() {
      if (this.currentCheckedRows.length) {
        this.toUnshelveProduct(this.currentCheckedRows, 1)
      } else {
        this.$message.error('需要至少一条数据才能操作')
      }
    },
    // 产品详情
    todetailProduct(id) {
      window.open(`#/${this.currentEntry}-inner/stock/stock-product-detail/${Base64.encode(id)}`, "_blank")
    },
    // 删除产品 - 预备
    todelProduct(id) {
      this.currentOperateId = id
      this.delDialogVisible = true
    },
    // 删除产品 - 确认
    deleteProduct() {
      axios.get(`/deleteBrandStockProduct/${this.currentOperateId}`).then(res => {
        if (res.success) {
           this.delDialogVisible = false
          this.init()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 分类级联切换
    handleCascaderChange(arr) {
      this.handleCurrentChange(1)
    },
    handleSelectChange(brandId) {
      // 切换要清除已选的产品分类，并且重新请求分类数据
      this.productClassSelected = [];
      this.productClassOption = [];
      if (this.productClassSelected) {
        this.handleCurrentChange(1);
        !!brandId && this.initProductClassByChoosedBrand();
      }
    },
    searchData(key) {
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    handleToAddProd() {
      this.$router.push('/brand-inner/stock/stock-product-add')
    },
    // 根据id获取产品品牌名称
    getProName(id) {
      let name = ''
      this.productBrandOption.some(i => {
        if (i.productBrandId == id) {
          name = i.brandName
        }
      })
      return name
    },
    // 品牌端的部分按钮权限, 暂时没细分到门店端
    checkRolesAuthorityInPage(routerOrPath, type) {
      if (this.currentEntry === 'brand') {
        return this.checkHasBtnPermission(routerOrPath, type)
      }
      return true // 门店端暂时没做按钮权限
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    pargms() {
      switch (this.currentType) {
        case '2': 
          return {
            brandId: this.currentInfo.brandId,
            deleted: 1,
            status: 1,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            productBrandId: this.productBrandSelected,
            productLevelOne: this.productClassSelected && this.productClassSelected.length ? this.productClassSelected[0] : null,
            productLevelTwo: this.productClassSelected && this.productClassSelected.length ? this.productClassSelected[1] : null,
            searchWord: this.searchWord,
          }
        default: 
          return {
            brandId: this.currentInfo.brandId,
            deleted: 0,
            status: this.currentType * 1,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            productBrandId: this.productBrandSelected,
            productLevelOne: this.productClassSelected && this.productClassSelected.length ? this.productClassSelected[0] : null,
            productLevelTwo: this.productClassSelected && this.productClassSelected.length ? this.productClassSelected[1] : null,
            searchWord: this.searchWord,
          }  
      }
    },
    dataTypes() {
      if (this.currentEntry === 'brand') {
        return [
          {code: '0', value: '已上架'}, // status：0-上架，1-下架
          {code: '1', value: '已下架'}, // status：0-上架，1-下架
          {code: '2', value: '已删除'}, // 需要转成 deleted：0-正常, 1-删除
        ]
      } else {
        return [
          {code: '0', value: '总部上架产品'}, // status：0-上架，1-下架
        ]
      }
    },
  },
  watch: {
    currentType(v, o) {
      this.handleCurrentChange(1)
    },
  },
}
</script>
<style lang='scss' scoped>
.header-line {
  margin: 20px 23px 0 16px ;
  display: flex;
  justify-content: space-between;
  /deep/ .el-button {
    padding: 8px 18px;
  }
}
.filter-line {
  margin: 20px 20px 0;
  display: flex;
  height: 75px;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  background: #fff;
  .select-item {margin-right: 10px;}
  .left-part {
    display: flex;
    align-items: center;
  }
  .right-btns { margin-right: 20px; }
}
.table-main {
  margin: 20px;
  .table-box {
    padding: 0 10px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  }
  .psp li {
    // list-style: disc;
    // list-style-position: inside;
  }
  .psp li + li {
    border-top: 1px dotted #ddd;
  }
}
.page-line {
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .foot-btn {
    padding: 8px 18px;
  }
}

.table-title {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  &>div {
    display: flex;
  }
  .up {
    .left {
      .image {
        // width: 40px;
        // height: 40px;
        width: 64px;
        height: 64px;
        object-fit: cover;
        object-position: center center;
        cursor: pointer;
      }
    }
    .right {
      flex: 1;
      margin-left: 12px;
      align-items: center;
      // line-height: 40px;
      display: flex;
      flex-direction: column;
      // text-align: left;
      // justify-content: center;
      align-items: flex-start;
      .serial-no {
        color: #999;
      }
      .simple-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
  .down {

  }
}

</style>
