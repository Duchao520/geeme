<template>
  <G-FullPage title="品牌详情" @back="back">
    <div class="brand-detail-content">
      <div class="pic-side">
        <img :src="utils.imgFormatter(brandInfo.logo)"/>
      </div>
      <div class="info-side">
        <div class="title-info">
          <span class="brand-name">{{brandInfo.name}}</span>
          <span class="brand-codee">品牌编号：{{brandInfo.serialCode}}</span>
        </div>
        <!-- 基本信息 -->
        <G-Border-Content title="基本信息" class="content-wrapper">
          <div class="base-info">
            <G-Detail-Item class="info-item" label="所属行业" :layout="infoLayout">
              <span class="info-text">{{brandInfo.tradeName}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="系统版本" :layout="infoLayout">
              <span class="info-text">{{brandInfo.version == 1 ? '标准版':brandInfo.version == 1? '专业版':brandInfo.version == 1? '旗舰版': '--' }}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="品牌口号" :layout="infoLayout">
              <span class="info-text">{{brandInfo.slogan}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="客服电话" :layout="infoLayout">
              <span class="info-text">{{brandInfo.hotline}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="品牌简介" :layout="infoLayout">
              <span class="info-text">{{brandInfo.introduction}}</span>
            </G-Detail-Item>
            <div class="inside-operation">
              <a-button style="margin-right: 10px; background:#41CAC0; color: #ffffff;">升级</a-button>
              <a-button type="primary">赠送</a-button>
            </div>
          </div>
        </G-Border-Content>
        <!-- 系统信息 -->
        <G-Border-Content title="系统信息" class="content-wrapper" >
          <div class="system-info">
            <a-table :dataSource="storeList" :loading="shopLoading" :pagination=false :scroll="{ y: 'calc(100vh - 580px)'}">
              <a-table-column title="门店编号" dataIndex="serialCode" :width=100 align='left'>
                <template slot-scope='serialCode'>
                  {{serialCode ?serialCode : '--'}}
                </template>
              </a-table-column>
              <a-table-column title="门店名称" dataIndex="name" :width=150 align='left'>
                <template slot-scope='name'>
                  {{name ? name : '--'}}
                </template>
              </a-table-column>
              <a-table-column title="城市" dataIndex="city" :width=100 align='left'>
                <template slot-scope='city'>
                  {{city ? city : '--'}}
                </template>
              </a-table-column>
              <a-table-column title="版本" dataIndex="version" :width=100 align='left'>
                <template slot-scope='version'>
                  {{version==1 ? '标准版' : version==1 ? '标准版' : version==2 ? '专业版' : version==3 ? '旗舰版' : '--'}}
                </template>
              </a-table-column>
              <a-table-column title="开通时间" dataIndex="createTime" :width=200 align='left'>
                <template slot-scope='createTime'>
                  {{createTime ? createTime : '--'}}
                </template>
              </a-table-column>
              <a-table-column title="到期时间" dataIndex="dueTime" :width=200 align='left'>
                <template slot-scope='dueTime'>
                  {{dueTime ? dueTime : '--'}}
                </template>
              </a-table-column>
              <a-table-column title="状态" dataIndex="status" :width=100 align='left'>
                <template slot-scope='status'>
                  <G-Status-Tag :data='styles(status)' />
                </template>
              </a-table-column>
              <a-table-column title="操作" :width=200 align='left'>
                <template slot-scope='record'>
                  <G-OptButton type="renewal" @click='renewal(record)'/>
                </template>
              </a-table-column>
            </a-table>
          </div>
        </G-Border-Content>
        <!-- 销售归属 -->
        <G-Border-Content title="销售归属" class="content-wrapper">
          <div class="sale-info">
            <a-form layout="inline">
              <a-form-item label="销售归属">
                <a-select placeholder="请选择销售公司" style="width:300px;">
                  <a-select-option value="china">杭州分公司</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="请选择销售人" style="width:200px;">
                  <a-select-option value="china">某某某</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </G-Border-Content>
        <!-- 付款记录 -->
        <G-Border-Content title="付款记录" class="content-wrapper">
          <div class="system-info">
            <a-table :dataSource="recordList" :scroll="{ y: 'calc(100vh - 280px)'}" :pagination='recordPages' @change='changePage'>
              <a-table-column dataIndex="payTime" title="付款时间" :width=150 align='left'>
                <template slot-scope='payTime'>
                  {{payTime ? payTime : '--'}}
                </template>
              </a-table-column>
              <a-table-column dataIndex="type" title="付款性质" :width=100 align='left'>
                <template slot-scope='type'>
                  {{type == 'BUY_NEW' ? '新购' :type == 'RENEWAL' ? '续期' :type == 'UPGRADE' ? '升级' : '--'}}
                </template>
              </a-table-column>
              <a-table-column dataIndex="num" title="账号数量" :width=80 align='left'>
                <template slot-scope='num'>
                  {{num ? num : '--'}}
                </template>
              </a-table-column>
              <!-- <a-table-column dataIndex="status" title="使用数量">
                <template slot-scope='dueTime'>
                  {{dueTime ? dueTime : '--'}}
                </template>
              </a-table-column> -->
              <a-table-column dataIndex="version" title="版本" :width=100 align='left'>
                <template slot-scope='version'>
                  {{version==1 ? '标准版' : version==1 ? '标准版' : version==2 ? '专业版' : version==3 ? '旗舰版' : '--'}}
                </template>
              </a-table-column>
              <a-table-column dataIndex="duration" title="购买时长" :width=80 align='left'>
                <template slot-scope='duration'>
                  {{duration ? duration+ '/年' : '--'}}
                </template>
              </a-table-column>
              <a-table-column dataIndex="payAmount" title="付款金额" :width=100 align='left'>
                <template slot-scope='payAmount'>
                  {{payAmount ? payAmount : '--'}}
                </template>
              </a-table-column>
              <a-table-column dataIndex="payWay" title="付款方式" :width=100 align='left'>
                <template slot-scope='payWay'>
                  {{payWay == 1 ? '支付宝' : payWay == 2 ? '微信' : payWay == 3 ? '银行转账' : '--'}}
                </template>
              </a-table-column>
              <a-table-column dataIndex="record" title="操作人" :width=100 align='left'>
                <template slot-scope='record'>
                  --
                </template>
              </a-table-column>
            </a-table>
          </div>
        </G-Border-Content>

        <div class="bottom-operation">
          <a-button type="primary" style="margin-right: 20px;">保存修改</a-button>
          <a-button @click='cecal()'>取消</a-button>
        </div>
      </div>
    </div>
    <a-modal
      title="续期"
      :visible="renewalModal"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width='500px'
    >
      <a-form-item
        label="门店名称"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <span>{{shopDetails.name}}</span>
      </a-form-item>
      <a-form-item
        label="到期时间"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <span>{{shopDetails.dueTime}}</span>
      </a-form-item>
      <a-form-item
        label="续期至"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-date-picker :disabledDate="disabledDate" v-decorator="['dueTimeNew', config]" v-model='dueTimeNew' @change='panelChange'/>
      </a-form-item>
      <a-form-item
        label="操作理由"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input placeholder="请输入操作理由" v-model='dueTimeDate.reason' />
      </a-form-item>
    </a-modal>
  </G-FullPage>
</template>

<script>
import { getRecordByBrandId, getBrandDetail4BackSys, renewalBySys} from '@/api/merchant'
import utils from '@/utils/index'
export default {
  data() {
    return {
      utils: utils,
      infoLayout: { label: 125, content: 726 },
      brandInfo: {},
      recordPages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      recordList: [],
      shopLoading: false,
      storeList: [],
      shopDetails: {},
      renewalModal: false,
      confirmLoading: false,
      dueTimeDate: {
        dueTimeNew: null,
        reason: null
      },
      dueTimeNew: null,
      config: {
        rules: [{ type: 'object', required: true, message: 'Please select time!' }],
      },
    };
  },
  created() {
    this.getStoreList();
    this.getPayRecord();
  },
  methods: {
    // async getBrandInfo() {
    //   let res = await getBrandDetails(this.id);
    //   if (res) {
    //     this.shopQuery.brandName = res.brandName ? res.brandName : ''
    //     this.getStoreList();
    //   }
    // },
    async getStoreList() {
      this.shopLoading = true
      try{
        let res = await getBrandDetail4BackSys(this.id);
        this.storeList = res.storeInfos;
        this.brandInfo = res.brandInfo;
      } finally {
        this.shopLoading = false
      }
    },
    async getPayRecord(num) {
      this.recordPages.pageNum =  num ? num : this.recordPages.pageNum;
      let pageNum = this.recordPages.pageNum;
      let pageSize = this.recordPages.pageSize;
      let brandId = this.id;
      let param = {pageNum,pageSize,brandId}
      let res = await getRecordByBrandId(param);
      this.recordList = res.recordList;
      this.recordPages.total = res.total;
    },
    back() {
      this.$router.push("/app/merchant/list");
    },
    changePage(pagination) {
      this.getPayRecord(pagination.current)
    },
    renewal(row) {
      this.shopDetails = row;
      this.renewalModal = true;
    },
    disabledDate(current) {
      let currentTime = current._d.getTime();
      let dueTime = new Date(this.shopDetails.dueTime).getTime();
      return currentTime < dueTime ? true : false
    },
    panelChange(date,dateString) {
      this.dueTimeDate.dueTimeNew = dateString + ' 23:59:59' // 接口必须要时间格式，所以补充23:59:59
    },
    async handleOk() {
      
      if ( !this.dueTimeDate.dueTimeNew) {
        return this.$message.error('请选择要续期的时间！');
      } else if (!this.dueTimeDate.reason) {
        return this.$message.error('请填写续期理由！');
      }
      this.confirmLoading = true;
      try{
        let dueTimeOld = this.shopDetails.dueTime
        let storeId = this.shopDetails.id
        let param = {...this.dueTimeDate,storeId,dueTimeOld}
        let res = await renewalBySys(param);
        if (res.success){
          this.getStoreList(1);
          this.$message.success('续期成功！');
          this.renewalModal = false;
        } else {
          this.$message.error(res.message)
        }
      } finally{
        this.confirmLoading = false;
      }
    },
    handleCancel() {
      this.renewalModal = false;
    },
    // 状态样式计算
    styles(type) {
      let obj = {}
      switch(type) {
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
      return obj
    },
    cecal() {
      this.$router.push("/app/merchant/list");
    }
  },
  computed:{
    id() {
      return this.$route.params.id
    }
  }
};
</script>

<style lang="less" scoped>
.brand-detail-content {
  .common-scrollbar();
  padding: 40px 0 0 70px;
  overflow-y: auto;
  height: calc(100vh - 105px);
  display: flex;
  /* 非通用表格 */
  .ant-complex-table-content();
  .pic-side {
    padding: 0 40px 0 0;
    img {
      width: 160px;
      height: 160px;
      display: block;
    }
  }
  .info-side {
    width: 1110px;
    .content-wrapper {
      margin: 0 0 20px 0;
    }
    .title-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 22px 0;
      height: 30px;
      .brand-name {
        color: rgba(51, 51, 51, 1);
        font-size: 22px;
      }
      .brand-codee {
        color: rgba(102, 102, 102, 1);
        font-size: 14px;
      }
    }
    .base-info {
      padding: 20px 0 7px 0;
      position: relative;
      .info-item {
        margin: 0 0 13px 0;
      }
      .info-text {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
      }
    }
    .system-info {
      .ant-inside-table-content();
      padding: 0 17px 20px 17px;
    }
    .sale-info {
      padding: 20px 0 20px 70px;
      .normal-form-item();
    }
    .bottom-operation {
      margin: 40px 0;
    }
    .inside-operation {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}
</style>