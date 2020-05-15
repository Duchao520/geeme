/**
 * 接收口令的函数
 * @param msg
 * @constructor
 */
import md5 from 'js-md5';
var testData = {token: '1557909444523', sec: ''};

export const USER_AGENT = {IOS:{K:'zst-ios-broswer',V:0},ANDROID:{K:'zst-android-broswer',V:1},OTHERS:{K:'',V:2}}

/**
 *判断是否在app内打开
 */
export const getUserAgentType = () =>{
    if(navigator.userAgent.indexOf(USER_AGENT.ANDROID.K) >= 0){
        return 1 ;
    }else if(navigator.userAgent.indexOf(USER_AGENT.IOS.K) >= 0){
        return 2 ;
    }else{
        return 3 ;
    }
}

/**
 * 获取口令
 */
export const getToken=()=>{
  try{
    let _type = getUserAgentType();
    // alert(_type);
    if(_type == 1){
      // alert('android');
      window.ZSTRequestParameter.getAndroidParameter() ;
    }else if(_type == 2){
      // alert('---------------------------IOS');
      window.webkit.messageHandlers.ZSTRequestParameter.postMessage({token:'' }) ;
    }
  }catch(e){
    console.log(e);
  }
  return  new Promise((resolve,reject)=>{
    // resolve(testData.token); //测试用
     window.ZSTObtainParameter = (msg) => {
       // alert("口令"+msg);
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
 */
export const postTitle = (title) =>{
    try{
        let _type = getUserAgentType() ;
        if(_type == 1) {
            window.document.title = title;
        }else if(_type == 2){
            window.webkit.messageHandlers.ZSTRequestPostTitle.postMessage(title);
        }
    }catch(e){
        alert(e);
    }
}

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
export const getSignIn= jsonObj=>{
    return new Promise((resolve,reject)=>{
      try{

          window.reqSignin.signInHandler(JSON.stringify(jsonObj)); // android 使用json字符串
      }catch(e){
          try{
              window.webkit.messageHandlers.reqSignin.postMessage(jsonObj) // ios直接使用json对象
          }catch(e){
              resolve(md5(asciiSort(jsonObj)));
          }
      }
    window.respSignIn = (msg)=>{
        // resolve(testData.sec);//测试用
        // alert(msg);
      resolve(msg);
    }
  })
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
            window.webkit.messageHandlers.ZSTGetExtension.postMessage();
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
 * app交互唤起微信,支付宝付款码界面
 * @param type 1 唤起微信
 *             2 唤起支付宝
 *
 * Android ZSTCallApp.callAppHandler(type)
 * IOS ZSTCallApp
 */
export const callApp = (type) => {
    try{
        let _type = getUserAgentType();
        if(_type == 1){
            window.ZSTCallApp.callAppHandler(type);
        }else if(_type == 2){
            window.webkit.messageHandlers.ZSTCallApp.postMessage(type);
        }
    }catch (e) {
        alert(e);
    }
}


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
        alert(e);
    }
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
      window.ZSTSweepPayCallback = (data) => {
        resolve(data)
      }
    })
  }catch (e) {
    alert(e);
  }
}

/**
 * 前往APP首页
 * Android ZSTRequestGoAPPIndex.AndroidGoAPPIndex
 * IOS ZSTRequestGoAPPIndex
 */
export const ZSTRequestGoAPPIndex = () => {
  try {
    var _type = getUserAgentType();
    if(_type == 1){
      window.ZSTRequestGoAPPIndex.AndroidGoAPPIndex();
    }else if(_type == 2){
      window.webkit.messageHandlers.ZSTRequestGoAPPIndex.postMessage({});
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
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
};

/**
 * 获取sessionStorage
 */
export const getStore = (name) => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
}

/**
 * 时间戳转为yyyy-mm-dd hh-mm-ss
 */
export const timestampToTime = (timestamp)=>{
  let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y , M , D ,h , m , s ;
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = date.getDate() + ' ';
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds();
  return Y+M+D+h+m+s;
}

/**
 * 时间戳转为yyyymmddhhmmss
 */
export const timestampToTime2 = (timestamp)=>{
  let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y , M , D ,h , m , s ;
  Y = date.getFullYear();
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  D = date.getDate();
  h = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();
  return '' + Y+M+D+h+m+s;
}

export const concatJsonData = (json) => {
  let params = '?'
  for(let i in json){
    params += i + '=' + json[i] + '&';
  }
  return params;
};

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


//除法
export function accDiv(arg1,arg2){

  var t1=0,t2=0,r1,r2;
  try{t1=arg1.toString().split(".")[1].length}catch(e){}
  try{t2=arg2.toString().split(".")[1].length}catch(e){}
  r1=Number(arg1.toString().replace(".",""))
  r2=Number(arg2.toString().replace(".",""))
  return accMul((r1/r2),Math.pow(10,t2-t1));
}
//乘法
export function accMul(arg1,arg2)
{
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
//加法
export function accAdd(arg1,arg2){
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2))
  return (arg1*m+arg2*m)/m
}
//减法
export function Subtr(arg1,arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}


  export let TOKEN;
