import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken()//设置token初始状态   token持久化 => 放到缓存中
}
// 修改状态
const mutations = {
  // 设置token  将token再state中进行更新的同时，在cookie里面也存储一份 保证了数据的 持久化 和响应式
  setToken(state, token) {
    // 修改state 中的 token
    state.token = token
    // 同步给 缓存
    setToken(setToken)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  }
}
// 执行异步
const actions = {
  // day 03 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 返回值 后面才能拿到 处理逻辑
    return result
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}