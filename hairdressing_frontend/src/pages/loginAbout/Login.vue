<template>
  <div id="gm_login_page" :class="[{screenWidth:!calBgImage},{screenHeight:calBgImage}]">
    <el-row class="login-wrap" type="flex" justify="center">
      <img :src="img">
    </el-row>
    <el-row type="flex" justify="center" class="login-head">
      <v-header :header="header"></v-header>
    </el-row>
    <div class="login_area">
      <div :class="[{item:1},{active:boxShow}] ">
        <div class="login_div login-box">
          <p class="login_title">欢迎登录</p>
          <!-- 登录表单 -->
          <el-form>
            <el-form-item>
              <el-input
                class="login-input"
                v-model.trim="user.telephone"
                placeholder="请输入手机号码"
                clearable
                maxlength="11"
              ></el-input>
              <el-input
                class="login-input"
                type="password"
                v-model.trim="user.password"
                placeholder="请输入登录密码"
                clearable
                @keyup.enter.native="loginIn"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <!-- 滑块验证 -->
              <div class="validation" disabled>
                <div class="form-inline-input">
                  <div class="code-box" id="code-box">
                    <p></p>
                    <span :class="{actives:win}"></span>
                    <i style="color:#B3B3B3;font-style:normal">请按住滑块，拖动到最右边</i>
                  </div>
                </div>
              </div>
            </el-form-item>

            <!-- 免费登录 -->
            <!-- <el-form-item>
              <div class="nopay" @click="selected = !selected">
                <div class="nopay-icon" v-if="selected"></div>
                <div class="nopay-noicon" v-else></div>
                <div class="nopay-text">五天内免登录</div>
              </div>
            </el-form-item> -->
            <el-form-item>
              <el-button @click="loginIn" type="warning">登录</el-button>
            </el-form-item>
          </el-form>
          <!-- 免费注册 -->
          <div class="check_route">
            <p>
              <span @click="showTryuseForm=true" style="font-size: 14px;">免费试用</span>
            </p>
            <span @click="toRetrievePass" style="font-size: 14px;color:#999999;">找回密码</span>
          </div>
        </div>
        <v-footer></v-footer>
      </div>
    </div>
    <TryuseForm v-if="showTryuseForm" :show.sync="showTryuseForm" :type="1"></TryuseForm>
  </div>
</template>

<script>
import Header from "@/components/loginCommon/LoginHeader";
import Footer from "@/components/loginCommon/LoginFooter";
import TryuseForm from "@/components/loginCommon/TryuseForm";
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import * as format from '@/util/routerFormat'
import { setInterval } from "timers";
import * as axios from "@/util/axios";
import sha256 from 'js-sha256'
export default {
  name: "GmLoginPage",
  components: {
    "v-header": Header,
    "v-footer": Footer,
    TryuseForm,
  },
  data() {
    return {
      header: {
        title: "商家登录",
        isphone: true
      },
      user: {
        telephone: "",
        password: ""
      },
      // 验证码
      code: "",
      count: "",
      showBtn: true,
      timer: null,
      // 免费登录bolearn
      selected: true,
      calBgImage: 0,
      boxShow: false,
      verification: false,
      active: false,
      win: false,
      img: require("@/assets/images/login_new.jpg"),
      showTryuseForm:false,
    };
  },
  mounted() {
    //图片自适应
    this.user.telephone = this.$router.history.current.query.telephone;
    this.getCookie("geeme_pc_token");
    this.calBgImage =
      document.body.clientWidth / document.body.clientHeight > 1.778; // 1.92 原来是
    window.addEventListener("resize", () => {
      let pro = document.body.clientWidth / document.body.clientHeight;
      let box =
        document.documentElement.clientWidth /
        document.documentElement.clientHeight;
      this.calBgImage = pro > 1.778; // 1.92 原来是
      this.boxShow = box < 1;
      // let cw = document.documentElement.clientWidth;
      // if (cw >= 1200) {
      //   let tag = document.getElementsByClassName("login-box")[0];
      //   if (!!tag) tag.style.right = (cw - 1200) / 2 + "px";
      // }
    });

    this.moveCode("", this);
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "saveUserInfo", "setCurrentShopInfo", "setCurrentEntry", "setCurrentAuth", "setCurrentEntryNav", "setFlatAuths", "setBtnAuths"]),

    // 滑块验证
    getOffset(box, direction) {
      var setDirection = direction == "top" ? "offsetTop" : "offsetLeft";
      var offset = box[setDirection];
      var parentBox = box.offsetParent;
      while (parentBox) {
        offset += parentBox[setDirection];
        parentBox = parentBox.offsetParent;
      }
      parentBox = null;
      return parseInt(offset);
    },
    moveCode(code, _this) {
      if (_this.active) {
        return;
        console.log(1);
      }
      var box = document.querySelector("#code-box"),
        progress = box.querySelector("p"),
        codeInput = box.querySelector(".code-input"),
        evenBox = box.querySelector("span");
      //默认事件
      var boxEven = ["mousedown", "mousemove", "mouseup"];
      //改变手机端与pc事件类型
      if (typeof document.ontouchstart == "object") {
        boxEven = ["touchstart", "touchmove", "touchend"];
      }
      var goX, offsetLeft, deviation, evenWidth, endX;
      function moveFn(e) {
        e.preventDefault();
        e = boxEven["0"] == "touchstart" ? e.touches[0] : e || window.event;
        endX = e.clientX - goX;
        endX = endX > 0 ? (endX > evenWidth ? evenWidth : endX) : 0;
        if (endX > evenWidth * 0.7) {
          progress.innerText = "松开验证";
          progress.style.backgroundColor = "#00CF82";
        } else {
          progress.innerText = "";
        }
        progress.style.width = endX + deviation + "px";
        evenBox.style.left = endX + "px";
      }
      let removeFn = () => {
        document.removeEventListener(boxEven["2"], removeFn, false);
        document.removeEventListener(boxEven["1"], moveFn, false);
        if (endX > evenWidth * 0.7) {
          progress.innerText = "验证通过";
          progress.style.width = evenWidth + deviation + "px";
          evenBox.style.left = evenWidth + "px";
          evenBox.onmousedown = null;
          // this.active = true;
          this.win = true;
        } else {
          this.win = false;
          progress.style.width = "0px";
          evenBox.style.left = "0px";
        }
      };
      function getOffset(box, direction) {
        var setDirection = direction == "top" ? "offsetTop" : "offsetLeft";
        var offset = box[setDirection];
        var parentBox = box.offsetParent;
        while (parentBox) {
          offset += parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      }
      evenBox.addEventListener(
        boxEven["0"],
        function(e) {
          e = boxEven["0"] == "touchstart" ? e.touches[0] : e || window.event;
          (goX = e.clientX),
            (offsetLeft = getOffset(box, "left")),
            (deviation = this.clientWidth),
            (evenWidth = box.clientWidth - deviation),
            endX;
          document.addEventListener(boxEven["1"], moveFn, false);
          document.addEventListener(boxEven["2"], removeFn, false);
        },
        false
      );
    },
    // 跳转到注册页面
    toRegister() {
      this.$router.push("/register");
    },
    // 跳转到忘记密码页面
    toRetrievePass() {
      this.$router.push("/retrieve-pass");
    },
    // 校验用户信息输入框
    checkUserInfo(types, active) {
      let _type = "";
      for (let i = 0, len = types.length; i < len; i++) {
        _type = this.user[types[i]];
        if (types[i] === "telephone" && !utils.checkPhone(_type)) {
          this.message = "手机号码有误，请重填";
          return false;
        } else if (types[i] === "password" && !utils.checkPassword(_type)) {
          this.message = "密码格式为6~16长度至少一个数字和字母组合,区分大小写字母";
          return false;
        } else if (!active) {
          this.message = "请拖动滑块完成验证";
          return false;
        }
      }
      return true;
    },
    loginIn() {
      // 校验手机号码/登录密码
      if (this.checkUserInfo(["telephone", "password"], this.win)) {
        // 前端检查通过后才会调用注册接口
        // 开始向后台发送请求验证
        let params = {
          password: sha256(`&${this.user.password}_gm`),
          telephone: this.user.telephone
        };
        // 登录接口不要传token
        axios
          .post(api.onLogin.URL, params, { withoutToken: true })
          .then(res => {
            axios.get('/myDest').then(res => {
              if (res.dest === 'center') {
                this.$router.push("/center/brands")
              } else if (res.dest === 'store') {
                this.saveCurrentInfo({
                  shopId: res.storeId,
                  brandId: res.brandId,
                  shopName: res.shopName,
                });
                this.setCurrentShopInfo({
                  shopId: res.storeId,
                  shopName: res.shopName,
                  city: res.city
                })
                axios.get('/queryStorePrivileges/' + res.storeId).then(res => {
                  let shopAllRouters = res.privilegeList // 测试数据时注释, 正式上线用
                  let asideRouters = [] // 一级导航数据
                  let tabsNav = {} // 二级导航
                  let canVistit = [] // 管理页面的权限数据
                  this.setCurrentEntry('shop') // 管理门店-门店的权限
                  this.setCurrentAuth(shopAllRouters) // 赋予当前门店的权限路由
                  asideRouters = format.entryNavBar(shopAllRouters)
                  this.setCurrentEntryNav({ROUTER_Nav_Bars: asideRouters}) // 一级导航存储
                  tabsNav = format.create2edNavBar(asideRouters) // 二级导航
                  this.setCurrentEntryNav({ROUTER_TABS: tabsNav}) // 二级导航存储
                  this.setCurrentEntryNav({ROUTER_3rd_Nav: format.create3rdNavBar(tabsNav)}) // 3级导航存储(设置中心)
                  this.setCurrentEntryNav({ROUTER_SUB_TABS: format.createRouteSubTabs(shopAllRouters)}) // 员工和会员档案导航
                  format.routersArrFlat(shopAllRouters, canVistit, 'routes', 'path')
                  this.setFlatAuths(canVistit)
                  this.setBtnAuths(res.frontFlags)
                  // 如果操作台没有权限...
                  let toPath = format.getLastLevelPathInFirstChild(asideRouters)
                  this.$router.push(toPath)
                })
              } else if (res.dest === 'brand') {
                this.saveCurrentInfo({
                  brandId: res.brandId,
                  brandName: res.brandName,
                  brandLogo: res.brandLogo,
                  belongTo: res.industryName
                })
                axios.get('/queryBrandPrivileges/' + res.brandId).then(res => {
                  // 我的品牌的一系列事件
                  let brandAllRouters = res.privilegeList  // 测试数据时注释, 正式上线用
                  // 如果有管理权限， 请求接口获取次级页面的路由树
                  let asideRouters = [] // 一级导航数据
                  let tabsNav = {} // 二级导航
                  let canVistit = [] // 管理页面的权限数据
                  this.setCurrentEntry('brand')
                  this.setCurrentAuth(brandAllRouters) // 赋予当前品牌的权限比对路由
                  asideRouters = format.entryNavBar(brandAllRouters)
                  this.setCurrentEntryNav({ROUTER_Nav_Bars: asideRouters}) // 一级导航存储
                  tabsNav = format.create2edNavBar(asideRouters) // 二级导航
                  this.setCurrentEntryNav({ROUTER_TABS: tabsNav}) // 二级导航存储
                  this.setCurrentEntryNav({ROUTER_3rd_Nav: format.create3rdNavBar(tabsNav)}) // 3级导航存储(设置中心)
                  this.setCurrentEntryNav({ROUTER_SUB_TABS: format.createRouteSubTabs(brandAllRouters)}) // 员工和会员档案导航
                  format.routersArrFlat(brandAllRouters, canVistit, 'routes', 'path')
                  this.setFlatAuths(canVistit)
                  this.setBtnAuths(res.frontFlags)
                  let toPath = format.getLastLevelPathInFirstChild(asideRouters)
                  this.$router.push(toPath)
                })
              }
            })
          }).then(() => {
            axios.get(api.getUserInfo.URL).then(res => {
              this.saveUserInfo(res);
            });
          })
      } else {
        // 提示
        utils.showTip(this, { msg: this.message, type: "error" });
      }
    },
    // 设置cookie，存cookie, 有过期时间
    setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      window.document.cookie =
        cname + "=" + cvalue + ";path=/;expires=" + d.toGMTString();
    },
    // 获取cookie
    getCookie(cname) {
      let v = window.document.cookie.match("(^|;) ?" + cname + "=([^;]*)(;|$)");
      // 需要将v存入store中
      return v;
      // if(v&&v[2]){
      //   this.user = v[2]
      // }
    },
    // 删除cookie
    clearCookie(cname) {
      this.setCookie(cname, "", -1);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.login-head {
  position: fixed;
  left: 0;
  z-index: 999;
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
.login-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  overflow: hidden;
  background-color: #fff;
  background-image: url("../../assets/images/2.jpg");
  background-size: 50%;
  background-position: right;
  background-repeat: no-repeat;
  img {
    height: 100%;
  }
}
#gm_login_page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  height: 100%;
  .login_area {
    background-position: center;
    background-size: 100%;
    /* display: flex;
    justify-content: flex-end; */
    .item {
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .login_div {
        width: 430px;
        height: 460px;
        padding: 39px 39px 20px;
        border-radius: 6px;
        box-shadow: 0 2px 14px 0 rgba(204, 211, 242, 0.3);
        // border: 5px solid black;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        z-index: 999;
        // transform:translateX(50%);
        .login_title {
          font-size: 20px;
        }
        .login-input {
          height: 60px;
        }
      }
    }
    .item.active {
      width: 100%;
    }
  }
}
.nopay {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.nopay-icon {
  width: 18px;
  height: 18px;
  background: url("../../assets/img/icon_checkbox_red.png") no-repeat center
    center/100% auto;
  margin-right: 5px;
}
.nopay-text {
  color: #999999;
  font-size: 14px;
}
.validation {
  width: 100%;
  height: 44px;
  margin: 27px 0 20px;
}
.nopay-noicon {
  width: 18px;
  height: 18px;
  background: url("../../assets/img/icon_checkbox_no.png") no-repeat center
    center/100% auto;
  margin-right: 5px;
}
.screenWidth {
  background: url("../../assets/img/login_new.jpg") center no-repeat;
  background-size: 100% auto;
}
.screenHeight {
  // background: url("") no-repeat center;
}

.form-inline-input {
}
.form-inline-input input,
.code-box {
  padding: 0 3px;
  width: 30px;
  height: 40px;
  color: #b3b3b3;
  text-align: center;
  background: #efefef;
  border: 0;
  border-radius: 5px;
  outline: none;
}
.code-box {
  position: relative;
}
.code-box p,
.code-box span {
  display: block;
  position: absolute;
  left: 0;
  height: 44px;
  text-align: center;
  line-height: 44px;
  border-radius: 5px;
  padding: 0;
  margin: 0;
}
.code-box span {
  width: 40px;
  background-color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-right: 1px;
}
.code-box p {
  width: 0;
  background: rgb(0, 207, 130);
  overflow: hidden;
  text-indent: -20px;
  // transition: background 1s ease-in;
}
.code-box .code-input {
  display: none;
}
.code-box .code-input {
  display: none;
}

.form-inline-input {
}
.form-inline-input input,
.code-box {
  padding: 0 3px;
  width: 353px;
  height: 44px;
  color: #fff;
  background: #efefef;
  border: 0;
  border-radius: 5px;
  outline: none;
}
.code-box {
  position: relative;
}
.code-box p,
.code-box span {
  display: block;
  position: absolute;
  left: 0;
  height: 44px;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  padding: 0;
  margin: 0;
}
.code-box span {
  width: 44px;
  display: block;
  height: 44px;
  background: url("../../assets/img/login_validate_start.png") no-repeat center
    center/100% auto;
  font-size: 16px;
  cursor: pointer;
  margin-right: 1px;
}

.code-box p {
  width: 0;
  overflow: hidden;
  text-indent: -20px;
  background: rgb(0, 207, 130);
}
.code-box .code-input {
  display: none;
}
.code-box .code-input {
  display: none;
}
.actives {
  background: url("../../assets/img/login_validate_end.png") no-repeat center
    center/100% auto !important;
  background-size: 44px !important;
}
.move {
  color: #b3b3b3;
  font-size: 10px;
  font-style: normal;
}
input:-webkit-autofill {
  background-color: 0 0 0px 1000px white inset !important;
}
</style>



