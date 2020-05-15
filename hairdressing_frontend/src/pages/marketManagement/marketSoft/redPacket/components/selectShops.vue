<template>
  <el-dialog 
    class="gm-select-shops-dialog"
    :visible="shopsVisible" 
    :title="title" 
    @close="$emit('close')"
    width="800px"
  >
    <div class="dialog-body" v-loading="loading">
      <div class="header">
        <div class="area">
          <g-address @select="addressChange" class="address" :clearable="true"></g-address>
        </div>
        <div class="search">
          <input-search v-model="params.name" placeholder="搜索门店名称" @search="search"></input-search>
        </div>
      </div>
      <el-table ref="shopsTable" :data="list" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="门店名称"></el-table-column>
        <el-table-column show-overflow-tooltip label="所在城市">
          <template slot-scope="scope">
            {{`${scope.row.province}/${scope.row.city}`}}
          </template>
        </el-table-column>
        <el-table-column label="门店性质" width="80">
          <template slot-scope="scope">
            {{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="会员数"></el-table-column> -->
        <el-table-column show-overflow-tooltip prop="createTime" label="门店创建时间"></el-table-column>
      </el-table>
      <div class="bottom-page-line">
        <el-pagination
          style="margin: 5px 0px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="params.pageParam.currentPage"
          :page-size="params.pageParam.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <div slot="footer">
      <el-button plain class="plain_gray_btn" @click="$emit('close')">关闭</el-button>
      <el-button class="normal_blue_btn" @click="sendData">保存当前页</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as axios from '@/util/axios'
import { mapActions, mapState } from "vuex"
export default {
  name: 'select-shops',
  data() {
    return {
      loading: false,
      list: [], // 当前页面的所有数据
      total: 0,
      params: {
        brandId: 0,
        province: null,
        city: null,
        name: null,
        pageParam: {
          currentPage: 1,
          pageSize: 10
        }
      },
      selectedDataInCurrentPage: [], // 当前页面勾选事件后取得的选中数据
    }
  },
  created() {
    this.params.brandId = this.currentInfo.brandId
    this.getShopsList()
  },
  methods: {
    sendData() {
      let difference = this.list.filter(v => !this.selectedDataInCurrentPage.map(i => i.id).includes(v.id))
      console.log(this.selectedDataInCurrentPage)
      // 接口type要的是integer数据， 暂时没有指定区域类型
      this.selectedDataInCurrentPage.map(i => {
        i.type = 0
      })
      let template = {
        no: difference, // 没选中的数据
        yes: this.selectedDataInCurrentPage // 选中的数据
      }
      this.$emit('suberData', template)
    },
    getShopsList() {
      this.loading = true
      axios.post('/getBasicStoreListByFilter', this.params).then(res => {
        this.loading = false
        this.list = res.listStoreInfo
        this.total = res.total
        // 通过父组件数据渲染表格勾选
        this.$nextTick(() => {
          this.list.map(i => {
            this.superCheckedShops.has(i.id) && this.$refs.shopsTable.toggleRowSelection(i, true)
          })
        })
      })
    },
    // 勾选切换事件
    handleSelectionChange(data) {
      this.selectedDataInCurrentPage = data
    },
    addressChange(addr) {
      console.log(addr)
      this.params.pageParam.currentPage = 1
      this.params.province = addr.province || null
      this.params.city = (addr.city === '所有城市' || addr.city === null || addr.city === '') ? null : addr.city
      this.getShopsList()
    },
    search() {
      this.params.pageParam.currentPage = 1
      this.getShopsList()
    },
    handleCurrentChange(page) {
      this.params.pageParam.currentPage = page
      this.getShopsList()
    }
  },
  props: {
    shopsVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '选择适用门店'
    },
    // 选中项
    superCheckedShops: {
      type: Set,
      required: true
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
  }
}
</script>

<style scoped lang="scss">
.dialog-body {
  .header {
    height: 35px;
    display: flex;
    justify-content: space-between;
  }
}
</style>

<style lang="scss">
.gm-select-shops-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #f0f1f4;
  }
  .el-dialog__body {
    padding: 12px 20px 10px 30px!important;
  }
}
</style>

