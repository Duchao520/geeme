//文档：https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=4_3#

const getStringA = function(obj){
  const keys = Object.keys(obj).sort()
  let str = ''
  for (const key of keys) {
    // 参数的值为空不参与排名
    if(obj[key]) str += `${key}=${obj[key]}&`
  }
  return str.slice(0, -1)
}