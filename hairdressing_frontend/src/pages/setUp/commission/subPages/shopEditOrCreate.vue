<template>
  <div class="commission-edit-box">
    <seed-header :title="pageStatus === 'edit' ? '编辑提成方案-门店' : '新增提成方案-门店'" :hasTabs="false"></seed-header>
    <div class="commission-edit-main-box scrollbar">
      <div class="commission-edit-container">
        <div class="commission-edit-body" v-loading="loading">
          <el-form  :model="formData" :rules="rules" ref="ruleForm" >
            <el-form-item :label-width="labelWidth" label="适用员工职务" prop="positionId">
              <el-select v-model="formData.positionId" placeholder="请选择员工职务">
                <el-option v-for="lev in staffList" :key="lev.id" :label="lev.name" :value="lev.id"></el-option>
              </el-select>
            </el-form-item>
            <p class="page-info">
              如需修改个人提成方案，请前往
              <!-- 此路由总部不能跳转，如有需求请加条件隐藏 -->
              <router-link class="link-to-other" :label-width="labelWidth" to='/shop-inner/setting/commission-set/staff-set'>“员工提成配置”</router-link>
              。
            </p>
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
            <template v-if="active === 'sub-fixed'">
              <el-table class="sub-table" :data="tableData" border>
                <el-table-column prop="itemName" label="业绩类别">
                  <template slot-scope="scope">
                    {{scope.row.itemName|nameFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="computerBasis" label="业绩计算依据">
                  <template slot-scope="scope">
                    {{scope.row.computerBasis|basisFilter}}
                  </template>
                </el-table-column>
                <el-table-column label="提成方式">
                  <template prop="commissionType" slot-scope="scope">
                    {{scope.row.commissionType||1|commissionTypeFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="commissionRate" label="提成标准">
                  <template slot-scope="scope">
                    <div class="cost-input-box">
                      <input class="cost-input-before" maxlength="12" v-model.number="scope.row.commissionRate">
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
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex"
import SeedHeader from "@/components/common/SeedHeader"
// 阶梯式阶段式要合并单元格， 不要用动态组件来写
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
      tableData: [],
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
      this.tableData = [
        {
          itemName: 'service',
          computerBasis: 1, // 1 劳动业绩 2 现金业绩 3 销售业绩 4 开卡业绩 5 续卡业绩 6 总充值业绩 7 耗卡业绩
          commissionType: 1, // 提成方式 都是百分比
          commissionRate: 0,
        },
        {
          itemName: 'product',
          computerBasis: 3, // 1 劳动业绩 2 现金业绩 3 销售业绩 4 开卡业绩 5 续卡业绩 6 总充值业绩 7 耗卡业绩
          commissionType: 1, // 提成方式 都是百分比
          commissionRate: 0,
        },
        {
          itemName: 'card',
          computerBasis: 3, // 1 劳动业绩 2 现金业绩 3 销售业绩 4 开卡业绩 5 续卡业绩 6 总充值业绩 7 耗卡业绩
          commissionType: 1, // 提成方式 都是百分比
          commissionRate: 0,
        },
      ]
    },
    // 编辑时
    getCommissionData() {
      this.loading = true
      axios.get('/getCommissionStoreById/' + this.shopScheme.id).then(res => {
        let data = res.commissionStoreInfo
        this.formData = {
          name: data.name,
          computeType: data.computeType, 
          positionId: data.positionId,
          id: data.id
        }
        this.tableData = data.commissionStoreDetail
        this.loading = false
      })
    },
    // -------------------- 固定提成 start -------------------- 
    /** 数据校验函数
      * 普通会员 - memberCommon -> firstValue  | arg_1st
      * 身份会员 - memberIdentity -> secondValue | arg_2nd
    **/
    checkIfInputIsLegal(target, arg_1st) {
      let result = 1
      for (let i = 0; i < target.length; i++) {
        let t = target[i]
        // if (t.commissionType === 1) {
          if (typeof(t[arg_1st]) === 'number' && t[arg_1st] >= 0 && t[arg_1st] <= 100) {
          } else {
            result = 2
            break
          }
        // } else {
        //   result = 4
        //   break
        // }
      }
      return result
    },
    // -------------------- 固定提成 end ---------------------- 
    // -------------------- 阶梯提成 start -------------------- 
    // -------------------- 阶梯提成 end ---------------------- 
    // -------------------- 阶段提成 start -------------------- 
    // -------------------- 阶段提成 end ---------------------- 
    save() {
      // 需要校验一下输入框是否合法
      let params = null
      if (this.formData.computeType === 1) {
        let status = this.checkIfInputIsLegal(this.tableData, 'commissionRate',)
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
            params = {
              ...this.formData,
              commissionStoreDetail: this.tableData,
              brandId: this.currentInfo.brandId,
              storeId: this.currentInfo.shopId,
            }
            this.btnLoading = true
            axios.post('/saveOrUpdateCommissionStore', params).then(res => {
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
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      shopScheme: state => state.commission.shopScheme, // 产品提成方案...
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
    }
  },
  filters: {
    nameFilter(type) {
      let typeMap = {
        'service': '服务',
        'product': '产品',
        'card': '卡项',
      }
      return typeMap[type]
    },
    basisFilter(type) {
      let typeMap = {
        '1': '劳动业绩',
        '2': '现金业绩',
        '3': '销售业绩',
        '4': '开卡业绩',
        '5': '续卡业绩',
        '6': '总充值业绩',
        '7': '耗卡业绩',
      }
      return typeMap[type]
    },
    commissionTypeFilter(type) {
      let typeMap = {
        '1': '比例提成',
        '2': '固定提成'
      }
      return typeMap[type]
    },
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
    min-height: calc(100vh - 205px);
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
  min-height: calc(100vh - 505px);
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
  min-height: calc(100vh - 505px);
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
