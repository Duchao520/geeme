<template>
  <div class="geeme-header">
    <div class="left">
      <img class="geeme-logo" src="./assets/logo.png">
      <MenuIcon v-on="$listeners"/>
      <HeaderNav :list="currentHeaderNavList"/>
    </div>
    <div class="right">
      <div class="user">
        <a-avatar :size="36" icon="user" />
        <span class="name">{{userName}}&nbsp;<a-icon type="down" /></span>
        <div class="tooltip">
          <button @click="goCenter"><i class="iconfont">&#xe6fd;</i>个人中心</button>
          <button @click="goPassword"><i class="iconfont">&#xe6fb;</i>修改密码</button>
          <button @click="logout"><i class="iconfont">&#xe6fc;</i>退出登陆</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuIcon from '@/components/menuIcon'
import HeaderNav from './headerNav'
import { logout } from '@/utils/token' 
export default {
  components: {
    MenuIcon,
    HeaderNav,
  },
  computed: {
    headerNavMap() {
      return this.$store.getters.headerNavMap
    },
    currentHeaderNavList() {
      return this.headerNavMap.get((this.$route.matched)[1].name)
    },
    userName() {
      return this.$store.state.user.name
    }
  },
  methods: {
    goCenter() {
      this.$router.push('/app/setting/person/basicInfo')
    },
    goPassword() {
      this.$router.push('/app/setting/person/changePassword')
    },
    logout() {
      logout()
    }
  }
};
</script>

<style lang="less" scoped>
.geeme-header {
  position: relative;
  height: @headerH;
  background: @headerB;
  box-shadow: @headerS;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 46px 0 20px;
  .left {
    display: flex;
    align-items: center;
    height: 100%;
    .geeme-logo {
      width: 121px;
      height: 36px;
      margin: 0 75px 0 0;
      cursor: pointer;
    }
  }
  .right {
    height: 100%;
    .user {
      position: relative;
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      .name {
        color: rgba(153, 153, 153, 1);
        font-size: 14px; 
        margin: 0 0 0 8px;
      }
      .tooltip {
        //width: 150px;
        padding: 11px 0;
        /* height: 300px; */
        left: calc(50% - 90px);
        display: block;
        pointer-events: none;
        background: #ffffff;
        position: absolute;
        top: 55px;
        z-index: 999;
        transform: translateY(0px);
        transition: all .25s ease-out;
        box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.08);
        border-radius: 6px;
        opacity: 0;  
        &::before {
          top: -20px;
          content: "";
          display: block;
          height: 20px;
          left: 0;
          position: absolute;
          width: 100%;
        }
        &::after {
          border-left: solid transparent 10px;
          border-right: solid transparent 10px;
          border-bottom: solid #ffffff 10px;
          top: -10px;
          content: " ";
          left: 50%;
          margin-left: 30px;
          position: absolute;
          width: 0;
        }
        button {
          display: block;
          font-size: 14px;
          line-height: 20px;
          color: #666666;
          padding: 11px 0;
          width: 150px;
          cursor: pointer;
          i {
            margin: 0 10px 0 0;
          }
          //text-align: center;
        }
      }
      &:hover .tooltip {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(10px);
      }
    }
  }
}
</style>