// pages/UIC/pages/archivesDetails/archivesDetails.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    id:null,
    info:null,
  },
  onLoad(options) {
    this.data.id = options.id
    this.fetch()
  },
  fetch(){
    apiAction.customerBeautyAchievesDetail(this.data.id).then( data => {
      this.$setData({
        info:data
      })
    })
  },
  jumpProductDetail(e){
    const {id, type} = e.currentTarget.dataset
    if(type == 'service'){
      this.$route('/pages/IC/pages/productdetails/productdetails', { productId:id})
    }else if(type == 'product'){
      this.$route('/pages/IC/pages/productdetails/productdetails', { productId:id, isProduct:1 })
    }
  },
  jumpStoreDetail(){
    this.$route('/pages/SC/pages/details/details', {id})
  },
  jumpStaffDetail(e){
    this.$route('/pages/SC/pages/hairdetails/hairdetails', {hairId})
  }
})