<template>
  <div class="root">
    <div class="user-defined-tab">
      <el-tabs v-model="activeTab" type="card" @tab-click="changeTab">
        <el-tab-pane
          v-for="(item, index) in shopClassTabs"
          :key="index"
          :label="item.lable"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="con">
      <div class="base-box scrollbar" v-loading="loading">
        <el-table :data="classData" stripe style="width: 100%" height="calc(100vh - 196px)">
          <el-table-column prop="date" label="排序">
            <template slot-scope="{ row }">
              <number-input
                @blur="
                  val => {
                    orderNoChange(val, row);
                  }
                "
                v-model="row.orderNo"
                class="input"
                placeholder="请输入排序"
                :min="0"
                :max="999"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="分类图标">
            <template slot-scope="{ row }">
              <img :src="utils.formatPicImage(row.icon, 'style', 40, 'someone')" class="avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column prop="showIcon" label="显示图标">
            <template slot-scope="{ row }">
              <img :src="utils.formatPicImage(row.showIcon, 'style', 40, 'someone')" class="avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="showName" label="显示名称">
            <template slot-scope="{ row }">
              <p>{{ row.showName ? row.showName : "-" }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作">
            <template slot-scope="{ row }">
              <g-button :name="'编辑'" type="detail" :icon="'icon_operate_edit'" @click="toEdit(row)"></g-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="data-footer">
          <div></div>
          <div>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="params.currentPage"
              :page-size="params.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑店铺分类"
      :visible.sync="editDialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="sortform" :model="sortForm" label-width="80px" :rules="sortRule">
        <el-form-item label="分类名称">
          <el-input v-model="sortForm.name" disabled style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="分类图标">
          <!-- <g-upload-spic @change="updateImg" :photo="sortForm.icon" :size="2"></g-upload-spic> -->
          <img :src="utils.formatPicImage(sortForm.icon, 'style', 40, 'someone')" class="avatar" />
        </el-form-item>
        <el-form-item label="显示名称" prop="showName">
          <el-input v-model="sortForm.showName" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="显示图标">
          <g-upload-spic @change="updateImg" :photo="sortForm.showIcon" :size="2"></g-upload-spic>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="sendData" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      utils,
      shopClassTabs: [
        {
          name: "1",
          lable: "分类信息"
        }
      ],
      loading: false,
      activeTab: "1",
      classData: [],
      params: {
        brandId: null,
        currentPage: 1,
        pageSize: 10
      },
      // 更新分类地址
      updateSort: "/updateStoreBusinessCategorySort",
      editDialogVisible: false,
      total: null,
      sortForm: {},
      sortRule: {},
      btnLoad: false
    };
  },
  created() {
    this.params.brandId = this.currentInfo.brandId;
    this.getShopClassInfo();
  },
  methods: {
    changeTab() {},
    // 获取品牌下的门店店铺分类
    async getShopClassInfo() {
      this.loading = true;
      const res = await axios.post("/getCategorySortListForPage", this.params);
      this.classData = res.responseList;
      this.total = res.total;
      this.loading = false;
    },
    // 权重改变
    async orderNoChange(val, row) {
      // if(row.orderNo.length)
      const res = await axios.post(this.updateSort, row);
      if (!res.success) this.$message.error("更新失败");
      this.$message.success("更新成功");
      this.handleCurrentChange(this.params.currentPage);
    },
    // 分页切换
    handleCurrentChange(val) {
      this.params.currentPage = val;
      this.getShopClassInfo();
    },
    // 编辑
    toEdit(row) {
      this.sortForm = JSON.parse(JSON.stringify(row));
      this.editDialogVisible = true;
    },
    // 编辑对话框关闭
    handleClose() {
      this.$refs.sortform.resetFields();
      this.editDialogVisible = false;
    },
    // 编辑图片上传
    updateImg(val) {
      this.$message.success("图片上传成功");
      this.sortForm.showIcon = val;
    },
    // 编辑对话框确认
    async sendData() {
      try {
        this.btnLoad = true;
        const res = await axios.post(this.updateSort, this.sortForm);
        if (!res.success) this.$message.error("更新失败");
        this.$message.success("更新成功");
        this.handleCurrentChange(this.params.currentPage);
        this.editDialogVisible = false;
        this.btnLoad = false;
      } catch (err) {
        this.btnLoad = false;
      }
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.root {
  box-sizing: border-box;
  margin: 0 20px;
  background-color: rgba(255, 255, 255, 1);
  position: relative;
  border-radius: 8px;
  margin-top: 20px;
  height: calc(100vh - 95px);
  .top-line {
    position: absolute;
    height: 34px;
    background: rgba(174, 184, 229, 0.3);
    width: 100%;
    border-radius: 10px 10px 0 0;
    color: #5f6368;
    line-height: 34px;
    font-size: 14px;
  }
  .con {
    box-sizing: border-box;
    .base-box {
      padding: 10px 20px;
      .input {
        /deep/ .el-input__inner {
          width: 40px;
          height: 35px;
          text-align: center;
          text-indent: 0;
        }
      }
      .data-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
      }
    }
  }
}

.avatar {
  display: block;
  width: 60px;
  height: 60px;
}
</style>
