<template>
  <div>
    <div class="head-wrap">
      <div class="head">
        <h1 style="font-weight:600;">创建新品牌</h1>
        <p @click="$router.go(-1)">
          <span>
            <i class="icon iconfont icon-icon_back"></i>
          </span>
          <span>关闭</span>
        </p>
      </div>
    </div>
    <div class="main">
      <div class="mainContent">
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
          <el-form-item label="品牌名称" prop="brandName">
            <el-input style="width:200px" v-model.trim="form.brandName" placeholder="请输入品牌名称"></el-input>
          </el-form-item>
          <el-form-item class="images" label="品牌标志" prop="logoRectangle">
            <div class="image-content">
              <div class="image-item">
                <upload-image
                  @success="$refs.form.validateField('logoRectangle')"
                  class="rectangle-image"
                  v-model="form.logoRectangle"
                  :size="5"
                ></upload-image>
                <p class="tip tall">长方形（600px*300px）</p>
              </div>
              <div class="image-item">
                <upload-image
                  @success="$refs.form.validateField('logoRectangle')"
                  class="square-image"
                  v-model="form.logoSquare"
                  :size="5"
                ></upload-image>
                <p class="tip tall">正方形（300px*300px）</p>
              </div>
              <span class="tip">
                支持jpg，png格式，大小不超过1M；
                <br>点击图片可重新上传
              </span>
            </div>
          </el-form-item>
          <el-form-item class="tree" label="覆盖经营分类">
            <el-tree
              ref="tree"
              class="tree-wood"
              :data="allProductSorts"
              show-checkbox
              node-key="id"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
          <el-form-item class="brand-book" label="商标证书" prop="certificate">
            <div class="brand-book-example">
              <upload-image
                @success="$refs.form.validateField('certificate')"
                class="square-image"
                v-model="form.certificate"
                :size="5"
                tip="支持jpg，png格式，大小不超过1M；点击图片可重新上传"
              ></upload-image>
              <div class="example">
                <img src="@/assets/images/referenceImage/img_certificate02.png" alt>
                <p>参考图样</p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="品牌持有人" prop="brandOwner">
            <el-input v-model="form.brandOwner" placeholder="请输入品牌持有公司全称" style="width:200px"></el-input>
            <span style="margin-left:5px;color:#999999  ">公司全称务必与商标证书上保持一致</span>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="form.phone"
              maxlength="11"
              placeholder="品牌持有公司联系电话"
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌简介">
            <input-with-count
              style="width:420px"
              :autosize="{minRows:4,maxRows:100}"
              v-model="form.description"
              :length="500"
              placeholder="请填写品牌简介，所有人可见"
            ></input-with-count>
          </el-form-item>
          <el-form-item label="备注说明">
            <input-with-count
              style="width:420px"
              :autosize="{minRows:4,maxRows:100}"
              v-model="form.remark"
              :length="500"
              placeholder="请填写备注说明，仅审核工作人员可见 "
            ></input-with-count>
          </el-form-item>
          <el-form-item label class="button">
            <el-button class="confirm-button" @click="submit" :loading="subButtonLoading">确认提交</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";

  export default {
    data() {
      let imagesValidator = (rule, value, callback) => {
        if (!this.form.logoRectangle && !this.form.logoSquare) {
          callback(new Error("请上传品牌标志"));
        } else if (!this.form.logoRectangle) {
          callback(new Error("请上传长方形品牌标志"));
        } else if (!this.form.logoSquare) {
          callback(new Error("请上传正方形品牌标志"));
        } else {
          callback();
        }
      };
      let mobileValidator = (rule, value, callback) => {
        if (
          /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
            value
          ) ||
          /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)
        ) {
          callback();
        } else {
          callback("请输入正确格式的电话号码");
        }
      };
      return {
        form: {
          brandName: "",
          logoRectangle: "",
          logoSquare: "",
          brandOwner: "",
          phone: "",
          description: "",
          remark: ""
        },
        formRules: {
          brandName: {required: true, message: "请输入品牌名称"},
          logoRectangle: {required: true, validator: imagesValidator},
          certificate: {required: true, message: "请上传商标证书"},
          brandOwner: {required: true, message: "请输入品牌持有公司全称"},
          phone: {required: true, validator: mobileValidator}
        },
        allProductSorts: [],
        subButtonLoading: false,
        defaultProps: {
          children: "subClass",
          label: "name",
          disabled: "disabled"
        },
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      currentShopInfo() {
        return this.$store.state.manage.currentShopInfo;
      },
      userInfo() {
        return this.$store.state.manage.userInfo;
      },
      commodityBrandId() {
        return this.$store.state.queryParams.commodityBrandId;
      },
      currentStatus() {
        return this.$route.path.indexOf("create") === -1 ? 'edit' : 'add'
      }
    },
    mounted() {
      if (this.currentStatus === 'edit') {
        this.getProductBrandCreate();
        return
      }
      this.getAllProductClass();
    },
    methods: {
      getAllProductClass(levelList) {
        axios.get("/getAllProductClass").then(res => {
          this.allProductSorts = res.data;
          if (levelList) {
            this.$refs.tree.setCheckedKeys(levelList)
          }
        });
      },
      getProductBrandCreate() {
        axios.get(`/getProductBrandCreate/${this.commodityBrandId}`).then(res => {
          this.form = res.data.productBrandCreate;
          this.getAllProductClass(res.data.productBrandCreate.levelList);
        });
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.subButtonLoading = true;
            let keyedNodes = this.$refs.tree.getCheckedNodes();
            let levelList = keyedNodes.filter(item => item.subClass.length === 0).map(i => i.id); //只传二级的ID即可
            /**
             * 一共15个字段哈，现在刚刚好够
             */
            let addParameters = {
              ...this.form,
              auditStatus: "CHECKING_CREATE",
              brandId: this.currentInfo.brandId,
              createTime: utils.formatDateTimeFromYearToSecond(new Date()),
              createUserBrandName: this.currentShopInfo.brandName,
              createUserName: this.userInfo.username,
              createUserPhone: this.userInfo.telephone,
              levelList
            };
            let isEdit = this.currentStatus === "edit";
            let url =
              isEdit
                ? "/updateProductBrandCreate"
                : "/addProductBrandCreate";
            let params =
              isEdit ? this.form : addParameters;
            axios[isEdit ? "post" : "put"](url, params).then(res => {
              this.subButtonLoading = false;
              var success = res.code === 1200 || res.code === '1200';
              if (success) {
                this.$router.go(-1);
              }
              this.$message({type: success ? "success" : "warning", message: success ? `${isEdit?'更新成功':'添加成功'}` : res.message})
            });
          } else {
            console.warn("ERROR SUBMIT");
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .head-wrap {
    width: 100%;
    background: #ffffff;
    box-shadow: 0 2px 8px 0 rgba($color: #aeb8e5, $alpha: 0.3);
    box-sizing: border-box;
    padding: 0 20px;
    .head {
      margin: 0 auto;
      height: 65px;
      max-width: 1440px;
      h1 {
        font-size: 18px;
        line-height: 44px;
        color: #333333;
      }

      p {
        font-size: 12px;
        line-height: 14px;
        color: #959595;

        &:hover {
          cursor: pointer;
        }

        .icon-icon_back {
          font-size: 12px;
        }
      }
    }
  }

  .main {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 0 20px;

    .mainContent {
      max-width: 1440px;
      box-sizing: border-box;
      margin: 0 auto;
      background: white;
      box-sizing: border-box;
      padding: 15px 20px;
      box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
      border-radius: 3px;

      .el-form-item.button {
        .confirm-button {
          background: #58c9f3;
          color: white;
          border: none;

          &:hover {
            filter: brightness(90%);
          }
        }
      }

      .el-form-item.images {
        .image-content {
          display: flex;

          .rectangle-image {
            width: 150px;

            /deep/ .el-upload {
              width: 140px;
              height: 70px;
            }
          }

          .square-image {
            width: 80px;

            /deep/ .el-upload {
              width: 70px;
              height: 70px;
            }
          }

          .tip {
            color: #999999;
            line-height: 20px;
            font-size: 12px;
          }

          .tip.tall {
            margin-top: 8px;
          }
        }
      }

      .el-form-item.tree {
        .tree-wood {
          width: 640px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }

        /deep/ .el-tree-node__children {
          display: flex;
          flex-wrap: wrap;
          width: 640px;

          .el-tree-node__content {
            width: 140px;
          }
        }
      }

      .el-form-item.brand-book {
        .brand-book-example {
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          width: 530px;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 20px;
        }

        .example {
          img {
            width: 115px;
          }

          p {
            font-size: 12px;
            color: #666666;
            line-height: 10px;
          }
        }
      }
    }
  }
</style>
