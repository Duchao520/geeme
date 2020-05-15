// pages/SC/pages/purchaseRecharge/purchaseRecharge.js
var apiAction = null, util = null, app = null;
Page({
  $name:'purchaseRecharge',
  data: {
    logo:'',
    keyword:'',
    // 种类数组
    kindArray:[], // id: -1-超值推荐 0-身份卡 1-储值卡 
    // 卡项列表 cardType: 0-身份卡 1-储值卡 2-次卡 3-时间卡
    recommend:null, // 超值推荐
    prePaid:null, // 储值卡
    identity:null, // 身份卡
    ifShowDefault:false,  // 是否显示缺省
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    util.PromiseAll([this.getBrand(),this.fetch()]).then(res => {
      this.$setData(res);
      return res;
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  getBrand(){
    return new Promise(resolve => {
      app.getBrand(brand => {
        this.setData()
        resolve({
          logo: brand.logo
        })
      })
    })
  },
  fetch(){
    return apiAction.weappPagedQueryStoreAllCardKindBasicInfo().then( data => {
      const recommend = data.listCardKindBasicInfoSupperRecommend
      const prePaid = data.listCardKindBasicInfoPrePaidCard
      const identity = data.listCardKindBasicInfoIdentityCard
      const count = data.listCardKindBasicInfoCountCard
      const time = data.listCardKindBasicInfoTimeCard
      // 有卡项数据
      if ((recommend && recommend.length) || (prePaid && prePaid.length) || (identity && identity.length) || (count && count.length) || (time && time.length)){
        return {
          kindArray: [{
            id: -1,
            title: '超值推荐',
            list: recommend
          }, {
            id: 0,
            title: '身份卡',
            list: identity
          }, {
            id: 1,
            title: '储值卡',
            list: prePaid
          }, {
            id: 2,
            title: '次卡',
            list: count
          }, {
            id: 3,
            title: '时间卡',
            list: time
          }]
        }
      // 无卡项数据，显示缺省
      }else{
        return {
          ifShowDefault:true
        }
      }
    })
  },
  // 点击跳转会员卡详情
  jumpVipCardDetail(e){
    const id = e.currentTarget.dataset.id
    this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', {id})
  },
  // 点击跳转会员卡分类详情
  jumpVipCardCateDetail(e){
    const kindId = e.currentTarget.dataset.kindid
    const title = e.currentTarget.dataset.title
    this.$route('/pages/VIP/pages/VipCardCateDetail/VipCardCateDetail', {kindId, title})
  },
  
})