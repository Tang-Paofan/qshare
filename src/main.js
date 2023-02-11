import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SIdentify from './components/Identify.vue';    //自定义组件
import request from './utils/request';  // axios拦截器
import VeCharts from 've-charts'
import '../src/assets/css/global.css'

Vue.use(VeCharts)

Vue.use(ElementUI);

Vue.component("SIdentify",SIdentify);

Vue.prototype.request = request

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
