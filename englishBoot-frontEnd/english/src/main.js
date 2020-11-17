import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios';
import {Message} from "element-ui";
Vue.prototype.$message = Message;

import  'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;
let baseUrl= "";   //这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
  case 'development'://开发环境url
    baseUrl = "http://localhost:3000";
    break;
  case 'production':
    baseUrl = "http://10.12.0.180:3000";  //生产环境url
    break
}
axios.defaults.baseURL= baseUrl;
Vue.prototype.$axios = axios;
Vue.prototype.$message = Message;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
