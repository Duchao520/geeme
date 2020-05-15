<template>
  <el-dialog :visible="visible" width="800px" @close="visible=false">
    <strong class="title" slot="title">选择产品品牌</strong>
    <div class="product-brand-content">
      <div class="left">
        <div class="input">
          <i class="icon iconfont icon-icon_search"></i>
          <input type="text" name="input" v-model="keyWord" placeholder="请输入关键词筛选" @input="queryProductBrand()">
        </div>
        <div class="checkout-group">
          <el-checkbox-group v-model="checkBrandIds">
            <el-checkbox
              v-for="(item,index) in avaiableBrands"
              :key="index"
              :label="item.id"
              :disabled="item.noAllowChange"
            >{{item.brandName}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="right">
        <h6>已选品牌预览</h6>
        <div class="selected-brands-preview">
          <div class="img" v-for="(item,index) in selectedBrands" :key="index">
            <img :src="utils.formatPicImg(item.logoSquare,'style',40)">
            <p :title="item.brandName">{{item.brandName}}</p>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button class="confirm" @click="confirm">确 定</el-button>
      <el-button @click="visible=false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";

  export default {
    data() {
      return {
        utils: utils,
        keyWord: null,
        checkBrandIds: [],
        visible: false,
        avaiableBrands: [],
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      currentShopInfo() {
        return this.$store.state.manage.currentShopInfo;
      },
      selectedBrands() {
        let arr = [];
        let checkBrandIds = this.checkBrandIds;
        this.avaiableBrands.forEach(item => {
          if (checkBrandIds.indexOf(item.id) !== -1) {
            arr.push(item);
          }
        });
        return arr;
      },
      newProductBrandIds() {
        return this.selectedBrands.filter(item => {
          return !item.noAllowChange
        }).map(item => {
          return {
            brandId: this.currentInfo.brandId,
            brandName: item.brandName,
            productBrandId: item.id
          }
        })
      }
    },
    methods: {
      readyToChoose() {
        axios
          .get(`/getAllProductBrandManage/${this.currentInfo.brandId}`)
          .then(res => {
            this.checkBrandIds = (res.productBrandManageList || []).map(
              item => item.productBrandId
            );
            this.queryProductBrand()
          });
      },
      queryProductBrand(){
        axios
          .post("/queryProductBrand", {
            keyWord: this.keyWord,
            pageNum: 1,
            pageSize: 1000,
            tabCondition: "ONLINE"
          })
          .then(res => {
            this.avaiableBrands = res.data.productBrandList.map(item => {
              if (this.checkBrandIds.indexOf(item.id) !== -1) {
                item.noAllowChange = true;
              }
              return item
            });
            this.visible = true;
            this.$emit("ready");
          });
      },
      confirm() {
        axios
          .put("/addProductBrandManage", {
            productBrandManages: this.newProductBrandIds
          })
          .then(res => {
            this.visible = false;
            this.$emit("update");
          });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  @mixin scroll {
    height: 520px;
    overflow-y: auto;
    @include scroll-bar(10px, #f1f2f7, rgba(0, 0, 0, 0));
  }

  /deep/ .el-dialog {
    padding: 0;
    color: #333333;

    .el-dialog__header {
      padding-bottom: 20px;

      .title {
        font-size: 18px;
        line-height: 20px;
      }
    }

    .el-dialog__body {
      padding: 0;

      .product-brand-content {
        border-top: 1px solid #f0f1f4;
        padding: 20px 40px 20px 20px;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left,
        .right {
          width: 325px;
          border-radius: 4px;
          overflow-y: auto;
        }
        .left {
          .input {
            border: 1px solid #dcdfe6;
            width: 228px;
            height: 28px;
            display: flex;
            align-items: center;
            border-radius: 3px;

            .icon {
              color: #c7cad1;
              margin: 0 10px 0;
            }

            input {
              border: none;
              outline: none;
              background: transparent;
              line-height: 28px;

              &::placeholder {
                color: #c7cad1;
              }
            }
          }

          .checkout-group {
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            margin-top: 15px;
            @include scroll;
            .el-checkbox {
              margin-left: 0;
              display: block;
              padding-left: 20px;
              line-height: 40px;
              transition: all 0.6s;

              &:hover {
                background: #f4f5f7;
              }
            }

            .el-checkbox:nth-child(2n + 1) {
              background: #f4f5f7;
            }
          }
        }

        .right {
          h6 {
            line-height: 28px;
            font-size: 14px;
            margin-bottom: 15px;
          }

          .selected-brands-preview {
            @include scroll;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            box-sizing: border-box;
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            .img {
              margin-bottom: 15px;
              display: flex;
              width: 25%;
              flex-direction: column;
              align-items: center;
              transition: all 0.6s;

              img {
                display: block;
                width: 44px;
                height: 44px;
                box-sizing: border-box;
                border: 1px solid #e7e7e7;
              }

              p {
                width: 100%;
                line-height: 28px;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding-top: 0;

      > div {
        text-align: left;

        .confirm {
          background: #58c9f3;
          color: white;
          border: none;

          &:hover {
            filter: brightness(90%);
          }
        }
      }
    }
  }
</style>
