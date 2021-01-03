import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/fonts/iconfont.css'
import "./assets/css/global.css"
import TreeTable from 'vue-table-with-tree-grid'
// 在页面中使用了就要在这里导入
import {
    Container,
    Header,
    Aside,
    Main,
    Button,
    Form,
    FormItem,
    Input,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    Message,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader
} from "element-ui"
// import { config } from 'vue/types/umd'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)

// 表示把Message这个组件挂载到了vue的原型对象上
//这样就可以通过this.来访问到这个组件了
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
        // console.log(config)
        config.headers.Authorization = window.sessionStorage.getItem("token")
            //固定写法 在最后必须return config
        return config
    })
    // 全局通过axios请求数据
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')