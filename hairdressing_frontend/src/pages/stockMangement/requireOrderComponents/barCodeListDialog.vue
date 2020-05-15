<template>
  <div v-loading.fullscreen="submitLoading">
    <el-dialog
      :width="editable && detail.editable ? '1200px' : '900px'"
      :title="`条码明细`"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="dialog-main">
        <div class="left-box">
          <div class="order-detail-item">
            <div class="detail-line">
              <div class="detail-info">
                <div class="detail-title">
                  {{`${detail.operateType ? '出' : '入'}库单号:`}} 
                </div>
                <div class="detail-content">
                  {{detail.stockOrderNo}}
                </div>
              </div>
              <div class="detail-info">
                <div class="detail-title">
                  {{`${detail.operateType ? '出' : '入'}库时间:`}}
                </div>
                <div class="detail-content">
                  {{detail.storageTime}}
                </div>
              </div>
              <div class="detail-info">
                <div class="detail-title">
                  {{`${detail.operateType ? '出' : '入'}库类型:`}}
                </div>
                <div class="detail-content">
                  {{detail.storageType|storageTypeFilter}}
                </div>
              </div>
            </div>
          </div>
          <el-table :data="prodTableData">
            <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
            <el-table-column label="规格名称" prop="specificationName"></el-table-column>
            <el-table-column label="条形码">
              <template slot-scope="{row}">
                <span :class="{unfinsh: row.recordNum !== row.num}">{{row.recordNum}}</span><span> / {{row.num}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="search-line">
            <input-search :emitOnInput="false" :placeholder="'搜索条形码'" width="auto" v-model="searchKey" @search="searchData"/>
          </div>
          <el-table
            :data="tableData"
            :height="tableData.length > 10 ? '600px' : ''"
          >
            <el-table-column label="条形码编号" prop="barcode"></el-table-column>
            <el-table-column label="录入时间" prop="recordTime"></el-table-column>
            <el-table-column label="操作" v-if="detail.editable">
              <template slot-scope="{row}">
                <g-button
                  :name="'编辑'"
                  type="green"
                  :icon="'icon_operate_edit'"
                  @click="toEdit(row)"
                ></g-button>
                <g-button
                  :name="'删除'"
                  type="orange"
                  :icon="'icon_operate_disable'"
                  @click="toDel(row)"
                ></g-button>
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
        <div class="right-box" v-if="editable && detail.editable">
          <scanInput ref="scanBox" :detail="detail" @init="init"/>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑条码 -->
    <editBarCodeDialog
      v-if="editDialogVisible"
      :dialogVisible="editDialogVisible"
      @close="editDialogVisible = false"
      :detail="currentEidtRow"
      @init="handleEditSuccess"
    />
  </div>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import scanInput from './scanInput'
import editBarCodeDialog from './editBarCodeDialog'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      prodTableData: [],
      editable: true,
      submitLoading: false,

      searchKey: '',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,

      // 编辑
      currentEidtRow: {},
      editDialogVisible: false,
    }
  },
  created() {
    this.prodTableData = [{...this.detail}]
    this.editable = this.detail.editable
    this.init()
  },
  mounted() {
    // this.initInput()
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    init() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.searchKey,
        stockSubOrderId: this.detail.stockSubOrderId,
      }
      this.submitLoading = true
      axios.post('/getProductStockOrderBarcodeList', params).then(res => {
        if (res.success) {
          this.total = res.total
          this.prodTableData[0].recordNum = res.total // 覆盖已有条码数
          this.tableData = res.listStockOrderDetail || []
          this.submitLoading = false
          this.editable = res.total !== this.detail.num // 校验是否可输入。 条码数量满了的时候不再允许输入
          this.editable && this.$refs.scanBox && this.$refs.scanBox.focusInput()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    searchData() {
      this.handleCurrentChange(1)
    },
    // 分页切换事件
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    toEdit(row) {
      this.currentEidtRow = row
      this.editDialogVisible = true
    },
    handleEditSuccess() {
      this.editDialogVisible = false
      this.init()
    },
    async toDel(row) {
      let res = await axios.post('/deleteProductStockBarcode', {stockOrderDetailId: row.stockOrderDetailId})
      if (res.success) {
        this.$message.success('删除成功')
        this.init()
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  filters: {
    storageTypeFilter(type) {
      let map = {
        1: '采购入库',
        2: '订货入库',
        3: '调拨入库',
        4: '退货入库',
        5: '盘盈入库',
        11: '退采购出库',
        12: '订货出库',
        13: '调拨出库',
        14: '销售出库',
        15: '盘亏出库'
      }
      return map[type]
    },
    statusFilter(status) {
      let map = {
        '0': '待审核',
        '1': '已审核',
        '2': '已删除',
      }
      return map[status]
    },
  },
  components: { scanInput, editBarCodeDialog }
}
</script>
<style lang='scss' scoped>
.detail-line, .remark-line {
  display: flex;
  margin-top: 12px;
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
.unfinsh {
  color: red;
}
.dialog-main {
  display: flex;
  .right-box {
    width: 280px;
    height: inherit;
    margin-left: 20px;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  }
  .left-box {
    flex: 1;
  }
}
.search-line {
  height: 50px;
  display: flex;
  align-items: center;
}
</style>
