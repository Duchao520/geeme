<template>
  <div id="gm_recycle">
      <div class="appo_submenu">
        <div class="tabs">
          <span class="router-link-active">商品回收站</span>
        </div>
      </div>
      <!-- 主页面 -->
      <div class="recycle_container margin_main">
          <div class="select_condition">
            <div class="label_area_single">
              <label>隶属门店：</label>
              <el-select v-model="shop">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="庆春店" value="a"></el-option>
                  <el-option label="宝龙店" value="b"></el-option>
              </el-select>
            </div>
            <!-- 去回收站 -->
            <div>
              <el-input placeholder="请输入订单号" class="con_phone" style='width:220px;' v-model="search"></el-input>
              <el-button type="primary">搜索</el-button>
            </div>
          </div>
          <!--   服务列表 -->
          <div class="user-defined-tab container_normal" style="margin-top:10px;">
            <el-tabs type="card">
              <el-tab-pane v-for="(item, index) in selectStatus" :key="index" :label="item.value" v-model="item.code"></el-tab-pane>
            </el-tabs>
            <!-- table list -->
            <el-checkbox-group v-model="checkArr" @change="handleChecked">
              <el-table
              :data="tableData"
              tooltip-effect="dark"
              stripe
              style="width: 100%">
              <el-table-column
                align="right"
                label="排序"
                width="100">
                <template slot-scope="scope">
                  <div class="sort_area">
                    <el-checkbox :key="scope.row.serviceId" :label="scope.row.serviceId" class="check_single"></el-checkbox>
                    <el-input v-model="scope.row.order"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="270"
                label="服务项目">
                <template slot-scope="scope">
                  <div class="service_msg">
                    <div class="service_img">
                      <img :src="formatPicImage(scope.row.image, 'style', 70, 'brandLogo')">
                    </div>
                    <div class="service_info">
                      <p class="ser_name">{{scope.row.name}}</p>
                      <p class="ser_code">{{scope.row.code}}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
              label="服务时长">
                <template slot-scope="scope">
                  {{scope.row.time || 0}}分钟
                </template>
              </el-table-column>
              <el-table-column
              label="单价">
                <template slot-scope="scope">
                  <span class="price">
                    ¥{{scope.row.price || 0}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
              label="销量">
                <template slot-scope="scope">
                  <span>{{ scope.row.saleCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column
              label="删除时间"
              prop="deleteDate">
              </el-table-column>
              <el-table-column
              label="状态">
                  <template slot-scope="scope">
                    <status-text :name="'删除'" :type="'sgrey'"></status-text>
                  </template>
              </el-table-column>
                <el-table-column
              label="促销">
                  <template slot-scope="scope">
                   <span>{{ scope.row.promotion || 0 }}</span>
                  </template>
              </el-table-column>
              <el-table-column
              label="作品数">
                <template slot-scope="scope">
                  <span>{{ scope.row.worksCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column
              label="评价得分">
                <template slot-scope="scope">
                  <span>{{ scope.row.evaluationScore || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="140">
                <template slot-scope="scope">
                  <p class="oper_p">
                    <!--
                    <span class="color_blue cursor" @click="recycle([scope.row.serviceId])">恢复</span>
                    <span class="color_red cursor">永久删除</span>-->
                    <g-button :name="'恢复'" :type="'green'" :icon="'icon_operate_recover'" @click="recycle([scope.row.serviceId])"></g-button>
                    <g-button :name="''" type="cancel" :icon="'icon_operate_delete'" @click="delServer([scope.row.serviceId])"></g-button>
                  </p>
                </template>
              </el-table-column>
              </el-table>
            </el-checkbox-group>
            <!-- 按钮以及全选 -->
            <div class="service_operation">
              <div class="oper_btns">
                <el-checkbox class="all_check" v-model="checkAllFlag"  @change="checkAll">全选</el-checkbox>
                <g-button :name="'恢复'" :type="'greenFill'" :icon="'icon_operate_recover'" @click="recycle(checkArr)"></g-button>
                <g-button :name="'永久删除'" type="cancel" :icon="'icon_operate_delete'" @click="delServer(checkArr)"></g-button>
                <!--<el-button class="oper_btn" @click="makeTag">打标签</el-button>
                <el-button class="oper_btn">上架</el-button>-->
              </div>
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
      </div>
      <!-- 打标签弹窗 -->
      <el-dialog
        center
        :closeOnClickModal="false"
        :visible.sync="dialogVisibleMakeTag">
        <div class="checkbox_area">
          <el-checkbox-group
            v-model="checkedTags">
            <el-checkbox v-for="item in tagList" :label="item.tag" :key="item.tag">{{item.tag}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-input v-model="newTag" placeholder="请输入标签名称" style="max-width:200px;margin-left:40px;margin-top:20px;"></el-input>
        <el-button type="primary">新增</el-button>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleMakeTag = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibleMakeTag = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹窗 -->
      <my-dialog @close="closeDialog" :name="dialogParams.name" :title="dialogParams.title" :show-dialog="showDialog">
        <p>{{ dialogParams.txt }}</p>
      </my-dialog>
  </div>
</template>

<script>
import * as api from '@/assets/js/interface'
import * as axios from "@/util/axios";
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
import MyDialog from '@/components/commonModal/modal/dialog'
export default {
  name:'GmRecycle',
  data(){
    return{
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      shop:'',
      search:'',
      // 打标签
      dialogVisibleMakeTag:false,
      checkedTags:[],
      newTag:"",
      tagList:[
        {id:1,tag:'标签1'},
        {id:2,tag:'标签2'},
        {id:3,tag:'标签3'},
        {id:4,tag:'标签4'},
        {id:5,tag:'标签5'},
        {id:6,tag:'标签11'},
        {id:7,tag:'标签21'},
        {id:8,tag:'标签31'},
        {id:9,tag:'标签41'},
        {id:10,tag:'标签51'}
      ],
      // 全选
      checkAllFlag:false,
      checkArr:[],
      isCheckedAll:false,
      CheckedAllArr:[],
      //
      totalCount:100,
      currentPage:1,
      pageSize:10,
      pages: { // 页面默认数据初始化
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 10, // 每页的条数
        pageNum: 5, // 默认显示页面的下标数量
        delList: null, // 要删除的服务项目列表
        recycleList: null, // 要删除的服务项目列表
        currentShopId: null // 当前的shopId
      },
      selectStatus:[
        {code:'A',value:'服务'},
        {code:'B',value:'产品'},
        {code:'C',value:'卡项'},
        {code:'D',value:'套餐'}
      ],
      showDialog: false, // 弹窗层的显示
      dialogParams: {
        name: '', // 弹出层的名称
        title: '', // 弹出层的标题
        txt: '' // 弹出层内容
      },
      tableData: [],
      // 表格数据
      // tableData:[{
      //   serviceId: 1, // 服务id
      //   order:1, // 排序
      //   image:require('@/assets/ser_logo.png'), // 服务缩略图
      //   name:'高级烫染+洗吹洗护', // 服务名
      //   code:'p20374823795723', // 服务编号
      //   time:'60',  // 服务时长
      //   price:'125', // 服务单价
      //   saleCount:'123', // 销量
      //   deleteDate:'2018/10/20 17：30', // 上架日期
      //   shelvesStatus: '上架', // 上架状态
      //   showStatus: '展示', // 展示状态
      //   recommendStatus: '首页推荐', // 首页推荐状态
      //   isCoupon:1,
      //   promotion:'秒杀', // 促销
      //   worksCount:123, // 作品数
      //   evaluationScore:3.5 // 评价得分
      // }]
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    },
  },
  components: {
    'my-dialog': MyDialog
  },
  mounted(){
    this.init()
    this.setCheckedAllArr()
  },
  methods:{
    // 初始化数据
    init() {
      this.getService()
    },
    // 关闭弹出层
    closeDialog(data) {
      if (data.type === 'confirm') {
        // 关闭处理
        if (data.name === 'recycleServer') {
          // 开始发送请求
          // 恢复服务
          // 获取服务列表
          axios.post(api.serviceRenew.URL, {serviceId: this.recycleList}).then(res => {
            this.getRecycleRes(res)
          })
        } else if (data.name === 'delServer') {
          // 开始发送请求
          // 永久删除服务
          axios.post(api.serviceCompleteDelete.URL, {idList: this.pages.delList}).then(res => {
            this.delServerRes(res)
          })
        }
      }
      this.showDialog = false
    },
    // 删除服务项目回调
    delServerRes(res) {
      if (res.success) {
        // 在已有的列表中删除
        this.pages.delList.forEach(delId => {
          // 根据服务项目删除相应的列表
          this.tableData.forEach((table, index) => {
            if (table.serviceId === delId) {
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
    // 删除服务项目
    delServer(serviceId) {
      if (!serviceId.length) {
        // 提示
        utils.showTip(this, {msg: '请先选择要操作的服务项目', type: 'error'})
        return
      }
      this.dialogParams = {
        name: 'delServer', // 弹出层的名称
        title: '删除服务', // 弹出层的标题
        txt: '确定要删除该服务吗？'
      },
      this.showDialog = true
      this.pages.delList = serviceId
    },
    // 恢复服务
    recycle(serviceId) {
      if (!serviceId.length) {
        // 提示
        utils.showTip(this, {msg: '请先选择要操作的服务项目', type: 'error'})
        return
      }
      this.dialogParams = {
        name: 'recycleServer',
        title: '恢复服务',
        txt: '确定要恢复该服务项目吗？'
      }
      this.recycleList = serviceId
      this.showDialog = true
    },
    getRecycleRes(res) {
      if (res.success) {
        // 在已有的列表中删除
        this.recycleList.forEach(id => {
          // 根据服务项目删除相应的列表
          this.tableData.forEach((table, index) => {
            if (table.serviceId === id) {
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
    // 获取服务列表
    getService() {
      let params = {
        dataParam: {
          storeId: this.currentInfo.shopId,
          deleteFlag: true
        },
        pageParam: {
          currentPage: this.pages.currentPage,
          pageSize: this.pages.pageSize
        }
      }
      // 获取服务列表
      axios.post(api.getServiceList.URL, params).then(res => {
        this.getServiceListRes(res)
      })
    },
    // 处理获取到的服务列表数据
    getServiceListRes(res) {
      // total赋值
      this.pages.totalCount = res.pageResponse.total
      // 赋值
      this.tableData = res.serviceDetailList
      // 存放选中所有的下标
      this.setCheckedAllArr()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val
      // 判断是否可调接口
      if (val > this.pages.totalCount || val <= 0) return
      // 每次页数更改时都要请求当前页的信息
      this.getService()
      console.log(`当前页: ${val}`);
    },
    // 全选/复选
    handleChecked(){
        this.isCheckedAll = this.checkArr.length == this.tableData.length;
				this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAll(event){
      console.log(this.checkAllFlag)
      this.checkArr = this.checkAllFlag ? this.CheckedAllArr : [];
      // this.checkArr = event.target.checked ? this.CheckedAllArr : [];
    },
    setCheckedAllArr(){
      let arr = [];
      this.tableData.forEach((item,index)=>{
        this.CheckedAllArr.push(item.serviceId);
      })
    },
    // 打标签
    makeTag(){
      this.dialogVisibleMakeTag = true
    },
  }
}
</script>
<style lang="scss">
#gm_recycle{
  .el-radio-button__inner{
    margin-bottom: 10px;
  }
  .type_set .el-button{
    height: 30px;
    padding: 8px 20px;
    margin-right: 20px;
  }
  .sort_area{
    display: flex;
    .el-input__inner{
      width: 40px;
      height: 20px;
      padding: 0;
      text-align: center;
    }

  }
  .sort_area .el-checkbox__label{
    display: none;
  }
  th.is-right > .cell{
    padding-right:16px;
  }

  .checkbox_area{
       .el-checkbox{
          width: 100px;
          margin-left: 20px;
          margin-bottom:15px;
       }
    }
}
</style>

<style lang="scss" scoped>
.color_blue{
  color:#409EFF;
}
.color_red{
  color:#E22C37;
}
  .select_condition{
    display: flex;
    .label_area_single{
      flex:1;
    }
  }
  .check_single{
    margin-left:5px;
  }
  .tag_list{
    display:flex;
    .radio_group{
      flex: 1;
    }
  }
  .select_condition{
    margin-top: 10px;
    display: flex;
    align-items: center;
    .label_area_single{flex: 1;}
    .to_recycle{
      cursor: pointer;
      padding-right:20px;
      font-size:14px;color: #9B9B9B;
      i{color: #E5424B;}
    }
  }
  .price {
    color: #FF6D61;
  }
  .service_operation{
    margin-top: 20px;
    display: flex;
    .oper_btns{
      flex:1;
    }
  }
  .service_msg{
    display:flex;
    .service_img{
      margin-right:10px;
      img{
        width:64px;
        height:62px;
      }
    }
    .service_info{
      flex:1;
      display:flex;
      flex-direction:column;
      font-size:14px;
      .ser_name{
        color:#333333;
        flex:1;
      }
      .ser_code{
        color:#606266;
        padding-bottom:5px;
      }
    }
  }
  .oper_p{
      span{
        cursor:pointer;
        padding-right:10px;
      }
    }
    .long{
      width:60px;
      text-align:right;
      display:inline-block;
    }
</style>

