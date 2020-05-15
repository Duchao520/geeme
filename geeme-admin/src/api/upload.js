import { getToken } from '@/utils/token'

// 暂时先写死
export const uploadUrl = `${process.env.VUE_APP_SERVERURL}/oss-service/upload`

// 管理后台的逻辑, 暂时只能这么写了
export const uploadHeader = () => {
  const token = getToken()
  return { Authorization: `Bearer ${token}` } 
}