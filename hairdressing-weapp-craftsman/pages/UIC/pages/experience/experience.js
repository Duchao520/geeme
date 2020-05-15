// pages/UIC/pages/experience/experience.js
const myUtil = require('../../../../utils/myUtil.js')
const pageObj = [{
  title: '获奖经历',
  attr: 'awardsList'
}, {
  title: '从业经历',
  attr: 'workList'
}, {
  title: '学习经历',
  attr: 'educationList',
}]

const app = getApp()
Page({
  data: {
    type: 0,
    list: [{
      dateFrom: '',
      dateTo: '',
      expName: '',
    }],
  },
  onLoad(options) {
    // 初始化页面
    this.$setData({
      type: options.type,
      title: pageObj[options.type].title
    })
    this.attr = pageObj[options.type].attr
    wx.setNavigationBarTitle({
      title: pageObj[this.data.type].title,
    })
    // 获取个人信息
    app.getUserInfo(userInfo => {
      this.userInfo = userInfo
      let list = userInfo[this.attr]
      if (list) {
        list = myUtil.replaceKeys(list, {
          date:'dateFrom',
          awardName:'expName',
          workExperience:'expName',
          eduExperience:'expName',
        })
        this.$setData({
          list
        })
      }
    })
  },
  // 设置开始时间、获奖时间
  setDateFrom(e) {
    const {
      index
    } = e.currentTarget.dataset
    const attr = `list[${index}].dateFrom`
    this.$setData({
      [attr]: e.detail.value
    })
  },
  // 设置结束时间
  setDateTo(e) {
    const {
      index
    } = e.currentTarget.dataset
    const attr = `list[${index}].dateTo`
    this.$setData({
      [attr]: e.detail.value
    })
  },
  // 输入奖项名称、经历描述
  inputExpName(e) {
    const {
      index
    } = e.currentTarget.dataset
    const attr = `list[${index}].expName`
    this.$setData({
      [attr]: e.detail.value
    })
  },
  // 添加经历
  pushExp() {
    this.data.list.push({
      dateFrom: '',
      dateTo: '',
      expName: '',
    })
    this.$setData({
      list: this.data.list
    })
  },
  // 保存
  confirm() {
    const list = []
    let exp, errcode
    let _attr = this.data.type == 1 ? 'workExperience' : 'eduExperience'
    for (const v of this.data.list) {
      // 保存策略：当信息完全时添加该条经历，信息全空时舍弃该条，信息有但是不全时给出提示
      errcode = this.isExpRight(v)
      if (errcode == 1) {
        if (this.data.type == 0) {
          exp = {
            date: v.dateFrom,
            awardName: v.expName
          }
        }else{
          exp = {
            dateFrom: v.dateFrom,
            dateTo: v.dateTo,
            [_attr]:v.expName,
          }
        }
        list.push(exp)
      } else if (errcode == 0){
        continue;
      } else {
        return wx.$toast('请完善经历信息')
      }
    }
    this.userInfo[this.attr] = list
    this.$post('/editPersonalData', this.userInfo).then( data => {
      if(data.success){
        app.setUserInfo()
        wx.$toast('保存成功', 'success')
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 1000)
      }else{
        wx.$toast(data.message)
      }
    })
  },
  isExpRight(exp){
    let num = 0
    for (const k in exp) {
      if (exp[k]) {
        num++
      }
    }
    let max = this.data.type == 0 ? 2 : 3
    if (num == max) {
      return 1
    } else if (num == 0) {
      return 0
    } else {
      return -1
    }
  }
})