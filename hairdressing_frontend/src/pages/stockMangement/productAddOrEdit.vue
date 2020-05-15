<template>
  <full-single-page type="stock" :title="title" v-loading="pageLoading">
    <div class="product-edit">
      <el-form
        ref="form" 
        :model="form" 
        :rules="rules"
        label-width="110px" 
      >
        <!-- 长标题 -->
        <el-form-item label="产品标题" prop="title">
          <el-input 
            maxlength="60" 
            style="width:420px"
            v-model.trim="form.title" 
            placeholder="请输入产品标题，不超过60个中文字符"
          ></el-input>
        </el-form-item>
        <!-- 系统编号 -->
        <el-form-item label="商品编号" v-if="form.serialNo">
          <el-input v-model.trim="form.serialNo" disabled style="width:200px"></el-input>
        </el-form-item>
        <!-- 短标题 -->
        <el-form-item label="产品短标题" prop="simpleTitle">
          <el-input
            maxlength="20"
            style="width:200px"
            placeholder="请输入2-20个字符"
            v-model.trim="form.simpleTitle"
          ></el-input>
        </el-form-item>
        <!-- 自定义编号 -->
        <el-form-item label="自定义编号" prop="userDefinedCode">
          <el-input
            maxlength="16"
            style="width:200px"
            placeholder="请输入自定义编号"
            v-model.trim="form.userDefinedCode"
          ></el-input>
        </el-form-item>
        <!-- 产品品牌 -->
        <el-form-item label="产品品牌" prop="productBrandId">
          <el-select
            :popper-append-to-body="false"
            v-model="form.productBrandId"
            placeholder="请选择品牌"
            style="width:200px"
            @change="handleProductBrandChanged"
          >
            <el-option 
              :label="brand.brandName"
              :key="brand.productBrandId" 
              :value="brand.productBrandId"
              v-for="brand in productBrandOption" 
            ></el-option>
          </el-select>
          <span style="color:#58C9F3; margin-left:5pxfont-size:12px; cursor:pointer;" @click="showReminder = true">没有想要的品牌？</span>
        </el-form-item>
        <!-- 产品分类 -->
        <el-form-item 
          label="产品分类" 
          prop="productClassSelected"
          :rules="{required: true, validator: productClassValidator, trigger: 'change'}"
        >
          <el-cascader
            style="width:200px"
            :options="classifications"
            v-loading="cascadeLoading"
            v-model="productClassSelected"
            :props="{ label:'sortName', value:'id', children:'subClass' }"
          ></el-cascader>
        </el-form-item>
        <!-- 轮播图 -->
        <el-form-item 
          label="轮播图" 
          class="images" 
          prop="cycleImgs"
          :rules="{required: false, validator: cycleImageValidator, trigger: 'change'}"
        >
          <el-upload
            multiple
            :limit="5"
            :action="uploadUrl"
            list-type="picture-card"
            :on-exceed="lunboExceed"
            :file-list="form.cycleImgs"
            :on-remove="handleLunBoRemove"
            :headers="{Authorization: token}"
            :on-success="handleLunBoSuccess"
            :before-upload="beforeLunBoUpload"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p style="color:#999999;font-size:12px;height:25px">支持png，jpg格式，建议像素800*800px以上，大小不超过{{updateFileSizeLimit1}}M，最多5张，点击图片可重新上传</p>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item label="产品规格" required>
          <div class="specification-box" v-for="(single, index) in form.listBrandStockProductSpecification" :key="index">
            <!-- 规格名称 & 成本 -->
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item 
                  label-width="100px"
                  :label="`规格${converter.toWords(index + 1)}`"
                  :prop="'listBrandStockProductSpecification.'+index+'.specificationName'"
                  :rules="{required: true, validator: handleValidateSPname, trigger: 'blur'}"
                >
                  <el-input
                    maxlength="16"
                    v-model.trim="single.specificationName"
                    style="width:200px"
                    placeholder="请输入规格名称"
                  ></el-input>
                    <!-- :placeholder="form.listBrandStockProductSpecification.length === 1 ? '不填即默认' : '多规格必填'" -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label-width="100px"
                  label="计量单位"
                  :prop="'listBrandStockProductSpecification.'+index+'.specificationUnit'"
                  :rules="[
                    { required: true, message: '计量单位不能为空', trigger: 'blur'}
                  ]"
                >
                  <el-input
                    maxlength="5"
                    style="width:200px"
                    v-model.trim="single.specificationUnit"
                    placeholder="请输入计量单位"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 零售价 初始库存 -->
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item
                  label="建议零售价"
                  label-width="100px"
                  :rules="{ required: true, validator: costPriceValidator, trigger: 'blur'}"
                  :prop="'listBrandStockProductSpecification.' + index + '.salesPrice'"
                >
                  <number-input
                    :max="99999999"
                    :min="0"
                    width="200px"
                    v-model="single.salesPrice"
                    placeholder="请输入建议零售价"
                    :slotObj="{show: true, name: '元'}"
                  > 
                  </number-input>
                </el-form-item>
              </el-col>
              <!-- 库存 - 仅新增可输入 -->
              <el-col :span="12">
                <el-form-item 
                  label="期初库存"
                  label-width="100px"
                >
                  <number-input
                    :disabled="$route.path.indexOf('edit') > 0"
                    :max="99999999"
                    :min="0"
                    width="200px"
                    v-model="single.initStock"
                    placeholder="期初库存(仅新增时可输入)"
                  >
                  </number-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 成本价 供货价 -->
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item
                  label="成本价"
                  label-width="100px"
                  :rules="{ required: true, validator: costPriceValidator, trigger: 'blur'}"
                  :prop="'listBrandStockProductSpecification.' + index + '.costPrice'"
                >
                  <number-input
                    :max="99999999"
                    :min="0"
                    width="200px"
                    v-model="single.costPrice"
                    placeholder="请输入成本价"
                    :slotObj="{show: true, name: '元'}"
                  >
                  </number-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="供货价"
                  label-width="100px"
                  :prop="'listBrandStockProductSpecification.' + index + '.givePrice'"
                  :rules="{ required: true, validator: costPriceValidator, trigger: 'blur'}"
                >
                  <number-input
                    :max="99999999"
                    :min="0"
                    width="200px"
                    v-model="single.givePrice"
                    placeholder="请输入供货价"
                    :slotObj="{show: true, name: '元'}"
                  >
                  </number-input>
                </el-form-item>
              </el-col>
            </el-row>
            <i class="icon iconfont icon-icon_operate_delete" v-if="index > 0" @click="delSpecialForm(single,index)"></i>
          </div>
          <p class="add-specification" v-if="form.listBrandStockProductSpecification.length < 20" @click="addSpecification">
            <i class="icon iconfont icon-icon_ope_append"></i>添加规格
          </p>
        </el-form-item>
        <!-- 详情图片 -->
        <el-form-item 
          label="产品详情" 
          prop="detailImgs"
          style="margin-bottom: 20px;" 
          :rules="{required: true,  validator: richTextImagesValidator, trigger: 'change'}"
        >
          <el-upload
            :action="uploadUrl"
            :headers="{Authorization: token}"
            list-type="picture-card"
            multiple
            :on-success="handleRichTextImagesSuccess"
            :before-upload="exmineDetailImage"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRichTextImagesRemove"
            :file-list="form.detailImgs"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p style="color:#999999;font-size:12px">支持png，jpg，gif格式，大小不超过5M，点击图片可重新上传</p>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item 
          label="排序" 
          prop="weight"
          :rules="{required: false, validator: handleVaildateWeight, trigger: 'blur'}"
        >
          <number-input
            :min="0"
            :max="9999"
            width="200px"
            v-model="form.weight"
            placeholder="仅限自然数"
          ></number-input>
        </el-form-item>
        <!-- 是否上线 -->
        <el-form-item label="是否上架">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">立即上架</el-radio>
            <el-radio :label="1">暂不上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button class="normal_blue_btn" @click="publish">发 布</el-button>
          <el-button plain class="plain_gray_btn" @click="$router.go(-1)">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible="showReminder" width="1000px" class="reminder-dialog" @close="showReminder=false">
      <h6 class="title" slot="title">请在 总部控制台-商品管理栏目 下进行操作</h6>
      <img src="@/assets/img/img_novice_pro.png">
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
          :visible.sync="bigImageVisible"
          :before-close="dialogBeforeClose"
          width="790px"
        >
          <img style="display:block;max-width: 750px" :src="bigImageUrl" />
        </el-dialog>
  </full-single-page>
</template>
<script>
import * as utils from "@/assets/js/utils"
import { reg } from "@/assets/js/RegExp"
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
import converter from "number-to-chinese-words"
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
            initStock: '', // 期初库存 // 该字段编辑的时候不给了
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
      productClassSelected: [], // 产品分类级联选中值
      comparisonClass: {}, // 存储级联数据比对用， 提交接口时要从这里获取一二级分类的名称给后端
      comparisonBrandName: {}, // 存储的品牌对比数据， 提交时传给后端
      pageLoading: false, 
      showReminder: false, // 引导图
      productClassOption: [], // 产品分类数据
      productBrandOption: [], // 产品品牌数据
      classifications: [], // 产品分类-级联组件数据
      cascadeLoading: false,
      uploadUrl: `${process.env.SERVICE_URL}/service-api/uploadPicture/`,
      token: '',
      rules: {
        title: [{required: true,  message: "请输入产品标题，不超过60个中文字符", trigger: 'change'}],
        simpleTitle: [
          { required: true, message: '请输入产品短标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        userDefinedCode: [
          { required: false, message: '请输入自定义编号', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'change' }
        ],
        productBrandId: {required: true,  message: "请选择产品品牌"},
      },
      updateFileSizeLimit1: 3, // 轮播
      updateFileSizeLimit2: 5, // 详情
      bigImageVisible: false,
      bigImageUrl: '',
    }
  },
  created() {
    // 加载产品品牌选项
    this.initProductBrandOption()
    this.token = utils.getCookieToken("geeme_pc_token")[2];
  },
  methods: {
    // 产品品牌
    async initProductBrandOption() {
      let res = await axios.get(`/getAllProductBrandManage/${this.currentInfo.brandId}`)
      this.productBrandOption = res.productBrandManageList || []
      if (this.productBrandOption.length) {
        this.productBrandOption.map(i => {
          this.comparisonBrandName[i.productBrandId] = i.brandName // 比对用的数据
        })
      } else {
        this.$message.error('没有产品品牌，无法创建产品')
      }
      this.getEditProductInfo()
    },
    // 根据所选的产品品牌，请求可用的产品分类数据
    async initProductClassByChoosedBrand() {
      this.cascadeLoading = true;
      axios.get(`/getProductClass/${this.form.productBrandId}`).then(res => {
        let arr = res.data;
        axios
          .post("/getProductSortListByNameAndBrandId", {
            brandId: this.currentInfo.brandId,
            sortName: ""
          })
          .then(response => {
            // 后端做新口子不方便。。
            arr.forEach((item, index) => {
              response.sortInfos.forEach((i, idx) => {
                i.jimeiClassId == item.id
                  ? (item.sortName = i.sortName)
                  : false;
                item.subClass.forEach(element => {
                  i.sortTwo.forEach(e => {
                    e.jimeiClassId == element.id
                      ? (element.sortName = e.sortName)
                      : false;
                  });
                });
              });
            });
            arr.forEach(item => {
              item.sortName = item.sortName || item.name;
              item.subClass.forEach(i => {
                i.sortName = i.sortName || i.name;
              });
            });
            // this.classifications = arr.map(item => {
            //   this.comparisonClass[item.id] = item.name; // 比对用的数据
            //   let subClass = item.subClass.map(i => {
            //     this.comparisonClass[i.id] = i.name; // 比对用的数据
            //     let sortTwoSubClass = i;
            //     delete sortTwoSubClass.subClass;
            //     return sortTwoSubClass;
            //   });
            //   item.subClass = subClass;
            //   return item;
            // });
            this.classifications = arr.map(item => {
              this.comparisonClass[item.id] = item.name; // 比对用的数据
              let subClass = item.subClass.map(i => {
                this.comparisonClass[i.id] = i.name; // 比对用的数据
                let sortTwoSubClass = i;
                delete sortTwoSubClass.subClass;
                return sortTwoSubClass;
              });
              item.subClass = subClass;
              return item;
            });
            this.cascadeLoading = false;
          });
      });
    },
    // 产品品牌切换
    handleProductBrandChanged() {
      // 切换要清除已选的产品分类，并且重新请求分类数据
      this.productClassSelected = []
      this.initProductClassByChoosedBrand()
    },
    // 发布产品（新增、编辑）
    publish() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form))
          form.cycleImages = JSON.stringify(form.cycleImgs.map(i => i.response ? i.response.fileKey : i.url.split("/").pop()))
          form.detailImages = JSON.stringify(form.detailImgs.map(i => i.response ? i.response.fileKey : i.url.split("/").pop()))
          delete form.cycleImgs
          delete form.detailImgs
          let url = this.$route.path.indexOf('add') > 0 ? '/createBrandStockProduct' : '/modifyBrandStockProduct'
          form.productLevelOne = this.productClassSelected[0]
          form.productLevelTwo = this.productClassSelected[1]
          form.productLevelOneName = this.comparisonClass[form.productLevelOne]
          form.productLevelTwoName = this.comparisonClass[form.productLevelTwo]
          form.productBrandName = this.comparisonBrandName[form.productBrandId]
          axios.post(url, {
            brandStockProduct: {...form, brandId: this.currentInfo.brandId}
          }).then(res => {
            if (res.success) {
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
          }).then(() => {
            this.pageLoading = false
          })
        } else {
          this.$message.error('请检查必填信息是否输入完整')
        }
      })
    },
    // 获取编辑产品信息
    async getEditProductInfo() {
      if (this.$route.path.indexOf('edit') > 0) {
        let id = this.brandProduct[this.currentInfo.brandId]
        let url = '/getBrandStockProductDetailInfo'
        let data = {
          brandId: this.currentInfo.brandId,
          stockProductId: id,
        }
        let res = await axios.post(url ,data)
        this.form = res.brandStockProduct
        if (res.brandStockProduct.cycleImages) {
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
        } else {
          this.form.cycleImgs = []
          this.form.detailImgs = []
        }
        this.productClassSelected = [res.brandStockProduct.productLevelOne, res.brandStockProduct.productLevelTwo]
        this.initProductClassByChoosedBrand()
      }
    },
    // -轮播图上传相关-
    lunboExceed(files, fileList) {
      if (files.length + fileList.length > 5) {
        this.$message.error("最多上传5张");
      }
    },
    handleLunBoSuccess(res, file, fileList) {
      this.form.cycleImgs = fileList;
      // this.$refs.form.validateField("cycleImgs");
    },
    beforeLunBoUpload(file) {
      return this.beforeUpload(file, this.updateFileSizeLimit1);
    },
    handlePictureCardPreview(data) {
      this.bigImageUrl = data.url;
      this.bigImageVisible = true;
    },
    dialogBeforeClose() {
      this.bigImageVisible = false;
    },
    handleLunBoRemove(file, fileList) {
      this.form.cycleImgs = fileList;
      // this.$refs.form.validateField("cycleImgs");
    },
    // =轮播图上传相关=
    // -产品详情图上传相关-
    handleRichTextImagesSuccess(res, file, fileList) {
      this.form.detailImgs = fileList;
      // this.$refs.form.validateField("detailImgs");
    },
    exmineDetailImage(file) {
      return this.beforeUpload(file, this.updateFileSizeLimit2)
    },
    handleRichTextImagesRemove(file, fileList) {
      this.form.detailImgs = fileList;
      // this.$refs.form.validateField("detailImgs");
    },
    // =产品详情图上传相关=
    beforeUpload(file, size) {
      const isJPG = utils.checkImgTypes(file.type);
      const isLt2M = file.size / 1024 / 1024 < size;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过${size}M!`);
      }
      return isJPG && isLt2M;
    },
    // 添加规格
    addSpecification() {
      this.form.listBrandStockProductSpecification.push({
        costPrice: null, // 成本价
        givePrice: null, // 供货价
        salesPrice: null, // 建议零售价
        specificationName: '', // 规格名称
        specificationUnit: '', // 单位
        initStock: '', // 期初库存， 编辑时不可用
        stockProductId: null, // 产品id
        stockProductSpecificationId: null // 规格id
      })
    },
    // 删除规格
    delSpecialForm(specialItem, index) {
      let list = JSON.parse(JSON.stringify(this.form.listBrandStockProductSpecification));
      // if (specialItem.stockProductId) {
        // list[index].deleted = true;
      // } else {
        list.splice(index, 1);
      // }
      this.form.listBrandStockProductSpecification = list;
      // this.$refs.form.resetFields() // 重置规格校验 ??报错
    },
    // ===== 校验相关 =====
    // 规格名称
    handleValidateSPname(rule, value, cb) {
      // if (this.form.listBrandStockProductSpecification.length > 1 && !value) {
      if (!value) {
        cb('请输入规格名称')
      } else {
        cb()
      }
    },
    // 成本价、建议零售价、供货价 
    costPriceValidator(rule, value, cb) {
      if (reg.price.test(value) && value != 0) {
        cb()
      } else {
        cb('请输入大于0的数字, 最多2位小数')
      }
    },
    // 轮播图校验
    cycleImageValidator(rule, value, cb) {
      let arr = this.form.cycleImgs;
      // if (arr.length === 0) {
      //   cb("请上传至少一张图片");
      // } else {
        cb();
      // }
    },
    // 详情图校验
    richTextImagesValidator(rule, value, cb) {
      let arr = this.form.detailImgs;
      if (arr.length === 0) {
        cb("请上传至少一张图片");
      } else {
        cb();
      }
    },
    // 排序权重
    handleVaildateWeight(rule, value, cb) {
      if (reg.num.test(value) || value <= 0) {
        cb()
      } else {
        cb('请输入0~9999的数字')
      }
    },
    // 产品分类
    productClassValidator(rule, value, cb) {
      if (this.productClassSelected && this.productClassSelected.length) {
        cb()
      } else {
        cb('请选择产品分类')
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      brandProduct: state => state.stockGoods.brandProduct, // 存储的品牌下的当前编辑产品id
    }),
    title() {
      return this.$route.path.indexOf('add') > 0 ? '新增库存产品' : '编辑库存产品'
    }
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

.reminder-dialog {
  /deep/ .el-dialog__header {
    padding: 0 20px;
    .title {
      line-height: 60px;
      color: #333333;
      font-size: 16px;
      padding: 0;

      > span {
        color: #F52D56;
      }
    }
  }
  /deep/ .el-dialog__body {
    padding: 0 20px 20px;
    img {
      width: 960px;
    }
  }
}
</style>
