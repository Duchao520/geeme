<template>
  <div class="VerifyMobile">
    <div class="title">
      <h5>{{mobileStatus==='current'?currentMobile.title:newMobile.title}}</h5>
      <p v-if="mobileStatus==='current'">请验证身份：用原手机号码获取验证码</p>
    </div>
    <el-form ref="form" class="form" :model="form" label-width="0" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input
            :disabled="mobileStatus=='current'"
          style="width:350px;"
          v-model="form.mobile"
          :placeholder="mobileStatus==='current'?currentMobile.mobilePlaceholder:newMobile.mobilePlaceholder"
          @input="mobileInput"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" class="code" style="width:350px;">
        <el-input
          style="width:350px;"
          v-model="form.code"
          placeholder="请输入验证码"
          type="number"
          @input="codeInput"
        ></el-input>
        <el-button
          :loading="getCodeButtonLoading"
          :disabled="buttonDisabled"
          class="get-code"
          @click="getCode"
        >{{!buttonDisabled?'获取验证码':`${minutes}s`}}</el-button>
      </el-form-item>
      <el-button type="primary" class="confirm" :disabled="confirmButtonDisabled" @click.stop="confirmButton">确认</el-button>
    </el-form>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';

export default {
  data() {
    let mobileValidator = (rule, value, callback) => {
      if (value.length > 0 && value.length < 11) {
        callback();
      } else if (value.length === 11) {
        if (
          /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
            value
          )
        ) {
          callback();
        } else {
          callback("请输入正确格式的手机号码");
        }
      }
    };
    let mobileBlurValidator = (rule, value, callback) => {
      if (
        /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          value
        )
      ) {
        callback();
      } else {
        if (!value) {
          callback("请输入手机号");
        } else {
          callback("手机号格式不正确");
        }
      }
    };
    let codeValidator = (rule, value, callback) => {
      if (!value || value.length === 6) {
        callback();
      } else {
        callback("验证码格式不正确");
      }
    };
    return {
      form: {
        mobile: "",
        code: ""
      },
      formRules: {
        mobile: [
          { required: true, trigger: "blur", validator: mobileBlurValidator },
          { required: true, trigger: "change", validator: mobileValidator }
        ],
        code: [
          { required: true, trigger: "blur", validator: codeValidator },
          { required: true, trigger: "change", message: "请输入验证码" }
        ]
      },
      mobileStatus: "current",
      currentMobile: {
        title: "验证原手机号",
        mobilePlaceholder: "请输入原手机号码"
      },
      newMobile: {
        title: "修改绑定手机号",
        mobilePlaceholder: "请输入新的手机号码"
      },
      encryptString: "",
      buttonDisabled: false,
      minutes: 60,
      getCodeButtonLoading: false,
      confirmButtonDisabled:false
    };
  },
  mounted() {
    let phone = this.$store.state.manage.userInfo.telephone;
    this.form.mobile = phone;
  },
  methods: {
    getCode() {
      let mobile = this.form.mobile;
      if (
        mobile.length === 11 &&
        /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          mobile
        )
      ) {
        if (this.mobileStatus === "current") {
          //处于验证原手机号的阶段
          axios.post(
            api.getOldMobileVerifyCode.URL,
            { mobile: mobile }
          ).then(res => {
            this.getCodeRes(res)
          })
        } else {
          //验证新手机号的阶段
          axios.post(
            api.getUpdateMobileVerifyCode.URL,
            { mobile: mobile }
          ).then(res => {
            this.getCodeRes(res)
          })
        }
      } else {
        this.$refs.form.validateField(["mobile"]);
      }
    },
    getCodeRes(res) {
      if (res.success) {
        this.buttonDisabled = true;
        this.minutes = 60;
        var timer = setInterval(() => {
          this.minutes = this.minutes - 1;
          if (this.minutes === 0) {
            clearInterval(timer);
            this.minutes = 60;
            this.buttonDisabled = false;
          }
        }, 1000);
        this.encryptString = res.encryptString;
        this.confirmButtonDisabled = false
      }else{
        this.$message({type:'warning',message:res.message})
        this.confirmButtonDisabled = true
      }
    },
    mobileInput(num) {
      this.form.mobile = num.slice(0, 11);
    },
    codeInput(num) {
      this.form.code = num.slice(0, 6);
    },
    confirmButton() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.getCodeButtonLoading = true;
          if (this.mobileStatus === "current") {
            axios.post(api.getVerifyCodeResult.URL,{
              code: this.form.code,
              encryptString: this.encryptString,
              mobile: this.form.mobile
            }).then(res => {
              this.getVerifyCodeResultRes(res)
            }).catch(err => {
              this.getCodeButtonLoading = false;
              this.buttonDisabled = false;
              // this.changeStatus();
            })
          } else {
            axios.post(api.updateMobile.URL,{
              code: this.form.code,
              encryptString: this.encryptString,
              mobile: this.form.mobile
            }).then(res => {
              this.updateMobileRes(res)
            });
          }
        }
      });
    },
    getVerifyCodeResultRes(res) {
      if (res.success) {
        this.getCodeButtonLoading = false;
        this.buttonDisabled = false;
        this.changeStatus();
      } else {
        this.$message({type:'error',message:res.message})
        this.getCodeButtonLoading = false;
      }
    },
    updateMobileRes(res) {
      if (res.success) {
        this.$message({
          type: "success",
          message: "手机号修改成功"
        });
        this.mobileStatus = "current";
        this.$router.push("/");
      }else{
        this.$message({
          type: "warning",
          message: res.message
        });
      }
      this.getCodeButtonLoading = false;
      this.buttonDisabled = false;
    },
    changeStatus() {
      this.form.code = "";
      this.form.mobile = "";
      this.encryptString = "";
      this.mobileStatus = "new";
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.VerifyMobile {
  box-sizing: border-box;
  padding-top: 45px;
  .title {
    h5 {
      color: #333333;
      font-size: 20px;
      line-height: 48px;
    }
    p {
      line-height: 37px;
      color: #999999;
      font-size: 12px;
    }
  }
  .form {
    /deep/ .el-input__inner {
      border: none;
      outline: none;
      border-bottom: 1px solid #dcdfe6;
      border-radius: 0;
    }
    .code {
      /deep/ .el-form-item__content {
        position: relative;
        .get-code {
          position: absolute;
          right: 6px;
          bottom: 12px;
          height: 40px;
          box-sizing: border-box;
          padding: 0 15px;
          background: #eeeeee;
          color: #333333;
          cursor: pointer;
          transition: all 0.6s;
          border: none;
        }
      }
    }
    .confirm {
      width: 350px;
      background: #58c9f3;
      font-size: 16px;
      border: none;
      transition: all 0.6s;
      &:hover {
        background: #58c0ff;
      }
    }
  }
}
</style>
