<template>
  <div class="stock-require" v-loading="pageLoading">
    <div class="header-line" v-if="currentEntry === 'shop'">
      <div class="left-btns">
        <el-button class="normal_red_btn" @click="requireOrderDialogVisible = true">新增订货单</el-button>
      </div>
      <div class="right-btns">
        <input-search
          :placeholder="'搜索订货单号'"
          width="auto"
          v-model="searchKey"
          @search="searchData"
        />
      </div>
    </div>
    <div class="filter-line">
      <div class="left-part">
        <!-- 选择门店： -->
        <div class="select-item" v-if="currentEntry === 'brand'">
          <span class="lable-title">选择门店：</span>
          <el-select v-model="storeIdInBrand" @change="handleShopIdChanged">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="store in storeOptions" :key="store.storeId" :label="store.storeName" :value="store.storeId"></el-option>
          </el-select>
        </div>
        <!-- 出库时间 -->
        <div class="select-item">
          <span class="lable-title">出库时间: </span>
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
      <div class="right-btns">
        <input-search
          v-if="currentEntry === 'brand'"
          :placeholder="'搜索订货单号'"
          width="auto"
          v-model="searchKey"
          @search="searchData"
        />
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
            :height="currentEntry === 'brand' ? 'calc(100vh - 287px)' : 'calc(100vh - 248px - 95px)'"
          >
            <el-table-column label="订货单号" prop="productInvoiceNo"></el-table-column>
            <!-- 0-入库, 1-出库 -->
            <el-table-column label="出库单号" prop="outStockOrderNo">
              <template slot-scope="{row}">
                <span>{{row.outStockOrderNo}}</span>
                <br>
                <span v-if="!!row.outStockOrderNo" class="like-link" @click="handleGetIoDetail(1, row)">详情</span>
              </template>
            </el-table-column>
            <!-- 0-入库, 1-出库 -->
            <el-table-column label="入库单号" prop="inStockOrderNo">
              <template slot-scope="{row}">
                <span>{{row.inStockOrderNo}}</span>
                <br>
                <span v-if="!!row.inStockOrderNo" class="like-link" @click="handleGetIoDetail(0, row)">详情</span>
              </template>
            </el-table-column>
            <el-table-column label="订货时间" prop="askTime"></el-table-column>
            <el-table-column label="订货门店" prop="toStoreName"></el-table-column>
            <el-table-column label="订货摘要">
              <template slot-scope="{row}">
                {{computedOrderInfo(row)}}
              </template>
            </el-table-column>
            <el-table-column label="订货原因" prop="reason"></el-table-column>
            <el-table-column label="状态" prop="newOrderStatus">
              <template slot-scope="{row}">
                <span :class="[`tags order-status-${row.newOrderStatus} ${row.deleted ? 'deleted' : ''}`]">
                  <span v-if="row.deleted">已关闭</span>
                  <span v-else>{{row.newOrderStatus | orderStatusFilter}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="内部流程">
              <template slot-scope="{row}">
                <span>{{row.newOrderStatus | baseFilter}}</span>
                <br>
                <span>{{row.newOrderStatus | stepFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="审核人" prop="dealUserName"></el-table-column>
            <el-table-column label="审核备注" prop="remarks"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <!-- 品牌总部 -->
                <!-- <g-button
                  type="green"
                  :name="'审核订货单'"
                  @click="toAuthOrder(row)"
                  :icon="'icon_operate_edit'"
                  v-if="currentEntry === 'brand' && row.orderStatus === 1"
                ></g-button> -->
                <!-- 品牌总部 -->
                <!-- <g-button
                  type="mgreenFill"
                  :name="'创建出库单'"
                  @click="toOutOrder(row)"
                  :icon="'icon_operate_edit'"
                  v-if="currentEntry === 'brand' && row.orderStatus === 3 && !row.outStockOrderId"
                ></g-button> -->

                <!-- 门店 -->
                <!-- <g-button
                  :name="'创建入库单'"
                  type="mgreenFill"
                  v-if="currentEntry === 'shop' && row.orderStatus === 4 && !row.inStockOrderId"
                  :icon="'icon_operate_edit'"
                  @click="toInOrder(row)"
                ></g-button> -->

                <!-- 新版按钮 -->
                <g-button
                  :name="'详情'"
                  type="detail"
                  :icon="'icon_operate_eyes'"
                  @click="handleDetail(row)"
                ></g-button>
                
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
    <!-- 创建订货单 -->
    <createRequireGoodsDialog
      ref="enterRef" 
      v-if="requireOrderDialogVisible"
      :dialogVisible="requireOrderDialogVisible"
      @close="requireOrderDialogVisible = false"
      @createRequireOrder="handleCreateRequireOrder"
    />
    <!-- 审核订货单（总部） -->
    <signRequireOrderDialog 
      v-if="signDialogVisible"
      :detailInfo="currentSignRow"
      :dialogVisible="signDialogVisible"
      @close="signDialogVisible = false"
      @afterSignRequireOrder="handleSignOrder"
    />
    <!-- 创建出库单 (总部) -->
    <createRequireOutDialog
      :operateType="operateType"
      v-if="requireOutVisible"
      :detailInfo="currentSignRow"
      :dialogVisible="requireOutVisible"
      @close="requireOutVisible = false"
      @afterCreateOut="handleCreateOut"
    />
    <!-- 创建门店入库单 (门店) -->
    <createRequireInDialog
      :operateType="operateType"
      v-if="requireInVisible"
      :detailInfo="currentSignRow"
      :dialogVisible="requireInVisible"
      @close="requireInVisible = false"
      @afterCreateIn="handleCreateIn"
    />
    <!-- 订货单详情 旧版 -->
    <!-- <requireOrderDetailDialog
      v-if="orderDetailVisible"
      :detailInfo="currentSignRow"
      :dialogVisible="orderDetailVisible"
      @close="orderDetailVisible = false"
    /> -->

    <!-- 出货单（品牌总部）、入库单（门店）详情 -->
    <detailRequireOrderForIO
      v-if="IODetailVisible"
      :operateType="operateType"
      :detailInfo="IODetailInfo"
      :dialogVisible="IODetailVisible"
      @close="IODetailVisible = false"
    />

    <!-- 新版部分弹窗 -->

  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import '@/assets/css/tab.scss';
import { Base64 } from 'js-base64'
// import util from "@/util/base.js";
import createRequireGoodsDialog from './requireOrderComponents/createRequireGoodsDialog';

import signRequireOrderDialog from './components/signRequireOrderDialog';
import createRequireOutDialog from './components/createRequireOutDialog';
import createRequireInDialog from './components/createRequireInDialog';
import requireOrderDetailDialog from './components/requireOrderDetailDialog';
import detailRequireOrderForIO from './components/detailRequireOrderForIO';
export default {
  data() {
    return {
      utils,
      searchKey: '',
      pageLoading: false, 
      requireOrderDialogVisible: false, //  创建订货单对话框
      timeValue: [],

      currentType: '0',
      // 0-全部，1-待审核，2-待支付，3-待发货，4、待收货，5、完成 // 品牌门店通用
      dataTypes: [
        {code: '0', value: '全部'},
        {code: '1', value: '待审核'},
        {code: '2', value: '待付款/确认'},
        {code: '3', value: '待发货'},
        {code: '4', value: '待收货'},
        {code: '5', value: '已完成'},
        {code: '6', value: '已关闭'},
      ],
      tableData: [], // 
      pageNum: 1,
      pageSize: 10,
      total: 0,

      // 品牌审核单
      currentSignRow: {}, // 单详情[出入库单创建、详情通用]
      editable: false, // 新版详情用， 详情时全部子组件不可编辑
      signDialogVisible: false, // 审核对话框

      // 品牌 创建出库单
      requireOutVisible: false, // operateType 1
      operateType: 1, 
      // 门店入库
      requireInVisible: false, // operateType 0
      // 详情
      orderDetailVisible: false, // 

      storeOptions:[],  // 品牌下的门店列表
      storeIdInBrand: null, // 品牌下选择的门店

      // 出入库单详情相关
      IODetailVisible: false, // 出入库单详情弹窗 operateType 0-入库, 1-出库
      IODetailInfo: {}, // 出入库单数据
    }
  },
  created() {
    let today = new Date().format('yyyy-MM-dd') + ' 23:59:59'
    let month1stDay = new Date().format('yyyy-MM') + '-01 00:00:00'
    this.timeValue = [month1stDay, today]
    // 加载表格
    this.init()
    if(this.currentEntry === 'brand'){
      this.getStores()
    }
  },
  mounted() {
    this.$root.$on('needRefreshPage', data => {
      this.init()
    })
  },
  methods: {
    ...mapActions(['setProductInvoiceId']),
    // 获取门店列表
    getStores(){
      axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`).then(res => {
        this.storeOptions = res.storeBasicInfoList
      })
    },
    handleShopIdChanged(id) {
      this.init()
    },
    async init() {
      // 门店和品牌取不同的url
      let url = this.currentEntry === 'shop' ? '/getStoreProductInvoiceList' : '/getProductInvoiceList'
      this.pageLoading = true
      let res = await axios.post(url, this.pargms)
      this.tableData = res.listProductInvoiceInfo || []
      this.total = res.total
      this.pageLoading = false
    },
    searchData(key) {
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    // 新增订货单 - 执行
    async handleCreateRequireOrder(data) {
      let res = await axios.post('/createProductInvoice', data)
      if (res.success) {
        this.requireOrderDialogVisible = false
        this.currentType = '0'
        this.handleCurrentChange(1)
      } else {
        this.$message.error(res.message)
      }
    },
    // 详情及操作
    handleDetail(row) {
      // this.currentSignRow = row
      // this.editable = false // 详情时不可编辑
      // this.orderDetailVisible = true

      // 点击详情时，弹出新标签页，处理操作
      this.setProductInvoiceId(row.productInvoiceId)
      this.toPagesInNewTags(`${this.currentEntry}-inner/stock-order-details`)
    },
    // 品牌总部审核订货单
    toAuthOrder(row) {
      this.currentSignRow = row
      this.signDialogVisible = true
    },
    // 品牌审核订货单回调后
    handleSignOrder() {
      this.signDialogVisible = false
      this.init()
    },
    // 品牌 审核后 创建出库单
    toOutOrder(row) {
      this.operateType = 1
      this.currentSignRow = row
      this.requireOutVisible = true
    },
    // 品牌创建出库单回调后
    handleCreateOut() {
      this.requireOutVisible = false
      this.init()
    },
    // 门店创建入库单
    toInOrder(row) {
      this.operateType = 0
      this.currentSignRow = row
      this.requireInVisible = true
    },
    // 门店创建入库单回调后
    handleCreateIn() {
      this.requireInVisible = false
      this.init()
    },
    // 出入库单详情
    async handleGetIoDetail(type, row) {
      if (type) { // 1 出库
        if (!this.checkRolesAuthorityInPage('/brand-inner/stock/stock-enter', 'path')) return this.$message.error('没有查看权限');
      } else { // 0 入库
        if (!this.checkRolesAuthorityInPage('/brand-inner/stock/stock-out', 'path')) return this.$message.error('没有查看权限');
      }
      this.operateType = type
      this.pageLoading = true
      this.IODetailInfo = {}
      let res = await axios.post('/getProductStockOrderDetailInfo', {stockOrderId: type ? row.outStockOrderId : row.inStockOrderId})
      if (res.success) {
        this.IODetailInfo = res.stockOrderInfo
        this.pageLoading = false
        this.IODetailVisible = true
      } else {
        this.$message.error(`${type ? '出' : '入'}库单详情查询失败`)
        this.pageLoading = false
      }
    },
    // 动态计算各种状态各端的订货摘要
    computedOrderInfo(row) {
      if (row.listProductInvoiceSubInfo.length === 1) {
        return `${row.listProductInvoiceSubInfo[0].stockProductName} - ${row.listProductInvoiceSubInfo[0].specificationName} × ${row.listProductInvoiceSubInfo[0].askNum}${row.listProductInvoiceSubInfo[0].specificationUnit || ''}`
      } else {
        return `${row.listProductInvoiceSubInfo[0].stockProductName} - ${row.listProductInvoiceSubInfo[0].specificationName} × ${row.listProductInvoiceSubInfo[0].askNum}${row.listProductInvoiceSubInfo[0].specificationUnit || ''} 等`
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
      // 门店订货和品牌订货接口字段不一样
      let more = this.currentEntry === 'shop' ? { storeId: this.currentInfo.shopId } : { toStoreId: this.storeIdInBrand }
      return {
        // deleted: 0,
        tabType: Number(this.currentType) || null,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        productInvoiceNo: this.searchKey,
        brandId: this.currentInfo.brandId,
        endTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[1] : null, // 
        beginTime: Array.isArray(this.timeValue) && this.timeValue.length ? this.timeValue[0] : null, // 
        ...more,
      }  
    },
  },
  watch: {
    currentType(v, o) {
      this.handleCurrentChange(1)
    },
  },
  filters: {
    orderStatusFilter(type) {
      let map = {
        1: '待审核',

        2: '待确认', // 待确认 -- 注释为后端状态
        3: '待付款', // 待付款 -- 注释为后端状态

        4: '待发货', // 待财务审核 -- 注释为后端状态，须合并
        5: '待发货', // 待建出库单 -- 注释为后端状态，须合并
        6: '待发货', // 待出库审核 -- 注释为后端状态，须合并
        7: '待发货',

        8: '待收货', // 待建入库单 -- 注释为后端状态，须合并
        9: '待收货', // 待入库审核 -- 注释为后端状态，须合并
        10: '待收货', // 待最终确认 -- 注释为后端状态，须合并

        11: '已完成'
      }
      return map[type]
    },
    baseFilter(type) {
      switch (type) {
        case 1:
        case 4:
        case 5:
        case 6:
        case 7:
          return '总部'
        default: 
          return '门店'  
      }
    },
    stepFilter(type) {
      let map = {
        1: '销售审核',

        2: '门店确认',
        3: '门店付款',

        4: '财务审核',
        5: '创建出库单',
        6: '出库单备货',
        7: '物流发货',

        8: '创建入库单',
        9: '入库单清点',
        10: '确认收货',

        11: '订货完成'
      }
      return map[type]
    }
  },
  components: { 
    createRequireGoodsDialog, 
    signRequireOrderDialog, 
    createRequireOutDialog, 
    createRequireInDialog, 
    requireOrderDetailDialog, 
    detailRequireOrderForIO, 
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage")
  },
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
  // margin: 0 20px;
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

// /deep/ .btn.disabled {
//   cursor: not-allowed;
//   background: #7f7f7f;
//   border-color: #7f7f7f;
//   &:hover { color: #fff; background: #6e6e6e; border-color: #7f7f7f; }
//   &:active { color: #fff; background: #6e6e6e; border-color: #7f7f7f; }
// }

/*
  1-待审批，
  2-待确认，
  3-待支付，
  4-待财务审核，
  5、待建出库单，
  6、待出库审核，
  7、待发货, 
  8、待建入库单，
  9、待入库审核，
  10、待最终确认，
  11、已完成
*/
.tags {
  padding: 2px 7px;
  font-size: 12px;
  border-radius: 10px;
  color: #ffffff;
  background: #707070;
  &.order-status-1 {
    background: #58C9F3;
  }
  &.order-status-2, &.order-status-3 {
    background: #E22C37;
  }
  &.order-status-4, &.order-status-5, &.order-status-6, &.order-status-7, &.order-status-8, &.order-status-9, &.order-status-10 {
    background: #FCB322;
  }
  &.order-status-11 {
    background: #A9D86E;
  }
  &.deleted {
    background: #707070;
  }
}
.like-link {
  cursor: pointer;
  color: rgb(88, 201, 243);
}
</style>
