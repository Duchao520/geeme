<template>
  <!-- 品牌认证: 代码在pages/shopManagement/BasicInfo.vue 中 -->
  <div class="brand-auth-box">
    <center-header title="品牌认证" :backing="'返回'" :isSelfSite="true"></center-header>
    <div class="con">
      <div class="steps">
        <order-steps :steps="steps"></order-steps>
      </div>
      <div class="form-con">
        <div class="warn" v-if="detail.authenticateBrandStatus===3">
          <i style="color:#F52D56;margin-right:12px;" class="icon iconfont icon-icon_popup_plaint"></i>
          <span>
            品牌认证审核未通过。退回原因：{{detail.verifyComment || '无'}}
          </span>
        </div>
        <el-form class="form" ref="detail" :model="detail" label-width="120px" :rules="formRules">
          <el-form-item label="品牌名称">
            <span>{{currentInfo.brandName}}</span>
          </el-form-item>
          <el-form-item label="所属行业">
            <span>{{currentInfo.belongTo}}</span>
          </el-form-item>
          <el-form-item label="商家名称" prop="companyName">
            <el-input v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3" v-model="detail.companyName" style="width:300px" maxlength='30' placeholder="请填写营业执照上的全称"></el-input>
            <span v-else>{{detail.companyName}}</span>
          </el-form-item>
          <el-form-item label="统一信用代码" prop="creditCode">
            <el-input v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3" placeholder="请填写营业执照上的信用代码" v-model="detail.creditCode" maxlength="18" style="width:300px"></el-input>
            <span v-else>{{detail.creditCode}}</span>
          </el-form-item>
          <el-form-item  label="法人代表姓名" prop="legalPerson" >
            <el-input v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3" placeholder="请填写法定代表人姓名" v-model="detail.legalPerson" maxlength='30' style="width:300px"></el-input>
            <span v-else>{{detail.legalPerson}}</span>
          </el-form-item>
          <el-form-item label="营业执照" prop="licenseImage" class="license-image">
            <div class="image-box" v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3">
              <!-- <upload-image v-model="detail.licenseImage" tip="支持jpg，png格式，大小不超过2M；点击图片可重新上传" :size=2></upload-image> -->
              <g-upload-mpic tip='支持jpg，png格式，大小不超过2M；' :photo-list='detail.licenseImage?[detail.licenseImage] : []' @change='updateImg' type='licenseImage' :size='2'></g-upload-mpic>
              <div class="reference-image">
                <img class="image" src="@/assets/images/referenceImage/img_certificate01.png" alt>
                <span>参考图样</span>
              </div>
            </div>
            <img v-else @click='handlePictureCardPreview({url:utils.formatPicImg(detail.licenseImage)})' width='106' :src="utils.formatPicImg(detail.licenseImage)" alt="">
          </el-form-item>
          <el-form-item label="法人身份证（正面）" prop="identityCardFront" class="license-image identify" label-width="100px" style="margin-left:20px">
            <div class="image-box" v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3">
              <!-- <upload-image v-model="detail.identityCardFront" tip="支持jpg，png格式，大小不超过2M；点击图片可重新上传" :size=2></upload-image> -->
              <g-upload-mpic tip='支持jpg，png格式，大小不超过2M；' :photo-list='detail.identityCardFront?[detail.identityCardFront] : []' @change='updateImg' type='identityCardFront' :size='2'></g-upload-mpic>
              <div class="reference-image">
                <img class="image" src="@/assets/images/referenceImage/img_id01.png" alt>
                <span>参考图样</span>
              </div>
            </div>
            <img v-else @click='handlePictureCardPreview({url:utils.formatPicImg(detail.identityCardFront)})' width='140' :src="utils.formatPicImg(detail.identityCardFront)" alt="">
          </el-form-item>
          <el-form-item label="法人身份证（反面）" prop="identityCardBack" class="license-image identify" label-width="100px" style="margin-left:20px">
            <div class="image-box" v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3">
              <!-- <upload-image v-model="detail.identityCardBack" tip="支持jpg，png格式，大小不超过2M；点击图片可重新上传" :size=2></upload-image> -->
              <g-upload-mpic tip='支持jpg，png格式，大小不超过2M；' :photo-list='detail.identityCardBack?[detail.identityCardBack] : []' @change='updateImg' type='identityCardBack' :size='2'></g-upload-mpic>
              <div class="reference-image">
                <img class="image" src="@/assets/images/referenceImage/img_id02.png" alt>
                <span>参考图样</span>
              </div>
            </div>
            <img v-else @click='handlePictureCardPreview({url:utils.formatPicImg(detail.identityCardBack)})' width='140' :src="utils.formatPicImg(detail.identityCardBack)" alt="">
          </el-form-item>

          <el-form-item label="商标证件">
            <div class="image-box" v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3">
              <!-- <upload-image
                v-model="detail.logeCredentialsImage"
                tip="支持jpg，png格式，大小不超过2M；点击图片可重新上传"
                :size=2
              ></upload-image> -->
              <g-upload-mpic tip='支持jpg，png格式，大小不超过2M；' :photo-list='detail.logeCredentialsImage?[detail.logeCredentialsImage] : []' @change='updateImg' type='logeCredentialsImage' :size='2'></g-upload-mpic>
              <div class="reference-image">
                <img class="image" src="@/assets/images/referenceImage/img_certificate02.png" alt>
                <span>参考图样</span>
              </div>
            </div>
             <img v-else @click='handlePictureCardPreview({url:utils.formatPicImg(detail.logeCredentialsImage)})' width='140' :src="utils.formatPicImg(detail.logeCredentialsImage)" alt="">
          </el-form-item>

          <el-form-item label="行业资质" class="images">
            <div id="picCard" v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3">
              <el-upload
                :action="uploadUrl"
                :headers="myHeaders"
                list-type="picture-card"
                multiple
                :on-exceed="lunboExceed"
                :on-success="handleLunBoSuccess"
                :before-upload="beforeLunBoUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleLunBoRemove"
                :file-list="detail.certificationImages"
                :limit="8"
                :class='{hideUpload:detail.certificationImages.length>=8}'
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <p class="upload-tip">在此提交行业资质文件，可上传最多8个文件。支持jpg，png格式，大小不超过2M；</p>
            </div>
            <div v-else>
              <img @click='handlePictureCardPreview({url:utils.formatPicImg(item.url)})'  v-for='(item,key) in detail.certificationImages' :key='key' :src="utils.formatPicImg(item.url)" width='100' height='100' alt="" style='margin-right: 10px;'>
            </div>
          </el-form-item>
          <el-form-item label="备注说明" style="width:520px;margin-bottom:20px">
            <input-with-count
             v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3"
              :length="200"
              placeholder="请输入备注说明"
              :autosize="{ minRows: 5, maxRows: 100}"
              v-model="detail.remarks"
            ></input-with-count>
            <span v-else>{{detail.remarks}}</span>
          </el-form-item>
          <el-form-item class="buttons">
            <el-button style="background:#58C9F3" v-if="detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3" @click="confirmSubmit">确认提交</el-button>
            <el-button style="color:#666666" @click="$router.go(-1)">{{detail.authenticateBrandStatus == 0 || detail.authenticateBrandStatus==3 ?'取消': '返回'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      style="min-width:100px;"
      :visible.sync="dialogVisible"
      :before-close="dialogBeforeClose"
    >
      <img width="100%" :src="currentImage" alt>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';
import * as utils from "@/assets/js/utils";
import CenterHeader from "@/components/common/CenterHeader";
import * as datas from "@/assets/js/datas";
export default {
  components: {
    "center-header": CenterHeader
  },
  data() {
    let companyNameValidator = (rules, value, callback) => {
      if (!value) {
        callback(new Error("请输入商家名称"));
      } else if (value.indexOf('（') !== -1 || value.indexOf('）') !== -1) {
        callback(new Error("括符请用半角格式(即英文的括符)"));
      } else {
        callback();
      }
    }
    return {
      utils: utils,
      detail: {
        authenticateBrandStatus: 0,
        brandId: 1,
        companyName:null,
        creditCode:null,
        legalPerson:null,
        identityCardFront:null,
        identityCardBack:null,
        certificationImages: [],
        commitTime: null,
        licenseImage: null,
        logeCredentialsImage: null,
        remarks: null,
        userId: null,
        verifyFailReason: null,
        verifyStartTime: null,
        verifyStopTime: null,
        verifyComment: null
      },
      formRules: {
        licenseImage: [
          { required: true, trigger: "change", message: "请上传营业执照" }
        ],
        identityCardFront: [
          { required: true, trigger: "change", message: "请上传法人身份证正面照片" }
        ],
        identityCardBack: [
          { required: true, trigger: "change", message: "请上传法人身份证反面照片" }
        ],
        companyName:[{required:true,trigger:"change", validator: companyNameValidator},{required:true,trigger:"blur", validator: companyNameValidator}],
        creditCode:[{required:true,trigger:"change",message:"请填写营业执照上的信用代码"},{required:true,trigger:"blur",message:"请填写营业执照上的信用代码"}],
        legalPerson:[{required:true,trigger:"change",message:"请填写法定代表人姓名"},{required:true,trigger:"blur",message:"请填写法定代表人姓名"}]
      },
      currentImage: "",
      dialogVisible: false,
    };
  },
  computed: {
    steps() {
      return [
        {
          name: "提交材料",
          time: this.detail.commitTime,
          completed: true,
          titleColor: '#333333',
          timeColor: '#999999',
          successColor: '#00CF82',
          showIconDefault: false,
          icon: 'icon-icon_order_success',
        },
        {
          name: "审核中",
          time: this.detail.verifyStartTime,
          completed: this.detail.authenticateBrandStatus == 2 || this.detail.authenticateBrandStatus == 1 ? true : false,
          titleColor: '#333333',
          timeColor: '#999999',
          successColor: '#58C9F3',
          showIconDefault: true,
          icon: 'icon-icon_wait',
        },
        {
          name: "审核完成",
          time: this.detail.verifyStopTime,
          completed: this.detail.authenticateBrandStatus == 1 ? true : false,
          titleColor: '#333333',
          timeColor: '#999999',
          successColor: '#00CF82',
          showIconDefault: false,
          icon: 'icon-icon_order_success',
        }
      ];
    },
    state() {
      return this.$store.state;
    },
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
  },
  watch: {
    "detail.licenseImage"(val) {
      if (!val) {
        return;
      } else {
        this.$refs.detail.validateField("licenseImage");
      }
    }
  },
  mounted() {
    this.getAuthenticateBrandInfo();
  },
  methods: {
    updateImg(file,type) {
      this.detail[type] = file[0] ? file[0] : null
    },
    lunboExceed(files, fileList) {
      if (files.length + fileList.length > 5) {
        this.$message.error("最多上传8张");
      }
    },
    handleLunBoSuccess(res, file, fileList) {
      this.detail.certificationImages = fileList;
      this.toggleUpload()
    },
    toggleUpload(tag) {
      let items = ((document.getElementById('picCard').getElementsByTagName('ul'))[0]).children
      let dom = (document.getElementById('picCard').getElementsByClassName('el-upload--picture-card'))[0]
      if (tag && tag === 'del') { dom.style.display="inline-block"; return }
      if (items.length > 7) { dom.style.display="none"; return } /* else {
        dom.style.display="inline-block"
      } */
    },
    beforeLunBoUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2M!");
      }
      return isJPG && isLt2M;
    },
    handlePictureCardPreview(data) {
      this.currentImage = data.url;
      this.dialogVisible = true;
    },
    handleLunBoRemove(file) {
      let fileKey = file.response.fileKey;
      this.detail.certificationImages.forEach((item, index) => {
        let reg = new RegExp(fileKey);
        if (reg.test(item)) {
          this.detail.certificationImages.splice(index, 1);
        }
      });
      this.toggleUpload('del')
    },
    authenticateBrand() {
      let imageStr = "";
      this.detail.certificationImages.forEach((item, index) => {
        let fileKey = item.response
          ? item.response.fileKey
          : item.url.split("/").pop();
        imageStr +=
          index === this.detail.certificationImages.length - 1
            ? fileKey
            : fileKey + ",";
      });
      axios.post(
        api.authenticateBrand.URL,
        {
          brandId: this.currentInfo.brandId,
          certificationImages: imageStr,
          licenseImage: this.detail.licenseImage,
          logeCredentialsImage: this.detail.logeCredentialsImage,
          remarks: this.detail.remarks,
          companyName:this.detail.companyName,
          creditCode:this.detail.creditCode,
          legalPerson:this.detail.legalPerson,
          identityCardBack:this.detail.identityCardBack,
          identityCardFront:this.detail.identityCardFront,
        }).then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.$router.push("/center/brands");
          } else {
            utils.showTip(this, {
              msg: `不能保存，原因：${res.message}`,
              type: "warning",
            });
          }
        }
      );
    },
    confirmSubmit() {
      this.$refs.detail.validate(valid => {
        if (valid) {
          this.authenticateBrand();
        } else {
          console.warn("error submit");
        }
      });
    },
    getAuthenticateBrandInfo() {
      axios.post(api.getAuthenticateBrandInfo.URL,{ brandId: this.currentInfo.brandId }).then(res => {
          Object.keys(this.detail).forEach(i => {
            if (i === "certificationImages") {
              if (!res.certificationImages) {
                return;
              }
              let arr = [];
              let resArr = res.certificationImages.split(",");
              resArr.forEach(item => {
                arr.push({
                  name: `${Math.random()}`,
                  url: utils.formatPicImg(item)
                });
              });
              this.detail.certificationImages = arr;
            } else {
              this.detail[i] = res[i];
            }
          })
        }
      );
    },
    dialogBeforeClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang='scss'>
.brand-auth-box {
  box-sizing: border-box;
  padding: 80px 20px 20px;
  .con {
    background: #ffffff;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 5px;
    box-sizing: border-box;
    padding: 20px;
    max-width: 1440px;
    margin: 0 auto;
    .steps {
      border: 1px solid #f0f1f4;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 10px 12%;
    }
    .form-con {
      box-sizing: border-box;
      padding: 0 40px;
      padding-top: 10px;
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
      .form {
        .el-form-item {
          .el-form-item__label {
            color: #666666;
            margin-right: 10px;
          }
          .image-box {
            border: 1px solid #f0f1f4;
            border-radius: 4px;
            display: flex;
            box-sizing: border-box;
            padding: 20px 60px 20px 20px;
            margin-bottom: 20px;
            .reference-image {
              margin-left: 150px;
              .image {
                width: 107px;
                display: block;
              }
              span {
                font-size: 12px;
                color: #666666;
              }
            }
          }
        }
        /deep/ .el-form-item.license-image{
          margin-bottom: 0;
          /deep/ .el-form-item__error {
            transform: translateY(-50px) translateX(15px);
          }
        }
        .identify.license-image{
          /deep/ .el-form-item__label{
            line-height: 20px
          }
        }
        .buttons {
          .el-button {
            width: 100px;
            color: white;
          }
        }
        .images {
          margin-bottom: 20px;
        }
        p.upload-tip {
          color: #999999;
          width: 290px;
          line-height: 20px;
          margin: 17px 0 0 0;
        }
      }
    }
  }
}
.hideUpload .el-upload--picture-card {
  display: none;
}
</style>
