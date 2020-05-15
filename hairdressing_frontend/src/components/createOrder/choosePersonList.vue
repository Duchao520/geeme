<template>
  <div class="choose-person-list scrollbar">
    <ul class="person-lists">
      <li
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="toChooseService(item)"
      >
        <!--<img :src="formatPicImage(item.headPortrait, 'style', 146, 'someone', item.sex)">-->
        <div class="img" :style="{
          backgroundImage:`url(${formatPicImage(item.headPortrait, 'style', 146, 'someone', item.sex)})`
        }"></div>
        <div class="detail">
          <span class="name">{{ item.name }} <span v-if="item.shopNum">({{item.shopNum}})</span> </span>
          <span class="job">{{ item.levelName }}</span>
        </div>
      </li>
      <g-nolist
        class="no-list"
        v-if="!list"
        :img="nolistbg"
        :tip="'该分类还没有开单人，赶快新增一个'"
        :btnname="'新增员工'"
        @todo="toCreate"
      ></g-nolist>
      <search-default class="search-default" v-if="list&&list.length===0" v-on="$listeners"></search-default>
    </ul>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as datas from "@/assets/js/datas";
  import {mapActions} from "vuex";

  export default {
    props: {
      list: Array
    },
    data() {
      return {
        nolistbg: datas.defaultImg.nopersonlist, // 没有开单人列表
        formatPicImage: utils.formatPicImage // 有尺寸的图片处理
      };
    },
    computed: {
      billOrigin() {
        return this.$store.state.bill.billOrigin;
      }
    },
    methods: {
      ...mapActions(["saveStaffInfo", "saveCurrentInfo", "setBillOrigin"]),
      toChooseService(data) {
        this.saveStaffInfo(data);
        this.saveCurrentInfo({cpLevelId: data.levelId});
        if (this.billOrigin === "cashierList") {
          this.setBillOrigin(null);
        }
        this.$router.push("/shop-inner/choose-service");
      },
      toCreate() {
        this.$router.push("/shop-inner/staff-add");
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";
  @import "@/assets/css/order/shadow.scss";
  @import "@/assets/css/mixin.scss";

  .choose-person-list {
    box-sizing: border-box;
    padding-top: 20px;
    overflow-y: auto;

    .person-lists {
      display: flex;
      flex-wrap: wrap;

      .list-item {
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
        }

        .detail {
          height: 50px;
          line-height: 50px;
          margin-left: 10px;

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

      .empty {
        display: inline-block;
        width: 170px;
        margin-right: 20px;
        height: 0;
      }

      .search-default {
        width: 100%;
        height: calc(100vh - 240px);
      }
    }
  }


</style>
