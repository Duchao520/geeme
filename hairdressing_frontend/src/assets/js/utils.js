import config from 'config/config'
import store from '@/store'
/**
 * 公用的工具函数
 */
import * as datas from './datas'
// import state from '../../store/modules/bill/billCardInfo/state'
// 检测用户信息
// 电话号码的检测
export function checkPhone(type) {
  return /^(1[3-9][0-9]{9})$/.test(type)
}

// 客服电话的检测:验证为手机号或座机号
export function checkSerPhone(type) {
  let reg = new RegExp("-", "g")
  let _type = type.replace(reg, "");
  return /^1[34578]\d{9}$/.test(_type) || /^(\(\d{3,4}\)|\d{3,4})?\d{7,8}$/.test(_type)
}

// 验证码的检测
export function checkCode(type) {
  return /^\d{6}$/.test(type)
}

// 密码的检测
export function checkPassword(type) {
  return /^(?=[A-z]*[0-9])(?=[0-9]*[A-z])[A-z0-9]{6,16}$/.test(type)
}

// 设置cookie
export function setCookie(cname, cvalue, exdays = 0) {
  // 默认过期时间为0
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  // cookie 1/3
  // window.document.cookie = cname + "=" + cvalue + ";path=/;expires=" + d.toGMTString();
  // 伪造cookie 1/3
  store.commit('SAVE_USER_INFO', {
    tokenLikeInCookie: [`geeme_pc_token=${cvalue}`, exdays, cvalue, exdays],
    token: cvalue, // 以后从这里取
  }) 
}

// 获取cookie
export function getCookieToken(cname) {
  // cookie 2/3
  // return window.document.cookie.match('(^|;) ?' + cname + '=([^;]*)(;|$)');
  // 伪造cookie 2/3
  return store.state.manage.userInfo.tokenLikeInCookie
}

// 清除cookie
export function clearCookie(cname) {
  // cookie 3/3
  // setCookie(cname, "", -1);
  // 伪造cookie 3/3
  store.commit('SAVE_USER_INFO', {
    tokenLikeInCookie: null,
    token: null, // 以后从这里取
  })
}

// 数组中的每一项对比
export function compareArr(arr) {
  for (let i = 0, len = arr; i < arr.length; i++) {
    if (arr[0] !== arr[i]) {
      return false
    }
  }
  return true
}

// 上传图片类型检测,类型是否是jpg|jpeg|png
export function checkImgType(type) {
  return /(jpg|jpeg|png)$/.test(type)
}

export function checkImgTypes(type) {
  return /(jpg|jpeg|png|gif)$/.test(type)
}

// 获取上传接口的头部信息
export function getUploadHeader() {
  let token = getCookieToken('geeme_pc_token')
  return {
    Authorization: (!!token && token[2].length) ? token[2] : ''
  }
}

// 检查字符串是否为空
export function isNoSting(string) {
  return !!string.length
}

// 将日期转为时间戳
export function formatToStamp(date) {
  let timestamp = null
  if (!!date && new Date(date) != 'Invalid Date') {
    timestamp = Date.parse(new Date(date));
  }
  return timestamp
}

// 计算两个时间点的时间差
export function twoTimeDif(first, second) {
  // 获取当前时间，主要作为时间戳的转化
  let today = new Date().format('yyyy-MM-dd') + ' '
  // 第一个时间戳
  let _first = new Date(new Date(today + first)).getTime() / 1000;
  // 第二个时间戳
  let _second = new Date(new Date(today + second)).getTime() / 1000;
  // 时间戳的差值
  let dif = _first - _second
  // 小时
  let h = parseInt(dif / 60 / 60 % 24) <= 9 ? '0' + parseInt(dif / 60 / 60 % 24) : parseInt(dif / 60 / 60 % 24)
  let s = parseInt(dif / 60 % 60) <= 9 ? '0' + parseInt(dif / 60 % 60) : parseInt(dif / 60 % 60)
  return h + ':' + s
}

// 标准时间转为日期
export function formatDate(date) {
  if (!!date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + m + '-' + d
  }
}

// 标准时间转为时间
export function formatTime(date) {
  if (!!date) {
    let h = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return h + ':' + minute + ':' + second
  }
}

// 标准时间转为日期和时间
export function formatDateTime(date, add) {
  var add = add ? add : 0
  if (!!date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d + add < 10 ? ('0' + (d + add)) : (d + add)
    let h = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    h = h < 10 ? ('0' + h) : h
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  }
}

// 根据标准时间获取某日零时的时间
export function getZeroTime(day) {
  var date = new Date();
  var milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * (day ? day : 0);
  date = new Date(milliseconds);
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + m + '-' + d + ' 00:00:00'
}

// 标准时间转为年月日时分
export function formatDateTimeFromYearToMinute(date) {
  if (!!date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let minute = date.getMinutes()
    minute = minute < 10 ? ('0' + minute) : minute
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute
  }
}

// 标准时间转为年月日时分秒
export function formatDateTimeFromYearToSecond(date) {
  if (!!date) {
    date = new Date(date);
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let minute = date.getMinutes()
    minute = minute < 10 ? ('0' + minute) : minute
    let second = date.getSeconds()
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  }
}

//标准化时间差
export function formatTimeDifference(time) {
  let diff = new Date() - new Date(time);
  let h = Math.floor(diff / 3600 / 1000);
  h = h < 10 ? ('0' + h) : h;
  let hLastTime = diff - h * 3600 * 1000;
  let m = Math.floor(hLastTime / 60 / 1000);
  m = m < 10 ? ('0' + m) : m;
  let mLastTime = hLastTime - m * 60 * 1000;
  let s = Math.floor(mLastTime / 1000);
  s = s < 10 ? ('0' + s) : s;
  return {
    diff,
    formatTime:`${h}:${m}:${s}`
  };
}

// 标准时间转为年月日
export function formatDateTimeYYR(date) {
  if (!!date) {
    date = new Date(date);
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + m + '-' + d
  }
}

// 标准时间转为年月
export function formatDateTimeYYM(date) {
  if (!!date) {
    date = new Date(date);
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    return y + '-' + m
  }
}

// 标准时间转为时分
export function formatDateTimeHM(date) {
  date = new Date(date);
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  return h + ':' + minute
}

// 获取某月的有多少天
export function formatDateMonthDay(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

// 消息类型提示代码
export function tipCode(code) {
  let type = ''
  switch (code) {
    case 0: // 0为成功
      type = 'success'
      break
    case 1: // 1为警告
      type = 'warning'
      break
    case -1: // -1为失败
      type = 'error'
      break
  }
  return type
}

// 提示信息框
export function showTip(el, params) {
  el.$message({
    showClose: params.isClose || false,
    message: params.msg || '',
    type: params.type || '',
    duration: params.time || '2000',
    center: true,
    onClose: params.onClose || function () {
    }
  })
}

// 是否超过固定长度
export function checkLen(s, len) {
  // let reg = new RegExp("^\.{" + len + "}$","")
  return (s + '').length <= len
}

// 匹配字符串替换
export function matchReplace(str, rword, type, word) {
  // str为原字符
  // rword为要替换的字符
  // type为全局
  // word为替换成的字符
  let reg = new RegExp(rword, type)
  return str.replace(reg, word);
}

// 类数组转为真正的数组
export function transRealArray(arr) {
  return Array.from(arr)
}

// 检测字符串是否存在某个字符串内
export function isInString(str, word) {
  // str为原字符串,word为要查找的字符串
  let reg = new RegExp(word, 'g')
  return reg.test(str)
}

// 检测字符串是否以某个字符开头
export function isInBeforString(str, word) {
  // str为原字符串,word为要查找的字符串
  let reg = new RegExp('^' + word, 'g')
  return reg.test(str)
}

// 为图片id添加前缀
// export function formatImg(id) {
//     return !!id ? (datas.imgUrl.URL + id) : datas.logoDef.URL
// }
// 有尺寸的图片处理
export function formatPicImg(id, type, size) {
  return new RegExp("https").test(id) ? id : (id ? (type && size ? (IMAGE_URL + '/' + id + '!' + type + size) : (IMAGE_URL + '/' + id)) : datas.logoDef.URL)
}

// id是要显示的图片id
// type是图片的类型，circle是原形，style是方形
// size是尺寸，根据后端给的标准来定
// dname是默认图片
// other 是其他参数
// style: 40, 70, 146
// circle: 40, 70, 160
export function formatPicImage(id, type, size, dname, other) {
  let _dname = dname
  if (dname === 'someone') {
    if (other === '男') {
      _dname = 'boy'
    } else if (other === '女') {
      _dname = 'girl'
    }
  }
  return new RegExp("https").test(id) ? id : (id ? (IMAGE_URL + '/' + id + '!' + type + size) : datas.defaultImg[_dname])
}

/*
 * 对象排序
 * @description 根据某个字段实现对json数组的排序
 * @param array 要排序的json数组对象
 * @param field 排序字段（此参数必须为字符串）
 * @param reverse 是否倒序（默认为false）
 * @return array 返回排序后的json数组
 */
export function jsonSort(array, field, reverse) {
  //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
  if (array.length < 2 || !field || typeof array[0] !== "object") return array;
  //数字类型排序
  if (typeof array[0][field] === "number") {
    array.sort(function (x, y) {
      return x[field] - y[field]
    });
  }
  //字符串类型排序
  if (typeof array[0][field] === "string") {
    array.sort(function (x, y) {
      return x[field].localeCompare(y[field])
    });
  }
  //倒序
  if (reverse) {
    array.reverse();
  }
  return array;
}

/*
 * 工作日排序
 * @description 将weekDayString按周一至周日排序
 * @param array 必须为包含weekToChina中各键名的字符串数组
 * @param isEn 是否以英文输出(默认为false)
 */
export function weekDaySort(array, isEn) {
  let result = []
  let beforeToString = []
  let sortMap = {
    MONDAY: {en: 'MONDAY', name: '周一', idx: 1},
    TUESDAY: {en: 'TUESDAY', name: '周二', idx: 2},
    WEDNESDAY: {en: 'WEDNESDAY', name: '周三', idx: 3},
    THURSDAY: {en: 'THURSDAY', name: '周四', idx: 4},
    FRIDAY: {en: 'FRIDAY', name: '周五', idx: 5},
    SATURDAY: {en: 'SATURDAY', name: '周六', idx: 6},
    SUNDAY: {en: 'SUNDAY', name: '周日', idx: 7}
  }
  array.map(v => {
    result.push(sortMap[v])
  })
  result = jsonSort(result, 'idx')
  result.map(v => {
    if (isEn)
      beforeToString.push(v.en);
    else
      beforeToString.push(v.name);
  })
  return beforeToString;
}

// 防抖
export function debounce(fn, wait = 40) {
  var timeout = null;
  return function () {
    if (timeout !== null)
      clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.call(this, arguments)
    }, wait);
  }
}

//检测空对象
export function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

// 将中文星期缩减显示  ['周一', '周二', '周三', '周五', '周六']  => "周一至周三,周五至周六"
export const weekListFunc = function (weekList) {
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
  weekList.forEach(function (v) {
    _weekList.push({
      name: v,
      idx: weekObj[v]
    })
  })
  // 对数组按周一至周日进行排序
  _weekList.sort(function (a, b) {
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
}

// 交集--->
function unionInArrays(arr1, arr2) {
  return arr1.filter(v => new Set(arr2).has(v))
}

export function publicIdsIn2dArray(twoDimensionalArray) {
  let current = twoDimensionalArray[0]
  if (twoDimensionalArray.length === 1) {
    return current
  }
  for (let i = 0; i < twoDimensionalArray.length - 1; i++) {
    current = unionInArrays(current, twoDimensionalArray[i + 1])
  }
  return current
}

/*
* 数字格式化，小数的默认保留两位小数
* */
export function formatNumber(number, digits) {
  if (Number.isInteger(number)) {
    return number
  } else {
    let digit = digits || 2;
    return number.toFixed(digit);
  }
}

export function formatPrice(min, max) {
  if (min === max) {
    return formatNumber(min);
  } else {
    return formatNumber(min) + "-" + formatNumber(max);
  }
}

// 工位、销售职级id添加
export function levelIdAdd(arr) {
  if (Array.isArray(arr) && arr.length) {
    arr.map(i => {
      if (!i.deleted) {
        i.assistantOrSalers && i.assistantOrSalers.map(item => {
          item.postId = item.levelId
          item.postName = item.levelName
        })
        i.stationOne && i.stationOne.map(item => {
          item.postId = item.levelId
          item.postName = item.levelName
        })
        i.stationThree && i.stationThree.map(item => {
          item.postId = item.levelId
          item.postName = item.levelName
        })
      }
    })
  } else {
    return
  }
}
