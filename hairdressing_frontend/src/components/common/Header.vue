<template lang="pug">
section.header-wrap
  .header-left
    img(
      class="logo",
      :src="formatPicImage(currentInfo.brandLogo, 'style', 40, 'brandLogo')"
    )
    .top-nav
      //- 这里见鬼了
      .nav-name {{ currentInfo.brandName || shopInfo.brandName }}
      el-dropdown(
        trigger="hover"
      )

        span.drop-title
          span.city {{ currentEntry === 'brand' ? '' : currentShopInfo.city | splitCity}}
          span.shop(
            :title="currentShopInfo.shopName"
          ) {{ currentEntry === 'brand' ? '品牌总部' : currentShopInfo.shopName}}
          i.el-icon-arrow-down.el-icon-arrow-right
        el-dropdown-menu.left-dropdown(
          slot="dropdown"
        )
          .drop-content
            //- .search
            //-   input.input(
            //-     type="input"
            //-     :placeholder="currentEntry =='brand'? '请输入品牌名称' : '请输入店铺名称'"
            //-   )
            //-   i.icon.iconfont.icon-icon_search
            //- .menu-title 品牌总部
            .menu-title
            ul.drop-list(
              v-if="currentEntry === 'shop'"
              v-for="(series, index) in shopInfo.shopWithCityList",
              :key="index"
            )
              li.province {{ series.cityName | splitCity }}
              li.list-items
                .list-item(
                  v-for="(shop, index) in series.shopInfoList",
                  :key="shop.shopId",
                  :class="[shop.shopId===currentInfo.shopId ? 'active' : '']"
                  @click="chooseNavDrop(shop, index)"
                )
                  el-dropdown-item {{ shop.name }}
            ul.drop-list(
              v-if="currentEntry === 'brand'"
              v-for="(brand, index) in myBrandList",
              :key="index"
            )
              li.list-items
                .list-item(
                  :class="[brand.id===currentInfo.brandId ? 'active' : '']"
                  @click="chooseBrandDrop(brand, index)"
                )
                  el-dropdown-item {{ brand.brandName }}
            .menu-more(
              @click='seeMoreList'
            ) 查看更多
    .top-menu(
      @click="switchMenu"
    )
      i.icon.iconfont.icon-icon_top_more
  .header-center
    g-tabs(
      :tabname="'ROUTER_TABS'"
    )
  .header-right(

  )
    .top-ring(
      @click="toPerCen"
    )
      i.icon.iconfont.icon-icon_top_back
      <!-- 消息推送功能先隐藏 -->
    <!-- .top-ring
      i.icon.iconfont.icon-icon_top_notice
      span.ring-num.num 10 -->
    el-popover(
      placement="bottom-end"
      trigger="hover"
    )
      .top-ring(
        slot="reference"
      )
        i.icon.iconfont.icon-icon_tag_store(
          style='font-size:20px;line-height:34px;'
        )
      .QR-code
          img(
            class="img"
            v-if="qrCodeImage",
            :src="utils.formatPicImg(qrCodeImage,'style',40)"
          )
          g-button(
            v-if="qrCodeImage",
            name='下载',
            type="mgreenFill",
            icon="icon_operate_down",
            @click.native="download(qrCodeImage)",
            class="btn-button"
          )
          .default(v-else)
            img(
              class='img'
              src="@/assets/images/default/default_smallpro.png"
            )
            .text 您暂未开通小程序
            button(
              @click='goto()'
            ) 立即开通
    el-popover(
      trigger="click"
      class="console_popover",
      placement="bottom-end",
      :value=false
    )
      .top-right-box(
        slot="reference"
        @click="changeMePopover"
        @mouseenter="visible = true"
        @mouseleave="visible = false"
      )
        .top-avatar
          img(
            class="me",
            :src="utils.formatPicImage(userInfo.headPortrait,'style',40, 'someone',userInfo.sex)"
          )
        .top-about-drop(
        ) {{ userInfo.nickname || userInfo.telephone }}
        i.el-icon-arrow-down
        headPopover(
          :visible="visible"
          class="header-popover"
        )
          .user_msg
            div.popver_title
              p.nickName {{ userInfo.nickname }}
              p.user_telphone {{ userInfo.telephone }}
              span(
                @click="toPerCen"
              ).user_center 个人中心
                i.el-icon-arrow-down.el-icon-arrow-right
            //-.user_oper
              //- p(
              //-   @click="toUpdatePass"
              //- )
              //-   img(src="@/assets/img/changepsw_icon.png")
              //-   span 修改密码
              //- p(
              //-   @click="toPerCen"
              //- )
              //-   img(src="@/assets/img/personal_center_icon.png")
              //-   span 个人中心
            .user_subscibe
              p.user_edition {{brandStoreInfo.version =="1" ? "标准版":brandStoreInfo.version =="2" ? "专业版":brandStoreInfo.version =="3" ? "旗舰版": ''}}
              p.subscibe_oper {{brandStoreInfo.dueDate}}到期
                span(
                  @click = "toRenewal()"
                ) 续费
                //- span(
                //-   @click = 'toNewShop()'
                //- ) 新购
            .user_help
              p.user_phone
                i.icon.iconfont.icon_info_service &#xe6fd;
                span 客服热线: {{brandStoreInfo.hotline}}
            .user_btn
              p(
                @click="newFingerGuide"
              )
                i.icon.iconfont.icon-icon_info_new
                span 新手引导
              p(
                @click="toUpdatePass"
              )
                i.icon.iconfont.icon_info_password &#xe6fb;
                span 修改密码
              p.logout(
                @click="logout"
              )
                i.icon.iconfont.icon_info_quit &#xe6fc;
                span 退出登录
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions, mapState } from "vuex";
import headPopover from "./headPopover";
import { constants } from "fs";
import * as format from "@/util/routerFormat";
import { stockRoutersOnly, frontFlags } from "@/router/_shopStockRoutersOnly";
export default {
  components: {
    "g-popover": headPopover
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      utils: utils,
      shopInfo: {
        brandLogo: "",
        brandName: "",
        shopWithCityList: []
      },
      visible: false,
      datas: datas,
      qrCodeImage: "",
      brandStoreInfo: {},
      myBrandList: []
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    userInfo() {
      return this.$store.state.manage.userInfo;
    },
    // authRouter() {
    //   return this.getBrandShopInfo(this.$store.state.authRouter.currentEntry);
    // },
    currentShopInfo() {
      return this.$store.state.manage.currentShopInfo;
    },
    currentEntry() {
      return this.$store.state.authRouter.currentEntry;
    }
  },
  watch: {
    currentInfo: {
      deep: true,
      handler(newVal) {
        this.init();
      }
    }
  },
  created() {
    this.init();
    axios.get("/userInfo").then(res => {
      this.saveUserInfo(res);
    });
  },
  methods: {
    ...mapActions([
      "changeMenuShow",
      "saveCurrentInfo",
      "saveUserInfo",
      "setCurrentShopInfo",
      "setCurrentEntry",
      "setCurrentAuth",
      "setCurrentEntryNav",
      "setFlatAuths",
      "setBtnAuths",
      "setComparisonBrandId" // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
    ]),
    init() {
      if (this.currentEntry === "shop") {
        // 请求门店切换列表
        this.getBrandAndShop();
      } else {
        // 请求品牌切换列表
        axios.get("/myBrands").then(res => {
          let resetData = [];
          res.myBrandList.forEach(brand => {
            if (
              brand.operateCollection &&
              brand.operateCollection.includes("brand_center_manage")
            ) {
              resetData.push(brand);
            }
          });
          this.myBrandList = resetData;
        });
      }
      axios
        .post("/getQrCode", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentEntry === "shop" ? this.currentInfo.shopId : null
        })
        .then(res => {
          this.qrCodeImage = res.filePath;
        });
      this.getBrandShopInfo(this.currentEntry);
    },
    getBrandAndShop() {
      axios
        .post("/getBrandAndShop", { brandId: this.currentInfo.brandId })
        .then(res => {
          // 本来想这里vuex存入shopType 结果这个接口没有。。 已经用其他方式解决
          this.shopInfo = res;
          this.saveCurrentInfo({
            brandLogo: res.brandLogo,
            brandName: res.brandName
          });
          this.setCurrentShopInfo({ brandName: res.brandName });
          this.filterCurrentShop(this.shopInfo.shopWithCityList);
        });
    },
    goto() {
      this.$router.push("/brand-inner/store/info/mini-project");
    },
    getBrandShopInfo(type) {
      if (type == "shop") {
        axios
          .get("/getBrandInfo4StorePullDownMenu/" + this.currentInfo.shopId)
          .then(res => {
            this.brandStoreInfo = res;
          });
      } else if (type == "brand") {
        axios
          .get("/getBrandInfo4BrandPullDownMenu/" + this.currentInfo.brandId)
          .then(res => {
            this.brandStoreInfo = res;
          });
      }
    },
    // 新购
    toNewShop() {
      // 软件购买的brandId 和 shopId 都暂时存在 state.soft 中， 所以此处暂时跳软件购买页面。 有时间再调整跳转前存储对应的数据即可恢复
      // this.$router.push("/shop-inner/newBuy");
      this.$router.push("/center/buySoftware");
    },
    // 续费
    toRenewal() {
      // 软件购买的brandId 和 shopId 都暂时存在 state.soft 中， 所以此处暂时跳软件购买页面。 有时间再调整跳转前存储对应的数据即可恢复
      // this.$router.push("/shop-inner/renewal");
      this.$router.push("/center/buySoftware");
    },
    filterCurrentShop(data) {
      data.forEach((series, i) => {
        series.shopInfoList.forEach((item, j) => {
          if (item.shopId === this.currentInfo.shopId) {
            this.setCurrentShopInfo({
              city: item.city,
              name: item.name,
              shopName: item.name,
              shopId: item.shopId,
              shopLogo: item.shopLogo,
              shopType: item.type
            });
          }
        });
      });
    },
    chooseNavDrop(shop) {
      this.saveCurrentInfo({
        shopId: shop.shopId,
        shopName: shop.name,
        revenueType: shop.revenueType,
        shopType: shop.shopType
        
      });
      this.filterCurrentShop(this.shopInfo.shopWithCityList);
      //要加入新的权限获取的接口请求
      if (shop.revenueType === "NORMAL") {
        this.getStoreAuthById(shop.shopId);
      } else {
        // 前端处理的仅供应商版路由及按钮权限
        let res = {
          frontFlags,
          privilegeList: stockRoutersOnly
        };
        this.getStoreAuthByIdRes(res);
      }
      // this.$router.push("/shop-inner/console");
      // this.$emit("change");
    },
    getStoreAuthById(id) {
      axios.get("/queryStorePrivileges/" + id).then(res => {
        this.getStoreAuthByIdRes(res);
      });
    },
    getStoreAuthByIdRes(res) {
      let shopAllRouters = res.privilegeList; // 测试数据时注释, 正式上线用
      let asideRouters = []; // 一级导航数据
      let tabsNav = {}; // 二级导航
      let canVistit = []; // 管理页面的权限数据
      this.setComparisonBrandId(this.currentInfo.brandId); // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
      this.setCurrentEntry("shop"); // 管理门店-门店的权限
      this.setCurrentAuth(shopAllRouters); // 赋予当前门店的权限路由
      asideRouters = format.entryNavBar(shopAllRouters);
      this.setCurrentEntryNav({ ROUTER_Nav_Bars: asideRouters }); // 一级导航存储
      tabsNav = format.create2edNavBar(asideRouters); // 二级导航
      this.setCurrentEntryNav({ ROUTER_TABS: tabsNav }); // 二级导航存储
      this.setCurrentEntryNav({
        ROUTER_3rd_Nav: format.create3rdNavBar(tabsNav)
      }); // 3级导航存储(设置中心)
      this.setCurrentEntryNav({
        ROUTER_SUB_TABS: format.createRouteSubTabs(shopAllRouters)
      }); // 员工和会员档案导航
      format.routersArrFlat(shopAllRouters, canVistit, "routes", "path");
      this.setFlatAuths(canVistit);
      this.setBtnAuths(res.frontFlags);
      // 如果操作台没有权限...
      let toPath = format.getLastLevelPathInFirstChild(asideRouters);
      this.$router.push(toPath);
    },
    chooseBrandDrop(brand, index) {
      this.saveCurrentInfo({
        brandId: brand.id,
        brandName: brand.brandName,
        brandLogo: brand.brandLogo,
        slogan: brand.slogan
      });
      axios.get("/queryBrandPrivileges/" + brand.id).then(res => {
        let brandAllRouters = res.privilegeList;
        let asideRouters = []; // 一级导航数据
        let tabsNav = {}; // 二级导航
        let canVistit = []; // 管理页面的权限数据
        this.setComparisonBrandId(brand.id); // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
        this.setCurrentEntry("brand");
        this.setCurrentAuth(brandAllRouters); // 赋予当前品牌的权限比对路由
        asideRouters = format.entryNavBar(brandAllRouters);
        this.setCurrentEntryNav({ ROUTER_Nav_Bars: asideRouters }); // 一级导航存储
        tabsNav = format.create2edNavBar(asideRouters); // 二级导航
        this.setCurrentEntryNav({ ROUTER_TABS: tabsNav }); // 二级导航存储
        this.setCurrentEntryNav({
          ROUTER_3rd_Nav: format.create3rdNavBar(tabsNav)
        }); // 3级导航存储(设置中心)
        this.setCurrentEntryNav({
          ROUTER_SUB_TABS: format.createRouteSubTabs(brandAllRouters)
        }); // 员工和会员档案导航
        format.routersArrFlat(brandAllRouters, canVistit, "routes", "path");
        this.setFlatAuths(canVistit);
        this.setBtnAuths(res.frontFlags);
        let toPath = format.getLastLevelPathInFirstChild(asideRouters);
        this.$router.push(toPath);
      });
    },
    // 开关菜单
    switchMenu() {
      this.changeMenuShow();
    },
    // 去到 个人中心
    toPerCen() {
      this.$router.push("/center/brands");
    },
    toUpdatePass() {
      this.$router.push("/center/password");
    },
    // 退出
    logout() {
      axios.post("/logout");
    },
    // 新手指引
    newFingerGuide() {
      this.$router.push("/center/novice-guide");
    },
    // 改变下拉的状态
    changeMePopover() {
      this.visible = !this.visible;
    },
    seeMoreList() {
      let link =
        this.currentEntry === "shop" ? "/center/shops" : "/center/brands";
      this.$router.push(link);
    },
    download(key) {
      axios
        .get("/downloadPicture/" + key, { responseType: "blob" })
        .then(res => {
          let img = document.createElement("img");
          img.onload = function(e) {
            window.URL.revokeObjectURL(img.src);
          };
          img.src = window.URL.createObjectURL(res);
          let a = document.createElement("a"); // 生成一个a元素
          let event = new MouseEvent("click"); // 创建一个单击事件
          a.download = key || "photo"; // 设置图片名称
          a.href = img.src; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
        });
    }
  },
  filters: {
    splitCity(val) {
      let newVal = val.split("市");
      if (newVal.length > 1) {
        newVal = newVal[0];
      } else {
        newVal = val;
      }
      // 过滤城区
      newVal = newVal.replace("城区", "");
      return newVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.top-ring {
  i {
    line-height: 32px;
  }
}
.left-dropdown {
  .drop-content {
    .drop-list {
      .list-item.active .el-dropdown-menu__item {
        color: #ff6d61;
      }
      .el-dropdown-menu__item {
        padding: 0;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        letter-spacing: 1px;
      }
    }
  }
}
.header-wrap {
  width: 100%;
  min-width: 1280px;
  height: 55px;
  box-sizing: border-box;
  padding: 0px 12px;
  position: fixed;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 999 !important; // 不要超过dialog的 1000以上
  font-size: 14px;
  -webkit-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  .header-left {
    float: left;
    padding-top: 8px;
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 8px;
      vertical-align: top;
    }
    .top-nav {
      width: 125px;
      display: inline-block;
      .nav-name {
        width: 90%;
        font-size: 14px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 4px;
        text-overflow: ellipsis;
      }
      .el-dropdown {
        width: 100%;
      }
      .el-icon-arrow-down {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .city,
      .shop {
        display: inline-block;
        cursor: pointer;
        font-size: 12px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.city {
          max-width: 36px;
          margin-right: 3px;
          padding: 1px 0;
        }

        &.shop {
          max-width: 68px;
          padding: 1px 2px;
          background: #f52d56;
          color: #fff;
          border-radius: 2px;
          text-align: center;
        }
      }
    }
    .top-menu {
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      margin-top: -3px;
      margin-left: 14px;
      .icon {
        font-size: 40px;
      }
    }
  }
  .header-center {
    float: left;
    line-height: 55px;
  }
  .header-right {
    text-align: center;
    padding-top: 8px;
    float: right;
    .top-ring,
    .top-message {
      position: relative;
      cursor: pointer;
      display: inline-block;
      border: 1px solid #e3e2ec;
      width: 32px;
      height: 32px;
      margin-right: 30px;
      margin-top: 2px;
      align-items: center;
      vertical-align: top;
      margin-bottom: 6px;
      .icon.iconfont {
        font-size: 28px;
        color: #778ca2;
      }
      .num {
        position: absolute;
        width: 17px;
        height: 17px;
        line-height: 17px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #fff;
        &.letter-num {
          background: #a9d86e;
        }
        &.ring-num {
          background: #fcb322;
        }
      }
    }
    .console_popover {
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      margin-top: 12px;
    }
    .top-about-drop {
      cursor: pointer;
      display: inline-block;
      max-width: 80px;
      min-width: 40px;
      vertical-align: top;
      word-break: keep-all;
      margin-right: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .top-avatar {
      display: inline-block;
      cursor: pointer;
      margin-top: 2px;
      margin-right: 10px;
      width: 36px;
      height: 36px;
      .me {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
// 下拉
.el-dropdown-menu {
  &.el-popper {
    z-index: 999999 !important;
    width: 220px;
    max-height: 300px;
    padding: 0;
    overflow-y: auto;
    top: 4px !important;
    left: 188px !important;
    .popper__arrow {
      display: none;
    }
  }
  /*滚动条样式*/
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .drop-content {
    // padding: 10px;
    box-sizing: border-box;
    position: relative;
    height: 100%;
    .search {
      position: relative;
      margin: 10px 10px 0 10px;
      .input {
        width: 100%;
        height: 25px;
        outline: none;
        line-height: 25px;
        font-size: 12px;
        color: #000;
        border: 1px solid #dcdfe6;
        border-radius: 20px;
        padding: 0 20px 0 30px;
        box-sizing: border-box;
        &:focus {
          border: 1px solid rgb(149, 182, 242);
        }
        &:input-placeholder {
          color: #c7cad1;
        }
        &:-webkit-input-placeholder {
          color: #c7cad1;
        }
        &:-moz-input-placeholder {
          color: #c7cad1;
        }
        &:-ms-input-placeholder {
          color: #c7cad1;
        }
        &:-o-input-placeholder {
          color: #c7cad1;
        }
      }
      .icon {
        position: absolute;
        left: 8px;
        bottom: 5px;
        font-size: 12px;
        color: #c7cad1;
        cursor: pointer;
      }
    }
    .menu-title {
      color: #666666;
      padding: 10px 0 14px 20px;
      font-size: 16px;
    }
    .province {
      color: #666666;
      font-size: 16px;
      padding: 0px 20px 0px 20px;
    }
    .drop-list {
      // min-height: 180px;
      .list-items {
        padding: 8px 5px 11px 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: space-between;
        .list-item {
          color: #999999;
          cursor: pointer;
          display: inline-block;
          font-size: 12px;
          margin-right: 10px;
          // margin-bottom: 8px;
          &.active {
            color: #ff6d61;
          }
        }
      }
    }
    .menu-more {
      margin-top: 20px;
      padding: 15px;
      width: 100%;
      background: #a4afd1;
      box-sizing: border-box;
      color: #fff;
      // text-align: center;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .el-dropdown-menu__item {
    padding: 5px 20px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .shop-logo {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
}

.popver_title {
  color: #ffffff;
  font-size: 18px;
  position: relative;
  background: #9da8cc;
  border-radius: 5px 5px 0 0;
  padding-left: 20px;
  padding-top: 15px;
  .user_center {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
  }
  .nickName {
    width: 140px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .user_telphone {
    font-size: 14px;
    padding-bottom: 10px;
    padding-top: 2px;
  }
}
.el-popover {
  top: 50px !important;
  .user_msg {
    width: 245px;
    height: 300px;
    border-bottom: 1px solid rgba(235, 235, 235, 1);
    .user_oper {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      p {
        cursor: pointer;
        flex: 1;
        img {
          width: 14px;
          height: 14px;
          margin-right: 12px;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
    }
  }
}
.user_subscibe {
  height: 70px;
  margin: 0 20px;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  .user_edition {
    padding-top: 10px;
    padding-bottom: 7px;
    color: #f52d56;
    span {
      margin-left: 4px;
    }
  }
  .subscibe_oper {
    span {
      color: #f52d56;
      cursor: pointer;
      border: 1px solid #f52d56;
      padding: 2px 4px 3px 6px;
      float: right;
      margin-left: 5px;
      border-radius: 3px;
      position: relative;
      top: -5px;
      &:first-child {
        border-color: #41cac0;
        color: #41cac0;
      }
    }
  }
}
.user_btn {
  padding-left: 20px;
  p {
    line-height: 44px;
    height: 44px;
    cursor: pointer;
    color: #666666;
    i {
      margin-right: 10px;
    }
  }
}
.top-right-box {
  display: inline-block;
  margin-top: -15px;
  display: flex;
  align-items: center;
  position: relative;
  .header-popover {
    position: absolute;
    top: 55px;
    left: -150px;
    border: none;
    /* width: 245px; */
    /*  padding: 17px 0 0 0; */
    text-align: justify;
    .user_msg {
      width: 245px;
      .user_oper {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        p {
          cursor: pointer;
          flex: 1;
          img {
            width: 14px;
            height: 14px;
            margin-right: 12px;
            vertical-align: middle;
          }
          span {
            vertical-align: middle;
          }
        }
      }
    }
    .user_help {
      margin: 0 20px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(235, 235, 235, 1);
      i {
        margin-right: 10px;
      }
    }
  }
}
.QR-code {
  box-sizing: border-box;
  padding: 30px;
  padding-bottom: 20px;
  .img {
    display: block;
  }
  .btn {
    display: block;
    margin: auto;
    margin-top: 10px;
  }
}
.default {
  width: 158px;
  height: 158px;
  border: 1px solid #ebecf0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    display: block;
    width: 60px;
    height: 60px;
    margin: 16px 0 14px 0;
  }
  .text {
    font-size: 12px;
    color: #333333;
    margin-bottom: 10px;
  }
  button {
    border: 1px solid #ff6d61;
    color: #ff6d61;
    box-sizing: border-box;
    width: 93px;
    height: 32px;
    line-height: 30px;
    border-radius: 3px;
    transition: all 0.4s;
    &:hover {
      filter: brightness(90%);
      background: #fff;
    }
  }
}
</style>
