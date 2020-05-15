<template>
  <full-single-page type="shareholderDetail" :origin="'otherTags'" :title="'股东分红详情'">
    <div class="page-body" v-loading="loading">
      <div class="detail-left">
        <div class="share-avator">
          <img
            :src="utils.formatPicImage(
              shareholderDetail.shareholderHeadPortrait,
              'style',
              40,
              'someone',
              shareholderInfo.shareholderSex
            )"
          />
          <div class="share-status" v-if="shareholderInfo.status">
            <status-text
              :type="statusType(shareholderInfo.status)"
              :name="statusName(shareholderInfo.status)"
            ></status-text>
          </div>
        </div>
        <div class="share-info">
          <p class="name">{{shareholderInfo.shareholderRealName}}</p>
          <p class="mobile">{{shareholderInfo.shareholderMobile}}</p>
        </div>
        <div class="share-handle">
          <g-button :name="'编辑'" :type="'detail'" :icon="'icon_operate_edit'" @click="toEdit()"></g-button>
          <g-button
            v-if="shareholderStoreInfoList.some(i => i.status == 'disabled')"
            :name="'启用'"
            :type="'green'"
            :icon="'icon_ope_revoke'"
            @click="toUsing()"
          ></g-button>
          <g-button
            v-if="shareholderStoreInfoList.some(i => i.status == 'enabled')"
            :name="'停用'"
            :type="'red'"
            :icon="'icon_operate_disable'"
            @click="disable()"
          ></g-button>
        </div>
        <div class="share-detail">
          <div>
            <span>股东昵称：</span>
            <p>{{ shareholderInfo.nickName || '-' }}</p>
          </div>
          <div>
            <span>加入时间：</span>
            <p>{{ shareholderInfo.createTime || '-' }}</p>
          </div>
          <div>
            <span>介 绍 人：</span>
            <p>{{ shareholderInfo.introducerShareholderRealName || '-' }}</p>
          </div>
          <div>
            <span>股东来源：</span>
            <p>{{ shareholderInfo.channel == 'pc' ? '后台添加' : '线上招募' }}</p>
          </div>
          <div>
            <span>备 注：</span>
            <p>{{ shareholderInfo.remark || '-' }}</p>
          </div>
        </div>
      </div>
      <div class="detail-right">
        <div class="share-static">
          <ul>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail01.png" alt />
              </div>
              <div class="static">
                <p>{{ bindBrandCustomerCount || 0 }}</p>
                <p>绑定客户</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail02.png" alt />
              </div>
              <div class="static">
                <p>{{ introducerShareholderCount || 0}}</p>
                <p>介绍的股东</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail03.png" alt />
              </div>
              <div class="static">
                <p>
                  <span>￥</span>
                  {{ totalOpenAccount || 0 }}
                </p>
                <p>合计入股保证金</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail04.png" alt />
              </div>
              <div class="static">
                <p>
                  <span>￥</span>
                  {{ surplusSecurityFund || 0 }}
                </p>
                <p>合计剩余保证金</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail05.png" alt />
              </div>
              <div class="static">
                <p>
                  <span>￥</span>
                  {{ allBonus || 0 }}
                </p>
                <p>累计已分红</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail06.png" alt />
              </div>
              <div class="static">
                <p>
                  <span>￥</span>
                  {{ expectedBonus || 0 }}
                </p>
                <p>预估待分红</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail07.png" alt />
              </div>
              <div class="static">
                <p>
                  <span>￥</span>
                  {{ lastMonthExpectedBonus || 0 }}
                </p>
                <p>上月预估待分红</p>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/img/icon_share_detail08.png" alt />
              </div>
              <div class="static">
                <p>
                  <span>￥</span>
                  {{ currentMonthExpectedBonus || 0 }}
                </p>
                <p>本月预估待分红</p>
              </div>
            </li>
          </ul>
          <div class="static-handle">
            <g-button
              v-if="shareholderStoreInfoList.some(i => i.status == 'enabled')"
              :name="'充值'"
              :type="'mgreen'"
              :icon="'icon_order_refund'"
              @click="recharge"
            ></g-button>
            <g-button
              v-if="shareholderStoreInfoList.some(i => i.status == 'enabled')"
              :name="'退股'"
              :type="'cancel'"
              :icon="'icon_operate_down'"
              @click="withdrawal"
            ></g-button>
          </div>
        </div>
        <div class="share-table">
          <detailTable></detailTable>
        </div>
      </div>
    </div>
  </full-single-page>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import { Base64 } from "js-base64";
import recharge from "../shareholder_module/components/recharge";
import detailTable from "./components/detailTable";
export default {
  components: {
    recharge,
    detailTable,
  },
  data() {
    return {
      utils,
      loading: false,
      shareholderInfo: {},
      shareholderStoreInfoList: [],
      totalOpenAccount: null, // 合计入股保证金
      surplusSecurityFund: null, // 合计剩余入股保证金
      bindBrandCustomerCount: null, // 绑定客户数
      introducerShareholderCount: null, // 介绍股东个数
      allBonus: null, // 累计已分红
      currentMonthExpectedBonus: null, // 当月预计待分红
      expectedBonus: null, // 预计待分红
      lastMonthExpectedBonus: null // 上月预计待分红
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      try {
        this.loading = true;
        const [res_1, res_2, res_3, res_4] = await Promise.all([
          axios.get(
            `/getShareholderInfoByBrandCustomerId/${this.shareholderDetail.brandCustomerId}`
          ),
          axios.post("/getSecurityFundStatistics", {
            shareholderId: this.shareholderDetail.id,
            storeId: null
          }),
          axios.get(
            `/getShareholderBindStattistics/${this.shareholderDetail.id}`
          ),
          axios.get(`/getBonusStatistics/${this.shareholderDetail.id}`)
        ]);
        this.shareholderInfo = {
          ...res_1,
          ...res_1.shareholderInfo
        };
        this.shareholderStoreInfoList = res_1.shareholderStoreInfoList;
        this.totalOpenAccount =
          res_2.openAccount + res_2.recharge + res_2.modifyAdd;
        this.surplusSecurityFund = res_2.surplusSecurityFund;
        this.bindBrandCustomerCount = res_3.bindBrandCustomerCount;
        this.introducerShareholderCount = res_3.introducerShareholderCount;
        this.allBonus = res_4.allBonus;
        this.currentMonthExpectedBonus = res_4.currentMonthExpectedBonus;
        this.expectedBonus = res_4.expectedBonus;
        this.lastMonthExpectedBonus = res_4.lastMonthExpectedBonus;
        // 在品牌中， 股东权益存在开启， 则状态为开启 这个需求设计不合理，暂不计较
        if (this.isBrand) {
          // 存在启用 即为启用
          if (this.shareholderStoreInfoList.some(i => i.status == "enabled")) {
            this.shareholderInfo.status = "enabled";
            // 全部禁用 则为禁用。。。
          } else if (
            this.shareholderStoreInfoList.every(i => i.status == "disabled")
          ) {
            this.shareholderInfo.status = "disabled";
          } else {
            this.shareholderInfo.status = "quit";
          }
        }
      } finally {
        this.loading = false;
      }
    },
    toEdit() {},
    toUsing() {},
    // 目前需求不会出现停用的
    disable() {},
    // 充值
    recharge() {},
    // 退股
    withdrawal() {},
    statusType(status) {
      switch (status) {
        case "enabled":
          return "green";
        case "disabled":
          return "orange";
        case "quit":
          return "sgrey";
      }
    },
    statusName(status) {
      switch (status) {
        case "enabled":
          return "已启用";
        case "disabled":
          return "已停用";
        case "quit":
          return "已退股";
      }
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      shareholderDetail: state => state.shareholder.shareholderDetail
    }),
    // 品牌标识
    isBrand() {
      return this.$route.path.indexOf("brand") != -1;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .full-single-page-body {
  box-shadow: none !important;
  background-color: #f4f5f9 !important;
}
.page-body {
  min-height: calc(100vh - 105px);
  min-width: 1440px;
  display: flex;
  justify-content: space-evenly;
  .detail-left {
    width: 280px;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
    .share-avator {
      position: relative;
      margin: 30px auto 10px;
      width: 120px;
      height: 120px;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .share-status {
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 56px;
        height: 20px;
      }
    }
    .share-info {
      .name {
        font-size: 18px;
      }
      .mobile {
        font-size: 15px;
      }
    }
    .share-handle {
      margin-top: 10px;
    }
    .share-detail {
      margin-top: 10px;
      div {
        display: flex;
        // justify-content: space-evenly;
        align-items: center;
        padding: 0 40px;
        & + div {
          margin-top: 8px;
        }
        span {
          display: inline-block;
          width: 60px;
          font-size: 12px;
          color: #9d9d9d;
        }
        p {
          text-align: left;
          font-size: 13px;
          width: 140px;
          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .detail-right {
    width: 1100px;
    border-radius: 5px;
    .share-static {
      display: flex;
      position: relative;
      height: 212px;
      background-color: #fff;
      border-radius: 6px;
      ul {
        margin-left: 40px;
        li {
          float: left;
          margin-top: 34px;
          width: 230px;
          display: flex;
          align-items: center;
          .img {
            width: 56px;
            height: 56px;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
            }
          }
          .static {
            margin-left: 10px;
            :nth-child(1) {
              width: 160px;
              font-size: 24px;
              font-weight: 700;
              color: #393939;
              word-break: keep-all;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              span {
                font-size: 12px;
              }
            }
            :nth-child(2) {
              font-size: 13px;
              color: #a5a5a5;
            }
          }
        }
      }
      .static-handle {
        position: absolute;
        top: 10px;
        right: 5px;
      }
    }
    .share-table {
      margin-top: 15px;
      background-color: #fff;
      height: 836px;
      border-radius: 6px;
    }
  }
}
</style>