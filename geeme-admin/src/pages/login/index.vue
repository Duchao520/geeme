<template>
  <div class="geeme-admin-login">
    <div class="login-box">
      <p>欢迎登陆</p>
      <form id="loginForm" action="/auth/login" method="Post">
        <NInput 
          name="username"
          @change="changeForm"
          placeholder="请输入手机号码" 
        />

        <NInput 
          @change="changeForm"
          name="password"
          type="password"
          placeholder="请输入密码"
        />

        <BSlider 
          @done="slideDone"
          style="margin:27px 0 0 0" 
        />

        <div class="free-login">
          <a-checkbox
            :checked="free" 
            @change="changeFree" 
          />
          <span>五天内免登陆</span>
        </div>
      </form>
      <button @click="login" class="login-btn">登陆</button>
      <div class="retrieve">找回密码</div>
    </div>
  </div>
</template>

<script>
import NInput from "@/components/normalInput";
import BSlider from "@/components/blockSlider";
import utils from '@/utils'
export default {
  components: {
    NInput,
    BSlider
  },
  mounted() {
    setTimeout(this.handleLoginError, 300)
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      config: {
        username: {
          target: 'phone',
          msg: '请输入合法的手机号'
        },
      },
      free: false,
      slideCheck: false,
    };
  },
  methods: {
    changeForm(data) {
      this.form[data.name] = data.value
    },
    changeFree(e) {
      this.free = e.target.checked
    },
    slideDone() {
      this.slideCheck = true
    },
    handleLoginError() {
      let errInfo = utils.getURLParam('error'), errMsg;
      if (errInfo == undefined) { return }
      switch(utils.getURLParam('error')) {
        case '1':
          errMsg = '用户名不存在'
          break
        case '2':
          errMsg = '密码错误'
          break
        case '3':
          errMsg = '账号被禁用'
          break
        case '4':
          errMsg = '其它类型错误'
          break
      }
      this.$message.error(errMsg)
    },
    login() {
      let result = (utils.errMapping(this.form, this.config))
      if (result !== null) {
        this.$message.error(result[0].msg)
        return
      }
      if (!this.slideCheck) {
        this.$message.error("请拖动滑块完成验证")
        return false
      }
      document.getElementById('loginForm').submit()
    },
  }
};
</script>

<style lang="less" scoped>
.geeme-admin-login {
  height: 100vh;
  position: relative;
  background: url("./assets/login.jpg") center no-repeat;
  background-size: cover;
  .login-box {
    width: 430px;
    height: 460px;
    background-color: #ffffff;
    box-shadow: 0px 2px 14px 0px rgba(204, 211, 242, 0.3);
    padding: 39px 0 0 39px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: calc(50% + 150px);
    border-radius: 6px;
    p {
      color: #333333;
      font-size: 20px;
      margin: 0 0 30px 0;
    }
    &::before {
      content: "";
      display: block;
      width: 635px;
      height: 437px;
      position: absolute;
      right: 501px;
    }
    .free-login {
      color: #999999;
      font-size: 14px;
      margin: 30px 0 15px 0;
    }
    button.login-btn {
      width: 353px;
      height: 44px;
      background-color: rgba(53, 132, 249, 1);
      color: #ffffff;
      border-radius: 4px;
      font-size: 18px;
      line-height: 44px;
      text-align: center;
      cursor: pointer;
    }
    .retrieve {
      width: 353px;
      margin: 11px 0 0 0;
      text-align: right;
      color: #999999;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>