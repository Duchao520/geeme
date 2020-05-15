 <template>
  <div class="org-job" id="org-job" v-loading="bodyLoading">
    <div class="header-line">
      <div class="left-box">
        <el-radio-group v-model="type" v-if="!isShop">
          <el-radio-button label="BRAND">总部职务</el-radio-button>
          <el-radio-button label="STORE">门店职务</el-radio-button>
        </el-radio-group>
        <el-button class="normal_red_btn" @click="addNewJob" :style="isShop ? '' : 'margin-left: 20px;'">新增职务</el-button>
        <el-checkbox v-model="allowStoreAdd" style="margin-left: 20px;" v-if="!isShop">允许门店自行操作职务</el-checkbox>
      </div>
      <div class="right-box">
        <div class="search-box">
          <g-search placeholder="请输入职务名称" v-on:search="handleSearch" :clearable="true"></g-search>
        </div>
      </div>
    </div>
    <div class="base-job-table">
      <el-table :data="tableData" stripe :key="0" height="calc(100vh - 290px)">
        <el-table-column label="排序" prop="orderNo">
          <template slot-scope="scope">
            <!-- <el-input
              type="number"
              v-model.number="scope.row.orderNo"
              maxlength="3"
              @blur="changeSort(scope.row)"
              :ref="'job'+scope.row.id"
              :min="0"
            ></el-input>-->
            <number-input
              :ref="'job'+scope.row.id"
              @blur="changeSort(scope.row)"
              v-model="scope.row.orderNo"
              id="input"
              placeholder="请输入排序"
              :min="0"
              :max="999"
            ></number-input>
            <!-- @keyup.enter.native="changeSort(scope.row)" -->
          </template>
        </el-table-column>
        <el-table-column label="职务名称" prop="name"></el-table-column>
        <el-table-column label="职务分类">
          <template slot-scope="scope">
            <span>{{scope.row.server ? '服务者' : '非服务者'}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="职务人数" align="center" prop="count"></el-table-column> -->

        <!-- <el-table-column label="权限" align="center">
          <template slot-scope="scope">
            <div class="edit-auths" v-if="scope.row.auths.length" @click="handleEditRoot(scope.row)">
              <span class="edit-span">
                {{scope.row.auths | rootFilter}}
                <i class="icon iconfont icon-icon_operate_edit icon-info"></i>
              </span>
            </div>
            <el-button v-else type="success" plain @click="handleEditRoot(scope.row)" icon="el-icon-setting" size="mini">设置</el-button>
          </template>
        </el-table-column>-->

        <el-table-column label="设置权限">
          <template slot-scope="scope">
            <span>{{scope.row.storeId ? '门店' : '总部'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <g-button
              :name="'编辑'"
              type="detail"
              :icon="'icon_operate_edit'"
              @click="handleEdit(scope.row)"
            ></g-button>
            <g-button
              v-if="!scope.row.deleted"
              :name="'删除'"
              type="cancel"
              :icon="'icon_operate_delete'"
              @click="handleDel(scope.row)"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer-line">
        <el-pagination
          v-if="!bodyLoading"
          layout="total, prev, pager, next, jumper"
          @current-change="handleChangeJobs"
          :current-page.sync="jobPages.currentPage"
          :page-size="jobPages.pageSize"
          :total="tableTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 职务对话框 -->
    <el-dialog :title="titleMap[dialogType]" :visible.sync="jobDialogFormVisible" width="500px">
      <el-form :model="jobForm" :rules="rules" ref="ruleForm">
        <el-form-item label="职务归属">
          <el-radio v-model="jobForm.type" label="BRAND" :disabled="isShop">总部职务</el-radio>
          <el-radio v-model="jobForm.type" label="STORE" :disabled="isShop">门店职务</el-radio>
        </el-form-item>
        <el-form-item label="职务分类">
          <el-radio v-model="jobForm.server" :label="true">服务者</el-radio>
          <el-radio v-model="jobForm.server" :label="false">非服务者</el-radio>
        </el-form-item>
        <el-form-item label="职务名称" prop="name">
          <el-row>
            <el-col :span="12">
              <el-input v-model="jobForm.name" placeholder="请输入职务名称" maxlength="16"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jobDialogFormVisible = false">取 消</el-button>
        <el-button :loading="jobLoading" type="primary" @click="updataJobs('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 权限对话框 -->
    <!-- <el-dialog title="权限设置" width="500px" :visible.sync="rootDialogFormVisible" id='org-auths-tree-dialog'>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedRoots" @change="handleCheckedRootsChange">
        <el-checkbox v-for="item in roots" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rootDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataRoots" :loading="rootLoading">保 存</el-button>
      </div>
    </el-dialog>-->
    <!-- 删除否决Dialog -->
    <el-dialog width="500px" :visible.sync="delDenyVisible">
      <div class="delDenyBox">
        <i class="el-icon-warning"></i>
        <div class="tips">
          <h2>{{dialogTitle}}</h2>
          <p>该职务下设有员工，须先将相关员工删除或更换职务。</p>
        </div>
      </div>
      <div slot="footer" class="delDenyFooter">
        <el-button @click="delDenyVisible = false">取 消</el-button>
        <el-button class="light-blue" type="primary" @click="viewRefs">查看关联员工</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示框 -->
    <g-dialog-with-slot
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定要删除该职务吗？'"
      :dialogVisible="dialogVisible"
      @resolve="confirmDel"
      @close="dialogVisible=false"
      :btnLoad="btnLoad"
    >
      <div>删除后，所有赋予该职务的人员职务为空。</div>
    </g-dialog-with-slot>
  </div>
</template>
 
 <script>
import * as axios from "@/util/axios";
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import { reg, checkReg } from "@/assets/js/RegExp";
export default {
  name: "org-job",
  data() {
    const validateJobName = (rule, val, cb) => {
      if (!checkReg(reg["jobName"], val)) {
        cb(new Error("职务名称为2~16字符长度的中英文字符串!"));
      } else {
        cb();
      }
    };
    return {
      jobLoading: false,
      rootLoading: false,
      type: "BRAND", // 当前进行编辑的页面  总部BRAND 门店STORE
      tableData: [],
      tableTotal: 0,
      searchKey: "",
      jobPages: {
        currentPage: 1,
        pageSize: 10
      },
      titleMap: {
        add: "新增职务",
        edit: "编辑职务"
      },
      dialogType: "add",
      jobDialogFormVisible: false,
      rootDialogFormVisible: false,
      checkAll: false, // 权限是否全选
      isIndeterminate: false,
      checkedRoots: [], // 选中的权限数组, 请求时提交这个!
      allRootsIds: [], // 用于匹配的数组
      roots: [], // 存放id和name的渲染数组
      editRootJobId: null, // 被编辑的职务id,
      jobForm: {
        id: null,
        type: "", // BRAND 品牌  STORE 门店
        server: false,
        name: ""
      },
      rules: {
        name: [{ required: true, validator: validateJobName, trigger: "blur" }]
      },
      bodyLoading: null,
      delDenyVisible: false,
      dialogTitle: "该职务暂时不能删除!",
      allowStoreAdd: null,
      dialogVisible: false,
      // 要删除的职务
      delDuty: {},
      btnLoad: false,
    };
  },
  created() {
    this.getStoreIsAdd()
    this.init();
  },
  methods: {
    // 获取门店是否可以自增职务
    async getStoreIsAdd() {
      const res = await axios.get(`/checkCreateMemberLevelForStore/${this.currentInfo.brandId}`)
      this.allowStoreAdd = res.success
    },
    init(res) {
      if (res && !res.success) {
        this.delDenyVisible = true;
      }
      // 表单遮罩
      this.bodyLoading = true;
      // 权限及职务编辑遮罩
      this.jobDialogFormVisible = false;
      this.rootDialogFormVisible = false;
      this.jobLoading = false;
      this.rootLoading = false;
      let params = {
        brandId: this.currentInfo.brandId,
        storeId: this.isShop ? this.currentInfo.shopId : null,
        name: this.searchKey,
        pageParam: {
          ...this.jobPages
        },
        type: this.isShop ? 'STORE' : this.type
      };
      axios.post(api.getStaffLevelByFilter.URL, params).then(res => {
        this.getListRes(res);
      });
      // 模拟接口 1
      // this.roots = [
      //   {id: 1, name: '店长'},
      //   {id: 2, name: '前台'},
      //   {id: 3, name: '服务者'},
      //   {id: 4, name: '财务'},
      //   {id: 5, name: '店长'},
      //   {id: 6, name: '前台'},
      //   {id: 7, name: '服务者'},
      //   {id: 8, name: '财务'}
      // ]
      // end 1
    },
    getListRes(res) {
      // 取消表单遮罩
      this.bodyLoading = false;
      this.tableData = res.levelList;
      this.tableTotal = res.total;
    },
    handleSearch(keyword) {
      console.log(keyword);
      this.searchKey = keyword;
      this.init();
    },
    handleEdit(row) {
      if (this.isShop && row.storeId === 0) {
        return this.$message.warning('门店不允许操作品牌创建的职务！')
      }
      if (this.isShop && !this.allowStoreAdd) {
        this.$message.warning('暂未开放权限，请前往总部进行设置。')
        return
      }
      this.isAllowEditDel(row.id)
        .then(res => {
          this.dialogType = "edit";
          this.jobDialogFormVisible = true;
          this.jobForm = {
            id: row.id,
            type: this.type,
            server: row.server,
            name: row.name
          };
          this.$nextTick(() => {
            this.$refs["ruleForm"].clearValidate();
          });
        })
        .catch(err => {
          this.dialogTitle = "该职务暂时不能编辑!";
          this.delDenyVisible = true;
        });
    },
    handleDel(row) {
      if (this.isShop && row.storeId === 0) {
        return this.$message.warning('门店不允许操作品牌创建的职务！')
      }
      if (this.isShop && !this.allowStoreAdd) {
        this.$message.warning('暂未开放权限，请前往总部进行设置。')
        return
      }
      this.delDuty = row;
      this.dialogVisible = true;
    },
    confirmDel() {
      this.btnLoad = true;
      this.isAllowEditDel(this.delDuty.id)
        .then(res => {
          axios
            .post(api.deleteStaffLevel.URL, { id: this.delDuty.id })
            .then(res => {
              utils.showTip(this, { msg: "删除成功", type: "success" });
              this.init();
              this.btnLoad = false;
              this.dialogVisible = false;
            });
        })
        .catch(err => {
          this.dialogTitle = "该职务暂时不能删除!";
          this.delDenyVisible = true;
          this.btnLoad = false;
        });
    },
    isAllowEditDel(id) {
      return new Promise((resolve, reject) => {
        axios.get("/getPermissionForOperations/" + id).then(res => {
          if (res.permission) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    handleChangeJobs(page) {
      this.jobPages.currentPage = page;
      this.init();
    },
    addNewJob() {
      if (this.isShop && !this.allowStoreAdd) {
        this.$message.warning('暂未开放权限，请前往总部进行设置。')
        return
      }
      this.dialogType = "add";
      this.jobDialogFormVisible = true;
      // 格式化表单内容
      this.jobForm = {
        id: null,
        type: this.isShop ? 'STORE' : this.type,
        server: this.type !== "BRAND",
        name: ""
      };
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    updataJobs(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return false;
        this.jobLoading = true;
        if (this.dialogType === "add") {
          axios
            .post(api.createStaffLevel.URL, {
              brandId: this.currentInfo.brandId,
              storeId: this.isShop ? this.currentInfo.shopId : null,
              ...this.jobForm
            })
            .then(res => {
              utils.showTip(this, { msg: "新增成功", type: "success" });
              this.init();
            })
            .catch(err => {
              this.jobLoading = false;
            });
        } else if (this.dialogType === "edit") {
          axios
            .post(api.updateStaffLevel.URL, {
              brandId: this.currentInfo.brandId,
              ...this.jobForm
            })
            .then(res => {
              utils.showTip(this, { msg: "编辑成功", type: "success" });
              this.init();
            })
            .catch(err => {
              this.jobLoading = false;
            });
        }
      });
    },
    /* handleEditRoot(row) {
        // 设置和编辑权限都在这里
        this.editRootJobId = row.id
        // 设置选中的权限
        this.checkedRoots = []
        if (row.auths.length) {
          row.auths.forEach(v => {
            this.checkedRoots.push(v.id)
          })
        }
        // 将所有的可选权限放入匹配数组
        this.allRootsIds = []
        this.roots.forEach(v => {
          this.allRootsIds.push(v.id)
        })
        this.rootDialogFormVisible = true
      }, */
    /*  updataRoots() {
        // 提交权限
        this.rootLoading = true
        console.log('门店?总部?: ', this.type)
        console.log('职务: ', this.editRootJobId)
        console.log('权限: ', this.checkedRoots)
      }, */
    handleCheckedRootsChange(v) {
      let checkedCount = v.length;
      this.checkAll = checkedCount === this.roots.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roots.length;
    },
    handleCheckAllChange(v) {
      this.checkedRoots = v ? this.allRootsIds : [];
      this.isIndeterminate = false;
    },
    changeSort(row) {
      if (checkReg(reg["positiveInteger"], row.orderNo)) {
        let params = { ...row };
        delete params.count;
        axios.post(api.updateStaffLevel.URL, params).then(res => {
          this.init();
        });
      } else {
        utils.showTip(this, { msg: "请输入大于0的整数!", type: "error" });
        // this.$refs['job'+row.id].focus()
      }
    },
    viewRefs() {
      if (!this.isShop) {
        this.$router.push("/brand-inner/staff/staff-list");
      } else {
        this.$router.push("/shop-inner/staff/staff-list");
      }
    }
  },
  filters: {
    /* rootFilter(rootArr) {
        let r = []
        rootArr.forEach(v => {
          r.push(v.name)
        })
        return r.join(';')
      } */
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    isShop() {
      return this.$route.path.indexOf("shop") !== -1;
    }
  },
  watch: {
    type: {
      handler: function(v, o) {
        o && this.init();
      },
      deep: true,
      immediate: true
    },
    'allowStoreAdd'(val, old) {
      if (old === null) return
      axios.post('/updateStoreMemberLevel',{
        brandId: this.currentInfo.brandId,
        storeMemberLevel: val
      }).then(res => {
        if (!res.success) return this.$message.error('设置失败')
        this.$message.success('设置成功')
        this.init()
      })
    },
  }
};
</script>
 
 <style lang='scss' scoped>
#org-auths-tree-dialog {
  .el-checkbox-group .el-checkbox {
    margin: 5px 20px 0 0;
  }
}
#org-job {
  .el-radio-button.is-active {
    .el-radio-button__inner {
      background-color: #58c9f3;
      border-color: #58c9f3;
    }
  }
}
</style>
 
 <style scoped lang="scss">
.org-job {
  padding: 0 20px 20px 30px;
  box-sizing: border-box;
  min-height: calc(100vh - 150px);
}
.header-line {
  height: 35px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.base-job-table {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
  &::after {
    content: "";
    display: table;
  }
  .delete-btn {
    background: #fff;
    border: 1px solid #bec3c6;
    color: #bec3c6;
  }
  .delete-btn:hover {
    background: #bec3c6;
    color: #fff;
  }
}
.footer-line {
  margin: 20px 0 15px;
  padding-right: 15px;
}
.edit-auths {
  span.edit-span {
    position: relative;
    .iconfont {
      position: absolute;
      top: -2px;
      right: -18px;
      display: none;
    }
  }
  &:hover {
    span.edit-span {
      cursor: pointer;
      .icon-icon_operate_edit {
        display: block;
        color: #58c9f3;
      }
    }
  }
}
.delDenyBox {
  display: flex;
  padding: 0 0 0 60px;
  i {
    color: #fcb322;
    font-size: 50px;
  }
  div {
    margin: 0 0 0 15px;
    p {
      width: 270px;
      font-size: 14px;
      line-height: 20px;
      margin: 5px 0 0 0;
    }
  }
}
.delDenyFooter {
  button.light-blue {
    background: #58c9f3;
    border: none;
  }
}

#input {
  /deep/ .el-input__inner {
    width: 40px;
    height: 35px;
    text-align: center;
    text-indent: 0;
  }
}

/deep/ .el-loading-mask {
  top: -10px;
}
</style>
 