<template>
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      //   改变全屏
      if (!ScreenFull.isEnabled) {
        // 此时全屏不可用
        this.$message.warning('此时全屏组件不可用')
        return
      }
      // document.documentElement.requestFullscreen()  原生js调用
      //   如果可用 就可以全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style>

</style>
