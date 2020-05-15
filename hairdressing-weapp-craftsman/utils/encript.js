const sha256 = require('./sha256.js')
const encriptPassword = function(password){
  const str = `&${password}_gm`
  return sha256(str)
}
module.exports = {
  encriptPassword,
}