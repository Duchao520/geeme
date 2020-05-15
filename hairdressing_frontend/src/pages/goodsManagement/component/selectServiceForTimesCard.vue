<template>
  <el-dialog 
    id="suber-component-dialog" 
    :visible="timesCardDialog"  
    custom-class="suber-component-dialog" 
    :before-close="close" 
    :append-to-body="appendToBody"
    width="800px"
    title="选择服务"
  >
    <div class="time-card-select-service">
      <div class="dialog-body-filter-line">
        <div class="level-filter-box">
          <!-- 下拉组件 -->
          <el-select v-model="levelOne" placeholder="选择一级分类" clearable @change="levelOneChanged">
            <el-option
              v-for="item in levelOneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="levelTwo" placeholder="选择二级分类" clearable @change="levelTwoChanged">
            <el-option
              v-for="item in levelTwoOptions"
              :key="item.jimeiClassId"
              :label="item.sortName"
              :value="item.jimeiClassId">
            </el-option>
          </el-select>
        </div>
        <div class="search-box">
          <g-search :placeholder='"搜索服务名称"' v-on:search="handleSearch"></g-search>
        </div>
      </div>
      <el-table 
        stripe 
        height="420" 
        v-loading="tableLoading"
        :data="tableData" 
         ref="serviceTable"
        :header-cell-style="headerRowStyle" 
        @selection-change="handleSelectionChange" 
      >
        <el-table-column type="selection" width="42px"></el-table-column>
        <el-table-column label="服务项目名称" show-overflow-tooltip prop="serviceName"></el-table-column>
        <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
        <el-table-column label="门店价" show-overflow-tooltip prop="shopPrice" width="80px"></el-table-column>
      </el-table>
      <div class="bottom-line">
        <el-pagination
          style="margin: 5px 20px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          :total="totalCount"
        ></el-pagination>
      </div>  
    </div> 
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" plain class="plain_gray_btn">关 闭</el-button>
      <el-button class="normal_blue_btn" @click="sendData">保存当前页</el-button>
    </span>
  </el-dialog>
</template>
<script>
/* 开单 - 自由卡 次卡 也在用这个组件 */
/* 开单 - 自由卡 次卡 也在用这个组件 */
/* 开单 - 自由卡 次卡 也在用这个组件 */
import * as axios from '@/util/axios'
import { mapState } from "vuex"
export default {
  props: {
    timesCardDialog: {
      type: Boolean
    },
    // 选中项
    superCheckedService: {
      type: Set,
      required: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      serviceOptions: [], // 服务的一二级分类选项数据
      currentPage: 1, // es搜索说是下标从0开始...
      pageSize: 10,
      levelOne: null,
      levelTwo: null,
      title: '', // 搜索的关键词
      totalCount: 0,
      // 
      tableData: [], //
      multipleSelection: [], // 组件自带的勾选数组对象
      checkedIds: [], // 选中的id们, 用于匹配输入框直接输入的文本是不是打勾了
      headerRowStyle: { background: '#f4f5f7' }, // 表头样式
      tableLoading: false, 
      levelTwoOBJ: {}
    }
  },
  created() {
    let serviceData =  {goodsTypeScope: 'service', storeId: this.currentInfo.shopId}
    axios.post('/getSortInfoFromStoreGoods', serviceData).then(res=> {
      this.serviceOptions = res.storeSortInfoList
    })
    this.init()
  },
  methods: {
    init() {
      let data = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        sortOne: this.levelOne,
        sortTwo: this.levelTwo,
        keyword: this.title,
        storeId: this.currentInfo.shopId,
      }
      this.tableLoading = true
      axios.post('/getStoreServiceListForPerformance', data).then(res => {
        this.tableLoading = false
        this.totalCount = res.total
        this.tableData = res.serviceInfoList
        this.$nextTick(() => {
          this.tableData.map(i => {
            this.superCheckedService.has(i.specificationId) && this.$refs.serviceTable.toggleRowSelection(i, true)
          })
        })
      })
    },
    levelOneChanged() {
      this.currentPage = 1
      this.levelTwo = null
      this.init()
    },
    levelTwoChanged() {
      this.currentPage = 1
      this.init()
    },
    // 第一列勾选的变化
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows
    },
    // 搜索
    handleSearch(keywords) {
      this.currentPage = 1
      this.title = keywords
      this.init()
    },
    // 页码切换
    handleCurrentChange(page) {
      this.currentPage = page
      this.init()
    },
    close() {
      this.$emit('close')
    },
    sendData() {
      // 比对数据
      // let difference = this.tableData.filter(v => !this.multipleSelection.map(i => i.id).includes(v.id))
      let difference = this.tableData.filter(v => !this.multipleSelection.map(i => i.specificationId).includes(v.specificationId))
      let template = {
        no: difference, // 没选中的数据
        yes: this.multipleSelection // 选中的数据
      }
      this.$emit('suberData', template)
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    levelOneOptions() {
      let o = []
      this.serviceOptions.map(p => {
        o.push({id: p.jimeiClassId, name: p.sortName})
        this.levelTwoOBJ[p.jimeiClassId] = p.sortTwoList
      })
      return o
    },
    levelTwoOptions() {
      return this.levelTwoOBJ[this.levelOne]
    }
  },
  watch: {
    'multipleSelection'(rows, old) {
      this.checkedIds = []
      rows.map(i => {
        this.checkedIds.push(i.specificationId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$blue: #58c9f3;
$gray: #d5dadf;

#suber-component-dialog {
  /deep/ .el-dialog__body {
    border-top: 1px solid #F0F1F4;
    padding: 18px 20px;
  }
}

.time-card-select-service {
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
}

.dialog-body-filter-line {
  padding: 22px 20px 15px 10px;
  display: flex;
  justify-content: space-between;
  .search-box {
    width: 220px;
  }
}
.bottom-line {
  height: 45px;
}
#app .el-pagination{
  margin-top: 15px !important;
  padding: 0;
}
</style>