<template>
    <div class="svipRules">
        <div class="module" v-for="(module,idx) in modules" :key="idx">
            <div class="module-title fl-l">{{module.title}}</div>
            <div class="clearfix"></div>
            <div class="module-item" v-for="(item,index) in module.lists" :key="index">
                {{item}}
            </div>
        </div>
    </div>
</template>

<script>
    import {postTitle} from "@/assets/js/jsBridge";
    export default {
        name: "svipRules",
        data(){
            return{
                modules: [
                    {
                        title: '什么是助商通会员卡',
                        lists: [
                            '1、参加商家的预充值活动，成为会员;',
                            '2、卡主可以设置共享卡供他人使用，分享赚钱的同时，也可以帮助商家获取更多的客流;',
                            '3、共享卡可直接分享到微信、支付宝能站外平台使用。'
                        ]
                    },
                    {
                        title: '卡主操作流程',
                        lists: [
                            '1.点击【首页】会员充值;',
                            '2.输入需要充值用户的助商通ID或者手机号码,点击【查询】,获取会员信息;',
                            '3.选择要充值的会员卡套餐,确认充值(注:首次充值需实名制信息);',
                            '4.扫描对方的微信或支付宝付款码完成共享卡的充值。'
                        ]
                    }
                ]
            }
        },
        mounted(){
            // postTitle('助商通SVIP会员')
        }
    }
</script>

<style lang="scss" scoped>
    .svipRules{
        box-sizing: border-box;
        padding: .35rem;
        .module{
            width: 100%;
            margin-bottom: .8rem;
            .module-title{
                display: inline;
                padding: .11rem .2rem;
                font-size: .3rem;
                color: #FFFFFF;
                background: #343C53;
                border-radius: .25rem;
            }
            .module-item{
                font-size: .3rem;
                color: #343C53;
                line-height: .6rem;
            }
        }
    }
</style>
