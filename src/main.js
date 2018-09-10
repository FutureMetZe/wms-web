import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store/store';
import axios from './axios';
import VueAxios from 'vue-axios';
import './assets/icon/iconfont.css';

Vue.use(VueAxios,axios);
Vue.use(ElementUI)

new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App)
})
