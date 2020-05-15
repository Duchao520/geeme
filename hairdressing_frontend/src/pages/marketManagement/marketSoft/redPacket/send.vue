<template>
  <div class="send-red-packet-box" v-loading="pageLoading">
    <seed-header title="派发红包" :hasTabs="false"></seed-header>
    <div class="send-red-packet-main-box scrollbar">
      <div class="red-packet-container">
        <div class="red-packet-body">
          <el-form :model="form" label-width="110px" :rules="rules" ref="form">
            <el-form-item label="红包类型：" class="form-item-no-waring" prop="packetType">
              <el-select v-model="form.packetType" placeholder="请选择红包类型">
                <el-option v-for="type in typeOptions" :key="type.value" :value="type.value" :label="type.name"></el-option>
              </el-select>
              <p class='red-packet-text-info'>{{typeInfo}}</p>
            </el-form-item>
            <el-form-item label="红包名称：" prop="packetName">
              <el-input class="red-packet-name" v-model="form.packetName" placeholder="请输入红包名称, 最多8字符" maxlength="8"/>
            </el-form-item>
            <!-- <el-form-item label="派发条件：" prop="packetType">
              <div class="single-red-packet" v-for="(rp,idx) in form.listRedPacketDetail" :key="idx">
                <el-form-item
                  label="红包金额：" 
                  :prop="'listRedPacketDetail.' + idx + '.packetMoney'"
                  :rules="{required: true, validator: validatePacketMoney, trigger: 'change'}"
                >
                  <el-input type="number" v-model.number="rp.packetMoney" :maxlength="7" class="single-packet-money" placeholder="请输入红包金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-form-item> -->
            <el-form-item label="红包明细：" prop="packetType">
              <div class="single-red-packet" v-for="(rp,idx) in form.listRedPacketDetail" :key="idx">
                <el-form-item 
                  label="红包金额：" 
                  :prop="'listRedPacketDetail.' + idx + '.packetMoney'"
                  :rules="{required: true, validator: validatePacketMoney, trigger: 'change'}"
                >
                  <el-input type="number" v-model.number="rp.packetMoney" :maxlength="7" class="single-packet-money" placeholder="请输入红包金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="使用条件："
                  :prop="'listRedPacketDetail.' + idx"
                  :rules="{required: true, validator: validateLeastMoney, trigger: 'change'}"
                >
                  <el-radio-group v-model="rp.packetUseCondition">
                    <el-radio :label="0">无门槛</el-radio>
                    <el-radio :label="1">
                      满&nbsp; 
                      <el-input type="number" v-model.number="rp.leastMoney" :maxlength="7" class="single-packet-least-money" :disabled="rp.packetUseCondition !== 1">
                        <template slot="append">元</template>
                      </el-input>
                      &nbsp;可以使用
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="可用商品：" prop="packetType">
                  <el-radio-group v-model="rp.packetUseStrategy" class="single-packet-use-strategy">
                    <el-radio :label="0">所有服务和产品</el-radio>
                    <el-radio :label="1" style="margin-left:0;">所有服务</el-radio>
                    <el-radio :label="2" style="margin-left:0;">所有产品</el-radio>
                    <el-radio :label="3" style="margin-left:0;">
                      指定服务
                      <el-button @click="openGoodsDialog(idx, 1)" size="small" plain class="plain_blue_btn" :disabled="rp.packetUseStrategy !== 3">选择服务</el-button>
                      <i style="margin-left: 40px;"></i>
                      指定产品
                      <el-button @click="openGoodsDialog(idx, 2)" size="small" plain class="plain_blue_btn" :disabled="rp.packetUseStrategy !== 3">选择产品</el-button>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- 指定服务选择的结果 -->
                <el-table 
                  stripe 
                  class="red-packet-goods-table" 
                  :data="rp.partServiceUseStrategy" 
                  v-if="rp.partServiceUseStrategy.length"
                  header-row-class-name="goods-table-herder" 
                  :height="rp.partServiceUseStrategy.length > 4 ? 5 * 49 + 41 : rp.partServiceUseStrategy.length * 49 + 41" 
                >
                  <el-table-column label="一级服务分类" prop="typeOneName"></el-table-column>
                  <el-table-column label="二级服务分类" prop="typeTwoName"></el-table-column>
                  <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                      <i class="icon iconfont icon-icon_operate_delete" @click="delSelectedService(scope.$index, idx, 'Service')"></i>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 指定产品选择的结果 -->
                <el-table 
                  stripe 
                  class="red-packet-goods-table" 
                  :data="rp.partProductUseStrategy" 
                  v-if="rp.partProductUseStrategy.length"
                  header-row-class-name="goods-table-herder" 
                  :height="rp.partProductUseStrategy.length > 4 ? 5 * 49 + 41 : rp.partProductUseStrategy.length * 49 + 41" 
                >
                  <el-table-column label="一级产品分类" prop="typeOneName"></el-table-column>
                  <el-table-column label="二级产品分类" prop="typeTwoName"></el-table-column>
                  <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                      <i class="icon iconfont icon-icon_operate_delete" @click="delSelectedService(scope.$index, idx, 'Product')"></i>
                    </template>
                  </el-table-column>
                </el-table>
                
                <!-- 删除 -->
                <i class="red-packet-del-btn icon iconfont icon-icon_operate_delete" v-if="idx" @click="delSinglePacket(idx)"></i>
              </div>
              <!-- 增加 -->
              <div class="add-single-packet" v-if="form.listRedPacketDetail.length < max" @click="addSinglePacket">
                <i class="icon iconfont icon-icon_ope_append"></i>
                增加红包
              </div>
            </el-form-item>
            <el-form-item label="生效期限：" 
              prop="validTimeStrategy" 
            >
              <el-radio-group v-model="form.validTimeStrategy">  
                <el-row>
                  <el-radio :label="0">
                    领取当日开始&nbsp;
                    <el-input 
                      v-model.number="form.effectiveTypeOneDays" maxlength="3" placeholder="请输入" 
                      class="time-length" :disabled="form.validTimeStrategy !== 0"
                    />
                    &nbsp;天内有效
                  </el-radio>
                </el-row>
                <el-row style="margin-top: 10px;">
                  <el-radio :label="1">
                    领取次日开始&nbsp;
                    <el-input 
                      v-model.number="form.effectiveTypeTwoDays" maxlength="3" placeholder="请输入" 
                      class="time-length" :disabled="form.validTimeStrategy !== 1"
                    />
                    &nbsp;天内有效
                  </el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <!-- 优惠券同享功能暂时屏蔽!! -->
            <!-- <el-form-item label="优惠券同享：" prop="packetType">
              <el-radio-group v-model="form.useWithCoupons">
                <el-radio :label="true">可与优惠券同享</el-radio>
                <el-radio :label="false">不可与优惠券同享</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="适用门店：" prop="packetType">
              <el-radio-group v-model="form.suitStoreStrategy">
                <el-radio :label="0">所有门店</el-radio>
                <el-radio :label="1">所有直营店</el-radio>
                <el-radio :label="2">
                  指定门店&nbsp;
                  <el-button size="small" plain class="plain_blue_btn" :disabled="form.suitStoreStrategy !== 2" @click="openShopsDialog">选择门店</el-button>
                </el-radio>
              </el-radio-group>
              <!-- 指定门店选择的结果 -->
              <div class="selected-shops">
                <el-table 
                  stripe 
                  cell-class-name="shops-cell" 
                  header-row-class-name="goods-table-herder" 
                  :data="renderCheckedShops" 
                  v-if="renderCheckedShops.length"
                  :height="renderCheckedShops.length > 4 ? 5 * 49 + 41 : renderCheckedShops.length * 49 + 41" 
                >
                  <el-table-column show-overflow-tooltip label="省份" prop="province"></el-table-column>
                  <el-table-column show-overflow-tooltip label="城市" prop="city"></el-table-column>
                  <el-table-column show-overflow-tooltip label="门店名称" prop="storeName"></el-table-column>
                  <el-table-column show-overflow-tooltip label="门店性质">
                    <template slot-scope="scope">
                      {{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="48">
                    <template slot-scope="scope">
                      <i class="icon iconfont icon-icon_operate_delete" @click="delSelectedShops(scope.$index)"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
            <el-form-item label="审核验证码：" prop="code">
              <el-input class="red-packet-phone-code" maxlength="6" placeholder="请输入短信验证码" v-model.trim="form.code"/>&nbsp;
              <el-button class="normal_blue_btn" :loading="codeBtnLoading" @click="getCode">{{codeBtnLoading ? `${timer}s` : '获取验证码'}}</el-button>
              <p class='red-packet-text-info'>说明：短信验证码将发送至审核人员手机：{{phone}}，请及时查收。</p>
            </el-form-item>
            <el-form-item label="派发时间：" prop="appointUpperTime" :rules="{required: true, validator: appointUpperTime}">
              <el-radio-group v-model="form.upperImmediately">
                <el-radio :label="true">即时派发</el-radio>
                <el-radio :label="false">
                  指定时间&nbsp;
                  <el-date-picker
                    :disabled="form.upperImmediately"
                    v-model="form.appointUpperTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="setDisabledDate"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-radio>
              </el-radio-group>
              <p class='red-packet-text-info'>注意：每次更新派发生效后，同一红包此前的派发规则自动停用（已领取的红包不影响使用）。</p>
            </el-form-item>
          </el-form>
          <div class="footer-line">
            <el-button class="normal_blue_btn" @click="toCreatePacket">确认派发</el-button>
            <el-button plain class="plain_gray_btn" @click="toCancel">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择指定服务/产品 [需要销毁!] -->
    <selectService 
      v-if="goodsVisible"
      :goodsVisible="goodsVisible"
      :title="currentGoodsTitle"
      :superList="currentList" 
      :superCheckedGoods="renderCheckedGoods"
      @suberData="setGoodsTable"
      @close="goodsVisible=false"
    />
    <!-- 选择适用门店 -->
    <selectShops
      v-if="shopsVisible"
      :shopsVisible="shopsVisible"
      :title="shopsDialogTitle"
      :superCheckedShops="checkedShopIds"
      @suberData="setShopsTable"
      @close="shopsVisible=false"
    />
  </div>
</template>

<script>
import * as axios from '@/util/axios'
import selectService from './components/selectServices'
import selectShops from './components/selectShops'
import { mapActions, mapState } from "vuex"
import { reg, checkReg } from "@/assets/js/RegExp"
export default {
  name: 'send-red-packet',
  data() {
    let validTimeStrategy = (rules, value, callback) => {
      if (!checkReg(reg["yearDays"], this.validDay)) {
        callback(new Error("请输入不大于365的自然数!"))
      } else {
        callback()
      }
    }
    let packetName = (rule, value, callback) => {
      if (!checkReg(/^[A-z0-9_\-\u4e00-\u9fa5]{2,8}$/, value)) {
        callback(new Error("请输入2~8长度的数字、字母、汉字、减号和下划线"))
      } else {
        callback()
      }
    }
    let code = (rule, value, callback) => {
      if (!checkReg(/^\d{1,6}$/, value)) {
        callback(new Error("正确的验证码"))
      } else {
        callback()
      }
    }
    return {
      max: 20, // 设置红包最多个数，避免数据量太大
      phone: '', // 审核人手机号
      form: {
        // 红包类型
        packetType: 1, // 1-新人红包
        packetName: '',
        validTimeStrategy: 0, // 0-当日 1-次日 2-指定
        effectiveTypeOneDays: null,
        effectiveTypeTwoDays: null,
        validDay: null,
        useWithCoupons: false, // 优惠券同用 // 暂时屏蔽
        suitStoreStrategy: 0, // 适用门店 0-所有门店 1-所有直营店 2-指定门店
        code: '', // 短信验证码
        upperImmediately: true, // 派发时间类型
        appointUpperTime: '', // 指定派发日期时间
        listRedPacketDetail: [
          // 单个红包信息
          {
            packetMoney: null,
            packetUseCondition: 0,
            packetUseStrategy: 0,
            partServiceUseStrategy: [],
            partProductUseStrategy: [],
          }
        ],
      },
      rules: {
        validTimeStrategy: {required: true, validator: validTimeStrategy},
        packetName: {required: true, validator: packetName},
        // code: {required: true, validator: code},
        packetType: {required: true, message: '请完善必填字段'}, // 偷个懒，所有带了默认单选框的都用他
      },
      typeOptions: [
        {
          value: 1,
          name: '新人红包'
        },
        // {
        //   value: 2,
        //   name: '老客红包'
        // },
        // {
        //   value: 3,
        //   name: '生日红包'
        // },
      ],
      // 1- 指定服务/产品 - begin ->
      goodsVisible: false, // 指定服务/产品模态框
      currentGoodsTitle: '',
      currentGoodsType: 1, // [红包明细]当前打开的模态框: 服务1 产品2
      currentPacketIdx: 0, // [红包明细]对应下标的红包
      renderCheckedGoods: [], // 反向渲染的勾选服务/产品
      currentList: [], // 是下面的服务或者产品
      servicesList: [],
      productsList: [],
      // 1- 指定服务/产品 - end <--
      // 2- 指定门店 - begin ----->
      shopsVisible: false, // 指定门店模态框
      shopsDialogTitle: '', // 指定门店模态框标题
      renderCheckedShops: [], // 反向渲染的勾选指定门店
      checkedShopIds: new Set(), // 选中的门店id
      checkedShopObj: {}, // 键值对化的选中门店 key: shopId, value: shopObj
      // 2- 指定门店 - end <-------
      timer: 0, // 验证码倒计时
      codeBtnLoading: false, // 验证码加载
      pageLoading: false, // 页面加载
    }
  },
  created() {
    console.log(this.$route.query)
    this.form.packetType = this.$route.query.type
    console.log(this.form)
    this.typeOptions[0].value = this.$route.query.type
    this.typeOptions[0].name = this.typeFilter(this.$route.query.type)
    this.getServicesList()
    this.getProductsList()
    axios.get('/getBrandOwnerPhoneInfo/' + this.currentInfo.brandId).then(res => {
      this.phone = res
    })
  },
  methods: {
    // 获取服务数据 --for:指定指定服务/产品--
    getServicesList() {
      axios.post('/getStoreSortInfoWithFilter', {brandId: this.currentInfo.brandId}).then(res => {
        if (res.hasData) {
          this.servicesList = res.sortInfos
        }
      })
    },
    // 获取产品数据 --for:指定指定服务/产品--
    getProductsList() {
      axios.post('/getProductSortListByNameAndBrandId', {brandId: this.currentInfo.brandId}).then(res => {
        if (res.hasData) {
          this.productsList = res.sortInfos
        }
      })
    },
    // 打开指定服务/产品模态框 --for:指定指定服务/产品--
    openGoodsDialog(idx, type) {
      this.currentPacketIdx = idx
      this.currentGoodsType = type
      this.currentGoodsTitle = type === 1 ? '选择服务分类' :'选择产品分类'
      this.currentList = type === 1 ? this.servicesList : this.productsList
      this.goodsVisible = true
      let tag =  type === 1 ? 'partServiceUseStrategy' : 'partProductUseStrategy'
      this.renderCheckedGoods = this.form.listRedPacketDetail[idx][tag]
    },
    // 根据模态框的勾选状态展示当前的选择产品/服务到表格 --for:指定指定服务/产品--
    setGoodsTable(list) {
      let type = this.currentGoodsType === 1 ? 'partServiceUseStrategy' : 'partProductUseStrategy'
      let tagTable = this.form.listRedPacketDetail[this.currentPacketIdx][type] = []
      for (let i = 0; i < list.length; i++) {
        // 全选或半选的一级类别
        if (list[i].checked || list[i].indeterminate) {
          for (let j = 0; j < list[i].sortTwo.length; j++) {
            list[i].sortTwo[j].checked && tagTable.push({
              typeOneId: list[i].jimeiClassId,
              typeOneName: list[i].sortName,
              typeTwoId: list[i].sortTwo[j].jimeiClassId,
              typeTwoName: list[i].sortTwo[j].sortName,
            })
          }
        }
      }
      this.goodsVisible = false
    },
    // 删除一个指定的服务或产品 --for:指定指定服务/产品--
    delSelectedService(rowIdx, redPacketIdx, type) {
      this.form.listRedPacketDetail[redPacketIdx][`part${type}UseStrategy`].splice(rowIdx, 1)
    },
    // 打开适用门店模态框 --for:指定指定门店--
    openShopsDialog() {
      this.shopsVisible = true
      this.shopsDialogTitle = '选择适用门店'
    },
    // 模态框适用门店选择交互 --for:指定指定门店--
    setShopsTable(obj) {
      obj.yes.map(i => {
        if (!this.checkedShopIds.has(i.id)) {
          this.checkedShopIds.add(i.id)
          this.checkedShopObj[i.id] = {
            storeId: i.id, 
            storeName: i.name,
            province: i.province,
            city: i.city,
            type: i.type,
          }
        }
      })
      obj.no.map(i => {
        if (this.checkedShopIds.has(i.id)) {
          this.checkedShopIds.delete(i.id)
          delete this.checkedShopObj[i.id]
        }
      })
      this.renderCheckedShops = Object.values(this.checkedShopObj)
    },
    // 删除一个指定的门店 --for:指定指定门店--
    delSelectedShops(idx) {
      // 先执行删除set/obj
      let id = this.renderCheckedShops[idx].storeId
      this.checkedShopIds.delete(id)
      delete this.checkedShopObj[id]
      // 再执行删除表格
      this.renderCheckedShops.splice(idx, 1)
    },
    // 添加红包
    addSinglePacket() {
      this.form.listRedPacketDetail.push({packetMoney: null, packetUseCondition: 0, packetUseStrategy: 0, partServiceUseStrategy: [], partProductUseStrategy: []})
    },
    // 删除红包
    delSinglePacket(idx) {
      this.form.listRedPacketDetail.splice(idx, 1)
    },
    // 获取验证
    getCode() {
      axios.post('/getCreateRedPacketVerifycationCode', {brandId: this.currentInfo.brandId}).then(res => {
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
    // 确认派发
    toCreatePacket() {
      this.$refs.form.validate((valid)=> {
        if (valid) {
          let errorData = this.form.listRedPacketDetail.some(i => {
             if (i.packetUseStrategy === 3 && !i.partProductUseStrategy.length && !i.partServiceUseStrategy.length) {
               return true
             } else {
               return false
             }
          })
          if (errorData) {
            this.$message({type: 'error', message: '红包指定使用范围时，请至少指定一个服务或者产品'})
            return
          }
          let params = {}
          let info = JSON.parse(JSON.stringify(this.form))
          delete info.listRedPacketDetail
          params.redPacketInfo = info
          params.code = this.form.code
          params.listRedPacketDetail = this.form.listRedPacketDetail
          params.redPacketInfo.totalMoney = this.totalMoney
          params.redPacketInfo.packetTypeName = this.typeFilter(params.redPacketInfo.packetType)
          params.redPacketInfo.brandId = this.currentInfo.brandId
          // 如果是指定门店，加入指定门店名单
          params.redPacketInfo.partSuitStoreStrategy = {storeIdList: this.form.suitStoreStrategy === 2 ? this.renderCheckedShops : null}
          delete params.redPacketInfo.effectiveTypeOneDays
          delete params.redPacketInfo.effectiveTypeTwoDays
          delete params.redPacketInfo.code
          this.pageLoading = true
          axios.post('/createRedPacket', params).then(res => {
            if (res.success) {
              this.$message({type: 'success', message: res.message})
              this.toCancel()
            } else {
              this.$message({type: 'error', message: res.message})
            }
            this.pageLoading = false
          }).catch(err => {
            this.pageLoading = false
          })
        } else {
          this.$message({type: 'error', message: '请检查并完善数据'})
        }
      })
    },
    // 取消
    toCancel() {
      this.$router.go(-1)
    },
    // 红包类型名字转化
    typeFilter(type) {
      let typeMap = {
        1: '新人红包',
        2: '老客红包',
        3: '生日红包',
      }
      return typeMap[type]
    },
    // 红包金额验证
    validatePacketMoney(rule, value, callback) {
      if (!reg.price.test(value) || value == 0) { // html 中有maxlength需要同步
        callback(new Error("请输入正数, 最多2位小数!"))
      } else if (value > 9999.99) {
        callback('红包金额不能大于9999.99')
      } else {
        callback()
      }
    },
    // 红包满减金额验证
    validateLeastMoney(rule, obj, callback) {
      if (obj.packetUseCondition === 1) {
        if (!reg.price.test(obj.leastMoney) || obj.leastMoney == 0) { // html 中有maxlength需要同步
          callback(new Error("请输入正数, 最多2位小数!"))
        } else if (obj.leastMoney > 9999.99) {
          callback('满减金额不能大于9999.99')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 指定日期派发验证
    appointUpperTime(rule, value, callback) {
      if (!this.form.upperImmediately && !this.form.appointUpperTime) {
        callback(new Error("请选择一个日期"))
      } else {
        callback()
      }
    },
  },
  components: {selectService, selectShops},
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
    typeInfo() {
      switch (this.form.packetType) {
        case 1:
          return '说明：该红包自动派发给首次绑定小程序的用户。'
        case 2:
          return '说明：该红包派发给老客户。'
        default:
          return '说明：该红包派发给即将生日客户。'  
      }
    },
    totalMoney() {
      let t = 0
      this.form.listRedPacketDetail.map(i => {
        t += i.packetMoney
      })
      return t
    },
    validDay() {
      let data = this.form.validTimeStrategy === 0 ? this.form.effectiveTypeOneDays : this.form.effectiveTypeTwoDays
      this.form.validDay = data
      return data
    },
    setDisabledDate() {
      return {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
$blue: #58C9F3;
$gray: #d5dadf;
$bg: #f4f5f7;
// - 滚动条在外侧的4层布局:
.send-red-packet-box {
  display: flex;
  justify-content: center;
  .send-red-packet-main-box {
    width: calc(100vw - 40px);
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
  }
  .red-packet-container {
    min-height: calc(100vh - 105px);
  }
  .red-packet-body {
    max-width: 1440px;
    box-sizing: border-box;
    padding: 36px 72px 85px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
  }
  .red-packet-name {
    width: 217px;
  }
  .time-length {
    width: 100px;
  }
  .red-packet-phone-code {
    width: 145px;
  }
  .red-packet-text-info {
    font-size: 12px;
    color: #999;
  }
  .form-item-no-waring {
    margin-bottom: 0;
  }
  .single-red-packet {
    position: relative;
    box-sizing: border-box;
    padding: 20px 20px 10px;
    width: 550px;
    margin-bottom: 10px;
    border: 1px solid #f0f1f4;
    border-radius: 2px;
    .single-packet-money {
      width: 200px;
    }
    .single-packet-least-money {
      width: 156px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .single-packet-use-strategy {
      height: 80px;
      width: 360px;
      padding-top: 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .red-packet-goods-table {
      margin-bottom: 20px;
    }
    .red-packet-del-btn {
      position: absolute;
      bottom: -10px;
      right: -26px;
    }
  }
  .selected-shops {
    width: 550px;
    margin-top: 12px;
  }
  .add-single-packet {
    width: 80px;
    color: $blue;
    &:hover {
      cursor: pointer;
    }
  }
  .footer-line {
    padding-left: 100px;
  }
}
.icon-icon_operate_delete {
  &:hover {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
$bg: #f4f5f7;
.send-red-packet-box {  
  .goods-table-herder {
    background: $bg;
    th {
      background: $bg;
      padding: 0;
    }
  }
}
</style>
