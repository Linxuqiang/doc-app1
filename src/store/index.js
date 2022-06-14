/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 状态数据定义和管理
 */
import Vue from 'vue'
import Vuex from 'vuex'

/** 引入持久化插件 */
import createPersistedState from "vuex-persistedstate"

/** 注册插件 */
Vue.use(Vuex)

/** 模块引入 */
import common from './common'

/** 实例化数仓并导出 -- 单例设计模式 */
export default new Vuex.Store({
    /** 进行插件注册 */
    plugins: [
        createPersistedState({ storage: window.sessionStorage })
    ],
    /**
     * 项目中有很多业务模块 -- 业务数据共享需要模块化
     * 使用modules来定义模块
     */
    modules: {
        // 定义模块名字 -- 通用模块，定义通用状态数据
        common
    }
})