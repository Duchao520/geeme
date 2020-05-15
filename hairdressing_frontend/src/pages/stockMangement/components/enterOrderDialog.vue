<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="900px"
      :title="`${superInfo.routeType}库单明细`"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <!-- 打印测试 -->
      <!-- <stockInDetail :table="form.listStockSubOrder"/> -->
      <div class="order-detail-item">
        <div class="detail-line">
          <div class="detail-info">
            <div class="detail-title">
              {{`${superInfo.routeType}库时间:`}}
            </div>
            <div class="detail-content">
              {{detail.storageTime}}
            </div>
          </div>
          <div class="detail-info">
            <div class="detail-title">
              {{`${superInfo.routeType}库单号:`}} 
            </div>
            <div class="detail-content">
              {{detail.stockOrderNo}}
            </div>
          </div>
          <div class="detail-info">
            <div class="detail-title">
              {{`${superInfo.routeType}库类型:`}}
            </div>
            <div class="detail-content">
              {{detail.storageType|storageTypeFilter}}
            </div>
          </div>
        </div>
        <div class="detail-line">
          <!-- 审核时间 - 后端暂无字段 -->
          <!-- <div class="detail-info">
            <div class="detail-title">
              审核时间:
            </div>
            <div class="detail-content">
              {{detail.storageTime}}
            </div>
          </div> -->
          <div class="detail-info">
            <div class="detail-title">
              {{`订单${superInfo.status === '0' ? '审核:' : '状态:'}`}}
            </div>
            <div class="detail-content">
              <span>{{superInfo.status | statusFilter}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="table-main">
        <el-form
          ref="form" 
          :model="form" 
          label-width="0px"
        >
          <el-table :data="form.listStockSubOrder" :height="form.listStockSubOrder.length > 10 ? '650px' : ''">
            <el-table-column type="index" width="50"></el-table-column>
            <!-- 后端暂时还没有  有的时候直接取消注释 -->
            <!-- <el-table-column label="产品编号" prop="serialNo"></el-table-column> -->
            <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
            <el-table-column label="规格" prop="specificationName"></el-table-column>
            <el-table-column label="单位" prop="specificationUnit"></el-table-column>
            <el-table-column label="数量" prop="num"></el-table-column>
            <el-table-column label="审核数量" prop="signNum">
              <template slot-scope="scope">
                  <!-- 正整数限制数量即可 允许0 -->
                  <!-- :rules="{required: true, validator: validateNumInTable, trigger: 'blur'}" -->
                <el-form-item
                  :prop="`listStockSubOrder.${scope.$index}.signNum`"
                  style="margin-bottom: 0;"
                >
                  <number-input
                    :min="0"
                    :disabled="superInfo.status !== '0'"
                    width="80px"
                    :decimal="false"
                    :max="9999999999"
                    v-model="scope.row.signNum"
                    placeholder="正整数"
                  ></number-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 品牌出库叫供货， 品牌入库、门店出入库都叫进货 -->
            <el-table-column 
              :label="`${currentEntry === 'brand' && superInfo.routeType === '出' ? '供货价' : '进货价'}`" 
              prop="buyingPrice"
            ></el-table-column>
            <!-- 仅入库 -->
            <el-table-column v-if="superInfo.routeType === '入'" label="成本价" prop="costPrice"></el-table-column>
            <!-- 是否条形码校验 - 条形码输入数量 -->
            <el-table-column label="条形码">
              <template slot-scope="{row}">
                <span v-if="row.needCheck">
                  <span :class="{unfinsh: row.recordNum !== row.num}">{{row.recordNum}}</span><span> / {{row.num}}</span>
                  <br>
                  <span class="like-link" @click="handleGetBarCodeDetail(row)">
                    {{superInfo.status === '0' ? '录入' : '明细'}}
                  </span>
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div class="remark-line">
        <div class="detail-info">
          <div class="detail-title">备注:</div>
          <div class="detail-content">
            {{detail.remarks}}
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button 
          v-if="superInfo.status === '0'" 
          class="normal_blue_btn"
          @click="beforeSignOrder"
        >通过审核</el-button>
        <el-button plain class="plain_gray_btn" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 预审核警告 -->
    <g-dialog-with-slot
      v-if="signDialogVisible"
      :dialogVisible="signDialogVisible"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确认通过审核吗?'"
      @resolve="handleSignOrder"
      @close="signDialogVisible=false"
    >
      <div class="warning-color">审核后，该{{superInfo.routeType}}库单无法删除!</div>
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

import stockInDetail from '../print/stockInDetail'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      required: true,
    },
    superInfo: {
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
  created() {
    this.init()
  },
  methods: {
    async init () {
      this.submitLoading = true
      let res = await axios.post('/getProductStockOrderDetailInfo', {stockOrderId: this.detail.stockOrderId})
      if (res.success) {
        this.submitLoading = false
        this.form = res.stockOrderInfo
      } else {
        this.$message.error(res.message)
      }
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
      let pageEnter = this.$route.path.indexOf('out') > 0 ? 'out' : 'in' // 判断出入库
      let url = pageEnter === 'in' ? '/signProductStockOrderIn' : '/signProductStockOrderOut'
      this.submitLoading = true
      let res = await axios.post(url, {
        stockOrderId: this.form.stockOrderId,
        listSignStockSubOrderInfo: this.form.listStockSubOrder.map(i => {
          return {
            remarks: '',
            stockSubOrderId: i.stockSubOrderId,
            signNum: i.signNum,
            checkStatus: i.checkStatus,
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
        editable: !Number(this.superInfo.status), // '0': 未审核(true); '1': 已审核、'2': 已删除(false)
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
  components: { barCodeListDialog, stockInDetail }
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
