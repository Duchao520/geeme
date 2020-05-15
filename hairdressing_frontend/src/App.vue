<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import "@/assets/css/common.scss";
import "@/assets/css/buttons.scss";
export default {
  name: "App",
  mounted() {
    let hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
        null;
    let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
    document.addEventListener(visibilityChangeEvent, () => {
      if (!document[hiddenProperty]) {
        // console.log('呔，洒家来也~~')
        this.$root.$emit('needRefreshPage')
      }else{
      }

    })
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  watch: {
    // 主要是品牌管理端切换品牌
    'currentInfo.brandId': {
      handler: function(v, o) {
        let path = this.$route.path
        this.setTitleForHTML(path)
      },
      deep: true,
      immediate: true
    },
    // 主要是门店管理端切换门店
    'currentInfo.shopId': {
      handler: function(v, o) {
        let path = this.$route.path
        this.setTitleForHTML(path)
      },
      deep: true,
      immediate: true
    },
    // 主要是个人中心切换到门店或者品牌管理
    '$route.path': {
      handler: function(v, o) {
        this.setTitleForHTML(v)
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    setTitleForHTML(path) {
      let whiteList = [
        '/',
        '/test/180801',
        '/retsiger',  // register倒置
        '/user-agreement',
        '/retrieve-pass',
        '/center/brands',
        '/create/brands',
        '/center/shops',
        '/center/novice-guide',
        '/center/buySoftware',
        '/center/systemInfo',
        '/center/customerService',
        '/center/person',
        '/center/password',
        '/center/account',
        // 伪白名单
        '/brand-inner/center/auth-brand',
        '/brand-inner/edit/brands',
        '/brand-inner/create/shops', // 使用新开券
        '/shop-inner/edit/shops', // 使用新开券
        '/shop-inner/renewal', // 品牌软件[续费] - 使用续期券
        '/shop-inner/newBuy',  // 品牌软件新购 - 购新开券
        '/center/buy-tickets', // 品牌软件续费 - 购续期券
        '/center/single-shop', // 单店软件[续费] - 使用续期券
      ]
      let title = ''
      if (path.includes('/brand-inner/') && !whiteList.includes(path)) {
        title = `${this.currentInfo.brandName} 总部 | 及美智慧运营系统`
      } else if (path.includes('/shop-inner/') && !whiteList.includes(path)) {
        title = `${this.currentInfo.brandName ? this.currentInfo.brandName + ' - ' : ''}${this.currentInfo.shopName} | 及美智慧运营系统`
      } else {
        title = '及美智慧运营系统'
      }
      this.$nextTick(() => {
        document.title = title
      })
    },

  }
};
</script>

<style lang="scss">
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
button,
input,
textarea,
th,
td {
  margin: 0;
  padding: 0;
}
ul,
li,
ol {
  list-style: none;
}
a {
  text-decoration: none;
}
html,
body {
  width: 100%;
  height: 100%;
  /* overflow-y:hidden; */
  box-sizing: border-box;
  min-width: 1280px;
  overflow-x: auto;
  font-size: 16px;
  background-color: #f4f5f9;
  /*滚动条样式*/
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
    border-radius: 0;
    background: rgba(0, 0, 0, 0);
  }
}
body.el-popup-parent--hidden {
  padding-right: 0!important;
}
image {
  border: none;
}
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #333333 !important;
  background-color: #f4f5f9;
  /* font-size: 0.2rem; */
  width: 100%;
  user-select: none;
  // height: 100%;
  /* margin-top: 60px; */
}
input, textarea, table, tr, td, th, .text-for-copy {
  user-select: text;
}
.text-cant-copy {
  user-select: none;
}
.over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.white {
  background-color: #fff;
}
// 主色调
.main {
  color: #e22c37;
}
.main_back {
  background: #e22c37;
  color: #fff;
}
button.main_back {
  width: 100%;
  height: 0.44rem;
  line-height: 0;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 0.04rem;
  font-weight: 500;
  font-size: 0.18rem;
}

#app input::-webkit-outer-spin-button,
#app input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
#app input {
  -moz-appearance: textfield;
}

/*pagination样式*/
#app .el-pagination, #body .el-pagination {
  // text-align: right;
  // font-size: 14px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 0 0;
}
#app .el-pager li, #body .el-pager li {
  border: 1px solid #ebebea;
  margin: 0 5px !important;
  width: 35px !important;
  height: 35px !important;
  line-height: 35px !important;
  font-size: 14px;
  color: #9b9b9b;
  font-weight: 400;
}
#app .el-pager li:hover, #body .el-pager li:hover {
  color: #409eff !important;
}
#app .el-pager li.active + li, #body .el-pager li.active + li {
  border-left: 1px solid #ebebea !important;
}
#app .el-pager li.active, #body .el-pager li.active {
  color: #fff !important;
  background: #58c9f3;
  border: none;
}
#app .el-pagination .btn-prev,
#app .el-pagination .btn-next,
#body .el-pagination .btn-prev,
#body .el-pagination .btn-next  {
  border: 1px solid #ebebea;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  color: #9b9b9b !important;
  padding: 0;
}
#app .el-pagination .btn-next, #body .el-pagination .btn-next {
  padding-left: 0 !important;
}
#app .el-pagination .btn-prev:hover,
#app .el-pagination .btn-next:hover,
#body .el-pagination .btn-prev:hover,
#body .el-pagination .btn-next:hover {
  color: #409eff !important;
}
#app .el-pagination span:not([class*="suffix"]),
#app .el-pagination button,
#body .el-pagination span:not([class*="suffix"]),
#body .el-pagination button {
  vertical-align: middle;
  display: inline-block;
  height: 35px;
  line-height: 33px;
  font-size: 14px;
}
#app .el-pagination__jump, #body .el-pagination__jump {
  font-size: 14px;
}

#app .el-form .service_item .el-select {
  width: 49.8%;
  max-width: 220px;
}
#app .el-form .service_item + .service_item {
  margin-top: 5px;
}
#app .el-form .service_item > i {
  font-size: 18px;
  color: #e22c37;
  margin-left: 10px;
}

/*radio-button*/
#app
  .radio_group_common
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  border-color: #ff6d61;
  box-shadow: none;
  height: 32px;
  background: transparent;
  border-radius: 4px;
  color: #ff6d61;
}
#app
  .radio_group_common
  .radio_group_common_list
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  border-radius: 20px;
}
#app .radio_group_common .el-radio-button__inner:hover {
  color: #409eff;
}
#app .radio_group_common .el-radio-button__inner {
  padding: 8px 13px;
  border: 1px solid rgba(235, 235, 234, 1);
  border-radius: 4px;
}
#app .radio_group_common .radio_group_common_list .el-radio-button__inner {
  border-radius: 20px;
}
#app .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border-radius: 0;
  border-color: #ebebea;
  border-left: none;
  border-top: none;
  color: #333333;
}

#app .el-tabs__item.is-active {
  color: #e22c37;
}

.el-tabs__item {
  color: #333333;
  font-weight: 400;
}

.margin_main {
  margin-left: 20px;
  margin-right: 20px;
}

.label_area {
  display: block;
  margin-bottom: 10px;
}
.label_area label {
  margin-left: 10px;
}
.margin_label_no {
  margin-left: 0 !important;
}
.label_area_single {
  display: inline-block;
}
.label_area_single {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 14px;
}

.container_normal {
  border: 1px solid rgba(235, 235, 234, 1);
  border-radius: 0px 0px 6px 6px;
  background-color: #fff;
  margin-top: 20px;
}

/*筛选列表*/
.list_condition {
  display: flex;
  flex-direction: row;
}
.list_condition label {
  width: 90px;
  display: inline-block;
  text-align: right;
}
.list_condition .condition_left {
  flex: 1;
}
.list_condition .condition_right .con_phone {
  width: 180px;
}

/*全选以及按钮*/
.oper_btns {
  margin-bottom: 20px;
}
.oper_btns .all_check {
  margin-left: 15px;
  margin-right: 20px;
  font-size: 14px;
}
.oper_btns .oper_btn {
  height: 30px;
  padding: 8px 20px;
}

// 顶部radio_group样式
.radio_group_common {
  .el-radio-button {
    margin-right: 10px;
  }
}

.cursor {
  cursor: pointer;
}
.warning-color {
  color: #ff6d61;
}
/*全屏页面公共布局*/
.full_header {
  width: 100%;
  height: 80px;
  background: #fff;
  box-shadow: 0px 3px 16px 0px rgba(200, 200, 200, 0.1);
}
.full_header .full_header_container {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  .header_left {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: #333333;
    padding-left: 20px;
    .header_back {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 14px;
        margin-right: 6px;
      }
    }
    .header_title {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }
  .header_right {
    flex: 1;
  }
}
.full_container {
  box-shadow: 0px 3px 16px 0px rgba(96, 96, 96, 0.06);
  border-radius: 6px;
  margin: 80px 20px 20px 20px;
  height: auto;
}

//顶部切换tab样式
.container_empty {
  margin-top: 20px;
}
.appo_submenu {
  width: 100%;
  height: 80px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  .tabs {
    flex: 1;
    span {
      display: inline-block;
      color: #9b9b9b;
      height: 80px;
      line-height: 80px;
      font-size: 16px;
      margin-left: 20px;
      cursor: pointer;
    }
    .router-link-active {
      box-sizing: border-box;
      color: #e22c37;
      border-bottom: 2px solid #e22c37;
    }
  }
  .add_appo {
    button {
      width: 140px;
      height: 40px;
      border: none;
      // background:#E22C37;
      // background: #FB598F;
      background: -webkit-linear-gradient(
        left,
        #fb598f,
        #f52d56
      ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        left,
        #fb598f,
        #f52d56
      ); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        left,
        #fb598f,
        #f52d56
      ); /* Firefox 3.6 - 15 */
      background: -ms-linear-gradient(
        left,
        #fb598f,
        #f52d56
      ); /* Firefox 3.6 - 15 */
      background: linear-gradient(to left, #fb598f, #f52d56); /* 标准的语法 */
      color: #fff;
      font-size: 16px;
      outline: none;
      border-radius: 20px;
      margin: 20px 34px 0 20px;
      cursor: pointer;
      padding-left: 12px;
      line-height: 40px;
      .add_btn {
        width: 17px;
        height: 17px;
        vertical-align: middle;
        margin-left: 12px;
        color: #fff;
        font-size: 14px;
        padding: 4px;
        border-radius: 50%;
        background: #f6315b;
      }
      img {
        width: 24px;
        height: 24px;
        margin-left: 12px;
        vertical-align: middle;
      }
    }
  }
}

// 全屏页面顶部切换tab样式
.header_right .tabs {
  margin-left: 13%;
}
.header_right .tabs .el-tabs__nav.is-top {
  height: 80px;
  line-height: 80px;
  font-size: 16px;
}
.header_right .tabs .el-tabs__content {
  display: none;
}
.header_right .tabs .el-tabs__header {
  margin: 0;
}
.header_right .tabs .el-tabs__nav-wrap::after {
  height: 0;
}
.header_right .tabs .el-tabs__item {
  font-size: 16px;
}
.header_right .tabs .el-tabs__active-bar {
  background-color: #e22c37;
}

.router_tabs {
  overflow: hidden;
  border-bottom: 1px solid #ebebea;
  margin-bottom: -1px;
  .tabs_area {
    white-space: nowrap;
    position: relative;
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    float: left;
    z-index: 2;
    border-right: 1px solid #e4e7ed;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #333333;
  }
  p {
    cursor: pointer;
    padding: 0 20px;
    height: 40px;
    // -webkit-box-sizing: border-box;
    // box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    color: #333333;
    position: relative;
    border-bottom: 1px solid transparent;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
      padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
      padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  p:first-child {
    border-left: none;
  }
  p.router-link-active {
    color: #e22c37;
    border-bottom: 2px solid #fff;
  }
}
.el-tabs__item.router-link-active {
  color: #e22c37;
  border-bottom-color: #fff !important;
}

.form-item {
  position: relative;
}
.form-item span {
  display: inline-block;
  position: absolute;
  top: 23px;
  right: 5px;
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
  }
}
.form-item input {
  display: block;
  width: 100%;
  height: 66px;
  font-size: 16px;
  line-height: 66px;
  color: #333;
  background-color: transparent;
  background-image: none;
  border: none;
  border-bottom: 1px solid #ebebeb;
  text-indent: 15px;
}
.form-item input:focus,
.form-item input:active {
  outline: none;
  box-shadow: none;
}
.form-item input:focus ~ label:before {
  font-size: 12px;
  bottom: 50px;
  color: #9b9b9b;
}
.form-item input:focus ~ label:after {
  background-repeat: no-repeat;
  background-size: 1000% 1000%;
  background-image: radial-gradient(
    circle,
    #e22c37 10%,
    rgba(0, 0, 0, 0) 11%
  ) !important;
}
.form-item input:not(:placeholder-shown) ~ label:before {
  font-size: 12px;
  bottom: 50px;
}
.form-item label:before {
  content: attr(data-label);
  display: block;
  position: absolute;
  color: #9b9b9b;
  left: 15px;
  bottom: 25px;
  transition: all 0.15s ease-in-out;
}
.form-item label:after {
  content: "";
  position: absolute;
  display: inline-flex;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  text-align: center;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  transition: all 0.4s ease-in-out;
  background-position: 50%;
  background-size: 200% 200%;
}

// upload 单个文件上传样式
.avatar-uploader .el-upload {
  border: 1px dashed #ebebea;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px !important;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}

.avatar-back-uploader .el-upload {
  border: 1px dashed #ebebea;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-back-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-back-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 296px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar-back {
  width: 296px;
  height: 148px;
  display: block;
}
// 密码提示框
.el-tooltip__popper {
  // 密码提示框部分
  &.is-light,
  .popper__arrow {
    line-height: 18px;
    color: rgb(153, 153, 153);
    border: none !important;
    box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
  }
  li {
    list-style: disc inside;
  }
}
// 消息提示
.el-message {
  z-index: 99999999 !important;
}
button {
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}
#app, #body {
  /deep/ .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
body>#YSF-BTN-HOLDER{
  right: - 110px;
  transition: right 1s;
  #YSF-CUSTOM-ENTRY-0{
    box-shadow: none;
    img{
      width: 160px;
      height: 70px;
    }
  }
  &:hover{
    right: 15px;
    transition: right 1s;
  }
}

.pswp {
  z-index: 3000;
}

.like-link {
  cursor: pointer;
  color: rgb(88, 201, 243);
}
</style>
