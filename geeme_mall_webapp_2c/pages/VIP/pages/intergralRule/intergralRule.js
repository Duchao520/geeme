var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId: null,
    commentDynamic10Integral: 0,            //评论动态超过10个字积分
    improvementOfPersonalDataIntegral: 0,   //完善个人资料积分
    loginAndBindPhoneIntegral: 0,           //登录网点并绑定手机号积分    
    onlineAppointmentAndOrderIntegral: 0,   //线上预约并开单积分
    onlineBuyCardByCardIntegral: 0,         //线上购买卡项储值卡支付积分
    onlineBuyCardByCashIntegral: 0,         //线上购买卡项现金类支付积分
    onlineBuyProductByCardIntegral: 0,      //线上购买产品储值卡支付积分
    onlineBuyProductByCashIntegral: 0,      //线上购买产品现金类支付积分
    onlineBuyServiceByCardIntegral: 0,      //线上购买服务储值卡支付积分
    onlineBuyServiceByCashIntegral: 0,      //线上购买服务现金类支付积分
    onlineConsumerOrderPayByCardIntegral: 0,//线上消费账单买单储值卡支付积分
    onlineConsumerOrderPayByCashIntegral: 0,//线上消费账单买单现金类支付积分
    onlineGroupBuyAndComplete2Integral: 0,  //线上拼团并成团2积分
    onlineGroupBuyAndComplete3Integral: 0,  //线上拼团并成团3积分
    onlineRenewCardByCardIntegral: 0,       //线上续费卡项储值卡支付积分
    onlineRenewCardByCashIntegral: 0,       //线上续费卡项现金类支付积分
    orderEvaluation20Integral: 0,           //完成订单评价20积分
    orderEvaluationIntegral: 0,             //完成订单评价积分
    shopCheckstandPayByCardIntegral: 0,     //门店收银台买单储值卡支付积分
    shopCheckstandPayByCashIntegral: 0,     //门店收银台买单现金类支付积分
    successfulProductPromotionIntegral: 0,  //推广商品成功积分
    integralOverdueType: null               //积分过期侧学
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();

    this.getBrand()
  },
  onUnload() {
    apiAction = null;
    util = null;
    app = null;
  },
  getBrand() {
    app.getBrand((brandInfo) => {
      this.data.brandId = brandInfo.brandId;
      util.PromiseAll([this.getBrandPointsRuleInfos(), this.getBrandMemberIntegralRuleApiByBrandId()]).then(res => {
        this.setData(res)
      })
    })
  },
  getBrandMemberIntegralRuleApiByBrandId() {
    return apiAction.getBrandMemberIntegralRuleApiByBrandId(this.data.brandId)
  },
  getBrandPointsRuleInfos(){
    return apiAction.getBrandPointsRuleInfos({brandId: this.data.brandId}).then(res => {
      if(res.success){
        return {
          listBrandPointsUseRuleInfo: res.listBrandPointsUseRuleInfo ? res.listBrandPointsUseRuleInfo : []
        }
      }else{
        return {}
      }
    })
  }
})