<template lang="pug">
.center-shop__wrap
  .content-container
    center-nav(
      :list="navList",
      :current="current",
      @click="changeNav"
    )
    // 个人资料
    person-data(
      v-show="!request && current === 1"
      :list="userInfo",
      @submit="submit"
    )
    // 修改头像
    person-avatar(
      v-if="!request && current === 2",
      :photo="userInfo.headPortrait",
      @submit="submit"
    )
</template>
<script>
import CenterNav from "@/components/center/nav";
import PersonData from "@/components/center/personData";
import PersonAvatar from "@/components/center/personAvatar";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      current: 1, // 当前操作的信息
      userInfo: null, // 用户信息
      navList: [
        {
          id: 1,
          name: "基本资料"
        },
        {
          id: 2,
          name: "修改头像"
        }
      ], // 导航列表
      request: false
    };
  },
  components: {
    "center-nav": CenterNav,
    "person-data": PersonData,
    "person-avatar": PersonAvatar
  },
  created() {
    this.request = true;
    this.getUserInfo();
  },
  methods: {
    ...mapActions(["saveUserInfo"]),
    // 获取用户信息
    getUserInfo() {
      axios.get(api.getUserInfo.URL).then(res => {
        this.getUserInfoRes(res);
      });
    },
    // 获取用户信息
    getUserInfoRes(res) {
      this.userInfo = res;
      this.request = false;
      // 将获取的信息赋值
      this.saveUserInfo(res);
      // 存储用户信息?
    },
    // 改变导航
    changeNav(item) {
      this.current = item.id;
    },
    // 提交
    submit(data) {
      if (data.type === "saveInfo") {
        // 更新用户信息
        this.userInfo = data.data;
        axios
          .post(api.updateUserInfo.URL, data.data || this.userInfo)
          .then(res => {
            this.saveUserInfoRes(res);
          });
      } else if (data.type === "saveAvatar") {
        this.userInfo.headPortrait = data.data;
        axios.post(api.updateUserInfo.URL, this.userInfo).then(res => {
          this.saveUserInfoRes(res);
        });
      }
    },
    saveUserInfoRes(res) {
      if (res.success) {
        // 提示
        utils.showTip(this, { msg: "保存成功", type: "success" });
        // this.$store.dispatch('saveUserInfo', this.userInfo)
        // this.$router.go(-1)
        // 将用户信息存储到vuex, 并且返回到 个人资料 -> 基本资料
        this.getUserInfo();
        this.current = 1;
      } else {
        // 提示
        utils.showTip(this, { msg: "保存失败", type: "error" });
      }
    },
    showUserInfo(res) {}
  }
};
</script>
