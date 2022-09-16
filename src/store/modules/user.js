import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
// 修改状态
const mutations = {
  // day 03设置token  将token再state中进行更新的同时，在cookie里面也存储一份 保证了数据的 持久化 和响应式
  setToken(state, token) {
    // 修改state 中的 token
    state.token = token
    // 同步给 缓存
    setToken(token)
  },
  // day 03删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // day 04设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo // 常规写法
    // state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // day 04删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // day 03 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    setTimeStamp()// 登录成功之后 存入时间戳
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 返回值 后面才能拿到 处理逻辑
    return result
  },
  // day04 获取用户资料的 方法 等待被触发
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const baseResult = await getUserDetailById(result.userId)// 拿到返回的用户详情信息 给合并到 state中的userInfo中
    context.commit('setUserInfo', { ...result, ...baseResult }) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要返回 为后面埋下伏笔
  },
  // 退出登录的方法
  logout(context) {
    context.commit('removeToken')// 删除token 同时从缓存当中删除
    context.commit('reomveUserInfo')// 清空用户信息为一个空对象
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
