<template>
  <G-FullPage title="门店详情" @back="back" v-if='shopDetails.storeInfo'>
    <div class="shop-detail-content">
      <div class="pic-side">
        <img :src="utils.imgFormatter(shopDetails.storeInfo.image)"/>
      </div>
      <div class="info-side">
        <div class="title-info">
          <span class="brand-name">{{shopDetails.storeInfo.brandInfo.name}} {{shopDetails.storeInfo.name}}</span>
          <span class="brand-codee">门店编号：{{shopDetails.storeInfo.serialCode}}</span>
        </div>
        <!-- 基本信息 -->
        <G-Border-Content title="基本信息" class="content-wrapper">
          <div class="base-info">
            <G-Detail-Item class="info-item" label="客服电话" :layout="infoLayout">
              <span class="info-text">{{shopDetails.storeInfo.hotline}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="门店地址" :layout="infoLayout">
              <span class="info-text" v-text='area()'></span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="营业时间" :layout="infoLayout">
              <span class="info-text" v-html='fiflteWeek()'></span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="门店简介" :layout="infoLayout">
              <span
                class="info-text"
              >{{shopDetails.storeInfo.introduction}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="门店相册" :layout="albumLayout">
              <img class='imgs' v-for='(item,key) in shopDetails.storeInfo.photos' :key='key' :src="utils.imgFormatter(item)" alt="">
            </G-Detail-Item>
            <div class="inside-operation">
              <a-button style="background:#F52D56; color: #ffffff;">禁用</a-button>
            </div>
          </div>
        </G-Border-Content>
        <!-- 系统信息 -->
        <G-Border-Content title="系统信息" class="content-wrapper">
          <div class="system-info">
            <G-Detail-Item class="info-item" label="系统版本" :layout="infoLayout">
              <span class="info-text">{{shopDetails.storeSysInfo.version == 1 ? '标准版' :shopDetails.storeSysInfo.version == 2 ? '专业版' :shopDetails.storeSysInfo.version == 3 ? '旗舰版' : '--' }}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="开通时间" :layout="infoLayout">
              <span class="info-text">{{shopDetails.storeSysInfo.openTime}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="到期时间" :layout="infoLayout">
              <span class="info-text">{{shopDetails.storeSysInfo.dueTime}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="创建人" :layout="infoLayout">
              <span class="info-text">{{shopDetails.storeSysInfo.createUser}}  {{shopDetails.storeSysInfo.mobile}}</span>
            </G-Detail-Item>
            <!-- operation -->
            <div class="inside-operation">
              <a-button type="primary" @click='renewalModal= true'>续期</a-button>
            </div>
          </div>
        </G-Border-Content >
        <!-- 销售与服务 -->
        <G-Border-Content v-if='false' title="销售与服务" class="content-wrapper">
          <div class="sale-info">
            <a-form layout="inline" style="margin: 0 0 18px 0;">
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
            <a-form layout="inline">
              <a-form-item label="服务归属">
                <a-select placeholder="请选择销售公司" style="width:300px;">
                  <a-select-option value="china">杭州分公司</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="请选择服务者" style="width:200px;">
                  <a-select-option value="china">某某某</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </G-Border-Content>

        <div class="bottom-operation" v-if='false'>
          <a-button type="primary" style="margin-right: 20px;">保存修改</a-button>
          <a-button>取消</a-button>
        </div>

        <h3>操作记录</h3>
        <div class="operate-table"
          v-loading="loading"
        >
          <el-table
            :data="operateTable"
            stripe
          >
            <el-table-column
              prop="modifyTime"
              label="操作时间">
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作行为">
            </el-table-column>
            <el-table-column
              prop="reason"
              label="操作理由">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="操作人">
            </el-table-column>
          </el-table>
          <div class="page-box">
            <el-pagination
              style="margin-right: 12px;"
              class="pagination"
              @current-change="handleCurrentChange"
              :current-page="pageQuery.pageNum"
              :page-size="pageQuery.pageSize"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
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
        <span>{{shopDetails.storeInfo.name}}</span>
      </a-form-item>
      <a-form-item
        label="到期时间"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <span>{{shopDetails.storeInfo.dueTime}}</span>
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
import utils from '@/utils/index'
import fetch from '@/utils/fetch';
import { getStroeDetails, renewalBySys } from '@/api/merchant'
export default {
  data() {
    return {
      infoLayout: { label: 125, content: 726 },
      albumLayout: { label: 125, content: 900 },
      shopDetails: {},
      utils: utils,
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
      operateTable: [],
      pageQuery: { // 用于激活表格查询 2-3
        pageNum: 1,
        pageSize: 10,
      },
      total: 0, // 
      loading: false, // 
    };
  },
  created() {
    this.StroeDetails();
    this.initOperateData()
  },
  methods: {
    async StroeDetails() {
      let res = await getStroeDetails(this.id);
      this.shopDetails = res;
    },
    area() {
      let arr = [this.shopDetails.storeInfo.province,this.shopDetails.storeInfo.city,this.shopDetails.storeInfo.area,this.shopDetails.storeInfo.address]
      return arr.join('-')
    },
    fiflteWeek() {
      let weeks = []
      this.shopDetails.storeInfo.workdays.forEach(item => {
        'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'
        weeks.push(item == 'MONDAY' ? '周一' : item == 'TUESDAY' ? '周二' : item == 'WEDNESDAY' ? '周三' : item == 'THURSDAY' ? '周四' : item == 'FRIDAY' ? '周五' : item == 'SATURDAY' ? '周六' : item == 'SUNDAY' ? '周日' : '');
      })
      weeks = weeks.join('、') +'&nbsp;&nbsp;&nbsp;'+ this.shopDetails.storeInfo.workTimeBegin + '-' + this.shopDetails.storeInfo.workTimeEnd
      return weeks
    },
    panelChange(date,dateString) {
      this.dueTimeDate.dueTimeNew = dateString + ' 23:59:59' // 接口必须要时间格式，所以补充23:59:59
    },
    disabledDate(current) {
      let currentTime = current._d.getTime();
      let dueTime = new Date(this.shopDetails.storeSysInfo.dueTime).getTime();
      return currentTime < dueTime ? true : false
    },
    async handleOk() {
      if ( !this.dueTimeDate.dueTimeNew) {
        return this.$message.error('请选择要续期的时间！');
      } else if (!this.dueTimeDate.reason) {
        return this.$message.error('请填写续期理由！');
      }
      this.confirmLoading = true;
      try{
        let dueTimeOld = this.shopDetails.storeSysInfo.dueTime
        let storeId = this.shopDetails.storeInfo.id
        let param = {...this.dueTimeDate,storeId,dueTimeOld}
        let res = await renewalBySys(param);
        if (res.success){
          this.StroeDetails();
          this.$message.success('续期成功！');
          this.renewalModal = false;
        } else {
          this.$message.error(res.message)
        }
      } finally{
        this.confirmLoading = false;
        this.handleCurrentChange(1)
      }
    },
    handleCancel() {
      this.renewalModal = false;
    },
    back() {
      this.$router.push("/app/merchant/list");
    },
    // - 操作记录
    async initOperateData() {
      this.loading = true
      let res = await fetch({
        method: 'post',
        url: `/api/main-data/StoreManageGetOptRecord`,
        data: {
          ...this.pageQuery,
          storeId: this.$route.params.id
        }
      })
      this.operateTable = res.recordInfoList
      this.total = res.total
      this.loading = false
    },
    handleCurrentChange(page) {
      this.pageQuery.pageNum = page
      this.initOperateData() 
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
.shop-detail-content {
  .common-scrollbar();
  padding: 40px 0 0 70px;
  overflow-y: auto;
  height: calc(100vh - 105px);
  display: flex;
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
      .imgs{
        width: 100px;
        height: 100px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
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
      padding: 20px 0 0 0;
      position: relative;
    }
    .system-info {
      padding: 20px 0 15px 0;
      position: relative;
    }
    .sale-info {
      padding: 20px 0 20px 70px;
      .normal-form-item();
    }
    .info-item {
      margin: 0 0 15px 0;
      .info-text {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
      }
    }
    .inside-operation {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .bottom-operation {
      margin: 40px 0;
    }
  }
}
.operate-table {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  padding: 0 10px;
}
.page-box {
  display: flex;
  height: 75px;
  justify-content: flex-end;
  align-items: center;
}
</style>
