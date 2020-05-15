<template>
  <el-dialog title="免费试用申请" :visible.sync="visible" center append-to-body :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商家名称" required prop="brandName">
        <el-input v-model="form.brandName" placeholder="请填写商家门店或企业名称"></el-input>
      </el-form-item>
      <el-form-item label="您的姓名" required prop="username">
        <el-input v-model="form.username" placeholder="请填写您的姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" required prop="mobile">
        <el-input v-model="form.mobile" placeholder="请填写您的手机号码"></el-input>
      </el-form-item>
      <el-form-item label="所在城市" required prop="province">
        <el-cascader
            placeholder="请选择商家总部所在城市"
            :options="options"
            :props='prop'
            @change="setAddress"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="经营行业">
        <el-select v-model="form.tradeId" placeholder="请选择">
          <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补充说明">
        <el-input v-model="form.remark" type="textarea" placeholder="请填写补充说明" maxlength="150" show-word-limit resize="none" rows="5"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <button class="footer-button" @click="submit()">确认提交</button>
    </div>
  </el-dialog>
</template>

<script>
  import * as axios from "@/util/axios";
  import Axios from 'axios'; // 高德用
  export default {
    name: "TryuseForm",
    props:{
      show:Boolean,
      type:{
        type:Number,
        default:1
      }
    },
    data(){
      return {
        visible:true,
        industryList:[],
        options:[],
        prop:{
          label: 'name',
          value: 'name',
          children: 'districts'
        },
        form:{
          brandName:'',
          username: '',
          mobile:'',
          province:'',
          city:'',
          tradeId:'',
          remark:'',
        },
        rules:{
          brandName:[{
            required:true, message: '请输入品牌名称', trigger:'blur'
          }],
          username:[{
            required:true, message:'请输入联系人姓名', trigger:'blur'
          }],
          mobile:[{
            required:true, message:'请输入手机号码', trigger:'blur'
          }, {
            min:11, max:11, message:'无效的手机号', trigger:'blur'
          }],
          province:[{
            required:true, message:'请选择省市', trigger:'blur'
          }],
        }
      }
    },
    watch:{
      'show'(n){
        this.visible = n
      },
      'visible'(n){
        this.$emit('update:show', n)
      }
    },
    mounted(){
      this.getCityData()
      this.getIndustryList()
    },
    methods: {
      getIndustryList(){
        axios.get(`${process.env.BMS_URL}/getIndustryList`).then( data => {
          this.industryList = data.industryList
        })
      },
      getCityData() {
        Axios.get(`//restapi.amap.com/v3/config/district?key=f211857599047852b425815b7d4a29e7&keywords=&subdistrict=2&extensions=base`).then(res => {
          if (res.data.status == '1'){
            this.options = res.data.districts[0].districts
            this.forEachCityData(this.options)
          }
        })
      },
      //遍历城市数据
      forEachCityData(data) {
        data.forEach(res => {
          if (res.districts.length == 0) {
            res.districts = null
          } else {
            this.forEachCityData(res.districts)
          }
        })
      },
      submit(){
        this.$refs.form.validate(valid => {
          if(valid){
            axios.post(`${process.env.BMS_URL}/createWebsiteForm`, {...this.form, type:this.type}, {withOutToken:true}).then( data => {
              this.$message({
                type:data.success ? 'success' : 'error',
                message:data.success ? '申请提交成功，我们将尽快与您联系！' : data.message
              })
              if(data.success){
                this.visible = false
              }
            })
          }
        })
      },
      setAddress(e){
        this.form.province = e[0]
        this.form.city = e[1]
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog{
    width: 600px;
    .el-dialog__header{
      padding-top:40px;
      .el-dialog__title{
        font-size: 28px;
        color:#333;
      }
    }
    .el-form-item{
      min-height: 44px;
      line-height: 44px;
      font-size:16px;
      .el-form-item__label{
        font-size:inherit;
        line-height: inherit;
      }
      .el-form-item__content{
        line-height: inherit;
        font-size:inherit;
        .el-input{
          font-size:16px;
          width: 280px;
          .el-input__inner{
            height: 44px;
            line-height: inherit;
          }
        }
        .el-textarea{
          width: 400px;
        }
      }
    }
  }

  .footer-button {
    width: 380px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 18px;
    font-family: PingFangSC-Regular;
    background-color: #F52D56;
    border-radius:4px;
    color:#fff;
    border: none;
    cursor: pointer;
    &:hover{
      background-color: #E02047;
    }
    &:active{
      background-color: #D11D42;;
    }
  }


</style>
