<template lang="pug">
  .basicinfo-page
    g-del-model(
      :delTagDialogVisible="confirmDialogVisible",
      title="确认修改营业时间?"
      content="可预约时间将同步修改，由此可能造成部分预约单异常，请前往“预约列表-异常预约单”查看。"
      icon="icon_popup_plaint",
      iconColor="#FCB322",
      confirmButton="确定修改"
      @confirm="sendEditInfo()",
      @close="confirmDialogVisible=false"
    )
    el-dialog(
      :visible.sync="dialogVisible"
    )
      img(
        width="100%",
        :src="dialogImageUrl"
      )
    .body-center
      .body-container.media
        .form_area
          el-form(
            :model="myForm",
            :rules="rules",
            ref="myForm",
            label-width="1.53rem"
          )
            <el-row :gutter="12">
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                <el-form-item label="品牌名称" prop="brandId" name='brandId'>
                  <el-select :popper-append-to-body="false" disabled v-model="myForm.brandId" placeholder="请选择品牌" style="width:200px">
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            el-form-item.shop-name_input(
              label="门店名称",
              prop="shopName"
            )
              el-row
                el-col(
                  :span="12"
                )
                  el-input.input_shop(
                    v-model="myForm.shopName",
                    placeholder="请输入门店名称"
                    :maxlength="30",
                    disabled
                  )
                  g-tip(
                    :list="list",
                    :position="'right'"
                  )
            el-form-item.shop-name_input(
              label="门店性质",
              prop="type"
            )
              el-row
                el-col(
                  :span="12"
                )
                  el-radio-group(
                    v-model="myForm.type"
                  )
                    el-radio(
                      v-for="(item,index) in [{label:'DIRECT',name:'直营'},{label:'JOIN',name:'加盟'}]",
                      :label="item.label",
                      disabled
                      :key="index"
                    ) {{item.name}}
            el-form-item.shop-name_input(
              label="门店形象",
              prop="image"
            )
              g-upload-spic(
                @change="uploadPic",
                :photo="myForm.image",
                :width="'160px'",
                :height="'80px'",
                :size="5"
              )
            el-form-item.shop-name_input(
              label="客服电话",
              prop="phone"
            )
              el-row
                el-col(
                  :span="12"
                )
                  el-input(
                    v-model="myForm.phone",
                    placeholder="请输入客服咨询电话",
                    @input="input",
                    :min="0"
                    disabled
                  )
                el-col(
                  :offset="1",
                  :span="6"
                )
                  el-radio(
                    :label="myForm.brandPhone"
                    v-model="myForm.phone"
                    disabled
                  ) 与品牌客服电话一致
            <address-map :isdisabled='true' :parentDetails='parentDetails' :needPos="false" @getMapValue='getMapValue'></address-map>
            el-form-item(
              label="营业时间",
              required
            )
              el-popover(
                placement="bottom-start"
                trigger="click"
                v-model="visible"
              )
                .weekday_popover(
                  style="{maxWidth:400px, margin:20px}"
                )
                  el-checkbox-group(
                    v-model="myForm.businessDays",
                    size="large"
                  )
                    el-checkbox(
                      v-for="(value, key) in weekToChina",
                      :key="key",
                      :label="key",
                      border
                    ) {{ value }}
                  el-button(
                    type="primary",
                    @click="chooseWeekday"
                  ) 确定
                el-input(
                  style="width:460px",
                  v-model="businessDaysString",
                  readonly="readonly",
                  placeholder="请选择营业时间",
                  slot="reference"
                )
            el-form-item
              el-time-select(
                placeholder="起始时间",
                v-model="myForm.businessStartTime",
                :picker-options="{start: '00:00',step: '00:30',end: '23:30'}"
              )
              span &nbsp;—&nbsp;
              el-time-select(
                placeholder="结束时间",
                v-model="myForm.businessEndTime",
                :picker-options="{start: '00:00',step: '00:30',end: '23:30',minTime: myForm.businessStartTime}"
              )
            el-form-item(
              label="门店简介"
            )
              el-input(
                style="max-width:820px",
                v-model="myForm.introduction",
                type="textarea",
                :rows="4",
                :maxlength="500",
                placeholder="请输入门店简介（不超过500字）"
              )
            el-form-item(
              label="门店相册"
            )
              el-upload(
                :action="uploadUrl"
                :headers="myHeaders"
                list-type="picture-card"
                multiple
                :class='{hideUpload:myForm.photoList.length>=8}'
                :on-exceed="lunboExceed"
                :on-success="handleLunBoSuccess"
                :on-preview="handlePictureCardPreview",
                :before-upload="beforeLunBoUpload"
                :on-remove="handleLunBoRemove"
                :limit="8"
                :file-list="shopAlbum"
              )
                i(class="el-icon-plus")
            el-form-item(
              label="购买时长"
              v-if="inCreate"
            )
              el-row
                el-radio(
                  v-model="occupy",
                  label="免费试用"
                )
              el-row(
                :gutter="20"
              )
                el-col(
                  :span="2"
                )
                  el-radio(
                    v-model="occupy",
                    label="立即购买"
                  )
                el-col(
                  style="margin: 0 0 0 2px;"
                  :span="4"
                )
                  el-select(  
                    v-model="myForm.version",
                    :popper-append-to-body="false"
                  )
                    el-option(
                      v-for="item in versionList",
                      :key="item.id",
                      :value="item.id",
                      :label="item.name"
                    )
                  p.occupy-tip 比较版本与价格
                el-col(
                  :span="4"
                )
                  el-select(
                    v-model="myForm.year",
                  )
                    el-option(
                      v-for="item in yearList",
                      :key="item.id",
                      :value="item.id",
                      :label="item.name"
                    )
            el-form-item(
              label="",
              required
              )
                el-row
                  el-col(
                    :span="2"
                  )
                    g-btn(
                      :name="'保存'",
                      :size="'large'",
                      :type="'blue1'",
                      :mark="'confirm'",
                      @click="operate"
                      v-show="checkHasBtnPermission('shop_store_save')"
                    )
</template>
<script>
import GaoMap from "@/components/loginCommon/GaoMap.vue";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    let phoneValidator = (rule, value, callback) => {
      let value_ = value.replace(/-/g, "");
      if (
        /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value_) ||
        /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          value
        )
      ) {
        callback();
      } else {
        callback(new Error("请输入正确的号码"));
      }
    };
    return {
      myForm: {
        brandId: null, // 品牌id
        shopName: "", // 门店名称
        image: "", // 门店形象
        phone: "", // 客服电话
        brandPhone: "", // 从后台获取的品牌电话
        address: [],
        latitude: null, // 经度
        longitude: null, // 纬度
        addressDetail: "", // 详细地址
        mapAddressDetail: "", // 地图的详细地址，包括省份、城市、地区、街道等
        city: "", // 城市名
        area: "", // 地区名
        province: "", // 省份名
        businessDays: [], // 营业时间周几
        businessStartTime: "", // 营业时间的起始时间
        businessEndTime: "", // 营业时间的起始时间
        introduction: "", // 门店简介
        photoList: [], // 门店相册列表
        version: "", // 版本
        year: null, // 购买年份
        stateVal: 1, // 上线值
        occupyDuration: "", // 占用时长
        type: "DIRECT",
        onlineRecommendation: true,
      },
      versionList: [
        {
          name: "旗舰版",
          id: 1
        },
        {
          name: "标准版",
          id: 2
        },
        {
          name: "专业版",
          id: 3
        }
      ], // 版本列表
      yearList: [
        {
          name: "一年",
          id: 1
        },
        {
          name: "两年",
          id: 2
        },
        {
          name: "三年",
          id: 3
        }
      ], // 版本列表
      occupy: "免费试用", // 占用时长
      businessDaysString: "", // 营业时间字符串列表
      visible: false, // 营业时间下拉框是否显示
      myAddress: {},
      weekToChina: {
        MONDAY: "周一",
        TUESDAY: "周二",
        WEDNESDAY: "周三",
        THURSDAY: "周四",
        FRIDAY: "周五",
        SATURDAY: "周六",
        SUNDAY: "周日"
      },
      list: [
        {
          // 提示
          name: "无须输入品牌名称"
        },
        {
          name: "无须输入城市名称"
        },
        {
          name: "规范格式：×××店，最好不超过30个汉字"
        }
      ],
      versionList: [
        {
          id: 1,
          name: "标准版"
        },
        {
          id: 2,
          name: "专业版"
        },
        {
          id: 3,
          name: "旗舰版"
        }
      ], // 版本列表
      rules: {
        shopName: [
          { required: true, message: "请输入门店名称", trigger: "blur" },
          { required: true, message: "请输入门店名称", trigger: "change" }
        ],
        image: [
          { required: true, message: "请上传门店形象照", trigger: "blur" },
          { required: true, message: "请上传门店形象照", trigger: "change" }
        ],
        version: [{ required: true, message: "请选择版本", trigger: "blur" }],
        intro: [{ required: true, message: "请填写品牌简介", trigger: "blur" }],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        type: [{ required: true, message: "", trigger: "change" }],
        phone: [
          { required: true, validator: phoneValidator, trigger: "change" },
          { required: true, validator: phoneValidator, trigger: "blur" }
        ]
      },
      confirmDialogVisible: false,
      oriBusinessDays: [],
      oriBusinessStartTime: "",
      oriBusinessEndTime: "",
      defaultLat: "",
      defaultLng: "",
      shopAlbum: [],
      parentDetails: {},
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  watch: {
    "myForm.businessDays"(val) {
      let days = [];
      for (let i = 0, len = val.length; i < len; i++) {
        days.push(this.weekToChina[val[i]]);
      }
      days.sort(this.weekSort);
      this.businessDaysString = days.join("、");
    },
    "myForm.addressDetail"(val) {
      console.log(val);
      this.myForm.mapAddressDetail = this.myForm.address.join("") + val;
    }
  },
  created() {
    axios.get(api.getMyBrands.URL).then(res => {
      this.getMyBrandsRes(res);
    });
  },

  computed: {
    showStatus() {
      let arr = [
        { name: "上线", value: 1 },
        { name: "保存入库", value: 2 },
        { name: "下线", value: 0 }
      ];
      if (this.inCreate) {
        return arr.slice(0, -1);
      } else {
        return arr;
      }
    },
    inCreate() {
      return this.$route.path.search("create") >= 0;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    brandList() {
      return this.$store.state.manage.userInfo.brandList;
    },
    ifTimeUnchanged() {
      let arr = this.oriBusinessDays.filter(
        i => this.myForm.businessDays.indexOf(i) < 0
      );
      let flag =
        arr.length == 0 &&
        this.oriBusinessDays.length == this.myForm.businessDays.length;
      return (
        flag &&
        this.oriBusinessStartTime == this.myForm.businessStartTime &&
        this.oriBusinessEndTime == this.myForm.businessEndTime
      );
    },
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    }
  },
  components: {
    "v-map": GaoMap
  },
  mounted() {
    axios.get(api.getShopInfoById.URL + this.currentInfo.shopId).then(res => {
      this.getShopInfoByIdRes(res);
    });
    this.myForm.brandId = this.currentInfo.brandId;
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "saveUserBrand"]),
    getMyBrandsRes(res) {
      this.saveUserBrand(res.myBrandList);
    },
    getShopInfoByIdRes(res) {
      let myForm = res;
      this.myForm.address = myForm.address;
      this.myForm.addressDetail = myForm.addressDetail;
      this.myForm.area = myForm.area;
      this.myForm.businessDays = myForm.businessDays;
      this.oriBusinessDays = JSON.parse(JSON.stringify(myForm.businessDays));
      this.oriBusinessEndTime = this.myForm.businessEndTime =
        myForm.businessEndTime;
      this.oriBusinessStartTime = this.myForm.businessStartTime =
        myForm.businessStartTime;
      this.myForm.city = myForm.city;
      this.myForm.phone = myForm.customerServicePhone;
      this.myForm.image = myForm.image;
      this.myForm.introduction = myForm.introduction;
      this.defaultLat = this.myForm.latitude = myForm.latitude;
      this.defaultLng = this.myForm.longitude = myForm.longitude;
      this.myForm.shopName = myForm.name;
      this.myForm.occupyDuration = "免费试用"; // 占用时长未做，传固定值
      this.myForm.province = myForm.province;
      this.myForm.photoList = myForm.shopAlbum;
      this.shopAlbum = this.formatPhotoList(this.myForm.photoList);
      this.myForm.stateVal = myForm.status;
      this.myForm.type = myForm.type;
      this.parentDetails = {
        address: [this.myForm.province, this.myForm.city, this.myForm.area],
        addressDetail: this.myForm.addressDetail
      };
      this.myAddress = {
        province: this.myForm.province,
        city: this.myForm.city,
        area: this.myForm.area
      };
    },
    todo(data) {
      console.log(data);
    },
    uploadPic(data) {
      this.myForm.image = data;
      this.$refs.myForm.validateField("image");
    },
    // 获取地图组件传值
    getMapValue(mapInfo) {

      this.myForm.province = mapInfo.province;

      this.myForm.city = mapInfo.city;
      this.myForm.area = mapInfo.area;
      this.myForm.latitude = mapInfo.lat;
      this.myForm.longitude = mapInfo.lng;
      this.myForm.address = [mapInfo.province, mapInfo.city, mapInfo.area];
      this.myForm.addressDetail = mapInfo.address_Detail;
      this.isSure = mapInfo.isSure;
    },
    // 选择营业时间
    chooseWeekday() {
      this.visible = false;
    },
    // 获取门店相册列表
    getPhotoList(data) {
      this.myForm.photoList = data;
    },
    // 检测用户信息
    checkBandInfo(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        // 如果填了客服电话，要检测客服电话是否合格
        if (arr[i] === "phone" && !utils.checkSerPhone(this.myForm[arr[i]])) {
          this.message = "客服电话有误，请重填";
          return false;
        } else if (arr[i] === "businessDays" && !this.myForm[arr[i]].length) {
          this.message = "营业时间有误，请检查";
          return false;
        } else if (
          arr[i] === "businessStartTime" &&
          !this.myForm[arr[i]].length
        ) {
          this.message = "营业时间有误，请检查";
          return false;
        } else if (
          arr[i] === "businessEndTime" &&
          !this.myForm[arr[i]].length
        ) {
          this.message = "营业时间有误，请检查";
          return false;
        }
      }
      return true;
    },
    // 准备回传参数
    prepareParams() {
      let myForm = this.myForm;
      return {
        address: myForm.address,
        addressDetail: myForm.addressDetail,
        area: myForm.area,
        brandId: myForm.brandId,
        // brandId: this.currentInfo.brandId,
        id: this.currentInfo.shopId,
        businessDays: myForm.businessDays,
        businessEndTime: myForm.businessEndTime,
        businessStartTime: myForm.businessStartTime,
        city: myForm.city,
        customerServicePhone: myForm.phone,
        image: myForm.image,
        introduction: myForm.introduction,
        // 如果myForm中经纬度数据为空，则以默认值替代
        latitude: myForm.latitude == "" ? this.defaultLat : myForm.latitude,
        longitude: myForm.longitude == "" ? this.defaultLng : myForm.longitude,
        name: myForm.shopName,
        occupyDuration: "免费试用", // 占用时长未做，传固定值
        // occupyDuration: this.occupy === '免费试用' ? this.occupy : (this.occupy + this.myForm.version + this.myForm.year),
        province: myForm.province,
        shopAlbum: myForm.photoList,
        status: myForm.stateVal,
        type: myForm.type
      };
    },
    // 提交
    submit() {
      let params = this.prepareParams();
      this.$refs.myForm.validate(valid => {
        if (valid) {
          // 手动检测客服电话和营业时间
          if (
            this.checkBandInfo([
              "phone",
              "businessDays",
              "businessEndTime",
              "businessStartTime"
            ])
          ) {
            if (!this.ifTimeUnchanged) {
              /* this.$confirm('营业时间如有修改，预约设置中的可预约时间将同步修改，由此造成的部分未完成预约异常请注意查看系统消息提醒并及时处理, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 提交用户信息
                axios.post(api.createShop.URL, params).then(res => {
                  this.createShop(res)
                })
              }) */

              this.confirmDialogVisible = true;
            } else {
              axios.post(api.createShop.URL, params).then(res => {
                this.createShop(res);
              });
            }
          } else {
            // 提示
            utils.showTip(this, { msg: this.message, type: "error" });
          }
        } else {
          console.log("error submit!!");
          utils.showTip(this, { msg: "请核查信息是否输入完整", type: "error" });
          return false;
        }
      });
    },
    sendEditInfo() {
      let params = this.prepareParams();
      axios.post(api.createShop.URL, params).then(res => {
        this.createShop(res);
      });
    },
    // 处理创建门店信息
    createShop(res) {
      if (res.success) {
        // 提示
        this.confirmDialogVisible = false;
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        // 提示
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    operate(data) {
      this.submit();
    },
    input(num) {
      var len = num.match(/[-]/g) ? num.match(/[-]/g).length + 10 : 11;
      this.myForm.phone = num.slice(0, len);
    },
    /* 周日期排序依据 */
    weekSort(first, second) {
      const week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      if (week.indexOf(first) < week.indexOf(second)) {
        return -1;
      } else if (week.indexOf(first) < week.indexOf(second)) {
        return 1;
      } else {
        return 0;
      }
    },
    /* 超出8张的提示  可能不会被用到*/
    lunboExceed(files, fileList) {
      if (files.length + fileList.length > 5) {
        this.$message.error("最多上传8张");
      }
    },
    handleLunBoSuccess(res, file, fileList) {
      let images = [];
      fileList.forEach((item, index) => {
        let fileKey = item.response
          ? item.response.fileKey
          : item.url.split("/").pop();
        images.push(fileKey);
      });
      this.myForm.photoList = images;
    },
    toggleUpload() {},
    /* 上传前检查 */
    beforeLunBoUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5M!");
      }
      return isJPG && isLt2M;
    },
    /* 删除相册 */
    handleLunBoRemove(file) {
      let arr = file.url.split("/");
      let fileKey = arr[arr.length - 1];
      this.myForm.photoList = this.myForm.photoList.filter(i => i !== fileKey);
    },
    formatPhotoList(photoList) {
      let arr = [];
      photoList.forEach(item => {
        arr.push({
          name: `${Math.random()}`,
          url: utils.formatPicImg(item)
        });
      });
      return arr;
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.basic-btn {
  margin-left: 50px;
}
.shop-name_input {
  width: 572px;
}
.basicinfo-page {
  padding: 20px 0;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.hideUpload .el-upload--picture-card {
    display: none;
}
</style>
