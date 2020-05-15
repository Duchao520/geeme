<template>
  <div>
    <el-button
      plain 
      size="mini" 
      class="plain_blue_btn" 
      v-loading.fullscreen="pageLoading"
      @click="handleExport"
    >
      导出Excel
    </el-button>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    params: {
      type: Object
    }
  },
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 1000,
      pageLoading: false, 
      tableData: [],

      title: '订单商品统计表'
    }
  },
  methods: {
    async getAllData() {
      let url = this.currentEntry === 'shop' ? '/getStoreSubProductInvoiceList' : '/getSubProductInvoiceList'
      let params = {
        ...this.params,
        brandId: this.currentInfo.brandId,
        toStoreId: this.currentEntry === 'shop' ? this.currentInfo.shopId : this.params.storeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        beginTime: this.params.startDay,
        endTime: this.params.endDay,
      }
      let res = await axios.post(url, params)
      if (res.success) {
        this.tableData = this.tableData.concat(res.listProductInvoiceSubListInfo || [])
        this.total = res.total
        if (res.total > this.pageNum * this.pageSize) {
          this.pageNum++
          this.getAllData()
        } else {
          // 执行excel数据格式化准备
          this.templateForExcel()
        }
      }
    },
    templateForExcel() {
      let colspan = this.currentEntry === 'brand' ? 9 : 8
      let searchStr = this.params.searchKey ? `
        <tr>
          <th colspan="${colspan}" style="text-align: left;">搜索产品名称: ${this.params.searchKey}</th>
        </tr>
      ` : ''
      let tableStr = `
        <tr style="text-align: center;">
          <th colspan="${colspan}">${this.title}</th>
        </tr>
        <tr>
          <th colspan="${colspan}" style="text-align: left;">统计时段: ${this.params.startDay.slice(0, 10)} 至 ${this.params.endDay.slice(0, 10)}</th>
        </tr>
        ${searchStr}
        <tr style="text-align: center;">
          ${this.currentEntry === 'brand' ? '<th>门店名称</th>' : ''}
          <th>订货单号</th>
          <th>订货时间</th>
          <th>产品编号</th>
          <th>产品名称</th>
          <th>规格</th>
          <th>审批数量</th>
          <th>审批价</th>
          <th>审批金额</th>
        </tr>
      `
      for(let i of this.tableData) {
        let toStoreName = this.currentEntry === 'brand' ? `<td>${i.toStoreName}</td>` : '' 
        tableStr += `
          <tr style="text-align: center;">
            ${toStoreName}
            <td>${i.productInvoiceNo}</td>
            <td>${i.askTime}</td>
            <td>${i.stockProductNo}</td>
            <td>${i.stockProductName}</td>
            <td>${i.specificationName}</td>
            <td>${i.approvalNum}</td>
            <td>${i.approvalPrice}</td>
            <td>${(Number(i.approvalNum) * Number(i.approvalPrice)).toFixed(2)}</td>
          </tr>
        `
      }
      let worksheet = 'Sheet1'
      let uri = 'data: application/vnd.ms-excel; base64,'
      let exportTemplate = `
        <html 
          xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40"
        >
          <head>
            <!--[if gte mso 9]>
              <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>${worksheet}</x:Name>
                      <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                      </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
              </xml>
            <![endif]-->
          </head>
          <body>
            <table syle="table-layout: fixed; word-wrap: break-word; word-break: break-all;">${tableStr}</table>
          </body>
        </html>
      `
      // 以下数据必须重置
      this.total = 0 // 重置掉
      this.pageNum = 1 // 重置掉
      this.tableData = [] // 重置掉
      this.pageLoading = false // 重置掉

      // window.location.href = uri + this.base64(exportTemplate)
      let a = document.createElement("a")
      // 以下名称不要换行  #- -
      a.download = `${this.title}-${new Date(this.params.startDay).format('yyyyMMdd')}-${new Date(this.params.endDay).format('yyyyMMdd')}${this.params.searchKey ? '-' + this.params.searchKey : ''}.xls`
      a.href = uri + this.base64(exportTemplate)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    base64(str) {
      return window.btoa(unescape(encodeURIComponent(str)))
    },
    handleExport() {
      this.pageLoading = true
      this.getAllData()
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    })
  },
}
</script>
<style lang='scss' scoped>
.plain_blue_btn {
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
