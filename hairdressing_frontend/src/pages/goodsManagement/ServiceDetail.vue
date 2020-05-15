<template>
  <div class="service-detail-root text-for-copy">
    <details-header :title="isBrand ? '服务模板详情' : '服务详情'" :hasTabs="false"></details-header>
    <div class="form-container-wrap">
      <div class="form_container" v-loading="loading">
        <el-form :model="form" class="quick_order_form" ref="form" label-width="140px">
          <el-form-item label="服务标题">
            <span class="detail-text">{{ form.title }}</span>
          </el-form-item>
          <el-form-item label="服务短标题">
            <span class="detail-text">{{ form.simpleTitle }}</span>
          </el-form-item>
          <el-form-item label="服务关键字" v-if="!isBrand">
            <span class="detail-text">{{ form.keyword }}</span>
          </el-form-item>
          <el-form-item label="服务分类">
            <span class="detail-text">{{ form.sortOneName }}/{{ form.sortTwoName }}</span>
          </el-form-item>
          <el-form-item label="关联职务" v-if="!isBrand">
            <span class="detail-text" v-if="Array.isArray(form.staffLevelList)">
              <span v-for="(item, index) in form.staffLevelList" :key="index">
                {{
                `${
                index === form.staffLevelList.length - 1
                ? item
                : `${item + "；"}`
                }`
                }}
              </span>
            </span>
          </el-form-item>
          <el-form-item label="轮播图">
            <div class="carousel-images">
              <img v-for="(item, index) in form.cycleImage" :key="index" :src="item.url" />
            </div>
          </el-form-item>
          <el-form-item label="价格是否固定" v-if="!isBrand">
            <span class="detail-text">
              {{
              form.priceConstant ? "是" : "否"
              }}
            </span>
          </el-form-item>
          <el-form-item label="服务价格">
            <div
              class="specialfications"
              v-for="(item, index) in form.specificationAndPrices"
              :key="index"
            >
              <div class="left">
                <div class="key-value">
                  <p class="key">规格</p>
                  <p class="value">{{ item.specificationName }}</p>
                </div>
                <div class="key-value">
                  <p class="key">门店价</p>
                  <p class="value">{{ item.shopPrice }}元</p>
                </div>
                <div class="key-value">
                  <p class="key">会员价</p>
                  <p class="value">{{ item.memberPrice }}元</p>
                </div>
                <div class="key-value">
                  <p class="key">成本</p>
                  <p class="value">{{ item.cost }}元</p>
                </div>
              </div>
              <div class="right">
                <div class="key-value">
                  <p class="key">服务时长</p>
                  <p class="value">{{ item.serviceTime }}分钟</p>
                </div>
                <div class="key-value">
                  <p class="key">预约金</p>
                  <p class="value">{{ item.bookingAmount }}元</p>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="排序" v-if="!isBrand">
            <span class="detail-text">{{ form.orderBy }}</span>
          </el-form-item>
          <el-form-item label="虚拟销量" v-if="!isBrand">
            <span class="detail-text">{{ form.virtualSaleCount }}</span>
          </el-form-item>
          <el-form-item label="上架时间">
            <span class="detail-text-grey">{{ form.shelveShopsTime }}</span>
          </el-form-item>
          <el-form-item label="网店展示" v-if="!isBrand">
            <span class="detail-text">
              {{
              form.showInShop ? "展示" : "不展示"
              }}
            </span>
          </el-form-item>
          <el-form-item label="预约支付" v-if="!isBrand">
            <span class="detail-text">
              {{
              form.needPrePay ? "需要支付" : "无需支付"
              }}
            </span>
          </el-form-item>
          <el-form-item label="是否特价" v-if="!isBrand">
            <span class="detail-text-grey">
              {{
              form.specialPrice ? "是" : "否"
              }}
            </span>
          </el-form-item>
          <el-form-item label="首页推荐" v-if="!isBrand">
            <span class="detail-text">
              {{
              form.recommendInFirstPage ? "推荐" : "不推荐"
              }}
            </span>
          </el-form-item>
          <el-form-item label="服务详情">
            <div class="detail-images">
              <img
                class="images"
                v-for="(img, index) in (form.richText || '').split(',')"
                :key="index"
                :src="utils.formatPicImg(img)"
                alt
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { Base64 } from "js-base64";

export default {
  data() {
    return {
      utils: utils,
      loading: false,
      form: {
        id: 54,
        storeId: null,
        title: null,
        serialNo: "",
        simpleTitle: null,
        keyword: null,
        serviceLevelOne: null,
        serviceLevelTwo: null,
        cycleImage: [],
        specificationAndPrices: [],
        orderBy: null,
        virtualSaleCount: null,
        serviceDetailModel: null,
        serviceGuarantee: [],
        buyNote: null,
        shelveType: true,
        shelveShopsTime: null,
        showInShop: true,
        needPrePay: true,
        specialPrice: false,
        recommendInFirstPage: true,
        shareCopyWriting: null,
        status: true,
        associateAllJobs: true,
        staffLevel: [],
        sortOneName: null,
        sortTwoName: null,
        staffLevelList: [],
        richText: ""
      },
      newSortName: []
    };
  },
  computed: {
    productEditId() {
      return this.$store.state.queryParams.productEditId;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    // 判断是品牌还是门店的标识
    isBrand() {
      // 来自门店点击模板详情也返回brand
      return (
        this.$route.path.indexOf("brand") !== -1 || this.$route.query.fromBrand
      );
    }
  },
  mounted() {
    this.getNewSortName();
  },
  methods: {
    // 获取新的分类名称
    async getNewSortName() {
      const res = await axios.post("getStoreSortInfoWithFilter", {
        brandId: this.currentInfo.brandId,
        sortName: ""
      });
      this.newSortName = res.sortInfos;
      this.getServiceInfo();
    },
    getServiceInfo() {
      this.loading = true;
      let serviceId = this.isBrand
        ? this.$store.state.queryParams.serviceTemplateId
        : Base64.decode(this.$route.query.serviceId);
      // 后端在这里的请求方式不一样？。。。
      let queryType = this.isBrand ? "post" : "get";
      let url = this.isBrand ? "/getServiceTemplateById/" : "/getServiceInfo/";
      axios[queryType](url + Number(serviceId)).then(res => {
        for (let i in res) {
          if (i === "cycleImage") {
            let arr = [];
            res.cycleImage.forEach(element => {
              arr.push({
                name: `${Math.random()}`,
                url: utils.formatPicImg(element)
              });
            });
            this.form.cycleImage = arr;
          } else {
            this.form[i] = res[i];
          }
        }
        // this.form.sortOneName = res.serviceLeveleOneInfo.sortName;
        // this.form.sortTwoName = res.serviceLeveleTwoInfo.sortName;
        console.log(this.newSortName);
        this.newSortName.forEach(item => {
          item.jimeiClassId == res.serviceLeveleOneInfo.jimeiClassId
            ? (this.form.sortOneName = item.sortName || item.name)
            : false;
          item.sortTwo.forEach(i => {
            i.jimeiClassId == res.serviceLeveleTwoInfo.jimeiClassId
              ? (this.form.sortTwoName = i.sortName || i.name)
              : false;
          });
        });
        this.getSimpleStoreStaffLevelList(res.staffLevel, res.associateAllJobs);
        this.loading = false;
      });
    },
    getSimpleStoreStaffLevelList(staffLevel, associateAllJobs) {
      axios
        .get("/getSimpleStoreStaffLevelList/" + this.currentInfo.brandId)
        .then(res => {
          if (associateAllJobs) {
            this.form.staffLevelList = res.levelList.map(item => item.name);
            console.log("所有职务");
          } else {
            this.form.staffLevelList = res.levelList
              .filter(item => {
                return staffLevel.includes(item.id);
              })
              .map(item => item.name);
            console.log("不分账单");
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.service-detail-root {
  .form-container-wrap {
    box-sizing: border-box;
    padding: 0 20px;

    .form_container {
      max-width: 1440px;
      background: white;
      margin: 75px auto;
      margin-bottom: 0;
      box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
      box-sizing: border-box;
      padding: 40px 0;

      .el-form-item {
        margin: 0;

        /deep/ .el-form-item__label {
          color: #666666;
        }

        .detail-text {
          color: #333333;
        }

        .detail-text-grey {
          color: #666666;
        }

        .carousel-images {
          display: flex;
          margin: 10px 0 20px 0;

          img {
            display: block;
            width: 148px;
            height: 148px;
            border-radius: 8px;
            margin-right: 20px;
          }
        }

        .specialfications {
          background: #f1f2f7;
          border-radius: 5px;
          margin-bottom: 10px;
          display: flex;
          max-width: 880px;
          box-sizing: border-box;
          padding: 10px 0;

          .left {
            width: 400px;
          }

          .left,
          .right {
            .key-value {
              display: flex;

              .key {
                width: 90px;
                box-sizing: border-box;
                padding-right: 20px;
                text-align: right;
                color: #666666;
              }
            }
          }
        }

        .detail-images {
          .images {
            display: block;
            max-width: 750px;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
