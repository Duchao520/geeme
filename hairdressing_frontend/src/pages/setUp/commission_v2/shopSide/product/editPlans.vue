<template>
  <full-single-page type="commission" :title="title">
    <div class="edit-commission-plans" v-loading="loading">
      <el-form  :model="formData" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="适用职务" required="">
          {{productScheme.postName || productScheme.postInfoList.map(i => i.postName).join('; ')}}
        </el-form-item>
        <el-form-item label="方案名称" prop="name">
          <el-input class="commission-name" v-model="formData.name" placeholder="请输入方案名称" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="计算方式" prop="computeType" required>
          <el-radio v-model="formData.computeType" :label="1">固定式</el-radio>
          <el-radio v-model="formData.computeType" :label="2" disabled>阶梯式</el-radio>
          <el-radio v-model="formData.computeType" :label="3" disabled>阶段式</el-radio>
        </el-form-item>
        <p class="page-info usual-ok">{{computeTypeInfo}}</p>
      </el-form>
      <div class="commission-body-table">
        <!-- 动态组件满足不了单元格实时合并.编辑时很难受. -->
        <!-- <component :is="active"></component> -->
        <!-- 固定式表格 -->
        <template v-if="active === 'sub-fixed'">
          <!-- <el-table class="sub-table" :data="tableData" border :span-method="arraySpanMethod"> -->
          <el-table class="sub-table" :data="tableData" border useVirtual height="616" :row-height="48" :excess-rows="8">
            <el-table-column prop="levelOneName" label="一级分类">
              <template slot-scope="scope">
                <span>{{scope.row.levelOneName}}</span><br>
                <span class="volume-btn" @click="volumeSet_fixed(scope.row, 1)">批量设置</span>
              </template>
            </el-table-column>
            <el-table-column prop="levelTwoName" label="二级分类">
              <template slot-scope="scope">
                <span>{{scope.row.levelTwoName}}</span><br>
                <span class="volume-btn" @click="volumeSet_fixed(scope.row, 2)">批量设置</span>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>
                  {{scope.row.productName}}
                </span>
                <br>
                <span>
                  {{scope.row.specificationsName}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="shopPrice" label="专柜价(￥)" show-overflow-tooltip width="100"></el-table-column>
            <!-- 支付方式 -->
            <el-table-column prop="payType" label="支付方式" width="90">
              <template slot-scope="scope">
                {{scope.row.payType|payTypeFilter}}
              </template>
            </el-table-column>

            <!-- 业绩计算方式 -->
            <el-table-column prop="performanceType" label="业绩计算方式" width="280">
              <template slot-scope="scope">
                <div class="performance-type-box">
                  <!-- 支付方式为赠送时: 后端给出了默认的计算方式为 固定 ; 模板中也要固定-->
                  <el-select 
                    v-model="scope.row.performanceType" 
                    :disabled="scope.row.payType === 6"
                    placeholder="业绩计算方式" 
                    @change='tablePerformanceType(scope.row.performanceType, scope.$index, "tableData")'
                  >
                    <el-option label='-请选择-' :value="0"></el-option>
                    <el-option label='实收' :value="1"></el-option>
                    <el-option label='固定' :value="2"></el-option>
                    <el-option label='折扣' :value="3"></el-option>
                    <el-option label='定扣' :value="4"></el-option>
                    <!-- <el-option label='固定卡' :value="5"></el-option> -->
                  </el-select>
                  <!-- 实收方式 不显示输入 -->
                  <div class="cost-input-box" v-show="scope.row.performanceType !== 1">
                    <input class="cost-input-before" maxlength="6" v-model.number="scope.row.performance">
                    <span  class="cost-input-after">{{scope.row.performanceType === 3 ? '折' : '元'}}</span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- 提成方式 -->
            <el-table-column prop="commissionType" label="提成方式" width="140">
              <template slot-scope="scope">
                <el-select v-model="scope.row.commissionType" placeholder="提成分配">
                  <el-option label='-请选择-' :value="0"></el-option>
                  <el-option label='比例提成' :value="1"></el-option>
                  <el-option label='固定提成' :value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="cardMemberCommission" label="持卡会员" width="140">
              <template slot-scope="scope">
                <div class="cost-input-box">
                  <input class="cost-input-before" maxlength="12" v-model.number="scope.row.cardMemberCommission" placeholder="持卡会员">
                  <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="commission" label="普通会员" width="140">
              <template slot-scope="scope">
                <div class="cost-input-box">
                  <input class="cost-input-before" maxlength="12" v-model.number="scope.row.commission" placeholder="普通会员">
                  <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
                </div>
              </template>
            </el-table-column>
            
          </el-table>
        </template>
      </div>
      <div class="btn-line">
        <el-button class="normal_blue_btn"  @click="save" :loading="btnLoading">保 存</el-button>
        <el-button plain class="plain_gray_btn" @click="close">取 消</el-button>
      </div>
    </div>

    <!-- 固定方式-批量设置弹窗 -->
    <el-dialog 
      class="fixed-dialog-box" 
      title='批量设置提成' 
      :visible.sync="fixedDialogVisible" 
      width="1140px"
      :close-on-click-modal="false"
    >
      <div class="fixed-dialog-body">
        <el-table :data="templateTable" :header-cell-style="headerRowStyle" border :span-method="objectSpanMethod" v-loading="setTemplateLoading">
          <el-table-column prop="shopPrice" label="一级分类" show-overflow-tooltip>
            <template slot-scope="scope">
              {{templateCommonInfo.levelOneName}}
            </template>
          </el-table-column>
          <el-table-column 
            prop="shopPrice" 
            label="二级分类" 
            show-overflow-tooltip 
            v-if="templateCommonInfo.levelTwo"
          >
            <template slot-scope="scope">
              {{templateCommonInfo.levelTwoName}}
            </template>
          </el-table-column>

          <!-- 支付方式 -->
          <el-table-column prop="payType" label="支付方式" width="90">
            <template slot-scope="scope">
              {{scope.row.payType|payTypeFilter}}
            </template>
          </el-table-column>

          <!-- 业绩计算方式 -->
          <el-table-column prop="performanceType" label="业绩计算方式" width="280">
            <template slot-scope="scope">
              <div class="performance-type-box">
                <!-- 支付方式为赠送时: 后端给出了默认的计算方式为 固定 ; 模板中也要固定-->
                <el-select 
                  v-model="scope.row.performanceType" 
                  :disabled="scope.row.payType === 6"
                  placeholder="业绩计算方式" 
                  @change='tablePerformanceType(scope.row.performanceType, scope.$index, "templateTable")'
                >
                  <el-option label='实收' :value="1"></el-option>
                  <el-option label='固定' :value="2"></el-option>
                  <el-option label='折扣' :value="3"></el-option>
                  <el-option label='定扣' :value="4"></el-option>
                  <!-- <el-option label='固定卡' :value="5"></el-option> -->
                </el-select>
                <!-- 实收方式 不显示输入 -->
                <div class="cost-input-box" v-show="scope.row.performanceType !== 1">
                  <input class="cost-input-before" maxlength="6" v-model.number="scope.row.performance">
                  <span  class="cost-input-after">{{scope.row.performanceType === 3 ? '折' : '元'}}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 提成方式 -->
          <el-table-column prop="commissionType" label="提成方式" width="140">
            <template slot-scope="scope">
              <el-select v-model="scope.row.commissionType" placeholder="提成分配">
                <el-option label='比例提成' :value="1"></el-option>
                <el-option label='固定提成' :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="cardMemberCommission" label="持卡会员" width="140">
            <template slot-scope="scope">
              <div class="cost-input-box">
                <input class="cost-input-before" maxlength="12" v-model.number="scope.row.cardMemberCommission" placeholder="持卡会员">
                <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="commission" label="普通会员" width="140">
            <template slot-scope="scope">
              <div class="cost-input-box">
                <input class="cost-input-before" maxlength="12" v-model.number="scope.row.commission" placeholder="普通会员">
                <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="dialog-inner-info">批量设置后，该分类下未来新增的产品将默认采用该提成比例。</div> -->
        <div class="dialog-btn-line">
          <el-button class="normal_gray_btn" @click="fixedDialogVisible = false">取 消</el-button>
          <el-button class="normal_blue_btn" :loading="setTemplateLoading" @click="saveFixedModel">确认设置</el-button>
        </div>
      </div>
    </el-dialog>
  </full-single-page>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { reg } from '@/assets/js/RegExp'
import { mapState } from "vuex"
import { types } from 'util'
export default {
  data() {
    return {
      formData: {
        name: '', 
        computeType: 1,
      },
      rules: {
        name: [
          {required: true, min: 2, max: 16, message: '请输入方案名称', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'change'},
        ],
      },
      computeTypeInfo: '',
      tableData: [],
      firstColSpan: [], // 
      secondColSpan: [],
      threeColSpan: [],
      loading: false, 
      btnLoading: false, 
      fixedDialogVisible: false, // 固定提成方案批量设置对话框
      setTemplateLoading: false, // 批量设置可能耗时较长， 需要处理加载中
      // 批量设置的数据部分
      templateTable: [ 
        // - 按产品、服务、卡项具体类型的数据设置， 一、二级分类id另外提供；这里仅提供支付方式及后面的数据，(服务再多一个工位列)
        // 全部支付方式: 1=现金,2=储值金,3=赠送金,4=次卡,5=时间卡,6=赠送
        // 产品支付方式 1=现金,2=储值金,3=赠送金,6=赠送; (,4=次卡,5=时间卡, 不做)
        // 产品业绩计算方式 1=实收,2=固定,3=折扣,4=定扣; (,5=固定卡 - 暂时不做) performanceType
        // - 以下数据的顺序按后端给的主列表的支付方式的顺序处理
        {
          payType: 1, // 支付方式-现金
          performanceType: null, // 业绩计算方式
          performance: null, // 业绩计算金额或者折扣率
          commissionType: null, // 提成方式 1=比例提成 2=固定提成
          cardMemberCommission: null, // 持卡会员提成金额或者比例
          commission: null, // 普通会员提成金额或者比例
        },
        {
          payType: 3, // 支付方式-赠送金
          performanceType: null, // 业绩计算方式 
          performance: null, // 业绩计算金额或者折扣率
          commissionType: null, // 提成方式 1=比例提成 2=固定提成
          cardMemberCommission: null, // 持卡会员提成金额或者比例
          commission: null, // 普通会员提成金额或者比例
        },
        {
          payType: 2, // 支付方式-储值金
          performanceType: null, // 业绩计算方式
          performance: null, // 业绩计算金额或者折扣率
          commissionType: null, // 提成方式 1=比例提成 2=固定提成
          cardMemberCommission: null, // 持卡会员提成金额或者比例
          commission: null, // 普通会员提成金额或者比例
        },
        {
          payType: 6, // 支付方式-赠送
          performanceType: 2, // 业绩计算方式- 这里须写死 - 固定
          performance: null, // 业绩计算金额或者折扣率
          commissionType: null, // 提成方式 1=比例提成 2=固定提成
          cardMemberCommission: null, // 持卡会员提成金额或者比例
          commission: null, // 普通会员提成金额或者比例
        },
      ],
      // 批量设置的模板公共部分 （一级分类、二级分类）
      templateCommonInfo: {
        levelOne: null, // 一级分类
        levelOneName: null, // 一级分类名称
        levelTwo: null, // 二级分类
        levelTwoName: null, // 二级分类名称
      },
      headerRowStyle: { background: '#f4f5f7' }, // 表头样式
    }
  },
  created() {
    if (this.productScheme.type === 'create') {
      this.initCreatedTableData()
    } else {
      this.initCreatedTableData(this.productScheme.id)
      this.formData.name = this.productScheme.name
      this.formData.computeType = this.productScheme.computeType
    }
  },
  methods: {
    // 新增固定提成方案
    initCreatedTableData(id) {
      this.loading = true
      // this.firstColSpan = []
      // this.secondColSpan = []
      // this.threeColSpan = []
      axios.post('/newGetCommissionProductDetail', {storeId: this.currentInfo.shopId, commissionProductId: id}).then(res => {
        this.tableData = res.newCommissionProductDetailList
        // this.setSpanData(this.tableData, this.firstColSpan, 'levelOne')
        // this.setSpanData(this.tableData, this.secondColSpan, 'levelTwo')
        // this.setSpanData(this.tableData, this.threeColSpan, 'specificationsId')
        this.loading = false
      })
    },
    // - 
    save() {
      for(let i = 0, len = this.tableData.length; i < len; i++) {
        if (this.tableData[i].performanceType === 3 && !reg.discount.test(this.tableData[i].performance) && !!this.tableData[i].performance ) {
          // 如果是折扣计算方式， 校验折扣数值
          return this.$message({ type: 'error', message: '请输入0~10的折扣率, 最多2位小数, 10表示不打折' }) 
        } else if (this.tableData[i].commissionType === 1 && (!reg.percent.test(this.tableData[i].commission) && !!this.tableData[i].commission || this.tableData[i].cardMemberCommission && !reg.percent.test(this.tableData[i].cardMemberCommission))) {
          // 如果提成方式是比例， 校验持卡会员、普通会员比例值
          return this.$message({ type: 'error', message: '请输入0~100的百分比, 最多2位小数' }) 
        }
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.productScheme))
          delete data.type
          delete data.name
          this.btnLoading = true
          this.loading = true
          let url = '/newSaveOrUpdateCommissionProduct'
          if (this.productScheme.postInfoList.length && this.productScheme.type === 'create') {
            // 批量新增
            url = '/newSaveCommissionProductByBatch'
          }
          axios.post(url, {
            newCommissionProductDetailList: this.tableData, 
            newCommissionProductInfo: {
              ...data,
              ...this.formData, 
              storeId: this.currentInfo.shopId,
              brandId: this.currentInfo.brandId,
            }
          }).then(res => {
            this.btnLoading = false
            this.loading = false
            this.$message({type: res.success ? 'success' : 'error', message: res.message})
            this.close()
          }).catch(err => {
            this.btnLoading = false
            this.loading = false
          })
        } else {
          this.$message({type: 'error',message: '请输入正确的方案名称'})
        }
      })
    },
    close() {
      this.$router.go(-1)
    },
    // 业绩计算方式的变化， 改变实收的业绩值为空 (主表格及模板共用)
    tablePerformanceType(type, index, table) {
      if (type === 1) {
        this[table][index].performance = null
      }
    },
    // 批量设置-打开面板
    volumeSet_fixed(row, col) {
      if (col === 1) {
        this.templateCommonInfo = {
          levelOne: row.levelOne, // 一级分类
          levelOneName: row.levelOneName, // 一级分类名称
          levelTwo: null, // 二级分类
          levelTwoName: null, // 二级分类名称
        }
      } else {
        this.templateCommonInfo = {
          levelOne: row.levelOne, // 一级分类
          levelOneName: row.levelOneName, // 一级分类名称
          levelTwo: row.levelTwo, // 二级分类
          levelTwoName: row.levelTwoName, // 二级分类名称
        }
      }
      this.fixedDialogVisible = true
    },
    // 批量设置-提交
    saveFixedModel() {
      // 校验各字段的合法性
      let payTypeObj = {}
      for(let i = 0, len = this.templateTable.length; i < len; i++) {
        if (this.templateTable[i].performanceType === 3 && !reg.discount.test(this.templateTable[i].performance) && !!this.templateTable[i].performance ) {
          // 如果是折扣计算方式， 校验折扣数值
          return this.$message({ type: 'error', message: '请输入0~10的折扣率, 最多2位小数, 10表示不打折' }) 
        } else if (this.templateTable[i].commissionType === 1 && (!reg.percent.test(this.templateTable[i].commission) && !!this.templateTable[i].commission || this.templateTable[i].cardMemberCommission && !reg.percent.test(this.templateTable[i].cardMemberCommission))) {
          // 如果提成方式是比例， 校验持卡会员、普通会员比例值
          return this.$message({ type: 'error', message: '请输入0~100的百分比, 最多2位小数' }) 
        } else {
          payTypeObj[this.templateTable[i].payType] = this.templateTable[i] 
        }
      }
      this.setTemplateLoading = true
      // 将模板的各支付方式的数据重新处理并应用到主表中
      let tag = this.templateCommonInfo.levelTwo ? 'levelTwo' : 'levelOne'
      // 取出匹配的数据并覆盖
      let target = this.tableData.filter(i => { return i[tag] === this.templateCommonInfo[tag] })
      target.map(i => Object.assign(i, payTypeObj[i.payType]))
      this.fixedDialogVisible = false
      this.setTemplateLoading = false
    },
    // - 单元格合并 - 主表格
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      let _row = 1
      let _col = 1
      if (columnIndex === 0) {
        _row = this.firstColSpan[rowIndex]
      } else if (columnIndex === 1) {
        _row = this.secondColSpan[rowIndex]
      } else if (columnIndex === 2 || columnIndex === 3) {
        _row = this.threeColSpan[rowIndex]
      }
      _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    },
    // 合并批量设置表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ( columnIndex < (this.templateCommonInfo.levelTwo ? 2 : 1)) {
        if (rowIndex === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      productScheme: state => state.commission.productScheme, // 产品提成方案...
    }),
    title() {
      let type = this.productScheme.type === 'create' ? '新增' : '编辑'
      return `${type}提成方案-产品`
    },
    // 以后的组件激活
    active() {
      let c = ''
      switch (this.formData.computeType) {
        // case 2:
        //   c = 'sub-fixed'
        //   this.computeTypeInfo = '劈里啪啦'
        //   break
        // case 3:
        //   c = 'sub-fixed'
        //   this.computeTypeInfo = '稀里哗啦'
        //   break
        default:
          c = 'sub-fixed'
          this.computeTypeInfo = '指的是提成不随其他因素变化。' // 该描述要随切换动态变化
      }
      return c
    }
  },
  watch: {},
  filters: {
    // 支付方式
    payTypeFilter(payType) {
      let map ={
        1: '现金类',
        2: '储值金',
        3: '赠送金',
        4: '次卡', // 产品没有
        5: '时间卡', // 产品没有
        6: '赠送',
      }
      return map[payType]
    },
    // 
  }
}
</script>
<style lang='scss' scoped>
$blue: #58C9F3;
$gray: #d5dadf;
.edit-commission-plans {
  padding: 48px 70px 40px;
  position: relative;
}
// - 页头公共部分:
.commission-name {
  width: 420px;
}
p.page-info {
  .link-to-other {
    color: $blue;
  }
  font-size: 12px;
  color: #666;
  margin-top: -4px;
  margin-bottom: 20px;
  text-indent: 110px;
  &.usual-ok {
    margin-top: -16px;
  }
}

.commission-body-table {
  margin-bottom: 60px;
}
.btn-line {
  position: absolute;
  bottom: 40px;
  margin-top: 20px;
  .el-button {
    width: 100px;
  }
}
.performance-type-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  .cost-input-box {
    margin-left: 4px;
  }
}
#app .cost-input-box {
  display: flex;
  width: 110px;
  font-size: 14px;
  .cost-input-before {
    width: 80px;
    height: 30px;
    outline: none;
    border: 1px solid $gray;
    border-radius: 4px 0 0 4px;
    text-indent: 4px;
    &::placeholder {
      color: #c7cad1;
    }
  }
  .cost-input-after {
    flex: 1;
    width: 32px;
    height: 32px;
    line-height: 32px;
    background: $gray;
    color: #fff;
    text-align: center;
    border-radius: 0 4px 4px 0;
  }
}
.volume-btn {
  color: $blue;
  &:hover { cursor: pointer; }
}
.fixed-dialog-box {
  /deep/ .el-dialog__body {
    padding: 18px 35px;
    border-top: 1px solid #f0f1f4;
  }
}
.dialog-btn-line {
  text-align: right;
  margin-top: 12px;
}
</style>
