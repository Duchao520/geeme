<template>
  <div class="goods-sell-dialog">
    <el-dialog
      :title="`门店订货明细(${superParams.storeName})`"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="dialog-main" v-loading="loading">
        <div class="special-filter-line">
          <el-radio-group class="btn-group" v-model="lastDays" @change="handleDaysChanged">
            <el-radio-button :label="1">本周</el-radio-button>
            <el-radio-button :label="2">上周</el-radio-button>
            <el-radio-button :label="3">本月</el-radio-button>
            <el-radio-button :label="4">上月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            size="medium"
            style="margin-left:10px;"
            v-model="date"
            unlink-panels
            @change="handleDateChanged"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <el-table
          stripe
          :data="tableData"
          height="50vh"
        >
          <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
          <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
          <!-- <el-table-column label="规格名称" prop="specificationName"></el-table-column> -->
          <el-table-column label="订货单数" prop="invoiceNum"></el-table-column>
          <el-table-column label="订货数量" prop="approvalNum"></el-table-column>
          <el-table-column label="订货金额" prop="invoiceTotalMoney"></el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
import * as axios from '@/util/axios';
import { mapState, mapActions } from "vuex";
export default {
  props: {
    forDialog: {
      type: [Number, Array],
      required: true
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    superParams: {
      type: Object, // askStoreId ?
      required: true, 
    }
  },
  data() {
    return {
      loading: false,
      lastDays: null, //
      date: null, //
      pageNum: 1,
      pageSize: 10,

      total: 0,
      tableData: [],
    }
  },
  methods: {
    init() {
      this.loading = true
      let time = this.lastDays || this.date
      let o = this.emitTime(time)
      axios.post('/getStoreProductInvoiceStatistics', {
        ...o, 
        ...this.superParams,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        brandId: this.currentInfo.brandId,
      }).then(res => {
        this.tableData = res.listInvoiceStatisticsProduct || []
        this.total = res.total || 0
      }).then(() => {
        this.loading = false
      })
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    handleClose() {
      this.$emit('close')
    },
    // - 本地时间变化 -
    handleDateChanged(arr) {
      if (arr && arr.length) {
        this.lastDays = null
      } else {
        this.date = null
        this.lastDays = this.lastDays || 1
      }
      this.handleCurrentChange(1)
    },
    handleDaysChanged(n) {
      if (n) {
        this.date = null
        this.handleCurrentChange(1)
      }
    },
    // = 本地时间变化 =
    emitTime(something) {
      let obj = {}
      let now = new Date().format('yyyy-MM-dd hh:mm:ss')
      let day = new Date().getDay() // 0-6,  按周一(1)是第一天计算
      let date = new Date().getDate() // 1-31 
      let month = new Date().getMonth() + 1 // 1 - 12 
      let year = new Date().getFullYear()
      let start = ''
      let end = ''
      // 1本周 2上周 3本月 4上月
      switch(something) {
        case 1:
          start = day ? 
            new Date( +(new Date()) - ((day - 1) * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00' : 
            new Date( +(new Date()) - (6 * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00';
          obj = {
            endDay: now,
            startDay: start,
          }
          break
        case 2:
          start = day ? 
            new Date( +(new Date()) - ((day - 1 + 7 ) * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00' : 
            new Date( +(new Date()) - ((6 + 7) * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00';
          end = day ? 
            new Date( +(new Date()) - (day * 8.64e7) ).format('yyyy-MM-dd') + ' 23:59:59' : 
            new Date( +(new Date()) - (7 * 8.64e7) ).format('yyyy-MM-dd') + ' 23:59:59';
          obj = {
            endDay: end,
            startDay: start,
          }
          break  
        case 3:
          start = new Date().format('yyyy-MM') + '-01 00:00:00'
          obj = {
            endDay: now,
            startDay: start,
          }
          break 
        case 4:
          if (month === 1) {
            let lastYear = year - 1
            obj = {
              endDay: `${lastYear}-12-31 23:59:59`,
              startDay: `${lastYear}-12-01 00:00:00`,
            }
          } else {
            let lastMonth = `0${month - 1}`.slice(-2)
            let lastMonthLastDay = new Date( +(new Date()) - (date * 8.64e7) ).format('yyyy-MM-dd')
            start = `${year}-${lastMonth}-01 00:00:00` 
            end = lastMonthLastDay + ' 23:59:59'
            obj = {
              endDay: end,
              startDay: start,
            }
          }
          break   
        default:
          obj = {
            endDay: something[1],
            startDay: something[0],
          }   
      }
      return obj
    }
  },
  watch: {
    // 父组件时间变化
    forDialog: {
      handler: function (v, o) {
        if (Array.isArray(v)) {
          this.lastDays = null
          this.date = v
        } else {
          this.lastDays = v
          this.date = null
        }
        this.init()
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },  
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0px 20px;
}
.special-filter-line {
  // margin: 20px 20px 0;
  display: flex;
  height: 75px;
  align-items: center;
  padding-left: 20px;
  background: #fff;
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
</style>