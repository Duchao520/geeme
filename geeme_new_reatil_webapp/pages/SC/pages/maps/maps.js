// pages/SC/pages/maps/maps.js
var apiAction = null,app=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorInformation: [],
    floorid: 0,
    floor: null,
    tabs: [],
    activeTab: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();
    this.getBrandInfo().then(res => {
      this.$setData(res)
    })
  },
  onUnload: function () {
    apiAction = null;
    app = null;
    this.data = null;
  },
  getBrandInfo() {
    return new Promise(resolve => {
      app.getBrand((brand) => {
        resolve({ brand })
      })
    }).then(res => {
      return this.getMallBrandFloorInformation(res.brand.brandId)      
    })
  },
  getMallBrandFloorInformation(brandId) {
    return apiAction.getMallBrandFloorInformation({ brandId: brandId }).then(res => {
      if (res.success) {
        let { mallFloorInformationList } = res;
        let partition = mallFloorInformationList.filter(ele => !ele.fatherId);
        partition.forEach(ele => {
          let floorList = [];
          mallFloorInformationList.forEach(item => {
            if (ele.id == item.fatherId) {
              floorList.push(item);
            };
          })
          ele.floorList = floorList;
        })
        let tabs = [partition[0].floorList[0].name]
        return {
          partition: partition,
          floor: partition[0].floorList[0],
          tabs
        }
      } else {
        return {}
      }
    })
  },
  selectFloor(event) {
    let { childId, parentName, childName , item } = event.detail,
        {tabs} = this.data;
        
    tabs[0] = childId ? parentName + '-' + childName : childName;
    this.$setData({
      floorid: childId,
      floor: item, activeTab: -1, tabs
    })
    
  },
  popup(e) {
    let { index } = e.detail;
    this.setData({
      activeTab: index
    })
  },
  hideShade(){
    this.setData({activeTab: -1})
  }
})