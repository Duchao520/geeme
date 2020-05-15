<template lang="pug">
  .center-list__wrap
    ul.list-container
      li.list-item.im(
        v-for="(item, index) in list"
      )
        .content
          span.spanImg(
            @click="toOpera(item, 'manage')"
            :style="{backgroundImage: 'url(' + formatPicImage(item.brandLogo, 'style', 146, 'brandLogo') + ')'}"
          )
          .desc.media-brand-list
            .name(
              @click="toOpera(item, 'manage')"
              :title="item.brandName"
            ) {{ item.brandName }}

            //- 权限注释1
              @click="toApprove(item)"
            .enter(
              @click="toOpera(item,'authBrand')"
            )
              p(
                v-if="item.auth===0"
              )
                status-text(
                  :name="'未认证'",
                  type="grey"
                )
                
                //- 权限注释2
                //- span.auth 立即认证
                span.auth(v-if="item.operateCollection && item.operateCollection.includes('brand_center_authorize')") 立即认证
              p(
                v-if="item.auth===1"
              )
                status-text(
                  :name="'已认证'",
                  type="blue"
                )
              p(
                v-if="item.auth===2"
              )
                status-text(
                  :name="'认证中'",
                  type="orange1"
                )  
              p(
                v-if="item.auth===3"
              )
                status-text(
                  :name="'认证退回'",
                  type="mred"
                )

                //- 权限注释3
                span.auth(v-if="item.operateCollection && item.operateCollection.includes('brand_center_authorize')") 重新认证
                //- span.auth 重新认证

            .dust {{ item.industryName }} {{item.version|versionFilter}}
          .manage
            //- 权限注释4
            el-button.normal_pink_btn.movePosition(
              v-if="item.operateCollection && item.operateCollection.includes('brand_center_manage')",
              @click="toOpera(item, 'manage')",
              size='mini',
            ) 管理
            .opera
              //- 权限注释5
              i.icon.iconfont.edit.icon-icon_operate_edit(
                v-if="item.operateCollection && item.operateCollection.includes('brand_center_edit')"
                @click="toOpera(item, 'edit')"
              )

              //- 权限注释6
              i.icon.iconfont.icon-icon_operate_delete(
                v-if="item.operateCollection && item.operateCollection.includes('brand_center_delete')"
                @click="toOpera(item, 'delete')"
              )
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions, mapState } from "vuex";
import { types } from 'util';
export default {
  props: {
    list: Array
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage // 有尺寸的图片处理
    };
  },
  computed: {
    currentinfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  mounted() {
    // console.log(this.list)
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "setApproveBrand"]),
    toOpera(item, type) {
      // 管理
      if (type == 'manage') {
        if (item.operateCollection && item.operateCollection.includes('brand_center_manage')) {
          //有权限
        } else {
          this.$message({
            type: 'error',
            message: '无管理权限'
          })
          return false
        }
      }
      // 认证
      if (type === 'authBrand') {
        if (item.operateCollection && item.operateCollection.includes('brand_center_authorize')) {
          //有权限
        } else {
          this.$message({
            type: 'error',
            message: '无认证权限'
          })
          return false
        }
      }
      this.$emit("to-opera", {
        brandInfo: item,
        type: type
      });
    },
    // toApprove(data) {
    //   console.log(data);
    //   this.setApproveBrand({
    //     brandName: data.brandName,
    //     belongTo: data.industryName,
    //     id: data.id
    //   });
    //   this.$router.push("/brand-inner/center/auth-brand");
    // }
  },
  filters: {
    versionFilter(v) {
      let map = {
        1: "标准版",
        2: "专业版",
        3: "旗舰版"
      }
      return map[v]
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  user-select: none;
  display: flex;
}
.spanImg {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  cursor: pointer;
  
}
.list-item.im {
  box-shadow: 1px 1px 5px 0px rgba(174, 184, 229, 0.5);
  max-width: 370px;
}
.enter {
  cursor: pointer;
  display: inline-block;
}
.g-btn.disabled {
  background: grey;
}

/**  按钮移动位置 **/
.movePosition {
  margin-top: 33px;
}
</style>
 