import { AES, enc } from 'crypto-js'
import { menuListApi, rgihtsListApi } from '../apis/loginApi'

const state = {
    token: '',
    userInfo: {},
    userMenu: [],
    userRights: []
}

export default {
    // 模块化默认是关闭的，所以需要开启模块化命名空间
    namespaced: true,
    // 定义common模块里边的state数据
    state,

    // 通过getters来定义getter方法给外部使用state数据
    getters: {
        // 定义的getter方法没有办法直接使用state数据，所以方法会入参一个state对象
        token(_state) {
            return AES.decrypt(_state.token, 'deming.su1234567890').toString(enc.Utf8)
        },
        uesrInfo: _state => _state.userInfo,
        userMenu: _state => _state.userMenu,
        userRights: _state => _state.userRights
    },

    // 定义actions
    actions: {
        // actions 不负责数据扭转，只负责数据处理，所以需要把处理后的数据提交到mutations中去
        // 所以函数需要有一个store实例对象
        getUserDataAct(_store, _ids) {
            Promise.all([
                menuListApi(),
                rgihtsListApi(_ids)
            ]).then(arr => {
                if (arr[0].code === 200) {
                    // 因为actions和mutations再同一个模块，不需要加域名(模块名)
                    _store.commit('mutationUserMenu', arr[0].data)
                }
                if (arr[1].code === 200) {
                    _store.commit('mutationUserRights', arr[1].data)
                }
            })
        }
    },

    // 定义mutation方法
    mutations: {
        mutationToken(_state, _token) {
            _state.token = AES.encrypt(_token, 'deming.su1234567890').toString()
        },
        mutationUserInfo(_state, _userInfo) {
            _state.userInfo = _userInfo
        },
        mutationUserMenu(_state, _userMenu) {
            _state.userMenu = _userMenu
        },
        mutationUserRights(_state, _userRights) {
            _state.userRights = _userRights
        }
    }
}