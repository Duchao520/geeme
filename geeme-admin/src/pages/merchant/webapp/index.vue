<template>
  <div class='webapp-merchant-wrapper'>
    <WebappSearch 
      @search="onSearch"
      :templateList='templateList'
    />
    <div class="content">
      <a-table :dataSource="weappList" :loading="loading" rowKey="id" :pagination=false :scroll="{ y: 'calc(100vh - 380px)'}">
        <a-table-column :width=40 align="left" title=" " >
          <template slot-scope="record">
            <a-checkbox @change="onCheck(record)" :checked="record.checked" style="margin: 0 0 0 15px"></a-checkbox>
          </template>
        </a-table-column>
        <a-table-column title=" " :width=150>
          <template slot-scope="record">
            <a-input style='width: 40px;' @pressEnter='changeSort(record)' v-model='record.sort'/>
          </template>
        </a-table-column>
        <a-table-column dataIndex='brandName' :width=200 title="品牌名称" align="left"></a-table-column>
        <a-table-column dataIndex='nickName' :width=200 title="小程序名称" align="left"></a-table-column>
        <a-table-column title="授权类型" align="left" :width=150>
          <template slot-scope="record">
            {{record.authType == 'wechat'?'微信公众号': '小程序授权'}}
          </template>
        </a-table-column>
        <a-table-column title="最近发布时间" align="left" :width=200>
          <template slot-scope="record">
            {{record.lastPublishTime ? record.lastPublishTime : '-'}}
          </template>
        </a-table-column>
        <a-table-column title="当前模板号" align="left" :width=100>
          <template slot-scope="record">
            {{record.curTemplateId && record.curTemplateId != 0 ?record.curTemplateId :'--'}}
          </template>
        </a-table-column>
        <a-table-column title="审核模板号" align="left" :width=100>
          <template slot-scope="record">
            {{record.auditTemplateId && record.auditTemplateId != 0 ?record.auditTemplateId :'--'}}
          </template>
        </a-table-column>
        <a-table-column title="状态" align="left" :width=150>
          <template slot-scope="record">
            <G-Status-Tag :data='styles(record.status)'/>
          </template>
        </a-table-column>
        <a-table-column title="操作" align="left" :width=300>
          <template slot-scope="record">
            <G-OptButton type="aduit" @click='aduit("single",record)' v-if='record.status != "auditting" && record.status != "unPublish" '/>
            <G-OptButton type="release" @click='release("single",record)' v-if='record.status == "success"'/>
            <G-OptButton type="revoke" @click='revoke("single",record)' v-if='record.status == "auditting"'/>
            <G-OptButton type="detail" @click='details(record)'/>
          </template>
        </a-table-column>
      </a-table>
      <!-- 操作 分页 -->
      <div class="operation">
        <div>
          <a-checkbox :checked="allChecked" @change="checkAll" :indeterminate="indeterminate" style="margin: 0 0 0 15px">全选</a-checkbox>
          <G-OptButton type="aduitSolid" @click='aduit("choiceAll")'/>
          <G-OptButton type="releaseSolid" @click='release("choiceAll")'/>
          <G-OptButton type="revokeSolid" @click='revoke("choiceAll")'/>
        </div>
        <a-pagination
        showSizeChanger 
        :pageSize.sync="pages.pageSize"
        :current="pages.pageNum"
        @change="onPageChange"
        @showSizeChange="onPageSizeChange" 
        :total='pages.total'
        :showTotal="total => `共 ${pages.total} 条`"
        :pageSizeOptions="['10','20','30','40']"/>
      </div>
    </div>
    <a-modal
      title="选择模板"
      :visible="choiceTemplate"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width='800px'
    >
     <a-table :dataSource="templateList" :pagination=false :scroll="{ y: '400px'}">
        <a-table-column :width=50 align="left" title=" " >
          <template slot-scope="record" style='width: 50px;'>
            <a-radio @change="changeTemplate(record)" :checked='record.checked' style="margin: 0 0 0 15px"></a-radio>
          </template>
        </a-table-column>
        <a-table-column dataIndex='template_id' :width=100 title="模板号" align="left"></a-table-column>
        <a-table-column dataIndex='user_version' :width=100 title="版本号" align="left"></a-table-column>
        <a-table-column dataIndex='user_desc' title="描述" align="left" :width=300></a-table-column>
        <a-table-column title="添加到模板时间" align="left" :width=200>
          <template slot-scope="record">
            {{utils.format(record.create_time,'yyyy-MM-dd HH:mm:ss')}}
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
    <router-view />
  </div>
</template>
<script>
import WebappSearch from '../components/webappSearch'
import { getWeappList, updateWeappSort, getTemplateList, upgradeWeapp, undoAudit, publishMult } from '@/api/merchant'
import utils from '@/utils/index'
export default {
  data() {
    return {
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      searchData: {
        auditTemplateId: '', // 审核模板号
        curTemplateId: '', // 当前模板号
        keyWord: '',//搜索条件
        status: '',//状态
      },
      weappList: [],
      checkedList: [],
      tagStyle: {
        bgColor: 'rgba(169,516,110,0.1)',
        bdColor: '#A9D86E',
        content: '营业中',
        textColor: '#A9D86E'
      },
      choiceTemplate: false,
      confirmLoading: false,
      templateList: [],
      utils: utils,
      template: null,
      loading: false
    }
  },
  watch: {
    $route(val) {
      if(val.name == 'webapp') {
        this.init();
        this.checkedList = [];
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      this.getWeappData();
      this.getTemplate();
    },
    async getWeappData(num) {
      this.loading = true;
      try {
        this.pages.pageNum = num ? num : this.pages.pageNum;
        let pageNum = this.pages.pageNum;
        let pageSize = this.pages.pageSize;
        let param = {pageNum,pageSize,...this.searchData}
        let res = await getWeappList(param);
        if( res ) {
          this.weappList = res.brandWeappInfos;
          this.pages.total = res.total;
        }
      } finally {
        this.loading = false;
      }
    },
    async getTemplate() {
      let res = await getTemplateList();
      if(res.errcode == 0) {
        res.template_list.forEach(key => {
          key.checked = false
        })
        this.templateList = res.template_list;
      }
    },
    // 状态样式计算
    styles(type) {
      let obj = {}
      switch(type) {
        case 'unPublish': 
          obj = {
            bgColor: '#FF6D61',
            bdColor: '#FF6D61',
            content: '未发布',
            textColor: '#fff'
          }
          break
        case 'published':
          obj = {
            bgColor: '#58C9F3',
            bdColor: '#58C9F3',
            content: '已发布',
            textColor: '#fff'
          }
          break
        case 'auditting':
          obj = {
            bgColor: '#FFAC32',
            bdColor: '#FFAC32',
            content: '审核中',
            textColor: '#fff'
          }
          break
        case 'success':
          obj = {
            bgColor: '#75C74F',
            bdColor: '#75C74F',
            content: '审核成功',
            textColor: '#fff'
          }
          break
        case 'failed':
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
    details(data) {
      this.$router.push(`/app/merchant/webapp/webappDetail/${data.weappId}`)
    },
    onSearch(obj) {
      this.searchData = obj;
      this.getWeappData();
    },
    aduit(type,item){
      if (type == 'single') {
        item.checked = true;
        this.checkedList= [item.id]
      }
      if (this.checkedList.length <= 0) {
        return this.$message.error('请先选择要审核的数据！');
      }
      this.choiceTemplate = true;
    },
    release(type,item) {
      let that = this;
      if (type == 'single') {
        this.checkedList = [item.id]
        item.checked = true;
      }
      if (this.checkedList.length <= 0) {
        return this.$message.error('请先选择要发布的数据！'); 
      }
      this.$confirm({
        title: '发布',
        content: '确定要发布所选数据吗？',
        async onOk() {
          let param = {
            appIds: that.filterAppIds(),
          }
          let res =  await publishMult(param);
          if (res.success) {
            that.getWeappData(1);
            that.$message.success('发布成功');
          } else {
            that.$message.error(res.message);
          }
        },
        onCancel() {},
      });
    },
    changeTemplate(item){
      console.log(item)
      this.templateList.forEach(key => {
        key.checked = false
      })
      item.checked = true;
      this.template = item;
    },
    handleOk() {
      this.confirmLoading = true;
      if (this.template) {
        this.submitAudit();
      } else {
        this.$message.error('请先选择模板！')
        this.confirmLoading = false;
      }
    },
    async submitAudit() {
      let param = {
        appIds: this.filterAppIds(),
        template: this.template
      }
      let res = await upgradeWeapp(param)
      if (res.success) {
        this.getWeappData(1);
        this.$message.success('提交审核成功,请关注小程序状态！');
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
      this.choiceTemplate = false;
    },
    filterAppIds() {
      let arr = [];
      this.weappList.forEach(key => {
        this.checkedList.forEach(key1 => {
          if (key1 == key.id) {
            arr.push(key.weappId);
          }
        })
      })
      return arr
    },
    revoke(type,item) {
      let that = this
      if (type == 'single') {
        item.checked = true;
        this.checkedList = [item.id]
      }
      if (this.checkedList.length <= 0 ) {
        return this.$message.error('请先选择要撤销的数据！')
      }
      this.$confirm({
        title: '撤销审核',
        content: '确定要撤销所选数据审核吗？',
        async onOk() {
          let param = {
            appIds: that.filterAppIds(),
          }
          let res =  await undoAudit(param);
          if (res.success) {
            that.getWeappData(1);
            that.$message.success('撤销成功');
          } else {
            that.$message.error(res.message);
          }
        },
        onCancel() {},
      });
    },
    onPageChange(page, pageSize) {
      this.pages.pageNum = page;
      this.pages.pageSize = pageSize;
      this.checkedList = [];
      this.getWeappData();
    },
    onPageSizeChange(current, size) {
      this.pages.pageSize = size
    },
    async changeSort(item) {
      let param = {
        id: item.id,
        sort: item.sort
      }
      let res = await updateWeappSort(param);
      if( res.success) {
        this.$message.success(res.message);
        this.getWeappData(1)
      } else {
        this.$message.error(res.message);
      }
    },
    onCheck(record) {
      record.checked = !record.checked
      event.target.checked &&  this.checkedList.push(record.id)
      !event.target.checked && (this.checkedList = this.checkedList.filter(i => i !== record.id))
      console.log(this.checkedList)
    },
    checkAll() {
      const list = JSON.parse(JSON.stringify(this.weappList))
      event.target.checked && this.weappList.map(i => i.checked = true) && (this.checkedList = list.map(i => i=i.id))
      !event.target.checked && this.weappList.map(i => i.checked = false) && (this.checkedList = [])
      console.log(this.checkedList)
    },
    handleCancel() {
      this.choiceTemplate = false;
      this.checkedList = [];
      this.getWeappData();
    }
  },
  computed: {
    indeterminate() {
      return this.checkedList.length > 0 && this.checkedList.length < this.weappList.length
    },
    allChecked() {
      return this.checkedList.length > 0 && this.checkedList.length === this.weappList.length
    }
  },
  components:{
    WebappSearch
  }
}
</script>

<style lang="less" scoped>
.webapp-merchant-wrapper {
  height: @mainContentH;
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    .ant-table-content();
    overflow-y: auto;
    height: calc(100% - 149px);
    padding: 0 20px 20px 20px;
    margin-top: 20px;
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