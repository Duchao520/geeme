// 数组对象扁平化成数组或者对象 // 如果转成数组好像可以用 ./routerFormat.js:  routersArrFlat 方法
function formatArrayToObjOrFlatArray (rootArr, result, mapKey, mapList, resultType='Object') {
  rootArr.forEach(item => {
    if (resultType === 'Object') {
      result[item[mapKey]] = item
      if (item[mapList] && item[mapList].length) {
        formatArrayToObjOrFlatArray(item[mapList], result, mapKey, mapList, resultType='Object')
      }
    }
    if (resultType === 'Array') {
      result.push(item)
      if (item[mapList] && item[mapList].length) {
        formatArrayToObjOrFlatArray(item[mapList], result, mapKey, mapList, resultType='Array')
      }
    }
  })
}

// 单元测试
// var arr = [
//   {id: 1, name: 'a1', list: null}, 
//   {id: 2, name: 'a2', list: [{id: 21, name: 'a21'}]}, 
//   {id: 3, name: 'a3', list: [{id: 31, name: 'a31'}]}, 
//   {id: 4, name: 'a4', list: null}, 
// ]
// var a = []
// var b = {}
// formatArrayToObjOrFlatArray(arr, a, 'id', 'list', 'Array')
// formatArrayToObjOrFlatArray(arr, b, 'id', 'list')
// console.log(a)
// console.log(b)

export { formatArrayToObjOrFlatArray }