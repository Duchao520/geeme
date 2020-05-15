<template>
  <G-FullPage title="支付宝特约商户" @back="$router.go(-1)">
    <div class="alipay-page-body" v-loading="loading">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <h3>结算账户&nbsp;&nbsp;&nbsp;<span class="tag">{{ruleForm.status|statusFilter}}</span></h3>
        <div class="info-box">
          <el-form-item label="支付宝账号" prop="aliPayAccount" >
            {{ruleForm.aliPayAccount}}
          </el-form-item>
          <el-form-item label="商家名称" prop="merchantName" >
            {{ruleForm.merchantName}}
          </el-form-item>
        </div>

        <h3>联系信息</h3>
        <div class="info-box">
          <el-form-item label="联系人姓名" prop="contactName">
            {{ruleForm.contactName}}
          </el-form-item>
          <el-form-item label="手机号码" prop="telephone">
            {{ruleForm.telephone}}
          </el-form-item>
          <el-form-item label="常用邮箱" prop="email">
            {{ruleForm.email}}
          </el-form-item>
        </div>

        <h3>经营信息</h3>
        <div class="info-box">
          <el-form-item label="店铺招牌" prop="shopPhoto">
            <img :src="utils.imgFormatter(ruleForm.shopPhoto)">
          </el-form-item>
        </div>

        <h3 v-if="ruleForm.status === 'CHECK_WAITING' || ruleForm.status === 'CHECK_FAIL'">认证信息</h3>
        <div class="info-box" v-if="ruleForm.status === 'CHECK_WAITING' || ruleForm.status === 'CHECK_FAIL'">
          <el-form-item label="是否通过认证">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-form-item>
          <el-form-item 
            label="驳回原因" 
            prop="failReason"
            :rules="[
              { validator: validateReason, trigger: 'blur' }
            ]"
          >
            <el-row>
              <el-col :span="8">
                <G-TextareaWhitCount :disabled="checked" :length='100' :placeholder="'驳回原因'" v-model.trim="ruleForm.failReason"></G-TextareaWhitCount>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <div class="bottom-line" v-if="ruleForm.status === 'CHECK_WAITING' || ruleForm.status === 'CHECK_FAIL'">
        <el-button class="normal_blue_btn" @click="submit">确认</el-button>
        <el-button plain class="plain_gray_btn" @click="() => $router.go(-1)">取消</el-button>
      </div>
    </div>
  </G-FullPage>
</template>
<script>
import fetch from '@/utils/fetch';
import utils from '@/utils';
export default {
  data() {
    return {
      loading: false,
      ruleForm: {
        failReason: ''
      }, // 数据来源
      utils: utils,
      checked: false, // 不通过
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = this.checked ? '/api/main-data/updateStatus' : '/api/main-data/addReason'
          let data = this.checked ? {id: this.$route.params.id * 1, statusId: 3} : {id: this.$route.params.id * 1, reason: this.ruleForm.failReason}
         
          fetch({
            method: 'post',
            url: url,
            data
          }).then(res => {
            if (res.success) {
              this.$message.success(res.message);
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          })
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getApiCallback() {
      return fetch({
        method: 'post',
        url: url,
        data
      })
    },
    async getData() {
      this.loading = true
      let data = {
        id: this.$route.params.id * 1
      }
      let res = await fetch({
        method: 'post',
        url: `/api/main-data/getMerchantByIdInfo`,
        data
      })
      this.loading = false
      this.ruleForm = res.getMerchantByIdInfo
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
    },
    validateReason(rule, value, callback) {
      if (this.checked) {
        callback()
      } else {
        if (this.ruleForm.failReason) {
          callback()
        } else {
          callback(new Error('驳回时请写个理由给客户!'))
        }
      }
    }
  },
  filters: {
    // <!-- 支付宝&微信通用: CHECK_PASS(审核通过) CHECK_WAITING(正在审核) CHECK_FAIL(审核未通过) -->
    // <!-- 支付宝额外: WAITING_AUTH(等待授权) -->
    statusFilter(status) {
      let map = {
        CHECK_PASS: '已通过',
        WAITING_AUTH: '等待授权',
        CHECK_WAITING: '审核中', // 可以编辑
        CHECK_FAIL: '已拒绝', // 可以编辑
      }
      return map[status]
    }
  },
  watch: {
    checked(v, o) {
      if (v) {
        Object.assign(this.ruleForm, {failReason: ''})
        this.$refs.ruleForm.validateField(['failReason'])
      }
    }
  }
}
</script>
<style lang='less' scoped>
.alipay-page-body {
  .common-scrollbar();
  padding: 30px;
  overflow-y: auto;
  height: calc(100vh - 105px);
  
}
.info-box {
  border-radius: 2px;
  border: 1px solid rgba(240, 241, 244, 1);
  margin: 8px 0 20px;
  padding: 20px ;
}
h3 {
  font-weight: 700;
}
.tag {
  font-size: 12px;
  font-weight: normal;
}
</style>
