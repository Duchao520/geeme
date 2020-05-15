<template>
  <div class="main-info-right" v-loading="pageLoading">
    <div class="status-box">
      <div class="status-main">
        <div class="icon-box">
          <i class="icon iconfont" :class="`icon-${iconInfo.className}`" :style="{'color': iconInfo.color}"></i>
        </div>
        <div class="status-info">
          <div>
            <span class="status-title">{{iconInfo.title}}</span>
            <!-- 这里需要11个状态的按钮 orz -->
            <!-- 1 待审核 品牌 审核 -->
            <el-button 
              size="mini" 
              @click="toAuthOrder"
              class="normal_blue_btn" 
              v-if="info.newOrderStatus === 1 && currentEntry === 'brand' && !info.deleted && checkRolesAuthorityInPage('brand_stock_require_detail-audit')"
            >
              订单审核
            </el-button>
            <!-- 2 待确认 门店 确认 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="checkOrderVisible = true"
              v-if="info.newOrderStatus === 2 && currentEntry === 'shop' && !info.deleted"
            >
              立即确认
            </el-button>
            <!-- 3 待支付 门店 支付  - 这一步暂时跳过了 不存在 -->
            <el-button class="normal_blue_btn" size="mini" v-if="info.newOrderStatus === 3 && currentEntry === 'shop' && !info.deleted">立即支付</el-button>
            <!-- 1,2,3 品牌 作废  -->
            <el-button 
              plain 
              size="mini" 
              class="plain_gray_btn" 
              @click="deleteOrderAtBrandSide"
              v-if="info.newOrderStatus < 4 && currentEntry === 'brand' && !info.deleted && checkRolesAuthorityInPage('brand_stock_require_detail-delete')" 
            >
              订单作废
            </el-button>
            <!-- 1,2,3 门店 取消  -->
            <el-button 
              plain 
              size="mini" 
              class="plain_gray_btn" 
              @click="deleteOrderAtShopSide"
              v-if="info.newOrderStatus < 4 && currentEntry === 'shop' && !info.deleted" 
            >
              取消订单
            </el-button>
            <!-- 4 待发货 品牌 财务审核 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="checkBillVisible = true"
              v-if="info.newOrderStatus === 4 && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_require_detail-financial')"
            >
              财务审核
            </el-button>
            <!-- 5 待发货 品牌 创建出库单 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="requireOutVisible = true"
              v-if="info.newOrderStatus === 5 && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_out_create')"
            >
              创建出库单
            </el-button>
            <!-- 6 待发货 品牌 审核出库单 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="checkOutVisible = true"
              v-if="info.newOrderStatus === 6 && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_out_audit')"
            >
              出库单备货
            </el-button>
            <!-- 7 待发货 品牌 确认发货 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="sendGoodsOutVisible = true"
              v-if="info.newOrderStatus === 7 && currentEntry === 'brand' && checkRolesAuthorityInPage('brand_stock_require_detail-sendGoods')"
            >
              确认发货
            </el-button>
            <!-- 8 待收货 门店 创建入库单 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="requireInVisible = true"
              v-if="info.newOrderStatus === 8 && currentEntry === 'shop'"
            >
              创建入库单
            </el-button>
            <!-- 9 待收货 门店 入库单审核 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="checkInVisible = true"
              v-if="info.newOrderStatus === 9 && currentEntry === 'shop'"
            >
              入库单清点
            </el-button>
            <!-- 10 待收货 门店 确认收货 -->
            <el-button 
              size="mini" 
              class="normal_blue_btn" 
              @click="checkReceiveVisible = true"
              v-if="info.newOrderStatus === 10 && currentEntry === 'shop'"
            >
              确认收货
            </el-button>
          </div>
          <div class="status-text">
            {{iconInfo.text}}
          </div>
        </div>
      </div>
      <div class="print-box">
        <!-- <el-button plain class="plain_blue_btn" icon="icon iconfont icon-icon_ope_print" size="mini"> 打 印</el-button> -->
      </div>
    </div>
    <div class="table-box">
      <h3>订单明细</h3>
      <div class="table-main">
        <component :is="`${currentTable}ApprovalTable`" :table="table" :info="info"/>
      </div>
    </div>
    <!-- 订单作废(总部)、取消(门店) -->
    <dialog-with-slot
      :title="deleteTitle"
      v-if="deteleVisible"
      icon="icon_popup_question"
      color="rgb(255, 109, 97)"
      :dialogVisible="deteleVisible"
      @close="deteleVisible = false"
      @resolve="deleteOrder"
    >
      <div>{{deleteText}}</div>
    </dialog-with-slot>
    <!-- 品牌审核订货单 1 -->
    <signRequireOrderDialog
      v-if="signDialogVisible"
      :detailInfo="currentSignRow"
      :dialogVisible="signDialogVisible"
      @close="signDialogVisible = false"
      @afterSignRequireOrder="handleSignOrder"
    /> 
    <!-- 门店确认订单1 -->
    <dialog-with-slot
      title="订单确认无误吗?"
      v-if="checkOrderVisible"
      icon="icon_popup_question"
      color="rgb(255, 109, 97)"
      :dialogVisible="checkOrderVisible"
      @close="checkOrderVisible = false"
      @resolve="handleCheckOrder"
    >
      <div>确认后，该订单将进入发货流程</div>
      <div class="upload-img" v-if="info.needPay">
        <el-upload
          :action="uploadUrl"
          :headers="headers"
          accept=".jpg, .png"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="confirmPayBill" :src="formatPicImg(confirmPayBill)" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">
            <h4>上传支付凭证</h4>
            <span>只能上传jpg/png文件，且不超过{{imgLimit}}M</span>
          </div>
        </el-upload>
      </div>
    </dialog-with-slot>
    <!-- 总部财务审核 -->
    <dialog-with-slot
      title="确认要通过审核吗?"
      v-if="checkBillVisible"
      icon="icon_popup_question"
      color="rgb(255, 109, 97)"
      :dialogVisible="checkBillVisible"
      @close="checkBillVisible = false"
      @resolve="handleCheckBill"
    >
      <p>
        <span>付款时间:</span>
        <span>{{info.confirmTime}}</span>
      </p>
      <p>
        <span>付款凭证:</span>
        <br>
        <img 
          class="confirm-pay-bill"
          preview="2" 
          preview-text=""
          :src="formatPicImg(info.confirmPayBill)"
        >
      </p>
    </dialog-with-slot>
    <!-- 创建出库单 (总部) -->
    <createRequireOutDialog
      :operateType="1"
      v-if="requireOutVisible"
      :detailInfo="{...info, listProductInvoiceSubInfo: table}"
      :dialogVisible="requireOutVisible"
      @close="requireOutVisible = false"
      @afterCreateOut="handleCreateOut"
    />
    <!-- 审核出库单 (总部 - 出库单备货) -->
    <checkRequireOutDialog 
      v-if="checkOutVisible"
      :detail="info"
      :dialogVisible="checkOutVisible"
      @close="checkOutVisible = false"
      @afterSign="handleCheckRequireOut"
    />
    <!-- 确认发货 (总部) -->
    <sendGoodsOutDialog
      v-if="sendGoodsOutVisible"
      :detail="info"
      :dialogVisible="sendGoodsOutVisible"
      @close="sendGoodsOutVisible = false"
      @afterSend="handleSendGoodsOut"
    />
    <!-- 创建入库单 (门店) -->
    <createRequireInDialog
      :operateType="0"
      v-if="requireInVisible"
      :detailInfo="{...info, listProductInvoiceSubInfo: table}"
      :dialogVisible="requireInVisible"
      @close="requireInVisible = false"
      @afterCreateIn="handleCreateIn"
    />
    <!-- 审核入库单 (门店-清点) -->
    <checkRequireInDialog
      :detail="info"
      v-if="checkInVisible"
      :dialogVisible="checkInVisible"
      @close="checkInVisible = false"
      @afterSign="handleCheckRequireIn"
    />
    <!-- 确认收货(门店) -->
    <dialog-with-slot
      title="确定要收货吗?"
      v-if="checkReceiveVisible"
      icon="icon_popup_question"
      color="rgb(255, 109, 97)"
      :dialogVisible="checkReceiveVisible"
      @close="checkReceiveVisible = false"
      @resolve="handleCheckReceive"
    >
      <div>确认后,该订单将完成交易。</div>
    </dialog-with-slot>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as api from '@/assets/js/interface';
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import beforeApprovalTable from './beforeApprovalTable'; // 审核前的表格
import afterApprovalTable from './afterApprovalTable'; // 审核后的表格
import signRequireOrderDialog from './signRequireOrderDialog'; // 审核 - 总部
import createRequireOutDialog from './createRequireOutDialog'; // 创建出库单 - 总部
import checkRequireOutDialog from './checkRequireOutDialog'; // 审核出库单(备货) - 总部
import sendGoodsOutDialog from './sendGoodsOutDialog'; // 发货 - 总部
import createRequireInDialog from './createRequireInDialog'; // 创建入库单 - 门店
import checkRequireInDialog from './checkRequireInDialog'; // 审核入库单(清点) - 门店

export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
    table: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pageLoading: false,
      // 作废，取消订单
      deleteText: '',
      deleteTitle: '',
      deteleVisible: false,
      // 审核订货单
      signDialogVisible: false,
      currentSignRow: {}, // 当前操作的订单数据
      // 门店确认订单
      checkOrderVisible: false,
      formatPicImg: utils.formatPicImg,
      confirmPayBill: '',
      uploadUrl: api.uploadPicture.URL,
      headers: utils.getUploadHeader(),
      imgLimit: 5,
      // 品牌财务确认 - 总部
      checkBillVisible: false,
      // 创建出库单 - 总部
      requireOutVisible: false,
      // 审核出库(出库备货) - 总部
      checkOutVisible: false,
      // 发货 - 总部
      sendGoodsOutVisible: false,
      // 创建入库单 - 门店
      requireInVisible: false,
      // 审核入库(入库清点) - 门店
      checkInVisible: false,
      // 门店最终确认
      checkReceiveVisible: false,
    }
  },
  methods: {
    /* 0000000000000000000000000000 */
    // 删除订单 1-1
    deleteOrderAtBrandSide() {
      this.deleteText = '作废后, 该订单不可恢复!'
      this.deleteTitle = '确定要作废订单吗?'
      this.deteleVisible = true
    },
    // 删除订单 1-2
    deleteOrderAtShopSide() {
      this.deleteText = '取消后, 该订单不可恢复!'
      this.deleteTitle = '确定要取消订单吗?'
      this.deteleVisible = true
    },
    // 删除订单 2
    deleteOrder() {
      this.pageLoading = true
      axios.post('/cancelProductInvoice', {productInvoiceId: this.info.productInvoiceId}).then(res => {
        if (res.success) {
          this.$message.success('订单已关闭')
        } else {
          this.$message.error(res.message)
        }
      }).then(() => {
        this.deteleVisible = false
        this.pageLoading = false
        this.$emit('init')
      })
    },

    /* 11111111111111111111111111111 */
    // 审核订货单 1(总部审核1)
    toAuthOrder() {
      this.currentSignRow = {productInvoiceId: this.info.productInvoiceId}
      this.signDialogVisible = true
    },
    // 审核订货单 2(总部审核1)
    handleSignOrder() {
      this.signDialogVisible = false
      this.$emit('init')
    },

    /* 222222222222222222222222222222 */
    // 门店端确认订单[无需支付： 确认; 需支付：凭证] (总部审核后2)
    handleCheckOrder() {
      if (this.info.needPay) { // 需支付的走上传凭证接口
        if (this.confirmPayBill) {
          let params = {
            confirmPayBill: this.confirmPayBill,
            productInvoiceId: this.info.productInvoiceId
          }
          this.pageLoading = true
          axios.post('/uploadPayInfoProductInvoice', params).then(res => {
            if (res.success) {
              this.$message.success('订单已提交, 等待总部发货')
            } else {
              this.$message.error(res.message)
            }
          }).then(() => {
            this.checkOrderVisible = false
            this.pageLoading = false
            this.$emit('init')
          })
        } else {
          this.$message.error('请上传支付凭证')
        }
      } else { // 不需支付的走确认订单接口
        this.pageLoading = true
        axios.post('/confirmProductInvoice', {productInvoiceId: this.info.productInvoiceId}).then(res => {
          if (res.success) {
            this.$message.success('订单已提交, 等待总部发货')
          } else {
            this.$message.error(res.message)
          }
        }).then(() => {
          this.checkOrderVisible = false
          this.pageLoading = false
          this.$emit('init')
        })
      }
    },
    // 凭证上传1
    beforeUpload(file) {
      const isRightImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const ltLimit = file.size / 1024 / 1024 < this.imgLimit;
      if (!ltLimit) {
        this.$message.error(`上传头像图片大小不能超过 ${this.imgLimit}MB!`);
      }
      return ltLimit && isRightImg;
    },
    // 凭证上传2
    handleUploadSuccess(res, file) {
      this.confirmPayBill = res.fileKey
    },

    /* 3333333333333333333333333333333 */
    // 总部财务审核需支付订单的凭证
    handleCheckBill() {
      this.pageLoading = true
      axios.post('/financialApproveProductInvoice', {productInvoiceId: this.info.productInvoiceId}).then(res => {
        if (res.success) {
          this.$message.success('订单确认, 等待创建出库单')
        } else {
          this.$message.error(res.message)
        }
      }).then(() => {
        this.checkBillVisible = false
        this.pageLoading = false
        this.$emit('init')
      })
    },
    handleCreateOut() {
      this.requireOutVisible = false
      this.$emit('init')
    },
    handleCheckRequireOut() {
      this.checkOutVisible = false
      this.$emit('init')
    },
    handleSendGoodsOut() {
      this.sendGoodsOutVisible = false
      this.$emit('init')
    },
    handleCheckRequireIn() {
      this.checkInVisible = false
      this.$emit('init')
    },
    /* 444444444444444444444444444444444 */
    // 门店创建入库单
    handleCreateIn() {
      this.requireInVisible = false
      this.$emit('init')
    },
    // 门店最终确认
    handleCheckReceive() {
      this.pageLoading = true
      axios.post('/confirmProductInvoiceFinish', {productInvoiceId: this.info.productInvoiceId}).then(res => {
        if (res.success) {
          this.$message.success('确认完成')
          this.$emit('init')
        } else {
          this.$message.error(res.message)
        }
      }).then(() => {
        this.checkReceiveVisible = false
        this.pageLoading = false
      })
    },
    // 品牌端的部分按钮权限, 暂时没细分到门店端
    checkRolesAuthorityInPage(routerOrPath, type='flag') {
      if (this.currentEntry === 'brand') {
        return this.checkHasBtnPermission(routerOrPath, type)
      }
      return true // 门店端暂时没做按钮权限
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    currentTable() {
      if (this.info.newOrderStatus === 1) return 'before'
        return 'after'
    },
    // 订单详情状态信息
    iconInfo() {
      switch(this.info.newOrderStatus) {
        case 1:
          return {
            title: this.info.deleted ? '已关闭' : '待审核',
            color: this.info.deleted ? '#707070' : '#58C9F3',
            className: this.info.deleted ? 'icon_order_reject' : 'icon_order_evaluate',
            text: this.info.deleted ? '订单已关闭' : '门店已提交订货单, 待总部审核',
          }
        case 2:
          return {
            title: this.info.deleted ? '已关闭' : '待确认',
            color: this.info.deleted ? '#707070' : '#E22C37',
            className: this.info.deleted ? 'icon_order_reject' : 'icon_order_send',
            text: this.info.deleted ? '订单已关闭' : '总部已审核, 待门店确认',
          }
        case 3:
          return {
            title: this.info.deleted ? '已关闭' : '待付款',
            color: this.info.deleted ? '#707070' : '#E22C37',
            className: this.info.deleted ? 'icon_order_reject' : 'icon_order_pay',
            text: this.info.deleted ? '订单已关闭' : '总部已审核, 待门店付款',
          }
        case 4:
        case 5:
        case 6:
        case 7:
          return {
            title: '待发货',
            color: '#FCB322',
            className: 'icon_order_service',
            text: `门店已${this.info.needPay ? '付款' : '确认'}, 待总部发货`,
          }  
        case 8:
        case 9:
        case 10:
          return {
            title: '待收货',
            color: '#FCB322',
            className: 'icon_order_receive',
            text: '总部已发货，待门店收货',
          }  
        case 11:
          return {
            title: '已完成',
            color: '#A9D86E',
            className: 'icon_order_done',
            text: '门店收货并入库，订单完成',
          }  
        default:
          return {
            title: '待审核',
            color: '#58C9F3',
            className: 'icon_order_evaluate',
            text: '门店已提交订货单, 待总部审核',
          }
      }
    }
  },
  components: { 
    beforeApprovalTable, // 总部审核前的表格
    afterApprovalTable, // 总部审核后的表格
    signRequireOrderDialog, // 审核订单弹窗 - 总部
    createRequireOutDialog, // 创建出库单弹窗 - 总部
    checkRequireOutDialog, // 审核出库单弹窗(备货) - 总部
    sendGoodsOutDialog, // 物流发货弹窗 - 总部
    createRequireInDialog, // 创建入库单弹窗 - 门店
    checkRequireInDialog, // 审核入库单弹窗(清点) - 门店
  }
}
</script>
<style lang='scss' scoped>
.status-box {
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 18px 20px 0;
  // background: lightblue;
  .status-main {
    flex: 1;
    display: flex;
    .icon-box {
      width: 42px;
    }
    .status-info {
      flex: 1;
    }
  }
  .print-box {
    max-width: 100px;
  }
}

.icon {
  font-size: 30px;
}

.status-title {
  font-size: 16px;
}
.status-text {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
  margin-top: 4px;
}

.table-box {
  padding: 0 20px;
  margin-bottom: 20px;
}
h3 {
  color: #333333;
  font-size: 14px;
  line-height: 40px;
}

/deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.upload-img {
  margin-top: 4px;
}
.avatar {
  object-fit: cover;
  object-position: center center;
}
.confirm-pay-bill {
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: center center;
  cursor: pointer;
}
/deep/ .el-icon-plus {
  width: 72px;
  height: 72px;
  line-height: 72px !important;
}
</style>
