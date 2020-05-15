// 工具函数库
import md5 from 'js-md5';
// 时间戳转日期
export const toDate = function(timeStamp) {
  var date = new Date(timeStamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  // var h = date.getHours() + ':' ;
  var h = (date.getHours() < 10 ? '0' + (date.getHours()) + ':' : date.getHours()+':');
  // var Min = date.getMinutes()< 10? '0'+ (date.getMinutes())':' : ; // 获取分钟数(0-59)
  var Min = (date.getMinutes() < 10 ? '0' + (date.getMinutes())+':' : date.getMinutes()+":");
  var Sec = (date.getSeconds()<10 ? '0' + (date.getSeconds()) : date.getSeconds() ); // 获取秒数(0-59)
  return Y + M + D + h + Min + Sec
}

// 字符串日期获取年月日
export const getYeMoDa = function(timeStamp) {
  var date = new Date(timeStamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = ((date.getMonth()+1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  return Y + M + D
}

//获取参数
export function getQuery() {
  const pages = getCurrentPages();

  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  return options
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
 * @param jsonObj 一套签名规则
 */
export const getSignIn = (jsonObj)=>{
  return new Promise((resolve,reject) => {
     resolve(md5(asciiSort(jsonObj)));
  })
}

//utf-8 解码
/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeSearchParams(obj) {
  const params = []

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, value].join('='))
  })

  return params.join('&')
}


export function json2Form(json) {
  var str = [];
  for(var p in json){
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}


const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src';

export function base64src(base64data,src='') {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}${src}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
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
  s = s.toFixed(2)
  return s;
}

export const bd_decrypt = (bd_lat, bd_lon) => {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return {lat: gg_lat, lng: gg_lng}
}



const xxxx = wx.getFileSystemManager();
const FILE_BASE = 'tmp_base64Name';

export function base64Name(base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    xxxx.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
}





