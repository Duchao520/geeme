<template>
  <div class="merchant-list-wrapper">
    <div class="search-wrapper">
      <div class="line">
        <a-input-search placeholder="搜索门店名称/编号" style="width: 280px" enterButton @search="onSearch"/>
      </div>
    </div>
    <div class="content">
      <a-table
        :dataSource="recordList"
        :loading="loading"
        :pagination=false
        :scroll="{ y: 'calc(100vh - 465px)'}"
        rowKey="id">
        <a-table-column :width=40 align="left">
          <template slot-scope="record">
            <a-checkbox @change="onCheck(record)" :checked="record.checked" style="margin: 0 0 0 15px"></a-checkbox>
          </template>
        </a-table-column>
        <a-table-column dataIndex="createTime" align="left" :width=150 title="派发时间">
          <template slot-scope='createTime'>
            {{createTime ?createTime : '--'}}
          </template>
        </a-table-column>
        <a-table-column dataIndex="sendType" align="left" :width=150 title="派券类型">
          <template slot-scope='sendType'>
            {{sendType == 1 ? '新开' : sendType == 2 ? '续费' : '--'}}
          </template>
        </a-table-column>
        <a-table-column dataIndex="serialCode" align="left" :width=150 title="品牌编码">
          <template slot-scope='serialCode'>
            {{serialCode ? serialCode : '--'}}
          </template>
        </a-table-column>
        <a-table-column dataIndex="brandName" align="left" :width=150 title="品牌名称">
          <template slot-scope='brandName'>
            {{brandName ? brandName : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="city" :width=80 title="城市">
          <template slot-scope='city'>
            {{city ? city : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="tradeName" :width=80 title="行业">
          <template slot-scope='tradeName'>
            {{tradeName ? tradeName : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="version" :width=80 title="版本">
          <template slot-scope='version'>
            {{version==1 ? '标准版' : version==1 ? '标准版' : version==2 ? '专业版' : version==3 ? '旗舰版' : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="price" :width=80 title="价格">
          <template slot-scope='price'>
            {{price ? price : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="count" :width=150 title="派发数量 ">
          <template slot-scope='count'>
            {{count ? count : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="remark" :width=100 title="备注">
          <template slot-scope='remark'>
            {{remark ? remark : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="username" title="操作人">
          <template slot-scope='username'>
            {{username ? username : '--'}}
          </template>
        </a-table-column>
      </a-table>

      <div class="operation">
        <div>
          <a-checkbox :checked="allChecked" @change="checkAll" :indeterminate="indeterminate" style="margin: 0 0 0 15px">全选</a-checkbox>
          <G-OptButton type="export" />
        </div>
        <a-pagination
          showSizeChanger
          :pageSize.sync="shopQuery.pageSize"
          v-model="shopQuery.pageNum"
          @change="onPageChange"
          @showSizeChange="onPageSizeChange"
          :total="total"
          :showTotal="total => `共 ${total} 条`"
          :pageSizeOptions="['20','40','60','80']"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSoftTicketSendRecord} from "@/api/merchant";

  export default {
    props: {},
    data() {
      return {
        loading: false,
        shopQuery: {
          pageNum: 1,
          pageSize: 20,
          serialCode: null
        },
        total: 0,
        recordList: [],
        checkedList: []
      }
    },
    mounted(){
      this.getSoftTicketSendRecord(1);
    },
    computed: {
      indeterminate() {
        return this.checkedList.length > 0 && this.checkedList.length < this.recordList.length
      },
      allChecked() {
        return this.checkedList.length > 0 && this.checkedList.length === this.recordList.length
      }
    },
    methods: {
      onSearch(data) {
        this.shopQuery.serialCode = data;
        this.getSoftTicketSendRecord(1);
      },
      async getSoftTicketSendRecord(num) {
        this.loading = true;
        try {
          this.shopQuery.pageNum = num ? num : this.shopQuery.pageNum;
          let param = this.shopQuery;
          let res = await getSoftTicketSendRecord(param);
          if (res) {
            this.recordList = res.recordList;
            this.total = res.total
          }
        } finally {
          this.loading = false;
        }

      },
      onCheck(record) {
        record.checked = !record.checked
        event.target.checked &&  this.checkedList.push(record.id)
        !event.target.checked && (this.checkedList = this.checkedList.filter(i => i !== record.id))
        console.log(this.checkedList)
      },
      checkAll() {
        const list = JSON.parse(JSON.stringify(this.recordList))
        event.target.checked && this.recordList.map(i => i.checked = true) && (this.checkedList = list.map(i => i=i.id))
        !event.target.checked && this.recordList.map(i => i.checked = false) && (this.checkedList = [])
        console.log(this.checkedList)
      },
      onPageChange(page, pageSize) {
        this.shopQuery.pageSize = pageSize
        this.getSoftTicketSendRecord(page)
      },
      onPageSizeChange(current, size) {
        this.shopQuery.pageSize = size
        this.getSoftTicketSendRecord()
      },
    }
  }
</script>

<style lang="less" scoped>
  .search-wrapper:extend(.normal-content-one) {
    margin: 0 0 15px 0;
    padding: 15px 20px 20px 20px;

    .line {
      display: flex;
      justify-content: flex-end;
    }
  }

  .merchant-list-wrapper {
    height: @mainContentH;

    .content:extend(.normal-content-one) {
      .common-scrollbar();
      overflow: hidden;
      padding: 0 20px 20px 20px;
      border-radius: 0 0 4px 4px;
      height: calc(100% - 220px);
      /* 非通用表格 */
      .ant-complex-table-content();

      .operation {
        display: flex;
        justify-content: space-between;
        margin: 10px 0 0 0;
      }
    }
  }
</style>
