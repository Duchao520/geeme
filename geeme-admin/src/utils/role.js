import vm from '@/main'
const authTree = require('@/temp/authTree.json')

export default class Role {
  constructor(role = authTree.children) {
    this.deepOneRoutes = []
    this.deepTwoRoutes = []
    this.deepThreeRoutes = []
    this.permission = []
    this.searchRoleTree(role)
    this.storeRoutesAndPermission()
    this.storeMenuData()
  }

  searchRoleTree(tree, index = 0) {
    let deep = ++index
    for (let i of tree) {
      if (deep === 1 && i.permission) {
        this.deepOneRoutes.push(i.name)
      }
      if (deep === 2 && i.permission) {
        this.deepTwoRoutes.push(i.name)
      }
      if (deep === 3 && i.permission) {
        this.deepThreeRoutes.push(i.name)
      }
      if (i.entry && i.entry.length > 0) {
        i.entry = i.entry.filter(i => i.permission)
        this.permission.push(...i.entry)
      }
      if (i.children && i.children.length > 0) {
        this.searchRoleTree(i.children, deep)
      }
    }
    
  }

  storeRoutesAndPermission() {
    const routesList = []
    routesList.push(...this.deepOneRoutes, ...this.deepTwoRoutes, ...this.deepThreeRoutes)
    vm.$store.commit('SET_ROLE', {
      routes: routesList,
      permission: this.permission,
    })
  }

  storeMenuData() {
    vm.$store.commit('MERGE_DEEP_ONE', {
      deepOneRoutes: this.deepOneRoutes,
      deepTwoRoutes: this.deepTwoRoutes,
      deepThreeRoutes: this.deepThreeRoutes,
    })
  }
}




