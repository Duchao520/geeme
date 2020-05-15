<template>
  <div class="card-add-root">
    <div class="select-customer-wrap">
      <select-customer
        :list="customerList"
        :phone="phone"
        width="420px"
        @change="search"
        @choose="chooseCustomer"
      ></select-customer>
      <user-box style="margin-top:10px" :list="customerInfo"></user-box>
    </div>
    <div class="own-card">
      <p class="title">所持会员卡如下:</p>
      <div class="card-lists">
        <div
          v-for="(item,index) in cardList"
          class="card"
          :class="item.image"
          :key="index"
          @click="chooseCard"
        >
          <div class="name">
            <p>{{item.name}}</p>
            <p class="rights">享受权益详细说明</p>
          </div>
          <button class="button">充值</button>
          <div class="price-relvant">
            <span>￥{{item.price}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import UserBox from "@/components/appoModule/userBox";
import SelectCustomer from "@/components/appoModule/selectCustomer";
import { mapActions } from "vuex";
export default {
  components: {
    "select-customer": SelectCustomer,
    "user-box": UserBox
  },
  data() {
    return {
      customerList: [],
      phone: "",
      cardList: [
        {
          image: "red",
          name: "皇家美容卡",
          price: 5000
        },
        {
          image: "green",
          name: "高级烫染卡",
          price: 3000
        }
      ]
    };
  },
  computed: {
    customerInfo() {
      let customer = this.$store.state.bill.customerInfo;
      return customer.name ? [this.$store.state.bill.customerInfo] : [];
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  methods: {
    ...mapActions(["saveCustomerInfo"]),
    search(data) {
      if (data) {
        axios
          .post(api.listCustomerLikeMobile.URL, {
            likeMobile: data,
            storeId: this.currentInfo.shopId
          })
          .then(res => {
            this.customerList = res.customerForAppointments;
          });
      } else {
        this.customerList = [];
      }
    },
    chooseCustomer(data) {
      this.saveCustomerInfo(data);
    },
    chooseCard() {}
  }
};
</script>
<style lang="scss" scoped>
.card-add-root {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 0 0 20px;
  .own-card {
    .title {
      font-size: 12px;
      line-height: 50px;
      color: #666666;
      margin-top: 10px;
    }
    .card-lists {
      display: flex;
      .card {
        width: 230px;
        height: 145px;
        border-radius: 8px;
        background: #000;
        margin-right: 30px;
        color: white;
        position: relative;
        padding: 16px 10px;
        box-sizing: border-box;
        .name {
          line-height: 1;
          font-size: 14px;
          .rights {
            line-height: 34px;
            font-size: 12px;
            transition: all 0.6s;
            cursor: pointer;
            &:hover {
              color: #999999;
            }
          }
        }
        .button {
          position: absolute;
          left: 10px;
          bottom: 15px;
          font-size: 12px;
          color: white;
          background: rgba(0, 0, 0, 0.8);
          box-sizing: border-box;
          padding: 2px 5px;
          border-radius: 4px;
        }
        .price-relvant {
          position: absolute;
          right: 10px;
          bottom: 15px;
          line-height: 1;
          font-size: 16px;
        }
      }
      .card.red {
        background: linear-gradient(235deg, red 10%, blue 20%, green 100%);
      }
      .card.green {
        background: repeating-linear-gradient(
          -45deg,
          yellow 10%,
          blue 15%,
          green 20%
        );
      }
    }
  }
}
</style>
