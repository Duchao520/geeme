<template>
  <div id="brand-staff-list">
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
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.birthMonth">
              <el-option
                v-for="(month,index) in [null,1,2,3,4,5,6,7,8,9,10,11,12]"
                :key="index"
                :label="month===null?'全部':month+'月'"
                :value="month"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="职务身份：" prop="level" >
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.level">
              <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in characterList"
                      :key="item.id"
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
           <el-form-item label="入职时间：" prop="entryTime" >
            <el-select :popper-append-to-body="false" clearable v-model="queryParam.entryTime">
              <el-option
                v-for="(item,index) in entryData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
        <el-tabs v-model="activeName" @tab-click="getStaffList()" type="card">
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
      <el-checkbox-group v-else v-model="checkArr" @change="handleChecked" class="list-box_table">
        <el-table v-loading="tableLoading" :data="tableData" stripe height='calc(100vh - 345px)'>
          <el-table-column align="left" >
            <template slot="header" slot-scope="scope">
              <span v-if="activeName==='FORBIDDEN'||activeName==='DELETED'"  style="padding-left:28px;">员工</span>
              <span v-else style="padding-left:5px;">员工</span>
            </template>
            <template slot-scope="scope">
              <div class="client_area">
                <el-checkbox
                  :key="scope.row.id"
                  :label="scope.row.id"
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
                    <p>{{scope.row.userName?scope.row.userName:'未知'}}</p>
                    <el-tooltip class="item" effect="dark" :content="'员工编码：'+scope.row.serialNo" placement="top-start">
                      <span class="text-overflow">{{scope.row.serialNo}}</span>
                    </el-tooltip>
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
          <el-table-column align="center" label="启用" v-if="(activeName==='ACTIVE'||activeName==='FORBIDDEN' ) && checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)">
            <template slot-scope="scope">
              <switch-button @click="changeWorkStatus(scope.row,scope.$index)" v-model="scope.row.actived" inactiveColor='#ccc' activeColor="#13ce66" :active="scope.row.actived"></switch-button>
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
                  @click="delStaff([scope.row.id])"
                  v-if="activeName==='FORBIDDEN'"
                  v-show="checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)"
                ></g-button>
                <g-button
                  :name="'恢复'"
                  :type="'green'"
                  :icon="'icon_operate_recover'"
                  @click="recStaff([scope.row.id])"
                  v-if="activeName==='DELETED'"
                ></g-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
      <!-- 按钮以及全选 -->
      <el-row justify="space-between" align="middle" type="flex" class="oper_btns">
        <div v-show="checkHasBtnPermission(`${currentEntry}_staff_staffStatus`)">
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
        
        <div v-if='tableData.length > 0'>
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
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import * as axios from '@/util/axios'
import "@/assets/css/tab.scss";
import { mapState, mapActions } from "vuex";
import { setTimeout } from 'timers';
export default {
  name: "GmStaffList",
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      dialogParams: {
        name: "", // 弹出层的名称
        title: "", // 弹出层的标题
        txt: ""
      },
      queryParam: {
        birthMonth: null,
        level: null,
        entryTime: 'ALL',
        gender:null,
      },
      showDialog: false, // 弹窗的显示
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
        delList: null, // 要删除的服务项目列表
        disStaffId: "", // 禁用的员工id
        disStatus: null // 禁用状态
      },
      tableData: [],
      tableLoading: false,
      changeWorkStatusInfo:{},
      departureDialog: false,
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
      isUsing: false,
      iDIndex: null
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
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  created() {
    let params = {
          brandId: this.currentInfo.brandId,
          searchType: "BRAND"
        }
    axios.post(
          `${SERVICE_URL}/service-api/getBrandStaffLevels`,
          params
        ).then(res => {
          let data = {name:'全部',id: null}
          this.characterList = res.staffLevelInfoList;
          this.characterList.unshift(data)
        })
    this.saveCurrentInfo({
      isBrand: false
    });
  },
  mounted() {
    this.$emit('isNoData',false)
    this.init();
    this.$root.$on('needRefreshPage', data => {
      this.getStaffs()
    })
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    init() {
      this.getStaffs();
    },
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
            `${SERVICE_URL}/service-api/batchBrandStaffDelete`,
            { staffIdList: this.pages.delList }
          ).then(res => {
            this.batchStaffDeleteRes(res)
          })
        } else if (name === "recStaff") {
          // 开始发送请求
          // 恢复员工
          axios.post(`${SERVICE_URL}/service-api/batchBrandStaffRenew`, {staffIdList: this.pages.delList}).then(res => {
             this.batchStaffRenewRes(res)
          })
        }
      this.showDialog = false;
      this.tableLoading = true
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
      // console.log(this.keyword)
      let params = {
        brandId: this.currentInfo.brandId,
        birthdayMonth: form.birthMonth,
        currentPage: this.pages.currentPage-1,
        entryDate: form.entryTime,
        keyword: this.keyword,
        level: form.level,
        pageSize: this.pages.pageSize,
        sex: form.gender,
        tabCondition: this.activeName
      };
      // 获取总部员工总列表
      let that = this
      axios.post(`${SERVICE_URL}/service-api/esGetBrandStaffList`, params).then(res => {
        this.getStaffInfoListRes(res)
      }).catch(err => {
        that.tableLoading = false
      })
    },
    // 处理员工总列表
    getStaffInfoListRes(res) {
      // console.log(res, '数据')
      // 赋值
      this.tableData = res.staffListInfos;
      this.tableLoading = false
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
      this.iDIndex = index
      this.confirmChangeWorkStatus(item)
    },
    confirmChangeWorkStatus(item){
      let params = {
        staffId: item.id,
        status: !item.actived
      }
      // console.log(item)
      axios.post(`${SERVICE_URL}/service-api/forbidBrandStaff`,params).then(res => {
        this.dimissionRes(res)
      })
    },
    // 是否离职回调
    dimissionRes(res) {
      if (res.success) {
        this.tableData[this.iDIndex].actived =! this.tableData[this.iDIndex].actived
        // 提示
        let ags = {
          fn: 'getStaffs',
          time: 500
        }
        this.deplay(ags)
        this.isUsing = true
      } else {
        // 提示
        this.tableLoading = false
      }
      utils.showTip(this, { msg: res.message, type: res.success?"success":'error' });
    },
    // 查看档案
    toStaffRecord(data) {
       if (!!data) {
        // this.saveCurrentInfo({
        //   staffId: data.id,
        //   userId: data.userId,
        //   jobType: '非服务者',
        //   isHead: true,
        // });
        // this.$router.push("/brand-inner/staffRecord");
        this.toPagesInNewTags(`/brand-inner/staffRecord/${data.id}/${data.userId}/-1`);  // -1 用来区分查看总部员工，
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
      // console.log(this.checkArr.length,this.tableData.length+':长度')
      // this.isCheckedAll = this.checkArr.length == this.tableData.length;
      this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAll(event) {
      console.log(this.checkAllFlag)
      this.checkArr = this.checkAllFlag ? this.CheckedAllArr : [];
      // console.log(this.CheckedAllArr)
    },
    setCheckedAllArr() {
      let arr = [];
      this.tableData.forEach((item, index) => {
        console.log(item)
        this.CheckedAllArr.push(item.id);
      });
    },
    clearForm() {
      this.$refs.form.resetFields();
      this.getStaffs()
    },
    clearBack() {
      this.$emit('clearNoData')
      this.clearForm()
      setTimeout(() => {
        this.getStaffs()
      },200)
    },
    // 查询员工列表
    searchStaff() {
      this.$emit('isNoData',true)
      this.getStaffs()
    },
    /**
     * 跳转到新增员工界面
     */
    toStaffAdd() {
      this.saveCurrentInfo({
        isBrand: false
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
  // height: calc(100vh - 345px);
}
#brand-staff-list .client_area /deep/ .el-checkbox__label {
  display: none;
}
.table-con{
  width: 100%;
  height: calc(100vh - 298px);
}
.margin-left_box{
  margin-left:10px;
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
  padding-bottom: 20px;
  // padding: 23px 0 16px 0;
  width: 100%;
  justify-content: space-between;
  display: flex;
  .add-button {
    width: 92px;
    height: 35px;
    padding: 0;
    line-height: 35px;
    color: #fff;
    background: #f52d56;
  }
}
#brand-staff-list {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
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
        flex: 0 0 207px;
        border-left: 1px solid #f0f1f4;
        position: relative;
        .query-box {
          display: flex;
          position: absolute;
          align-items: center;
          height: 100%;
          left: 25px;
          .query-span {
            color: #999999;
            font-size: 14px;
            margin-left: 10px;
            cursor: pointer;
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
      }
    }
  }
  .checkbox_area {
    margin: 20px;
  }
  .oper_btns {
    margin-top: 14px;
    box-sizing: border-box;
    // height: 25px;
  }
  .pagination {
    margin: 0;
    position: absolute;
    right: 20px;
    top: 0;
  }
}
.red-text{
  color: rgba(255, 109, 97, 1);
}
.container_normal {
  height: calc(100vh - 245px);
  border-radius:8px;
}
</style>
<style lang="scss">
#app #brand-staff-list .icon-icon_operate_delete:hover {
  color: #fff;
}
</style>