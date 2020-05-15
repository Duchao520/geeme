<template>
  <full-single-page type="stock" title="推客详情" origin="otherTags">
    <div class="seller-detail" v-loading="loading">
      <!-- 头部 -->
      <div class="detail-header-box scrollbar" v-if="sellerInfo.id">
        <div class="detail-header-container">
          <div class="detail-header-body">
            <div class="seller-info">
              <ul>
                <li class="name-mobile">
                  <div class="portrait">
                    <img :src="utils.formatPicImage(sellerInfo.headPortrait, 'style', 40, sellerInfo.sex === '男' ? 'boy' : sellerInfo.sex === '女' ? 'girl' : 'someone')" />
                  </div>
                  <div class="basic-info">
                    <h3>{{sellerInfo.name}}</h3>
                    <p>
                      <span>手机号：</span>
                      {{sellerInfo.mobile}}
                    </p>
                  </div>
                </li>
                <li class="name-mobile">
                  <div></div>
                  <div class="basic-info">
                    <p>
                      <span>加入时间：</span>
                      {{sellerInfo.createTime}}
                    </p>
                    <p>
                      <span>分组：</span>
                      {{sellerFromGroup(sellerInfo.groupId)}}
                    </p>
                  </div>
                </li>
                <li class="name-mobile">
                  <div></div>
                  <div class="basic-info">
                    <p>
                      <span>邀请人：</span>
                      {{sellerInfo.parentSellerId === 0 ? '无邀请人' : fatherName}}
                    </p>
                    <p>
                      <span>来源：</span>
                      {{sellerInfo.channel === 0 ? '商家添加' : '微信申请'}}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="seller-performance">
              <div>
                <div class="data-img_1"></div>
                <div>
                  <h2>{{sellerInfo.customerNum}}</h2>
                  <p>绑定客户</p>
                </div>
              </div>
              <div>
                <div class="data-img_2"></div>
                <div>
                  <h2>{{sellerInfo.childNum}}</h2>
                  <p>邀请推客</p>
                </div>
              </div>
              <div>
                <div class="data-img_3"></div>
                <div>
                  <h2>{{sellerInfo.expectAmount ? "￥" + sellerInfo.expectAmount.toFixed(2) : '￥0.00'}}</h2>
                  <p>累计收益</p>
                </div>
              </div>
              <div>
                <div class="data-img_4"></div>
                <div>
                  <h2>{{sellerInfo.expectAmount ? "￥" + (sellerInfo.expectAmount - (sellerInfo.realAmount || 0)).toFixed(2) : '￥0.00'}}</h2>
                  <p>待结算</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 表格区域 -->
      <div class="detail-table-box scrollbar">
        <div class="detail-table-container">
          <div class="detail-table-body">
            <div class="user-defined-tab">
              <el-tabs type="card" v-model="componentId">
                <el-tab-pane
                  v-for="item in sendRecords"
                  :key="item.value"
                  :name="item.value"
                  :label="item.label"
                ></el-tab-pane>
              </el-tabs>
            </div>
            <!-- 动态表格组件 -->
            <component :is="componentId" ref="componentRef" :sellerId="sellerInfo.id"></component>
          </div>
        </div>
      </div>
    </div>
  </full-single-page>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import BindClient from "./components/bindClient";
import CommissionOrder from "./components/commissionOrder";
import InviteSeller from "./components/inviteSeller";
import { Base64 } from "js-base64";
export default {
  components: {
    BindClient,
    CommissionOrder,
    InviteSeller
  },
  data() {
    return {
      componentId: "BindClient",
      sendRecords: [
        {
          value: "BindClient",
          label: "绑定客户"
        },
        {
          value: "CommissionOrder",
          label: "佣金订单"
        },
        {
          value: "InviteSeller",
          label: "邀请推客"
        }
      ],
      utils,
      loading: false,
      // 推客信息
      sellerInfo: {},
      // 分组信息
      sellerGroup: [],
      // 推客信息
      fatherName:''
    };
  },
  async created() {
    this.sellerInfo.id = Number(Base64.decode(this.$route.params.id));
    this.sellerGroup = this.$store.state.seller.sellerGroup;
    await this.getSellerInfo();
  },
  methods: {
    // 根据分组id获取分组名称
    sellerFromGroup(id) {
      let groupName = null;
      this.sellerGroup.some(i => {
        if (i.id === id) {
          groupName = i.name;
        }
      });
      return groupName;
    },
    // 根据id获取推客信息
    async getSellerInfo() {
      this.loading = true;
      const res = await axios.get(
        `/getSellerById/${Number(Base64.decode(this.$route.params.id))}`
      );
      this.sellerInfo = res.sellerInfo;
      // 获取邀请人名称
      if(this.sellerInfo.parentSellerId !== 0) {
        const fatherRes = await axios.get(`/getSellerById/${this.sellerInfo.parentSellerId}`)
        this.fatherName = fatherRes.sellerInfo.name
      }
      this.loading = false;
    }
  },
  watch: {},
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.seller-detail {
  .detail-header-box {
    // width: calc(100vw - 40px);
    overflow-y: auto;
    .detail-header-container {
      .detail-header-body {
        // max-width: 1440px;
        box-sizing: border-box;
        padding: 30px;
        margin: 0 auto;
        background: #fff;
        border-radius: 6px;
        /* ==== */
        .seller-info {
          ul {
            display: flex;
            justify-content: space-evenly;
            .name-mobile {
              display: flex;
              justify-content: space-between;
              .portrait {
                width: 77px;
                height: 77px;
                img {
                  display: block;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%
                }
              }
            }
          }
          .basic-info {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            margin-left: 20px;
            p > span {
              color: #aeaeae;
            }
          }
        }
        .seller-performance {
          max-width: 1410px;
          height: 110px;
          margin-top: 30px;
          padding: 0 100px;
          background-color: #f1f2f7;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div {
            display: flex;
            p {
              color: #aaaaab;
              font-size: 16px;
            }
            h2 {
              height: 33px;
              line-height: 33px;
            }
          }
        }
      }
    }
  }
  .detail-table-box {
    // width: calc(100vw - 40px);
    height: calc(100vh - 269px);
    padding: 0 20px 20px;
    overflow-y: auto;
    .detail-table-container {
      min-height: calc(100vh - 269px);
      .detail-table-body {
        max-width: 1440px;
        box-sizing: border-box;
        margin: 0 auto;
        background: #fff;
        border-radius: 6px;
        /* ==== */
        min-height: calc(100vh - 269px);
      }
    }
  }
}

.data-img_1,
.data-img_2,
.data-img_3,
.data-img_4 {
  width: 56px;
  height: 56px;
  margin-right: 20px;
  border-radius: 28px;
  overflow: hidden;
}
.data-img_1 {
  background: url("../../../../assets/img/icon_recommend_detail01.png") no-repeat
    center center/100% auto;
}
.data-img_2 {
  background: url("../../../../assets/img/icon_recommend_detail02.png") no-repeat
    center center/100% auto;
}
.data-img_3 {
  background: url("../../../../assets/img/icon_recommend_detail03.png") no-repeat
    center center/100% auto;
}
.data-img_4 {
  background: url("../../../../assets/img/icon_recommend_detail04.png") no-repeat
    center center/100% auto;
}
</style>
