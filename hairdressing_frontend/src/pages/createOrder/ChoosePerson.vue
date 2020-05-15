<template lang="pug">
  #gm_service_choose_person
    choose-person-header(
      :title="'选择开单人'",
      :list="staffLevelList",
      :current="currentInfo.cpLevelId",
      @checked-change="checkedChange",
      :checked="currentInfo.cpTimeChecked",
      @tab-change="tabChange"
    )
    .sub-content
      .staff-list-content
        .choose_person-wrap
          .c-header-search
            input-search(
              :placeholder="'输入首字母可检索'",
              @search="getChoosePeople",
              v-model="keyword"
            )
            el-button.normal_red_btn(
              @click="hangleNoPeople"
              size="medium"
            ) 跳过选择
          .c-content
            choose-person-list(
              v-show="dataInit",
              :list="choosePersonList",
              @clear-back="clearBack"
            )
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import ChoosePersonHeader from "@/components/createOrder/choosePersonHeader";
import ChoosePersonList from "@/components/createOrder/choosePersonList";
import InputSearch from "@/components/common/InputSearch";
import { mapActions, mapState } from "vuex";
export default {
  name: "GmServiceChoosePerson",
  data() {
    return {
      activeName: "发型师",
      checked: false,
      choosePersonList: [],
      staffLevelList: null, // 职级列表
      keyword: null,
      saveTabStatus: false,
      dataInit:false
    };
  },
  components: {
    "choose-person-header": ChoosePersonHeader,
    "choose-person-list": ChoosePersonList,
    "input-search": InputSearch
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    billInfo() {
      return this.$store.state.bill;
    }
  },
  mounted() {
    this.init();
    this.addListener();
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "onReload", "saveStaffInfo", "setBillOrigin"]),
    init() {
      if (this.billInfo.onReload) {
        this.saveTabStatus = true;
      } else {
        this.saveTabStatus = false;
      }
      this.onReload(false);
      this.getStaffLevelList();
    },
    addListener() {
      window.onbeforeunload = () => {
        this.onReload(true);
        return null;
      };
    },
    getStaffLevelList() {
      axios
        .get(api.getStaffLevelListByStoreId.URL + this.currentInfo.shopId, {})
        .then(res => {
          this.getStaffLevelListRes(res);
        });
    },
    getChoosePeople() {
      let params = {
        availableIn30min: this.currentInfo.cpTimeChecked,
        keyWord: this.keyword,
        levelId: this.currentInfo.cpLevelId,
        storeId: this.currentInfo.shopId
      };
      axios.post(api.getChoosePeople.URL, params).then(res => {
        this.getChoosePeopleRes(res);
      });
    },
    getChoosePeopleRes(res) {
      this.choosePersonList = res.staffInfos;
      this.dataInit = true;
    },
    // 没有选开单人
    hangleNoPeople() {
      this.saveStaffInfo({
        id: null,
        userId: null,
        levelId: null,
        name: '',
        levelName: '',
        headPortrait: '',
        sex: '',
        shopNum: '',
      });
      this.saveCurrentInfo({cpLevelId: null});
      if (this.billOrigin === "cashierList") {
        this.setBillOrigin(null);
      }
      this.$router.push("/shop-inner/choose-service");
    },
    getStaffLevelListRes(res) {
      this.staffLevelList = res.staffLevelList;
      if (!this.saveTabStatus) {
        this.saveCurrentInfo({ cpLevelId: res.staffLevelList[0].id });
      }
      this.getChoosePeople();
    },
    tabChange(data) {
      this.saveCurrentInfo({ cpLevelId: data });
      this.getChoosePeople();
    },
    checkedChange(data) {
      this.saveCurrentInfo({
        cpTimeChecked: data
      });
      this.getChoosePeople();
    },
    search(data) {
      this.keyword = data;
      this.getChoosePeople();
    },
    clearBack() {
      this.keyword = null;
      this.getChoosePeople();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.sub-content {
  box-sizing: border-box;
  padding-top: 75px;
  .staff-list-content {
    box-sizing: border-box;
    background: #fff;
    padding-bottom: 30px;
    border-radius: 8px;
    height: calc(100vh - 95px);
    overflow-y: auto;
    margin: 0 20px;
    @include scroll-bar(8px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    .content-wrap {
      padding: 40px 70px 50px 70px;
      // 盒子容器
      .box-modules {
        width: 100%;
        .title {
          color: #333333;
        }
        .title-wrap {
          font-size: 20px;
          color: #333333;
          .level {
            font-size: 12px;
            color: #fff;
            display: inline-block;
            padding: 0 8px;
            margin-left: 10px;
            background: #070707;
            border-radius: 10px;
          }
        }
        .content {
          width: 100%;
          border-radius: 4px;
          border: 1px solid #f0f1f4;
          margin: 10px 0 20px 0;
          padding: 20px 0;
          .auto-get {
            display: block;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.c-header-search {
  display: flex;
  justify-content: flex-start;
  .normal_red_btn {
    margin-left: 4px;
  }
}
</style>

