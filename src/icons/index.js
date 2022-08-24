import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 全局注册
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req) 
// 以上两行代码的含义就是将所有的 svg 目录下的所有的 .svg 后缀的文件全部引人到项目中
 