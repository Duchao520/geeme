<template>
  <div class>
    <div class="con scrollbar" v-loading="pageLoading">
      <el-form :inline="true" :model="formData" class="demo-form-inline" label="业绩计算依据" label-width='100px' label-position='right'>
        <h3 class="form-h3">劳动业绩计算</h3>
        <div class="box-border">
          <el-form-item label="现金结算">
            <el-radio-group v-model="formData.laborCash">
              <el-radio :label="1">按服务售价</el-radio>
              <el-radio :label="2">按收款金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="laborCashTextInfo"></span>
          <br>
          <el-form-item label="储值卡结算">
            <el-radio-group v-model="formData.laborCard">
              <el-radio :label="1">按赠送金比例计算折扣</el-radio>
              <el-radio :label="2">按耗卡金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="laborCardTextInfo"></span>
          <br>
          <!-- v2 注释 -->
          <!-- <el-form-item label="提成扣成本">
            <el-radio-group v-model="formData.laborCommission">
              <el-radio :label="1">不扣成本</el-radio>
              <el-radio :label="2">扣成本</el-radio>
            </el-radio-group>
            <div class="select-button" v-if="checkHasBtnPermission('shop_commission_base_save')" @click="laborDialogVisible=true">选择服务</div>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="laborCommissionTextInfo"></span>
          <br> -->
        </div>
        <h3 class="form-h3">销售业绩计算</h3>
        <div class="box-border">
          <el-form-item label="现金结算">
            <el-radio-group v-model="formData.salesCash">
              <el-radio :label="1">按商品售价</el-radio>
              <el-radio :label="2">按收款金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="salesCashTextInfo"></span>
          <el-form-item label="储值卡结算">
            <el-radio-group v-model="formData.salesCard">
              <el-radio :label="1">按赠送金比例计算折扣</el-radio>
              <el-radio :label="2">按耗卡金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="salesCardTextInfo"></span>
          <!-- v2 注释 -->
          <!-- <el-form-item label="提成扣成本">
            <el-radio-group v-model="formData.salesCommission">
              <el-radio :label="1">不扣成本</el-radio>
              <el-radio :label="2">扣成本</el-radio>
            </el-radio-group>
            <div class="select-button" v-if="checkHasBtnPermission('shop_commission_base_save')" @click="salesDialogVisible=true">选择商品</div>
            <br>
            <span class="title" v-html="salesCommissionTextInfo"></span>
            <br>
          </el-form-item> -->
        </div>
        <!-- <h3 class="form-h3">网络平台折算</h3>
        <div class="box-border">
          <el-form-item label="美团/大众点评" style="margin-left:-4px;">
            <el-radio-group v-model="formData.networkPlatformPerformanceConversion_t">
              <el-radio label="1">业绩不打折</el-radio>
              <el-radio label="2">业绩按实际收益的</el-radio>
            </el-radio-group>
            <div class="num-input-box">
              <el-input
                class="num-input"
                placeholder="80"
                v-model="formData.networkPlatformPerformanceConversion"
              >
                <template slot="append">%</template>
              </el-input>折算
            </div>
          </el-form-item>
          <br>
        </div> -->
        <h3 class="form-h3">多人分配</h3>
        <div class="box-border">
          <el-form-item label="劳动业绩比例">
            <el-radio-group v-model="formData.multiLabor">
              <el-radio :label="1">自动平分</el-radio>
              <el-radio :label="2">手动设置（最多支持选5个辅助工位）</el-radio>
            </el-radio-group>
            <el-table v-if="formData.multiLabor === 2" :data="formData.multiLaborSpecification" class="commission-table">
              <el-table-column label="分配方案" prop="allocationName" align="center"></el-table-column>
              <el-table-column label="第1位" prop="first" min-width="130" align="center">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.first" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第2位" prop="second" min-width="130" align="center">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.second" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第3位" prop="third" min-width="130" align="center">
                <template slot-scope="scope" v-if="scope.row.sort > 1">
                  <el-input v-model.number="scope.row.third" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第4位" prop="forth" min-width="130" align="center">
                <template slot-scope="scope" v-if="scope.row.sort > 2">
                  <el-input v-model.number="scope.row.forth" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第5位" prop="fifth" min-width="130" align="center">
                <template slot-scope="scope" v-if="scope.row.sort > 3">
                  <el-input v-model.number="scope.row.fifth" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <i 
                    class="icon-operate iconfont icon-icon_ope_append" 
                    style="color: #58c9f3;margin-right:10px;" 
                    v-if="scope.row.sort === formData.multiLaborSpecification.length && scope.row.sort !== 4"
                    @click="addMultiScheme(formData.multiLaborSpecification)"
                  ></i>
                  <i 
                    class="icon-operate iconfont icon-icon_operate_delete" 
                    v-if="scope.row.sort !== 1 && scope.row.sort === formData.multiLaborSpecification.length" 
                    @click="delMultiLabor(formData.multiLaborSpecification)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="multiLaborTextInfo"></span>
          <br>
          <el-form-item label="销售业绩分配">
            <el-radio-group v-model="formData.multiSales">
              <el-radio :label="1">自动平分</el-radio>
              <el-radio :label="2">手动设置（最多支持选5位辅助销售）</el-radio>
            </el-radio-group>
            <el-table v-if="formData.multiSales === 2" :data="formData.multiSalesSpecification" class="commission-table">
              <el-table-column label="分配方案" prop="allocationName" align="center"></el-table-column>
              <el-table-column label="第1位" prop="first" min-width="130" align="center">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.first" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第2位" prop="second" min-width="130" align="center">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.second" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第3位" prop="third" min-width="130" align="center">
                <template slot-scope="scope" v-if="scope.row.sort > 1">
                  <el-input v-model.number="scope.row.third" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第4位" prop="forth" min-width="130" align="center">
                <template slot-scope="scope" v-if="scope.row.sort > 2">
                  <el-input v-model.number="scope.row.forth" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="第5位" prop="fifth" min-width="130" align="center">
                <template slot-scope="scope" v-if="scope.row.sort > 3">
                  <el-input v-model.number="scope.row.fifth" size="medium">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <i 
                    class="icon-operate iconfont icon-icon_ope_append" 
                    style="color: #58c9f3;margin-right:10px;" 
                    v-if="scope.row.sort === formData.multiSalesSpecification.length && scope.row.sort !== 4"
                    @click="addMultiScheme(formData.multiSalesSpecification)"
                  ></i>
                  <i 
                    class="icon-operate iconfont icon-icon_operate_delete" 
                    v-if="scope.row.sort !== 1 && scope.row.sort === formData.multiSalesSpecification.length" 
                    @click="delMultiSales(formData.multiSalesSpecification)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="multiSalesTextInfo"></span>
          <br>
        </div>
        <h3 class="form-h3">权限设置</h3>
        <div class="box-border long-radio">
          <el-form-item label="门店授权" v-if="currentEntry === 'brand'">
            <el-radio-group v-model="formData.storePrivilege" class="store-auth">
              <el-radio :label="1" :disabled="false">所有门店独立设置业绩提成规则。</el-radio><br>
              <el-radio :label="2" :disabled="true">总部统一设置，所有门店共用一套业绩提成规则。</el-radio><br>
              <el-radio :label="3" :disabled="true">加盟店可独立设置业绩提成规则（未独立设置的采用总部统一规则）。</el-radio><br>
            </el-radio-group>
          </el-form-item>
          <br v-if="currentEntry === 'brand'">
          <el-form-item label="手动调整" :class="{'in-brand': currentEntry === 'brand'}">
            <el-radio-group v-model="formData.manuallyAdjust">
              <el-radio :label="1">不允许</el-radio>
              <el-radio :label="2" :disabled="true">允许</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <span class="title" style="margin-left:100px;" v-html="manuallyAdjustTextInfo"></span>
          <br>
        </div>
        <el-button style="margin:20px 0 30px;" class="normal_blue_btn" @click="saveModeify" v-if="checkHasBtnPermission('shop_commission_base_save')">保存修改</el-button>
      </el-form>
    </div>
    <sales-dialog 
      v-if="salesDialogVisible" 
      :commissionBasicId="commissionBasicId" 
      :salesDialog="salesDialogVisible" 
      @close="salesDialogVisible=false"
    />
    <labor-dialog 
      v-if="laborDialogVisible" 
      :commissionBasicId="commissionBasicId" 
      :laborDialog="laborDialogVisible" 
      @close="laborDialogVisible=false"
    />
  </div>
</template>
<script>
import laborDialog from '@/components/setUp/commission/basic/laborDialogIndex' // 新的服务提成
import salesDialog from '@/components/setUp/commission/basic/salesDialogIndex' // 新的销售提成
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex"
import { reg, checkReg } from "@/assets/js/RegExp"
export default {
  components: {
    salesDialog,
    laborDialog
  },
  data() {
    return {
      formData: {
        laborCash: null, // 劳动业绩现金结算 1-按服务 2-按金额
        laborCard: null, // 劳动业绩储值卡结算 1-按赠送金 2-按耗卡
        laborCommission: null, // 劳动业绩提成扣成本 1-不扣 2-扣
        salesCash: null, // 销售业绩现金结算 1=按商品 2-按金额
        salesCard: null, // 销售业绩储值卡结算 1-按赠送金 2-按耗卡
        salesCommission: null, // 销售业绩提成扣成本 1-不扣 2-扣
        multiLabor: null, // 劳动业绩多人分配 1-自动 2-手动
        multiSales: null, // 销售业绩多人分配 1-自动 2-手动
        multiLaborSpecification: [], // 劳动业绩多人分配方案
        multiSalesSpecification: [], // 销售业绩多人分配方案
        storePrivilege: null, // 门店授权 1-所有门店独立 2-总部统一 3-加盟店独立 // 总部有这个字段
        manuallyAdjust: null, // 手动调整 1-不允许 2-允许
      },
      pageLoading: false,
      salesDialogVisible: false,
      laborDialogVisible: false,
      // config: {baseURL: 'http://192.168.2.8:9001/service-api'},
      config: null,
      commissionBasicId: 0, // 提成编号
    };
  },
  watch: {
    'formData.multiLabor': function(v, o) {
      if (v === 2 && !this.formData.multiLaborSpecification.length) {
        this.formData.multiLaborSpecification.push(
          {
            allocationName: '二人方案',
            first: 0,
            second: 0,
            sort: 1
          }
        )
      }
    },
    'formData.multiSales': function(v, o) {
      if (v === 2 && !this.formData.multiSalesSpecification.length) {
        this.formData.multiSalesSpecification.push(
          {
            allocationName: '二人方案',
            first: 0,
            second: 0,
            sort: 1
          }
        )
      }
    },
  },
  mounted() {
    this.getInitialSets()
  },
  methods: {
    getInitialSets() {
      this.pageLoading = true
      let params = {}
      params.brandId = this.currentInfo.brandId
      if (this.currentEntry === 'shop') {
        params.storeId = this.currentInfo.shopId
      }
      axios.post('/getCommissionBasicApi', params, this.config).then(res => {
        if (res.commissionBasicInfos) {
          this.commissionBasicId = res.commissionBasicInfos.id
          this.formData = res.commissionBasicInfos
          delete this.formData.id
        }
        this.pageLoading = false
      }).catch(err => {
        this.pageLoading = false
      })
    },
    saveModeify() {
      if (this.formData.multiLabor === 2) {
        let checkResult = this.checkMultiScheme('multiLaborSpecification')
        if (!checkResult) {
          utils.showTip(this, {msg: '劳动业绩多人分配方案比例总和错误', type: 'error'})
          return false
        }
      }
      if (this.formData.multiSales === 2) {
        let checkResult = this.checkMultiScheme('multiSalesSpecification')
        if (!checkResult) {
          utils.showTip(this, {msg: '销售业绩多人分配方案比例总和错误', type: 'error'})
          return false
        }
      }
      this.pageLoading = true
      let params = {...this.formData}
      params.brandId = this.currentInfo.brandId
      if (this.currentEntry === 'shop') {
        delete params.storePrivilege // 门店端没有授权字段
        params.storeId = this.currentInfo.shopId
      }
      axios.post('/saveCommissionBasicApi', params, this.config).then(res => {
        this.getInitialSets()
        this.$message({type: 'success', message: res.message})
        this.pageLoading = false
      }).catch(err => {
        this.pageLoading = false
      })
    },
    // 多人分配方案增加-通用
    addMultiScheme(data) {
      let len = data.length
      switch (len) {
        case 1:
          data.push(
            {
              allocationName: '三人方案',
              first: 0,
              second: 0,
              third: 0,
              sort: 2
            }
          )
          break
        case 2:
          data.push(
            {
              allocationName: '四人方案',
              first: 0,
              second: 0,
              third: 0,
              forth: 0,
              sort: 3
            }
          )
          break
        case 3:
          data.push(
            {
              allocationName: '五人方案',
              first: 0,
              second: 0,
              third: 0,
              forth: 0,
              fifth: 0,
              sort: 4
            }
          )
          break
        default:
          console.log('err')  
      }
    },
    // 多人劳动分配方案删除
    delMultiLabor(data) {
      let len = data.length
      this.formData.multiLaborSpecification = data.slice(0, len - 1)
    },
    // 多人销售分配方案删除
    delMultiSales(data) {
      let len = data.length
      this.formData.multiSalesSpecification = data.slice(0, len - 1)
    },
    // 检测多人分配方案是否正确-通用
    checkMultiScheme(type) {
      let r = true
      this.formData[type].forEach(item => {
        let t = 0
        t += item.first ? item.first : 0
        t += item.second ? item.second : 0
        t += item.third ? item.third : 0
        t += item.forth ? item.forth : 0
        t += item.fifth ? item.fifth : 0
        t *= 100
        if (t !== 9999 && t !== 10000) {
          r = false
        }
      })
      return r
    },
    // -------成本弹窗相关 -- begin --------
    // -------成本弹窗相关 -- end ----------
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    laborCashTextInfo() {
      let t = this.formData.laborCash === 2 ? `按服务项目实际的收款金额计算：提成金额=收款金额*业绩占比*提成比例。<br/>如该笔服务项目的总售价为998元，顾客有一张100元的优惠券，收款金额=998-100=898元。` 
        : `按服务项目对应的会员售价计算：提成金额=售价*数量*业绩占比*提成比例<br/>现金结算：指可以转化为现金业绩的结算方式，包括现金、线上支付、银行卡等。`
      return t
    },
    laborCardTextInfo() {
      let t = this.formData.laborCard === 2 ? `即按储值卡内实际扣款的金额计算，如顾客消费某项目售价为980元，卡内实际扣款980元，则业绩按照<br/>980元计算。`
        : `即按储值卡赠金优惠折扣进行折算业绩，如顾客有1张储值卡，按充1000赠1000办卡，相当于5折优惠，假<br/>如消费某项目售价为980元，则业绩按980*0.5=490元计算。`
      return t
    },
    laborCommissionTextInfo() {
      let t = this.formData.laborCommission === 2 ? `即所有服务项目计算劳动提成时，需扣除服务项目的成本。`
        : `即所有服务项目计算劳动提成时，均不扣除成本。`
      return t
    },
    salesCashTextInfo() {
      let t = this.formData.salesCash === 2 ? `按商品(包括服务/产品/卡项)的实际收款金额计算：提成金额=收款金额*业绩占比*提成比例。<br/>如该笔项目的总售价为998元，顾客有一张100元的优惠券，收款金额=998-100=898元。`
        : `按商品(包括服务/产品/卡项)对应的会员售价计算：提成金额=售价*数量*业绩占比*提成比例。<br/>现金结算：指可以转化为现金业绩的结算方式，包括现金、线上支付、银行卡等。`
      return t
    },
    salesCardTextInfo() {
      let t = this.formData.salesCard === 2 ? `即按储值卡内实际扣款的金额计算，如顾客消费某项目售价为980元，卡内实际扣款980元，则业绩按照<br/>980元计算。`
        : `即按储值卡赠金优惠折扣进行折算业绩，如顾客有1张储值卡，按充1000赠1000办卡，相当于5折优惠，假<br/>如消费某项目售价为980元，则业绩按980*0.5=490元计算。`
      return t
    },
    salesCommissionTextInfo() {
      let t = this.formData.salesCommission === 2 ? `即所有商品计算销售提成时，需扣除商品的成本。`
        : `即所有商品计算销售提成时，均不扣除成本。`
      return t
    },
    multiLaborTextInfo() {
      let t = this.formData.multiLabor === 2 ? `设置成功后，开单选择多个辅助工位时，业绩将按所选顺序对应的占比计算。只选1名辅助工位默认按100%计算。`
        : `设置成功后，开单选择多个辅助工位时，业绩将自动平分(1人100%，2人50%，3人33.33%，4人25%，以此类推)。`
      return t
    },
    multiSalesTextInfo() {
      let t = this.formData.multiSales === 2 ? `设置成功后，开单选择多位辅助销售时，业绩将按所选顺序对应的占比计算。只选1名辅助销售默认按100%计算。`
        : `设置成功后，开单选择多位辅助销售时，业绩将自动平分(1人100%，2人50%，3人33.33%，4个人25%，以此类推)。`
      return t
    },
    manuallyAdjustTextInfo() {
      let t = this.formData.manuallyAdjust === 2 ? `允许后，可以在收款完成页面点击“修改业绩提成”按钮，查看员工的业绩和提成，可以根据需要进行手动调整。`
        : `即员工业绩与提成不允许手动调整`
      return t
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.con {
  box-sizing: border-box;
  padding: 20px 40px;
  height: calc(100vh - 127px);
  overflow: auto;
}
.form-h3::before {
  content: "* ";
  color: #ff6d61;
}
.form-h3 {
  font-size: 16px;
  color: #333333;
  line-height: 38px;
  margin-top: 20px;
}
.box-border {
  border: 1px solid #f0f1f4;
  box-sizing: border-box;
  padding: 15px 32px;
  color: #666666;
  border-radius: 3px;
}
.title {
  color: #999999;
  font-size: 12px;
  line-height: 28px;
  display: block;
}
.select-button {
  display: inline-block;
  width: 74px;
  height: 30px;
  color: #58c9f3;
  text-align: center;
  font-size: 14px;
  border: 1px solid #58c9f3;
  border-radius: 3px;
  line-height: 30px;
  margin: 0 5px 0 15px;
  cursor: pointer;
  transition: all 0.625s;
  &:hover {
    opacity: 0.6;
  }
}
.span-detail {
  color: #58c9f3;
  cursor: pointer;
}
/deep/ .el-form--inline .el-form-item {
  margin-bottom: 0;
  width: 100%;
  .el-form-item__content {
    width: calc(100% - 100px);
  }
}
/deep/ .el-radio:nth-child(1) {
  min-width: 180px;
  color: #333333;
}

.num-input-box {
  display: inline-block;
  /deep/ .num-input {
    width: 100px;
  }
  /deep/ .el-input-group__append {
    width: 40px;
    padding: 0;
    text-align: center;
  }
}
.el-radio-group.store-auth {
  label {
    margin-top: 14px;
  }
}
.in-brand {
  margin-top: 12px;
}
</style>
