<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="1200px"
      title="审核订货单"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form" 
        :model="form" 
        label-width="70px"
      >
        <el-row type="flex">
          <el-col>
            <el-form-item label="订货时间:">
              {{form.askTime}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订货单号:">
              {{form.productInvoiceNo}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="订货门店:">
              {{form.toStoreName}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订货人:">
              {{form.askUserName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" v-if="form.reason">
          <el-col>
            <el-form-item label="订货说明:">
              {{form.reason}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-table
            stripe
            :height="form.tableData.length > 10 ? '650px' : ''"
            :data="form.tableData"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="产品编号" show-overflow-tooltip prop="stockProductNo"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductName"></el-table-column>
            <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
            <el-table-column label="单位" prop="specificationUnit"></el-table-column>
            <el-table-column label="申请数量" prop="askNum" align="center"></el-table-column>
            <el-table-column label="申请时供货价" prop="supplyPrice" align="center"></el-table-column>
            <el-table-column label="可用库存" prop="redeploymentStock"></el-table-column>
            <el-table-column label="审批数量" prop="approvalNum" width="90">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableData.${scope.$index}.approvalNum`"
                  :rules="{required: true, validator: validateNumInTable, trigger: 'change'}"
                >
                    <!-- :max="scope.row.redeploymentStock || 0" -->
                  <number-input
                    :min="currentEntry === 'shop' ? 1 : 0"
                    :decimal="false"
                    width="80px"
                    v-model="scope.row.approvalNum"
                    :placeholder="currentEntry === 'shop' ? '正整数' : '自然数'"
                  ></number-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 供货价 -->
            <el-table-column label="审批时供货价">
              <template slot-scope="scope">
                 <el-form-item
                  :prop="`tableData.${scope.$index}.approvalPrice`"
                  :rules="{required: true, validator: validateBuyingPriceInTable, trigger: 'change'}"
                >
                  <number-input
                    :max="99999999"
                    :min="0"
                    :decimal="true"
                    width="80px"
                    v-model="scope.row.approvalPrice"
                    placeholder="审批供货价"
                  >
                  </number-input>
                </el-form-item>    
              </template>
            </el-table-column>
           <el-table-column label="金额">
             <template slot-scope="{row}">
               {{(Number(row.approvalPrice) * Number(row.approvalNum)).toFixed(2)}}
             </template>
           </el-table-column>
          </el-table>
          <div class="summary-line">
            <span>合计</span>
            <span><span class="grey">申请数量: </span>{{orderSummary.num1}}</span>
            <span><span class="grey">审核数量: </span>{{orderSummary.num2}}</span>
            <span><span class="grey">金额: </span>{{orderSummary.money.toFixed(2)}}<span class="grey no-margin">元</span></span>
          </div>
        </el-form-item>
       <el-row type="flex">
         <el-col>
          <!-- 品牌审核的备注 -->
          <el-form-item label="审批备注:">
            <InputWithCount style="width: 380px;" :length="300" placeholder="请输入备注" v-model="form.remarks" :autosize="{minRows: 5}"/>
          </el-form-item>
         </el-col>
         <el-col :span="6" class="right-item">
          <el-form-item 
            label="特别优惠:" 
            prop="specialOffers"
            :rules="{required: false, validator: validateMoney, trigger: 'change'}"
          >
            -
            <el-input style="width: 130px;" size="small" v-model.trim="form.specialOffers" placeholder="优惠" maxlength="8">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item 
            label="运费:"
            prop="freight"
            :rules="{required: false, validator: validateMoney, trigger: 'change'}"
          >
            +
            <el-input style="width: 130px;" size="small" v-model.trim="form.freight" placeholder="运费" maxlength="8">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="应付款:">
            {{form.finalCharge}}
          </el-form-item>
         </el-col>
       </el-row>
        <!-- 支付 -->
        <el-form-item>
          <el-checkbox 
            v-model="form.needPay"
          >
            需完成付款才能出库发货
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="normal_blue_btn" @click="signRequireOrders">通过审核</el-button>
          <el-button plain class="plain_gray_btn" @click="handleClose">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    detailInfo: {
      type: Object,
      required: true
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      submitLoading: false,
      form: {},
    }
  },
  created() {
    this.getDetailInfo()
  },
  methods: {
    async getDetailInfo() {
      this.submitLoading = true
      let res = await axios.post('/getTryApproveProductInvoiceInfo', {productInvoiceId: this.detailInfo.productInvoiceId})
      this.submitLoading = false
      if (res.success) {
        let form = res.productInvoiceInfo
        let tableData = form.listProductInvoiceSubInfo
        delete form.listProductInvoiceSubInfo
        this.form = {
          ...form,
          tableData,
          specialOffers: null, // 特别优惠
          freight: null, // 运费
          finalCharge: null, // 最终款
        }
      } else {
        this.$message.error(res.message || '接口请求失败')
        this.handleClose()
      }
    },
    handleClose() {
      this.$emit('close')
    },
    signRequireOrders() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let form = JSON.parse(JSON.stringify(this.form))
          let tableData = form.tableData
          let params = {
            // form 内字段太多， 按需取一部分
            needPay: form.needPay,
            remarks: form.remarks,
            freight: Number(form.freight), // 运费
            finalCharge: Number(form.finalCharge), // 最终价格
            specialOffers: Number(form.specialOffers), // 特别优惠
            productInvoiceId: form.productInvoiceId,
            listApproveProductInvoiceSubInfo: tableData
          }
          axios.post('/approveProductInvoice', params, {noNormalError: true}).then(res => {
            if (res.success) {
              this.$emit('afterSignRequireOrder')
            } else {
              this.$message.error(res.message)
              this.submitLoading = false
            }
          }).catch(err => {
            this.$message.error('库存不足或者网络错误')
            this.getDetailInfo()
          })
        } else {
          this.$message.error('请完善信息')
        }
      })
    },
    // =================================== 各种校验 =====================================
    validateNumInTable(rule, value, cb) {
      if (this.currentEntry === 'shop') {
        if (value) {
          cb()
        } else {
          cb('数量为正整数')
        }
      } else {
        if (value === null) {
          cb('价格不能小于0, 必填')
        } else {
          cb()
        }
      }
    },
    validateBuyingPriceInTable(rule, value, cb) {
      if (value === null) {
        cb('价格不能小于0, 必填')
      } else {
        cb()
      }
    },
    validateMoney(rule, value, cb) {
      if (value) {
        if (/^[0-9]+(\.[0-9]{0,2})?$/.test(value)) return cb()
          return cb('非合法金额数字, 且最多两位小数')
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
    orderSummary() {
      let summary = {
        num1: 0,
        num2: 0,
        money: 0
      }
      this.form.tableData.map(goods => {
        summary.num1 += Number(goods.askNum)
        summary.num2 += Number(goods.approvalNum)
        summary.money += Number(goods.approvalPrice) * Number(goods.approvalNum)
      })
      this.form.finalCharge = (Number(summary.money) - Number(this.form.specialOffers) + Number(this.form.freight)).toFixed(2)
      return summary
    }
  },
}
</script>
<style lang='scss' scoped>
/deep/ .el-form-item {
  margin-bottom: 0;
}
.grey {
  color: #999;
  margin-left: 8px;
  &.no-margin {margin: 0;}
}
/deep/ .el-form-item__error {
  display: none;
}
.right-item /deep/ .el-form-item__content, .summary-line {
  text-align: right;
}

</style>
