<template >
  <div class="create-page">
    <div class="header-center">
      <center-header
        :title="operateEnter.clickEnter === 'edit' ? '编辑品牌' : '创建品牌'"
        :backing="'返回'"
        :isSelfSite="true"
      ></center-header>
    </div>
    <div class="body-center">
      <div class="body-container media scrollbar">
        <div class="form_area">
          <el-form :model="myForm" :rules="rules" ref="myForm" label-width="1.53rem">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input
                v-model="myForm.brandName"
                maxlength="30"
                placeholder="请输入品牌名称，不超过30个字符"
                style="width:420px"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
              <el-row>
                <el-col :span="4">
                  <el-select
                    v-model="myForm.industry"
                    placeholder="请选择所属行业"
                    :disabled="operateEnter.clickEnter === 'edit'"
                  >
                    <el-option
                      v-for="(item, index) in industryList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <span class="input-tip grey">一旦创建，不可修改</span>
              </el-row>
            </el-form-item>
            <!-- 后续需求所有品牌均可创建，保留字段代码逻辑 -->
            <el-form-item label="供货商店" v-if="false">
              <el-checkbox v-model="myForm.hasSupplierStore" @change="handleHas" :checked="myForm.hasSupplierStore" :disabled="true" >勾选代表包含</el-checkbox>
            </el-form-item>
            <el-form-item label="选择版本" prop="version">
              <el-row>
                <el-col :span="4">
                  <!-- 版本切换暂时不能使用 -->
                  <!-- :disabled="operateEnter.clickEnter === 'edit'" -->
                  <el-select 
                    v-model="myForm.version" 
                    :disabled="$route.path === '/brand-inner/edit/brands'"
                    placeholder="请选择版本"
                  >
                    <el-option
                      v-for="(item, index) in versionList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <!-- 该功能暂时没有 -->
                <span class="input-tip blue" @click="toSite">比较版本与价格</span>
              </el-row>
            </el-form-item>
            <el-form-item label="品牌城市" prop="myAddress">
              <province-city-select @change="getAddress" :myAddress="myForm.myAddress"></province-city-select>
            </el-form-item>
            <el-form-item label="品牌口号">
              <el-input
                v-model="myForm.brandSlogan"
                maxlength="30"
                placeholder="请输入品牌宣传口号，不超过30个字符"
                style="width:420px "
              ></el-input>
            </el-form-item>
            <el-form-item label="品牌标志" prop="brandLogo">
              <g-upload-spic @change="uploadPic" :photo="myForm.brandLogo" :size="2"></g-upload-spic>
            </el-form-item>
            <el-form-item label="客服电话" prop="phone">
              <div class="tip-parent-box">
                <el-input v-model="myForm.phone" placeholder="请填写品牌客服电话" style="width:200px"></el-input>
                <g-tip :position="'right'"></g-tip>
              </div>
            </el-form-item>
            <el-form-item label="品牌简介" prop="intro">
              <input-width-count
                placeholder="请填写品牌简介"
                style="max-width:820px;"
                :autosize="{ minRows: 6, maxRows: 100}"
                v-model="myForm.intro"
                :length="500"
              ></input-width-count>
            </el-form-item>
            <el-form-item>
              <div class="operate-item">
                <!-- <el-button
                  :name="'确认保存'"
                  :size="'large'"
                  :type="'blue1'"
                  :mark="'confirm'"
                  @click="submit"
                  class="confirm-save"
                  :loading="confirmLoading"
                >确认保存</el-button> -->
                <el-button
                  class="normal_blue_btn"
                  @click="submit"
                  :loading="confirmLoading"
                >确认保存</el-button>
                <!-- <el-button
                  :name="'取消'"
                  :size="'large'"
                  :type="'black'"
                  class='confirm-cenel'
                  @click='cencel()'
                >取消</el-button> -->
                <el-button
                  class='normal_light_gray_btn confirm-cenel'
                  @click='cencel()'
                >取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <operate-dialog
      :showDialog="showDialog"
      :title="operateEnter.clickEnter === 'edit' ? '恭喜，品牌编辑成功！' : '恭喜，品牌创建成功！'"
      :name="''"
      :firstBtn="'创建门店'"
      :secondBtn="'返回'"
      @close="todo"
    ></operate-dialog>
    <!-- 商场版创建楼层对话框 -->
    <g-del-model
      :delTagDialogVisible="floorDialogVisible"
      @close="floorClose"
      @confirm="confirmFloor"
      :title="'请前往品牌总部-店铺管理设置楼层信息'"
      :content="'设置楼层信息后，商场版品牌才可以创建门店！'"
      :icon="'icon_popup_plaint'"
      :iconColor="'orange'"
    ></g-del-model>
  </div>
</template>
<script>
import CenterHeader from "@/components/common/CenterHeader";
import ProvinceCitySelect from "@/components/common/ProvinceCitySelect";
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';
import * as utils from "@/assets/js/utils";
import { reg } from "@/assets/js/RegExp";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    let addressValidator = (rule, value, callback) => {
      console.log(value, value.province, value.city);
      if (value.province && value.city) {
        callback();
        return;
      }
      callback(new Error("请选择品牌城市"));
    };
    let phoneValidator = (rule,value,callback)=>{
      if(reg.tel.test(value)){
        callback()
      }
      else{
        callback(new Error("请按悬浮窗提示格式输入正确的号码"))
      }
    }
    return {
      myForm: {
        brandName: "", // 品牌名称
        industry: null, // 所属行业
        version: 2, // 选择版本
        brandSlogan: "", // 品牌口号
        brandLogo: "", // 品牌logo
        phone: "", // 客服电话
        intro: "", // 品牌简介
        myAddress: {},
        hasSupplierStore:true // 是否包含供货商店
      },
      showDialog: false, // 是否显示弹窗
      industryList: [], // 行业列表
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
        brandName: [
          { required: true, message: "请输入主体品牌名称", trigger: "blur" },
          { required: true, message: "请输入主体品牌名称", trigger: "change" }
        ],
        industry: [
          { required: true, message: "请选择所属行业", trigger: "blur" },
          { required: true, message: "请选择所属行业", trigger: "change" }
        ],
        version: [
          { required: true, message: "请选择版本", trigger: "blur" },
          { required: true, message: "请选择版本", trigger: "change" }
        ],
        phone: [
          { required: true, validator:phoneValidator, trigger: "blur" },
          { required: true, validator:phoneValidator, trigger: "change" }
        ],
        intro: [
          { required: true, message: "请填写品牌简介", trigger: "blur" },
          { required: true, message: "请填写品牌简介", trigger: "change" }
        ],
        brandLogo: [
          { required: true, message: "请上传品牌Logo", trigger: "blur" },
          { required: true, message: "请上传品牌Logo", trigger: "change" }
        ],
        myAddress: [
          { required: true, validator: addressValidator, trigger: "change" }
        ]
      },
      confirmLoading: false,
      floorDialogVisible: false,
    };
  },
  computed: {
    operateEnter() {
      return this.$store.state.manage.operate;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  components: {
    "center-header": CenterHeader,
    "province-city-select": ProvinceCitySelect
  },
  mounted() {
    // 获取行业
    this.getIndustry();
  },
  methods: {
    handleHas () {
    },
    ...mapActions(["saveOperate", "saveCurrentInfo", "saveUserInfo"]),
    getIndustry() {
      // 如果是编辑进来的，则需要先获取当前品牌信息
      if (this.operateEnter.clickEnter === "edit") {
        // 获取行业列表
        axios.post(
          api.getBrandInfo.URL,
          {
            brandId: this.currentInfo.brandId
          }
        ).then(res => {
          this.getBrandInfoRes(res);
        })
      }
      // 获取行业列表
      axios.get(api.getIndustryList.URL).then(res => {
        this.getIndustryListRes(res);
      })
    },
    // 处理当前品牌信息
    getBrandInfoRes(res) {
      this.myForm = {
        brandName: res.brandName, // 品牌名称
        hasSupplierStore:res.hasSupplierStore,
        industry: res.industry, // 所属行业
        version: res.version || 2, // 选择版本
        brandSlogan: res.brandSlogan, // 品牌口号
        brandLogo: res.brandLogo, // 品牌logo
        phone: res.customerServicePhone, // 客服电话
        intro: res.brandIntroduction, // 品牌简介
        myAddress: {
          province:res.province,
          city:res.city
        }
      };
    },
    // 处理行业列表
    getIndustryListRes(data) {
      this.industryList = data.industryList;
    },
    // 处理上传的图片
    uploadPic(data) {
      this.myForm.brandLogo = data;
      this.$refs.myForm.validateField("brandLogo");
    },
    // 创建品牌请求数据处理
    createBrandRes(res) {
      this.confirmLoading = false;
      if (res.success) {
        // 如果是编辑进来的，直接提示编辑成功
        if (this.operateEnter.clickEnter === "edit") {
          // 提示
          utils.showTip(this, { msg: "编辑品牌成功", type: "success" });
          this.$router.push("/center/brands");
          return;
        }
        // 保存当前的brandId
        this.saveCurrentInfo({
          brandId: res.brandId
        });
        if(this.myForm.industry === 18) {
          this.floorDialogVisible = true
        } else {
          // 显示创建门店对话框
          this.showDialog = true
        }
        // 请求品牌列表接口，
        axios.get(api.getMyBrands.URL).then(res => {
          this.getMyBrandsRes(res);
        })
      } else {
        // 如果是编辑进来的，直接提示编辑成功
        if (this.operateEnter.clickEnter === "edit") {
          // 提示
          utils.showTip(this, { msg: "编辑品牌失败", type: "error" });
        } else {
          // 提示
          utils.showTip(this, { msg: "创建品牌失败", type: "error" });
        }
      }
    },
    // 商场版创建楼层对话框确认
    confirmFloor() {
      // 权限不足处理？
      // this.$router.push("/brand-inner/store/floor-info");
      this.floorDialogVisible = false
      this.$router.go(-1);
    },
    floorClose() {
      this.floorDialogVisible = false
      this.$router.go(-1);
    },
    getMyBrandsRes(res) {
      this.saveUserInfo({
        brandList: res.myBrandList
      })
    },
    // 提交表单
    submit() {
      // 先检测表单的必填信息是否完整
      this.$refs.myForm.validate(valid => {
        if (valid) {
          let myForm = this.myForm;
          let params = {
            brandId:
              this.operateEnter.clickEnter === "edit"
                ? this.currentInfo.brandId
                : null,
            brandIntroduction: myForm.intro,
            brandLogo: myForm.brandLogo,
            brandName: myForm.brandName,
            brandSlogan: myForm.brandSlogan,
            customerServicePhone: myForm.phone,
            hasSupplierStore: myForm.hasSupplierStore,
            imageBackground: myForm.brandLogo,
            industry: myForm.industry,
            version: myForm.version,
            province: myForm.myAddress.province,
            city: myForm.myAddress.city == '市辖区' ? myForm.myAddress.province : myForm.myAddress.city
          };
          this.confirmLoading = true;
          axios.post(api.createBrand.URL, params).then(res => {
            this.createBrandRes(res);
          })
          .catch(err => {
              this.confirmLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    cencel() {
      this.$router.go(-1);
    },
    todo(data) {
      // 如果没有点击创建门店，则跳到之前的路由中
      if (data.type === "close") {
        this.$router.go(-1);
      } else {
        // 当前状态为编辑
        this.saveOperate({
          clickEnter: "add"
        });
        this.$router.push("/brand-inner/create/shops");
      }
    },
    getAddress(data) {
      console.log(data);
      this.myForm.myAddress = data;
    },
    input(num){
      var len = num.match(/[-]/g)?num.match(/[-]/g).length + 10 :11
      this.myForm.phone = num.slice(0,len)
    },
    toSite (){
      window.open('https://www.geeme.cn/product/price?type=0')
    } 
  }
};
</script>
<style lang="scss" scoped>
.confirm-cenel{
  width: 100px;
}
#app .tip-parent-box {
  display: inline-block;
  position: relative;
  &:hover .g-tip{
    display: block;
    z-index: 100;
    background: #fff;
    transform: translate(105%, -10%);
  }
}
</style>

