<template>
  <div id="gm_staff_list">
    <div class="top-line">
      <el-button class="normal_pink_btn normal_red_btn" v-show="checkHasBtnPermission(`/${currentEntry}-inner/staff-add`,'path')" size='medium' @click="toStaffAdd">新增员工</el-button>
      <input-search width="275px" height="100px" @search="search" v-model="keyword" placeholder="请输入员工姓名/手机号/员工编号"></input-search>
    </div>
    <div class="staff_list_condition list_condition">
      <!-- 左侧筛选 -->
      <div class="condition_left">
        <el-form
          class="query-condition"
          ref="form"
          :model="queryParam"
          label-width="100px"
        >
          <el-form-item label="生日月份：" prop="birthMonth" >
            <el-select :popper-append-to-body="false" v-model="queryParam.birthMonth">
              <el-option
                v-for="(month,index) in [null,1,2,3,4,5,6,7,8,9,10,11,12]"
                :key="index"
                :label="month===null?'全部':month+'月'"
                :value="month"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职务身份：" prop="level">
            <el-select :popper-append-to-body="false" v-model="queryParam.level">
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in characterList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基础价格：" prop="price">
            <el-select :popper-append-to-body="false" v-model="queryParam.price">
              <el-option
                v-for="(price,index) in priceData"
                :key="index"
                :label="price.label"
                :value="price.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工性别：" prop="gender">
            <el-select :popper-append-to-body="false" v-model="queryParam.gender">
              <el-option label="全部" :value='null'></el-option>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
              <el-option label="保密" value="保密"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职时间：" prop="entryTime" >
            <el-select :popper-append-to-body="false" v-model="queryParam.entryTime">
              <el-option
                v-for="(item,index) in entryData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价数量：" prop="evaluation"  >
            <el-select :popper-append-to-body="false" v-model="queryParam.evaluation">
              <el-option :label="item.label" v-for="item in evaluationData" :value="item.value"  :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价得分：" prop="score">
            <el-select :popper-append-to-body="false" v-model="queryParam.score" >
              <el-option :label="item.label" v-for="item in scoreData" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>    
        </el-form>
        <div class="query">
          <div class="query-box">
            <el-button class="normal_blue_btn" size='medium' @click="searchStaff()">查询</el-button>
            <span class="query-span" @click="clearForm">清空条件</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表数据 -->
    <div class="user-defined-tab container_normal">
      
      <div class="staff_list_container">
        <el-tabs v-model="activeName"  @tab-click="getStaffList()" type="card">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <el-row  type="flex" justify="center" align="middle" class="table-con default" v-if="noData&&tableData.length===0">
        <search-default style="margin:10% 0" @clear-back="clearBack"></search-default>
      </el-row>
      <el-checkbox-group v-else v-model="checkArr" @change="handleChecked" class="list-box_table-staff">
        <el-table class="el-table-re"  v-loading="tableLoading" :data="tableData" height="calc(100vh - 400px)" stripe>
          <el-table-column align="left" show-overflow-tooltip  min-width="130">
            <template slot="header" slot-scope="scope">
              <span v-if="activeName==='FORBIDDEN'||activeName==='DELETED'"  style="padding-left:28px;">员工</span>
              <span v-else style="padding-left:5px;">员工</span>
            </template>
            <template slot-scope="scope">
              <div class="client_area">
                <el-checkbox
                  :key="scope.row.staffId"
                  :label="scope.row.staffId"
                  class="check_single"
                  v-if="(activeName==='FORBIDDEN'||activeName==='DELETED') && checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)" 
                ></el-checkbox>
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
                    <p>{{scope.row.userName||'未知'}}</p>
                    <!-- <el-tooltip class="item" effect="dark" :content="'员工编码：'+scope.row.serialNo" placement="top-start">
                      
                    </el-tooltip> -->
                    <span class="text-overflow">{{scope.row.serialNo}}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!--
                  <el-table-column
                    prop="userNo"
                    align='center'
                    label="系统账号">
          </el-table-column>-->
          <el-table-column prop="mobile" align="left" label="手机号"></el-table-column>
          <el-table-column prop="birthday" align="left" label="生日"></el-table-column>
          <el-table-column prop="entryDate" align="left" label="入职时间"></el-table-column>
          <!-- <el-table-column prop="storeName" align="left" label="隶属门店"></el-table-column> -->
          <el-table-column prop="levelName" align="left" label="职务身份"></el-table-column>
          <!-- 权限、职务级别暂时不做
                  <el-table-column
                    prop="limits"
                    align='center'
                    label="权限">
                  </el-table-column>
                  <el-table-column
                    prop="level"
                    align='center'
                    label="职务级别">
          </el-table-column>-->
          <!-- <el-table-column align="center" label="本月指定客数">
            <template slot-scope="scope">{{scope.row.assignCount || 0}}</template>
          </el-table-column>
          <el-table-column align="center" label="本月劳动业绩">
            <template slot-scope="scope">¥{{scope.row.servicePerformance || 0}}</template>
          </el-table-column>
          <el-table-column align="center" label="本月产品业绩">
            <template slot-scope="scope">¥{{scope.row.goodsPerformance || 0}}</template>
          </el-table-column>
          <el-table-column align="center" label="本月售卡业绩">
            <template slot-scope="scope">¥{{scope.row.cardPerformance || 0}}</template>
          </el-table-column> -->
          <el-table-column align="center" label="基础服务价格">
            <template slot-scope="scope">
              <span class="red-text" v-if='scope.row.jobType != "非服务者"'>¥{{scope.row.baseServicePrice || 0}}</span>
              <span class="red-text" v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评价数">
            <template slot-scope="scope">
              <span  v-if='scope.row.jobType != "非服务者"'>{{scope.row.assistantCount || 0}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评价得分">
            <template slot-scope="scope">
              <span v-if='scope.row.jobType != "非服务者"'>{{scope.row.assistantScore || 0}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="启用" v-if="(activeName==='ACTIVE'||activeName==='FORBIDDEN') && checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)">
            <template slot-scope="scope">
              <switch-button @click="changeWorkStatus(scope.row,scope.$index)" v-model="scope.row.workStatus" inactiveColor='#ccc' activeColor="#13ce66" :active="scope.row.workStatus"></switch-button>
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
              <g-button
                :name="''"
                type="cancel"
                :icon="'icon_operate_delete'"
                @click="delStaff([scope.row.staffId])"
                v-if="activeName==='FORBIDDEN'"
                v-show="checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)"
              ></g-button>
              <g-button
                :name="'恢复'"
                :type="'green'"
                :icon="'icon_operate_recover'"
                @click="recStaff([scope.row.staffId])"
                v-if="activeName==='DELETED'"
                v-show="checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)"
              ></g-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
      <!-- 按钮以及全选 -->
      <el-row justify="space-between" align="middle" type="flex" class="oper_btns">
        <div class="patch-style" v-show="checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)">
          <el-checkbox v-if="activeName==='FORBIDDEN'||activeName==='DELETED'" class="all_check" v-model="checkAllFlag" @change="checkAll">全选</el-checkbox>
          <g-button
            :name="'删除'"
            type="cancel"
            :icon="'icon_operate_delete'"
            @click="delStaff(checkArr)"
            v-if="activeName==='FORBIDDEN'"
          ></g-button>
          <g-button :name="'恢复'" :type="'greenFill'" :icon="'icon_operate_recover'" v-if="activeName==='DELETED'" @click="recStaff(checkArr)"></g-button>
        </div>
        <div class="right-pagination-box">
          <!-- 分页 -->
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.pageSize"
            :page-count="10"
            layout="total, prev, pager, next, jumper"
            :total="pages.totalCount"
          ></el-pagination>
        </div>
      </el-row>
    </div>
    <g-del-model
        :delTagDialogVisible="showDialog"
        @close="showDialog=false"
        @confirm="closeDialog"
        :title="dialogParams.title"
        :content="dialogParams.txt"
        :icon="'icon_popup_question'"
        :iconColor="'#FF6D61'"
      ></g-del-model>
    <g-del-model
      :delTagDialogVisible="delTagDialogVisible"
      @close="delTagDialogVisible=false"
      @confirm="editOrder"
      :title="infoData.title"
      :content="infoData.txt"
      :icon="infoData.icon"
      :iconColor="infoData.iconColor"
      :confirmButton="infoData.btn"
    >
    </g-del-model>
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import util from "@/util/base.js";
import "@/assets/css/tab.scss";
import { mapActions } from "vuex";
import * as axios from '@/util/axios'
import { error } from 'util';
export default {
  name: "GmStaffList",
  data() {
    let validator = [
      { message: "", trigger: "change" },
      { message: "", trigger: "blur" }
    ];
    let validatorNumber = (rule, value, callback) => {
      callback();
    };
    let validatorNum = [
      { validator: validatorNumber, trigger: "change" },
      { validator: validatorNum, trigger: "blur" }
    ];
    return {
      nopersonlist: datas.defaultImg.nopersonlist,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      dialogParams: {
        name: "", // 弹出层的名称
        title: "", // 弹出层的标题
        txt: ""
      },
      queryParam: {
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
      formRules: {
        birthMonth: validatorNum,
        level: validatorNum,
        price: validatorNum,
        rate: validator,
        amount: validator,
        cardAmount: validator,
        goodAmount: validator,
        count: validator,
        goodCount: validator
      },
      showDialog: false, // 弹窗的显示
      //tab切换
      selectStatus: [
        { code: 'ACTIVE', value: "已启用" },
        { code: 'FORBIDDEN', value: "已禁用" },
        { code: 'DELETED', value: "已删除" }
      ],
      keyword: '',
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
        delList: null, // 要删除的服务项目列表
        disStaffId: "", // 禁用的员工id
        disStatus: null // 禁用状态
      },
      tableData: [],
      tableLoading: false,
      delTagDialogVisible:false,
      changeWorkStatusInfo:{},
      departureDialog: false,
      infoData: {
        title: '',
        txt:'',
        icon: 'icon_popup_question',
        iconColor: 'warning',
        btn: ''
      },
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
      noData: false,
      isUsing: false,
      idIndex: null,
      currentEntry: this.$store.state.authRouter.currentEntry,
    };
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
    }
  },
  created() {
    axios.get(
      `/getAllSimpleStoreStaffLevelList/` + this.currentInfo.brandId
    ).then(res => {
      let data = {name:'全部',id: null}
      this.characterList = res.levelList;
      this.characterList.unshift(data)
    })
    this.saveCurrentInfo({
      isBrand: false
    });
  },
  mounted() {
    this.getStaffs();
    this.$root.$on('needRefreshPage', data => {
      this.getStaffs()
    })
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    toRecycle() {
      this.$router.push("/shop-inner/staff/staff-recycle");
    },
    // 关闭弹出层
    closeDialog() {
      let name = this.dialogParams.name
      if (name === "delStaff") {
          // 开始发送请求
          // 删除员工
          axios.post(
            `/batchStaffDelete`,
            { staffIdList: this.pages.delList }
          ).then(res => {
            this.batchStaffDeleteRes(res)
          })
        } else if (name === "recStaff") {
          // 开始发送请求
          // 恢复员工
          axios.post(`/batchStaffRenew`, {staffIdList: this.pages.delList}).then(res => {
            this.batchStaffRenewRes(res)
          })
        }
      this.showDialog = false;
      this.tableLoading = true
    },
    toCreate() {
      console.log(11111)
    },
    // 删除员工回调
    batchStaffDeleteRes(res) {
      this.tableLoading = true
      if (res.success) {
        // 在已有的列表中删除
        let ags = {
          fn: 'getStaffs',
          time: 500
        }
        this.deplay(ags)
        // 提示
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        // 提示
        this.tableLoading = false
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    // 获取员工总列表
    getStaffs() {      
      this.tableLoading = true
      // status是否是获取删除的信息，false为全部信息
      let form  = this.queryParam
      let params = {
        brandId: null,
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
        storeId: this.currentInfo.shopId,
        tabCondition: this.activeName
      };
      // 获取员工总列表
      let that = this
      axios.post(`/getStaffInfoList`, params).then(res => {
        that.getStaffInfoListRes(res)
      }).catch(error => {
        that.tableLoading = false
        utils.showTip(this, { msg: "请求错误", type: "error" });
      })
    },
    // 处理员工总列表
    getStaffInfoListRes(res) {
      // console.log(res, '数据')
      // 赋值
      this.tableLoading = false
      this.tableData = res.dataList;
       this.isUsing = false
      // 总页数
      this.pages.totalCount = res.total;
      this.CheckedAllArr = []
      this.checkArr = [];
      this.checkAllFlag = false;
      // 全选设置
      this.setCheckedAllArr();
    },
    delStaff(serviceId) {
      if (!serviceId.length) {
        // 提示
        utils.showTip(this, { msg: "请先选择要操作的服务项目", type: "error" });
        return;
      }
      (this.dialogParams = {
        name: "delStaff", // 弹出层的名称
        title: "删除员工", // 弹出层的标题
        txt: "确定要删除该员工吗？"
      }),
        (this.showDialog = true);
      this.pages.delList = serviceId;
    },
    // 改变员工的工作状态，离职
    changeWorkStatus(item,index) {
      this.idIndex = index
      this.changeWorkStatusInfo={
        iDs:[item.staffId],
        workStatus:item.workStatus,
        isImplement: true
      };
      if (item.workStatus) {
        axios.get(`/getPermissionForStaffDimission/${item.staffId}`).then(res => {
          if (res.permission) {
            this.infoData = {
              title:'确定要将该员工设为禁用吗？',
              txt: '设置后，该员工不能被预约，历史数据依然可查。',
              icon: 'icon_popup_question',
              iconColor: '#FF6D61',
              btn: '确定'
            }
            this.changeWorkStatusInfo.isImplement = true
          } else {
            this.infoData = {
              title:'该员工暂时不能禁用！',
              txt: '该员工有未完成的预约，须将该预约更改或取消，才能禁用。',
              icon: 'icon_popup_plaint',
              iconColor: '#E6A23C',
              btn: '前往修改'
            }
            this.changeWorkStatusInfo.isImplement = false
          }
        })
        this.delTagDialogVisible = true;
      } else {
        this.confirmChangeWorkStatus(this.changeWorkStatusInfo)
      }
    },
    confirmChangeWorkStatus(changeWorkStatusInfo){
      if (changeWorkStatusInfo.workStatus) {
        axios.post(
          `/batchDimission`,
          { staffIdList: changeWorkStatusInfo.iDs }
        ).then(res => {
          this.delTagDialogVisible = false;
          this.getStaffs()
          utils.showTip(this, { msg: res.message, type: "success" });
        })
      } else {
        axios.post(
          `/batchWorking`,
          { staffIdList: changeWorkStatusInfo.iDs }
        ).then(res => {
          this.getStaffs()
          this.delTagDialogVisible = false;
          utils.showTip(this, { msg: res.message, type: "success" });
        })
      }
    },
    // 是否离职回调
    // dimissionRes(res) {
    //   console.log(this.tableData[this.idIndex].workStatus)
    //   if (res.success) {
    //     this.tableData[this.idIndex].workStatus =! this.tableData[this.idIndex].workStatus
    //     // 提示
    //     let ags = {
    //       fn: 'getStaffs',
    //       time: 500
    //     }
    //     this.deplay(ags)
    //     utils.showTip(this, { msg: res.message, type: "success" });
    //     this.isUsing = true
    //   } else {
    //     // 提示
    //     this.tableLoading = false
    //     this.delTagDialogVisible = true;
    //     this.infoData = {
    //       title:'该员工暂时不能禁用！',
    //       txt: '该员工有未完成的预约，须将该预约更改或取消，才能禁用。',
    //       icon: 'icon_popup_plaint',
    //       iconColor: '#E6A23C',
    //       btn: '前往修改'
    //     }
    //   }
    //   // this.delTagDialogVisible=false;
    // },
    // 有预约的员工余姚跳转到预约管理进行跳转修改预约
    editOrder() {
      if (this.changeWorkStatusInfo.isImplement) {
        this.confirmChangeWorkStatus(this.changeWorkStatusInfo)
      } else {
        this.delTagDialogVisible=false;
        this.$router.push('/shop-inner/appo/appo-time')
      }
    },
    // 查看档案
    toStaffRecord(data) {
      if (!!data) {
        // this.saveCurrentInfo({
        //   staffId: data.staffId,
        //   userId: data.userId,
        //   jobType: data.jobType,
        //   isBrand: false,
        //   isHead: false
        // });
        // this.$router.push("/shop-inner/staffRecord");
        this.toPagesInNewTags(`/shop-inner/staffRecord/${data.staffId}/${data.userId}/${data.jobType == '服务者' ? 1 : 0}`)
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
    // 全选/复选
    handleChecked() {
      console.log(this.checkArr)
      console.log(this.tableData.length)
      // console.log(this.checkArr.length,this.tableData.length+':长度')
      //this.isCheckedAll = this.checkArr.length == this.tableData.length;
      this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAll(event) {
      this.checkArr = this.checkAllFlag ? this.CheckedAllArr : [];
      // console.log(this.CheckedAllArr)
    },
    setCheckedAllArr() {
      let arr = [];
      this.tableData.forEach((item, index) => {
        this.CheckedAllArr.push(item.staffId);
      });
    },
    search(text) {
      this.pages.currentPage = 1;
      this.keyword = text;
      this.clearForm()
      this.noData = true
      // this.getStaffs()
    },
    // searchData: util.debounce(function(text) {
    //   console.log(2222222)
    //   // console.log(text)
    //   this.keyword = text[0]
    //   this.clearForm()
    //   this.noData = true
    //   this.getStaffs()
    // }),
    clearForm() {
      console.log(33333)
      this.$refs.form.resetFields();
      this.getStaffs();
    },
    clearBack() {
      this.pages.currentPage = 1;
      this.keyword = ''
      this.clearForm()
      this.getStaffs()
      this.noData = false
    },
    // 查询员工列表
    searchStaff() {
      this.keyword = ""
      this.noData = true
      this.getStaffs()
    },
    /**
     * 跳转到新增员工界面
     */
    toStaffAdd() {
      this.saveCurrentInfo({
        isBrand: false,
        staffId: null
      });
      this.$router.push('/shop-inner/staff-add')
    },
    // 恢复已删除的员工
    recStaff(staffId) {
      if (!staffId.length) {
        // 提示
        utils.showTip(this, { msg: "请先选择要操作的服务项目", type: "error" });
        return;
      }
      (this.dialogParams = {
        name: "recStaff", // 弹出层的名称
        title: "恢复员工", // 弹出层的标题
        txt: "确定要恢复该员工吗？"
      }),
      (this.showDialog = true);
      this.pages.delList = staffId;
    },
    // 恢复员工回调
    batchStaffRenewRes(res) {
      if (res.success) {
        // 在已有的列表中恢复
        this.getStaffs()
        // 提示
        utils.showTip(this, {msg: res.message, type: 'success'})
      } else {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'error'})
      }
    },
    getStaffList() {
      this.noData = false
      this.keyword = ""
      this.clearForm()
      // this.getStaffs()
    }
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage")
  },
};
</script>

<style lang="scss" scoped>
#gm_staff_list .client_area {
  /deep/ .el-checkbox {
      margin: 0 0 15px 0;
      width: 33.3%;
      /deep/ .el-checkbox__label {
        color: #666666;
        display: none;
      }
    }
}
.table-con{
  width: 100%;
  height: calc(100vh - 400px);
}
.margin-left_box{
  margin-left:10px;
}
.text-overflow{
  width:80%;
}
.color_blue {
  color: #409eff;
}
.color_green {
  color: #67c23a;
}
.color_yellow {
  color: #e6a23c;
}
.cursor {
  cursor: pointer;
}
.top-line {
  box-sizing: border-box;
  margin-bottom: 20px;
  // padding: 23px 0 16px 0;
  width: 100%;
  height: 35px;
  // justify-content: space-between;
  // display: flex;
  .add-button {
    width: 92px;
    height: 35px;
    padding: 0;
    line-height: 35px;
    color: #fff;
    background: #f52d56;
  }
  .el-input{
    float: right;
  }
}
#gm_staff_list {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .list_condition {
    background: #fff;
    padding: 10px 0 10px 5px;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    .condition_left {
      display: flex;
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
        flex: 0 0 237px;
        border-left: 1px solid #f0f1f4;
        position: relative;
        .query-box {
          position: absolute;
          height: 100%;
          left: 25px;
          display: flex;
          align-items: center;
          .query-span {
            color: #999999;
            font-size: 14px;
            cursor: pointer;
            display: block;
            line-height: 35px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .label_area_single {
    width: 19%;
    label {
      width: 40%;
    }
    .el-select {
      width: 58%;
    }
  }
  .client_area {
    display: flex;
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
      width: 100%;
      .client_img {
        margin-left: 5px;
        margin-right: 15px;
        position: relative;
      }
      .client_info {
        flex: 1;
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
      }
    }
  }
  .checkbox_area {
    margin: 20px;
  }
  .oper_btns {
    // margin-top: 14px;
    // box-sizing: border-box;
    height: 75px;
    align-items: center;
    &>div {
      display: flex;
      height: 100%;
      flex: 1;
      flex-wrap: nowrap;
    }
    .patch-style {
      height: 35px;
      align-items: center;
    }
    .right-pagination-box {
      align-items: center;
      justify-content: flex-end;
    }
  } 
  .pagination {
    // margin: 0;
    // position: absolute;
    // right: 20px;
    // top: 0;
  }
}
.red-text{
  color: rgba(255, 109, 97, 1);
}
.container_normal {
  height: calc(100vh - 300px);
  border-radius:8px;
  overflow: hidden;
}
// .staff_container{
//   width: 90%;
// }

</style>
