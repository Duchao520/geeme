<template>
  <div class="coupon-model">
    <div class="main-table">
      <el-table
        stripe
        :data="tableData" 
        height="calc(100vh - 220px)" 
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>        
        <el-table-column label="优惠券名称" prop="couponName"></el-table-column>
        <el-table-column label="优惠券金额" prop="money"></el-table-column>
        <el-table-column label="使用条件" show-overflow-tooltip>
          <template slot-scope="{row}">
            <p v-if="row.useUnLimited">无门槛</p>
            <p class="ellipsis-text" v-else>
              满{{row.purchaseAboveMoney}}减{{row.money}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="可用服务" show-overflow-tooltip>
          <template slot-scope='{row}'>
            <p v-if="row.allServicePromote">全部服务</p>
            <p class="ellipsis-text" v-else>{{row.serviceLevelTwoNameList.length ? row.serviceLevelTwoNameList.join(',') : '无'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="可用产品" show-overflow-tooltip>
          <template slot-scope='{row}'>
            <p v-if="row.allProductPromote">全部产品</p>
            <p class="ellipsis-text" v-else>{{row.productLevelTwoNameList.length ? row.productLevelTwoNameList.join(',') : '无'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='{row}'>
            <g-button
              :name="'编辑'"
              :type="'detail'"
              :icon="'icon_operate_edit'"
              @click="editTemplate(row)"
            ></g-button>
            <g-button
              :name="'派发'"
              :type="'green'"
              :icon="'icon_ope_publish'"
              @click="showSendCouponDialog(row)"
            ></g-button>
            <i class="icon iconfont icon-icon_operate_delete" @click="deleteCoupons([row.id])"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-line">
        <el-button plain class="plain_gray_btn" @click="multipleDeleteCoupons" size="small">批量删除</el-button>
        <el-pagination
          style="margin: 5px 0px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 模板 -->
    <el-dialog 
      width="800"
      :title='title'
      :visible="templateVisible"
      :close-on-click-modal="false"
      :before-close="handleCloseTemplate"
      :loading="modelLoad"
    >
      <el-form 
        ref="form"
        label-width="110px"
        :model="templateForm"
        :rules="templateFormRules"
      >
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input style="width: 200px;" v-model.trim="templateForm.couponName" maxlength="32" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="money" :rules="{ required: true, validator: validateMoney, trigger: 'change' }">
          <el-input style="width: 200px;" v-model.trim="templateForm.money" maxlength="8" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item 
          label="使用条件"
          prop="purchaseAboveMoney"
          :rules="{ required: true, validator: validateLimitedMoney, trigger: 'change' }"
        >
          <el-radio-group 
            v-model="templateForm.useUnLimited"
          >
            <el-radio :label="true">无门槛</el-radio>
            <el-radio :label="false">
              满
              <el-input style="width: 160px;" v-model="templateForm.purchaseAboveMoney" maxlength="8" placeholder="满减条件">
                <template slot="append">元</template>
              </el-input>
              可以使用
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="可用服务" prop="usableService">
          <el-radio-group v-model="templateForm.allServicePromote">
            <el-radio :label="true">全部服务</el-radio>
            <el-radio :label="false">
              指定服务
              <el-button plain class="plain_blue_btn" :disabled="templateForm.allServicePromote !== false" @click="handleChooseGoods('Service')">选择服务</el-button>
            </el-radio>
            <el-radio :label="0">均不可用</el-radio>
          </el-radio-group>
          <el-table :data="templateForm.serviceList" v-if="templateForm.serviceList.length" :height="serviceTableHeight">
            <el-table-column label="一级分类" show-overflow-tooltip prop="levelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="levelTwoName"></el-table-column>
            <el-table-column label="商品名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <i class="icon iconfont icon-icon_operate_delete" @click="delSelectedGoods(scope.$index, 'Service')"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="可用产品" prop="usableProduct">
          <el-radio-group v-model="templateForm.allProductPromote">
            <el-radio :label="true">全部产品</el-radio>
            <el-radio :label="false">
              指定产品
              <el-button plain class="plain_blue_btn" :disabled="templateForm.allProductPromote !== false" @click="handleChooseGoods('Production')">选择产品</el-button>
            </el-radio>
            <el-radio :label="0">均不可用</el-radio>
          </el-radio-group>
          <el-table :data="templateForm.productList" v-if="templateForm.productList.length" :height="productTableHeight">
            <el-table-column label="一级分类" show-overflow-tooltip prop="levelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="levelTwoName"></el-table-column>
            <el-table-column label="商品名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <i class="icon iconfont icon-icon_operate_delete" @click="delSelectedGoods(scope.$index, 'Production')"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="使用说明" prop="description">
          <InputWithCount style="width: 380px;" :length="60" placeholder="请输入使用说明" v-model="templateForm.description"/>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button plain class="plain_gray_btn" @click="handleCloseTemplate">取 消</el-button>
        <el-button class="normal_blue_btn" @click="saveTemplate" :loading="dialogBtnLoading">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 派发 -->
    <el-dialog
      width="800"
      title="派发优惠券"
      :visible="sendVisible"
      :close-on-click-modal="false"
      :before-close="handleCloseSend"
    >
      <el-form 
        ref="sendForm"
        :model="sendForm"
        label-width="110px"
      >
        <el-form-item 
          label="派发时间" 
          prop="sendTime"
          :rules="{ required: true, validator: validateSendTime, trigger: 'blur' }"
        >
          <el-radio-group 
            v-model="sendForm.sendRightNow"
          >
            <el-radio :label="true">即时派发</el-radio>
            <el-radio :label="false">
              指定时间
              <el-date-picker
                v-model="sendForm.sendTime"
                type="datetime"
                placeholder="选择日期时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                default-time="00:00:00"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item 
          label="生效期限" 
          prop="validDateType"
          :rules="{ required: true, validator: validateDateType, trigger: 'blur' }"
        >
          <el-radio-group 
            v-model="sendForm.validDateType"
          >
            <el-radio :label="'APPOINT_DATE'">
              指定日期
              <el-date-picker
                v-model="sendForm.beforeComputedTimes"
                type="datetimerange"
                range-separator="至"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-radio>
            <br>
            <el-radio :label="'COUPON_GET_DAY'" style="margin-top: 12px;">
              领券当日开始
              <el-input style="width: 100px;" v-model.number="sendForm.validDays" maxlength="3" placeholder="1-365天"></el-input>
              天内有效
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="派发数量" prop="sendAmount" :rules="{ required: true, validator: validateSendAmount, trigger: 'blur' }">
          <el-input v-model.number="sendForm.sendAmount" maxlength="12" style="width: 200px" placeholder="请输入正整数">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>

        <el-form-item label="每人限领" prop="limitPerManNum" :rules="{ required: true, validator: validateLimitPerManNum, trigger: 'blur' }">
          <el-radio-group 
            v-model="sendForm.isLimitPerMan"
          >
            <el-radio :label="false">
              不限
            </el-radio>
            <el-radio :label="true">
              限领
              <el-input style="width: 160px;" v-model.number="sendForm.limitPerManNum" maxlength="6" placeholder="正整数">
                <template slot="append">张</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审核验证码" prop="cellPhoneMsgCode" :rules="{ required: true, validator: validateCellPhoneMsgCode, trigger: 'blur' }">
          <el-input style="width: 160px;" v-model.trim="sendForm.cellPhoneMsgCode" maxlength="6" placeholder="请输入验证码"></el-input>
          <el-button class="normal_blue_btn" :loading="codeBtnLoading" @click="getCode">{{codeBtnLoading ? `${timer}s` : '获取验证码'}}</el-button>
          <p class='red-packet-text-info'>说明：短信验证码将发送至审核人员手机：{{phone}}，请及时查收。</p>
        </el-form-item>
      </el-form>
      <div class="simulate-coupon">
        <h3>优惠券</h3>
        <div class="info-box">
          <singleCoupon 
            :singleData="currentRow"
            :superData="sendForm"
          />
          <div class="message">
            提示：
            <br>
            如果客户同时下单多件商品，满足条件获取优惠时产生的订单。
            <br>
            那么当客户进行退款操作时，将按照比例退还给客户。
            <br>
            请确认退款风险，谨慎操作！
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button plain class="plain_gray_btn" @click="handleCloseSend">取 消</el-button>
        <el-button class="normal_blue_btn" @click="sendCoupon" :loading="dialogBtnLoading">确认派发</el-button>
      </div>
    </el-dialog>

    <!-- 通用选择商品  -  服务、产品 -->
    <goodsDialog
      v-if="goodsVisible"
      :goodsType="goodsType"
      :visible="goodsVisible"
      @close="goodsVisible = false"
      @suberData="handleGetSelectedGoods"
      :superCheckedGoods="checkedGoods"
    />
  </div>
</template>
<script>
import {mapState} from 'vuex';
import * as axios from '@/util/axios';
import { reg } from "@/assets/js/RegExp";
import goodsDialog from './components/goodsDialog';
import singleCoupon from './components/singleCoupon';
export default {
  props: {
    name: {
      type: String,
    }
  },
  data() {
    return {
      loading: false, // 
      dialogBtnLoading: false, // 对话框按钮
      templateVisible: false, // 新增、编辑模板 模态框
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [], // 
      selectedIds: [], // 选中的批量id

      // - 模板弹窗相关 -
      title: '新增优惠券模板',
      templateForm: {
        couponName: '',
        money: null,
        useUnLimited: true, // 无门槛
        purchaseAboveMoney: null, // 满减阈值
        allServicePromote: true,
        allProductPromote: true,
        serviceList: [],
        productList: [],
        description: '',
        id: null,
      },
      templateFormRules: {
        couponName: { required: true, message: '请输入优惠券名称', trigger: 'change' },
        usableService: { required: true, validator: this.usableServiceValid, trigger: 'change' },
        usableProduct: { required: true, validator: this.usableProductValid, trigger: 'change' },
      },
      goodsType: '', // Service, Production . 给后端的时候转小写(子组件内处理)
      goodsVisible: false, 
      checkedGoods: new Set(),
      selectedServiceIds: new Set(), // - 勾选处理用
      selectedServiceObj: {}, // - 勾选处理用
      selectedProductionIds: new Set(), // - 勾选处理用
      selectedProductionObj: {}, // - 勾选处理用
      // = 模板弹窗相关 =

      // - 派发弹窗相关 -
      phone: '',
      sendVisible: false, //
      codeBtnLoading: false, 
      timer: 0, // 验证码倒计时
      sendForm: {
        // r1
        sendRightNow: true, // true:立即派送,false:指定时间派送
        sendTime: '',
        // r2
        validDateType: 'APPOINT_DATE', // APPOINT_DATE:指定日期生效, COUPON_GET_DAY:领劵当日生效
        beforeComputedTimes: [],
        appointDateFrom: '',
        appointDateTo: '',
        validDays: null, 
        // r3
        sendAmount: null,
        // r4
        isLimitPerMan: false, // true:限领,false:不限
        limitPerManNum: null, 
        cellPhoneMsgCode: '', // 短信验证码 - 请求时放到对象外层
        templateSnapshotId: null, // 优惠券快照id  点击派发时存入
      },
      pickerOptions: {
        disabledDate: function(date) {
          return  new Date().getTime() - 8.64e7 > date
        }
      },
      currentRow: {},
      // = 派发弹窗相关 =
      modelLoad: false,
    }
  },
  created() {
    this.init()
    axios.get('/getBrandOwnerPhoneInfo/' + this.currentInfo.brandId).then(res => {
      this.phone = res
    })
  },
  methods: {
    // 可用服务产品校验
    usableServiceValid(r, v, cb) {
      if (this.templateForm.allServicePromote === false && this.templateForm.serviceList.length == 0) {
        cb('请至少选择一项服务')
      } else {
        cb()
      }
    },
    usableProductValid(r, v, cb) {
      if (this.templateForm.allProductPromote === false && this.templateForm.productList.length == 0) {
        cb('请至少选择一项产品')
      } else {
        cb()
      }
    },
    // 初始化模板列表
    async init() {
      this.loading = true
      let data = {
        couponName: this.name || null,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        storeId: this.currentInfo.shopId,
      }
      let res = await axios.post('/getCouponTemplateList', data)
      this.tableData = res.couponTemplateList || []
      this.total = res.total || 0
      this.loading = false
    },
    // 全选及其批量操作
    handleSelectionChange(arr) {
      this.selectedIds = arr.map(i => i.id)
    },
    multipleDeleteCoupons() {
      this.deleteCoupons(this.selectedIds)
    },
    deleteCoupons(arr) {
      if (arr.length) {
        axios.post('/deleteCouponTemplate', {
          templateIds: arr
        }).then(res => {
          if (res.success) {
            this.$message.success('操作成功')
            this.init()
          } else {
            this.$message.error('操作失败')
          }
        })
      } else {
        this.$message.error('请至少选择一个优惠券模板')
      }
    },
    // 页码切换
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    // ============================= 模板 ============================= //
    // 编辑模板 - 
    async editTemplate(row) {
      // console.log(row)
      // this.templateForm = JSON.parse(JSON.stringify(row))
      this.title = '编辑优惠券模板'
      this.templateVisible = true
      try {
        this.modelLoad = true
        const res = await axios.get(`/getCouponTemplateById/${row.id}`)
        this.templateForm = res.couponTemplate
        if (this.templateForm.allProductPromote) {
          this.templateForm.productList = []
        } else if (!this.templateForm.productList.length) {
          this.templateForm.allProductPromote = 0
        }
        if (this.templateForm.allServicePromote) {
          this.templateForm.serviceList = []
        } else if (!this.templateForm.serviceList.length) {
          this.templateForm.allServicePromote = 0
        }
      } finally {
        this.modelLoad = false
      }
    },
    // 新增/编辑 模板
    handleCloseTemplate() {
      this.templateVisible = false
      this.$refs.form.resetFields()
      this.resetTemplate()
    },
    resetTemplate() {
      this.title = '新增优惠券模板'
      this.templateForm = {
        couponName: '',
        money: null,
        useUnLimited: true, // 无门槛
        purchaseAboveMoney: null, // 满减阈值
        allServicePromote: true,
        allProductPromote: true,
        serviceList: [],
        productList: [],
        description: '',
        id: null,
      }
    },
    saveTemplate() {
      // 校验并请求接口
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = this.templateForm
          if (!form.allServicePromote && !form.allProductPromote && !form.serviceList.length && !form.productList.length) {
            return this.$message.error('需要至少一个商品可以使用优惠券')
          }
          let data = JSON.parse(JSON.stringify(form))
          if (data.allServicePromote == 0) {
            this.templateForm.serviceList = []
          }
          if (data.allProductPromote == 0) {
            this.templateForm.productList = []
          }
          data.allServicePromote = !!data.allServicePromote
          data.allProductPromote = !!data.allProductPromote
          // delete data.templateSnapshotId
          data.money *= 1
          data.purchaseAboveMoney = data.useUnLimited ? 0 : data.purchaseAboveMoney * 1
          data.storeId = this.currentInfo.shopId
          this.dialogBtnLoading = true
          axios.post('/saveOrUpdateCouponTemplate', {couponTemplateInfo: data}).then(res => {
            if (res.success) {
              this.handleCloseTemplate()
              this.init()
              this.dialogBtnLoading = false
            } else {
              this.$message.error(`模板${data.id ? '编辑' : '创建'}失败`)
            }
          })
          .catch(err => {
            this.dialogBtnLoading = false
          })
        } else {
          this.$message.error('检测到非法输入!')
        }
      })
    },
    // 通用 服务、产品--打开模态框
    handleChooseGoods(type) {
      this.goodsType = type // 这个值在返回的时候有用 handleGetSelectedGoods
      this.goodsVisible = true
      this.checkedGoods = this[`selected${type}Ids`]
    },
    // 通用 服务、产品--选择
    handleGetSelectedGoods(obj) {
      obj.yes.map(i => {
        if (!this[`selected${this.goodsType}Ids`].has(i.goodsId)) {
          this[`selected${this.goodsType}Ids`].add(i.goodsId)
          this[`selected${this.goodsType}Obj`][i.goodsId] = i
        }
      })
      obj.no.map(i => {
        if (this[`selected${this.goodsType}Ids`].has(i.goodsId)) {
          this[`selected${this.goodsType}Ids`].delete(i.goodsId)
          delete this[`selected${this.goodsType}Obj`][i.goodsId]
        }
      })
      if (this.goodsType === 'Service') {
        this.templateForm.serviceList = Object.values(this[`selected${this.goodsType}Obj`])
      } else {
        this.templateForm.productList = Object.values(this[`selected${this.goodsType}Obj`])
      }
    },
    // 通用 服务、产品--删除 // type 必须依靠传入 不能直接用 this.goodsType !!!
    delSelectedGoods(index, type) {
      let id = 0
      if (type === 'Service') {
        id = this.templateForm.serviceList[index].goodsId
        this.templateForm.serviceList.splice(index, 1)
      } else {
        id = this.templateForm.productList[index].goodsId
        this.templateForm.productList.splice(index, 1)
      }
      this[`selected${type}Ids`].delete(id)
      delete this[`selected${type}Obj`][id]
    },
    // ============================= 派发 ============================= //
    handleCloseSend() {
      this.sendVisible = false
      this.$refs.sendForm.resetFields()
      this.sendForm = {
        sendRightNow: true,
        sendTime: '',
        validDateType: 'APPOINT_DATE',
        appointDateFrom: '',
        appointDateTo: '',
        validDays: null, 
        sendAmount: null,
        isLimitPerMan: false,
        limitPerManNum: null, 
        cellPhoneMsgCode: '',
        templateSnapshotId: null,
      }
    },
    showSendCouponDialog(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
      this.sendForm.templateSnapshotId = row.templateSnapshotId
      this.sendVisible = true
    },
    sendCoupon() {
      this.$refs.sendForm.validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.sendForm))
          let params = {
            couponSendRecord: { 
              ...data, 
              appointDateFrom: data.validDateType === 'APPOINT_DATE' ? data.beforeComputedTimes[0] : null,
              appointDateTo: data.validDateType === 'APPOINT_DATE' ? data.beforeComputedTimes[1] : null,
              storeId: this.currentInfo.shopId 
            },
            brandId: this.currentInfo.brandId,
            cellPhoneMsgCode: data.cellPhoneMsgCode,
          }
          this.dialogBtnLoading = true
          axios.post('/sendGoodsCoupon', params).then(res => {
            if (res.success) {
              this.handleCloseSend()
              this.init()
            } else {
              this.$message.error(`派发失败`)
            }
          })
          .catch(err => {})
          .then(() => {
            this.dialogBtnLoading = false
          })
        } else {
          this.$message.error('检测到非法输入!')
        }
      })
    },
    // 获取验证
    getCode() {
      axios.post('/sendCouponCellPhoneMsg', {brandId: this.currentInfo.brandId}).then(res => {
        if (res.success) {
          this.timer = 60
          this.codeBtnLoading = true
          let t = setInterval(() => {
            this.timer--
            if (this.timer <= 0) {
              this.codeBtnLoading = false
              clearInterval(t)
              t = null
            }
          }, 1000)
        } else {
          this.$message({type: 'error', message: res.message})
        }
      })
    },
    /* ============================= 校验部分 ============================= */
    // 模板
    // -优惠券金额
    validateMoney(rule, value, cb) {
      if (reg.price.test(value) && value < 100000) {
        cb()
      } else {
        cb('请输入正确的金额, 允许2位小数, 最多99999.99!')
      }
    },
    // -满减金额
    validateLimitedMoney(rule, value, cb) {
      if (this.templateForm.useUnLimited) {
        cb()
      } else {
        if (reg.price.test(value) && value < 100000) {
          cb()
        } else {
          cb('请输入正确的金额, 允许2位小数, 最多99999.99!')
        }
      }
    },
    // 派发
    // -派发指定时间
    validateSendTime(rule, value, cb) {
      if (this.sendForm.sendRightNow) {
        cb()
      } else {
        if (!!value) {
          cb()
        } else {
          cb('请设置派发时间')
        }
      }
    },
    // -生效日期
    validateDateType(rule, value, cb) {
      if (this.sendForm.validDateType === 'APPOINT_DATE') {
        if (this.sendForm.beforeComputedTimes && this.sendForm.beforeComputedTimes.length) {
          cb()
        } else {
          cb('请指定生效起止日期')
        }
      } else {
        if (this.sendForm.validDays && this.sendForm.validDays < 366 && this.sendForm.validDays > 0) {
          cb()
        } else {
          cb('请输入有效期限, 1-365天')
        }
      }
    },
    // -派发数量
    validateSendAmount(rule, value, cb) {
      if (!!value) {
        cb()
      } else {
        cb('请输入正整数')
      }
    },
    // -限量
    validateLimitPerManNum(rule, value, cb) {
      if (!this.sendForm.isLimitPerMan) {
        cb()
      } else {
        if (!!value) {
          cb()
        } else {
          cb('请输入正整数')
        }
      }
    },
    // -验证码
    validateCellPhoneMsgCode(rule, value, cb) {
      if (value && value.length === 6) {
        cb()
      } else {
        cb('请输入短信验证码')
      }
    }
  },
  watch: {
    name: {
      handler: function(v, o) {
        this.handleCurrentChange(1)
      },
    },
    'templateForm.allServicePromote'(val,o) {
      if (o === false) {
        this.templateForm.serviceList = []
      }
    },
    'templateForm.allProductPromote'(val,o) {
      if (o === false) {
      this.templateForm.productList = []
      }
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
    // 动态计算商品表格高度, 如果文字太多而换行可能存在样式问题
    serviceTableHeight() {
      if (this.templateForm.serviceList.length > 4) {
        return 49 * 5 + 65 + 'px'
      } else {
        return 49 * this.templateForm.serviceList.length + 65 + 'px'
      }
    },
    productTableHeight() {
      if (this.templateForm.productList.length > 4) {
        return 49 * 5 + 65 + 'px'
      } else {
        return 49 * this.templateForm.productList.length + 65 + 'px'
      }
    },
  },
  components: { goodsDialog, singleCoupon }
}
</script>
<style lang='scss' scoped>
.coupon-model {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  .filter-line {
    height: 75px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    align-items: center;
    .filter-item {
      margin-left: 12px;
    }
  }
  .main-table {
    padding: 0 10px;
    background: #fff;
  }
  .pagination-line {
    padding: 0 10px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.ellipsis-text {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.icon-icon_operate_delete {
  cursor: pointer;
}

.info-box {
  display: flex;
  .message {
    margin-left: 12px;
    margin-top: 20px;
    color: #F52D56;
  }
}
</style>
