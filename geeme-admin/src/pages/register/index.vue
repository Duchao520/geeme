<template>
  <div class="geeme-admin-register">
    <!-- <NInput placeholder="请输入手机号码" name="account" @change="change"/> -->
    <div class="register-header"></div>

    <div class="register-box-wrapper">
      <div class="register-box">
        <p>欢迎注册</p>

        <NInput placeholder="请输入手机号码" name="phone" @change="changeForm"/>

        <NInput placeholder="请输入验证码" name="verifyCode" @change="changeForm"/>

        <NInput placeholder="请设置登陆密码" type="password" name="password" @change="changeForm"/>

        <button class="verify-btn" :class="{active: !counting}" ref="verify" @click="getVerificationCode" :disabled="counting">获取验证码</button>

        <div class="agreement">
          <a-checkbox @change="changeAgree" :checked="agree"></a-checkbox>
          <span>我已阅读并同意《及美商户服务协议》</span>
        </div>

        <button class="register-btn" @click="register">同意协议并注册</button>

        <div class="link">
          已有账号？
          <router-link to="login">去登陆></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NInput from "@/components/normalInput"
import { getVerificationCode, phoneExists, userRegistered } from "@/api/user"
/* 缺省校验逻辑 */
export default {
  components: {
    NInput
  },
  data() {
    return {
      form: {
        phone: "",
        password: "",
        verifyCode: ""
      },
      agree: false,
      counting:false,
    };
  },
  mounted() {
    
  },
  methods: {
    changeForm(data) {
      this.form[data.name] = data.value
    },
    changeAgree(e) {
      this.agree = e.target.checked
    },
    async getVerificationCode() {
      /* if (!regExp.phone.test(this.form.phone)) {
        this.$message.error('请输入正确的手机号码')
        return
      } */
     
      const data = await getVerificationCode(this.form.phone)
      if (data.code === 1200) {
        this.count()
        this.$message.success('获取验证码成功')
      } else {
        this.$message.error('获取验证码失败')
      }
    },
    count() {
      let btn = this.$refs.verify
      let countNum = 60
      this.counting = true
      btn.innerHTML = `59s`
      let timer = setInterval(() => {
        btn.innerHTML = `${--countNum}s`
        if (countNum < 1) {
          btn.innerHTML = '获取验证码'
          countNum = 60
          clearInterval(timer)
          this.counting = false
        }
      }, 1000)
    },
    async register() {
      this.agree = true
      let data = await phoneExists(this.form.phone)
      if (data.code !== 1200) {
        this.$message.error(data.message)
        return
      }
      data = await userRegistered(this.form)
      if (data.code == 1200) {
        this.$message.success('注册成功')
        return
      }
      this.$message.error(data.message)
    }
  }
};
</script>

<style lang="less" scoped>
.geeme-admin-register {
  width: 100%;
  .register-header {
    height: 80px;
    background-color: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(204, 211, 242, 0.3);
  }
  .register-box-wrapper {
    margin: 20px;
    padding: 115px 0 0 0;
    height: calc(100vh - 80px - 40px);
    background: #ffffff;
    border-radius: 6px;
    .register-box {
      position: relative;
      width: 430px;
      height: 460px;
      box-shadow: 0px 2px 14px 0px rgba(204, 211, 242, 0.3);
      border-radius: 6px;
      margin: 0 auto;
      padding: 39px 0 0 39px;
      box-sizing: border-box;
      p {
        font-size: 20px;
        color: #333333;
      }
      .verify-btn {
        position: absolute;
        left: 272px;
        top: 167px;
        width: 111px;
        height: 41px;
        background-color: rgba(238, 238, 238, 1);
        color: #333333;
        font-size: 16px;
        line-height: 41px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        &.active {
          color: #ffffff;
          background: rgba(126, 147, 255, 1);
        }
      }
      .agreement {
        margin: 35px 0 15px 0;
        span {
          font-size: 14px;
          color: #999999;
        }
      }
      .register-btn {
        width: 353px;
        height: 44px;
        background-color: rgba(126, 147, 255, 1);
        border-radius: 4px;
        text-align: center;
        line-height: 44px;
        color: #ffffff;
        font-size: 18px;
        cursor: pointer;
      }
      .link {
        width: 353px;
        text-align: right;
        color: #999999;
        font-size: 14px;
        margin: 10px 0 0 0;
        a {
          color: #7e93ff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>