/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 封装异步请求方法，实现通用数据配置，请求响应拦截，通用参数封装
 */
import axios from 'axios'
import store from '../store'

// 创建一个axios实例
const ajax = axios.create({
    baseURL: 'http://www.shuiyue.info:20000'
})

/**
 * 拦截器 -- 请求拦截--request，响应拦截--response
 * 拦截器需要使用一个钩子函数来实现拦截业务
 */
ajax.interceptors.request.use(config => {
    
    // 当前请求地址，不再用户拦截权限范围以内，直接发送请求
    const urls = [
        "/user/validate/code",
        "/user/app/login"
    ]
    if (urls.includes(config.url)) {
        return config
    }

    /** 如果需要判断用户权限，那么要获取token */
    let token = store.getters['common/token']
    if (!token) return Promise.reject({code: 900, message: '用户没有访问此接口的权限'})

    /** 有token，就应该把token添加到请求头上 */
    config.headers.token = token
    return config
})
ajax.interceptors.response.use(function(responseObject) {
    return responseObject

    let { data } = responseObject
    if (data.code === 403) {
        // 提示用户登录已经时效--token没有
        alert('用户的token已经失效，请重新登录')
        return Promise.reject({code: 999, message: '用户需要重新登录'})
    } else {
        return responseObject
    }
})

/**
 * 封装的ajax请求
 * @param {{url: string, data: any, params: {} | undefined, method: "POST" | "GET" | "PUT" | "DELETE"}} req 请求对象
 * @returns Promise
 */
export default function ajaxFunc(req) {
    return new Promise(resolve => {
        ajax.request({
            url: req.url,
            method: req.method || 'post',
            data: req.data || {},
            params: req.params || {},
        }).then(({ data }) => {
            resolve(data)
        }).catch(e => {
            resolve(e)
        })
    })
}