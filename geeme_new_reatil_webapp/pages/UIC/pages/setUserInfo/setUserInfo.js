// pages/UIC/pages/setUserInfo/setUserInfo.js
var apiAction = null, util = null, app = null;
Page({
  $name:'setUserInfo',
  data: {
    userInfo: null,
    // 性别数据
    sexIndex: 2,
    sexArray: ['男', '女', '保密'],
    // 生日数据
    // 居住地数据
  },
  computed: {
    region() {
      if (this.data.userInfo) {
        const {
          province,
          city,
          district
        } = this.data.userInfo
        return [province, city, district]
      }
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.getPersonalInfo()
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  // 获取个人信息
  getPersonalInfo() {
    apiAction.getPersonalInfo(wx.$getStorage('storeId')).then(userInfo => {
      let sexIndex
      for (let i = 0; i < this.data.sexArray.length; i++) {
        if (this.data.sexArray[i] === userInfo.isMale) {
          sexIndex = i
          break
        }
      }
      this.$setData({
        userInfo,
        sexIndex
      })
    })
  },
  // 修改昵称
  updateNickname(e) {
    this.data.userInfo.nickName = e.detail.value
  },
  /**
   * 点击选择性别
   */
  sexChange(e) {
    this.$setData({
      sexIndex: e.detail.value
    })
    this.data.userInfo.isMale = this.data.sexArray[e.detail.value]
  },

  /**
   * 点击选择生日
   */
  birthdayChange(e) {
    this.$setData({
      'userInfo.birthday': e.detail.value
    })
  },

  /**
   * 点击选择居住地
   */
  bindRegionChange(e) {
    const region = e.detail.value
    this.data.userInfo.province = region[0]
    this.data.userInfo.city = region[1]
    this.data.userInfo.district = region[2]
    this.$setData({
      userInfo: this.data.userInfo
    })
  },

  /**
   * 选择图片
   */
  choose() {
    wx.chooseImage({
      count: 1,
      success: res => {
        let imgUrl = res.tempFilePaths[0];
        apiAction.uploadPicture(imgUrl).then( image => {
          this.$setData({
            'userInfo.storeHeadIcon':image
          })
        })
      },
    })
  },

  updateUserInfo() {
    this.data.userInfo.headPortrait = this.data.userInfo.storeHeadIcon
    apiAction.modifyPersonalInfo(this.data.userInfo).then(data => {
      if (data.success) {
        app.setUserInfo()
        wx.showToast({
          title: '修改资料成功',
        })
        const userInfo = wx.$getStorage('userInfo')
        userInfo.nickName = this.data.userInfo.nickName
        userInfo.avatarUrl = this.data.userInfo.storeHeadIcon
        wx.$setStorage('userInfo', userInfo)
        setTimeout( () => {
          wx.navigateBack({
            delta:1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  // 提醒生日只能修改一次
  promptBirthday(){
    wx.showToast({
      title: '您已修改过生日',
      icon:'none'
    })
  }
})