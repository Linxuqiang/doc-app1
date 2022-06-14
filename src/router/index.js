/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 路由定义
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// 注册插件
Vue.use(Router)

/**
 * 引入页面组件
 * 通过routes属性进行路由和页面组件关联
 */
import Login from '../pages/login'
import Home from '../pages/home'
import PurchaseList from '../pages/purchase/list'
import NotFound from '../pages/common/NotFound'

// 实例化router对象
const router = new Router({
    // 指定路由模式
    mode: 'history',

    // 配置路由
    routes: [
        // 应该有默认重定向
        {path: '/', redirect: '/login'},
        // 是后台应用，那么登录页面是不需要用户鉴权
        {path: '/login', component: Login, meta: {nologin: true}},
        {path: '/home', component: Home},
        {path: '/purchase/list', component: PurchaseList},
        // 通用页面 -- 404 因为路由匹配时使用正则式
        {path: '*', component: NotFound}
    ]
})

// 全局用户登录认证权限拦截
router.beforeEach(function(to, from, next) {
    /** 判断要跳转的路由是否需要权限 */
    // if (to.meta.nologin) {
        next()
        return
    // }
    let token = store.getters['common/token']
    /** 判断token是否有效 */
    if (!!token) {
        next()
        return
    }

    /** 否则需要去登录页面 */
    next('/login')
})

export default router