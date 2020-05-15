<template>
  <div id="gm_record_rate" v-loading="pageLoading">
    <!-- 总评分 -->
    <div class="total_score" v-if='serverData.length > 0'>
      <span>总体评分：</span>
      <el-rate v-model="value" disabled show-score text-color="#E9AC44" score-template="{value}分"></el-rate>
    </div>
    <!-- 具体评论列表 -->
    <div class="rate_list" v-if='serverData.length > 0'>
      <div class="rate_item_area" v-for="(item,index) in serverData" :key="index">
        <div class="client_header">
          <img :src="formatPicImage(item.headPortrait, 'circle', 160, 'someone')">
          <p style="color:#666666" v-text="item.nickName"></p>
        </div>
        <div class="rate_item">
          <div class="rate_info">
            <span class="title">服务项目：</span>
            <div class="product">
              <img :src="formatPicImage(item.serviceImg,'style',70)" class="img-title">
              <div class="text">
                <p class="detail" v-text="item.serviceTitle"></p>
                <p class="price">￥{{item.servicePrice}}</p>
              </div>
            </div>
          </div>
          <el-row type="flex" class="rate_main">
            <p class="title">评论正文：<span class="main_time" v-text="item.createTime"></span></p>
            <div class="rate_main_content">
              <p class="main_text" v-text="item.content">
              </p>
              <div class="main_img_list">
                <img v-for="(img, index) in item.images" :src="formatPicImage(img,'style',146)" :key="index">
              </div>
            </div>
          </el-row>
          <div class="rate_main" style="margin-top:15px;" v-if="item.reply">
            <p class="title">商家回复：<span class="main_time" v-text="item.replyTime"></span></p>
            <div class='rate_main_content'>
              <p class="main_text" v-text="item.replyContent">
              </p>
              <!-- <p class="reply_time">30天后追评</p>
              <p class="main_text">
                还要多远才能进入你的心，还要多久才能和你接近，咫尺远近却无法靠近的那个人，也等着和你相遇，环游的行星 怎么
                可以拥有你
              </p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
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
      v-if='pages.totalCount'
    ></el-pagination>
    <div class="empty" style="color:#999999" v-if='serverData.length <= 0'>
      <g-nolist :img='noservicelist' :tip="'该员工暂无服务评价哦～'" :showBtn='false'></g-nolist>
    </div>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as utils from '@/assets/js/utils'
import * as axios from '@/util/axios'
import * as datas from "@/assets/js/datas";
export default {
  name: "GmRecordRate",
  data() {
    return {
      value: 0,
      serverData: [],
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 10, // 每页的条数
        pageNum: 10, // 默认显示页面的下标数量
      },
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      pageLoading: false,
      noservicelist: datas.defaultImg.noservicelist,
      staffId: this.$route.params.staffId,
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.pageLoading = true
      let params = {
        pageNum: this.pages.currentPage,
        pageSize: this.pages.pageSize,
        serverId: this.staffId
      }
      axios.post(api.getStaffAssessmentList.URL,params).then(res => {
        console.log(res)
        if( res.staffAssessmentList ) {
          this.pages.totalCount = res.total
          this.serverData = res.staffAssessmentList;
          if (res.avgScore || res.avgScore == 0) {
            this.value = res.avgScore;
          }
        }
        this.pageLoading = false
      })
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
      this.init();
      console.log(`当前页: ${val}`);
    },
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
#gm_record_rate {
  background-color: #fff;
  padding: 0 100px 0 70px;
  border-radius:6px;
  height: calc(100vh - 130px);
  .rate_list{
    height: calc(100% - 140px);
    overflow-y: auto;@include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  }
  .pagination{
    padding-top: 20px;
    padding-right: 20px;
  }
}
.total_score {
  color: #3a3a3a;
  display: flex;
  font-size: 16px;
  padding: 34px 0 45px 0;
}
.client_header {
  text-align: center;
  margin-right: 28px;
  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
  }
  p {
    font-size: 14px;
    color: #3a3a3a;
  }
}
.empty{
  padding-top: 210px;
}
.rate_item_area {
  margin-bottom: 20px;
  display: flex;
  border: 1px solid #e3e6ed;
  box-sizing: border-box;
  padding:20px;
  border-radius:6px;
  font-size:14px;
}
.rate_item {
  flex: 1;
  .title{
    color: #666666;
  }
  .rate_info {
    padding: 10px 0;
    display: flex;
    .product{
      display: flex;
      width:297px;
      border:1px solid #FF6D61;
      border-radius:8px;
      padding: 10px;
      .img-title{
        display: block;
        width: 70px;
        height: 70px;
        border-radius:7px;
      }
      .text{
        margin-left:10px;
        line-height: 17px;
        color:#333333;
        width: 72%;
        .price{
          color:#FF6D61;
          line-height: 28px;
        }
      }

    }
  }
  .rate_main {
    display: flex;
    font-size: 14px;
    line-height: 24px;
    flex-direction: column;
    &_content{
      margin-left: 68px;
    }
    // div {
    //   flex: 1;
    // }
    .main_img_list {
      padding-top: 10px;
      img {
        width: 110px;
        height: 110px;
        margin-right: 4px;
      }
    }
    .main_time {
      color: #9b9b9b;
    }
    .reply_time {
      color: #e6333f;
      margin: 15px 0;
    }
  }
}
</style>
