<template>
  <div class="gm_staff_add">
    <!-- 顶部header-->
    <seed-header :title="'新增员工'" :hasTabs="false"></seed-header>
    <!-- container -->
    <div class="full_container">
      <div class="form_area">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="145px"
          class="ruleForm"
        >
          <div class="con-form-wrap">
            <h5>个人信息</h5>
            <div class="con-form">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" maxlength="10"></el-input>
              </el-form-item>
              <div style="display:flex">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="ruleForm.nickName" placeholder="请输入员工昵称" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" label-width="190px">
                  <el-select
                    :popper-append-to-body="false"
                    v-model="ruleForm.sex"
                    placeholder="请选择性别"
                  >
                    <el-option label="保密" value="保密"></el-option>
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="con-form-wrap">
            <h5>职务权限</h5>
            <div class="con-form">
              <el-form-item label="入职时间" prop="time">
                <el-date-picker
                  type="date"
                  placeholder="请选择入职时间"
                  v-model="ruleForm.time"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                  popper-class="change-popper"
                  :append-to-body="false"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <div style="display:flex">
                <el-form-item label="职务身份" prop="character">
                  <el-select
                    :popper-append-to-body="false"
                    v-model="ruleForm.character"
                    placeholder="请选择职务身份"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in ruleForm.characterList"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="授予角色" prop="selectedAuthorities">
                <el-select
                  v-model="ruleForm.selectedAuthorities"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  multiple
                >
                  <el-option
                    v-for="(item) in availableAuthorities"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-radio-group v-model="ruleForm.workStatus">
                  <el-radio
                    v-for="(item,index) in [{label:'启用',status:true},{label:'禁用',status:false}]"
                    :key="index"
                    :label="item.status"
                  >{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="con-form-wrap">
            <h5>账号信息</h5>
            <div class="con-form">
              <el-form-item label="登录手机" prop="phone">
                <el-input
                  type="number"
                  @input="ruleForm.phone = ruleForm.phone.slice(0,11)"
                  v-model="ruleForm.phone"
                  placeholder="请输入登录手机号"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="con-form-wrap">
            <h5>其他</h5>
            <div class="con-form upload">
              <el-form-item label="展示头像:" prop="photo" class="upload-img">
                <el-upload
                  style="margin-left:0"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="myHeaders"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar">
                  <i v-else class="icon iconfont icon-icon_num_add"></i>
                </el-upload>
                <p class="tip">
                  支持jpg，png格式，大小不超过2M；
                  <br>点击图片可重新上传
                </p>
              </el-form-item>
              <div style="display:flex">
                <el-form-item label="身份证号码" prop="idCard">
                  <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="生日" label-width="190px">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="ruleForm.birth"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"
                    :append-to-body="false"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div style="display:flex">
                <el-form-item label="婚姻状况">
                  <el-select
                    :popper-append-to-body="false"
                    v-model="ruleForm.marry"
                    placeholder="请选择婚姻状况"
                  >
                    <el-option label="未婚" value="未婚"></el-option>
                    <el-option label="已婚" value="已婚"></el-option>
                    <el-option label="离异" value="离异"></el-option>
                  </el-select>
                </el-form-item>
                <s-address
                  style="margin-left:45px;"
                  :label="'祖籍籍贯'"
                  @changeCityData="changeCityData"
                  :myAddress="ruleForm.myAddress"
                  :changeOnSelect="true"
                ></s-address>
              </div>
              <div style="display:flex">
                <el-form-item label="血型">
                  <el-select
                    v-model="ruleForm.blood"
                    :popper-append-to-body="false"
                    placeholder="请选择血型"
                  >
                    <el-option
                      :label="item"
                      :value="item"
                      v-for="(item, index) in ruleForm.bloodList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学历" label-width="190px">
                  <el-select
                    v-model="ruleForm.edu"
                    :popper-append-to-body="false"
                    placeholder="请选择学历"
                  >
                    <el-option
                      :label="item"
                      :value="item"
                      v-for="(item, index) in ruleForm.eduList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="备注">
                <input-with-count
                  style="max-width:590px"
                  :autosize="{ minRows: 4, maxRows: 100}"
                  v-model="ruleForm.desc"
                ></input-with-count>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-button
              class="normal_blue_btn bottom-button"
              @click="submitForm('ruleForm')"
              :loading="btnLoading"
              :disabled="!checkHasBtnPermission(`${currentEntry}_staff_staffRecord_base_save`)"
            >保存</el-button>
            <el-button class="bottom-button normal_light_gray_btn" @click="resetForm('ruleForm')">取消</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/upload/upload.scss";
import { regionData } from "element-china-area-data";
import SeedHeader from "@/components/common/SeedHeader";
import InputWithCount from "@/components/common/InputWithCount";
import ChooseServiceModel from "@/components/staff/ChooseServiceModel";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions, mapState } from "vuex";
import { reg, checkReg } from "@/assets/js/RegExp";
export default {
  name: "GmStaffAdd",
  components: {
    "seed-header": SeedHeader,
    "input-with-count": InputWithCount,
    "choose-service-model": ChooseServiceModel
  },
  data() {
    let validatorArr = message => {
      return (rule, value, callback) => {
        var arr = this.ruleForm.selectedAuthorities;
        if (arr.length === 0) {
          callback(new Error(message));
          return;
        }
        callback();
      };
    };
    let authorityValidator = validatorArr("请至少选择一种权限");
    let phoneValidator = (rule, value, callback) => {
      if (`${value}`.length !== 11 || !checkReg(reg["phone"], value)) {
        callback(new Error("请输入正确格式的手机号码"));
        return;
      }
      callback();
    };
    let phoneValidatorChange = (rule, value, callback) => {
      if (`${value}`.length === 11) {
        if (!checkReg(reg["phone"], value)) {
          callback(new Error("请输入正确格式的手机号码"));
        } else {
          callback();
        }
        return;
      }
      callback();
    };
    let validateidCard = (rule, value, callback) => {
      if (value) {
        if (checkReg(reg["idCard"], value)) {
          callback();
        } else {
          callback(new Error("请输入正确的身份证!"));
        }
      } else {
        callback();
      }
    };
    return {
      hasClass: true,
      chooseBasicServiceVisible: false,
      addRulesformRules: {
        simpleName: [
          {
            required: true,
            message: "请输入简称（不超过四个字）",
            trigger: "blur"
          },
          {
            required: true,
            message: "请输入简称（不超过四个字）",
            trigger: "change"
          }
        ]
      },
      ruleForm: {
        name: null, // 员工姓名
        staffId: null, // 从后台自动获取到的员工编号
        sex: "保密", // 性别
        phone: null, // 电话
        birth: null, // 生日
        character: null, // 职务身份
        characterList: [], // 职务身份列表
        eduList: ["小学", "中学", "高中", "大学", "硕士", "博士", "保密"], // 学历列表
        workStatus: true,
        nickName: null, // 昵称
        photo: null,
        avatarId: null, // 备注头像id
        idCard: null, // 身份证号码
        province: null, // 祖籍籍贯省份
        city: null, // 祖籍籍贯城市
        marry: null, // 是否已婚
        blood: null, // 血型
        bloodList: ["A", "B", "AB", "O", "保密"], // 血型列表
        edu: null, // 学历
        time: null, // 入职时间
        desc: null, // 备注
        selectedAuthorities: [],
        myAddress: []
      },
      rules: {
        name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
          { required: true, message: "请输入员工姓名", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请输入员工昵称", trigger: "blur" },
          { required: true, message: "请输入员工昵称", trigger: "change" }
        ],
        sex: [{ required: true, message: "请选择员工性别", trigger: "change" }],
        phone: [
          {
            required: true,
            validator: phoneValidatorChange,
            trigger: "change"
          },
          { required: true, validator: phoneValidator, trigger: "blur" }
        ],
        time: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
        character: [
          { required: true, message: "请选择职务身份", trigger: "change" }
        ],
        photo: [{ required: true, message: "请上传头像", trigger: "change" }],
        selectedAuthorities: [
          { required: true, validator: authorityValidator, trigger: "change" }
        ],
        photo: [
          { required: true, message: "请选择展示头像", trigger: "change" }
        ],
        idCard: [
          { required: false, validator: validateidCard, trigger: "change" }
        ],
      },
      availableAuthorities: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      btnLoading: false
    };
  },
  computed: {
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    // tagList() {
    //   let arr = []
    //   this.ruleForm.selectedAuthorities.forEach(
    //       select => {
    //         this.availableAuthorities.forEach(item => {
    //           item.id === select&&arr.push(item.name)
    //         })
    //       }
    //     )
    //   return arr
    // },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
    brandParams() {
      let ruleForm = this.ruleForm;
      return {
        userName: ruleForm.name, // 员工姓名
        brandId: this.currentInfo.brandId, // 品牌Id
        sex: ruleForm.sex, // 性别
        workStatus: ruleForm.workStatus, // 在职状态
        telephone: ruleForm.phone, // 电话
        entryDate: ruleForm.time, // 入职时间
        level: ruleForm.character, // 职务身份
        authorizations: ruleForm.selectedAuthorities, // 权限列表
        nickName: ruleForm.nickName, // 昵称
        headPortrait: ruleForm.avatarId, // 备注头像id == 展示头像
        idCardNo: ruleForm.idCard, // 身份证号码
        birthDay: this.ruleForm.birth, // 生日
        province: !!ruleForm.province ? ruleForm.province.label : null, // 祖籍籍贯省份
        city: !!ruleForm.city ? ruleForm.city.label : null, // 祖籍籍贯城市
        maritalStatus: ruleForm.marry, // 是否已婚
        blood: ruleForm.blood, // 血型
        education: ruleForm.edu, // 学历
        remark: ruleForm.desc, // 备注
        roleIdList: ruleForm.selectedAuthorities // 角色ID集合
      };
    }
  },
  mounted() {
    this.addInit();
    this.getRoleIdlist();
  },
  methods: {
    /**获取祖籍籍贯 */
    changeCityData(val, num) {
      this.ruleForm.myAddress = val;
    },
    addInit() {
      let params = {
        brandId: this.currentInfo.brandId,
        searchType: "BRAND"
      };
      axios.post(api.getBrandStaffLevels.URL, params).then(res => {
        this.getBrandStaffLevelListRes(res);
      });
      
    },
    /**获取总部的职务列表 */
    getBrandStaffLevelListRes(res) {
      this.ruleForm.characterList = res.staffLevelInfoList;
    },
    // formatRegionData(data, name) {
    //   if (!!data) {
    //     data.forEach(item => {
    //       this.ruleForm[name].push(item);
    //     });
    //   }
    // },
    // provinceChange(data) {
    //   this.ruleForm.city = "";
    //   this.ruleForm.cityList = [];
    //   if (
    //     !!data.children &&
    //     data.children[0] &&
    //     data.children[0].label === "市辖区"
    //   ) {
    //     this.formatRegionData(data.children[0].children, "cityList");
    //   } else {
    //     this.formatRegionData(data.children, "cityList");
    //   }
    // },
    back() {
      this.$router.go(-1);
    },
    submitData() {
      // 提交到后台
      axios.post(api.createBrandStaff.URL, this.brandParams).then(res => {
        this.createStaffRes(res);
      }).catch(() => {
        this.btnLoading = false;
      });
    },
    createStaffRes(res) {
      if (res.success) {
        // 路由跳转到员工列表中
        let path = {
          loading: "btnLoading", //loading名字
          time: 370, //时间
          isPath: true
        };
        this.deplay(path);
        // 提示
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        // 提示
        this.btnLoading = false;
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    checkFormInfo(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === "phone" && !utils.checkPhone(this.ruleForm[arr[i]])) {
          this.message = "手机号码有误，请重填";
          return false;
        }
      }
      return true;
    },
    submitForm(formName) {
      // 提交数据至后台
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 检测非法字符
          if (this.checkFormInfo(["phone"])) {
            this.btnLoading = true;
            this.submitData();
          } else {
            // 提示
            utils.showTip(this, { msg: this.message, type: "error" });
          }
        } else {
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.avatarId = file.response.fileKey;
      this.ruleForm.photo = datas.imgUrl.URL + file.response.fileKey;
      this.$refs.ruleForm.validateField("photo");
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2M!");
      }
      return isJPG && isLt2M;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.go(-1);
    },
    /**获取角色列表 */
    getRoleIdlist() {
      let queryRoleList = '/queryRoleList?roleType=head_quarters&brandId='+this.currentInfo.brandId
      axios.get(queryRoleList).then(res => {
        this.availableAuthorities = [...res.roleList];
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@mixin button_ {
  height: 30px;
  padding: 0;
  text-align: center;
}
@mixin size70 {
  width: 70px;
  height: 70px;
}
.gm_staff_add {
  .full_container {
    margin: auto;
    box-sizing: border-box;
    background: #fff;
    border-radius: 3px;
    width: 1440px;
    // margin: 20px;
    border-radius: 8px;
    .form_area {
      box-sizing: border-box;
      padding: 33px 40px;
      margin-top: 85px;
      .con-form-wrap {
        width: 100%;
        margin-bottom: 12px;
        h5 {
          font-size: 16px;
          line-height: 32px;
          color: hsl(0, 0%, 20%);
        }
        .con-form {
          border: 1px solid #f0f1f4;
          border-radius: 3px;
          width: 100%;
          box-sizing: border-box;
          padding-top: 20px;
          /deep/ .el-input__inner {
            width: 200px;
          }
          .select-service {
            width: 74px;
            color: #58c9f3;
            border-color: #58c9f3;
            @include button_;
          }
          .tags {
            margin-top: 5px;
            display: flex;
            .el-tags {
              width: 90%;
              margin-left: 10px;
            }
          }
          .add-rules-title {
            background: #f4f5f7;
          }
          @mixin form-item-line {
            width: 647px;
            display: flex;
            font-size: 14px;
            > div {
              box-sizing: border-box;
              padding-left: 13px;
              line-height: 40px;
              color: #333333;
            }
            .service-name {
              width: 24%;
            }
            .other {
              width: 19%;
              display: flex;
              justify-content: center;
            }
            .other.input {
              /deep/ .el-input__inner {
                width: 90px;
                height: 35px;
              }
            }
          }
          .el-form-item.add-rules-con {
            border-bottom: 1px solid rgb(212, 217, 219);
            box-sizing: border-box;
            padding: 5px 0;
            /deep/ .el-form-item__content {
              @include form-item-line;
            }
          }
          .add-rules-con {
            @include form-item-line;
          }
          /deep/ .simple-name.add-rules-con {
            /deep/ .el-form-item__error {
              color: #f56c6c !important;
              text-indent: 270px;
              transform: translateY(-15px);
            }
          }
        }
      }
    }
    .bottom-button {
      width: 100px;
    }
  }
}
</style>


