var apiAction = null, util = null, app = null;
Page({
  $name:'order',
  data: {
    billType: null,
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
    ifShowCountDetail:false,  // 是否显示次卡、时间卡权益
    cardPower:null, // 次卡、时间卡权益明细
    submitOrderFlag: true,   //防止用户重复提交订单
    customerCouponInfoList: [],  //用户已领取该商品的优惠券
    customerCouponId: null,
    COUPON: null,
    POINTS_INFO: {
      allowed: false,                   //是否允许使用积分
      orderPointsUsePercent:null,       //订单抵扣百分比
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
        { COUPON, product, POINTS_INFO} = this.data;
      if (this.data.product) {
        total = this.data.product.count * this.data.product.specialPrice
        
        // 若有选会员卡
        if (this.data.currentCard) {
          total = this.data.product.count * this.data.product.discountPrice
        }
      } else if (this.data.appointment) {
        if (this.data.currentCard) {
          for (const v of this.data.appointment.products) {
            total += v.discountPrice * v.count
          }
        } else {
          for (const v of this.data.appointment.products) {
            total += v.specialPrice * v.count
          }
        }
      } else if (this.data.bill && this.data.bill.info && this.data.bill.info.products){
        if (this.data.currentCard) {
          for (const v of this.data.bill.info.products) {
            total += v.discountPrice * v.count
          }
        } else {
          for (const v of this.data.bill.info.products) {
            total += v.specialPrice * v.count
          }
        }
      }
      // 若有红包
      if(this.data.currentRedPacket){
        total -= this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketDetailInfo.packetMoney
      }

      //若有优惠券
      if(COUPON){
        let { money, useUnLimited, purchaseAboveMoney } = COUPON.couponTemplateSnapshot;
        if (useUnLimited) {                         //是否为无门槛券
          total -= money;
        }else{
          if (total >= purchaseAboveMoney) {     //是否满足满减
            total-= money;
          }else{
            this.setData({
              COUPON: null,
              customerCouponId: null
            })
          }
        }
      }

      //判断积分
      if (POINTS_INFO.allowed){
        POINTS_INFO.MAX_USE_POINTS = Math.ceil(util.AccDiv(util.AccMul(util.AccDiv(POINTS_INFO.orderPointsUsePercent, 100), total), POINTS_INFO.pointsValueMoney));
        POINTS_INFO.USE_POINTS = POINTS_INFO.userPoints > POINTS_INFO.MAX_USE_POINTS ? POINTS_INFO.MAX_USE_POINTS : POINTS_INFO.userPoints;
        POINTS_INFO.POINTS_DISCOUNT_AMOUNT = util.AccMul(POINTS_INFO.USE_POINTS , POINTS_INFO.pointsValueMoney);
        this.setData({ POINTS_INFO })
        if (POINTS_INFO.USE_POINTS_SWITCHER) {       //用户是否使用积分        
          total = total - POINTS_INFO.POINTS_DISCOUNT_AMOUNT
        }
      }
      

      console.log(total)
      if(total < 0) total = 0.01

      return total
    },
    _shop() {
      if (this.data.extraInfo) {
        return this.data.extraInfo.storeInfo
      }
    }
  },
  onLoad(options) {
    console.log(options)
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    if(this.data.billType === 'bill'){
      wx.setNavigationBarTitle({
        title: '确认账单',
      })
    }
    this.data.billType = app.globalData.bill.type;
    this.data.bill = Object.assign({}, app.globalData.bill)
    console.log(this.data.bill)
    util.PromiseAll([
      this.getUserInfo(),
      this.getProducts(options),
      this.getBrandCustomerPointsBillingInfo(),
      this.getBrand()
    ]).then(res => {
      Object.assign(res, {
        billType: app.globalData.bill.type,
        bill: Object.assign({}, app.globalData.bill)
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
  reset(res){
    this.setData(res)
  },
  getBrand(){
    return new Promise(resolve => {
      app.getBrand(brand => {
        resolve({logo: brand.logo})
      })
    })
  },
  // 获取product或者appointment字段信息
  getProducts(options) {
    const bill = app.globalData.bill
    switch (bill.type) {
      case 'goods':
        return util.PromiseAll([this.getBillingInfo(),this.showCards()]).then(res => {
          Object.assign(res, {
            product: bill.info,
            isProduct: true,
          })
          return res;
        })
      case 'service':
        let promiseProduct = this.getSpecificationInfoBySpecificationId(bill.info.specificationId).then(product => {
          return this.showCards().then(res => {
            Object.assign(res,product);
            return res;
          });
        });
        return util.PromiseAll([promiseProduct,this.getBillingInfo()])
      case 'appointment':
        this.data.appointmentId = options.appointmentId
        return this.getSpecificationInfoByAppointmentId(options.appointmentId).then(appoint => {
          this.data.appointment = appoint.appointment;
          return this.showCards().then(res => {
            Object.assign(res, appoint);
            return res;
          });
        });
      case 'bill':
        if(!bill.info.isCard){
          return this.showCards()
        }else{
          return Promise.resolve({});
        }
      default:
        return Promise.resolve({});
    }
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
    } else{
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
      return {extraInfo: data} 
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
          specialPrice:v.price,
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
        resolve({mobile: phone})
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
    if (this.data.bill.info && this.data.bill.info.promotion) return Promise.resolve({}) // 有促销活动（暂时只有拼团）不能选会员卡

    wx.showLoading()
    const bill = this.data.bill

    const params = {}
    switch (bill.type) {
      case 'goods':
        params.storeId = bill.info.storeId
        params.listCountProductInfo = [{
          amount: bill.info.count,
          productSpecificationsId: bill.info.specificationId,
          productSpecificationsSnapshotId: bill.info.specificationSnapshotId,
        }]
        break;
      case 'service':
        params.storeId = bill.info.storeId
        params.listCountServiceInfo = [{
          amount: bill.info.count,
          serviceSpecificationsId: bill.info.specificationId,
          serviceSpecificationsSnapshotId: bill.info.specificationSnapshotId,
        }]
        break;
      case 'appointment':
        params.storeId = this.data.appointment.storeId
        params.listCountServiceInfo = []
        for (const v of this.data.appointment.products) {
          params.listCountServiceInfo.push({
            amount: v.count,
            serviceSpecificationsSnapshotId: v.serviceSpecificationsSnapshotId
          })
        }
        break;
      case 'bill':
        params.storeId = this.data.bill.info.storeId
        params.listCountServiceInfo = []
        params.listCountProductInfo = []
        for (const v of this.data.bill.info.products) {
          if(v.type === 'service'){
            params.listCountServiceInfo.push({
              amount: v.count,
              serviceSpecificationsSnapshotId: v.snapshotId
            })
          }else{
            params.listCountProductInfo.push({
              amount: v.count,
              productSpecificationsSnapshotId: v.snapshotId
            })
          }
        }
        break;
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
              if(this.data.billType != 'bill'){
                v.canPay = false
                v.errorMessage = '只能在结算消费账单时使用次卡、时间卡'
              }
            }
            list.push(...list3)
          }

          if (list4 && list4.length){
            for(const v of list4){
              v.cardType = 3
              if (this.data.billType != 'bill') {
                v.canPay = false
                v.errorMessage = '只能在结算消费账单时使用次卡、时间卡'
              }
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
  show(){
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
    const bill = this.data.bill

    const params = {}
    switch (bill.type) {
      case 'goods':
        params.storeId = bill.info.storeId
        params.listCountProductInfo = [{
          amount: bill.info.count,
          productSpecificationsId: bill.info.specificationId,
          productSpecificationsSnapshotId: bill.info.specificationSnapshotId,
        }]
        break;
      case 'service':
        params.storeId = bill.info.storeId
        params.listCountServiceInfo = [{
          amount: bill.info.count,
          serviceSpecificationsId: bill.info.specificationId,
          serviceSpecificationsSnapshotId: bill.info.specificationSnapshotId,
        }]
        break;
      case 'appointment':
        params.storeId = this.data.appointment.storeId
        params.listCountServiceInfo = []
        for (const v of this.data.appointment.products) {
          params.listCountServiceInfo.push({
            amount: v.count,
            serviceSpecificationsSnapshotId: v.serviceSpecificationsSnapshotId
          })
        }
        break;
      case 'bill':
        params.storeId = this.data.bill.info.storeId
        params.listCountServiceInfo = []
        params.listCountProductInfo = []
        for (const v of this.data.bill.info.products) {
          if (v.type === 'service') {
            params.listCountServiceInfo.push({
              amount: v.count,
              serviceSpecificationsSnapshotId: v.snapshotId
            })
          } else {
            params.listCountProductInfo.push({
              amount: v.count,
              productSpecificationsSnapshotId: v.snapshotId
            })
          }
        }
        break;
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
            }else{
              this.$setData({
                currentRedPacket:null
              })
              wx.showToast({
                title: '当前红包不满足使用条件',
                icon:'none'
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
    // 若会员卡无法使用，终止函数
    if (!item.canPay) return
    // 判断是否为取消当前会员卡
    if (this.data.currentCard && this.data.currentCard.customerCardId == item.customerCardId){
      return this.$setData({
        currentCard:null
      })
    }
    if (this.data.billType == 'appointment') {
      outer: for (const a of this.data.appointment.products) {
        if (item.listServiceCardDiscountInfo){
          for (const b of item.listServiceCardDiscountInfo) {
            if (a.serviceSpecificationsSnapshotId == b.serviceSpecificationsSnapshotId) {
              a.discountPrice = b.finalUnitPrice ? b.finalUnitPrice : a.price * b.discount
              continue outer;
            }
          }
        }
        
      }
      this.$setData({
        currentCard: item,
        appointment: this.data.appointment
      })
    } else if (this.data.billType == 'bill'){
      outer: for (const a of this.data.bill.info.products) {
        if (item.listProductCardDiscountInfo){
          for (const b of item.listProductCardDiscountInfo) {
            if (a.type === 'production' && a.snapshotId == b.productSpecificationsSnapshotId) {
              a.discountPrice = b.finalUnitPrice ? b.finalUnitPrice : a.price * b.discount
              continue outer;
            }
          }
        }
        if (item.listServiceCardDiscountInfo){
          for (const b of item.listServiceCardDiscountInfo) {
            if (a.type === 'service' && a.snapshotId == b.serviceSpecificationsSnapshotId) {
              a.discountPrice = b.finalUnitPrice ? b.finalUnitPrice : a.price * b.discount
              continue outer;
            }
          }
        }
        

        
      }
      this.$setData({
        currentCard: item,
        bill: this.data.bill
      })
    }else {
      let list = this.data.isProduct ? item.listProductCardDiscountInfo : item.listServiceCardDiscountInfo
      this.data.product.discountPrice = list[0].finalUnitPrice ? list[0].finalUnitPrice : this.data.product.price * list[0].discount
      this.$setData({
        product: this.data.product,
        currentCard: item
      })
    }
  },
  // 确认选择
  selectCurrentCard(){
    this.$setData({
      ifShowSelectCard:false
    })
    // 若当前选择了红包，则判断该红包是否可用
    if (this.data.currentRedPacket) {
      this.fetchRedPacket()
    }
  },
  // 选择红包
  setCurrentRedPacket(e) {
    const item = e.currentTarget.dataset.item
    if (this.data.currentRedPacket && this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketId == item.customerRedPacketInfo.customerRedPacketId){
      this.$setData({
        currentRedPacket:null
      })
    }else{
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
    if (!this.data.submitOrderFlag){    //判断是否连续提交订单
      return;
    }
    const billInfo = app.globalData.bill.info;
    const product = this.data.product;
    let {COUPON} = this.data;
    const query = {
      phone: this.data.mobile,
      remark: this.data.notes,
      pointsDeductMoney: this.data.POINTS_INFO.POINTS_DISCOUNT_AMOUNT, 
      usePoints: this.data.POINTS_INFO.USE_POINTS_SWITCHER, //是否使用积分抵扣
      usePointsNum: this.data.POINTS_INFO.USE_POINTS
    }

    // 如果选择了会员卡
    if (this.data.currentCard) {
      const card = this.data.currentCard
      if (card.cardType == 0) {
        query.identityCardId = card.customerCardId
      }else if(card.cardType == 1){
        query.prepaidCardId = card.customerCardId
      }else if(card.cardType == 2){
        query.countCardId = card.customerCardId
      }else if(card.cardType == 3){
        query.timeCardId = card.customerCardId
      }
    }

    // 如果选择了红包
    if (this.data.currentRedPacket) {
      query.customerRedPacketId = this.data.currentRedPacket.customerRedPacketInfo.customerRedPacketId
    }

    let other
    switch (app.globalData.bill.type) {
      case 'goods':
        other = {
          amount: product.count,
          storeId: product.storeId,
          productId: product.goodsId,
          productSnapshotId: product.snapshotId,
          productSpecificationsId: product.specificationId,
          productSpecificationsSnapshotId: product.specificationSnapshotId,
          customerCouponId: COUPON ? COUPON.id : '',
          expPriceActivityId: billInfo.expPriceActivityId ? billInfo.expPriceActivityId : '',
          selfPickUp: this.data.selfPickUp,
        }
        if (!other.selfPickUp) {
          const address = this.data.addressInfo
          other.consignee = address.name
          other.consigneePhone = address.mobile
          other.consigneeAddress = address.province + address.city + address.district + address.address
        }
        break;
      case 'service':
        other = {
          amount: product.count,
          storeId: product.storeId,
          serviceId: product.goodsId,
          serviceSpecificationsId: product.specificationId,
          expPriceActivityId: billInfo.expPriceActivityId ? billInfo.expPriceActivityId : '',
          customerCouponId: COUPON ? COUPON.id : '',
          serviceSpecificationsSnapshotId: product.specificationSnapshotId
        }
        break;
      case 'appointment':
        const {
          serviceTime,
          staffId,
          storeId
        } = this.data.appointment
        other = {
          listServiceBillInfo: [],
          serviceTime,
          staffId,
          storeId,
          online: true,
          channel: 'APPOINTMENT',
          channelId: this.data.appointmentId,
        }
        for (const v of this.data.appointment.products) {
          other.listServiceBillInfo.push({
            amount: v.count,
            remark: query.remark,
            // serviceSpecificationsId: v.serviceSpecificationsId,
            serviceSpecificationsSnapshotId: v.serviceSpecificationsSnapshotId,
            useIntegralDeduction: false
          })
        }
        break;
      case 'bill':
        other = {
          consumerOrderId: this.data.bill.info.consumerOrderId
        }
        if(billInfo.customerCardId) {
          other.prepaidCardId = billInfo.customerCardId
        }
        break;
    }
    Object.assign(query, other)
    // 如果有促销活动
    if (this.data.bill.info && this.data.bill.info.promotion){
      let promotion
      switch (this.data.bill.info.promotion){
        case 'group':
          const {wholesale, ruleId, teamId} = app.globalData.bill.info
          Object.assign(query, { wholesale, ruleId, teamId})
          break;
      }
    }

    this.createBill(query)
  },
  // 创建订单（总）
  createBill(query) {
    let promise

    this.$setData({
      submitOrderFlag: false
    })
    const type = app.globalData.bill.type
    const billInfo = app.globalData.bill.info;
    switch (type) {
      case 'goods':
        promise = apiAction.createProductBill(query)
        break;
      case 'service':
        promise = apiAction.createServiceBill(query)
        break;
      case 'appointment':
        promise = apiAction.weappCreateTotalBill(query)
        break;
      case 'bill':
        promise = apiAction.weSettleConsumerOrder(query)
        break;
    }

    let billingType, customerCardId = null
    if (this.data.currentCard && this.data.currentCard.cardType != 0) {
      billingType = 1
      customerCardId = this.data.currentCard.customerCardId
    } else if (billInfo && billInfo.customerCardId){
      billingType = 1
      customerCardId = billInfo.customerCardId
    } else {
      billingType = 0
    }
    if (type == 'goods' || type == 'service') {
      const product = this.data.product
      const {storeId, promotion,goodsId,image} = app.globalData.bill.info
      promise.then(data => {
        this.$setData({
          submitOrderFlag: true
        })
        if (data.success) {
          app.globalData.bill.info = {
            billId: data.billId,
            totalCharge: data.totalCharge,
            title: product.title,
            count: product.count,
            storeId,
            promotion,
            finalTotalCharge: data.finalTotalCharge,
            billingType,
            customerCardId: customerCardId ? customerCardId : '',
            goodsId,
            thumb: image
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
    } else if (type == 'appointment') {
      promise.then(data => {
        this.$setData({
          submitOrderFlag: true
        })
        if (data.success) {
          app.globalData.bill.info = {
            billId: data.billId,
            totalCharge: data.totalCharge,
            products: this.data.appointment.products,
            storeId: this.data.appointment.storeId,
            finalTotalCharge: data.finalTotalCharge,
            billingType,
            customerCardId: customerCardId ? customerCardId : '',
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
    } else if(type == 'bill'){
      promise.then( data => {
        this.$setData({
          submitOrderFlag: true
        })
        if (data.success) {
          app.globalData.bill.info = {
            billNo: data.billNo,
            totalCharge: data.totalCharge,
            products: this.data.bill.info.products,
            storeId: this.data.bill.info.storeId,
            finalTotalCharge: this.data._totalPrice,
            billingType,
            customerCardId
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
    }
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
  getBrandCustomerCouponsByGoodsId(){
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
      let { customerCouponInfoList} = res;
      this.$setData({
        customerCouponInfoList,
        COUPON_SWITCHER: true
      })
    })
  },
  getBrandCustomerPointsBillingInfo(){
    const bill = app.globalData.bill;
    let pointsUseScenes,storeId = wx.$getStorage('storeId'),{POINTS_INFO} = this.data;
    if (bill.type == 'goods' || bill.type == 'service'){
      pointsUseScenes = 1;
    }else{
      pointsUseScenes = 2;
    }
    let params = {
      pointsUseScenes, storeId
    };
    return apiAction.getBrandCustomerPointsBillingInfo(params).then(res => {
      if(res.success){
        Object.assign(POINTS_INFO, {
          allowed: res.allowed,
          orderPointsUsePercent: res.orderPointsUsePercent,
          pointsValueMoney: res.pointsValueMoney,
          userPoints: res.userPoints
        })
      }
      return { POINTS_INFO}
    })
  },
  //切换积分开关
  pointsSwitcherEvent(e){
    let value = e.detail.value,
        {POINTS_INFO} = this.data;
    POINTS_INFO.USE_POINTS_SWITCHER = value;
    this.$setData({POINTS_INFO})
  },
  showCoupon(){
    this.getBrandCustomerCouponsByGoodsId()
  },
  hideCoupon(){
    this.$setData({
      COUPON_SWITCHER: false
    })
  },
  chooseCoupon(e){
    let { coupon } = e.currentTarget.dataset;
    if (coupon.id == this.data.customerCouponId){
      this.$setData({
        COUPON: null,
        customerCouponId: null
      })
    }else{
      this.$setData({
        COUPON: coupon,
        customerCouponId: coupon.id,
        currentRedPacket: null
      })
    }
  }
})