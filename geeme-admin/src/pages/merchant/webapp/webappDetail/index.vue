<template>
  <G-FullPage title="小程序详情" id='webapp' @back="back">
    <div class="webapp-detail-content">
      <div class='webapp-info'>
        <a-row>
          <p><span>品牌名称</span>{{webappInfo.brandName}}</p>
        </a-row>
        <a-row type='flex'>
          <p><span>小程序名称</span>{{webappInfo.nickName}}</p>
          <p><span>授权类型</span>{{webappInfo.authType == 'wechat'?'微信公众号': '小程序授权'}}</p>
        </a-row>
        <a-row>
          <p><span>最近发布时间</span>{{webappInfo.lastPublishTime? webappInfo.lastPublishTime: '--'}}</p>
        </a-row>
        <a-row type='flex'>
          <p><span>审核模板号</span>{{webappInfo.auditTemplateId}}</p>
          <p><span>对应模板号</span>{{webappInfo.curTemplateId}}</p>
        </a-row>
        <a-row>
          <p><span>小程序logo</span>--</p>
        </a-row>
        <a-row>
          <p><span>小程序简介</span>--</p>
        </a-row>
      </div>
      <h2 class='webapp-record-title'>
          版本记录
      </h2>
      <div class='webapp-record' v-if='recordList.length>0'>
        <a-table :dataSource="recordList" :rowKey='weappId' :loading="loading" :pagination='pages' @change='changePage'>
          <a-table-column dataIndex='codeAuditId' :width=150 title="审核编号" align="left"></a-table-column>
          <a-table-column dataIndex='templateId' :width=150 title="模板号" align="left"></a-table-column>
          <a-table-column dataIndex='version' :width=150 title="版本号" align="left"></a-table-column>
          <a-table-column title="创建时间" align="left" :width=200>
            <template slot-scope="record">
              {{record.createTime ? record.createTime: '--'}}
            </template>
          </a-table-column>
          <a-table-column title="审核时间" align="left" :width=200>
            <template slot-scope="record">
              {{record.auditTime?record.auditTime: '--'}}
            </template>
          </a-table-column>
          <a-table-column  :width=150 title="失败原因" align="left">
            <template slot-scope="record">
              {{record.reason ? record.reason : '--'}}
            </template>
          </a-table-column>
          <!-- <a-table-column dataIndex='' :width=150 title="发布人" align="left"></a-table-column> -->
          <a-table-column :width=100 title="状态" align="left">
            <template slot-scope="record">
              <G-Status-Tag :data='styles(record.result)' />
            </template>
          </a-table-column>
        </a-table>
      </div>
    </div>
  </G-FullPage>
</template>

<script>
import { getBrandWeappBaseMsg, getWeappAuditRecordList } from '@/api/merchant'
export default {
  data() {
    return {
      webappInfo: {},
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      recordList: [],
      loading: false
    };
  },
  mounted() {
    this.getwebappInfo();
    this.getRecordList();
  },
  methods: {
    async getwebappInfo() {
      let res = await getBrandWeappBaseMsg(this.weappId);
      if (res && res.brandWeappInfo) {
        this.webappInfo = res.brandWeappInfo;
      }
    },
    async getRecordList(num) {
      this.loading = true;
      try {
        this.pages.pageNum = num ? num : this.pages.pageNum;
        let param = {
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
          weappId: this.weappId
        }
        let res = await getWeappAuditRecordList(param);
        if (res && res.infoList) {
          this.recordList = res.infoList;
          this.pages.total = res.total;
        }
      } finally {
        this.loading = false
      }
    },
    back() {
      this.$router.push("/app/merchant/webapp");
    },
    // 状态样式计算
    styles(type) {
      let obj = {}
      switch(type) {
        case 3: 
          obj = {
            bgColor: '#FF6D61',
            bdColor: '#FF6D61',
            content: '撤销',
            textColor: '#fff'
          }
          break
        case 4:
          obj = {
            bgColor: '#58C9F3',
            bdColor: '#58C9F3',
            content: '已发布',
            textColor: '#fff'
          }
          break
        case 0:
          obj = {
            bgColor: '#FFAC32',
            bdColor: '#FFAC32',
            content: '审核中',
            textColor: '#fff'
          }
          break
        case 1:
          obj = {
            bgColor: '#75C74F',
            bdColor: '#75C74F',
            content: '审核成功',
            textColor: '#fff'
          }
          break
        case 2:
          obj = {
            bgColor: '#F52D56',
            bdColor: '#F52D56',
            content: '审核失败',
            textColor: '#fff'
          }
          break    
      }
      return obj
    },
    changePage(pagination) {
      this.getRecordList(pagination.current)
    }
  },
  computed:{
    weappId() {
      return this.$route.params.id
    }
  }
};
</script>
<style lang="less">
#webapp .content{
  box-shadow: none;
}
</style>
<style lang="less" scoped>
.webapp-detail-content {
  .common-scrollbar();
  overflow-y: auto;
  height: calc(100vh - 105px);
  // display: flex;
  // flex-direction: column;
  .webapp-info{
    width: 100%;
    padding: 40px 0 0 70px;
    height: 478px;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 6px;
    position: relative;
    &:before{
      width: 100%;
      height: 10px;
      content: '';
      background: #F1F2F7;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1
    }
    &:after{
      width: 100%;
      height: 10px;
      content: '';
      background: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 10;
      border-radius: 0 0 6px 6px;
    }
    p{
      color: #333;
      font-size: 14px;
      margin: 10px 0;
      min-width: 220px;
      span{
        color: #666;
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 20px;
      }
    }
  }
  .webapp-record-title{
    background: #F1F2F7;
    height: 46px;
    padding-top: 12px;
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }
  .webapp-record{
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 6px;
    position: relative;
    padding: 10px;
    max-height:500px;
    &:before{
      width: 100%;
      height: 10px;
      content: '';
      background: #F1F2F7;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1
    }
    &:after{
      width: 100%;
      height: 10px;
      content: '';
      background: #fff;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      border-radius: 6px 6px 0 0 ; 
    }
  }
}
</style>