<template>
  <full-single-page type="stock" title="库存产品详情" origin="otherTags" v-loading="pageLoading">
    <div class="product-edit">
      <el-form
        ref="form" 
        :model="form" 
        label-width="110px" 
      >
        <!-- 长标题 -->
        <el-form-item label="产品标题:" prop="title">
          {{form.title}}
        </el-form-item>
        <!-- 系统编号 -->
        <el-form-item label="商品编号:" v-if="form.serialNo">
          {{form.serialNo}}
        </el-form-item>
        <!-- 短标题 -->
        <el-form-item label="产品短标题:" prop="simpleTitle">
          {{form.simpleTitle}}
        </el-form-item>
        <!-- 自定义编号 -->
        <el-form-item label="自定义编号:" prop="userDefinedCode">
          {{form.userDefinedCode}}
        </el-form-item>
        <!-- 产品品牌 -->
        <el-form-item label="产品品牌:" prop="productBrandName">
          {{form.productBrandName}}
        </el-form-item>
        <!-- 产品分类 -->
        <el-form-item 
          label="产品分类:" 
        >
          {{form.productLevelOneName}} / {{form.productLevelTwoName}}
        </el-form-item>
        <!-- 轮播图 -->
        <el-form-item 
          label="轮播图:" 
          class="images" 
          prop="cycleImgs"
        >
          <div 
            v-for="i in form.cycleImgs"
            :key="i.url" 
          >
            <img 
              :src="i.url" 
              class="img"
              preview="2" 
              preview-text="" 
            >
          </div>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item label="产品规格:" required>
          <div class="specification-box" v-for="(single, index) in form.listBrandStockProductSpecification" :key="index">
            <!-- 规格名称 & 成本 -->
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item 
                  label-width="100px"
                  :label="`规格${converter.toWords(index + 1)}:`"
                >
                  {{single.specificationName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label-width="100px"
                  label="计量单位:"
                >
                  {{single.specificationUnit}}
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 零售价 初始库存 -->
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item
                  label="零售价:"
                  label-width="100px"
                >
                  {{single.salesPrice}} 元                                   
                </el-form-item>
              </el-col>
              <!-- 初始库存 -->

            </el-row>
            <el-row type="flex">
              <el-col :span="12" v-if="currentEntry === 'brand'">
                <el-form-item
                  label="成本价:"
                  label-width="100px"
                >
                  {{single.costPrice}} 元
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="供货价:"
                  label-width="100px"
                >
                  {{single.givePrice}} 元                 
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <!-- 详情图片 -->
        <el-form-item 
          label="产品详情:" 
          prop="detailImgs"
          style="margin-bottom: 20px;" 
        >
          <img 
            v-for="i in form.detailImgs"
            :src="i.url" 
            :key="i.url" 
            :preview="2" 
            :preview-text="''" 
          >
        </el-form-item>
        <!-- 排序 -->
        <!-- <el-form-item 
          label="排序:" 
          prop="weight"
        >
          {{form.weight}}
        </el-form-item> -->
        <!-- 是否上线 -->
        <!-- 已删除的后端没给  所以这里不显示了 -->
        <!-- <el-form-item label="是否上架:">
          {{form.status ? '下架中' : '已上架'}}
        </el-form-item> -->
        <el-form-item>
          <el-button plain class="plain_gray_btn" @click="colse">关 闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </full-single-page>
</template>
<script>
import * as utils from "@/assets/js/utils"
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
import converter from "number-to-chinese-words"
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      converter,
      form: {
        draft: false, // 是否草稿,  未开发
        title: '', // 长标题
        serialNo: '', // 系统编号
        simpleTitle: '', // 短标题
        userDefinedCode: '', // 自定义编号
        productBrandId: null, // 产品品牌id
        cycleImgs: [], // 新增时
        cycleImages: [], // 提交时 - 轮播图
        detailImgs: [], // 新增时
        detailImages: [], // 提交时 - 详情图
        weight: null, // 排序
        listBrandStockProductSpecification: [
          {
            costPrice: null, // 成本价
            givePrice: null, // 供货价
            salesPrice: null, // 建议零售价
            specificationName: '', // 规格名称
            specificationUnit: '', // 单位
            stockProductId: null, // 产品id
            stockProductSpecificationId: null // 规格id
          }
        ],
        status: 0, // 状态：0-上架，1-下架
      },
      pageLoading: false, 
    }
  },
  created() {
    // 加载产品品牌选项
    this.getEditProductInfo()
  },
  methods: {
    // 获取编辑产品信息
    async getEditProductInfo() {
      let id = Number(Base64.decode(this.$route.params.id))
      if (id <= 0) { return }
      let url = '/getBrandStockProductDetailInfo'
      let data = {
        brandId: this.currentInfo.brandId,
        stockProductId: id,
      }
      let res = await axios.post(url ,data)
      this.form = res.brandStockProduct
      this.form.cycleImgs = JSON.parse(res.brandStockProduct.cycleImages).map(i => {
        return {
          name: `${Math.random()}`,
          url: utils.formatPicImg(i)
        }
      })
      this.form.detailImgs = JSON.parse(res.brandStockProduct.detailImages).map(i => {
        return {
          name: `${Math.random()}`,
          url: utils.formatPicImg(i)
        }
      })
      this.$previewRefresh() // 解决图片放大功能可能失效
    },
    colse() {
      window.close()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  }
}
</script>
<style lang='scss' scoped>
.product-edit {
  padding: 30px 20px;
}
// 服务价格（规格）
.specification-box {
  position: relative;
  background: #f1f2f7;
  padding: 20px 0 10px;
  width: 880px;
  border-radius: 6px;
  /deep/ .el-form-item {
    margin-bottom: 20px;
  }
  &+.specification-box {
    margin-top: 10px;
  }
  .icon-icon_operate_delete {
    position: absolute;
    right: -24px;
    bottom: 2px;
    cursor: pointer;
  }
}
.add-specification {
  font-size: 14px;
  color: #58c9f3;
  transition: all 0.6s;
  cursor: pointer;
  white-space: nowrap;
  width: 80px;
  i {
    margin-right: 5px;
  }
  &:hover {
    opacity: 0.7;
  }
}
img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  object-position: center center;
  cursor: pointer;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 8px;
  & + img {
    margin-left: 12px;
  }
}
</style>
