<template>
  <div class="page-container">
    <el-row type="flex">
      <el-radio-group v-model="brandSpend" style="margin-right: 10px;" size="medium" v-if="isBrand">
        <el-radio-button label="1">总部开支</el-radio-button>
        <el-radio-button label="2">门店开支</el-radio-button>
      </el-radio-group>
      <el-button type="danger" class="first-btn normal_red_btn" @click="dialogFormVisible=true" v-if="brandSpend == '1'">新增开支</el-button>
    </el-row>
    <div class="filter-container">
      <div class="filter-l1">
        <div>
          <el-radio-group class="btn-group" v-model="radioLabel">
            <el-radio-button :label="1">本月</el-radio-button>
            <el-radio-button :label="2">上月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            :clearable="false"
            style="margin-left:10px;"
            v-model="date"
            unlink-panels
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="filter-l2">
        <div class="filter-condition-container">
          <div class="filter-condition" v-if="brandSpend == '2'">
            <span>选择门店：</span>
            <el-select v-model="filter.storeId">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in shopList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-condition">
            <span>项目类型：</span>
            <el-select v-model="filter.projectType">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="房租" :value="0"></el-option>
              <el-option label="水电费" :value="1"></el-option>
              <el-option label="物业费" :value="2"></el-option>
              <el-option label="办公费" :value="3"></el-option>
              <el-option label="管理费" :value="4"></el-option>
              <el-option label="工资提成" :value="5"></el-option>
              <el-option label="固定资产分摊" :value="6"></el-option>
              <el-option label="产品材料" :value="7"></el-option>
              <el-option label="财务费用" :value="8"></el-option>
              <el-option label="其他费用" :value="9"></el-option>
            </el-select>
          </div>
          <!-- 2.0 -->
          <!-- <div class="filter-condition">
            <span>支出部门：</span>
            <el-select v-model="filter.deptId">
              <el-option
                v-for="(item,index) in [{name:'全部',value:-1}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>-->
          <div class="filter-condition">
            <span>支出类型：</span>
            <el-select v-model="filter.expendType">
              <el-option
                v-for="(item,index) in [{name:'全部',value:-1},{name:'营业支出',value:0},{name:'客户返利',value:1},{name:'员工提成',value:3}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-condition">
            <span>支出方式：</span>
            <el-select v-model="filter.moneyType">
              <el-option
                v-for="(item,index) in [{name:'全部',value:-1},{name:'营收款',value:0},{name:'备用金',value:1}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="filter-actions">
          <el-button class="normal_blue_btn" size="medium" @click="fetch">查询</el-button>
          <span class="condition-clear" @click="initFilter">清空条件</span>
          <br />
        </div>
      </div>
    </div>
    <div class="data-container" v-loading="loading">
      <div class="data-table">
        <el-table stripe :data="tableData" style="width: 100%" height="calc(100vh - 345px)">
          <el-table-column
            class-name="custom_cell border_left"
            class="c6"
            prop="createTime"
            label="创建时间"
          ></el-table-column>
          <el-table-column prop="name" label="支出项目名称"></el-table-column>
          <el-table-column label="支出金额">
            <template slot-scope="{row}">
              <p>¥{{row.money}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="支出部门"></el-table-column>
          <el-table-column label="支出类型">
            <template slot-scope="{row}">
              <p>{{expendTypes[row.expendType]}}</p>
            </template>
          </el-table-column>
          <el-table-column label="支出方式">
            <template slot-scope="{row}">
              <p>{{moneyTypes[row.moneyType]}}</p>
            </template>
          </el-table-column>
          <el-table-column label="凭证">
            <template slot-scope="{row}">
              <img
                v-if="row.photo"
                :src="utils.formatPicImg(row.photo)"
                style="width:40px;height:40px;"
                :preview="row.photo"
                :preview-text="''"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作人" prop="username"></el-table-column>
          <el-table-column class-name="custom_cell border_right" label="操作">
            <template slot-scope="{row}">
              <div>
                <g-button
                  :name="'编辑'"
                  :type="'detail'"
                  :icon="'icon_operate_edit'"
                  @click="editRecord(row)"
                ></g-button>
                <g-button
                  :name="'删除'"
                  :type="'cancel'"
                  :icon="'icon_operate_delete'"
                  @click="deleteRecord(row.id)"
                ></g-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-footer">
        <div></div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.pageSize"
            :pager-count="pages.pageNum"
            layout="total, prev, pager, next, jumper"
            :total="pages.totalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增开支 弹框 -->
    <el-dialog
      :closeOnClickModal="false"
      :before-close="dialogFormVisibleMethod"
      :title="addForm.id ? '编辑开支' : '新增开支'"
      :visible.sync="dialogFormVisible"
      class="add_dialog"
      width="800px"
    >
      <div class="add_area">
        <el-form
          :model="addForm"
          class="add_form"
          :rules="rules"
          ref="addRecordForm"
          v-loading="loading"
        >
          <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
            <el-input
              v-model="addForm.name"
              autocomplete="off"
              placeholder="请输入项目名称"
              maxlength="20"
              :disabled="formDisabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目类型" :label-width="formLabelWidth" prop="projectType">
            <el-select :disabled="formDisabled" v-model="addForm.projectType" placeholder="请选择">
              <el-option label="房租" :value="0"></el-option>
              <el-option label="水电费" :value="1"></el-option>
              <el-option label="物业费" :value="2"></el-option>
              <el-option label="办公费" :value="3"></el-option>
              <el-option label="管理费" :value="4"></el-option>
              <el-option label="工资提成" :value="5"></el-option>
              <el-option label="固定资产分摊" :value="6"></el-option>
              <el-option label="产品材料" :value="7"></el-option>
              <el-option label="财务费用" :value="8"></el-option>
              <el-option label="其他费用" :value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支出部门" :label-width="formLabelWidth" prop="deptId">
            <el-select :disabled="formDisabled" v-model="addForm.deptId" placeholder="请选择"></el-select>
          </el-form-item>
          <el-form-item label="支出类型" :label-width="formLabelWidth" prop="expendType">
            <el-select :disabled="formDisabled" v-model="addForm.expendType" placeholder="请选择">
              <el-option label="营业支出" :value="0"></el-option>
              <el-option label="客户返利" :value="1"></el-option>
              <el-option label="员工提成" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支出方式" :label-width="formLabelWidth" prop="moneyType">
            <el-select :disabled="formDisabled" v-model="addForm.moneyType" placeholder="请选择">
              <el-option label="营收款" :value="0"></el-option>
              <el-option label="备用金" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支出金额" :label-width="formLabelWidth" prop="money">
            <div class="el-input customer-add-input-box">
              <span class="cycle-span">元</span>
              <input type="text" placeholder="请输入支出金额" v-model.number="addForm.money" />
            </div>
          </el-form-item>
          <el-form-item
            label="上传凭证"
            :label-width="formLabelWidth"
            prop="photo"
            class="upload-img"
            style="width:450px"
          >
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="myHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="addForm.photo" :src="utils.formatPicImg(addForm.photo)" class="avatar" />
              <i class="icon iconfont icon-icon_num_add"></i>
            </el-upload>
            <p class="tip">
              支持jpg，png格式，大小不超过2M；
              <br />点击图片可重新上传
            </p>
          </el-form-item>
          <el-form-item
            label="备注"
            :label-width="formLabelWidth"
            class="desc_item"
            style="width:450px"
          >
            <input-with-count
              v-model="addForm.remark"
              :length="150"
              placeholder="请输入备注内容"
              :autosize="{ minRows: 5, maxRows: 100}"
            ></input-with-count>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button plain class="plain_gray_btn" @click="dialogFormVisibleMethod">取消</el-button>
        <el-button class="normal_blue_btn" @click="saveRecord">保存</el-button>
      </div>
    </el-dialog>
    <!-- 是否确认删除记录 -->
    <g-del-model
      :delTagDialogVisible="delTagDialogVisible"
      @close="delTagDialogVisible=false"
      @confirm="deleteConfirm"
      title="确定要删除吗？"
      content="删除后，该记录不可恢复。"
      icon="icon_popup_question"
      iconColor="#FF6D61"
    ></g-del-model>
  </div>
</template>

<script>
import "@/assets/css/upload/upload.scss";
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import * as api from "@/assets/js/interface";
export default {
  name: "businessList",
  data() {
    return {
      utils,
      isLastMonth: false,
      date: [],
      radioLabel: 1, // 1-本月 2-上月
      filter: {
        deptId: -1, // 支出部门
        expendType: -1, // 支出类型
        moneyType: -1, // 支出方式
        projectType: null, // 项目类型 - 筛选
        storeId: null // 门店id
      },
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 0, // 总条数
        pageSize: 10, // 每页的条数
        pageNum: 5 // 默认显示页面的下标数量
      },
      loading: false,
      dialogFormVisible: false,
      addForm: {
        name: "", // 项目名称
        projectType: null, // 项目类型
        money: "", // 支出金额
        deptId: "", // 部门ID
        deptName: "", // 部门名称
        expendType: "", // 支出类型
        moneyType: "", // 支出方式
        photo: "", // 凭证
        remark: "",
        id: null
      },
      formLabelWidth: "120px",
      tableData: [],
      dialogLoading: false,
      rules: {
        name: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          { required: true, message: "请输入项目名称", trigger: "change" }
        ],
        money: [
          { required: true, message: "请输入支出金额", trigger: "blur" },
          { required: true, message: "请输入支出金额", trigger: "change" } // 数字都没有做精度校验...
        ],
        expendType: [
          { required: true, message: "请选择支出类型", trigger: "blur" },
          { required: true, message: "请选择支出类型", trigger: "change" }
        ],
        moneyType: [
          { required: true, message: "请选择支出方式", trigger: "blur" },
          { required: true, message: "请选择支出方式", trigger: "change" }
        ],
        projectType: [
          { required: true, message: "请选择项目类型", trigger: "blur" },
          { required: true, message: "请选择项目类型", trigger: "change" }
        ]
      },
      formDisabled: false,
      test1: "",
      expendTypes: ["营业支出", "客户返利", "", "员工提成"],
      moneyTypes: ["营收款", "备用金"],
      delTagDialogVisible: false,
      delId: "",
      brandSpend: "1",
      shopList: []
    };
  },
  computed: {
    params() {
      return {
        brandId: this.isBrand ? this.currentInfo.brandId : null,
        storeId: this.isBrand
          ? this.brandSpend == "1"
            ? 0
            : this.filter.storeId
          : this.currentInfo.shopId,
        startTime: this.date[0] || null,
        endTime: this.date[1] || null,
        pageNum: this.pages.currentPage,
        pageSize: this.pages.pageSize,
        isLastMonth: this.radioLabel === 2,
        deptId: null, // 支出部门
        projectType: this.filter.projectType, // 项目类型
        expendType: this.filter.expendType >= 0 ? this.filter.expendType : null, // 支出类型
        moneyType: this.filter.moneyType >= 0 ? this.filter.moneyType : null // 支出方式
      };
    },
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    isBrand() {
      return this.$route.path.indexOf("brand") != -1;
    }
  },
  watch: {
    radioLabel(n) {
      if (n) {
        this.date = [];
        this.fetch();
      }
    },
    date(n) {
      if (n && n.length) {
        this.radioLabel = 0;
        this.fetch();
      }
    },
    brandSpend(val) {
      this.fetch();
    }
  },
  mounted() {
    this.getShopList();
    this.fetch();
  },
  methods: {
    // 获取门店列表
    async getShopList() {
      const res = await axios.get(`findShopList/${this.currentInfo.brandId}`);
      this.shopList = res.shopList;
    },
    shopChange() {
      this.handleCurrentChange(1);
    },
    editRecord(item) {
      // this.addForm = Object.assign({}, item) // 都不请求接口的 ...
      axios
        .get(`/getStoreExpendRecordById/${item.id}`)
        .then(res => {
          this.addForm = res;
          this.dialogFormVisible = true;
        })
        .catch(err => {});
    },
    deleteRecord(id) {
      this.delId = id;
      this.delTagDialogVisible = true;
    },
    deleteConfirm() {
      axios
        .post("/createOrUpdateStoreExpendRecord", {
          id: this.delId,
          deleted: true
        })
        .then(res => {
          this.delTagDialogVisible = false;
          this.$message({
            type: res.success ? "success" : "error",
            message: res.success ? "删除开支成功" : res.message
          });
          this.fetch();
        });
    },
    dialogFormVisibleMethod() {
      this.dialogFormVisible = false;
      this.resetFields();
    },
    resetFields() {
      this.$refs.addRecordForm.resetFields();
      this.formDisabled = false;
      this.addForm = {
        name: "", // 项目名称
        money: "", // 支出金额
        deptId: "", // 部门ID
        deptName: "", // 部门名称
        expendType: "", // 支出类型
        projectType: null, // 项目类型
        moneyType: "", // 支出方式
        photo: "", // 凭证
        remark: "",
        id: null
      };
    },
    handleAvatarSuccess(res, file) {
      this.addForm.photo = file.response.fileKey;
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
    // 新增开支、编辑开支
    saveRecord() {
      this.$refs["addRecordForm"].validate(valid => {
        if (valid) {
          const params = {
            ...this.addForm,
            storeId: this.isBrand ? null : this.currentInfo.shopId,
            brandId: this.currentInfo.brandId
          };
          this.loading = true;
          axios.post(`/createOrUpdateStoreExpendRecord`, params).then(res => {
            this.loading = false;
            this.resetFields();
            this.dialogFormVisible = false;
            setTimeout(() => {
              this.pages.currentPage = 1;
              this.fetch();
            }, 200);
            if (res.success) {
              this.$message({ type: "success", message: "保存开支成功" });
            } else {
              this.$message({ type: "error", message: res.message });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取数据
    fetch(isChangePage) {
      // 若不是通过改变页码请求数据，则将当前页置为第一页
      if (!isChangePage) this.pages.currentPage = 1;
      this.loading = true;
      axios
        .post(`/getStoreExpendRecordList`, {
          ...this.params
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.recordList;
          this.pages.totalCount = res.total;
        });
    },
    // 清空条件
    initFilter() {
      for (const k in this.filter) {
        this.filter[k] = -1;
      }
      this.filter.projectType = null
      this.filter.storeId = null
      this.fetch();
    },
    // 切换页码
    handleCurrentChange(val) {
      this.pages.currentPage = val;
      this.fetch(true);
    },
    test(e) {
      console.log(e);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.c3 {
  color: #333;
}

.c6 {
  color: #666;
}

.c9 {
  color: #999;
}

.page-container {
  padding: 20px 0;
}

.filter-container {
  margin-top: 20px;
  padding: 15px;
  background: #fff;
}

.filter-l1 {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .btn-group {
    /deep/ .el-radio-button__inner {
      width: 70px;
      height: 35px;
      line-height: 35px;
      padding-top: 0;
      padding-bottom: 0;
    }

    /deep/ .el-radio-button.is-active {
      .el-radio-button__inner {
        background: #58c9f3;
        border: none;
      }
    }
  }

  /deep/ .el-input__icon,
  /deep/ .el-input__inner {
    height: 35px;
    line-height: 35px;

    .el-range-separator {
      line-height: 28px;
    }
  }
}

.filter-l2 {
  position: relative;
  display: flex;
  justify-content: space-between;

  .filter-condition-container {
    margin-right: 217px;

    .filter-condition {
      display: inline-block;
      margin-top: 10px;
      margin-right: 20px;
      font-size: 14px;

      > span {
        display: inline-block;
        width: 70px;
        text-align: right;
      }

      /deep/ .el-input__icon {
        line-height: 35px;
      }

      /deep/ .el-input__inner {
        width: 150px;
        height: 35px;
        line-height: 35px;
      }
    }
  }

  .filter-actions {
    position: absolute;
    top: 10px;
    right: 0;
    width: 217px;
    padding-left: 25px;
    font-size: 14px;
    border-left: 1px solid #f0f1f4;

    .condition-clear {
      margin-left: 20px;
      color: #999;
      cursor: pointer;
    }

    .el-button {
      width: 71px;
    }
  }
}

.data-container {
  margin-top: 15px;
  background: #fff;
  border-radius: 8px;
}

.data-table {
  padding: 0 10px;
  .el-table {
    font-size: 12px;
    color: #333;

    /deep/ .grey-row {
      background-color: #f4f5f7;
    }

    /deep/ .cell {
      font-size: 14px;
    }

    /deep/ .custom_cell:not(.is-leaf) {
      &.border_left {
        border-left: 1px solid #ececec;
      }
      &.border_right {
        border-right: 1px solid #ececec;
      }
    }

    /deep/ .el-table__body tr:hover > td {
      background-color: transparent;
    }

    /deep/ .el-table__row {
      &.el-table__row--striped {
        background: #f4f5f7;
      }
    }
  }

  .table-customer_name {
    background: no-repeat right center;
    background-size: 15px 15px;
    padding-right: 20px;

    &.male {
      background-image: url("../../assets/img/male_tip.png");
    }

    &.female {
      background-image: url("../../assets/img/female_tip.png");
    }
  }

  .table-customer_level {
    padding: 2px 5px;
    border-radius: 10px;
    background-color: #9da8cc;
    color: #fff;
    font-size: 10px;
  }
}

.data-footer {
  display: flex;
  justify-content: space-between;
  padding: 17px 23px;
}

.first-btn {
  padding: 9px 17px;
  &:hover {
    background-color: #e02047;
  }
  &:active {
    background-color: #d11d42;
  }
}

.add_form {
  .cycle-span {
    float: right;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #f5f7fa;
    border-left: 1px solid #dcdfe6;
  }
  /deep/ .el-input.el-input--cycle {
    display: block;
    width: auto;
    margin-right: 40px;
  }

  /deep/ .el-form-item {
    display: inline-block;
    width: 49%;
  }
}

.customer-add-input-box {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  input {
    display: block;
    height: 40px;
    line-height: 40px;
    outline: none;
    border: none;
    text-indent: 14px;
    color: #606266;
    font-size: inherit;
    &::placeholder {
      color: #bbb;
    }
  }
}
</style>
