const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // day03 配置 token 的快捷访问
  name: state => state.user.userInfo.username, // day04 建立用户名称的快捷访问
  userId: state => state.user.userInfo.userId, // day04 建立用户id的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto // day04 建立用户头像的快捷访问
}
export default getters
