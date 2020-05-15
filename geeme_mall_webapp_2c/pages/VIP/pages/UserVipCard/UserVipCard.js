 // pages/UIC/pages/vipCard/vipCard.js
var apiAction = null, util = null, app = null;
 Page({
   data: {
     current: 0,
     /* <充值组件中的数据> */
     flagRecharge: false, // 组件是否显示
     rechargeRules: null, //会员卡充值规则
     /* </充值组件中的数据> */
     /* <支付组件中的数据> */
     flagPay: false,
     rechargeNum: null,
     /* </支付组件中的数据> */
     logo: null,
     list: [],
     ifShowInstruction: false,
     ifShowNote: false,
     ifShowDiscountDetail: false, // 显示折扣权益明细
     ifShowCountDetail: false, // 显示可用服务次数
   },
   computed: {
     currentCard() {
       if (this.data.list && this.data.current + 1 <= this.data.list.length) {
         return this.data.list[this.data.current]
       } else {
         return null
       }
     },
     validTime() {
       if (this.data.list && this.data.current + 1 <= this.data.list.length) {
         const currentCard = this.data.list[this.data.current]
         const date = new Date(currentCard.finishTime)
         return `${date.getFullYear()}年${util.formatNumber(date.getMonth() + 1)}月${util.formatNumber(date.getDate())}日`
       } else {
         return null
       }
     }
   },
   onLoad() {
     apiAction = require('../../../../utils/apiAction.js');
     util = require('../../../../utils/util.js');
     app = getApp();
     app.getPhone(() => {
       let promiseArr = [this.fetch(),this.getBrand()];
       util.PromiseAll(promiseArr).then(res => {
         this.$setData(res);
         return res;
       })
     })
   },
   onUnload() {          //清内存
     apiAction = null;
     util = null;
     app = null;
     this.data = null;
   },
   getBrand(){
     return new Promise(resolve => {
       app.getBrand(brand => {
         resolve({
           logo: brand.logo
         })
       })
     })
   },
   fetch() {
     return apiAction.weappGetBrandCustomerCard().then(data => {
       if (data.listCustomerCardDetail && data.listCustomerCardDetail.length) {
         return {
           list: data.listCustomerCardDetail
         }
       } else {
         return {
           list: null
         }
       }
     })
   },
   /**
    * 轮播图change事件(输出当前是第几张)
    */
   change(e) {
     let current = e.detail.current;
     this.$setData({
       current
     })
   },
   /**
    * 跳转会员卡管理
    */
   onTapCardSystem(e) {
     console.log(e)
     this.$route('../VipCardManagement/VipCardManagement', e.currentTarget.dataset.item)
   },
   /**
    * 跳转会员卡详情
    */
   jumpVipCardDetail() {
     wx.navigateTo({
       url: '/pages/VIP/pages/VipCardDetail/VipCardDetail'
     })
   },

   /**
    * 跳转管理会员卡
    */
   jumpVipCardSetting() {
     wx.navigateTo({
       url: '/pages/VIP/pages/VipCardSetting/VipCardSetting'
     })
   },

   /**
    * 跳转使用会员卡支付
    */
   jumpUserCardPay() {
     wx.navigateTo({
       url: '/pages/VIP/pages/UserVipCardPay/UserVipCardPay'
     })
   },


   /**
    * 点击出现充值弹窗
    */
   showRecharge() {
     if (this.data.currentCard.supportRenewal) {
       apiAction.weappGetCardRenewalRules(this.data.currentCard.cardKindId).then(data => {
         this.$setData({
           rechargeRules: data.listCardRenewalRule,
           flagRecharge: true
         })
       })
     } else {
       wx.showToast({
         title: '该卡不允许充值',
         icon: 'none'
       })
     }
   },

   /**
    * 点击充值弹窗
    */
   closeRecharge() {
     this.$setData({
       flagRecharge: false
     })
   },
   /**
    * 点击关闭支付弹窗
    */
   closePay() {
     this.$setData({
       flagPay: false
     })
   },

   /**
    * 会员卡充值组件的回调函数去支付
    * 关掉flagRecharge,返回充值金额,返回充值卡的id
    */
   bindtoRecharge(res) {
     this.$setData({
       flagRecharge: false,
       flagPay: true,
       rechargeNum: res.detail.rechargeNum
     })
   },

   /**
    * 会员卡支付组件的回调函数调取微信支付的接口
    * 关掉flagPay,返回支付方式,返回支付金额
    */
   bindtoPay(res) {
     app.getPhone(phone => {
       const card = this.data.currentCard
       const params = {
         customerCardId: card.id,
         goodsType: 2,
         phone,
         rechargeNum: this.data.rechargeNum,
         remark: '',
         storeId: wx.$getStorage('storeId'),
       }
       apiAction.createCardRenewalBill(params).then(data => {
         if (data.success) {
           app.globalData.bill.type = 'recharge'
           app.globalData.bill.info = {
             billId: data.billId,
             totalCharge: data.totalCharge
           }
           apiAction.billing(data.billId)
         }
       })

     })

     this.$setData({
       flagPay: false
     }, () => {
       wx.showToast({
         title: '支付成功'
       })
     })
   },
   /**
    * 会员卡支付组件的回调函数,返回充值组件
    */
   bindgoBack() {
     this.$setData({
       flagPay: false,
       flagRecharge: true
     })
   },

   /**
    * VipCardList->点击跳转分类详情
    */
   jumpVipCardCateDetail() {
     wx.navigateTo({
       url: '/pages/VIP/pages/VipCardCateDetail/VipCardCateDetail'
     })
   },
   jumpPurchase() {
     this.$route('/pages/VIP/pages/purchaseRecharge/purchaseRecharge')
   },
   close() {
     this.triggerEvent('closeRecharge')
   },
   // 展示折扣权益明细
   showDiscountDetail() {
     this.$setData({
       ifShowDiscountDetail: true
     })
   },
   closeDiscount() {
     this.$setData({
       ifShowDiscountDetail: false
     })
   },
   closePop() {
     this.$setData({
       ifShowDiscountDetail: false,
       ifShowCountDetail: false
     })
   },
   // 展示可用服务次数明细
   showCountDetail() {
     this.$setData({
       ifShowCountDetail: true
     })
   },
   closeCount() {
     this.$setData({
       ifShowCountDetail: false
     })
   },
   prevent() {}
 })