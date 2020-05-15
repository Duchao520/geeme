<template>
  <div class="service-detail-root text-for-copy">
    <details-header :title="isBrand ? '产品模板详情' : '产品详情'" :hasTabs="false"></details-header>
    <div class="form-container-wrap">
      <div class="form_container">
        <el-form :model="form" class="quick_order_form" ref="form" label-width="140px">
          <el-form-item label="产品标题">
            <span class="detail-text">{{form.title}}</span>
          </el-form-item>
          <el-form-item label="产品短标题">
            <span class="detail-text">{{form.simpleTitle}}</span>
          </el-form-item>
          <el-form-item label="产品关键字" v-if="!isBrand">
            <span class="detail-text">{{form.keyword}}</span>
          </el-form-item>
          <el-form-item label="产品分类">
            <span class="detail-text">{{form.productLevelOneName}}/{{form.productLevelTwoName}}</span>
          </el-form-item>
          <el-form-item label="产品品牌">
            <span class="detail-text">{{form.productBrandName}}</span>
          </el-form-item>
          <el-form-item label="轮播图">
            <div class="images">
              <img v-for="(item,index) in form.cycleImage" :key="index" :src="item.url">
            </div>
          </el-form-item>
          <el-form-item label="价格是否固定" v-if="!isBrand">
            <span class="detail-text">{{form.priceConstant?"是":"否"}}</span>
          </el-form-item>
          <el-form-item label="产品价格">
            <div
              class="specialfications"
              v-for="(item,index) in form.productSpecificationInfos"
              :key="index"
            >
              <div class="left">
                <div class="key-value">
                  <p class="key">规格</p>
                  <p class="value">{{item.specificationName}}</p>
                </div>
                <div class="key-value">
                  <p class="key">专柜价</p>
                  <p class="value">{{item.shopPrice}}元</p>
                </div>
                <div class="key-value">
                  <p class="key">库存</p>
                  <p class="value">{{item.stock}}</p>
                </div>
              </div>
              <div class="right">
                <div class="key-value">
                  <p class="key">优惠价</p>
                  <p class="value">{{item.memberPrice}}元</p>
                </div>
                <div class="key-value">
                  <p class="key">预警库存</p>
                  <p class="value">{{item.stockAlert}}</p>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="排序" v-if="!isBrand">
            <span class="detail-text-grey">{{form.orderBy}}</span>
          </el-form-item>
          <el-form-item label="虚拟销量" v-if="!isBrand">
            <span class="detail-text">{{form.virtualSaleCount}}</span>
          </el-form-item>
          <el-form-item label="上架时间">
            <span class="detail-text-grey">{{form.shelveShopsTime}}</span>
          </el-form-item>
          <el-form-item label="是否特价" v-if="!isBrand">
            <span class="detail-text-grey">{{form.specialPrice?'是':'否'}}</span>
          </el-form-item>
          <el-form-item label="首页推荐" v-if="!isBrand">
            <span class="detail-text-grey">{{form.recommendInFirstPage?'推荐':'不推荐'}}</span>
          </el-form-item>
          <el-form-item label="产品详情">
            <!--<div class="detail-text" v-html="form.richText"></div>-->
            <div class="detail-images">
              <img class="images" v-for="(img,index) in (form.richText || '').split(',')" :key="index" :src="utils.formatPicImg(img)" alt="">
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
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      utils:utils,
      form: {
        id: null,
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
        recommendInFirstPage: false,
        shareCopyWriting: null,
        status: true,
        associateAllJobs: true,
        sortOneName: null,
        sortTwoName: null,
        brandId: null,
        productLevelOne: null,
        productLevelOneName: null,
        productLevelTwo: null,
        productLevelTwoName: null,
        productDetailModel: null,
        tags: [],
        deleted: false,
        completeDeleted: false,
        deleteTime: null,
        richText: "",
        detailType: null,
        productSpecificationInfos: [],
        snapshotId: null,
        modifyTime: null,
        productBrandName:null
      },
      newSortName: []
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    productTemplateId() {
      return this.$store.state.queryParams.productTemplateId;
    },
    // 判断是品牌还是门店的标识
    isBrand() {
      // 来自门店点击模板详情也返回brand
      return this.$route.path.indexOf('brand') !== -1 || this.$route.query.fromBrand
    }
  },
  mounted() {
    this.getNewSortName();
  },
  methods: {
    // 获取新的分类名称
    async getNewSortName() {
      const res = await axios.post("getProductSortListByNameAndBrandId", {
        brandId: this.currentInfo.brandId,
        sortName: ""
      });
      this.newSortName = res.sortInfos;
      this.productDetailsInfo();
    },
    productDetailsInfo() {
      let id = this.isBrand ? this.productTemplateId : Base64.decode(this.$route.query.id)
      let url = this.isBrand ? '/getProductTemplateById/' : "/productDetailsInfo/"
      axios.post(url + Number(id)).then(res => {
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
        // this.form.productLevelOneName = res.productLeveleOneInfo.sortName;
        // this.form.productLevelTwoName = res.productLeveleTwoInfo.sortName;
        this.newSortName.forEach(item => {
          item.jimeiClassId == res.productLeveleOneInfo.jimeiClassId
            ? (this.form.productLevelOneName = item.sortName || item.name)
            : false;
          item.sortTwo.forEach(i => {
            i.jimeiClassId == res.productLeveleTwoInfo.jimeiClassId
              ? (this.form.productLevelTwoName = i.sortName || i.name)
              : false;
          });
        });
        this.form.productBrandName = res.productBrandName;
      });
    },
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
        .images {
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
        .detail-images{
          .images{
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
