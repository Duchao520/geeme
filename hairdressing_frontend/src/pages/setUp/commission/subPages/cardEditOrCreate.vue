<template>
  <div class="commission-edit-box">
    <seed-header :title="pageStatus === 'edit' ? '编辑提成方案-卡项' : '新增提成方案-卡项'" :hasTabs="false"></seed-header>
    <div class="commission-edit-main-box scrollbar">
      <div class="commission-edit-container">
        <div class="commission-edit-body" v-loading="loading">
          <el-form  :model="formData" :rules="rules" ref="ruleForm" >
            <el-form-item :label-width="labelWidth" label="适用员工职务" prop="positionId">
              <el-select v-model="formData.positionId" placeholder="请选择员工职务">
                <el-option v-for="lev in staffList" :key="lev.id" :label="lev.name" :value="lev.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- 此路由总部不能跳转，如有需求请加条件隐藏 -->
            <!-- <p class="page-info">
              如需修改个人提成方案，请前往
              <router-link class="link-to-other" :label-width="labelWidth" to='/shop-inner/setting/commission-set/staff-set'>“员工提成配置”</router-link>
              。
            </p> -->
            <el-form-item :label-width="labelWidth" label="方案名称" prop="name">
              <el-input class="commission-name" v-model="formData.name" placeholder="请输入方案名称" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item :label-width="labelWidth" label="计算方式" prop="computeType">
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
            <!--  :span-method="arraySpanMethod" -->
            <template v-if="active === 'sub-fixed'">
              <el-table class="sub-table" :data="tableData" border :span-method="arraySpanMethod">
                <el-table-column prop="cardType" label="卡项分类">
                  <template slot-scope="scope">
                    <span>{{scope.row.cardType|cardTypeFilter}}</span><br>
                    <span class="volume-btn" @click="volumeSet_fixed(scope.row, 'One')">批量设置</span>
                  </template>
                </el-table-column>
                <el-table-column prop="cardName" label="卡项名称" show-overflow-tooltip></el-table-column>
                <el-table-column label="售价/首充额（元）" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{priceOfTableCol(scope.row)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="commissionType" label="提成方式">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.commissionType" placeholder="选择提成分配方式">
                      <el-option label='比例提成' :value="1"></el-option>
                      <el-option label='固定提成' :value="2"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="openCard" label="开卡提成">
                  <template slot-scope="scope">
                    <div class="cost-input-box">
                      <input class="cost-input-before" maxlength="12" v-model.number="scope.row.openCard">
                      <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="renewCard" label="续卡提成">
                  <template slot-scope="scope">
                    <div class="cost-input-box">
                      <input class="cost-input-before" maxlength="12" v-model.number="scope.row.renewCard">
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
      </div> 
    </div>
    <!-- 固定方式-批量设置弹窗 -->
    <el-dialog class="fixed-dialog-box" title='批量设置提成' :visible.sync="fixedDialogVisible" width="720px">
      <div class="fixed-dialog-body">
        <div style="margin-bottom:10px;">分类: {{volumeTitle|cardTypeFilter}}</div>
        <el-table :data="currentVolume_fixed" :header-cell-style="headerRowStyle">
          <el-table-column label="售价/首充额（元）">
            <template slot-scope="scope">
              <span>{{priceOfTableCol(scope.row)}}</span>
            </template></el-table-column>
          <el-table-column prop="commissionType" label="提成方式">
            <template slot-scope="scope">
              <el-select v-model="scope.row.commissionType">
                <el-option label='比例提成' :value="1"></el-option>
                <el-option label='固定提成' :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="openCard" label="开卡提成"> -->
          <!-- 通用模板接口用第几个输入框标识 -->
          <el-table-column prop="firstValue" label="开卡提成">
            <template slot-scope="scope">
              <div class="cost-input-box">
                <input class="cost-input-before" maxlength="12" v-model.number="scope.row.firstValue">
                <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="renewCard" label="续卡提成"> -->
          <!-- 通用模板接口用第几个输入框标识 -->
          <el-table-column prop="secondValue" label="续卡提成">
            <template slot-scope="scope">
              <div class="cost-input-box">
                <input class="cost-input-before" maxlength="12" v-model.number="scope.row.secondValue">
                <span  class="cost-input-after">{{scope.row.commissionType === 1 ? '%' : '元'}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-inner-info">批量设置后，该分类下未来新增的卡项将默认采用该提成比例。</div>
        <div class="dialog-btn-line">
          <el-button class="normal_gray_btn" @click="fixedDialogVisible = false">取 消</el-button>
          <el-button class="normal_blue_btn" @click="saveFixedModel">确认设置</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex"
import SeedHeader from "@/components/common/SeedHeader"
// import subFixed from './sub_fixed' // 不要尝试用动态组件写了[组件已经删除]
// ---- 该页面后续代码较多， 请按规划区域写css和js ----
export default {
  data() {
    return {
      loading: false,
      btnLoading: false,
      labelWidth: '110px',
      computeTypeInfo: '',
      pageStatus: '', // 新增 编辑
      staffList: [],
      formData: { name: '', computeType: 1, positionId: null },
      // 以下[固定式]子组件使用
      fixedDialogVisible: false,
      // currentColIndex: '', // 是第1列还是第2列
      currentVolume_fixed: [{coveringSubClass: false}], // 当前操作的批量设置数据, 内部就一个对象
      volumeTitle: '', // 当前操作的批量设置数据的分类标题
      inheritFirstClass_fixed: false, // 是否继承1级分类模板
      tableData: [],
      firstColSpan: [],
      headerRowStyle: { background: '#f4f5f7' }, // 表头样式
      // 以下[阶梯式]子组件使用
      // 以下[阶段式]子组件使用
      // - 其他公共
      rules: {
        positionId: [{required: true, message: '请选择职务', trigger: 'change'}],
        name: [
          {required: true, min: 2, max: 16, message: '请输入方案名称', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'change'},
        ],
        computeType: [{required: true, message: '请选择计算方式', trigger: 'change'}],
      }
    }
  },
  created() {
    this.getAllSaftt() 
    this.pageStatus = this.$route.path.indexOf('add-new') === -1 ? 'edit' : 'add'
    if (this.pageStatus === 'add') {
      this.initFixedTableInAdd()
    } else {
      this.getCommissionData()
    }
  },
  methods: {
    // 职级选项
    getAllSaftt() {
      axios.get(`/getAllSimpleStoreStaffLevelList/${this.currentInfo.brandId}`).then(res => {
        this.staffList = res.levelList
      })
    },
    // 新增时
    initFixedTableInAdd() {
      this.loading = true
      this.firstColSpan = []
      axios.post('/getStoreCardCommissionInfo', {brandId: this.currentInfo.brandId, storeId: this.currentInfo.shopId}).then(res => {
        this.tableData = res.listCardCommissionInfo
        this.setSpanData(this.tableData, this.firstColSpan, 'cardType')
        this.loading = false
      })
    },
    // 编辑时
    getCommissionData() {
      this.loading = true
      this.firstColSpan = []
      let data = {
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        commissionCardId: this.cardScheme.id
      }
      axios.post('/getStoreCommissionCardById/', data).then(res => {
        this.formData = {
          name: res.name,
          computeType: res.computeType, 
          positionId: res.positionId,
          id: res.id
        }
        this.tableData = res.listCardCommissionInfo
        // 编辑时合并的单元格字段可能要修改(阶梯、阶段式)
        this.setSpanData(this.tableData, this.firstColSpan, 'cardType')
        this.loading = false
      })
    },
    // -------------------- 固定提成 start -------------------- 
    // 打开批量设置面板
    volumeSet_fixed(row, col) {
      // this.currentColIndex = col // 第一列 One 第二列 Two
      this.volumeTitle = row.cardType
      // 部分数据从模板取: 1、提成方式 2、普通会员 3、身份会员
      let params = {
        classId: row.cardType,
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        type: "card"
      }
      this.loading = true
      axios.post('/getCommissionTemplate', params).then(res => {
        this.loading = false
        this.currentVolume_fixed = [{
          ...res.commissionTemplateInfo, 
          classId: row.cardType,
          cardType: row.cardType,
          cardPrice: row.cardPrice,
          cardFirstRechargeNum: row.cardFirstRechargeNum,
        }]
        this.fixedDialogVisible = true
      }).catch(err => {
        this.loading = false
      })
    },
    // 保存批量设置模板。并设置表格 // 需要输入校验
    saveFixedModel() {
      let status = this.checkIfInputIsLegal(this.currentVolume_fixed, 'firstValue', 'secondValue')
      if (status === 2) {
        utils.showTip(this, {msg: '提成比例需要在 0~100 之间的阿拉伯数字', type: 'error'})
        return
      } else if (status === 3) {
        utils.showTip(this, {msg: '提成值需要是大于等于 0 的阿拉伯数字', type: 'error'})
        return
      } else if (status === 4) {
        utils.showTip(this, {msg: '提成方式不能为空', type: 'error'})
        return
      }
      let templateData = this.currentVolume_fixed[0]
      let params = {
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        commissionType: templateData.commissionType,
        firstValue: templateData.firstValue,
        secondValue: templateData.secondValue,
        parentClassId: 0,
        classId: templateData.cardType,
        type: 'card'
      }
      axios.post('/saveOrUpdateTemplate', params).then(res => {
        // this.tableData : 目标对象 // templateData : 模板对象
        let id = templateData.cardType
        this.tableData.map(row => {
          if (row.cardType === id) {
            row.commissionType = templateData.commissionType
            row.openCard = templateData.firstValue
            row.renewCard = templateData.secondValue
          }
        })
        this.fixedDialogVisible = false
      }).catch(err => {
        this.fixedDialogVisible = false
      })
    },
    /** 数据校验函数
      * 普通会员 - openCard -> firstValue  | arg_1st
      * 身份会员 - renewCard -> secondValue | arg_2nd
    **/
    checkIfInputIsLegal(target, arg_1st, arg_2nd) {
      let result = 1
      for (let i = 0; i < target.length; i++) {
        let t = target[i]
        if (t.commissionType === 1) {
          if (typeof(t[arg_1st]) === 'number' && typeof(t[arg_2nd]) === 'number' && t[arg_1st] >= 0 && t[arg_2nd] >= 0 && t[arg_1st] <= 100 && t[arg_2nd] <= 100 ) {
          } else {
            result = 2
            break
          }
        } else if (t.commissionType === 2) {
          if (typeof(t[arg_1st]) === 'number' && typeof(t[arg_2nd]) === 'number' && t[arg_1st] >= 0 && t[arg_2nd] >= 0) {
          } else {
            result = 3
            break
          }
        } else {
          result = 4
          break
        }
      }
      return result
    },
    // - 单元格合并 start -
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      let _row = 1
      let _col = 1
      if (columnIndex === 0) {
        _row = this.firstColSpan[rowIndex]
      }
      _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    },
    // - 单元格合并 end -
    // -------------------- 固定提成 end ---------------------- 
    // -------------------- 阶梯提成 start -------------------- 
    // -------------------- 阶梯提成 end ---------------------- 
    // -------------------- 阶段提成 start -------------------- 
    // -------------------- 阶段提成 end ---------------------- 
    save() {
      // 需要校验一下输入框是否合法
      let params = null
      if (this.formData.computeType === 1) {
        let status = this.checkIfInputIsLegal(this.tableData, 'openCard', 'renewCard')
        if (status === 2) {
          utils.showTip(this, {msg: '提成比例需要在 0~100 之间的阿拉伯数字', type: 'error'})
          return
        } else if (status === 3) {
          utils.showTip(this, {msg: '提成值需要是大于等于 0 的阿拉伯数字', type: 'error'})
          return
        } else if (status === 4) {
          utils.showTip(this, {msg: '提成方式不能为空', type: 'error'})
          return
        }
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            let tableData = []
            this.tableData.map(i => {
              tableData.push({
                cardId: i.cardKindId,
                commissionCardId: i.commissionCardId,
                commissionType: i.commissionType,
                openCard: i.openCard,
                renewCard: i.renewCard,
              })
            })
            params = {
              ...this.formData,
              detailInfos: tableData,
              brandId: this.currentInfo.brandId,
              storeId: this.currentInfo.shopId
            }
            this.btnLoading = true
            axios.post('/saveOrUpdateStoreCommissionCard', params).then(res => {
              this.btnLoading = false
              utils.showTip(this, {msg: '保存成功!', type: 'success'})
              this.close()
            }).catch(err => {
              this.btnLoading = false
            })
          } else {
            utils.showTip(this, {msg: '请完善职务和方案名称', type: 'error'})
            return
          }
        })
      } else if (this.formData.computeType === 2) {
      } else if (this.formData.computeType === 3) {
      }
    },
    close() {
      this.$router.go(-1)
    },
    // 售价和首充金额...
    priceOfTableCol(row) {
      let price = null
      switch (row.cardType) {
        case 0: // 身份卡
          price = row.cardPrice
          break
        case 1: // 充值卡
          price = row.cardFirstRechargeNum
          break
        case 2:
          price = ''
          break
        case 3:
          price = ''
          break
      }
      return price
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      cardScheme: state => state.commission.cardScheme, // 卡项提成方案...
    }),
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
    },
  },
  filters: {
    cardTypeFilter(type) {
      let typeMap = {
        0: '身份卡',
        1: '储值卡',
        2: '次卡',
        3: '时间卡'
      }
      return typeMap[type]
    }
  }
}
</script>

<style lang="scss">
#app .commission-edit-box .fixed-dialog-box {
  .el-dialog__body {
    padding: 18px 35px;
    border-top: 1px solid #f0f1f4;
  }
}
</style>

<style scoped lang="scss">
@import "@/assets/css/scrollbar.scss";
$blue: #58C9F3;
$gray: #d5dadf;
// - 滚动条在外侧的4层布局:
.commission-edit-box {
  display: flex;
  justify-content: center;
  .commission-edit-main-box {
    width: calc(100vw - 40px);
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
  }
  .commission-edit-container {
    min-height: calc(100vh - 105px);
  }
  .commission-edit-body {
    max-width: 1440px;
    min-height: 100%;
    box-sizing: border-box;
    padding: 40px 70px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
  }
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
.btn-line {
  margin-top: 20px;
  .el-button {
    width: 100px;
  }
}
.commission-body-table {
  padding: 10px;
  min-height: calc(100vh - 459px);
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
}
// - 固定提成方式:
.dialog-inner-info {
  margin-top:10px; 
  font-size:12px; 
  color: #999;
}
.dialog-btn-line {
  text-align: right;
}
.sub-table {
  min-height: calc(100vh - 459px);
}
.volume-btn {
  color: $blue;
  &:hover { cursor: pointer; }
}
// - 阶梯提成方式

// - 阶段提成方式

// - 表格输入框(公共)
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
</style>
