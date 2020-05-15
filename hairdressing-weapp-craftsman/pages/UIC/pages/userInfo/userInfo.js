// pages/UIC/pages/UserInfo/UserInfo.js
const fetch = require('../../../../utils/fetch.js')
const app = getApp()
Page({
  $name:'userInfo',
  data: {
    userInfo: {},
    skills:[],  // 门店内所有项目
    // 性别picker
    sexArray: ['男', '女'],
    sexIndex: 0,
  },
  onLoad(options) {
    this.getUserInfo()
    this.$on('updateSkillNum', this.updateSkillNum)
  },
  updateSkillNum(num){
    this.setData({
      'userInfo.skillNum':num
    })
  },
  getUserInfo(){
    fetch.personalData4Edit().then( data => {
      this.$setData({
        userInfo:data
      })
      app.setUserInfo(data)
    })
  },
  // 修改头像
  choosePortrait() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const img = res.tempFilePaths[0]
        fetch.uploadFile(img).then(uploadFileRes => {
          this.setData({
            'userInfo.headPortrait': uploadFileRes
          })
        })
      }
    })
  },
  // 修改姓名
  updateName(e) {
    this.data.userInfo.name = e.detail.value
  },
  // 修改昵称
  updateNickname(e){
    this.data.userInfo.nickName = e.detail.value
  },
  // 修改签名
  updateSign(e){
    this.data.userInfo.sign = e.detail.value
  },
  // 修改性别
  sexChange(e) {
    this.$setData({
      'userInfo.isMale': this.data.sexArray[e.detail.value]
    })
  },
  // 修改生日
  birthdayChange(e) {
    this.$setData({
      'userInfo.birthday': e.detail.value
    })
  },
  // 修改简介
  descriptionChange(e){
    this.$setData({
      'userInfo.description':e.detail.value
    })
  },
  // 上传个人相册图片
  chooseImage() {
    wx.chooseImage({
      count: 9,
      success: (res) => {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          fetch.uploadFile(res.tempFilePaths[i]).then(uploadFileRes => {
            this.data.userInfo.personPhotos = this.data.userInfo.personPhotos || []
            this.data.userInfo.personPhotos.push(uploadFileRes)
            this.setData({
              'userInfo.personPhotos': this.data.userInfo.personPhotos
            })
          })
        }
      }
    })
  },
  // 删除照片
  deleteImage(e) {
    let imageUrl = e.currentTarget.dataset.url;
    let index = e.currentTarget.dataset.index;
    let fileArr = imageUrl.split('/');
    let fileKey = fileArr[fileArr.length - 1]
    this.delImages = this.delImages || []
    this.delImages.push(fileKey)
    this.data.userInfo.personPhotos.splice(index, 1)
    this.$setData({
      'userInfo.personPhotos':this.data.userInfo.personPhotos
    })
  },
  jumpSkills(){
    this.$route("/pages/UIC/pages/skills/skills")
  },
  // 保存修改
  save(){
    fetch.editPersonalData(this.data.userInfo).then( data => {
      if(data.success){
        app.setUserInfo()
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 1000)
        for (const v of this.delImages || []) {
          this.$get('/deletePicture/' + v)
        }
      }else{
        wx.showToast({
          title: data.message,
          icon:'none'
        })
      }
    })
  },
  // 跳转经历
  jumpExperience(e){
    const {type} = e.currentTarget.dataset
    this.$route('/pages/UIC/pages/experience/experience', {type})
  }
})