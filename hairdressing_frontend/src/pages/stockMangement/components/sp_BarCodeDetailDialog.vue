<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="900px"
      title="条码明细"
      :visible="dialogVisible"
      :before-close="handleClose"
    >
      <div class="detail-main">
        <div class="detail-line">
          <div class="left">
            <div class="detail-info">
              <div class="detail-title">
                产品名称
              </div>
              <div class="detail-content">
                {{detail.simpleTitle}}
              </div>
            </div>
            <div class="detail-info">
              <div class="detail-title">
                规格名称
              </div>
              <div class="detail-content">
                {{detail.serviceInfo.specificationName}}
              </div>
            </div>
          </div>
          <div>
            <input-search :placeholder="'搜索条形码'" width="auto" v-model="searchKey" @search="searchData"/>
          </div>
        </div>
        <div class="table-main">
          <el-table
            :data="tableData"
            :height="tableData.length > 10 ? '770px' : ''"
          >
            <el-table-column label="条形码编号" prop="barcode"></el-table-column>
            <el-table-column label="录入时间" prop="recordTime"></el-table-column>
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
    </el-dialog>
  </div>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      submitLoading: false,
      searchKey: '',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.searchKey,
        brandId: this.currentInfo.brandId,
        storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null,
        stockProductSpecificationId: this.detail.serviceInfo.stockProductSpecificationId,
      }
      this.submitLoading = true
      axios.post('/getProductStockBarcodeList', params).then(res => {
        if (res.success) {
          this.total = res.total
          this.tableData = res.listStockDetail || []
          this.submitLoading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleClose() {
      this.$emit('close')
    },
    searchData() {
      this.handleCurrentChange(1)
    },
    // 分页切换事件
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
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
/deep/ .el-dialog__body {
  padding: 0 20px 30px;
}
.detail-line {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  .left {
    display: flex;
  }
  .detail-info {
    display: flex;
    align-items: center;
    .detail-title {
      font-size: 14px;
      color: #333;
    }
    .detail-content {
      color: #999;
      margin-left: 6px;
    }
    & + .detail-info {
      margin-left: 12px;
    }
  }
  .plain_blue_btn {
    padding: 8px 14px;
  }
}
</style>
