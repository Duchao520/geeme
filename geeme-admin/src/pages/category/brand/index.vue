<template>
  <div class="branc-can-wrapper">
    <div class="operation">  
      <a-button 
        style="background:#F52D56;
        border:none;
        color: #ffffff;"
        @click="add">
        新增品牌
      </a-button>
      <a-input-search placeholder="请输入分类名称" style="width: 280px" enterButton @search="onSearch"/>
    </div>

    <G-NavBar :navList="navList" @change="onNavChange"/>

    <div class="content">
      <a-table
        rowKey="id"
        :dataSource="brandList"
        :loading="loading"
        :pagination=false
        :scroll="{ y: 'calc(100vh - 335px)'}"
      >
        <!-- 排序 -->
        <a-table-column title="排序" dataIndex="sort" :width=100>
          <template slot-scope="sort, record">
            <G-NumInput :value="sort" :id="record.id" @blur="onReSort"/>
          </template>
        </a-table-column>
        
        <!-- 品牌编号 -->
        <a-table-column title="品牌编号" dataIndex="brandCode" :width=150></a-table-column>

        <!-- 品牌logo/名称 -->
        <a-table-column title="品牌logo/名称" dataIndex="brandName" :width=250>
          <template slot-scope="brandName, record">
            <img class="brand-logo" :src="utils.imgFormatter(record.logoSquare)"/>
            <span>{{brandName}}</span>
          </template>
        </a-table-column>

        <!-- 覆盖产品分类 -->
        <a-table-column title="覆盖产品分类" dataIndex="productClassList" :width=250>
          <template slot-scope="productClassList">
            <p class="product-class" :title="classFormatter(productClassList)">{{classFormatter(productClassList)}}</p>
          </template>
        </a-table-column>

        <!-- 新增人 及其所在品牌 -->
        <a-table-column title="新增人" dataIndex="createUserName" :width=100>
          <template slot-scope="createUserName, record">
            <p>{{createUserName}}</p>
            <p>{{record.createUserBrandName}}</p>
          </template>
        </a-table-column>

        <!-- 新增时间 -->
        <a-table-column title="新增时间" dataIndex="createTime" :width=200></a-table-column>

        <!-- 状态 -->
        <a-table-column title="状态" dataIndex="online" :width=100> 
          <template slot-scope="online">
            <a-switch :checked="online" @change='toggleLine'/>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column title="操作" dataIndex="id" :width=250>
          <template slot-scope="id, record">
            <G-OptButton @click="onEdit(id)" v-if="!record.del" />
            <G-OptButton type="delete" @click="onDelete(record)" v-if="!record.del" />
            <G-OptButton type="recovery" @click="onRecovery(id)" v-if="record.del" />
          </template>
        </a-table-column>
      </a-table>

      <div class="pagination">
        <div></div>
        <a-pagination
        showSizeChanger 
        :pageSize.sync="query.pageSize"
        v-model="query.pageNum"
        @change="onPageChange"
        @showSizeChange="onPageSizeChange" 
        :total="total"
        :showTotal="total => `共 ${total} 条`"
        :pageSizeOptions="['20','40','60','80']"/>
      </div>

    </div>
    <router-view />
  </div>
</template>

<script>
import utils from '@/utils'
import { queryBrand, deleteBrand, sortBrand } from '@/api/brand'
export default {
  data() {
    const navList = [{id: 'ONLINE', title: '已上线'}, {id: 'OFFLINE', title: '已下线'}, {id: 'DELETED', title: '已删除'}]
    return {
      utils,
      navList: navList,
      query: {
        keyWord: '',
        pageNum: 1,
        pageSize: 20,
        tabCondition: navList[0].id
      },
      total: 0,
      brandList: [],
      loading: false,
    }
  },
  mounted() {
    this.queryBrand()
  },
  methods: {
    add() {
      this.$router.push('/app/category/brand/add')
    },
    /* 每次切换状态时清空还原 pageNum */
    onNavChange(data) {
      this.query.tabCondition = data.id
      this.query.pageNum = 1
      this.queryBrand()
    },
    onSearch(value, event) {
      this.query.keyWord = value
      this.queryBrand()
    },
    async onReSort(data) {
      const res = await sortBrand({id:data.id, sort:data.value})
      if (res.code !== 1200) {
        this.$message.error('操作失败')
        return
      }
      this.$message.success('操作成功')
      this.queryBrand()
    },
    onEdit(id) {
      this.$router.push(`/app/category/brand/edit/${id}`)
    },
    onPageChange(page, pageSize) {
      this.query.pageNum = page
      this.query.pageSize = pageSize
      this.queryBrand()
    },
    onPageSizeChange(current, size) {
      this.query.pageSize = size
      this.queryBrand()
    },
    async delete(id) {
     const res = await deleteBrand({id, del: true})
     if (res.code === 1200) {
       this.$message.success("删除成功")
       this.queryBrand()
     } else {
       this.$message.error("删除失败")
     }
    },
    onDelete(data) {
      if (data.online) {
        this.$warning({
          title: '暂时不能删除!',
          content: '在线品牌不能删除，请先将该品牌下线。',
          okText: '确定',
          centered: true,
        })
        return false
      }
      this.$confirm({
        title: '确定要删除吗？',
        content: '删除后，可以在“已删除”列表中恢复。',
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: this.delete.bind(this, data.id)
      })
    },
    async onRecovery(id) {
      const res = await deleteBrand({id, del: false})
      if (res.code === 1200) {
        this.$message.success("恢复成功")
        this.queryBrand()
      } else {
        this.$message.error("恢复失败")
      }
    },
    async queryBrand() {
      this.loading = true
      try {
        const res = await queryBrand(this.query)
        res.code === 1200 && (this.brandList = res.data.productBrandList, this.total = res.data.total)
      } finally {
        this.loading = false
      }
    },
    toggleLine(data) {
      console.log(data)
    },
    classFormatter(data) {
      let str = ''
      if (data == null) { return str }
      for (let i of data) {
        if (i == null) { continue }
        str += `${i.name}、 `
      }
      return str
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path === '/app/category/brand' &&  from.path.search('/app/category/brand/edit') > -1) {
      this.queryBrand()
    }
    next()
  }
};
</script>

<style lang="less" scoped>
.branc-can-wrapper {
  height: @mainContentH;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    .ant-table-content();
    overflow-y: auto;
    height: calc(100% - 84px);
    padding: 0 20px;
    border-radius: 0 0 4px 4px;
    /* 覆盖 switch 样式 */
    /deep/ .ant-switch-checked {
      background: #65BD63 !important;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      margin: 0 10px 0 0;
    }

    .product-class {
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      margin: 20px 0 0 0;
    }
  }
}


</style>