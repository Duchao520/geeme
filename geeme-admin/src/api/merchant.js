import fetch from '@/utils/fetch'

/**
 * @description 后台查询品牌列表
 */
export const queryBrand = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/brand/query',
    data,
  })
}

/**
 * @description 后台审核认证
 */
export const authenticate = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/brand/Authenticate/audit',
    data,
  })
}

/**
 * @description 品牌认证信息查询
 */
export const authenticateInfo = (id) => {
  return fetch({
    method: 'get',
    url: `/api/main-data/brand/Authenticate/${id}`
  })
}

/**
 * @description 获取小程序管理列表
 */
export const getWeappList = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getWeappList',
    data,
  })
}

/**
 * @description 获取模板列表
 */
export const getTemplateList = () => {
  return fetch({
    method: 'get',
    url: `/api/main-data/getTemplateList`
  })
}

/**
 * @description 修改排序
 */
export const updateWeappSort = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/updateWeappSort',
    data,
  })
}
/**
 * @description 提交审核
 */
export const upgradeWeapp = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/upgradeWeapp',
    data,
  })
}
/**
 * @description 撤销审核
 */
export const undoAudit = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/undoAudit',
    data,
  })
}

/**
 * @description 发布
 */
export const publishMult = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/publishMult',
    data,
  })
}

/**
 * @description 获取小程序基本信息
 */
export const getBrandWeappBaseMsg = (id) => {
  return fetch({
    method: 'get',
    url: `/api/main-data/getBrandWeappBaseMsg/${id}`
  })
}

/**
 * @description 查询版本审核记录
 */
export const getWeappAuditRecordList = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getWeappAuditRecordList',
    data,
  })
}

/**
 * @description 查询门店列表
 */
export const StoreManageGetList = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/StoreManageGetList',
    data,
  })
}

/**
 * @description 获取门店信息详情
 */
export const getStroeDetails = (id) => {
  return fetch({
    method: 'get',
    url: `/api/main-data/StoreManageGetList/${id}`
  })
}

/**
 * @description 查询门店列表
 */
export const renewalBySys = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/renewalBySys',
    data,
  })
}

export const enableStore = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/enableStore',
    data
  })
}


/**
 * @description 后台查询品牌列表
 */
export const getBrandDetail4BackSys = (id) => {
  return fetch({
    method: 'get',
    url: `/api/main-data/getBrandDetail4BackSys/${id}`
  })
}

/**
 * @description 查询品牌的付款记录
 */
export const getRecordByBrandId = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getBrandSoftOrderRecordByBrandId',
    data,
  })
}
/**
 * @description 特邀商户列表
 */
export const getMerchantListByQuery = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getMerchantListByQuery',
    data,
  })
}
/**
 * @description 根据id获取详情
 */
export const getMerchantByIdInfo = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getMerchantByIdInfo',
    data,
  })
}
/**
 * @description 填写微信特约商户申请的驳回理由
 */
export const addReason = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/addReason',
    data,
  })
}
/**
 * @description 微信特约商户申请更改状态
 */
export const updateStatus = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/updateStatus',
    data,
  })
}

/**
 * @description bms 获取新开/续期券派发记录
 */
export const getSoftTicketSendRecord = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getSoftTicketSendRecord',
    data
  })
}

/**
 * @description bms 获取品牌软件价格信息-发券用
 */
export const getSoftInfoForSendTicket = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/getSoftInfoForSendTicket',
    data
  })
}

export const SendTicketForBrandSoft = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/SendTicketForBrandSoft',
    data
  })
}

