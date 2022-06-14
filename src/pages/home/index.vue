<template>
    <page-layout :showHome="false">
        <van-swipe class="my-swipe"
            :autoplay="15000"
            indicator-color="white"
            height="240">
            <van-swipe-item>
                <div class="chart-box" ref="pieNode"></div>
            </van-swipe-item>
            <van-swipe-item>
                <div class="chart-box" ref="lineNode"></div>
            </van-swipe-item>
        </van-swipe>

        <div v-for="it in functionalList" :key="it.title" class="functional-box">
            <header>
                {{it.title}}
            </header>
            <article>
                <div @click="toPage(menu)" v-for="menu in it.items" :key="menu.id" :class="['item', menu.icon]">
                    {{menu.name}}
                </div>
            </article>
        </div>
    </page-layout>

    <!-- <div class="page-layout">
        <header>
             目前只放文字 
            <span>璇玑智能采购</span>
        </header>
        <main>
             内容 
            <van-swipe class="my-swipe"
                :autoplay="15000"
                indicator-color="white"
                height="240">
                <van-swipe-item>
                    <div class="chart-box" ref="pieNode"></div>
                </van-swipe-item>
                <van-swipe-item>
                    <div class="chart-box" ref="lineNode"></div>
                </van-swipe-item>
            </van-swipe>

            <div v-for="it in functionalList" :key="it.title" class="functional-box">
                <header>
                    {{it.title}}
                </header>
                <article>
                    <div @click="toPage(menu)" v-for="menu in it.items" :key="menu.id" :class="['item', menu.icon]">
                        {{menu.name}}
                    </div>
                </article>
            </div>
        </main>
    </div> -->
</template>

<script>
    import echarts from 'echarts'
    import { collectionApi, paymentApi } from '../../apis/userApi'
    import { makeLineOption, makePieOption } from './chartHanler'
    // 使用vuex中的映射来实现多个getter数据获取
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                pieChart: null,
                pieList: [],
                // 页面菜单功能数据
                functionalList: [
                    {
                        title: '基础数据',
                        items: [
                            // 当前模块的功能点
                            {
                                // 页面展示得文字
                                name: '材料管理',
                                // 用于图标样式
                                icon: 'product-list',
                                // 为了用户点击得时候，可以知道取哪个页面，所以需要和菜单得编码一致
                                id: 'SYSTEM-01-05',
                                // 页面跳转得权限 -- 用户点击菜单时需要得权限
                                right: 'R'
                            },
                            {
                                name: '材料新增',
                                icon: 'product-new',
                                id: 'MATERIAL',
                                right: 'C'
                            },
                            {
                                name: '供应商管理',
                                icon: 'supplier-list',
                                id: 'SYSTEM-01-061',
                                right: 'R'
                            },
                            {
                                name: '供应商新增',
                                icon: 'supplier-new',
                                id: 'SUPPLIER',
                                right: 'C'
                            }
                        ]
                    },
                    {
                        title: '项目',
                        items: [
                            {
                                id: 'PROJECT-01-01',
                                name: '项目管理',
                                icon: 'project-list',
                                right: 'R'
                            },
                            {
                                id: 'PROJECT-01-02',
                                name: '项目新增',
                                icon: 'project-new',
                                right: 'C'
                            }
                        ]
                    },
                    {
                        title: '采购',
                        items: [
                            {
                                id: 'PURCHASE-01-01',
                                name: '采购管理',
                                icon: 'purchase-list',
                                right: 'R'
                            },
                            {
                                id: 'PURCHASE-01-02',
                                name: '采购新增',
                                icon: 'purchase-new',
                                right: 'C'
                            }
                        ]
                    },
                    {
                        title: '收货',
                        items: [
                            {
                                id: 'RECEIVING-01-01',
                                name: '采购管理',
                                icon: 'receive-list',
                                right: 'R'
                            },
                            {
                                id: 'RECEIVING-01-02',
                                name: '采购新增',
                                icon: 'receive-new',
                                right: 'C'
                            }
                        ]
                    },
                    {
                        title: '系统',
                        items: [
                            {
                                id: 'SETTING',
                                name: '设置',
                                icon: 'setting'
                            }
                        ]
                    }
                ]
            }
        },
        /** 因为登录页面没有获取完成菜单和权限数据后才进行跳转，所以数据不能再created或则mounted获取只能使用computed获取 */
        computed: {
            // menuList() {
            //     return this.$store.getters['common/userMenu']
            // }
            // 使用mapGetters的时候，需要展开方法
            ...mapGetters({
                // 对象中的key就是计算属性的getter方法名，值为getter属性
                // mapGetter表明要从$store的getters属性上把数据映射出来
                menuList: 'common/userMenu',
                userRigths: 'common/userRights'
            })
        },
        /** 只是说虚拟dom挂载完成，并没有说渲染就完成 */
        async mounted() {
            // 使用到虚拟dom节点，它是绘制echart的容器
            // 实例化方法 -- init方法需要一个dom节点
            // await this.$nextTick()
            // setTimeout不要给时间
            setTimeout(async () => {
                this.pieChart = echarts.init(this.$refs.pieNode)

                paymentApi().then(d => {
                    if (d.code === 200) {
                        this.pieList = d.data
                        this.loopRenderPieChart()
                    }
                })

                // 实现我们折线图
                // await 关键字只能在异步方法中才能使用，所以当前调用await的方法必须使用async关键字来声明
                let result = await collectionApi()
                if (result.code === 200) {
                    // let option = makeLineOption(result.data)
                    // let chartObj = echarts.init(this.$refs.lineNode)
                    // chartObj.setOption(option)
                    echarts.init(this.$refs.lineNode).setOption(makeLineOption(result.data))
                }
            })
        },
        methods: {
            loopRenderPieChart(index = 0) {
                let item = this.pieList[index]
                // 绘制图像 -- setOption就是绘制方法
                let option = makePieOption(item)
                this.pieChart.setOption(option)
                setTimeout(() => {
                    ++ index

                    this.loopRenderPieChart(index >= this.pieList.length ? 0 : index)
                }, 2000)
            },
            /**
             * 页面跳转，应该要去判断用户得权限，还需要知道菜单点击后，要去哪个页面？
             * menu参数有id，通过id再menuList可以找到菜单得跳转地址
             * 可以通过id找到用户对应菜单得权限
             */
            toPage(menu) {
                // 先获取菜单路径数据
                let nowMenu = this.menuList.find(it => it.id === menu.id)
                debugger;
                // 看menu数据是否有right字段，如果没有则表示不需要权限 -- 直接访问
                if (!menu.right) {
                    // 因为有一些菜单，只有App端才有，所以menuList时没有数据得
                    if (menu.id === 'SETTING') {
                        debugger;
                        this.$router.push('/setting')
                    } else {
                        this.$router.push(nowMenu.path)
                    }
                } else {
                    // 要获取当前menu.id对应用户得权限
                    let nowRights = this.userRigths.find(it => it.id === menu.id)
                    // 判断用户对于当前菜单是否有任何得一些权限
                    if (!nowRights) {
                        this.$toast.fail('您没有此菜单得任何权限')
                    } else {
                        // 可能有一些权限，但是没有对应menu.right权限
                        if (nowRights.role.includes(menu.right)) {
                            this.$router.push(nowMenu.path)
                        } else {
                            this.$toast.fail('您没有此菜单权限')
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../style/common.less";
    @size: 12px;

    .functional-box {
        display: block;
        position: relative;
        margin: 0 @size @size;
        background-color: @cf;
        > header {
            display: block;
            position: relative;
            padding: @size;
            font-size: .8rem;
            color: @c8;
            line-height: 26px;
            border-bottom: solid 1px #ddd;
            &::before {
                content: '';
                width: 2px;
                height: 26px;
                display: inline-block;
                vertical-align: middle;
                background: @c8;
                margin-right: 10px;
            }
        }
        > article {
            display: block;
            position: relative;
            padding: 8px @size;
            .clear();
            > .item {
                float: left;
                width: 25%;
                margin-bottom: 8px;
                font-size: .65rem;
                text-align: center;
                color: @c8;
                &::before {
                    content: '';
                    display: block;
                    width: 52px;
                    height: 52px;
                    margin: auto;
                    background-position: center;
                    background-size: 40px;
                    background-repeat: no-repeat;
                    // background: url('../../images/home/project-list.png') center center / 40px 40px no-repeat;
                }
                // &.project-list {
                //     &::before {
                //         background-image: url('../../images/home/project-list.png');
                //     }
                // }
                .loop();
            }
        }
    }

    // 定义一个数组
    @list: project-list project-new product-list product-new purchase-list purchase-new receive-list receive-new setting supplier-list supplier-new;
    // 定义一个方法，然后使用递归来实现循环，需要使用when关键字
    // length函数是获取less数组的长度的
    .loop(@index: 1) when(@index <= length(@list)) {
        // 取数组的一个变量，要使用一个extract关键字，这个方法第一个参数为数组，第二个为需要取得下标
        @name: extract(@list, @index);
        // 变量名再使用得时候，@name 使用得语法 @{name}
        &.@{name} {
            &::before {
                background-image: url("../../images/home/@{name}.png");
            }
        }
        .loop(@index + 1);
    }

    .chart-box {
        display: block;
        height: 100%;
    }
</style>