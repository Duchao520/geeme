<template>
  <div v-loading.fullscreen.lock="submitLoading">
    <el-dialog
      width="900px"
      title="出库单发货"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="sendForm" 
        :model="sendForm" 
        label-width="100px"
      >
        <el-form-item 
          label="发货时间:" 
          prop="logisticsSendTime" 
          :rules="{required: true, message: '请选择发货时间', trigger: 'blur'}"
        >
          <el-date-picker
            v-model="sendForm.logisticsSendTime"
            align="right"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-row type="flex" style="margin: 20px 0;">
          <el-col>
            <el-form-item 
              label="物流公司:" 
              prop="logisticsCompany"
              :rules="{required: true, min: 2, max: 8, message: '请输入物流公司名称, 2 - 8 字符', trigger: 'blur'}"
            >
              <el-input v-model.trim="sendForm.logisticsCompany" maxlength="8" placeholder="物流公司名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item 
              label="物流单号:" 
              prop="logisticsNo"
              :rules="{required: true, min: 1, max: 32, message: '请输入物流单号', trigger: 'blur'}"
            >
              <el-input v-model.trim="sendForm.logisticsNo" maxlength="32" placeholder="物流单号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="flex-col">
            <el-form-item label="物流单据:" prop="logisticsBill">
              <!-- 图片上传 -->
              <el-upload
                :action="uploadUrl"
                :headers="headers"
                accept=".jpg, .png"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="sendForm.logisticsBill" :src="utils.formatPicImg(sendForm.logisticsBill)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <div class="upload-info">
              <h4>上传物流单据</h4>
              <span>只能上传jpg/png文件，且不超过{{imgLimit}}M</span>
            </div>
          </el-col>
          <!-- <el-col>
            <el-form-item label="发货备注:">
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- 备货时间、备货人字段由后端生成 -->
        <!-- 备货产品列表  -->
        <el-form-item label-width="40px">
          <el-table :data="form.listStockSubOrder" :height="form.listStockSubOrder.length > 10 ? '650px' : ''">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
            <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
            <el-table-column label="规格" prop="specificationName"></el-table-column>
            <el-table-column label="单位" prop="specificationUnit"></el-table-column>
            <el-table-column label="数量" prop="num"></el-table-column>
            <!-- 审核改名叫备货了, 盘亏出库可能语义有问题 -->
            <el-table-column label="备货数量" prop="signNum"></el-table-column>
            <el-table-column label="亏欠数量">
              <template slot-scope="{row}">
                {{(Number(row.num) - Number(row.signNum)).toFixed()}}
              </template>
            </el-table-column>
            <!-- 是否条形码校验 - 条形码输入数量 -->
            <el-table-column label="条形码">
              <template slot-scope="{row}">
                <span v-if="row.needCheck">
                  <span :class="{unfinsh: row.recordNum !== row.num}">{{row.recordNum}}</span><span> / {{row.num}}</span>
                  <br>
                  <span class="like-link" @click="handleGetBarCodeDetail(row)">
                    详情
                  </span>
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="出库备注:">
          {{form.remarks}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button 
          class="normal_blue_btn"
          @click="sendGoodsOut"
        >确认发货</el-button>
        <el-button plain class="plain_gray_btn" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 条形码录入详情组件 -->
    <barCodeListDialog
      v-if="barCodeListVisible"
      :detail="currentGoodsRow"
      :dialogVisible="barCodeListVisible"
      @close="barDialogClose"
    />
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as api from '@/assets/js/interface';
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import barCodeListDialog from './barCodeListDialog'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      utils,
      submitLoading: false,
      signDialogVisible: false,
      form: {},
      sendForm: {
        logisticsBill: '', // 物流单据图片key
        logisticsCompany: '', // 物流公司
        logisticsNo: '', // 物流编号
        logisticsSendTime: '', // 物流发货时间
        productInvoiceId: '', // 要货单ID
      },
      barCodeListVisible: false, // 条码详情
      currentGoodsRow: {}, // 当前操作的条码产品规格数据, 需要附加字段

      imgLimit: 5,
      uploadUrl: api.uploadPicture.URL,
      headers: utils.getUploadHeader(),
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init () {
      this.submitLoading = true
      await axios.post('/getProductStockOrderDetailInfo', {stockOrderId: this.detail.outStockOrderId}).then(res => {
        if (res.success) {
          this.submitLoading = false
          this.form = res.stockOrderInfo
          this.sendForm.productInvoiceId = res.stockOrderInfo.productInvoiceId // 
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.handleClose()
      })
    },
    handleClose() {
      this.$emit('close')
    },
    barDialogClose() {
      this.barCodeListVisible = false
      this.init()
    },
    sendGoodsOut() {
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          axios.post('/deliverProductInvoice', this.sendForm).then(res => {
            if (res.success) {
              this.$emit('afterSend')
              this.submitLoading = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请完善信息')
        }
      })
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
      this.sendForm.logisticsBill = res.fileKey
    },
    // 获取单个产品规格的条码数据
    handleGetBarCodeDetail(row) {
      this.barCodeListVisible = true
      this.currentGoodsRow = {
        ...row,
        // editable: !Number(this.superInfo.status), // '0': 未审核(true); '1': 已审核、'2': 已删除(false)
        editable: false, // '0': 未审核(true); '1': 已审核、'2': 已删除(false)
        stockOrderNo: this.form.stockOrderNo,
        storageTime: this.form.storageTime,
        storageType: this.form.storageType,
        operateType: this.form.operateType,
      }
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
  },
  filters: {
    storageTypeFilter(type) {
      let map = {
        1: '采购入库',
        2: '订货入库',
        3: '调拨入库',
        4: '销售退货',
        5: '盘盈入库',
        6: '初始入库',
        7: '赠送入库',
        8: '其他入库',
        9: '订货退回', // 品牌入库
        11: '退采购出库',
        12: '订货出库',
        13: '调拨出库',
        14: '销售出库',
        15: '盘亏出库',
        16: '赠送出库',
        17: '其他出库',
        18: '订货退回', // 门店出库
        19: '门店领用',
      }
      return map[type]
    },
    statusFilter(status) {
      let map = {
        '0': '待审核',
        '1': '已审核',
        '2': '已删除',
      }
      return map[status]
    },
  },
  components: { barCodeListDialog }
}
</script>
<style lang='scss' scoped>
/deep/ .el-form-item {
  margin-bottom: 0;
}

/deep/ .el-dialog__footer {
  text-align: left;
}
.like-link {
  cursor: pointer;
  color: rgb(88, 201, 243);
}
.unfinsh {
  color: red;
}

.flex-col {
  display: flex;
  .upload-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin: 0 0 12px 12px;
  }
}
.avatar {
  object-fit: cover;
  object-position: center center;
}
</style>
