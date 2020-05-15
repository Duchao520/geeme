<template>
    <div id="gm_choose_shop">
        <v-header :header='header'></v-header>
        <div class="full_container" style="margin-top: 20px;">
          <div class="create_category_area">
            <div class="create_title">
              <img src="@/assets/img/create_category_icon.png">
              <span>第二步：创建门店</span>
            </div>
            <!-- 新建品牌表单 -->
            <div class="form_area">
              <el-form :model="shop" :rules="rules" ref="categoryForm" label-width="223px">
                <el-form-item label="门店名称:" prop="name">
                  <el-tooltip class="item" effect="light" placement="right">
                    <div slot="content">
                      <ul>
                        <li>无须输入品牌名称</li>
                        <li>无须输入城市名称</li>
                        <li>规范格式：×××店，最好不超过5个汉字</li>
                      </ul>
                    </div>
                    <el-input v-model="shop.name" placeholder="请输入门店名称"></el-input>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="门店形象照:" prop="image">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :headers="myHeaders"
                      :show-file-list="false"
                      :on-success="handleShopPicSuccess"
                      :before-upload="beforeShopPicUpload">
                      <img v-if="shopImg" :src="shopImg" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="tip">支持jpg，png格式，建议像素800*800px以上，大小不超过1M</span>
                </el-form-item>
                <el-form-item  label='客服电话:' required >
                  <el-col :span="10">
                    <el-input v-model="shop.customerServicePhone" width="100px"  placeholder="请输入客服咨询电话"></el-input>
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <el-radio :label="asCategoryPhone" v-model="shop.customerServicePhone">与品牌客服电话一致</el-radio>
                  </el-col>
                </el-form-item>
                <!--地址 -->
                <el-form-item label="品牌地址:" prop="address">
                  <el-cascader
                    placeholder="请选择省市区"
                    :options="options"
                    @change="handleAddChange"
                    v-model="shop.address">
                  </el-cascader>
                </el-form-item>
                <el-form-item  prop="detail">
                    <el-input v-model="shop.addressDetail" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <!-- 地图 -->
                <el-form-item>
                  <v-map v-on:getMapValue='getMapValue' :address-detail="shop.addressDetail" ref="mapSet"></v-map>
                </el-form-item>
                <!-- end -->
                <el-form-item label="营业时间" required >
                  <el-popover
                    placement="bottom-start"
                    trigger="click"
                    v-model="visible">
                    <div class="weekday_popover">
                      <el-checkbox-group v-model="shop.businessDays" size="large">
                        <el-checkbox v-for="(value, key) in weekToChina" :key="key" :label="key" border>{{ value }}</el-checkbox>
                      </el-checkbox-group>
                      <el-button type="primary" @click="chooseWeekday">确定</el-button>
                    </div>
                    <el-input  v-model="businessDaysString" readonly="readonly" placeholder="请选择营业时间" slot="reference"></el-input>
                  </el-popover>
                </el-form-item>
                <el-form-item  label="">
                  <el-time-select
                    placeholder="起始时间"
                    v-model="shop.businessStartTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30'
                    }">
                  </el-time-select>
                  —
                  <el-time-select
                    placeholder="结束时间"
                    v-model="shop.businessEndTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                      minTime: shop.businessStartTime
                    }">
                  </el-time-select>
                </el-form-item>
                <el-form-item label="门店简介:">
                  <el-input v-model="shop.introduction" type="textarea" :rows="4" :maxlength="500" placeholder="请输入门店简介（不超过500字）"></el-input>
                </el-form-item>
                <el-form-item label="门店相册:">
                  <el-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    multiple
                    :headers="myHeaders"
                    :limit='5'
                    :on-success="handleAlbumSuccess"
                    :before-upload="beforeAlbumUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-exceed="albumExceed"
                    :on-remove="handleRemoveAlbum">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :closeOnClickModal="false" :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <p class="tip">支持jpg,png格式，大小不超过1M，最多上传5张</p>
                </el-form-item>
                <!--购买时长 -->
                <el-radio-group v-model="onTime">
                  <el-form-item label="占用时长:">
                      <el-radio label="免费试用">免费试用</el-radio>
                  </el-form-item>
                  <el-form-item label="">
                        <el-radio label="立即购买">立即购买</el-radio>
                        <el-select v-model="version" style="width:100px;margin-left:10px;">
                          <el-option label="旗舰版" value="旗舰版"></el-option>
                          <el-option label="普通版" value="普通版"></el-option>
                        </el-select>
                        <el-select v-model="year" style="width:100px;margin-left:10px;">
                          <el-option label="一年" value="一年"></el-option>
                          <el-option label="三年" value="三年"></el-option>
                        </el-select>
                        <span style="margin-left:10px;color:#e22c37;">¥300.00</span>
                        <p style="margin-left:100px;color:#409EFF;cursor:pointer;">比较版本与价格</p>
                  </el-form-item>
                </el-radio-group>
                <!-- 创建按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm('categoryForm', true)">确认提交</el-button>
                    <el-button @click="submitForm('categoryForm', false)">保存入库</el-button>
                    <el-button @click="toStepOne">上一步</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
import Header from '@/components/loginCommon/LoginHeader'
import GaoMap from '@/components/loginCommon/GaoMap'
import { setTimeout } from 'timers';
import * as api from '@/assets/js/interface'
import * as axios from "@/util/axios";
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
import { mapActions, mapState } from 'vuex'
export default {
  name:'GmChooseShop',
  components: {
    'v-header': Header,
    'v-map': GaoMap
  },
  data () {
    return {
      options:regionData,
      checkOption:[],
      header:{
        title:'创建门店',
        isphone: false
      },
      visible:false,
      dialogVisible: false,
      businessDaysString: '',
      dialogImageUrl: '',
      onTime: '免费试用',
      version: '旗舰版',
      year: '一年',
      shopImg: '', // 门店形象照
      shop:{
        name:'',
        area: '', // 地区
        city: '', // 城市
        province: '', // 省份
        introduction:'',
        businessDays:[],
        businessStartTime:'',
        businessEndTime:'',
        shopAlbum:[],
        image:'',
        address:[],
        addressDetail:'',
        occupyDuration: '',
        customerServicePhone:'',
        latitude: '',
        longitude: '',
        status: false // true为提交，false为保存入库
        // ver:'s',
        // year:'b'
      },
      weekToChina: {
        Mon: '周一',
        Tue: '周二',
        Wed: '周三',
        Thu: '周四',
        Fri: '周五',
        Sat: '周六',
        Sun: '周日'
      },
      rules:{
        name:[{required:true, message:'请输入门店名称',trigger:'blur'}],
        industry:[{required:true, message:'请选择所属行业',trigger:'blur'}],
        image:[{required:true, message:'请上传品牌图片',trigger:'blur'}],
        address:[{required:true, message:'请选择省市区',trigger:'blur'}],
        addressDetail:[{required:true, message:'请输入详细地址',trigger:'blur'}],
        // customerServicePhone:[{required:true, message:'请输入客服咨询电话',trigger:'blur'}],
        // businessDays:[{required:true, message:'请选择营业时间',trigger:'blur'}],
        // businessStartTime:[{required:true, message:'请选择起始营业时间',trigger:'blur'}],
        // businessEndTime:[{required:true, message:'请选择结束营业时间',trigger:'blur'}]
      },
      mapInfo:{},
      asCategoryPhone: '', // 与品牌电话一致
      deletePictureId: '' //删除图片的id
    }
  },
  mounted(){
    // 根据用户的店铺id去查找对应的客服电话
    axios.get(api.getCustomerServicePhone.URL+this.createBrandId).then(res => {
      this.getCustomerServicePhoneRes(res)
    })
  },
  computed: {
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL
    },
    createBrandId() {
      return this.$store.state.manage.createBrand.id
    },
    myHeaders() {
      return utils.getUploadHeader()
    }
  },
  watch: {
    'shop.shopAlbum'(val) {
      let addPic = document.getElementsByClassName('el-upload el-upload--picture-card')[0]
      // 如果图片相册达到5条自动隐藏加号
      if (val.length >= 5) {
        addPic.style.display = 'none'
      } else {
        addPic.style.display = 'inline-block'
      }
    },
    'shop.businessDays'(val) {
      let days = []
      for (let i = 0, len = val.length; i < len; i++) {
        days.push(this.weekToChina[val[i]])
      }
      this.businessDaysString = days.join('、')
    },
    myHeaders() {
      return utils.getUploadHeader()
    }

  },
  methods: {
    ...mapActions(['saveCurrentInfo']),
    // 根据用户的店铺id去查找对应的客服电话
    getCustomerServicePhoneRes(data) {
      this.asCategoryPhone = data.customerServicePhone
    },
    // 选择营业时间
    chooseWeekday() {
      this.visible = false
    },
    handleItemChange(data) {
      console.log(data)
    },
    // 根据地名代号分离出地址详情
    mapNumToAddress(data) {
      // 定义地址详情
      let address = []
      // 如果没有任何地址代号就直接返回
      if (!data.length) return
      // 开始查找第一级地址
      for(let i = 0, len1 = this.options.length; i < len1; i++) {
        let province = this.options[i]
        if (!!data[0] && province.value === data[0]) {
          // 已找到一级地址
          address.push({
            label: province.label,
            value: province.value
          })
          // 开始查找第二级地址
          if (!!data[1] && !!province.children) {
            for(let j = 0, len2 = province.children.length; j < len2; j++) {
              let city = province.children[j]
              if (city.value === data[1]) {
                // 已找到一级地址
                address.push({
                  label: city.label,
                  value: city.value
                })
                // 开始查找第三级地址
                if (!!data[2] && !!city.children) {
                  for(let k = 0, len3 = city.children.length; k < len3; k++) {
                    let area = city.children[k]
                    if (area.value === data[2]) {
                      // 已找到一级地址
                      address.push({
                        label: area.label,
                        value: area.value
                      })
                      break
                    }
                  }
                }
                break
              }
            }
          }
          break
        }
      }
    },
    handleAddChange(data) {
      // 根据地名代号分离出地址详情
      this.mapNumToAddress(data)
    },
    toStepOne(){
      this.$router.push('/create/brands')
    },
    // 退出登录
    loginOut(){
      this.$router.push('/login')
    },
    // handleChange(value){
    //   console.log(value);
    // },
    // 获取地图组件传值
    getMapValue(mapInfo){
        this.mapInfo = mapInfo
        // 赋值给category
        this.shop.latitude = this.mapInfo.lat
        this.shop.longitude = this.mapInfo.lng
        this.shop.addressDetail = this.mapInfo.detail
        this.shop.city = this.mapInfo.city
        this.shop.area = this.mapInfo.area
        this.shop.province = this.mapInfo.province
        // 根据省份、城市名、地区名筛选出对应的代号
        this.mapAddressToNum(this.shop.province, this.shop.city, this.shop.area)
    },
    // 根据省份、城市名、地区名筛选出对应的代号
    mapAddressToNum(province, city, area) {
      let options = this.options
      this.shop.address = []
      // 第一级：查找省份对应的代号
      for (let i = 0, len1 = options.length; i < len1; i++) {
        if (!!province && options[i].label === province) {
          // 已查找到
          this.shop.address.push(options[i].value)
          // 第二级：查找城市名对应的代号
          let _city = options[i].children
          if (!!city && !!_city) {
            for (let j = 0, len2 = _city.length; j < len2; j++) {
              if (_city[j].label === city) {
                // 已经找到
                this.shop.address.push(_city[j].value)
                // 第三级：查找地区名对应的代号
                let _area = _city[j].children
                if (!!area && !!_area) {
                  for (let k = 0, len3 = _area.length; k < len3; k++) {
                    if (_area[k].label === area) {
                      // 已经找到
                      this.shop.address.push(_area[k].value)
                      break
                    }
                  }
                }
                break
              }
            }
          }
          break
        }
      }
    },
    // 调用地图组件中的 设置当前行政区
    setMapCity(cityValue){
      this.$refs.mapSet.gotoCity(cityValue)
    },
    // 处理创建门店信息
    createShop(res) {
      if (res.success) {
        // 保存当前的品牌id
        this.saveCurrentInfo({
          brandId: this.createBrandId
        })
        // 是否提交，提交就跳转
        if (this.shop.status) {
          this.$router.push('/center/brands')
        }
        // 提示
        utils.showTip(this, {msg: this.shop.status ? '创建门店成功' : '保存成功', type: 'success'})
      } else {
        // 提示
        utils.showTip(this, {msg: this.shop.status ? '创建门店失败' : '保存失败', type: 'error'})
      }

    },
    // 检测用户信息
    checkBandInfo(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        // 如果填了客服电话，要检测客服电话是否合格
        if (arr[i] === 'customerServicePhone' && !utils.checkSerPhone(this.shop.customerServicePhone)) {
          this.message = "客服电话有误，请重填"
          return false
        } else if (arr[i] === 'businessDays' && !this.shop[arr[i]].length) {
          this.message = "营业时间有误，请检查"
          return false
        } else if (arr[i] === 'businessStartTime' && !this.shop[arr[i]].length) {
          this.message = "营业时间有误，请检查"
          return false
        } else if (arr[i] === 'businessEndTime' && !this.shop[arr[i]].length) {
          this.message = "营业时间有误，请检查"
          return false
        }
      }
      return true
    },
    // 提交表单验证
    submitForm(formName, status) {
      let params = {
        name: this.shop.name, // 门店名称
        image: this.shop.image, // 门店形象照
        area: this.shop.area, // 地区
        city: this.shop.city, // 城市
        brandId: this.createBrandId,
        province: this.shop.province, // 省份
        introduction: this.shop.introduction, // 门店简介
        businessDays: this.shop.businessDays, // 门店营业时间
        businessStartTime: this.shop.businessStartTime, // 门店营业起始时间
        businessEndTime: this.shop.businessEndTime, // 门店营业结束时间
        shopAlbum: this.shop.shopAlbum, // 门店相册列表
        address: this.shop.address, // 品牌地址
        addressDetail: this.shop.addressDetail, // 品牌详细地址
        occupyDuration: this.shop.occupyDuration, // 占用时长
        customerServicePhone: this.shop.customerServicePhone, // 客服电话
        latitude: this.shop.latitude,
        longitude: this.shop.longitude,
        status: status // true为提交，false为保存入库
        // ver:'s',
        // year:'b'
      }
      this.shop.status = status
      // 拼接占用时长字符串
      this.shop.occupyDuration = this.onTime === '免费试用' ? this.onTime : (this.onTime + this.version + this.year)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 手动检测客服电话和营业时间
          if (this.checkBandInfo(['customerServicePhone', 'businessDays', 'businessEndTime', 'businessStartTime'])) {
            // 提交用户信息
            axios.post(api.createShop.URL, params).then(res => {
              this.createShop(res)
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
    // 门店形象照
    handleShopPicSuccess(res, file) {
      console.log(1)
      this.shopImg = datas.imgUrl.URL + file.response.fileKey
      this.shop.image = file.response.fileKey
    },
    // 删除门店形象照
    handleShopPicRemove(res) {
      let fileKey = res.response.fileKey
      this.shop.image = ''
      // this.deletePictureId = res.response.fileKey
      // axios.get(api.deletePicture.URL + this.deletePictureId).then(res => {
      //   this.deletePictureRes(res)
      // })
    },
    // deletePictureRes(res) {
    //   if (res.success) {

    //     // 提示
    //     utils.showTip(this, {msg: '删除图片成功', type: 'success'})
    //   } else {
    //     // 提示
    //     utils.showTip(this, {msg: '删除图片失败', type: 'error'})
    //   }
    // },
    // 门店形象照上传之前
    beforeShopPicUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 < 1024;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1M!');
      }
      return isJPG && isLt2M;
    },
    // 文件超出限制
    albumExceed(files, fileList) {
      if ((files.length + fileList.length) > 5) {
        this.$message.error('最多上传5张');
      }
    },
    // 门店相册上传之前
    beforeAlbumUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 < 1024;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1M!');
      }
      return isJPG && isLt2M;
    },
    // 成功上传门店
    handleAlbumSuccess(res, file) {
      this.shop.shopAlbum.push(file.response.fileKey)
    },
    // 删除门店
    handleRemoveAlbum(res) {
      let fileKey = res.response.fileKey
      this.shop.shopAlbum.forEach((item, index) => {
        let reg = new RegExp(fileKey)
        if(reg.test(item)) {
          // 开始删除该元素
          this.shop.shopAlbum.splice(index, 1)
        }
      })
      // this.deletePictureId = res.response.fileKey
      // axios.get(api.deletePicture.URL + this.deletePictureId).then(res => {
      //   this.deletePictureRes(res)
      // })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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

.weekday_popover{
  max-width:400px;
  margin:20px;
  .el-checkbox{
    // margin-bottom:10px;
    margin:0 10px 10px 0;
  }
  .el-checkbox.is-bordered + .el-checkbox.is-bordered{
    margin-left:0;
  }
  .el-checkbox.is-bordered .el-checkbox__inner{
    display:none;
  }
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
         width: 60%
       }
     }

    }
</style>



