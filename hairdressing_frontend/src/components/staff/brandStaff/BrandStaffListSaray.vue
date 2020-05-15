<template>
  <div v-loading='loading'>
    <div class="query-params">
      <el-form ref="form" class="query-form" :inline="true" :model="form" label-width="90px">
        <el-row>
          <el-form-item label="隶属门店：" prop="storeId" v-if='currentEntry == "brand"'>
            <el-select v-model="form.storeId" placeholder="全部" clearable>
              <el-option v-for='(item,key) in shopList' :key='key' :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择职务：" prop="levelId">
            <el-select v-model="form.levelId" placeholder="全部" clearable>
              <el-option v-for='(item,key) in staffList' :key='key' :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间：" prop="timeRange">
              <el-select v-model="form.timeRange" placeholder="全部" @change="changeRange" class="select-box">
                <el-option label="日报" :value="'1'"></el-option>
                <el-option label="月报" :value="'2'"></el-option>
                <el-option label="自定义" :value="'3'"></el-option>
              </el-select>
              <el-date-picker
                v-show="form.timeRange==='1'"
                class="time-box"
                v-model="dateTime"
                type="date"
                unlink-panels
                :picker-options="pickerOptions"
                placeholder="选择时间">
              </el-date-picker>
              <el-date-picker
                v-show="form.timeRange==='2'"
                class="time-box"
                v-model="dateTime"
                type="month"
                unlink-panels
                :picker-options="pickerOptions"
                placeholder="选择月份">
              </el-date-picker>
              <el-date-picker
                v-show="form.timeRange==='3'"
                class="time-box"
                v-model="dateTime"
                type="daterange"
                unlink-panels
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class='el_formInput' prop='laborPerformanceStart' label="劳动业绩：">
            <el-input v-model='form.laborPerformanceStart'></el-input> 至
            <el-input v-model='form.laborPerformanceEnd'></el-input> 元
          </el-form-item>
          <el-form-item class='el_formInput' prop='salesCardPerformanceStart' label="售卡业绩：">
            <el-input v-model='form.salesCardPerformanceStart'></el-input> 至
            <el-input v-model='form.salesCardPerformanceEnd'></el-input> 元
          </el-form-item>
          <el-form-item class='el_formInput' prop='productPerformanceStart' label="产品业绩：" >
            <el-input v-model='form.productPerformanceStart'></el-input> 至
            <el-input v-model='form.productPerformanceEnd'></el-input> 元
          </el-form-item>
          <el-form-item class='el_formInput' prop='specifiedStart' label="指定客数：">
            <el-input v-model='form.specifiedStart'></el-input> 至
            <el-input v-model='form.specifiedEnd'></el-input> 人
          </el-form-item>
        </el-row>
      </el-form>
      <div class="query">
        <div class="query-box">
          <button class="query-button" @click='getPerformanceSalary(1)'>查询</button>
          <span class="span" @click="clearForm">清空条件</span>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="user-defined-tab">
        <el-tabs v-model="activeName"  @tab-click="getPerformanceSalary()" type="card">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-con">
          <el-table class="el-table-re" :data="brandStaffLists" height='100%' stripe>
            <el-table-column width="180" label="员工">
              <template slot-scope="scope">
                <div class="client_area">
                  <div class="client_msg">
                    <div class="client_img">
                      <img
                        :src="utils.formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                      >
                      <img
                        class="sex_icon"
                        v-if="scope.row.isMale == '女'"
                        src="@/assets/img/female_tip.png"
                      >
                      <img
                        class="sex_icon"
                        v-else-if="scope.row.isMale == '男'"
                        src="@/assets/img/male_tip.png"
                      >
                    </div>
                    <div class="client_info">
                      <p>{{scope.row.staffName}}</p>
                      <p>{{scope.row.mobile}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="storeName" label="归属门店"></el-table-column>
            <el-table-column prop="levelName" width="110" label="职务身份"></el-table-column>
            <!-- <el-table-column prop="servicePrice" label="基础价格">
              <template slot-scope="scope" v-if='scope.row.servicePrice'>¥{{scope.row.servicePrice}}</template>
            </el-table-column> -->
            <el-table-column prop="specified" label="指定客数">
              <template slot-scope="scope">{{scope.row.specified || 0}}</template>
            </el-table-column>
            <el-table-column prop="laborPerformance" label="劳动业绩">
              <template slot-scope="scope">¥{{scope.row.laborPerformance || 0}}</template>
            </el-table-column>
            <el-table-column label="产品业绩">
              <template slot-scope="scope">{{scope.row.productSalesPerformance || 0}}</template>
            </el-table-column>
            <el-table-column label="售卡业绩">
              <template slot-scope="scope">¥{{scope.row.cardSalesPerformance || 0}}</template>
            </el-table-column>
            <el-table-column label="劳动提成">
              <template slot-scope="scope">¥{{scope.row.laborCommission || 0}}</template>
            </el-table-column>
            <el-table-column label="产品提成">
              <template slot-scope="scope">¥{{scope.row.productCommission || 0}}</template>
            </el-table-column>
            <el-table-column label="售卡提成">
              <template slot-scope="scope">¥{{scope.row.cardCommission || 0}}</template>
            </el-table-column>
            <el-table-column label="提成薪酬合计">
              <template slot-scope="scope">¥{{scope.row.totalCommission || 0}}</template>
            </el-table-column>
            <!-- <el-table-column label="在职">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.workStatus"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  @change="changeWorkStatus(scope.row)"
                ></el-switch>
              </template>
            </el-table-column> -->
            <el-table-column width="200" label="操作">
              <template slot-scope="scope">
                <g-button
                  :name="'明细'"
                  :type="'green'"
                  :icon="'icon_operate_eyes'"
                  @click="toStaffRecord(scope.row)"
                  class="btn-button"
                ></g-button>
                <!-- <g-button
                  :name="'报告'"
                  :type="'orange'"
                  :icon="'icon_operate_bill'"
                  @click="toDisable(scope.row)"
                  v-if="scope.row.actived"
                ></g-button> -->
                <!-- <g-button
                  :name="''"
                  type="cancel"
                  :icon="'icon_operate_delete'"
                  @click="delStaff([scope.row.staffId])"
                ></g-button> -->
              </template>
            </el-table-column>
          </el-table>
        <div class="saray-bottom">
          <el-row type="flex" justify="space-between" align="middle" class="oper_btns">
            <div>
              <g-button
                :name="'导出Excel'"
                type="mgreen"
                :icon="''"
                class="output-btn"
                @click='excel'
              ></g-button>
            </div>
            <el-pagination
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.pageSize"
            :page-count="5"
            layout="total, prev, pager, next, jumper"
            :total="pages.total"
          ></el-pagination>
            </el-row>
          </div>
        </div>
      </div>
      <div class="bottom-page"></div>
      <el-dialog :visible.sync="detailsDialog" :title='detailsTitle' width='800px'>
        <el-row class='detailsInfo'>
          <p>员工姓名：<span>{{detailsData.staffName}}</span></p>
          <p>职务：<span>{{detailsData.levelName}}</span></p>
          <p v-if='currentEntry == "brand"'>归属门店：<span>{{detailsData.storeName}}</span></p>
          <p v-show="form.timeRange==='1'" class='dataPicker'>选择日期：
            <el-date-picker
                class="time-box"
                v-model="detailsDateTime"
                type="date"
                unlink-panels
                :clearable='false'
                :picker-options="pickerOptions"
                @change='getStaffSalaryDetail'
                placeholder="选择时间">
              </el-date-picker>
            </p>
            <p v-show="form.timeRange==='2'" class='dataPicker'>选择月份：
              <el-date-picker
                class="time-box"
                v-model="detailsDateTime"
                :clearable='false'
                @change='getStaffSalaryDetail'
                type="month"
                unlink-panels
                :picker-options="pickerOptions"
                placeholder="选择月份">
              </el-date-picker>
            </p>
            <p v-show="form.timeRange==='3'">选择区间：
              <el-date-picker
                class="time-box"
                v-model="detailsDateTime"
                type="daterange"
                :clearable='false'
                @change='getStaffSalaryDetail'
                unlink-panels
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </p>
        </el-row>
        <el-row v-if='form.timeRange == 1'>
          <h3>劳动业绩</h3>
          <el-table class="el-table-re" :show-summary='true' :summary-method="servicePerformanceInfos" :data="staffDetail && staffDetail.servicePerformanceInfos" stripe max-height='400'>
            <el-table-column  label="服务项目">
              <template slot-scope="scope">
                <!-- <p>{{scope.row.serviceTime}}</p> -->
                <p>{{utils.formatDateTimeHM(scope.row.serviceTime)}}</p>
                <p>{{formatServiceName(scope.row.serviceName)}}</p>
              </template>
            </el-table-column>
            <el-table-column  label="业绩收入">
              <template slot-scope="scope">¥{{scope.row.income || 0}}</template>
            </el-table-column>
            <el-table-column  label="扣除成本">
              <template slot-scope="scope">
                <span class='costColor'>¥{{scope.row.cost || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="业绩提成">
              <template slot-scope="scope" >
                <span class='commissionColor'>¥{{scope.row.commission || 0}}</span>
              </template>
            </el-table-column>
          </el-table>

          <h3>售卡业绩 </h3>
          <el-table class="el-table-re" :show-summary='true' :summary-method="cardPerformanceInfos" :data="staffDetail && staffDetail.cardPerformanceInfos" max-height='400' stripe>
            <!-- 这里注释要处理 cardPerformanceInfos 统计方法的字段 -->
            <!-- <el-table-column  label="客户" prop='customerName'>
              <template slot-scope="scope">
                <p>{{scope.row.customerName}}</p>
                <p>{{scope.row.customerPhone}}</p>
              </template>
            </el-table-column> -->
            <el-table-column  label="卡项名称" prop='cardName'>
              <template slot-scope="scope">¥{{scope.row.cardName || 0}}</template>
            </el-table-column>
            <el-table-column  label="扣除成本" prop='cost'>
              <template slot-scope="scope">
                <span class='costColor'>¥{{scope.row.cost || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="业绩提成" prop='commission'>
              <template slot-scope="scope" >
                <span class='commissionColor'>¥{{scope.row.commission || 0}}</span>
              </template>
            </el-table-column>
          </el-table>
          <h3>产品业绩</h3>
          <el-table class="el-table-re" :show-summary='true' :summary-method="productPerformanceInfos" :data="staffDetail && staffDetail.productPerformanceInfos" max-height='400' stripe>
            <el-table-column  label="销售产品">
              <template slot-scope="scope">
                <p>{{scope.row.specificationName}}</p>
              </template>
            </el-table-column>
            <el-table-column  label="销售金额">
              <template slot-scope="scope">¥{{scope.row.salesPrice || 0}}</template>
            </el-table-column>
            <el-table-column  label="销售提成">
              <template slot-scope="scope" >
                <span class='commissionColor'>¥{{scope.row.commission || 0}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row v-else>
          <el-table class="el-table-re" :show-summary='true' :summary-method="performanceSalaryInfos" :data="staffDetail && staffDetail.performanceSalaryInfos" max-height='400' stripe>
            <el-table-column  label="日期">
              <template slot-scope="scope">
                <p>{{scope.row.occurDate}}</p>
              </template>
            </el-table-column>
            <!-- 指定客数 -->
            <el-table-column  label="服务客数">
              <template slot-scope="scope">{{scope.row.specified || 0}}</template>
            </el-table-column>
            <el-table-column  label="劳动业绩">
              <template slot-scope="scope" >
                <span>¥{{scope.row.laborPerformance || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="劳动提成">
              <template slot-scope="scope" >
                <span>¥{{scope.row.laborCommission || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="售卡业绩">
              <template slot-scope="scope" >
                <span>¥{{scope.row.cardSalesPerformance || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="售卡提成">
              <template slot-scope="scope" >
                <span>¥{{scope.row.cardCommission || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="产品业绩">
              <template slot-scope="scope" >
                <span>¥{{scope.row.productSalesPerformance || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="产品提成">
              <template slot-scope="scope" >
                <span>¥{{scope.row.productCommission || 0}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class='dialogExcel'>
          <g-button
                v-if='false'
                :name="'导出Excel'"
                type="mgreen"
                :icon="''"
                class="output-btn"
                @click='excel'
              ></g-button>
        </el-row>
      </el-dialog>
    </div>
</template>
<script>
// import "@/assets/css/brandtab.scss";
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
import { mapActions, mapState } from "vuex";
import "@/assets/css/tab.scss";
export default {
  props: {
    keyword: String
  },
  data() {
    return {
      form: {
        levelId: null,
        timeRange: "1",
        // commentRate: "",
        yearAndMonth: null,
        keyword: null,
        storeId: null,
        laborPerformanceStart: '0',
        laborPerformanceEnd: '10000000',
        occurDate: utils.formatDateTimeYYR(new Date()),
        occurDateEnd: null,
        productPerformanceEnd: '10000000',
        productPerformanceStart: '0',
        salesCardPerformanceEnd: '10000000',
        salesCardPerformanceStart: '0',
        specifiedEnd: '10000',
        specifiedStart: '0',
        brandId: null,
      },
      dateTime: utils.formatDateTimeYYR(new Date()),
      detailsDateTime: null,
      activeTab: "ALL",
      availableTabs: [
        { name: "全部", type: "ALL" },
        { name: "发型师", type: "FXS" },
        // { name: "助理", type: "ZL" }, // 暂时没用到？ 以后不能叫助理,
      ],
      brandStaffLists: [],
      //tab切换
      selectStatus: [
        { code: 'ACTIVE', value: "已启用" },
        { code: 'FORBIDDEN', value: "已禁用" },
        { code: 'DELETED', value: "已删除" }
      ],
      activeName: 'ACTIVE',
      pages: {
        currentPage: 1,
        pagesize: 10,
        totalCount: 0
      },
      utils: utils,
      staffList: [],
      loading: false,
      shopList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      detailsDialog: false,
      detailsData: {},
      staffDetail: null
    };
  },
  watch: {
    keyword(val) {
      this.form.keyword = val
      this.getPerformanceSalary(1)
    },
    dateTime(val) {
      if (val) {
        if (this.form.timeRange == 1) {
          this.form.occurDate = utils.formatDateTimeYYR(val);
        } else if (this.form.timeRange == 2){
          this.form.yearAndMonth = utils.formatDateTimeYYM(val);
        } else if (this.form.timeRange == 3){
          this.form.occurDate = utils.formatDateTimeYYR(val[0]);
          this.form.occurDateEnd = utils.formatDateTimeYYR(val[1]);
        }
      }
    }
  },
  mounted() {
    if (this.currentEntry == "shop") {
      this.form.storeId = this.currentInfo.shopId;
    } else {
      this.form.brandId = this.currentInfo.brandId;
    }
    this.init()
  },
  methods: {
    ...mapActions(["saveOperate", "saveCurrentInfo"]),
    init() {
      this.getAllSaftt();
      this.getshopList();
      this.getPerformanceSalary();
    },
    getPerformanceSalary(pageNum) {
      let params;
      let currentPage = this.pages.currentPage = pageNum ? pageNum : this.pages.currentPage
      let pageSize = this.pages.pagesize;
      params = {currentPage,pageSize,...this.form}
      if (this.activeName == 'ACTIVE') {
        params.actived = true
      } else if (this.activeName == 'FORBIDDEN') {
        params.actived = false
      } else if (this.activeName == 'DELETED') {
        params.deleted = true
      }
      this.loading = true;
      axios.post('/getPerformanceSalary',params).then(res => {
        this.loading = false;
        if (res.success) {
          this.brandStaffLists = res.performanceSalaryInfos;
          this.pages.total = res.total
        } else {
          utils.showTip(this, { msg: res.message, type: "error" });
        }
      }).catch(err => {
        this.loading = false
      })
    },
    getshopList() {
      axios.get('findShopList/'+this.currentInfo.brandId).then((res)=>{
        this.shopList = res.shopList
      })
    },
    // 职级选项
    getAllSaftt() {
      axios.get(`/getAllSimpleStoreStaffLevelList/${this.currentInfo.brandId}`).then(res => {
        this.staffList = res.levelList
      })
    },
    // 切换时间筛选范围， 清空时间值
    changeRange() {
      this.form.occurDate = '';
      this.form.occurDateEnd = '';
      this.form.yearAndMonth = '';
      if (this.form.timeRange == 3) {
        this.dateTime = [];
      } else {
        this.dateTime = '';
      }
    },
    // 列表的导出
    excel() {
      if (this.brandStaffLists.length > 0) {
        let params = {...this.form}
        if (this.activeName == 'ACTIVE') {
          params.actived = true
        } else if (this.activeName == 'FORBIDDEN') {
          params.actived = false
        } else if (this.activeName == 'DELETED') {
          params.deleted = true
        }
        axios.post('/exportPerformanceSalary',params).then(res => {
          if (res.success) {
            window.open(IMAGE_URL+'/'+res.fileKey)
          } else {
            utils.showTip(this, { msg: res.message, type: "error" });
          }
        })
      } else {
        utils.showTip(this, { msg: '当前查询条件没有数据可导出！', type: "error" });
      }
    },
    clearForm() {
      this.form = {
        levelId: null,
        timeRange: "1",
        yearAndMonth: null,
        keyword: null,
        storeId: null,
        laborPerformanceStart: '0',
        laborPerformanceEnd: '10000000',
        occurDate: utils.formatDateTimeYYR(new Date()),
        occurDateEnd: null,
        productPerformanceEnd: '10000000',
        productPerformanceStart: '0',
        salesCardPerformanceEnd: '10000000',
        salesCardPerformanceStart: '0',
        specifiedEnd: '10000',
        specifiedStart: '0',
        brandId: null,
      },
      this.dateTime =  utils.formatDateTimeYYR(new Date());
      if (this.currentEntry == "shop") {
        this.form.storeId = this.currentInfo.shopId;
      } else {
        this.form.brandId = this.currentInfo.brandId;
      }
      //this.form.occurDate =  utils.formatDateTimeYYR(new Date())
      this.getPerformanceSalary(1);
    },
    toStaffRecord(data) {
      console.log(data)
      this.detailsData = data;
      this.detailsDateTime = this.dateTime;
      this.getStaffSalaryDetail();
    },
    getStaffSalaryDetail() {
      let params = {
        staffId: this.detailsData.staffId,
        storeId: this.detailsData.storeId
      }
      if (this.form.timeRange == 1) {
        params.occurDate = utils.formatDateTimeYYR(this.detailsDateTime);
      } else if (this.form.timeRange == 2){
        params.yearAndMonth = utils.formatDateTimeYYM(this.detailsDateTime);
      } else if (this.form.timeRange == 3){
        params.occurDate = utils.formatDateTimeYYR(this.detailsDateTime[0]);
        params.occurDateEnd = utils.formatDateTimeYYR(this.detailsDateTime[1]);
      }
      axios.post('/getStaffSalaryDetail', params).then(res => {
        this.staffDetail = res;
        this.detailsDialog = true;
      })
    },
    toRecycle() {
      this.$router.push("/brand-inner/staff/staff-recycle");
    },
    handleCurrentChange(current) {
      this.getPerformanceSalary(current)
    },
    servicePerformanceInfos(param) {
      let sums = ['合计','￥'+this.staffDetail.serviceTotalIncome,'￥'+this.staffDetail.serviceTotalCost,'￥'+this.staffDetail.serviceTotalCommission]
      return sums;
    },
    cardPerformanceInfos() {
      // let sums = ['合计','','￥'+this.staffDetail.cardTotalCost,'￥'+this.staffDetail.cardTotalCommission]
      let sums = ['合计','','￥'+this.staffDetail.cardTotalCommission]
      return sums;
    },
    productPerformanceInfos() {
      let sums = ['合计','￥'+this.staffDetail.productTotalIncome,'￥'+this.staffDetail.productTotalCommission]
      return sums;
    },
    performanceSalaryInfos() {
      let sums = ['合计',this.staffDetail.totalSpecified,'￥'+this.staffDetail.totalLaborPerformance,'￥'+this.staffDetail.totalLaborCommission,'￥'+this.staffDetail.totalCardSalesPerformance,'￥'+this.staffDetail.totalCardSalesCommission,'￥'+this.staffDetail.totalProductSalesPerformance,'￥'+this.staffDetail.totalProductSalesCommission]
      return sums;
    },
    formatServiceName(name){
      let _name = name.replace("-","");
      return name.endsWith("-")?_name:name
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    detailsTitle() {
      let type = this.form.timeRange == '1' ? "日报" : this.form.timeRange == '2'? "月报":"区间"
      return "业绩与薪酬明细-" + type
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.list-box_table{
  min-height: calc(70vh - 137px);
}
.output-btn{
  width: 73px;
  height: 32px;
  border: 1px solid rgba(65, 202, 192, 1);
  margin-left: 30px;
}
.query-params {
  box-sizing: border-box;
  padding: 20px 5px 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  .select-box{
    width: 150px;
    height: 35px;
  }
  .time-box{
    margin-left: 10px;
  }
  .query-form {
    .el-form-item:nth-child(2) {
      // width: 70%;
      margin-bottom: 10px;
      .select-box:nth-child(2){
        margin-left: 10px;
      }
    }
    .el-form-item {
      // width: 240px;
      margin-bottom: 10px;
      margin-right: 0;
      // margin-left: 10px;
      /deep/ .el-input{
        width: 150px
      }
    }
    .el_formInput{
      /deep/ .el-input{
        width: 55px;
        /deep/ .el-input__inner{
          text-align: center;
          padding: 0 5px;
        }
      }
    }
  }
  .query {
    flex: 0 0 207px;
    border-left: 1px solid #f0f1f4;
    position: relative;
    .query-box {
      position: absolute;
      bottom: 0;
      left: 25px;
      .query-button {
        background: #58c9f3;
        width: 72px;
        height: 34px;
        color: #fff;
        border-radius: 5px;
        font-size: 14px;
        transition: all 0.6s;
        &:hover {
          opacity: 0.8;
        }
      }
      .span {
        color: #58c9f3;
        width: 72px;
        height: 34px;
        font-size: 14px;
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }
}
.table {
  margin: 18px 0 2px 0;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 8px;
  height: calc(100vh - 300px);
  .client_area {
    display: flex;
    .client_msg {
      display: flex;
      align-items: center;
      .client_img {
        margin-left: 5px;
        margin-right: 15px;
        position: relative;
      }
      .client_info {
        p {
          text-align: left;
        }
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .sex_icon {
        position: absolute;
        width: 14px;
        height: 14px;
        left: 22px;
        top: 0;
      }
      span {
        display: inline-block;
        margin-left: 5px;
      }
    }
  }
  .table-con {
    box-sizing: border-box;
    padding: 0 10px;
    background: #fff;
    border-radius: 8px;
    height: calc(100% - 108px);
    .saray-bottom {
      box-sizing: border-box;
      padding: 20px 0;
      .oper_btns {
        box-sizing: border-box;
        margin-bottom: 10px;
      }
      .pagination {
        width: 100%;
        box-sizing: border-box;
        padding-right: 15px;
      }
    }
  }
}
/deep/ .el-dialog{
  /deep/ .el-dialog__header{
    border-bottom: 1px solid #F0F1F4;
  }
  /deep/ .el-dialog__body{
    padding: 20px 30px;
  }
  h3{
    font-weight: bold;
    margin-top: 15px;
  }
  .detailsInfo{
    display: flex;
    flex-wrap: wrap;
    p{
      color: #999;
      font-size: 14px;
      margin-right: 40px;
      margin-bottom: 20px;
      span{
        color: #333;
      }
    }
    .dataPicker{
      transform: translateY(-10px);
      margin-bottom: 0;
      margin-right: 0;
    }
  }
  .dialogExcel{
    margin-top: 15px;
  }
  .costColor{
    color: #999;
  }
  .commissionColor{
    color: #F52D56;
  }
  /deep/ .el-table__body{
    width: 100%!important;
  }
  /deep/ .el-table .el-table__footer-wrapper th.gutter, /deep/ .el-table .el-table__footer-wrapper td.gutter{
    background: #f5f7fa;
  }
  // /deep/ .el-table .el-table__footer-wrapper td .cell{
  //   padding-left: 5px;
  // }
  /deep/ .el-table .el-table__header th.gutter{
    border-bottom: 1px solid #ebeef5;
  }

}
</style>
