<template>
    <el-dialog
        title=""
        :visible.sync="delStoreVisible"
        width="500px"
        :before-close="dialogBeforeClose">
        <el-form class="form" ref="form" :model="form" label-width="0">
            <div class="form-inner">
                <div class="icon">
                    <i class="icon iconfont icon-icon_popup_question"></i>
                </div>
                <div class="main">
                    <p class="title">确定删除吗</p>
                    <span class="span">删除后，该门店所有信息将丢失。已购软件<br/>及应用服务即时失效且无法退款！</span>
                    <el-form-item prop="code">
                        <el-input class="input" type="number" @input="input" v-model.number="form.code">
                            <div slot="append" :class="buttonDisabled?['input','buttonDisabled']:'input'" @click="getCode"> {{!buttonDisabled?'获取验证码':`${minutes}s后重发`}} </div>
                        </el-input>
                    </el-form-item>
                    
                    <span style="color:#666666">验证码将发送至手机号：{{phoneNumber}}</span>
                    <el-checkbox style="margin-top:20px" v-model="form.checked" >已知晓风险，一切后果由本人自行承担</el-checkbox>
                </div>
            </div>
        </el-form>
        <div slot="footer" class="footer">
            <el-button @click="$emit('close')">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import * as api from '@/assets/js/interface'
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import { clearInterval } from 'timers';
export default {
    props:{
        delStoreVisible:Boolean,
        current: Number || String
    },
    data() {
        return {
            form:{
                code:null,
                checked:false
            },
            buttonDisabled:false,
            minutes:60,
            code:null,
            encryptString: ''// 验证码加密串
        }
    },
    computed: {
        phone(){
            return this.$store.state.manage.userInfo.telephone;
        },
        phoneNumber(){
            var phone  = this.phone;
            var phoneNumber = phone.replace(phone.slice(3,7),'****')
            return '+86'+phoneNumber
        }
    },
    methods: {
        dialogBeforeClose(){
            this.$emit('close')
        },
        confirm(){
            if (this.form.code == '') {
              utils.showTip(this, { msg: '请先输入验证码', type: "error" });
              return flase
            } else if (!this.form.checked) {
              utils.showTip(this, { msg: '请先在知晓风险处打钩', type: "error" });
              return flase
            }
            axios.post('/deleteShop', {id: this.current, encryptString: this.encryptString,telephone: this.phone, verificationCode: this.form.code}).then(res => {
              // this.deleteShopRes(res);
              this.$emit('confirm',res)
            })
            
        },
        input(num){
            if(`${num}`.length>6){
              this.form.code = Number(`${num}`.slice(0,6)) ;
            }
        },
        getCode(){
          if(!this.buttonDisabled){
            axios.post('/getVerificationCodeForDeleteStore', {telephone: this.phone}).then(res => {
              this.getCodeRes(res);
            })
          }
        },
        getCodeRes(res){
          this.buttonDisabled=true;
          let that = this
          var timer = setInterval(() => {
              that.minutes = that.minutes -1;
              if(that.minutes===0){
                window.clearInterval(timer);
                timer = null;
                that.minutes = 60;
                that.buttonDisabled = false;
              }
          }, 1000);
          if(res.success){
            this.encryptString = res.encryptString
              // 存下code
          }
        }
    },
}
</script>
<style lang="scss" scoped>
.form{
    box-sizing: border-box;
    padding: 0 50px;
    .form-inner{
        display: flex;
        .icon{
            color: #FF6D61;
            margin-right: 8px;
            i{
                font-size: 50px;
            }
        }
        .main{
            .title{
                color: #333333;
                font-size: 20px;
                line-height: 30px;
                font-weight: 600;
            }
            .span{
                color: #FF6D61;
                line-height: 20px;
                font-size: 14px;
            }
            .input{
                margin: 10px 0;
                /deep/ .el-input-group__append{
                    background: #EEEEEE;
                    color: #333333;
                    cursor: pointer;
                    width:116px;
                    padding: 0;
                    text-align: center;
                }
            }
            .buttonDisabled{
                 /deep/ .el-input-group__append{
                    cursor: not-allowed
                }
            }
        }
    }
}
.footer{
    margin-top: -20px;
}
</style>
