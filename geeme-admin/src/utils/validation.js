const RegMap = {
  // 账号密码 6~16长度至少一个数字和字母组合,区分大小写字母
  password: /^(?=[A-z]*[0-9])(?=[0-9]*[A-z])[A-z0-9]{6,16}$/,
  phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
  className: /^[\S]{1,10}$/,
  brandName: /^[\S]{1,16}$/,
  brandLogo: /^[[0-9a-zA-Z]+&[[0-9a-zA-Z]+$/
}
const validationTest = {}
Object.keys(RegMap).forEach((i) => {
  validationTest[i] = (val) => {
    return RegMap[i].test(val)
  }
})

/**
 * @description 通用表单验证方法，一个值对应单一正则规则
 * @param {*} value  需要做校验的值
 * @param {String} mode 校验规则 or 模式，RegMap 中须有对应的正则
 * @param {Boolean} required  是否为必填项
 */
const validate = (value, mode, required = false) => {
  // 无规则且非必填
  if (!mode && !required) {
    return true
  }
  // 无规则且必填
  if (!mode && required) {
    // String
    if (typeof(value)=='string' && value.length === 0) {
      return false
    }
    // Array
    if (value instanceof Array && value.length === 0) {
      return false
    }
    // Number || Object
    if (value == null) {
      return false
    }
    return true
  }
  // 有规则但未找到对应的
  if (mode && RegMap[mode] === undefined) {
    return new Error('找不到对应规则，请添加！')
  }
  // 有规则且非必填
  if (mode && !required) {
    if (value.length === 0 || RegMap[mode].test(value)) {
      return true
    }
    return false
  }
  // 有规则且必填
  if (mode && required) {
    /* console.log(RegMap[mode].test(value)) */
    if (value.length > 0 && RegMap[mode].test(value)) {
      return true
    }
    return false
  }
}

/**
 * @description 为 ant-design-vue 表单组件做特化的验证函数
 */
const validateItem = (obj) => {
  const { value, mode, required } = obj
  const res = validate(value, mode, required)
  if (!res) {
    obj['status'] = 'error'
    obj['help'] = obj['tip']
  } else {
    obj['status'] = null
    obj['help'] = ''
  }
  /* console.log(res) */
  return res
}

/**
 * @description 为 ant-desigin-vue 表单组件特化的整体验证函数
 */
const validateAll = (obj) => {
  const queue = []
  for (let i in obj) {
    if (obj.hasOwnProperty(i) === true) {
      let res = validateItem(obj[i])
      queue.push(res)
    }
  }
  if (queue.indexOf(false) > -1) {
    return false
  }
  return true
}

export { validate, validateItem, validationTest, validateAll } 