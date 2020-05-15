let USERINFO = {} , IMGFORMDATA = {} , CARDPAGE = {} , AGENTINFO = {} , AGENTTIME = {};
var MAINCARD = {} , CODELIST = [];

const rule = {
  empty: function(str, mess) { //不能为空
    if(str == '') {
      mess == '' ? '' : toast(mess);
      return false
    } else {
      return true
    }
  },
  phone: function(str) { //手机号校验
    let myReg = /^(1)[0-9]{10}$/;
    if(!myReg.test(str)) {
      toast('手机号码有误')
      return false
    } else {
      return true
    }
  },
  testLength: function(str, len) { //验证是否达到指定的最小长度
    if(str.length < len) {
      toast('输入的内容长度小于' + len)
      return false
    } else {
      return true
    }
  },
  testZFB: function(str, mess) { //支付宝账户验证
    var myReg = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/
    if(!myReg.test(str)) {
      mess == '' ? '' : toast(mess);
      //toast('请输入正确的支付宝账户')
      return false
    } else {
      return true
    }
  },
  name: function(str) { //中文姓名
    var myReg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
    if(!myReg.test(str)) {
      toast('请输入正确的姓名')
      return false
    } else {
      return true
    }
  },
  testSum:function(str){ // 验证带小数且不超过两位小数的数值
    let myReg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if(!myReg.test(str)) {
      toast('只能输入数值，且小数不超过两位')
      return false
    } else {
      return true
    }
  },
  IDCard: function (str) { //验证身份证号
    var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if(!reg.test(str)) {
      toast('请输入规范身份证号')
      return false;
    } else {
      return true;
    }
  }
}



/**
 * toast提示语
 */
const toast = (msg = '', time = 2000) => {
  var toast = document.createElement('div')
  toast.className = 'common-toast common-toast-show'
  toast.innerHTML = msg
  document.body.appendChild(toast)
  toast.style.display = 'block'
  toast.style.margin = `-${toast.offsetHeight / 2}px 0 0 -${toast.offsetWidth / 2}px`
  var timer = setTimeout(() => {
    toast.className = 'common-toast common-toast-hide'
    clearTimeout(timer)
    var timer2 = setTimeout(() => {
      document.body.removeChild(toast)
      clearTimeout(timer2)
    }, 200)
  }, time)
}

/*获取当前时间20180505*/
const getNowFormatDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if(month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if(strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + month + strDate;
  return currentdate;
}

//更换状态,str   ，name替换的内容 ,seat
const replaceNext = (str, name, seat) => {
  try {
    str = str.split('');
    str.splice(seat, 1, name);
    str = str.join('');
    return str;
  } catch(e) {

  }
}

//dataURL转换为Blob对象
const dataURLtoBlob = (dataurl) => {
  try {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  } catch(e) {
    alert(e);
  }
}

/**
 * valiDateIDCard  验证身份证合法性
 */
const valiDateIDCard = (IDCard) => {
  var flag = false;
  var destCard = '';
  if(IDCard && IDCard.length == 18){
    var id17 = IDCard.substring(0,IDCard.length-1) ;
    var weight=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];    //十七位数字本体码权重
    var validate=[ '1','0','X','9','8','7','6','5','4','3','2'];    //mod11,对应校验码字符值
    var sum = 0;
    var mode = 0;
    for(var i = 0; i < id17.length; i++){
      // System.out.println("sum:"+sum+"card字符："+String.valueOf(id17.charAt(i))+"本体权重："+weight[i]+"权重:"+Integer.parseInt(String.valueOf(id17.charAt(i)))*weight[i]);
      sum=sum+Number(id17.charAt(i).valueOf())*weight[i];
    }
    console.log(sum);
    mode = sum % 11;
    destCard = id17+validate[mode];
  }
  flag = destCard==IDCard;
  if(!flag){
    toast('请输入合法身份证');
  }
  return flag ;
};

const shuffle = (arr) => {
  var len = arr.length;
  for(var i = 0; i < len - 1; i++){
    var idx = Math.floor(Math.random() * (len - i));
    var temp = arr[idx];
    arr[idx] = arr[len - i - 1];
    arr[len - i -1] = temp;
  }
  return arr;
}


//将blob对象转为dataUrl
const readBlobAsDataURL = (blob, callback) => {
  try {
    var a = new FileReader();
    a.onload = function(e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  } catch(e) {
    alertMsg(e);
  }
}

const isNVL = (str, dest) => {
  return str || dest;
}

/**
 * 获取localStorage
 */
const getStore = name => {
  if(!name) return;
  return window.sessionStorage.getItem(name);
}

/**
 * 存储localStorage
 */
const setStore = (name, content) => {
  if(!name) return;
  if(typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
}

/**
 * 删除localStorage
 */
const removeStore = name => {
  if(!name) return;
  window.sessionStorage.removeItem(name);
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

export {
  rule , getNowFormatDate , replaceNext , getStore , USERINFO , setStore , readBlobAsDataURL , IMGFORMDATA , dataURLtoBlob,
  removeStore , isNVL , valiDateIDCard , CARDPAGE , shuffle , MAINCARD , CODELIST , AGENTTIME , AGENTINFO
}
