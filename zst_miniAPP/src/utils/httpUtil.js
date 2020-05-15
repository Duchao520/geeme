/**
 * Created by zhangqiang on 2019/1/6.
 */
import Fly from 'flyio/dist/npm/wx'
const request = new Fly()

request.interceptors.request.use((request) => {
  request.headers['content-type']= 'application/x-www-form-urlencoded';
  request.headers['sec'] = request.sec;
  //这几个接口不要展示加载中
  if(request.url.indexOf('/integral/barcode/state')>-1){
  }else if(request.url.indexOf('/coupon/state')>-1){
  }else if(request.url.indexOf('bargaining/detail')>-1){
  }else if(request.url.indexOf('bargainTaskslogHelp')>-1){
  }else if(request.url.indexOf('/storeForBargain')>-1){
  }else if(request.url.indexOf('/bargainTaskslog')>-1){
  } else if(request.url.indexOf('zst/mini/openid')>-1){
  }else if(request.url.indexOf('mini/qrcode')>-1){
  }else if(request.url.indexOf('bargaincomment')>-1){
  }else{
    wx.showLoading({ title: '加载中' })
  }
  wx.showNavigationBarLoading() //显示导航条加载动画。
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideLoading()
    wx.hideNavigationBarLoading();
    if(response.data.state == 10000){
      return promise.resolve(response.data);
    }else{
      return promise.resolve(response.data);
    }
  },
  (err, promise) => {
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: err.message,
      icon: 'none',
      duration:1000
    })
    return promise.resolve()
  }
)

export default request;
