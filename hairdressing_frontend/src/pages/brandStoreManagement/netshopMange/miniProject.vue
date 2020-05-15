<template>
    <div id='miniProject'>
        <div class="topTitle">
            <h3>开通微信小程序</h3>
            <p>只需简单配置，就可以一键生成自己的小程序，帮助企业降低开发成本。商品、订单统一通过品牌总部后台管理，简单高效！</p>
            <p>开通微信小程序之前，须先完成<router-link to='/brand-inner/center/auth-brand'><span>品牌认证</span></router-link>。</p>
        </div>
        <div class="mainContent">
            <div class='projectMode'>
                <dl>
                    <dt style='color:#41CAC0' class='icon iconfont icon_smallpro01'>&#xe702;</dt>
                    <dd>
                        <h4>免注册生成小程序</h4>
                        <p>适用已有公众号但无小程序的商户，由及美生成小程序。</p>
                        <!-- <g-btn size='small' :name='step==0 ? "填写授权": step==1 || step== 2? "继续填写": step == 3 ? "审核中":  step == 4?"发布成功":"填写授权"' :type='step == 4 ? "gray" :"blue1"' :disabled="step == 4" @click='buttonRouter("createRoot")'></g-btn> -->
                        <el-button size='medium' :class='step == 4 ? "normal_silvery_gray_btn" :"normal_blue_btn"' :disabled="step == 4" @click='buttonRouter("createRoot")'>{{step==0 ? "填写授权": step==1 || step== 2? "继续填写": step == 3 ? "审核中":  step == 4?"发布成功":"填写授权"}}</el-button>
                    </dd>
                </dl>
            </div>
            <div class='projectMode'>
                <dl>
                    <dt style='color:#5683FF' class='icon iconfont icon_smallpro02'>&#xe703;</dt>
                    <dd>
                        <h4>已有小程序授权</h4>
                        <p>请确保小程序认证主体和当前店铺主体一致。</p>
                        <!-- <g-btn name='一键授权并开通' type='blue1' size='small' @click='buttonRouter("11")'></g-btn> -->
                        <el-button size='medium' class='normal_blue_btn' @click='buttonRouter("11")'>一键授权并开通</el-button>
                        <span class='look icon iconfont icon_ope_lock'>&#xe6dd;</span>
                    </dd>
                </dl>
            </div>
            <div class='projectMode'>
                <dl>
                    <dt class='icon iconfont icon_smallpro'>&#xe6ff;</dt>
                    <dd>
                        <h4>小程序官方注册</h4>
                        <p>前往微信公众平台完成注册，之后再授权给及美。
                            <span @click="otherSite" style="cursor: pointer;">查看教程</span> 
                        </p>
                        <el-button size='medium' class='normal_blue_btn' @click='buttonRouter("Register")'>前往注册</el-button>
                    </dd>
                </dl>
            </div>
        </div>
        <div class='example' v-if='false'>
            <h3>演示实例</h3>
            <div>
                <dl>
                    <dt></dt>
                    <dd><span>①</span><span>顾客关注商家公众号接收通知提醒</span></dd>
                </dl>
                <dl>
                    <dt></dt>
                    <dd><span>①</span><span>顾客关注商家公众号接收通知提醒</span></dd>
                </dl>
                <dl>
                    <dt></dt>
                    <dd><span>①</span><span>顾客关注商家公众号接收通知提醒</span></dd>
                </dl>
            </div>
        </div>
        <g-del-model
            :delTagDialogVisible="warningModelVisible"
            @close="warningModelVisible=false"
            @confirm="openRoot"
            :title="initData.title"
            :content="initData.content"
            :icon="initData.icon"
            :iconColor="initData.iconColor"
            :confirmButton="initData.btn"
        ></g-del-model>
    </div>
</template>
<script>
import * as axios from '@/util/axios'
import { mapActions } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
    data() {
        return {
            warningModelVisible: false,
            initData:{
                title: '暂时不能注册！',
                content: '开通小程序之前，须先完成品牌认证。',
                icon: 'icon_popup_plaint',
                iconColor: '#FCB322',
                btn: '前往认证'
            },
            step: 0
        }
    },
    mounted() {
        this.getCreateStatus();
    },
    computed: {
        currentInfo() {
            return this.$store.state.manage.currentInfo;
        },
    },
    methods: {
        getCreateStatus() {
            axios.get('/weapp/getWeappStatus/'+ this.currentInfo.brandId).then(res => {
                if (res) {
                    this.step = res.step
                }
            })
        },
        buttonRouter(type) {
            if (type == "createRoot") {
                axios.post('/getAuthenticateBrandInfo',{'brandId': this.currentInfo.brandId}).then(res => {
                   if (res.authenticateBrandStatus == 1) {
                       this.$router.push({path: '/brand-inner/create/mini-project'})
                   } else {
                       this.warningModelVisible = true;
                       // utils.showTip(this, { msg: '你还未通过品牌认证，请先完成品牌认证。', type: "error" });
                   }
                })
                // this.$router.push({path: '/brand-inner/create/mini-project'})
            } else if (type === 'Register'){
                window.open('https://mp.weixin.qq.com/')
            } else {
                utils.showTip(this, { msg: '暂未开放', type: "info" });
            }
        },
        openRoot() {
            this.$router.push('/brand-inner/center/auth-brand')
        },
        otherSite() {
            window.open('https://kf.qq.com/faq/170109iQBJ3Q170109JbQfiu.html')
        }
    }
}
</script>
<style lang="scss" scoped>
#miniProject{
    padding-top: 40px;
    padding-left: 30px;
    height: 100%;
    h3{
        font-size: 16px;
        color: #333333;
        padding-bottom: 15px;
    }
}
.topTitle{
    p{
        width: 416px;
        font-size: 13px;
        color: #999;
        line-height: 20px;
        &:last-child{
            padding-top: 5px;
        }
        span{
            color: #58C9F3;
        }
    }
}
.mainContent{
    margin: 40px 0;
    display: flex;
}
.projectMode{
    margin-right: 20px;
    dl{
        width: 300px;
        height: 160px;
        box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
        position: relative;
        border-radius: 6px;
        dt{
            float: left;
            color: #28CF5E;
            font-size: 60px;
            margin: 15px;
        }
        dd{
            float: left;
            h4{
                font-size: 18px;
                color: #333;
                padding-top:21px;
            }
            p{
                width: 195px;
                padding-top: 9px;
                font-size: 13px;
                color: #666;
                line-height: 20px;
                span{
                    color: #58C9F3;
                }
            }
            .el-button{
                margin-top: 15px;
            }
            .look{
                position: absolute;
                right: 10px;
                bottom: 10px;
                color: #A9A9A9;
            }
        }
    }
    .el-button{
        background: #58C9F3;
        color: #fff;
        border: none;
        &:hover{
            background-color: rgba(83, 190, 230, 1);
        }
        &:active{
            background-color: #54B1D3;
        }
    }
}
.example{
    &>div{
        padding-bottom: 20px;
        display: flex;
    }
    dl{
        width: 180px;
        margin-right: 30px;
        dt{
            width: 100%;
            height: 389px;
            background: #ccc;
            border-radius: 8px;
        }
        dd{
            font-size: 13px;
            display: flex;
            color: #666;
            line-height: 20px;
            padding-top: 10px;
        }
    }
}
</style>
