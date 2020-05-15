<template>
  <full-single-page>
    <div class="page-body" v-loading="pageLoading">
      <h2>门店续费</h2>
      <br>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="品牌名称:">
          {{shopSoft.brandName}}
        </el-form-item>
        <el-form-item label="续费版本:">
          {{shopSoft.version|versionFilter}}
        </el-form-item>
        <el-form-item label="续费门店:">
          <!-- 页面表格 -->
          <el-table 
            :data="tableData" 
            header-row-class-name="header-row"
            v-loading="tableLoading" 
          >
            <el-table-column label="所在城市" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.province}}/{{scope.row.city}}  
              </template>
            </el-table-column>
            <el-table-column label="门店名称" show-overflow-tooltip prop="name"></el-table-column>
            <el-table-column label="到期时间" prop="dueTime"></el-table-column>
            <el-table-column label="选择续期券">
              <template slot-scope="scope">
                <span>门店续期券（1年）</span>
              </template>
            </el-table-column>
            <el-table-column label="续费后到期时间" prop="newDueTime"></el-table-column>
            <el-table-column label="续费金额" prop="price" width="100"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="续费门店数:">
          1
        </el-form-item>
        <el-form-item label="可用续期券:">
          {{form.num}}
        </el-form-item>
      </el-form>
      <div class="buy-soft-btn-line">
        <el-button class="normal_blue_btn" @click="renewSofts" size="medium">确定提交</el-button>
        <el-button plain class="plain_gray_btn" @click="goBack" size="medium">取消</el-button>
      </div>
    </div>
  </full-single-page>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState, mapActions} from 'vuex'
export default {
  name: '',
  data() {
    return {
      form: {
        num: 0, // 票数
        price: 0,
      },
      tableData: [],
      pageLoading: false, 
      tableLoading: false, 
    }
  },
  created() {
    this.getTicketsNum()
  },
  methods: {
    async renewSofts() {
      if (!this.form.num || this.form.num < this.tableData.length) {
        this.$message({
          type: 'error',
          message: '没有足够的续期券, 请先在品牌总部购买续期券后再操作'
        })
        return false
      }
      this.pageLoading = true
      let res = await axios.post('/multiStoreRenewal', {brandId: this.shopSoft.brandId, storeIds: [this.shopSoft.shopId]})
      this.$message({
        type: res.success ? 'success' : 'error',
        message: res.message
      })
      if (res.success) {
        this.goBack()
      } else {
        this.pageLoading = false
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    async getTicketsNum() {
      this.pageLoading = true
      let res = await axios.post('softRecord', {brandId: this.shopSoft.brandId, type: 'RENEWAL'})
      this.$set(this.form, 'num', res.softInfo4SoftRecordResponseList[0].num)
      this.$set(this.form, 'price', res.softInfo4SoftRecordResponseList[0].price)
      this.getShopsList()
      this.pageLoading = false
    },
    async getShopsList() {
      this.tableLoading = true
      let res = await axios.get(`/getShopInfoById/${this.shopSoft.shopId}`)

      let now = +(new Date())
      let time = new Date(res.dueTime) > now ? res.dueTime : new Date(now).format('yyyy-MM-dd hh:mm:ss') // 处理已过期门店的续期
      let year = new Date(time).getFullYear() + 1
      let newDueTime = year + (time).slice(4)

      this.tableData = [
        {
          province: res.province,
          city: res.city,
          name: res.name,
          dueTime: res.dueTime,
          price: this.form.price,
          newDueTime: newDueTime
        }
      ]
      this.tableLoading = false
    },
  },
  computed: {
    ...mapState({
      brandSoft: state => state.soft.brandSoft,
      shopSoft: state => state.soft.shopSoft,
    })
  },
  filters: {
    versionFilter(v) {
      let map = {
        1: '标准版',
        2: '专业版',
        3: '旗舰版',
      }
      return map[v]
    }
  },
}
</script>
<style lang='scss' scoped>
  .page-body {
    margin: 32px 78px 20px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .header-row {
    th {
      background: #F4F5F7;
    }
  }
  }
</style>
 