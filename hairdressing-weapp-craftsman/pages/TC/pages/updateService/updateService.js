// pages/TC/choosepackage/choosepackage.js
const fetch = require('../../../../utils/fetch.js')
Page({
  $name:'updateService',
  data: {
    staff: null,   // 服务者信息
    skills: null,   // 发型师界面技能数据结构
    serviceArr:[],  // 选择的服务
  },
  computed: {
    _totalPrice() {
      if (!this.data.serviceArr) return 0
      let total = 0
      for (const v of this.data.serviceArr) {
        total += v.selectedSpecification.count * v.selectedSpecification.specialPrice
      }
      return total
    }
  },
  onLoad(options) {
    const staff = this.$take('staff')
    this.$setData({
      staff,
    })
    this.getServiceTree(options.brandCustomerId, JSON.parse(options.specificationIds))
  },
  // 获取服务
  getServiceTree(brandCustomerId, specificationIds) {
    fetch.weGetServiceListByStoreIdAndStaffIds(brandCustomerId).then(data => {
      this.data.skills = data.dataList
      this.selectOriginService(specificationIds)
    })
  },
  // 勾选已选服务
  selectOriginService(specificationIds) {
    for (const v of this.data.skills) {
      outer: for (const service of v.serviceList) {
        for (const specification of service.packageList) {
          for (let i = 0; i < specificationIds.length; i++) {
            if (specification.id == specificationIds[i]) {
              service.selected = 1
              service.selectedSpecification = specification
              specificationIds.splice(i, 1)
              continue outer;
            }
          }
        }
      }
    }
    this.$setData({
      skills: this.data.skills,
    })
  },
  updateService(e){
    this.$setData({
      serviceArr: e.detail
    })
  },

  // 确认修改
  confirm() {
    if (!this.data.serviceArr.length) {
      wx.showToast({
        title: '亲，你还没有选择服务哦',
        icon: 'none'
      })
      return;
    }
    let skills = this.data.skills;
    let specificationList = [];
    for(const v of this.data.serviceArr){
      specificationList.push({
        count:v.selectedSpecification.count,
        specificationId:v.selectedSpecification.id
      })
    }

    wx.$event.emit('updateService', specificationList)
    wx.navigateBack({
      delta: 1
    })

  },
})