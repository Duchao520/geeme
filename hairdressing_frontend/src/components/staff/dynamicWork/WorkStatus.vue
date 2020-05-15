 <template>
  <div :class="{'table-root': true, 'height-tall': !isTall, 'height-low': isTall}" ref="tableRoot">
    <el-checkbox-group v-model="checkIdsArr">
      <el-table v-loading="tableLoading" :data="data" height="100%" style="width: 100%" stripe>
        <el-table-column align="center" width="26px">
          <template slot-scope="scope">
            <el-checkbox :key="scope.$index" :label="scope.row"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="prop" width="300px" label="作品动态内容描述">
          <template slot-scope="scope">
            <router-link
              :to="{path:`/${authRouter.currentEntry}-inner/dynamic-work-detail`,query:{workId:scope.row.id}}"
            >
              <div class="detail">
                <img
                  :src="scope.row.photos[0]?utils.formatPicImg(scope.row.photos[0],'style',40):''"
                />
                <div class="text">
                  <div class="text-top">
                    <el-popover placement="top-start" min-width="200" trigger="hover">
                      <p v-text="scope.row.description" style="padding: 10px;text-align: center;"></p>
                      <p slot="reference" v-if="scope.row.description">{{scope.row.description}}</p>
                    </el-popover>
                  </div>
                  <p class="text-bottom">
                    <span v-for="item in scope.row.serviceName" :key="item">{{item}}</span>
                  </p>
                </div>
              </div>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="thumbUp" label="分类">
          <template slot-scope="{ row }">
            <span>{{ row.worksCategoryInfoSet | cateFilter }}</span>
            <i class="el-icon-edit-outline edit-cate" @click="addCate(row)"></i>
          </template>
        </el-table-column>
        <el-table-column align="left" label="关联商品">
          <template
            slot-scope="scope"
            v-if="scope.row.namePriceList&&scope.row.namePriceList.length>0"
          >
            <div class="text-info" v-for="(item,index) in scope.row.namePriceList" :key="index">
              <span>{{item.name}} ￥{{item.price}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="发布人">
          <template slot-scope="scope">{{scope.row.name?scope.row.name: '-'}}</template>
        </el-table-column>
        <el-table-column prop="thumbUp" label="点赞"></el-table-column>
        <el-table-column prop="collections" label="收藏"></el-table-column>
        <el-table-column prop="comments" label="评论"></el-table-column>
        <el-table-column prop="shares" label="分享"></el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="200"></el-table-column>
        <el-table-column align="center" prop="prop" label="状态" width="56">
          <template slot-scope="scope">
            <div class="button-box">
              <button class="button-text" style="background:#F52D56" v-if="scope.row.hotS">热门</button>
              <span v-else>-</span>
              <!-- <button class="button-text" style="background:#4A90E2" v-if="scope.row.coverS">封面</button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <button
              v-if="activeName==='DELETED'"
              class="reverse-button"
              @click="staffDynamicWorksStatusChangeByIds(false,scope.row.id)"
            >
              <i class="icon iconfont icon-icon_operate_recover"></i>
              <span>恢复</span>
            </button>
            <g-button
              :name="''"
              type="cancel"
              :icon="'icon_operate_delete'"
              @click="staffDynamicWorksStatusChangeByIds(true,scope.row.id)"
              v-else
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
    <g-del-model
      :delTagDialogVisible="showDialog"
      @close="showDialog=false"
      @confirm="showDialog=false"
      :title="'该作品暂时不能取消热门'"
      :content="'封面作品不可取消热门，请联系品牌管理员进行修改！'"
      :icon="'icon_popup_question'"
      :iconColor="'#FCB322'"
    ></g-del-model>
    <g-del-model
      :delTagDialogVisible="delTagDialogVisible"
      @close="delTagDialogVisible=false"
      @confirm="confirmDelTag"
      :title="'确定要删除吗？'"
      :content="'该作品动态将在客户端、服务者端同步删除，请谨慎操作！'"
      :icon="'icon_popup_question'"
      :iconColor="'#FF6D61'"
    ></g-del-model>
    <!-- 设置动态分类对话框 -->
    <el-dialog
      title="设置动态分类"
      :visible.sync="cateDialogVisible"
      width="30%"
      class="add-cate-dialog"
      :before-close="handleClose"
      v-if="fixdCateList"
      :destroy-on-close="true"
    >
      <div v-loading="cateLoad">
        <el-checkbox-group v-model="fixdCateList" class="add-cate-check">
          <el-checkbox
            :label="item.id"
            v-for="item in cateList"
            :key="item.id"
            style="margin-bottom: 5px;"
          >{{ item.showName }}</el-checkbox>
        </el-checkbox-group>
        <el-input
          class="add-cate-icon"
          size="medium"
          placeholder="输入分类名称"
          maxlength="12"
          v-model="addNewCate"
          style="width: 200px; margin-top: 20px;"
        >
          <div slot="append" @click="addNewCateFn" class="cate-add">
            <i class="el-icon-plus"></i>
          </div>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button class="normal_red_btn" @click="confirmCate" :loading="cateBtnLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { setTimeout } from "timers";
export default {
  props: {
    activeName: String,
    params: Object,
    chageVal: Boolean,
    isTall: {
      type: Boolean,
      default: false
    }
    // data: Array
  },
  data() {
    return {
      utils: utils,
      filterParam: "praise",
      sortParam: {
        praise: true,
        coll: true,
        comment: true,
        share: true
      },
      checkIdsArr: [],
      idToDel: null,
      isCover: false,
      showDialog: false,
      data: [],
      tableLoading: false,
      delTagDialogVisible: false,
      delId: [],
      cateDialogVisible: false,
      fixdCateList: [],
      currentCateId: null,
      addNewCate: "",
      cateList: [], // 对话框中的分类信息
      cateLoad: false,
      cateBtnLoad: false,
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    queryParam() {
      return {};
    },
    authRouter() {
      return this.$store.state.authRouter;
    },
    iDdata() {
      let arr = [];
      if (this.checkIdsArr) {
        this.checkIdsArr.forEach(item => {
          arr.push(item.id);
        });
      }
      return arr;
    }
  },
  watch: {
    activeName() {
      this.tableLoading = true;
      let args = {
        fn: "query"
      };
      this.deplay(args);
      // this.query()
    },
    data(val) {
      this.$emit("sendData", val);
    },
    iDdata(val) {
      if (val.length < this.data.length) {
        this.$emit("resetCheckAll", false);
      } else {
        this.$emit("resetCheckAll", true);
      }
    },
  },
  created() {
      console.log(this.isTall)
  },
  mounted() {
    this.query();
  },
  filters: {
    cateFilter(val) {
      let showText = val ? val.map(i => i.showName) : [];
      return showText.join("、");
    }
  },
  methods: {
    // 添加修改分类
    async addCate(data) {
      this.currentCateId = data.id;
      this.fixdCateList = data.worksCategoryInfoSet
        ? data.worksCategoryInfoSet.map(i => i.id)
        : [];
      this.cateLoad = true;
      this.cateDialogVisible = true;
      this.getCateInfo();
    },
    async getCateInfo() {
      // 获取品牌下的员工动态分类信息
      const res = await axios.post("/getStaffDynamicCategoryList", {
        brandId: this.currentInfo.brandId
      });
      this.cateLoad = false;
      this.cateList = res.staffDynamicWorksCategoryList;
    },
    async confirmCate() {
      this.cateBtnLoad = true;
      const res = await axios.post("/updateDynamicWorksCategory", {
        id: this.currentCateId,
        categorySet: this.fixdCateList
      });
      if (!res.success) {
        this.cateBtnLoad = false;
        return this.$message.error("修改失败");
      } else {
        this.cateBtnLoad = false;
        this.$message.success("修改成功");
        this.cateDialogVisible = false;
        this.query();
      }
    },
    handleClose() {
      this.cateDialogVisible = false;
    },
    changeSort(data) {
      this.filterParam = data; /* 切换点亮位置 */
      this.sortParam[data] = !this.sortParam[
        data
      ]; /* 切换排序状态（升序/降序） */
      this.query();
    },
    // 对话框中的添加
    async addNewCateFn() {
      if (!this.addNewCate) return this.$message.error("分类名称不能为空");
      this.cateLoad = true;
      const res = await axios.post("/addOrModifyStaffDynamicCategory", {
        brandId: this.currentInfo.brandId,
        showName: this.addNewCate
      });
      if (!res.success) {
        this.cateLoad = false;
        return this.$message.error(
          `添加失败，${res.message.split(",")[0]}：${res.message.split(":")[1]}`
        );
      } else {
        this.cateLoad = false;
        this.$message.success("添加成功");
        this.getCateInfo();
        this.addNewCate = "";
      }
    },
    // 勾选复现
    isCheckd(data) {
      let flag = false;
      this.fixdCateList.forEach(item => {
        if (item.id == data.id) {
          flag = true;
        }
      });
      return flag;
    },
    query(params) {
      let that = this;
      that.tableLoading = true;
      let param = params ? params : that.params;

      setTimeout(function() {
        axios.post(`/getStaffDynamicListByConditions`, param).then(res => {
          that.tableLoading = false;
          that.data = res.staffWorksLists;
          that.$emit("settotal", res.total);
        });
      }, 200);
    },
    checkAll(bool) {
      if (bool) {
        this.data.forEach(element => {
          this.checkIdsArr.push(element);
        });
        this.checkIdsArr = [...new Set(this.checkIdsArr)];
      } else {
        this.checkIdsArr = [];
      }
    },
    reset() {
      this.checkIdsArr = [];
      this.$emit("resetCheckAll");
    },
    /* 根据员工作品动态ID设置为热门或非热门 */
    setStaffDynamicWorksIsHotByIds(bool) {
      if (this.iDdata.length === 0) {
        this.$message({ type: "warning", message: "请先选择作品" });
        return;
      }
      let data = [];
      this.checkIdsArr.filter(item => {
        if (item.coverS) {
          this.isCover = true;
        } else {
          this.isCover = false;
        }
      });
      if (this.isCover && !bool) {
        this.showDialog = true;
      } else {
        axios
          .put(`${SERVICE_URL}/service-api/setStaffDynamicWorksIsHotByIds`, {
            idList: this.iDdata,
            isHot: bool
          })
          .then(res => {
            this.setStaffDynamicWorksIsHotByIdsRes(res);
          });
      }
    },
    setStaffDynamicWorksIsHotByIdsRes(res) {
      this.reset();
      this.query();
      if (res.success) {
        this.$message({ type: "success", message: "操作成功" });
      }
    },

    /* 根据员工作品动态ID设置为热门或非热门 */
    setStaffCovers(bool) {
      if (this.iDdata.length === 0) {
        this.$message({ type: "warning", message: "请先选择作品" });
        return;
      }
      axios
        .post(`${SERVICE_URL}/service-apisetStaffDynamicWorksIsCoverByIds`, {
          idList: this.iDdata,
          cover: bool
        })
        .then(res => {
          this.setStaffDynamicWorksIsHotByIdsRes(res);
        });
    },

    /* 员工作品动态作品删除与恢复 */
    staffDynamicWorksStatusChangeByIds(bool, id) {
      //
      let param;
      if (id === undefined) {
        if (this.iDdata.length === 0) {
          this.$message({ type: "warning", message: "请先选择作品" });
          return;
        } else {
          param = {
            idList: this.iDdata,
            isDeleted: bool
          };
        }
      } else {
        param = {
          idList: [id],
          isDeleted: bool
        };
      }
      // 修改的逻辑 删除弹出确认框  恢复无提示框
      if (param.isDeleted) {
        this.delId = param.idList;
        this.delTagDialogVisible = true;
      } else {
        axios.put("staffDynamicWorksStatusChangeByIds", param).then(res => {
          this.staffDynamicWorksStatusChangeByIdsRes(res);
        });
      }
    },
    staffDynamicWorksStatusChangeByIdsRes(res) {
      this.reset();
      this.query();
      if (res.success) {
        this.$message({ type: "success", message: "操作成功" });
      }
    },
    confirmDelTag() {
      this.delTagDialogVisible = false;
      axios
        .put("staffDynamicWorksStatusChangeByIds", {
          idList: this.delId,
          isDeleted: true
        })
        .then(res => {
          this.staffDynamicWorksStatusChangeByIdsRes(res);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-checkbox__label {
  display: none;
}

.add-cate-dialog {
  /deep/ .el-dialog {
    border-radius: 10px;
  }
}

.add-cate-check {
  /deep/ .el-checkbox {
    margin-left: 0;
    width: 20%;
    .el-checkbox__label {
      display: inline-block;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    &:nth-child(4n) {
      margin-right: 10px;
    }
  }
}

.edit-cate {
  cursor: pointer;
  color: #58c9f3;
  vertical-align: middle;
  font-size: 16px;
}

.add-cate-icon {
  /deep/ .el-input-group__append {
    cursor: pointer;
    background-color: #409eff;
    border: 1px solid #409eff;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    padding: 0;
    i {
      width: 52px;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
@mixin c-button($color, $border, $bg) {
  background: $bg;
  color: $color;
  border: 1px solid $border;
  line-height: 28px;
  font-size: 12px;
  box-sizing: border-box;
  padding: 0 9px;
  border-radius: 3px;
  margin-right: 4px;
}
.table-root {
  box-sizing: border-box;
  background: #ffffff;
  padding: 0 20px;
  .el-table th.is-leaf,
  .el-table td {
    border: none;
  }
  .detail {
    display: flex;
    img {
      width: 70px;
      height: 70px;
      display: block;
      border-radius: 5px;
    }
    .text {
      font-size: 12px;
      line-height: 17px;
      box-sizing: border-box;
      padding-left: 8px;
      width: 75%;
      .text-top {
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        width: 197px;
        height: 34px;
      }
      .text-bottom {
        margin-top: 8px;
        color: rgba(153, 153, 153, 1);
        span {
          margin-right: 5px;
        }
      }
    }
  }
  .status-button {
    line-height: 16px;
    font-size: 12px;
    box-sizing: border-box;
    padding: 0 6px;
    background: #000;
    border-radius: 8px;
    width: 37px;
    margin: 9px;
    color: white;
  }
  .del-button {
    @include c-button(#676868, #bec3c6, #ffffff);
  }
  .reverse-button {
    @include c-button(#75c74f, #75c74f, #ffffff);
  }
  .button-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
  .button-text {
    width: 37px;
    height: 16px;
    line-height: 16px;
    color: white;
    border-radius: 8px;
    font-size: 12px;
    margin-bottom: 7px;
  }
  .el-checkbox-group {
    height: 100%;
  }
}
.text-info {
  color: #666666;
  font-size: 12px;
  line-height: 20px;
}

.height-tall {
  height: calc(100vh - 347px);;
}
.height-low {
  height: calc(100vh - 400px);;
}
</style>
