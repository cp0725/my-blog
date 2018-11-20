// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store.js'

import myAjax from './api/axiosApi.js'
Vue.prototype.myAjax = myAjax

import './assets/scss/clear.scss'
import './assets/scss/font_scss/font-awesome.scss'
// import './assets/font-awesome-4.7.0/css/font-awesome.min.css'

import 'mavon-editor/dist/css/index.css'

window.progressWidth = '20%'

window._dc = new Vue()

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

window.onscroll = event => {
  window._dc.$emit('listenScroll', event)
}

// 用路由守卫做登陆状态验证
// 首页（综合 音乐）访问量统计
// 首页home  文章Article  广场square  留言words  关于本站about
// 后台报错跳一个 404 页面   tag全局注册
// 滚动加载要做节流
// 提炼基础UI组件

/*
用 err 替换 log
路径用@引入
登陆注册的彩弹要用css实现

*/