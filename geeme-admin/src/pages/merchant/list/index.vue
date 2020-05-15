<template>
  <div class="merchant-list-wrapper">
    <BrandSearch
      v-if="searchReset"
      v-show="type==='brand'"
      :type="type"
      @reset="onReset"
      @search="onSearch"
      @change="onTypeChange"
    />
    <ShopSearch
      v-show="type==='shop'"
      :type="type"
      @search="onSearch"
      @change="onTypeChange"
    />

    <G-NavBar :navList="shopNavList" v-show="type === 'shop'" @change="onNavChange"/>
    <G-NavBar :navList="brandNavList" v-show="type === 'brand'" @change="onNavChange"/>

    <div class="content" v-show="type === 'brand'">
      <a-table
        rowKey="id"
        :dataSource="brandList"
        :loading="loading"
        :pagination=false
        :scroll="{ y: 'calc(100vh - 465px)'}"
      >
        <!-- check -->
        <a-table-column :width=40 align="left">
          <template slot-scope="record">
            <a-checkbox @change="onCheck(record)" :checked="record.checked" style="margin: 0 0 0 15px"></a-checkbox>
          </template>
        </a-table-column>
        <!-- 品牌编号 缺省-->
        <a-table-column title="品牌编号" dataIndex='serialCode' :width=100></a-table-column>
        <!-- 品牌名称 -->
        <a-table-column title="品牌名称" dataIndex="name" :width=140></a-table-column>
        <!-- 城市 -->
        <a-table-column title="城市" dataIndex="city" :width=100></a-table-column>
        <!-- 行业 -->
        <a-table-column title="行业" dataIndex="tradeName" :width=80></a-table-column>
        <!-- 新开券（已用/已购） 缺省-->
        <a-table-column title="新开券（已用/已购）" :width=100>
          <template slot-scope="record">
            <span>{{record.useNewNum}}/{{record.boughtNewNum}}</span>
          </template>
        </a-table-column>
        <!-- 续期券（已用/已购） 缺省-->
        <a-table-column title="续期券（已用/已购）" :width=100>
          <template slot-scope="record">
            <span>{{record.useRenewalNum}}/{{record.boughtRenewalNum}}</span>
          </template></a-table-column>
        <!-- 开通门店数 缺省-->
        <a-table-column title="开通门店数" dataIndex="storeNum" :width=60>
          <template slot-scope='storeNum'>
            {{storeNum ?storeNum : '0'}}
          </template>
        </a-table-column>
        <!-- 创建人 缺省-->
        <a-table-column title="创建人" dataIndex="userName" :width=80></a-table-column>
        <!-- 手机号码 缺省-->
        <a-table-column title="手机号码" dataIndex="userTel" :width=100></a-table-column>
        <!-- 版本-->
        <a-table-column title="版本" dataIndex="version" :width=80>
          <template slot-scope="version">
            <span>{{versionFormatter(version)}}</span>
          </template>
        </a-table-column>
        <!-- 创建时间 -->
        <a-table-column title="创建时间" dataIndex="createTime" :width=120></a-table-column>
        <!-- 首店开通时间 缺省-->
        <a-table-column title="首店开通时间" dataIndex="firstOpenTime" :width=120>
          <template slot-scope='firstOpenTime'>
            {{firstOpenTime ?firstOpenTime : '--'}}
          </template>
        </a-table-column>
        <!-- 销售公司 -->
        <a-table-column title="销售公司" dataIndex="salesCompany" :width=100>
          <template slot-scope='salesCompany'>
            {{salesCompany ?salesCompany : '--'}}
          </template>
        </a-table-column>
        <!-- 销售人-->
        <a-table-column title="销售人" dataIndex="salesman" :width=100>
          <template slot-scope='salesman'>
            {{salesman ?salesman : '--'}}
          </template>
        </a-table-column>
        <!-- 认证状态-->
        <a-table-column title="认证状态" dataIndex="auth" :width=100>
          <template slot-scope="auth">
            <AuthTag :status="auth" />
          </template>
        </a-table-column>
         <!-- 操作-->
        <a-table-column title="操作" dataIndex="id" :width=180 align="left">
          <template slot-scope="id, record">
            <G-OptButton type="detail" @click="detail(record)" style="margin: 6px"/>
            <G-OptButton type="auth" @click="auth(record)" v-if="record.auth !== 0" style="margin: 6px"/>
            <br>
            <G-OptButton type="newCoupon" style="margin: 6px" @click="getSoftInfoForSendTicket(id,1)"/>
            <G-OptButton type="attendCoupon" style="margin: 6px" @click="getSoftInfoForSendTicket(id,2)"/>
          </template>
        </a-table-column>
      </a-table>
      <!-- 操作 分页 -->
      <div class="operation">
        <div>
          <a-checkbox :checked="allChecked" @change="checkAll" :indeterminate="indeterminate" style="margin: 0 0 0 15px">全选</a-checkbox>
          <G-OptButton type="export" />
        </div>
        <a-pagination
        showSizeChanger
        :pageSize.sync="brandQuery.pageSize"
        v-model="brandQuery.pageNum"
        @change="onPageChange"
        @showSizeChange="onPageSizeChange"
        :total="total"
        :showTotal="total => `共 ${total} 条`"
        :pageSizeOptions="['20','40','60','80']"/>
      </div>
    </div>

    <div class="content" v-show="type === 'shop'">
      <a-table
        rowKey="id"
        :dataSource="storeList"
        :loading="loading"
        :pagination=false
        :scroll="{x: '120%', y: 'calc(100vh - 445px)'}">
        <a-table-column :width=40 align="left" fixed="left">
          <template slot-scope="record">
            <a-checkbox @change="onCheck(record)" :checked="record.checked" style="margin: 0 0 0 15px"></a-checkbox>
          </template>
        </a-table-column>
        <a-table-column dataIndex="serialCode" align="left" :width=80 title="门店编号" fixed="left">
          <template slot-scope='serialCode'>
            {{serialCode ?serialCode : '--'}}
          </template>
        </a-table-column>
        <a-table-column dataIndex="name" align="left" :width=150 title="门店名称" fixed="left">
          <template slot-scope='name'>
            {{name ? name : '--'}}
          </template>
        </a-table-column>
        <a-table-column dataIndex="brandName" align="left" :width=150 title="品牌">
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
        <a-table-column align="left" dataIndex="username" :width=80 title="创建人">
          <template slot-scope='username'>
            {{username ? username : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="mobile" :width=120 title="手机号码">
          <template slot-scope='mobile'>
            {{mobile ? mobile : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="version" :width=80 title="版本">
          <template slot-scope='version'>
            {{version==1 ? '标准版' : version==1 ? '标准版' : version==2 ? '专业版' : version==3 ? '旗舰版' : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="createTime" :width=120 title="开通时间">
          <template slot-scope='createTime'>
            {{createTime ? createTime : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="dueTime" :width=120 title="到期时间">
          <template slot-scope='dueTime'>
            {{dueTime ? dueTime : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="salesCompany" :width=150 title="销售公司">
          <template slot-scope='salesCompany'>
            {{salesCompany ? salesCompany : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="salesman" :width=100 title="销售人">
          <template slot-scope='salesman'>
            {{salesman ? salesman : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="serveCompany" :width=150 title="服务公司">
          <template slot-scope='serveCompany'>
            {{serveCompany ? serveCompany : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" dataIndex="server" :width=100 title="服务者">
          <template slot-scope='server'>
            {{server ? server : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="offlineTime" :width=120 title="下线时间" v-if="shopQuery.tab == 'OFFLINE'">
          <template slot-scope='offlineTime'>
            {{offlineTime ? offlineTime : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="left" dataIndex="deleteTime" :width=120 title="禁用时间" v-if="shopQuery.tab == 'DELETED'">
          <template slot-scope='deleteTime'>
            {{deleteTime ? deleteTime : '--'}}
          </template>
        </a-table-column>
        <a-table-column align="center" :width=80 title="状态">
          <template slot-scope='record'>
            <G-Status-Tag :data='styles(record)' />
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template slot-scope='record'>
            <G-OptButton type="detail" @click='detail(record)'/>
            <G-OptButton type="open" @click='disabled(record)' v-if="record.deleted"/>
            <G-OptButton type="disabled" @click='disabled(record)' v-else/>
          </template>
        </a-table-column>
      </a-table>
      <a-modal
        :title="disabledRecord.deleted ? '门店禁用' : '门店开启'"
        :visible="disabledModal"
        @ok="enableStore"
        :confirmLoading="confirmLoading"
        @cancel="disabledModal = false"
        width='500px'
      >
        <a-alert
          :message="disabledRecord.deleted ? '确定要禁用吗?' : '确定要开启吗?'"
          :description="disabledRecord.deleted ? '禁用后，商家将无法登录该门店管理台。' : '开通后，商家将恢复门店管理台的所有权限。'"
          type="warning"
          style="margin-bottom: 12px;"
          showIcon
        />
        <a-form-item
          label="操作理由"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input placeholder="请输入操作理由" v-model='disabledRecord.reason' />
        </a-form-item>
      </a-modal>

      <a-modal
        centered
        @cancel="couponModal = false"
        :confirmLoading="confirmLoading"
        @ok="SendTicketForBrandSoft"
        :title="COUPON_PARAMS.type == 1 ? '新开券派发' : '续期券派发'"
        :visible="couponModal"
        width='500px'
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="行业"
                         style="margin: 0"
                         :label-col="{ span: 10 }"
                         :wrapper-col="{ span: 12 }">
              <span class="ant-form-text" style="color: #C5C9D0;">{{COUPON_PARAMS.tradeName ? COUPON_PARAMS.tradeName : '--'}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="版本"
                         style="margin: 0"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 12 }">
              <span class="ant-form-text" style="color: #C5C9D0;">{{COUPON_PARAMS.version==1 ? '标准版' : COUPON_PARAMS.version==1 ? '标准版' : COUPON_PARAMS.version==2 ? '专业版' : COUPON_PARAMS.version==3 ? '旗舰版' : '--'}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="价格"
                     style="margin: 0"
                     :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 12 }">
          <span class="ant-form-text" style="color: #C5C9D0;">{{COUPON_PARAMS.price ? COUPON_PARAMS.price : '--'}}</span>
        </a-form-item>
        <a-form-item
          label="数量"
          style="margin: 0"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input placeholder="请填写数字" type="number" v-model="COUPON_PARAMS.count">
              <p slot="addonAfter" class="addonAfter">张</p>
          </a-input>
        </a-form-item>
        <a-form-item
          label="备注"
          style="margin: 0"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input placeholder="派发原因说明" v-model="COUPON_PARAMS.remark"></a-input>
        </a-form-item>
      </a-modal>
      <!-- 操作 分页 -->
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

    <router-view />
  </div>
</template>

<script>
import BrandSearch from '../components/brandSearch'
import ShopSearch from '../components/shopSearch'
import AuthTag from '../components/authTag'
import utils from '@/utils/index'
import { queryBrand, StoreManageGetList , enableStore , getSoftInfoForSendTicket , SendTicketForBrandSoft} from '@/api/merchant'
export default {
  components: {
    BrandSearch,
    ShopSearch,
    AuthTag,
  },
  data() {
    const shopNavList = [{id: 'ONLINE', title: '营业中'},  {id: 'TRYING', title: '试用中'},{id: 'OFFLINE', title: '已下线'}, {id: 'OVER_DUE', title: '已到期'},{id: 'DELETED', title: '已禁用'}] //, {id: null, title: '已禁用'} 暂时
    const brandNavList = [{id: -1, title: '全部'}, {id: 1, title: '已认证'}, {id: 2, title: '认证中'}, {id: 3, title: '认证退回'}, {id: 0, title: '未认证'}]
    return {
      type: 'shop',
      shopNavList,
      brandNavList,
      searchReset: true,
      brandQuery: {
        auth: -1,
        city: "ALL",
        salesCompany: "ALL",
        salesman: "ALL",
        tradeId: -1,
        version: -1,
        pageNum: 1,
        pageSize: 20,
      },
      shopQuery: {
        brandName: null,
        city: null,
        dueTime: null,
        keyword: null,
        pageNum: 1,
        pageSize: 20,
        salesCompany: null,
        salesman: null,
        serveCompany: null,
        server: null,
        tab: shopNavList[0].id,
        tradeId: null,
        version: null
      },
      brandList: [],
      storeList: [],
      loading: false,
      total: 0,
      checkedList: [],
      oneDay: 1000*60*60*24, // 一天,
      disabledModal: false,
      disabledRecord: {
        deleted: true,
        reason: null,
        storeId: null,
        userId: null
      },
      confirmLoading: false,
      couponModal: false,
      COUPON_PARAMS: {
        brandId: null,
        count: null,
        remark: null,
        type: null
      }
    }
  },
  computed: {
    indeterminate() {
      return this.checkedList.length > 0 && this.checkedList.length < this.brandList.length
    },
    allChecked() {
      return this.checkedList.length > 0 && this.checkedList.length === this.brandList.length
    }
  },
  mounted() {
    //this.getStoreList();
  },
  methods: {
    versionFormatter(version) {
      switch(version) {
        case 1:
          return '标准版'
        case 2:
          return '专业版'
        case 3:
          return '旗舰版'
      }
    },
    onReset() {
      this.searchReset = false
      this.$nextTick(() => this.searchReset = true)
    },
    onSearch(data) {
      if (this.type == 'brand') {
        this.brandQuery = Object.assign(this.brandQuery, data)
        this.queryBrand()
      } else {
        this.shopQuery = Object.assign(this.shopQuery, data);
        if (this.shopQuery.dueTime == 0) {
          this.shopQuery.dueTime = null
        } else {
          let currentDate = new Date().getTime();
          let durTime = currentDate + this.oneDay*this.shopQuery.dueTime
          this.shopQuery.dueTime = utils.format(durTime,'yyyy-MM-dd') + " 23:59:59"
        }
        this.getStoreList()
      }
    },
    onNavChange(data) {
      if (this.type == 'brand') {
        this.brandQuery.auth = data.id
        this.brandQuery.pageNum = 1
        this.queryBrand()
      } else {
        this.shopQuery.tab = data.id
        this.getStoreList(1)
      }
    },
    onCheck(record) {
      record.checked = !record.checked
      event.target.checked &&  this.checkedList.push(record.id)
      !event.target.checked && (this.checkedList = this.checkedList.filter(i => i !== record.id))
      console.log(this.checkedList)
    },
    checkAll() {
      const list = JSON.parse(JSON.stringify(this.brandList))
      event.target.checked && this.brandList.map(i => i.checked = true) && (this.checkedList = list.map(i => i=i.id))
      !event.target.checked && this.brandList.map(i => i.checked = false) && (this.checkedList = [])
      console.log(this.checkedList)
    },
    async queryBrand() {
      this.loading = true
      try {
        const res = await queryBrand(this.brandQuery)
        this.brandList = res.brands || [],
        this.brandList.map(i => i.checked = false)
        this.total = res.total
        this.checkedList.length = 0
      } finally {
        this.loading = false
      }
    },
    async getStoreList(num) {
      this.shopQuery.pageNum = num ? num : this.shopQuery.pageNum;
      let param = this.shopQuery;
      let res = await StoreManageGetList(param);
      if (res) {
        this.storeList = res.storeManageInfoList;
        this.total = res.total
      }
    },
    async enableStore(){
      this.confirmLoading = true;
      let params = this.disabledRecord;
      let res = await enableStore(params);
      if(res.success){
        this.disabledModal = false;
        this.confirmLoading = false;
        this.getStoreList(1);
      }
    },
    async getSoftInfoForSendTicket(brandId=null , type = null){
      for(let i in this.COUPON_PARAMS){
        this.COUPON_PARAMS[i] = null;
      }
      let _self = this,
          params = {
            brandId: brandId,
            type: type
          };
      let res = await getSoftInfoForSendTicket(params);
      this.COUPON_PARAMS = Object.assign(this.COUPON_PARAMS, res);
      this.COUPON_PARAMS.brandId = brandId;
      if(type == 1){
        _self.COUPON_PARAMS.type = 1;
      }else if(type == 2){
        _self.COUPON_PARAMS.type = 2;
      }
      this.couponModal = true;
    },
    async SendTicketForBrandSoft(){
      this.confirmLoading = true;
      try {
        let {brandId,count,remark,type} = this.COUPON_PARAMS;
        let params = {brandId,count,remark,type},res;
        if(count){
          res = await SendTicketForBrandSoft(params);
          if(res.success){
            this.couponModal = false;
          }
        }else{
          this.$message.warning('请输入数量');
        }
      }finally {
        this.confirmLoading = false;
      }

    },
    onPageChange(page, pageSize) {
      if (this.type == 'brand') {
        this.brandQuery.pageNum = page
        this.brandQuery.pageSize = pageSize
        this.queryBrand()
      } else {
        this.shopQuery.pageSize = pageSize
        this.getStoreList(page)
      }
    },
    onPageSizeChange(current, size) {
      if (this.type == 'brand') {
        this.brandQuery.pageSize = size
        this.queryBrand()
      } else {
        this.shopQuery.pageSize = size
        this.getStoreList()
      }
    },
    auth(data) {
      this.$router.push(`/app/merchant/list/authBrand/${data.id}`)
    },
    detail(data) {
      console.log(data)
      if (this.type=='brand') {
        this.$router.push(`/app/merchant/list/${this.type}Detail/${data.id}`)
      } else {
        this.$router.push(`/app/merchant/list/${this.type}Detail/${data.id}`)
      }
    },
    disabled(record){
      this.disabledRecord.reason = "";
      this.disabledRecord.storeId = record.id;
      this.disabledRecord.userId = this.$store.state.user.userId;
      if(record.deleted){     //已禁用
        this.disabledRecord.deleted = false;
      }else {                //已开启
        this.disabledRecord.deleted = true;
      }
      this.disabledModal = true;
    },
    onTypeChange() {
      this.type = this.type === 'brand'? 'shop': 'brand'
      if (this.type == 'brand') {
        this.brandQuery.pageNum = 1
        this.queryBrand()
      } else {
        this.getStoreList(1)
      }
    },
    // 状态样式计算
    styles(record) {
      let {status , deleted} = record,
          obj = {};
      if(deleted){
        obj = {
          bgColor: '#FF6D61',
          bdColor: '#FF6D61',
          content: '已禁用',
        }
      }else{
        switch(status) {
          case 'ONLINE':
            obj = {
              bgColor: '#A9D86E',
              bdColor: '#A9D86E',
              content: '营业中',
            }
            break
          case 'OFFLINE':
            obj = {
              bgColor: '#FCB322',
              bdColor: '#FCB322',
              content: '已下线',
            }
            break
          case 'OVER_DUE':
            obj = {
              bgColor: '#FF6D61',
              bdColor: '#FF6D61',
              content: '已到期',
            }
            break
          case 'TRY_OVER_DUE':
            obj = {
              bgColor: '#FF6D61',
              bdColor: '#FF6D61',
              content: '试用到期',
            }
            break
          case 'TRYING':
            obj = {
              bgColor: '#41CAC0',
              bdColor: '#41CAC0',
              content: '试用中',
            }
            break
          case 'INSTORE':
            obj = {
              bgColor: '#FF6D61',
              bdColor: '#FF6D61',
              content: '保存入库',
            }
            break
        }
      }
      return obj
    },

  },
  beforeRouteUpdate (to, from, next) {
    if (to.path === '/app/merchant/list' &&  from.path.search('/app/merchant/list/') > -1) {
      if(this.type == 'brand') {
        this.queryBrand()
      } else {
        this.getStoreList(1);
      }
    }
    next()
  }
}
</script>

<style lang="less" scoped>
  .ant-table td { white-space: nowrap;}
.merchant-list-wrapper {
  height: @mainContentH;
  .addonAfter{
    background: #58C9F3 !important;
    position: absolute !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
  }
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    /*overflow: hidden;*/
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
