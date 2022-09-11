// 指令的封装对象
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // console.log(options)
    // 第一个形参dom 指的是dom 表示当前指令作用的dom对象  dom认为此时就是图片
    // 第二个形参 options是 指令中的变量的解释  其中有一个属性叫做 value
    // 当图片有地址但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    //  监听img标签的错误事件  因为图片加载失败 会触发  onerror事件
    dom.src = dom.src || options.value
    dom.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
