// pages/home/address/address.js
const apiAction = require('../../../../utils/apiAction.js');
Page({
  $name:'address',
  data: {
    cityList: null,
    address:'',
    currentindex:-1
  },
  onNavigate(options){
    this.$place('data', this.fetch())
  },
  onLoad(options) {
    // 从本地拿出地址信息
    this.$setData({
      address: wx.$getStorage('address')
    })
    this.$take('data').then(this.render)
  },
  fetch(){
    return apiAction.getShopCityList()
  },
  render(data){
    let city = this.data.address.city
    for (let i=0; i<data.cityList.length; i++){
      if(data.cityList[i].name === city){
        data.cityList.splice(i, 1)
        break
      }
    }
    this.$setData({
      cityList: data.cityList
    })
  },

  /**
   * 点击城市
   */
  setcurrentcity(e) {
    let index = e.currentTarget.dataset.index;
    let addressName = e.currentTarget.dataset.name;
    this.setData({
      currentindex: index
    })
    let address = wx.$getStorage('address');
    address.city = addressName
    wx.$setStorage('address', address)
    wx.$event.emit('setAddress')
    wx.navigateBack({
      delta: 1
    })
  },
})