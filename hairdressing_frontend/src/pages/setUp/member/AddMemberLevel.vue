<template>
  <div class="add-member-level">
    <seed-header :title="`${isAdd?'新增':'编辑'}会员级别`" origin="editProduct" :hasTabs="false"></seed-header>
    <div class="full-container">
      <el-form class="form-container" ref="form" label-width="110px" :model="form" :rules="rules">
        <el-form-item label="会员级别名称" prop="levelName">
          <el-input
            v-model.trim="form.levelName"
            placeholder="请输入级别名称，不超过8个字符"
            maxlength="8"
            style="width: 420px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="成长值条件" prop="experience">
          <el-input
            type="number"
            v-model.trim.number="form.experience"
            placeholder="限填数字"
            style="width: 140px;"
            :disabled="form.general"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分权益" prop="pointMultiple">
          <span>消费享受</span>
          <el-input
            v-model.number="form.pointMultiple"
            placeholder="限填数字"
            type="number"
            style="width: 140px;margin: 0 5px;"
          >
            <template slot="append">倍</template>
          </el-input>
          <span>积分</span>
        </el-form-item>
        <el-form-item label="生日权益" class="discount" prop="birthdayRightsProp">
          <el-checkbox v-model="form.birthdayMsg">发送生日祝福</el-checkbox>
          <br/>
          <el-radio-group v-model="form.birthdayRights" @change="validateFieldBirthday">
            <el-radio :label="0">
              <span style="margin-right:10px">生日当日消费</span>
              <span style="margin-right:10px">所有服务</span>
              <el-form-item
                style="width:100px;margin-right:30px"
                prop="bdAllServiceDisc"
                :rules="{
                required:true,validator:birthdayRightsDiscounts
              }"
              >
                <el-input
                  type="number"
                  v-model.number="form.bdAllServiceDisc"
                  maxlength="4"
                  placeholder="数字"
                  :disabled="form.birthdayRights===1"
                >
                  <el-button slot="append">折</el-button>
                </el-input>
              </el-form-item>

              <span style="margin-right:10px">所有产品</span>
              <el-form-item
                style="width:100px;margin-right:10px"
                prop="bdAllProductDisc"
                :rules="{
                required:true,validator:birthdayRightsDiscounts
              }"
              >
                <el-input
                  type="number"
                  v-model.number="form.bdAllProductDisc"
                  maxlength="4"
                  placeholder="数字"
                  :disabled="form.birthdayRights===1"
                >
                  <el-button slot="append">折</el-button>
                </el-input>
              </el-form-item>

              <span style="color:#CCCCCC">10表示不打折</span>
            </el-radio>
            <el-radio :label="1">
              <span style="margin-right:10px">生日当日消费</span>
              <span style="margin-right:10px">指定服务</span>
              <el-button
                class="button"
                :disabled="form.birthdayRights===0"
                @click="showClassSelect('birthdayService')"
              >选择服务
              </el-button>
              <span style="margin-right:10px">指定产品</span>
              <el-button
                class="button"
                :disabled="form.birthdayRights===0"
                @click="showClassSelect('birthdayProduct')"
              >选择产品
              </el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="showBirthdayRights">
          <!-- 已选生日权益服务分类表 -->
          <class-table
            type="Service"
            :list="form.bdAppointServiceDiscList"
            v-if="Array.isArray(form.bdAppointServiceDiscList)&& form.bdAppointServiceDiscList.length > 0"
            v-show="form.birthdayRights === 1"
            @delete="delBirthdayServiceSelectClass"
            @change="onBirthdayDiscountChange"
            @batch="onBirthdayBatchChange"
          ></class-table>

          <!-- 已选生日权益产品分类表 -->
          <class-table
            type="Product"
            :list="form.bdAppointProductDiscList"
            v-show="form.birthdayRights === 1"
            v-if="Array.isArray(form.bdAppointProductDiscList)&& form.bdAppointProductDiscList.length > 0"
            @delete="delBirthdayProductSelectClass"
            @change="onBirthdayProductDiscountChange"
            @batch="onBirthdayProductBatchChange"
          ></class-table>
        </el-form-item>
        <el-form-item label="折扣权益" class="discount" prop="discountRightsProp">
          <el-radio-group v-model="form.discountRights" @change="validateFieldDiscount">
            <el-radio :label="0">
              <span>不打折</span>
            </el-radio>
            <el-radio :label="1">
              <span style="margin-right:10px">所有服务</span>
              <el-form-item
                style="width:100px;margin-right:30px"
                prop="lvlAllServiceDisc"
                :rules="{
                required:true,validator:discountRightsDiscounts
              }"
              >
                <el-input
                  type="number"
                  v-model.number="form.lvlAllServiceDisc"
                  maxlength="4"
                  placeholder="数字"
                  :disabled="form.discountRights!==1"
                >
                  <el-button slot="append">折</el-button>
                </el-input>
              </el-form-item>

              <span style="margin-right:10px">所有产品</span>
              <el-form-item
                style="width:100px;margin-right:10px"
                prop="lvlAllProductDisc"
                :rules="{
                required:true,validator:discountRightsDiscounts
              }"
              >
                <el-input
                  type="number"
                  v-model.number="form.lvlAllProductDisc"
                  maxlength="4"
                  placeholder="数字"
                  :disabled="form.discountRights!==1"
                >
                  <el-button slot="append">折</el-button>
                </el-input>
              </el-form-item>

              <span style="color:#CCCCCC">10表示不打折</span>
            </el-radio>
            <el-radio :label="2">
              <span style="margin-right:10px">指定服务</span>
              <el-button
                class="button"
                :disabled="form.discountRights!==2"
                @click="showClassSelect('discountService')"
              >选择服务
              </el-button>
              <span style="margin-right:10px">指定产品</span>
              <el-button
                class="button"
                :disabled="form.discountRights!==2"
                @click="showClassSelect('discountProduct')"
              >选择产品
              </el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="showDiscountRights">
          <!-- 已选折扣权益服务分类表 -->
          <class-table
            type="Service"
            :list="form.lvlAppointServiceDiscList"
            v-if="Array.isArray(form.lvlAppointServiceDiscList)&& form.lvlAppointServiceDiscList.length > 0"
            @delete="delDiscountServiceSelectClass"
            @change="onDiscountDiscountChange"
            @batch="onDiscountBatchChange"
          ></class-table>

          <!-- 已选折扣权益产品分类表 -->
          <class-table
            type="Product"
            :list="form.lvlAppointProductDiscList"
            v-if="Array.isArray(form.lvlAppointProductDiscList)&& form.lvlAppointProductDiscList.length > 0"
            @delete="delDiscountProductSelectClass"
            @change="onDiscountProductDiscountChange"
            @batch="onDiscountProductBatchChange"
          ></class-table>
        </el-form-item>
        <el-form-item label="网店权益">
          <el-checkbox v-model="form.freeShipping">产品包邮</el-checkbox>
          <el-checkbox v-model="form.refundFast">极速退款</el-checkbox>
        </el-form-item>
        <el-form-item label="其他权益说明">
          <input-with-count
            style="width: 480px;"
            :autosize="{ minRows: 3, maxRows: 100}"
            placeholder="请输入内容"
            v-model="form.otherRights"
            maxlength="150"
          ></input-with-count>
        </el-form-item>
        <el-form-item label="会员背景图" class="choose-image" prop="backgroundImage">
          <el-radio-group v-model="form.selfUpload">
            <el-radio :label="false">
              从素材库选择
              <choose-images
                :param="{groupKey:6,mediaType:'image'}"
                url="getMediaByGroupKey"
                v-model="form.backgroundImage"
                :disabled="!form.selfUpload"
              ></choose-images>
            </el-radio>
            <el-radio :label="true">
              自定义
              <div class="upload-image">
                <upload-image
                  v-model="form.userDefinedBackImage"
                  :size="5"
                  uploadType="图片"
                  @success="$refs.form.validateField('backgroundImage')"
                ></upload-image>
                <div class="reminder">支持jpg，png格式，大小不超过5M；点击图片可重新上传</div>
              </div>
            </el-radio>
          </el-radio-group>
          <div class="preview" v-show="previewInfo.image">
            <span>用户端效果预览</span>
            <div class="preview-effect">
              <card-preview :previewInfo="previewInfo" style="margin-right: 30px;"></card-preview>
              <banner-preview :previewInfo="previewInfo"></banner-preview>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 20px;">
          <el-button class="normal_blue_btn" @click="submit">保存{{isAdd?"":"修改"}}</el-button>
          <!--<el-button  class="normal_gray_btn">恢复为默认值</el-button>-->
        </el-form-item>
      </el-form>
      <class-select
        :classSelectVisible="birthdayServiceSelectVisible"
        :oriList="serviceList"
        selectType="service"
        @close="birthdayServiceSelectVisible = false"
        @done="mergeBirthdayServiceClassData"
      ></class-select>
      <class-select
        :classSelectVisible="birthdayProductSelectVisible"
        :oriList="productList"
        selectType="product"
        @close="birthdayProductSelectVisible = false"
        @done="mergeBirthdayProductClassData"
      ></class-select>
      <class-select
        :classSelectVisible="discountServiceSelectVisible"
        :oriList="serviceList"
        selectType="service"
        @close="discountServiceSelectVisible = false"
        @done="mergeDiscountServiceClassData"
      ></class-select>
      <class-select
        :classSelectVisible="discountProductSelectVisible"
        :oriList="productList"
        selectType="product"
        @close="discountProductSelectVisible = false"
        @done="mergeDiscountProductClassData"
      ></class-select>
    </div>
  </div>
</template>

<script>
  import ClassSelect from "@/pages/goodsManagement/component/classSelect";
  import ClassTable from "@/pages/goodsManagement/component/classTable";
  import ChooseImages from "@/components/common/ChooseImages";
  import CardPreview from "@/components/setUp/memberLevel/CardPreview";
  import BannerPreview from "@/components/setUp/memberLevel/BannerPreview";
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";

  export default {
    components: {
      ClassSelect,
      ClassTable,
      ChooseImages,
      CardPreview,
      BannerPreview
    },
    data() {
      let positiveNumberValidator = (rule, value, callback) => {
        if ((value | 0) === value && value >= 0) {
          callback();
        } else {
          callback("请输入正整数");
        }
      };
      let decimalNumberValidator = (rule, value, callback) => {
        if (value > 0 && value <= 10 && /^[0-9]*([\.](\d)?)?$/.test(value)) {
          callback();
        } else {
          callback("请输入正数，最多一位小数");
        }
      };
      let birthdayRightsDiscounts = (rule, value, callback) => {
        if (this.form.birthdayRights === 0) {
          decimalNumberValidator(rule, value, callback);
        } else {
          callback();
        }
      };
      let discountRightsDiscounts = (rule, value, callback) => {
        if (this.form.discountRights === 1) {
          decimalNumberValidator(rule, value, callback);
        } else {
          callback();
        }
      };
      let backgroundValidator = (rule, value, callback) => {
        let image = this.form.selfUpload ? this.form.userDefinedBackImage : this.form.backgroundImage;
        if (image) {
          callback()
        } else {
          callback("请选择或上传一张图片")
        }
      };
      let rightsPropValidator = (right, requiredValue, serviceList, productList
      ) => {
        return (rule, value, callback) => {
          if (this.form[right] === requiredValue) {
            let serviceNoNeeded = this.form[serviceList] && this.form[serviceList].length > 1;
            let productNoNeeded = this.form[productList] && this.form[productList].length > 1;
            let valueValided = this.form[serviceList].every(item => item.discount > 0) && this.form[productList].every(item => item.discount > 0);
            if (serviceNoNeeded && productNoNeeded && valueValided) {
              callback();
            } else if ((!serviceNoNeeded) && (!productNoNeeded)) {
              callback("请选择指定服务分类和产品分类");
            } else if (!valueValided) {
              callback("存在已选的服务或产品分类的折扣未填写，请填写")
            } else if (!serviceNoNeeded) {
              callback("请选择指定服务分类");
            } else if (!productNoNeeded) {
              callback("请选择指定产品分类");
            }
          } else {
            callback();
          }
        };
      };
      return {
        form: {
          levelName: null,
          experience: null,
          pointMultiple: null,
          birthdayRights: 0,
          discountRights: 0,
          /* 指定生日权限服务优惠折扣信息列表 */
          bdAppointServiceDiscList: [],
          /* 指定生日权限产品优惠折扣信息列表 */
          bdAppointProductDiscList: [],
          /* 指定折扣权益服务优惠折扣信息列表 */
          lvlAppointServiceDiscList: [],
          /* 指定折扣权益产品优惠折扣信息列表 */
          lvlAppointProductDiscList: [],
          /*四个弹窗的展示状态*/
          bdAllServiceDisc: null,
          bdAllProductDisc: null,
          lvlAllServiceDisc: null,
          lvlAllProductDisc: null,
          freeShipping: false,
          refundFast: false,
          otherRights: null,
          backgroundImage: "",
          userDefinedBackImage: "",
          birthdayMsg: false,
          id: null,
          selfUpload: false,
          general: false
        },
        rules: {
          levelName: {required: true, message: "请输入级别名称，不超过8个字符"},
          experience: {required: true, validator: positiveNumberValidator},
          pointMultiple: {required: true, validator: decimalNumberValidator},
          backgroundImage: {required: true, validator: backgroundValidator},
          birthdayRightsProp: {
            required: true,
            validator: rightsPropValidator("birthdayRights", 1, "bdAppointServiceDiscList", "bdAppointProductDiscList"),
            trigger: "change"
          },
          discountRightsProp:{
            required: true,
            validator: rightsPropValidator("discountRights", 2, "lvlAppointServiceDiscList", "lvlAppointProductDiscList"),
            trigger: "change"
          }
        },
        serviceList: [],
        productList: [],
        birthdayServiceSelectVisible: false,
        birthdayProductSelectVisible: false,
        discountServiceSelectVisible: false,
        discountProductSelectVisible: false,
        birthdayRightsDiscounts,
        discountRightsDiscounts
      };
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
      }),
      isAdd() {
        return this.$route.fullPath.includes("add")
      },
      showDiscountRights() {
        return this.form.discountRights === 2 && (
          Array.isArray(this.form.lvlAppointServiceDiscList) && this.form.lvlAppointServiceDiscList.length > 0 ||
          Array.isArray(this.form.lvlAppointProductDiscList) && this.form.lvlAppointProductDiscList.length > 0
        )
      },
      showBirthdayRights() {
        return this.form.birthdayRights === 1 && (
          Array.isArray(this.form.bdAppointServiceDiscList) && this.form.bdAppointServiceDiscList.length > 0 ||
          Array.isArray(this.form.bdAppointProductDiscList) && this.form.bdAppointProductDiscList.length > 0
        )
      },
      previewInfo() {
        let selfUpload = this.form.selfUpload;
        return {
          image: selfUpload ? this.form.userDefinedBackImage : this.form.backgroundImage,
          levelName: this.form.levelName
        }
      }
    },
    mounted() {
      this.queryServiceClass();
      this.queryProductClass();
      if (!this.isAdd) {
        this.getBrandMemberLevelDetail()
      }
    },
    methods: {
      showClassSelect(type) {
        switch (type) {
          case "birthdayService":
            this.initClassData(this.serviceList, "bdAppointServiceDiscList");
            this.birthdayServiceSelectVisible = true;
            break;
          case "birthdayProduct":
            this.initClassData(this.productList, "bdAppointProductDiscList");
            this.birthdayProductSelectVisible = true;
            break;
          case "discountService":
            this.initClassData(this.productList, "lvlAppointServiceDiscList");
            this.discountServiceSelectVisible = true;
            break;
          case "discountProduct":
            this.initClassData(this.productList, "lvlAppointProductDiscList");
            this.discountProductSelectVisible = true;
            break;
        }
      },
      initClassData(list, type) {
        let selectedObject = this.form[type];
        selectedObject = selectedObject || [];
        selectedObject = JSON.parse(JSON.stringify(selectedObject)).map(i => i.typeTwoId);
        this.searchTree(list, this.initTreeNode.bind(this, selectedObject));
      },
      searchTree(tree, f, prev = null) {
        for (let i of tree) {
          f.call(this, i, prev);
          const sub = i.sortTwo;
          if (Array.isArray(sub) && sub.length > 0) {
            this.searchTree(sub, f, i)
          }
        }
      },
      initTreeNode(selectedObject, current, prev) {
        current.checked = false;
        current.indeterminate = false;
        if (selectedObject.length > 0 && current.jimeiParentId !== 0) {
          if (selectedObject.indexOf(current.jimeiClassId) > -1) {
            current.checked = true;
            const result = this.checkStatus(prev.sortTwo);
            if (result === prev.sortTwo.length) {
              prev.checked = true;
              prev.indeterminate = false
            } else if (result > 0) {
              prev.checked = false;
              prev.indeterminate = true
            }
          }
        }
      },
      checkStatus(current) {
        const result = current.filter(i => !!i.checked);
        return result.length
      },
      mergeBirthdayProductClassData(data) {
        this.bdAppointProductDiscList = data.data;
        this.filterCheckedData(data.data, "bdAppointProductDiscList")
      },
      mergeBirthdayServiceClassData(data) {
        this.bdAppointServiceDiscList = data.data;
        this.filterCheckedData(data.data, "bdAppointServiceDiscList")
      },
      mergeDiscountProductClassData(data) {
        this.lvlAppointProductDiscList = data.data;
        this.filterCheckedData(data.data, "lvlAppointProductDiscList")
      },
      mergeDiscountServiceClassData(data) {
        this.lvlAppointServiceDiscList = data.data;
        this.filterCheckedData(data.data, "lvlAppointServiceDiscList")
      },
      filterCheckedData(tree, type) {
        let list = [];
        list = this.form[type] || [];
        this.searchTree(tree, (current, prev) => {
          if (current.jimeiParentId !== 0 && current.checked) {
            const node = {
              discount: null,
              typeOneId: current.jimeiParentId,
              typeOneName: prev.sortName,
              typeTwoId: current.jimeiClassId,
              typeTwoName: current.sortName
            };
            list.push(node)
          }
        })
      },
      queryServiceClass() {
        axios.post("/getStoreSortInfoWithFilter", {brandId: this.currentInfo.brandId}).then(res => {
          this.serviceList = res.sortInfos || []
        })
      },
      queryProductClass() {
        axios.post("/getProductSortListByNameAndBrandId", {brandId: this.currentInfo.brandId}).then(res => {
          this.productList = res.sortInfos || []
        })
      },
      /*
      * 对所选择服务和产品的折扣修改、删除、折扣统一设置      生日权限 +  折扣权益 共12种
      * */
      /*
      * 公共方法
      * */
      delClass(data, key) {
        let list = this.form[key];
        let index = list.map(item => item.typeTwoId).indexOf(data.id);
        this.form[key].splice(index, 1);
      },
      onDiscountChange(data, key) {
        let list = this.form[key];
        let index = list.map(item => item.typeTwoId).indexOf(data.data.typeTwoId);
        this.form[key].splice(index, 1, data.data);
      },
      onBatchChange(data, key) {
        this.form[key] = this.form[key].map(item => {
          item.discount = data.data;
          return item;
        });
      },
      /*
      * 生日优惠，指定服务的处理
      * */
      delBirthdayServiceSelectClass(data) {
        this.delClass(data, "bdAppointServiceDiscList")
      },
      onBirthdayDiscountChange(data) {
        this.onDiscountChange(data, "bdAppointServiceDiscList")
      },
      onBirthdayBatchChange(data) {
        this.onBatchChange(data, "bdAppointServiceDiscList")
      },
      /*
      * 生日优惠，指定产品的处理
      * */
      delBirthdayProductSelectClass(data) {
        this.delClass(data, "bdAppointProductDiscList")
      },
      onBirthdayProductDiscountChange(data) {
        this.onDiscountChange(data, "bdAppointProductDiscList")
      },
      onBirthdayProductBatchChange(data) {
        this.onBatchChange(data, "bdAppointProductDiscList")
      },

      /*
      * 折扣权限，指定服务的处理
      * */
      delDiscountServiceSelectClass(data) {
        this.delClass(data, "lvlAppointServiceDiscList")
      },
      onDiscountDiscountChange(data) {
        this.onDiscountChange(data, "lvlAppointServiceDiscList")
      },
      onDiscountBatchChange(data) {
        this.onBatchChange(data, "lvlAppointServiceDiscList")
      },
      /*
      * 折扣权限，指定产品的处理
      * */
      delDiscountProductSelectClass(data) {
        this.delClass(data, "lvlAppointProductDiscList")
      },
      onDiscountProductDiscountChange(data) {
        this.onDiscountChange(data, "lvlAppointProductDiscList")
      },
      onDiscountProductBatchChange(data) {
        this.onBatchChange(data, "lvlAppointProductDiscList")
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let param = {
              brandMemberLevels: {
                ...this.form,
                bdAppointProductDiscList: this.convertDiscountInfo(this.form.bdAppointProductDiscList),
                bdAppointServiceDiscList: this.convertDiscountInfo(this.form.bdAppointServiceDiscList),
                lvlAppointProductDiscList: this.convertDiscountInfo(this.form.lvlAppointProductDiscList),
                lvlAppointServiceDiscList: this.convertDiscountInfo(this.form.lvlAppointServiceDiscList),
                birthdayGoods: ["ALL", "APPOINT"][this.form.birthdayRights],
                brandId: this.currentInfo.brandId,
                levelDiscountGoods: ["NIL", "ALL", "APPOINT"][this.form.discountRights],
                backgroundImage: this.form.selfUpload ? this.form.userDefinedBackImage : this.form.backgroundImage
              }
            };
            console.log({param});
            axios.post("/createOrUpdateBrandMemberLevel", param).then(res => {
              this.$message({
                type: res.success ? "success" : "warning",
                message: res.message
              });
              if (res.success) {
                this.$router.go(-1)
              }
            });
          } else {
            console.warn("ERROR SUBMIT")
          }
        })
      },
      convertDiscountInfo(data, type) {
        let arr = [];
        if (type === "edit") {
          arr = data.map(item => {
            return {
              discount: item.discount,
              typeOneId: item.levelOne,
              typeOneName: item.levelOneName,
              typeTwoId: item.levelTwo,
              typeTwoName: item.levelTwoName,
            }
          });
          return this.uniqArr(arr, 'typeTwoId')

        } else {
          arr = data.map(item => {
            return {
              discount: item.discount,
              levelOne: item.typeOneId,
              levelOneName: item.typeOneName,
              levelTwo: item.typeTwoId,
              levelTwoName: item.typeTwoName,
            }
          });
          return this.uniqArr(arr, 'levelTwo')
        }
      },
      uniqArr(arr, key) {
        let hash = {};
        return arr.reduce(function (arr, current) {
          hash[current[key]] ? '' : hash[current[key]] = true && arr.push(current);
          return arr
        }, [])
      },
      getBrandMemberLevelDetail() {
        axios.post("/getBrandMemberLevelDetail", {id: Number(this.$route.query.id)}).then(res => {
          let payload = res.brandMemberLevels;
          this.form = {
            ...payload,
            bdAppointProductDiscList: this.convertDiscountInfo(payload.bdAppointProductDiscList, "edit"),
            bdAppointServiceDiscList: this.convertDiscountInfo(payload.bdAppointServiceDiscList, "edit"),
            lvlAppointProductDiscList: this.convertDiscountInfo(payload.lvlAppointProductDiscList, "edit"),
            lvlAppointServiceDiscList: this.convertDiscountInfo(payload.lvlAppointServiceDiscList, "edit"),
            birthdayRights: ["ALL", "APPOINT"].indexOf(payload.birthdayGoods),
            discountRights: ["NIL", "ALL", "APPOINT"].indexOf(payload.levelDiscountGoods),
            userDefinedBackImage: payload.selfUpload ? payload.backgroundImage : "",
            backgroundImage: payload.selfUpload ? "" : payload.backgroundImage
          };
        })
      },
      validateFieldBirthday(val) {
        if (val) {
          this.$refs.form.validateField(['bdAllServiceDisc', 'bdAllProductDisc'])
        }
      },
      validateFieldDiscount(val) {
        if (val !== 1) {
          this.$refs.form.validateField(['lvlAllServiceDisc', 'lvlAllProductDisc']);
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__body {
    padding: 0;
  }

  .add-member-level {
    padding-top: 65px;

    .full-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 20px;

      .form-container {
        background: #ffffff;
        box-sizing: border-box;
        padding: 40px;
        border-radius: 8px;
        min-height: calc(100vh - 100px);

        .el-form-item {
          /deep/ .el-form-item__label {
            color: #666666;
          }

          /deep/ .el-input-group--append {
            .el-input-group__append {
              width: 40px;
              height: 40px;
              border-radius: 0 3px 3px 0;
              background-color: rgba(213, 218, 223, 1);
              text-align: center;
              line-height: 40px;
              padding: 0;
              color: #fff;
              border: none;
            }
          }
        }

        .el-form-item.discount {
          margin-bottom: 0;
          display: block;

          /deep/ .el-radio {
            margin: 0;
            height: 50px;
            display: flex;
            align-items: center;
            width: 600px;

            /deep/ .el-radio__label {
              display: flex;
              align-items: center;

              /deep/ .el-input-group__append {
                /deep/ .el-input__inner {
                  padding: 10px;
                }

                box-sizing: border-box;
                width: 40px;
                height: 40px;
                color: white;
                padding: 0;
                text-align: center;
                background: #d5dadf;
              }
            }

            .button {
              width: 74px;
              margin-right: 56px;
              height: 30px;
              box-sizing: border-box;
              line-height: 28px;
              border: 1px solid #58c9f3;
              color: #58c9f3;
              border-radius: 5px;
              padding: 0 10px;
            }
          }

          /deep/ .el-radio:nth-child(1) {
            height: 40px;
          }

          /deep/ .el-form-item__error {
            z-index: 2;
          }
        }

        .choose-image.el-form-item {
          .el-radio-group {
            padding-top: 15px;
            display: flex;
            flex-direction: column;

            .el-radio {
              margin: 0;
            }

            .upload-image {
              padding: 15px 0 0;
              display: flex;

              /deep/ .el-upload {
                width: 200px;

                img {
                  width: 100%;
                  height: auto;
                }
              }

              .reminder {
                width: 200px;
                white-space: pre-wrap;
                line-height: 20px;
                font-size: 12px;
                color: #999999;
                margin: 40px 0 0 -10px;
                text-align: left;
              }
            }
          }

          .preview {
            .preview-effect {
              display: flex;
            }
          }
        }
      }
    }
  }
</style>
