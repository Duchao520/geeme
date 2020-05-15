<template>
  <div class="gm_staff_add text-for-copy">
    <!-- 顶部header-->
    <seed-header v-if='operationType == "add"' :title="'新增员工'" :hasTabs="false"></seed-header>
    <!-- container -->
    <div class="full_container" :class='{"operationType_add": operationType == "add"}'>
      <div class='headerPic' v-if='operationType != "add"'>
        <img :src="utils.formatPicImg(ruleForm.headPortrait)" class="avatar">
      </div>
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
              <el-form-item label="登录手机" prop="mobile">
                <el-input
                  :disabled='operationType != "add"'
                  type="number"
                  v-model="ruleForm.mobile"
                  placeholder="请输入登录手机号"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
              <div style='display: flex'>
                <el-form-item label="姓名" prop="name">
                  <el-input :disabled='isDisabled("name")' v-model="ruleForm.name" placeholder="请输入员工姓名" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                  <el-input :disabled='isDisabled("nickName")' v-model="ruleForm.nickName" placeholder="请输入员工昵称" maxlength="16"></el-input>
                </el-form-item>
              </div>
              <div style="display:flex">
                <el-form-item label="性别" prop="isMale">
                  <el-select
                    :disabled='isDisabled("isMale")'
                    :popper-append-to-body="false"
                    v-model="ruleForm.isMale"
                    placeholder="请选择性别"
                  >
                    <el-option label="保密" value="保密"></el-option>
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生日" >
                  <el-date-picker
                    :disabled='isDisabled("birthday")'
                    type="date"
                    placeholder="选择日期"
                    v-model="ruleForm.birthday"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"
                    :append-to-body="false"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <el-form-item label="展示头像:" prop="headPortrait" class="upload-img" v-if='operationType == "add"'>
                <el-upload
                  v-if='(!ruleForm.id || (!checkResUserinfo.headPortrait && ruleForm.id))'
                  style="margin-left:0"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="myHeaders"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="ruleForm.headPortrait && ruleForm.headPortrait != ''" :src="utils.formatPicImg(ruleForm.headPortrait)" class="avatar">
                  <i class="icon iconfont icon-icon_num_add"></i>
                </el-upload>
                <p class="tip" v-if='(!ruleForm.id || (!checkResUserinfo.headPortrait && ruleForm.id))'>
                  支持jpg，png格式，大小不超过2M；
                  <br>点击图片可重新上传
                </p>
                <img v-else :src="utils.formatPicImg(checkResUserinfo.headPortrait)" class="avatar">
              </el-form-item>
              <el-form-item label="签名" prop="sign">
                <el-input :disabled='isDisabled("sign")' v-model="ruleForm.sign" class='autograph' placeholder="请输入签名，最多30个字符" maxlength="30"></el-input>
              </el-form-item>
              <el-form-item label="简介">
                  <!-- v-if='(!ruleForm.id || ruleForm.personalProfile == "") && operationType == "add"' -->
                <input-with-count
                  :disabled='isDisabled("personalProfile")'
                  style="max-width:590px"
                  placeholder='请输入个人简介'
                  :autosize="{ minRows: 4, maxRows: 100}"
                  v-model="ruleForm.personalProfile"
                ></input-with-count>
              </el-form-item>
            </div>
          </div>
          <div class="con-form-wrap">
            <h5>职务信息</h5>
            <div class="con-form">
              <el-form-item label="员工编号" prop="serialNo" v-if='operationType != "add"'>
                <el-input :disabled='true' v-model="ruleForm.serialNo" class='autograph' placeholder="请输入签名，最多30个字符" maxlength="30"></el-input>
              </el-form-item>
              <el-form-item label="职务类别" prop="jobType" >
                <el-radio-group v-model="ruleForm.jobType" @change="getBelongLevel" :disabled='operationType == "details"'>
                  <el-radio label="服务者">服务者</el-radio>
                  <el-radio label="非服务者">非服务者</el-radio>
                </el-radio-group>
              </el-form-item>
              <div style="display:flex;">
                <el-form-item label="入职时间" prop="hiredate">
                  <el-date-picker
                    :disabled='operationType == "details"'
                    type="date"
                    placeholder="请选择入职时间"
                    v-model="ruleForm.hiredate"
                    style="width: 200px"
                    :picker-options="pickerOptions"
                    popper-class="change-popper"
                    :append-to-body="false"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="店内编号" prop="shopNum">
                  <el-input maxlength="8" v-model="ruleForm.shopNum" :disabled='operationType == "details"'></el-input>
                </el-form-item>
              </div>
              <div style="display:flex">
                <el-form-item label="职务身份" prop="levelId">
                  <el-select
                    :popper-append-to-body="false"
                    @change="changeService"
                    v-model="ruleForm.levelId"
                    placeholder="请选择职务身份"
                    :disabled='operationType == "details"'
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in characterList"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item
                  label="是否助理"
                  label-width="150px"
                  v-if="ruleForm.jobType==='服务者'"
                >
                  <el-checkbox v-model="ruleForm.assistant" :disabled='operationType == "details"'>是</el-checkbox>
                </el-form-item> -->
              </div>
              <el-form-item
                style="display:block"
                label="关联基础服务"
                prop="releventBasicServices"
                v-if="ruleForm.jobType==='服务者'"
              >
                <div>
                  <el-button class="select-service" @click="chooseService" :disabled='operationType == "details"'>选择服务</el-button>
                  <span style="margin-left:10px;color:#999999;font-size:12px;">单选</span>
                </div>
                <div v-if="ruleForm.selectedBasicServices&&ruleForm.selectedBasicServices.length>0">
                  <div class="add-rules-title add-rules-con">
                    <div class="service-name">服务名称</div>
                    <div class="other">规格</div>
                    <div class="other">简称</div>
                    <div class="other">价格</div>
                    <div class="other">操作</div>
                  </div>
                  <el-form-item
                    class="add-rules-con simple-name"
                    label-width="0"
                    v-for="(addRuleItem,index) in ruleForm.selectedBasicServices"
                    :key="index"
                    :prop="'selectedBasicServices.'+index+'.simpleName'"
                    :rules="[{ required: true, message: '简称不能为空', trigger: 'blur' },{ required: true, message: '简称不能为空', trigger: 'change' }]"
                  >
                    <div class="service-name">{{addRuleItem.serviceName}}</div>
                    <div class="other">{{addRuleItem.specificationName}}</div>
                    <div class="other input" label-width="0">
                      <el-input maxlength="4" v-model="addRuleItem.simpleName" :disabled='operationType == "details"'></el-input>
                    </div>
                    <div class="other">{{addRuleItem.price}}</div>
                    <div class="other">
                      <i
                        class="icon iconfont icon-icon_operate_delete"
                        style="cursor:pointer"
                        @click="ruleForm.selectedBasicServices.splice(index,1)"
                      ></i>
                    </div>
                  </el-form-item>
                </div>
                <span style="font-size:12px;color:#999999;width: 400px">简称默认为该服务所属一级分类的名称，可修改，不超过4个字</span>
              </el-form-item>
              <el-form-item label='擅长项目' v-if="ruleForm.jobType==='服务者'">
                <el-checkbox-group
                  v-model="ruleForm.skills"
                  class="radio_group_common_list"
                  :disabled='operationType == "details"'
                >
                  <el-checkbox-button
                    v-show="skillList.length>0"
                    v-for="(item) in skillList"
                    :key="item.id"
                    :label="item.id"
                    style="margin-left:20px;"
                  >{{item.simpleTitle}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="授予角色" prop="roleIdList">
                <el-select
                  v-model="ruleForm.roleIdList"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  :disabled='operationType == "details"'
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
                <el-radio-group v-model="ruleForm.workStatus" :disabled='operationType == "details"'>
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
              <el-form-item label="网店展示" v-if="ruleForm.jobType==='服务者'">
                <el-radio-group v-model="ruleForm.onlineShow" :disabled='operationType == "details"'>
                  <el-radio
                    v-for="(item,index) in [{label:'展示',status: true},{label:'隐藏',status:false}]"
                    :key="index"
                    :label="item.status"
                  >{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="con-form-wrap">
            <h5>其他</h5>
            <div class="con-form upload">
              <div style="display:flex">
                <el-form-item label="身份证号码" prop="idcardNo">
                  <el-input v-model="ruleForm.idcardNo" placeholder="请输入身份证号码" :disabled='operationType == "details"'></el-input>
                </el-form-item>
                
              </div>
              <div style="display:flex">
                <s-address
                  :label="'祖籍籍贯'"
                  @changeCityData="changeCityData"
                  :myAddress="ruleForm.myAddress"
                  :changeOnSelect="true"
                  :isdisabled='operationType == "details"'
                ></s-address>
                <el-form-item label="婚姻状况" label-width="190px">
                  <el-select
                    :popper-append-to-body="false"
                    v-model="ruleForm.maritalStatus"
                    placeholder="请选择婚姻状况"
                    :disabled='operationType == "details"'
                  >
                    <el-option label="未婚" value="未婚"></el-option>
                    <el-option label="已婚" value="已婚"></el-option>
                    <el-option label="离异" value="离异"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="祖籍籍贯" label-width="190px">
                  <el-select
                    v-model="ruleForm.province"
                    @change="provinceChange"
                    placeholder="请选择省"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="(item, index) in ruleForm.provinceList"
                      :key="index"
                      :label="item.label"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-select :popper-append-to-body="false" v-model="ruleForm.city" placeholder="请选择市">
                    <el-option
                      v-for="(item, index) in ruleForm.cityList"
                      :key="index"
                      :label="item.label"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
              </div>
              <div style="display:flex">
                <el-form-item label="血型">
                  <el-select
                    v-model="ruleForm.bloodGroup"
                    :popper-append-to-body="false"
                    placeholder="请选择血型"
                    :disabled='operationType == "details"'
                  >
                    <el-option
                      :label="item"
                      :value="item"
                      v-for="(item, index) in bloodList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学历" label-width="190px">
                  <el-select
                    v-model="ruleForm.qualification"
                    :popper-append-to-body="false"
                    placeholder="请选择学历"
                    :disabled='operationType == "details"'
                  >
                    <el-option
                      :label="item"
                      :value="item"
                      v-for="(item, index) in eduList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="备注">
                <input-with-count
                  style="max-width:590px"
                  :autosize="{ minRows: 4, maxRows: 100}"
                  v-model="ruleForm.note"
                  :disabled='operationType == "details"'
                ></input-with-count>
              </el-form-item>
            </div>
          </div>
          <div v-if='operationType !="details"'>
            <el-button
              class="bottom-button normal_blue_btn"
              @click="submitForm('ruleForm')"
              :loading="btnLoading"
              :disabled="checkHasBtnPermission(`${currentEntry}_staff_staffRecord_base_save`)&& false"
            >保存</el-button>
            <el-button class="bottom-button normal_light_gray_btn" @click="resetForm()">取消</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <choose-service-model
      @close="chooseBasicServiceVisible=false"
      :chooseBasicServiceVisible="chooseBasicServiceVisible"
      @confirm="confirmSelectService"
      @getLevelList="sendLevelList"
      :selectServerData='ruleForm.selectedBasicServices'
      ref="serviceModel"
      :character="ruleForm.levelId"
      :characters="characterList"
    ></choose-service-model>
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
        var arr = this.ruleForm.roleIdList;
        if (arr.length === 0) {
          callback(new Error(message));
          return;
        }
        callback();
      };
    };
    let validatorReleventBasicServices = message => {
      return (rule, value, callback) => {
        var arr = this.ruleForm.selectedBasicServices;
        if (arr.length === 0) {
          callback(new Error(message));
          return;
        }
        callback();
      };
    };
    let authorityValidator = validatorArr("请至少选择一种权限");
    let releventBasicServicesValidator = validatorReleventBasicServices(
      "请至少选择一种关联服务"
    );
    let phoneValidatorChange = (rule, value, callback) => {
      console.log(!checkReg(reg["phone"], value))
      if (!checkReg(reg["phone"], value)) {
        callback(new Error("请输入正确格式的手机号码"));
      } else {
        callback();
      }
      return;
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
      utils: utils,
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
      characterList: [], // 职务身份列表
      ruleForm: {
        id: null, //用户id
        name: null, // 员工姓名
        jobType: "服务者", // 职务类别
        serialNo: null, // 从后台自动获取到的员工编号
        isMale: '', // 性别
        mobile: null, // 电话
        birthday: null, // 生日
        levelId: null, // 职务身份
        // price: 0, // 剪发价
        workStatus: true,
        nickName: null, // 昵称
        headPortrait: null, // 备注头像id
        idcardNo: null, // 身份证号码
        maritalStatus: null, // 是否已婚
        bloodGroup: null, // 血型
        qualification: null, // 学历
        hiredate: null, // 入职时间
        note: null, // 备注
        assistant: true,
        roleIdList: [],
        selectedBasicServices: [],
        onlineShow: true, // 是否网店展示
        myAddress: [],
        personalProfile: '', // 个人简介
        sign: '', //签名
        skills: [], // 擅长标签
        shopNum: '', // 店内编号
        userId: null
      },
      rules: {
        name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
          { required: true, message: "请输入员工姓名", trigger: "change" }
        ],
        jobType: [
          { required: true, message: "请选择职务类别", trigger: "blur" },
          { required: true, message: "请选择职务类别", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请输入员工昵称", trigger: "blur" },
          { required: true, message: "请输入员工昵称", trigger: "change" }
        ],
        isMale: [{ required: true, message: "请选择员工性别", trigger: "change" }],
        mobile: [
          {
            required: true,
            validator: phoneValidatorChange,
            trigger: "change"
          },
          { required: true, validator: phoneValidatorChange, trigger: "blur" }
        ],
        hiredate: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
        levelId: [
          { required: true, message: "请选择职务身份", trigger: "change" }
        ],
        // price: [{ required: true, message: "请输入剪发价格", trigger: "blur" }],
        headPortrait: [{ required: true, message: "请选择展示头像", trigger: "change" }],
        roleIdList: [
          { required: true, validator: authorityValidator, trigger: "change" }
        ],
        idcardNo: [
          { required: false, validator: validateidCard, trigger: "change" }
        ],
        // releventBasicServices: {
        //   required: true,
        //   validator: releventBasicServicesValidator,
        //   trigger: "change"
        // }
      },
      eduList: ["小学", "中学", "高中", "大学", "硕士", "博士", "保密"], // 学历列表
      bloodList: ["A", "B", "AB", "O", "保密"], // 血型列表
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
      btnLoading: false,
      operationType: 'add',// 操作类型 add（都可编辑）: 新增输入手机号查询未绑定员工。 edit（只可编辑职务信息）：1.从员工档案进入。2.新增输入手机号查询到有绑定员工。 details(不可编辑)：从总部进入门店员工查看档案。
      skillList: [],
      oldServer:{
        id: '',
        list: [],
        skills: []
      },
      oldNoServer: {
        id: ''
      },
      statusValue: false, // operationType = ‘edit’  修改状态查询是否可符合修改状态的条件
      checkResUserinfo: null,//根据手机号查询出来员工的用户信息
      staffId: this.$route.params.staffId
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
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
    shopParams() {
      let ruleForm = this.ruleForm;
      return {
        userInfo: {
          name: ruleForm.name, // 员工姓名
          nickName: ruleForm.nickName, // 昵称
          id: ruleForm.id,
          isMale: ruleForm.isMale, // 性别
          mobile: ruleForm.mobile, // 电话
          birthday: ruleForm.birthday, // 生日
          headPortrait: ruleForm.headPortrait, // 头像id
          sign: ruleForm.sign,  // 签名
          personalProfile: ruleForm.personalProfile, // 个人简介,
        },
        staffInfo: { 
          jobType: ruleForm.jobType, // 职务类别
          workStatus: ruleForm.workStatus, // 在职状态
          hiredate: ruleForm.hiredate, // 入职时间
          storeId: this.currentInfo.shopId, // 归属门店
          levelId: ruleForm.levelId, // 职务身份
          serviceSpecificationId: ruleForm.selectedBasicServices[0]
            ? ruleForm.selectedBasicServices[0].specificationId
            : null,
          roleIdList: ruleForm.roleIdList, // 角色ID集合
          onlineShow: ruleForm.onlineShow, // 是否网店展示
          assistant: ruleForm.assistant, // 是否是助理
          baseServiceName: ruleForm.selectedBasicServices[0]
          ? ruleForm.selectedBasicServices[0].simpleName
          : null,// 自定义基础服务名称
          skills: ruleForm.skills,
          serialNo: ruleForm.serialNo,
          shopNum: ruleForm.shopNum,
          id: ruleForm.staffId ? ruleForm.staffId : null
        },
        hdStoreStaffBrandInfo: {
          idcardNo: ruleForm.idcardNo, // 身份证号码
          province: ruleForm.myAddress[0], // 祖籍籍贯省份
          city: ruleForm.myAddress[1], // 祖籍籍贯城市
          district: ruleForm.myAddress[2], // 祖籍籍贯区
          maritalStatus: ruleForm.maritalStatus, // 是否已婚
          bloodGroup: ruleForm.bloodGroup, // 血型
          brandId: this.currentInfo.brandId, //品牌id
          userId: ruleForm.userId,
          qualification: ruleForm.qualification, // 学历
          note: ruleForm.note, // 备注
        },
        // hairCutPrice: ruleForm.selectedBasicServices[0]
        //   ? ruleForm.selectedBasicServices[0].price
        //   : null, // 剪发价格
        
      };
    },
    editShopParams() {
      let ruleForm = this.ruleForm;
      console.log(ruleForm);
      return {
        staffInfo: { 
          jobType: ruleForm.jobType, // 职务类别
          workStatus: ruleForm.workStatus, // 在职状态
          hiredate: ruleForm.hiredate, // 入职时间
          storeId: this.currentInfo.shopId, // 归属门店
          levelId: ruleForm.levelId, // 职务身份
          serviceSpecificationId: ruleForm.selectedBasicServices[0]
            ? ruleForm.selectedBasicServices[0].specificationId
            : null,
          roleIdList: ruleForm.roleIdList, // 角色ID集合
          onlineShow: ruleForm.onlineShow, // 是否网店展示
          assistant: ruleForm.assistant, // 是否是助理
          baseServiceName: ruleForm.selectedBasicServices[0]
          ? ruleForm.selectedBasicServices[0].simpleName
          : null,// 自定义基础服务名称
          skills: ruleForm.skills,
          serialNo: ruleForm.serialNo,
          shopNum: ruleForm.shopNum,
          id: ruleForm.staffId ? ruleForm.staffId : null,
          userId: ruleForm.userId,
        },
        hdStoreStaffBrandInfo: {
          idcardNo: ruleForm.idcardNo, // 身份证号码
          province: ruleForm.myAddress[0], // 祖籍籍贯省份
          city: ruleForm.myAddress[1], // 祖籍籍贯城市
          district: ruleForm.myAddress[2], // 祖籍籍贯区
          maritalStatus: ruleForm.maritalStatus, // 是否已婚
          bloodGroup: ruleForm.bloodGroup, // 血型
          brandId: this.currentInfo.brandId, //品牌id
          userId: ruleForm.userId,
          qualification: ruleForm.qualification, // 学历
          note: ruleForm.note, // 备注
        },
        // hairCutPrice: ruleForm.selectedBasicServices[0]
        //   ? ruleForm.selectedBasicServices[0].price
        //   : null, // 剪发价格
        
      };
    },
    watchForm() {
      let obj = {}
      Object.keys(this.ruleForm).forEach(key=>{
          obj[key] = this.ruleForm[key]
      })
      return obj
    }
  },
  watch: {
    watchForm:{
      deep: true,
      handler(newVal,oldVal) {
        if (this.operationType == 'add') {
          for(let key in newVal) {
            if(newVal[key] !== oldVal[key]) {
              if (key == 'mobile' && newVal.mobile.length == 11) {
                this.checkStaffByMobile();
              } else if(key !== 'mobile' && (!newVal.mobile || newVal.mobile == '')) {
                utils.showTip(this, { msg: '请先输入登录号码再填写其他信息', type: "error" });
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    if(this.staffId && this.currentEntry == 'shop') {
      this.operationType = 'edit'
      this.getStoreStaffInfo();
      this.getStatusValue();
    } else if (this.staffId && this.currentEntry =='brand') {
      this.operationType = 'details'
      this.getStoreStaffInfo();
    } else if(this.operationType = 'add') {
      this.addInit();
    }
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    /**获取祖籍籍贯 */
    changeCityData(val, num) {
      this.ruleForm.myAddress = val;
    },
    addInit() {
      this.getStaffLevelList();
      this.getRoleIdlist();
    },
    isDisabled(val) {
      let boolean = null 
      if (this.operationType == "add") {
        if (this.ruleForm.id && this.checkResUserinfo[val] && this.checkResUserinfo[val] != "") {
          boolean = true
        } else {
          boolean = false
        }
      } else {
        boolean = true
      }
      return boolean
    },
    //是否符合禁用启用条件
    getStatusValue() {
      axios.get(`/getPermissionForStaffDimission/${this.staffId}`).then(res => {
        this.statusValue = res.permission ? false : true  // 符合条件不禁用单选
      })
    },
    checkStaffByMobile() {
      axios.post('/checkStaffByMobile',{brandId: this.currentInfo.brandId,mobile: this.ruleForm.mobile}).then(res => {
        let obj = {};
        if (res.hdStoreStaffBrandInfo) {
          res.hdStoreStaffBrandInfo.userId = res.hdStoreStaffBrandInfo.id
          res.hdStoreStaffBrandInfo.id = null
          res.hdStoreStaffBrandInfo.myAddress = [res.hdStoreStaffBrandInfo.province,res.hdStoreStaffBrandInfo.city,res.hdStoreStaffBrandInfo.district]          
        }
        this.checkResUserinfo = res.userInfo;
        Object.assign(obj,res.hdStoreStaffBrandInfo,res.userInfo);
        this.getStaffInfoRes(obj)
      })
    },
    getStoreStaffInfo() {
      axios.post('/getStaffBaseInfo',{brandId: this.currentInfo.brandId,staffId:this.staffId}).then((res) => {
        let obj = {};
        if (res.hdStoreStaffBrandInfo) {
          res.hdStoreStaffBrandInfo.userId = res.hdStoreStaffBrandInfo.id
          res.hdStoreStaffBrandInfo.id = null
          res.hdStoreStaffBrandInfo.myAddress = [res.hdStoreStaffBrandInfo.province,res.hdStoreStaffBrandInfo.city,res.hdStoreStaffBrandInfo.district]
        }
        if (res.staffInfo) {
          res.staffInfo.staffId = res.staffInfo.id
          res.staffInfo.id = null
          if (res.staffInfo.jobType === '服务者') {
            this.getStaffLevelList();
          } else {
            this.getNoLevelList();
          }
        }
        this.checkResUserinfo = res.userInfo;
        Object.assign(obj,res.hdStoreStaffBrandInfo,res.staffInfo,res.userInfo);
        this.getStaffInfoRes(obj,res.baseServiceBean)
      })
    },
    getStaffInfoRes(res,serverData) {
      if(res.id) {
        for (let o in res) {
          if (o == 'skills') {
            if (res[o]) {
              this.ruleForm[o] = res[o];
            } else {
              this.ruleForm.skills = [];
            }
          } else if (o == 'levelId') {
            if (res [o] == 0) {
              this.ruleForm.levelId = null;
            } else {
              this.ruleForm[o] = res[o]
            }
          } else {
            this.ruleForm[o] = res[o];
          }
        }
        this.ruleForm.roleIdList = [];
      } else {
        this.initForm();
      }
      this.getRoleIdlist();
      if (this.ruleForm.jobType === "服务者") {
        try{
          serverData.simpleName = this.ruleForm.baseServiceName;
          this.ruleForm.selectedBasicServices = [serverData];
          this.getStaffLevelList();
          this.getServiceList4Skill();
        } catch(err){}
      } else {
        this.getNoLevelList();
      }
      if (this.operationType !="add") {
        let that = this
        setTimeout(function() {
          that.$refs.ruleForm.clearValidate();
        },100)
      }
    },
    /**获取服务者职务列表 */
    getStaffLevelList() {
      axios
        .get(api.getSimpleLevelList.URL + this.currentInfo.brandId, {})
        .then(res => {
          this.characterList = res.levelList;
        });
    },
    /**获取非服务者职务列表 */
    getNoLevelList() {
      axios.get(api.getNoLevelList.URL + this.currentInfo.brandId).then(res => {
        this.characterList = res.levelList;
      });
    },
    /**根据服务著和非服务者来获取专属的职务列表 */
    getBelongLevel(val) {
      if (val === "服务者") {
        if (this.ruleForm.levelId) {
          this.oldNoServer.id = this.ruleForm.levelId
        }
        if (this.oldServer.id) {
          this.ruleForm.levelId = this.oldServer.id;
          this.ruleForm.selectedBasicServices = this.oldServer.list;
          this.ruleForm.skills = this.oldServer.skills;
        } else {
          this.ruleForm.levelId = null;
        }
        this.getStaffLevelList();
      } else {
        if (this.ruleForm.levelId) {
          this.oldServer.id = this.ruleForm.levelId;
          this.oldServer.list = this.ruleForm.selectedBasicServices;
          this.oldServer.skills = this.ruleForm.skills;
          this.ruleForm.levelId = null;
        }
        if (this.oldNoServer.id) {
          this.ruleForm.levelId = this.oldNoServer.id;
        }
        this.getNoLevelList();
      }
    },
    back() {
      this.$router.go(-1);
    },
    submitData() {
      if (this.operationType == 'add') {
        axios.post('/createStaff', this.shopParams).then(res => {
          this.createStaffRes(res);
        }).catch(() => {
          this.btnLoading = false;
        });
      } else if (this.operationType == 'edit') {
        axios.post('/updateStoreStaffInfo', this.editShopParams).then(res => {
          this.createStaffRes(res);
        }).catch(() => {
          this.btnLoading = false;
        });
      }
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
        if (arr[i] === "mobile" && !utils.checkPhone(this.ruleForm[arr[i]])) {
          this.message = "手机号码有误，请重填";
          return false;
        }
      }
      return true;
    },
    submitForm(formName) {
      // 提交数据至后台
      //if (this.operationType == 'add') {
      this.$refs[formName].validate((valid,obj) => {//编辑不校验个人信息
        if (valid) {
            this.btnLoading = true;
            this.submitData();
        } else {
          if (this.operationType == 'edit') {
            let abc = null
            for(let key in obj) {
              if (key == 'name' || key =='nickName' || key == 'birthday') {
                abc = true
              } else {
                abc = false
              }
            }
            if (abc) {
              this.btnLoading = true;
              this.submitData();
            } else {
              return false
            }
          } else {
            return false;
          }
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.headPortrait = file.response.fileKey;
      // this.ruleForm.photo = datas.imgUrl.URL + file.response.fileKey;
      this.$refs.ruleForm.validateField("headPortrait");
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
    resetForm() {
      if (this.operationType == "add") {
        this.$router.go(-1);
      } else {
        window.close();
      }
    },
    initForm() {
      this.ruleForm = {
        id: null, //用户id
        name: null, // 员工姓名
        jobType: "服务者", // 职务类别
        staffId: null, // 从后台自动获取到的员工编号
        isMale: '', // 性别
        mobile: this.ruleForm.mobile, // 电话
        birthday: null, // 生日
        levelId: null, // 职务身份
        // price: 0, // 剪发价
        workStatus: true,
        nickName: null, // 昵称
        headPortrait: null, // 备注头像id
        idcardNo: null, // 身份证号码
        maritalStatus: null, // 是否已婚
        bloodGroup: null, // 血型
        qualification: null, // 学历
        hiredate: null, // 入职时间
        note: null, // 备注
        assistant: false,
        roleIdList: [],
        selectedBasicServices: [],
        onlineShow: true, // 是否网店展示
        myAddress: [],
        personalProfile: '', // 个人简介
        sign: '', //签名
        skills: [], // 擅长标签
        userId: null
      }
    },
    chooseService() {
      if (this.ruleForm.levelId) {
        this.chooseBasicServiceVisible = true;
      } else {
        utils.showTip(this, { msg: "请选择一种职务身份！", type: "error" });
      }
    },
    confirmSelectService(data) {
      this.ruleForm.selectedBasicServices = [data];
      this.chooseBasicServiceVisible = false;
      this.$refs.ruleForm.validateField("releventBasicServices");
    },
    sendLevelList(data) {
      this.ruleForm.levelId = data;
    },
    /**获取角色列表 */
    getRoleIdlist() {
      let queryRoleList
      if (this.operationType != "add") {
        queryRoleList = '/queryRoleList?roleType=store&storeId='+this.currentInfo.shopId+'&userId='+this.ruleForm.id
      } else {
        queryRoleList = '/queryRoleList?roleType=store&storeId='+this.currentInfo.shopId
      }
      axios.get(queryRoleList).then(res => {
        this.availableAuthorities = [...res.roleList];
        if (res.checkedRoleList && res.checkedRoleList.length > 0) {
          res.checkedRoleList.forEach(item => {
            this.ruleForm.roleIdList.push(item.id);
          })
        }
      });
    },
    getServiceList4Skill() {
      axios.post('/getServiceList4Skill',{levelId: this.ruleForm.levelId,storeId: this.currentInfo.shopId}).then(res => {
        this.skillList = res.skills;
      })
    },
    /**根据不同的职务身份显示服务列表 */
    changeService(levelId) {
      this.ruleForm.selectedBasicServices = [];
      this.ruleForm.skills = [];
      this.$refs.serviceModel.getServiceListByLevelFilter(levelId);
      this.getServiceList4Skill();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
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
    box-sizing: border-box;
    background: #fff;
    border-radius: 3px;
    // margin: 20px;
    border-radius: 8px;
    margin: 0;
    display: flex;
    .headerPic{
      width: 160px;
      height: 160px;
      margin-top: 50px;
      margin-left: 70px;
      margin-right: 60px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    &.operationType_add{
      width: 1440px;
      margin: auto;
      margin-top: 85px;
      height: calc(100vh - 105px);
      overflow-y: auto;
      @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
      box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
      padding-bottom: 0;
      .ruleForm{
        padding-bottom: 40px;
      }
    }
    .form_area {
      flex: 1;
      box-sizing: border-box;
      padding: 33px 40px;
      // margin-top: 85px;
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
          .autograph{
            /deep/ .el-input__inner{
              width: 400px;
            }
          }
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
          span{
            width: 300px;
            display: inline-block;
          }
          img{
            width: 70px;
            height: 70px;
          }
        }
      }
    }
    .bottom-button {
      width: 100px;
    }
    .radio_group_common_list{
      width: 800px;
      /deep/ .el-checkbox-button__inner{
        border: 1px solid #ebebeb;
        border-radius: 11px;
        padding: 3px 16px;
        display: inline-block;
        &:hover{
          color: #5a5a5a;
        }
      }
      /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner{
        background-color: rgba(255, 109, 97, 0.2);
        border: 1px solid rgba(255, 109, 97, 1);
        color: #FF6D61;
        box-shadow: none;
      }
    }
  }
}
</style>


