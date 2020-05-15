/**
 * 手机号验证
 * @param phone
 * @returns {boolean}
 */
export const phoneReg = (phone) => {
  console.log(phone)
  if(!(/^1[3456789]\d{9}$/.test(phone))){
    return false;
  }else{
    return true;
  }
}
