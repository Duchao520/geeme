import fetch from './fetch';
import {getSignIn} from "@/assets/js/jsBridge";

/**
 *  @param typeId platform
 * 分享赚接口
 */


const shareProfit = (data, sec) => fetch({
  url: '/api/voip/zst/muilpart/modules',
  method: 'get',
  params: data,
  sec: sec
});

export const uploadImg = (data) => fetch({
  url: '/api/voip/img/uploads',
  method: 'post',
  data: data
})

/**
 *
 * 获取话呗兑换区抽奖记录
 */
const getConverRecord = (data, sec) => fetch({
  url: '/api/voip/callfee/zoom/records',
  method: 'post',
  params: data,
  sec: sec
});

/**
 * 获取商品详情
 */
const goodsDetail = (data, sec) => fetch({
  url: '/api/voip/zst/good/detail',
  method: 'get',
  params: data,
  sec: sec
})

/**
 * 获取抽奖活动类型
 */
const getDrawType = (data, sec) => fetch({
  url: '/api/voip/lottery/unreceived/statistic',
  method: 'post',
  params: data,
  sec: sec
});

/**
 * 主卡扣款
 * @param data
 * @param sec
 */
const mainCardPay = (data, sec) => fetch({
  url: '/api/voip/user/svip/mian/balance/pay',
  method: 'post',
  params: data,
  sec: sec
})


/*获取城市列表*/
const cityList = (data, sec) => fetch({
  url: '/api/voip/find/cityCode',
  method: 'get',
  params: data,
  sec: sec
});

/*获取svip卡门店列表*/
const storeList = (data, sec) => fetch({
  url: '/api/voip/user/svip/store/list',
  method: 'post',
  params: data,
  sec: sec
})

/*门店详情*/
const storeDetail = (data, sec) => fetch({
  url: '/api/voip/user/svip/store/detail',
  method: 'post',
  params: data,
  sec: sec
})

const reGoods = (data , sec) => fetch({
  url: '/api/voip/goods/index',
  method: 'get',
  params: data,
  sec: sec
})

/*分享卡站内原价付款*/
const getsVipOrder = (data, sec) => fetch({
  url: '/api/voip/user/svip/share/balance/pay',
  method: 'post',
  params: data,
  sec: sec
})

/*主卡站内原价付款*/
const getsVipMainOrder = (data, sec) => fetch({
  url: '/api/voip/user/svip/mian/balance/pay',
  method: 'post',
  params: data,
  sec: sec
})

/**
 * 在线支付页面信息接口
 * @param data
 * @param sec
 */
export const getPayPage = (data,sec) => fetch({
  url: '/api/voip/offlinerorder/pay/page',
  method: 'get',
  params: data,
  sec: sec
})

/**
 * 获取账户信息
 * @param data
 * @param sec
 */
export const getUserBalance = (data,sec) => fetch({
  url: '/api/voip/user/balance',
  method: 'post',
  params: data,
  sec: sec
})

/**
 * 获取卡券列表
 * @param data
 * @param sec
 */
export const getCouponList = (data,sec) => fetch({
  url: '/api/voip/coupon/list',
  method: 'get',
  params: data,
  sec: sec
})

/**
 * 提交活动订单
 * @param data
 * @param sec
 */
export const postActOrder = (data,sec) => fetch({
  url: '/api/voip/zstPay/ordernum',
  method: 'post',
  params: data,
  sec: sec
})



/**
 *  用途：获取我是主卡的信息
 *  对应页面：isCarder
 *  @url /api/voip/user/svip/mian/userInfo
 *  返回state为 1 表示成功
 *  @method post
 *  @return {promise}
 */

export function userInfo(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/mian/userInfo',
    method: 'post',
    params: data,
    sec: sec
  })
}

/**
 *  用途：获取对应的主卡信息
 *  对应页面：sellerDetail
 *  @url /api/voip/user/svip/mian/cardInfo
 *  返回state为 1 表示成功
 *  @method post
 *  @return {promise}
 */
export function cardeDetail(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/mian/cardInfo',
    method: 'post',
    params: data,
    sec: sec
  })
}

// 消费记录
export function records(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/mian/consume/records',
    method: 'post',
    params: data,
    sec: sec
  })
}

//卡包
export function cardBag(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/mian/myCards',
    method: 'post',
    params: data,
    sec: sec
  })
}

//副卡详情页面
export function secondCard(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/store/share/detail',
    method: 'post',
    params: data,
    sec: sec
  })
}

// 创建的svip卡
//副卡详情页面
export function myCreatSvip(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/list',
    method: 'post',
    params: data,
    sec: sec
  })
}

//提交折扣
export function postDiscount(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/save',
    method: 'post',
    params: data,
    sec: sec
  })
}

//查询svip主卡信息
export function majorCard(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/mian/cardInfo',
    method: 'post',
    params: data,
    sec: sec
  })
}

//分享卡id
export function noMajorCard(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/detail',
    method: 'post',
    params: data,
    sec: sec
  })
}

//删除该svip分享卡
export function deleteCard(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/remove',
    method: 'post',
    params: data,
    sec: sec
  })
}

//撤销发布的接口  /api/voip/user/svip/share/cancel
export function cancelCard(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/cancel',
    method: 'post',
    params: data,
    sec: sec
  })
}

//分享卡消费明细  /api/voip/user/svip/share/profit/records
export function shareCardD(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/profit/records',
    method: 'post',
    params: data,
    sec: sec
  })
}

//分享卡消费明细详情
export function shareCardDetail(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/share/consume/detail',
    method: 'post',
    params: data,
    sec: sec
  })
}

//主卡消费详情
export function mainshareCardDetail(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/mian/profit/records',
    method: 'post',
    params: data,
    sec: sec
  })
}

//获取门店信息
export function getShopList(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/store/list',
    method: 'post',
    params: data,
    sec: sec
  })
}

//获取城市信息
export function getCityDetail(data, sec) {
  return fetch({
    url: '/api/voip/tourism/senic/citys',
    method: 'post',
    params: data,
    sec: sec
  })
}

//进入门店页面  /api/voip/user/svip/store/sharecards
export function govippage(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/store/sharecards',
    method: 'post',
    params: data,
    sec: sec
  })
}

//搜藏
export function collectionPag(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/store/shareCard/collection',
    method: 'post',
    params: data,
    sec: sec
  })
}

//分享
export function shareDistCard(data, sec) {
  return fetch({
    url: '/api/voip/user/svip/store/share/outdetail',
    method: 'post',
    params: data,
    sec: sec
  })
}

/**
 * 2.240.24SVIP分享卡获取门店详情码
 * @param data
 * @param sec
 */
export const shareQr = (data , sec) => fetch({
  url: '/api/voip/user/svip/store/shareQr',
  method: 'get',
  params: data,
  sec: sec
})


/**
 * 产品秀
 */
export const moneyTask = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/task/home/listPage',
  method: 'post',
  params: data,
  sec: sec

});
/*获取产品秀首页信息*/
export const getListPage = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/home/listPage',
  method: 'post',
  params: data,
  sec: sec
});

/*获取产品分类*/
export const getProCategory = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/findUserGoodsType',
  method: 'post',
  params: data,
  sec: sec
});

/*获取产品秀详情*/
export const getProDetails = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail',
  method: 'post',
  params: data,
  sec: sec
});

/*产品秀点赞踩*/
export const evaluate = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/evaluate',
  method: 'post',
  params: data,
  sec: sec
});

/*产品秀-用户产品位个数和金额*/
export const showCounts = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/showCounts',
  method: 'post',
  params: data,
  sec: sec
});

/*我的产品秀列表*/
export const mineShowList = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/list',
  method: 'post',
  params: data,
  sec: sec
});

/*购买产品位*/
export const buyShowCounts = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/buyShowCounts',
  method: 'post',
  params: data,
  sec: sec
});

/*赏金明细*/
export const rewardDetail = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/reward/list',
  method: 'post',
  params: data,
  sec: sec
});

/*任务明细*/
export const taskDetail = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/receviers',
  method: 'post',
  params: data,
  sec: sec
});

/*获取当前产品秀任务*/
export const showOnTask = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/task/showOnTask',
  method: 'post',
  params: data,
  sec: sec
});

/*结束任务*/
export const finishTask = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/task/cancel',
  method: 'post',
  params: data,
  sec: sec
});

/*查询话呗余额*/
export const callfee = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/callfee',
  method: 'post',
  params: data,
  sec: sec
});

/*新增任务*/
const addTask = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/task/add',
  method: 'post',
  params: data,
  sec: sec
});

/*打赏话呗*/
export const reward = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/reward',
  method: 'post',
  params: data,
  sec: sec
});

/*分享产品秀*/
export const share = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/share',
  method: 'post',
  params: data
});

/*引入微信接口配置*/
export const wechat = (data) => fetch({
  url: '/sapi/voip/wechat/signature',
  method: 'get',
  params: data,
  sec: sec
});

/*分享查看产品秀详情*/
export const externalView = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/share/page',
  method: 'post',
  params: data,
  sec: sec
});

/*举报*/
export const report = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/detail/report',
  method: 'post',
  params: data,
  sec: sec
});

/*上下架*/
export const handPull = (data, sec) => fetch({
  url: '/api/voip/user/goodsshow/pull',
  method: 'post',
  params: data,
  sec: sec
});

/*获取淘口令*/
export const getTbk = (data, sec) => fetch({
  url: '/api/voip/get/union/platform/good/detail',
  method: 'get',
  params: data,
  sec: sec
});

/**
 * 审核板块接口
 */
/*获取提现审核明细*/
const depositDetail = (data, sec) => fetch({
  url: '/api/voip/withdraw/detail',
  method: 'get',
  params: data,
  sec: sec
});

/*提现审核提交*/
const depositAudit = (data, sec) => fetch({
  url: '/api/voip/withdraw/audit',
  method: 'post',
  params: data,
  sec: sec
});

/*获取用户/商家/服务商提现列表*/
const depositList = (data, sec) => fetch({
  url: '/api/voip/withdraw/list',
  method: 'get',
  params: data,
  sec: sec
});

/*获取用户/商家/服务商收益列表*/
const earnList = (data, sec) => fetch({
  url: '/api/voip/muliplat/zstamountslog/list',
  method: 'get',
  params: data,
  sec: sec
});

/*获取商家入驻申请明细*/
const merchantAudit = (data, sec) => fetch({
  url: '/api/voip/shop/entry/audit/detail',
  method: 'get',
  params: data,
  sec: sec
});

/*获取用户/商家/服务商单条收益明细*/
const earnDetail = (data, sec) => fetch({
  url: '/api/voip/muliplat/zstamountslog/detail',
  method: 'get',
  params: data,
  sec: sec
});

/*审核商家入驻申请*/
const entryAudit = (data, sec) => fetch({
  url: '/api/voip/shop/entry/audit',
  method: 'post',
  params: data,
  sec: sec
});

/**
 * 商家审核明细
 * @param data
 * @param sec
 */
export const merchantDetail = (data,sec) => fetch({
  url: '/api/voip/shop/info/modify/detail',
  method: 'get',
  params: data,
  sec: sec
});

/**
 * 商家资料审核
 * @param data
 * @param sec
 */
export const merchantEditAudit = (data,sec) => fetch({
  url: '/api/voip/shop/info/modify/audit',
  method: 'post',
  params: data,
  sec: sec
})

/**
 * 服务商商家激活码
 */

/*激活码数量*/
const activecodeAmount = (data, sec) => fetch({
  url: '/api/voip/agent/activecode/amount',
  method: 'post',
  params: data,
  sec: sec
});

/*记录列表*/
const activeCodeRecord = (data,sec) => fetch({
  url: '/api/voip/agent/activecode/records',
  method: 'post',
  params: data,
  sec: sec
});

/*2.244.3获取激活码*/
const activeCode = (data,sec) => fetch({
  url: '/api/voip/agent/activecode/show',
  method: 'post',
  params: data,
  sec: sec
});

/**
 * 2.244.4批量获取激活码
 * @param data
 * @param sec
 */
const getMoreCode = (data,sec) => fetch({
  url: '/api/voip/agent/activecode/batch/get',
  method: 'get',
  params: data,
  sec: sec
});

/**
 * 2.244.5查看分享激活码列表
 * @param data
 * @param sec
 */
const searchCodeList = (data,sec) => fetch({
  url: '/api/voip/agent/activecode/list',
  method: 'get',
  params: data,
  sec: sec
})





/**
 * 联通合作
 */

/*信息登记表单提交*/
const unicomForm = (data,sec) => fetch({
  url: '/api/voip/unicom/order/add',
  method: 'post',
  params: data,
  sec: sec
})

/**
 * 快递查询
 * @param data
 */
const searchLogistics = (data) => fetch({
  url: '/api/voip/zst/kuaidiniao/search/logistics',
  method: 'post',
  params: data
})

/**
 *
 * @param data
 */
const bargainingList = (data) => fetch({
  url: '/api/voip/bargaining/list',
  method: 'get',
  params: data
})

const bargainList = (data) => fetch({
  url: '/api/voip/bargain/list',
  method: 'get',
  params: data
})

const bargainTaskList = (data) => fetch({
  url: '/api/voip/bargain/tasksing/list',
  method: 'get',
  params: data
})

/**
 *1.1.1 可砍价活动
 * @param data
 */
const bargainCanTaskList = (data) => fetch({
  url: '/api/voip/bargain/canTasksing/list',
  method: 'get',
  params: data
})

const bargainDetail = (data) => fetch({
  url: '/api/voip/bargaining/detail',
  method: 'get',
  params: data
})

/**
 * 2.254.8活动评价列表
 * @param data
 */
const bargainCommentList = (data) => fetch({
  url: '/api/voip/bargain/bargaincomment/list',
  method: 'get',
  params: data
})

/**
 * 2.254.4开团
 * @param data
 */
const openBargain = (data) => fetch({
  url: '/api/voip/bargain/openBargainTasks',
  method: 'post',
  params: data
})

/**
 * 2.92用户领取卡券
 * @param data
 */
const getCoupon = (data) => fetch({
  url: '/api/voip/coupon/receive',
  method: 'post',
  params: data
})

/**
 * 2.254.6领取核销码,验证核销码状态
 * @param data
 */
const bargainCheckQr = (data) => fetch({
  url: '/api/voip/bargain/bargainTaskswrteoff',
  method: 'post',
  params: data
});

/**
 * 2.254.7评价
 * @param data
 */
const bargainComment = (data) => fetch({
  url: '/api/voip/bargain/bargaincomment',
  method: 'post',
  params: data
})

/**
 * 2.254.11好友帮
 * @param data
 */
const bargainTaskslogHelp = (data) => fetch({
  url: '/api/voip/bargain/bargainTaskslogHelp',
  method: 'get',
  params: data
});

/**
 * 2.254.12砍价成功记录
 * @param data
 */
const bargainTaskslogSuccess = (data) => fetch({
  url: '/api/voip/bargain/bargainTaskslogSuccess',
  method: 'get',
  params: data
});

/**
 * 2.254.13分享卡支付消费后匹配砍价活动
 * @param data
 */
const isAbleBargain = (data) => fetch({
  url: '/api/voip/bargain/detail/storeId',
  method: 'get',
  params: data
})

/**
 * 2.254.16商家推荐
 * @param data
 */
const storeForBargain = (data) => fetch({
  url: '/api/voip/storeForBargain/list',
  method: 'post',
  params: data
})

const zstPayOrder = (data) => fetch({
  url: '/api/voip/zstPay/ordernum',
  method: 'post',
  params: data
})

const getqrCode =(data) => fetch({
  url:'/api/voip/get/mini/qrcode',
  method:'get',
  params:data
})

/**
 * 获取银行(含支行)列表接口
 * @param data
 */
const getBankList = (data) => fetch({
  url: '/sapi/voip/find/bank/list',
  method: 'get',
  params: data
});

const sendMsCode = (data) => fetch({
  url: '/sapi/voip/v2/smsSecurityCode',
  method: 'post',
  params: data
})

/**
 * 小微商户进件
 * @param data
 */
const mchparSave = (data) => fetch({
  url: '/sapi/voip/onlineentry/mchpar/save',
  method: 'post',
  params: data
})

const getShopType = (data) => fetch({
  url: '/sapi/shop/dealcate/type',
  method: 'get',
  params: data
});

const querymch = (data) => fetch({
  url: '/sapi/voip/onlineentry/mch_reg_status/query',
  method: 'post',
  params: data
})

const getAliType = (data) => fetch({
  url: '/sapi/voip/find/shop/aliindusty/list',
  method: 'get',
  params: data
})






export {
  shareProfit, getConverRecord, goodsDetail, getDrawType, mainCardPay, cityList, storeList, storeDetail,
  getsVipOrder, depositDetail, depositAudit, depositList, earnList, merchantAudit, earnDetail, entryAudit,
  activecodeAmount , activeCodeRecord , activeCode , unicomForm , reGoods , getsVipMainOrder , searchLogistics ,
  getMoreCode , searchCodeList , bargainingList , bargainList , bargainTaskList , bargainCanTaskList , bargainDetail,
  bargainCommentList , openBargain , getCoupon , bargainCheckQr , bargainComment , bargainTaskslogHelp , bargainTaskslogSuccess ,
  isAbleBargain , storeForBargain , zstPayOrder , getqrCode , getBankList , sendMsCode , mchparSave , getShopType , querymch ,
  getAliType
}
