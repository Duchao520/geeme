<template>
  <div class="commission-list-page">
    <div class="search-line">
      <g-search :placeholder='"搜索方案名称/适用职务"' v-on:search="handleSearch"></g-search>
    </div>
    <el-table
      stripe
      :data="tableData"
      v-loading="tableLoading"
      height="calc(100vh - 277px)" 
      @selection-change="handleSelectionChanged"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="适用员工职务" show-overflow-tooltip prop="postName"></el-table-column>
      <el-table-column label="提成方案名称" show-overflow-tooltip prop="name"></el-table-column>
      <el-table-column label="计算方式" prop="computeType">
        <template slot-scope="scope">
          <span>{{scope.row.computeType|computeTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="userName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="修改人" prop="modifyUserName"></el-table-column>
      <el-table-column label="最近修改时间" prop="modifyTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <g-button
            :name="'编辑'"
            :type="'detail'"
            :icon="'icon_operate_edit'"
            padding="0 8px"
            @click="editCommission(scope.row)"
            v-if="scope.row.id"
          ></g-button>
          <g-button
            :name="'设置'"
            :icon="'info_set'"
            padding="0 8px"
            @click="setCommission(scope.row)"
            v-else
          ></g-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-line">
      <el-button class="normal_blue_btn" size="small" @click="handleMultipleSetCommission">批量设置</el-button>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapActions, mapState } from "vuex"
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 20,
      keyword: null,
      total: 0,
      tableData: [], // 
      tableLoading: false, // 
      selectedRows: [], // 当前页选中的行
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(["setCardScheme"]),
    async init() {
      let data = {
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        keyword: this.keyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      this.tableLoading = true
      let res = await axios.post('/newGetCommissionCardList', data)
      if (res.success) {
        this.tableLoading = false
        this.tableData = res.listNewCommissionCardInfo || []
        this.total = res.total || 0
      }
    },
    // 切换页码
    handleCurrentChange (val) {
      this.pageNum = val
      this.init()
    },
    // 搜索
    handleSearch(keyword) {
      this.keyword = keyword || null
      this.init()
    },
    // 编辑
    editCommission(row) {
      this.setCardScheme({
        id: row.id, // 方案id
        postId: row.postId, // 单个设置的职务id
        postName: row.postName, // 单个设置的职务名称
        postInfoList: [], // 清空批量设置的职务
        computeType: row.computeType, // 提成计算方式
        name: row.name, // 提成方案名称
        type: 'edit', // 存储操作状态
      })
      this.toSetComssionPage()
    },
    // 设置
    setCommission(row) {
      this.setCardScheme({
        id: null, // 设置没有方案id - 相当于新增
        postId: row.postId, // 单个设置的职务id
        postName: row.postName, // 单个设置的职务名称
        postInfoList: [], // 清空批量设置的职务
        computeType: 1, // 提成计算方式 1 固定
        name: null, // 提成方案名称
        type: 'create',
      })
      this.toSetComssionPage()
    },
    // 批量设置(新增)
    handleMultipleSetCommission() {
      let list = this.selectedRows.map(i => { return {postId: i.postId, postName: i.postName}})
      
      // - 根据所选的行判断， 没有选中的先提示，
      if (!this.selectedRows.length) { 
        this.$message({type: 'error', message: '请选择至少一行未设置的职务'})
      } else {
        let r = this.selectedRows.some(i => {return i.id !== null})
        if (r) {
          this.$message({type: 'error', message: '请勿选择已经设置过的方案'})
        } else {
          let list = this.selectedRows.map(i => { return {postId: i.postId, postName: i.postName}})
          this.setCardScheme({
            id: null, // 设置没有方案id - 相当于新增
            postId: null, // 单个设置的职务id
            postName: null, // 单个设置的职务名称
            postInfoList: list, // 
            computeType: 1, // 提成计算方式 1 固定
            name: null, // 提成方案名称
            type: 'create',
          })
          this.toSetComssionPage()
        }
      }
    },
    // 多选变化回调
    handleSelectionChanged(selection) {
      this.selectedRows = selection
    },
    // v2 改成新增和编辑都去以前的编辑页面
    toSetComssionPage() {  
      this.$router.push(`/${this.currentEntry}-inner/edit-commission-plan-card`)
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  filters: {
    computeTypeFilter(type) {
      let map = {
        1: '固定式',
        2: '阶梯式',
        3: '阶段式',
      }
      return map[type]
    }
  }
}
</script>
<style lang='scss' scoped>
.commission-list-page {
  height: calc(100vh - 127px);
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .search-line {
    height: 75px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // padding-right: 10px;
  }
  .bottom-line {
    height: 75px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
