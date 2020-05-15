<template>
    <div id="gm_choose_shop">
        <center-header
          :title="'创建品牌'"
          :backing="'返回'"
        ></center-header>
        <div class="full_container">
          <div class="create_category_area">
            <!--
            <div class="create_title">
              <img src="@/assets/create_category_icon.png">
              <span>第一步：创建品牌信息</span>
            </div> -->
            <!-- 新建品牌表单 -->
            <div class="form_area">
              <el-form :model="category" :rules="rules" ref="categoryForm" label-width="2.23rem">
                <el-form-item label="品牌名称:" prop="brandName">
                    <el-input v-model="category.brandName" maxlength="30" placeholder="请输入品牌名称，不超过30个字符"></el-input>
                </el-form-item>
                <el-form-item label="所属行业:" prop="industry">
                    <el-select v-model="category.industry" placeholder="请选择所属行业">
                      <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span class="tip">一旦创建，不可修改</span>
                </el-form-item>
                <el-form-item label="品牌口号:">
                  <el-input v-model="category.brandSlogan" placeholder="请输入品牌宣传口号，不超过30个字符" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="品牌Logo:" prop="brandLogo">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :headers="myHeaders"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="logoImg" :src="logoImg" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p class="tip">支持jpg，png格式，建议像素200*200px，大小不超过300kb</p>
                </el-form-item>
                <el-form-item label="形象背景:">
                  <el-upload
                    class="avatar-back-uploader"
                    :action="uploadUrl"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :on-success="handleBackAvatarSuccess"
                    :before-upload="beforeBackAvatarUpload">
                    <img v-if="bgImg" :src="bgImg" class="avatar-back">
                    <i v-else class="el-icon-plus avatar-back-uploader-icon"></i>
                  </el-upload>

                  <p class="tip">支持jpg，png格式，建议像素640*320px，大小不超过1M</p>
                </el-form-item>
                <el-form-item label='客服电话:' prop="customerServicePhone">
                    <el-input v-model="category.customerServicePhone" placeholder="请输入品牌客服咨询电话"></el-input>
                </el-form-item>
                <el-form-item label="品牌简介">
                  <el-input v-model="category.brandIntroduction" type="textarea" :rows="4" :maxlength="500" placeholder="请输入品牌简介（不超过500字）"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('categoryForm')">下一步</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import CenterHeader from '@/components/common/CenterHeader'
// import Header from '@/components/loginCommon/LoginHeader.vue'
import * as api from '@/assets/js/interface'
import * as axios from "@/util/axios";
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
import { mapActions, mapState } from 'vuex'
import { setTimeout } from 'timers';
export default {
  name:'GmChooseShop',
  components: {
    // 'v-header': Header
    'center-header': CenterHeader,
  },
  data () {
    return {
      header:{
        title:'创建门店',
        isphone: false
      },
      logoImg: '', // 品牌logo
      bgImg: '', // 背景形象照
      category:{
        brandName:'',
        industry: '',
        brandSlogan:'',
        brandLogo:'',
        imageBackground:'',
        brandIntroduction:'',
        customerServicePhone: ''
      },
      industryList: [],
      rules:{
        brandName:[{required:true, message:'请输入主体品牌名称',trigger:'blur'}],
        industry:[{required:true, message:'请选择所属行业',trigger:'blur'}],
        customerServicePhone:[{required:true, message:'请输入客服咨询电话',trigger:'blur'}],
        brandLogo: [{required:true, message:'请上传品牌Logo',trigger:'blur'}]
      },
      // 提示消息
      message: '',
      deletePictureId: '' // 此处存放要删除的老图片
    }
  },
  computed: {
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL
    },
    myHeaders() {
      return utils.getUploadHeader()
    }
  },
  mounted(){
    // 获取行业
    this.getIndustry()
  },
  methods: {
    ...mapActions(['saveCreateBrandId']),
    getIndustry() {
      // 获取行业列表
      axios.get(api.getIndustryList.URL).then(res => {
        this.getIndustryListRes(res)
      })
    },
    // 处理行业列表
    getIndustryListRes(data) {
      this.industryList = data.industryList
    },
    // 退出登录
    loginOut(){
      this.$router.push('/login')
    },
    // handleChange(value){
    //   console.log(value);
    // },
    // 检测用户信息
    checkBandInfo(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        // 如果填了客服电话，要检测客服电话是否合格
        if (arr[i] === 'customerServicePhone' && !utils.checkSerPhone(this.category.customerServicePhone)) {
          this.message = "客服电话有误，请重填"
          return false
        } else if (arr[i] === 'brandName' && !utils.checkLen(this.category.brandName, 30)) {
          this.message = "品牌名称不能超过30个字符"
          return false
        }
      }
      return true
    },
    // 创建品牌请求数据处理
    createBrand(res) {
      if (res.success) {
        // 保存当前创建的品牌
        this.saveCreateBrandId(res.brandId)
        // 提示
        utils.showTip(this, {msg: '创建品牌成功', type: 'success'})
        // 成功之后跳转到下一步
        this.$router.push('/create-shop')
      } else {
        // 提示
        utils.showTip(this, {msg: '创建品牌失败', type: 'error'})
      }
    },
    // 提交表单验证
    submitForm(formName) {
      // 先检测表单的必填信息是否完整
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 再检测用户信息格式是否正确
          if (this.checkBandInfo(['customerServicePhone', 'brandName'])) {
            // 开始创建
            axios.post(api.createBrand.URL, this.category).then(res => {
              this.createBrand(res)
            })
          } else {
            // 提示
            utils.showTip(this, {msg: this.message, type: 'error'})
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });



    },
    // 上传新图片之前要先删除老照片
    // 删除老图片
    deletePictureRes(res) {
      console.log(res.message)
      // if (res.success) {
      //   // 提示
      //   utils.showTip(this, {msg: '删除图片成功', type: 'success'})
      // } else {
      //   // 提示
      //   utils.showTip(this, {msg: '删除图片失败', type: 'error'})
      // }
    },
    handleAvatarSuccess(res, file) {
      // 如果含有老图片，则先删除老图片
      // if (!!this.deletePictureId) {
      // axios.get(api.deletePicture.URL + this.deletePictureId).then(res => {
      //   this.deletePictureRes(res)
      // })
      // }
      // this.deletePictureId = file.response.fileKey
      this.category.brandLogo = file.response.fileKey
      this.logoImg = datas.imgUrl.URL + file.response.fileKey
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 < 300;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 300kb!');
      }
      return isJPG && isLt2M;
    },
    handleBackAvatarSuccess(res, file) {
      this.bgImg = datas.imgUrl.URL + file.response.fileKey
      this.category.imageBackground = file.response.fileKey
    },
    beforeBackAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 /1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1M!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<style lang="scss">
  #gm_choose_shop .el-upload__tip{
    color: #9B9B9B;
    font-size: 14px;
  }
  #gm_choose_shop .el-range-editor.el-input__inner,#gm_choose_shop .el-select{
    width: 100%;
  }
  .el-cascader-menus .el-popper{
    position: fixed !important;
  }
</style>

<style lang="scss" scoped>
  .tip{
    color:#9B9B9B;
    font-size:14px;
  }
   #gm_choose_shop {
     .el-cascader{
       width:100%;
     }
     .full_container{
       display: flex;
       flex-direction: column;
       background-color: #F4F5F9;
     }
     .create_category_area{
       flex: 1;
       background-color: #fff;
       .create_title{
         margin: 58px 0 0 85px;
         img{
           width: 55px;
           height: 55px;
           vertical-align: middle;
         }
         span{
          font-size:20px;
         }
       }
       .form_area{
         width: 60%;
         padding-top: 60px;
       }
     }

    }
</style>



