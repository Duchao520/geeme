/**
 * 获取地址栏参数
 */
function getQueryString (){
  var name, value, i;
  var str = window.location.href;
  var num = str.indexOf("?");
  str = str.substr(num + 1);
  str = str.substr(0,str.indexOf("#"));
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
