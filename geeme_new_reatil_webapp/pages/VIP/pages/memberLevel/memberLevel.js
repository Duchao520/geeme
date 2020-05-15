// pages/VIP//pages/memberLevel/memberLevel.js
var apiAction = null, util = null, app = null;
Page({
  data: {
    userInfo:null,
    levelList:null,
    current:0,
    customerExp:0,
  },
  computed:{
    previousLevel(){
      if(!this.data.levelList) return null
      if (this.data.current == 0) return null
      return this.data.levelList[this.data.current - 1]
    },
    currentLevel(){
      if (!this.data.levelList) return null
      return this.data.levelList[this.data.current]
    },
    nextLevel(){
      if (!this.data.levelList) return null
      if (this.data.current == this.data.levelList.length - 1) return null
      return this.data.levelList[this.data.current + 1]
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    util.PromiseAll([this.fetch(),this.getUserInfo()]).then(res =>{
      this.$setData(res);
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  getUserInfo(){
    return new Promise(resolve => {
      app.getUserInfo(userInfo => {
        resolve({userInfo})
      })
    })
  },
  fetch(){
    wx.$showLoading()
    // 获得等级信息列表
    let promise1 = apiAction.weGetBrandMemberLevelList()
    // 获取客户等级信息
    let promise2 = apiAction.weGetBrandCustomerLevelInfoById()
    return Promise.all([promise1, promise2]).then( datas => {
      wx.$hideLoading()
      const levelList = datas[0].brandMemberLevelInfoList
      const customerExp = datas[1].brandCustomerExperience
      let index 
      for(let i=0; i<levelList.length; i++){
        if(customerExp >= levelList[i].experience){
          index = i
        }else{
          break;
        }
      }
      return {
        levelList,
        customerExp,
        current: index
      }
    })
  },
  change(e){
    this.$setData({
      current:e.detail.current
    })
  },
  // 跳转成长值规则
  jumpMemberLevel_rules(){
    this.$route('/pages/VIP/pages/memberLevel_rules/memberLevel_rules')
  },
  jumpRecord(){
    this.$route('/pages/VIP/pages/memberLevel_record/memberLevel_record')
  }
  // 跳转成长值记录

})