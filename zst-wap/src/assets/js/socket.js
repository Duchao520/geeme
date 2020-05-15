var WBT = function (url,callBackObj) {

  //接口地址url
  this.url = url;
  //socket对象
  this.socket;
  //心跳状态  为false时不能执行操作 等待重连
  this.isHeartflag = false;
  //重连状态  避免不间断的重连操作
  this.isReconnect = false;
  //自定义Ws连接函数：服务器连接成功
  this.onopen = ((e) => {
    this.isHeartflag = true;
  })
  this.onmessage = ((e) => {
    var data = JSON.parse(e.data);
    if(callBackObj[data.Type]){
      callBackObj[data.Type](data);
    }
  })
  //自定义Ws异常事件：Ws报错后触发
  this.onerror = ((e) => {
    console.log('error')
    this.isHeartflag = false;
    this.reConnect();
  })
  //自定义Ws关闭事件：Ws连接关闭后触发
  this.onclose = ((e) => {
    this.reConnect()
    console.log('close')
  })
  //初始化websocket连接
}

//初始化websocket连接
WBT.prototype.initWs = function () {
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  if (!window.WebSocket) { // 检测浏览器支持
    console.error('错误: 浏览器不支持websocket');
    return;
  }
  var that = this;
  this.socket = new WebSocket(this.url); // 创建连接并注册响应函数
  return new Promise((resolve,reject) => {

    this.socket.onopen = function (e) {
      that.onopen(e);
      resolve(1)
    };
    this.socket.onclose = function (e) {
      that.onclose(e);
      that.socket = null; // 清理
    };
    this.socket.onmessage = function (e) {
      that.onmessage(e);
    };
    this.socket.onerror = function (e) {
      that.onerror(e);
    }
  });
}

WBT.prototype.reConnect = function () {
  if (this.isReconnect) return;
  this.isReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    this.initWs()
    this.isReconnect = false;
  }, 2000);
}

WBT.prototype.send = function (params) {
  //ws还没建立连接（发生错误）
  try {
    this.socket.send(JSON.stringify(params))
    /*return new Promise((resolve,reject) => {
        this.socket.onmessage = function (e) {
            resolve(e);
        };
    })*/
  }catch (e) {
    console.log(e);
  }

  //组装json数据
}



export {
  WBT
}

