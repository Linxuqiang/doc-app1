<template>
    <div class="login-page">
        <div v-if="isWelcome" class="welcome-box">
            <!-- 组件上的click事件一定是一个自定义事件 -->
            <!-- click事件是否有修饰符，支持原生click事件 -->
            <van-circle v-model="welcomeCount"
                class="timer-cls"
                :clockwise="false"
                size="46px"
                layer-color="#ebedf0"
                color="#fa541c"
                @click.native.once="welcomeClickEvt"
                :text="`${Math.ceil(welcomeCount / 20)}s`"/>
            <i class="icon"></i>
            <span class="title">璇玑智能采购</span>
            <span class="sub-title">{{welcomeText}}</span>
            <span class="right">powered by 千锋科技 &copy; 2022-</span>
        </div>
        <div v-else class="welcome-box login">

            <span class="logo">璇玑智能采购系统</span>
            <div class="ipt-cls user">
                <input type="text" v-model.trim="loginObj.phone" placeholder="输入用户手机号">
            </div>
            <div class="ipt-cls lock">
                <input type="text" v-model.trim="loginObj.vdtCode" placeholder="输入用户手机号">
                <span @click="getVdtCode">{{vdtMsg}}</span>
                <!-- <span>重新获取(60s)</span> -->
            </div>
            <div class="ipt-cls no-border">
                <van-checkbox v-model="remember" checked-color="#ff5b02">是否记住手机号？</van-checkbox>
            </div>
            <div class="ipt-cls no-border">
                <van-checkbox v-model="auto" checked-color="#ff5b02">是否同意免登录？</van-checkbox>
            </div>

            <van-button color="#ff5b02" @click="loginEvt" :disabled="!canLogin" type="primary" block>登录</van-button>

            <span class="right">powered by 千锋科技 &copy; 2022-</span>
        </div>
    </div>
</template>

<script>
    import { autoLoginApi, getVdtCodeApi, loginApi, menuListApi, rgihtsListApi } from '../../apis/loginApi'
    import { userInfoApi } from '../../apis/userApi'

    export default {
        data() {
            return {
                isWelcome: true,
                remember: false,
                auto: false,
                welcomeCount: 100,
                vdtMsg: '获取验证码',
                loginObj: {
                    phone: '13278907890',
                    vdtCode: ''
                },
                welcomeText: ['渐寒 揣着喜庆的年',
                    '情迷 有巧克力芬芳',
                    '微暖 花出豆蔻意浅',
                    '鹅黄 林徽因的晴天',
                    '初夏 送了春的婉转',
                    '离殇 一曲青春飞扬',
                    '炎炎 宛若你的张狂',
                    '芬芳 桂花羹与蜜糖',
                    '旖旎 谁与谁的迷藏',
                    '枫红 灼了彷徨的眼',
                    '寒入 思念如雪飞扬',
                    '弥彰 假装遗忘的慌'][new Date().getMonth() + 1],
                welcomeTimer: null,
                flag: 'autoLoading'
            }
        },
        computed: {
            canLogin() {
                return /^1[3-9]{1}[0-9]{9}$/.test(this.loginObj.phone) && /^[0-9]{4}$/.test(this.loginObj.vdtCode)
            }
        },
        created() {

            // 需要判断用户是否同意免登录 -- 因为欢迎页面和登录在同一个页面，所以created生命周期就是欢迎页面
            let token = localStorage.getItem('my-token')
            if (!!token) {
                /**
                 * token就是系统以后要使用token票据，所以需要先缓存到vuex中，在发送免登录请求
                 */
                this.$store.commit('common/mutationToken', token)
                autoLoginApi().then(d => {
                    if (d.code === 200) {
                        // 这时还需要把用户信息缓存起来
                        this.$store.commit('common/mutationUserInfo', d.data)
                        // 调用action去获取用户菜单和权限信息，但是在欢迎页面不能够直接进入首页，
                        // 需要等用户点击，或则倒计时到才能够进入首页
                        this.$store.dispatch('common/getUserDataAct', d.data.role)

                        // 成功，需要重置标识为成功
                        this.flag = 'success'
                    } else {
                        // 请求失败了，那么token肯定是无效的
                        // 所以清除token缓存(vuex和localStorage)
                        localStorage.removeItem('my-token')
                        this.$store.commit('common/mutationToken', '')
                        // 失败，需要重置标识为失败
                        this.flag = 'error'
                    }
                })
            } else {
                // 如果token不存在，那么免登录就相当于失败了
                this.flag = 'error'
            }

            // 因为在欢迎页面，给手机输入框赋值了，用户也看不见，所以可以直接赋值
            let phone = localStorage.getItem('my-phone')
            if (!!phone) {
                this.loginObj.phone = phone
                this.remember = true
            }

            this.welcomeTimer = setInterval(() => {
                this.welcomeCount --;
                if (this.welcomeCount < 1) {
                    clearInterval(this.welcomeTimer)
                    // 如果免登录成功跳转到首页，否则展示登录页面
                    if (this.flag === 'success') {
                        this.$router.push('/home')
                    } else {
                        this.isWelcome = false
                    }
                }
            }, 5000 / 100)
        },
        methods: {
            /**
             * 用户点击欢迎页面倒计时的时候，必须要求免登录完成以后，根据免登录是否成功来判断
             * 免登录完成之前不能点击按钮，事件直接return
             * 登录是否成功：是->跳转到首页；否->去登录页面
             * 分析得到需要三个条件：flag = 'autoLoading'/'success'/'error'
             */
            welcomeClickEvt() {
                if (this.flag === 'autoLoading') return
                clearInterval(this.welcomeTimer)
                // 如果免登录成功跳转到首页，否则展示登录页面
                if (this.flag === 'success') {
                    this.$router.push('/home')
                } else {
                    this.isWelcome = false
                }
            },
            async loginEvt() {
                // 调用登录接口，获取用户编码和用户token，要判断登录接口是否成功
                let loginInfo = await loginApi(this.loginObj)
                if (loginInfo.code !== 200) {
                    this.$toast.fail('用户登录失败，请重试')
                    return
                }

                /** 登录成功了，先缓存token，再发送获取用户信息的接口，要缓存用户信息 */
                this.$store.commit('common/mutationToken', loginInfo.data.token)
                let userInfo = await userInfoApi(loginInfo.data.id)
                this.$store.commit('common/mutationUserInfo', userInfo.data)

                /**
                 * 并发发送两个接口--菜单接口和权限接口 -> Promise.all
                 * all函数返回的结果，是一个数组，数组中的数据顺序就是all参数的数据顺序
                 * chrome浏览器异步请求同时并发6个；10个请求 -> 先发6个出去，然后等6个中任意一个回来，补一个进去
                 */
                // Promise.all([
                //     menuListApi(),
                //     rgihtsListApi(userInfo.data.role)
                // ]).then(arr => {
                //     if (arr[0].code === 200) {
                //         this.$store.commit('common/mutationUserMenu', arr[0].data)
                //     }
                //     if (arr[1].code === 200) {
                //         this.$store.commit('common/mutationUserRights', arr[1].data)
                //     }
                // })
                /**
                 * 这个地方的actions，不能够马上获取数据，因为actions是异步
                 */
                this.$store.dispatch('common/getUserDataAct', userInfo.data.role)

                /** 判断用户是否记住手机号，判断用户是否同一免登录 */
                if (this.remember) {
                    // 可以对手机号进行对称加密
                    localStorage.setItem('my-phone', this.loginObj.phone)
                } else {
                    localStorage.removeItem('my-phone')
                }
                /** 免登录是使用通用票据 */
                if (this.auto) {
                    localStorage.setItem('my-token', loginInfo.data.token)
                } else {
                    localStorage.removeItem('my-token')
                }

                this.$router.push('/home')
            },
            async getVdtCode() {
                if (!this.loginObj.phone || !/^1[3-9]{1}[0-9]{9}$/.test(this.loginObj.phone)) {
                    this.$toast({
                        message: '手机号码输入错误',
                        position: 'bottom'
                    })
                    return
                }

                /**
                 * 节流需要一个节流标识--验证码的文字做标识
                 */
                if (this.vdtMsg !== '获取验证码') return
                this.vdtMsg = '获取中...'
                getVdtCodeApi(this.loginObj.phone).then(d => {
                    if (d.code === 200) {
                        this.$toast.success('获取的验证码为' + d.data.vdtCode)
                        // 在做开发的时候尽可能不要使用setInterval
                        // 使用setTimeout实现递归--要传递开始计时时间
                        this.loopTimer(Date.now())
                    } else {
                        this.vdtMsg = '获取验证码'
                        this.$toast.success('获取的验证码失败，原因：' + d.message)
                    }
                })
            },
            loopTimer(startTime) {
                let nowTime = Date.now()
                let passTime = 6 - Math.ceil((nowTime - startTime) / 1000)
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    if (passTime < 1) {
                        this.vdtMsg = '获取验证码'
                    } else {
                        this.vdtMsg = `重新获取(${passTime}s)`
                        this.loopTimer(startTime)
                    }
                }, 200)
            }
        }
    }
</script>

// 添加一个样式的作用域--加了scoped属性以后，那么所有元素会添加一个属性data-v-hash值，所有的样式也会添加一个属性选择器
<style lang="less" scoped>
    @import "../../style/common.less";

    .login-page {
        .rel-pos();
    }

    .welcome-box {
        .rel-pos();
        padding-top: 30vh;
        .timer-cls {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        .icon {
            display: block;
            margin: auto;
            width: 86px;
            height: 86px;
            background: url(../../images/logo.png) center center / 86px 100% no-repeat;
        }
        .sub-title,
        .title {
            display: block;
            text-align: center;
            font-size: 1.1rem;
            color: @c8;
            line-height: 1.6rem;
        }
        .sub-title {
            font-size: .8rem;
            color: @c5;
        }
        .right {
            display: block;
            position: absolute;
            bottom: 15px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: .6rem;
            color: #ababab;
            transform: scale(.9);
        }
        // & 表示当前样式和父类样式是同一级别：相当于css .welcome-box.login
        &.login {
            padding: 10vh 20px 0;
            .logo {
                display: block;
                text-align: center;
                font-size: 1.1rem;
                color: @c8;
                margin-bottom: 36px;
                &::before {
                    content: '';
                    display: inline-block;
                    vertical-align: middle;
                    width: 1.1rem;
                    height: 1.1rem;
                    margin-right: 8px;
                    background: url(../../images/logo.png) center center / 100% 100% no-repeat;
                }
            }
            .ipt-cls {
                display: flex;
                margin-bottom: 20px;
                border-bottom: solid 1px @cd;
                padding: 8px 0;
                height: 48px;
                line-height: 32px;
                font-size: .7rem;
                &.no-border {
                    border: none;
                    margin-bottom: 14px;
                    &::before {
                        display: none;
                    }
                }
                input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background-color: transparent;
                    font-size: .7rem;
                }
                span {
                    flex: 0 0 120px;
                    border-left: solid 1px @cd;
                    font-size: .6rem;
                    color: @c3;
                    text-align: center;
                }

                // @img: "../../images/lock-icon.png";

                // 设置默认值
                .icon(@img: "../../images/default-icon.png") {
                    content: '';
                    flex: 0 0 48px;
                    width: 48px;
                    height: 32px;
                    background-position: center;
                    background-size: 24px;
                    background-repeat: no-repeat;
                    background-image: url(@img);
                }

                &.user::before {
                    .icon();
                }
                &.lock::before {
                    // 传递参数
                    .icon("../../images/lock-icon.png");
                }
            }
        }
    }
</style>