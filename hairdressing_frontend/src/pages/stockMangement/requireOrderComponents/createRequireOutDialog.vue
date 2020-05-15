<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="1200px"
      :title="`新增${operateTypeName}库单`"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form" 
        :rules="rules"
        :model="form" 
        label-width="110px"
      >
        <el-row type="flex">
          <el-col>
            <!-- 出入库类型 -->
            <el-form-item :label="`${operateTypeName}库类型:`" style="margin-bottom: 0;">
              订货单{{operateTypeName}}库
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订货单号:" style="margin-bottom: 0;">
              {{detailInfo.productInvoiceNo}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="调入门店:" style="margin-bottom: 0;">
              {{detailInfo.toStoreName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" style="margin-top: 4px;">
          <el-col>    
            <!-- 出入库时间 -->
            <el-form-item :label="`${operateTypeName}库时间:`" prop="storageTime" style="margin-bottom: 0;">
              <el-date-picker
                :clearable="false"
                type="datetime"
                placeholder="选择日期时间"
                v-model="form.storageTime"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- 出入库经办人 -->
            <el-form-item label="经办人:" prop="dealUserId">
              <el-select
                clearable
                size="medium"
                placeholder="选择经办人" 
                v-model="form.dealUserId"
              >
                <el-option 
                  :key="i.userId" 
                  :value="i.userId"
                  :label="i.userName"
                  v-for="i in staffOption" 
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label-width="40px">
          <el-table
            stripe
            :height="form.tableData.length > 10 ? '770px' : ''"
            :data="form.tableData"
            show-summary
            :summary-method="summaryMethod"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="产品编号" show-overflow-tooltip prop="stockProductNo"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductName"></el-table-column>
            <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
            <el-table-column label="单位" prop="specificationUnit"></el-table-column>
            <el-table-column label="数量" prop="num" width="90">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableData.${scope.$index}.num`"
                  :rules="{required: true, validator: validateNumInTable, trigger: 'blur'}"
                >
                  <number-input
                    :min="1"
                    disabled
                    width="80px"
                    :decimal="false"
                    :max="9999999999"
                    v-model="scope.row.num"
                    placeholder="正整数"
                  ></number-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 进出货价 -->
            <el-table-column :label="`${currentEntry === 'shop' ? '进货价' : '供货价'}`" prop="buyingPrice" width="90">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`tableData.${scope.$index}.buyingPrice`"
                  :rules="{required: true, validator: validateBuyingPriceInTable, trigger: 'blur'}"
                >
                  <number-input
                    :min="0"
                    disabled
                    width="80px"
                    :max="99999999"
                    v-model="scope.row.buyingPrice"
                    :placeholder="`${operateType ? '供货价' : '进货价'}`"
                  >
                  </number-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="订货金额" align="center">
              <template slot-scope="{row}">
                {{ (Number(row.num) * Number(row.buyingPrice)).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="需要条形码" prop="needCheck">
              <!-- 列头插槽 -->
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChanged">需要条形码</el-checkbox>
              </template>
              <!-- 内容 -->
              <template slot-scope="{row}">
                <el-checkbox 
                  :true-label="1"
                  :false-label="0"
                  v-model="row.needCheck"
                  @change="handleSingleCheckboxChanged(row.needCheck)"
                >
                  {{row.needCheck ? '是' : '否'}}
                </el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="订货说明:" style="margin-bottom: 0;">
          {{detailInfo.reason}}
        </el-form-item>
        <el-form-item label="审核备注:" style="margin-bottom: 0;">
          {{detailInfo.remarks}}
        </el-form-item>
        <el-form-item label="出库备注:">
          <InputWithCount style="width: 380px;" :length="300" placeholder="请输入备注" v-model="form.remarks"/>
        </el-form-item>
        <el-form-item>
          <el-button class="normal_blue_btn" @click="toSendData">保 存</el-button>
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
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detailInfo: {
      type: Object,
      required: true
    },
    operateType: { // 0-入库, 1-出库
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      checkAll: false,
      submitLoading: false,
      staffOption: [], // 经办人选项
      comparisonDealUserObj: {}, // 经办人 id: name  提交时给后端用的匹配数据
      form: {
        storageTime: '', // 出入库时间
        storageType: null, // 出入库类型
        dealUserId: null, // 经办人
        remarks: '', // 统一的备注
        tableData: [], // 选择的产品表格

        productInvoiceId: null, // 订货单ID
        productInvoiceNo: '', // 订货单ID编号
      },
      pickerOptions: {
        // 需要区分出入库?
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // }
      },
      rules: {
        storageTime: {required: true, message: `请选择时间`, trigger: 'change'},
        dealUserId: {required: true, message: '请选择经办人', trigger: 'change'},
      },
    }
  },
  created() {
    let detailInfo = JSON.parse(JSON.stringify(this.detailInfo))
    // 出入库类型：1-采购入库，2-订货入库，3-调拨入库，4-退货入库，5-盘盈入库，11-退采购出库，12-订货出库，13-调拨出库，14-销售出库，15-盘亏出库
    this.form.storageTime = new Date().format('yyyy-MM-dd hh:mm:ss')
    this.form.storageType = this.operateType ? 12 : 2
    this.form.remarkNo = '' // 出入库单自定义编号
    this.form.productInvoiceId = detailInfo.productInvoiceId
    this.form.productInvoiceNo = detailInfo.productInvoiceNo
     // 处理审核后数量非0的数据,并转换部分字段
    this.form.tableData = detailInfo.listProductInvoiceSubInfo.filter(i => !!i.approvalNum).map(i=> {
      delete i.reason // null 的要删
      return {
        ...i,
        num: i.approvalNum,
        buyingPrice: i.approvalPrice,
        costPrice: i.approvalPrice, // 假的
        needCheck: 0, // 是否需要录入检查：0-不录入检查, 1-录入检查
      }
    })
    this.initStaff()
  },
  methods: {
    // 经办人选项
    async initStaff() {
      if (this.currentEntry === 'brand') {
        let res = await axios.post('/esGetBrandStaffList', {brandId: this.currentInfo.brandId, currentPage: 0, pageSize: 999, tabCondition: 'ACTIVE', entryDate: 'ALL'})
        this.staffOption = res.staffListInfos || []
        this.staffOption.map(i => {
          this.comparisonDealUserObj[i.userId] = i.userName
        })
      } else {
        // 门店端
        let res = await axios.post('/getStaffInfoList', {storeId: this.currentInfo.shopId, currentPage: 0, pageSize: 999, tabCondition: 'ACTIVE', entryDate: 'ALL'})
        this.staffOption = res.dataList || []
        this.staffOption.map(i => {
          this.comparisonDealUserObj[i.userId] = i.userName
        })
      }
    },
    handleClose() {
      this.$emit('close')
    },
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
          let params = {
            listStockSubOrder: tableData,
            stockOrder: {
              ...form,
              operateType: this.operateType,
              dealUserName: this.comparisonDealUserObj[this.form.dealUserId], // 经办人姓名
              brandId: this.currentInfo.brandId, 
              storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null,
            }
          }
          axios.post('/createProductStockOutOrder', params).then(res => {
            if (res.success) {
              this.$emit('afterCreateOut')
            } else {
              this.submitLoading = false
            }
          }).catch(err => {
            this.submitLoading = false
          })
        } else {
          this.$message.error('请完善信息')
        }
      })
    },
    summaryMethod() {
      let totalNum = 0
      let totalMoney = 0
      this.form.tableData.map(i => {
        totalNum += i.num
        totalMoney += (i.buyingPrice * i.num)
      })
      return ['合计', '', '', '', '', totalNum, '', totalMoney.toFixed(2), '']
    },
    handleCheckAllChanged(bool) {
      this.checkAll = bool
      this.form.tableData.map(i => {
        i.needCheck = Number(bool)
      })
    },
    handleSingleCheckboxChanged(val) {
      let bool = this.form.tableData.some(i => !i.needCheck)
      this.checkAll = !bool
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
    operateTypeName() {
      return this.operateType ? '出' : '入'
    },
  },
  watch: {
    // 'form.tableData': {
    //   handler: (v, o) => {
    //     console.log(v, o)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
}
</script>
<style lang='scss' scoped>

</style>
