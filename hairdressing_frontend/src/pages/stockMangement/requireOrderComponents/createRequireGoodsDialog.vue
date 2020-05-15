<template>
  <div class="shop-side-require-goods">
    <el-dialog
      width="900px"
      title="创建订货单"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form" 
        :model="form" 
        label-width="0"
      >
        <el-form-item>
          <el-button plain size="small" class="plain_blue_btn" @click="requireGoodsDialogVisible = true">选择产品</el-button>
          <el-table
            stripe
            :height="form.tableData && form.tableData.length > 10 ? '650px' : ''"
            :data="form.tableData"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <!-- <el-table-column label="一级分类" show-overflow-tooltip prop="stockProductInfo.productLevelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="stockProductInfo.productLevelTwoName"></el-table-column> -->
            <el-table-column label="产品编号" show-overflow-tooltip prop="stockProductInfo.serialNo"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductInfo.simpleTitle"></el-table-column>
            <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
            <el-table-column label="单位" prop="specificationUnit"></el-table-column>
            <el-table-column label="可用库存" prop="redeploymentStock"></el-table-column>
            <el-table-column label="数量" prop="askNum" width="90">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableData.${scope.$index}.askNum`"
                  :rules="{required: true, validator: validateNumInTable, trigger: 'blur'}"
                >
                  <!-- 门店请求总部的库存量做限制 -->
                  <number-input
                    :min="scope.row.redeploymentStock ? 1 : 0"
                    :decimal="false"
                    :max="scope.row.redeploymentStock || 0"
                    width="80px"
                    v-model="scope.row.askNum"
                    placeholder="正整数"
                  ></number-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 订货价 -->
            <el-table-column label="订货价" prop="supplyPrice" align="center"></el-table-column>
            <!-- 订货金额 -->
            <el-table-column label="订货金额" align="center">
              <template slot-scope="{row}">
                {{ (Number(row.askNum) * Number(row.supplyPrice)).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <i class="icon iconfont icon-icon_operate_delete" @click="delSpecialForm(scope.$index)"></i>
              </template>
            </el-table-column>
          </el-table>
          <div class="summary-line">
            <span>合计</span>
            <span><span class="grey">数量: </span>{{orderSummary.num}}</span>
            <span><span class="grey">金额: </span>{{orderSummary.money.toFixed(2)}}<span class="grey no-margin">元</span></span>
          </div>
        </el-form-item>
        <el-form-item label="收货信息:" label-width="80px">
          <div class="receiver-info">
            <el-form-item 
              prop="receiverName"
              :rules="{required: true,  min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}"
            >
              <el-input style="width: 160px;" maxlength="16" v-model.trim="form.receiverName" placeholder="请输入收货人姓名"></el-input> 
            </el-form-item>
            <el-form-item 
              prop="receiverPhone"
              :rules="{required: true,  min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur'}"
            >
              <el-input style="width: 160px;" maxlength="11" v-model.trim="form.receiverPhone" placeholder="请输入收货人手机号"></el-input>
            </el-form-item>
            <el-form-item 
              prop="receiverAddress"
              :rules="{required: true,  min: 2, max: 48, message: '请输入详细地址', trigger: 'blur'}"
            >
              <el-input style="width: 320px;" v-model.trim="form.receiverAddress" placeholder="请输入详细收货地址"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="订货说明:" label-width="80px">
          <InputWithCount style="width: 380px;" :length="300" placeholder="请输入订货说明，最多300字" v-model="form.reason"/>
        </el-form-item>
        <el-form-item>
          <el-button class="normal_blue_btn" @click="toSendData">保 存</el-button>
          <el-button plain class="plain_gray_btn" @click="handleClose">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建订货单 -- 门店端 -->
    <chooseGoods
      v-if="requireGoodsDialogVisible"
      :visible="requireGoodsDialogVisible" 
      @close="requireGoodsDialogVisible = false"
      :superCheckedGoods="selectedProductionIds"
      @suberData="handleGetSelectedGoods"
      :needCheckStock="true"
    />
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import * as utils from "@/assets/js/utils";
import chooseGoods from '../components/chooseGoodsDialog';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      form: {
        reason: '', // 订货原因
        tableData: [],
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
      },
      requireGoodsDialogVisible: false, // 选择产品规格的对话框
      selectedProductionIds: new Set(), // - 勾选处理用
      selectedProductionObj: {}, // - 勾选处理用
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    // 派发数据给父组件
    toSendData() {
      if (!this.form.tableData.length) {
        return this.$message.error('至少需要一个产品')
      }
      this.$refs.form.validate(valid => {
        if (valid)  {
          // return // test
          let tableData = JSON.parse(JSON.stringify(this.form.tableData))
          let form = JSON.parse(JSON.stringify(this.form))
          delete form.tableData
          tableData.map(i => {
            delete i.stockProductInfo
          })
          this.submitLoading = true
          this.$emit('createRequireOrder', {
            productInvoiceCreateInfo: {
              brandId: this.currentInfo.brandId,
              fromStoreId: 0, // 发货门店ID（0表示总部发货）
              fromStoreName: '', // 发货门店ID（0表示总部发货）
              toStoreId: this.currentInfo.shopId,
              toStoreName: this.currentInfo.shopName,
              listProductInvoiceSubCreateInfo: tableData,
              reason: form.reason,
              // 新增信息
              receiverName: form.receiverName,
              receiverPhone: form.receiverPhone,
              receiverAddress: form.receiverAddress,
            }
          })
        } else {
          this.$message.error('请完善信息')
        }
      })
    },
    // 来自子组件的选择数据 ===向表格注入数据===
    handleGetSelectedGoods(obj) {
      obj.yes.map(i => {
        if (!this.selectedProductionIds.has(i.stockProductSpecificationId)) {
          this.selectedProductionIds.add(i.stockProductSpecificationId)
          //  ===向表格注入额外字段===
          this.selectedProductionObj[i.stockProductSpecificationId] = {
            ...i,
            remarks: '',
            cycleImages: i.stockProductInfo.cycleImages,
            stockProductName: i.stockProductInfo.simpleTitle,
            stockProductNo: i.stockProductInfo.serialNo,
            productBrandId: i.stockProductInfo.productBrandId,
            productLevelOne: i.stockProductInfo.productLevelOne,
            productLevelTwo: i.stockProductInfo.productLevelTwo,
            supplyPrice: i.givePrice, // 订货价 门店不可修改
            askNum: null, // 订货数量
          }
        }
      })
      obj.no.map(i => {
        if (this.selectedProductionIds.has(i.stockProductSpecificationId)) {
          this.selectedProductionIds.delete(i.stockProductSpecificationId)
          delete this.selectedProductionObj[i.stockProductSpecificationId]
        }
      })
      this.form.tableData = Object.values(this.selectedProductionObj)
    },
    // 删除表格已选行
    delSpecialForm(index) {
      let id = this.form.tableData[index].stockProductSpecificationId
      this.form.tableData.splice(index, 1)
      this.selectedProductionIds.delete(id)
      delete this.selectedProductionObj[id]
    },
    // =================================== 各种校验 =====================================
    validateNumInTable(rule, value, cb) {
      if (value) {
        cb()
      } else {
        cb('数量为正整数')
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    orderSummary() {
      let summary = {
        num: 0,
        money: 0
      }
      this.form.tableData.map(goods => {
        summary.num += Number(goods.askNum)
        summary.money += Number(goods.supplyPrice) * Number(goods.askNum)
      })
      return summary
    }
  },
  components: { chooseGoods }
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

/deep/ .el-dialog__body {
  padding: 10px 20px;
}
.grey {
  color: #999;
  margin-left: 8px;
  &.no-margin {margin: 0;}
}

.summary-line {
  text-align: right;
}

.receiver-info {
  display: flex;
  .el-form-item { margin-right: 12px; }
}
</style>
