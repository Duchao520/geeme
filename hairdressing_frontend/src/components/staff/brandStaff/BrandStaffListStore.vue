<template>
  <div id="brand_staff_list">
    <!-- 左侧筛选 -->
      <div class="condition_left">
        <el-form
          class="query-condition"
          ref="storeForm"
          :model="queryParam"
          label-width="100px"
        >
          <el-form-item label="归属门店：" prop="store">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.store">
              <el-option
                v-for="(item,index) in belongShops"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日月份：" prop="birthMonth">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.birthMonth">
              <el-option
                v-for="(month,index) in [null,1,2,3,4,5,6,7,8,9,10,11,12]"
                :key="index"
                :label="month===null?'全部':month+'月'"
                :value="month"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="职务身份：" prop="level">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.level">
              <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in characterList"
                      :key="item.id"
                    ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基础价格：" prop="price">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.price">
              <el-option
                v-for="(price,index) in priceData"
                :key="index"
                :label="price.label"
                :value="price.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工性别：" prop="gender">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.gender">
              <el-option label="全部" :value='null'></el-option>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
              <el-option label="保密" value="保密"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="入职时间：" prop="entryTime">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.entryTime">
              <el-option
                v-for="(item,index) in entryData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价数量：" prop="evaluation">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.evaluation">
              <el-option :label="item.label" v-for="item in evaluationData" :value="item.value"  :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价得分：" prop="score">
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.score" >
              <el-option :label="item.label" v-for="item in scoreData" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>    
        </el-form>
        <div class="query">
          <div class="query-box">
            <el-button class="query-button" @click="searchStaff()">查询</el-button>
            <span class="query-span" @click="clearForm">清空条件</span>
          </div>
        </div>
      </div>
    <!-- 列表数据 -->

    <div class="user-defined-tab container_normal">
      
      <div class="staff_list_container">
        <el-tabs v-model="activeName" @tab-click="getStaffList()" type="card">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <el-row  type="flex" v-if="noData&&tableData.length===0"  justify="center" align="middle" class="table-con default" >
        <search-default style="margin:10% 0" @clear-back="clearBack"></search-default>
      </el-row>
     <div class="list-box_table-staff" v-else>
        <el-table  v-loading="tableLoading" :data="tableData" height="calc(100vh - 400px)" stripe>
          <el-table-column align="left" min-width="130" label="员工">
            <!-- <template slot="header" slot-scope="scope">
              <span style="padding-left:5px;">员工</span>
            </template> -->
            <template slot-scope="scope">
              <div class="client_area">
                <div class="client_msg">
                  <div class="client_img">
                    <img
                      :src="formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                    >
                    <img class="sex_icon" v-if="scope.row.sex == '女'" src="@/assets/img/female_tip.png">
                    <img
                      class="sex_icon"
                      v-else-if="scope.row.sex == '男'"
                      src="@/assets/img/male_tip.png"
                    >
                  </div>
                  <div class="client_info">
                    <p>{{scope.row.userName||'佚名'}}</p>
                    <el-tooltip class="item" effect="dark" :content="'员工编码：'+scope.row.serialNo" placement="top-start">
                      <span class="text-overflow">{{scope.row.serialNo}}</span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" align="left" label="手机号"></el-table-column>
          <el-table-column prop="birthday" align="left" label="生日"></el-table-column>
          <el-table-column prop="entryDate" align="left" label="入职时间"></el-table-column>
          <el-table-column  align="left" label="隶属门店">
            <template slot-scope="scope">
              {{scope.row.city+` `+scope.row.storeName}}
            </template>
          </el-table-column>
          <el-table-column prop="levelName" align="left" label="职务身份"></el-table-column>
          <el-table-column align="center" label="基础服务价格">
            <template slot-scope="scope">
              <span class="red-text" v-if='scope.row.jobType != "非服务者"'>¥{{scope.row.baseServicePrice || 0}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评价数">
            <template slot-scope="scope">
              <span v-if='scope.row.jobType != "非服务者"'>{{scope.row.assistantCount || 0}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评价得分">
            <template slot-scope="scope">
              <span v-if='scope.row.jobType != "非服务者"'>{{scope.row.assistantScore || 0}}</span>
              <span v-else>-</span>
             </template>
          </el-table-column>
          <el-table-column align="center" label="启用" v-if="activeName==='ACTIVE'||activeName==='FORBIDDEN'">
            <template slot-scope="scope">
              {{scope.row.workStatus?'已启用':'已禁用'}}
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="操作">
            <template slot-scope="scope">
              <div class='text-cant-copy'>
                <g-button
                  :name="'档案'"
                  :type="'green'"
                  :icon="'icon_operate_file'"
                  @click="toStaffRecord(scope.row)"
                  v-show="checkHasBtnPermission(`/${currentEntry}-inner/staffRecord`,'path')"
                ></g-button>
              </div>
            </template>
          </el-table-column>
      </el-table>
     </div>
      
      <!-- 按钮以及全选 -->
      <!-- 分页 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.currentPage"
          :page-size="pages.pageSize"
          :page-count="5"
          layout="total, prev, pager, next, jumper"
          :total="pages.totalCount"
        ></el-pagination>
    </div>
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import * as axios from '@/util/axios'
import util from "@/util/base.js";
import "@/assets/css/tab.scss";
import { mapState, mapActions } from "vuex";
import Bus from '@/util/bus'
export default {
  name: "GmStaffList",
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      queryParam: {
        store: -1,
        birthMonth: null,
        level: null,
        price: null,
        rate: "",
        amount: "",
        cardAmount: "",
        goodAmount: "",
        count: "",
        goodCount: "",
        entryTime: 'ALL',
        score:null,
        gender:null,
        evaluation: null
      },
      //tab切换
      selectStatus: [
        { code: 'ACTIVE', value: "已启用" },
        { code: 'FORBIDDEN', value: "已禁用" },
        { code: 'DELETED', value: "已删除" }
      ],
      activeName: 'ACTIVE',
      // 全选
      checkAllFlag: false,
      checkArr: [],
      isCheckedAll: false,
      CheckedAllArr: [],
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 10, // 每页的条数
        pageNum: 10, // 默认显示页面的下标数量
      },
      tableData: [],
      tableLoading: false,
      priceData: [
        {
          value: null,
          label: '全部'
        },
        {
          value:50,
          label: '50元以内'
        },
        {
          value: 100,
          label: '50-100元'
        },
        {
          value: 200,
          label: '100-200元'
        },
        {
          value: 500,
          label: '200-500元'
        },
        {
          value: 999999,
          label: '500元以上'
        },
      ],
      scoreData: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 3,
          label: '3分以内'
        },
        {
          value: 4,
          label: '3-4分'
        },
        {
          value: 5,
          label: '4-5分'
        },
      ],
      evaluationData: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 100,
          label: '100以内'
        },
        {
          value: 200,
          label: '100-200'
        },
        {
          value: 500,
          label: '200-500'
        },
        {
          value: 1000,
          label: '500-1000'
        },
        {
          value: 999999,
          label: '1000以上'
        }
      ],
      entryData: [
        {
          label: '全部',
          value: 'ALL'
        },
        {
          label: '三月以内',
          value: 'IN_3_MONTH'
        },
        {
          label: '半年以内',
          value: 'IN_6_MONTH'
        },
         {
          label: '1年以内',
          value: 'IN_12_MONTH'
        },
        {
          label: '1-3年',
          value: 'ONE_THREE_YEAR'
        },
        {
          label: '3-5年',
          value: 'THREE_FIVE_YEAR'
        },
        {
          label: '5年以上',
          value: 'MORE_THAN_FIVE_YEAR'
        }
      ],
      characterList: [],
      belongShops: []
    };
  },
  props: {
    noData: Boolean,
    keyword: String
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    baseServicePrice() {
      let data = this.queryParam.price
      let obj = {}
      switch (data) {
        case 50:
          obj.from = 0
          break;
        case 100:
          obj.from = 50
          break;
        case 200:
          obj.from = 100
          break;
        case 500:
          obj.from = 200
          break;
        case 999999:
          obj.from = 500
          break;
      }
      if(data){
        obj.to = data
      } else {
        obj = null
      }
      return obj
    },
    assessmentScore() {
      let data = this.queryParam.score
      let obj = {}
      switch (data) {
        case 3:
          obj.from = 0
          break;
        case 4:
          obj.from = 3
          break;
        case 5:
          obj.from = 4
          break;
      }
      if(data){
        obj.to = data
      } else {
        obj = null
      }
      return obj
    },
    assessmentCount() {
      let data = this.queryParam.evaluation
      let obj = {}
      switch (data) {
        case 100:
          obj.from = 0
          break;
        case 200:
          obj.from = 100
           break;
        case 500:
          obj.from = 200
           break;
        case 1000:
          obj.from = 500
           break;
        case 999999:
          obj.from = 1000
          break;
      }
      if(data){
        obj.to = data
      } else {
        obj = null
      }
      return obj
    },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  created() {
    this.$nextTick(() => {
      axios.get(
        `${SERVICE_URL}/service-api/findShopList/`+this.currentInfo.brandId
      ).then(res => {
        this.getShopList(res)
      })
      axios.get(
        `${SERVICE_URL}/service-api/getAllSimpleStoreStaffLevelList/` + this.currentInfo.brandId
      ).then(res => {
        let data = {name:'全部',id: null}
        this.characterList = res.levelList;
        this.characterList.unshift(data)
      })
    })
    Bus.$emit('getStorePath','store')
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('isNoData',false)
      this.init();
    })
    this.$root.$on('needRefreshPage', data => {
      this.getStaffs()
    })
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    init() {
      this.getStaffs();
    },
    /**获取归属门店回调 */
    getShopList(res) {
      this.belongShops = [...res.shopList]
      let item = {}
      item.name='全部'
      item.id = -1
      this.belongShops.unshift(item)
    },
    // 获取员工总列表
    getStaffs() {      
      this.tableLoading = true
      // status是否是获取删除的信息，false为全部信息
      let form  = this.queryParam
      let params = {
        assessmentCount: this.assessmentCount,
        assessmentScore: this.assessmentScore,
        baseServicePrice: this.baseServicePrice,
        birthdayMonth: form.birthMonth,
        currentPage: this.pages.currentPage-1,
        entryDate: form.entryTime,
        keyword: this.keyword,
        level: form.level,
        pageSize: this.pages.pageSize,
        sex: form.gender,
        storeId: form.store,
        tabCondition: this.activeName,
        brandId: this.currentInfo.brandId,
      };
      // 获取员工总列表
      axios.post(`${SERVICE_URL}/service-api/getStaffInfoList`, params).then(res => {
        this.getStaffInfoListRes(res)
      })
    },
    // 处理员工总列表
    getStaffInfoListRes(res) {
      // console.log(res, '数据')
      // 赋值
      this.tableLoading = false
      this.tableData = res.dataList;
      // 总页数
      this.pages.totalCount = res.total;
    },
    // 查看档案
    toStaffRecord(data) {
      if (!!data) {
        // this.saveCurrentInfo({
        //   staffId: data.staffId,
        //   userId: data.userId,
        //   jobType: data.jobType,
        //   isBrand: true,
        //   isHead: false,
        // });
        // this.$router.push("/brand-inner/staffRecord");
        this.toPagesInNewTags(`/brand-inner/staffRecord/${data.staffId}/${data.userId}/${data.jobType == '服务者' ? 1 : 0}`)        
      }
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 赋值
      this.pages.currentPage = val;
      // 判断是否可调接口
      if (val > this.pages.totalCount || val <= 0) return;
      this.getStaffs();
      console.log(`当前页: ${val}`);
    },
    clearForm() {
      // console.log(this.$refs.storeForm)
      this.$refs.storeForm.resetFields();
      this.getStaffs()
    },
    clearBack() {
      this.clearForm()
      this.$emit('clearNoData')
      setTimeout(() => {
        this.getStaffs()
      },200)
    },
    // 查询员工列表
    searchStaff() {
      this.$emit('isNoData',true)
      this.getStaffs()
    },
    // 恢复已删除的员工
    getStaffList() {
      this.clearForm()
      this.getStaffs()
    }
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage")
  },
};
</script>

<style lang="scss" scoped>
.list-box_table{
  //min-height: calc(70vh - 98px);
}
.text-overflow{
  width:85%;
}
.table-con{
  width: 100%;
  height: calc(100vh - 298px);
}
#brand_staff_list {
  width: 100%;
  box-sizing: border-box;
  .condition_left {
      display: flex;
      background: #fff;
      padding: 10px 0 10px 5px;
      border-radius: 4px;
      box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
      .query-condition {
        flex: auto;
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 240px;
          margin: 7px 0;
        }
      }
      .query {
        flex: 0 0 207px;
        border-left: 1px solid #f0f1f4;
        position: relative;
        .query-box {
          display: flex;
          position: absolute;
          align-items: center;
          bottom: 2px;
          left: 25px;
          .query-button {
            width: 71px;
            height: 35px;
            border: none;
            line-height: 35px;
            color: white;
            background: #58c9f3;
            padding: 0;
            transition: all 0.6s;
            &:hover {
              background: #58ff;
            }
          }
          .query-span {
            color: #999999;
            font-size: 14px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  .client_area {
    // display: flex;
    width: auto;
    min-width: 150px;
    .check_single {
      margin: 0 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .client_msg {
      display: flex;
      align-items: center;
      .client_img {
        margin-left: 5px;
        margin-right: 15px;
        position: relative;
      }
      .client_info {
        flex:1;
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
  .checkbox_area {
    margin: 20px;
  }
  .pagination {
    margin-top: 15px;
  }
  .container_normal {
    height: calc(100vh - 300px);
    border-radius:8px;
  }
}
.red-text{
  color: rgba(255, 109, 97, 1);
}
</style>
