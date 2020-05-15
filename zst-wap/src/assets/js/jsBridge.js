/**
 * 接收口令的函数
 * @param msg
 * @constructor
 */
import md5 from 'js-md5';
var testData = {token:'db34d215ff3e45c6a966fed859afba4c',sec: '',city :{areaCode:'330100'} , LONG: '120.263102' , LAT: '30.236281'};
// export const ctxPath = 'http://zst-test.tenzhao.com:10087'
export const ctxPath = window.location.origin;

export const USER_AGENT = {IOS:{K:'zst-ios-broswer',V:0},ANDROID:{K:'zst-android-broswer',V:1},OTHERS:{K:'',V:2}}

/**
 *判断是否在app内打开
 */
export const getUserAgentType = () =>{
  if(navigator.userAgent.indexOf(USER_AGENT.ANDROID.K) >= 0){
    return 1 ;
  }else if(navigator.userAgent.indexOf(USER_AGENT.IOS.K) >= 0){
    return 2 ;
  }else if(navigator.userAgent.indexOf("MicroMessenger") >= 0){
    return 4;
  }else{
    return 3 ;
  }
}


/**
 * 获取口令
 */
export const getToken=()=>{
  var _type;
  try{
    _type = getUserAgentType();
    if(_type == 1){
      window.ZSTRequestParameter.getAndroidParameter() ;
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestParameter.postMessage({token:'' }) ;
    }
  }catch(e){
    consoel.log(e);
  }
  return new Promise((resolve,reject)=>{
    // resolve(testData.token); //测试用
    if(_type ==4) {
      try {
        var winToken = window.location.href.split('&');
        var tokenArr = winToken[winToken.length - 1].split('=');
        var token = tokenArr[tokenArr.length - 1];
        resolve(token);
      }catch (e) {
        console.log(e);
      }
    }else{
      try {
        window.ZSTObtainParameter = (msg) => {
          // alert(JSON.stringify(msg));
          resolve(msg);
        };
      }catch(e){
        console.log(e);
      }
    }

  });
}

/**
 * 获取服务商中心口令
 */
export const getParterToken=()=>{
  let _type = getUserAgentType();
  try{
    if(_type == 1){
      window.ZSTRequestParameter.getAndroidParameter() ;
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestParameter.postMessage({token:'' }) ;
    }
  }catch(e){
    console.log(e);
  }
  return new Promise((resolve,reject)=>{

    // resolve(testData.token); //测试用
    window.ZSTObtainParameter = (msg) => {
      if(_type == 1){
        resolve(msg);
      }else if(_type == 2){
        resolve(JSON.parse(msg).token)
      }
    };
  });
}

/**
 *调起APP支付
 *@params {
 *   activeNum: String(activeNum),
     payWay: String(ZSTPayWay),
     storeId: storeId,
     integralCount: discount,
     totalMoney: String(_totalAmount),
     shouldPayMoney: String(actPay)
 *}
 * Android ZSTSweepCodePay.AndroidSweepPay(JSON.stringify(_data));
 * IOS ZSTSweepCodePay(_data);
 */
export const ZSTSweepCodePay = (_data) => {
  try {
    var _type = getUserAgentType();
    if(_type == 1){
      window.ZSTSweepCodePay.AndroidSweepPay(JSON.stringify(_data));
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTSweepCodePay.postMessage(_data);
    }
    return new Promise((resolve,reject) => {
      // resolve(1);
      window.ZSTSweepPayCallback = (data) => {
        resolve(data)
      }
    })
  }catch (e) {
    alert(e);
  }
}

/**
 * 获取城市编码
 */
export const getCity=()=>{
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestCity.getAndroidCity() ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRequestCity.postMessage({token:""});
    }
  }catch(e){
    console.log(e);
  }
  return  new Promise((resolve,reject)=>{
    // resolve(testData.city);
    window.ZSTObtainCity  = (msg) => {
      resolve(JSON.parse(msg));
    };
  });
}


/**
 * 获取用户是从哪个页面进来的
 */
export const getFrompage=()=>{
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestPage.getAndroidFromPage() ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRequestFromPage.postMessage();
    }
  }catch(e){
    console.log(e);
  }

  return  new Promise((resolve,reject)=>{
    // resolve(testData.city);
    window.ZSTgetFromPage  = (msg) => {
      resolve(msg);
    };
  });
}

/**
 * 获取用户是否为会员
 */
export const getMember=() => {
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestMember.getAndroidMember() ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRequestMember.postMessage({token:""});
    }
  }catch(e){
    alert(e) ;
  }
  return new Promise((resolve,reject) => {
    window.ZSTObtainMember = (msg) => {
      resolve(msg);
    }
  })

}


/**
 * 禁止下拉刷新
 */
export const unableDropDownRefresh=()=>{
  try {
    let _type = getUserAgentType();
    if (_type == 1) {
      window.ZSTNoRefresh.getAndroidNoShare();
    } else if (_type == 2) {
      window.webkit.messageHandlers.ZSTRequestNoReady.postMessage({data: ''});
    }
  }catch(e){
  }
}

/**
 * 设置标题
 * IOS ZSTRequestPostTitle
 */
export const postTitle = (title) =>{
  try{
    let _type = getUserAgentType() ;
    if(_type == 1) {
      window.document.title = title;
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestPostTitle.postMessage(title);
    }else{
      window.document.title = title;
    }
  }catch(e){
    // alert(e);
  }
};

/**
 * 签名算法
 */
const asciiSort=(json) => {
  let arr = [], _json = {}, str = "",  reg = /\,/;
  for (i in json) {
    if (json[i] !== "" && json[i] !== undefined) {
      arr.push(i);
    }
  }
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    var name = arr[i];
    str += name + "=" + json[name] + "&";
  }
  _json = str + "key=1hehe^_^haha!ysyhl9t@flzx3000c";
  return _json;
}

/**
 * @param jsonObj 需要参与签名的参数
 */
export const getSignIn= (jsonObj)=>{
  var _type = getUserAgentType();
  /*try {
    if(_type == 1){
      window.reqSignin.signInHandler(JSON.stringify(jsonObj)); // android 使用json字符串
    }else if(_type == 2){
      window.webkit.messageHandlers.reqSignin.postMessage(jsonObj) // ios直接使用json对象
    }
  }catch (e) {
    alert(e)
  }*/

  return new Promise((resolve,reject) => {
    resolve(md5(asciiSort(jsonObj)));
    /*if(_type == 3){
      resolve(md5(asciiSort(jsonObj)));
    }else {
      window.respSignIn = (msg)=>{
        resolve(msg)
      }
    }*/
  })
};

/**
 * 关闭webView
 *
 * Android  ZSTShut.AndroidZSTShut();
 * IOS   ZSTShut()
 */
export const ZSTShut = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTShut.AndroidZSTShut();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTShut.postMessage({token:""});
    }
  }catch (e) {
    alert(e)
  }
}


/**
 * 吊起会员邀请海报界面
 */
export const promoteCode = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTVipCenter.getAndroidPromoteCode();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTGetExtension.postMessage({token:""});
    }
  }catch (e) {
    alert(e)
  }
};

/**
 * 吊起邀请商家界面
 */
export const inviteBusiness = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTVipCenter.getAndroidInviteBusiness();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestInviteBusiness.postMessage({token:""});
    }
  }catch (e) {
    alert(e)
  }
}

/*推荐联盟商家*/
export const recommendedBusiness = () => {
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRecommendedBusiness.postAndroidRecommendedBusiness('1') ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRecommendedBusiness.postMessage({});
    }
  }catch(e){
    alertMsg(e) ;
  }
}

/**
 * 吊起APP方法
 * @param code 1 吊起会员邀请海报界面
 *             2 吊起邀请商家界面
 *             3 吊起APP充值界面
 *             4 跳转APP地址列表页
 *             5 跳转app登录
 *             6 跳转app订单列表页
 *             7 跳转app首页
 *             8 吊起助商通通话
 *             9 禁止刷新
 *             10 吊起分享界面
 *             11 禁止分享
 *             12 吊起抽奖记录界面
 *             13 隐藏返回按钮
 *             14 吊起付款码界面
 *             15 吊起APP寻找SVIP卡界面
 *             16 返回上一级
 *             17 禁止app标题栏导航,将网页提到顶部
 *             18 吊起分享按钮
 *             19 只在微信中分享
 *             20 调出APP导航
 *             21 只分享到微信朋友圈
 *             22 只分享到微信好友
 *             23 吊起淘宝授权界面
 *             24 吊起微信好友分享
 *             25 跳转话呗购专区
 *             26 吊起商家活动界面
 *             27 吊起商家新闻界面
 *             28 吊起APP扫一扫
 *             29 吊起优惠券界面
 *
 *
 *
 * Android callAppMethods.callAppHandler(code)
 * IOS callAppMethods
 */
export const callAppMethod = (code) => {
  try{
    let _type = getUserAgentType();
    if(_type == 1){
      window.callAppMethods.callAppHandler(code);
    }else if(_type == 2){
      window.webkit.messageHandlers.callAppMethods.postMessage(code);
    }
  }catch (e) {
    alert(e);
  }
}

/**
 * APP回调方法
 * @param data
 * @returns {*}
 * @constructor
 */
export const ZstJSBridge_CALLBACK = (data) => {
  return data;
}


/**
 * 吊起APP线上店铺
 * Android callZSTOnlineShop.postParams(id);
 * IOS callZSTOnlineShop(id)
 */
export const callZSTOnlineShop = (shopId) => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.callZSTOnlineShop.postParams(String(shopId));
    }else if(_type == 2){
      window.webkit.messageHandlers.callZSTOnlineShop.postMessage(String(shopId));
    }
  }catch (e) {
    alert(e);
  }
}

/**
 * 吊起APP周边商家界面
 * @param state 1 筛选出有分享卡的商家
 * Android callZSTAroundShop.androidAroundShop(state)
 * IOS callZSTAroundShop(state)
 */


/*禁止分享*/
export const noShare = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1) {
      window.ZSTNoRefresh.getAndroidNoRefresh();
    } else if(_type == 2) {
      window.webkit.messageHandlers.ZSTPostNoShare.postMessage({
        token: ''
      });
    }
  } catch(e) {
    // alert(e);
  }
}

/**
 * app交互唤起微信,支付宝付款码界面
 * @param type 1 唤起微信
 *             2 唤起支付宝
 *
 * Android ZSTCallApp.callAppParams(type)
 * IOS ZSTCallApp
 */
export const callApp = (type) => {
  try{
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTCallApp.callAppParams(type);
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTCallApp.postMessage(type);
    }
  }catch (e) {
    alert(e);
  }
}

/**
 * 与OC交互，告诉客户端，需要当前位置经纬度
 */
export const getGPS = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1) {
      window.ZSTRequestGPS.getAndroidGPS();
    } else if(_type == 2) {
      window.webkit.messageHandlers.ZSTRequestGPS.postMessage({
        token: ""
      });
    }
  } catch(e) {
    alert(e);
  }
  return new Promise((resolve,reject)=>{
    // resolve({LONG:testData.LONG,LAT:testData.LONG}); //测试用
    window.ZSTGetGPS = (msg) => {
      try{
        msg = Object(msg)
        let _data = msg.split(',') ;
        let _type = getUserAgentType() ;
        var LONG,LAT;
        if( _type == 1 ){
          LONG = _data[1].replace('}','') ; //经度
          LAT = _data[0].replace('{','') ;//纬度
        }else if( _type == 2 ){
          LONG = _data[1]  ; //经度
          LAT = _data[0] ;//纬度
        }
        var obj = {
          LONG:LONG,
          LAT: LAT
        }
        resolve(obj);
      }catch(e){
        reject(e) ;
      }
    }
  });
}

/**
 * 提交分享图片到APP 并分享到朋友圈
 * @param uri
 *
 * Android postImgUrl.handlerAndroidImg
 * IOS postImgUrl
 */
export const postImgUrl = (uri) => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.postImgUrl.handlerAndroidImg(uri)
    }else if(_type == 2){
      window.webkit.messageHandlers.postImgUrl.postMessage(uri);
    }
  }catch (e) {
    alert(e)
  }
};

/**
 * 航佰定制业务，传递接口所需参数,JSON字符串，吊起扫一扫功能识别小票二维码内容，并调用识别内容接口，参数名称使用otherParams
 * @param JSONStr
 * Android handleQrParams.handleAndroidQr(JSONStr)
 * IOS handleQrParams(JSONStr)
 */
export const handleQrParams = (JSONStr) => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.handleQrParams.handleAndroidQr(encodeURIComponent(JSON.stringify(JSONStr)))
    }else if(_type == 2){
      window.webkit.messageHandlers.handleQrParams.postMessage(encodeURIComponent(JSON.stringify(JSONStr)));
    }
  }catch (e) {
    alert(e)
  }
}

/*结算代付款订单*/
export const postPayOrder = (json) => {
  try {
    let _type = getUserAgentType();
    if( _type == 1 ){
      let _data = JSON.stringify(json);
      window.postPayOrder.postAndroidPayOrder(_data) ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.postPayOrder.postMessage(json);
    }
  }catch (e) {
    alertMsg(e)
  }
  return new Promise((resolve,reject) => {
    // resolve(1)
    window.ZSTPaySuccess = (msg) => {
      resolve(msg);
    }
  })

}

/**
 * 吊起APP地图导航
 * @param long
 * @param lat
 * android callAppGps.handlerParams(obj)
 * IOS callAppGps
 */
export const enterTheodolite = (long,lat) => {
  // let href = window.location.href;
  let _type = getUserAgentType();
  var LONG , LAT;
  if(_type == 1){
    /*let _data = gcj02tobd09(Number(long),Number(lat));
    LONG = _data[0];
    LAT = _data[1];*/
    LONG = long;
    LAT = lat;
  }else if(_type == 2){
    LONG = long;
    LAT = lat;
  }
  var obj = {
    long: LONG,
    lat: LAT
  }
  try {
    if(_type == 1){
      window.callAppGps.handlerParams(JSON.stringify(obj))
    }else if(_type == 2){
      window.webkit.messageHandlers.callAppGps.postMessage(obj);
    }
  }catch (e) {
    alert(e)
  }
}


/*火星坐标转百度坐标*/
const gcj02tobd09 = (lng, lat) => {
  // alert(1)
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat]
};
/**
 * 吊起注商通打电话
 */
export const postZSTTel = (str) => {
  try{
    let _type = getUserAgentType() ;
    if(_type == 1) {
      window.ZSTRequestpostStr.postAndroidZstPhone(str);
    }else if(_type == 2){
      window.webkit.messageHandlers.postIOSZstPhone.postMessage(str);
    }
  }catch(e){
    alert(e) ;
  }
}

/**
 *  设置IOS分享内容
 *  @param {
 *     title: '',
 *     describe: '',
 *     imageUrl: '',
 *     url: ''
 *  }
 * ZSTRequestWebInformation
 */
export const postShareContentIOS = (json) => {
  try{
    let _type = getUserAgentType() ;
    if(_type == 2) {
      window.webkit.messageHandlers.ZSTRequestWebInformation.postMessage(JSON.stringify(json));
    }
  }catch(e){
    alert(e) ;
  }
}

//告诉安卓页面商品简介
export const postStrAndroid = (str) =>{
  try{
    let _type = getUserAgentType() ;
    if(_type == 1) {
      window.ZSTRequestpostStr.postStrAndroid(str);
    }
  }catch(e){
    alert(e) ;
  }
}

//告诉安卓商品标题
export const postTitleAndroid = (str) =>{
  try{
    let _type = getUserAgentType() ;
    if(_type == 1) {
      window.ZSTRequestpostStr.postTitleAndroid(str);
    }
  }catch(e){
    alert(e) ;
  }
}


//告诉安卓页面图片信息
export const postImgAndroid = (img) =>{
  try{
    let _type = getUserAgentType() ;
    if(_type == 1) {
      window.ZSTRequestpostImg.postImgAndroid(img);
    }
  }catch(e){
    alert(e) ;
  }
}

//告诉安卓分享地址
export const postUrlAndroid = (url) =>{
  try{
    let _type = getUserAgentType() ;
    if(_type == 1) {
      window.ZSTRequestpostUrl.postAndroidShareUrl(url);
    }
  }catch(e){
    alert(e) ;
  }
}

/*关闭webview*/
export const closeWebView=()=>{
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestParameter.goBackReturnAndroid();
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTShut.postMessage({url:""});
    }
  }catch(e){

  }
}
export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}




//时间戳转时间
export const timestampToTime = (timestamp) => {
  try{
    timestamp = String(timestamp) ;
    let date;
    if(timestamp.length == 13){
      date = new Date(Number(timestamp));
    }else{
      date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    }
    let Y,M, D, h, m, s;
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate() ) + ' ';
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours() ) + ':';
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes() ) + ':';
    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds() ) + ' ';
    return Y+M+D+h+m+s;
  }catch(e){
    alertMsg(e);
  }
}

/**
 * 获取地址栏参数
 */
function getQueryString (){
  var name, value, i;
  var str = window.location.href;
  var num = str.indexOf("?");
  str = str.substr(num + 1);
  var arrtmp = str.split("&"); //以"&"为节点，返回字符串数组
  for(i = 0; i < arrtmp.length; i++) {
    num = arrtmp[i].indexOf("=");
    if(num > 0) {
      name = arrtmp[i].substring(0, num); //获得字段名
      value = arrtmp[i].substr(num + 1); //获得字段名对应的字段值
      this[name] = value; //this代表当前对象（QueryString的对象）
    }
  }
}
export var request = new getQueryString();

export const chineseFromUtf8Url = (strUtf8) => {
  var bstr = decodeURIComponent(strUtf8);
  return bstr;
}



/*吊起分享界面*/
export const shareInterface = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1) {
      window.ZSTShareInterface.getAndroidShare();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestShare.postMessage({token:""});
    }
  } catch (e) {
    alert(e);
  }
}

/**
 * 吊起产品秀介绍按钮
 */
export const proShowBtn = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTProShowRules.AndroidProShowRules();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTIOSProShowRules.postMessage({token: ""});
    }
  }catch (e) {
    alert(e)
  }
}

/**
 * 禁止产品秀介绍按钮
 */
export const noProShowBtn = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTProShowRules.AndroidProShowClose();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTIOSProShowClose.postMessage({token: ""});
    }
  }catch (e) {
    alert(e)
  }
}

/**
 * 吊起发布产品秀界面
 */
export const releaseProShow = (obj) => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTProShow.getAndroidRelease(JSON.stringify(obj));
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestReleasePro.postMessage(obj);
    }
  }catch (e) {
    alert(e)
  }
}

/**
 * 吊起产品秀举报按钮
 */
export const proShowReportBtn = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.ZSTProShowReport.AndroidReport();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTProShowReport.postMessage({token: ""});
    }
  }catch (e) {
    alert(e)
  }
}

/*禁止举报按钮*/
export const noReportBtn = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.noReportBtn.AndroidNoReportBtn();
    }else if(_type == 2){
      window.webkit.messageHandlers.closeZSTTargetHrefReport.postMessage({token: ""});
    }
  }catch (e) {
    alertMsg(e)
  }
}

/**
 * 通知安卓刷新产品秀状态
 * window.refreshProShow.AndroidRefresh()
 */
export const refreshProShow = () => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.refreshProShow.AndroidRefresh()
    }
  }catch (e) {
    alert(e)
  }
}

/**
 * 吊起APP充值界面
 */
export const Recharge=()=>{
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestRechargeableCoin.getAndroidRechargeableCoin() ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRequestRecharge.postMessage({token:""});
    }
  }catch(e){
    alert(e) ;
  }
}


/**
 *
 * 获取用户ID
 * Android window.ZSTRequestShUserId.getAndroidShUserId() ;
 * IOS ZSTRequestUserId
 */
export const getShareUserId=() => {
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestShUserId.getAndroidShUserId() ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRequestUserId.postMessage({UserId:""});
    }
  }catch(e){
    alert(e) ;
  }
  return new Promise((resolve,reject) => {
    window.ZSTObtainUserId = (msg) => {
      resolve(msg);
    }
  })
}

/**
 * 通知APP修改审核状态
 * @param obj = {
 *     newsId: '', //消息ID
 *     state: ''  //状态 -1未通过 0待审核 1已通过
 * }
 * Android window.reqAuditStatus.auditStatusAndroid(obj);
 * IOS reqAuditStatus(obj)
 */
export const reqAuditStatus = (obj) => {
  try {
    let _type = getUserAgentType();
    if(_type == 1){
      window.reqAuditStatus.auditStatusAndroid(JSON.stringify(obj));
    }else if(_type == 2){
      window.webkit.messageHandlers.reqAuditStatus.postMessage(obj);
    }
  }catch (e) {
    alert(e)
  }
};

/**
 * 打开网页
 * @param url
 * Android openWeb.hanlderMessage(url)
 * IOS  openWeb
 */
export const openWeb = (url) => {
  try {
    let _type = getUserAgentType();
    if (_type == 1) {
      window.openWeb.hanlderMessage(url);
    } else if (_type == 2) {
      window.webkit.messageHandlers.openWeb.postMessage(url);
    }
  }catch(e){

  }
}

/*
 *  与OC交互，将顶部导航栏的颜色传给APP (color 为 000000,安卓不识别#)
 * */
export const postColor = (color) => {
  try {
    let _type = getUserAgentType();
    if(_type == 1) {
      window.ZSTPostColor.postAndroidColor('#'+color);
    }
  } catch(e) {

  }
}

/**
 * 修改IOS顶部状态栏字体颜色
 * @param status 0黑色 1白色
 * IOS postStatusColor
 */
export const postStatusColor = (status) => {
  try {
    let _type = getUserAgentType();
    if(_type == 2) {
      window.webkit.messageHandlers.postStatusColor.postMessage(status);
    }
  } catch(e) {

  }
}

/**
 * 跳转app首页
 * Android window.ZSTRequestGoAPPIndex.AndroidGoAPPIndex();
 * IOS ZSTRequestGoAPPIndex
 */
export const GoAPPIndex = () => {
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      window.ZSTRequestGoAPPIndex.AndroidGoAPPIndex();
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTRequestGoAPPIndex.postMessage({});
    }
  }catch(e){
    alert(e)
  }
}

/**
 * 提交商品小程序uri
 * @param url
 * Android window.postGoodsUrl.androidMethods(url);
 * IOS postGoodsUrl
 */
export const postGoodsUrl = (url) => {
  try {
    var _type = getUserAgentType();
    if(_type == 1){
      window.postGoodsUrl.androidMethods(url);
    }else if(_type == 2){
      window.webkit.messageHandlers.postGoodsUrl.postMessage(url) ;
    }
  }catch (e) {

  }

};

/**
 * 通知APP刷新广告banner
 * @param shopId
 * Android refreshAppBanner.postRefreshShopId(shopId)
 * IOS refreshAppBanner(shopId)
 */
export const refreshAppBanner = (shopId) => {
  try {
    var _type = getUserAgentType();
    if(_type == 1){
      window.refreshAppBanner.postRefreshShopId(shopId);
    }else if(_type == 2){
      window.webkit.messageHandlers.refreshAppBanner.postMessage(shopId) ;
    }
  }catch (e) {

  }
}

/*苹果判断版本*/
export const versions = () => {
  try {
    var _type = getUserAgentType();
    var userAgent = navigator.userAgent;
    var arr = userAgent.split('/');
    var version = arr.pop();
    version = version.substr(2);
    if(_type == 1){
      return true;
    }else if(_type == 2){
      if(version >= 7.05){
        return true;
      }else {
        return false;
      }
    }
  }catch (e) {

  }
}

/**
 * 提交订单——向OC提交购卡订单相关信息
 * */
export const postOrder = (json) => {
  try{
    let _type = getUserAgentType() ;
    if( _type == 1 ){
      let _data = JSON.stringify(json);
      window.ZSTOnlyBuyCard.postAndroidOnlyBuyCard(_data) ;
    }else if( _type == 2 ){
      window.webkit.messageHandlers.ZSTOnlyBuyCard.postMessage(json);
    }
    return new Promise((resolve,reject) => {
      window.ZSTPaySuccess = (state) => {
        resolve(state)
      }
    })
  }catch(e){

  }
}

/**
 * 保存图片
 * @param obj {imageUrl,imageName}
 * Android window.reqSaveImage.HandlersImage(obj);
 * IOS reqSaveImage(obj)
 */
export const reqSaveImage = (obj) => {
  try {
    var _type = getUserAgentType();
    if(_type == 1){
      window.reqSaveImage.handlersImage(JSON.stringify(obj))
    }else if(_type == 2){
      window.webkit.messageHandlers.reqSaveImage.postMessage(obj);
    }
  }catch (e) {
    alert(e)
  }
};

/**
 * 吊起线下商品核销码界面
 * Android window.reqCancelCode.handleOrderNum
 * IOS reqCancelCode
 * @param orderNum
 */
export const cancelCode = (orderNum) => {
  try {
    var _type = getUserAgentType();
    if(_type == 1){
      window.reqCancelCode.handleOrderNum(String(orderNum))
    }else if(_type == 2){
      window.webkit.messageHandlers.reqCancelCode.postMessage(String(orderNum));
    }
  }catch (e) {
    alert(e)
  }
}

const getRad = (d) => {
  var PI = Math.PI;
  return d*PI/180.0;
}

/**
 * 经纬度距离计算
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 */
export const calDistance = (lat1,lng1,lat2,lng2) => {
  lat1 = Number(lat1);
  lng1 = Number(lng1);
  lat2 = Number(lat2);
  lng2 = Number(lng2);
  var radLat1 = getRad(lat1);
  var radLat2 = getRad(lat2);

  var a = radLat1 - radLat2;
  var b = getRad(lng1) - getRad(lng2);

  var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s * 6378.137;
  s = Math.round(s*10000)/10000;

  return s;
}


export let TOKEN;
