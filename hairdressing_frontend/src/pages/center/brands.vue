<template lang="pug">
  .center-brand__wrap
    .content-container(
      v-show="!isRequest && myBrandList.length"
    )
      .brand-header
        .title 请选择您要进入的品牌：
        .create
          el-button.normal_red_btn(
            @click="toCreate({mark: '/create/brands'})",
            size='medium'
          ) 创建品牌
      .brand-body
        brand-list(
          :list="myBrandList",
          @to-opera="toOpera"
        )
    g-nolist(
      v-show="!isRequest && !myBrandList.length",
      :img="nolistbg",
      :tip="'还没有品牌，赶快创建一个'",
      :btnname="'创建品牌'",
      btnurl="/create/brands",
      @todo="toCreate"
    )
    g-del-model(
      :delTagDialogVisible="hasShopsConfirmVisible",
      title="暂时不能删除！",
      content="该品牌旗下拥有门店，暂时不能删除",
      icon="icon_popup_plaint",
      iconColor="#FCB322",
      concelButton="返回",
      confirmButton="查看门店"
      @close="hasShopsConfirmVisible=false",
      @confirm="checkShops()"
    )
    g-del-model(
      :delTagDialogVisible="noShopsConfirmVisible",
      title="确定要将该品牌删除吗？",
      icon="icon_popup_question",
      iconColor="#FF6D61",
      concelButton="返回",
      @close="noShopsConfirmVisible=false",
      @confirm="confirmDel()"
    )
</template>
<script>
import BrandList from "@/components/center/brandList";
import * as datas from "@/assets/js/datas";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import * as format from '@/util/routerFormat'
import * as axios from '@/util/axios'

export default {
  data() {
    return {
      nolistbg: datas.defaultImg.nobrandlist, // 没有门店列表
      // 弹窗信息
      isRequest: false, // 是否正在请求数据
      current: "", // 当前操作的信息
      myBrandList: [], // 品牌列表
      role: "boss", // 操作人的角色
      storeToDelData: null,
      hasShopsConfirmVisible: false,
      noShopsConfirmVisible: false,
    };
  },
  components: {
    "brand-list": BrandList
  },
  created() {
    this.isRequest = true;
    // 获取我的品牌信息
    axios.get('/myBrands').then(res => {
      this.getMyBrandsRes(res);
    })
  },
  methods: {
    ...mapActions([
      "saveOperate", 
      "saveCurrentInfo", 
      "setCurrentEntry", 
      "setCurrentAuth", 
      "setCurrentEntryNav", 
      "setFlatAuths", 
      "setBtnAuths",
      "setComparisonBrandId", // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
    ]),
    toCreate(data) {
      // 保存操作状态
      this.saveOperate({clickEnter: "add"});
      this.$router.push(data.mark);
    },
    // 获取我的品牌信息
    getMyBrandsRes(res) {
      this.isRequest = false;
      this.isGetBS = true;
      // 1.我的角色是老板
      if (this.role === "boss") {
        // 如果没有品牌，则提示没有品牌
        if (res.myBrandList.length === 0) {
          // 提示
          utils.showTip(this, { msg: "您还没有品牌", type: "success" });
        } else {
          // 如果有很多品牌，则直接展示品牌信息
          this.myBrandList = res.myBrandList;
        }
      }
    },
    // 去删除/编辑
    toOpera(data) {
      console.log(data)
      if (data.type === "edit") {
        // 保存操作状态
        this.saveOperate({clickEnter: "edit"});
        // 保存当前的品牌id
        this.saveCurrentInfo({brandId: data.brandInfo.id});
        this.$router.push("/brand-inner/edit/brands");
      } else if (data.type === "delete") {
        this.storeToDelData = data.brandInfo
        this.tryDelBrand(data.brandInfo)
      } else if (data.type === "manage") {
        // 保存当前的品牌id
        this.saveCurrentInfo({
          brandId: data.brandInfo.id,
          brandName: data.brandInfo.brandName,
          brandLogo: data.brandInfo.brandLogo,
          belongTo: data.brandInfo.industryName,
          slogan: data.brandInfo.slogan,
        });
        this.storeToDelData = null;
        this.getBrandAuthById(data.brandInfo.id)
      } else if (data.type === 'authBrand') {
        this.saveCurrentInfo({
          brandId: data.brandInfo.id,
          brandName: data.brandInfo.brandName,
          brandLogo: data.brandInfo.brandLogo,
          belongTo: data.brandInfo.industryName
        });
        this.$router.push("/brand-inner/center/auth-brand");
      }
      this.current = data.brandInfo.id;
    },
    getBrandAuthById(id) {
      axios.get('/queryBrandPrivileges/' + id).then(res => {
        this.getBrandAuthByIdRes(res, id);
      })
    },
    getBrandAuthByIdRes(res, id) {
      let brandAllRouters = res.privilegeList  // 测试数据时注释, 正式上线用

      // 如果有管理权限， 请求接口获取次级页面的路由树
      let asideRouters = [] // 一级导航数据
      let tabsNav = {} // 二级导航
      let canVistit = [] // 管理页面的权限数据
      this.setComparisonBrandId(id) // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
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
      // this.$router.push("/brand-inner/console")
    },
    lookStore(data) {
      this.saveCurrentInfo({brandId: data.id});
      this.$router.push("/center/shops");
      this.storeToDelData=null
    },
    /* 尝试删除品牌 */
    tryDelBrand(data) {
      axios.post('/getStoreListByFilter', { brandId: data.id, pageParam: { currentPage: 1, pageSize: 100000 } }).then(res => {
        this.delBrand(res);
      })
    },
    /* 根据品牌下是否有门店显示不同 confirm */
    delBrand(res) {
      if (res.total > 0) {
        this.hasShopsConfirmVisible = true
      } else if (res.total === 0) {
        this.noShopsConfirmVisible = true
      }
    },
    /* 前往查看店铺 */
    checkShops() {
      this.$router.push('/center/shops')
    },
    /* 确认删除 */
    confirmDel() {
      axios.post('/deleteBrand',{ id: this.current }).then(res => {
        this.deleteBrandRes(res);
      })
    },
    /* 删除成功 */
    deleteBrandRes(res) {
      if (res.success) {
        this.noShopsConfirmVisible=false
        utils.showTip(this, {msg: res.message, type: 'success'})
        this.isRequest = true
        axios.get('/myBrands').then(res => {
          this.getMyBrandsRes(res)
        })
      } else {
        utils.showTip(this, {msg: res.message, type: 'error'})
      }
    },
  }
};
</script>
