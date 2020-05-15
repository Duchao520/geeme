<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="900px"
      title="出库单备货"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form" 
        :model="form" 
        label-width="100px"
      >
        <el-row type="flex">
          <el-col>
            <el-form-item label="出库类型:">
              订货出库
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订货单号:">
              {{form.productInvoiceNo}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订货门店:">
              {{detail.toStoreName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="出库时间:">
              {{form.storageTime}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="出库单号:">
              {{form.stockOrderNo}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="经办人:">
              {{form.dealUserName}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 备货时间、备货人字段由后端生成 -->
        <!-- 备货产品列表  -->
        <el-form-item label-width="40px">
          <el-table :data="form.listStockSubOrder" :height="form.listStockSubOrder.length > 10 ? '650px' : ''">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
            <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
            <el-table-column label="规格" prop="specificationName"></el-table-column>
            <el-table-column label="单位" prop="specificationUnit"></el-table-column>
            <el-table-column label="数量" prop="num"></el-table-column>
            <!-- 审核改名叫备货了, 盘亏出库可能语义有问题 -->
            <el-table-column label="备货数量" prop="signNum">
              <template slot-scope="scope">
                  <!-- 正整数限制数量即可 允许0 -->
                  <!-- :rules="{required: true, validator: validateNumInTable, trigger: 'blur'}" -->
                <el-form-item
                  :prop="`listStockSubOrder.${scope.$index}.signNum`"
                  style="margin-bottom: 0;"
                >
                  <el-input v-model.number="scope.row.signNum" :maxlength="8" placeholder="正整数"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="亏欠数量">
              <template slot-scope="{row}">
                {{(Number(row.num) - Number(row.signNum)).toFixed()}}
              </template>
            </el-table-column>
            <!-- 是否条形码校验 - 条形码输入数量 -->
            <el-table-column label="条形码">
              <template slot-scope="{row}">
                <span v-if="row.needCheck">
                  <span :class="{unfinsh: row.recordNum !== row.num}">{{row.recordNum}}</span><span> / {{row.num}}</span>
                  <br>
                  <span class="like-link" @click="handleGetBarCodeDetail(row)">
                    录入
                  </span>
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="出库备注:">
          {{form.remarks}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button 
          class="normal_blue_btn"
          @click="beforeSignOrder"
        >确认</el-button>
        <el-button plain class="plain_gray_btn" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 预审核警告 -->
    <g-dialog-with-slot
      v-if="signDialogVisible"
      :dialogVisible="signDialogVisible"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确认通过吗?'"
      @resolve="handleSignOrder"
      @close="signDialogVisible=false"
    >
      <div class="warning-color">通过后，该出库单无法删除,且不可逆!</div>
    </g-dialog-with-slot>

    <!-- 条形码录入详情组件 -->
    <barCodeListDialog
      v-if="barCodeListVisible"
      :detail="currentGoodsRow"
      :dialogVisible="barCodeListVisible"
      @close="barDialogClose"
    />
  </div>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import barCodeListDialog from './barCodeListDialog'
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
      signDialogVisible: false,
      form: {},
 
      barCodeListVisible: false, // 条码详情
      currentGoodsRow: {}, // 当前操作的条码产品规格数据, 需要附加字段
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init () {
      this.submitLoading = true
      await axios.post('/getProductStockOrderDetailInfo', {stockOrderId: this.detail.outStockOrderId}).then(res => {
        if (res.success) {
          this.submitLoading = false
          res.stockOrderInfo.listStockSubOrder.map(i => {
            i.signNum = i.num
          })
          this.form = res.stockOrderInfo
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.handleClose()
      })
    },
    handleClose() {
      this.$emit('close')
    },
    barDialogClose() {
      this.barCodeListVisible = false
      this.init()
    },
    beforeSignOrder() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.signDialogVisible = true
        } else {
          this.$message.error('请完善信息')
        }
      })
    },
    // 出入库单签名（审核）
    async handleSignOrder() {
      let url = '/signProductStockOrderOut'
      this.submitLoading = true
      let res = await axios.post(url, {
        stockOrderId: this.form.stockOrderId,
        listSignStockSubOrderInfo: this.form.listStockSubOrder.map(i => {
          return {
            remarks: '',
            signNum: i.signNum,
            checkStatus: i.checkStatus,
            stockSubOrderId: i.stockSubOrderId,
          }
        }),
      })
      if (res.success) {
        this.signDialogVisible = false
        this.$emit('afterSign')
        this.submitLoading = false
      } else {
        this.$message.error(res.message)
      }
    },
    // 获取单个产品规格的条码数据
    handleGetBarCodeDetail(row) {
      this.barCodeListVisible = true
      this.currentGoodsRow = {
        ...row,
        // editable: !Number(this.superInfo.status), // '0': 未审核(true); '1': 已审核、'2': 已删除(false)
        editable: true, // '0': 未审核(true); '1': 已审核、'2': 已删除(false)
        stockOrderNo: this.detail.stockOrderNo,
        storageTime: this.detail.storageTime,
        storageType: this.detail.storageType,
        operateType: this.detail.operateType,
      }
    },
    // =================================== 各种校验 =====================================
    validateNumInTable(rule, value, cb) {
      if (value) {
        cb()
      } else {
        cb('数量为正整数')
      }
    },
    validateBuyingPriceInTable(rule, value, cb) {
      if (value === null) {
        cb('价格不能小于0, 必填')
      } else {
        cb()
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
        4: '销售退货',
        5: '盘盈入库',
        6: '初始入库',
        7: '赠送入库',
        8: '其他入库',
        9: '订货退回', // 品牌入库
        11: '退采购出库',
        12: '订货出库',
        13: '调拨出库',
        14: '销售出库',
        15: '盘亏出库',
        16: '赠送出库',
        17: '其他出库',
        18: '订货退回', // 门店出库
        19: '门店领用',
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
  components: { barCodeListDialog }
}
</script>
<style lang='scss' scoped>
/deep/ .el-form-item {
  margin-bottom: 0;
}

/deep/ .el-dialog__footer {
  text-align: left;
}
.like-link {
  cursor: pointer;
  color: rgb(88, 201, 243);
}
.unfinsh {
  color: red;
}
</style>
