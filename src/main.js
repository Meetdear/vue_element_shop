import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/fonts/iconfont.css'
import "./assets/css/global.css"
// 在页面中使用了就要在这里导入
import { Container, Header, Aside, Main, Button, Form, FormItem, Input, Message } from "element-ui"

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
    // 表示把Message这个组件挂载到了vue的原型对象上
    //这样就可以通过this.来访问到这个组件了
Vue.prototype.$message = Message

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')