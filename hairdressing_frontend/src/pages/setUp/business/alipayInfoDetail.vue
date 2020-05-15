<template>
  <full-single-page :title="'开通支付宝支付'">
    <div class="alipay-page-body" v-loading="loading">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <h3>结算账户</h3>
        <div class="info-box">
          <el-form-item
            label="支付宝账号"
            prop="aliPayAccount"
          >
            <el-row>
              <el-col :span="4">
                <el-input v-model="ruleForm.aliPayAccount" placeholder="请输入商家支付宝账号" maxlength="64"></el-input>
              </el-col>
            </el-row>
            <p class="info-text">如无商家支付宝账号，请至支付宝注册 <span class="out-link" @click="outLink">注册地址</span></p>
          </el-form-item>
          <el-form-item
            label="商家名称"
            prop="merchantName"
          >
            <el-row>
              <el-col :span="4">
                <el-input v-model="ruleForm.merchantName" placeholder="请输入商家名称" maxlength="36"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <h3>联系信息</h3>
        <div class="info-box">
          <el-form-item
            label="联系人姓名"
            prop="contactName"
          >
            <el-row>
              <el-col :span="4">
                <el-input v-model="ruleForm.contactName" placeholder="请输入商家支付宝账号" maxlength="64"></el-input>
              </el-col>
            </el-row>
            <p class="info-text">请填写商户支付宝支付业务联系人的真实姓名，支付宝官方会在支付宝签约时进行实名认证</p>
          </el-form-item>
          <el-form-item
            label="手机号码"
            prop="telephone"
          >
            <el-row>
              <el-col :span="4">
                <el-input v-model="ruleForm.telephone" placeholder="请输入商家名称" maxlength="36"></el-input>
              </el-col>
            </el-row>
            <p class="info-text">用于接收签约后的重要通知，如确认协议、到期提醒等。</p>
          </el-form-item>
          <el-form-item
            label="常用邮箱"
            prop="email"
          >
            <el-row>
              <el-col :span="4">
                <el-input v-model="ruleForm.email" placeholder="请输入常用邮箱" maxlength="64"></el-input>
              </el-col>
            </el-row>
            <p class="info-text">用于接收签约后的重要通知，如确认协议、到期提醒等。</p>
          </el-form-item>
        </div>

        <h3>经营信息</h3>
        <div class="info-box">
          <el-form-item
            label="店铺招牌"
            prop="shopPhoto"
          >
            <el-upload
              :class="{'has-img': ruleForm.shopPhoto}"
              :action="action"
              list-type="picture-card"
              :limit="1"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :on-preview="handlePictureCardPreview"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                <div>上传1张店铺招牌照片，需清晰展示完整的招牌</div>
                <div>支持jpg，png格式，大小不超过2M；点击图片可重新上传。</div>
              </div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <div class="bottom-line">
        <el-button class="normal_blue_btn" @click="submit">确认提交</el-button>
        <el-button plain class="plain_gray_btn" @click="close">取消</el-button>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </full-single-page>
</template>
<script>
import * as utils from "@/assets/js/utils"
import * as axios from "@/util/axios";
import {mapState} from "vuex";
export default {
  data() {
    return {
      ruleForm: {
        aliPayAccount: '',
        merchantName: '',
        contactName: '',
        shopPhoto: '',
        telephone: '',
        email: '',
        id: null
      },
      rules: {
        aliPayAccount: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
        merchantName: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        shopPhoto: [{ required: true, message: '上传招牌图片', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入联系手机号', trigger: 'blur' }],
        email: [{ required: true, message: '请输入常用邮箱', trigger: 'blur' }],
      }, 
      
      action: `${process.env.SERVICE_URL}/service-api/uploadPicture/`,
      headers: utils.getUploadHeader(),
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // submitOpenAccount
            this.loading = true
            axios.post('/submitOpenAccount', {
              paymentAccountSubmissionInfo: {
                ...this.ruleForm,
                payMethodId: 2,
                brandId: this.currentInfo.brandId
              }
            }).then(res => {
              this.close()
            }).catch(err => {
              this.loading = false
            })
          } else {
            this.$message.error(`请完善必填信息!`);
          }
        });
    },
    outLink() {
      window.open('https://memberprod.alipay.com/account/reg/index.htm')
    },
    close() {
      this.$router.go(-1)
    },
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 <= 2;
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过${size}M!`);
      }
      return isLt2M;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.ruleForm.shopPhoto = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      // console.log(res, file)
      this.ruleForm.shopPhoto = res.fileKey
    }
  },
  computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo
      }),
    },
}
</script>
<style lang='scss' scoped>
.alipay-page-body {
  padding: 30px 40px 20px;
}
.info-box {
  border-radius: 2px;
  border: 1px solid rgba(240, 241, 244, 1);
  margin: 8px 0 20px;
  padding: 20px ;
}
.info-text {
  color: #999;
  font-size: 12px;
}
.el-upload__tip {
  /deep/ div {
    height: 24px;
    line-height: 24px;
  }
}
.has-img {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
.out-link {
  cursor: pointer;
  color: #58C9F3;
}
</style>
