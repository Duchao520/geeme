<template>
  <div class="form">
    <div class="form-item-box">
      <h5>收款台结算方式</h5>
      <el-table :data="form.paymentTypes" row-class-name="row-class" style="width: 100%">
        <el-table-column v-if="false" label="排序" width="180">
          <template slot-scope="scope">
            <span v-if="authRouter.currentEntry==='shop'">{{scope.row.sortWeight}}</span>
            <number-input v-else v-model="scope.row.sortWeight" :max="9999" :decimal="false"></number-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="结算方式" width="180">
          <template slot-scope="scope">
            <el-input :class="{editable:scope.row.userDefined}" v-if="scope.row.isEdit || scope.row.userDefined"
                      v-model.trim="scope.row.billTypeName" maxlength="6"
                      @blur="detectedEdit(scope.row)"
                      placeholder="不超过6个字"></el-input>
            <span v-else>{{scope.row.billTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <upload-image v-if="scope.row.isEdit || scope.row.userDefined" @success="detectedEdit(scope.row)"
                          v-model="scope.row.image" :size="1"></upload-image>
            <img
              :src="scope.row.billType === 1 ? require(`@/assets/images/icon_pay_ali.png`) : utils.formatPicImg(scope.row.image,'style',146)"
              :alt="scope.row.billTypeName"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span style="color: #58C9F3;cursor: pointer;" v-if="scope.row.isEdit"
                  @click="detectedSubmit(scope.row)">保存</span>
            <div v-else>
              <span v-if="authRouter.currentEntry==='shop'">{{scope.row.enable?'已':'未'}}启用</span>
              <el-switch
                v-else
                v-model="scope.row.enable"
                @change="changePayTypeEnabled(scope.row)"
                active-color="#65BD63"
                inactive-color="#cdcdcd"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <button class="add-bill-type" @click="addBillType" v-if="authRouter.currentEntry==='brand'">
        <span class="icon iconfont icon-icon_ope_append"></span>
        <span>新增结算方式</span>
      </button>
    </div>
  </div>
</template>

<script>
  /*
  * 结算方式：0-微信支付，1-支付宝支付，2-现金支付，3-会员卡支付，4-自定义
  * */
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";

  export default {
    data() {
      return {
        utils: utils,
        form: {
          paymentTypes: [],
        },
      };
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        authRouter: state => state.authRouter
      }),
    },
    mounted() {
      this.getBrandBillTypeInfos();
    },
    methods: {
      getBrandBillTypeInfos() {
        axios
          .post("/getBrandBillTypeInfos", {brandId: this.currentInfo.brandId})
          .then(res => {
            this.form.paymentTypes = res.listBillTypeInfos.map(item => {
              item.userDefined = item.billType === 4;
              return item;
            });
          });
      },
      changePayTypeEnabled(data) {
        axios.post("/enableBrandBillType", {
          enable: data.enable,
          id: data.id,
          brandId: this.currentInfo.brandId
        });
      },
      addBillType() {
        this.form.paymentTypes.push({
          billTypeName: "",
          image: null,
          enable: true,
          isEdit: true
        });
      },
      createBrandSelfDefBillType(param) {
        axios
          .post("/createBrandSelfdefBillType", {
            brandId: this.currentInfo.brandId,
            billTypeName: param.billTypeName,
            image: param.image,
            enable: true,
          })
          .then(res => {
            if (res.success) {
              this.$message({type: "success", message: res.message})
            }
            this.getBrandBillTypeInfos()
          });
      },
      detectedSubmit(data) {
        if (data.image && data.billTypeName) {
          this.createBrandSelfDefBillType(data);
        } else {
          this.$message({type: "warning", message: "请将结算方式名称和图标补充完整"})
        }
      },
      detectedEdit(data) {
        if (!data.isEdit) {
          axios.post("/updateBrandSelfdefBillType", data)
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .form {
    box-sizing: border-box;
    padding: 40px;

    .form-item-box {
      max-width: 820px;
      font-size: 14px;

      h5 {
        line-height: 22px;
        font-size: 16px;
        color: #333333;
        margin-bottom: 10px;
      }

      .el-table {
        .row-class {
          color: #333333;

          img {
            width: 50px;
            height: 50px;
          }

        }

        /deep/ .cell {
          height: 50px;
          line-height: 50px;

          /deep/ .el-input__inner {
            height: 35px;
            transform: translateX(-10px);
            padding-left: 10px;
          }

          /deep/ .editable {
            .el-input__inner {
              border-color: transparent;
              background: transparent;

              &:hover {
                border-color: #c0c4cc;
              }

              &:focus {
                border-color: cornflowerblue;
              }
            }
          }

          .el-upload.el-upload--text {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 0;

            &:hover {
              border: 1px dashed #666666;
            }

            img {
              display: inline-block;
              width: 50px;
              height: 50px;
            }
          }

        }

        /deep/ td {
          padding-top: 6px;
          padding-bottom: 6px;
          vertical-align: middle;
          border: none;
        }

        /deep/ tr:nth-child(2n + 1) {
          background: #f4f5f7;
        }
      }

      .add-bill-type {
        line-height: 40px;
        color: #58c9f3;
      }
    }
  }
</style>
