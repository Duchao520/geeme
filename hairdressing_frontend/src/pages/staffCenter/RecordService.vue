<template>
  <div id="gm_record_service" v-loading="pageLoading">
      <div class="wer_tabs" v-if="isNodata || cardData.length>0">
        <ul>
          <li v-for="(item,index) in serviceList" @click="tab(item,index)" :key="index">
            <p :class="activeIndex===index?['sort','active-sort']:['sort']">{{item.sortName}}</p>
          </li>
        </ul>
      </div>
      <!-- 右侧服务列表 -->
      <div class="wer_list" v-if="isNodata || cardData.length>0">
           <!--  筛选 -->
            <div class="search_input" >
              <input-search  :placeholder="'输入服务名'" v-model="keyword"  @search="handleSearch"></input-search>
            </div>
            <!-- <el-row type="flex" justify="center" align="middle" class="table-con default" v-if="isNodata&&serviceList.length===0">
              <search-default style="margin:10% 0" @clear-back="clearBack"></search-default>
            </el-row> -->
            <div class="service_container" v-if="cardData.length > 0">
               <!-- 服务项目列表 -->
                <div class="service_list">
                  <div class="service_item" v-for='(item,index) in cardData' :key="index">
                    <div class="service_img">
                      <img :src="utils.formatPicImg(item.image,'style',146)">
                    </div>
                    <div class="service_msg">
                        <p class="name">{{item.simpleTitle}}</p>
                        <p class="price">{{'￥ '+item.memberPrice}}<S> {{item.shopPrice}} </S></p>
                    </div>
                  </div>
                </div>
            </div>
            <el-row  type="flex" justify="center" align="middle" class="table-con default" v-if="isNodata && cardData.length===0">
              <search-default style="margin:10% 0" @clear-back="clearBack"></search-default>
            </el-row>
      </div>
      <div type="flex" class="empty" style="color:#999999" v-if="cardData.length===0 && !isNodata">
        <g-nolist :img='noservicelist' :tip="'这个人很懒，没有留下任何服务...'" :btnname="'新增服务'"
          :btnurl="'/shop-inner/service-add'" :showBtn='currentEntry == "shop" ? true: false' @todo="toCreate"></g-nolist>
        <!-- 这个人很懒，没有留下任何服务... -->
      </div>
    </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import util from "@/util/base.js";
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
import * as datas from "@/assets/js/datas";
import { mapState } from "vuex";
export default {
  name:'GmRecordService',
  data(){
    return{
      noservicelist: datas.defaultImg.noservicelist,
      serviceKind:[],
      activeIndex:0,
      serviceList:[],
      state:'',
      text:'',
      utils: utils,
      cardData: [],
      keyword: '',
      pageLoading: false,
      isNodata: false,
      staffId: this.$route.params.staffId,
      levelId: null,
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  mounted(){
    this.getStaffInfo()
  },
  methods:{
    tab(item,index) {
      this.cardData = [...item.services]
      this.activeIndex = index;
    },
    // 输入自动检索
    handleSearch:util.debounce(function(text) {
      this.keyword = text[0]
      this.isNodata = true
      this.init()
    }),
    createFilter(queryString) {
      return (service) => {
        return (service.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getStaffInfo() {
      axios.post('/getStaffBaseInfo',{brandId: this.currentInfo.brandId,staffId:this.staffId}).then((res) => {
        if (res.staffInfo) {
          this.levelId = res.staffInfo.levelId
          this.init();
        }
      })
    },
    init() {
      this.pageLoading = true
      let params = {
        keyword: this.keyword,
        levelId: this.levelId,
        storeId: this.currentInfo.shopId
      }
      axios.post('/getStaffAvailableService',params).then(res => {
        this.serviceList = [...res.serviceInfoList]
        if(this.serviceList.length>0) {
          let data = {
            services: [],
            sortName: '全部'
            }
          this.serviceList.forEach(item => {
            item.services.forEach(arr => {
              data.services.push(arr)
            })
          })
          this.serviceList.unshift(data)
          if(this.serviceList[0]) {
            this.cardData = this.serviceList[0].services
          } else {
            this.cardData = []
          }
        } else {
          this.cardData = [];
          this.serviceList = [];
          let data = {
            services: [],
            sortName: '全部'
          }
          this.serviceList.push(data);
        }
        this.pageLoading = false
      }).catch(err => {
        this.pageLoading = false
      })
    },
    clearBack() {
      this.keyword = ''
      this.isNodata = false
      this.init()
    },
    toCreate(url) {
      this.$router.push(url);
    }
  }
}
</script>

<style lang="scss" scoped>
    .table-con{
      background: #fff;
      margin-top: 20px;
      width: 80%;
      min-height: calc(100vh - 346px);
    }
    #gm_record_service{
      display: flex;
      min-height: calc(100vh - 130px)
    }
    .wer_tabs{
      margin-right:15px;
      color: #A5A5A5;
      font-size:16px;
      width: 170px;
      padding-top:52px;
      border-radius:6px;
      ul{
        li{
          cursor: pointer;
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
          .sort{
            border-bottom: 3px solid transparent;
            line-height: 32px;
            transition: all 0.6s;
          }
          .active-sort{
            border-bottom: 3px solid #E6333F;
            color: #E6333F;
          }
        }
      }
    }
    .wer_list{
      flex:1;
    }
    .search_input{
      margin:20px 0;
    }
 .service_item{
    display:inline-block;
    margin:0 20px 20px 0;
    cursor:pointer;
    box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
    background:#fff;
    width: 170px;
    border-radius: 8px;
    .service_img{
      img{
        width:100%;
        height:170px;
        border-radius:6px 6px 0px 0px;
      }
   }
   .service_msg{
    width:100%;
    // height:44px;
    padding:15px;
    border-radius:0px 0px 6px 6px;
    .name{
      font-size:16px;
      color:#3A3A3A;
      font-weight:500;
    }
    .price{
      color:#E22C37;
      font-weight:500;
      font-size:14px;
      margin-top:5px;
      S{
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
        padding-left: 5px;
      }
    }
   }
 }
 .empty{
  width: 100%;
  padding: 62px 75px;
 }
</style>
