import fetch from '@/utils/fetch'
/**
 * @description 新增分组
 */
export const addMediaStorageGroup = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/addMediaStorageGroup',
    data,
  })
}
/**
 * @description 获取分组
 */
export const getMediaStorageGroup = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/feign/getMediaStorageGroup',
    data,
  })
}
/**
 * @description 添加素材
 */
export const addMediaToGroup = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/addMediaToGroup',
    data,
  })
}
/**
 * @description 获取素材
 */
export const getMedia = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/feign/getMediaByGroupId',
    data,
  })
}
/**
 * @description
 根据groupKey获取素材库素材
 */
export const getMediaByGroupKey = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/feign/getMediaByGroupKey',
    data,
  })
}
/**
 * @description 删除素材
 */
export const delMedia = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/delMedia',
    data,
  })
}
/**
 * @description 移动分组
 */
export const moveMedia = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/moveMedia',
    data,
  })
}
/**
 * @description 移动分组
 */
export const delMediaStorageGroup = (data) => {
  return fetch({
    method: 'get',
    url: '/api/main-data/delMediaStorageGroup/'+data,
  })
}
/**
 * @description 移动分组
 */
export const modifyMediaName = (data) => {
  return fetch({
    method: 'post',
    url: '/api/main-data/modifyMediaName',
    data,
  })
}
