import md5 from 'js-md5'
var config = require("../config"),
    key = config.key;

/**
 * 签名算法
 */
const asciiSort=(JSONStr) => {
  let json,arr = [], _json = {}, str = "",  reg = /\,/;
  if(typeof JSONStr == 'string'){
    json = parseQueryString(JSONStr);
  }else{
    json = JSONStr;
  }
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
  _json = str + "key=" + key;
  return _json;
}

export const parseQueryString = (str) => {
    var arr = [],length = 0,res = {};
    arr = str.split('&');
    length = arr.length;
    for(var i=0; i<length; i++){
        res[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
    return res;
}

export const json2Form = (json) => {
  var str = [];
  for(var p in json){
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  str.sort();
  return str.join("&");
}


/**
 * @param jsonObj 一套签名规则
 */
export const getSignIn = (jsonObj,method)=>{
  return md5(asciiSort(jsonObj,method))
}

export const MD5 = (str)=>{
  return md5(str);
}

/**
 * 输入字符加密为123****115的形式
 * @param String str 加密字符串
 * @param Nuber start 开始位置
 * @param Number end 结束位置
 */
export const encodeStr = (str,start=2,end=6) => {
  var strArr;
  strArr = str.split('');
    strArr.forEach((ele,index) => {
      if(index > start && index <= end){
        strArr[index] = '*'
      }
    })
    return strArr.join('');
}

//获取参数
export function getQuery() {
  const pages = getCurrentPages();

  const currentPage = pages[pages.length - 1]
  console.log(currentPage)
  const options = currentPage.options
  return options
}


//除法
export function accDiv(arg1,arg2){
  arg1 = Number(arg1);
  arg2 = Number(arg2);
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
  arg1 = Number(arg1) ; arg2 = Number(arg2)
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
//加法
export function accAdd(arg1,arg2){
  arg1 = Number(arg1) ; arg2 = Number(arg2)
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2))
  return (arg1*m+arg2*m)/m
}
//减法
export function Subtr(arg1,arg2) {
  arg1 = Number(arg1) ; arg2 = Number(arg2)
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