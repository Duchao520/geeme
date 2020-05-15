const config = require('./config.js')

var accountInfo = wx.getAccountInfoSync()
var appId = accountInfo.miniProgram.appId
// var appId = 'wxa4d20131daf55048'
// var appId = 'wx0513253dbcb2317f' // 及美形象沙龙
// var appId = 'wxd0ddf10cdea113a4'  // 臻美形象
// var appId = 'wx6958b34924a8870f'  // 众葡酒业
// var appId = 'wx4d3c36b33169c016'  // 雅望
// var appId = 'wx60ad9f71fb83cbda'  // MINIsalon连锁
// var appId = 'wxd385e90782ca351a'  // 和美形象salon
// var appId = 'wx335ae256cd199d8b'    //商场版
// appId = 'wxa1793ab7b25347b9'  // 姜颐堂养发馆

const settings = [{
  setting: 'RELEASE',
  Dataurl: 'https://biz.geeme.cn/service-api/',
  imageUrl: 'https://image.geeme.cn/images/'
}, {
  setting: 'DEVELOP',
  Dataurl: 'https://develop.geeme.cn/service-api/',
  imageUrl: 'https://image-develop.geeme.cn/images/'
}, {
  setting: 'TEST',
  Dataurl: 'https://test.geeme.cn/service-api/',
  imageUrl: 'https://image-test.geeme.cn/images/'
  }, {
    setting: 'BIZPRE',
    Dataurl: 'https://biz-pre.geeme.cn/service-api/',
    imageUrl: 'https://image.geeme.cn/images/'
  }
]

// 获取Dataurl,imageUrl
let setting, Dataurl, imageUrl
for (const v of settings){
  if(v.setting === config.setting){
    setting = v.setting
    Dataurl = v.Dataurl
    imageUrl = v.imageUrl
    break;
  }
}

module.exports = {
  appId,
  Dataurl,
  imageUrl,
}