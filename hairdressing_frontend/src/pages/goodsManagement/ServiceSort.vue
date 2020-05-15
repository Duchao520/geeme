<template>
  <div class="root_" v-loading="pageLoading">
    <div class="root-con" v-if="tableData&&tableData.length>0">
      <div class="top">
        <span class="message">
          <i class="icon iconfont icon-icon_note"></i>注：服务分类只能通过总部或门店新增服务同步，不可删减和修改。
        </span>
        <input-search
          width="280px"
          placeholder="请输入分类名称"
          v-model="sortName"
          @search="getStoreSortInfoWithFilter()"
        ></input-search>
      </div>
      <div class="table-con" v-if="tableData.length>0">
        <div class="line title">
          <p>一级分类</p>
          <p>二级分类</p>
          <p>显示名称</p>
          <p>显示图标</p>
          <p>默认首图</p>
          <p>操作</p>
        </div>
        <div class="form-con">
          <el-form
            ref="form"
            :model="sortOne"
            :rules="formRules"
            class="line line-con"
            v-for="(sortOne,index) in tableData"
            :key="index"
          >
            <div class="sortOne">
              <div class="left">
                <el-form-item prop="orderNo">
                  <number-input
                    :min="0"
                    :max="10000"
                    v-model="sortOne.orderNo"
                    @blur="updateSort(sortOne)"
                  ></number-input>
                </el-form-item>
                <img
                  class="img"
                  :preview="Math.random()"
                  :preview-text="''"
                  style="cursor: pointer;"
                  :src="utils.formatPicImg(sortOne.image,'style',40)"
                  :alt="sortOne.sortName"
                />
                <p>{{sortOne.sortName}}</p>
              </div>
            </div>
            <div class="sortTwo" v-if="sortOne.sortTwo&&sortOne.sortTwo.length>0">
              <div
                class="sort-tow-item"
                v-for="(sortTwoItem,index) in sortOne.sortTwo"
                :key="index"
              >
                <div class="left">
                  <el-form-item prop="orderNo" class="input">
                    <number-input
                      :min="0"
                      :max="10000"
                      v-model="sortTwoItem.orderNo"
                      @blur="updateSort(sortTwoItem)"
                    ></number-input>
                  </el-form-item>
                  <img
                    class="img"
                    :preview="Math.random()"
                    :preview-text="''"
                    style="cursor: pointer;"
                    :src="utils.formatPicImg(sortTwoItem.icon,'style',40)"
                    :alt="sortTwoItem.name"
                  />
                  <span>{{sortTwoItem.name}}</span>
                </div>
                <div class="left" style="margin-left: 15px;">
                  <span>{{sortTwoItem.sortName}}</span>
                </div>
                <div class="left">
                  <img
                    class="img"
                    :preview="Math.random()"
                    :preview-text="''"
                    style="cursor: pointer;"
                    :src="utils.formatPicImg(sortTwoItem.image,'style',40)"
                    :alt="sortTwoItem.sortName"
                  />
                </div>

                <!-- 默认首图 -->
                <div class="left">
                  <img
                    class="img"
                    v-if="sortTwoItem.defaultImage"
                    :preview="Math.random()"
                    :preview-text="''"
                    style="cursor: pointer;"
                    :src="utils.formatPicImage(sortTwoItem.defaultImage,'style',40, 'brandLogo')"
                    :alt="sortTwoItem.sortName"
                  />
                  <img
                    class="img"
                    v-else
                    :preview="Math.random()"
                    :preview-text="''"
                    style="cursor: pointer;"
                    src="@/assets/img/default_cover_05.png"
                    :alt="sortTwoItem.sortName"
                  />
                </div>

                <div class="right">
                  <div>
                    <g-button
                      :name="'编辑'"
                      type="detail"
                      :icon="'icon_operate_edit'"
                      @click="edit(sortTwoItem)"
                    ></g-button>
                  </div>
                  <div>
                    <switch-on-off
                      style="vertical-align: middle;"
                      v-model="sortTwoItem.recommendation"
                      @change="changeRecommend(sortTwoItem)"
                    ></switch-on-off>
                    <span
                      style="line-height: 23px; display: inline-block;"
                    >{{ sortTwoItem.recommendation ? '已推荐' : '不推荐'}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="goods-sort-default search-default" v-if="hasData&&tableData&&tableData.length===0">
      <search-default @clear-back="clearBack"></search-default>
    </div>
    <goods-sort-default
      class="goods-sort-default"
      v-if="(tableData&&tableData.length===0)&&!hasData"
      text="暂时没有分类，总部或门店新增服务之后，分类信息将同步至此"
    ></goods-sort-default>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑服务分类"
      :visible.sync="editDialogVisible"
      width="500px"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRule">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.name" disabled style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="分类图标">
          <img class="img" :src="utils.formatPicImg(editForm.icon,'style',40)" alt />
        </el-form-item>
        <el-form-item label="显示名称" prop="sortName">
          <el-input v-model="editForm.sortName" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="显示图标" required>
          <g-upload-spic @change="updateImg" :photo="editForm.image" :size="2"></g-upload-spic>
        </el-form-item>
        <el-form-item label="默认首图" required>
          <g-upload-spic
            @change="updateDefaultImg"
            :photo="editForm.defaultImage"
            :size="3"
            tipWidth="270px"
            text="新增商品未设置首图时，将采用该图片作为首图；"
          ></g-upload-spic>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="sendData" :loading="editBtnLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import GoodsSortDefault from "@/pages/goodsManagement/GoodsSortDefault";

export default {
  components: {
    "goods-sort-default": GoodsSortDefault
  },
  data() {
    let numberValidator = (rule, value, callback) => {
      if (typeof value !== "number" || value < 0) {
        callback(new Error("请输入数字"));
        return;
      }
      callback();
    };
    let nameValid = (rule, value, cb) => {
      if (value.length > 6) {
        cb(new Error("不能超过6个中文字符"));
      }
      if (!value) {
        cb(new Error("请输入显示名称"));
      }
      cb();
    };
    return {
      utils: utils,
      sortName: "",
      tableData: [],
      formRules: {},
      pageLoading: true,
      hasData: true,
      editDialogVisible: false,
      editForm: {},
      editRule: {
        sortName: [
          { required: true, validator: nameValid, trigger: "blur" }
          // { required: true, validator: nameValid, trigger: "change" }
        ]
      },
      editBtnLoad: false
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    page() {
      return this.$route.path
        .split("/")
        .pop()
        .split("-")
        .shift();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getStoreSortInfoWithFilter();
    },
    getStoreSortInfoWithFilter() {
      this.pageLoading = true;
      axios
        .post(api.getStoreSortInfoWithFilter.URL, {
          sortName: this.sortName,
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          console.log(res);
          this.getStoreSortInfoWithFilterRes(res);
          this.pageLoading = false;
          this.hasData = res.hasData;
        });
    },
    getStoreSortInfoWithFilterRes(res) {
      this.tableData = res.sortInfos;
    },
    updateSort(data) {
      axios
        .post("/updateServiceSort", {
          id: data.id,
          orderNo: data.orderNo,
          recommendation: null
        })
        .then(res => {
          this.updateServiceSortRes(res);
        });
    },
    updateServiceSortRes(res) {
      if (res.success) {
        this.$message({ type: "success", message: `更新成功` });
        this.init();
      }
    },
    changeRecommend(data) {
      axios.post("/updateServiceSort", {
        id: data.id,
        orderNo: null,
        recommendation: data.recommendation
      });
    },
    clearBack() {
      this.sortName = null;
      this.getStoreSortInfoWithFilter();
    },
    edit(data) {
      this.editForm = {
        id: data.id,
        orderNo: null,
        recommendation: null,
        sortName: data.sortName,
        image: data.image,
        name: data.name,
        icon: data.icon,
        defaultImage: data.defaultImage
      };
      this.editDialogVisible = true;
    },
    handleClose() {
      this.editDialogVisible = false;
      this.$refs.editForm.clearValidate();
    },
    sendData() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return;
        this.editBtnLoad = true;
        axios
          .post("/updateServiceSort", this.editForm)
          .then(res => {
            if (!res.success) {
              this.editBtnLoad = false;
              this.$message.error(res.message);
              return;
            }
            this.$message.success("编辑成功");
            this.editDialogVisible = false;
            this.init();
            this.editBtnLoad = false;
          })
          .catch(() => {
            this.editBtnLoad = false;
          });
      });
    },
    // 编辑图片上传
    updateImg(val) {
      this.$message.success("图片上传成功");
      this.editForm.image = val;
    },
    updateDefaultImg(val) {
      this.$message.success("图片上传成功");
      this.editForm.defaultImage = val;
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin border-l-t {
  border-top: 1px solid #f0f1f4;
  border-left: 1px solid #f0f1f4;
}
@mixin border-l-t-r {
  border: 1px solid #f0f1f4;
  border-bottom: 0;
}
.root-con {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  padding: 20px;
  display: flex;
  height: calc(100vh - 50px);
  flex-direction: column;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .message {
      font-size: 12px;
      color: #999999;
      .icon {
        font-size: 10px;
        margin-right: 5px;
      }
    }
  }
  .table-con {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    background: #ffffff;
    border-radius: 4px;
    flex: auto;
    .line.title {
      line-height: 60px;
      display: flex;
      > p {
        flex: 1 1 16.6667%;
        text-indent: 10px;
      }
    }
    .line {
      width: 100%;
      display: flex;
      font-size: 14px;
      color: #333333;
      .sortOne {
        width: 16.6667%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px;
        .left {
          display: flex;
          box-sizing: border-box;
          transform: translateY(12px);
          .img {
            width: 40px;
            height: 40px;
            margin: 0 10px;
          }
          p {
            line-height: 40px;
          }
          /deep/ .el-input__inner {
            text-align: center;
          }
        }
      }
      .sortTwo {
        width: 83.3333%;
        .sort-tow-item {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 10px;
          .left {
            display: flex;
            align-items: center;
            width: 20%;
            .input {
              transform: translateY(12px);
              /deep/ .el-input__inner {
                text-align: center;
              }
            }
            .img {
              width: 40px;
              height: 40px;
              margin: 0 10px;
            }
          }
          .right {
            width: 20%;
            box-sizing: border-box;
            padding-left: 10px;
            div {
              display: inline-block;
            }
          }
        }
      }

      /deep/ .el-input__inner {
        width: 40px;
        height: 35px;
        padding: 3px;
      }
    }
    .line.line-con {
      box-sizing: border-box;
      border: 1px solid #f0f1f4;
      border-bottom: 0;
      .sortTwo {
        border-left: 1px solid #f0f1f4;
      }
      .sort-tow-item {
        border-bottom: 1px solid #f0f1f4;
      }
      .sort-tow-item:last-child {
        border-bottom: 0;
      }
    }
    .line.line-con:last-child {
      border-bottom: 1px solid #f0f1f4;
    }
  }
  .right {
    i {
      cursor: pointer;
    }
    i:nth-child(1) {
      color: #58c9f3;
    }
    i:nth-child(2) {
      color: #bec3c6;
    }
  }
  .form-con {
    height: 620px;
    height: calc(100vh - 245px);
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
.goods-sort-default {
  background: #fff;
  box-sizing: border-box;
  margin: 20px;
  height: calc(100vh - 90px);
  border-radius: 4px;
}
.search-default.goods-sort-default {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
