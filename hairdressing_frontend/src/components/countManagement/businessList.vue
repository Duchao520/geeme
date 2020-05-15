<template>
  <div>
    <div class="filter-container">
      <div class="filter-l1">
        <div>
          <el-radio-group class="btn-group" v-model="lastDays">
            <el-radio-button :label="1">今天</el-radio-button>
            <el-radio-button :label="3">近3天</el-radio-button>
            <el-radio-button :label="7">近7天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            :clearable="false"
            style="margin-left:10px;"
            v-model="date"
            unlink-panels
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <input-search placeholder="客户姓名/手机号/员工姓名/服务单号" style="width:290px" v-model='keyword'
                      @search="search"></input-search>
      </div>
      <div class="filter-l2">
        <div class="filter-condition-container">
          <div v-if="currentEntry === 'brand'" bind="test" class="filter-condition">
            <span>选择门店：</span>
            <el-select v-model="filter.storeId">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="store in storeOptions" :key="store.storeId" :label="store.storeName" :value="store.storeId"></el-option>
            </el-select>
          </div>
          <div class="filter-condition">
            <span>消费类型：</span>
            <el-select v-model="filter.consumerType">
              <el-option
                v-for="(item,index) in [{name:'全部',value:0}, {name:'产品',value:1}, {name:'服务',value:2}, {name:'卡项',value:3}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-condition">
            <span>支付方式：</span>
            <el-select v-model="filter.payType">
              <el-option
                v-for="(item,index) in [{name:'全部',value:0},{name:'微信',value:1},{name:'支付宝',value:2},{name:'现金',value:3},{name:'储值卡',value:4},{name:'次卡',value:6},{name:'时间卡', value:7},{name:'余额支付', value:8},{name:'自定义',value:5}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-condition">
            <span>归属部门：</span>
            <el-select v-model="test1" placeholder="全部" @change="test()">
              <el-option
                v-for="(item,index) in [{name:'全部',value:-1}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
<!--          <div class="filter-condition">-->
<!--            <span>预约指定：</span>-->
<!--            <el-select v-model="filter.appoint">-->
<!--              <el-option-->
<!--                v-for="(item,index) in [{name:'全部',value:0},{name:'非指定',value:1},{name:'预约',value:2},{name:'指定',value:3},]"-->
<!--                :key="index"-->
<!--                :label="item.name"-->
<!--                :value="item.value"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </div> -->
          <div class="filter-condition">
            <span>客户性别：</span>
            <el-select v-model="filter.sex">
              <el-option
                v-for="(item,index) in [{name:'全部',value:0},{name:'男',value:1},{name:'女',value:2},{name:'保密',value:3},]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-condition">
            <span>操作人：</span>
            <el-select v-model="test1" placeholder="全部" @change="test()">
              <el-option
                v-for="(item,index) in [{name:'全部',value:-1}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="filter-actions">
          <el-button class="normal_blue_btn" size='medium' @click="fetch">查询</el-button>
          <span class="condition-clear" @click="initFilter">清空条件</span><br>
        </div>
      </div>
    </div>
<!--        <div class="overview">-->
<!--          <el-button class="normal_blue_btn" size='mini'>统计</el-button>-->
<!--          服务单：<span>1088张；</span>-->
<!--          劳动业绩：<span>1088张；</span>-->
<!--          现金业绩：<span>1088张；</span>-->
<!--          产品业绩：<span>1088张；</span>-->
<!--          储值卡开卡/续卡：<span>1088张；</span>-->
<!--          次卡开卡：<span>1088张；</span>-->
<!--          时间卡开卡：<span>1088张；</span>-->
<!--          身份卡开卡/续卡：<span>1088张；</span>-->
<!--          <span class="btn-detail">查看明细</span>-->
<!--        </div>-->

    <!-- 营业流水 - 统计业绩 -->
    <PerformanceComp :filterTime="filterTime" :filterData="filterData" :details="true"/>

    <div class="data-container" v-loading="loading">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentType">
          <el-tab-pane
            v-for="(item, index) in dataTypes"
            :key="index+Math.random()"
            :name="item.status"
            :label="item.value"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="data-table">
        <el-table
          v-if="tableData"
          :span-method="spanMethod"
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 400px)">
          <el-table-column
            label="服务单号"
            class-name="custom_cell border_left span_1"
            width="200px"
            prop="serviceOrderCode">
            <template slot-scope="{row}">
              <p>{{row.serviceOrderCode}}</p>
              <p v-if="row.paperOrderId">纸单号: {{row.paperOrderId}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="时间"
            class-name="span_1"
            width="150px"
            prop="serviceTime">
          </el-table-column>
          <el-table-column
            label="客户"
            class-name="span_1">
            <template slot-scope="{row}">
              <p><span class="table-customer_name"
                       :class="row.customerSex === '男' ? 'male' : row.customerSex === '女' ? 'female' : ''">{{row.customerName}}</span>
              </p>
              <p>{{row.customerMobile}}</p>
              <p><span class="table-customer_level">{{row.customerLevel}}</span></p>
            </template>
          </el-table-column>
          <el-table-column
            label="计客数"
            class-name="span_1"
            >
            <template slot-scope="scope">{{scope.row.countCustomer ? '计' : '不计'}}</template>
          </el-table-column>
          <el-table-column
            label="消费总额"
            class-name="span_1"
            >
            <template slot-scope="{row}">¥{{row.totalReceived}}</template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--            label="入账明细">-->
          <!--            <template slot-scope="scope">-</template>-->
          <!--          </el-table-column>-->
          <el-table-column
            label="消费项目/产品/卡项/其他"
            class-name="custom_cell border_left span_2">
            <template slot-scope="{row}">
              <p>{{row.serviceName || row.productName || row.cardName || '-'}}<span v-if="row.specificationName && row.specificationName != '默认'">-{{row.specificationName}}</span></p>
            </template>
          </el-table-column>
          <el-table-column
            label="实收金额"
            class-name="custom_cell span_2">
            <template slot-scope="{row}">
              <p>¥{{row.received || 0}}</p>
              <p class="c9">{{row.payType|payTypesFilter}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="门店业绩"
            v-if="currentType === '已结单'"
            :key="Math.random()"
            class-name="custom_cell span_2">
            <template slot-scope="{row}">
              <p>¥{{row.orderPerformance || 0}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="门店现金业绩"
            v-if="currentType === '已结单'"
            :key="Math.random()"
            class-name="custom_cell span_2">
            <template slot-scope="{row}">
              <p>¥{{row.orderCashPerformance || 0}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="员工"
            class-name="custom_cell border_left">
            <template slot-scope="{row}">
              <p>{{row.staffName || '-'}}</p>
              <p v-if="row.postName" class="c9">{{row.postName}}</p>
              <p v-if="row.workStation" class="c9">工位{{row.workStation}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="业绩"
            class-name="custom_cell">
            <template slot-scope="{row}">
              <p>¥{{row.laborPerformance || row.productSalesPerformance || row.cardSalesPerformance || 0}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="预约/指定"
            class-name="custom_cell"
            width="80px">
            <template slot-scope="{row}">
              <p>{{row.appoint == 1 ? '指定' : '非指定'}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="撤单时间"
            class-name="custom_cell border_left span_1"
            v-if="currentType === '已撤单'"
            :key="Math.random()"
            prop="rescindTime">
          </el-table-column>
          <el-table-column
            label="操作人"
            class-name="custom_cell border_left span_1"
            v-if="currentType === '已撤单'"
            :key="Math.random()">
            <template slot-scope="{row}">
              <p>{{row._operator}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="撤单原因"
            class-name="custom_cell border_left border_right span_1"
            v-if="currentType === '已撤单'"
            :key="Math.random()"
            prop="rescindReason">
          </el-table-column>
          <el-table-column
            label="提成"
            class-name="custom_cell"
            v-if="currentType === '已结单'"
            :key="Math.random()">
            <template slot-scope="{row}">
              <p>¥{{row.commission || 0}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="对单"
            class-name="span_1"
            v-if="currentType === '已结单'">
            <template slot-scope="{row}">
              <p v-if="row.matchStatus">
                <span class="tags">已 对</span>
              </p>
              <g-button 
                v-if="row.matchStatus === 0"
                :name="'对单'" 
                :type="'orange'" 
                :icon="'icon_order_hedui1'"
                @click="matchOrder(row.consumerOrderId)"
              ></g-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作人"
            class-name="span_1"
            v-if="currentType === '已结单'"
            :key="Math.random()"
            >
            <template slot-scope="{row}">
              <p style="text-align: center;margin-bottom:5px" :title="row._operator">{{row._operator}}</p>
              <div style="text-align: center;">
                <g-button 
                  :name="'详情'" 
                  :type="'green'" 
                  :icon="'icon_operate_eyes'"
                  @click="getOrderInfo(row.consumerOrderId)"
                ></g-button>
                <!-- <g-button :name="'撤单'" :type="'delete'" :icon="'icon_ope_revoke'" @click="test(row)"></g-button> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-footer">
        <div class="actions">
          <!--          <g-button-->
          <!--            class="button"-->
          <!--            :name="'导出Excel'"-->
          <!--            :padding="'5px 15px'"-->
          <!--            :type="'mgreen'"-->
          <!--            :icon="''"-->
          <!--            @click="test"-->
          <!--          ></g-button>-->
        </div>
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
    </div>
    <ServiceOrderDetail :infoVisible="showOrderInfo" :detail="orderInfo" @handleClose="showOrderInfo=false"/>
  </div>
</template>

<script>
  import '@/assets/css/tab.scss'
  import * as axios from '@/util/axios'
  import ServiceOrderDetail from '@/components/order/billDetail/ServiceOrderDetail'
  import PerformanceComp from '@/components/statistics_line/performance'
  import {mapState} from 'vuex'

  export default {
    name: 'businessList',
    data () {
      return {
        lastDays: 1,
        filter: { // 过滤条件
          consumerType: 0,
          payType: 0,
          appoint: 0,
          sex: 0,
          staffId: 0,
          storeId: null,
        },
        keyword: '',
        date: [],
        test1: '',
        currentType: '已结单',
        dataTypes: [
          {status: '已结单', value: '流水总账'},
          {status: '已撤单', value:'撤单明细'},
          // {code:'', value:'项目明细'},
          // {code:'', value:'产品明细'},
          // {code:'', value:'卡项明细'},
          // {code:'', value:'其他明细'},
        ],
        tableData: [],
        pages: {
          currentPage: 1, // 当前页面
          totalCount: 0, // 总条数
          pageSize: 10, // 每页的条数
          pageNum: 5, // 默认显示页面的下标数量
        },
        loading: false,
        orderInfo: {}, // 小票信息
        showOrderInfo: false, // 弹出小票信息
        // payTypes:['微信', '支付宝','现金','储值卡','自定义','次卡','时间卡', '', '余额支付'],
        storeOptions:[],  // 品牌下的门店列表
      }
    },
    computed: {
      params () {
        const params = {
          beginDay: this.date[0] || null,
          endDay: this.date[1] || null,
          brandId: this.currentInfo.brandId,
          lastDays: this.lastDays || null,
          pageNum: this.pages.currentPage - 1,
          pageSize: this.pages.pageSize,
          searchKey: this.keyword || null,
          status:this.currentType,
          ...this.filter,
        }
        if(this.currentEntry !== 'brand') params.storeId = this.currentInfo.shopId
        return params
      },
      // 统计用的时间
      filterTime() {
        let today = new Date().format('yyyy-MM-dd')
        if (this.lastDays === 1) {
          return {
            beginDay: today,
            endDay: today,
          }
        } else if (this.lastDays === 3) {
          let lastDay = new Date(+(new Date()) - (8.64e7 * 2)).format('yyyy-MM-dd')
          return {
            beginDay: lastDay,
            endDay: today,
          }
        } else if (this.lastDays === 7) {
          let lastDay = new Date(+(new Date()) - (8.64e7 * 6)).format('yyyy-MM-dd')
          return {
            beginDay: lastDay,
            endDay: today,
          }
        } else if (this.date.length) {
          return {
            beginDay: new Date(this.date[0]).format('yyyy-MM-dd'),
            endDay: new Date(this.date[1]).format('yyyy-MM-dd'),
          }
        } else {
          return {}
        }
      },
      filterData() {
        return { shopIdInBrand: this.filter.storeId }
      },
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        currentEntry: state => state.authRouter.currentEntry,
      }),
    },
    watch: {
      'lastDays' (n) {
        if (n) {
          this.date = []
          this.fetch()
        }
      },
      'date' (n) {
        if (n && n.length) {
          this.lastDays = null
          this.fetch()
        }
      },
      'currentType'(n){
        this.fetch()
      }
    },
    mounted () {
      if(this.currentEntry === 'brand'){
        this.getStores()
      }
      this.fetch()
    },
    methods: {
      // 获取门店列表
      getStores(){
        axios.get(`/getStoreListByBrandId/${this.currentInfo.brandId}`).then(res => {
          this.storeOptions = res.storeBasicInfoList
        })
      },
      // 获取数据
      fetch (isChangePage) {
        // 若不是通过改变页码请求数据，则将当前页置为第一页
        if (!isChangePage) this.pages.currentPage = 1
        this.loading = true
        axios.post(`/getConsumerOrderPerformanceList`, this.params).then(res => {
          this.loading = false
          this.tableData = this.setSpanProp(res.listConsumerOrderPerformance)
          console.log(this.tableData)
          this.pages.totalCount = res.total
        })
      },
      matchOrder(orderId) {
        axios.get(`/matchConsumerOrder/${orderId}`).then(res => {

        }).catch(err => {

        }).then(this.fetch)
      },
      // 设置表格合并属性
      setSpanProp(data){
        const tableData = []
        let item, staffItem
        let isGrey = true
        for (const a of data) {
          // 灰白交替的单元行背景色
          a.isGrey = isGrey
          isGrey = !isGrey
          a._operator = a.staffName // staffName属性与后面合并过来的staffName重复，作个区分
          delete a.staffName
          // 将每项中的服务、产品、卡项合成一个列表，方便后续处理
          a._list = [...a.listServiceOrderPerformance || [], ...a.listProductOrderPerformance || [], ...a.listCardOrderPerformance || []]
          if (a._list.length) {
            for (let i = 0; i < a._list.length; i++) {
              // 以员工数量为基本行，计算员工数量决定合并的行数
              if(i === 0){
                a.span_1 = 0
                for(const v of a._list){
                  a.span_1 += v.listOrderStaffPerformance.length || 1 // 无员工也至少应该合并消费项目本身的一行
                }
                // 接下来数行都被合并了，所以a.span_1为0
              }else{
                a.span_1 = 0
              }
              item = a._list[i]
              if (item.listOrderStaffPerformance.length) {
                for (let j = 0; j < item.listOrderStaffPerformance.length; j++) {
                  a.span_1 = j === 0 ? a.span_1 : 0
                  a.span_2 = j === 0 ? item.listOrderStaffPerformance.length : 0
                  staffItem = item.listOrderStaffPerformance[j]
                  tableData.push({
                    ...a,
                    ...item,
                    ...staffItem
                  })
                }
              } else {
                a.span_2 = 1
                tableData.push({
                  ...a,
                  ...item
                })
              }
            }
          } else {
            a.span_1 = 1
            a.span_2 = 1
            tableData.push(a)
          }
        }
        return tableData
      },
      // 清空条件
      initFilter () {
        for (const k in this.filter) {
          if(k === 'storeId'){
            this.filter[k] = null
          }else{
            this.filter[k] = 0
          }
        }
        this.fetch()
      },
      // 搜索关键词时清空条件
      search () {
        this.initFilter()
      },
      // 切换页码
      handleCurrentChange (val) {
        this.pages.currentPage = val
        this.fetch(true)
      },
      getOrderInfo (id) {
        this.loading = true
        axios.get('/getConsumerOrderInfoById/' + id).then(res => {
          this.loading = false
          this.orderInfo = res
          this.showOrderInfo = true
        })
      },
      // 表格合并方法
      spanMethod ({row, column}) {
        switch(this.getSpanCount(column.className)){
          case 0:
            return [1, 1]
          case 1:
            return [row.span_1, 1]
          case 2:
            return [row.span_2, 1]
        }
      },
      getSpanCount(columnClassName){
        if(!columnClassName) return 0
        if(columnClassName.split(' ').includes('span_1')){
          return 1
        }else if(columnClassName.split(' ').includes('span_2')){
          return 2
        }else{
          return 0
        }
      },
      // 表格给某行赋值class
      tableRowClassName({row}){
        return row.isGrey ? 'grey-row' : ''
      },
      test(){
        console.log('bind')
      }
    },
    filters: {
      payTypesFilter(type) {
        let map = {
          0: '微信',
          1: '支付宝',
          2: '现金',
          3: '储值卡',
          4: '自定义',
          5: '次卡',
          6: '时间卡',
          8: '余额支付',
        }
        return map[type]
      }
      
    },
    components: {
      ServiceOrderDetail,
      PerformanceComp
    }
  }
</script>

<style lang='scss' scoped>

  .c3 {
    color: #333;
  }

  .c6 {
    color: #666;
  }

  .c9 {
    color: #999;
  }

  .filter-container {
    padding: 15px;
    background: #fff;
  }

  .filter-l1 {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .btn-group {
      /deep/ .el-radio-button__inner {
        width: 70px;
        height: 35px;
        line-height: 35px;
        padding-top: 0;
        padding-bottom: 0;
      }

      /deep/ .el-radio-button.is-active {
        .el-radio-button__inner {
          background: #58C9F3;
          border: none;
        }
      }
    }

    /deep/ .el-input__icon,
    /deep/ .el-input__inner {
      height: 35px;
      line-height: 35px;

      .el-range-separator {
        line-height: 28px;
      }
    }
  }

  .filter-l2 {
    position: relative;
    display: flex;
    justify-content: space-between;

    .filter-condition-container {
      margin-right: 217px;

      .filter-condition {
        display: inline-block;
        margin-top: 10px;
        margin-right: 20px;
        font-size: 14px;

        > span {
          display: inline-block;
          width: 70px;
          text-align: right;
        }

        /deep/ .el-input__icon {
          line-height: 35px;
        }

        /deep/ .el-input__inner {
          width: 150px;
          height: 35px;
          line-height: 35px;
        }
      }
    }

    .filter-actions {
      position: absolute;
      top: 10px;
      right: 0;
      width: 217px;
      padding-left: 25px;
      font-size: 14px;
      border-left: 1px solid #F0F1F4;

      .condition-clear {
        margin-left:20px;
        color: #999;
        cursor: pointer;
      }

      .el-button {
        width: 71px;
      }
    }
  }

  .overview {
    margin-top: 15px;
    padding: 13px 15px;
    background: #fff;
    color: #999;
    font-size: 12px;

    .el-button {
      margin-right: 10px;
      width: 50px;
      height: 24px;
      line-height: 24px;
      padding: 0;
    }

    span {
      color: #333;

      &.btn-detail {
        color: #58c9f3;
        cursor: pointer;
      }
    }
  }

  .data-container {
    margin-top: 15px;
    background: #fff;
    border-radius:8px;
  }

  .data-table {
    .el-table {
      font-size: 12px;
      color: #333;

      /deep/ .grey-row{
        background-color:#f4f5f7;
      }

      /deep/ .cell {
        font-size: 14px;
      }

      /deep/ .custom_cell:not(.is-leaf){
        &.border_left{
          border-left: 1px solid #ececec;
        }
      }

      /deep/ .el-table__body tr:hover > td{
        background-color: transparent;
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

    .table-customer_level {
      padding: 2px 5px;
      border-radius: 10px;
      background-color: #9da8cc;
      color: #fff;
      font-size: 10px;
    }
  }

  .data-footer {
    display: flex;
    justify-content: space-between;
    padding: 17px 23px;
  }

  .tags {
    padding: 2px 7px;
    font-size: 12px;
    border-radius: 10px;
    color: #ffffff;
    background: #A9D86E;
  }
</style>
