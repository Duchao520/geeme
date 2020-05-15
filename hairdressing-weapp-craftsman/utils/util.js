const imageUrl = require('../config/index.js').ImageUrl

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

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

const formatTime3 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatTime4 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return [year, month].map(formatNumber).join('-')
}

const formatTime5 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}

const formatTime6 = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

// a=1&b=2形式的scene转为Json
function sceneToJson(scene) {
  scene = decodeURIComponent(scene)
  let arr = scene.split('&')
  let obj = {}
  for (const v of arr) {
    if(v.includes('=')){
      obj[v.split('=')[0]] = v.split('=')[1]
    }else if(v.includes(':')){
      obj[v.split(':')[0]] = v.split(':')[1]
    }
  }
  return obj
}

//获取当前时间
const getCurrentDate = function () {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}

/**
 * 传入时间后几天
 * param：传入时间：dates:"2018-04-02",later:往后多少天
 */
const dateLater = function (dates, later) {
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
const getDates = function (days, todate = getCurrentDate()) { //todate默认参数是当前日期，可以传入对应时间
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}

// 获取正确的imageUrl
var getImageUrl = function (image) {
  if (!image) return
  if (image.indexOf('https://') != -1 || image.indexOf('http://') != -1) {
    return image
  } else {
    return imageUrl + image
  }
}

/**
 * 匹配每个规格对应的数量
 */
const matching = function (serviceList, specificationList) {
  for (let i = 0; i < serviceList.length; i++) {
    for (let j = 0; j < specificationList.length; j++) {
      if (serviceList[i].specificationId == specificationList[j].specificationId) {
        serviceList[i].count = specificationList[j].count
      }
    }
  }
  return serviceList;
}

module.exports = {
  formatTime,
  formatTime2,
  formatTime3,
  formatTime4,
  formatTime5,
  formatTime6,
  sceneToJson,
  getDates,
  getImageUrl,
  getCurrentDate,
  matching
}