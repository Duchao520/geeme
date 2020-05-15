const config = require('./config.js')

const settings = [{
  setting: 'RELEASE',
  ApiUrl: 'https://biz.geeme.cn/service-api/',
  ImageUrl: 'https://image.geeme.cn/images/'
}, {
    setting: 'BIZPRE',
    ApiUrl: 'https://biz-pre.geeme.cn/service-api/',
    ImageUrl: 'https://image.geeme.cn/images/'
  },{
  setting: 'DEVELOP',
  ApiUrl: 'https://develop.geeme.cn/service-api/',
  ImageUrl: 'https://image-develop.geeme.cn/images/'
}, {
  setting: 'TEST',
  ApiUrl: 'https://test.geeme.cn/service-api/',
  ImageUrl: 'https://image-test.geeme.cn/images/'
}]

let setting, ApiUrl, ImageUrl
for (const v of settings) {
  if (v.setting === config.setting) {
    setting = v.setting
    ApiUrl = v.ApiUrl
    ImageUrl = v.ImageUrl
    break;
  }
}
wx.baseUrl = ApiUrl.slice(0, -1)

console.log(setting + '环境')

module.exports = {
  ApiUrl,
  ImageUrl
}