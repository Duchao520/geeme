<template>
  <div></div>
</template>
<script>
  import {mapActions, mapState} from "vuex";
  import * as axios from "@/util/axios";
  import Bus from "@/util/bus";

  export default {
    props: {
      goodsList: Array
    },
    computed: {
      ...mapState({
        billInfo: state => state.bill,
        openGoodsType: state => state.bill.currentChooseTypeAndSortOneId.sortGoodsType,
      }),
      isInGoods() {/* goods指的是产品和服务，卡项不属于goods */
        return this.openGoodsType === "service" || this.openGoodsType === "product"
      }
    },
    watch: {
      goodsList(list) {
        this.getListOfMemberLevelPrices(list)
      }
    },
    mounted() {
      Bus.$on("get-member-price", () => {
        this.getListOfMemberLevelPrices();
      })
    },
    methods: {
      ...mapActions(["setListOfMemberLevelPrices"]),
      getListOfMemberLevelPrices() {
        /*
        * --在 服务/产品分类
        * --已选择了商品
        * --已选择了顾客
        * */
        let list = this.goodsList;
        if (this.isInGoods && list.length > 0 && this.billInfo.customerInfo.id) {
          let param = {
            goodsSearch: list.map(item => {
              return {
                goodsTypeScopeEnum: item.goodsType.toUpperCase(),
                specificationId: item.specificationId
              }
            }),
            storeCustomerId: this.billInfo.customerInfo.id
          };
          axios.post("/getBrandCustomerGoodsLevelPrice", param).then(res => {
            this.setListOfMemberLevelPrices(res.goodsInfo.map(item => {
              return {
                ...item,
                // memberLevelName: item.priceConstant?"":res.levelName,
                memberLevelName: res.levelName,
                customerBirthday: res.customerBirthday,
                general:res.general,
                goodsType: item.goodsTypeScopeEnum.toLowerCase()
              }
            }));
          });
        }
      }
    },
    beforeDestroy() {
      Bus.$off("get-member-price")
    }
  }
</script>
