// 本地开发
const developConfig = {
  appId: 'test',
  appSecret: 'test',
  baseUrl: 'http://192.168.2.23:8081',
  authUrl: 'https://bmsdevelop.geeme.cn/auth',
  baseURL: 'https://bmsdevelop.geeme.cn/api',
  imgUrl: 'https://image-develop.geeme.cn/images/',
  grant_type: 'authorization_code',
}
// 线上开发
const devConfig = {
  appId: 'test',
  appSecret: 'test',
  baseUrl: 'https://bmsdevelop.geeme.cn',
  authUrl: 'https://bmsdevelop.geeme.cn/auth',
  baseURL: 'https://bmsdevelop.geeme.cn/api',
  imgUrl: 'https://image-develop.geeme.cn/images/',
  grant_type: 'authorization_code',
}
const masterConfig = {
  appId: 'test',
  appSecret: 'test',
  baseUrl: 'https://gms.geeme.cn',
  authUrl: 'https://gms.geeme.cn/auth',
  baseURL: 'https://gms.geeme.cn/api',
  imgUrl:  'https://image-test.geeme.cn/images/',
  grant_type: 'authorization_code',
}
const releaseConfig = {
  appId: 'test',
  appSecret: 'test',
  baseUrl: 'https://admin.geeme.cn',
  authUrl: 'https://admin.geeme.cn/auth',
  baseURL: 'https://admin.geeme.cn/api',
  imgUrl:  'https://image.geeme.cn/images/',
  grant_type: 'authorization_code',
}
const hotfixConfig = {
  appId: 'test',
  appSecret: 'test',
  baseUrl: 'https://bpre.geeme.cn',
  authUrl: 'https://bpre.geeme.cn/auth',
  baseURL: 'https://bpre.geeme.cn/api',
  imgUrl:  'https://image.geeme.cn/images/',
  grant_type: 'authorization_code',
}

let config/*  = process.env.NODE_ENV === 'development'? devConfig: prdConfig */

switch (process.env.NODE_ENV) {
  case 'dev':
    config = devConfig
    break
  case 'master':
    config = masterConfig
    break
  case 'release':
    config = releaseConfig
    break
  case 'hotfix':
    config = hotfixConfig
    break
  default:
    config = developConfig
    break
}

export default config