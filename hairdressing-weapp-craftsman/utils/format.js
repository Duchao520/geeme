/**
 * 获取当前时间往后对应天数的日期和星期（默认从当前日期开始）
 */
//获取当前时间
const getCurrentMonthFirst = function() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}
/**
 * 传入时间后几天
 * param：传入时间：dates:"2018-04-02",later:往后多少天
 */
const dateLaterAfter = function(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  return dateObj;
}

//获取当前时间多少天后的日期和对应星期
const getDatesAfter = function(days, todate = getCurrentMonthFirst()) { //todate默认参数是当前日期，可以传入对应时间
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLaterAfter(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}


/**
 * 获取当前时间往前对应天数的日期和星期（默认从当前日期开始）
 */
/**
 * 传入时间后几天
 * param：传入时间：dates:"2018-04-02",later:往后多少天
 */
const dateLaterBefore = function(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() - later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  return dateObj;
}

//获取当前时间多少天后的日期和对应星期
const getDatesBefore = function(days, todate = getCurrentMonthFirst()) { //todate默认参数是当前日期，可以传入对应时间
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLaterBefore(todate, i);
    dateArry.unshift(dateObj)
  }
  return dateArry;
}



/**
 * 获取指定月份往前任意数量的月份
 */
const _chinese = function(number) {
  if (number == 1) {
    return '一月'
  } else if (number == 2) {
    return '二月'
  } else if (number == 3) {
    return '三月'
  } else if (number == 4) {
    return '四月'

  } else if (number == 5) {
    return '五月'

  } else if (number == 6) {
    return '六月'

  } else if (number == 7) {
    return '七月'

  } else if (number == 8) {
    return '八月'

  } else if (number == 9) {
    return '九月'

  } else if (number == 10) {
    return '十月'

  } else if (number == 11) {
    return '十一月'

  } else if (number == 12) {
    return '十二月'

  }
}
const monthLater = function(startDate, i) {

  let date = new Date(startDate);
  let _month = Number(date.getMonth()) + 2 - i;
  if(_month<=0){
    _month = _month + 12;
  }
  return {
    number: date.getFullYear() + '-' + _month,
    chinese: _chinese(_month)
  }
}
const getMonthBefore = function(days, startDate = getCurrentMonthFirst()) {
  let monthArr = [];
  for (let i = days; i > 0; i--) {
    let obj = monthLater(startDate, i)
    monthArr.push(obj)
  }
  return monthArr;
}

/**
 * 传入某个日期的后半小时，计算与当前时间的时间差
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
 * 某一个时间，距离当前时间的时间差(*天*时*分)
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
  callBack(time);
}

/**
 * 转化日期格式（由2019-05-12 10：00转化为2019/05/12 10：00）订单处使用
 */
const orderTimeFormat = function(time) {
  let timeArr = time.split(' ');
  let timeDate = timeArr[0].split('-').join('/');
  let timeMin = timeArr[1];
  let timeString = timeDate + ' ' + timeMin
  return timeString;
}

module.exports = {
  getDatesAfter,
  getDatesBefore,
  getMonthBefore,
  timeAfter,
  timeDifference,
  orderTimeFormat,
}