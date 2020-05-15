<template lang="pug">
  .center-page
    .header-center
      center-header(
        :title="'个人中心'",
        :backing="'返回首页'"
      )
    .body-center
      .body-container.media
        .left-body.im
          center-menu(
            @change-router="changeRouter"
          )
        .right-body
          router-view
</template>
<script>
import CenterHeader from "@/components/common/CenterHeader";
import CenterMenu from "@/components/center/menu";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
export default {
  data() {
    return {};
  },
  components: {
    "center-header": CenterHeader,
    "center-menu": CenterMenu
  },
  methods: {
    changeRouter(data) {
      if (data.url === "#") {
        // 状态返回401 拦截器直接清理token并跳转登入页
        axios.post(api.logout.URL)
      }
    }
  }
};
</script>
