<template>
    <div class="page-layout">
        <header>
            <em>
                <i v-if="showHome" @click="$router.push('/home')" class="home"/>
                <i v-if="showBack" @click="$router.go(-1)" class="back"/>
            </em>
            <!-- 目前只放文字 -->
            <span>{{title}}</span>
            <em class="r">
                <i v-if="showNew" class="new"/>
            </em>
        </header>
        <main>
            <!-- 内容 -- 默认插槽 -->
            <slot/>
        </main>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '璇玑智能采购'
            },
            showHome: {
                type: Boolean,
                default: true
            },
            showBack: {
                type: Boolean,
                default: false
            },
            showNew: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/common.less";

    .page-layout {
        display: block;
        height: 100%;
        > header {
            display: block;
            background: @c8;
            height: 48px;
            line-height: 48px;
            color: @cf;
            text-align: center;
            > span {
                display: block;
                position: relative;
                z-index: 9;
            }
            > em {
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 48px;
                z-index: 11;
                &.r {
                    left: auto;
                    right: 0;
                }
                > i {
                    float: left;
                    width: 48px;
                    height: 48px;
                    background: url(../images/home.png) center center / 32px 32px no-repeat;
                    &.back {
                        background-image: url(../images/back.png);
                    }
                    &.new {
                        background-image: url(../images/add-icon.png);
                    }
                }
            }
        }
        > main {
            display: block;
            height: calc(100% - 48px);
            overflow-x: hidden;
        }
    }
</style>