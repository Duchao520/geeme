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

      title: '出入库明细表'
    }
  },
  methods: {
    async getAllData() {
      let url = '/getProductStockSubOrderInOutList'
      let params = {
        ...this.params,
        brandId: this.currentInfo.brandId,
        storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : this.params.storeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        stockOrderNo: this.params.searchKey
      }
      let res = await axios.post(url, params)
      if (res.success) {
        this.tableData = this.tableData.concat(res.listStockSubOrderInfo || [])
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
      let time = this.params.startDay ? `
        <tr>
          <th colspan="8" style="text-align: left;">统计时段: ${this.params.startDay.slice(0, 10)} 至 ${this.params.endDay.slice(0, 10)}</th>
        </tr>
      ` : ''
      let tableStr = `
        <tr style="text-align: center;">
          <th colspan="8">${this.title}</th>
        </tr>
        ${time}
        <tr style="text-align: center;">
          <th>产品编号</th>
          <th>产品名称</th>
          <th>规格</th>
          <th>出入库类型</th>
          <th>出入库单号</th>
          <th>出入库时间</th>
          <th>出入库数量</th>
          <th>库存量</th>
        </tr>
      `
      for(let i of this.tableData) {
        tableStr += `
          <tr style="text-align: center;">
            <td>${i.stockProductNo}</td>
            <td>${i.stockProductName}</td>
            <td>${i.specificationName}</td>
            <td>${this.storageTypeFilter(i.storageType)}</td>
            <td>${i.stockOrderNo}</td>
            <td>${i.checkTime}</td>
            <td>${i.signNum}</td>
            <td>${i.validStock}</td>
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
      let fileNameAppend = this.params.startDay ? `${new Date(this.params.startDay).format('yyyyMMdd')}-${new Date(this.params.endDay).format('yyyyMMdd')}` : ''
      a.download = `${this.title} ${fileNameAppend}.xls`
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
    storageTypeFilter(type) {
      let map = {
        1: '采购入库',
        2: '订货入库',
        3: '调拨入库',
        4: '销售退货',
        5: '盘盈入库',
        6: '初始入库',
        7: '赠送入库',
        8: '其他入库',
        9: '订货退回', // 品牌入库
        11: '退采购出库',
        12: '订货出库',
        13: '调拨出库',
        14: '销售出库',
        15: '盘亏出库',
        16: '赠送出库',
        17: '其他出库',
        18: '订货退回', // 门店出库
        19: '门店领用',
      }
      return map[type]
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
