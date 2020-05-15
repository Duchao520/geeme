import config from 'config/config'
import * as api from '@/assets/js/interface'
import store from '../../store'
// 此文件是公用的websocket函数
var websocket = null
var globalWsCallback = null

// 检测是浏览器是否支持websocket
function checkHasSocket() {
  if (!!window.WebSocket && window.WebSocket.prototype.send) {
    return true
  } else {
    alert('当前浏览器不支持websocket')
    return false
  }
}
// 初始化websocket
function initWebsocket(url) {
  if(checkHasSocket()) {
    websocket = new WebSocket(url)
    // websocket连接上会触发
    websocket.open = () => {
      console.log('ok')
      alert('websocket 连接成功')
    }
    // websocket断开会触发
    websocket.onclose = function () {
      websocket.close()
    }
    // 客服端收到消息要进行处理
    websocket.onmessage = function (msg) {
      store.commit('SAVE_WEBSOCKET', msg.data)
    }
  }
}
// 处理websocket传递过来的数据，然后存入store中
// 初始化websocket
initWebsocket(api.socketServer.URL)
