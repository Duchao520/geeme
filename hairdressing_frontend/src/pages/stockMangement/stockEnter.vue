<template>
  <div class="stock-enter" v-loading="pageLoading">
    <div class="header-line">
      <div class="left-btns">
        <el-button 
          v-if="checkRolesAuthorityInPage('brand_stock_in_create')"
          class="normal_red_btn" 
          @click="handleToEnter"
        >
          新增入库
        </el-button>
      </div>
      <div class="right-btns">
        <input-search
          :placeholder="'搜索入库单号'"
          width="auto"
          v-model="searchKey"
          @search="searchData"
        />
      </div>
    </div>
    <div class="filter-line">
      <!-- 入库类型 -->
      <div class="select-item">
        <span class="lable-title">入库类型: </span>
        <el-select
          clearable
          size="medium"
          placeholder="选择入库类型" 
          v-model="storageType"
          @change="handleStorageTypeChanged"
        >
          <el-option 
            v-for="i in storageTypeOptions" 
            :key="i.value" 
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 入库时间 -->
      <div class="select-item">
        <span class="lable-title">入库时间: </span>
        <el-date-picker
          size="medium"
          unlink-panels
          v-model="timeValue"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTimeArea"
        ></el-date-picker>
      </div>
    </div>
    <div class="table-main">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentType">
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
            height="calc(100vh - 342px)"
          >
            <el-table-column label="入库单号" prop="stockOrderNo"></el-table-column>
            <el-table-column label="入库时间" prop="storageTime"></el-table-column>
            <el-table-column label="入库类型" prop="storageType">
              <template slot-scope="{row}">{{row.storageType | storageTypeFilter}}</template>
            </el-table-column>
            <!-- <el-table-column label="入库单金额" prop="listStockSubOrder"></el-table-column> -->
            <el-table-column label="入库摘要">
              <template slot-scope="{row}">
                {{
                  row.listStockSubOrder.length === 1 ? 
                  `${row.listStockSubOrder[0].stockProductName} - ${ row.listStockSubOrder[0].specificationName } × ${row.listStockSubOrder[0].signNum || row.listStockSubOrder[0].num}${row.listStockSubOrder[0].specificationUnit || ''}` 
                  : `${row.listStockSubOrder[0].stockProductName} - ${ row.listStockSubOrder[0].specificationName } × ${row.listStockSubOrder[0].signNum || row.listStockSubOrder[0].num}${row.listStockSubOrder[0].specificationUnit || ''} 等` 
                }}
              </template>
            </el-table-column>
            <el-table-column label="经办人" prop="dealUserName"></el-table-column>
            <el-table-column label="制单人" prop="recordUserName"></el-table-column>
            <el-table-column label="状态" prop="orderStatus">
              <template slot-scope="{row}">{{ row.deleted ? '已删除' : row.orderStatus ? '已完成' : '待审核' }}</template>
            </el-table-column>
            <el-table-column label="备注" prop="remarks">
              <template slot-scope="{row}">
                <p>{{row.remarks}}</p>
                <!-- 展开? 编辑? -->
              </template>
            </el-table-column>
            <!-- <el-table-column label="条形码" prop=""></el-table-column> -->
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <!-- 改版后的订货入库 不能在此有操作按钮, 除非后端再给出字段 -->
                <div v-if="row.storageType !== 2">
                  <!-- 详情按钮或者审核  -->
                  <g-button
                    type="detail"
                    @click="todetailOrder(row)"
                    v-if="row.deleted || row.orderStatus ? true : checkRolesAuthorityInPage('brand_stock_in_audit')"
                    :name="`${row.deleted ? '明细' : row.orderStatus ? '明细' : '审核'}`"
                    :icon="`${row.deleted ? 'icon_operate_eyes' : row.orderStatus ? 'icon_operate_eyes' : 'icon_operate_edit'}`"
                  ></g-button>
                  <!-- 仅待审核可以删除 -->
                  <g-button
                    v-if="!row.deleted && !row.orderStatus && checkRolesAuthorityInPage('brand_stock_in_delete')"
                    :name="'删除'"
                    type="orange"
                    :icon="'icon_operate_disable'"
                    @click="todelOrder(row)"
                  ></g-button>
                </div>
                <!-- 改版后的订货入库 - 最多仅详情（需重构组件 暂时不提供） -->
                <div v-else>
                  -
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-line">
            <div>
              
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
      @resolve="deleteEnterOrder"
      @close="delDialogVisible=false"
    >
      <div class="warning-color">删除后，该入库单无法恢复!</div>
    </g-dialog-with-slot>
    <!-- 创建入库单 -->
    <enterGoods
      ref="enterRef" 
      v-if="goodsDialogVisible"
      :dialogVisible="goodsDialogVisible"
      @close="goodsDialogVisible = false"
      @createEnterOrder="handleCreateEnterOrder"
      :superInfo="orderInfo"
    />
    <!-- 出入库明细详情 -->
    <enterOrderDialog
      v-if="detailDialog"
      :dialogVisible="detailDialog"
      @close="detailDialog = false"
      @afterSign="hangleAfterSign"
      :detail="detailInfo"
      :superInfo="orderInfo"
    />
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import '@/assets/css/tab.scss';
import { Base64 } from 'js-base64'
// import util from "@/util/base.js";
import enterGoods from './components/enterProductDialog';
import enterOrderDialog from './components/enterOrderDialog'
export default {
  data() {
    return {
      utils,
      searchKey: '',
      pageLoading: false, 
      delDialogVisible: false, 
      goodsDialogVisible: false, //  入库对话框
      timeValue: [], 

      currentType: '999',
      dataTypes: [
        {code: '999', value: '全部'},
        {code: '0', value: '未审核'}, // orderStatus
        {code: '1', value: '已完成'}, // orderStatus
        {code: '2', value: '已删除'}, // 需要转成 deleted：0-正常, 1-删除
      ],
      tableData: [], // 
      storageType: null, // 出入库类型类型 选择器的值
      pageNum: 1,
      pageSize: 10,
      total: 0,

      detailInfo: {}, // 出入库单明细。 自己从表格行内取, 无接口
      detailDialog: false, // 出入库单明细弹窗
      orderInfo: {}, // 给出入单详情的部分字段， 主要标记tag激活及路由
    }
  },
  created() {
    let today = new Date().format('yyyy-MM-dd') + ' 23:59:59'
    let month1stDay = new Date().format('yyyy-MM') + '-01 00:00:00'
    this.timeValue = [month1stDay, today]
    // 加载表格
    this.init()
  },
  methods: {
    ...mapActions(['setBrandProduct']),
    async init() {
      this.pageLoading = true
      let res = await axios.post('/getProductStockOrderList', this.pargms)
      this.tableData = res.listStockOrderInfo || []
      this.total = res.total
      this.pageLoading = false
    },
    // 入库单明细 - 根据 currentType 自己取当前的标签状态、再对弹窗作相应的功能限制
    todetailOrder(row) {
      let status = row.deleted ? '2' : row.orderStatus === 0 ? '0' : '1' // 按原先的无全部时 currentType 字段计算
      this.setSuberInfo(status)
      this.detailInfo = row
      this.detailDialog = true
    },
    setSuberInfo(status) {
      this.orderInfo = {
        status: status,
        routeType: this.$route.path.indexOf('enter') > 0 ? '入' : '出', // 需求不明确, 出入库可能可以通用这个组件
      }
    },
    // 入库类型切换
    handleStorageTypeChanged() {
      this.handleCurrentChange(1)
    },
   
    // 审核1
    // toAuthOrder(row) {
    // },

    // 审核2 - 子组件
    hangleAfterSign() {
      this.detailDialog = false
      this.init()
    },

    // 删除入库单 - 预备
    todelOrder(row) {
      this.currentOperateId = row.stockOrderId
      this.delDialogVisible = true
    },
    // 删除入库单 - 确认
    deleteEnterOrder() {
      axios.post(`/deleteProductStockInOrder`, {stockOrderId: this.currentOperateId}).then(res => {
        if (res.success) {
           this.delDialogVisible = false
          this.init()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    searchData(key) {
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    // 新增入库 - 准备
    handleToEnter() {
      this.setSuberInfo()
      this.goodsDialogVisible = true
    },
    // 新增入库 - 执行
    async handleCreateEnterOrder(data) {
      let res = await axios.post('/createProductStockInOrder', data)
      if (res.success) {
        this.goodsDialogVisible = false
        this.currentType = '999'
        this.handleCurrentChange(1)
      } else {
        this.$message.error(res.message)
      }
    },
    // 日期切换
    changeTimeArea(arr) {
      this.handleCurrentChange(1)
    },
    // 品牌端的部分按钮权限, 暂时没细分到门店端
    checkRolesAuthorityInPage(routerOrPath, type='flag') {
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
        case '999': 
          return {
            deleted: null,
            operateType: 0, // 入库
            orderStatus: null,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchKey: this.searchKey,
            storageType: this.storageType,
            brandId: this.currentInfo.brandId,
            storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null,
            endTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[1] : null, // 
            beginTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[0] : null, // 
          }
        case '2': 
          return {
            deleted: 1,
            operateType: 0, // 入库
            orderStatus: 0,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchKey: this.searchKey,
            storageType: this.storageType,
            brandId: this.currentInfo.brandId,
            storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null,
            endTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[1] : null, // 
            beginTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[0] : null, // 
          }
        default: 
          return {
            deleted: 0,
            operateType: 0, // 入库
            orderStatus: this.currentType * 1,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchKey: this.searchKey,
            storageType: this.storageType,
            brandId: this.currentInfo.brandId,
            storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null,
            endTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[1] : null, // 
            beginTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[0] : null, // 
          }  
      }
    },
    // 门店与品牌端的不同选项
    storageTypeOptions() {
      if (this.currentEntry === 'brand') {
        return [
          {
            value: 1, // 仅品牌
            label: '采购入库' // 仅品牌 
          },
          // {
          //   value: 3, // 暂无
          //   label: '调拨入库' // 暂无
          // },
          // {
          //   value: 4, // 销售退货- 品牌暂无
          //   label: '销售退货' // 销售退货- 品牌暂无
          // },
          {
            value: 5,
            label: '盘盈入库'
          },
          {
            value: 6,
            label: '初始入库'
          },
          {
            value: 7,
            label: '赠送入库'
          },
          {
            value: 9,
            label: '订货退回'
          },
          {
            value: 8,
            label: '其他入库'
          },
        ]
      } else {
        return [
        {
          value: 2, // 仅门店端有
          label: '订货入库' // 仅门店端有
        },
        // {
        //   value: 3, // 暂无
        //   label: '调拨入库' // 暂无
        // },
        {
          value: 4, // 销售退货
          label: '销售退货' // 销售退货
        },
        {
          value: 5,
          label: '盘盈入库'
        },
        {
          value: 6,
          label: '初始入库'
        },
        {
          value: 7,
          label: '赠送入库'
        },
        {
          value: 8,
          label: '其他入库'
        },
      ]
      }
    }
  },
  watch: {
    currentType(v, o) {
      this.handleCurrentChange(1)
    },
  },
  filters: {
    storageTypeFilter(storageType) {
      let map = {
        1: '采购入库',
        2: '订货入库',
        3: '调拨入库',
        4: '销售退货',
        5: '盘盈入库',
        6: '初始入库',
        7: '赠送入库',
        8: '其他入库',
        9: '订货退回', // 品牌入库
      }
      return map[storageType]
    },
  },
  components: { enterGoods, enterOrderDialog }
}
</script>
<style lang='scss' scoped>
.header-line {
  margin: 23px 20px 16px;
  display: flex;
  justify-content: space-between;
  /deep/ .el-button {
    padding: 8px 18px;
  }
}
.filter-line {
  margin: 0 20px;
  display: flex;
  height: 75px;
  align-items: center;
  padding-left: 20px;
  background: #fff;
  .select-item {margin-right: 10px;}
}
.table-main {
  margin: 20px;
  .table-box {
    padding: 0 10px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
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

</style>
