<template>
  <div class="recorad-wrap">
    <div class="recorad-wrap_table">
      <el-table  class="el-table-re" :row-class-name="tableRowClassName" :data="shopData" v-loading="tableLoading">
        <el-table-column prop="payTime"  align="left" label="消费时间" width='150'>
        </el-table-column>
        <el-table-column prop="code" align="left" label="订单号" width='150'>
        </el-table-column>
        <el-table-column align="left" label="产品名称">
          <template slot-scope="scope">
            {{scope.row.type==='BUY_NEW'?'门店新开券':scope.row.type==='RENEWAL'?'门店续期券'+'('+ scope.row.duration +'年' +')':'升级'}}
          </template>
        </el-table-column>
        <el-table-column prop="brandName" align="left" label="品牌">
        </el-table-column>
        <el-table-column prop="tradeName" align="left" label="行业">
        </el-table-column>
        <el-table-column prop="handleSuppor" align="left" label="营收类型">
        </el-table-column>
        <el-table-column align="left" label="版本">
          <template slot-scope="scope">
            {{scope.row.version===1?'标准版':scope.row.version===2?'专业版':scope.row.version===3?'旗舰版':'未知'}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="单价（元）">
          <template slot-scope="scope">
            {{ '￥'+ scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column prop="num" align="left" width="50" label="数量">
        </el-table-column>
        <el-table-column align="left" label="金额（元）">
          <template slot-scope="scope">
            {{ '￥'+ scope.row.payAmount}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态">
          <template slot-scope="scope">
            <span class="tag-one" v-if="scope.row.status===1">
              待付款
            </span>
            <span class="tag-two" v-if="scope.row.status===2">
              已完成
            </span>
            <span class="tag-three" v-if="scope.row.status===3">
              已关闭
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="125">
          <template slot-scope="scope">
            <g-button :name="'详情'" type="detail" :icon="'icon_operate_eyes'" @click="getOrderInfo(scope.row)"
            class="btn-button">
            </g-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pages.currentPage" :page-size="pages.pageSize" :pager-count="5"
      layout="total, prev, pager, next, jumper" :total="pages.totalCount">
      </el-pagination>
    </div>
    <!-- 分页 -->
    
    <!-- 打开订单详情模态框 -->
    <el-dialog :visible.sync="orderVisiable">
      <h3 slot="title" class="dialog-head">订单详情</h3>
      <div class="dialog-box">
        <el-row type="flex" justify="space-between">
          <span class="dialog-box-title">基本信息</span>
          <span class="tag-one" v-if="status===1">
              待付款
          </span>
          <span class="tag-two" v-if="status===2">
              已完成
          </span>
          <span class="tag-three" v-if="status===3">
              已关闭
          </span>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle" class="dialog-box-one" >
          <p><label>订单号</label> <span> {{records.code}} </span></p>
          <p><label>下单时间</label> <span> {{records.createTime}} </span></p>
          <p><label>付款时间</label> <span v-if="status===2">{{records.payTime}}</span><span style="color: rgba(245, 45, 86, 1);" v-else>未付款</span></p>
          <p><label>付款方式</label> <span v-if="status===2">{{payWay}}</span> <span style="color: rgba(245, 45, 86, 1);" v-else>未付款</span></p>
        </el-row>
        <div class="dialog-box-two">
          <h4 class="dialog-box-title">订单明细</h4>
          <div class="dialog-box_boxone">
            <el-table :header-cell-style="rowClass"  :data="infoData">
              <el-table-column align="left" width="150" label="产品">
                <template slot-scope="scope">
                  {{scope.row.type==='BUY_NEW'?'门店新开券':scope.row.type==='RENEWAL'?'门店续期券'+'('+ scope.row.duration +'年' +')':'升级'}}
                </template>
              </el-table-column>

              <el-table-column prop="brandName" align="left" label="品牌">
              </el-table-column>
              <el-table-column prop="tradeName" align="left" label="行业">
              </el-table-column>
              <el-table-column prop="version" align="left" label="版本">
                <template slot-scope="scope">
                  {{scope.row.version===1?'标准版':scope.row.version===2?'专业版':scope.row.version===3?'旗舰版':'未知'}}
                </template>
              </el-table-column>
              <el-table-column align="left" label="单价（元)">
                <template slot-scope="scope">
                  {{ '￥'+ scope.row.price}}
                </template>
              </el-table-column>

              <el-table-column prop="num" align="left" label="数量">
              </el-table-column>

              <el-table-column align="left" label="金额(元)">
                <template slot-scope="scope">
                  {{ '￥'+ scope.row.payAmount}}
                </template>
              </el-table-column>

            </el-table>
          </div>
          <el-row justify="end" type="flex" align="middle" class="dialog-box_boxtwo">
            <div>
              <p>
              <!-- <span>优惠码：</span>
              <span>AE03218</span> -->
              </p>
              <p>
                <!-- <span>优惠折扣：</span>
                <span>{{records.payTime}}</span> -->
              </p>
              <p>
                <span>{{status == 2 ? '已' : '应'}}付款：</span>
                <span>{{records.actualIncome}}</span>
              </p>
            </div>
          </el-row>
          <el-row type="flex" justify="end" class="dialog-box_boxthree">
            <!-- <el-button @click="orderVisiable=false" type="danger" size="small" v-if="status===1||status===2">立即支付</el-button> -->
            <g-button v-if='status == 3' :name="'删除'" :type="'deepGrey'" :icon="'icon_operate_delete'" @click="delOrder"
            class="btn-button">
            </g-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <g-del-model
        :delTagDialogVisible="delOrderDialog"
        @close="delOrderDialog = false"
        @confirm="delOrderConfirm"
        :title="closeData.title"
        :content="closeData.content"
        :icon="closeData.icon"
        :iconColor="closeData.iconColor"
        :confirmButton="closeData.confirm"
        :concelButton="closeData.concel"
    ></g-del-model>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
export default {
  name: 'system',
  data(){
    return {
      shopData: [],
      orderVisiable: false,
      status: null,
      infoData: [],
      payWay: '',
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 3, // 总页面
        pageSize: 10, // 每页的条数
      },
      records: {
        code: '',
        createTime: '',
        payTime: '',
        type: '',
        version: '',
        actualIncome: ''
      },
      tableLoading: false,
      delOrderDialog: false,
      closeData:{
          title: '确定要删除该条记录吗？',
          content: '删除后，将无该条记录。',
          icon: 'icon_popup_plaint',
          iconColor: '#FCB322',
          confirm: '确认',
          concel: '取消'
      },
    }
  },
  methods: {
    getOrderInfo(row) {
      this.infoData = []
      this.status = row.status
      this.payWay = row.payWay==="AlI_PAY"?'支付宝':row.payWay==='WE_CHAT'?'微信':'银行转账'
      this.infoData.push(row)
      this.records = row
      this.orderVisiable = true
    },
    rowClass({ row, rowIndex}) {
      return 'background:#EBECF0'
    },
    tableRowClassName({row, rowIndex}) {
      let n = rowIndex
        if ((n+1)%2===0) {
          return 'success-row';
        } else if (n%2===0) {
          return 'warning-row';
        }
        return '';
    },
    handleSizeChange() {

    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
      this.init();
    },
    init() {
      this.tableLoading = true
      let params = {
        pageNum: this.pages.currentPage,
        pageSize:this.pages.pageSize
      }
      axios.post(`/brandSoftOrderRecord`,params).then(res => {
        this.initRes(res)
      }).catch(err => {
        this.tableLoading = false
      })
    },
    initRes(res) {
      this.shopData = [...res.recordList]
      this.shopData.forEach(item=>{
        item.handleSuppor = item.supportedStore == 'NORMAL' ? '普通' : '供应商'
      })
      this.pages.totalCount = res.total;
      let path = {
        loading: 'tableLoading',
        time: 200
      }
      this.deplay(path)
    },
    delOrder() {
      this.delOrderDialog = true;
    },
    delOrderConfirm() {
      axios.get('/delOrder/'+ this.records.code).then(res => {
        utils.showTip(this, {
          msg: res.message,
          type: res.success ? "success" : "error"
        });
        if (res.success){
          this.orderVisiable = false;
          this.pages.currentPage = 1;
          this.init();
        }
        this.delOrderDialog = false;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    }
    // 营收类型
    // handleSuppor() {
    //   return this.shopData.supportedStore == 'NORMAL' ? '普通' : '供应商'
    // }
  }
}
</script>
<style lang="scss" scoped>
  @mixin tag($color){
    padding: 2px 8px;
    border-radius: 10px;
    background: $color;
    font-size: 12px;
    color: #fff;
  }
  .tag{
    &-one{
      @include tag(#E22C37);
    }
    &-two{
      @include tag(#A9D86E);
    }
    &-three{
      @include tag(#BEC3C6);
    }
  }
  .el-table-re{
    width: 100%;
    padding: 0 20px 20px 20px;
    border-radius: 6px;
  }
  .el-table::before {
    height: 0px;
  }
  .recorad-wrap{
    padding: 0 20px;
    padding-top: 40px;
    padding-bottom: 20px;
    width: 103%;
    height: 90%;
    overflow: hidden;
    overflow-y:auto;
    &_table{
      width: 1189px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
      border-radius: 6px;
      padding-bottom: 10px;
    }
  }
  .btn-button{
    padding: 4px 9px;
  }
  .dialog-box{
    width: 100%;
    // &-line{
    //   border-bottom: 1px solid #cdcdcd;
    //   position: absolute;
    //   width: 100%;
    //   height: 1px;
    //   left: 0;
    //   top: 67px;
    // }
    &-title{
      color: rgba(51, 51, 51, 1);
      font-size: 14px;
      font-weight: 600;
    }
    &-one{
      width: 100%;
      height: 90px;
      border: 1px solid rgba(240, 241, 244, 1);
      flex-flow:row wrap;
      margin-top: 10px;
      label{
        color: rgba(153, 153, 153, 1);
        font-size: 14px;
        display: block;
        text-align: right;
        width: 80px;
        margin-right: 22px;
      }
      p {
        width: 35%;
        padding-left:10%; 
        display: flex;
        align-items: center;
      }
      p span{
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
      }
    }
    &-two{
      width: 100%;
      padding-top: 20px;
    }
    &_boxone{
      border: 1px solid rgba(235, 236, 240, 1);
      margin-bottom: -2px;
      margin-top: 10px;
    }
    &_boxtwo{
      border: 1px solid rgba(235, 236, 240, 1);
      height: 105px;
      div{
        display: flex;
        flex-direction: column;
        padding-right: 10px;
        height: 80%;
        width: 30%;
        justify-content: space-between;
      }
      div p {
        widows: 100%;
        display: flex;
        justify-content: space-between;
        height: 30px;
        align-items: center;
        span{
          display: inline-block;
          color: rgba(102, 102, 102, 1);
          font-size: 13px;
          text-align: right;
          display: inline-block;
          width: 100px;
        }
      }
      div p:last-child{
        span:first-child{
          color: rgba(255, 109, 97, 1);
          font-size: 15px;
        }
      }
    }
    &_boxthree{
      margin-top: 20px;
    }
  }
</style>