// pages/appointment/index/index.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  // 0 未关注 
  data: {
    businessCategoryInfoList: [{ name: '推荐', id: '' }],   //tab标签,
    tabShow: false,
    brand: null,                                         //品牌信息
    simpleStaffDynamicWork: [],                           //动态列表
    queryParams: {                                        //查询参数
      brandId: "",
      businessCategory: null,
      currentPage: 1,
      pageSize: 10
    }
  },
  onLoad() {
    this.getBrandInfo().then(res => {
      this.$setData(res)
    })
  },
  // 请求品牌信息
  getBrandInfo() {
    return new Promise(resolve => {
      app.getBrand((brand) => {
        resolve({ brand })
      })
    }).then(res => {
      this.data.queryParams.brandId = res.brand.brandId;
      return util.PromiseAll([this.getMallSimpleDynamic(), this.getCategorySortForApi(res.brand.brandId)])
    })
  },
  //获取tab标签
  getCategorySortForApi(brandId) {
    let { businessCategoryInfoList} = this.data;
    return apiAction.getCategorySortForApi({ brandId, limit: 10 }).then(res => {
      businessCategoryInfoList = businessCategoryInfoList.concat(res.businessCategoryInfoList);
      return { businessCategoryInfoList,tabShow: true};
    })
  },

  switchTab(event){
    let {id} = event.detail;
    this.data.queryParams.businessCategory = id;
    this.getMallSimpleDynamic().then(res => {
      this.$setData(res);
    })
  },

  //商场客户端-发现页 员工动态
  getMallSimpleDynamic(page = 'firstPage'){
    let { queryParams, simpleStaffDynamicWork,total} = this.data;

    if(page == 'firstPage'){
      queryParams.currentPage = 1;
    }else{
      if (queryParams.currentPage * queryParams.pageSize >= total) return Promise.resolve({});
      queryParams.currentPage++;
    }
    this.data.queryParams = queryParams;

    return apiAction.getMallSimpleDynamic(queryParams).then(res => {
      if(page == 'firstPage'){
        simpleStaffDynamicWork = res.simpleStaffDynamicWork;
      }else{
        simpleStaffDynamicWork = simpleStaffDynamicWork.concat(res.simpleStaffDynamicWork);
      };
      return {
        simpleStaffDynamicWork,
        total: res.total
      }
    })
  },
  onPullDownRefresh(){
    this.getBrandInfo().then(res => {
      wx.stopPullDownRefresh();
      this.$setData(res)
    })
  },
  onReachBottom(){
    this.getMallSimpleDynamic('nextPage').then(res => {
      this.$setData(res);
    })
  }
})