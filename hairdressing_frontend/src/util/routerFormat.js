import store from '../store'
// 用于生成1级导航
export function entryNavBar(routerData) {
  let r = []
  routerData.forEach(item => {
    item.show && r.push(item)
  })
  return r
}

// 路由数组扁平化
export function routersArrFlat (routersArr, resultArr, listName, pathName) {
  routersArr.forEach(item => {
      resultArr.push(item[pathName])
      if (item[listName] && item[listName].length) {
          routersArrFlat(item[listName], resultArr, listName, pathName)
      }
  })
}

// 生成二级导航
export function create2edNavBar (asideNavBar) {
  let r = {}
  asideNavBar.forEach(item => {
    if (item.routes && item.routes.length) {
      let tabsNav = []
      item.routes.forEach(tabs => {
        tabs.show && tabsNav.push(tabs)
      })
      if (tabsNav.length) {
        let key = item.path.split('/')[2]
        r[key] = tabsNav
      }
    }
  })
  return r
}

// 生成ROUTE_SUB_TABS （员工档案和客户档案子页面导航）
export function createRouteSubTabs (currentAuth) {
  let r = {}
  currentAuth.forEach(item => {
    if (!item.show && item.routes && item.routes.length) {
      let key = item.path.split('/')[2]
      r[key] = item.routes
    }
  })
  return r
}

// 生成设置中心的3级导航
export function create3rdNavBar (secondNavBar) {
  let r = {}
  for (let key in secondNavBar) {
    secondNavBar[key].forEach(item => {
      if (item.routes && item.routes.length) {
        r[item.title] = item.routes
      }
    })
  }
  return r
}

// 按钮级权限 隐藏按钮判断是否 // 该函数已经移到./mixin.js
export function checkHasBtnPermission (pathOrFlag, type='flag') {
  console.log('')
  console.log('pathOrFlag: ', pathOrFlag)
  let refer = []
  if (type === 'flag') {
    refer = store.state.authRouter.btnAuths
  } else if (type === 'path') {
    refer = store.state.authRouter.flatAuths
  } else {
    console.error('警告! 错误的参数!!!')
  }
  return refer.includes(pathOrFlag)
}

// 跳转控制
export function getLastLevelPathInFirstChild(routers) {
  if (routers && routers.length) {
    if (routers[0].routes) {
      return getLastLevelPathInFirstChild(routers[0].routes)
    } else {
      return routers[0].path
    }
  } else {
    return '/center/brands'
  }
}