import Cookies from 'js-cookie'// day3：js-cookie 缓存的插件 

const TokenKey = 'hrsaas-ihrm-token' // day3设定一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
