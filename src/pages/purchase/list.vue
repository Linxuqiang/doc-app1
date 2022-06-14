<template>
    <page-layout :showNew="true" title="采购订单管理">
        <div class="my-page">
            <nav>
                <input type="text" placeholder="输入项目名字进行查询">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="query.state" :options="stateList" />
                </van-dropdown-menu>
                <i></i>
            </nav>
            <section>

                <van-swipe-cell>
                    <template #left>
                        <van-button square type="primary" text="详情" />
                    </template>
                    
                    <van-card title="商品标题"
                        :thumb="img">
                        <template #tags>
                            <span class="content-text">创建人：zhangsan</span>
                            <span class="content-text">创建日期：zhangsan</span>
                            <span class="content-text">材料：zhangsan</span>
                        </template>
                    </van-card>

                    <template #right>
                        <van-button square type="danger" text="删除" />
                        <van-button square type="primary" text="编辑" />
                        <van-button square type="primary" text="确认" />
                        <!-- <van-button square type="primary" text="在途" />
                        <van-button square type="primary" text="完成" />
                        <van-button square type="primary" text="付款" /> -->
                    </template>
                </van-swipe-cell>

                
            </section>
        </div>
    </page-layout>
</template>

<style lang="less" scoped>
    .my-page {
        display: block;
        position: relative;
        height: 100%;
        > nav {
            display: flex;
            height: 48px;
            border-bottom: #ddd;
            padding: 8px 12px;
            > input {
                flex: 1;
                height: 32px;
                background: transparent;
                outline: none;
                border: none;
            }
            > i {
                flex: 0 0 48px;
                height: 32px;
                background: url(../../images/search-icon.png) center center / 32px 32px no-repeat;
            }
        }
        > section {
            display: block;
            height: calc(100% - 48px);
            overflow-x: hidden;
            .van-button {
                height: 100%;
            }
            .van-card__title {
                font-size: .8rem;
                color: #1e1e1e;
            }
            .content-text {
                display: block;
                font-size: .6rem;
                line-height: 26px;
                color: #999;
            }
        }
    }
</style>

<script>
    import img from '../../images/cancel-icon.png'

    export default {
        data() {
            return {
                // 默认图片一般需要同步引入
                // img: require('../../images/cancel-icon.png'),
                // 使用import按模块引入
                img,
                query: {
                    projectName: '',
                    state: '',
                    page: 1,
                    size: 7
                },
                stateList: [
                    {text: '全部', value: ''},
                    {text: '新建', value: '新建'},
                    {text: '确认', value: '确认'},
                    {text: '在途', value: '在途'},
                    {text: '完成', value: '完成'},
                    {text: '作废', value: '作废'}
                ]
            }
        }
    }
</script>