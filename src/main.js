import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局的样式
import * as directives from '@/directives'

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang'
import '@/icons' // icon
import '@/permission' // 权限控制 （路由守卫）
import * as filters from '@/filters'// 引入全部的过滤器
import components from './components'// 引入全局组件
// 遍历对象 拿到所有的过滤器名称 再次遍历 使用过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
Vue.use(components)// 全局组件
// 全局的组件注册使用就是相当于
// Vue.use({
//   install(Vue) {
//     Vue.component('PageTools', PageTools)
//   }
// })

// 这里注意：基础的全局注册是没有use 直接就是 component
// import PageTools from './PageTools'
// Vue.component('PageTools', PageTools)

// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(item => {
  // 注册自定义指令
  Vue.directive(item, directives[item])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
