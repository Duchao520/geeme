const config = require('../config/index.js');
const util = require('util.js')
const myUtil = require('myUtil.js')

// 根据服务id，工位获取可选择的员工
module.exports.getWeStaffsCanDoService = function(serviceId, workStation){
  return new Promise( resolve => {
    const url = 'getWeStaffsCanDoService'
    new request().postrequest(url, {serviceId, workStation}).then( res => {
      resolve(res.data)
    })
  })
}

// 服务者端-服务者,员工列表及提成方案-开单用
module.exports.weGetSimpleStaffListForOrder = function (serviceInfoList){
  return new Promise( resolve => {
    const url = 'weGetSimpleStaffListForOrder'
    new request().postrequest(url, { serviceInfoList, storeId:wx.$getStorage('storeId')}).then( res => {
      resolve(res.data)
    })
  })
}

// 扫码开单时获取客户未结算的订单列表
module.exports.weGetUnservicedOrderList = function(brandCustomerId){
  return new Promise( resolve => {
    const url = 'weGetUnservicedOrderList'
    new request().postrequest(url, {brandCustomerId, storeId:wx.$getStorage('storeId')}).then( res => {
      resolve(res.data)
    })
  })
}

// 获取产品树
module.exports.getProductTree = function (brandCustomerId){
  return new Promise( resolve => {
    const url = 'customer/getProductTree'
    new request().postrequest(url, {storeId:wx.$getStorage('storeId'), brandCustomerId}).then( res => {
      const map = {
        productLevelOne:'id',
        productLevelOneName:'type',
        productList:'serviceList',
        memberPrice:'specialPrice',
        shopPrice:'packagePrice'
      }
      resolve(myUtil.replaceKeys(res.data, map))
    })
  })
}

// 获取服务树
module.exports.weGetServiceListByStoreIdAndStaffIds = function (brandCustomerId) {
  return new Promise(resolve => {
    const url = 'weGetServiceListByStoreIdAndStaffIds'
    const params = {
      shopId: wx.$getStorage('storeId'),
      staffId: wx.$getStorage('staffId'),
      brandCustomerId
    }
    new request().postrequest(url, params).then(res => {
      const map = {
        serviceName:'name',
        packageName:'name',
        serviceSnapshotId:'snapshotId'
      }
      resolve(myUtil.replaceKeys(res.data, map))
    })
  })
}


// 生成画报-员工信息
module.exports.weGetStaffInfoForShare = function(){
  return new Promise( resolve => {
    const url = 'weGetStaffInfoForShare'
    new request().get(url, wx.$getStorage('staffId')).then( res => {
      resolve(res.data)
    })
  })
}

// 生成小程序码
module.exports.commonQrCode = function (page, scene, overdue, brandId) {
  return new Promise(resolve => {
    const url = 'commonQrCode'
    const params = {
      page,
      scene,
      brandId
    }
    if (overdue) params.overdue = overdue
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 检查是否有符合并单的消费账单
module.exports.weStaffCheckUnionOrder = function(brandCustomerId){
  return new Promise(resolve => {
    const url = 'weStaffCheckUnionOrder'
    const params = {
      storeId:wx.$getStorage('storeId'),
      brandCustomerId
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 登录
module.exports.login = function(reqParams) {
  return new Promise(resolve => {
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    wx.login({
      success(res) {
        const url = 'weapp/staff/login'
        reqParams.code = res.code
        new request().postrequest(url, reqParams).then(res => {
          module.exports.getBrandAndStroeByUserId().then( data => {
            try{
              wx.hideLoading();
              let brandList = data.brandList
              // 若只有一家门店且为营业状态，则不进入选择门店页面
              if (brandList.length == 1 && brandList[0].storeList.length == 1 && (brandList[0].storeList[0].status == 'ONLINE' || brandList[0].storeList[0].status == 'TRYING')) {
                getApp().initStorage(brandList[0].storeList[0])
                wx.reLaunch({
                  url: '/pages/tabBar/Home/index/index'
                })
              } else {
                wx.$place('brandList', brandList)
                wx.reLaunch({
                  url: '/pages/Login/chooseBrandStore/chooseBrandStore'
                })
              }
            }catch(error){
              
            }
          })
          
        })
      }
    })
  })
}

// 验证码登录-获取验证码
module.exports.staffGetVerifyCode4Login = function(telephone) {
  return new Promise(resolve => {
    const url = 'staff/staffGetVerifyCode4Login'
    new request().postrequest(url, {
      telephone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 预约-获取预约时间日历
module.exports.weStaffAvailableAppointmentTime = function(date) {
  return new Promise(resolve => {
    const url = 'weStaffAvailableAppointmentTime'
    new request().postrequest(url, {
      staffId: wx.$getStorage('staffId'),
      currentDate: date
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 新增预约
module.exports.weStaffCreateAppointment = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weStaffCreateAppointment'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 添加客户前检索客户信息是否存在
module.exports.weCheckCustomerInfoByMobile = function(mobile) {
  return new Promise(resolve => {
    const url = 'weCheckCustomerInfoByMobile'
    const params = {
      mobile,
      brandId: wx.$getStorage('brandId'),
      storeId: wx.$getStorage('storeId')
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 添加客户
module.exports.weCreateRelatedCustomer = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weCreateRelatedCustomer'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 我的客户列表
module.exports.weGetRelatedCustomers = function(keyword) {
  return new Promise(resolve => {
    const url = 'weGetRelatedCustomers'
    const params = {
      keyword,
      staffId: wx.$getStorage('staffId')
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 创建消费账单
module.exports.weStaffCreateConsumerOrder = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weStaffCreateConsumerOrder'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取助理列表
module.exports.weStaffGetAssistantList = function() {
  return new Promise(resolve => {
    const url = 'weStaffGetAssistantList'
    const params = {
      storeId: wx.$getStorage('storeId')
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取客户信息
module.exports.weGetSimpleCustomerInfo = function(brandCustomerId) {
  return new Promise(resolve => {
    const url = 'weGetSimpleCustomerInfo'
    const params = {
      storeId: wx.$getStorage('storeId'),
      brandCustomerId
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 我的业绩-排行榜
module.exports.wePerformanceRankingResponse = function(performanceCycle, performanceType) {
  return new Promise(resolve => {
    const url = 'wePerformanceRankingResponse'
    const params = {
      brandId: wx.$getStorage('brandId'),
      storeId: wx.$getStorage('storeId'),
      performanceCycle,
      performanceType
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 我的业绩-薪资
module.exports.weMonthSalaryResponse = function(date) {
  return new Promise(resolve => {
    const url = 'weMonthSalaryResponse'
    const params = {
      date,
      staffId: wx.$getStorage('staffId'),
      storeId: wx.$getStorage('storeId')
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 我的业绩-月报
module.exports.weMonthPerformanceResponse = function(month) {
  return new Promise(resolve => {
    const url = 'weMonthPerformanceResponse'
    const params = {
      month,
      staffId: wx.$getStorage('staffId'),
      storeId: wx.$getStorage('storeId')
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 我的业绩-日报
module.exports.weGetStaffSalaryDetail = function(date) {
  return new Promise(resolve => {
    const url = 'weGetStaffSalaryDetail'
    const params = {
      date,
      staffId: wx.$getStorage('staffId'),
      storeId: wx.$getStorage('storeId')
    }
    new request().postrequest(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 预约详情
module.exports.staffGetAppointmentInfoById = function(id) {
  return new Promise(resolve => {
    const url = 'staffGetAppointmentInfoById'
    new request().get(url, id).then(res => {
      resolve(res.data)
    })
  })
}

// 发布关联服务单的作品动态
module.exports.createConsumerOrderStaffDynamicWorks = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createConsumerOrderStaffDynamicWorks'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 通过id查询服务单详情
module.exports.esStaffConsumerOrderDetail = function(id) {
  return new Promise(resolve => {
    const url = 'esStaffConsumerOrderDetail'
    new request().postrequest(url, {
      id
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 我的-粉丝
module.exports.staffGetMyFans = function(reqParams) {
  return new Promise(resolve => {
    const url = 'staffGetMyFans'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 我的-关注
module.exports.StaffGetMyAttentive = function(reqParams) {
  return new Promise(resolve => {
    const url = 'StaffGetMyAttentive'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取收藏动态
module.exports.getStaffCollectSimpleDynamic = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getStaffCollectSimpleDynamic'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 根据评价id获取评价详情
module.exports.weStaffGetGoodsOrderAssessmentById = function(id) {
  return new Promise(resolve => {
    const url = 'weStaffGetGoodsOrderAssessmentById'
    new request().get(url, id).then(res => {
      resolve(res.data)
    })
  })
}

// 工作-我的预约-添加/取消占用
module.exports.handleAppointmentOccupation = function(reqParams) {
  return new Promise(resolve => {
    const url = 'handleAppointmentOccupation'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 工作-我的预约
module.exports.getMineAppointment = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getMineAppointment'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 修改员工擅长
module.exports.updateStaffSkill = function(reqParams) {
  return new Promise(resolve => {
    const url = 'updateStaffSkill'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取员工擅长
module.exports.getStaffSkill = function() {
  return new Promise(resolve => {
    const url = 'getStaffSkill'
    new request().get(url).then(res => {
      resolve(res.data)
    })
  })
}

// 发布动态作品
module.exports.createStaffDynamicWorksInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createStaffDynamicWorksInfo'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取我的服务单列表
module.exports.esStaffConsumerOrder = function(reqParams) {
  return new Promise(resolve => {
    const url = 'esStaffConsumerOrder'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取预约码
module.exports.getAppointmentQrCode = function() {
  return new Promise(resolve => {
    const url = 'getAppointmentQrCode'
    const reqParams = {
      staffId: wx.$getStorage('staffId'),
      brandId: wx.$getStorage('brandId'),
      storeId: wx.$getStorage('storeId')
    }
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 修改密码
module.exports.staffModifyPwd = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/staffModifyPwd'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取修改密码验证码
module.exports.staffGetVerifyCode4ModifyPwd = function(phone) {
  return new Promise(resolve => {
    const url = 'customer/staffGetVerifyCode4ModifyPwd'
    new request().postrequest(url, {
      telephone: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 修改绑定手机号
module.exports.staffUpdateMobile = function(reqParams) {
  return new Promise(resolve => {
    const url = 'staffUpdateMobile'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取新手机号验证码
module.exports.staffGetUpdateMobileVerifyCode = function(phone) {
  return new Promise(resolve => {
    const url = 'staffGetUpdateMobileVerifyCode'
    new request().postrequest(url, {
      telephone: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 校验验证码——用于点击下一步
module.exports.staffGetVerifyCodeResult = function(reqParams) {
  return new Promise(resolve => {
    const url = 'staffGetVerifyCodeResult'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取原绑定手机号验证码
module.exports.staffGetOldMobileVerifyCode = function(phone) {
  return new Promise(resolve => {
    const url = 'staffGetOldMobileVerifyCode'
    new request().postrequest(url, {
      telephone: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 根据门店id获取品牌信息
module.exports.getBrandInfoByStoreId = function() {
  return new Promise(resolve => {
    const url = 'getBrandInfoByStoreId'
    new request().get(url, wx.$getStorage('storeId')).then(res => {
      resolve(res.data)
    })
  })
}

// 查询门店所有项目
module.exports.getAllSkillByStoreId = function() {
  return new Promise(resolve => {
    const url = 'getAllSkillByStoreId'
    new request().get(url, wx.$getStorage('storeId')).then(res => {
      resolve(res.data)
    })
  })
}

// 编辑个人资料
module.exports.editPersonalData = function(reqParams) {
  return new Promise(resolve => {
    const url = 'editPersonalData'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 个人资料
module.exports.personalData4Edit = function() {
  return new Promise(resolve => {
    const url = 'personalData4Edit'
    new request().get(url).then(res => {
      resolve(res.data)
    })
  })
}

// 我的-员工信息
module.exports.staffInfo4Server = function() {
  return new Promise(resolve => {
    const url = 'staffInfo4Server'
    new request().get(url).then(res => {
      resolve(res.data)
    })
  })
}

// 我的评价-评价列表
module.exports.getMyAssessmentList = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getMyAssessmentList'
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 我的评价-标签统计
module.exports.getMyAssessmentTagCount = function() {
  return new Promise(resolve => {
    const url = 'getMyAssessmentTagCount'
    new request().postrequest(url).then(res => {
      resolve(res.data)
    })
  })
}

// 发现-搜索动态
module.exports.weStaffSearchDynamics = function(reqParams) {
  const url = 'customer/weStaffSearchDynamics'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      const list = res.data.simpleStaffDynamicWork
      if (list) {
        for (const i of list) {
          i.weStaffSimpleUserInfo = {
            id: i.userId,
            headPortrait: i.headPortrait,
            nickName: i.name
          }
        }
      }
      resolve(res.data)
    })
  })
}

// V1.0没有封面
// 更换我的作品 封面
module.exports.updateMyWorksCover = function(imageUrl) {
  const url = 'updateMyWorksCover'
  return new Promise(resolve => {
    new request().postrequest(url, {
      imageUrl
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取我的作品 封面
module.exports.getMyWorksCover = function() {
  const url = 'getMyWorksCover'
  return new Promise(resolve => {
    new request().get(url).then(res => {
      resolve(res.data)
    })
  })
}

// 获取我的作品
module.exports.getMyWorks = function(reqParams) {
  const url = 'getMyWorks'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：根据动态id获取回复列表
module.exports.weStaffDynamicCommentListByDynamicId = function(reqParams) {
  const url = 'weStaffDynamicCommentListByDynamicId'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      const list = res.data.staffDynamicWorkCommentList
      for (const v of list) {
        v._createTime = v.createTime.split('T')[0]
      }
      resolve(res.data)
    })
  })
}

//动态详情：发布评论
module.exports.weStaffPublishDynamicComment = function(reqParams) {
  const url = 'weStaffPublishDynamicComment'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：分享
module.exports.weStaffDynamicShare = function(worksId) {
  const url = 'weStaffDynamicShare'
  return new Promise(resolve => {
    new request().postrequest(url, {
      worksId
    }).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：点赞/取消点赞
module.exports.weStaffDynamicThumbUp = function(reqParams) {
  const url = 'weStaffDynamicThumbUp'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：收藏/取消收藏
module.exports.weStaffDynamicCollect = function(reqParams) {
  const url = 'weStaffDynamicCollect'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：关注
module.exports.weStaffDynamicAttentive = function(reqParams) {
  const url = 'weStaffDynamicAttentive'
  return new Promise(resolve => {
    new request().postrequest(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 选择门店时获取门店信息与个人资料	
module.exports.getInfoByStoreId = function() {
  const url = 'getInfoByStoreId'
  return new Promise(resolve => {
    new request().get(url, wx.$getStorage('storeId')).then(res => {
      resolve(res.data)
    })
  })
}

// 获取品牌和门店列表
module.exports.getBrandAndStroeByUserId = function() {
  const url = 'getBrandAndStroeByUserId'
  return new Promise(resolve => {
    new request().get(url).then(res => {
      resolve(res.data)
    })
  })
}

// 根据id获取动态详情
module.exports.getStaffDynamicDetailById = function(id) {
  const url = 'getStaffDynamicDetailById'
  return new Promise(resolve => {
    new request().get(url, id).then(res => {
      let data = res.data
      data.createTime = data.createTime.split('T')[0]
      data.currentImage = 0
      data.addComment = ''
      // 获取第一张轮播图尺寸，若长大于宽swiper容器为750rpx*750rpx，否则750rpx*1000rpx
      wx.getImageInfo({
        src: util.getImageUrl(data.photos[0]),
        success: res => {
          data._mainPhoto = res
          data._needBigSwiper = res.width < res.height
        },
        complete: () => {
          resolve(data)
        }
      })
    })
  })
}

// 获取封面动态
module.exports.getStaffCoverSimpleDynamic = function(currentPage, pageSize) {
  const url = 'getStaffCoverSimpleDynamic'
  return new Promise(resolve => {
    new request().postrequest(url, {
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取本店动态
module.exports.getStaffMyShopSimpleDynamic = function(currentPage, pageSize) {
  const url = 'getStaffMyShopSimpleDynamic'
  return new Promise(resolve => {
    new request().postrequest(url, {
      storeId: wx.$getStorage('storeId'),
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取关注动态
module.exports.getStaffAttentiveSimpleDynamic = function(currentPage, pageSize) {
  const url = 'getStaffAttentiveSimpleDynamic'
  return new Promise(resolve => {
    new request().postrequest(url, {
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取热门动态
module.exports.getStaffHotSimpleDynamic = function(currentPage, pageSize) {
  const url = 'customer/getStaffHotSimpleDynamic'
  return new Promise(resolve => {
    new request().postrequest(url, {
      brandId: wx.$getStorage('brandId'),
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}


/**
 * 获取客户备注详情记录
 */
module.exports.getListByStoreCustomerId = function(json) {
  const url = 'getListByStoreCustomerId'
  return new Promise((resolve,reject) => {
    new request().postrequest(url, json).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/** 
 * 客户备注详情记录保存
 * */
module.exports.saveStoreCustomerRemark = function (json) {
  const url = 'saveStoreCustomerRemark'
  return new Promise((resolve, reject) => {
    new request().postrequest(url, json).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/** 
 * staff根据id删除动态详情
 * */
module.exports.weDeleteDynamicWorkById = function (json) {
  const url = 'weDeleteDynamicWorkById'
  return new Promise((resolve, reject) => {
    new request().postrequest(url, json).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 上传图片请求函数
 */
module.exports.uploadFile = function(imagePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: config.ApiUrl + 'uploadPicture/',
      filePath: imagePath,
      header: {
        authorization: wx.getStorageSync('authorization')
      },
      name: 'file',
      formData: {
        'Content-Type': 'image/*'
      },
      success: res => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data).fileKey)
        } else {
          wx.showToast({
            title: '上传失败:请换张图试试',
            icon: 'none'
          })
        }
      }
    })
  })
}

/**
 * Api请求函数
 */
const request = function() {
  this.header = {};
  this.getrequest = (url, data, header = this.header) => {
    return this.requestall(url, data, header, 'GET')
  }
  this.putrequest = (url, data, header = this.header) => {
    return this.requestall(url, data, header, 'PUT')
  }
  this.postrequest = (url, data, header = this.header) => {
    return this.requestall(url, data, header, 'POST')
  }
  this.deleterequest = (url, data, header = this.header) => {
    return this.requestall(url, data, header, 'DELETE')
  }
  this.fail = res => {
    wx.hideLoading()
    if (res.statusCode == 401) {
      wx.showToast({
        title: '手机号或密码错误',
        icon: 'none'
      })
    } else if (res.statusCode == 500) {
      wx.showToast({
        title: '服务器出错啦，请切换页面试试...',
        icon: 'none'
      })
    } else if (res.statusCode == 404) {
      // wx.showToast({
      //   title: '页面未找到',
      //   icon: 'none'
      // })
    } else if (res.statusCode == 400) {
      wx.showToast({
        title: '请求错误',
        icon: 'none'
      })
    }
  }
  this.requestall = (url, data, header, method) => {
    wx.showNavigationBarLoading();
    data = data || {}
    header = header || {}
    if (wx.$getStorage('authorization')) {
      header.authorization = wx.$getStorage('authorization')
    }
    url = config.ApiUrl + url;
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        success: (res) => {
          wx.hideNavigationBarLoading();
          if (res.header.Authorization) {
            wx.$setStorage('authorization', res.header.Authorization)
          }
          if (res.statusCode == 200) {
            resolve(res)
          } else {
            this.fail(res)
            reject(res)
          }
        },
        fail: (res) => {
          wx.hideNavigationBarLoading();
        }
      })
    })
  }

  this.get = (url, id, header) => {
    wx.showNavigationBarLoading()
    url = config.ApiUrl + url
    if (id) url = url + '/' + id
    header = header || {}
    if (wx.$getStorage('authorization')) {
      header.authorization = wx.$getStorage('authorization')
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        header: header,
        method: 'GET',
        success: (res) => {
          wx.hideNavigationBarLoading()
          if (res.header.authorization || res.header.Authorization) {
            wx.setStorageSync('authorization', res.header.authorization || res.header.Authorization)
          }
          if (res.statusCode == 200) {
            resolve(res)
          } else {
            reject(res.statusCode)
            this.fail(res)
          }
        },
        fail: (res) => {
          wx.hideNavigationBarLoading();
        }
      })
    })
  }
}
module.exports.request = request