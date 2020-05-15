<template>
  <div class="choose-person-page" v-loading="pageLoading">
    <choose-person-header 
      :list="levelList" 
      :superLevel="Number(currentLevelId)"
      @onChangeLevelId="handleChangeLevelId"
    />
    <div class="choose-person-body">
      <div class="choose-person-container">
        <div class="controler-line">
          <div class="search-box">
            <input-search 
              v-model="keyword"
              @search="getPersonList"
              :placeholder="'输入首字母可检索'"
            />
            <el-button 
              size="medium"
              class="normal_red_btn"
              @click="hangleNoPeople"
            >跳过选择</el-button>
          </div>
        </div>
        <div class="person-main scrollbar">
          <!-- 无员工 -->
          <g-nolist 
            v-if="showDefault"
            btnname="新增员工"
            tip="该分类还没有开单人，赶快新增一个"
            img="/static/images/default/bg_staff.png" 
            @todo="toCreateStaff"
          />
          <!-- 有员工 -->
          <div class="person-list" v-if="personList.length">
            <div class="single-person" 
              v-for="staff in personList" 
              :key="staff.staffId"
              @click="toChooseStaff(staff)"
            >
              <div 
                class="img" 
                :style="{backgroundImage:`url(${formatPicImage(staff.headPortrait, 'style', 146, 'someone', staff.sex)})`}"
              >
              </div>
              <div class="detail">
                <span class="name">
                  {{ staff.name }} 
                  <span v-if="staff.shopNum">({{staff.shopNum}})</span>
                </span>
                <span class="job" :title="staff.levelName">{{ staff.levelName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import choosePersonHeader from './components/page1/header';
export default {
  data () {
    return {
      pageLoading: false,

      keyword: '',
      levelList: [], // 职级
      personList: [], // 员工
      showDefault: false, // 职级下无员工时, 展示默认图片

      currentLevelId: null, // 导航栏激活的职级id
      formatPicImage: utils.formatPicImage // 有尺寸的图片处理
    }
  },
  created() {
    this.init()
    this.currentLevelId = Number(this.currentInfo.cpLevelId) // vuex，如果是有的 说明从下个页面返回或者刷新
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "saveStaffInfo", "setBillOrigin"]),
    init() {
      this.getLevelList()
      this.getPersonList()
    },
    // 头部职级列表
    async getLevelList() {
      let res = await axios.get(`/getStaffLevelListByStoreId/${this.currentInfo.shopId}`)
      this.levelList = res.staffLevelList
    },
    // 内容区员工列表
    getPersonList() {
      let params = {
        keyWord: this.keyword,
        storeId: this.currentInfo.shopId,
        levelId: this.currentInfo.cpLevelId || null,
        availableIn30min: this.currentInfo.cpTimeChecked,
      }
      this.pageLoading = true
      axios.post('/getStaffListByStoreIdAndLevelIdAndFilter', params).then(res => {
        this.showDefault = !res.staffInfos
        this.personList = res.staffInfos || []
      }).then(() => {
        this.pageLoading = false
      })
    },
    // 选择开单人，前往开单
    toChooseStaff(staff) {
      console.log(staff)
      this.saveStaffInfo(staff)
      this.saveCurrentInfo({cpLevelId: staff.levelId})
      this.$router.push("/shop-inner/choose-service")
    },
    // 没有选择开单人，前往开单
    hangleNoPeople() {
      let staff = {
        id: null,
        userId: null,
        levelId: null,
        name: '',
        levelName: '',
        headPortrait: '',
        sex: '',
        shopNum: '',
      }
      this.toChooseStaff(staff)
    },
    // 切换职级, 请求员工数据
    handleChangeLevelId(levelId) {
      this.currentLevelId = Number(levelId)
      this.saveCurrentInfo({ cpLevelId: levelId })
      this.getPersonList()
    },
    toCreateStaff() {
      this.$router.push("/shop-inner/staff-add");
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    })
  },
  components: { choosePersonHeader, }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
@import "@/assets/css/order/shadow.scss";
@import "@/assets/css/mixin.scss";
.choose-person-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.choose-person-body {
  margin-top:75px;
}

.choose-person-container {
  height: calc(100vh - 135px);
  display: flex;
  flex-direction: column;
  min-width: 760px;
  margin: 0 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  .person-main {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 20px;
  }
  .person-list {
    width: 100%;
    // margin: 0 20px;
    padding-top: 8px;
    display: flex;
    flex-wrap: wrap;
  }
}

.single-person {
  @include goods-shadow-hover;
  cursor: pointer;
  flex: 0 0 170px;
  height: 226px;
  display: block;
  box-sizing: border-box;
  border-radius: 6px;
  overflow: hidden;
  @include box-shadow-card();
  margin-right: 20px;
  margin-bottom: 30px;
  .img {
    width: 170px;
    height: 170px;
    background-size: cover;
    background-position: center;
    border-radius: 6px 6px 0 0;
  }

  .detail {
    height: 50px;
    line-height: 50px;
    margin: 0 8px;

    .name {
      color: #3a3a3a;
      font-size: 16px;
      margin-right: 10px;
    }

    .job {
      color: #999999;
      font-size: 12px;
    }
  }
}
.normal_red_btn {
  margin-left: 4px;  
}
</style>
