import { Page } from '/util/ix';
var app = getApp();
Page({
  data: {},
  onLoad() {
    my.setNavigationBar({
      backgroundColor: '#ffffff'
    })
  },
  onKeyPress(r){
    switch (r.keyCode) {
        case 133:
          my.reLaunch({url: '/pages/index/index',});
          break
      }
  },
  logout(){
    var _self = this;
    var _data = {
      token: app.store.token.getStore().data
    }
    app.API.logout(_data).then(res => {
      if(res.state == 1){
        my.reLaunch({
          url: '/pages/login/login'
        });
      }
    })
  },
  goOrder(){
    my.navigateTo({url: '/pages/order/order'});
  }
});
