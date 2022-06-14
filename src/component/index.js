/**
 * 定义一个自己得插件
 * Vue中开发自己得插件有两种方式：函数插件、对象插件
 */
import PageLayout from './PageLayout'

// 函数插件 -- 就是一个函数
// 这个函数有一个特性，它会入参一个VueConstructor
// function MyPlugin(VueConstructor) {
//     // 可以注册我们得全局组件
//     VueConstructor.component('PageLayout', PageLayout)
// }

const MyPlugin = {
    // 任何对象插件必须有一个install属性
    // 这个属性得值为一个函数，这个函数会入参一个VueConstructor
    install: function(VueConstructor) {
        // 可以注册我们得全局组件
        VueConstructor.component('PageLayout', PageLayout)
    }
}

export default MyPlugin