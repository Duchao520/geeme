<template lang="pug">
  section.server-wrap
    .card-modules
      g-card(
        :list="cardList"
      )
    .table-modules.p-modules
      table-server( :tableData="serviceRecordsData.tableData" )
    .client-modules.p-modules
      .title 客户端展示
      .client-box
        .sub-title 擅长
        el-row(type="flex" align="middle")
          txt-list(
          v-if='serviceRecordsData.skillNames && serviceRecordsData.skillNames.length > 0'
          :list="serviceRecordsData.skillNames"
          )
          span.txt(v-else) 暂无数据
      .client-box
        .sub-title 签名
        el-row(type="flex" align="middle")
          span.txt(v-text="serviceRecordsData.sign ? serviceRecordsData.sign: '暂无签名'")
      .client-box
        .sub-title 简介
        el-row(type="flex" align="middle")
          span.txt(v-text="serviceRecordsData.personalProfile? serviceRecordsData.personalProfile: '暂无简介'")
      //- .client-box
      //-   .sub-title 获奖经历
      //-   express-list(
      //-     :list="expressList"
      //-   )
      //- .client-box
      //-   .sub-title 从业经历
      //-   express-list(
      //-     :list="expressList"
      //-   )
      //- .client-box
      //-   .sub-title 学习经历
      //-   express-list(
      //-     :list="expressList"
      //-   )
      .client-box
        .sub-title 形象相册
          .photos(v-if='serviceRecordsData.photos.length>0')
            img(
              v-for='(item,key) in serviceRecordsData.photos' :src="item"
            )
          el-row(v-else)
            span.txt 暂无形象相册
</template>
<script>
import ServerTable from '@/components/staff/table-server'
import TxtList from '@/components/staff/txt-list'
import ExpressList from '@/components/staff/express-list'
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
import { mapState, mapActions } from "vuex";
// 此页面为服务档案
export default {
  data() {
    return {
      expressList: [
        {
          time: '2014年10月',
          txt: '上海最佳发型师称号'
        }, {
          time: '2014年10月',
          txt: '上海最佳发型师称号'
        }
      ],
      serviceRecordsData: {},
      cardList: [
        {
          url: '#',
          img: require('../../../static/images/staff/icon_staff_fuwu.png'),
          title: '服务客数',
          count: '0'
        },
        {
          url: '#',
          img: require('../../../static/images/staff/icon_staff_zuoping.png'),
          title: '作品数',
          count: '0'
        },
        {
          url: '#',
          img: require('../../../static/images/staff/icon_staff_pingjia.png'),
          title: '评价数',
          count: '0'
        },
        {
          url: '#',
          img: require('../../../static/images/staff/icon_staff_score.png'),
          title: '评价得分',
          count: '0'
        }
      ],
      staffId: this.$route.params.staffId
    }
  },
  components: {
    'table-server': ServerTable,
    'txt-list': TxtList,
    'express-list': ExpressList
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 获取服务档案接口
      axios.get('/getStaffServiceRecord/'+this.staffId).then(res => {
        this.initRes(res)
      })
    },
    initRes(res) {
      this.serviceRecordsData = res
      this.cardList[0].count = res.serviceCustomerNum ? res.serviceCustomerNum : 0;
      this.cardList[1].count = res.dynamicNum ? res.dynamicNum: 0
      this.cardList[2].count = res.assessmentNum ? res.assessmentNum : 0
      this.cardList[3].count = res.avgScore ? res.avgScore : 0
    },
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry,
      currentInfo: state => state.manage.currentInfo
    }),
  }
}
</script>

<style lang="scss" scoped>
.server-wrap{
  .photos{
    img{
      width: 148px;
      height: 148px;
      float: left;
      border-radius: 6px;
      margin-right: 6px;
      margin-top: 12px;
    }
  }
}
</style>
