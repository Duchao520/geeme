<template>
  <div class="coupon-history" v-loading="loading">
    <div class="filter-line">
      <div class="filter-item">
        <span class="lable-title">派发时间: </span>
        <el-date-picker
          class="date-picker"
          v-model="date"
          :type="'datetimerange'"
          range-separator="至"
          :clearable='false'
          unlink-panels
          :start-placeholder="'开始时间'"
          :end-placeholder="'截止时间'"
          @change="handleDateRangeChanged"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00','23:59:59']"
        ></el-date-picker>
          <!-- :picker-options="pickerOption" -->
      </div>
    </div>

    <div class="main-table">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="sendRecordStatus">
          <el-tab-pane
            v-for="item in sendRecords"
            :key="item.value"
            :name="item.value"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <el-table 
        stripe
        :data="tableData" 
        height="calc(100vh - 347px)" 
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="优惠券名称" prop="couponTemplateSnapshot.couponName"></el-table-column>
        <el-table-column label="金额" prop="couponTemplateSnapshot.money"></el-table-column>
        <el-table-column label="派发时间" prop="sendTime" width="100"></el-table-column>
        <el-table-column label="生效期限" width="160">
          <template slot-scope='{row}'>
            <div v-if="row.validDateType === 'APPOINT_DATE'">
              <p>{{row.appointDateFrom}}</p>
              <p style="text-align: center;">至</p> 
              <p>{{row.appointDateTo}}</p> 
            </div>
            <p v-else>
              领取后{{row.validDays}}天内有效 
            </p>
          </template>
        </el-table-column>
        <el-table-column label="可用服务" show-overflow-tooltip>
          <template slot-scope='{row}'>
            <p v-if="row.couponTemplateSnapshot.allServicePromote">全部服务</p>
            <p v-else>{{row.couponTemplateSnapshot.serviceLevelTwoNameList.join(',')}}</p>
          </template>
        </el-table-column>
        <el-table-column label="可用产品" show-overflow-tooltip>
          <template slot-scope='{row}'>
            <p v-if="row.couponTemplateSnapshot.allProductPromote">全部产品</p>
            <p v-else>{{row.couponTemplateSnapshot.productLevelTwoNameList.join(',')}}</p>
          </template>
        </el-table-column>
        <el-table-column label="领取/使用数量">
          <template slot-scope='{row}'>
            {{row.takeNum || 0}}/{{row.useNum || 0}}
          </template>  
        </el-table-column>
        <el-table-column label="消费金额" prop="costAmount"></el-table-column>
        <el-table-column label="抵扣金额" prop="offsetAmount"></el-table-column>
        <el-table-column label="实收金额" prop="receiveAmount"></el-table-column>
        <el-table-column label="启用" prop="active">
          <template slot-scope='{row}'>
            <el-switch
              v-model="row.active"
              :disabled="!row.active"
              active-color="#13ce66"
              inactive-color="#D5DADF"
              @change="disabledCoupons([row.id])"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='{row}'>
            <g-button
              :name="'明细'"
              :type="'green'"
              :icon="'icon_operate_eyes'"
              @click="lookDetail(row)"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-line">
        <g-button
          :name="'批量停用'"
          :type="'orangeFill'"
          :icon="'icon_operate_disable'"
          @click="multipleDisabledCoupons"
        ></g-button>
        <el-pagination
          style="margin: 5px 0px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情 -->
    <el-dialog 
      width="800"
      title="优惠券详情"
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="110px">
        <el-form-item label="优惠券名称:">
          <p>{{form.couponTemplateSnapshot.couponName}}</p>
        </el-form-item>
        <el-form-item label="优惠券金额:">
          <p>{{form.couponTemplateSnapshot.money}}</p>
        </el-form-item>
        <el-form-item label="使用门槛:">
          <p>{{form.couponTemplateSnapshot.useUnLimited ? '无门槛' : `满${form.couponTemplateSnapshot.purchaseAboveMoney}可用`}}</p>
        </el-form-item>
        <el-form-item label="派发时间:">
          <p>{{form.sendTime}}</p>
        </el-form-item>
        <el-form-item label="生效日期:">
          <p v-if="form.validDateType === 'APPOINT_DATE'">{{form.appointDateFrom}} 至 {{form.appointDateTo}}</p>
          <p v-else>领取后{{form.validDays}}天内有效 </p>
        </el-form-item>
        <el-form-item label="派发数量:">
          <p>{{form.sendAmount}}</p>
        </el-form-item>
        <el-form-item label="每人限领:">
          <p v-if="form.isLimitPerMan">{{form.limitPerManNum}}张</p>
          <p v-else>不限量</p>
        </el-form-item>
        <el-form-item label="适用商品:">
          <p v-if="form.couponTemplateSnapshot.allServicePromote">全部服务</p>
          <el-table :data="form.couponTemplateSnapshot.serviceList" v-if="form.couponTemplateSnapshot.serviceList.length" :height="serviceTableHeight">
            <el-table-column label="一级分类" show-overflow-tooltip prop="levelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="levelTwoName"></el-table-column>
            <el-table-column label="服务名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
          </el-table>
          <p v-if="form.couponTemplateSnapshot.allProductPromote">全部产品</p>
          <el-table :data="form.couponTemplateSnapshot.productList" v-if="form.couponTemplateSnapshot.productList.length" :height="productTableHeight">
            <el-table-column label="一级分类" show-overflow-tooltip prop="levelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="levelTwoName"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/tab.scss'
import {mapState} from 'vuex'
import * as axios from '@/util/axios'
export default {
  props: {
    name: {
      type: String,
    }
  },
  data() {
    return {
      date: null,
      loading: false, // 
      visible: false, // 

      sendRecordStatus: 'all', // 前端自定义
      sendRecords: [
        {
          value: 'all', // 前端自定义
          label: '全部'
        },
        {
          value: 'WAIT_SEND',
          label: '待发送'
        },
        {
          value: 'SENT',
          label: '已发送'
        },
        {
          value: 'FINISHED',
          label: '已结束'
        },
      ],
      form: {}, // - 详情信息
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [], // 
      selectedIds: [], // 选中的批量id
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      let data = {
        couponName: this.name || null,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchTimeFrom: this.date ? this.date[0] : null,
        searchTimeTo: this.date ? this.date[1] : null,
        sendRecordStatus: this.sendRecordStatus !== 'all' ? this.sendRecordStatus : null,
        storeId: this.currentInfo.shopId,
      }
      let res = await axios.post('/getSendGoodsCouponList', data)
      this.tableData = res.couponSendRecordList || []
      this.total = res.total || 0
      this.loading = false
    },
    handleDateRangeChanged(date) {
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    // 详情UI暂时没有,接口既是本行内容,调用与否看需求
    lookDetail(row) {
      this.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 禁用 单个/批量
    handleSelectionChange(arr) {
      this.selectedIds = arr.map(i => i.id)
    },
    // 批量
    multipleDisabledCoupons() {
      this.disabledCoupons(this.selectedIds)
    },
    // 实现
    disabledCoupons(arr) {
      if (arr.length) {
        axios.post('/sendGoodsCouponActiveAndStop', {
          active: false,
          sendRecordIds: arr
        }).then(res => {
          if (res.success) {
            this.$message.success('操作成功')
            this.init()
          } else {
            this.$message.error('操作失败')
          }
        })
      } else {
        this.$message.error('请至少选择一个启用中的优惠券')
      }
    },
    
  },
  watch: {
    currentType: {
      handler: function(v, o) {
        this.handleCurrentChange(1)
      },
    },
    name: {
      handler: function(v, o) {
        this.handleCurrentChange(1)
      },
    },
    sendRecordStatus: {
      handler: function(v, o) {
        this.handleCurrentChange(1)
      },
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
    // 动态计算商品表格高度, 如果文字太多而换行可能存在样式问题
    serviceTableHeight() {
      if (this.form.couponTemplateSnapshot.serviceList.length > 4) {
        return 49 * 5 + 65 + 'px'
      } else {
        return 49 * this.form.couponTemplateSnapshot.serviceList.length + 65 + 'px'
      }
    },
    productTableHeight() {
      if (this.form.couponTemplateSnapshot.productList.length > 4) {
        return 49 * 5 + 65 + 'px'
      } else {
        return 49 * this.form.couponTemplateSnapshot.productList.length + 65 + 'px'
      }
    },
  }
}
</script>
<style lang='scss' scoped>
.coupon-history {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  .filter-line {
    height: 75px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    align-items: center;
    .filter-item {
      margin-left: 12px;
    }
  }
  .main-table {
    padding: 0 10px;
    background: #fff;
  }
  .pagination-line {
    padding: 0 10px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
/deep/ .el-dialog__body {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
