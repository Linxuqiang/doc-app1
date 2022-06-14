/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 定义登录相关接口
 */
import ajaxFunc from "./ajax"

export function getVdtCodeApi(phone) {
    return ajaxFunc({
        url: '/user/validate/code',
        data: {phone}
    })
}

/**
 * 登录接口
 * @param {{phone: string, vdtCode: string}} data 
 * @returns 
 */
export function loginApi(data) {
    return ajaxFunc({
        url: '/user/app/login',
        data
    })
}

export function menuListApi() {
    return ajaxFunc({
        url: '/menu/list',
        method: 'GET'
    })
}

export function rgihtsListApi(ids) {
    return ajaxFunc({
        url: '/role/list/byids',
        method: 'GET',
        params: { ids }
    })
}

export function autoLoginApi() {
    return ajaxFunc({ url: '/user/auto/login' })
}