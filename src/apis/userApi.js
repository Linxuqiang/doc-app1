/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 定义用户相关接口
 */
import ajaxFunc from "./ajax";

export function userInfoApi(id) {
    return ajaxFunc({
        url: '/user/info',
        method: 'GET',
        params: {id: id}
    })
}

export function paymentApi() {
    return ajaxFunc({
        url: '/analysis/payable',
        method: 'GET'
    })
}

export function collectionApi() {
    return ajaxFunc({
        url: '/analysis/collection',
        method: 'GET'
    })
}