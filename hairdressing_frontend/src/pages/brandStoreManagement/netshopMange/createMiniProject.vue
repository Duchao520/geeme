<template>
  <div id="createMini">
    <div class="miniHeader">
      <center-header title="免注册生成小程序" backing="返回" :isSelfSite="true"></center-header>
    </div>
    <section class="mainContent">
      <div class="createStep">
        <order-steps :steps="steps"></order-steps>
      </div>
      <div class="formInfo">
        <el-form
          ref="form"
          :model="myForm"
          :rules="rule"
          label-width="153px"
          label-position="right"
        >
          <div v-show="stepNum == 1">
            <el-form-item label="小程序主体名称" prop="companyName" style="margin-bottom: 0">
              <el-input v-model="authenticateBrandInfo.companyName" :disabled="true"></el-input>
              <p class="formText">小程序主体名称与本店铺品牌认证的主体名称一致</p>
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="authenticateBrandInfo.creditCode	" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="法人代表姓名" prop="legalPerson">
              <el-input v-model="authenticateBrandInfo.legalPerson" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公众号APPID" prop="h5Id" style="margin-bottom: 0">
              <el-input v-model="myForm.h5Id" placeholder="请准确填写" :disabled="isRoot"></el-input>
              <!-- <g-btn name="获取授权" @click='getRoot' :isdisabled='rootIng' type='black' size='small'></g-btn> -->
              <el-button
                @click="getRoot"
                class="normal_light_gray_btn"
                :disabled="rootIng"
                size="small"
              >获取授权</el-button>
              <span
                v-if="rootIng || isRoot"
                class="checkState"
                :class="isRoot ? 'formSuccess' : 'rootIconIng'"
              >
                <i
                  class="icon iconfont"
                  :class="isAppId ? 'icon_order_success' : 'loading'"
                >{{isRoot ? "&#xe6bd;" : "&#xe6d0;"}}</i>
                {{isRoot ? "已授权" : "授权中"}}
              </span>
              <p class="formText">
                请使用以上述主体名义认证的公众号的APPID。
                <span class="formTips" @click="howToGet('h5Id')">何处获取？</span>
              </p>
            </el-form-item>
            <el-form-item label="法人代表微信号" prop="wxCard">
              <el-input v-model="myForm.wxCard" placeholder="请准确填写"></el-input>
              <!-- <g-btn name='获取授权' :isdisabled='createIng' @click='createApp' type='black' size='small'></g-btn> -->
              <el-button
                @click="createApp"
                class="normal_light_gray_btn"
                :disabled="createIng"
                size="small"
              >获取授权</el-button>
              <p class="formText">
                请填写绑定了{{authenticateBrandInfo.legalPerson}}银行卡的微信号。
                <span
                  class="formTips"
                  @click="howToGet('phone')"
                >何处获取？</span>
              </p>
              <p class="formText formPerror" v-if="!isRoot && myForm.wxCard != ''">请先完成公众号授权</p>
            </el-form-item>
            <el-form-item label>
              <!-- <g-btn name='下一步' :type='isRoot && createState ? "blue1": "gray"' :isdisabled="!isRoot || !createState" @click='getWepAppInfo()'></g-btn> -->
              <el-button
                :class="isRoot && createState ? 'normal_blue_btn': 'normal_silvery_gray_btn'"
                :disabled="!isRoot || !createState"
                @click="getWepAppInfo()"
              >下一步</el-button>
              <!-- <el-button
                :class="isRoot && createState ? 'normal_blue_btn': 'normal_silvery_gray_btn'"
                @click="getWepAppInfo()"
              >下一步</el-button>-->
            </el-form-item>
          </div>
          <!-- 第二步 -->
          <div v-show="stepNum == 2" class="textColor" v-loading="sortLoad">
            <el-form-item label="小程序APPID" prop="appId" style="margin-bottom: 0;">
              <el-input v-model="myForm.appId" placeholder="请准确填写"></el-input>
              <!-- <g-btn name='校验' type='black' size='small' @click='checkAppId'></g-btn> -->
              <el-button @click="checkAppId" class="normal_light_gray_btn" size="small">校验</el-button>
              <span
                v-if="checkAppIdIng"
                class="checkState"
                :class="isAppId ? 'formSuccess' : 'formPerror'"
              >
                <i
                  class="icon iconfont"
                  :class="isAppId ? 'icon_order_success' : 'icon_ope_cancel'"
                >{{isAppId ? "&#xe6bd;" : "&#xe68e;"}}</i>
                {{isAppId ? "恭喜，校验已通过！" : "校验未通过，请重新校验！"}}
              </span>
              <p class="formText">
                请登录法人代表微信号，通过“公众平台安全助手”查收推送消息。
                <span class="formTips" @click="howToGet('appId')">示例</span>
              </p>
            </el-form-item>
            <el-form-item label="小程序名称" prop="appName" style="margin-bottom: 0" required>
              <el-input
                v-model="myForm.appName"
                placeholder="为小程序命名，一旦启用不可修改"
                @blur="inputBlur(myForm.appName)"
              ></el-input>
              <!-- <g-btn name='检验合法性' @click='checkName' type='black'></g-btn> -->
              <el-button @click="checkName" class="normal_light_gray_btn" size="small">检验合法性</el-button>
              <span
                v-if="checkAppNameIng"
                class="checkState"
                :class="isCheckAppName ? 'formSuccess' : 'formPerror'"
              >
                <i
                  class="icon iconfont"
                  :class="isCheckAppName ? 'icon_order_success' : 'icon_ope_cancel'"
                >{{isCheckAppName ? "&#xe6bd;" : "&#xe68e;"}}</i>
                {{isCheckAppName ? "恭喜，该名称可以使用！" : "检测未通过，请修改后重新检测！"}}
              </span>
              <!-- <span class='formTips' @click='checkName()'>检验合法性</span> -->
              <p class="formText formPerror">
                <span v-show="inputError">{{errorText}}</span>
              </p>
            </el-form-item>
            <el-form-item
              label="服务类目"
              prop="serviceScope"
              style="margin-bottom: 30px;"
              class="servive-scope"
            >
              <div class="sort-box">
                <div class="sort-item" v-for="(i,index) in categories" :key="index">
                  <el-select
                    v-model="i.first"
                    placeholder="请选择"
                    clearable
                    @change="(val)=>{handleFisrtServeChange(val,index)}"
                  >
                    <el-option
                      v-for="item in SortOneList"
                      :key="item.wxId"
                      :label="item.name"
                      :value="item.wxId"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="i.second"
                    placeholder="请选择"
                    clearable
                    @change="(val)=>{handleSenServeChange(val,index)}"
                  >
                    <el-option
                      v-for="item in SortTwoList[index]"
                      :key="item.wxId"
                      :label="item.name"
                      :value="item.wxId"
                    ></el-option>
                  </el-select>
                  <i
                    class="icon iconfont icon-icon_operate_delete deleteIcon"
                    @click="deleteIcon(index)"
                  ></i>
                  <i
                    class="icon iconfont icon-icon_open_on addIcon"
                    @click="addIcon"
                    v-if="index == categories.length - 1"
                  ></i>
                  <!-- 服务资质 -->
                  <div v-if="targetServe[index].innerList.length">
                    <p>资质鉴定：</p>
                    <!-- 所有资质种类 -->
                    <div v-for="(item,i) in targetServe[index].innerList" :key="i">
                      <p>{{item.name}}</p>
                      <div class="upload-content">
                        <div style="margin:20px 0 10px 20px; display: inline-block;">
                          <!-- <G-Upload-Pic
                            :weappUpload="true"
                            :size="5"
                            :defaultKey="initValue"
                            @success="(val)=>{onSuccess(val,targetServe[index].innerList[i])}"
                            :remove="true"
                            :preview="true"
                            @remove="(val)=>{onRemove(val,targetServe[index].innerList[i])}"
                          ></G-Upload-Pic>-->
                          <g-upload-spic
                            @change="(val) => { onSuccess(val, targetServe[index].innerList[i], index, i) }"
                            :photo="targetServe[index].innerList[i].value || null "
                            :size="5"
                            v-loading="upLoading"
                          ></g-upload-spic>
                        </div>
                        <div v-if="item.url" style="display: inline-block;">
                          <el-tooltip class="item" effect="dark" content="点击查看参考图样" placement="top">
                            <el-button icon="el-icon-search" @click="seeReference(item.url)" circle></el-button>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <!-- <g-btn name='上一步' :type='!createStatus ? "blue1": "gray"' :isdisabled="createStatus" @click='backToLstStep(stepNum-1)' style='margin-right: 20px;'></g-btn> -->
              <el-button
                :class="!createStatus ? 'normal_blue_btn': 'normal_silvery_gray_btn'"
                :disabled="createStatus"
                @click="backToLstStep(stepNum-1)"
                style="margin-right: 20px;"
              >上一步</el-button>
              <!-- <g-btn name='下一步' :type='isAppId && isCheckAppName ? "blue1": "gray"' :isdisabled="!isAppId || !isCheckAppName" @click='setNickname'></g-btn> -->
              <el-button
                :class="isAppId && isCheckAppName ? 'normal_blue_btn': 'normal_silvery_gray_btn'"
                @click="setNickname"
                :disabled="!isAppId || !isCheckAppName"
              >下一步</el-button>
            </el-form-item>
          </div>
          <div v-show="stepNum == 3">
            <el-form-item label="小程序图标" prop="appLogo">
              <upload-image v-model="myForm.appLogo" :size="2" uploadType="logo"></upload-image>
              <p class="tip">默认为品牌logo,点击图片可修改，要求正方形或圆形，支持JPG，png格式，大小不超过2M</p>
              <p class="tip" style="color: red;">建议使用清晰纯净logo，一旦小程序发布成功，不支持修改，请谨慎选择！</p>
            </el-form-item>
            <el-form-item label="小程序简介" prop="appDetail">
              <el-input
                type="textarea"
                placeholder="请简述小程序的主要功能"
                v-model="myForm.appDetail"
                maxlength="120"
                :rows="5"
              ></el-input>
              <span class="limitNum">{{myForm.appDetail.length}}/120</span>
            </el-form-item>
            <el-form-item label>
              <!-- <el-button @click='computedStep(stepNum-1)'>上一步</el-button> -->
              <el-button
                :class="myForm.appDetail && myForm.appLogo?'normal_blue_btn':'normal_silvery_gray_btn'"
                :disabled="!myForm.appDetail || !myForm.appLogo"
                @click="submitAudit('form')"
              >提交审核</el-button>
            </el-form-item>
          </div>
          <div v-show="stepNum == 4">
            <div class="rootIng">
              <h2>
                <i
                  class="icon iconfont"
                  :class="auditStatus == 0 ? 'icon_order_success success': auditStatus == 1 ?  'icon_popup_plaint error':auditStatus == 2 ?  'icon_waited ing': auditStatus == 3 ? 'icon_popup_plaint error': ''"
                >{{auditStatus == 0 ? "&#xe6bd;": auditStatus == 1 ? "&#xe6a7;":auditStatus == 2 ? "&#xe705;": auditStatus == 3 ? "&#xe6a7;": ""}}</i>
                {{auditStatus == 0 ? "审核已通过": auditStatus == 1 ? "审核未通过":auditStatus == 2 ? "审核中": auditStatus == 3 ? "已撤回": ""}}
              </h2>
              <p>
                微信官方将在24小时内完成审核，审核结果将通过“服务通知”发送至主体法人的微信号，请注意关注！
                <span
                  @click="howToGet('example')"
                >查看示例</span>
              </p>
              <p>如果代码通过审核，您将可以进入“第5步”进行全网发布。在此之前，您可以扫码如下二维码访问该小程序的体验版：</p>
              <div class="img" id="TestAppCode"></div>
              <p>如果代码未通过审核，则您需要重新返回“第2步”进行修改。</p>
              <!-- <g-btn :type='auditStatus!=0 && auditStatus!=2? "blue1": "gray"' :disabled='auditStatus==0 || auditStatus ==2' name='上一步' @click='computedStep(stepNum-1)'></g-btn> -->
              <!-- <g-btn :type='auditStatus==0 ? "blue1": "gray"' :disabled='auditStatus!=0' name='下一步' @click='computedStep(stepNum+1)'></g-btn> -->
              <el-button
                :class="auditStatus==0 ? 'normal_blue_btn': 'normal_silvery_gray_btn'"
                :disabled="auditStatus!=0"
                @click="computedStep(stepNum+1)"
              >下一步</el-button>
            </div>
          </div>
          <div v-show="stepNum == 5">
            <div class="release">
              <dl>
                <dt>
                  <i class="icon iconfont icon_popup_question">&#xe6a8;</i>
                </dt>
                <dd>
                  <h3>确定要全网发布吗？</h3>
                  <p>全网发布后，该小程序将立即公开上线，小程序名称将不可修改。</p>
                </dd>
              </dl>
              <!-- <g-btn type='blue1' name='确认发布' @click='release'></g-btn> -->
              <el-button class="normal_blue_btn" @click="release">确认发布</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </section>
    <el-dialog title :visible.sync="howGet" style="border-radius: 4px" :width="dialogObj.width">
      <img :src="dialogObj.img" alt class="dialogImg" :width="dialogObj.wh" :height="dialogObj.hw" />
    </el-dialog>
    <el-dialog
      class="createSuccess"
      :visible.sync="createSuccess"
      @close="closeBack"
      width="500px"
      style="border-radius: 4px"
    >
      <div class="img" id="webAppCode">
        <img :src="utils.formatPicImg(releaseCode)" alt />
      </div>
      <p>恭喜，小程序已成功发布！您可以扫码查看，点击下载可保存小程序码原图。</p>
      <g-button
        name="下载"
        type="deepGrey"
        icon="icon_operate_down"
        @click.native="download(releaseCode)"
        class="btn-button"
      ></g-button>
      <!-- <router-link to='/brand-inner/store/info/mini-project'><g-button type='open-bill' name='确定'></g-button></router-link> -->
    </el-dialog>
    <g-del-model
      :delTagDialogVisible="createStateDialog"
      @close="createStateDialog=false"
      @confirm="createStateDialog=false"
      title="申请授权消息已发送"
      content="请登录法人微信号，通过“公众平台安全助手”查收消息，并根据指引完成授权。"
      icon="icon_order_success"
      iconColor="#00CF82"
    ></g-del-model>
  </div>
</template>
<script>
var timer = null;
import * as axios from "@/util/axios";
import { mapActions } from "vuex";
import CenterHeader from "@/components/common/CenterHeader";
import * as utils from "@/assets/js/utils";
import { clearInterval, setTimeout } from "timers";
export default {
  components: {
    "center-header": CenterHeader
  },
  data() {
    return {
      utils: utils,
      rule: {
        wxCard: [
          {
            required: true,
            message: "请输入法人代表微信号",
            trigger: "change"
          },
          { required: true, message: "请输入法人代表微信号", trigger: "blur" }
        ],
        h5Id: [
          { required: true, message: "请输入公众号APPID", trigger: "change" },
          { required: true, message: "请输入公众号APPID", trigger: "blur" }
        ],
        appId: [
          { required: true, message: "请输入小程序APPID", trigger: "change" },
          { required: true, message: "请输入小程序APPID", trigger: "blur" }
        ],
        // appName: [
        //     { required: true, message: '请输入小程序名称', trigger: 'change' },
        //     { required: true, message: '请输入小程序名称', trigger: 'blur' }
        // ],
        appLogo: [
          { required: true, message: "请上传小程序图标", trigger: "change" },
          { required: true, message: "请上传小程序图标", trigger: "blur" }
        ],
        appDetail: [
          {
            required: true,
            message: "请简述小程序的主要功能",
            trigger: "change"
          },
          { required: true, message: "请简述小程序的主要功能", trigger: "blur" }
        ],
        serviceScope: [
          {
            validator: this.serviceScopeValid,
            trigger: "change"
          }
        ]
      },
      steps: [
        {
          completed: true,
          icon: "icon-icon_order_success",
          name: "",
          showIconDefault: false,
          successColor: "#F52D56",
          time: "第1步：公众号授权",
          timeColor: "#F52D56"
        },
        {
          completed: true,
          icon: "icon-icon_order_success",
          showIconDefault: false,
          successColor: "#F52D56",
          time: "第2步：核名与服务类目",
          timeColor: "#F52D56"
        },
        {
          completed: true,
          icon: "icon-icon_order_success",
          showIconDefault: false,
          successColor: "#F52D56",
          time: "第3步：小程序信息完善",
          timeColor: "#F52D56"
        },
        {
          completed: true,
          icon: "icon-icon_order_success",
          name: "",
          showIconDefault: false,
          successColor: "#F52D56",
          time: "第4步：微信官方审核",
          timeColor: "#F52D56"
        },
        {
          completed: false,
          icon: "icon-icon_order_success",
          showIconDefault: false,
          successColor: "#F52D56",
          time: "第5步：全网发布",
          timeColor: "#F52D56"
        }
      ],
      stepNum: 1,
      howGet: false,
      dialogObj: {
        width: "500px",
        wh: 246,
        hw: 438,
        img: ""
      },
      authenticateBrandInfo: {},
      myForm: {
        wxCard: "",
        h5Id: "",
        appId: "",
        appName: "",
        appDetail: "",
        appLogo: "",
        serviceScope: []
      },
      inputError: false,
      errorText: "", // 校验appName 报错信息
      rootIng: false,
      createSuccess: false,
      createIng: false,
      isRoot: false, // 是否完成公众号授权
      createState: false, // 发起创建小程序是否成功 false
      createStateDialog: false,
      checkAppNameIng: false, //点击校验appName
      isCheckAppName: false, // appName 是否合法
      checkAppIdIng: false, // 点击校验appId按钮
      isAppId: false, // appId是否通过  ****************
      auditStatus: 2, //"0审核成功 1审核被拒绝 2审核中 3已撤回",
      releaseCode: "",
      createStatus: false, // 创建小程序是否成功
      categories: [
        // 新增类目参数
        // {
        //   first: null,
        //   second: null,
        //   certicates: []
        // }
      ],
      SortOneList: [], // 服务类目一级
      SortTwoList: [[]], // 服务类目二级
      sortLoad: false,
      targetServe: [],
      sortOneConfirm: [],
      upLoading: false
    };
  },
  watch: {
    "myForm.appName"(val) {
      this.isCheckAppName = false;
      this.checkAppNameIng = false;
      if (val == "") {
        this.inputError = true;
        this.errorText = "请输入小程序名称";
      } else {
        this.inputError = false;
      }
    },
    "myForm.appId"(val) {
      this.isAppId = false;
      this.checkAppIdIng = false;
    },
    "myForm.wxCard"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.createState = false;
      }
    },
    "myForm.h5Id"(val) {
      if (this.rootIng) {
        axios.post("/weapp/getAuthStatus", { appid: val }).then(res => {
          window.clearInterval(timer);
          timer = null;
          this.rootIng = false;
          if (res.authorized) {
            this.isRoot = true;
          } else {
            this.isRoot = false;
          }
        });
      }
    }
  },
  mounted() {
    this.getAuthenticateBrandInfo();
    this.getWepAppInfo();
  },
  methods: {
    // 校验服务类目
    serviceScopeValid(rule, val, cb) {
      if (this.categories.length > 3) {
        return cb(
          "腾讯小程序一次最多只允许上传3种服务类目，后续如果想添加更改可联系我司！"
        );
      }
      this.categories.forEach((item, index) => {
        if (!item.first || !item.second) {
          return cb("请完善相关信息");
        }
        this.targetServe[index].innerList.forEach(i => {
          if (i && !i.value) {
            return cb("请上传相关资质");
          }
        });
      });
      cb();
    },
    // 获取小程序进度  // 0-1
    getWepAppInfo() {
      axios
        .get("/weapp/getWeappStatus/" + this.currentInfo.brandId)
        .then(res => {
          if (res) {
            // console.log(res.step);
            let stepNum = res.step ? res.step + 1 : 1;
            // let stepNum = 2;
            this.myForm.h5Id = res.authWeappId ? res.authWeappId : "";
            this.myForm.wxCard = res.legalPersonaWechat
              ? res.legalPersonaWechat
              : "";
            this.myForm.appId = res.weappId ? res.weappId : "";
            this.computedStep(stepNum);
            if (stepNum == 2) {
              if (res.createStatus == 0) {
                this.createStatus = true;
              } else if (!res.createStatus) {
                this.createStatus = true;
                utils.showTip(this, {
                  msg: "请先完成小程序创建授权，再继续填写。",
                  type: "info"
                });
              } else {
                this.createStatus = false;
                utils.showTip(this, {
                  msg: res.createStatusMsg,
                  type: "error"
                });
              }
              // 获取该商品品牌所属的模板的行业分类
              this.getTempSort();
            }
            // if (res.weappId && this.stepNum == 4) {
            //     this.getAuditStatus();
            //     this.getTestCode();
            // }
          }
        });
    },
    // 品牌认证信息 // 0-2
    getAuthenticateBrandInfo() {
      axios
        .post("/getAuthenticateBrandInfo", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          if (res.authenticateBrandStatus == 1) {
            this.authenticateBrandInfo = res;
          } else {
            this.$router.push({ path: "/brand-inner/create/mini-project" });
            utils.showTip(this, {
              msg: "你还未通过品牌认证，请先完成品牌认证。",
              type: "error"
            });
          }
        });
    },
    // 更新步骤
    computedStep(num) {
      this.stepNum = num;
      if (num == 2) {
        // this.getCreateStatus();
      } else if (num == 4) {
        this.getAuditStatus();
        this.getTestCode();
      }
      this.steps.forEach((res, key) => {
        if (key < num) {
          res.completed = true;
          res.timeColor = "#F52D56";
        } else {
          res.completed = false;
          res.timeColor = "#cccccc";
        }
      });
    },
    // 前往微信授权 1-1
    getRoot() {
      let that = this;
      if (this.myForm.h5Id == "") {
        utils.showTip(this, { msg: "请输入公众号APPID", type: "error" });
        return false;
      }
      if (this.isRoot) {
        this.rootIng = true;
        // this.computedStep(num)
      } else {
        this.rootIng = true;
        axios
          .post("/weapp/getAuthStatus", { appid: that.myForm.h5Id })
          .then(res => {
            if (res.authorized) {
              that.isRoot = true;
              window.clearInterval(that.timer);
              that.timer = null;
              that.rootIng = false;
            } else {
              window.open("https://auth.geeme.cn/doAuth");
              that.getRootState();
            }
          });
      }
    },
    // 查询公众号授权 1-2
    getRootState() {
      let that = this;
      timer = setInterval(function() {
        axios
          .post("/weapp/getAuthStatus", { appid: that.myForm.h5Id })
          .then(res => {
            if (res.authorized) {
              that.isRoot = true;
              window.clearInterval(timer);
              timer = null;
              that.rootIng = false;
            }
          });
      }, 2000);
    },
    // 发起创建小程序 1-3
    createApp() {
      if (!this.isRoot) {
        utils.showTip(this, { msg: "请先完成公众号授权", type: "error" });
        return false;
      }
      if (this.myForm.wxCard == "") {
        utils.showTip(this, { msg: "请输入法人代表微信号", type: "error" });
        return false;
      }
      this.createIng = true;
      let code = this.authenticateBrandInfo.creditCode;
      let legalName = this.authenticateBrandInfo.legalPerson;
      let codeType = code.length == 18 ? 1 : code.length == 9 ? 2 : 3;
      let name = this.authenticateBrandInfo.companyName;
      let wechat = this.myForm.wxCard;
      let authWeappId = this.myForm.h5Id;
      let brandId = this.currentInfo.brandId;
      let param = {
        code,
        legalName,
        name,
        wechat,
        codeType,
        authWeappId,
        brandId
      };
      axios.post("/weapp/create", param).then(res => {
        this.createIng = false;
        if (res.errcode == 0) {
          this.createState = true;
          this.createStateDialog = true;
        } else if (res.errcode == "61070") {
          this.createState = false;
          this.isRoot = false;
          utils.showTip(this, { msg: res.errmsg, type: "error" });
        } else {
          this.createState = false;
          utils.showTip(this, { msg: res.errmsg, type: "error" });
        }
      });
    },
    // 返回上一步
    backToLstStep(num) {
      axios
        .post("/weapp/backToLastStep", { brandId: this.currentInfo.brandId })
        .then(res => {
          if (res.success) {
            this.computedStep(num);
            this.createState = false;
            this.isRoot = false;
          } else {
            utils.showTip(this, { msg: res.message, type: "error" });
          }
        });
    },
    // 获取模板分类 2-0
    async getTempSort() {
      this.sortLoad = true;
      const res = await axios.get(`/getAllWeCategoryForPc`);
      // const res = await axios.get(`/getAllWeCategoryForPc`);
      this.SortOneList = res.ofFirstResponseList;
      this.getTempSortFromBrand();
      // this.SortOneList.forEach(item => {
      //   item.secondResponseList.forEach
      // })
    },
    // 获取品牌对应的模板推荐分类 2-0-1
    async getTempSortFromBrand() {
      const res = await axios.get(
        `/getWeCategoryInfoByBrandId/${this.currentInfo.brandId}`
      );
      // const res = await axios.get(`/getAllWeCategoryForPc`);
      this.sortLoad = false;
      // 将模板限制的类目 回显到所有行业类目中
      this.sortOneConfirm = res.ofFirstResponseList;
      let num = 0;
      this.sortOneConfirm.forEach((item, index) => {
        item.secondResponseList.forEach((i, idx) => {
          this.handleFisrtServeChange(item.wxId, num);
          this.categories.push({
            first: item.wxId,
            second: i.wxId,
            certicates: []
          });
          this.targetServe.push({
            innerList: []
          });
          num++; // 这里是最秀的地方。。
        });
      });
    },
    handleFisrtServeChange(val, index) {
      this.categories[index] ? (this.categories[index].second = null) : false;
      if (!val) {
        this.SortTwoList[index] = [];
        this.categories[index].second = null;
      }
      this.SortOneList.forEach((item, i) => {
        if (item.wxId == val) {
          this.SortTwoList[index] = item.secondResponseList;
        }
      });
    },
    // 二级类目确认事件
    handleSenServeChange(val, index) {
      this.targetServe[index] = {
        innerList: []
      };
      // 切换二级的时候，清空资质栏需要的资质 方便校验
      this.categories[index].certicates = [];
      // 如果一级需要资质，将资质一起传入
      if (this.SortOneList[index].innerList.length) {
        this.targetServe[index].innerList.push(
          ...this.SortOneList[index].innerList
        );
      }
      this.SortTwoList[index].forEach(item => {
        if (item.wxId == val) {
          this.targetServe[index].innerList.push(...item.innerList);
        }
      });
      this.$refs.form.validateField("serviceScope");
    },
    // 新增删除服务类目
    addIcon() {
      if (this.categories.length >= 3) {
        return this.$message.warning("一次最多只能添加3个服务类目");
      }
      this.categories.push({
        first: null,
        second: null,
        certicates: []
      });
      this.targetServe.push({
        innerList: []
      });
      this.SortTwoList[this.categories.length - 1] = [];
      this.$refs.form.validateField("serviceScope");
    },
    deleteIcon(index) {
      if (this.categories.length <= 1) {
        return this.$message.warning("至少需要添加1个服务类目");
      }
      this.categories.splice(index, 1);
      // 注意二级分类的数组也要删除
      this.SortTwoList.splice(index, 1);
      this.targetServe.splice(index, 1);
      this.$refs.form.validateField("serviceScope");
    },
    // 资质上传事件
    async onSuccess(val, item, index, i) {
      this.targetServe[index].innerList[i].key = item.name;
      this.targetServe[index].innerList[i].value = val;
      this.upLoading = true;
      try {
        const res = await axios.post("/weapp/uploadImage", {
          appId: this.myForm.appId,
          mediaUrl: val,
          type: "image"
        });
        if (res.errcode) return this.$message.error("上传图片失败");
        this.$message.success("上传图片成功");
        this.$refs.form.validateField("serviceScope");
      } finally {
        this.upLoading = false;
      }
    },
    seeReference(url) {
      window.open(url, "_block");
    },
    // 获取创建小程序状态 2-1
    getCreateStatus() {
      axios
        .post("/weapp/getCreateWeappStatus", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          if (res.errcode == 0) {
            this.createStatus = true;
          } else {
            this.createStatus = false;
            utils.showTip(this, {
              msg: "创建小程序失败，请返回上一步重新创建。",
              type: "error"
            });
          }
        });
    },
    // 校验appID 2-2
    checkAppId() {
      if (!this.myForm.appId) {
        utils.showTip(this, { msg: "请先输入appId,在校验！", type: "error" });
        return false;
      } else {
        axios
          .post("/weapp/checkAppId", {
            appId: this.myForm.appId,
            brandId: this.currentInfo.brandId
          })
          .then(res => {
            this.checkAppIdIng = true;
            if (res.success) {
              this.isAppId = true;
            } else {
              this.isAppId = false;
            }
          });
      }
    },
    // 校验小程序名称 2-3
    checkName() {
      if (!this.isAppId) {
        this.inputError = true;
        this.errorText = "请先完成小程序APPID校验！";
        return false;
      }
      if (/及美/.test(this.myForm.appName)) {
        this.$message({
          type: "error",
          message: "小程序名称中不得出现‘及美’字样"
        });
        return;
      }
      if (this.myForm.appName != "") {
        axios
          .post("/weapp/checkNickname", {
            appName: this.myForm.appName,
            appId: this.myForm.appId
          })
          .then(res => {
            this.checkAppNameIng = true;
            if (res.errcode == 0) {
              this.isCheckAppName = true;
              this.errorText = "小程序名称检验成功。";
            } else {
              this.isCheckAppName = false;
              this.errorText = "该名称不可用，请修改后重新检查";
            }
          });
      }
    },
    // 修改小程序名称 2-4
    setNickname() {
      this.targetServe.forEach((item, index) => {
        if (item.innerList.length != 0) {
          item.innerList.forEach((e, i) => {
            this.categories[index].certicates[i] = e;
          });
        }
      });
      this.categories.forEach(item => {
        item.certicates.forEach(i => {
          delete i.name;
          delete i.url;
        });
      });
      this.$refs.form.validateField("serviceScope", async valid => {
        if (valid) return;
        // 在这里将服务类目资质上传
        axios
          .post("/weAddCategory", {
            appId: this.myForm.appId,
            // appId: this.myForm.appId,
            brandId: this.currentInfo.brandId,
            categories: this.categories
          })
          .then(response => {
            // 大致会出现两种不可控的错误：1.主体偶尔抽风不允许添加；2.名称检测第一个过了还没用；不大动干戈的情况下只能先如此处理
            if (response.errcode && response.errcode !== 53304) {
              return this.$message.error(
                "添加类目失败：" + response.errmsg.split(" ")[0]
              );
            } else {
              axios
                .post("/weapp/setNickname", {
                  appId: this.myForm.appId,
                  brandId: this.currentInfo.brandId,
                  nickName: this.myForm.appName
                })
                .then(async res => {
                  if (res.audit_id) {
                    this.inputError = true;
                    this.errorText = "小程序名称审核中，请耐心等待。";
                  } else {
                    if (res.errcode == 0) {
                      this.computedStep(this.stepNum + 1);
                    } else if (res.errcode == 91033) {
                      this.inputError = true;
                      this.errorText = "名称不合法，请更换！";
                    } else {
                      this.inputError = true;
                      this.errorText = res.errmsg;
                    }
                  }
                });
            }
          });
        // axios
        //   .post("/weapp/setNickname", {
        //     appId: this.myForm.appId,
        //     brandId: this.currentInfo.brandId,
        //     nickName: this.myForm.appName
        //   })
        //   .then(async res => {
        //     if (res.audit_id) {
        //       this.inputError = true;
        //       this.errorText = "小程序名称审核中，请耐心等待。";
        //     } else {
        //       if (res.errcode == 0) {
        //         // 在这里将服务类目资质上传
        //         axios.post("/weAddCategory", {
        //           appId: this.myForm.appId,
        //           // appId: this.myForm.appId,
        //           brandId: this.currentInfo.brandId,
        //           categories: this.categories
        //         }).then(response => {
        //           if (response.errcode && response.errcode !== 53304) {
        //             return this.$message.error(
        //               "添加类目失败：" + response.errmsg.split(" ")[0]
        //             );
        //           }
        //         })
        //         this.computedStep(this.stepNum + 1);
        //       } else {
        //         this.inputError = true;
        //         this.errorText = res.errmsg;
        //       }
        //     }
        //   });
      });
    },
    // 提交审核 3-1
    submitAudit(formName) {
      if (this.myForm.appDetail && this.myForm.appLogo) {
        let brandId = this.currentInfo.brandId;
        let logo = this.myForm.appLogo;
        let signature = this.myForm.appDetail;
        let param = { brandId, logo, signature };
        // this.computedStep(this.stepNum+1);
        axios.post("/weapp/submitAudit", param).then(res => {
          if (res.success) {
            this.computedStep(this.stepNum + 1);
            // this.getTestCode();
            this.getAuditStatus();
          } else {
            // this.computedStep(this.stepNum+1);
            utils.showTip(this, { msg: res.message, type: "error" });
          }
        });
      }
    },
    // 查询审核状态 4-1
    getAuditStatus() {
      let that = this;
      axios
        .post("/weapp/getAuditStatus", {
          appId: that.myForm.appId,
          brandId: that.currentInfo.brandId
        })
        .then(res => {
          if (res.status || res.status == 0) {
            that.auditStatus = res.status;
          }
        });
    },
    // 获取小程序体验版 5-2
    getTestCode() {
      let that = this;
      axios
        .get("/weapp/getTestingQrcode/" + this.myForm.appId, {
          responseType: "blob"
        })
        .then(res => {
          setTimeout(function() {
            let webAppCode = document.getElementById("TestAppCode");
            let img = document.createElement("img");
            img.onload = function(e) {
              window.URL.revokeObjectURL(img.src);
            };
            img.src = window.URL.createObjectURL(res);
            webAppCode.appendChild(img);
          }, 500);
        });
    },
    // 确认发布 5-1
    release() {
      axios
        .post("/weapp/release", { brandId: this.currentInfo.brandId })
        .then(res => {
          if (res.success) {
            this.getReleaseCode();
          } else {
            utils.showTip(this, { msg: res.message, type: "error" });
          }
        });
    },
    // 获取正式版小程序二维码 5-2
    getReleaseCode() {
      axios
        .post("/weapp/getWeappQr", {
          appId: this.myForm.appId,
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          if (res.success) {
            this.releaseCode = res.fileKey;
            this.createSuccess = true;
          } else {
            utils.showTip(this, { msg: res.message, type: "error" });
          }
        });
    },
    // 如何获取引导页
    howToGet(type) {
      console.log(type);
      this.howGet = true;
      if (type == "phone") {
        this.dialogObj = {
          width: "500px",
          wh: 246,
          hw: 438,
          img: require("@/assets/images/img_gain_01.png")
        };
      } else if (type == "h5Id") {
        this.dialogObj = {
          width: "1000px",
          wh: 960,
          hw: 681,
          img: require("@/assets/images/img_gain_02.png")
        };
      } else if (type == "appId") {
        this.dialogObj = {
          width: "500px",
          wh: 246,
          hw: 438,
          img: require("@/assets/images/img_gain_03.png")
        };
      } else if (type == "example") {
        this.dialogObj = {
          width: "500px",
          wh: 246,
          hw: 438,
          img: require("@/assets/images/img_gain_04.png")
        };
      }
    },
    inputBlur(val) {
      if (val == "") {
        this.inputError = true;
        this.errorText = "请输入小程序名称";
      } else {
        this.inputError = false;
      }
    },
    download(key) {
      axios
        .get("/downloadPicture/" + key, { responseType: "blob" })
        .then(res => {
          let img = document.createElement("img");
          img.onload = function(e) {
            window.URL.revokeObjectURL(img.src);
          };
          img.src = window.URL.createObjectURL(res);
          let a = document.createElement("a"); // 生成一个a元素
          let event = new MouseEvent("click"); // 创建一个单击事件
          a.download = key || "photo"; // 设置图片名称
          a.href = img.src; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
        });
    },
    closeBack() {
      this.$router.push("/brand-inner/store/info/mini-project");
    }
  },
  computed: {
    currentInfo() {
      this.myForm.appLogo = this.$store.state.manage.currentInfo.brandLogo;
      return this.$store.state.manage.currentInfo;
    }
  },
  destroyed() {
    window.clearInterval(timer);
    timer = null;
  }
};
</script>
<style lang="scss" scoped>
#createMini {
  width: 100%;
  height: 100%;
  .miniHeader {
    height: 65px;
    margin-bottom: 20px;
  }
  /deep/ .el-dialog {
    border-radius: 6px;
  }
}
.mainContent {
  width: 1400px;
  margin: auto;
  min-height: calc(100vh - 145px);
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  box-sizing: content-box;
  .createStep {
    height: 115px;
    border: 1px solid #f0f1f4;
    box-sizing: border-box;
    padding: 10px 100px;
  }
  .formInfo {
    margin-top: 40px;
    .el-input {
      width: 300px;
      margin-right: 20px;
    }
    .el-textarea {
      width: 500px;
    }
    .formText {
      color: #999999;
      font-size: 12px;
      height: 40px;
    }
    .formPerror {
      color: #f52d56;
    }
    .formSuccess {
      color: #00cf82;
    }
    .formTips {
      color: #58c9f3;
      cursor: pointer;
      padding-left: 5px;
      font-size: 12px;
    }
    .primary {
      background: #58c9f3;
      color: #fff;
      &:hover {
        background-color: rgba(83, 190, 230, 1);
      }
      &:active {
        background-color: #54b1d3;
      }
    }
    /deep/ .el-button--small {
      padding: 11.5px 20px;
      border-radius: 4px;
    }
    .checkState {
      margin-left: 10px;
      i {
        margin-right: 5px;
      }
    }
    .tip {
      width: 600px;
      line-height: 20px;
      font-size: 12xp;
      color: #999999;
      line-height: 20px;
      padding-top: 15px;
    }
    .limitNum {
      position: relative;
      right: 60px;
      bottom: -5px;
      color: #ccc;
    }
    /deep/ .avatar-uploader {
      background: #fff;
    }
    .rootIconIng {
      color: #999;
      position: relAtive;
      padding-left: 20px;
      &:before {
        height: 16px;
        width: 16px;
        content: "";
        display: block;
        left: 0;
        top: 0px;
        position: absolute;
        background: url("../../../assets/images/default/loading.gif") no-repeat;
        background-size: cover;
      }
      i {
        display: none;
      }
    }
  }
  .rootIng {
    width: 500px;
    margin: auto;
    margin-top: 111px;
    h2 {
      font-size: 22px;
      color: #333;
      margin-bottom: 20px;
      i {
        font-size: 50px;
        position: relative;
        top: 10px;
        &.ing {
          color: #ffac32;
        }
        &.success {
          color: #00cf82;
        }
        &.error {
          color: #f52d56;
        }
      }
    }
    .img {
      width: 160px;
      height: 160px;
      margin-bottom: 20px;
      /deep/ img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      line-height: 34px;
      color: rgba(51, 51, 51, 1);
      font-size: 14px;
      text-align: left;
      padding-bottom: 20px;
      span {
        color: #58c9f3;
        cursor: pointer;
      }
    }
    .el-button {
      margin-right: 15px;
    }
  }
  .release {
    width: 500px;
    margin: auto;
    margin-top: 111px;
    dl {
      display: flex;
      dt {
        margin-right: 15px;
        i {
          font-size: 50px;
          color: #ff6d61;
        }
      }
      dd {
        h2 {
          font-size: 20px;
          color: #333;
        }
        p {
          padding-top: 10px;
          font-size: 14px;
          color: #666;
        }
      }
    }
    .el-button {
      margin-left: 65px;
      margin-top: 40px;
    }
  }
}
.dialogImg {
  display: block;
  margin: auto;
}
.createSuccess {
  .img {
    width: 205px;
    height: 205px;
    margin: auto;
    /deep/ img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    width: 249px;
    font-size: 16px;
    color: #333;
    margin: auto;
    text-align: center;
    line-height: 26px;
    padding-top: 17px;
  }
  .btn {
    width: 102px;
    height: 40px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 22px;
  }
}

.deleteIcon {
  font-size: 20px;
  cursor: pointer;
  line-height: 20px;
  vertical-align: -20%;
  margin-left: 10px;
}

.addIcon {
  font-size: 18px;
  cursor: pointer;
  line-height: 18px;
  vertical-align: -20%;
  margin-left: 10px;
  color: #58c9f3;
}

.deleteIcon:hover {
  color: #f52d56 !important;
}
.addIcon:hover {
  color: #0086ff;
}

.sort-box {
  margin-bottom: 20px;
  .sort-item {
    + .sort-item {
      margin-top: 10px;
    }
  }
}

.servive-scope {
  /deep/ .el-form-item__error {
    color: #f56c6c;
  }
}

.upload-content {
  .example {
    width: 115px;
    height: 160px;
    margin: 30px 50px 0 0;
  }
}
</style>
<style lang="scss">
.el-popup-parent--hidden {
  padding-right: 0 !important;
}
.textColor .el-form-item__error {
  color: #fff;
}
.el-button {
  &.warning {
    background: #bec3c6;
    color: #fff;
    &:hover {
      background: #bec3c6;
      color: #fff;
    }
  }
}
</style>