import authRoutes  from '@/router/authRoutes'

// TODO 这块地放的逻辑还得改，总体上应在编译期加工 authRoutes，得到列表相关的所有原始数据。 运行期再根据权限树做剔除
const oriDeepOneMap = new Array()
const oriDeepTwoMap = new Map()
const oriDeepThreeMap = new Map()
const searchAuthRoutes = (tree, index = 0) => {
  let deep = ++index
  for (let i of tree) {
    i.meta.name = i.name
    if (deep === 1) {
      oriDeepOneMap.push(i.meta)
      oriDeepTwoMap.set(i.name, (i.children || []).map(i => i = i.meta))
    }

    if (deep === 2) {
      if (i.children && i.children.length > 0) {
        oriDeepThreeMap.set(i.name, i.children.map(i => i = i.meta))
      }
    }
    if (i.children && i.children.length > 0) {
      searchAuthRoutes(i.children, deep)
    }
  }
}
searchAuthRoutes(authRoutes)

const state = {
  oriDeepOneMap: oriDeepOneMap,
  oriDeepTwoMap: oriDeepTwoMap,
  oriDeepThreeMap: oriDeepThreeMap,
}

const mutations = {
  MERGE_DEEP_ONE: (state, payload) => {
    state.oriDeepOneMap = state.oriDeepOneMap.filter(i => payload.deepOneRoutes.indexOf(i.name) >= 0)
    //
    const deepTwoMap = state.oriDeepTwoMap
    deepTwoMap.forEach((value, key) => {
      value = value.filter(i => payload.deepTwoRoutes.indexOf(i.name) >= 0)
      deepTwoMap.set(key, value)
    })
    state.oriDeepTwoMap = deepTwoMap
    // 
    const deepThreeMap = state.oriDeepThreeMap
    deepThreeMap.forEach((value, key) => {
      value = value.filter(i => payload.deepThreeRoutes.indexOf(i.name) >= 0)
      deepThreeMap.set(key, value)
    })
    state.oriDeepThreeMap = deepThreeMap
  }
}

const getters = {
  siderNavList: state => {
    return state.oriDeepOneMap
  },
  headerNavMap: state => {
    return state.oriDeepTwoMap
  },
  deepThreeMap: state => {
    return state.oriDeepThreeMap
  }
}

export default {
  state,
  mutations,
  getters,
}