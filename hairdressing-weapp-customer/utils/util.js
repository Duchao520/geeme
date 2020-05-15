const app = require("../config/develop.js");
const appData = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**  
 * 图片请求地址
 */
const imageUrl = app.imageUrl;

/** 
 * Api请求地址 
 */
const url = app.Dataurl;

const appId = app.appId

// 获取正确的imageUrl
var getImageUrl = function(image) {
  if (!image) return
  if (image.indexOf('https://') != -1 || image.indexOf('http://') != -1) {
    return image
  } else {
    return imageUrl + image
  }
}

// a=1&b=2形式的scene转为Json
function sceneToJson(scene) {
  scene = decodeURIComponent(scene)
  let arr = scene.split('&')
  let obj = {}
  for (const v of arr) {
    if (v.includes('=')) {
      obj[v.split('=')[0]] = v.split('=')[1]
    } else if (v.includes(':')) {
      obj[v.split(':')[0]] = v.split(':')[1]
    }
  }
  return obj
}

/**
 * 添加发型师预约操作
 */
const addhair = function (staffId, storeId = wx.$getStorage('storeId')) {
  let obj = wx.getStorageSync('appointment') || {};
  obj.staffId = staffId;
  obj.storeId = storeId;
  wx.$setStorage('appointment', obj)
  return true
}

/**
 * 添加服务预约操作(算出预约金额)
 * amount貌似没用了
 */
const addservice = function(specificationList, amount, storeId = wx.getStorageSync('appointment').storeId) {
  let obj = wx.getStorageSync('appointment') || {}
  obj.specificationList = specificationList;
  obj.amount = amount
  obj.storeId = storeId
  wx.setStorageSync('appointment', obj);
}

/**
 * 添加时间预约操作
 */
const addtime = function(dueTime, storeId = wx.getStorageSync('appointment').storeId) {
  let obj = wx.$getStorage('appointment') || {}
  obj.dueTime = dueTime
  obj.storeId = storeId
  wx.setStorageSync('appointment', obj)
}


/**
 * 计算预付金额
 */
const calcAmount = function(serviceList, countList) {
  let countTotal = 0;
  for (let i = 0; i < serviceList.length; i++) {
    for (let j = 0; j < countList.length; j++) {
      if (serviceList[i].specificationId == countList[j].specificationId) {
        countTotal += serviceList[i].price * countList[j].count
      }
    }
  }
  return countTotal
}

/**
 * 匹配每个规格对应的数量
 */
const matching = function(serviceList, specificationList) {
  for (let i = 0; i < serviceList.length; i++) {
    for (let j = 0; j < specificationList.length; j++) {
      if (serviceList[i].specificationId == specificationList[j].specificationId) {
        serviceList[i].count = specificationList[j].count
      }
    }
  }
  return serviceList;
}

/**
 * 时间格式的转换
 */
const timeFormat = function(time) {

  let timeArr = time.split(' ');
  let timeDate = timeArr[0].split('/').join('-');
  let timeMin = timeArr[1];
  let timeString = timeDate + ' ' + timeMin
  return timeString;
}

const timeFormatCopy = function(time) {
  let timeArr = time.split(' ');
  let timeDate = timeArr[0].split('-').join('/');
  let timeMin = timeArr[1];
  let timeString = timeDate + ' ' + timeMin
  return timeString;
}

const timeFormatT = function(time) {
  if (!time) return;
  if (!time.includes('T')) return time
  let arr = time.split('T');
  arr[0] = arr[0].replace(/-/g, '/')
  arr[1] = arr[1].slice(0, -3);
  return arr.join(' ');
}

// 年月日时分秒显示，用于商品快照页
const timeFormatToCN = function(time) {
  if (!time) return;
  let arr = time.split(' ');
  let days = arr[0].split('-');
  let times = arr[1].split(':')

  return `${days[0]}年${days[1]}月${days[2]}日 ${time[0]}点${times[1]}分${times[2]}秒`
}

// 时间函数
//获取当前时间
const getCurrentDate = function() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}
/**
 * 传入时间后几天
 * param：传入时间：dates:"2018-04-02",later:往后多少天
 */
const dateLater = function(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  dateObj.timestamp = new Date(dateObj.year, dateObj.month - 1, dateObj.day).valueOf()
  return dateObj;
}
//获取d当前时间多少天后的日期和对应星期
const getDates = function(days, todate = getCurrentDate()) { //todate默认参数是当前日期，可以传入对应时间
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
/**
 * 算出俩个时间之间的时间差(*天*时*分)
 */
const timeDifference = function(faultDate, callBack) {
  let timeArr = faultDate.split(' ');
  let timeDate = timeArr[0].split('-').join('/');
  let timeMin = timeArr[1];
  let timeString = timeDate + ' ' + timeMin
  var stime = Date.parse(new Date(timeString));
  var etime = Date.parse(new Date());
  var usedTime = stime - etime > 0 ? stime - etime : 0; //两个时间戳相差的毫秒数
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  var time = days + "天" + hours + "小时" + minutes + "分钟";
  callBack ? callBack(time) : '';
  return time;
}


/**
 * 算出一个时间段距离半个小时之后的时间差(*天*时*分)
 */
const timeAfter = function(faultDate, callBack) {

  var stime = Date.parse(new Date(faultDate));
  var etime = Date.parse(new Date());
  var usedTime = stime - etime; //两个时间戳相差的毫秒数
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  var time = days + "天" + hours + "小时" + minutes + "分钟";
  callBack(time);
}


/**
 * 时间戳转YYYY-MM-DD hh:mm:ss格式
 */
const timestampTotime = function(timestamp){
  var dateObj = new Date(timestamp),
    Y = dateObj.getFullYear(),
    M = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1,
    D = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate(),
    h = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours(),
    m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes(),
    s = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds(),
    dateStr = `${Y}-${M}-${D} ${h}:${m}:${s}`
  return dateStr
}

/**
 * 传入一周的星期，返回该渲染的数组
 */
const weekListFunc = function(weekList) {
  if (!(weekList && weekList.length)) return
  // 若只有一天，直接返回这一天
  if (weekList.length === 1) {
    return weekList[0]
  }
  let _weekList = [];
  let weekObj = {
    '周一': 1,
    '周二': 2,
    '周三': 3,
    '周四': 4,
    '周五': 5,
    '周六': 6,
    '周日': 7
  }
  weekList.forEach(function(v) {
    _weekList.push({
      name: v,
      idx: weekObj[v]
    })
  })

  // 对数组按周一至周日进行排序
  _weekList.sort(function(a, b) {
    return a.idx - b.idx
  })

  // 得到最后的str
  let newList = [];
  let subList = [_weekList[0].name];
  let str = '';

  let i = 1;
  do {
    if (_weekList[i].idx - _weekList[i - 1].idx === 1) {
      subList.push(_weekList[i].name)
    } else {
      newList.push(subList)
      subList = [_weekList[i].name]
    }
    i++;
  } while (i < _weekList.length)
  newList.push(subList);

  for (i = 0; i < newList.length; i++) {
    subList = newList[i];
    if (subList.length > 1) {
      str += subList[0] + '至' + subList[subList.length - 1]
    } else {
      str += subList[0]
    }
    str += ','
  }
  return str.substring(0, str.length - 1)
};

// 主题皮肤相关
var skins = [null, {
  color1: '#f52d56',
  color2: '#ff1e8b'
}, {
  color1: '#000000',
  color2: '#787474'
}, {
  color1: '#cc9932',
  color2: '#e9c06b'
}, {
  color1: '#009999',
  color2: '#01cccc'
}, {
  color1: '#7e46b6',
  color2: '#6666cc'
}, {
  color1: '#ffbc00',
  color2: '#ffdd98'
}, {
  color1: '#019966',
  color2: '#00cf82'
}, {
  color1: '#0199ff',
  color2: '#0066ff'
}]

var getSkin = function (themeId = 1) {
  return skins[themeId]
}

/**
 * md5加密
 */
const getMd5 = function(string) {
  function md5_RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function md5_AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  function md5_F(x, y, z) {
    return (x & y) | ((~x) & z);
  }

  function md5_G(x, y, z) {
    return (x & z) | (y & (~z));
  }

  function md5_H(x, y, z) {
    return (x ^ y ^ z);
  }

  function md5_I(x, y, z) {
    return (y ^ (x | (~z)));
  }

  function md5_FF(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }

  function md5_GG(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }

  function md5_HH(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }

  function md5_II(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }

  function md5_ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function md5_WordToHex(lValue) {
    var WordToHexValue = "",
      WordToHexValue_temp = "",
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function md5_Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;
  string = md5_Utf8Encode(string);
  x = md5_ConvertToWordArray(string);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = md5_AddUnsigned(a, AA);
    b = md5_AddUnsigned(b, BB);
    c = md5_AddUnsigned(c, CC);
    d = md5_AddUnsigned(d, DD);
  }
  return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}

const IF = function (field) {
  if (!field || field == '0' || field == 'false' || field == 'undefined' || field == 'NaN' || field == 'null') {
    return false;
  } else {
    return true;
  }
}

//除法
const AccDiv = function(arg1, arg2) {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  var t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return AccMul((r1 / r2), Math.pow(10, t2 - t1));
}
//乘法
const AccMul = function(arg1, arg2) {
  arg1 = Number(arg1); arg2 = Number(arg2)
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//加法
const AccAdd = function(arg1, arg2) {
  arg1 = Number(arg1); arg2 = Number(arg2)
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
//减法
const Subtr = function(arg1, arg2) {
  arg1 = Number(arg1); arg2 = Number(arg2)
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

//接口result合并
const PromiseAll = function(PromiseArr = []){
  return Promise.all(PromiseArr.map((promiseItem) => {
    return promiseItem.catch((err) => {
      return {}
    })
  })).then(res => {
    PromiseArr = null;
    return Object.assign(...res)
  })
}

const type = function (obj) {
  if (obj == null) return String(obj)
  return typeof obj === 'object' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}

//处理城市名
const replaceCity = function(cityName = ''){
  let Regex1 =/城区/,
      Regex2 = /市/;
  // console.log(Regex1.test('昆明市'))
  if(Regex1.test(cityName)){
    return cityName.replace('城区','');
  }else if(Regex2.test(cityName)){
    return cityName.replace('市', '');
  }else{
    return cityName;
  }
}

function Rad(d) {
  return d * Math.PI / 180.0;
}

const distance = function (lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(1);
}

const setStorageLocalStore = function(store){
  let browerStoreList = wx.$getStorage('browerStoreList');
  if (!browerStoreList) browerStoreList = new Array;
  if (browerStoreList.filter(ele => ele.id == store.id).length > 0) return browerStoreList;
  browerStoreList.unshift(store);
  if (browerStoreList.length > 5){
    browerStoreList.pop();
  }
  wx.$setStorage('browerStoreList', browerStoreList);
  return browerStoreList
}


module.exports = {
  formatTime: formatTime,
  url,
  appId,
  addhair,
  addservice,
  addtime,
  getDates,
  imageUrl,
  calcAmount,
  timeFormat,
  timeFormatCopy,
  matching,
  timeAfter,
  timeDifference,
  getMd5,
  weekListFunc,
  timeFormatT,
  timeFormatToCN,
  formatTime2,
  sceneToJson,
  getImageUrl,
  formatNumber,
  getSkin,
  IF,
  AccDiv,
  AccMul,
  AccAdd,
  Subtr,
  PromiseAll,
  replaceCity,
  distance,
  setStorageLocalStore,
  timestampTotime,
  type
}