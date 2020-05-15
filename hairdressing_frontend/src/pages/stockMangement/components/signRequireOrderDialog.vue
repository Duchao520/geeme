<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="900px"
      title="审核订货单"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form" 
        :model="form" 
        label-width="110px"
      >
        <el-form-item label="订货单号">
          {{form.productInvoiceNo}}
        </el-form-item>
        <!-- 门店申请的原因 -->
        <el-form-item label="订货原因">
          {{form.reason}}
        </el-form-item>
        <el-form-item 
          label="订货产品:" 
          required
        >
          <el-table
            stripe
            :height="form.tableData.length > 10 ? '650px' : ''"
            :data="form.tableData"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductName"></el-table-column>
            <el-table-column label="规格名称" show-overflow-tooltip prop="specificationName"></el-table-column>
            <el-table-column label="申请数量" prop="askNum" align="center"></el-table-column>
            <el-table-column label="申请时供货价" prop="supplyPrice" align="center"></el-table-column>
            <el-table-column label="可用库存" prop="redeploymentStock"></el-table-column>
            <el-table-column label="审批数量" prop="approvalNum" width="90">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableData.${scope.$index}.approvalNum`"
                  :rules="{required: true, validator: validateNumInTable, trigger: 'blur'}"
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
                  :rules="{required: true, validator: validateBuyingPriceInTable, trigger: 'blur'}"
                >
                  <number-input
                    :max="99999999"
                    :min="0"
                    width="80px"
                    v-model="scope.row.approvalPrice"
                    placeholder="审批供货价"
                  >
                  </number-input>
                </el-form-item>    
              </template>
            </el-table-column>
           
          </el-table>
        </el-form-item>
        <!-- 暂时没有支付 -->
        <!-- <el-form-item label="需要支付:" >
          <el-checkbox 
            v-model="form.needPay"
          >{{form.needPay ? '是' : '否'}}</el-checkbox>
        </el-form-item> -->
        <!-- 品牌审核的备注 -->
        <el-form-item label="审批备注:">
          <InputWithCount style="width: 380px;" :length="300" placeholder="请输入备注" v-model="form.remarks"/>
        </el-form-item>
        <el-form-item>
          <el-button class="normal_blue_btn" @click="signWarningVisible = true">通过审核</el-button>
          <el-button plain class="plain_gray_btn" @click="handleClose">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 通过审核警告 -->
    <g-dialog-with-slot
      v-if="signWarningVisible"
      :dialogVisible="signWarningVisible"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确认通过吗?'"
      @resolve="signRequireOrders"
      @close="signWarningVisible=false"
    >
      <div class="warning-color">审核后，该订货单无法删除及撤销!</div>
    </g-dialog-with-slot>
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
      signWarningVisible: false, //
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
            needPay: form.needPay,
            remarks: form.remarks,
            productInvoiceId: form.productInvoiceId,
            listApproveProductInvoiceSubInfo: tableData
          }
          axios.post('/approveProductInvoice', params, {noNormalError: true}).then(res => {
            if (res.success) {
              this.signWarningVisible = false
              this.$emit('afterSignRequireOrder')
            } else {
              this.$message.error(res.message)
              this.submitLoading = false
            }
          }).catch(err => {
            this.signWarningVisible = false
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

</style>
