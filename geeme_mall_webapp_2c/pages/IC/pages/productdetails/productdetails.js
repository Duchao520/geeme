var apiAction = null, util = null, app = null, myUtil;
Page({
  $name: 'productdetails',
  data: {
    // 控制规格的显示 
    flagpackage: false,
    ifShowSharePop: false,
    flagGroupModal: false,
    flagServerTemp: false,
    brandId: null,
    shopCarCount: '',
    //商品的数据
    productInfo: null,
    productImage: [],
    shopId: 0,
    goodsId: 0, // goodsId
    // 所选套餐
    package: null,
    // 判断是产品详情还是服务详情 true:产品 false:服务
    isProduct: false,
    // 若规格多于一种，必须选择规格后才能下单
    hasChoosed: true,
    // 评价组件的数据
    assessmentList: null,
    // 分享出去的带参数的路径
    path: null,
    tabList: ['商品详情', '相关动态'],
    currentTab: 0, //
    // 相关作品信息
    works: {
      list: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      flag: false,
    },
    birthday_tomorrow: 0, // 生日第二天0点的时间戳
    birthday_countdown: 0, // 倒计时-单位秒
    group_countdown: 0,      //团购倒计时，时间戳-单位秒
    ifShowGroup: false,
    selectedTeamIndex: null, // 选中的团下标
    couponSendRecordList: [],
    goodsPic: null,
    SWIPER_SWITCHER: true,
    HTTP_REQUEST_SWITCHER: true,
    BUY_WAY: 'buy',
    BUY_EVENT: '',
    mp4: null
  },
  computed: {
    // 总价
    _totalPrice() {
      if (this.data.package) {
        let price = this.data.package.experiencePrice ? this.data.package.experiencePrice : this.data.package.specialPrice;
        return this.data.package.count * price
      }
    },
    // 生日当天结束倒计时
    _birthdayCountdown() {
      if (this.data.birthday_countdown) {
        let hour = parseInt(this.data.birthday_countdown / 3600)
        let minute = parseInt(this.data.birthday_countdown / 60) - hour * 60
        let second = this.data.birthday_countdown - hour * 3600 - minute * 60
        return {
          hour: hour.toString()[1] ? hour : '0' + hour,
          minute: minute.toString()[1] ? minute : '0' + minute,
          second: second.toString()[1] ? second : '0' + second,
        }
      }
    },
    //团购倒计时
    _groupCountdown() {
      if (this.data.group_countdown) {
        let day = parseInt(this.data.group_countdown / (3600 * 24))
        let hour = parseInt(this.data.group_countdown / 3600) - day * 24
        let minute = parseInt(this.data.group_countdown / 60) - day * 24 * 60 - hour * 60
        let second = this.data.group_countdown - day * 24 * 60 * 60 - hour * 3600 - minute * 60
        return {
          day: day,
          hour: hour.toString()[1] ? hour : '0' + hour,
          minute: minute.toString()[1] ? minute : '0' + minute,
          second: second.toString()[1] ? second : '0' + second,
        }
      }
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    myUtil = require('../../../../utils/myUtil.js');
    app = getApp();

    if (options.scene) {
      options = util.sceneToJson(options.scene)
      this.isShare = true
    }
    const productId = options.productId
    const isProduct = (options.isProduct || options.isP) ? true : false
    const sellerId = options.SId ? options.SId : '';
    if (wx.$getStorage('authorization') && sellerId) {
      this.bindOldCustomer(sellerId);
    }
    if (sellerId) {
      wx.$setStorage('sellerId', sellerId);
    }
    //保存分销Id
    let path = `/${this.route}?productId=${productId}`
    if (isProduct) path += '&isProduct=1'
    this.data.goodsId = productId;
    this.data.isProduct = isProduct;
    this.data.path = path
    app.getBrand(brand => {
      this.data.brandId = brand.brandId;
      this.getShopCartNumber();
    })
  },
  onShow(options) {
    let promiseArr = [
      this.fetch(this.data.isProduct, this.data.goodsId).then(this.render),
      this.getAssessment()
    ]
    util.PromiseAll(promiseArr).then(res => {
      this.setData({ HTTP_REQUEST_SWITCHER: false })
      Object.assign(res, { goodsId: this.data.goodsId, isProduct: this.data.isProduct });
      if (res.productInfo.richText) {
        res.productInfo.richTextArr = res.productInfo.richText.split(',')
      } else {
        res.productInfo.richTextArr = []
      }
      this.$setData(res);
      if (this.data.productInfo.video) {
        this.data.mp4 = wx.createVideoContext('mp4');
      }
      this.sharePicDraw();
    })
  },
  onUnload() {
    clearInterval(this.t)
    //清内存
    apiAction = null;
    util = null;
    app = null;
    clearInterval(this.interval);
    // this.data = null;
  },
  // 定义分享内容
  onShareAppMessage(res) {
    const product = this.data.productInfo
    const currentPackage = this.data.package;
    let title = currentPackage.groupPrice ? '拼团优惠:' + product.title : currentPackage.experiencePrice ? '新人专享价:' + product.title : product.title;
    return {
      title: title,
      path: this.data.path,
      imageUrl: this.data.goodsPic
    }

  },
  mp4Play() {
    if (this.data.SWIPER_SWITCHER) {   //当前暂停状态
      this.data.mp4.play();
    } else {
      this.data.mp4.pause();
    }
    this.$setData({ SWIPER_SWITCHER: !this.data.SWIPER_SWITCHER })

  },
  mp4End() {
    this.$setData({ SWIPER_SWITCHER: true })
  },
  mp4Pause() {
    this.data.mp4.pause();
    this.setData({ SWIPER_SWITCHER: true });
  },
  bindOldCustomer(sellerId) {
    apiAction.bindOldCustomer({ sellerId })
  },
  sharePicDraw() {
    let pack = this.data.package;
    let ctx = wx.createCanvasContext('goodsPic'),

      productInfo = this.data.productInfo,
      currentPrice = pack.experiencePrice || pack.groupPrice || pack.specialPrice,
      originalPrice = pack.price,
      pic1 = productInfo.productImage[0],
      pic2 = productInfo.productImage[1] ? productInfo.productImage[1] : productInfo.productImage[0];
    myUtil.goodsSharePic(ctx, currentPrice, originalPrice, pic1, pic2).then(res => {
      this.$setData({ goodsPic: res });
      // ctx = null;
    })
  },
  // 请求详情(总)
  fetch(isProduct, goodsId) {
    let promise
    if (isProduct) {
      // 产品详情接口
      promise = apiAction.getSimpleProductInfo(goodsId)
    } else {
      // 服务详情接口
      promise = apiAction.getServiceInfo(goodsId)
    }
    return promise
  },
  // 渲染 统一产品、服务字段名
  render(data) {
    if (this.isShare) {
      app.setShopInfo(data.shopId || data.storeId)
    }
    // 统一店铺信息结构
    if (!data.shopInfo) {

      data.shopInfo = {
        shopImg: data.image,
        brandName: data.brandName,
        shopName: data.name,
        city: data.city,
        area: data.area,
        address: data.address,
        id: data.storeId,
        phone: data.hotline,
        brandId: data.brandId
      }
    }
    // 统一字段名
    data.productImage = data.productImage || data.cycleImage
    data.title = data.title || data.serviceFullTitle
    data.shortTitle = data.serviceTitle || data.simpleTitle
    data.image = data.productImage[0]
    // 统一字段名
    data.packageList = data.packageList || data.weProductSpecifications
    if (data.packageList.length > 1) {
      this.data.hasChoosed = false
    }
    data.packageList = data.packageList.map(v => {
      v.count = 1
      v.selected = 0
      // 统一字段名
      v.name = v.name || v.specificationName
      v.price = v.price || v.shopPrice
      v.specialPrice = v.specialPrice || v.memberPrice
      return v;
    })
    data.packageList[0].selected = 1
    let currentPackage = data.packageList[0]
    this.data.productInfo = data;
    this.data.package = currentPackage;
    // 获取生日价信息
    let result = this.getBirthdayInfo(data)
    // 获取拼团价信息
    this.getGroupBuyInfo();
    this.startGroupCountdown();
    //服务保障，购买须知
    if (data.purchaseNoteInfoList) {
      data.security = data.purchaseNoteInfoList.filter(ele => ele.groupId == 1);
      data.notice = data.purchaseNoteInfoList.filter(ele => ele.groupId == 2);
    }
    Object.assign(result, {
      productInfo: data,
      package: currentPackage,
    }, {
        goodsId: this.data.productId,
        isProduct: this.data.isProduct
      });
    return this.getGoodsCoupons().then(res => {
      Object.assign(result, res);
      return result
    }).catch(error => {
      return result
    })
  },
  showSeason(){
    wx.showToast({
      title: '拼团次数超限',
      icon: 'none'
    })
  },
  getShopCartNumber() {
    if (wx.$getStorage('authorization')) {
      apiAction.getShopCartNumber(this.data.brandId).then(res => {
        this.setData({ shopCarCount: res.num ? res.num : '' })
      })
      this.addBrowsingHistory();
    }
  },

  addBrowsingHistory() {
    let { brandId, goodsId, isProduct } = this.data,
      goodsTypeScope = isProduct ? 'production' : 'service',
      params = {
        brandId, goodsId, goodsTypeScope
      };
    apiAction.addBrowsingHistory(params);
  },

  //获取优惠券
  getGoodsCoupons() {
    let { goodsId, isProduct, productInfo } = this.data,
      { id } = productInfo.shopInfo,
      params = {
        goodsId,
        goodsTypeScope: isProduct ? 'production' : 'service',
        storeId: id
      };
    return apiAction.getGoodsCoupons(params).then(res => {
      let { couponSendRecordList } = res;
      if (couponSendRecordList.length > 0) {
        return { couponSendRecordList }
      }
      return {}
    })
  },

  /** 
   * 导航
   */
  navigation() {
    // 用户地址导航
    let latitude, longitude, address, name;
    if (this.data.isProduct) {
      let gpsSplit = this.data.productInfo.location.split(',');
      latitude = gpsSplit[0];
      longitude = gpsSplit[1];
      address = this.data.productInfo.address;
      name = this.data.productInfo.name;
    } else {
      let shopInfo = this.data.productInfo.shopInfo
      latitude = shopInfo.latitude;
      longitude = shopInfo.longitude;
      address = shopInfo.address;
      name = shopInfo.shopName;
    }
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      scale: 10,
      address: address,
      name: name
    })
  },

  //领取优惠券
  weBrandCustomerTakeCoupons($event) {
    let { couponsendrecordid } = $event.target.dataset,
      { productInfo } = this.data,
      { id } = productInfo.shopInfo,
      params = {
        couponSendRecordId: couponsendrecordid,
        storeId: id
      };
    apiAction.weBrandCustomerTakeCoupons(params).then(res => {
      if (res.success) {
        apiAction.requestSubscribeMessage({ type: 6 })
        wx.showToast({
          title: '领取成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  // 获取拼团价格信息
  getGroupBuyInfo() {
    for (const v of this.data.productInfo.packageList) {
      this.timePass = 0
      this.getGroupCountdown();
      this.getGroupPurchaseTeamCountdown()
      this.t = setInterval(() => {
        this.timePass++
        this.getGroupCountdown();
        this.getGroupPurchaseTeamCountdown()
      }, 1000)
      return
    }
  },
  // 团购活动倒计时
  getGroupCountdown() {
    const currentPackage = this.data.package
    let packageHour, packageMin, packageSecond, packageRemainMillisTime;
    packageRemainMillisTime = parseInt(currentPackage.countDown / 1000) - this.timePass;
    if (packageRemainMillisTime > 0) {
      packageHour = parseInt(packageRemainMillisTime / 3600);
      packageMin = parseInt(packageRemainMillisTime / 60) - packageHour * 60;
      packageSecond = packageRemainMillisTime - packageHour * 3600 - packageMin * 60;
      this.setData({
        ['package.hour']: packageHour,
        ['package.minute']: packageMin,
        ['package.second']: packageSecond
      })
    }
  },
  startGroupCountdown() {
    let { group_countdown } = this.data;
    if (this.data.package.countDown) {
      group_countdown = parseInt(this.data.package.countDown / 1000);
      this.t = setInterval(() => {
        group_countdown--;
        this.$setData({ group_countdown });
      }, 1000)
    }
  },
  // 获取团购各个团的倒计时
  getGroupPurchaseTeamCountdown() {
    // 当前规格无团购价或无团参加时不必执行
    if (!(this.data.package.groupPrice && this.data.package.groupPurchaseTeamList.length)) return
    const currentPackage = this.data.package
    let hour, minute, second, remainMillisTime, attr, hourAttr, minuteAttr, secondAttr
    for (let i = 0; i < currentPackage.groupPurchaseTeamList.length; i++) {
      remainMillisTime = parseInt(currentPackage.groupPurchaseTeamList[i].remainMillisTime / 1000) - this.timePass
      if (remainMillisTime < 0) continue
      hour = parseInt(remainMillisTime / 3600)
      minute = parseInt(remainMillisTime / 60) - hour * 60
      second = remainMillisTime - hour * 3600 - minute * 60
      attr = `package.groupPurchaseTeamList[${i}]`
      hourAttr = attr + '.hour'
      minuteAttr = attr + '.minute'
      secondAttr = attr + '.second'
      this.$setData({
        [hourAttr]: hour,
        [minuteAttr]: minute,
        [secondAttr]: second,
      })
    }
  },
  // 获取生日相关信息，倒计时等
  getBirthdayInfo(data) {
    // 若当天无生日退出方法
    const currentPackage = this.data.package;
    if (!(data.customerBirthday && currentPackage.birthdayPrice)) return {}
    const now = new Date()
    this.data.birthday_tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).valueOf()
    setTimeout(this.getBirthday_countdown, 1000)
    return {
      birthday_countdown: parseInt((this.data.birthday_tomorrow - now.valueOf()) / 1000)
    }
  },
  // 生日结束倒计时
  getBirthday_countdown() {
    this.$setData({
      birthday_countdown: --this.data.birthday_countdown
    })
    setTimeout(this.getBirthday_countdown, 1000)
  },
  // 获取评价
  getAssessment() {
    const goodsId = this.data.goodsId
    const goodsType = this.data.isProduct ? 'production' : 'service'
    const params = {
      goodsId,
      goodsType,
      pageNum: 1,
      pageSize: 2,
      tagId: -2 // -2:全部 -1:有图
    }
    return apiAction.getAssessment4GoodsDetail(params).then(data => {
      return {
        assessmentList: data.goodsOrderAssessmentInfos
      }
    }).catch(error => {
      return {}
    })
  },
  /**
   * 预览图片 
   */
  previewImage(e) {
    let current = e.currentTarget.dataset.current;
    const images = this.data.productInfo.productImage
    for (let i = 0; i < images.length; i++) {
      images[i] = util.getImageUrl(images[i])
    }
    wx.previewImage({
      current,
      urls: images
    })
  },

  /**
   * 控制选择套餐的显示和隐藏
   */
  setpackage() {
    this.$setData({
      flagpackage: true,
    })
  },

  // 选择套餐
  setCurrentPackage(e) {
    let currentPackage
    this.data.productInfo.packageList.forEach(v => {
      if (v.id == e.currentTarget.dataset.id) {
        v.selected = 1
        currentPackage = v
      } else {
        v.selected = 0
        v.count = 1
      }
    })
    this.$setData({
      package: currentPackage,
      'productInfo.packageList': this.data.productInfo.packageList
    });
    this.clickBuy('group');
  },

  // 选择套餐
  setCurrentPackage(e) {
    let currentPackage
    this.data.productInfo.packageList.forEach(v => {
      if (v.id == e.currentTarget.dataset.id) {
        v.selected = 1
        currentPackage = v
      } else {
        v.selected = 0
        v.count = 1
      }
    })
    this.$setData({
      package: currentPackage,
      'productInfo.packageList': this.data.productInfo.packageList
    });
    if (this.data.BUY_WAY == 'group') {
      this.clickBuy('group');
    }
  },

  // 加减数量
  changeAmount(e) {
    let count = e.detail
    this.$setData({
      'package.count': count
    })
  },

  /**
   * 确认选择哪个套餐
   */
  choosepackage() {
    this.data.hasChoosed = true
    this.$setData({
      flagpackage: false,
    })
    if (this.data.BUY_EVENT == 'buy') {
      this.clickBuy()
    } else if (this.data.BUY_EVENT == 'addShopCar') {
      this.addShopCar()
    } else if (this.data.BUY_EVENT == 'group') {
      this.clickGroupBuy({
        currentTarget: {
          dataset: {
            promotion: 'group'
          }
        }
      });
    }
  },

  /**
   * 点击预约
   */
  setservice() {
    if (!this.data.package.name) {
      wx.showToast({
        title: '亲，你还没有选择套餐哦',
        icon: 'none'
      })
      return
    }
    wx.removeStorageSync('appointment')
    let productInfo = this.data.productInfo
    let amount = 0;
    const currentPackage = this.data.package
    let specificationList = [{
      count: currentPackage.count,
      specificationId: currentPackage.id,
      serviceId: productInfo.id,
    }]
    amount = currentPackage.count * currentPackage.specialPrice
    util.addservice(specificationList, amount, this.data.productInfo.shopId)
    wx.navigateTo({
      url: '/pages/TC/pages/choosehair/choosehair?shopId=' + this.data.productInfo.shopId
    })
  },
  valiDataPhone() {

  },
  //显示拼团返现弹框
  showGroupModal() {
    this.$setData({ flagGroupModal: true })
  },
  //添加购物车
  addShopCar(e) {
    this.data.BUY_EVENT = 'addShopCar';
    app.getPhone().then(phone => {
      if (!phone) return;
      if (!this.data.hasChoosed) {
        return this.setpackage();
      }
      // 判断库存是否为0
      if (this.data.isProduct && this.data.package.stock == 0) {
        wx.showToast({
          title: '此商品该规格库存为0，换个规格吧~',
          icon: 'none'
        })
        return
      }
      const product = this.data.productInfo
      const currentPackage = this.data.package
      const specificationId = currentPackage.specificationId || currentPackage.id;
      let params = {
        brandId: product.shopInfo.brandId,
        goodsTypeScope: this.data.isProduct ? 'production' : 'service',
        number: currentPackage.count,
        operationType: 'add',
        specificationId: specificationId
      };
      apiAction.shoppingCartChange(params).then(res => {
        if (res.success) {
          this.getShopCartNumber();
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          })
        }
      })
    })
  },
  // 点击立即购买
  clickBuy(e) {
    this.data.BUY_EVENT = 'buy';
    app.getPhone().then(phone => {
      if (!phone) return;
      if (!this.data.hasChoosed) {
        this.$setData({ BUY_WAY: e ? e.currentTarget.dataset.promotion : '' });
        return this.setpackage();
      }
      // 判断库存是否为0
      if (this.data.isProduct && this.data.package.stock == 0) {
        wx.showToast({
          title: '此商品该规格库存为0，换个规格吧~',
          icon: 'none'
        })
        return
      }
      const product = this.data.productInfo
      const currentPackage = this.data.package
      const specificationId = currentPackage.id
      const couponSpecificationId = this.data.isProduct ? currentPackage.id : currentPackage.specificationId
      // 产品
      app.globalData.bill.type = this.data.isProduct ? 'goods' : 'service'
      app.globalData.bill.info = {
        storeId: product.storeId || product.shopId, // 产品 || 服务
        goodsId: product.productId || product.serviceId,
        snapshotId: product.snapshotId || product.id, // 服务详情接口下的id就是snapshotId
        title: product.title || product.serviceTitle,
        specificationName: currentPackage.name,
        specificationId: specificationId,
        couponSpecificationId: couponSpecificationId,
        specificationSnapshotId: currentPackage.snapshotId || currentPackage.id,
        price: currentPackage.price,
        specialPrice: (product.isNewCustomer && currentPackage.experiencePrice) ? currentPackage.experiencePrice : currentPackage.memberPrice ? currentPackage.memberPrice : currentPackage.specialPrice,
        expPriceActivityId: product.isNewCustomer ? currentPackage.expPriceActivityId : '',
        count: currentPackage.count,
        image: product.productImage[0],
      }
      console.log(currentPackage.specialPrice)
      // 有促销活动
      if (e) {
        if (e == 'group' || e.currentTarget.dataset.promotion) {
          const { promotion } = e.currentTarget.dataset;
          const { selectedTeamIndex } = this.data;
          const teamid = this.data.package.groupPurchaseTeamList[selectedTeamIndex] ? this.data.package.groupPurchaseTeamList[selectedTeamIndex].id : null;
          let promotionObj
          switch (promotion) {
            case 'group':
              promotionObj = {
                promotion,
                wholesale: true,
                ruleId: this.data.package.ruleId,
                specialPrice: this.data.package.groupPrice,
                teamId: teamid
              }
              break;
          }
          Object.assign(app.globalData.bill.info, promotionObj)
        }
      }
      this.hide();
      this.$route('/pages/TC/pages/order/order')
    })
  },
  clickGroupBuy(e) {
    this.data.BUY_EVENT = 'group';
    app.getPhone().then(phone => {
      if (!phone) return;
      if (!this.data.hasChoosed) {
        this.$setData({ BUY_WAY: e ? e.currentTarget.dataset.promotion : '' });
        return this.setpackage();
      }
      // 判断库存是否为0
      if (this.data.isProduct && this.data.package.stock == 0) {
        wx.showToast({
          title: '此商品该规格库存为0，换个规格吧~',
          icon: 'none'
        })
        return
      }
      const product = this.data.productInfo
      const currentPackage = this.data.package
      const specificationId = currentPackage.id
      const couponSpecificationId = this.data.isProduct ? currentPackage.id : currentPackage.specificationId
      // 产品
      app.globalData.bill.type = this.data.isProduct ? 'goods' : 'service'
      app.globalData.bill.info = {
        storeId: product.storeId || product.shopId, // 产品 || 服务
        goodsId: product.productId || product.serviceId,
        snapshotId: product.snapshotId || product.id, // 服务详情接口下的id就是snapshotId
        title: product.title || product.serviceTitle,
        specificationName: currentPackage.name,
        specificationId: specificationId,
        couponSpecificationId: couponSpecificationId,
        specificationSnapshotId: currentPackage.snapshotId || currentPackage.id,
        price: currentPackage.price,
        specialPrice: product.isNewCustomer ? currentPackage.experiencePrice : (currentPackage.memberPrice || currentPackage.specialPrice),
        expPriceActivityId: product.isNewCustomer ? currentPackage.expPriceActivityId : '',
        count: currentPackage.count,
        image: product.productImage[0],
      }
      // 有促销活动
      if (e) {
        if (e == 'group' || e.currentTarget.dataset.promotion) {
          const { promotion } = e.currentTarget.dataset;
          const { selectedTeamIndex } = this.data;
          const teamid = this.data.package.groupPurchaseTeamList[selectedTeamIndex] ? this.data.package.groupPurchaseTeamList[selectedTeamIndex].id : null;
          let promotionObj
          switch (promotion) {
            case 'group':
              promotionObj = {
                promotion,
                wholesale: true,
                ruleId: this.data.package.ruleId,
                specialPrice: this.data.package.groupPrice,
                teamId: teamid
              }
              break;
          }
          Object.assign(app.globalData.bill.info, promotionObj)
        }
      }
      this.hide();
      this.$route('/pages/TC/pages/order/order')
    })
  },
  // 分享画报
  sharePic() {
    const product = this.data.productInfo;
    this.$place('pic', {
      type: this.data.isProduct ? 'goods' : 'service',
      info: {
        goodsId: product.productId || product.serviceId,
        score: product.avgScore,
        title: product.title,
        shopName: product.name || product.shopName,
        city: product.shopCity || product.city,
        price: product.packageList[0].price,
        experiencePrice: product.packageList[0].experiencePrice ? product.packageList[0].experiencePrice : null,
        image: product.image,
        path: this.data.path
      }
    })
    this.$route('/pages/IC/pages/sharePic/sharePic')
    // 避免手机卡顿做个500ms延时
    setTimeout(() => {
      this.$setData({
        ifShowSharePop: false
      })
    }, 500)
  },

  // 隐藏弹框
  hide(e) {
    this.$setData({
      flagpackage: false,
      ifShowSharePop: false,
      ifShowGroup: false,
      flagGroupModal: false,
      flagServerTemp: false
    })
  },

  // 跳转评价列表
  jumpEvaluationList() {
    const query = {
      goodsId: this.data.goodsId,
      avgScore: this.data.productInfo.avgScore,
      goodAssessmentRate: this.data.productInfo.goodAssessmentRate,
      assessmentNum: this.data.productInfo.assessmentNum
    }
    if (this.data.isProduct) {
      query.isProduct = 1
    }
    this.$route('/pages/RC/pages/evaluationList/evaluationList', query)
  },
  /**
   * 点击加入购物车
   */
  addCart() {
    wx.navigateTo({
      url: '/pages/TC/pages/cart/cart'
    })
  },
  // 切换tab
  switchTab(e) {
    const index = e.detail.index
    this.$setData({
      currentTab: index
    })
    if (index == 1 && !this.data.works.list) {
      this.getWorks()
    }
  },
  // 获取相关作品
  getWorks() {
    const {
      currentPage,
      pageSize
    } = this.data.works
    const params = {
      goodsId: this.data.goodsId,
      goodsType: this.data.isProduct ? "production" : "service",
      currentPage,
      pageSize,
    }
    apiAction.getDynamic4Goods(params).then(data => {
      this.data.works.flag = false
      this.data.works.total = data.total
      if (data.weSimpleDynamicList && data.weSimpleDynamicList.length) {
        const list = currentPage == 1 ? data.weSimpleDynamicList : this.data.works.list.concat(data.weSimpleDynamicList)
        this.$setData({
          'works.list': list
        })
      } else {
        this.$setData({
          'works.list': []
        })
      }
    })
  },
  // 点击店铺信息去店铺详情
  toShopDetail() {
    this.$route('/pages/SC/pages/details/details', {
      id: this.data.productInfo.shopInfo.id
    })
  },
  // 点击phone图标打电话
  makephone() {
    wx.makePhoneCall({
      phoneNumber: this.data.productInfo.shopInfo.phone,
    })
  },
  collect() {
    const type = this.data.isProduct ? 'production' : 'service'
    const params = {
      goodsId: this.data.goodsId,
      goodsTypeEnum: type,
      collect: this.data.productInfo.collect
    }
    apiAction.brandCustomerCollectGoods(params).then(data => {
      if (data.success) {
        let title = this.data.productInfo.collect ? "已取消收藏" : "已收藏"
        wx.showToast({
          title,
        })
        this.$setData({
          'productInfo.collect': !this.data.productInfo.collect
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  //跳转购物车
  jumpShopCar() {
    wx.navigateTo({ url: '/pages/IC/pages/shopCar/shopCar' })
  },
  // 参团
  joinGroup(e) {
    this.$setData({
      ifShowGroup: true,
      selectedTeamIndex: null,
    })
  },
  // 去拼单
  setSelectedGroupTeam(e){
    let { remaintime} = e.currentTarget.dataset;
    if (remaintime <= 0){
      wx.showToast({
        title: '参团时间已到期',
        icon: 'none'
      });
      return
    }
    this.$setData({
      ifShowGroup: true,
      selectedTeamIndex: e.currentTarget.dataset.index
    })
  },
  prevent() { },
  onReachBottom() {
    if (this.data.currentTab == 1) {
      const {
        currentPage,
        pageSize,
        total,
        flag
      } = this.data.works
      if (flag) return
      if (currentPage * pageSize >= total) return
      this.data.works.flag = true
      this.data.works.currentPage++;
      this.getWorks()
    }
  }
})