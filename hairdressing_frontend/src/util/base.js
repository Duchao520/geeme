/**
 * 公共js操作文件
 */
import { MessageBox } from 'element-ui'
export default {
    //获取上个月的月份及时间
    getMonth() {
        let z = new Date().getMonth()
        z = ((z == 0) ? (12) : (z))
        return z
    },
    getCountDays() {
        let curDate = new Date()
        let z = new Date().getMonth()
        z = ((z == 0) ? (12) : (z))
        curDate.setMonth(z)
        curDate.setDate(0)
            /* 返回当月的天数 */
        return curDate.getDate();
    },
    // 时间戳转时间
    dateParse(timestamp) {
        if (timestamp) {
            let date = new Date(timestamp)
            let Y = date.getFullYear()
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        } else {
            return ''
        }
    },
    // 从url中获取参数
    getRequest() {
        let url = window.location.href
        let theRequest = {}
        if (url.indexOf('?') !== -1) {
            let str = url.split('?')[1]
            let strs = str.split('&')
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
            }
        }
        return theRequest
    },
    // 获取sessionStorage
    getSession(key) {
        return JSON.parse(window.sessionStorage.getItem(key))
    },
    // 设置sessionStorage
    setSession(key, data) {
        return window.sessionStorage.setItem(key, JSON.stringify(data))
    },
    removeSession(key) {
        return JSON.parse(window.sessionStorage.removeItem(key))
    },
    // 防抖
    debounce(fn, interval = 400) {
        let timer
        return function() {
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.call(this, arguments)
            }, interval)
        }
    },
    // 节流
    throttle(fn, interval) {
        let previous = 0
        let timer
        return function() {
            let now = Date.now()
            if (now - previous > interval) {
                previous = now
                clearTimeout(timer)
                timer = setTimeout(() => {
                    fn.call(this, arguments)
                }, interval + 100)
                fn.call(this, arguments)
            }
        }
    },
    sectionToChinese(section){
        var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
        var chnUnitChar = ["","十","百","千","万","亿","万亿","亿亿"];
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                 if(!zero){
                      zero = true;
                      chnStr = chnNumChar[v] + chnStr;
                 }
            }else{
                  zero = false;
                  strIns = chnNumChar[v];
                  strIns += chnUnitChar[unitPos];
                  chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
         }
         return chnStr;
   }
}