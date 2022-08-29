import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600 // 定义时间戳
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios 请求的基础的 基础地址
  timeout: 5000 // 定义秒超时
})
// 请求拦截器
service.interceptors.request.use(config => {
  // console.log(config, '132');
  // 判断是不是有 token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (ischacktime()) {
      store.dispatch('user/logout')// 删除token 和 用户信息
      router.push('/login')// 跳转到登录页
      return Promise.reject(new Error('token超时了'))
    }
    // 有的话 就把token 给传到 请求头里面
    // Authorization 是认证的意思/*
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 必须把 config return 出去 不能忘记
  return config
}, error => {
  console.dir(error, '看返回的有没有code===10002')
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出 action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error)
})

// 响应拦截器（也只使用于 所有的接口都是这种格式，因为相应拦截器，所有返回的接口相应都会经过）
// 第一个回调为成功的回调  还有一个失败的回调
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进 then ? 不能 ！ 应该进 catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
    // return Promise.reject(message)
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function ischacktime() {
  const currentTime = +new Date()// 获取当前时间戳
  const timeStamp = getTimeStamp() // 获取旧的时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service // 导出axios实例
