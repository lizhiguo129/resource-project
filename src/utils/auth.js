import Cookies from 'js-cookie'// day3：js-cookie 缓存的插件

const TokenKey = 'hrsaas-ihrm-token' // day3设定一个独一无二的key
const timeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key
// 存
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 取
export function getToken() {
  return Cookies.get(TokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存入时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, +new Date())
}
// 拿出时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
