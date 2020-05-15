
<template>
  <div id="gm_service_choose_service" v-loading="serviceListLoading">
    <choose-service-header
      ref="chooseServiceHeader"
      :title="'选择开单人'"
      :tab-pos="'tab-left'"
      :list="sortOneList"
      @queryGoodsListsBySortOne="queryGoodsListsBySortOne"
    ></choose-service-header>
    <div class="global-content">
      <choose-goods-type-side
        ref="ChooseGoodsTypeSide"
        @choose-goods-type-changed="chooseGoodsTypeChanged"
      ></choose-goods-type-side>
      <div class="choose-goods">
        <div class="choose-service-wrap">
          <div class="choose-goods-left-wrap">
            <div
              class="header-search"
              v-if="billInfo.currentChooseTypeAndSortOneId.sortGoodsType!=='cardAdd'"
            >
              <input-search
                placeholder="请输入名称或店内编码"
                v-model="keyword"
                @search="queryGoodsListsBySortOne"
              ></input-search>
              <switch-menu v-if="!isInCard" v-model="goodsViewWithImg"></switch-menu>
            </div>
            <div class="content-list">
              <choose-service-list
                :list="goodsList"
                :selectedServiceList="[...selectedServiceAndProductList]"
                :selectedCardList="[...selectedCardList]"
                @change="changeServiceList"
                @changeSelectedCard="changeSelectedCard"
                @clear-back="reSearch"
                :showDefault="inited&&!serviceListLoading"
                v-show="inited"
                :initTotal="initTotal"
              ></choose-service-list>
            </div>
          </div>
          <!-- 旧的 choose-service-right-box 组件所在位置 -->
        </div>
      </div>
    </div>
    <div class="choose-goods-right-warp">
      <choose-service-rightbox
        ref="rightBox"
        :list="isInCard ? [...selectedCardList] : [...selectedServiceAndProductList]"
        @change="changeServiceList"
        @save-bill-info="createConsumerOrderFromOrder"
      ></choose-service-rightbox>
    </div>
  </div>
</template>

<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";
  import dataConvert from "./convertsData";
  import ChooseServiceHeader from "@/components/createOrder/chooseServiceHeader";
  import ChooseServiceRightbox from "@/components/createOrder/chooseServiceRightbox";
  import ChooseServiceList from "@/components/createOrder/chooseServiceList";
  import CardAdd from "@/components/createOrder/cardAdd";
  import ChooseGoodsTypeSide from "@/components/createOrder/ChooseGoodsTypeSide";
  import {mapActions, mapState} from "vuex";

  export default {
    components: {
      ChooseServiceHeader,
      ChooseServiceList,
      ChooseServiceRightbox,
      CardAdd,
      ChooseGoodsTypeSide
    },
    data() {
      return {
        keyword: "",
        sortOneList: null,
        goodsList: [], // 所选择的服务和产品的列表
        selectedCardList: [],
        selectedServiceAndProductList: [],
        inited: false,
        saveTabStatus: false /* 是否保存tab状态（仅在新进页面的时候不保存） */,
        serviceListLoading: false,
        initTotal: 0
      };
    },
    computed: {
      ...mapState({
        customerInfo: state => state.bill.customerInfo, // 监听这个数据， 说明有选择操作
      }),
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      orderInfo() {
        return this.$store.state.manage.orderInfo;
      },
      manage() {
        return this.$store.state.manage;
      },
      billInfo() {
        return this.$store.state.bill;
      },
      isInCard() {
        let goodsType = this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
        return ["card", "cardAdd", "freeCard"].includes(goodsType);
      },
      goodsViewWithImg: {
        get() {
          return this.$store.state.bill.goodsViewWithImg
        },
        set(str) {
          this.setGoodsViewWithImg(str) // 'card' => img; 'list' => text
        }
      }
    },
    mounted() {
      this.onload();
      this.setStaffsInfo()
      window.onbeforeunload = () => {
        this.beforeunload();
        return null;
      };
    },
    methods: {
      ...mapActions([
        "onReload",
        "saveSelectedProduct",
        "setServiceTime",
        "clearCurrentChooseStatus",
        "setGoodsSortOneId",
        "saveSelectedCard",
        "setCurrentChooseType",
        "setBillChooseGoodsType",
        "setStaffsInfo", // - 员工的店内编号
        "setGoodsViewWithImg", // 设置服务卡项的展示形态
      ]),
      onload() {
        console.log(this.billInfo)
        if (this.billInfo.onReload) {
          this.selectedServiceAndProductList = JSON.parse(
            JSON.stringify(this.billInfo.selectedProduct)
          );
          this.selectedCardList = JSON.parse(
            JSON.stringify(this.billInfo.selectedCard)
          );
          this.saveSelectedProduct([]);
          this.saveSelectedCard([]);
          this.saveTabStatus = true;
          this.onReload(false);
          this.$refs.ChooseGoodsTypeSide.init();
        } else {
          this.handleClearCurrentChooseStatus();
          this.initSelectedGoods();
          this.saveTabStatus = false;
        }
      },
      beforeunload() {
        this.onReload(true);
        this.saveSelectedProduct(this.selectedServiceAndProductList);
        this.saveSelectedCard(this.selectedCardList);
      },
      querySortOne(type) {
        /* 根据一级分类ID请求商品的分类（顶部tabpane） */
        this.serviceListLoading = true;
        this.goodsList = [];
        this.keyword = "";
        switch (
        type || this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType
          ) {
          case "service":
            this.getServiceSortLevelOneList();
            break;
          case "product":
            this.getProductSortLevelOneList();
            break;
          case "card":
            this.getCardTypeInfo();
            break;
          case "cardAdd":
            this.getCardTypeInfo();
            break;
          case "freeCard":
            this.setFreeCardTypeInfo();
            break;
        }
      },
      queryGoodsListsBySortOne() {
        /* 根据一级分类和当前所处的状态请求商品列表（内容列表） */
        this.serviceListLoading = true;
        switch (this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType) {
          case "service":
            this.getSimpleServiceListForOrder();
            break;
          case "product":
            this.getSimpleProductListForOrder();
            break;
          case "card":
            this.pagedQueryStoreCardKindBasicInfo();
            break;
          case "cardAdd":
            this.serviceListLoading = false;
            break;
          case "freeCard":
            this.pagedQueryStoreFreeCardKindBasicInfo()
            break;
        }
      },
      initSelectedGoods() {
        /* 开单来源：收款台、预约、客户列表 初始化：进入页面*/
        let origin = this.billInfo.billOrigin;
        switch (origin) {
          case "cashierList":
            this.createConsumerOrderFromOrder();
            break;
          case "appointment":
            this.setServiceTime(utils.formatDateTimeFromYearToMinute(new Date()));
            this.getGoodsInfoFromAppoint({
              appointmentId: this.billInfo.appointId,
              productOrderIds: (this.billInfo.unServicedOrders.filter(item => item.type === "production") || []).map(i => i.id),
              serviceOrderIds: (this.billInfo.unServicedOrders.filter(item => item.type === "service") || []).map(i => i.id)
            });
            break;
          case "customerList":
            this.setServiceTime(utils.formatDateTimeFromYearToMinute(new Date()));
            axios
              .post("/createConsumerOrderFromCustomer", {
                orderIds: (this.billInfo.unServicedOrders || []).map(item => item.id),
                customerId: this.billInfo.customerInfo.id
              })
              .then(res => {
                this.convertConsumerOrder(res);
              });
            break;
          default:
            this.setServiceTime(utils.formatDateTimeFromYearToMinute(new Date()));
            break;
        }
      },
      getGoodsInfoFromAppoint(params) {
        axios.post("/createConsumerOrderFromAppointment", params).then(res => {
          this.convertConsumerOrder(res);
        });
      },
      convertConsumerOrder(res) {
        this.selectedServiceAndProductList = dataConvert.createConsumerOrderFromAppointment(
          [...(res.serviceInfos || []), ...(res.productInfos || [])]
        );
      },
      getServiceSortLevelOneList() {
        axios
          .post("/getServiceSortLevelOneList", {
            storeId: this.currentInfo.shopId,
            levelId: null
          })
          .then(res => {
            this.sortOneList = res.sortLevelOneList;
            if (!this.saveTabStatus) {
              this.setGoodsSortOneId({service: res.sortLevelOneList[0].id});
            }
            this.getSimpleServiceListForOrder();
          });
      },
      getSimpleServiceListForOrder() {
        let params = {
          keyword: this.keyword,
          levelId: this.currentInfo.cpLevelId,
          sortOne: this.billInfo.currentChooseTypeAndSortOneId.sortOneId.service,
          storeId: this.currentInfo.shopId
        };
        axios.post("/getSimpleServiceListForOrder", params).then(res => {
          this.goodsList = res.serviceInfoList;
          this.inited = true;
          this.serviceListLoading = false;
          this.initTotal = res.initTotal;
        });
      },
      getProductSortLevelOneList() {
        axios
          .post("/getProductSortLevelOneList", {
            storeId: this.currentInfo.shopId,
            levelId: 1
          })
          .then(res => {
            this.sortOneList = res.sortLevelOneList;
            this.getSimpleProductListForOrder();
          });
      },
      getCardTypeInfo() {
        axios
          .get("/getCardTypeInfo/" + this.currentInfo.brandId, {})
          .then(res => {
            let tempArr = res.listCardTypeBean;
            tempArr.forEach(item => {
              item.name = item.typeName;
              item.id = item.type;
            });
            // console.log(res)
            this.sortOneList = tempArr;
            this.pagedQueryStoreCardKindBasicInfo();
          });
      },
      setFreeCardTypeInfo() {
        this.sortOneList = [
          {id: 0, name: "全部", type: 0},
          {id: 1, name: "储值卡", type: 1},
          {id: 3, name: "次卡", type: 3}
        ];
        this.pagedQueryStoreFreeCardKindBasicInfo()
      },
      pagedQueryStoreFreeCardKindBasicInfo() {
        axios.post("/pagedQueryStoreFreeCardKindBasicInfo", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          cardName: this.keyword || null,
          queryType: this.billInfo.currentChooseTypeAndSortOneId.sortOneId
            .freeCard || 0,
          giftCard: false,
        }).then(res => {
          this.goodsList = (res.listCardKindBasicInfo || []).map(item => ({
            ...item,
            goodsType: 'card',
            operateType: 2,
            cardKindId: item.id,
            countLimit: item.totalCountLimit //为什么这么写？因为返回给前端的字段是totalCountLimit，后端拿回去的时候需要的是countLimit
          }));
          this.serviceListLoading = false;
          this.initTotal = res.total;
          this.inited = true;
        })
      },
      getSimpleProductListForOrder() {
        axios
          .post("/getSimpleProductListForOrder", {
            keyword: this.keyword,
            levelId: this.currentInfo.cpLevelId,
            sortOne: this.billInfo.currentChooseTypeAndSortOneId.sortOneId
              .product,
            storeId: this.currentInfo.shopId
          })
          .then(res => {
            this.goodsList = res.productInfoList;
            this.serviceListLoading = false;
            this.initTotal = res.initTotal;
          });
      },
      pagedQueryStoreCardKindBasicInfo() {
        let queryType = this.billInfo.currentChooseTypeAndSortOneId.sortOneId
          .card;
        axios
          .post("/pagedQueryStoreCardKindBasicInfo", {
            brandId: this.currentInfo.brandId,
            queryCondition: 0,
            queryType: queryType !== null ? queryType : 0,
            storeId: this.currentInfo.shopId,
            pageNum: 0,
            pageSize: 1000,
            cardName: this.keyword || null,
            // 过滤礼品卡
            giftCard: false
          })
          .then(res => {
            // console.log(res)
            let cardList = res.listCardKindBasicInfo || [];
            cardList.map(item => {
              item.goodsType = "card";
              item.operateType = 0;
              item.cardKindId = item.id;
              return item;
            });
            this.goodsList = cardList;
            this.serviceListLoading = false;
            this.inited = true;
          });
      },
      changeServiceList(data) {
        if (this.isInCard) {
          this.selectedCardList = [...data];
        } else {
          this.selectedServiceAndProductList = [...data];
        }
      },
      createConsumerOrderFromOrder() {
        this.selectedServiceAndProductList = [];
        let goodsType = this.billInfo.consumerServiceOrderInfo.goodsType;
        let initialTime = this.billInfo.consumerServiceOrderInfo.serviceTime;
        let shortTime = initialTime.substr(0, initialTime.length - 3);
        this.setServiceTime(shortTime);
        if (goodsType === "serviceOrProduct") {
          this.selectedServiceAndProductList = [...dataConvert.selectedServiceAndProductListFromOrder(
            this.billInfo.consumerServiceOrderInfo.consumerGoodsOrderInfoList ||
            []
          )]
        } else {
          this.selectedCardList = [...dataConvert.selectedCardListFromOrder(
            this.billInfo.consumerServiceOrderInfo.consumerGoodsOrderInfoList ||
            []
          )]
        }
      },
      chooseGoodsTypeChanged() {
        this.saveTabStatus = true;
        this.querySortOne();
      },
      changeSelectedCard(data) {
        this.selectedCardList = data;
      },
      handleClearCurrentChooseStatus() {
        this.clearCurrentChooseStatus();
        let type = this.billInfo.currentChooseTypeAndSortOneId.billGoodsType;
        this.setCurrentChooseType(type || "service");
        this.$refs.ChooseGoodsTypeSide.init(type || "service");
        this.setBillChooseGoodsType(null);
      },
      reSearch() {
        this.keyword = null;
        this.queryGoodsListsBySortOne();
      }
    },
    watch: {
      customerInfo: {
        handler: function(v, o) {
          // - 监听选中的客户信息变化，或者新增了客户
          if (o && v.id !== o.id && o.id) {
            // - 人换了得重置所有的产品和卡， 避免线上支付的单子及续卡等情况存在另外一个客户的选择列表
            this.selectedCardList = []
            this.selectedServiceAndProductList= []
          }
        },
        deep: true,
        immediate: true
      }

      // 改用max字段限制产品的库存超限问题, 不行再用这里
      // selectedServiceAndProductList: {
      //   handler: function(v, o) {
      //     console.log(v, o)
      //     if (v.length) {
      //       v.forEach(i => {
      //         if (i.goodsType === 'production' && i.num > i.stock) {
      //           i.num = i.stock
      //         }
      //       })
      //     }
      //   },
      //   deep: true,
      //   immediate: true
      // }
    }
  };
</script>
<style lang="scss" scoped>
  #gm_service_choose_service {
    box-sizing: border-box;
    padding-top: 65px;

    .global-content {
      box-sizing: border-box;
      padding-left: 80px;
      position: relative;
      overflow: hidden;

      .choose-goods {
        // margin: 20px 0;
        margin: 20px 450px 20px 0;
        background: #fff;
        border-radius: 8px;

        .content-wrap {
          padding: 40px 70px 50px 70px;

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
              }
            }

            .content {
              width: 100%;
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

  }
</style>

