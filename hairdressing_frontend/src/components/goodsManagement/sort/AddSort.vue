<template>
  <el-dialog
    :title="`${isEdit?'修改':'新增'}${addSortType==='one'?'一':'二'}级分类`"
    :visible="sortOneVisible"
    width="800px"
    :before-close="beforeClose"
  >
    <el-form class="main-con" ref="form" :model="form" :rules="formRules">
      <div class="line" v-if="addSortType==='one'">
        <div class="title">
          <span class="xing">分类名称</span>
        </div>
        <div class="con">
          <el-form-item prop="sortName" style="width:200px">
            <el-input v-model="form.sortName" placeholder="请输入一级分类名称"></el-input>
          </el-form-item>
        </div>
      </div>
      <div v-if="addSortType==='two'">
        <div class="line">
          <div class="title">
            <span class="xing">一级分类</span>
          </div>
          <div class="con">
            <el-form-item prop="parentId">
              <el-select :disabled ="isEdit" v-model="form.parentId" placeholder="请选择一级分类" style="width:200px;">
                <el-option
                  v-for="(item,index) in classification"
                  :key="index"
                  :label="item.sortName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="line">
          <div class="title">
            <span class="xing">二级分类名称</span>
          </div>
          <div class="con">
            <el-form-item prop="sortName" style="width:200px">
              <el-input v-model="form.sortName" placeholder="请输入二级分类名称"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="line">
          <div class="title">
            <span>推荐分类</span>
          </div>
          <div class>
            <el-checkbox v-model="form.recommendation"></el-checkbox>
          </div>
        </div>
      </div>
      
      <div class="line radio">
        <div class="title">
          <span class="xing">分类图标</span>
        </div>
        <div class="con radio">
          <el-radio-group v-model="imageOriginType">
            <el-radio label="defineByOneSelf">
              <div class="radioOne">
                <div class="radio-title">
                  <span>自定义上传</span>
                </div>
                <el-form-item class="image-con avator" prop="image">
                  <div class="layer" @click.prevent.stop v-if="imageOriginType==='choose'"></div>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :on-success="uploadPic"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="form.image"
                      :src="utils.formatPicImage(form.image, 'style', 146, 'someone')"
                      class="avatar"
                    >
                    <i v-else class="icon iconfont icon-icon_num_add"></i>
                  </el-upload>
                  <p class="warn">
                    点击图片可修改
                    <br>支持jpg，png格式，建议像素300*300px
                  </p>
                </el-form-item>
              </div>
            </el-radio>
            <el-radio label="choose">
              <div class="selectFromHouse">
                <div>从素材库选择</div>
                <div class="selectFromHouseCon">
                  <div class="layer" @click.prevent.stop v-if="imageOriginType==='defineByOneSelf'"></div>
                  <div class="horizontal" @click.prevent>
                    <div class="list">
                      <div class="left">风格A</div>
                      <div class="right">
                        <img
                          class="img"
                          src
                          alt
                          v-for="(item,index) in [1,2,34,5,6,76,78,8,9,9,2,2,34,45,5]"
                          :key="index"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="beforeClose">取 消</el-button>
      <el-button :disabled="confirmButtonDisabled" type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';
import * as utils from "@/assets/js/utils";

import { mapState } from "vuex";

export default {
  data() {
    let sortTwoNameValidator = (rule, value_, callback) => {
      let value = this.form.sortName;
      if (!value) {
        callback(new Error("请输入分类名称"));
      } else {
        callback();
      }
    };
    let imageValidator = (rule, value, callback) => {
      console.log(value, !value, typeof value);
      if (!value) {
        callback(new Error("请选择分类图标"));
      } else {
        callback();
      }
    };
    let parentIdvalidator = (rule, value, callback) => {
      if (value !== undefined) {
        callback();
      } else {
        callback("请选择一级分类");
      }
    };
    return {
      utils: utils,
      size: 2,
      imageOriginType: "defineByOneSelf",
      confirmButtonDisabled: false,
      id: null,
      orderNo: null,
      form: {
        parentId: null,
        sortName: null,
        image: "",
        recommendation: false
      },
      formRules: {
        parentId: [
          {
            require: true,
            trigger: "change",
            // message: "请选择一级分类",
            validator: parentIdvalidator
          }
        ],
        sortName: [
          {
            require: true,
            trigger: "change",
            validator: sortTwoNameValidator
          },
          {
            require: true,
            trigger: "blur",
            validator: sortTwoNameValidator
          }
        ],
        image: [{ require: true, validator: imageValidator, trigger: "change" }]
      }
    };
  },
  props: {
    sortOneVisible: Boolean,
    addSortType: String,
    sortToEdit: Object,
    isEdit: Boolean,
    classification: Array
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    isService() {
      return this.$route.fullPath.indexOf("service") !== -1;
    }
  },
  watch: {
    sortToEdit(val) {
      this.form.parentId = val.parentId ? val.parentId : null;
      this.form.sortName = val.sortItem.sortName;
      this.form.image = val.sortItem.image;
      this.id = val.sortItem.id;
      this.orderNo = val.sortItem.orderNo;
    }
  },
  methods: {
    beforeClose() {
      this.form={
        parentId: null,
        sortName: null,
        image: "",
        recommendation: false
      };
      this.$emit("close");
    },
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.confirmButtonDisabled = true;
          if (this.isService) {
            if (this.isEdit) {
              let params = {
                id: this.id,
                image: this.form.image,
                orderNo: this.orderNo,
                parentId:
                  this.addSortType === "one" ? null : this.form.parentId,
                sortName: this.form.sortName,
                recommendation:this.form.recommendation
              };
              this.$emit("updateOrAddSort", "updateServiceSort", params);
            } else {
              let params = {
                image: this.form.image,
                parentId:
                  this.addSortType === "one" ? null : this.form.parentId,
                sortName: this.form.sortName,
                brandId: this.currentInfo.brandId,
                recommendation:this.form.recommendation
              };
              this.$emit("updateOrAddSort", "addServiceSort", params);
            }
          }else{
            if (this.isEdit) {
              let params = {
                id: this.id,
                image: this.form.image,
                orderNo: this.orderNo,
                parentId:
                  this.addSortType === "one" ? null : this.form.parentId,
                sortName: this.form.sortName,
                deleted : false,
                brandId: this.currentInfo.brandId,
                recommendation:this.form.recommendation
              };
              this.$emit("updateOrAddSort", "createProductSort", params,'edit');
            } else {
              let params = {
                id: this.id,
                image: this.form.image,
                orderNo: this.orderNo,
                parentId:
                  this.addSortType === "one" ? null : this.form.parentId,
                sortName: this.form.sortName,
                deleted : false,
                brandId: this.currentInfo.brandId,
                recommendation:this.form.recommendation
              };
              this.$emit("updateOrAddSort", "createProductSort", params,'add');
            }
          }
        }
      });
    },
    addSortRes(res) {
      if (res.success) {
        this.$message({
          type: "success",
          message: `新增${this.addSortType === "one" ? "一" : "二"}级分类成功`
        });
        this.form = { parentId: null, sortName: null, image: "" ,recommendation:false};
        this.confirmButtonDisabled = false;
      }
    },
    editSortRes(res) {
      if (res.success) {
        this.$message({ type: "success", message: `更新成功` });
        this.form = { parentId: null, sortName: null, image: "" };
        this.confirmButtonDisabled = false;
      }
    },
    uploadPic(data) {
      this.form.image = data.fileKey;
      this.$refs.form.validateField("image");
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < this.size;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 " + this.size + "M!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style lang="scss" scoped>
.image-con.avator {
  /deep/ .el-form-item__error {
    top: 80%;
  }
}
.avatar-uploader {
  width: 70px;
  /deep/ .el-upload {
    width: 70px;
    height: 70px;
    img {
      width: 70px;
      height: 70px;
    }
  }
  .icon-icon_num_add {
    line-height: 70px;
    font-size: 28px;
    color: #8c939d;
    font-weight: 600;
  }
}
.main-con {
  border-top: 1px solid #f0f1f4;
  box-sizing: border-box;
  .line {
    color: #666666;
    font-size: 14px;
    display: flex;
    align-items: center;
    min-height: 60px;
    .title {
      flex: 0 0 130px;
      box-sizing: border-box;
      padding-right: 20px;
      text-align: right;
      .xing {
        &::before {
          content: "　* ";
          color: #e22c37;
        }
      }
    }
    .con {
      transform: translateY(11px);
    }
  }
}
.line.radio {
  align-items: flex-start;
  .title {
    transform: translateY(7px);
  }
  .con.radio {
    align-items: flex-start;
    .el-radio-group {
      display: flex;
      flex-direction: column;
      .el-radio {
        margin: 0;
        display: flex;
        .radioOne {
          .image-con {
            padding: 10px 0 20px;
            width: 600px;
            transform: translateX(-25px);
            margin-bottom: -20px;
            position: relative;
            .layer {
              z-index: 99999;
              position: absolute;
              width: 100%;
              height: 85%;
              top: 0;
              border-radius: 5px;
              transition: all 0.8s;
              cursor: not-allowed;
              &:hover {
                background: rgba($color: #cdcdcd, $alpha: 0.3);
              }
            }
            .warn {
              color: #999999;
              font-size: 12px;
              line-height: 20px;
              padding-left: 10px;
              width: 200px;
              display: inline-block;
              margin-bottom: 15px;
            }
            /deep/ .tip {
              display: none;
            }
          }
        }
        .selectFromHouse {
          .selectFromHouseCon {
            transform: translateX(-25px);
            position: relative;
            .layer {
              position: absolute;
              width: 100%;
              height: 100%;
              transition: all 0.8s;
              cursor: not-allowed;
              border-radius: 5px;
              &:hover {
                background: rgba($color: #cdcdcd, $alpha: 0.3);
              }
            }
            .horizontal {
              .list {
                display: flex;
                margin: 10px 0 10px;
                .left {
                  color: #333333;
                  flex: 0 0 60px;
                }
                .right {
                  display: flex;
                  flex-wrap: wrap;
                  .img {
                    width: 50px;
                    height: 50px;
                    border: 1px solid #dcdfe6;
                    margin: 0 10px 10px 0;
                  }
                }
              }
              display: flex;
              margin: 10px 0 10px;
              .left {
                color: #333333;
                flex: 0 0 60px;
              }
              .right {
                display: flex;
                flex-wrap: wrap;
                .img {
                  width: 50px;
                  height: 50px;
                  border: 1px solid #dcdfe6;
                  margin: 0 10px 10px 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
/deep/ .el-form-item__content {
  display: flex;
  align-items: flex-end;
}
</style>
