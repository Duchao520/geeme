<template>
<div v-loading.fullscreen.lock="submitLoading">
  <el-dialog
    width="1200px"
    :title="`新增${superInfo.routeType}库单`"
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
      <!-- 出入库时间 -->
      <el-form-item :label="`${superInfo.routeType}库时间`" prop="storageTime">
        <el-date-picker
          type="datetime"
          placeholder="选择日期时间"
          v-model="form.storageTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 出入库类型 -->
      <el-form-item :label="`${superInfo.routeType}库类型`" prop="storageType">
        <el-select
          clearable
          size="medium"
          :placeholder="`选择${superInfo.routeType}库类型`" 
          v-model="form.storageType"
          @change="handleStorageTypeChanged"
        >
          <el-option 
            v-for="i in storageTypeOptions" 
            :key="i.value" 
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 出入库经办人 -->
      <el-form-item label="经办人" prop="dealUserId">
        <el-select
          clearable
          size="medium"
          placeholder="选择经办人" 
          v-model="form.dealUserId"
        >
          <el-option 
            v-for="i in staffOption" 
            :key="i.userId" 
            :value="i.userId"
            :label="i.userName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item 
        :label="`${superInfo.routeType}库产品`" 
        required
      >
        <el-button plain class="plain_blue_btn" @click="chooseGoodsDialogVisible = true">选择产品</el-button>
        <el-table
          stripe
          :height="form.tableData.length > 10 ? '770px' : ''"
          :data="form.tableData"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="产品分类" show-overflow-tooltip prop="stockProductInfo.productLevelTwoName">
            <template slot-scope="{row}">
              <p>{{row.stockProductInfo.productLevelOneName}}</p>
              <p>{{row.stockProductInfo.productLevelTwoName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductInfo.simpleTitle"></el-table-column>
          <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
          <el-table-column label="单位" prop="specificationUnit"></el-table-column>
          <!-- 入库时与当前库存量无关 -->
          <el-table-column v-if="superInfo.routeType === '出'" label="可用库存" prop="redeploymentStock"></el-table-column>
          <el-table-column label="数量" prop="num" width="90">
            <template slot-scope="scope">
              <el-form-item
                :prop="`tableData.${scope.$index}.num`"
                :rules="{required: true, validator: validateNumInTable, trigger: 'blur'}"
              >
                <number-input
                  :min="superInfo.routeType === '出' ? 0 : 1"
                  :decimal="false"
                  :max="superInfo.routeType === '出' ? (scope.row.redeploymentStock || 0) : 99999999"
                  width="80px"
                  v-model="scope.row.num"
                  placeholder="正整数"
                ></number-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 进出货价 -->
          <el-table-column 
            :label="`${currentEntry === 'brand' && superInfo.routeType === '出' ? '供货价' : '进货价'}`" 
            prop="buyingPrice" 
            width="90"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="`tableData.${scope.$index}.buyingPrice`"
                :rules="{required: true, validator: validateBuyingPriceInTable, trigger: 'blur'}"
              >
                <number-input
                  :max="99999999"
                  :min="0"
                  width="80px"
                  v-model="scope.row.buyingPrice"
                  :placeholder="`${currentEntry === 'brand' && superInfo.routeType === '出' ? '供货价' : '进货价'}`"
                >
                </number-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 仅入库时显示?? v-if="superInfo.routeType === '入'" -->
          <el-table-column label="成本价" v-if="superInfo.routeType === '入'" prop="costPrice" width="90">
            <template slot-scope="scope">
              <el-form-item
                :prop="`tableData.${scope.$index}.costPrice`"
                :rules="{required: true, validator: validateBuyingPriceInTable, trigger: 'blur'}"
              >
                <number-input
                  :max="99999999"
                  :min="0"
                  width="80px"
                  v-model="scope.row.costPrice"
                  placeholder="成本价"
                >
                </number-input>
              </el-form-item>              
            </template>
          </el-table-column>
          <el-table-column label="需要条形码" prop="needCheck">
            <template slot-scope="{row}">
                <!-- disabled -->
              <el-checkbox 
                :true-label="1"
                :false-label="0"
                v-model="row.needCheck"
              >{{row.needCheck ? '是' : '否'}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <i class="icon iconfont icon-icon_operate_delete" @click="delSpecialForm(scope.$index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注">
        <InputWithCount style="width: 380px;" :length="300" placeholder="请输入备注" v-model="form.remarks"/>
      </el-form-item>
      <el-form-item>
        <el-button class="normal_blue_btn" @click="toSendData">保 存</el-button>
        <el-button plain class="plain_gray_btn" @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 仅门店出货查询门店自己的库存， 其余查总部的可用库存 -->
  <chooseGoods 
    v-if="chooseGoodsDialogVisible"
    :visible="chooseGoodsDialogVisible" 
    @close="chooseGoodsDialogVisible = false"
    :superCheckedGoods="selectedProductionIds"
    @suberData="handleGetSelectedGoods"
    :needCheckStock="superInfo.routeType === '出'"
    :origin="currentEntry === 'shop' && superInfo.routeType === '出' ? 'shop' : 'brand'"
  />
</div>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import * as utils from "@/assets/js/utils";
import chooseGoods from './chooseGoodsDialog';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    superInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        storageTime: '', // 出入库时间
        storageType: null, // 出入库类型
        dealUserId: null, // 经办人
        remarks: '', // 统一的备注
        tableData: [], // 选择的产品表格
      },
      comparisonDealUserObj: {}, // 经办人 id: name  提交时给后端用的匹配数据
      staffOption: [], // 经办人选项
      chooseGoodsDialogVisible: false, // 选择产品规格的对话框
      selectedProductionIds: new Set(), // - 勾选处理用
      selectedProductionObj: {}, // - 勾选处理用
      submitLoading: false, // 组件提交到父页面 - 新增出入库单
      rules: {
        storageTime: {required: true, message: `请选择时间`, trigger: 'change'},
        dealUserId: {required: true, message: '请选择经办人', trigger: 'change'},
        storageType: {required: true, message: `请选择类型`, trigger: 'change'},
      },
      pickerOptions: {
        // 需要区分出入库?
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // }
      },
    }
  },
  created() {
    this.initStaff()
    this.form.storageTime = new Date().format('yyyy-MM-dd hh:mm:ss')
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
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
    // 出入库类型切换时，可能要从单子取产品列表, 并且清理当前的其他类型选择的产品表
    handleStorageTypeChanged() {
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
          this.$emit('createEnterOrder', {
            listStockSubOrder: tableData,
            stockOrder: {
              ...form,
              operateType: this.superInfo.routeType === '入' ? 0 : 1, // 0-入库, 1-出库(仅查询有效)
              dealUserName: this.comparisonDealUserObj[this.form.dealUserId], // 经办人姓名
              brandId: this.currentInfo.brandId, 
              storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null,
            }
          })
          
        } else {
          this.$message.error('请完善信息')
        }
      })
    },
    // 删除表格已选行
    delSpecialForm(index) {
      let id = this.form.tableData[index].stockProductSpecificationId
      this.form.tableData.splice(index, 1)
      this.selectedProductionIds.delete(id)
      delete this.selectedProductionObj[id]
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
            needCheck: 0,
            cycleImages: i.stockProductInfo.cycleImages,
            stockProductName: i.stockProductInfo.simpleTitle,
            stockProductNo: i.stockProductInfo.serialNo,
            productBrandId: i.stockProductInfo.productBrandId,
            productLevelOne: i.stockProductInfo.productLevelOne,
            productLevelTwo: i.stockProductInfo.productLevelTwo,
            // 以下 区分门店和品牌 门店端要重写部分数据
            // [进出货价] 
            buyingPrice: this.currentEntry === 'brand' ? 
              (this.superInfo.routeType === '入' ? i.costPrice : i.givePrice) : // 品牌 入库 用成本， 出库用供货价
              i.givePrice, // 门店出入库都是供货价
            // [成本价] 品牌：取 产品设置的 成本价; 门店： 自己设置: null[出库隐藏该列后端会报错]、 取进货价: givePrice
            costPrice: this.currentEntry === 'brand' ? i.costPrice : i.givePrice
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
    // 门店与品牌端的不同选项 ----- 订货走订货单处理 此处只处理其他类型的出入库单 !!!
    storageTypeOptions() {
      if (this.superInfo.routeType === '入') {
        if (this.currentEntry === 'brand') {
          return [
            {
              value: 1, // 仅品牌
              label: '采购入库' // 仅品牌 
            },
            // {
            //   value: 3, // 暂无
            //   label: '调拨入库' // 暂无
            // },
            // {
            //   value: 4, // 销售退货- 品牌暂无
            //   label: '销售退货' // 销售退货- 品牌暂无
            // },
            // {
            //   value: 5, // 盘库自动处理
            //   label: '盘盈入库' // 盘库自动处理
            // },
            {
              value: 6,
              label: '初始入库'
            },
            {
              value: 7,
              label: '赠送入库'
            },
            {
              value: 9,
              label: '订货退回'
            },
            {
              value: 8,
              label: '其他入库'
            },
          ]
        } else {
          return [
            // {
            //   value: 2, // 仅门店端有 - 放订货管理处理
            //   label: '订货入库' // 仅门店端有 - 放订货管理处理
            // },
            // {
            //   value: 3, // 暂无
            //   label: '调拨入库' // 暂无
            // },
            {
              value: 4, // 销售退货
              label: '销售退货' // 销售退货
            },
            // {
            //   value: 5, // 盘库自动处理
            //   label: '盘盈入库' // 盘库自动处理
            // },
            {
              value: 6,
              label: '初始入库'
            },
            {
              value: 7,
              label: '赠送入库'
            },
            {
              value: 8,
              label: '其他入库'
            },
          ]
        }
      } else {
        if (this.currentEntry === 'brand') {
          return [
            {
              value: 11, // 仅品牌
              label: '采购退货' // 仅品牌 退采购出库 == 采购退货
            },
            // {
            //   value: 12, // 仅品牌
            //   label: '订货出库' // 仅品牌 
            // },
            // {
            //   value: 13, // 暂无
            //   label: '调拨出库' // 暂无
            // },
            // {
            //   value: 14, // 销售出库- 品牌暂无
            //   label: '销售出库' // 销售出库- 品牌暂无
            // },
            // {
            //   value: 15, // 盘库自动处理
            //   label: '盘亏出库' // 盘库自动处理
            // },
            {
              value: 16, 
              label: '赠送出库'
            },
            {
              value: 17, 
              label: '其他出库'
            },
          ]
        } else {
          return [
            // {
            //   value: 13, // 暂无
            //   label: '调拨出库' // 暂无
            // },
            {
              value: 14, // 销售出库
              label: '销售出库' // 销售出库
            },
            // {
            //   value: 15, // 盘库自动处理
            //   label: '盘亏出库' // 盘库自动处理
            // },
            {
              value: 18, 
              label: '订货退回'
            },
            {
              value: 19, 
              label: '门店领用'
            },
            {
              value: 16, 
              label: '赠送出库'
            },
            {
              value: 17, 
              label: '其他出库'
            },
          ]
        }
      }
    }
  },
  components: { chooseGoods }
}
</script>
<style lang='scss' scoped>

</style>
