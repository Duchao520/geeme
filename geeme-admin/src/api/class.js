import fetch from '@/utils/fetch'

/** 
 * @description 获取所有的产品一级分类与二级分类
 */
export const getProductClass = (name = '') => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/feign/product/class/get',
    data: {
      className: name,
      enterpriseId: 1,
      pageNum: null,
      pageSize: null,
      productClassStatus: "ACTIVED"
    }
  })
}

/* 获取所有产品一级分类 */
export const getFirstProductClass = () => {
  return fetch({
    method: 'get',
    url: '/api/scm-product/product/class/first'
  })
}

/**
 * @description 根据Id获取产品分类详情
 */
export const retriveProductClass = (id) => {
  return fetch({
    method: 'get',
    url: `/api/scm-product/product/class/retrive/${id}`
  })
}

/**
 * @description 新增产品一二级分类
 */
export const addProductClass = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/product/class/add',
    data,
  })
}

/**
 * @description 删除产品分类
 */
export const deleteProductClass = (id) => {
  return fetch({
    method: 'post',
    url: `/api/scm-product/product/class/del/${id}`,
  })
}

/**
 * @description 产品分类排序
 */
export const sortProductClass = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/product/class/sort',
    data,
  })
}

/**
 * @description 修改产品分类
 */
export const editProductClass = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/product/class/update',
    data,
  })
}






/** 
 * @description 获取所有的服务一级分类与二级分类
 */
export const getServiceClass = (name = '') => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/feign/service/class/get',
    data: {
      className: name,
      enterpriseId: 1,
      pageNum: null,
      pageSize: null,
      serviceClassStatus: "ACTIVED"
    }
  })
}

/* 获取所有服务一级分类 */
export const getFirstServiceClass = () => {
  return fetch({
    method: 'get',
    url: '/api/scm-product/service/class/first'
  })
}

/**
 * @description 根据Id获取服务分类详情
 */
export const retriveServiceClass = (id) => {
  return fetch({
    method: 'get',
    url: `/api/scm-product/service/class/retrive/${id}`
  })
}

/**
 * @description 新增服务一二级分类
 */
export const addServiceClass = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/service/class/add',
    data,
  })
}

/**
 * @description 删除服务分类
 */
export const deleteServiceClass = (id) => {
  return fetch({
    method: 'post',
    url: `/api/scm-product/service/class/del/${id}`,
  })
}

/**
 * @description 服务分类排序
 */
export const sortServiceClass = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/service/class/sort',
    data,
  })
}

/**
 * @description 修改服务分类
 */
export const editServiceClass = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/service/class/update',
    data,
  })
}





/**
 * @description 获取行业列表
 */
export const getIndustryList = () => {
  return fetch({
    method: 'get',
    url: '/api/scm-product/feign/getTradeList',
  })
}

