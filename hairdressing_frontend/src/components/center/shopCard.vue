<template lang="pug">
  .center-list__wrap
    ul.list-container.shoplist
      li.list-item.im(
        v-for="(item, index) in list"
      )
        .content
          .supplierFlag(
            v-if="item.revenueType === 'SUPPLIER'"
          )
            .text 进
            //- .flagright
            //-  .top
            //-  .bottom
          //- (item.operateCollection && item.operateCollection.includes('store_center_manage') && item.status !== 'INSTORE') && 
          span.spanImg(
            @click="toOpera(item, 'manage', item.status)"
            :style="{backgroundImage: 'url(' + formatPicImage(item.image, 'style', 146, 'brandLogo') + ')'}"
          )
          .desc.media-brand-list
            .shopInfo(
              @click="toOpera(item, 'manage', item.status)"
            )
              .title-line
                el-tooltip(
                  :content="item.city | splitCity" placement="top" 
                )
                  span.city {{item.city | splitCity}}
                el-tooltip(
                  :content="item.name" placement="top" 
                )
                  span.shopName {{item.name}}
            //- .name(
            //-   :title="item.city + item.name"
            //- ) {{ item.city }} {{ item.name }}
            p(
            )
              status-text(
                :name="filterName(item.status,'title')",
                :type="filterName(item.status,'color')"
              )

              //- 这里要改成超管、门店财务、店长3个角色可以操作 => 需要后端加角色字段
              span.open(
                v-if="(item.status==='TRYING'||item.status==='TRY_OVER_DUE' && item.operateCollection.includes('store_center_manage'))"
                @click="openDialog(item)"
              ) 开通
            .dust {{ item.industry }} | {{ item.type }}
          .manage
            //- g-btn(
            //-   :name="'管理'",
            //-   :size="'middle'",
            //-   :type="'orange'",
            //-   :mark='""'
            //-   @click="toOpera(item, 'manage', item.status)"
            //- )

            //- 权限注释1
            el-button.normal_pink_btn.movePosition(
              v-if="item.operateCollection && item.operateCollection.includes('store_center_manage') && item.status !== 'INSTORE'"
              size='mini'
              @click="toOpera(item, 'manage', item.status)"
            ) 管理
            .opera
              //- 权限注释2
              i.icon.iconfont.edit.icon-icon_operate_edit(
                v-if="item.operateCollection && item.operateCollection.includes('store_center_edit')"
                @click="toOpera(item, 'edit', item.status)"
              )
              //- 权限注释3 
              i.icon.iconfont.icon-icon_operate_delete(
                v-if="item.operateCollection && item.operateCollection.includes('store_center_delete')"
                @click="toOpera(item, 'delete')"
              )
    //- 开通按钮
    g-del-model(
      v-if="openVisible"
      :delTagDialogVisible="openVisible"
      @close="openVisible=false"
      @confirm="openNewBuy"
      :title="infoData.title"
      :content="infoData.content"
      :icon="infoData.icon"
      :confirmButton="infoData.btn"
      :iconColor="infoData.color"
    )
    //- 试用到期 & 正常到期
    g-dialog-with-slot(
      v-if="dueVisible"
      :dialogVisible="dueVisible"
      :icon="'icon_popup_plaint'"
      :title="dueShopStatus === 'OVER_DUE' ? '已到期门店不支持管理!' : '该门店的试用已到期!'"
      :resolveInfo="dueShopStatus === 'OVER_DUE' ? '门店续期': '门店新购'"
      @close="dueVisible = false"
      @resolve="handleToBuySoft"
    )
      div(v-if="dueShopStatus === 'OVER_DUE'")
        span 查询历史数据请前往 
        span.blue-text.page-router(
          @click="handleToMyBrands"
        ) 品牌总部
        span 。如有疑问，
        br
        span 请联系及美客服电话: 
        span.blue-text.text-for-copy 400-800-0650
        span 。
      div(v-else)
        span 如需继续使用，请购买正式开通。如有疑
        br
        span 问，请联系及美客服电话:
        span.blue-text.text-for-copy 400-800-0650

</template>
<script>
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions } from "vuex";
import * as axios from "@/util/axios";
import * as api from "@/assets/js/interface";
export default {
  props: {
    list: Array
  },
  mounted() {
    // console.log(this.list);
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      params: {},
      openVisible: false,
      infoData: {
        title: "暂时不能开通！",
        content: "没有可用的新购券，请前往购买！",
        icon: "icon_popup_plaint",
        btn: "立即购买",
        color: "#FCB322",
        type: "error"
      },
      shopId: "",
      dueShopStatus: "", // 到期状态（试用或正常到期）
      dueVisible: false // 对话框
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    toOpera(item, type, status) {
      if (type == "manage") {
        if (
          item.operateCollection &&
          item.operateCollection.includes("store_center_manage") &&
          item.status !== "INSTORE"
        ) {
          // 门店到期 & 试用到期 不能进入
          if (status === "OVER_DUE" || status === "TRY_OVER_DUE") {
            this.dueVisible = true;
            this.dueShopStatus = status;
            return;
          } else {
            //console.log('可以进入管理页面')
          }
        } else {
          this.$message({
            type: "error",
            message: "无管理权限"
          });
          return false;
        }
      }
      this.$emit("to-opera", {
        id: item.shopId,
        shopName: item.name,
        type: type,
        status: status,
        city: item.city,
        revenueType: item.revenueType,
        brandId: item.brandId,
        brandName: item.brandName,
        shopType: item.type
      });
    },
    filterName(data, type) {
      let text, color;
      switch (data) {
        case "ONLINE":
          text = "营业中";
          color = "green";
          break;
        case "OFFLINE":
          text = "已下线";
          color = "orange1";
          break;
        case "TRY_OFF_LINE":
          text = "已下线";
          color = "orange1";
          break;
        case "INSTORE":
          text = "未上线";
          color = "hui";
          break;
        case "TRYING":
          text = "试用中";
          color = "sblue";
          break;
        case "TRY_OVER_DUE":
          text = "试用到期";
          color = "orange";
          break;
        case "OVER_DUE":
          text = "已到期";
          color = "orange";
          break;
      }
      return type === "title" ? text : color;
    },
    openDialog(item) {
      this.shopId = item.shopId;
      let sendData = {
        brandId: this.currentInfo.brandId,
        type: "BUY_NEW"
      };
      axios.post(api.getCreateAbleStoreNum.URL, sendData).then(res => {
        if (res.num === 0) {
          this.infoData = {
            title: "暂时不能开通！",
            content: "没有可用的新购券，请前往购买！",
            icon: "icon_popup_plaint",
            btn: "立即购买",
            color: "#FCB322",
            type: "error"
          };
        } else {
          this.infoData = {
            title: "确定开通吗？",
            content: `当前可用券 ${res.num} 张。确定开通后将消耗 1 张新开券且操作不可撤销！`,
            icon: "icon_popup_plaint",
            btn: "确定开通",
            color: "#FF6D61",
            type: "sucess"
          };
        }
      });
      this.openVisible = true;
    },
    /**判断券是否足够进行新购还是直接开通 */
    openNewBuy() {
      if (this.infoData.type === "sucess") {
        let params = {
          brandId: this.currentInfo.brandId,
          storeId: this.shopId
        };
        axios.post(api.openSoftService.URL, params).then(res => {
          utils.showTip(this, { msg: res.message, type: "success" });
        });
        this.$emit("refresh", "刷新");
      } else {
        // this.$router.push("/shop-inner/newBuy"); // - 暂时处理成跳转软件订购
        this.$router.push("/center/buySoftware");
      }
      this.openVisible = false;
    },
    // - 试用到期
    handleToMyBrands() {
      this.$router.push("/center/brands");
    },
    // - 续期-购买软件
    handleToBuySoft() {
      // if (this.dueShopStatus === 'OVER_DUE') {
      //   // 到期 - 购买续期券
      // } else {
      //   // 试用 - 购买新开券
      // }
      this.$router.push("/center/buySoftware"); // 暂时这么处理
    }
  },
  filters: {
    splitCity(val) {
      let newVal = val.split("市");
      if (newVal.length > 1) {
        newVal = newVal[0];
      } else {
        newVal = val;
      }
      // 过滤城区
      newVal = newVal.replace("城区", "");
      return newVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.list-item.im {
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.5);
  max-width: 370px;
}
.content {
  display: flex;
  position: relative;
  .supplierFlag {
    position: absolute;
    z-index: 2;
    left: -26px;
    bottom: -10px;
    width: 0;
    height: 0;
    border-top: 24px solid transparent;
    border-right: 24px solid transparent;
    border-bottom: 24px solid #49b4b4;
    border-left: 24px solid #49b4b4;
    color: #fff;
    /* line-height: 24px;
    font-size: 12px;
    padding-left: 8px; */
    .text {
      position: absolute;
      left: -17px;
      bottom: -21px;
      font-size: 16px;
      color: #fff;
    }
    /* .flagright {
      position: absolute;
      z-index: -1;
      top: -12px;
      right: -12px;
      .top {
        border: 12px solid transparent;
        border-bottom: 12px solid #49b4b4;
        width: 0;
      }
      .bottom {
        border: 12px solid transparent;
        border-top: 12px solid #49b4b4;
        width: 0;
      }
    } */
  }
}
.shopInfo {
  width: 160px;
  margin-bottom: 10px;
  cursor: pointer;
  .city {
    width: 50px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .shopName {
    width: 170px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 8px;
  }
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
.open {
  color: rgba(88, 201, 243, 1);
  font-size: 12px;
  padding-left: 5px;
  cursor: pointer;
}
/**  按钮移动位置 **/
.movePosition {
  margin-top: 33px;
}
.title-line {
  width: 228px;
}
.blue-text {
  color: #58c9f3;
}
.page-router {
  cursor: pointer;
}
</style>
