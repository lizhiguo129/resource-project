import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,// 设置axios 请求的基础的 基础地址
    timeout: 5000 // 定义秒超时
})
// 请求拦拦截器
service.interceptors.request.use(
)
// 响应拦截器（也只使用于 所有的接口都是这种格式，因为相应拦截器，所有返回的接口相应都会经过）   
// 第一个回调为成功的回调  还有一个失败的回调
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        // 业务已经错误了 还能进 then ? 不能 ！ 应该进catch
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
        // return Promise.reject(message)
    }
}, error => {
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service
