<template>
  <div class="web-site-info"  v-loading="loading">
    <div class="herder-line">
      <a-input-search placeholder="请输入手机号" style="width: 280px" enterButton @search="onSearch"/>
    </div>
    <div class="type-info-body">
      <G-NavBar :navList="navList" @change="handleSubChanged"></G-NavBar>
      <div class="info-table-box">
        <div class="info-table-body">
          <el-table
            stripe
            :data="tableData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="45"
            >
            </el-table-column>
            <el-table-column
              label="排序"
              width="82"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.sortId" @blur="changeStoreId(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="是否已读"
            >
              <template slot-scope="scope">
                <div class="check-readed" v-if="!scope.row.isRead">
                  未读
                </div>
                <div v-else>已读</div>
              </template>
            </el-table-column>
            <el-table-column
              label="品牌名称"
              prop="brandName"
            >
            </el-table-column>
            <el-table-column
              prop="username"
              label="联系人"
            >
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
            >
              <template slot-scope="scope">
                <div :class="{'check-readed': !scope.row.isRead}">
                  {{scope.row.mobile}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="city"
              label="省市"
            >
              <template slot-scope="scope">
                {{`${scope.row.province}/${scope.row.city}`}}
              </template>
            </el-table-column>
            <el-table-column
              prop="tradeId"
              label="行业"
            >
              <template slot-scope="scope">
                {{options[scope.row.tradeId]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="补充说明"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{scope.row.remark}}
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              label="申请时间"
            >
              <template slot-scope="scope">
                <div :class="{'check-readed': !scope.row.isRead}">
                  {{scope.row.createTime}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="modifyTime"
              label="上次操作时间"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="info-table-page">
          <div>
            <el-button size="small" class="normal_blue_btn" @click="setReaded">设为已读</el-button>
          </div>
          <el-pagination
            style="margin-right: 12px;"
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="pageQuery.pageNum"
            :page-size="pageQuery.pageSize"
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fetch from '@/utils/fetch';
export default {
  data() {
    return {
      navList: [
        // 1-商家试用,2-供应商试用,3-标杆申请,4-合伙人申请
        {id: 1, title: '商家试用'},
        {id: 2, title: '供应商试用'},
        {id: 3, title: '标杆申请'},
        {id: 4, title: '合伙人申请'},
      ],
      mobile: null, // 搜索的手机号
      id: 1, // 默认激活
      tableData: [],
      pageQuery: { // 用于激活表格查询 2-3
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      options: {}, //
      selectedIds: [],
    }
  },
  created() {
    this.init(this.id)
    this.getOptionsList()
  },
  methods: {
    onSearch(key) {
      this.mobile = key || null
    },
    handleSubChanged(type) {
      this.id = type.id
      this.init(type.id)
    },
    handleCurrentChange(page) {
      this.pageQuery.pageNum = page
      this.init(this.id)
    },
    handleSelectionChange(ids) {
      this.selectedIds = ids.map(i => i.id)
    },
    async setReaded() {
      let data = {
        ids: this.selectedIds
      }
      let res = await fetch({
        method: 'post',
        url: `/api/main-data/isReadByIds`,
        data
      })
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
      this.init(this.id)
    },
    async getOptionsList() {
      let res = await fetch({
        method: 'get',
        url: `/auth/maindata/getIndustryList`
      })
      let obj = {}
      res.industryList.map(i => {
        obj[i.id] = i.name
      })
      this.options = obj

    },
    async init(id) {
      let data = {
        type: id,
        mobile: this.mobile,
        ...this.pageQuery
      }
      this.loading = true
      let res = await fetch({
        method: 'post',
        url: `/api/main-data/getWebsiteFormByInfo`,
        data
      })
      this.loading = false
      this.tableData = res.websiteFormList || []
      this.total = res.total
    },
    async changeStoreId(row) {
      let data = {
        id: row.id,
        sortId: row.sortId
      }
      let res = await fetch({
        method: 'post',
        url: '/api/main-data//updateSortId',
        data
      })
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
      this.init(this.id)
    },
  },
  filters: {},
  computed: {},
}
</script>
<style lang='less' scoped>
.herder-line {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.check-readed {
  color: red;
}
.info-table-page {
  display: flex;
  height: 75px;
  justify-content: space-between;
  align-items: center;
}
.info-table-box {
  height: calc(100vh - 40px - 55px - 50px - 32px);
  background-color: rgba(245, 45, 86, 1);
  background: #fff;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
}
</style>
