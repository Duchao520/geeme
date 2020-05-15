<template>
  <section class="content-wrap text-for-copy">
    <el-row>
      <el-col :span="6">
        <g-avatar
          :pic="myForm.headPortrait"
          @uploadPic="uploadPic"
          :remarkPic="myForm.image"
          :stext="'展示头像'"
        ></g-avatar>
      </el-col>
      <el-col :span="18">
        <el-form
          :model="myForm"
          :rules="rules"
          ref="myForm"
          label-width="160px"
          class="ruleForm"
        >
          <div class="box-modules">
            <div class="title">个人信息</div>
            <div class="content">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="姓名" prop="userName">
                    <el-input v-model="myForm.userName" placeholder="请输入员工姓名" maxlength="16"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="员工编号" prop="serialNo">
                    <el-input placeholder="请输入内容" disabled v-model="myForm.serialNo"></el-input>
                    <!-- <span>{{myForm.serialNo}}</span> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="myForm.nickName" placeholder="请输入昵称" maxlength="16"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别" prop="sex">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="myForm.sex"
                      placeholder="请选择性别"
                    >
                      <el-option label="保密" value="保密"></el-option>
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="box-modules">
            <div class="title">职务权限</div>
            <div class="content">
              <el-row>
                <el-form-item label="入职时间" prop="entryDate">
                  <el-date-picker
                    type="date"
                    placeholder="请选择入职时间"
                    :clearable="false"
                    :append-to-body="false"
                    v-model="myForm.entryDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="职务身份" prop="level">
                    <el-select v-model="myForm.level" placeholder="请选择职务身份" :popper-append-to-body="false">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="item in levelList"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="授予角色" prop="authorizations">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="myForm.authorizations"
                      multiple
                      placeholder="请选择授予权限"
                    >
                      <el-option
                        v-for="(item) in availableAuthorities"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="状态">
                    <el-radio-group v-model="myForm.workStatus">
                      <el-radio :label="true">启用</el-radio>
                      <el-radio v-if='!statusValue' :label="false">禁用</el-radio>
                      <el-tooltip
                        v-else
                        placement="top-start"
                        effect="dark"
                        content="该员工有未完成的预约，须将该预约更改或取消，才能禁用。">
                        <el-radio :label="false" :disabled="statusValue">禁用</el-radio>
                      </el-tooltip>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="box-modules">
            <div class="title">账号信息</div>
            <div class="content">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="登录手机号" prop="telephone">
                    <!-- <el-input maxlength="11" v-model="myForm.telephone" placeholder="请输入登录手机号"></el-input> -->
                    <span>{{myForm.telephone}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="box-modules">
            <div class="title">其他</div>
            <div class="content">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="身份证号码" prop="idCardNo">
                    <el-input v-model="myForm.idCardNo" placeholder="请输入身份证号码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="生日">
                    <el-date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="myForm.birthDay"
                      style="width: 120%;"
                      value-format="yyyy-MM-dd"
                      :append-to-body="false"
                      :picker-options="pickerOptions"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="婚姻状况">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="myForm.maritalStatus"
                      placeholder="请选择婚姻状况"
                    >
                      <el-option label="未婚" value="未婚"></el-option>
                      <el-option label="已婚" value="已婚"></el-option>
                      <el-option label="离异" value="离异"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <s-address
                    @changeCityData="changeCityData"
                    :label="'祖籍籍贯'"
                    :myAddress="myForm.myAddress"
                    :changeOnSelect="false"
                  ></s-address>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="血型">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="myForm.blood"
                      placeholder="请选择血型"
                    >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) in bloodList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学历">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="myForm.education"
                      placeholder="请选择学历"
                    >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) in eduList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-form-item label="备注" style="display:block;">
                    <input-with-count
                      placeholder="请输入备注(最多150字)"
                      :autosize="{ minRows: 5, maxRows: 100}"
                      v-model="myForm.remark"
                    ></input-with-count>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-form-item style="display:block;">
                    <el-button
                      v-show="checkHasBtnPermission(`${currentEntry}_staff_staffRecord_base_save`)"
                      @click="submitForm('myForm')"
                      class="normal_blue_btn"
                      :loading="btnLoading"
                    >保存修改</el-button>
                    <el-button @click="resetForm('myForm')" class='normal_light_gray_btn'>　取消　</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { regionData } from "element-china-area-data";
import InputWithCount from "@/components/common/InputWithCount";
import ChooseServiceModel from "@/components/staff/ChooseServiceModel";
import Bus from "@/util/bus";
import { mapState, mapActions } from "vuex";
import { reg, checkReg } from "@/assets/js/RegExp";
import * as axios from '@/util/axios'
export default {
  components: {
    "input-with-count": InputWithCount,
    "choose-service-model": ChooseServiceModel
  },
  data() {
    let validateidCard = (rule, value, callback) => {
      if (value.length > 0) {
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
      utils: utils,
      myForm: {
        myAddress: [],
        userName: null, // 员工姓名
        serialNo: null, // 员工编号
        nickName: null, // 昵称
        sex: null, // 性别
        entryDate: null, // 入职时间
        level: null, // 职务身份
        workStatus: false, // 是否在职
        telephone: null, // 登录手机号
        headPortrait: "", // avatar头像
        idCardNo: null, // 身份证号码
        birthDay: null, // 生日
        province: null, // 省份
        city: null, // 市
        maritalStatus: null, // 婚否
        blood: null, // 血型
        education: null, // 学历
        remark: null, // 备注
        authorizations: [], // 权限
        onlineShow: false,
        image: ""
      },
      levelList: [], // 职务身份列表
      provinceList: [], // 获取省份列表
      cityList: [], // 获取城市列表
      bloodList: ["A", "B", "AB", "O", "保密"], // 血型列表
      eduList: ["小学", "中学", "高中", "大学", "硕士", "博士", "保密"], // 学历列表
      rules: {
        userName: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        jobType: [
          { required: true, message: "请选择职务类别", trigger: "blur" }
        ],
        authorizations: [
          { required: true, message: "请至少选择一个权限", trigger: "change" }
        ],
        workStatus: [
          { required: true, message: "请选择工作状态", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        entryDate: [
          { required: true, message: "请选择入职时间", trigger: "blur" }
        ],
        level: [{ required: true, message: "请选择职务身份", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入登录手机号", trigger: "blur" }
        ],
        idCardNo: [
          { required: false, validator: validateidCard, trigger: "change" }
        ]
      },
      availableAuthorities: [],
      btnLoading: false,
      statusValue: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      staffId: this.$route.params.staffId,
      userId: this.$route.params.userId
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
    brandParams() {
      let myForm = this.myForm;
      return {
        brandId: this.currentInfo.brandId,
        staffId: myForm.staffId,
        userName: myForm.userName, // 员工姓名
        userId: myForm.userId,
        serialNo: myForm.serialNo, // 员工编号
        nickName: myForm.nickName, // 昵称
        sex: myForm.sex, // 性别
        entryDate: myForm.entryDate, // 入职时间
        level: myForm.level, // 职务身份
        workStatus: myForm.workStatus, // 是否在职
        telephone: myForm.telephone, // 登录手机号
        // headPortrait: myForm.headPortrait, // avatar头像
        idCardNo: myForm.idCardNo, // 身份证号码
        birthDay: myForm.birthDay, // 生日
        province: myForm.myAddress[0], // 省份
        city: myForm.myAddress[1], // 市
        maritalStatus: myForm.maritalStatus, // 婚否
        blood: myForm.blood, // 血型
        education: myForm.education, // 学历
        remark: myForm.remark, // 备注
        roleIdList: myForm.authorizations, // 权限
        headPortrait: myForm.image
      };
    },
  },
  created() {
    // /getSimpleStoreStaffLevelList/3
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    /**获取角色列表 */
    getRoleIdlist() {
      let params = {
        roleType: 'head_quarters',
        brandId: this.currentInfo.brandId,
        userId: this.userId,
      }
      axios.get(`/queryRoleList`, {params: params}).then(res => {
        if (res.success) {
          this.availableAuthorities = [...res.roleList]
          let isRoot = false
          res.checkedRoleList.forEach(item => {
            if (item.id !== 1)  this.myForm.authorizations.push(item.id);
            else isRoot = true
          })
          // 看需求，如果超管，可以角色不设置吗？ 目前后端必选字段
          // if (isRoot) {
          //   // this.rules.authorizations 
          // } else {
          //   this.rules.authorizations = [{ required: true, message: "请至少选择一个权限", trigger: "change" }]
          // }
        }
      })
    },
    init() {
      this.formatRegionData(regionData, "provinceList");
      this.getBrandStaffInfo();
      this.getStatusValue();
    },
    //是否符合禁用启用条件
    getStatusValue() {
      axios.get(`/getPermissionForStaffDimission/${this.staffId}`).then(res => {
        this.statusValue = res.permission ? false : true  // 符合条件不禁用单选
      })
    },
    /**获取 */
    changeCityData(val, num) {
      this.myForm.myAddress = val;
    },
    getBrandStaffInfo() {
      axios.get(
        `/getBrandStaffInfoById/` + this.staffId
      ).then((res) => {
        this.getStaffInfoRes(res,'brand')
      })
    },
    // 格式化祖籍的省份和地区
    formatRegionData(data, name) {
      if (!!data) {
        // 便利总地区数据
        data.forEach(item => {
          // 将省放入省列表中
          this[name].push(item);
        });
      }
    },
    // 当选择完省份后就获取省份对应的城市
    provinceChange(data) {
      // 城市选择框也要清除
      this.myForm.city = "";
      // 清空之前的数据
      this.cityList = [];
      // 如果当前层级的标签是市辖区，则找下一级数组
      if (
        !!data.children &&
        data.children[0] &&
        data.children[0].label === "市辖区"
      ) {
        this.formatRegionData(data.children[0].children, "cityList");
      } else {
        // 获取祖籍的城市列表
        this.formatRegionData(data.children, "cityList");
      }
    },
    async getStaffInfoRes(res) {
      for (let o in res) {
        if (o === "baseServiceBean") {
          this.myForm[o] = [res[o]];
        } else if (o == 'headPortrait') {
            this.myForm.image = res[o];
        } else if (o == 'realHeadPortrait') {
            this.myForm.headPortrait = res[o];
        } else {
          this.myForm[o] = res[o];
        }
      }
      this.myForm.myAddress.push(this.myForm.province, this.myForm.city);
      let params = {
        brandId: this.currentInfo.brandId,
        searchType: "BRAND"
      };
      axios.post(
        `/getBrandStaffLevels`,
        params
      ).then(res => {
        this.getBrandStaffLevelListRes(res)
      })
      this.saveCurrentInfo({
        level: this.myForm.level
      });
      await this.getRoleIdlist();
    },
    getBrandStaffLevelListRes(res) {
      this.levelList = res.staffLevelInfoList;
    },
    /**展示上传的头像 */
    uploadPic(data) {
      this.myForm.image = data.fileKey;
    },
    submitData() {
      // 提交到后台
      let that = this
      axios.post(`/updateBrandStaffById`,this.brandParams).then(res => {
        this.updateStaffRes(res)
      }).catch(error => {
        that.btnLoading = false
      })
    },
    // 处理提交到后台的返回值
    updateStaffRes(res) {
      if (res.success) {
        // 路由跳转到员工列表中
        let args = {
          loading: "btnLoading",
          isPath: true,
          time: 320
        };
        this.deplay(args);
        // this.$router.go(-1);
        // 提示
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        // 提示
        this.btnLoading = false;
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    // 保存修改
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.myForm.image) {
            this.btnLoading = true;
            this.submitData();
          } else {
            utils.showTip(this, { msg: "请上传展示头像", type: "error" });
            return false;
          }
        } else {
          utils.showTip(this, { msg: "请填写完整信息！", type: "error" });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      window.close();
    },
  }
};
</script>
<style>
.el-textarea.is-disabled .el-textarea__inner,
.el-input.is-disabled .el-input__inner {
  background-color: rgba(245, 240, 240, 0.34);
  color: #a9afb9;
}
</style>
<style lang="scss" scoped>
.content-wrap {
  max-width: 1440px;
  margin: 0 auto;
}
@mixin button_ {
  height: 30px;
  padding: 0;
  text-align: center;
}
@mixin size70 {
  width: 70px;
  height: 70px;
}
.ruleForm {
  .el-form-item {
    /deep/ .el-input__inner {
      width: 200px;
    }
  }
}
.upload-img {
  /deep/ .el-upload.el-upload--text {
    @include size70;
    img {
      @include size70;
    }
    .icon-icon_num_add {
      line-height: 70px;
      font-size: 28px;
    }
  }

  /deep/ .el-form-item__content {
    display: flex;
    align-items: flex-end;
    .tip {
      font-size: 12px;
      color: #999999;
      line-height: 20px;
      margin-left: 10px;
    }
  }
}
.basic-service {
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
    .el-tag {
      background: #000;
      height: 28px;
      line-height: 28px;
      color: #686868;
      background: #f7f7f7;
      border: 0;
      margin-left: 10px;
    }
  }
  .add-rules-title {
    background: #f4f5f7;
  }
  @mixin form-item-line {
    width: 604px;
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
        margin-left: 5px;
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
</style>
