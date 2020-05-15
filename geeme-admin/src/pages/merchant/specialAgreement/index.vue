<template>
  <div class='webapp-merchant-wrapper'>
    <specialAgreementSearch
      @search="onSearch"
    />
    <G-NavBar :navList="navList" @change="handleSubChanged" class="add-line"></G-NavBar>
    <div class="content">
      <el-table
        :data="dataList"
        :loading="loading"
        height="calc(100vh - 332px)"
      >
        <!-- <el-table-column
          prop="payMethod"
          label="支付方式"
        >
        </el-table-column> -->
        <el-table-column
          label="开户名称"
        >
          <template slot-scope="scope">
            {{searchData.payMethodId === 1 ? scope.row.accountName : scope.row.merchantName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="bankAccount"
          label="银行账号/支付宝账号">
          <template slot-scope="scope">
            {{searchData.payMethodId === 1 ? scope.row.bankAccount : scope.row.aliPayAccount}}
          </template>
        </el-table-column>
        <el-table-column
          prop="openBank"
          label="开户行"
        >
          <template slot-scope="scope">
            {{searchData.payMethodId === 1 ? `${scope.row.openBank}${scope.row.bankBranch}` : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="品牌名称">
        </el-table-column>
        <el-table-column
          prop="contactName"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="contactName"
          label="状态"
        >
          <template slot-scope="scope">
            <G-Status-Tag :data='styles(scope.row.status)'/>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <G-OptButton type="auth" @click="auth(scope.row)" v-if="scope.row.status % 2 === 0"/>
            <G-OptButton type="detail" @click="detail(scope.row)" v-else/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 操作 分页 -->
      <div class="operation">
        <div></div>
        <a-pagination
          showSizeChanger
          :pageSize.sync="pages.pageSize"
          :current="pages.pageNum"
          @change="onPageChange"
          @showSizeChange="onPageSizeChange"
          :total='pages.total'
          :showTotal="total => `共 ${pages.total} 条`"
          :pageSizeOptions="['10','20','30','40']"
        ></a-pagination>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
  import specialAgreementSearch from '../components/specialAgreementSearch'
  import {getMerchantListByQuery} from '@/api/merchant'
  import utils from '@/utils/index'

  export default {
    components: {
      specialAgreementSearch
    },
    data() {
      return {
        pages: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        searchData: {
          keyWord: '',
          status: '',
          applyTime: '',
          payMethodId: 1,
        },
        dataList: [],
        utils: utils,
        loading: false,

        navList: [
          {id: 1, title: '微信'},
          {id: 2, title: '支付宝'},
        ],
      }
    },
    mounted() {
      this.getQueryDataList();
    },
    activated() {
      this.getQueryDataList();
    },
    methods: {
      async getQueryDataList() {
        this.loading = true;
        try {
          let pageNum = this.pages.pageNum;
          let pageSize = this.pages.pageSize;
          let param = {pageNum, pageSize, ...this.searchData};
          this.dataList = []
          let res = await getMerchantListByQuery(param);
          if (res) {
            this.dataList = res.merchantListByQueryInfos;
            this.pages.total = res.total;
          }
        } finally {
          this.loading = false;
        }
      },
      detail(data) {
        if (data.payMethodId === 1) {
          this.$router.push(`/app/merchant/specialAgreement-details/${data.id}/${data.brandId}`)
        } else {
          this.$router.push(`/app/ali-pay-auth/${data.id}/${data.brandId}`)
        }
      },
      auth(data) {
        if (data.payMethodId === 1) {
          this.$router.push(`/app/merchant/specialAgreement-certification/${data.id}/${data.brandId}`)
        } else {
          this.$router.push(`/app/ali-pay-auth/${data.id}/${data.brandId}`)
        }
      },
      onSearch(obj) {
        this.searchData = obj;
        this.getQueryDataList();
      },
      onPageChange(page, pageSize) {
        this.pages.pageNum = page;
        this.pages.pageSize = pageSize;
        this.getQueryDataList();
      },
      onPageSizeChange(current, size) {
        this.pages.pageSize = size;
        this.getQueryDataList();
      },
      // 状态样式计算
      styles(type) {
        /*
        * 0是审核不通过
          1是审核通过
          2是未审核*/
        switch (type) {
          case 3:
            return {
              bgColor: '#58C9F3',
              bdColor: '#58C9F3',
              content: '待授权',
            };
          case 2:
            return {
              bgColor: '#FFAC32',
              bdColor: '#FFAC32',
              content: '审核中',
            };
          case 1:
            return {
              bgColor: '#75C74F',
              bdColor: '#75C74F',
              content: '已通过',
            };
          case 0:
            return {
              bgColor: '#F52D56',
              bdColor: '#F52D56',
              content: '已驳回',
            };
        }
      },

      handleSubChanged(type) {
        this.searchData.payMethodId = type.id
        this.onPageChange(1, 10)
      },
    },
  }
</script>

<style lang="less" scoped>
  .webapp-merchant-wrapper {
    height: @mainContentH;
    .add-line {
      margin-top: 20px;
    }
    .content:extend(.normal-content-one) {
      .common-scrollbar();
      .ant-table-content();
      overflow-y: auto;
      height: calc(100% - 149px - 20px);
      padding: 0 20px 20px 20px;
      // margin-top: 20px;
      .ant-complex-table-content();

      .operation {
        display: flex;
        justify-content: space-between;
        margin: 10px 0 0 0;
      }
    }
  }
</style>
