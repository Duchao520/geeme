<template>
  <div class="open-up-page text-for-copy">
    <div class="header-center">
      <center-header
        title="开通微信支付"
        :backing="'返回'"
        :isSelfSite="true"
      ></center-header>
    </div>
    <div class="content-wrap">
      <div class="content">

        <div class="order-steps" v-if="paymentAccountSubmissionInfo.processInfoList">
          <order-steps
            class="step"
            timeColor="#999999"
            :steps="paymentAccountSubmissionInfo.processInfoList"
          ></order-steps>
        </div>
        <div class="form-info">
          <el-form ref="paymentAccountSubmissionInfo" :rules="formRules" :model="paymentAccountSubmissionInfo"
                   label-width="120px">
            <transition name="el-zoom-in-top">
              <div class="warn" v-if="paymentAccountSubmissionInfo.statusId===0">
                <i style="color:#F52D56;margin-right:12px;" class="icon iconfont icon-icon_popup_plaint"></i>
                <span>
                审核未通过。驳回原因：{{paymentAccountSubmissionInfo.failReason || '无'}}
              </span>
              </div>
            </transition>
            <h5>联系信息</h5>
            <div class="form-box">
              <el-form-item label="联系人姓名" prop="contactName">
                <el-input v-model="paymentAccountSubmissionInfo.contactName" placeholder="请输入姓名"
                          style="width: 200px;"></el-input>
                <p class="reminder">请填写商户微信支付业务联系人的真实姓名，微信官方会在微信签约时进行实名认证</p>
              </el-form-item>
              <el-form-item label="手机号码" prop="telephone" class="telephone">
                <el-input v-model="paymentAccountSubmissionInfo.telephone" placeholder="请输入手机号码" style="width: 200px;"
                          maxlength="11">
                  <span class="prefix" slot="prefix">+86∨</span>
                </el-input>
                <p class="reminder">用于接收微信支付的重要管理信息及日常操作验证码，微信官方会在微信签约时进行短信验证</p>
              </el-form-item>
              <el-form-item label="常用邮箱" prop="email">
                <el-input v-model="paymentAccountSubmissionInfo.email" placeholder="请输入常用邮箱"
                          style="width: 200px;"></el-input>
                <p class="reminder">非常重要！用于接收微信支付的账号密码</p>
              </el-form-item>
            </div>

            <h5>经营信息</h5>
            <div class="form-box">
              <el-form-item label="商户简称" prop="merchantName">
                <el-input v-model="paymentAccountSubmissionInfo.merchantName" placeholder="请输入商户简称"
                          style="width: 200px;"></el-input>
                <p class="reminder">该简称将在支付完成页向买家展示，需与微信经营类目相关</p>
              </el-form-item>
              <el-form-item label="经营类目" prop="categoryId">
                <p class="tips">你已选择：个体工商户 > 休闲娱乐 > 美发/美容/美甲店 <a target="_blank"
                                                                 href="https://kf.qq.com/faq/140225MveaUz1506122ueYnE.html"
                                                                 class="link">如何选择正确的类目？</a></p>
                <el-select v-model="paymentAccountSubmissionInfo.categoryId" filterable placeholder="请选择"
                           :popper-append-to-body="false"
                           :filter-method="onFilterCategory"
                           @change="changeCategory"
                >
                  <el-option
                    v-for="(item,index) in filterCategory"
                    :key="index"
                    :label="item.levelThird"
                    :value="item.id">
                  </el-option>
                </el-select>
                <p class="reminder">
                  请根据你的营业执照和实际售卖商品来选择主体和类目，审核通过后类目不可修改
                  <a target="_blank" href="https://kf.qq.com/faq/140225MveaUz1504092YFjeM.html" class="link">结算规则</a>
                </p>
              </el-form-item>
              <el-form-item label="门店地址" prop="storeAddress"
                            :rules="{required:validatorJson.placeRequire,message:'请输入门店地址'}">
                <el-input v-model="paymentAccountSubmissionInfo.storeAddress" placeholder="请输入公众号/小程序名称"
                          style="width: 400px;"></el-input>
                <p class="reminder">请输入门店地址</p>
              </el-form-item>

              <el-form-item label="公众号/小程序名称" prop="programName" class="multi-line">
                <el-input v-model="paymentAccountSubmissionInfo.programName" placeholder="请输入公众号/小程序名称"
                          style="width: 400px;"></el-input>
                <p class="reminder">公众号/小程序必须有内容，能清晰介绍公众号业务及支付功能使用场景</p>
              </el-form-item>
              <el-form-item label="特殊资质" prop="specialQualifications"
                            :rules="{required:validatorJson.specialRequire,message:'请上传特殊资质相关图片'}">
                <div class="inner-image-box">
                  <upload-image v-model="paymentAccountSubmissionInfo.specialQualifications" :size="2"></upload-image>
                  <p class="reminder">如涉及医疗美容技术内容需提供《医疗机构执业许可证》
                    支持jpg，png格式，大小不超过2M；点击图片可重新上传。</p>
                </div>
              </el-form-item>
              <el-form-item label="售卖商品/提供服务概述" prop="productServiceDescription" class="multi-line">
                <input-with-count type="textarea" :autosize="{ minRows: 4, maxRows: 6}" style="width: 400px;"
                                  v-model="paymentAccountSubmissionInfo.productServiceDescription"
                                  placeholder="请输入售卖商品/提供服务概述" :length="120"></input-with-count>
                <p class="reminder">请简述售卖的商品或提供的服务，必须在营业执照经营范围内，且与所选类目一致，
                  请勿直接照抄营业执照中的经营范围，否则将导致申请被驳回 <a target="_blank"
                                                 href="https://kf.qq.com/faq/140225MveaUz1506122ueYnE.html"
                                                 class="link">查看填写指引</a></p>
              </el-form-item>
              <el-form-item label="客服电话" prop="serviceTel">
                <el-input v-model="paymentAccountSubmissionInfo.serviceTel" placeholder="请输入客服电话"
                          style="width: 200px;"></el-input>
                <p class="reminder">
                  请正确填写客服电话，座机务必填写区号，格式如（座机：0755-XXXXXXXX；手机：136XXXXXXXX；400电话：400XXXXXXX）</p>
              </el-form-item>
              <el-form-item label="补充材料">
                <div class="inner-image-box">
                  <el-upload
                    :action="uploadUrl"
                    :headers="myHeaders"
                    list-type="picture-card"
                    multiple
                    :on-success="handleRichImagesSuccess"
                    :before-upload="examineImage"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRichImagesRemove"
                    :file-list="paymentAccountSubmissionInfo.supplementaryMaterialImages"
                    :limit="5"
                    :on-exceed="carouselExceed"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <p class="reminder">请上传相关照片或截图来说明你的售卖商品场景，必须为彩色图片（文档请截图后上传）。
                    另外，在整个申请流程中，遇到需提供资料但无上传入口的情况，都可在此处上传。
                    最多5张，单张大小不超过2M，支持jpg，png格式，点击图片可重新上传。
                    <a target="_blank" href="https://kf.qq.com/faq/170807nY7Jbi170807Yf6jIB.html"
                       class="link">查看补充材料说明</a>
                  </p>
                </div>
              </el-form-item>
            </div>

            <h5>结算账户</h5>
            <div class="form-box">
              <el-form-item label="账户类型" prop="accountType">
                <el-radio-group v-model="paymentAccountSubmissionInfo.accountType">
                  <el-radio :label="true">对公账户</el-radio>
                  <el-radio :label="false">对私账户</el-radio>
                </el-radio-group>
                <p class="reminder">除个体工商户可填写对私账户外，其余均需选择对公账户</p>
              </el-form-item>
              <el-form-item label="开户名称" prop="accountName">
                <el-input v-model="paymentAccountSubmissionInfo.accountName" placeholder="请输入开户名称"
                          style="width: 200px;"></el-input>
                <p class="reminder">请准确填写经营主体的开户名称，个体工商户请填写经营者姓名</p>
              </el-form-item>
              <el-form-item label="开户银行" prop="openBank">
                <el-input v-model="paymentAccountSubmissionInfo.openBank" placeholder="请输入开户银行"
                          style="width: 200px;"></el-input>
                <p class="reminder">请填写开户银行全称</p>
              </el-form-item>
              <el-form-item label="开户支行" prop="bankBranch">
                <el-input v-model="paymentAccountSubmissionInfo.bankBranch" placeholder="请输入开户支行"
                          style="width: 200px;"></el-input>
                <p class="reminder">请填写开户支行名称（不必再填开户银行全称）</p>
              </el-form-item>
              <el-form-item label="银行账号" prop="bankAccount">
                <el-input type="number" v-model="paymentAccountSubmissionInfo.bankAccount" placeholder="请输入银行账号"
                          style="width: 200px;"></el-input>
                <p class="reminder">请准确填写经营主体的开户银行账号，否则将导致审核失败</p>
              </el-form-item>
            </div>

          </el-form>
          <div class="buttons">
            <el-button class="normal_blue_btn" @click="confirmSubmit" :loading="submitLoading">确认提交</el-button>
            <!--<el-button class="normal_light_gray_btn">取消</el-button>-->
          </div>
        </div>

      </div>
    </div>
    <el-dialog :visible="dialogVisible" width="790px" @close="dialogVisible = false">
      <img style="display:block;max-width: 750px" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
  import {reg, checkReg} from "@/assets/js/RegExp";
  import {mapState} from "vuex";
  import * as api from "@/assets/js/interface";
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";

  export default {
    data() {
      let mobileBlurValidator = (rule, value, callback) => {
        if (checkReg(reg.phone, value)) {
          callback();
        } else {
          callback("手机号格式不正确");
        }
      };
      let mailboxValidator = (rule, value, callback) => {
        if (checkReg(reg.email, value)) {
          callback();
        } else {
          callback("邮箱格式不正确");
        }
      };
      return {
        filterCategoryWord: '',
        categoryInfos: [],
        submitLoading: false,
        dialogImageUrl: "",
        dialogVisible: false,
        validatorJson: {
          placeRequire: false,
          specialRequire: false
        },
        paymentAccountSubmissionInfo: {
          id: null,
          contactName: "",
          telephone: "",
          email: "",
          storeAddress: null,
          merchantName: "",
          categoryId: null,
          enterpriseType: "",
          sortOne: null,
          sortTwo: null,
          businessScene: [],
          programName: "",
          specialQualifications: "",
          productServiceDescription: "",
          serviceTel: "",
          supplementaryMaterialImages: [],
          accountName: "",
          accountType: true,
          openBank: "",
          bankAccount: "",
          bankBranch: "",
          processInfoList: null
        },
        formRules: {
          contactName: {required: true, message: "请输入联系人姓名"},
          telephone: {required: true, validator: mobileBlurValidator},
          email: {required: true, validator: mailboxValidator},
          merchantName: {required: true, message: "请输入商户简称"},
          categoryId: {required: true, message: "请选择经营类目"},
          businessScene: {required: true, message: "请选择售卖商品场景"},
          programName: {required: true, message: "请输入公众号/小程序名称"},
          productServiceDescription: {required: true, message: "请输入售卖商品/提供服务概述"},
          serviceTel: {required: true, message: "请输入客服电话"},
          accountName: {required: true, message: "请输入开户名称"},
          openBank: {required: true, message: "请输入基本开户行"},
          bankAccount: {required: true, message: "请输入开户银行全称"},
          bankBranch: {required: true, message: "请填写开户银行支行名称"}
        }
      }
    },
    computed: {
      filterCategory() {
        return this.categoryInfos.filter(item => item.levelThird.includes(this.filterCategoryWord))
      },
      ...mapState({
        currentInfo: state => state.manage.currentInfo
      }),
      uploadUrl() {
        return api.uploadPicture.URL;
      },
      myHeaders() {
        return utils.getUploadHeader();
      },
    },
    watch:{
      "paymentAccountSubmissionInfo.supplementaryMaterialImages"(data){
        let len = data.length;
        document.getElementsByClassName(
          "el-upload el-upload--picture-card"
        )[0].style.display = len >= 5 ? "none" : "inline-block";
      }
    },
    mounted() {
      this.getBusinessCategory();
      this.getDetail()
    },
    methods: {
      getDetail() {
        let query = this.$route.query;
        if (query.detail) {
          axios.post("/getSubmitDetail", {
            id: Number(query.id)
          }).then(res => {
            this.paymentAccountSubmissionInfo = {
              ...res.submitDetailInfo,
              supplementaryMaterialImages: res.submitDetailInfo.supplementaryMaterials.split(",").map(item => {
                return {
                  name: `${Math.random()}`,
                  url: utils.formatPicImg(item)
                };
              }),
              processInfoList:res.processInfoList.map(item=>({
                name:item.processName,
                time:item.localDateTime,
                completed:!!item.localDateTime
              }))
            }
          })
        }
      },
      getBusinessCategory() {
        axios.post("/getCategory", {}).then(res => {
          this.categoryInfos = res.categoryInfos;
        })
      },
      onFilterCategory(val) {
        this.filterCategoryWord = val;
      },
      confirmSubmit() {

        this.$refs.paymentAccountSubmissionInfo.validate(valid => {

          if (valid) {
            let param = {
              paymentAccountSubmissionInfo: {
                ...this.paymentAccountSubmissionInfo,
                brandId: this.currentInfo.brandId,
                payMethodId: Number(this.$route.query.payMethodId),
                supplementaryMaterials: this.paymentAccountSubmissionInfo.supplementaryMaterialImages.map(item =>
                  item.response
                    ? item.response.fileKey
                    : item.url.split("/").pop()
                )
                  .join(",")
              },
            };
            this.submitLoading = true;
            axios.post("/submitOpenAccount", param).then(res => {
              this.submitLoading = false;
              this.$message({
                type: res.success ? "success" : "warning",
                message: res.message
              });
              if (res.success) {
                this.$router.go(-1)
              }
            })
          }
        });
      },
      changeCategory(id) {
        let data = this.categoryInfos.filter(item => item.id === id)[0];
        this.validatorJson = {
          placeRequire: data.placeRequire,
          specialRequire: data.specialRequire,
        }
      },
      handleRichImagesSuccess(res, file, fileList) {
        this.paymentAccountSubmissionInfo.supplementaryMaterialImages = fileList;
      },
      handleRichImagesRemove(file, fileList) {
        this.paymentAccountSubmissionInfo.supplementaryMaterialImages = fileList;
      },
      beforeUpload(file, size) {
        const isJPG = utils.checkImgTypes(file.type);
        const isLt2M = file.size / 1024 / 1024 <= size;
        if (!isJPG) {
          this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error(`上传图片大小不能超过${size}M!`);
        }
        return isJPG && isLt2M;
      },
      examineImage(file) {
        return this.beforeUpload(file, 2);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      carouselExceed(files, fileList) {
        if (files.length + fileList.length > 5) {
          this.$message.error("最多上传5张");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .open-up-page {
    padding-top: 85px;

    .content-wrap {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .content {
        max-width: 1400px;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
        margin: 0 auto;
        box-sizing: border-box;
        padding: 16px 20px 16px 40px;

        .order-steps {
          padding: 0 160px;
          box-sizing: border-box;
        }

        .form-info {
          .warn {
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            color: #333333;
            background: #fee0e6;
            box-sizing: border-box;
            padding: 0 10px;
            border-radius: 4px;
            margin-top: 20px;
          }

          h5 {
            margin: 20px 0 8px;
            color: #333333;
            line-height: 22px;
            font-size: 16px;
          }

          .form-box {
            border-radius: 2px;
            border: 1px solid rgba(240, 241, 244, 1);
            padding: 20px 20px 0;

            .el-form-item {
              margin-bottom: 18px;

              .tips, .reminder {
                font-size: 12px;
                color: #999999;
              }

              .reminder {
                line-height: 20px;
                margin-top: 5px;
              }

              .link {
                cursor: pointer;
                color: #58C9F3;
              }

              /deep/ .el-input__prefix {
                color: #333333;
              }

              .inner-image-box {
                border-radius: 4px;
                border: 1px solid rgba(240, 241, 244, 1);
                box-sizing: border-box;
                padding: 20px 20px 10px;
                max-width: 540px;

                /deep/ .el-upload-list__item, /deep/ .el-upload.el-upload--picture-card {
                  width: 100px;
                  height: 100px;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;

                  img {
                    width: 100px;
                    height: 100px;
                    display: block;
                    box-sizing: border-box;
                  }

                  .el-icon-plus {
                    font-size: 30px;
                    font-weight: 600;
                    color: #8C939D;
                  }
                }

                /deep/ .el-upload-list, /deep/ .el-upload-list__item {
                  display: inline-block;
                }
              }
            }

            .el-form-item.telephone {
              /deep/ .el-input__inner {
                padding-left: 40px;
              }
            }

            .el-form-item.multi-line {
              /deep/ .el-form-item__label {
                line-height: 20px;
              }
            }
          }

          .buttons {
            margin-top: 40px;
          }
        }
      }
    }
  }

</style>

