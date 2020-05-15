/**
 * Created by zhangqiang on 2019/1/6.
 */
var Fly=require("./ap") 
import {getSignIn} from './jsBridge'
const request = new Fly()

request.interceptors.request.use((request) => {
  request.headers['content-type']= 'application/x-www-form-urlencoded';
  request.headers['sec'] = getSignIn(request.body);
  request.timeout = 15000;
  my.showLoading({ content: '加载中...',delay:'1000' })
  my.showNavigationBarLoading() //显示导航条加载动画。
  return request
})

request.interceptors.response.use(
  (response,promise) => {
    my.hideLoading()
    my.hideNavigationBarLoading();
    var data;
    if(typeof response.data == 'string'){
      data = JSON.parse(response.data);
    }else{
      data = response.data;
    }
  
    if(data.state == 10000){   //口令失效
      my.showToast({
        type: 'fail',
        content: decodeURIComponent(data.msg),
        duration: 1500,
        success(){
          my.reLaunch({url: '/pages/login/login'});
        }
      });
    }else if(data.state != 1){
      my.showToast({
        type: 'fail',
        content: decodeURIComponent(data.msg),
        duration: 1500
      });
    }
    return promise.resolve(data);

  
  },
  (err,promise) => {
    my.hideNavigationBarLoading()
    console.log(err)
    my.hideLoading()
    my.showToast({
      content: err.message,
      type: 'fail',
      duration:1000
    })
    return promise.resolve()
  }
)

export default request;
