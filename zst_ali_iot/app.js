var config = require('./config')

App({
  onLaunch(options) {
    my.clearStorage();
  
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  API: require('./util/apiUtil'),
  store: require('./util/store'),
  appId: config.appId,
  version: config.version
});
