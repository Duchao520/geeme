<template>
  <div id="gm_register">
    <v-header :header="header" register="true"></v-header>
    <div class="full_container" style="margin-top: 20px;">
      <div class="update_area">
        <!-- 注册 首页 -->
        <div class="update_form_area">
          <p class="login_title">免费试用及美运营系统</p>
          <div class="form-item">
            <input type="text" style="display:none">
            <input
              AUTOCOMPLETE="OFF"
              name="register-tel"
              type="text"
              placeholder="请输入手机号码"
              v-model="user.telephone"
              maxlength="11"
              ref="telephone"
            >
            <label data-label="" @click="inputFocus('telephone')"></label>
            <span v-show="user.telephone !== ''" @click="clearInput">
              <img src="@/assets/img/close.png">
            </span>
          </div>
          <div class="form-item">
            <input type="text" style="display:none">
            <input
              autocomplete="off"
              type="text"
              placeholder="请输入验证码"
              v-model="user.verificationCode"
              maxlength="6"
              ref="verificationCode"
            >
            <label data-label="" @click="inputFocus('verificationCode')"></label>
            <!-- 获取验证码按钮 -->
            <span
              v-show="showBtn"
              @click="getCode"
              class="code_position"
              :class="{'active': codeActive}"
            >获取验证码</span>
            <span v-show="!showBtn" class="code_position">{{count}}s</span>
          </div>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              <ul>
                <li>6-20位数字、字母、标点符号组合（不可有空格）</li>
                <li>至少包括数字、字母、标点中的两种</li>
                <li>字母区分大小写</li>
              </ul>
            </div>
            <div class="form-item">
              <input :type="typeFlag == true?'password':'text'" style="display:none">
              <input
                autocomplete="new-password"
                :type="typeFlag == true?'password':'text'"
                placeholder="请设置登录密码"
                v-model.trim="user.password"
                ref="password"
              >
              <label data-label="" @click="inputFocus('password')"></label>
              <!-- <span @click="changeTypeFlag">
                <img
                  :src="typeFlag == true?require('@/assets/img/yanjingclose.png'):require('@/assets/img/yanjing.png')"
                >
              </span> -->
            </div>
          </el-tooltip>
          <p class="deal_area">
            <el-checkbox v-model="checkDeal" id="checkDeal">我已阅读并同意</el-checkbox>
            <router-link target="_blank" to="/user-agreement"><span>《及美用户服务协议》</span></router-link>
          </p>
          <div class="login_btn">
            <el-button type="warning" v-if="checkDeal" @click="toRegister">同意协议并注册</el-button>
            <el-button type="info" v-if="!checkDeal" disabled>同意协议并注册</el-button>
          </div>
          <div class="check_route">
            <p>
              已有账号？
              <span @click="toLogin">去登录></span>
            </p>
          </div>
        </div>
        <v-footer></v-footer>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/loginCommon/LoginHeader";
import Footer from "@/components/loginCommon/LoginFooter";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import sha256 from 'js-sha256'
export default {
  name: "GmRegister",
  components: {
    "v-footer": Footer,
    "v-header": Header,
  },
  data() {
    return {
      header: {
        title: "用户注册",
        isphone: false
      },
      user: {
        telephone: "",
        password: "",
        verificationCode: "",
        encryptString: ""
      },
      message: "",
      count: "",
      showBtn: true,
      timer: "",
      typeFlag: true,
      checkDeal: false,
      codeActive: false // 是否可点击获取验证码
    };
  },
  watch: {
    "user.telephone"(val) {
      if (utils.checkPhone(val)) {
        this.codeActive = true;
      } else {
        this.codeActive = false;
      }
    }
  },
  mounted() {},
  methods: {
    // 手动让input获取焦点
    inputFocus(type) {
      this.$refs[type].focus();
    },
    // 返回登录页面
    toLogin() {
      this.$router.push("/");
    },
    // 检测注册接口处理
    registerRes(res) {
      if (res.success) {
        // 提示
        utils.showTip(this, { msg: "注册成功", type: "success" });
        this.$router.push({
          path: "/",
          query: {
            telephone: this.user.telephone
          }
        });
      } else {
        // 提示
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    // 开始注册
    toRegister() {
      // 校验手机号码/验证码/登陆密码
      if (this.checkUserInfo(["telephone", "verificationCode", "password"])) {
        // 前端检查通过后才会调用注册接口
        let params = JSON.parse(JSON.stringify(this.user))
        params.password = sha256(`&${this.user.password}_gm`)
        // 开始向后台发送请求验证
        axios.post(api.onRegister.URL, params, { withoutToken: true }).then(res => {
          this.registerRes(res)
        })
      } else {
        // 提示
        utils.showTip(this, { msg: this.message, type: "error" });
      }
    },
    // 校验用户信息输入框
    checkUserInfo(types) {
      let _type = "";
      for (let i = 0, len = types.length; i < len; i++) {
        _type = this.user[types[i]];
        if (types[i] === "telephone" && !utils.checkPhone(_type)) {
          this.message = "手机号码有误，请重填";
          return false;
        } else if (types[i] === "verificationCode" && !utils.checkCode(_type)) {
          this.message = "验证码输入有误，请重填";
          return false;
        } else if (types[i] === "password" && !utils.checkPassword(_type)) {
          this.message = "密码格式为6~16长度至少一个数字和字母组合,区分大小写字母";
          return false;
        }
      }
      return true;
    },
    // 开始倒计时
    changeCodeTimer() {
      const timeCount = 60;
      if (!this.timer) {
        this.count = timeCount;
        this.showBtn = false;
        //设置倒计时
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= timeCount) {
            this.count--;
          } else {
            this.showBtn = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 获取验证码处理函数
    codeRes(data) {
      this.user.encryptString = data.encryptString;
      // 消息类型判断，是否要继续提示用户注册
      if (data.success) {
        // 提示
        utils.showTip(this, { msg: "发送验证码成功", type: "success" });
        this.changeCodeTimer();
        return;
      } else {
        // 提示
        utils.showTip(this, { msg: data.message, type: "error" });
      }
    },
    // 获取验证码
    getCode() {
      // 此时先做校验手机号码，手机号码正确才将号码发送给后台
      if (!this.checkUserInfo(["telephone"])) {
        this.codeActive = false;
        // 提示
        utils.showTip(this, { msg: this.message, type: "error" });
        return false;
      } else {
        this.codeActive = true;
        // 开始向后台发送请求验证
        axios.post(
          api.getPhoneCode.URL,
          { telephone: this.user.telephone }, { withoutToken: true }
        ).then(res => {
          this.codeRes(res)
        })
      }
    },
    clearInput() {
      this.user.telephone = "";
    },
    changeTypeFlag() {
      this.typeFlag = !this.typeFlag;
    }
  }
};
</script>

<style lang="scss">
#gm_register .login_btn {
  .el-button {
    width: 400px;
    padding: 17px 0;
    font-size: 18px;
  }
}
</style>

<style lang="scss" scoped>
#gm_register {
  .check_route {
    p {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.full_container {
  width: 1400px;
  margin: auto;
  background: #fff;
  height: calc(100vh - 120px);
  .update_area {
    padding: 60px 0;
    display: flex;
    justify-content: center;
  }
}
.update_form_area {
  width: 400px;
  // height:424px;
  padding: 70px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 14px 0px rgba(204, 211, 242, 0.3);
  box-sizing: content-box;
  .login_title {
    font-size: 26px;
    color: #333;
    margin-bottom: 40px;
    padding-left: 15px;
    text-align: center;
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #ccc;
    font-size: 16px;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #ccc;
    font-size: 16px;
  }

  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #ccc;
    font-size: 16px;
  }
  .check_route {
    display: flex;
    flex-direction: row;
    margin-top: 0.3rem;
    font-size: 0.14rem;
    color: #9b9b9b;
    p {
      flex: 1;
    }
    span {
      cursor: pointer;
      color: #e22c37;
    }
  }
}
.code_position {
  display: inline-block;
  width: 110px;
  height: 42px;
  text-align: center;
  line-height: 42px;
  background: #eee;
  font-size: 16px;
  font-weight: 400;
  color: #666;
  position: absolute;
  right: 10px;
  top: 15px;
  cursor: pointer;
  &.active {
    background: #e22c37;
    color: #fff;
  }
}
.deal_area {
  margin-top: 25px;
  color: #9b9b9b;
  font-size: 14px;
  span {
    color: #e22c37;
    cursor: pointer;
    transition:all 0.6s;
  }
}
.login_btn {
  margin-top: 30px;
}
</style>



