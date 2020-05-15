const util = require('util.js')

/**
 * 异常处理函数
 */
const fail = function(statuscode, wxRequestParams) {
  if (statuscode == 500) {
    wx.showToast({
      title: '服务器内部错误，请切换页面试试',
      icon: 'none'
    })
  } else {
    wx.showToast({
      title: '请求错误',
      icon: 'none'
    })
  }
}

/**
 * 请求函数（需要token）
 */
const Request = function() {
  this.get = (url, data, header, showToast) => {
    return this.requestall(url, data, header, 'GET', showToast)
  }
  this.put = (url, data, header, showToast) => {
    return this.requestall(url, data, header, 'PUT', showToast)
  }
  this.post = (url, data, header,showToast) => {
    return this.requestall(url, data, header, 'POST', showToast)
  }
  this.delete = (url, data, header, showToast) => {
    return this.requestall(url, data, header, 'DELETE', showToast)
  }
  this.fail = (res) => {
    return res.data
  }
  this.requestall = (url, data, header, method, showToast = true) => {
    return new Promise((resolve, reject) => {
      // 处理data
      if (method === 'GET') {
        url = data ? url + '/' + data : url
      } else {
        data = data || {}
        data.appId = data.appId || util.appId
      }

      // 处理url
      let _url = url
      if(url.indexOf('https') == -1){
        url = util.url + url
      }

      function request() {
        // 如果有authorization且不是登录接口
        if (wx.$getStorage('authorization') && !url.endsWith('login')) {
          header = header || {}
          header.authorization = wx.$getStorage('authorization')
        }
        wx.showNavigationBarLoading()
        wx.request({
          url,
          data,
          header,
          method,
          success(res) {
            if (res.header.Authorization) {
              wx.$setStorage('authorization', res.header.Authorization)
            }
            if (res.statusCode == 200) {
              if (!res.data.success && showToast){
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
              resolve(res)
            } else if (res.statusCode == 401 || res.statusCode == 403) {
              // 登录后带着authorization再次请求原接口
              if (url.endsWith('login')) {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
                return
              } else if (wx.$getCurPageName() !== 'getAuthority') {
                wx.$event.once('login', request)
                wx.navigateTo({
                  url: `/pages/UIC/pages/getAuthority/getAuthority`
                })
              }
              reject('fail')
            } else {
              fail(res.statusCode)
              reject(res)
            }
          },
          complete() {
            wx.hideNavigationBarLoading()
          }
        })
      }
      request()
    })
  }
}
const request = new Request()

/**
 * 登录
 * @userInfo {Object} - 通过open-type为getUserInfo的<button>拿到的用户信息
 */
module.exports.login = function(userInfo) {
  return new Promise((resolve,reject) => {
    wx.login({
      success(res) {
        userInfo.weappCode = res.code
        // return
        const url = 'weapp/login'
        const sellerId = wx.$getStorage('sellerId');
        userInfo.sellerId = sellerId ? sellerId : '';
        request.post(url, userInfo).then(res => {
          wx.$setStorage('userInfo', userInfo)
          resolve(res.data)
          wx.$setStorage('authorization', res.header.Authorization)
          wx.$event.emit('login')
        }).catch(error => {
          reject({error})
        })
      }
    })
  })
}

// 获取用户绑定手机号
module.exports.getCurrentUserMobile = function() {
  return new Promise(resolve => {
    const url = 'getCurrentUserMobile'
    request.post(url).then(res => {
      // 若还没绑定手机号，跳转到绑定手机号页面
      if (!res.data.mobile) {
        wx.$event.once('bindphone', (mobile) => {
          resolve({
            mobile
          })
        })
        const name = wx.$getCurPageName()
        wx.navigateTo({
          url: `/pages/UIC/pages/bindphone/bindphone?from=${name}`,
        })
      } else {
        resolve(res.data)
      }
    })
  })
}

// 判断用户是否绑定手机号
module.exports.hasPhone = function(){
  return new Promise(resolve => {
    const url = 'getCurrentUserMobile'
    request.post(url).then( res => {
      resolve(!!res.data.mobile)
    })
  })
}

/**
 * 提交预约操作(验证用户是否绑定了手机号)
 * data:storeId(门店Id) staffId(员工Id) specificationId(规格Id) dueTime(到店时间) amount(预付金额) notes(备注)
 */
module.exports.submitAppointment = function(appointmentData, callback) {
  // 判断客户是否已绑定手机号
  getApp().getPhone(() => {
    module.exports.weCreateAppointment(appointmentData).then(data => {
      //此处需要保留预约id
      if (!data.success) {
        wx.showToast({
          title: data.message,
          icon: 'none',
        })
        callback && callback();
      } else {
        wx.removeStorageSync('appointment')
        getApp().globalData.fromOrderAppointment.orderId = 0
        wx.setStorageSync('appointmentId', data.id)
        wx.reLaunch({
          url: '/pages/TC/pages/appointmentsuccess/appointmentsuccess'
        })
      }
    })
  })
}

// 获取产品列表
module.exports.weGetProductListByCondition = function(reqParams) {
  const url = 'customer/weGetProductListByCondition'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 我的：获取用户最近一次的预约
module.exports.weGetClosestAppointment = function() {
  return new Promise(resolve => {
    const url = 'weGetClosestAppointment'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 我的：获取用户的账号和积分
module.exports.getCustomerInfo = function() {
  return new Promise(resolve => {
    const url = 'getCustomerInfo'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 美购：根据店铺id获取门店服务列表
module.exports.getServiceListWithSortOneByStoreId = function(storeId) {
  const url = 'customer/getServiceListWithSortOneByStoreId'
  return new Promise(resolve => {
    request.post(url, {
      shopId: storeId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 预约：请求发型师列表
module.exports.weListAvailableStaffByStoreId = function(reqParams) {
  const url = 'customer/weListAvailableStaffByStoreId'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      res.data.staffInfoForAppointments.sort((v1, v2) => {
        return v2.works.length - v1.works.length
      })
      resolve(res.data)
    })
  })
}

// 预约：请求推荐发型师信息
module.exports.getRecommendHairdresserList = function(reqParams) {
  const url = 'customer/getRecommendHairdresserList'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 预约：本地确定shopId
module.exports.getShopInfo = function(shopId) {
  const url = 'customer/getShopInfo'
  return new Promise(resolve => {
    request.post(url, {
      shopId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 首页：请求推荐美店
module.exports.getRecommendStoreList = function() {
  return new Promise(resolve => {
    const city = wx.$getStorage('address') ? wx.$getStorage('address').city : null
    const url = 'customer/getRecommendStoreList'
    request.post(url, {
      cityName: city
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 首页：请求品牌信息
module.exports.getBrandInfo = function() {
  const url = 'customer/getBrandInfo'
  return new Promise(resolve => {
    request.post(url).then(res => {
      res.data.logo = util.imageUrl + res.data.logo
      resolve(res.data)
    })
  })
}

// 请求预约列表
module.exports.weListAppointmentByStatus = function(reqParams) {
  const url = 'weListAppointmentByStatus'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取个人资料
module.exports.getPersonalInfo = function(storeId) {
  return new Promise(resolve => {
    const url = 'getPersonalInfo'
    request.put(url, {
      storeId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 修改个人信息
module.exports.modifyPersonalInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'modifyPersonalInfo'
    request.put(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：根据动态id获取回复列表
module.exports.weDynamicCommentListByDynamicId = function(reqParams) {
  const url = 'weDynamicCommentListByDynamicId'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      const list = res.data.staffDynamicWorkCommentList
      for (const v of list) {
        v._createTime = v.createTime.split('T')[0]
      }
      resolve(res.data)
    })
  })
}

//动态详情：发布评论
module.exports.wePublishDynamicComment = function(reqParams) {
  const url = 'wePublishDynamicComment'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：分享
module.exports.weDynamicShare = function(worksId) {
  const url = 'weDynamicShare'
  return new Promise(resolve => {
    request.post(url, {
      worksId
    }).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：点赞/取消点赞
module.exports.weDynamicThumbUp = function(reqParams) {
  const url = 'weDynamicThumbUp'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：收藏/取消收藏
module.exports.weDynamicCollect = function(reqParams) {
  const url = 'weDynamicCollect'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

//动态详情：关注
module.exports.weDynamicAttentive = function(reqParams) {
  const url = 'weDynamicAttentive'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}
//获取动态详情
module.exports.getDynamicDetailById = function(id) {
  const url = 'weGetDynamicDetailById'
  return new Promise(resolve => {
    request.get(url, id).then(res => {
      let data = res.data
      data.createTime = data.createTime.split('T')[0]
      data.currentImage = 0
      data.addComment = ''
      data._productList = [...data.serviceInfoForDynamicList || [], ...data.productInfoForDynamicList || []]
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

// 获取关注动态
module.exports.getAttentiveSimpleDynamic = function(currentPage, pageSize) {
  const url = 'getAttentiveSimpleDynamic'
  return new Promise(resolve => {
    request.post(url, {
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取热门动态
module.exports.getHotSimpleDynamic = function(currentPage, pageSize,storeId = "") {
  const url = 'customer/getHotSimpleDynamic'
  return new Promise(resolve => {
    request.post(url, {
      currentPage,
      pageSize,
      storeId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取封面动态
module.exports.getCoverSimpleDynamic = function(currentPage, pageSize) {
  const url = 'customer/getCoverSimpleDynamic'
  return new Promise(resolve => {
    request.post(url, {
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取动态
module.exports.getSimpleDynamic = function (data) {
  const url = 'customer/getSimpleDynamic'
  return new Promise(resolve => {
    request.post(url, data).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 获取订单各种剩余时间
 * @param orderId:订单Id
 * @param productType: service-服务 goods-产品
 * @param orderStatus: 订单状态
 */
module.exports.getRemainTime = function(orderId, productType, orderStatus) {
  return new Promise(resolve => {
    let url, key
    if (productType == 'goods') {
      url = 'getProductPayRemainTime'
      key = 'productOrderId'
    } else {
      url = 'getServiceOrderRemainTime'
      key = 'orderId'
    }

    let type
    switch (orderStatus) {
      case 'WAITING_PAY':
        type = 0;
        break;
      case 'WAITING_CONFIRM':
        type = 1;
        break;
      case 'GROUP_BUY_WAIT':
        type = 2
        break;
      default:
        return
    }
    request.post(url, {
      [key]: orderId,
      type
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取产品订单详情
module.exports.getProductOrderBasicInfoByOrderId = function(orderId) {
  let url = 'getProductOrderBasicInfoByOrderId/' + orderId
  let info;
  return new Promise(resolve => {
    request.post(url, {}).then(res => {
      info = res.data
      info.image = util.imageUrl + info.cycleImage[0]
      info.createTime = util.timeFormatT(info.createTime);
      info.paymentTime = util.timeFormatT(info.paymentTime);
      resolve(info)
    })
  })
}

// 获取产品订单列表
module.exports.getProductOrderList = function(reqParams) {
  const url = 'getProductOrderList'
  return new Promise(resolve => {
    request.post(url, reqParams).then(res => {
      let orderList = res.data.productOrderInfoList;
      for (let i = 0; i < orderList.length; i++) {
        orderList[i].image = util.imageUrl + orderList[i].cycleImage[0]
        orderList[i].modifyTime = util.timeFormatT(orderList[i].modifyTime)
      }
      resolve(res.data)
    })
  })
}

/**
 * 获取退款原因集合
 * ${refundReasonType}: 付款前:PRODUCT_BEFORE_RECEIVE,  付款后:PRODUCT_AFTER_RECEIVE
 */
module.exports.getRefundReasonByType = function(refundReasonType) {
  let url = 'getRefundReasonByType'
  return new Promise(resolve => {
    request.post(url, {
      refundReasonType
    }).then(res => {
      resolve(res.data.reasonList)
    })
  })
}

/**
 * 图片上传服务
 */
module.exports.uploadPicture = function(image) {
  return new Promise(resolve => {
    wx.uploadFile({
      url: util.url + 'uploadPicture',
      filePath: image,
      name: 'file',
      header: {
        authorization: wx.$getStorage('authorization')
      },
      formData: {
        'Content-Type': 'image/*'
      },
      success: res => {
        const data = JSON.parse(res.data)
        resolve(data.fileKey)
      }
    })
  })
}

/**
 * 创建退款订单
 */
module.exports.createProductRefundOrder = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createProductRefundOrder'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 创建售后订单
 */
module.exports.createProductAfterSaleOrder = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createProductAfterSaleOrder'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 获取退款/售后订单列表
 */
module.exports.getProductRefundOrderList = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getProductRefundOrderList'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 取消退款/售后订单
 */
module.exports.cancelRefundOrder = function(refundOrderId) {
  return new Promise(resolve => {
    const url = 'cancelRefundOrder';
    request.get(url, refundOrderId).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 获取退款详情
 */
module.exports.getRefundOrderDetail = function(refundOrderId) {
  return new Promise(resolve => {
    const url = 'getRefundOrderDetail'
    request.get(url, refundOrderId).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 退款/售后补充留言
 */
module.exports.refundOrderMessage = function(reqParams) {
  return new Promise(resolve => {
    const url = 'refundOrderMessage'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 点击[修改申请]按钮获取订单基本信息
 */
module.exports.getChangeRefundOrderBasicInfo = function(refundOrderId) {
  return new Promise(resolve => {
    const url = 'getChangeRefundOrderBasicInfo'
    request.get(url, refundOrderId).then(res => {
      let data = res.data
      data.image = util.imageUrl + data.cycleImage[0]
      resolve(data)
    })
  })
}

/**
 * 修改退款单信息
 */
module.exports.changeRefundOrderInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'changeRefundOrderInfo'
    request.put(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 修改售后单信息
 */
module.exports.changeAfterSaleOrderInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'changeAfterSaleOrderInfo'
    request.put(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

/**
 * 根据产品订单ID获取快照信息
 */
module.exports.getProductSnapshotInfoByOrderId = function(orderId) {
  return new Promise(resolve => {
    const url = 'customer/getProductSnapshotInfoByOrderId'
    request.get(url, orderId).then(res => {
      let info = res.data.weProductSnapshotInfo;
      info.image = util.imageUrl + info.cycleImage[0]
      info.time = util.timeFormatToCN(info.updateTime)
      resolve(res.data)
    })
  })
}

// 获取某家店的服务
module.exports.getServiceList = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/getServiceList'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 请求一级分类
module.exports.getServiceSortLevelOne = function(shopId) {
  return new Promise(resolve => {
    const url = 'customer/getServiceSortLevelOne'
    request.post(url, {
      shopId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 请求二级分类
module.exports.getServiceSortLevelTwo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/getServiceSortLevelTwo'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 搜索动态
module.exports.weCustomerSearchDynamics = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/weCustomerSearchDynamics'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 取消预约
module.exports.weCancelAppoint = function(appointmentId, formId) {
  return new Promise(resolve => {
    const url = 'weCancelAppoint'
    request.post(url, {
      id: appointmentId,
      form_id:formId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 删除预约
module.exports.weDeleteAppointment = function(appointmentId) {
  return new Promise(resolve => {
    const url = 'weDeleteAppointment'
    request.post(url, {
      id: appointmentId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 通过规格id请求规格的数据 ids:Array
module.exports.getServiceInfoBySpecificationIdList = function(ids) {
  return new Promise(resolve => {
    const url = 'customer/getServiceInfoBySpecificationIdList'
    request.post(url, {
      ids
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 通过预约Id请求规格数据
module.exports.weGetAppointmentInfoById = function(appointmentId) {
  return new Promise(resolve => {
    const url = 'weGetAppointmentInfoById'
    request.post(url, {
      id: appointmentId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 根据门店ID获取可预约时间段列表(先选时间)
module.exports.weListAvailableAppointmentTimeByStoreId = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/weListAvailableAppointmentTimeByStoreId'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 根据时间查询服务者
module.exports.weListAvailableStaffByAppointTime = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/weListAvailableStaffByAppointTime'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 根据staffId获取单个员工信息
module.exports.getWeStaffDetail = function(staffId) {
  return new Promise(resolve => {
    const url = 'customer/getWeStaffDetail'
    request.post(url, {
      staffId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 根据服务者id单个服务者的可选服务列表
// ${staffIds} -- Array -- staffId的数组
module.exports.getServiceTree = function(staffIds, shopId) {
  return new Promise(resolve => {
    const url = 'customer/getServiceTree'
    const params = {
      hairIdList: staffIds,
      shopId
    }
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 创建或修改预约单
module.exports.weCreateAppointment = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weCreateAppointment'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 查询消费账单列表
module.exports.weEsCustomerConsumerOrder = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weEsCustomerConsumerOrder'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 通过id查询消费账单详情
module.exports.weGetConsumerOrderById = function(id) {
  return new Promise(resolve => {
    const url = 'weGetConsumerOrderById'
    request.post(url, {
      id
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 请求品牌的城市列表
module.exports.getShopCityList = function() {
  return new Promise(resolve => {
    const url = 'customer/getShopCityList'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 获取城市中按区划分的城市列表
module.exports.getSimpleShopList = function(city) {
  return new Promise(resolve => {
    const url = 'customer/getSimpleShopList'
    request.post(url, {
      shopCity: city
    }).then(res => {
      let amount = 0
      // 给一级与二级列表增加_onlineCount字段，便于其他逻辑处理
      for (const i of res.data.oldDataList) {
        for (const j of i.areaList) {
          for (const k of j.shopList) {
            if(k.operate){
              j._onlineCount = j._onlineCount || 0
              j._onlineCount++
              i._onlineCount = i._onlineCount || 0
              i._onlineCount++
            }
          }
        }
        amount += i._onlineCount
      }
      res.data._onlineAmount = amount
      resolve(res.data)
    })
  })
}

// 根据经纬度获取定位城市信息
module.exports.getPosition = function() {
  return new Promise((resolve,reject) => {
    wx.getLocation({
      success(res) {
        const {
          longitude,
          latitude
        } = res
        const location = `${longitude}, ${latitude}`
        const url = 'customer/getPosition'
        request.post(url, {
          location
        }).then(res => {
          const addressComponent = res.data.regeocode.addressComponent
          let city
          if (addressComponent.city && typeof(addressComponent.city) === 'string') {
            city = addressComponent.city
          } else {
            // 若是直辖市,city字段为空,得赋值为province
            if (['北京市', '上海市', '重庆市', '天津市'].includes(addressComponent.province)) {
              city = addressComponent.province
            } else {
              city = null
            }
          }
          const address = {
            longitude,
            latitude,
            city,
            area: addressComponent.district
          }
          wx.$setStorage('address', address)
          resolve(address)
        })
      },
      fail() {
        reject('cancel')
        wx.navigateTo({
          url: '/pages/UIC/pages/getaddress/getaddress',
        })
      }
    })
  })
}

// 请求产品详情
module.exports.getSimpleProductInfo = function(productId) {
  return new Promise(resolve => {
    const url = 'customer/getSimpleProductInfo'
    request.post(url, {
      productId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 请求服务详情
module.exports.getServiceInfo = function(serviceId) {
  return new Promise(resolve => {
    const url = 'customer/getServiceInfo'
    request.post(url, {
      id: serviceId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 商品详情页面-请求评价列表
module.exports.getAssessment4GoodsDetail = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weGetAssessment4GoodsDetail'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 商品详情页面-请求评价列表标签统计
module.exports.getAssessmentTagCount4GoodsDetail = function(goodsId, goodsType) {
  return new Promise(resolve => {
    const url = 'weGetAssessmentTagCount4GoodsDetail'
    request.post(url, {
      goodsId,
      goodsType
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 根据评价id请求评价详情
module.exports.weGetGoodsOrderAssessmentById = function(assessmentId) {
  return new Promise(resolve => {
    const url = 'weGetGoodsOrderAssessmentById'
    request.get(url, assessmentId).then(res => {
      resolve(res.data)
    })
  })
}

// 获取结算选择信息
module.exports.getBillingInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getBillingInfo'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 创建结算单——产品
module.exports.createProductBill = function(reqParams) {
  return new Promise((resolve,reject) => {
    const url = 'createProductBill'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error);
    })
  })
}

// 创建结算单——服务
module.exports.createServiceBill = function(reqParams) {
  return new Promise((resolve,reject) => {
    const url = 'createServiceBill'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 创建结算单——会员卡
module.exports.createCardBill = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createCardBill'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 创建结算单——会员卡充值
module.exports.createCardRenewalBill = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createCardRenewalBill'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 创建结算单——多项目订单
module.exports.weappCreateTotalBill = function(reqParams) {
  return new Promise((resolve,reject) => {
    const url = 'weappCreateTotalBill'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

function apiWxPay(params,resolve,reject){
  const {
    timeStamp,
    nonceStr,
    prepayId,
    signType,
    paySign
  } = params.data;
  let _package = 'prepay_id=' + prepayId
  wx.requestPayment({
    nonceStr,
    package: _package,
    paySign,
    signType,
    timeStamp,
    success: res => {
      setTimeout(() => {
        resolve(res)
      },200)
    },
    fail: error => {
      setTimeout(() => {
        reject(error)
      },200)
    }
  })
}

function requestPayment(billRes, cancelParams) {
  const {
    timeStamp,
    nonceStr,
    prepayId,
    signType,
    paySign
  } = billRes.data
  // package不能做变量名！！！！
  let _package = 'prepay_id=' + prepayId
  console.log(getApp().globalData)
  wx.requestPayment({
    nonceStr,
    package: _package,
    paySign,
    signType,
    timeStamp,
    success: res => {
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/TC/pages/paySuccess/paySuccess'
        })
      },200)
    },
    fail: res => {
      wx.$showLoading()
      const url = 'billingCancel'
      request.post(url, cancelParams).then(res => {
        wx.$hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: '支付取消',
          })
        }
      })
    }
  })
}

// 用billId结算
module.exports.billing = function(billId) {
  return new Promise((resolve, reject) => {
    const url = 'billing'
    request.post(url, {
      billId
    }).then(res => {
      if (res.data.success) {
        requestPayment(res, {
          billId
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

// 用billNo结算
module.exports.billingByBillNo = function(billNo) {
  return new Promise((resolve,reject) => {
    const url = 'billingByBillNo'
      request.post(url, {
        billNo
      }).then(res => {
        if (res.data.success) {
          requestPayment(res, {
            billNo
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
}

// 根据门店名称模糊搜索品牌下的门店列表
module.exports.searchStoreListByStoreLikeName = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/searchStoreListByStoreLikeName'
    request.post(url, reqParams).then(res => {
      res.data.shopInfoList = res.data.shopInfoList.map(v => {
        v.images = v.images.map(v => {
          v = util.imageUrl + v
          return v
        })
        v.shopImg = util.imageUrl + v.shopImg
        return v
      })
      resolve(res.data)
    })
  })
}

// 根据storeId和一级分类id获取服务列表
module.exports.getServiceListByStoreIdAndSortInfo = function(sortOneId, sortTwoId) {
  return new Promise(resolve => {
    const url = 'customer/getServiceListByStoreIdAndSortInfo'
    request.post(url, {
      storeId: wx.$getStorage('storeId'),
      sortOne: sortOneId || null,
      sortTwo: sortTwoId || null,
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 充值有礼-查询页面全部卡项信息
module.exports.weappPagedQueryStoreAllCardKindBasicInfo = function(keyword) {
  return new Promise(resolve => {
    const url = 'weappPagedQueryStoreAllCardKindBasicInfo'
    const params = {
      cardName: keyword || '',
      pageNum: 0,
      pageSize: 3,
      storeId: wx.$getStorage('storeId')
    }
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 充值有礼-分页查询门店会员卡种类信息
module.exports.weappPagedQueryStoreCardKindBasicInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weappPagedQueryStoreCardKindBasicInfo'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 会员卡详情-查询会员卡详情信息
module.exports.weappGetCardKindDetailInfo = function(cardId) {
  return new Promise(resolve => {
    const url = 'weappGetCardKindDetailInfo'
    request.get(url, cardId).then(res => {
      resolve(res.data)
    })
  })
}

// 获取服务订单列表
module.exports.esWeServiceOrderList = function(reqParams) {
  return new Promise(resolve => {
    const url = 'esWeServiceOrderList'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 产品订单确认收货
module.exports.productOrderConfirmReceived = function(orderId) {
  return new Promise(resolve => {
    const url = 'productOrderConfirmReceived'
    request.get(url, orderId).then(res => {
      resolve(res.data)
    })
  })
}

// 评价-获取印象标签
module.exports.getTagLib = function() {
  return new Promise(resolve => {
    const url = 'getTagLib'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 发表评价-服务订单评价
module.exports.createEvaluation = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createEvaluation'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 发表评价-产品订单评价
module.exports.createProductOrderAssessment = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createProductOrderAssessment'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 我的评价-根据订单id获取我的评价
module.exports.weGetGoodsOrderAssessmentByOrderId = function(orderId) {
  return new Promise(resolve => {
    const url = 'weGetGoodsOrderAssessmentByOrderId'
    request.post(url, {
      orderId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 取消未支付的产品订单
module.exports.cancelProductOrder = function(orderId) {
  return new Promise(resolve => {
    const url = 'cancelProductOrder'
    request.get(url, orderId).then(res => {
      resolve(res.data)
    })
  })
}

// 根据id请求服务订单详情
module.exports.weGetServiceOrderInfoById = function(orderId) {
  return new Promise(resolve => {
    const url = 'weGetServiceOrderInfoById'
    request.post(url, {
      id: orderId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取门店全场分类信息
module.exports.getStoreWholeGoodsClass = function() {
  return new Promise(resolve => {
    const url = 'customer/getStoreWholeGoodsClass'
    request.post(url, {
      storeId: wx.$getStorage('storeId')
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取我的会员卡信息
module.exports.weappGetBrandCustomerCard = function(params = {}) {
  return new Promise(resolve => {
    const url = 'weappGetBrandCustomerCard'
    request.post(url,params).then(res => {
      if (res.data.listCustomerCardDetail){
        for (const v of res.data.listCustomerCardDetail) {
          v._balance = v.giftMoney + v.rechargeMoney
        }
      }
      resolve(res.data)
    })
  })
}


// 获取查询指定会员卡的适用门店
module.exports.getStoreCardList = function (reqParams) {
  return new Promise(resolve => {
    const url = 'customer/getCardSuitStorepagedListPaged'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取指定会员卡消费记录
module.exports.getMemberShipList = function (reqParams) {
  return new Promise(resolve => {
    const url = 'getMemberShipConsumeListByCardId'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取会员卡支付流水记录
module.exports.getMemberShipListRenewalList = function (reqParams) {
  return new Promise(resolve => {
    const url = 'getMemberShipOpenOrRenewalListByCardId'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取门店服务评价列表
module.exports.getStoreAssessmentList = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weGetStoreAssessmentList'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 门店评价列表标签统计
module.exports.getStoreAssessmentTagCount = function(storeId) {
  return new Promise(resolve => {
    const url = 'weGetStoreAssessmentTagCount'
    request.get(url, storeId).then(res => {
      resolve(res.data)
    })
  })
}

// 取消服务订单
module.exports.weCancelServiceOrder = function(orderId) {
  return new Promise(resolve => {
    const url = 'weCancelServiceOrder'
    request.post(url, {
      id: orderId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 生成小程序码
module.exports.commonQrCode = function(page, scene, overdue, appId) {
  return new Promise(resolve => {
    const url = 'commonQrCode'
    const params = {
      page,
      scene,
    }
    if (overdue) params.overdue = overdue
    if (appId) params.appId = appId
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 绑定手机号——获取验证码
module.exports.registerVerificationCode = function(phone) {
  return new Promise(resolve => {
    const url = 'weVerification/registerVerificationCode'
    request.post(url, {
      telephone: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 绑定手机号——验证用户
module.exports.verifyCustomer = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weVerification/verifyCustomer'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 选择可预约时间段列表(先选手艺人)
module.exports.weListAvailableAppointmentTimeByStaffId = function(staffId, currentDate) {
  return new Promise(resolve => {
    const url = 'customer/weListAvailableAppointmentTimeByStaffId'
    request.post(url, {
      staffId,
      currentDate
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 选择可预约的手艺人(先选服务)
module.exports.weListAvailableStaffByServiceId = function(storeId, serviceId) {
  return new Promise(resolve => {
    const url = 'customer/weListAvailableStaffByServiceId'
    request.post(url, {
      storeId,
      serviceId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取员工可执行的服务列表
module.exports.getServiceListByStoreIdAndLevelId = function(storeId, levelId) {
  return new Promise(resolve => {
    const url = 'customer/getServiceListByStoreIdAndLevelId'
    request.post(url, {
      storeId,
      levelId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取可用身份卡结算批量产品和服务的信息
module.exports.weappGetIdentityGoodsCountInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weappGetIdentityGoodsCountInfo'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 个人主页-作品动态
module.exports.getDynamic4StaffHomePage = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weGetDynamic4StaffHomePage'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 个人主页-评价标签统计
module.exports.getStaffAssessmentTagCount = function(userId) {
  return new Promise(resolve => {
    const url = 'weGetStaffAssessmentTagCount'
    request.post(url, {
      serverUserId: userId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 个人主页-服务评价列表
module.exports.getStaffAssessmentList4StaffHomePage = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weGetStaffAssessmentList4StaffHomePage'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取可用储值卡结算批量产品和服务的信息
module.exports.weappGetCardPayGoodsCountInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weappGetCardPayGoodsCountInfo'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 储值卡结算
module.exports.weappBillingByPrepaidCard = function(reqParams) {
  return new Promise((resolve,reject) => {
    const url = 'weappBillingByPrepaidCard'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 获取收藏动态 
module.exports.getCollectSimpleDynamic = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getCollectSimpleDynamic'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 查询会员卡充值信息
module.exports.weappGetCardRenewalRules = function(cardKindId) {
  return new Promise(resolve => {
    const url = 'weappGetCardRenewalRules'
    request.get(url, cardKindId).then(res => {
      resolve(res.data)
    })
  })
}

// 查询退款/售后订单--服务
module.exports.getServiceRefundOrderList = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getServiceRefundOrderList'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取服务退款/售后单详情
module.exports.getUserRefundOrderDetail = function(refundOrderId) {
  return new Promise(resolve => {
    const url = 'getUserRefundOrderDetail'
    request.get(url, refundOrderId).then(res => {
      resolve(res.data)
    })
  })
}

// 取消服务退款/售后订单
module.exports.cancelServiceRefundOrder = function(refundOrderId) {
  return new Promise(resolve => {
    const url = 'cancelServiceRefundOrder'
    request.get(url, refundOrderId).then(res => {
      resolve(res.data)
    })
  })
}

// 服务退款/售后补充留言
module.exports.refundServiceOrderMessage = function(reqParams) {
  return new Promise(resolve => {
    const url = 'refundServiceOrderMessage'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 点击[修改申请]按钮获得退款服务订单信息
module.exports.getChangeRefundServiceOrderBasicInfo = function(refundOrderId) {
  return new Promise(resolve => {
    const url = 'getChangeRefundServiceOrderBasicInfo'
    request.get(url, refundOrderId).then(res => {
      resolve(res.data)
    })
  })
}

// 修改服务退款单信息
module.exports.changeServiceRefundOrderInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'changeServiceRefundOrderInfo'
    request.put(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 创建服务退款单
module.exports.createServiceRefundOrder = function(reqParams) {
  return new Promise(resolve => {
    const url = 'createServiceRefundOrder'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 收藏商品
module.exports.brandCustomerCollectGoods = function(reqParams) {
  return new Promise(resolve => {
    const url = 'brandCustomerCollectGoods'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取收藏商品列表
module.exports.getBrandCustomerCollectGoods = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getBrandCustomerCollectGoods'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取产品相关作品
module.exports.getDynamic4Goods = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getDynamic4Goods'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 结算消费账单
module.exports.weSettleConsumerOrder = function(reqParams) {
  return new Promise((resolve,reject) => {
    const url = 'weSettleConsumerOrder'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 获取可用会员卡结算批量产品服务信息
module.exports.weappGetAllCardPayGoodsCountInfo = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weappGetAllCardPayGoodsCountInfo'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 核销消费账单
module.exports.weVerifyConsumerOrder = function(consumerOrderId) {
  return new Promise(resolve => {
    const url = 'weVerifyConsumerOrder'
    request.post(url, {
      consumerOrderId
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 美丽档案列表
module.exports.weCustomerBeautyAchievesList = function(currentPage, pageSize) {
  return new Promise(resolve => {
    const url = 'weCustomerBeautyAchievesList'
    request.post(url, {
      currentPage,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 美丽档案详情
module.exports.customerBeautyAchievesDetail = function(id) {
  return new Promise(resolve => {
    const url = 'customerBeautyAchievesDetail'
    request.post(url, {
      consumerOrderId: id
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 修改手机号-验证原手机号发送验证码
module.exports.brandCustomerSendMobileMsg = function(phone) {
  return new Promise(resolve => {
    const url = 'brandCustomerSendMobileMsg'
    request.post(url, {
      telephone: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 修改手机号-校验原手机验证码
module.exports.checkBrandCustomerMobileCode = function(phone, code) {
  return new Promise(resolve => {
    const url = 'checkBrandCustomerMobileCode'
    request.post(url, {
      code,
      mobile: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 修改手机号-给新手机号发验证码
module.exports.brandCustomerSendNewMobileMsg = function(phone) {
  return new Promise(resolve => {
    const url = 'brandCustomerSendNewMobileMsg'
    request.post(url, {
      telephone: phone
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 修改手机号-校验新手机号验证码
module.exports.brandCustomerChangeMobile = function(phone, code) {
  return new Promise(resolve => {
    const url = 'brandCustomerChangeMobile'
    request.post(url, {
      mobile: phone,
      code
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 设置支付密码-发送验证码
module.exports.brandCustomerPayPasswordMobileMsg = function() {
  return new Promise(resolve => {
    const url = 'brandCustomerPayPasswordMobileMsg'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 设置支付密码-校验验证码
module.exports.checkBrandCustomerPayPasswordCode = function(code) {
  return new Promise(resolve => {
    const url = 'checkBrandCustomerPayPasswordCode'
    request.post(url, {
      code
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 设置支付密码-提交支付密码
module.exports.brandCustomerCommitPayPassword = function(cardPayPassword) {
  return new Promise(resolve => {
    const url = 'brandCustomerCommitPayPassword'
    request.post(url, {
      cardPayPassword
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 根据门店已关联商品的分类信息列表
//@type {String} - 'service' or 'production' 
module.exports.weGetStoreClassInfoInUsing = function(type) {
  return new Promise(resolve => {
    const url = 'customer/weGetStoreClassInfoInUsing'
    request.post(url, {
      storeId: wx.$getStorage('storeId'),
      goodsTypeScope: type
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取门店商品的标签列表
module.exports.weGetStoreGoodsTagsInUsing = function(type) {
  return new Promise(resolve => {
    const url = 'customer/weGetStoreGoodsTagsInUsing'
    request.post(url, {
      storeId: wx.$getStorage('storeId'),
      goodsTypeScope: type
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 美购页面-搜索服务/产品/卡项
module.exports.weGetStoreGoodsInfoByGoodsName = function(reqParams) {
  return new Promise(resolve => {
    const url = 'customer/weGetStoreGoodsInfoByGoodsName'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 收货地址-请求收货地址列表
module.exports.shippingAddressList4Customer = function() {
  return new Promise(resolve => {
    const url = 'shippingAddressList4Customer'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 收货地址-新增收货地址
module.exports.shippingAddressAdd = function(reqParams) {
  return new Promise(resolve => {
    const url = 'shippingAddressAdd'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 根据id获取收货地址详情
module.exports.shippingAddressWeGet = function(id) {
  return new Promise(resolve => {
    const url = 'shippingAddressWeGet'
    request.get(url, id).then(res => {
      resolve(res.data)
    })
  })
}

// 删除收货地址
module.exports.shippingAddressDel = function(id) {
  return new Promise(resolve => {
    const url = 'shippingAddressDel'
    request.get(url, id).then(res => {
      resolve(res.data)
    })
  })
}

// 修改收货地址
module.exports.shippingAddressUpdate = function(reqParams) {
  return new Promise(resolve => {
    const url = 'shippingAddressUpdate'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取客户默认收货地址
module.exports.shippingAddressGetDefault = function() {
  return new Promise(resolve => {
    const url = 'shippingAddressGetDefault'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 获取物流信息
module.exports.productOrderLogisticsWeGet = function(logisticsId) {
  return new Promise(resolve => {
    const url = 'productOrderLogisticsWeGet'
    request.get(url, logisticsId).then(res => {
      resolve(res.data)
    })
  })
}

// 检查派发新人红包
module.exports.checkSendNewerRedPacket = function() {
  return new Promise(resolve => {
    const url = 'checkSendNewerRedPacket'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 查询红包信息-总
//@type {Number} - 0-未使用 1-已使用 2-已过期
module.exports.getRedPacketList = function(type, pageNum, pageSize) {
  return new Promise(resolve => {
    let url
    switch (type) {
      case 0:
        url = 'pagedQueryBrandEffectiveCustomerRedPacketInfo'
        break;
      case 1:
        url = 'pagedQueryBrandUsedCustomerRedPacketInfo'
        break;
      case 2:
        url = 'pagedQueryBrandExpiredCustomerRedPacketInfo'
        break;
    }
    request.post(url, {
      pageNum,
      pageSize
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 查询我的关注列表
module.exports.weListAvailableStaffAttentived = function(reqParams) {
  return new Promise(resolve => {
    const url = 'weListAvailableStaffAttentived'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取可用红包结算批量产品和服务
module.exports.getRedPacketPayGoodsCount = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getRedPacketPayGoodsCount'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 获取品牌会员等级列表信息
module.exports.weGetBrandMemberLevelList = function() {
  return new Promise(resolve => {
    const url = 'weGetBrandMemberLevelList'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 获取品牌会员成长值行为规则信息
module.exports.weGetBrandMemberExperienceRule = function() {
  return new Promise(resolve => {
    const url = 'weGetBrandMemberExperienceRule'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 会员等级-成长值记录
module.exports.getBrandCustomerExpRecord = function(reqParams) {
  return new Promise(resolve => {
    const url = 'getBrandCustomerExpRecord'
    request.post(url, reqParams).then(res => {
      resolve(res.data)
    })
  })
}

// 会员等级-分享后添加成长值
module.exports.addExpAfterShare = function(id, type) {
  return new Promise(resolve => {
    const url = 'addExpAfterShare'
    const params = {
      goodsId: id,
      shareTypes: type
    }
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取客户等级信息
module.exports.weGetBrandCustomerLevelInfoById = function() {
  return new Promise(resolve => {
    const url = 'weGetBrandCustomerLevelInfoById'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 进入小程序添加成长值
module.exports.addExpAfterAccessStore = function() {
  return new Promise(resolve => {
    const url = 'customer/addExpAfterAccessStore'
    if (wx.$getStorage('authorization')) {
      request.post(url).then(res => {
        resolve(res.data)
      })
    } else {
      function handler() {
        request.post(url).then(res => {
          resolve(res.data)
        })
      }
      wx.$event.on('login', handler)
    }
  })
}

// 请求主题配色
module.exports.getBrandThemeByAppId = function() {
  return new Promise(resolve => {
    const url = 'getBrandThemeByAppId'
    request.get(url, util.appId).then(res => {
      resolve(res.data)
    })
  })
}

// 拼团商品列表
module.exports.getStoreGroupPurchaseGoodsList = function() {
  return new Promise(resolve => {
    const url = 'customer/getStoreGroupPurchaseGoodsList'
    request.post(url, {
      storeId: wx.$getStorage('storeId')
    }).then(res => {
      resolve(res.data)
    })
  })
}

// 获取可领取的新人红包信息
module.exports.weGetValidNewerRedPacket = function(){
  return new Promise(resolve => {
    const url = 'weGetValidNewerRedPacket'
    request.post(url).then( res => {
      resolve(res.data)
    })
  })
}

// 美购-首页推荐
module.exports.getGoodsForFirstPage = function(){
  const url = 'customer/getGoodsForFirstPage'
  return request.post(url, { storeId: wx.$getStorage('storeId') }).then(res => {
    return res.data
  })
}

// 校验用户钱包是否开通
module.exports.weCheckWalletActive = function () {
  return new Promise(resolve => {
    const url = 'weCheckWalletActive'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 微信充值钱包
module.exports.weCashInByWechat = function (params) {
  return new Promise((resolve,reject) => {
    const url = 'weCashInByWechat'
    request.post(url,params).then(res => {
      apiWxPay(res,resolve,reject);
    })
  })
}

// 获取钱包余额
module.exports.weGetWalletMoney = function () {
  return new Promise(resolve => {
    const url = 'weGetWalletMoney'
    request.post(url).then(res => {
      resolve(res.data)
    })
  })
}

// 创建提现申请
module.exports.weCreateCashOutApplyRecord = function (params) {
  return new Promise(resolve => {
    const url = 'weCreateCashOutApplyRecord'
    request.post(url, params,null,false).then(res => {
      resolve(res.data)
    })
  })
}

// 分页查询钱包明细
module.exports.weGetWalletMoneyRecord = function (params) {
  return new Promise(resolve => {
    const url = 'weGetWalletMoneyRecord'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 我的资产信息
module.exports.weGetMyTreasure = function (params) {
  return new Promise(resolve => {
    const url = 'getMyTreasure'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 我的权益金信息
module.exports.weGetPreMoney = function (params) {
  return new Promise(resolve => {
    const url = 'getPreMoneyForStore'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取权益金门店
module.exports.getStoreList = function (params) {
  return new Promise(resolve => {
    const url = 'getStoreInfoForPreMoney'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取权益金变动明细
module.exports.getAccountRecordList = function (params) {
  return new Promise(resolve => {
    const url = 'getPreMoneyAccountRecordList'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 校验权益金是否可以转出
module.exports.checkPreMoneyOut = function (params) {
  return new Promise(resolve => {
    const url = 'checkPreMoneyOut'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 权益金申请提现
module.exports.createPreMoneyOutApply = function (params) {
  return new Promise(resolve => {
    const url = 'createPreMoneyOutApply'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 权益金申请提现修改
module.exports.updatePreMoneyOutApply = function (params) {
  return new Promise(resolve => {
    const url = 'updatePreMoneyOutApply'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取权益金转出记录
module.exports.getPreMoneyOutApplyListForSelf = function (params) {
  return new Promise(resolve => {
    const url = 'getPreMoneyOutApplyListForSelf'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 根据申请记录Id获取获取权益金申请进度
module.exports.getPreMoneyOutApplyProgress = function (params) {
  return new Promise(resolve => {
    const url = 'getPreMoneyOutApplyProgress'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 权益金申请取消
module.exports.cancelPreMoneyOutApply = function (params) {
  return new Promise(resolve => {
    const url = 'cancelPreMoneyOutApply'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取品牌客户的拥有的所有优惠劵信息
module.exports.getBrandCustomerCoupons = function (params) {
  return new Promise(resolve => {
    const url = 'getBrandCustomerCoupons'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 获取商品下的所有优惠劵
module.exports.getGoodsCoupons = function (params) {
  return new Promise(resolve => {
    const url = 'customer/getGoodsCoupons'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 客户领取优惠劵
module.exports.weBrandCustomerTakeCoupons = function (params) {
  return new Promise(resolve => {
    const url = 'weBrandCustomerTakeCoupons'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 结算时,根据商品id,获取客户已领取的优惠劵
module.exports.getBrandCustomerCouponsByGoodsId = function (params) {
  return new Promise(resolve => {
    const url = 'getBrandCustomerCouponsByGoodsId'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

// 删除评论
module.exports.weDeleteDynamicComment = function (params) {
  return new Promise(resolve => {
    const url = 'weDeleteDynamicComment'
    request.post(url, params).then(res => {
      resolve(res.data)
    })
  })
}

//商城订单统计
module.exports.uvRecord = function(params){
  const url = 'uvRecord'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//开通钱包
module.exports.WeActiveWallet = function (params) {
  const url = 'WeActiveWallet'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//开通钱包
module.exports.getAppointmentBilling = function (params) {
  const url = `getAppointmentBilling/${params.appointmentId}`
  return request.get(url).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}


//获取收入明细
module.exports.getSellPerformanceDetailBySellerId = function (params) {
  const url = 'getSellPerformanceDetailBySellerId'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//小程序端钱包结算
module.exports.weBillingByWalletMoney = function (params) {
  const url = 'weBillingByWalletMoney'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取推广员的推广提成
module.exports.getSellPerformance = function (params) {
  const url = 'getSellPerformance'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取推广明细数据
module.exports.getSellPerformanceDetail = function (params) {
  const url = 'getSellPerformanceDetail'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//我的客户 / 我的推广员数据
module.exports.getMyCustomerSellInfo = function (params) {
  const url = 'getMyCustomerSellInfo'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//分销-排行榜
module.exports.getSellPerformanceForBoard = function (params) {
  const url = 'getSellPerformanceForBoard'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取推广员的推广商品列表
module.exports.getSellerGoodsListForSeller = function (params) {
  const url = 'getSellerGoodsListForSeller'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取订阅消息模板id
 const getMessageTempList = function (params) {
  const url = 'getMessageTempList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//订阅消息成功回调
const callBackForMessageSuccess = function (params) {
  const url = 'callBackForMessageSuccess'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//订阅消息
module.exports.requestSubscribeMessage = function(params) {
  getMessageTempList(params).then(res => {
    if (res.success) {
      // for (const v of res.tempIds) {
      //   if (!res.tempIds[v]) return
      // }
      wx.requestSubscribeMessage({
        tmplIds: res.tempIds,
        success(result) {
          if (result.errMsg == 'requestSubscribeMessage:ok') {
            callBackForMessageSuccess(params);
          }
        }
      })
    }
  })
}

//添加删除购物车商品
module.exports.shoppingCartChange = function (params) {
  const url = 'shoppingCartChange'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//购物车
module.exports.getShoppingCartInfo = function (params) {
  const url = 'getShoppingCartInfo'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//广告
module.exports.getAdBannerByStoreId = function (params) {
  const url = 'weGetAdBannerByStoreId'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//购物车删除商品
module.exports.deletedShoppingCart = function (params) {
  const url = 'deletedShoppingCart'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据广告id获取广告信息
module.exports.getAdDetailByAdId = function (params) {
  const url = 'weGetAdDetailByAdId'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取浏览记录
module.exports.getProductBrowsingHistoryList = function (params) {
  const url = 'getProductBrowsingHistoryList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//添加浏览记录
module.exports.addBrowsingHistory = function (params) {
  const url = 'addBrowsingHistory'
  if (wx.$getStorage('authorization')) {
    return request.post(url, params).then(res => {
      return res.data;
    }).catch(error => {
      return error;
    })
  }
}

//判断广告
module.exports.switchAdv = function(adv,advId) {
  switch(Number(adv.type)){
    case 1:
      wx.$route('/pages/IC/pages/optimization/optimization', { advId: advId});
      break;
    case 2:
      wx.$route('/pages/IC/pages/optimization/optimization', { advId: advId });
      break;
    case 3:
      if (adv.singleGood.goodsType == 1){
        wx.$route('/pages/IC/pages/productdetails/productdetails', { productId: adv.singleGood.goodsId });
      } else if (adv.singleGood.goodsType == 2){
        wx.$route('/pages/IC/pages/productdetails/productdetails', { productId: adv.singleGood.goodsId,isProduct: 1 });
      } else if (adv.singleGood.goodsType == 3){
        wx.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', { id: adv.singleGood.goodsId });
      }
      break;
    case 4:
      switchMenu(adv, advId);
      break;
    case 5:
      break;
  }
}

function switchMenu(adv,advId){
  switch(adv.menu){
    case 'STORE':
      wx.$route('/pages/SC/pages/recommended/recommended');
      break;
    case 'SEC_KILL':
      wx.showToast({
        title: '敬请期待',icon: 'none'
      });
      break;
    case 'NEWER':
      wx.$route('/pages/IC/pages/vipDiscount/vipDiscount');
      break;
    case 'GROUP_BY':
      wx.$route('/pages/IC/pages/product_group/product_group');
      break;
    case 'SELL_GOODS':
      wx.$route('/pages/DBS/pages/promoteGoods/promoteGoods');
      break;
    case 'VIP':
      wx.$route('/pages/IC/pages/newCustomer/newCustomer');
      break;
    case 'HOT':
      wx.$route('/pages/IC/pages/dynamic/dynamic');
      break;
    case 'ORDER_CAR':
      wx.$route('/pages/TC/pages/shopCar/shopCar');
      break;
    case 'VIP_HOME':
      wx.$route('/pages/VIP/pages/memberLevel/memberLevel');
      break;
  }
}

//积分结算
module.exports.getBrandCustomerPointsBillingInfo = function (params) {
  const url = 'getBrandCustomerPointsBillingInfo'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//查询可以使用的积分 过期积分 已使用积分
module.exports.getBrandCustomerIntegralStatisticalInfoApi = function (params) {
  const url = 'getBrandCustomerIntegralStatisticalInfoApi'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//查询可以使用的积分 过期积分 已使用积分
module.exports.getBrandMemberIntegralRuleApiByBrandId = function (brandId) {
  const url = 'getBrandMemberIntegralRuleApiByBrandId/' + brandId
  return request.get(url).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//积分流水记录
module.exports.getBrandCustomerIntegralRecordApiPage = function (params) {
  const url = 'getBrandCustomerIntegralRecordApiPage'
  return request.post(url,params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//员工动态分类列表（品牌下全部的动态分类）
module.exports.getStaffDynamicCategoryList = function (params) {
  const url = 'getStaffDynamicCategoryList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//积分使用规则
module.exports.getBrandPointsRuleInfos = function (params) {
  const url = 'getBrandPointsRuleInfos'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取行业
module.exports.getIndustryList = function (params) {
  const url = 'weGetIndustryList'
  return request.get(url).then(res => {
    wx.$setStorage('industryList', res.data.industryList)
    return res.data;
  }).catch(error => {
    return error;
  })
}

//提交定制请求
module.exports.createWebsiteForm = function (params) {
  const url = 'createWebsiteForm'
  return request.post(url,params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//品牌端 - 小程序拼团商品列表及新人体验价列表
module.exports.getBrandGroupPurchaseGoodsList = function (params) {
  const url = 'customer/getBrandGroupPurchaseGoodsList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//微信端 - 获取品牌中心介绍
module.exports.weGetBrandCentral = function () {
  const url = 'weGetBrandCentral/' + util.appId
  return request.get(url).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据品牌id和类型获取品牌介绍
module.exports.getBrandIntroduction = function (params) {
  const url = 'weGetBrandIntroduction'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据品牌id查询小程序栏目自定义信息
module.exports.getBrandWeAppletColumnSettingSelfApiByBrandId = function (brandId) {
  const url = 'getBrandWeAppletColumnSettingSelfApiByBrandId/' + brandId
  return request.get(url).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据品牌id查询小程序菜单自定义信息
module.exports.getBrandWeAppletMenuSettingSelfApiByBrandId = function (brandId) {
  const url = 'getBrandWeAppletMenuSettingSelfApiByBrandId/' + brandId
  return request.get(url).then(res => {
    return res.data;
  })
}

//体验价商品列表
module.exports.weGetExperiencePriceGoodsList = function (params) {
  const url = 'customer/weGetExperiencePriceGoodsList'
  return request.post(url,params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取购物车数量
module.exports.getShopCartNumber = function (brandId) {
  const url = 'getShopCartNumber/' + brandId
  return request.get(url).then(res => {
    return res.data;
  })
}

//动态评论点赞/取消点赞
module.exports.weDynamicCommentThumbUp = function (params) {
  const url = 'weDynamicCommentThumbUp'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}


//分页查询门店会员卡种类信息----门店
module.exports.pagedQueryStoreCardKindBasicInfo = function (params) {
  const url = 'pagedQueryStoreCardKindBasicInfo'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//校验绑定老客
module.exports.bindOldCustomer = function (params) {
  const url = 'bindOldCustomer'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//可赠送的礼品卡
module.exports.getGiftCardActivityForSend = function (params) {
  const url = 'getGiftCardActivityForSend'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//可领取的礼品卡
module.exports.getAvailableGiftCardActivity = function (params) {
  const url = 'getAvailableGiftCardActivity'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//领取免费的礼品卡
module.exports.getGiftCardForFree = function (params) {
  const url = 'getGiftCardForFree'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//购买付费的礼品卡
module.exports.buyGiftCard = function (params) {
  const url = 'buyGiftCard'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取活动卡片的领取记录
module.exports.getGiftCardShareRecord = function (params) {
  const url = 'getGiftCardShareRecord'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据id回去礼品卡活动详情
module.exports.getGiftCardActivityById = function (params) {
  const url = 'getGiftCardActivityById'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//-增加分享次数
module.exports.addShareTimesForActivity = function (params) {
  const url = 'addShareTimesForActivity'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取提现记录
module.exports.weGetCashOutApplyRecord = function (params) {
  const url = 'weGetCashOutApplyRecord'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据申请记录Id获取申请进度
module.exports.weGetApplyProgress = function (recordId) {
  const url = 'weGetApplyProgress/' + recordId
  return request.get(url).then(res => {
    return res.data;
  })
}

//获取用户可领取的红包信息(新人红包除外)
module.exports.getRedPacketForCustomerToTake = function (params) {
  const url = 'getRedPacketForCustomerToTake'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//领取可以领取的一个红包
module.exports.takeRedPacketById = function (params) {
  const url = 'takeRedPacketById'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//根据品牌客户id查询股东信息 -- 全部信息 下面所有启用分红门店
module.exports.weGetShareholderInfoByBrandCustomerId = function (brandId) {
  const url = 'weGetShareholderInfoByBrandCustomerId/' + brandId
  return request.get(url).then(res => {
    return res.data;
  })
}

//股东分红统计信息
module.exports.weGetBonusStatistics = function (shareholderId) {
  const url = 'weGetBonusStatistics/' + shareholderId
  return request.get(url).then(res => {
    return res.data;
  })
}

//股东分红统计信息--时间段查询
module.exports.weGetBonusStatisticsByDuration = function (params) {
  const url = 'weGetBonusStatisticsByDuration'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//股东介绍费统计 -- 时间段查询
module.exports.weGetReferralFeeStatisticsByDuration = function (params) {
  const url = 'weGetReferralFeeStatisticsByDuration'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//保证金统计信息
module.exports.weGetSecurityFundStatistics = function (params) {
  const url = 'weGetSecurityFundStatistics'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//股东保证金变动记录分页查询
module.exports.weGetShareholderSecurityFundChangeRecordList = function (params) {
  const url = 'weGetShareholderSecurityFundChangeRecordList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//绑定股东记录分页查询
module.exports.weGetShareholderBindPagedList = function (params) {
  const url = 'weGetShareholderBindPagedList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//介绍人下级股东分页查询
module.exports.weGetIntroduceShareholderPagedList = function (params) {
  const url = 'weGetIntroduceShareholderPagedList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//股东分红记录分页查询
module.exports.weGetShareholderBonusRecordInfoPagedList = function (params) {
  const url = 'weGetShareholderBonusRecordInfoPagedList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}

//获取股东分红排行榜记录
module.exports.shareholderTopInfoPagedList = function (params) {
  const url = 'shareholderTopInfoPagedList'
  return request.post(url, params).then(res => {
    return res.data;
  }).catch(error => {
    return error;
  })
}