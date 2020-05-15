<template>
  <div class="center-shop_wrap">
    <div class="content-container" v-show="myBrandList.length" v-loading="isRequest">
      <center-nav class="center-nav" :list="navList" :current="current" @click="changeNav"></center-nav>
      <div class="shop-header" v-show="myShopList.length > 0 || hasShop">
        <div class="shop-header-left">
          <g-address :reset="isSearch || isNone" @select="addressChange"></g-address>
          <switch-menu style="margin-left:20px;" v-model="appearance"></switch-menu>
          <!-- 需求更改， 不要这种样式和切换形式了 -->
          <!-- <el-checkbox style="margin-left:20px;" v-model="showSupplier" v-if="appearance === 'card' && showBtn">显示进销存版</el-checkbox> -->
          <el-radio-group v-model="showRadio" size="small" style="margin-left: 20px;">
            <el-radio-button label="NORMAL">全功能版</el-radio-button>
            <el-radio-button label="SUPPLIER">进销存版</el-radio-button>
          </el-radio-group>
        </div>
        <div class="shop-header-right">
          <div class="search">
            <input-search v-model="name" placeholder="搜索门店名称" @search="search"></input-search>
          </div>
          <div class="create">
            <el-button
              size="medium"
              class="normal_red_btn"
              @click="toCreate"
              v-if="hasCreateShopPower"
            >创建门店</el-button>
          </div>
        </div>
      </div>

      <div class="shop-body">
        <shop-card
          class="shop-list scrollbar"
          v-if="!isRequest && myShopList.length && appearance==='card'"
          :list="myShopList"
          @to-opera="toOpera"
        ></shop-card>
        <shop-list
          class="shop-list scrollbar"
          @refresh="getMyShops"
          @to-opera="toOpera"
          v-if="!isRequest && hasShop && appearance==='list'"
          :showBottomBtns="hasCreateShopPower"
          :list="myShopList"
        ></shop-list>
        <g-nolist
          v-if="hasCreateShopPower && !isRequest && !isSearch && !hasShop"
          :img="nolistbg"
          :tip="'还没有门店，赶快创建一个'"
          :btnname="'创建门店'"
          :btnurl="'/brand-inner/create/shops'"
          @todo="toCreate"
        ></g-nolist>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          class="table-con default"
          v-if="isSearch && !myShopList.length && appearance ===  'card'"
        >
          <search-default style="margin:10% 0" @clear-back="resetSearch"></search-default>
        </el-row>
      </div>
      <div
        class="pagination"
        v-if="myShopList.length"
        :style="{'justify-content': appearance==='card'?'flex-end':'space-between'}"
      >
        <div class="left" v-if="appearance==='list' && hasCreateShopPower">
          <el-checkbox v-model="allChecked" @change="changeAllChecked" style="margin-right:18px;">全选</el-checkbox>
          <button class="button-recommend" @click="recommend">首页推荐</button>
          <button class="button-unrecommend" @click="unRecommend">取消推荐</button>
        </div>
        <div v-else></div>
        <el-pagination
          class="page"
          style="page"
          @current-change="handleCurrentChange"
          :page-size="pageParam.pageSize"
          :current-page="pageParam.currentPage"
          layout="total, prev, pager, next,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <g-nolist
      v-show="!isRequest && !myBrandList.length"
      :img="nolistbg"
      :tip="'还没有品牌，赶快创建一个'"
      :btnname="'创建品牌'"
      :btnurl="'/create/brands'"
      @todo="toCreateBrands"
    ></g-nolist>
    <del-store-model
      :delStoreVisible="delStoreVisible"
      :current="current"
      @close="delStoreVisible=false"
      @confirm="deleteShopRes"
    ></del-store-model>
  </div>
</template>
<script>
import ShopCard from "@/components/center/shopCard";
import ShopList from "@/components/center/shopList";
import DelStoreModel from "@/components/center/DelStoreModel";
import CenterNav from "@/components/center/nav";

import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as datas from "@/assets/js/datas";
import * as utils from "@/assets/js/utils";
import "@/assets/css/scrollbar.scss";
import { mapActions, mapState } from "vuex";
import * as format from "@/util/routerFormat";
import { stockRoutersOnly, frontFlags } from "@/router/_shopStockRoutersOnly";
export default {
  data() {
    return {
      nolistbg: datas.defaultImg.noshoplist, // 没有门店列表
      // 弹窗信息
      dialogParams: {
        showDialog: false,
        name: "", // 弹出层的名称
        title: "", // 弹出层的标题
        txt: "" // 弹出层内容
      },
      isRequest: true, // 是否正在请求数据
      current: null, // 当前操作的信息
      myBrandList: [], // 品牌列表
      myShopList: [], // 店铺列表
      navList: [], // 导航列表
      role: "boss", // 操作人的角色
      province: null, // 省份
      city: null, // 城市
      pageParam: {
        currentPage: 1,
        pageSize: 12
      },
      name: null,
      total: 0,
      appearance: "card",
      allChecked: false,
      hasCreateShopPower: null,
      delStoreVisible: false,
      isSearch: false,
      showCard: "NORMAL",
      hasShop: false,
      showRadio: "NORMAL",
      // 列表是否为空标识
      isNone: false
      // 所有店铺信息
      // allStore: []
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    selectedStores() {
      let arrIds = [];
      this.myShopList.forEach(element => {
        if (element.selected) {
          arrIds.push(element.shopId);
        }
      });
      return arrIds;
    }
    // 有无进销存门店的标识
    // showBtn() {
    //   let flag = false;
    //   this.allStore.some(item => {
    //     if (item.revenueType === "SUPPLIER") {
    //       flag = true;
    //     }
    //   });
    //   return flag;
    // }
  },
  components: {
    "shop-card": ShopCard,
    "center-nav": CenterNav,
    "shop-list": ShopList,
    "del-store-model": DelStoreModel
  },
  mounted() {
    this.getMyShops("card", "all");
    axios.get(api.getMyBrands.URL).then(res => {
      this.getMyBrandsRes(res);
    });
  },
  watch: {
    appearance(val) {
      this.name = "";
      // 分页清零
      // this.pageParam.currentPage = 1;
      // this.getMyShops(val);
    },
    showRadio(val) {
      this.name = "";
      // 分页清零
      this.pageParam.currentPage = 1;
      this.getMyShops(val);
    },
    "myShopList.length"(val) {
      this.isNone = !!val;
      this.province = null;
      this.city = null;
    }
  },
  methods: {
    ...mapActions([
      "saveOperate",
      "saveCurrentInfo",
      "setCurrentShopInfo",
      "saveUserInfo",
      "setCurrentEntry",
      "setCurrentAuth",
      "setCurrentEntryNav",
      "setFlatAuths",
      "setBtnAuths",
      "setComparisonBrandId" // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
    ]),
    toCreate() {
      this.saveOperate({
        clickEnter: "add"
      });
      this.setCurrentEntry("brand"); // 创建门店-品牌总部的权限
      this.$router.push("/brand-inner/create/shops");
    },
    toCreateBrands() {
      this.saveOperate({
        clickEnter: "add"
      });
      this.$router.push("/create/brands");
    },
    // 搜索门店名称
    search(data) {
      this.getMyShops("search");
    },
    // 选择地址事件
    addressChange(data) {
      // console.log(data)
      this.province =
        data.province === "所有省份" || data.province === ""
          ? null
          : data.province;
      this.city =
        data.city === "所有城市" || data.city === "" ? null : data.city;
      this.getMyShops("search");
    },
    // 改变导航
    changeNav(item) {
      // 将显示模式切为card
      this.appearance = "card";
      this.showRadio = "NORMAL";
      this.current = item.id;
      this.hasCreateShopPower = this.checkHasCreateShopPower(item.id);
      // 存放下当前导航id
      this.saveCurrentInfo({
        brandId: item.id,
        brandName: item.name,
        slogan: item.slogan
      });
      // 开始请求当前品牌下的门店
      this.resetSearch();
    },
    // 检查是否具备创建门店的权力
    checkHasCreateShopPower(id) {
      // 暂时开发创建门店的权限
      // return true

      // 正式的代码
      let r = false;
      this.myBrandList.forEach(item => {
        if (
          item.id === id &&
          item.operateCollection &&
          item.operateCollection.includes("brand_center_create_shop")
        )
          r = true;
      });
      return r;
    },
    // 获取当前品牌下的店铺列表
    getMyShops(type = "list", sort = "only") {
      this.isRequest = true;
      // if(type && type == 'search') this.isSearch = true
      this.isSearch = type && type == "search" ? true : false;
      axios
        .post(api.getStoreListByFilter.URL, {
          brandId: this.currentInfo.brandId,
          city: this.city,
          name: this.name,
          pageParam: {
            currentPage: this.pageParam.currentPage,
            pageSize: this.pageParam.pageSize
          },
          province: this.province,
          revenueType: sort == "all" ? null : this.showRadio
        })
        .then(res => {
          this.listShopByBrandIdRes(res);
          this.hasShop = res.hasStore;
          if (sort == "only") {
            this.isRequest = false;
          }
          // 将所有店铺的信息保存
          // if (type == "card" && sort == 'all') {
          //   this.allStore = res.shopSummaries;
          // }
        });
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageParam.currentPage = val;
      let type = this.appearance;
      this.getMyShops(type);
    },
    // 获取该品牌的所有状态店铺信息
    listShopByBrandIdRes(res) {
      let myShopList = res.shopSummaries;
      myShopList.map(element => {
        return (element.selected = false);
      });
      this.myShopList = myShopList;
      // this.isRequest = false;
      this.total = res.total;
    },
    // 获取我的品牌信息
    getMyBrandsRes(res) {
      this.isRequest = false;
      // 1.我的角色是老板
      if (this.role === "boss") {
        // 如果没有品牌，则提示没有品牌
        if (res.myBrandList.length === 0) {
          // 提示
          utils.showTip(this, { msg: "您还没有品牌", type: "success" });
        } else {
          // 如果有很多品牌，则直接展示品牌信息
          // 整理品牌信息，符合导航字段，name->brandName,id->id
          let brandName = "";
          let slogan = "";
          if (res.myBrandList.length) {
            this.current = res.myBrandList[0].id;
            brandName = res.myBrandList[0].brandName;
            // 存储当前用户的旗下品牌，用于下个页面的品牌组件更新选项
            this.saveUserInfo({
              brandList: res.myBrandList
            });
          }
          this.myBrandList = res.myBrandList;
          res.myBrandList.forEach(list => {
            // 查找当前的brandid是否存在此品牌列表中
            if (list.id === this.currentInfo.brandId) {
              this.current = list.id;
              brandName = list.brandName;
              slogan = list.slogan;
            }
            this.navList.push({
              name: list.brandName,
              id: list.id,
              slogan: list.slogan
            });
          });
          this.changeNav({
            id: this.current,
            brandName: brandName,
            slogan: slogan
          });
        }
      }
    },
    // delStore(data) {
    //   axios.post('/deleteShop',
    //     {
    //       id: this.current,
    //     }
    //   ).then(res => {
    //     this.deleteShopRes(res);
    //   })
    // },
    deleteShopRes(res) {
      if (res.success) {
        this.myShopList.forEach((list, index) => {
          if (list.shopId === this.current) {
            this.myShopList.splice(index, 1);
          }
          this.delStoreVisible = false;
        });
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    toOpera(data) {
      if (data.type === "edit") {
        // 阻止进入编辑, 避免通过路由历史访问该门店
        if (data.status === "TRY_OVER_DUE" || data.status === "OVER_DUE") {
          this.$message({
            type: "error",
            message: "过期门店无法编辑!"
          });
          return;
        }
        this.saveOperate({ clickEnter: "edit" });
        this.saveCurrentInfo({ shopId: data.id });
        this.$router.push("/shop-inner/edit/shops"); // 编辑门店新路由
      } else if (data.type === "delete") {
        this.delStoreVisible = true;
      } else if (data.type === "manage") {
        if (!data.status) {
          this.dialogParams = {
            name: "offline",
            title: "未上线门店",
            txt: "该店铺未上线",
            showDialog: true
          };
          return;
        }
        this.saveCurrentInfo({
          shopId: data.id,
          shopName: data.shopName,
          revenueType: data.revenueType,
          // brandId: data.brandId, // 这个暂时先不推， 下版本等后端接口上线
          brandName: data.brandName,
          shopType: data.shopType
        });
        this.setCurrentShopInfo({
          shopId: data.id,
          shopName: data.shopName,
          city: data.city
        });
        // 判断是常规的店还是仅供应商的店
        if (data.revenueType === "NORMAL") {
          this.getStoreAuthById(data.id);
        } else {
          // 前端处理的仅供应商版路由及按钮权限
          let res = {
            frontFlags,
            privilegeList: stockRoutersOnly
          };
          this.getStoreAuthByIdRes(res);
        }
      }
      this.current = data.id;
    },
    getStoreAuthById(id) {
      axios.get(api.queryStorePrivileges.URL + id).then(res => {
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
      // this.$router.push("/shop-inner/console")
    },
    recommend() {
      this.batchStoreRecommend(true);
    },
    batchStoreRecommend(bool) {
      if (this.selectedStores.length === 0) {
        this.$message({ type: "warning", message: "请选择至少一个门店" });
        return;
      }
      axios
        .post(api.batchStoreRecommend.URL, {
          status: bool,
          storeIds: this.selectedStores
        })
        .then(res => {
          this.batchStoreRecommendRes(res);
        });
    },
    batchStoreRecommendRes(res) {
      if (res.success) {
        this.myShopList.forEach(element => {
          element.selected = false;
        });
        this.allChecked = false;
        this.$message({ type: "success", message: "操作成功" });
        this.getMyShops();
      }
    },
    unRecommend() {
      this.batchStoreRecommend(false);
    },
    changeAllChecked(bool) {
      this.myShopList.forEach(element => {
        element.selected = bool;
      });
    },
    // 清空搜索数据，并重新刷新数据
    resetSearch() {
      this.city = null;
      this.name = null;
      this.province = null;
      this.pageParam.currentPage = 1;
      this.getMyShops("card");
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin button($color, $bg) {
  background: $bg;
  width: 67px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  border-radius: 4px;
  color: $color;
  transition: all 0.6s;
  &:hover {
    opacity: 0.8;
  }
}
.center-shop_wrap {
  box-sizing: border-box;
  padding: 0 20px;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.button-recommend {
  @include button(#fff, #58c9f3);
}
.button-unrecommend {
  @include button(#676868, #f4f5f7);
}

.shop-header {
  margin: 20px 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  .shop-header-left {
    display: flex;
    align-items: center;
  }
  .shop-header-right {
    display: flex;
    .create {
      margin-left: 10px;
    }
  }
}
.content-container {
  display: flex;
  flex-direction: column;
  .center-nav {
    flex: 0 0 auto;
  }
  .shop-header {
    flex: 0 0 auto;
  }
  .shop-body {
    flex: 0 0 auto;
    overflow-y: auto;
    box-sizing: border-box;
    padding-bottom: 100px;
    .shop-list {
      max-height: calc(100vh - 280px);
      overflow-y: auto;
    }
    /deep/ .btn-prev,
    /deep/ .btn-next {
      width: 35px;
    }
  }
  .pagination {
    position: absolute;
    bottom: 9px;
    right: -14px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px 0 10px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
  }
}
</style>
