// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store.js'
import fn_common from './common/fn_common'

// import "bootstrap/dist/css/bootstrap.min.css" // [bootstrap]
// import "bootstrap" // [bootstrap]

Vue.config.productionTip = false

Vue.use(fn_common)  // 공통 함수

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store//: store
})
