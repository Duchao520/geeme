import { validationTest } from '@/utils/validation'

const utils = {
  /**
   * @param {String} key
   * @description
   * 获取URL上指定 key 对应的 search param，无论是否加在锚点后
   * 限定 search 跟在URL末尾并以 ? 开头, 相同 key不重复
   * 结尾或分隔也要考虑 & 的情况
   */
  getURLParam(key) {
    let res, obj = {}, str = window.location.href;
    if (arguments.length > 0) {
      res = str.match(`[?][^?]*${key}=([^&#]+)`)
      return res == null ? undefined : res[1]
    }
    res = str.match(/[^?&]+=[^&]+/g) || []
    res.forEach(i => { let arr = i.split('='); obj[arr[0]] = arr[1] })
    return obj
  },

  /**
   * @param {Object} obj
   * @param {Object} config
   * @description 自动执行表单的校验处理，映射成一张 error map
   */
  errMapping(obj, config) {
    let errQueue = []
    Object.keys(obj).forEach((i) => {
      if (!config[i]) { return }
      let target = config[i].target || i
      let msg = config[i].msg
      let f = validationTest[target]
      if (!f(obj[i])) {
        errQueue.push({ target: i, msg: msg })
      }
    })
    return errQueue.length === 0 ? null : errQueue
  },

  /**
   * @description 图片Src格式化
   */
  imgFormatter(key) {
    return `${process.env.VUE_APP_IMGURL}${key}`
  },

  /**
   * @description 获取 class
   */
  getClass(el) {
    return el.getAttribute('class')
  },

  /**
   * @description 设置 class
   */
  setClass(el, cls) {
    return el.setAttribute('class', cls)
  },

  /**
   * @description 判断 class 是否存在
   */
  hasClass(el, cName) {
    return !!el.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'))
  },

  /**
   * @description 添加 class
   */
  addClass(el, cName) {
    if (!this.hasClass(el, cName)) {
      el.className += ' ' + cName
    }
  },

  /**
   * @description 删除 class
   */
  removeClass(el, cName) {
    if (this.hasClass(el, cName)) {
      el.className = el.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), '')
    }
  },

  /**
   * @description 切换 class
   */
  toggleClass(el, cName) {
    if (this.hasClass(el, cName)) {
      this.removeClass(el, cName)
    } else {
      this.addClass(el, cName)
    }
  },

  /**
   * @description 切换 日期格式转换
   */

  format(time, format){ 
    var t = new Date(time); 
    var tf = function(i){return (i < 10 ? '0' : '') + i}; 
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
      switch(a){ 
        case 'yyyy': 
        return tf(t.getFullYear()); 
        case 'MM': 
        return tf(t.getMonth() + 1); 
        case 'mm': 
        return tf(t.getMinutes()); 
        case 'dd': 
        return tf(t.getDate()); 
        case 'HH': 
        return tf(t.getHours()); 
        case 'ss': 
        return tf(t.getSeconds()); 
      }; 
    }); 
  }
}
export default utils
