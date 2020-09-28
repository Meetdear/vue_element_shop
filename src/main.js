import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {Button} from "element-ui"
import {Form,FormItem} from "element-ui"
import {Input} from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)



// 导入全局样式表
import './assets/fonts/iconfont.css'
import "./assets/css/global.css"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
