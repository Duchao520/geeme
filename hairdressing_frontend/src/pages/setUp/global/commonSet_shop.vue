<template>
  <div class="common-set scrollbar" v-loading="pageLoading">
    <el-form :model="formData" ref="form" label-width='116px'>
      <!-- 门店劳动业绩设置 -->
      <h3 class="form-h3">门店劳动业绩设置</h3>
      <div class="box-border">
        <el-form-item label="现金支付:" prop="serviceCashPercent" :rules="{required: false, validator: validatePercent}">
          <div class="single-line">
            <span>按实收金额的</span>
            <el-input :maxlength="5" v-model.number="formData.serviceCashPercent" @input="v => {formData.serviceCashPercent = v}" size="medium">
              <template slot="append">%</template>
            </el-input>
            <span>计算</span>
          </div>
        </el-form-item>
        <br>
        <el-form-item label="储值金支付:" prop="serviceRechargeMoneyPercent" :rules="{required: false, validator: validatePercent}">
          <el-radio-group v-model="formData.serviceRechargeMoneyByRatio">
            <el-radio :label="false">
              <div class="single-line">
                <span>按耗卡金额的</span>
                <el-input :maxlength="5" v-model.number="formData.serviceRechargeMoneyPercent" @input="v => {formData.serviceRechargeMoneyPercent = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
                <span>计算</span>
              </div>
            </el-radio>
            <el-radio :label="true">按累计储值金与赠送金比例打折计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="title" style="margin-left:100px;" v-if="formData.serviceRechargeMoneyByRatio" v-html="textInfo"></span>
        <br>
        <el-form-item label="赠送金支付:" prop="serviceGiftMoneyPercent" :rules="{required: false, validator: validatePercent}">
          <el-radio-group v-model="formData.serviceGiftMoneyByRatio">
            <el-radio :label="false">
              <div class="single-line">
                <span>按耗卡金额的</span>
                <el-input :maxlength="5" v-model.number="formData.serviceGiftMoneyPercent" @input="v => {formData.serviceGiftMoneyPercent = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
                <span>计算</span>
              </div>
            </el-radio>
            <el-radio :label="true">按累计储值金与赠送金比例打折计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="title" style="margin-left:100px;" v-if="formData.serviceGiftMoneyByRatio" v-html="textInfo"></span>
        <br>
        <el-form-item label="次卡:" prop="serviceCountCardPercent" :rules="{required: false, validator: validatePercent}">
          <div class="single-line">
            <span>按卡设业绩的</span>
            <el-input :maxlength="5" v-model.number="formData.serviceCountCardPercent" @input="v => {formData.serviceCountCardPercent = v}" size="medium">
              <template slot="append">%</template>
            </el-input>
            <span>计算</span>
          </div>
        </el-form-item>
        <br>
        <el-form-item label="时间卡:" prop="serviceTimeCardPercent" :rules="{required: false, validator: validatePercent}">
          <div class="single-line">
            <span>按卡设业绩的</span>
            <el-input :maxlength="5" v-model.number="formData.serviceTimeCardPercent" @input="v => {formData.serviceTimeCardPercent = v}" size="medium">
              <template slot="append">%</template>
            </el-input>
            <span>计算</span>
          </div>
        </el-form-item>
        <br>
        <el-form-item label="次卡/时间卡赠送:" prop="serviceGiftPercent" :rules="{required: false, validator: validatePercent}">
          <div class="single-line">
            <span>按卡设业绩的</span>
            <el-input :maxlength="5" v-model.number="formData.serviceGiftPercent" @input="v => {formData.serviceGiftPercent = v}" size="medium">
              <template slot="append">%</template>
            </el-input>
            <span>计算</span>
          </div>
        </el-form-item>
      </div>
      <!-- 门店产品业绩设置 -->
      <h3 class="form-h3">门店产品业绩设置</h3>
      <div class="box-border">
        <el-form-item label="现金支付:" prop="productCashPercent" :rules="{required: false, validator: validatePercent}">
          <div class="single-line">
            <span>按实收金额的</span>
            <el-input :maxlength="5" v-model.number="formData.productCashPercent" @input="v => {formData.productCashPercent = v}" size="medium">
              <template slot="append">%</template>
            </el-input>
            <span>计算</span>
          </div>
        </el-form-item>
        <br>
        <el-form-item label="储值金支付:" prop="productRechargeMoneyPercent" :rules="{required: false, validator: validatePercent}">
          <el-radio-group v-model="formData.productRechargeMoneyByRatio">
            <el-radio :label="false">
              <div class="single-line">
                <span>按耗卡金额的</span>
                <el-input :maxlength="5" v-model.number="formData.productRechargeMoneyPercent" @input="v => {formData.productRechargeMoneyPercent = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
                <span>计算</span>
              </div>
            </el-radio>
            <el-radio :label="true">按累计储值金与赠送金比例打折计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="title" style="margin-left:100px;" v-if="formData.productRechargeMoneyByRatio" v-html="textInfo"></span>
        <br>
        <el-form-item label="赠送金支付:" prop="productGiftMoneyPercent" :rules="{required: false, validator: validatePercent}">
          <el-radio-group v-model="formData.productGiftMoneyByRatio">
            <el-radio :label="false">
              <div class="single-line">
                <span>按耗卡金额的</span>
                <el-input :maxlength="5" v-model.number="formData.productGiftMoneyPercent" @input="v => {formData.productGiftMoneyPercent = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
                <span>计算</span>
              </div>
            </el-radio>
            <el-radio :label="true">按累计储值金与赠送金比例打折计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="title" style="margin-left:100px;" v-if="formData.productGiftMoneyByRatio" v-html="textInfo"></span>
      </div>
      <!-- 门店卡项业绩设置 -->
      <h3 class="form-h3">门店卡项业绩设置</h3>
      <div class="box-border">
        <el-form-item label="现金支付:" prop="cardCashPercent" :rules="{required: false, validator: validatePercent}">
          <div class="single-line">
            <span>按实收金额的</span>
            <el-input :maxlength="5" v-model.number="formData.cardCashPercent" @input="v => {formData.cardCashPercent = v}" size="medium">
              <template slot="append">%</template>
            </el-input>
            <span>计算</span>
          </div>
        </el-form-item>
        <br>
        <el-form-item label="储值金支付:" prop="cardRechargeMoneyPercent" :rules="{required: false, validator: validatePercent}">
          <el-radio-group v-model="formData.cardRechargeMoneyByRatio">
            <el-radio :label="false">
              <div class="single-line">
                <span>按耗卡金额的</span>
                <el-input :maxlength="5" v-model.number="formData.cardRechargeMoneyPercent" @input="v => {formData.cardRechargeMoneyPercent = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
                <span>计算</span>
              </div>
            </el-radio>
            <el-radio :label="true">按累计储值金与赠送金比例打折计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="title" style="margin-left:100px;" v-if="formData.cardRechargeMoneyByRatio" v-html="textInfo"></span>
        <br>
        <el-form-item label="赠送金支付:" prop="cardGiftMoneyPercent" :rules="{required: false, validator: validatePercent}">
          <el-radio-group v-model="formData.cardGiftMoneyByRatio">
            <el-radio :label="false">
              <div class="single-line">
                <span>按耗卡金额的</span>
                <el-input :maxlength="5" v-model.number="formData.cardGiftMoneyPercent" @input="v => {formData.cardGiftMoneyPercent = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
                <span>计算</span>
              </div>
            </el-radio>
            <el-radio :label="true">按累计储值金与赠送金比例打折计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="title" style="margin-left:100px;" v-if="formData.cardGiftMoneyByRatio" v-html="textInfo"></span>
      </div>
      <!-- 劳动业绩多人分配设置 -->
      <h3 class="form-h3">劳动业绩多人分配设置</h3>
      <div class="box-border">
        <el-form-item label="劳动业绩比例:">
          <el-radio-group class="fix-flex-style" v-model="formData.multiLabor">
            <el-radio :label="1">自动平分</el-radio>
            <el-radio :label="2">手动设置（最多支持选5个辅助工位）</el-radio>
          </el-radio-group>
          <el-table v-if="formData.multiLabor === 2" :data="formData.multiLaborSpecification" class="commission-table" stripe :header-cell-style="{background: '#f4f5f7'}">
            <el-table-column label="分配方案" prop="allocationName" align="center"></el-table-column>
            <el-table-column label="第1位" prop="first" align="center">
              <template slot-scope="scope">
                <el-input :maxlength="5" v-model.number="scope.row.first" @input="v => {scope.row.first = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第2位" prop="second" align="center">
              <template slot-scope="scope">
                <el-input :maxlength="5" v-model.number="scope.row.second" @input="v => {scope.row.second = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第3位" prop="third" align="center">
              <template slot-scope="scope" v-if="scope.row.sort > 1">
                <el-input :maxlength="5" v-model.number="scope.row.third" @input="v => {scope.row.third = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第4位" prop="forth" align="center">
              <template slot-scope="scope" v-if="scope.row.sort > 2">
                <el-input :maxlength="5" v-model.number="scope.row.forth" @input="v => {scope.row.forth = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第5位" prop="fifth" align="center">
              <template slot-scope="scope" v-if="scope.row.sort > 3">
                <el-input :maxlength="5" v-model.number="scope.row.fifth" @input="v => {scope.row.fifth = v}" size="medium">
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
        <span class="title" style="margin-left:116px;" v-html="multiLaborTextInfo"></span>
      </div>
      <!-- 销售业绩多人分配设置 -->
      <h3 class="form-h3">销售业绩多人分配设置</h3>
      <div class="box-border">
        <el-form-item label="销售业绩分配:">
          <el-radio-group class="fix-flex-style" v-model="formData.multiSales">
            <el-radio :label="1">自动平分</el-radio>
            <el-radio :label="2">手动设置（最多支持选5位辅助销售）</el-radio>
          </el-radio-group>
          <el-table v-if="formData.multiSales === 2" :data="formData.multiSalesSpecification" class="commission-table" stripe :header-cell-style="{background: '#f4f5f7'}">
            <el-table-column label="分配方案" prop="allocationName" align="center"></el-table-column>
            <el-table-column label="第1位" prop="first" align="center">
              <template slot-scope="scope">
                <el-input :maxlength="5" v-model.number="scope.row.first" @input="v => {scope.row.first = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第2位" prop="second" align="center">
              <template slot-scope="scope">
                <el-input :maxlength="5" v-model.number="scope.row.second" @input="v => {scope.row.second = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第3位" prop="third" align="center">
              <template slot-scope="scope" v-if="scope.row.sort > 1">
                <el-input :maxlength="5" v-model.number="scope.row.third" @input="v => {scope.row.third = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第4位" prop="forth" align="center">
              <template slot-scope="scope" v-if="scope.row.sort > 2">
                <el-input :maxlength="5" v-model.number="scope.row.forth" @input="v => {scope.row.forth = v}" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="第5位" prop="fifth" align="center">
              <template slot-scope="scope" v-if="scope.row.sort > 3">
                <el-input :maxlength="5" v-model.number="scope.row.fifth" @input="v => {scope.row.fifth = v}" size="medium">
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
        <span class="title" style="margin-left:116px;" v-html="multiSalesTextInfo"></span>
      </div>
      <el-button style="margin:20px 0 30px;" class="normal_blue_btn" @click="saveModeify">保存修改</el-button>
    </el-form>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import { mapState } from "vuex"
export default {
  data() {
    
    return {
      pageLoading: false,
      formData: {
        serviceCashPercent: 100, // -服务- 现金实收比例
        serviceRechargeMoneyByRatio: false, // -服务- 储值金支付  是否按累计比例计算
        serviceRechargeMoneyPercent: 100, // -服务- 储值金耗卡金额比例
        serviceGiftMoneyByRatio: false, // -服务- 储值金支付  是否按累计比例计算
        serviceGiftMoneyPercent: 100, // -服务- 储值金耗卡金额比例
        serviceCountCardPercent: 100, // -服务- 次卡卡设比例
        serviceTimeCardPercent: 100, // -服务- 时间卡卡设比例
        serviceGiftPercent: 100, // -服务- 时间卡次卡赠送卡设比例
        
        productCashPercent: 100, // -产品- 现金实收比例
        productRechargeMoneyByRatio: false, // -产品- 储值金支付  是否按累计比例计算
        productRechargeMoneyPercent: 100, // -产品- 储值金耗卡金额比例
        productGiftMoneyByRatio: false, // -产品- 储值金支付  是否按累计比例计算
        productGiftMoneyPercent: 100, // -产品- 储值金耗卡金额比例
        
        cardCashPercent: 100, // -卡项- 现金实收比例
        cardRechargeMoneyByRatio: false, // -卡项- 储值金支付  是否按累计比例计算
        cardRechargeMoneyPercent: 100, // -卡项- 储值金耗卡金额比例
        cardGiftMoneyByRatio: false, // -卡项- 储值金支付  是否按累计比例计算
        cardGiftMoneyPercent: 100, // -卡项- 储值金耗卡金额比例

        multiLabor: 1, // 劳动业绩多人分配 1-自动 2-手动
        multiSales: 1, // 销售业绩多人分配 1-自动 2-手动
        multiLaborSpecification: [], // 劳动业绩多人分配方案
        multiSalesSpecification: [], // 销售业绩多人分配方案
      },
      textInfo: `即按累计充值金/(累计储值金+累计赠送金）折算业绩，如：顾客有1张储值卡，累计充值1000元，赠送<br/>1000元，消费某项目扣卡金980元，则门店业绩按490元计算。`,
      // rules: {
      //   percent: [{ validator: validatePercent, trigger: 'blur' }]
      // },
    }
  },
  mounted() {
    this.getInitialSets()
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
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
  },
  methods: {
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
        t += item.first ? item.first * 1 : 0
        t += item.second ? item.second * 1 : 0
        t += item.third ? item.third * 1 : 0
        t += item.forth ? item.forth * 1 : 0
        t += item.fifth ? item.fifth * 1 : 0
        t *= 100

        // 3人方案允许99.99%， 其他必须是100%
        if (item.sort === 2) {
          if (t !== 9999 && t !== 10000) {
            r = false
          }
        } else {
          if (t !== 10000) {
            r = false
          }
        }
      })
      return r
    },
    // 修改保存
    saveModeify() {
      this.$refs.form.validate((valid)=> {
        if (valid) {
          if (this.formData.multiLabor === 2) {
            let checkResult = this.checkMultiScheme('multiLaborSpecification')
            if (!checkResult) {
              this.$message({type: 'error', message: '劳动业绩多人分配方案比例总和错误'})
              return false
            }
          }
          if (this.formData.multiSales === 2) {
            let checkResult = this.checkMultiScheme('multiSalesSpecification')
            if (!checkResult) {
              this.$message({type: 'error', message: '销售业绩多人分配方案比例总和错误'})
              return false
            }
          }
          this.pageLoading = true
          // - 偷懒一下 ！！！ -
          let params1 = JSON.parse(JSON.stringify(this.formData)) // 给旧数据部分用
          let params2 = JSON.parse(JSON.stringify(this.formData)) // 给新数据部分用
          delete params1.id
          if (this.currentEntry === 'shop') {
            delete params1.storePrivilege // 门店端没有授权字段
          }
          let params = {
            commissionBasicInfos: params1,
            createOrUpdateStorePerformanceSettingRequest: params2
          }
          // = 偷懒一下 ！！！ =
          axios.post('/createOrUpdateCommonSetting', params).then(res => {
            this.getInitialSets()
            this.$message({type: 'success', message: res.message})
            this.pageLoading = false
          }).catch(err => {
            this.pageLoading = false
          })
        } else {
          this.$message({type: 'error', message: '请检查并完善数据'})
        }
      })
     
    },
    // - 初始化
    getInitialSets() {
      this.pageLoading = true
      let params = {
        brandId: this.currentInfo.brandId,
        storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null
      }
      axios.post('/getCommonSetting', params).then(res => {
        if (res.commissionBasicInfos && res.storePerformanceSettingInfo) {
          // 两个都有 先存旧数据 删除id后再存新数据, 避免id混淆
          this.formData = {...res.commissionBasicInfos}
          delete this.formData.id
          this.formData = {...this.formData, ...res.storePerformanceSettingInfo}
        } else if (res.commissionBasicInfos) {
          // 只有旧数据时 先使用默认值填充，再用旧数据覆盖重复部分并删除id
          this.formData = {...this.formData, ...res.commissionBasicInfos}
          delete this.formData.id // 删除就的设置的id， 避免两个对象的id混淆
        } else if (res.storePerformanceSettingInfo) {
          // 只有新数据时 先使用默认值填充，再使用新数据覆盖重复部分
          this.formData = {...this.formData, ...res.storePerformanceSettingInfo}
        } else {
          // - 用 data 默认值
        }
        this.pageLoading = false
      }).catch(err => {
        this.pageLoading = false
      })
    },
    validatePercent(rule, val, cb) {
      if (/^(\d{1,2}(\.\d{0,2})?|100)$/.test(val)) {
        cb()
      } else {
        cb('请输入0~100间的数字，最多2位小数')
      }
    },
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
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.common-set {
  box-sizing: border-box;
  padding: 20px 40px;
  height: calc(100vh - 127px);
  overflow: auto;
  // border-radius: 0 0 8px 8px;
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
}
.el-form-item {
  margin-bottom: 0;
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
.single-line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
/deep/ .el-input {
  width: 120px;
  margin: 0 10px;
}
/deep/ .el-input-group__append {
  padding: 0 12px;
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
/deep/ .el-form-item {
  margin-bottom: 0;
  width: 100%;
  .el-form-item__content {
    width: calc(100% - 116px);
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
.el-radio-group, .fix-flex-style {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 40px;
  /deep/ .el-radio {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }
}
.el-table {
  width: 980px;
}
</style>
