<template>
  <div class="stock-list" v-loading="pageLoading">
    <div class="filter-line">
      <div class="select-container">
        <!-- 品牌筛选 -->
        <div class="select-item">
          <span class="lable-title">品牌:</span>
          <el-select
            clearable
            size="medium"
            placeholder="选择品牌"
            v-model="productBrandSelected"
            @change="handleBrandChange"
          >
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="brand in productBrandOption"
              :label="brand.productBrandName"
              :value="brand.productBrandId"
              :key="brand.productBrandId"
            ></el-option>
          </el-select>
        </div>
        <!-- 产品分类 -->
        <div class="select-item" v-if="productBrandSelected">
          <span class="lable-title">产品分类:</span>
          <el-cascader
            clearable
            :options="productClassOption"
            v-model="productClassSelected"
            :props="cascaderProps"
            @change="handleCascaderChange"
          ></el-cascader>
        </div>
      </div>
      <div></div>
      <!-- 搜索 -->
      <input-search :placeholder="'搜索产品名称'" width="auto" v-model="searchWord" @search="searchData" />
    </div>
    <!-- 表格主体 -->
    <div class="table-main">
      <div class="user-defined-tab">
        <div class="table-box">
          <el-table
            :row-class-name="tableRowClassName"
            :data="tableData"
            height="calc(100vh - 259px)"
            :span-method="spanMethod"
          >
            <el-table-column label="产品编号" prop="serialNo"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="title" width="220"></el-table-column>
            <el-table-column label="产品品牌" prop="productBrandName"></el-table-column>
            <el-table-column label="产品类型" prop="productLevelTwoName"></el-table-column>
            <el-table-column
              label="规格"
              show-overflow-tooltip
              prop="serviceInfo.specificationName"
              class-name="custom_cell border_left span"
            ></el-table-column>
            <el-table-column label="单位" prop="serviceInfo.specificationUnit" class-name="custom_cell border_left span"></el-table-column>
            <!-- api库存量 => 录入库存 -->
            <el-table-column
              label="录入库存"
              prop="serviceInfo.stock"
              class-name="custom_cell border_left span"
            >
              <!-- <template slot="header" slot-scope="scope">
                录入库存
                <el-tooltip
                  class="item"
                  effect="dark"
                  content=""
                  placement="top"
                >
                  <i class="icon iconfont"></i>
                </el-tooltip>
              </template> -->
              <template slot-scope="{row}">{{row.serviceInfo.stock || 0}}</template>
            </el-table-column>
            <!-- api可用库存 => 真实库存 -->
            <el-table-column
              label="真实库存"
              prop="serviceInfo.validStock"
              class-name="custom_cell border_left span"
            >
              <template slot-scope="{row}">{{row.serviceInfo.validStock || 0}}</template>
            </el-table-column>
            <!-- 预购量 仅品牌 -->
            <el-table-column
              v-if="currentEntry === 'brand'"
              label="预购量"
              prop="serviceInfo.preBuy"
              class-name="custom_cell border_left span"
            ></el-table-column>
            <!-- 在途量 仅品牌 -->
            <el-table-column
              v-if="currentEntry === 'brand'"
              label="在途量"
              prop="serviceInfo.onWayStock"
              class-name="custom_cell border_left span"
            ></el-table-column>
            <!-- api:可调拨库存 仅品牌, 可用库存 -->
            <el-table-column
              v-if="currentEntry === 'brand'"
              label="可用库存"
              prop="serviceInfo.redeploymentStock"
              class-name="custom_cell border_left span"
            ></el-table-column>
            <!-- 进货价 -->
            <el-table-column label="进货价" class-name="custom_cell border_left span">
              <template slot-scope="{row}">
                <p>{{row.serviceInfo ? '￥' + row.serviceInfo.givePrice.toFixed(2) : ''}}</p>
              </template>
            </el-table-column>
            <!-- 建议零售价 -->
            <el-table-column label="建议零售价" class-name="custom_cell border_left span">
              <template slot-scope="{row}">
                <p>{{row.serviceInfo ? '￥' + row.serviceInfo.salesPrice.toFixed(2) : ''}}</p>
              </template>
            </el-table-column>
            <!-- 成本价 仅品牌 -->
            <el-table-column 
              label="成本价" 
              v-if="currentEntry === 'brand'"
              class-name="custom_cell border_left span"
            >
              <template slot-scope="{row}">
                <p>{{row.serviceInfo ? '￥' + row.serviceInfo.costPrice.toFixed(2) : ''}}</p>
                <!-- <p v-else>{{row.listProductSpecificationStockInfo ? '￥' + row.listProductSpecificationStockInfo[0].costPrice.toFixed(2) : ''}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="条形码" class-name="custom_cell border_left span">
              <template slot-scope="{row}">
                <p>
                  {{row.serviceInfo ? `${row.serviceInfo.recordBarcodeNum || 0}/${row.serviceInfo.barcodeNum || 0}` : ''}}
                  <span v-if="row.serviceInfo" class="like-link" @click="toBarCodeDetail(row)">详情</span>
                </p>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-line">
            <div></div>
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
    <spBarCodeDetailDialog
      v-if="barCodeDetailVisible"
      :dialogVisible="barCodeDetailVisible"
      @close="barCodeDetailVisible = false"
      :detail="currentRow"
    />
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapState, mapActions } from "vuex";
import "@/assets/css/tab.scss";
import { Base64 } from "js-base64";
import spBarCodeDetailDialog from './components/sp_BarCodeDetailDialog'
export default {
  data() {
    return {
      // 品牌id
      brandId: null,
      // 门店id
      storeId: null,
      // 加载标识
      pageLoading: false,
      // 品牌选中值
      productBrandSelected: '',
      // 品牌分类列表
      productBrandOption: [],
      // 产品品牌id
      productBrandId: null,
      // 产品分类选中值
      productClassSelected: null,
      // 分类组件的prop
      cascaderProps: {},
      // 产品分类列表数据
      productClassOption: [],
      // 产品分类一级id
      productLevelOne: null,
      // 产品分类二级id
      productLevelTwo: null,
      // 搜索关键字
      searchWord: "",
      // 表格主体数据
      tableData: [],
      // 分页配置数据
      pageNum: 0,
      pageSize: 20,
      total: null,
      // 仓库id
      warehouseId: null,

      // 当前查看的规格条码详情
      currentRow: {},
      barCodeDetailVisible: false, // 
    };
  },
  methods: {
    // 获取表格数据
    async getTableList() {
      // 每次请求的时候清空数据数组
      this.tableData = [];
      this.pageLoading = true;
      const res = await axios.post("/getProductStockInfoList", this.params);
      // 遍历数组，增加数据条数便于单元格的合并
      if (!res.listProductStockInfo) {
        this.tableData = []
      } else {
        this.tableData = this.setSpanProp(res.listProductStockInfo);
      }
      this.pageLoading = false;
      this.total = res.total;
    },
    // 设置表格合并属性
    setSpanProp(data) {
      const tableData = [];
      let isGrey = true;
      for (const a of data) {
        // 灰白交替的单元行背景色
        a.isGrey = isGrey;
        isGrey = !isGrey;
        if (a.listProductSpecificationStockInfo) {
          for (let i = 0; i < a.listProductSpecificationStockInfo.length; i++) {
            // 公共部分第一行占length行，其余为0行，防止表格数据溢出
            a.span = i === 0 ? a.listProductSpecificationStockInfo.length : 0;
            tableData.push({
              ...a,
              serviceInfo: a.listProductSpecificationStockInfo[i]
            });
          }
        } else {
          // 没有listProductSpecificationStockInfo数据的行至少独占一行
          a.span = 1;
          tableData.push(a);
        }
      }
      return tableData;
    },
    // 获取产品品牌
    async initProductBrandOption() {
      let res = await axios.post('/getStockProductBrandInfos', {brandId: this.brandId})
      this.productBrandOption = res.listStockProductBrandInfo || [];
    },
    // 根据所选的产品品牌，请求可用的产品分类数据  !!! 此处接口不能和品牌的库存产品内一样， 需要过滤未如果的产品 !!!
    // 根据所选的产品品牌，请求可用的产品分类数据  !!! 此处接口不能和品牌的库存产品内一样， 需要过滤未如果的产品 !!!
    // 根据所选的产品品牌，请求可用的产品分类数据  !!! 此处接口不能和品牌的库存产品内一样， 需要过滤未如果的产品 !!!
    async initProductClassByChoosedBrand() {
      let res = await axios.post('/getStockProductLevelTwoInfos', {
        productBrandId: this.productBrandSelected,
        brandId: this.currentInfo.brandId,
      })
      this.cascaderProps = { label: "levelName", value: "levelId", children: "listStockProductLevelTwoInfo" }; // 分类组件的prop
      this.productClassOption = res.listStockProductLevelInfo
    },
    // 切换品牌事件
    handleBrandChange(id) {
      // 切换要清除已选的产品分类，并且重新请求分类数据
      this.productClassSelected = [];
      this.productClassOption = [];
      if (this.productClassSelected) {
        this.handleCurrentChange(1);
        !!id && this.initProductClassByChoosedBrand();
      }
    },
    // 切换产品事件
    handleCascaderChange(idList) {
      this.handleCurrentChange(1);
    },
    // 搜索框事件
    searchData(key) {
      this.handleCurrentChange(1);
    },
    // 分页切换事件
    handleCurrentChange(index) {
      this.pageNum = index;
      this.getTableList();
    },
    // 表格给某行赋值class
    tableRowClassName({ row }) {
      return row.isGrey ? "grey-row" : "";
    },
    // 表格合并方法
    spanMethod({ row, column ,rowIndex ,columnIndex}) {
      switch (this.getSpanCount(column.className)) {
        case 0:
          return [row.span, 1];
        case 1:
          return [1, 1];
      }
    },
    getSpanCount(columnClassName) {
      if (!columnClassName) return 0;
      if (columnClassName.split(" ").includes("span")) {
        return 1;
      } else {
        return 0;
      }
    },
    toBarCodeDetail(row) {
      this.currentRow = row
      this.barCodeDetailVisible = true
    },
    // 品牌端的部分按钮权限, 暂时没细分到门店端
    checkRolesAuthorityInPage(routerOrPath, type='flag') {
      if (this.currentEntry === 'brand') {
        return this.checkHasBtnPermission(routerOrPath, type)
      }
      return true // 门店端暂时没做按钮权限
    },
  },
  mounted() {
    // 赋值品牌和门店Id
    this.brandId = this.currentInfo.brandId;
    this.storeId = this.currentInfo.shopId;
    // 加载品牌数据
    this.initProductBrandOption();
    // 获取表格数据
    this.getTableList();
  },
  computed: {
    // vuex映射
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 请求表格数据的参数
    params() {
      return {
        brandId: this.brandId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        productBrandId: this.productBrandSelected,
        productLevelOne:
          this.productClassSelected && this.productClassSelected.length
            ? this.productClassSelected[0]
            : null,
        productLevelTwo:
          this.productClassSelected && this.productClassSelected.length
            ? this.productClassSelected[1]
            : null,
        searchWord: this.searchWord,
        storeId: this.currentEntry === "brand" ? null : this.storeId,
        warehouseId: this.warehouseId
      };
    },
    // 成本价
    costPrice() {
      if (this.currentEntry === "brand") {
        return;
      }
    }
  },
  components: { spBarCodeDetailDialog },
};
</script>
<style lang='scss' scoped>
.filter-line {
  margin: 23px 20px 16px;
  display: flex;
  justify-content: space-between;
  height: 75px;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  .select-container {
    display: flex;
    align-items: center;
    .select-item {
      margin-right: 10px;
    }
  }
}
.table-main {
  margin: 20px;
  .table-box {
    padding: 0 10px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);

    /deep/ .grey-row {
      background-color: #FAFAFA;
    }

    /deep/ .custom_cell:not(.is-leaf) {
      &.border_left {
        border-left: 1px solid #ececec;
      }
      &.border_right {
        border-right: 1px solid #ececec;
      }
    }

    /deep/ .el-table__body tr:hover > td {
      background-color: transparent;
    }
  }
  .psp li {
    list-style: disc;
    list-style-position: inside;
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
  .left {
    .image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      object-position: center center;
      cursor: pointer;
    }
  }
  .right {
    margin-left: 12px;
  }
}

.like-link {
  cursor: pointer;
  color: rgb(88, 201, 243);
}
</style>
