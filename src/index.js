/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 项目入口
 */
import Vue from 'vue'

/** 使用vant组件 */
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

/** 加载样式 */
import './style/index.less'

/** 使用自定义得组件 -- 说明M有Component时一个插件 */
import MyComponent from './component'
Vue.use(MyComponent)

/** 引入项目的应用入口 */
import App from './pages'

/** 引入路由实例，然后全局注入 */
import router from './router'

/** 引入数仓，然后全局注入 */
import store from './store'

new Vue({
    router,
    store,
    render: c => c(App)
}).$mount('#root')