import fetch from '@/utils/fetch'

/** 
 * @description 获取所有的产品一级分类与二级分类
 */
export const queryBrand = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/feign/product/brand/query',
    data,
  })
}

/**
 * @description 管理后台删除/恢复品牌
 */
export const deleteBrand = (data) => {
  return fetch({
    method: 'put',
    url: '/api/scm-product/product/brand/del',
    data,
  })
}

/**
 * @description 管理后台新增品牌
 */
export const addBrand = (data) => {
  return fetch({
    method: 'post',
    url: '/api/scm-product/product/brand',
    data,
  })
}

/**
 * @description 修改品牌排序号
 */
export const sortBrand = (data) => {
  return fetch({
    method: 'put',
    url: '/api/scm-product/changeProductSort',
    data,
  })
}

/**
 * @description 获取品牌详情
 */
export const queryBrandDetail = (id) => {
  return fetch({
    method: 'get',
    url: `/api/scm-product/feign/product/brand/${id}`,
  })
}

/**
 * @description 管理后台修改品牌
 */
export const editBrand = (data) => {
  return fetch({
    method: 'put',
    url: '/api/scm-product/product/brand',
    data,
  })
}