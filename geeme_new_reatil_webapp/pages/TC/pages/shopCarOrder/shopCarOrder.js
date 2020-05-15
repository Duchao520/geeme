var apiAction = null, util = null, app = null;
Page({
  $name: 'order',
  data: {
    billType: null,
    shopCar: [],
    mobile: null,
    notes: '',
    appointmentId: 0,
    // 产品还是服务 true:产品 false:服务
    isProduct: false,
    // 产品或服务信息
    product: null,
    // 预约信息
    appointment: null,
    // 是否使用积分
    ifUsePoints: false,
    // 红包积分等额外信息
    extraInfo: null,
    ifShowSelectCard: false, // 是否显示选择身份卡弹框
    ifShowSelectRedPacket: false, // 是否显示选择红包弹框
    COUPON_SWITCHER: false,
    logo: null,
    cards: null, // 身份卡列表
    redPackets: null, // 可用红包列表
    redPackets_able: null,
    redPackets_unable: null, // 不可用红包列表
    redPacket_tab: 0,
    redPacketsTabs: ['可用红包', '不可用红包'],
    currentCard: null, // 选择的身份卡,
    currentRedPacket: null, // 选择的红包
    selfPickUp: true, // 是否门店自提
    addressInfo: null, // 物流配送地址信息
    ifShowCountDetail: false,  // 是否显示次卡、时间卡权益
    cardPower: null, // 次卡、时间卡权益明细
    submitOrderFlag: true,   //防止用户重复提交订单
    customerCouponInfoList: [],  //用户已领取该商品的优惠券
    customerCouponId: null,
    COUPON: null,
    POINTS_INFO: {
      allowed: false,                   //是否允许使用积分
      orderPointsUsePercent: null,       //订单抵扣百分比
      pointsValueMoney: null,           //每个积分抵扣金额
      userPoints: null,                 //用户当前剩余积分
      USE_POINTS_SWITCHER: false,       //用户使用积分开关
      MAX_USE_POINTS: 0,                //最多抵扣积分数
      USE_POINTS: 0,                    //抵扣积分
      POINTS_DISCOUNT_AMOUNT: 0         //积分抵扣金额
    }
  },
  computed: {
    //总价
    _totalPrice() {
      let total = 0,
        { shopCar, POINTS_INFO } = this.data,
        infoList = shopCar.infoList;
      if (infoList){
        if (this.data.currentCard) {
          for (const v of infoList) {
            total += v.discountPrice * v.number
          }
        } else {
          for (const v of infoList) {
            total += (v.memberPrice ? v.memberPrice : v.shopPrice) * v.number;
          }
        }
          
      }

      
      
      // if (this.data.product) {
      //   total = this.data.product.count * this.data.product.specialPrice

      //   // 若有选会员卡
      //   if (this.data.currentCard) {
      //     total = this.data.product.count * this.data.product.discountPrice
      //   }
      // } else if (this.data.appointment) {
        
      // } else if (this.data.bill && this.data.bill.info && this.data.bill.info.products) {
      //   if (this.data.currentCard) {
      //     for (const v of this.data.bill.info.products) {
      //       total += v.discountPrice * v.count
      //     }
      //   } else {
      //     for (const v of this.data.bill.info.products) {
      //       total += v.specialPrice * v.count
      //     }
      //   }
      // }
      // // 若有红包
      // if (this.data.currentRedPacket) {
      //   total -= this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketDetailInfo.packetMoney
      // }

      // //若有优惠券
      // if (COUPON) {
      //   let { money, useUnLimited, purchaseAboveMoney } = COUPON.couponTemplateSnapshot;
      //   if (useUnLimited) {                         //是否为无门槛券
      //     total -= money;
      //   } else {
      //     if (total >= purchaseAboveMoney) {     //是否满足满减
      //       total -= money;
      //     } else {
      //       this.setData({
      //         COUPON: null,
      //         customerCouponId: null
      //       })
      //     }
      //   }
      // }

      //判断积分
      if (POINTS_INFO.allowed) {
        POINTS_INFO.MAX_USE_POINTS = Math.ceil(util.AccDiv(util.AccMul(util.AccDiv(POINTS_INFO.orderPointsUsePercent, 100), total), POINTS_INFO.pointsValueMoney));
        POINTS_INFO.USE_POINTS = POINTS_INFO.userPoints > POINTS_INFO.MAX_USE_POINTS ? POINTS_INFO.MAX_USE_POINTS : POINTS_INFO.userPoints;
        POINTS_INFO.POINTS_DISCOUNT_AMOUNT = util.AccMul(POINTS_INFO.USE_POINTS, POINTS_INFO.pointsValueMoney);
        this.setData({ POINTS_INFO })
        if (POINTS_INFO.USE_POINTS_SWITCHER) {       //用户是否使用积分        
          total = total - POINTS_INFO.POINTS_DISCOUNT_AMOUNT
        }
      }

      if (total < 0) total = 0.01

      return total
    },
    _shop() {
      if (this.data.extraInfo) {
        return this.data.extraInfo.storeInfo
      }
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.data.shopCar = app.globalData.shopCar;
    util.PromiseAll([
      this.getUserInfo(),
      this.getProducts(options),
      this.getBrandCustomerPointsBillingInfo(),
      this.getBrand()
    ]).then(res => {
      Object.assign(res, {
        shopCar: this.data.shopCar
      })
      this.$setData(res);
    })
  },
  onUnload() {          //清内存
    app.globalData.bill = {};
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  getBrand() {
    return new Promise(resolve => {
      app.getBrand(brand => {
        resolve({ logo: brand.logo })
      })
    })
  },
  // 获取product或者appointment字段信息
  getProducts(options) {
    return this.showCards();
  },
  getBillingInfo() {
    const bill = app.globalData.bill
    const {
      goodsId,
      snapshotId,
      specificationId,
      specificationSnapshotId,
      storeId,
    } = bill.info
    let goodsType
    if (bill.type === 'goods') {
      goodsType = 1
    } else {
      goodsType = 0
    }
    const params = {
      goodsId,
      goodsSnapshotId: snapshotId,
      goodsSpecificationsId: specificationId,
      goodsSpecificationsSnapshotId: specificationSnapshotId,
      storeId,
      goodsType
    }
    return apiAction.getBillingInfo(params).then(data => {
      return { extraInfo: data }
    })
  },
  /**
   * 通过规格id请求规格的数据
   */
  getSpecificationInfoBySpecificationId(id) {
    return apiAction.getServiceInfoBySpecificationIdList([id]).then(data => {
      let product = app.globalData.bill.info
      let _specification = data.services[0]

      product.serviceTime = _specification.serverTime
      product.specificationName = _specification.specificationName
      return {
        product
      }
    })
  },
  /**
   * 通过预约Id请求规格数据
   */
  getSpecificationInfoByAppointmentId(appointmentId) {
    return apiAction.weGetAppointmentInfoById(appointmentId).then(data => {
      const products = []
      const services = data.serviceInfoForAppointments
      for (const v of services) {
        products.push({
          // serviceSpecificationsId: v.specificationId,
          serviceSpecificationsSnapshotId: v.specificationId,
          title: v.name,
          specificationName: v.specificationName,
          specialPrice: v.price,
          price: v.shopPrice,
          count: v.count,
          image: v.image,
          serviceTime: v.time
        })
      }
      const appointment = {
        storeId: data.shopId,
        serviceTime: data.dueTime,
        staffId: data.staffInfo.id,
        products
      }
      return {
        appointment
      }
    })
  },
  /**
   * 请求用户的手机号
   */
  getUserInfo() {
    return new Promise(resolve => {
      app.getPhone(phone => {
        resolve({ mobile: phone })
      })
    })
  },

  // 改变数量
  changeAmount(e) {
    const count = e.detail
    if (this.data.appointment) {
      const index = e.currentTarget.dataset.index
      let attr = `appointment.products[${index}].count`
      this.$setData({
        [attr]: count
      })
    } else {
      this.$setData({
        'product.count': count
      })
    }
  },
  // 弹出选择身份卡弹窗
  showCards() {
    wx.showLoading()
    const infoList = this.data.shopCar.infoList

    let params = {}
    params.storeId = infoList[0].storeId;
    params.listCountServiceInfo = []
    params.listCountProductInfo = []
    for (const v of infoList) {
      if (v.goodsTypeScope === 'service') {
        params.listCountServiceInfo.push({
          amount: v.number,
          serviceSpecificationsSnapshotId: v.snapshotId
        })
      } else {
        params.listCountProductInfo.push({
          amount: v.number,
          productSpecificationsSnapshotId: v.snapshotId
        })
      }
    }
    return apiAction.weappGetAllCardPayGoodsCountInfo(params).then(data => {
      wx.hideLoading()
      if (data.success) {
        const list1 = data.listIdentityGoodsCountInfo // 身份卡
        const list2 = data.listCardPayGoodsCountInfo  // 储值卡
        const list3 = data.listCountCardGoodsCountInfo  // 次卡
        const list4 = data.listTimeCardGoodsCountInfo // 时间卡
        if (!(list1 && list1.length) && !(list2 && list2.length) && !(list3 && list3.length) && !(list4 && list4.length)) {
          wx.showToast({
            title: '您没有会员卡哦',
            icon: 'none'
          })
          return {}
        } else {
          const list = []

          if (list2 && list2.length) {
            for (const v of list2) {
              v.cardType = 1
            }
            list.push(...list2)
          }

          if (list3 && list3.length) {
            for (const v of list3) {
              v.cardType = 2
            }
            list.push(...list3)
          }

          if (list4 && list4.length) {
            for (const v of list4) {
              v.cardType = 3
            }
            list.push(...list4)
          }

          if (list1 && list1.length) {
            for (const v of list1 || []) {
              v.cardType = 0
            }
            list.push(...list1)
          }

          return {
            cards: list,
            ifShowSelectCard: true
          }
        }
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
        return {}
      }
    })
  },
  show() {
    this.showCards().then(res => {
      this.$setData(res);
    })
  },
  switchRedPackets(e) {
    const index = e.detail.index
    this.$setData({
      redPackets: index == 0 ? this.data.redPackets_able : this.data.redPackets_unable,
      redPacket_tab: index
    })
  },
  // 请求红包信息
  fetchRedPacket(e) {
    wx.$showLoading()
    const infoList = this.data.shopCar.infoList

    const params = {}

    params.storeId = '59'
    params.listCountServiceInfo = []
    params.listCountProductInfo = []
    for (const v of infoList) {
      if (v.goodsTypeScope === 'service') {
        params.listCountServiceInfo.push({
          amount: v.number,
          serviceSpecificationsSnapshotId: v.snapshotId
        })
      } else {
        params.listCountProductInfo.push({
          amount: v.number,
          productSpecificationsSnapshotId: v.snapshotId
        })
      }
    }
    // 若选择了会员卡，则传会员卡id
    if (this.data.currentCard) {
      params.customerCardId = this.data.currentCard.customerCardId
    }

    apiAction.getRedPacketPayGoodsCount(params).then(data => {
      wx.$hideLoading()
      if (data.success) {
        // 如果是点击事件，则弹框
        if (e && e.currentTarget.dataset.popup) {
          if (!data.listRedPacketCountGoodsInfo || !data.listRedPacketCountGoodsInfo.length) {
            wx.showToast({
              title: '您没有可用红包哦',
              icon: 'none'
            })
          } else {
            const able = []
            const unable = []
            for (const v of data.listRedPacketCountGoodsInfo) {
              if (v.canUse) {
                able.push(v)
              } else {
                unable.push(v)
              }
            }
            this.data.redPacketsTabs[0] = `可用红包(${able.length})`
            this.data.redPacketsTabs[1] = `不可用红包(${unable.length})`
            this.$setData({
              redPackets: able,
              redPackets_able: able,
              redPackets_unable: unable,
              ifShowSelectRedPacket: true,
              redPacketsTabs: this.data.redPacketsTabs,
              redPacket_tab: 0
            })
          }
          // 如果不是点击事件，则是选择会员卡后判断当前红包还能不能继续使用
        } else {
          for (const v of data.listRedPacketCountGoodsInfo) {
            // 若当前红包还能用则不做操作
            if (v.customerRedPacketInfo.customerRedPacketId == this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketId && v.canUse) {
              return
              // 否则当前红包为null
            } else {
              this.$setData({
                currentRedPacket: null
              })
              wx.showToast({
                title: '当前红包不满足使用条件',
                icon: 'none'
              })
            }
          }
        }
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  // 选择会员卡
  setCurrentCard(e) {
    const item = e.currentTarget.dataset.item
    let { shopCar} = this.data;
    // 若会员卡无法使用，终止函数
    if (!item.canPay) return
    // 判断是否为取消当前会员卡
    if (this.data.currentCard && this.data.currentCard.customerCardId == item.customerCardId) {
      return this.$setData({
        currentCard: null
      })
    }
    for (const a of shopCar.infoList) {
      if (a.goodsTypeScope == 'production'){
        for (const b of item.listProductCardDiscountInfo) {
          if (a.snapshotId == b.productSpecificationsSnapshotId) {
            a.discountPrice = b.finalUnitPrice ? b.finalUnitPrice : a.price * b.discount
          }
        }
      }else{
        for (const b of item.listServiceCardDiscountInfo) {
          if (a.snapshotId == b.serviceSpecificationsSnapshotId) {
            a.discountPrice = b.finalUnitPrice ? b.finalUnitPrice : a.price * b.discount
          }
        }
      }
    }
    this.$setData({
      shopCar: shopCar,
      currentCard: item
    })
  },
  // 确认选择
  selectCurrentCard() {
    this.$setData({
      ifShowSelectCard: false
    })
    // 若当前选择了红包，则判断该红包是否可用
    if (this.data.currentRedPacket) {
      this.fetchRedPacket()
    }
  },
  // 选择红包
  setCurrentRedPacket(e) {
    const item = e.currentTarget.dataset.item
    if (this.data.currentRedPacket && this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketId == item.customerRedPacketInfo.customerRedPacketId) {
      this.$setData({
        currentRedPacket: null
      })
    } else {
      this.$setData({
        currentRedPacket: item,
        COUPON: null,
        customerCouponId: null
      })
    }
  },
  // 隐藏选择身份卡弹窗
  hideCards(e) {
    this.$setData({
      ifShowSelectCard: false,
    })
  },
  // 隐藏选择红包弹框
  hideRedPackets(e) {
    this.$setData({
      ifShowSelectRedPacket: false,
    })
  },
  // 设置备注
  setNotes(e) {
    this.data.notes = e.detail.value
  },
  // 提交订单
  submitOrder() {
    if (!this.data.submitOrderFlag) {    //判断是否连续提交订单
      return;
    }
    const billInfo = app.globalData.bill.info;
    const product = this.data.product;
    let { COUPON } = this.data;
    const query = {
      phone: this.data.mobile,
      remark: this.data.notes
    }

    // 如果选择了会员卡
    if (this.data.currentCard) {
      const card = this.data.currentCard
      if (card.cardType == 0) {
        query.identityCardId = card.customerCardId
      } else if (card.cardType == 1) {
        query.prepaidCardId = card.customerCardId
      } else if (card.cardType == 2) {
        query.countCardId = card.customerCardId
      } else if (card.cardType == 3) {
        query.timeCardId = card.customerCardId
      }
    }

    // // 如果选择了红包
    // if (this.data.currentRedPacket) {
    //   query.customerRedPacketId = this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketId
    // }

    let other = {
      listServiceBillInfo: [],
      listProductBillInfo: [],
      fromShoppingCart:  true,
      online: true,
      pointsDeductMoney: this.data.POINTS_INFO.POINTS_DISCOUNT_AMOUNT,
      usePoints: this.data.POINTS_INFO.USE_POINTS_SWITCHER, //是否使用积分抵扣
      usePointsNum: this.data.POINTS_INFO.USE_POINTS,
      storeId: this.data.shopCar.infoList[0].storeId,
      channel: 'ONLINE',
      channelId: 0
    }
    for (const v of this.data.shopCar.infoList) {
      if (v.goodsTypeScope == 'service'){
        other.listServiceBillInfo.push({
          amount: v.number,
          remark: query.remark,
          serviceId: v.serviceId,
          serviceSpecificationsId: v.id,
          serviceSpecificationsSnapshotId: v.snapshotId,
          useIntegralDeduction: false
        })
      }else{
        other.listProductBillInfo.push({
          amount: v.number,
          remark: query.remark,
          productId: v.productId,
          productSpecificationsId: v.id,
          productSpecificationsSnapshotId: v.snapshotId,
          useIntegralDeduction: false
        })
      }
    }
    Object.assign(query, other)
    // 如果有促销活动
    // if (this.data.bill.info && this.data.bill.info.promotion) {
    //   let promotion
    //   switch (this.data.bill.info.promotion) {
    //     case 'group':
    //       const { wholesale, ruleId, teamId } = app.globalData.bill.info
    //       Object.assign(query, { wholesale, ruleId, teamId })
    //       break;
    //   }
    // }

    this.createBill(query)
  },
  // 创建订单（总）
  createBill(query) {
    let promise

    this.$setData({
      submitOrderFlag: false
    })
    promise = apiAction.weappCreateTotalBill(query)

    let billingType, customerCardId
    if (this.data.currentCard && this.data.currentCard.cardType != 0) {
      billingType = 1
      customerCardId = this.data.currentCard.customerCardId
    } else {
      billingType = 0
    }
    promise.then(data => {
      this.$setData({
        submitOrderFlag: true
      })
      if (data.success) {
        app.globalData.bill.info = {
          billId: data.billId,
          totalCharge: data.totalCharge,
          products: this.data.shopCar.infoList,
          storeId: 59,
          finalTotalCharge: data.finalTotalCharge,
          billingType,
          customerCardId
        }
        if (this.data.shopCar.infoList[0].goodsTypeScope == 'production'){
          app.globalData.bill.type = 'goods'
        }else{
          app.globalData.bill.type = 'service'
        }
        this.$route('/pages/TC/pages/orderpay/orderpay')
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    }).catch(error => {
      this.$setData({
        submitOrderFlag: true
      })
    })
  },
  // 产品订单切换门店提货与物流配送
  setSelfPickUp(e) {
    const value = e.currentTarget.dataset.value
    if (!this.data.addressInfo) {
      this.$on('selectAddress', this.updateAddressInfo)
      apiAction.shippingAddressGetDefault().then(data => {
        this.$setData({
          addressInfo: data.addressInfo,
          selfPickUp: value
        })
      })
    } else {
      this.$setData({
        selfPickUp: value
      })
    }
  },
  jumpShippingAddress() {
    this.$route('/pages/UIC/pages/shippingAddress/shippingAddress', {
      address: JSON.stringify(this.data.addressInfo)
    })
  },
  updateAddressInfo(address) {
    this.$setData({
      addressInfo: address
    })
  },
  // 展示次卡、时间卡权益明细
  showCountDetail(e) {
    const item = e.currentTarget.dataset.item
    this.$setData({
      ifShowCountDetail: true,
      cardPower: item.listServiceCountInfo
    })
  },
  //获取用户已领取的优惠券
  getBrandCustomerCouponsByGoodsId() {
    const bill = app.globalData.bill
    const count = this.data.product.count;
    const { goodsId, storeId, couponSpecificationId } = this.data.product
    let params = { goodsId, storeId, specificationId: couponSpecificationId, amount: count };
    if (this.data.currentCard) {
      params.customerCardId = this.data.currentCard.customerCardId
    }
    if (bill.type === 'goods') {
      params.goodsTypeScope = 'production'
    } else {
      params.goodsTypeScope = 'service'
    };
    apiAction.getBrandCustomerCouponsByGoodsId(params).then(res => {
      let { customerCouponInfoList } = res;
      this.$setData({
        customerCouponInfoList,
        COUPON_SWITCHER: true
      })
    })
  },
  getBrandCustomerPointsBillingInfo() {
    const bill = app.globalData.bill;
    let pointsUseScenes, storeId = wx.$getStorage('storeId'), { POINTS_INFO } = this.data;
    if (bill.type == 'goods' || bill.type == 'service') {
      pointsUseScenes = 1;
    } else {
      pointsUseScenes = 2;
    }
    let params = {
      pointsUseScenes, storeId
    };
    return apiAction.getBrandCustomerPointsBillingInfo(params).then(res => {
      if (res.success) {
        Object.assign(POINTS_INFO, {
          allowed: res.allowed,
          orderPointsUsePercent: res.orderPointsUsePercent,
          pointsValueMoney: res.pointsValueMoney,
          userPoints: res.userPoints
        })
      }
      return { POINTS_INFO }
    })
  },
  //切换积分开关
  pointsSwitcherEvent(e) {
    let value = e.detail.value,
      { POINTS_INFO } = this.data;
    POINTS_INFO.USE_POINTS_SWITCHER = value;
    this.$setData({ POINTS_INFO })
  },
  showCoupon() {
    this.getBrandCustomerCouponsByGoodsId()
  },
  hideCoupon() {
    this.$setData({
      COUPON_SWITCHER: false
    })
  },
  chooseCoupon(e) {
    let { coupon } = e.currentTarget.dataset;
    if (coupon.id == this.data.customerCouponId) {
      this.$setData({
        COUPON: null,
        customerCouponId: null
      })
    } else {
      this.$setData({
        COUPON: coupon,
        customerCouponId: coupon.id,
        currentRedPacket: null
      })
    }
  }
})