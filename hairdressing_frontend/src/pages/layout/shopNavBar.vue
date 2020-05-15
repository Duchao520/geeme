 <template>
  <div id="gm_index">
    <my-header></my-header>
    <el-container>
      <transition name="slide-fade">
        <div v-show="menuShow" class="aside_nav test">
          <el-aside class="scrollbar" :class="currentInfo.revenueType">
            <!-- 页面链接 nav -->
            <el-menu
              :background-color="currentInfo.revenueType === 'SUPPLIER' ? '#15856F' : '#323758'"
              text-color="#fff"
              active-text-color="#fff"
              style="border:none;"
              :default-active="currentMenu"
            >
              <!-- :router="true" -->
              <el-menu-item :index="item.path" v-for="(item, index) in shopNavBar" :key="item.path">
                <div class="menu-item" @click="getPath(item, index)">
                  <i class="iconfont" :class="item.icon"></i>
                  <span slot="title" class="title">{{item.title}}</span>
                </div>
              </el-menu-item>
            </el-menu>
            <div class="aside-logo" v-if="currentInfo.revenueType === 'SUPPLIER'">
              <div class="logo-reality-supper"></div>
            </div>
            <div class="aside-logo" v-else>
              <div class="logo-reality-standard" v-if="brandVersion === 1"></div>
              <div class="logo-reality-major" v-else-if="brandVersion === 2"></div>
              <div class="logo-reality-flagship" v-else></div>
            </div>
          </el-aside>
        </div>
      </transition>
      <div class="main_container">
        <el-main class="scrollbar">
          <router-view></router-view>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions, mapState } from "vuex";
import MyHeader from "@/components/common/Header";
import "@/assets/css/transition.scss";
export default {
  name: "GmIndex",
  data() {
    return {
      // 进销存版的aside-logo距离
      supperFlag: false,
      currentMenu: "/shop-inner/console",
      finalPath: "",
      brandVersion: null
    };
  },
  watch: {
    "$route.path": {
      handler: function(val, old) {
        this.currentMenu = "/shop-inner/" + val.split("/")[2];
      },
      immediate: true
    }
  },
  computed: {
    //  当前的品牌id
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    // 当前menu状态
    menuShow() {
      return this.$store.state.manage.menuShow;
    },
    shopNavBar() {
      return this.$store.state.authRouter.currentEntryNav.ROUTER_Nav_Bars;
    },
  },
  components: {
    "my-header": MyHeader
  },
  created() {
    // this.getUrl();
    this.getBrandVersion();
    if (this.shopNavBar.length === 2) {
      this.supperFlag = true;
    } else {
      this.supperFlag = false;
    }
  },
  mounted() {
    console.log(this.currentInfo)
  },
  methods: {
    // 根据id获取品牌类型
    async getBrandVersion() {
      const res = await axios.post(`/getBrandInfo`, {
        brandId: this.currentInfo.brandId
      });
      this.brandVersion = res.version;
    },
    //  获取当前route，保持左侧高亮
    getUrl() {
      let that = this;
      let currentUrl = that.$route.path;
      // that.currentMenu = "/shop-inner/" + currentUrl.split("/")[2];
    },
    getPath(item, i) {
      this.finalPath = item.path;
      if (item.routes && item.routes.length && item.routes[0].show) {
        this.getFinalPath(item.routes);
      }
      this.$router.push(this.finalPath);
    },
    getFinalPath(arr) {
      this.finalPath = arr[0].path;
      if (arr[0].routes && arr[0].routes.length) {
        this.getFinalPath(arr[0].routes);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
$supplierAct: #017572;
$supplierBg: #15856F;
#gm_index {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      width: 181px !important;
      height: 100%;
      background: #323758;
      color: #fff;
      font-size: 16px;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 992;
      .el-menu-item {
        z-index: 5;
        height: 56px;
        font-size: 14px;
        padding-left: 40px !important;
        &:hover {
          background: #323758 !important;
          .menu-item {
            background: #2a2c44;
          }
        }
        .notRead {
          float: right;
          img {
            width: 8px;
            height: 8px;
          }
        }
      }
      &.SUPPLIER {
        background: $supplierBg;
        .el-menu-item {
          &:hover {
            background: $supplierBg !important;
            .menu-item {
              background: $supplierAct;
            }
          }
        }
      }
    }
    .el-main {
      padding: 0;
      margin-left: 0px;
      padding-bottom: 0;
    }
    .el-main {
      height: 100%;
    }
  }
}
.nav_msg {
  display: flex;
  flex-direction: row;
  height: 110px;
  width: 200px;

  img {
    padding: 32px 6px 32px 11px;
    width: 46px;
    height: 46px;
  }
  .nav_name {
    width: 125px;
    padding: 32px 11px 32px 0;
    font-size: 14px;
    flex: 1;
    .nav_tips {
      padding-top: 4px;
      font-size: 12px;
      .tip_addr {
        cursor: pointer;
        height: 20px;
        display: inline-block;
        line-height: 20px;
        text-align: center;
        width: 90px;
        background: rgba(226, 44, 55, 1);
      }
      i {
        cursor: pointer;
        padding-left: 14px;
        font-size: 16px;
        font-weight: 600;
        display: inline-block;
        margin-top: 3px;
      }
    }
  }
}
.el-container {
  display: flex;
  .aside_nav {
    width: 181px;
    .el-menu {
      margin-top: 55px;
    }
  }
  .main_container {
    flex: 1;
    height: 100vh;
    box-sizing: border-box;
    width: calc(100vw - 180px);
    padding-top: 55px;
  }
}

#gm_index .el-aside {
  .el-menu-item.is-active .menu-item {
    background: #2a2c44;
  }
  &.SUPPLIER {
    .el-menu-item.is-active .menu-item {
      background: $supplierAct;
    }
  }
}
//  memu菜单整改
.el-menu-item {
  .menu-item {
    width: 88%;
    height: 32px;
    position: absolute;
    top: 12px;
    right: 0;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    i {
      color: #fff;
      position: absolute;
      top: -11px;
      left: 10px;
      font-size: 24px;
    }

    .title {
      position: absolute;
      left: 50px;
      top: -12px;
    }
  }
}
.el-menu-item.is-active i {
  color: #e22c37;
  position: absolute;
  top: -11px;
  left: 10px;
}
.nav_name {
  .over {
    margin-bottom: 10px;
  }

  .el-dropdown {
    color: #fff;
    cursor: pointer;
    .title {
      width: 91px;
      line-height: 14px;
      display: inline-block;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.el-dropdown-menu {
  width: 220px;
  left: 62px !important;
  max-height: 296px;
  overflow-y: auto;
  /*滚动条样式*/
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .el-dropdown-menu__item {
    padding: 5px 20px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .shop-logo {
      width: 25px;
      height: 25px;
      vertical-align: middle;
    }
  }
}
// 动画
.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(-100px);
  opacity: 0;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  -moz-transition: all 0.4s ease-in-out;
  -ms-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.aside-logo {
  min-height:100px;
  width: 100%;
  position: relative;
  .logo-reality-standard {
    width: 100px;
    height: 30px;
    position: absolute;
    bottom: 20px;
    left: 33px;
    background: url("../../assets/img/aside_logo_shop_01.png") no-repeat center
    center/100% auto;
    opacity: 0.8;
  }
  .logo-reality-major {
    width: 100px;
    height: 30px;
    position: absolute;
    bottom: 20px;
    left: 33px;
    background: url("../../assets/img/aside_logo_shop_02.png") no-repeat center
    center/100% auto;
    opacity: 0.8;
  }
  .logo-reality-flagship {
    width: 100px;
    height: 30px;
    position: absolute;
    bottom: 20px;
    left: 33px;
    background: url("../../assets/img/aside_logo_shop_03.png") no-repeat center
    center/100% auto;
    opacity: 0.8;
  }
  .logo-reality-supper {
    width: 112.54px;
    height: 33.76px;
    position: absolute;
    bottom: 19.5px;
    left: 33px;
    background: url("../../assets/img/aside_logo_shop_supper.png") no-repeat center
    center/100% auto;
    opacity: 0.8;
  }
}
</style>
