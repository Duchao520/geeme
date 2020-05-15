const store = {
  version: {
    setStore:(data) => my.setStorageSync({key:'version',data}),
    getStore:() => my.getStorageSync({key: 'version'}),
    removeStore:() => my.removeStorageSync({key: 'version'})
  },
  appId: {
    setStore:(data) => my.setStorageSync({key:'appId',data}),
    getStore:() => my.getStorageSync({key: 'appId'}),
    removeStore:() => my.removeStorageSync({key: 'appId'})
  },
  storeId:{
    setStore:(data) => my.setStorageSync({key:'storeId',data}),
    getStore:() => my.getStorageSync({key: 'storeId'}),
    removeStore:() => my.removeStorageSync({key: 'storeId'})
  },
  cashierNum:{
    setStore:(data) => my.setStorageSync({key:'cashierNum',data}),
    getStore:() => my.getStorageSync({key: 'cashierNum'}),
    removeStore:() => my.removeStorageSync({key: 'cashierNum'})
  },
  token: {
    setStore:(data) => my.setStorageSync({key:'token',data}),
    getStore:() => my.getStorageSync({key: 'token'}),
    removeStore:() => my.removeStorageSync({key: 'token'})
  },
  totalAmount: {
    setStore:(data) => my.setStorageSync({key:'totalAmount',data}),
    getStore:() => my.getStorageSync({key: 'totalAmount'}),
    removeStore:() => my.removeStorageSync({key: 'totalAmount'})
  },
  USERINFO: {
    setStore:(data) => my.setStorageSync({key:'USERINFO',data}),
    getStore:() => my.getStorageSync({key: 'USERINFO'}),
    removeStore:() => my.removeStorageSync({key: 'USERINFO'})
  },
  MAINCARD: {
    setStore:(data) => my.setStorageSync({key:'MAINCARD',data}),
    getStore:() => my.getStorageSync({key: 'MAINCARD'}),
    removeStore:() => my.removeStorageSync({key: 'MAINCARD'})
  }
}

module.exports=store