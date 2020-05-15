<template>
  <div v-loading='loading'>
    <div class="query-params">
      <el-form ref="form" class="query-form" :model="form" label-width="90px">
        <!-- currentEntry == "brand" -->
        <el-form-item label="隶属门店：" prop="storeId" v-if='false'>
          <el-select v-model="form.storeId" placeholder="全部">
            <el-option v-for='(item,key) in shopList' :key='key' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择职务：" prop="levelId">
          <el-select v-model="form.levelId" placeholder="全部" clearable>
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间：" prop="timeRange" style='width: 650px;'>
          <el-row type='flex'>
            <el-select v-model="form.timeRange" :popper-append-to-body="false" @change='changeRange' placeholder="全部" class="select-box">
              <el-option v-for="item in dateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          </el-row>
        </el-form-item>
      </el-form>
      <div class="query">
        <div class="query-box">
          <button class="query-button" @click='getSalaryRanking(1)'>查询</button>
          <span class="span" @click="clearForm">清空条件</span>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="table-con">
          <el-table class="el-table-re" :data="brandStaffLists" stripe @sort-change='chageSort' height='100%'>
            <el-table-column label="排名" width='80'>
              <template slot-scope="scope">
                <div class="check_single">
                  <img :src="scope.row.dailyRanking==1?No1:scope.row.dailyRanking==2?No2:scope.row.dailyRanking==3?No3:''" v-if="scope.row.dailyRanking<=3"  alt="" />
                  <span v-else>{{scope.row.dailyRanking}}</span>
                </div>
              </template>
            </el-table-column>
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
            <el-table-column prop="storeName" width="110" label="归属门店"></el-table-column>
            <el-table-column prop="specified" sortable='custom' label="指定客数"></el-table-column>
            <el-table-column prop="laborPerformance" sortable='custom' label="劳动业绩">
              <template slot-scope="scope">¥{{scope.row.laborPerformance || 0}}</template>         
            </el-table-column>
            <el-table-column prop="productSalesPerformance" sortable='custom' label="产品业绩">
              <template slot-scope="scope">¥{{scope.row.productSalesPerformance || 0}}</template>
            </el-table-column>
            <el-table-column prop="cardSalesPerformance" sortable='custom' label="售卡业绩">
              <template slot-scope="scope">¥{{scope.row.cardSalesPerformance || 0}}</template>
            </el-table-column>
            <el-table-column prop="laborCommission" label="劳动提成">
              <template slot-scope="scope">¥{{scope.row.laborCommission || 0}}</template>
            </el-table-column>
            <el-table-column prop="productCommission" label="产品提成">
              <template slot-scope="scope">¥{{scope.row.productCommission || 0}}</template>
            </el-table-column>
            <el-table-column prop="cardCommission" label="售卡提成">
              <template slot-scope="scope">¥{{scope.row.cardCommission || 0}}</template>
            </el-table-column>
            <el-table-column prop="totalCommission" label="提成薪酬合计">
              <template slot-scope="scope">¥{{scope.row.totalCommission || 0}}</template>
            </el-table-column>
          </el-table>
        <div class="rank-bottom">
          <el-pagination
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.pageSize"
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :total="pages.total"
          ></el-pagination>
        </div>
      </div>
      <!-- <div class="bottom-page"></div> -->
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
import { mapActions,mapState } from "vuex";
export default {
  props: {
    keyword: String
  },
  data() {
    return {
      form: {
        levelId: '',
        timeRange: "1",
        yearAndMonth: '',
        occurDate: utils.formatDateTimeYYR(new Date()),
        occurDateEnd: '',
        keyword: '',
        direct: 'DESC',
        orderByColumn:'',
        storeId: '',
        brandId: ''
      },
      brandStaffLists: [],
      pages: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      },
      utils: utils,
      dateList: [
        {
          label: '日报',
          value: '1'
        },
        {
          label: '月报',
          value: '2'
        },
        {
          label: '自定义',
          value: '3'
        }
      ],
      dateTime: utils.formatDateTimeYYR(new Date()),
      staffList: [],
      shopList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      No1: require('@/assets/images/NO/icon_staff_01.png'),
      No2: require('@/assets/images/NO/icon_staff_02.png'),
      No3: require('@/assets/images/NO/icon_staff_03.png'),
      loading: false
    };
  },
  watch: {
    keyword(val) {
      this.form.keyword = val
      this.getSalaryRanking(1);
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
    this.init();
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  methods: {
    ...mapActions(["saveOperate", "saveCurrentInfo"]),
    init() {
      this.getAllSaftt();
      this.getshopList();
      this.getSalaryRanking();
    },
    // 职级选项
    getAllSaftt() {
      axios.get(`/getAllSimpleStoreStaffLevelList/${this.currentInfo.brandId}`).then(res => {
        this.staffList = res.levelList
      })
    },
    getshopList() {
      axios.get('findShopList/'+this.currentInfo.brandId).then((res)=>{
        this.shopList = res.shopList
      })
    },
    getSalaryRanking(pageNum) {
      let params;
      let currentPage = this.pages.currentPage = pageNum ? pageNum : this.pages.currentPage
      let pageSize = this.pages.pagesize;
      params = {currentPage,pageSize,...this.form}
      this.loading = true
      axios.post('/getSalaryRanking',params).then(res => {
        this.loading = false
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
    chageSort({ column, prop, order }) {
      this.form.orderByColumn = prop
      this.form.direct = order == 'descending' ? 'DESC' : 'ASC'
      this.getSalaryRanking(1);
    },
    clearForm() {
      this.$refs.form.resetFields();
      this.form = {
        levelId: '',
        timeRange: "1",
        yearAndMonth: '',
        occurDate: utils.formatDateTimeYYR(new Date()),
        occurDateEnd: '',
        keyword: '',
        direct: 'DESC',
        orderByColumn:'',
        storeId: '',
        brandId: ''
      }
      this.dateTime =  utils.formatDateTimeYYR(new Date());
      if (this.currentEntry == "shop") {
        this.form.storeId = this.currentInfo.shopId;
      } else {
        this.form.brandId = this.currentInfo.brandId;
      }
      this.getSalaryRanking(1);
    },
    handleCurrentChange(current) {
      this.getSalaryRanking(current);
    }
  }
};
</script>
<style lang="scss" scoped>
.list-box_table{
  min-height: calc(70vh - 36px);
}
.query-params {
  box-sizing: border-box;
  padding: 20px 5px 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  .query-form {
    display: flex;
    flex-wrap: wrap;
      .select-box{
      width: 150px;
      margin-right: 20px;
    }
    .el-form-item:nth-child(2) {
      margin-bottom: 10px;
      .select-box:nth-child(2){
        margin-left: 10px;
      }
    }
    .el-form-item {
      width: 240px;
      margin-bottom: 10px;
    }
  }
  .query {
    flex: 0 0 240px;
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
  margin-top: 18px;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  margin-bottom: 2px;
  border-radius: 8px;
  height: calc(100vh - 250px);
  background: #fff;
  .check_single {
      margin: 0 5px;
      img{
        width: 16px;
        height: 20px;
      }
    }
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
    border-radius: 8px;
    height: calc(100% - 75px);
    .rank-bottom {
      box-sizing: border-box;
      padding: 20px 0;
      .oper_btns {
        box-sizing: border-box;
        margin-bottom: 10px;
      }
      .pagination {
        box-sizing: border-box;
        padding-right: 15px;
      }
    }
  }
}
</style>
