<template>
  <div class='problem-list-wrapper' v-loading="loading">
    <problemSearch @search="onSearch"/>
    <div class="content">
      <div class='module-mange'>
        <h3>模块管理</h3>
        <a-button 
          @click="showQusetionModule('add')"
          style="background: #58C9F3;
          border:none;
          color: #ffffff;
          margin: 15px;"> 
          添加模块
        </a-button>
        <div class='modulle-list scrollbar'>
          <div v-for="(item, lv1_idx) in modelList" :key="item.firstLevelTopic.id">
            <h4 @click="toggleStatus(item)">
              {{item.firstLevelTopic.topicName}}
              <span class='iconfont down' :class='{"up": item.foldStatus}'>&#xe6bc;</span>
              <span class="level-one-icon">
                <i class='iconfont edit' @click.stop="editChildModel(item.firstLevelTopic)">&#xe677;</i>
                <i class='iconfont del'  @click.stop="delChildModel(item.firstLevelTopic)">&#xe676;</i>
              </span>
            </h4>
            <ul v-show="item.foldStatus">
              <li 
                v-for="(child, lv2_idx) in item.listSecondLevelTopic" 
                :key="child.id"
                @click="setActiveModel(child)"
                :class="{active: currentModelId === child.id}"
              >
                <i class='iconfont sort' v-show="lv2_idx" @click.stop="sortChildrens(child, lv1_idx, lv2_idx)">&#xe6c0;</i>
                {{child.topicName}} 
                <span>
                  <i class='iconfont edit' @click.stop="editChildModel(child)">&#xe677;</i>
                  <i class='iconfont del'  @click.stop="delChildModel(child)">&#xe676;</i>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="tableData" height="calc(100% - 78px)" @selection-change="handleSelectionChange">
          <el-table-column 
            type="selection"
            width="45"
          ></el-table-column>
          <el-table-column label="排序" prop="sortId" width="80">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.sortId" :maxlength="3" @blur="sortQuestion(scope.row)"></el-input>
            </template> 
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="发布时间" prop="publishTime"></el-table-column>
          <el-table-column label="发布人" prop="username"></el-table-column>
          <el-table-column label="修改时间" prop="modifyTime"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <div class="tags-line">
                <span class="tags" :class="scope.row.status === 1 ? 'green' : 'yellow'">{{scope.row.status|statusFilter}}</span>
                <br>
                <span v-if="scope.row.isHot" class="tags red">热门</span>
              </div>
            </template>  
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <G-OptButton type="edit" @click="toDetail(scope.row)"/>
              <G-OptButton type="delete" @click="toDelete(scope.row.id)"/>
            </template> 
          </el-table-column>
        </el-table>
        <div class="pages-line">
          <!-- <i></i> -->
          <div class="left-btns">
            <el-button size="mini" style="margin-left: 12px;" class="normal_blue_btn" @click="setAndCancelHot(true)">设为热门</el-button>
            <el-button size="mini" class="normal_gray_btn" @click="setAndCancelHot(false)">取消热门</el-button>
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
    <!-- 添加模块 -->
    <el-dialog 
      :visible="visibleQuestionModel" 
      :title="currentDialogTitle" 
      @close="resetQuestionForm"
      width="500px"
    >
      <el-form
        ref="questionForm" 
        :model="questionForm" 
        label-width="80px"
      >
        <el-form-item label="模块名称: " prop="topicName">
          <div style="width: 200px;">
            <el-input v-model="questionForm.topicName" placeholder="请输入模块名称" maxlength="12"/>
          </div>
        </el-form-item>
        <el-form-item 
          label="模块级别: " 
          prop="topicLevel" 
          v-if="(currentDialogType === 'edit' && questionForm.topicLevel !== 1) || currentDialogType === 'add'"
        >
          <el-radio :disabled="currentDialogType === 'edit'" v-model="questionForm.topicLevel" :label="1">一级</el-radio>
          <el-radio :disabled="currentDialogType === 'edit'" v-model="questionForm.topicLevel" :label="2">二级</el-radio>
        </el-form-item>
        <el-form-item 
          label="所属一级: " 
          prop="parentId" 
          v-show="questionForm.topicLevel !== 1" 
          v-if="(currentDialogType === 'edit' && questionForm.topicLevel !== 1) || currentDialogType === 'add'"
        >
          <el-select v-model="questionForm.parentId" placeholder="请选择">
            <el-option
              v-for="item in questionLevelOneOptions"
              :key="item.id"
              :label="item.topicName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button plain class="plain_gray_btn" @click="resetQuestionForm">取消</el-button>
        <el-button class="normal_blue_btn" @click="sendData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import problemSearch from '../components/problemSearch';
import fetch from '@/utils/fetch';
import { async } from 'q';
export default {
  data() {
    return {
      modelList: [], // 模块管理列表-左侧
      questionLevelOneOptions: [], // 一级分类选项 // 编辑模块用
      questionLevelTwoOptions: [], // 二级分类选项 // 排序模块用
      visibleQuestionModel: false, // 添加模块模态框
      questionForm: {
        id: null,
        topicLevel: 1,
        parentId: null, // 提交时topicLevel为1, 重置成0
        topicName: ''
      },
      questionFormDialegName: {
        add: '添加模块',
        edit: '编辑模块'
      },
      currentDialogType: 'edit', // 新增&编辑
      currentDialogTitle: '', // 当前对话框标题
      loading: false, // 
      currentModelId: null, // lv2_id； 用于激活表格查询 2-1 
      // 右侧表格
      multipleSelection: [], // 勾选状态
      tableData: [],
      tableLoading: false,
      searchData: { // 用于激活表格查询 2-2
        searchKey: null,
        publishTime: null,
        modifyTime: null,
        status: null,
      },
      pageQuery: { // 用于激活表格查询 2-3
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    }
  },
  created() {
    this.initLeftList()
    this.initRightTable()
  },
  methods: {
    // - 模块管理列表
    initLeftList() {
      this.loading = true
      fetch({
        method: 'get',
        url: '/api/main-data/feign/queryAllQuestionTopic'
      }).then(res => {
        this.questionLevelOneOptions = []
        this.questionLevelTwoOptions = []
        this.modelList = res.listQueryAllQuestionTopicInfo
        this.modelList.map(item => {
          this.$set(item, 'foldStatus', true)
          this.questionLevelOneOptions.push(item.firstLevelTopic)
          this.questionLevelTwoOptions.push(item.listSecondLevelTopic)
        })
        this.loading = false
      })
    },
    // - 模块表格
    async initRightTable() {
      this.loading = true
      this.tableLoading = true
      let data = {
        topicId: this.currentModelId,
        ...this.searchData,
        ...this.pageQuery,
      }
      let res = await fetch({
        method: 'post',
        url: '/api/main-data/feign/getQuestionList',
        data 
      })
      this.tableData = res.baseQuestionList
      this.total = res.total || 0
      this.tableLoading = false
      this.loading = false
    },
    // - 激活一个状态标记
    setActiveModel(lv2) {
      this.currentModelId = lv2.id
      this.initRightTable()
    },
    // - 文章详情
    toDetail(row) {
      this.$router.push(`/app/official/problem/edit-problem/${row.id}/${row.topicId}`)
    },
    // - 删除文章-1
    toDelete(id) {
      this.$confirm({
        title: '确定要删除吗？',
        content: '删除后不可恢复。',
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: this.agreeToDelQuestion.bind(this, id)
      })
    },
    // 勾选
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows
    },
    // 设置/取消热门
    async setAndCancelHot(bool) {
      if (this.multipleSelection.length) {
        let ids = []
        this.multipleSelection.map(i => {
          ids.push(i.id)
        })
        let data = {
          ids: ids,
          isHot: bool
        }
        let res = await fetch({
          method: 'post',
          url: `/api/main-data/isHotByIds`,
          data
        })
        res.success ? this.$message.success(res.message) : this.$message.error(res.message)
        this.initRightTable()
      } else {
        this.$message.error('至少需要一个选中的问题')
      }
    },
    // - 表格排序
    async sortQuestion(row) {
      if (/^\d{1,3}$/.test(row.sortId)) {
        let data = {
          id: row.id,
          sortId: row.sortId,
        }
        let res = await fetch({
          method: 'post',
          url: `/api/main-data/updateQuestionOrder`,
          data
        })
        res.success ? this.$message.success(res.message) : this.$message.error(res.message)
        this.initRightTable()
      } else {
        this.$message.error('请输入一个0~999的整数')
      }
    },
    // - 删除文章-2
    async agreeToDelQuestion(id) {
      let res = await fetch({
        method: 'get',
        url: `/api/main-data/deleteQuestionById/${id}`
      })
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
      this.initRightTable()
    },
    // - 新增修改模块
    async sendData() {
      let data = JSON.parse(JSON.stringify(this.questionForm))
      let url = ''
      if (this.currentDialogType === 'add') {
        delete data.id
        url = '/api/main-data/createQuestionTopic'
      } else {
        url = '/api/main-data/updateQuestionTopic'
      }
      if (data.topicLevel === 1) {
        data.parentId = 0
      }
      let res =  await fetch({
        method: 'post',
        url: url,
        data
      })    
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
      this.visibleQuestionModel = false
      this.initLeftList()
    },
    // - 重置模块数据
    resetQuestionForm() {
      this.visibleQuestionModel = false
      this.questionForm = {
        id: null,
        topicLevel: 1,
        parentId: null,
        topicName: ''
      }
    },
    // - 切换模块折叠
    toggleStatus(item) {
      item.foldStatus = !item.foldStatus
    },
    // - 搜索
    onSearch(obj, clear) {
      this.searchData = obj;
      this.currentModelId = clear ? null : this.currentModelId
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.pageQuery.pageNum = page
      this.initRightTable()
    },
    // - 根据不同操作显示模块模态框
    showQusetionModule(type) {
      this.currentDialogType = type
      this.visibleQuestionModel = true
      this.currentDialogTitle = this.questionFormDialegName[type]
    },
    // - 编辑二级模块
    editChildModel(obj) {
      this.questionForm = {...obj}
      this.showQusetionModule('edit')
    },
    // - 删除二级模块-1
    delChildModel(obj) {
      this.$confirm({
        title: '确定要删除吗？',
        content: '删除后不可恢复。',
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: this.agreeToDelModel.bind(this, obj)
      })
    },
    // - 删除二级模块-2
    async agreeToDelModel(obj) {
      let res = await fetch({
        method: 'get',
        url: `/api/main-data/deleteQuestionTopicById/${obj.id}`
      })
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
      this.initLeftList()
    },
    // - 左侧二级模块排序
    sortChildrens(child, lv1, lv2) {
      let lv2Arr = this.questionLevelTwoOptions[lv1]
      let id = child.id
      let preId = 0
      for (let i = 0; i < lv2Arr.length; i++) {
        if (lv2Arr[i].id === id) {
          preId = lv2Arr[i - 1].id
          break
        }
      }
      let data = {
        id: id,
        preId: preId
      }
      fetch({
        method: 'post',
        url: `/api/main-data/switchQuestionTopicOrder`,
        data
      }).then(res => {
        res.success ? this.$message.success(res.message) : this.$message.error(res.message)
        this.initLeftList()
      })
    },
    // - 关闭模块模态框
    onCancelAddModule() {
      this.visibleQuestionModel = false
    },
  },
  filters: {
    statusFilter(status) {
      let map = {
        1: '已发布',
        2: '草稿箱',
      }
      return map[status]
    }
  },
  components: {
    problemSearch
  }
}
</script>
<style lang="less" scoped>
.problem-list-wrapper {
  height: @mainContentH;
  .content {
    .common-scrollbar();
    overflow: hidden;
    height: calc(100% - 144px);
    // padding: 0 20px 20px 20px;
    margin-top: 20px;
    display: flex;
  }
  .module-mange{
    width: 331px;
    height: 100%;
    background: #fff;
    border-radius: 4px;
    border: 1px solid rgba(222, 225, 230, 1);
    margin-right: 10px;
    h3{
      width: 100%;
      height: 40px;
      border-radius: 4px 4px 0 0;
      background-color: rgba(222, 225, 230, 1);
      line-height: 40px;
      font-size: 16px;
      padding-left: 15px;
      color: #333;
      font-weight: bold;
    }
    .modulle-list{
      user-select: none;
      padding: 15px;
      padding-top: 0px;
      overflow: auto;
      height: calc(100% - 102px);
      div{
        margin-bottom: 10px;
      }
      h4{
        font-size: 14px;
        color: #333;
        font-weight: bold;
        height: 40px;
        border-bottom: 1px dashed #979797;
        cursor: pointer;     
        line-height: 40px;
        span{
          font-size: 10px;
          float: right;
          margin-right: 10px;
          &.down{
            transform: rotate(-90deg)
          }
          &.down.up{
            transform: rotate(90deg)
          }
        }
        .level-one-icon {
          display: none;
          .edit{
            color: #58C9F3;
            font-size: 12px;
          }
          .del{
            color: #BEC3C6;
            font-size: 12px;
            margin: 0 8px;
          }
        }
        &:hover .level-one-icon {
          display: inline-block;
          height: 38px;
        }
      }
      ul li{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        color: #666;
        position: relative;
        display: flex;
        justify-content: space-between;
        cursor: pointer;     
        &:hover, &.active {
          background: #EAECEF;
          color: #333;
          span{
            display: block;
          }
        }
        i{
          font-size: 14px;
          margin-right: 10px;
        }
        .sort{
          position: absolute;
          left: 10px;
          font-size: 12px;
          color: #00CF82;
        }
        span{
          // float: right;
          display: none;
        }
        .edit{
          color: #58C9F3
        }
        .del{
          color: #BEC3C6;
        }
      }
    }
  }
  .table-data{
    flex: 1;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    flex-direction: column;
  }
  .pages-line {
    height: 78px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
