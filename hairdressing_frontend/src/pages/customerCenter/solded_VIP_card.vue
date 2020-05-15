<template>
  <div class="page-container">
    <div class="overview">
      <div style="color:#333;">
        <span class="overview-btn">统计</span>
        <span class="c9">暂无</span>
<!--        <span class="c9">储值卡数量：</span>- 张;-->
<!--        <span class="c9">储值金总额：</span>- 元;-->
<!--        <span class="c9">赠送金总额：</span>- 元;-->
      </div>
      <input-search placeholder="请输入会员卡名称/卡号/客户姓名/手机号" style="width:340px" v-model='keyword'
                    @search="search"></input-search>
    </div>
    <div class="data-container" v-loading="loading">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentType">
          <el-tab-pane
            v-for="(item, index) in dataTypes"
            :key="index+Math.random()"
            :name="item.code"
            :label="item.value"
          ></el-tab-pane>s
        </el-tabs>
      </div>
      <div class="data-table">
        <el-table
          v-if="tableData"
          :data="tableData"
          :row-class-name="tableRowClassName"
          :span-method="spanMethod"
          style="width: 100%"
          height="calc(100vh - 275px)">
          <el-table-column
            label="卡名称"
            class-name="f_14px"
            prop="customerCardDetailInfo.cardName"
          >
          </el-table-column>
          <el-table-column
            label="卡号">
            <template slot-scope="{row}">
              <p>{{row.customerCardDetailInfo.cardNo}}</p>
              <p><span class="c9">备注卡号：</span>
                {{row.customerCardDetailInfo.storeRemarkCardNo || ''}}
                <i class="icon iconfont icon-icon_operate_edit" @click="editCardRemarkNo(row.customerCardDetailInfo.id)"></i>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="客户信息">
            <template slot-scope="{row}">
              <p><span class="table-customer_name"
                       :class="row.customerSex === '男' ? 'male' : row.customerSex === '女' ? 'female' : ''">{{row.customerCardDetailInfo.userName}}</span>
              </p>
              <p>{{row.customerCardDetailInfo.mobile}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="售价"
            v-if="currentType != 1"
            :key="Math.random()">
            <template slot-scope="{row}">
              <p>{{row.customerCardDetailInfo.cardPrice}}元</p>
            </template>
          </el-table-column>
          <template v-if="currentType == 2 || currentType == 3">
            <el-table-column
              label="项目名称"
              class-name="custom_cell border_left span"
              :key="Math.random()"
              >
              <template slot-scope="{row}">
                <p v-if="row.serviceInfo">{{row.serviceInfo.serviceName}}<span v-if="row.serviceInfo.serviceSpecificationName && row.serviceInfo.serviceSpecificationName != '默认'">-{{row.serviceInfo.serviceSpecificationName}}</span></p>
              </template>
            </el-table-column>
            <el-table-column
              label="总次数"
              class-name="custom_cell border_left span"
              :key="Math.random()"
              >
              <template slot-scope="{row}" v-if="row.serviceInfo">
                <p v-if="row.totalCountLimit">共用次数: {{ row.totalCountLimit > 0 ? row.totalCountLimit + '次' : '-'}}</p>
                <p v-else>{{row.serviceInfo.totalCountLimit ? row.serviceInfo.totalCountLimit : '无限'}}次</p>
              </template>
            </el-table-column>
            <el-table-column
              label="剩余次数"
              class-name="custom_cell border_right span"
              :key="Math.random()"
              >
              <template slot-scope="{row}" v-if="row.serviceInfo">
                <p v-if="row.totalCountLimit">剩余共用次数: {{row.countLimit}}次</p>
                <p v-else>{{row.serviceInfo.countLimit === null ? '无限' : row.serviceInfo.countLimit}}次</p>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            label="储值金余额"
            v-if="currentType == 1">
            <template slot-scope="{row}">
              <p>¥{{row.customerCardDetailInfo.rechargeMoney}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="赠送金余额"
            v-if="currentType == 1">
            <template slot-scope="{row}">
              <p>¥{{row.customerCardDetailInfo.giftMoney}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="办卡时间"
            class-name="c6"
            prop="customerCardDetailInfo.createTime">
          </el-table-column>
          <el-table-column
            label="到期时间"
            class-name="c6"
            prop="customerCardDetailInfo.finishTime">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="{row}">
              <span class="status effect" :class="judgeStatus(row.customerCardDetailInfo.status, row.finish).code">
                {{judgeStatus(row.customerCardDetailInfo.status, row.finish).value}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="{row}">
              <g-button name="详情" type="green" icon="icon_operate_eyes" @click="goDetail(row.customerCardDetailInfo)"></g-button>
              <g-button name="禁用" type="orange" icon="icon_operate_disable" @click="popDisableDialog(row.customerCardDetailInfo.id)" v-if="judgeStatus(row.customerCardDetailInfo.status, row.finish).code === 'effect'"></g-button>
              <g-button name="解禁" type="detail" icon="icon_operate_able" @click="recoverCard(row.customerCardDetailInfo.id)" v-if="judgeStatus(row.customerCardDetailInfo.status, row.finish).code === 'disabled'"></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-footer">
        <div></div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.pageSize"
            :pager-count="pages.pageNum"
            layout="total, prev, pager, next, jumper"
            :total="pages.totalCount"
          ></el-pagination>
        </div>
      </div>
      <cardDeatil :visible="visible" :info="currentCardInfo" @closeDialog="visible = false" v-if="visible"/>
      <g-dialog-with-slot
        :color="'#FF6D61'"
        :icon="'icon_popup_question'"
        :title="'确定要禁用该会员卡吗？'"
        :dialogVisible="dialogDisableVisible"
        @resolve="disableCard"
        @close="dialogDisableVisible=false"
      >
        <div>禁用后，该客户将不能使用该会员卡。</div>
      </g-dialog-with-slot>
      <!-- 编辑备注卡号 -->
      <el-dialog
        title="修改备注卡号"
        :visible.sync="dialogRemarkVisible"
        width="30%"
        :before-close="clearStoreRemarkCardNo"
      >
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="4">
            备注卡号:
          </el-col>
          <el-col :span="12">
            <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button plain class="plain_gray_btn" @click="clearStoreRemarkCardNo">取 消</el-button>
        <el-button class="normal_blue_btn" @click="confirmCardRemarkNo">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import '@/assets/css/tab.scss'
  import * as axios from '@/util/axios'
  import cardDeatil from '@/components/customerCenter/cardsDetails'
  import {mapState} from 'vuex'
  // 这是会员中心卖出的会员卡（门店内的全部客户）
  export default {
    data () {
      return {
        currentType: '1',
        loading: false,
        dataTypes: [
          {code: '1', value: '储值卡',},
          {code: '2', value: '次卡',},
          {code: '3', value: '时间卡',},
          {code: '0', value: '身份卡',}
        ],
        pages: {
          currentPage: 1, // 当前页面
          totalCount: 0, // 总条数
          pageSize: 10, // 每页的条数
          pageNum: 5, // 默认显示页面的下标数量
        },
        tableData: [],
        keyword: '',
        currentCardInfo:null,
        visible:false,
        dialogDisableVisible:false, // 禁用会员卡弹框
        dialogRemarkVisible:false,  // 备注卡号弹框
        storeRemarkCardNo:'', // 备注卡号
      }
    },
    computed:{
      params(){
        return {
          cardType:this.currentType,
          currentPage:this.pages.currentPage - 1,
          pageSize:this.pages.pageSize,
          storeId: this.currentInfo.shopId,
          keyWord:this.keyword,
        }
      },
      ...mapState({
        currentInfo: state => state.manage.currentInfo
      }),
    },
    watch:{
      'currentType'(){
        this.fetch()
      }
    },
    created(){
      this.fetch()
    },
    methods: {
      // 英文年月日转中文
      dateTrans(date){
        switch(date){
          case 'year':
            return '年'
          case 'month':
            return '月'
          default:
            return '日'
        }
      },
      fetch(isChangePage){
        // 若不是通过改变页码请求数据，则将当前页置为第一页
        if (!isChangePage) this.pages.currentPage = 1
        this.loading = true
        axios.post('/getCustomerCardInfoList', this.params).then( res => {
          this.loading = false
          this.tableData = this.setSpanProp(res.getCustomerCardInfoResponseList)
          this.pages.totalCount = res.total
          this.tableData.forEach(item=>{
            if(item.customerCardDetailInfo.finishTime){
            if(item.customerCardDetailInfo.validPermanent) {
              item.customerCardDetailInfo.finishTime = '永久有效'
            }
          } else if(item.customerCardDetailInfo.validUsedNum > 0){
            item.customerCardDetailInfo.finishTime = '使用后'+item.customerCardDetailInfo.validUsedNum+this.dateTrans(item.customerCardDetailInfo.validUnit)
          }
          })
        })
      },
      // 设置表格合并属性
      setSpanProp(data){
        const tableData = []
        let isGrey = true
        for (const a of data) {
          // 灰白交替的单元行背景色
          a.isGrey = isGrey
          isGrey = !isGrey
          // 如果是身份卡和储值卡则必定只占用一行
          if(a.customerCardDetailInfo.cardType == 0 || a.customerCardDetailInfo.cardType == 1){
            a.span = 1
            tableData.push(a)
          }else{
            for(let i=0; i<a.serviceCountInfoExtendList.length; i++){
              a.span = i === 0 ? a.serviceCountInfoExtendList.length : 0
              tableData.push({
                ...a,
                serviceInfo:a.serviceCountInfoExtendList[i]
              })
            }
          }
        }
        return tableData
      },
      search () {
        this.fetch()
      },
      goDetail(cardInfo) {
        axios.get(`/getCustomerCardDetailInfo/${cardInfo.id}`).then(res => {
          this.currentCardInfo = res
          this.visible = true
        }).catch(err => {

        })
        // this.currentCardInfo = cardInfo
      },
      // 弹框 禁用会员卡
      popDisableDialog(id){
        this.operateCardId = id
        this.dialogDisableVisible = true
      },
      // 确认禁用会员卡
      disableCard(){
        axios.post('/disableMembershipCard', {consumerCardIds:[this.operateCardId]}).then( res => {
          this.dialogDisableVisible = false
          this.fetch()
        })
      },
      recoverCard(id){
        axios.post('/recoverMembershipCard', {consumerCardIds:[id]}).then( res => {
          this.fetch()
        })
      },
      // 弹框修改备注卡号
      editCardRemarkNo(id){
        this.operateCardId = id
        this.dialogRemarkVisible = true
      },
      // 清除备注卡号
      clearStoreRemarkCardNo(){
        this.dialogRemarkVisible = false
        this.storeRemarkCardNo = ''
      },
      // 确认修改备注卡号
      confirmCardRemarkNo(){
        axios.post('/modifyStoreRemarkCardNo', {id:this.operateCardId, storeRemarkCardNo:this.storeRemarkCardNo}).then( res => {
          this.clearStoreRemarkCardNo()
          this.fetch()
        })
      },
      // 切换页码
      handleCurrentChange (val) {
        this.pages.currentPage = val
        this.fetch(true)
      },
      judgeStatus(status, finish){
        let code, value
        if(status === 1){
          code = 'disabled'
          value = '已禁用'
        }else if(finish){
          code = 'expired'
          value = '过期'
        }else{
          code = 'effect'
          value = '有效'
        }
        return {code, value}
      },
      // 表格给某行赋值class
      tableRowClassName({row}){
        return row.isGrey ? 'grey-row' : ''
      },
      // 表格合并方法
      spanMethod ({row, column}) {
        switch(this.getSpanCount(column.className)){
          case 0:
            return [row.span, 1]
          case 1:
            return [1, 1]
        }
      },
      getSpanCount(columnClassName){
        if(!columnClassName) return 0
        if(columnClassName.split(' ').includes('span')){
          return 1
        }else{
          return 0
        }
      },
    },
    components: { cardDeatil }
  }
</script>
<style lang='scss' scoped>

  .c3 {
    color: #333;
  }

  .c9 {
    color: #999;
  }

  .page-container {
    margin: 15px 20px;
  }

  .overview {
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 15px;
    font-size: 12px;
  }

  .overview-btn {
    display: inline-block;
    margin-right: 10px;
    width: 50px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    background: #58c9f3;
    font-size: 14px;
    border-radius: 4px;
  }

  .data-container {
    margin-top: 15px;
    background: #fff;
    border-radius: 8px;
  }

  .data-table {
    padding:0 10px;
    .el-table {
      font-size: 12px;
      color: #333;

      /deep/ .f_14px:not(.is-leaf){
        font-size:14px;
      }

      /deep/ .c6:not(.is-leaf){
        color:#666;
      }

      /deep/ .grey-row{
        background-color:#f4f5f7;
      }

      /deep/ .custom_cell:not(.is-leaf){
        &.border_left{
          border-left: 1px solid #ececec;
        }
        &.border_right{
          border-right: 1px solid #ececec;
        }
      }

      /deep/ .el-table__body tr:hover > td{
        background-color: transparent;
      }

      .status{
        display: inline-block;
        width: 50px;
        height:17px;
        line-height:17px;
        text-align: center;
        color:#fff;
        border-radius:12px;
        &.effect{
          background: #a9d86e;
        }
        &.expired{
          background: #707171;
        }
        &.disabled{
          background: #e22c37;
        }
      }
    }
  }

  .table-customer_name {
    background: no-repeat right center;
    background-size: 15px 15px;
    padding-right: 20px;

    &.male {
      background-image: url('../../assets/img/male_tip.png');
    }

    &.female {
      background-image: url('../../assets/img/female_tip.png');
    }
  }

  .data-footer {
    display: flex;
    justify-content: space-between;
    padding: 17px 23px;
  }

  .icon-icon_operate_edit {
    color: #58C9F3;
    cursor: pointer;
  }

</style>
