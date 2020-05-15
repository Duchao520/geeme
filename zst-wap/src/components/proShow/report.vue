<template>
    <div class="report">
        <div class="title">
            请选择举报原因
        </div>
        <div class="checkbox-container">
            <div class="checkbox"  v-for="(item,index) in list" :key="index" @click="checked(index)">
                <i class="iconfont" :class="{'icon-check': item.status}"></i>{{item.desc}}
            </div>
        </div>
        <div class="title">
            内容描述
        </div>
        <div class="desc">
            <textarea placeholder="请输入您举报的原因(1000字以内)" v-model="remark">

            </textarea>
        </div>
        <transition name="alertMsg">
            <span class="tip" v-show="tipFlag">{{tip}}</span>
        </transition>
        <button @click="submit">确认举报</button>
    </div>
</template>

<script>
    import {report} from '@/assets/js/comm';
    import {getSignIn} from "@/assets/js/jsBridge";

    export default {
        name: "report",
        props: ['tokenPromise'],
        data(){
            return{
                showId: this.$route.query.showId,
                list: [
                    {
                        reportType: 1,
                        status: 0,
                        desc: '存在虚假/仿冒/欺骗信息'
                    },
                    {
                        reportType: 2,
                        status: 0,
                        desc: '信息错误/无法联系等因素'
                    },
                    {
                        reportType: 3,
                        status: 0,
                        desc: '存在多个/重复的产品信息'
                    },
                    {
                        reportType: 4,
                        status: 0,
                        desc: '该信息存在违规不良内容'
                    },
                    {
                        reportType: 5,
                        status: 0,
                        desc: '该用户存在骚扰/欺诈行为'
                    },
                    {
                        reportType: 6,
                        status: 0,
                        desc: '该用户存在恶意骗粉行为'
                    }
                ],
                report: '',
                remark: '',
                tip: '',
                tipFlag: false,
                token: ''
            }
        },
        methods: {
            checked(idx){
                let _self = this;
                _self.list.forEach(ele => {
                    ele.status = 0;
                });
                _self.list[idx].status = 1;
                _self.report = _self.list[idx];
            },
            submit(){
                let _self = this;
                if(!_self.report){
                    _self.tip = '请选择举报类型'
                    _self.tipFlag = true;
                    setTimeout(() => {
                        _self.tipFlag = false;
                    },2000)
                }else if(_self.remark.length > 1000){
                    _self.tip = '描述内容请显示1000字以内'
                    _self.tipFlag = true;
                    setTimeout(() => {
                        _self.tipFlag = false;
                    },2000)
                } else{
                    let _data = {
                        token: _self.token,
                        showId: _self.showId,
                        reportType: _self.report.reportType,
                        reportName: _self.report.desc,
                        remark: _self.remark
                    }
                    getSignIn(_data).then(sec => {
                        report(_data,sec).then(res => {
                            if(res.data.state == 1){
                                _self.tip = '提交成功'
                            }else if(res.data.state == 900248){
                                _self.tip = '您已举报过该产品秀'
                            } else{
                                _self.tip = res.data.msg
                            }
                            _self.tipFlag = true;
                            setTimeout(() => {
                                _self.tipFlag = false;
                            },2000)
                        })
                    })
                }
            }
        },
        mounted(){
            let _self = this;
            _self.tokenPromise.then(res => {
                _self.token = res;
            });
        }
    }
</script>

<style lang="scss" scoped>
    .alertMsg-enter-active{
        animation: zoomIn .3s;
    }
    .alertMsg-leave-active{
        animation: zoomOut .3s;
    }
    .report{
        .title{
            width: 100%;
            height: .83rem;
            box-sizing: border-box;
            padding: 0 .33rem;
            font-size: .26rem;
            color: #8c8c8c;
            line-height: .83rem;
            background: #f7f7f7;
        }
        .checkbox-container{
            width: 100%;
            box-sizing: border-box;
            padding: .31rem;
            height: 5.3rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .checkbox{
                font-size: .32rem;
                display: flex;
                align-items: center;
                i{
                    display: block;
                    width: .34rem;
                    height: .34rem;
                    box-sizing: border-box;
                    border: .02rem solid #acacac;
                    border-radius: 50%;
                    margin-right: .2rem;
                    line-height: .36rem;
                    font-size: .34rem;
                }
                .icon-check{
                    color: #feb623;
                    border: none;
                }
            }
        }
        .desc{
            width: 100%;
            height: 3.08rem;
            box-sizing: border-box;
            padding: .3rem;
            textarea{
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding: .34rem .27rem;
                border: .02rem solid #acacac;
                border-radius: .03rem;
                font-size: .26rem;
                resize:none
            }
        }
        .tip{
            width:3rem;
            height: .5rem;
            line-height: .5rem;
            padding: .3rem;
            background: rgba(12,12,12,.6);
            color: #FFFFFF;
            font-size: .26rem;
            position: fixed;
            left: 0;
            right: 0;
            top: 6rem;
            margin: 0 auto;
            text-align: center;
        }
        button{
            display: block;
            width: 6.89rem;
            height: .78rem;
            border-radius: .08rem;
            color: #FFFFFF;
            font-size: .26rem;
            background: #f7094d;
            margin: 0 auto;
        }
    }
</style>