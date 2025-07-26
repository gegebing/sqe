import Vue from 'vue'
/**
 * 自定义指令
 */
let MyPlugin = {}
export default MyPlugin.install= function(vue, options) {
  var timer = ''
  Vue.directive('loadmore', {
    bind (el, binding) {
      // 获取element-ui定义好的scroll盒子
      const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      SELECTWRAP_DOM.addEventListener('scroll', function () {
        const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (CONDITION) {
          binding.value()
          // if (timer) {
          //   clearTimeout(timer)
          // }
          // timer = setTimeout(() => {
          //   binding.value()
          // }, 100)
        }
      })
    }
  })
}
