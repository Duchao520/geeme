<template>
  <div class="seller-seller-list">
    <div class="table-main">
      <div class="table-box">
        <el-table stripe :data="groupData" height="calc(100vh - 229px)" v-loading="loading">
          <el-table-column prop="name" show-overflow-tooltip label="分组名称"></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"></el-table-column>
          <el-table-column prop="username" show-overflow-tooltip label="创建人"></el-table-column>
          <el-table-column prop="sellPercent" show-overflow-tooltip label="推广提成比例">
            <template slot-scope="{row}">
              <p>{{row.sellPercent}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="invitePercent" show-overflow-tooltip label="邀请提成比例">
            <template slot-scope="{row}">
              <p>{{row.invitePercent}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="sellerNum" show-overflow-tooltip label="推客人数"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <g-button
                :name="'编辑'"
                class="text-cant-copy"
                :type="'detail'"
                :icon="'icon_operate_edit'"
                @click="toEdit(scope.row.id)"
              ></g-button>
              <g-button
                :name="'删除'"
                class="text-cant-copy"
                :type="'red'"
                :icon="'icon_operate_disable'"
                @click="toDelete(scope.row)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages-line">
        <el-pagination
          style="margin-right: 12px;"
          class="pagination"
          @current-change="handlePageChanged"
          :current-page="pageNum"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <g-del-model
      :delTagDialogVisible="banConfirmVisible"
      @confirm="banSeller"
      @close="banConfirmVisible = false"
      title="确定要删除吗？"
      content="删除后，该组别所有推客默认值清空。"
      icon="icon_popup_question"
      iconColor="#FCB322"
      :btnLoad="btnLoad"
    ></g-del-model>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      loading: false,
      brandId: null,
      storeId: null,
      pageNum: 1,
      pageSize: 15,
      // 分组表格数据
      groupData: [],
      // 表格数据总数
      total: null,
      // 禁用推客提示框标识
      banConfirmVisible: false,
      // 选中的分组id
      currentGroup: null,
      btnLoad: false
    };
  },
  mounted() {
    this.brandId = this.currentInfo.brandId;
    this.getGroupList();
  },
  methods: {
    ...mapActions(["saveSellerGroup"]),
    // 获取分组信息列表
    async getGroupList() {
      this.loading = true;
      const res = await axios.post("/getSellerGroupByBrandId", {
        brandId: this.brandId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      this.loading = false;
      this.total = res.total;
      this.groupData = res.sellerGroupInfoList;
    },
    // 表格分页切换事件
    handlePageChanged(index) {
      this.pageNum = index;
      this.getGroupList();
    },
    // 编辑
    async toEdit(id) {
      const res = await axios.get(`/getSellerGroupById/${id}`);
      // 向父组件传值
      this.$emit("editGroup", res.sellerGroupInfo);
    },
    // 删除
    toDelete(row) {
      this.currentGroup = row;
      this.banConfirmVisible = true;
    },
    // 确认删除分组
    async banSeller() {
      this.currentGroup.deleted = true;
      let params = this.currentGroup;
      this.btnLoad = true;
      const res = await axios.post("/createOrUpdateSellerGroup", params);
      if (res.success) {
        this.$message.success("删除分组成功");
        this.getGroupList();
      } else {
        this.$message.error(res.message);
      }
      this.btnLoad = false;
      this.banConfirmVisible = false;
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  watch: {}
};
</script>

<style  lang='scss' scoped>
.table-main {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 149px);
  border-radius: 6px;
  overflow: hidden;
  /deep/ .table-box {
    box-sizing: content-box;
  }
  .pages-line {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.el-tabs {
  background: #dee1e6;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 32px;
}
</style>