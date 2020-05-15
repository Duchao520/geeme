<template>
    <div id='gm_staff_list' class="margin_main">
        <!-- 列表筛选条件 -->
        <div class="staff_list_condition list_condition">
            <div class="title">
                已删除员工
            </div>
        </div>
        <!-- 列表数据 -->
        <div class="staff_container container_normal">
              <el-tabs type="card">
                <el-tab-pane v-for="(item, index) in selectStatus" :key="index" :label="item.value" v-model="item.code"></el-tab-pane>
              </el-tabs>
              <!-- table list -->
              <el-checkbox-group v-model="checkArr" @change="handleChecked">
                <el-table
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  stripe>
                  <el-table-column
                    width="180"
                    align='center'
                    label="员工">
                    <template slot-scope="scope">
                      <div class="client_area">
                        <el-checkbox :key="scope.row.staffId" :label="scope.row.staffId" class="check_single"></el-checkbox>
                        <div class="client_msg">
                          <div class="client_img">
                            <img :src="formatPicImage(scope.row.image, 'style', 40, 'someone', scope.row.sex)">
                            <img class="sex_icon" v-if="scope.row.sex == '女'" src="@/assets/img/female_tip.png">
                            <img class="sex_icon" v-else-if="scope.row.sex == '男'" src="@/assets/img/male_tip.png">
                          </div>
                          <div class="client_info">
                            <p>{{scope.row.userName}}</p>
                            <p>{{scope.row.serialNo}}</p>
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
                  </el-table-column> -->
                  <el-table-column
                    prop="mobile"
                    align='center'
                    width="110"
                    label="手机号">
                  </el-table-column>
                  <el-table-column
                    prop="birthday"
                    align='center'
                    label="生日">
                  </el-table-column>
                  <el-table-column
                    prop="entryDate"
                    align='center'
                    label="入职时间">
                  </el-table-column>
                  <el-table-column
                    prop="storeName"
                    align='center'
                    label="隶属门店">
                  </el-table-column>
                  <el-table-column
                    prop="levelName"
                    align='center'
                    label="职务身份">
                  </el-table-column>
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
                  </el-table-column> -->
                  <el-table-column
                    align='center'
                    label="本月指定客数">
                    <template slot-scope="scope">¥{{scope.row.assignCount || 0}}</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="本月劳动业绩">
                    <template slot-scope="scope">¥{{scope.row.servicePerformance || 0}}</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="本月卖卡业绩">
                    <template slot-scope="scope">¥{{scope.row.cardPerformance  || 0}}</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="本月产品业绩">
                    <template slot-scope="scope">¥{{scope.row.goodsPerformance  || 0}}</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="剪发价">
                    <template slot-scope="scope">¥{{scope.row.hairCutPrice  || 0}}</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="评价得分">
                    <template slot-scope="scope">{{scope.row.score  || 0}}分</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="作品数">
                    <template slot-scope="scope">{{scope.row.worksCount  || 0}}</template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    label="在职">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.workStatus"
                        active-color="#13ce66"
                        inactive-color="#ccc"
                        @change="changeWorkStatus(scope.row)">
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align='center'
                    width="200"
                    label="操作">
                    <template slot-scope="scope">
                      <g-button :name="'档案'" :type="'green'" :icon="'icon_operate_file'" @click="toStaffRecord(scope.row)"></g-button>
                      <g-button :name="'禁用'" :type="'orange'" :icon="'icon_operate_disable'" @click="toDisable(scope.row)" v-if="scope.row.actived"></g-button>
                      <g-button :name="'解禁'" type="detail" :icon="'icon_operate_able'" @click="toDisable(scope.row)" v-if="!scope.row.actived"></g-button>
                      <g-button :name="''" type="cancel" :icon="'icon_operate_delete'" @click="foreverDel([scope.row.staffId])"></g-button>
                      <!-- <span class="color_green cursor">恢复</span>
                      <span class="color_blue cursor">永久删除</span> -->
                    </template>
                  </el-table-column>
                </el-table>
              </el-checkbox-group>
              <!-- 按钮以及全选 -->
              <div class="oper_btns">
                <el-checkbox class="all_check" v-model="checkAllFlag"  @change="checkAll">全选</el-checkbox>
                <g-button :name="'恢复'" :type="'greenFill'" :icon="'icon_operate_recover'" @click="recStaff(checkArr)"></g-button>
                <g-button :name="'永久删除'" type="cancel" :icon="'icon_operate_delete'" @click="foreverDel(checkArr)"></g-button>
              </div>
              <!-- 分页 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pages.currentPage"
                :page-size="pages.pageSize"
                :pager-count='5'
                layout="total, prev, pager, next, jumper"
                :total="pages.totalCount">
              </el-pagination>
        </div>
      <!-- 弹窗 -->
      <my-dialog @close="closeDialog" :name="dialogParams.name" :title="dialogParams.title" :show-dialog="showDialog">
        <p>{{ dialogParams.txt }}</p>
      </my-dialog>
    </div>
</template>

<script>
import * as api from '@/assets/js/interface'
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
import { mapActions, mapState } from 'vuex'
import * as axios from '@/util/axios'
export default {
  name:'GmStaffList',
  data(){
    return{
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      dialogParams: {
        name: '', // 弹出层的名称
        title: '', // 弹出层的标题
        txt: ''
      },
      showDialog: false, // 弹窗的显示
      search:'',
      // 筛选
      shop:'',
      birthMonth:'',
      level:'',
      price:'',
      rate:'',
      amount:'',
      cardAmount:'',
      goodAmount:'',
      count:'',
      goodCount:'',
      //tab切换
      selectStatus:[
        {code:'',value:'全部'},
        {code:'A',value:'发型师'},
        {code:'B',value:'发型助理'},
        {code:'C',value:'美容师'},
        {code:'D',value:'美容助理'}
      ],
      // 全选
      checkAllFlag:false,
      checkArr:[],
      isCheckedAll:false,
      CheckedAllArr:[],
      //分页
      // totalCount:100,
      // currentPage:1,
      // pageSize:10,
      pages: { // 页面默认数据初始化
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 10, // 每页的条数
        pageNum: 5, // 默认显示页面的下标数量
        myList: null, // 要删除的服务项目列表
        disStaffId: '', // 禁用的员工id
        disStatus: null, // 禁用状态
        currentShopId: null // 当前的shopId
      },
      tableData: [],
      //
    //   tableData:[{
    //       staffId:2, // 员工编号
    //       image:require('@/assets/img/yuan_logo.png'), // 头像id
    //       userName:'peter', // 姓名
    //       sex: '男', // 性别
    //       mobile:'12345567777', // 登录手机号
    //       // userNo:'1132948298392',  // 系统账号暂时不用
    //       birthday:'2018/10/29', // 生日
    //       entryDate:'2018/10/29', // 入职时间
    //       storeName:'暴龙城店', // 所属门店
    //       levelName:'发型师', // 职务身份
    //       // limits:'微信推广', // 权限暂时不做
    //       // level:'总监', // 级别暂时不做
    //       assignCount: 0, // 本月指定客数
    //       servicePerformance:'5324', // 本月劳动业绩
    //       cardPerformance:"5000", // 本月售卡业绩
    //       goodsPerformance:'2592', // 本月产品业绩
    //       hairCutPrice:'344', // 剪发价
    //       score:'3', // 评价得分
    //       worksCount:'45', // 作品
    //       workStatus: true
    //     }]
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    }
  },
  mounted(){
    // 初始化数据
    this.init()
  },
  methods:{
    ...mapActions(['saveCurrentInfo']),
    init() {
      this.getStaffs(true)
    },
    // 关闭弹出层
    closeDialog(data) {
      if (data.type === 'confirm') {
        // 关闭处理
        if (data.name === 'recStaff') {
          // 开始发送请求
          // 恢复员工
          axios.post(api.batchStaffRenew.URL, {staffIdList: this.pages.myList}).then(res => {
             this.batchStaffRenewRes(res)
          })
        } else if (data.name === 'disStaff') {
          // 开始发送请求
          // 禁用员工
          axios.post(api.forbidStaff.URL, {
            staffId: this.pages.disStaffId,
            status: this.pages.disStatus
          }).then(res => {
            this.forbidStaffRes(res)
          })
        } else if (data.name === 'foreverDel') {
          // 开始发送请求
          // 永久删除员工
          axios.post(api.batchCompleteDeleteStaff.URL, {staffIdList: this.pages.myList}).then(res => {
            this.batchCompleteDeleteStaffRes(res)
          })
        }
      }
      this.showDialog = false
    },
    // 永久删除员工回调
    batchCompleteDeleteStaffRes(res) {
      if (res.success) {
        // 在已有的列表中删除
        this.pages.myList.forEach(id => {
          // 根据员工删除相应的列表
          this.tableData.forEach((table, index) => {
            if (table.staffId === id) {
              // 删除
              this.tableData.splice(index, 1)
            }
          })
        })
        // 提示
        utils.showTip(this, {msg: res.message, type: 'success'})
      } else {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'error'})
      }
    },
    // 禁用员工回调
    forbidStaffRes(res) {
      if (res.success) {
        // 在已有的列表中修改状态
        this.tableData.forEach((table, index) => {
          if (table.staffId === this.pages.disStaffId) {
            // 删除
            this.tableData[index].actived = !this.tableData[index].actived
          }
        })
        // 提示
        utils.showTip(this, {msg: res.message, type: 'success'})
      } else {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'error'})
      }
    },
    // 恢复员工回调
    batchStaffRenewRes(res) {
      if (res.success) {
        // 在已有的列表中恢复
        this.pages.myList.forEach(recId => {
          // 根据员工恢复相应的列表
          this.tableData.forEach((table, index) => {
            if (table.staffId === recId) {
              // 恢复
              this.tableData.splice(index, 1)
            }
          })
        })
        // 提示
        utils.showTip(this, {msg: res.message, type: 'success'})
      } else {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'error'})
      }
    },
    // 改变员工的工作状态，离职
    changeWorkStatus(item) {
        // 如果是在职，则调用离职接口，反之调用在职接口
        if (!item.workStatus) {
            // 开始发送请求
            axios.post(api.batchDimission.URL, {staffIdList: [item.staffId]}).then(res => {
              this.dimissionRes(res)
            })
        } else {
            // 开始发送请求
            axios.post(api.batchWorking.URL, {staffIdList: [item.staffId]}).then(res => {
              this.dimissionRes(res)
            })
        }
    },
    // 是否离职回调
    dimissionRes(res) {
      if (res.success) {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'success'})
      } else {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'error'})
      }
    },
    // 获取员工总列表
    getStaffs(status) {
      // status是否是获取恢复的信息，false为全部信息
      let params = {
        dataParam: {
          deleteFlag: status,
          // jobId: 1,
          // roleId: 1,
          shopId: this.currentInfo.shopId
        },
        pageParam: {
          currentPage: this.pages.currentPage,
          pageSize: this.pages.pageSize
        }
      }
      // 获取员工总列表
      axios.post(api.getStaffInfoList.URL, params).then(res => {
        this.getStaffInfoListRes(res)
      })
    },
    // 处理员工总列表
    getStaffInfoListRes(res) {
      // 赋值
      this.tableData = res.dataList
      // 总页数
      this.pages.totalCount = res.pageInfo.total
      // 全选设置
      this.setCheckedAllArr()
    },
    // 永久删除
    foreverDel(delList) {
      if (!delList.length) {
        // 提示
        utils.showTip(this, {msg: '请先选择要操作的服务项目', type: 'error'})
        return
      }
      this.dialogParams = {
        name: 'foreverDel', // 弹出层的名称
        title: '永久删除', // 弹出层的标题
        txt: '确定要永久删除该员工吗？'
      },
      this.showDialog = true
      this.pages.myList = delList
    },
    // 恢复员工
    recStaff(serviceId) {
      if (!serviceId.length) {
        // 提示
        utils.showTip(this, {msg: '请先选择要操作的服务项目', type: 'error'})
        return
      }
      this.dialogParams = {
        name: 'recStaff', // 弹出层的名称
        title: '恢复员工', // 弹出层的标题
        txt: '确定要恢复该员工吗？'
      },
      this.showDialog = true
      this.pages.myList = serviceId
    },
    // 去禁用
    toDisable(item) {
      if (item.actived) {
        this.dialogParams = {
            name: 'disStaff', // 弹出层的名称
            title: '禁用员工', // 弹出层的标题
            txt: '确定要禁用该员工吗？'
        }
      } else {
        this.dialogParams = {
            name: 'disStaff', // 弹出层的名称
            title: '解禁员工', // 弹出层的标题
            txt: '确定要解禁该员工吗？'
        }
      }
      this.pages.disStatus = !item.actived
      this.showDialog = true
      this.pages.disStaffId = item.staffId
    },
    toStaffRecord(data){
      // 存储当前员工的id
      if(!!data) {
        this.saveCurrentInfo({
          staffId: data.staffId,
          userId: data.userId
        })
        this.$router.push('/shop-inner/staffRecord');
      }
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 赋值
      this.pages.currentPage = val
      // 判断是否可调接口
      if (val > this.pages.totalCount || val <= 0) return
      this.getStaffs(true)
      console.log(`当前页: ${val}`);
    },
    // 全选/复选
    handleChecked(){
        this.isCheckedAll = this.checkArr.length == this.tableData.length;
				this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAll(event){
      this.checkArr = this.checkAllFlag ? this.CheckedAllArr : [];
      // this.checkArr = event.target.checked ? this.CheckedAllArr : [];
    },
    setCheckedAllArr(){
      let arr = [];
      this.tableData.forEach((item,index)=>{
        this.CheckedAllArr.push(item.staffId);
      })
    },
  }
}
</script>

<style lang="scss">
#gm_staff_list .client_area .el-checkbox__label{
    display: none;
  }
</style>

<style lang="scss" scoped>
.color_blue{
  color:#409EFF;
}
.color_green{
  color:#67C23A;
}
.color_yellow{
  color: #E6A23C;
}
.cursor{
  cursor:pointer;
}
    #gm_staff_list {
        .list_condition {
          background: #fff;
          padding: 20px 0 10px 0;
          border-radius: 4px;
          .title {
              padding: 0 0 10px 20px;
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
        .client_area{
          display: flex;
          .check_single{
            margin:0 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .client_msg{
            display: flex;
            align-items:center;
            .client_img{
                margin-left:5px;
                margin-right:15px;
                position: relative;
            }
            .client_info{
              p{text-align:left;}
            }
            img{
              width:30px;
              height:30px;
              border-radius:50%;
              vertical-align: middle;
            }
            .sex_icon{
              position: absolute;
              width:14px;
              height: 14px;
              left:22px;
              top:0;
            }
            span{
              display: inline-block;
              margin-left:5px;
            }
          }
        }
        .checkbox_area{
          margin:20px;
        }
        .oper_btns {
          margin-top: 20px;
        }
    }
</style>


