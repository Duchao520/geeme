<template>
  <full-single-page
    type="service-set"
    :title="$route.path.indexOf('add') !== -1 ? isBrand ? '新增产品模板' : '新增产品' : isBrand ? '编辑产品模板' : '编辑产品'"
  >
    <div class="pro-root">
      <div class="form-wrap">
        <div class="form-content">
          <el-form ref="form" :model="form" label-width="110px" :rules="formRules">
            <div style="display: flex;">
              <el-form-item label="产品标题" prop="title">
                <el-input
                  maxlength="30"
                  style="width:420px"
                  v-model.trim="form.title"
                  placeholder="请输入产品的标题，不超过30个中文字符"
                ></el-input>
              </el-form-item>
              <div style="margin-left: 20px;" v-if="detectionCondition()">
                <el-button @click="detection" :loading="btnLoad" type="primary" plain>重名检测</el-button>
                <span v-if="isRepetition && isDetection" class="detection-success">
                  <i class="el-icon-success"></i>该名称可以使用
                </span>
                <span v-if="!isRepetition && isDetection" class="detection-error">
                  <i class="el-icon-error"></i>该名称已被使用
                </span>
              </div>
            </div>

            <el-form-item label="商品编号" v-if="form.serialNo && !isBrand && !fromBrand">
              <el-input v-model="form.serialNo" disabled style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="产品短标题" prop="simpleTitle">
              <el-input
                maxlength="20"
                style="width:200px"
                v-model.trim="form.simpleTitle"
                placeholder="请输入2-20个字符"
              ></el-input>
            </el-form-item>
            <el-form-item label="店内编码" v-if="!isBrand">
              <el-input
                maxlength="109"
                style="width:200px"
                v-model.trim="form.keyword"
                placeholder="请输入店内编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品品牌" prop="productBrandId">
              <el-select
                style="width:200px"
                placeholder="请选择品牌"
                @change="getProductClass"
                v-model="form.productBrandId"
                :popper-append-to-body="false"
                :disabled="!!fromBrand"
              >
                <el-option
                  v-for="(item, index) in productBrandManageList"
                  :key="index"
                  :label="item.brandName"
                  :value="item.productBrandId"
                ></el-option>
              </el-select>
              <span
                style="color: #58C9F3;margin-left: 5px;font-size: 12px;cursor: pointer;"
                @click="showReminder = true"
              >没有想要的品牌？</span>
            </el-form-item>
            <el-form-item label="产品分类" prop="classification">
              <el-cascader
                style="width:200px"
                :options="classifications || []"
                v-loading="cascadeLoading"
                v-model="form.classification"
                :disabled="!!fromBrand"
                :props="{
                expandTrigger: 'hover',
                label: 'sortName',
                value: 'id',
                children: 'subClass'
              }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="轮播图" class="images" prop="cycleImage">
              <el-upload
                multiple
                :limit="5"
                :action="uploadUrl"
                :headers="myHeaders"
                list-type="picture-card"
                :on-exceed="lunboExceed"
                :on-success="handleLunBoSuccess"
                :before-upload="beforeLunBoUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleLunBoRemove"
                :file-list="form.cycleImage"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <p style="color:#999999;font-size:12px;height:25px">
                支持png，jpg格式，建议像素800*800px以上，大小不超过{{
                updateFileSizeLimit1
                }}M，最多5张，点击图片可重新上传
              </p>
            </el-form-item>
            <el-form-item label="主图视频" prop="video">
              <!-- limit 10M == delete -->
              <video-upload :url="form.video" @onChanged="onVideoUploaded" :limit="10" />
              <!-- 10M  30s ==> 20M 60s -->
              <p style="color:#999999;font-size:12px;height:25px">仅支持mp4格式，大小不超过10M，建议不超过30秒</p>
            </el-form-item>
            <el-form-item label="产品价格" required>
              <template v-for="(specialItem, index) in form.productSpecificationInfos">
                <div class="specialForm" :key="index" v-show="!specialItem.deleted">
                  <i
                    class="icon iconfont icon-icon_operate_delete price-delete"
                    v-if="index > 0"
                    @click="delSpecialForm(specialItem, index)"
                  ></i>
                  <!-- :label="`规格${converter.toWords(index+1)}`" -->
                  <el-form-item
                    :label="
                    form.productSpecificationInfos.length > 1
                      ? `规格${converter.toWords(index + 1)}`
                      : '规格'
                  "
                    :prop="
                    'productSpecificationInfos.' + index + '.specificationName'
                  "
                    :rules="{
                    required: form.productSpecificationInfos.length > 1,
                    validator: specificationNameValid
                  }"
                  >
                    <div class="name">
                      <!-- placeholder="请输入规格" -->
                      <el-input
                        v-model="specialItem.specificationName"
                        style="width:200px"
                        :placeholder="
                        form.productSpecificationInfos.length === 1
                          ? '不填即默认'
                          : '多规格必填'
                      "
                      ></el-input>
                      <span
                        style="color:#CCCCCC;margin-left:15px;font-size:12px;"
                        v-if="form.productSpecificationInfos.length === 1"
                      >如果不填写则默认只有一种规格</span>
                    </div>
                  </el-form-item>
                  <div class="specification-line">
                    <el-form-item
                      label="专柜价"
                      :prop="'productSpecificationInfos.' + index + '.shopPrice'"
                      :rules="{ required: true, validator: priceValidator }"
                    >
                      <el-input
                        type="number"
                        v-model="specialItem.shopPrice"
                        placeholder="请输入专柜价"
                        style="width: 200px;"
                        @mousewheel.native.prevent
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="specification-line">
                    <!-- <el-form-item label="成长会员价" class="member-price" required> -->

                    <!-- <el-radio-group v-model="form.priceConstant">
                      <el-radio :label="true">
                        <span>固定</span>
                        <el-form-item label=""
                          :prop="'productSpecificationInfos.'+index"
                          :rules="{ required: form.priceConstant, validator:priceValidatorNew }"
                        >
                          <el-input type="number"
                                    v-model="specialItem.memberPrice" placeholder="请输入优惠价"
                                    style="width: 200px;" @mousewheel.native.prevent>
                            <el-button slot="append">元</el-button>
                          </el-input>
                        </el-form-item>
                      </el-radio>
                      <el-radio :label="false"><span>根据会员级别变动</span><span class="reminder-text">如何设置会员级别？</span>
                      </el-radio>
                    </el-radio-group>-->

                    <!-- 成长会员价 -->
                    <el-form-item
                      label="成长会员价"
                      class="member-price"
                      :prop="'productSpecificationInfos.' + index"
                      :rules="{ required: true, validator: priceValidatorNew }"
                    >
                      <el-input
                        type="number"
                        v-model="specialItem.memberPrice"
                        placeholder="请输入成长会员价"
                        style="width: 200px;"
                        @mousewheel.native.prevent
                      >
                        <el-button slot="append">元</el-button>
                      </el-input>
                      <div class="checkbox-line">
                        <el-checkbox v-model="form.priceChangedWithLevel">启用会员级别变动</el-checkbox>
                        <span class="gray-text">（启用后，上述成长会员价将失效，将随会员级别而变动）</span>
                        <span class="like-link" @click="showMemberLevelSet = true">如何设置会员级别？</span>
                      </div>
                      <p class="member-level-prices" v-if="form.priceChangedWithLevel">
                        <span
                          v-for="(item, index) in memberLevelPrices(
                          specialItem.shopPrice
                        )"
                          :key="index"
                        >
                          <span class="member-level-name">{{ item.levelName }}：</span>
                          <span class="price">
                            {{
                            item.memberLevelPrice.toFixed(2) || "0"
                            }}元；
                          </span>
                        </span>
                      </p>
                    </el-form-item>
                    <!-- </el-form-item> -->
                  </div>
                  <div class="specification-line">
                    <!-- 持卡会员价 -->
                    <el-form-item
                      label="持卡会员价"
                      class="member-price"
                      :prop="'productSpecificationInfos.' + index"
                      :rules="{
                      required: !form.enableCardDiscount,
                      validator: costValidator
                    }"
                    >
                      <el-input
                        type="number"
                        v-model="specialItem.cardConstantPrice"
                        placeholder="请输入持卡会员价"
                        style="width: 200px;"
                        @mousewheel.native.prevent
                      >
                        <el-button slot="append">元</el-button>
                      </el-input>
                      <div class="checkbox-line">
                        <el-checkbox v-model="form.enableCardDiscount">启用会员卡折扣</el-checkbox>
                        <span class="gray-text">（启用后，上述持卡会员价将失效，按卡内设置折扣计算）</span>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="specification-line">
                    <el-form-item
                      label="库存"
                      :prop="'productSpecificationInfos.' + index + '.stock'"
                      :rules="{
                      required: true,
                      validator: stockValidator
                    }"
                    >
                      <el-input
                        type="number"
                        v-model="specialItem.stock"
                        placeholder="仅限数字"
                        style="width: 200px;"
                        @mousewheel.native.prevent
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="预警库存"
                      :prop="'productSpecificationInfos.' + index + '.stockAlert'"
                      :rules="{
                      required: true,
                      validator: stockValidator
                    }"
                    >
                      <el-input
                        type="number"
                        v-model="specialItem.stockAlert"
                        placeholder="仅限数字"
                        style="width: 200px;"
                        @mousewheel.native.prevent
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="specification-line">
                    <!-- 规格参数 -->
                    <el-form-item label="规格参数">
                      <div
                        class="parameter-box"
                        v-for="(item,idx) in specialItem.paramList"
                        :key="idx"
                      >
                        <el-form-item label="标题" prop="parameterTitle">
                          <el-input
                            v-model="item.title"
                            placeholder="最多6个中文字符"
                            style="width: 240px"
                            :maxlength="6"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                          <el-input
                            v-model="item.content"
                            type="textarea"
                            placeholder="最多160个中文字符"
                            style="width: 440px"
                            maxlength="160"
                            show-word-limit
                            :rows="2"
                          ></el-input>
                        </el-form-item>
                        <div class="parameter-icon">
                          <i
                            class="icon iconfont icon-icon_ope_append"
                            @click="addParamter(specialItem,index)"
                          ></i>
                          <i
                            class="icon iconfont icon-icon_operate_delete"
                            @click="delParamter(index,idx)"
                            v-if="specialItem.paramList.length > 1"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </template>
              <p class="addspec" @click="addSpecification">
                <i class="icon iconfont icon-icon_ope_append"></i>添加规格
              </p>
            </el-form-item>
            <el-form-item label="产品详情" style="margin-bottom: 20px;" prop="richTextImages">
              <!--prop="richText"-->
              <!--<gmEditor class="product-detail" v-model="form.richText"></gmEditor>-->
              <el-upload
                :action="uploadUrl"
                :headers="myHeaders"
                list-type="picture-card"
                multiple
                :on-success="handleRichTextImagesSuccess"
                :before-upload="exmineDetailImage"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRichTextImagesRemove"
                :file-list="form.richTextImages"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <p style="color:#999999;font-size:12px">
                支持png，jpg，gif格式，大小不超过{{
                updateFileSizeLimit2
                }}M，点击图片可重新上传
              </p>
            </el-form-item>
            <!-- 服务保障 -->
            <el-form-item label="服务保障" prop="serverTempList">
              <el-checkbox-group v-model="form.serverTempList" style="width: 800px">
                <el-checkbox
                  :key="item.id"
                  v-for="item in serviceGuaranteeList"
                  :label="item.id"
                  style="margin-left: 0"
                >{{ item.title }}</el-checkbox>
                <div @click="setTempalte(1)" class="set-icon">
                  <i class="el-icon-edit-outline"></i> 设置模板
                </div>
              </el-checkbox-group>
            </el-form-item>
            <!-- 购买须知 -->
            <el-form-item label="购买须知">
              <el-select v-model="form.purchaseNoteList[0]" placeholder="请选择购买须知" clearable>
                <el-option
                  v-for="item in buyNoteList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div @click="setTempalte(2)" class="set-icon">
                <i class="el-icon-edit-outline"></i> 设置模板
              </div>
            </el-form-item>
            <el-form-item label="排序" v-if="!isBrand">
              <number-input
                v-model="form.orderBy"
                width="200px"
                placeholder="仅限数字"
                :min="0"
                :max="9999"
              ></number-input>
            </el-form-item>
            <el-form-item label="虚拟销量" v-if="!isBrand">
              <number-input
                v-model="form.virtualSaleCount"
                width="200px"
                :min="0"
                style="width:200px"
              ></number-input>
            </el-form-item>
            <el-form-item label="上架时间" v-if="!isBrand">
              <el-radio-group v-model="form.shelveType">
                <el-radio :label="true">
                  <span>立即上架</span>
                </el-radio>
                <el-radio :label="false">
                  <span>指定时间</span>
                  <el-date-picker
                    :picker-options="pickerOptions"
                    v-if="!form.shelveType"
                    v-model="form.shelveShopsTime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="margin-left:10px;"
                    :append-to-body="false"
                  ></el-date-picker>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 网店展示 -->
            <el-form-item label="网店展示" v-if="!isBrand">
              <el-radio-group v-model="form.showInShop">
                <el-radio :label="true">展示</el-radio>
                <el-radio :label="false">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否特价" v-if="!isBrand">
              <el-checkbox v-model="form.specialPrice">是</el-checkbox>
            </el-form-item>
            <el-form-item label="首页推荐" v-if="!isBrand">
              <el-checkbox v-model="form.recommendInFirstPage">推荐</el-checkbox>
            </el-form-item>
            <el-form-item class="buttons-item">
              <el-button
                class="normal_blue_btn"
                :loading="publishButtonLoading"
                :disabled="publishButtonLoading || saveButtonLoading"
                @click="
                isBrand
                  ? publish('addOrModifyProductTemplate')
                  : publish('addOrModifyProduct')
              "
              >{{ currentStatus === "add" || fromBrand ? "发布" : "保存修改" }}</el-button>
              <el-button
                :loading="saveButtonLoading"
                :disabled="publishButtonLoading || saveButtonLoading"
                class="normal_blue_btn"
                @click="saveProductInfoAsDraft('saveProductInfoAsDraft')"
                v-if="currentStatus === 'add' && !isBrand"
              >存为草稿</el-button>
              <el-button
                class="normal_light_gray_btn"
                @click="$router.go(-1)"
                :disabled="publishButtonLoading || saveButtonLoading"
              >取消</el-button>
            </el-form-item>
          </el-form>

          <el-dialog
            :visible.sync="bigImageVisible"
            :before-close="dialogBeforeClose"
            width="790px"
          >
            <img style="display:block;max-width: 750px" :src="bigImageUrl" />
          </el-dialog>
          <!-- 产品分类 -->
          <el-dialog
            :visible="showReminder"
            width="1000px"
            class="reminder-dialog"
            @close="showReminder = false"
          >
            <h6 class="title" slot="title">
              请前往“个人中心-我的品牌”，选择相应的品牌点击“管理”进入
              <span>总部管理台</span>
            </h6>
            <img src="@/assets/img/img_novice_pro.png" />
          </el-dialog>
          <!-- 会员等级设置 -->
          <el-dialog
            :visible="showMemberLevelSet"
            width="1000px"
            class="reminder-dialog"
            @close="showMemberLevelSet = false"
          >
            <h6 class="title" slot="title">
              请前往“个人中心-我的品牌”，选择相应的品牌点击“管理”进入
              <span>总部管理台</span>
            </h6>
            <img src="@/assets/img/img_novice_member.png" />
          </el-dialog>
        </div>
      </div>
      <!-- 服务保障和购买须知设置 -->
      <el-dialog
        title="设置模板"
        :visible.sync="setTemDialogVisible"
        width="850px"
        class="settem-dialog"
        @open="openMenu"
        @close="setTemClose"
      >
        <el-row v-loading="setTemLoad">
          <el-col :span="5">
            <div class="tem-left">
              <el-menu
                :default-active="''"
                class="el-menu-vertical-demo"
                @select="changeMenu"
                ref="setTemRef"
                unique-opened
              >
                <el-submenu :index="'1-0'">
                  <template slot="title">
                    <span class="icon-father">
                      服务保障
                      <i
                        class="icon iconfont icon-icon_open_on add-tem"
                        @click.stop="addTem(1)"
                      ></i>
                    </span>
                  </template>
                  <el-menu-item
                    :index="'1-' + item.id"
                    v-for="item in serviceGuaranteeList"
                    :key="item.id"
                  >{{ item.title }}</el-menu-item>
                </el-submenu>
                <el-submenu :index="'2-0'">
                  <template slot="title">
                    <span class="icon-father">
                      购买须知
                      <i
                        class="icon iconfont icon-icon_open_on add-tem"
                        @click.stop="addTem(2)"
                      ></i>
                    </span>
                  </template>
                  <div v-if="buyNoteList.length >= 1">
                    <el-menu-item
                      :index="'2-' + item.id"
                      v-for="item in buyNoteList"
                      :key="item.id"
                    >{{ item.title }}</el-menu-item>
                  </div>
                </el-submenu>
              </el-menu>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="tem-right">
              <div class="tem-right-title">
              <el-tag type="success" v-if="!isEditTem">添加模板</el-tag>
              <el-tag type="warning" v-else>修改模板</el-tag>
            </div>
              <el-form
                ref="setTemForm"
                :model="setTemForm"
                :rules="setTemFormRules"
                label-width="80px"
                style="margin-top: 50px;"
              >
                <el-form-item label="归属分组" required>
                  <el-select
                    class="sense-select"
                    :popper-append-to-body="false"
                    v-model="setTemForm.groupId"
                    placeholder="请选择"
                    :disabled="chooseGroupFlag"
                  >
                    <el-option :label="'服务保障'" :value="1"></el-option>
                    <el-option :label="'购买须知'" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                  <el-input v-model="setTemForm.title" placeholder="最多8个中文字符" style="width: 240px"></el-input>
                </el-form-item>
                <el-form-item label="内容信息" prop="content">
                  <el-input
                    :resize="'none'"
                    v-model="setTemForm.content"
                    type="textarea"
                    placeholder="最多500个中文字符"
                    style="width: 440px"
                    maxlength="500"
                    show-word-limit
                    :rows="8"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    @click="saveTem"
                    :loading="setTemLoad"
                    class="normal_red_btn"
                  >{{ isEditTem ? '修 改' : '添 加'}}</el-button>
                  <el-button
                    @click="delTemDisableVisible = true"
                    class="normal_gray_btn"
                    v-if="isEditTem"
                  >删 除</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 删除保障对话框 -->
      <g-dialog-with-slot
        :color="'#FF6D61'"
        :icon="'icon_popup_question'"
        :title="'确定要删除该规则吗？'"
        :dialogVisible="delTemDisableVisible"
        @resolve="deletedTem"
        @close="delTemDisableVisible=false"
        :btnLoad="setTemLoad"
      >
        <div>删除后，该规则将不能使用至该商品。</div>
      </g-dialog-with-slot>
    </div>
  </full-single-page>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import converter from "number-to-chinese-words";

export default {
  data() {
    let simpleTitleValidator = (rule, value, callback) => {
      if (value.length >= 2 && value.length <= 20) {
        callback();
      } else {
        callback("请输入2到20个字符");
      }
    };
    let cycleImageValidator = (rule, value, callback) => {
      let arr = this.form.cycleImage;
      // if (arr.length === 0) {
      //   callback("请上传至少一张图片");
      // } else {
        callback();
      // }
    };
    let richTextImagesValidator = (rule, value, callback) => {
      let arr = this.form.richTextImages;
      if (arr.length === 0) {
        callback("请上传至少一张图片");
      } else {
        callback();
      }
    };

    function getLength(value) {
      let str = value ? value + "" : "";
      let l = str.indexOf(".") === -1 ? 0 : str.split(".").pop().length;
      return l;
    }
    // 成本
    let costValidator = (rule, value, callback) => {
      let l = getLength(value.cardConstantPrice);
      let value_ = Number(value.cardConstantPrice);
      if (typeof value_ === "number" && value_ < 0) {
        callback("金额不可以小于0");
      } else if (l > 2) {
        callback("最多输入两位小数");
      } else {
        if (rule.required && value_ == 0) {
          callback("金额必填");
        } else {
          callback();
        }
      }
    };
    let specificationNameValid = (rule, value, callback) => {
      value = value || ''
      if (value.trim().length > 20) {
        return callback('规格名称不得超过20个中文')
      }
      if (this.form.productSpecificationInfos.length == 1) {
        callback()
      } else {
        if (!value.trim()) {
          return callback('规格名不能为空')
        } else {
          callback()
        }
      }
    };
    let priceValidator = (rule, value, callback) => {
      if (!this.value) {
        if (value <= 0) {
          callback("专柜价必填");
        }
        let str = value + "";
        let l = str.indexOf(".") === -1 ? 0 : str.split(".").pop().length;
        if (l > 2) {
          callback("最多输入两位小数");
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let stockValidator = (rule, value, callback) => {
      let l = getLength(value);
      let value_ = Number(value);
      if (typeof value_ === "number" && value_ <= 0) {
        callback("请输入大于0的数字");
      } else if (l > 0) {
        callback("不可以输入小数");
      } else {
        callback();
      }
    };
    let classificationValidator = (rule, value, callback) => {
      if (value.length !== 2) {
        callback("请选择分类");
      } else {
        callback();
      }
    };
    let validTitle = (rule, value, callback) => {
      if (value.indexOf(" ") !== -1) {
        return callback(new Error("不允许输入空格符"));
      } else if (value.trim().length > 8) {
        return callback(new Error("不允许超过8个中文字符"));
      } else if (value.trim().length < 1) {
        return callback(new Error("请输入标题内容"));
      } else {
        callback();
      }
    };
    let validBigTitle = (rule, value, callback) => {
      if (this.editTitle && this.editTitle === value) {
        callback();
      }
      if (!value) {
        return callback(new Error("请输入标题内容"));
      }
      if (!this.isDetection && !this.isBrand) {
        return callback("请先完成名称检测！");
      }
      if (!this.isRepetition && !this.isBrand) {
        return callback(" ");
      }
      if (value.indexOf(" ") !== -1) {
        return callback(new Error("不允许输入空格符"));
      } else if (value.trim().length > 30) {
        return callback(new Error("不允许超过30个中文字符"));
      } else {
        callback();
      }
    };
    let validContent = (rule, value, callback) => {
      if (value.length > 500) {
        callback(new Error("不允许超过500个中文字符"));
      } else if (value.trim().length < 1) {
        callback(new Error("请输入内容信息"));
      } else {
        callback();
      }
    };
    return {
      costValidator,
      specificationNameValid,
      priceValidator,
      stockValidator,
      converter: converter,
      classifications: [],
      discountInfoList: [],
      productBrandManageList: [],
      bigImageVisible: false,
      utils: utils,
      bigImageUrl: "",
      publishButtonLoading: false,
      saveButtonLoading: false,
      cascadeLoading: false,
      showReminder: false,
      showMemberLevelSet: false,
      form: {
        serial_no: null,
        classification: [],
        productBrandId: null,
        completeDeleted: false,
        cycleImage: [],
        deleted: false,
        detailType: 0,
        id: null,
        keyword: null,
        orderBy: null,
        productDetailModel: null,
        productLevelOne: null,
        productLevelTwo: null,
        productSpecificationInfos: [
          {
            id: null,
            memberPrice: null,
            productId: null,
            shopPrice: null,
            specificationName: null,
            stock: null,
            stockAlert: null,
            cardConstantPrice: null, // 持卡会员固定价格
            paramList: [
              // 规格参数，---相当于商品的静态熟悉
              {
                title: "",
                content: ""
              }
            ]
          }
        ],
        recommendInFirstPage: false,
        richText: null,
        richTextImages: [],
        shareCopyWriting: null,
        shelveShopsTime: null,
        showInShop: true,
        simpleTitle: "",
        shelveType: true,
        specialPrice: false,
        priceConstant: true, // 旧的单选 - 固定会员价与动态计算会员等级价格
        priceChangedWithLevel: false, // !!! 这个字段给 priceConstant 取反用, 用于勾选框 !!!
        enableCardDiscount: true, // 是否启用持卡会员折扣 // 默认勾选
        status: true,
        storeId: null,
        tags: [],
        title: null,
        virtualSaleCount: null,
        deleteTime: null,
        video: "", // 视频url
        serverTempList: [], // 服务保障
        purchaseNoteList: [] // 购买须知
      },
      serviceGuaranteeList: [],
      buyNoteList: [],
      setTemDialogVisible: false,
      checkSetTem: "",
      chooseGroupFlag: true,
      temType: 1,
      delTemDisableVisible: false, // 删除规则提示框标识
      setTemForm: {
        // 服务保障创建参数
        goodsType: 2, // 服务还是产品
        groupId: 1, // 服务保障还是购买需知
        title: "",
        content: ""
      },
      setTemFormRules: {
        title: [{ required: true, validator: validTitle, trigger: "blur" }],
        content: [{ required: true, validator: validContent, trigger: "blur" }]
      },
      addTemType: 1,
      setTemLoad: false,
      isEditTem: true,
      formRules: {
        title: [
          { required: true, validator: validBigTitle, trigger: "blur" },
          { required: true, validator: validBigTitle, trigger: "change" }
        ],
        simpleTitle: { required: true, validator: simpleTitleValidator },
        productLevelOne: {
          required: true,
          message: "请选择一级产品分类",
          trigger: "change"
        },
        productLevelTwo: {
          required: true,
          message: "请选择二级产品分类",
          trigger: "change"
        },
        productBrandId: {
          required: true,
          message: "请选择产品品牌",
          trigger: "change"
        },
        cycleImage: {
          required: false,
          validator: cycleImageValidator,
          trigger: "change"
        },
        richTextImages: {
          required: true,
          validator: richTextImagesValidator,
          trigger: "change"
        },
        classification: {
          required: true,
          validator: classificationValidator
        }
      },
      specificationRules: {
        specificationName: [
          { required: true, message: "请填写规格", trigger: "blur" },
          { required: true, message: "请填写规格", trigger: "change" }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        }
        // selectableRange: `${new Date().getHours()}:${new Date().getMinutes() + 1}:00 - 23:59:59`
      },
      updateFileSizeLimit1: 3, // 轮播
      updateFileSizeLimit2: 5, // 详情
      btnLoad: false,
      isRepetition: false,
      isDetection: false,
      editTitle: ''
    };
  },
  computed: {
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    currentStatus() {
      return this.$route.fullPath
        .split("/")
        .pop()
        .split("-")
        .pop();
    },
    productEditId() {
      return this.$store.state.queryParams.productEditId;
    },
    productTemplateId() {
      return this.$store.state.queryParams.productTemplateId;
    },
    // 判断是品牌还是门店的标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
    fromBrand() {
      return this.$route.query.fromBrand;
    }
  },
  created() {
    this.getGoodBuyAndServiceGuarantee(); // 获取服务保障和购买须知列表
  },
  mounted() {
    this.getAllProductBrandManage();
    this.getBrandMemberLevelDiscount();
    if (this.currentStatus === "edit" || this.fromBrand) {
      this.productDetailsInfo();
    }
  },
  watch: {
    "form.cycleImage"(fileList) {
      let len = fileList.length;
      document.getElementsByClassName(
        "el-upload el-upload--picture-card"
      )[0].style.display = len >= 5 ? "none" : "inline-block";
    },
    "setTemForm.groupId"(val) {
      this.addTemType = val;
      this.$refs.setTemRef.open(`${val}-0`);
      val == 1
        ? this.$refs.setTemRef.close("2-0")
        : this.$refs.setTemRef.close("1-0");
    },
    // 修改名称后，需要重新检测重名
    "form.title"(val, old) {
      if (val != old) {
        this.isDetection = false;
        this.isRepetition = false;
      }
    }
  },
  methods: {
    // 检测重名
    async detection() {
      if (!this.form.title) return this.$message.error("请先输入卡项名称！");
      this.btnLoad = true;
      try {
        const res = await axios.post("/checkNameForGoods", {
          goodsType: 1,
          storeId: this.currentInfo.shopId,
          title: this.form.title
        });
        this.isRepetition = res.success;
        this.isDetection = true;
        this.btnLoad = false;
      } finally {
        this.btnLoad = false;
        // 优化校验。。在此校验单条form信息
        this.$refs.form.validateField("title");
      }
    },
    // 获取服务保障和购买须知列表
    async getGoodBuyAndServiceGuarantee() {
      this.setTemLoad = true;
      const res = await axios.post("/getGoodBuyTemplateList", {
        brandId: this.currentInfo.brandId,
        goodsType: 2,
        storeId: this.isBrand ? null : this.currentInfo.shopId
      });
      this.serviceGuaranteeList = res.serverTempList ? res.serverTempList : [];
      this.buyNoteList = res.buyNoteList ? res.buyNoteList : [];
      this.checkSetTem =
        this.serviceGuaranteeList.length >= 1
          ? this.serviceGuaranteeList[0].id
          : 0;
      this.setTemLoad = false;
    },
    // 打开设置模板
    setTempalte(type) {
      this.temType = type;
      this.setTemDialogVisible = true;
    },
    // 获取单个保障、需知信息
    async getSingleTemInfo(id) {
      const res = await axios.post("/getGoodBuyTemplateById", { id });
      this.setTemForm = res.templateInfo;
      this.isEditTem = true;
    },
    // 设置模板对话框导航栏改变事件
    changeMenu(index, path) {
      this.addTemType = Number(index[0]);
      this.chooseGroupFlag = true;
      this.$refs.setTemForm.clearValidate();
      let id = index.split("-")[1];
      this.getSingleTemInfo(id);
    },
    openMenu() {
      this.$nextTick(() => {
        this.addTem(this.temType);
      });
    },
    // 添加
    addTem(type) {
      // 合上导航栏，并取消选中
      this.$refs.setTemRef.activeIndex = "";
      if (type == 1) {
        this.$refs.setTemRef.close("2-0");
        this.$refs.setTemRef.open("1-0");
      } else {
        this.$refs.setTemRef.close("1-0");
        this.$refs.setTemRef.open("2-0");
      }
      this.isEditTem = false;
      this.addTemType = type;
      this.setTemForm.groupId = type;
      // 清空右边已存在的信息
      this.setTemForm.title = "";
      this.setTemForm.content = "";
      this.chooseGroupFlag = false;
    },
    saveTem() {
      this.$refs.setTemForm.validate(async valid => {
        if (!valid) return;
        let setTemForm = !this.chooseGroupFlag
          ? {
              goodsType: 2,
              groupId: this.addTemType,
              title: this.setTemForm.title,
              content: this.setTemForm.content
            }
          : this.setTemForm;
        let text = this.chooseGroupFlag ? "修改" : "添加";
        const res = await axios.post("/createOrUpdateGoodBuyTemplate", {
          ...setTemForm,
          brandId: this.currentInfo.brandId,
          storeId: this.isBrand ? null : this.currentInfo.shopId,
          deleted: false
        });
        if (!res.success) return this.$message.error(`${text}失败`);
        this.$message.success(`${text}成功`);
        // 重新获取数据
        await this.getGoodBuyAndServiceGuarantee();
        // 如果是修改  则不跳转
        console.log(this.chooseGroupFlag);
        if (!this.chooseGroupFlag) {
          // 打开目标导航
          this.openTargetMenu("last");
        }
        this.chooseGroupFlag = true;
      });
    },
    // 打开目标导航栏
    openTargetMenu(flag) {
      console.log(1);
      let arr =
        this.addTemType == 1 ? this.serviceGuaranteeList : this.buyNoteList;
      let index = flag === "last" ? arr.length - 1 : 0;
      let id = arr[index].id;
      if (this.addTemType == 1) {
        this.$refs.setTemRef.open("1-0");
        this.$refs.setTemRef.activeIndex = `1-${id}`;
        this.getSingleTemInfo(id);
      } else {
        this.$refs.setTemRef.open("2-0");
        this.$refs.setTemRef.activeIndex = `2-${id}`;
        this.getSingleTemInfo(id);
      }
    },
    async deletedTem() {
      console.log(this.addTemType);
      let setTemForm = JSON.parse(JSON.stringify(this.setTemForm));
      setTemForm.deleted = true;
      const res = await axios.post(
        "/createOrUpdateGoodBuyTemplate",
        setTemForm
      );
      if (!res.success) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.delTemDisableVisible = false;
      await this.getGoodBuyAndServiceGuarantee();
      this.openTargetMenu("first");
    },
    // 设置保障对话框关闭
    setTemClose() {
      this.$refs.setTemRef.activeIndex = "1" + this.checkSetTem;
      this.setTemDialogVisible = false;
      this.$refs.setTemForm.clearValidate();
    },
    // 规格参数的新增和删除事件
    addParamter(single, index) {
      this.form.productSpecificationInfos[index].paramList.push({
        title: "",
        content: ""
      });
    },
    delParamter(index, idx) {
      // 根据索引删除数组元素
      let arr = this.form.productSpecificationInfos[index].paramList;
      arr.splice(idx, 1);
    },
    getBrandMemberLevelDiscount() {
      axios
        .post("/getBrandMemberLevelDiscount", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          this.discountInfoList = res.discountInfoList;
        });
    },
    getAllProductBrandManage() {
      axios
        .get("/getAllProductBrandManage/" + this.currentInfo.brandId)
        .then(res => {
          this.productBrandManageList = res.productBrandManageList || [];
        });
    },
    dialogBeforeClose() {
      this.bigImageVisible = false;
    },
    productDetailsInfo() {
      let id =
        this.isBrand || this.fromBrand
          ? this.productTemplateId
          : this.productEditId;
      let url =
        this.isBrand || this.fromBrand
          ? "/getProductTemplateById/"
          : api.productDetailsInfo.URL;
      axios.post(url + id).then(res => {
        for (let i in res) {
          if (i === "cycleImage") {
            this.form.cycleImage = res.cycleImage.map(element => {
              return {
                name: `${Math.random()}`,
                url: utils.formatPicImg(element)
              };
            });
          } else {
            this.form[i] = res[i];
          }
        }
        this.form.classification = [
          res.productLeveleOneInfo.jimeiClassId,
          res.productLeveleTwoInfo.jimeiClassId
        ];
        this.form.priceChangedWithLevel = !res.priceConstant; // 取反 !!!
        this.form.richTextImages = res.richText.split(",").map(item => {
          return {
            name: `${Math.random()}`,
            url: utils.formatPicImg(item)
          };
        });
        // 服务保障和产品须知的获取
        this.form.serverTempList = res.serverTempList || [];
        this.form.purchaseNoteList = res.purchaseNoteList || [];
        this.form.productSpecificationInfos.forEach(item => {
          item.paramList = item.paramList || [
            {
              title: "",
              content: ""
            }
          ];
        });
        this.getProductClass();
        // 重名检测在编辑的时候记录下原名称，改动检测，不改动放行！
        this.editTitle = this.form.title;
      });
    },
    getProductClass() {
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
            this.classifications = arr.map(item => {
              let subClass = item.subClass.map(i => {
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
    lunboExceed(files, fileList) {
      if (files.length + fileList.length > 5) {
        this.$message.error("最多上传5张");
      }
    },
    handleLunBoSuccess(res, file, fileList) {
      this.form.cycleImage = fileList;
      this.$refs.form.validateField("cycleImage");
    },
    beforeLunBoUpload(file) {
      return this.beforeUpload(file, this.updateFileSizeLimit1);
    },
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
    exmineDetailImage(file) {
      return this.beforeUpload(file, this.updateFileSizeLimit2);
    },
    handlePictureCardPreview(data) {
      this.bigImageUrl = data.url;
      this.bigImageVisible = true;
    },
    handleLunBoRemove(file, fileList) {
      this.form.cycleImage = fileList;
      this.$refs.form.validateField("cycleImage");
    },
    publish(url) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveOrSubmit(url);
        } else {
          console.warn("error submit");
        }
      });
    },
    saveOrSubmit(url) {
      let submitForm = JSON.parse(JSON.stringify(this.form));
      submitForm.cycleImage = submitForm.cycleImage.map(item =>
        item.response ? item.response.fileKey : item.url.split("/").pop()
      );
      submitForm.productSpecificationInfos = submitForm.productSpecificationInfos.map(
        item => {
          return {
            ...item,
            memberPrice: Number(item.memberPrice),
            shopPrice: Number(item.shopPrice),
            cardConstantPrice: Number(item.cardConstantPrice)
          };
        }
      );
      submitForm.shelveShopsTime = submitForm.shelveShopsTime
        ? submitForm.shelveShopsTime
        : utils.formatDateTime(new Date());
      submitForm.richText = this.form.richTextImages
        .map(item =>
          item.response ? item.response.fileKey : item.url.split("/").pop()
        )
        .join(",");
      delete submitForm.richTextImages;
      let classification = this.form.classification;
      let productLeveleOneInfo, productLeveleTwoInfo;
      for (let i in this.classifications) {
        if (this.classifications[i].id === classification[0]) {
          let temProductLeveleOneInfo = JSON.parse(
            JSON.stringify(this.classifications[i])
          );
          productLeveleOneInfo = {
            brandId: this.currentInfo.brandId,
            image: temProductLeveleOneInfo.icon,
            jimeiClassId: temProductLeveleOneInfo.id,
            jimeiParentId: temProductLeveleOneInfo.parentId,
            sortName: temProductLeveleOneInfo.name,
            updateTime: temProductLeveleOneInfo.updateTime
          };
          let sortTwo = this.classifications[i].subClass;
          for (let j in sortTwo) {
            if (sortTwo[j].id === classification[1]) {
              productLeveleTwoInfo = {
                brandId: this.currentInfo.brandId,
                image: sortTwo[j].icon,
                jimeiClassId: sortTwo[j].id,
                jimeiParentId: sortTwo[j].parentId,
                sortName: sortTwo[j].name,
                updateTime: sortTwo[j].updateTime
              };
              break;
            }
          }
          break;
        }
      }
      submitForm = {
        ...submitForm,
        productLeveleOneInfo,
        productLeveleTwoInfo,
        priceConstant: !submitForm.priceChangedWithLevel, // 置反!!!
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId
      };
      // 模板逻辑暂没有存为草稿的操作
      if (url === "saveProductInfoAsDraft") {
        this.saveButtonLoading = true;
      } else {
        this.publishButtonLoading = true;
      }
      if (url === "addOrModifyProductTemplate") {
        delete submitForm.storeId;
      }
      // 如果是来自模板的新建信息 清空参数中的id
      if (this.fromBrand) {
        delete submitForm.id;
        submitForm.productSpecificationInfos.forEach(item => {
          delete item.id;
          delete item.productId;
        });
      }
      axios
        .post(this.isBrand ? `/${url}` : api[url].URL, submitForm)
        .then(res => {
          this.publishButtonLoading = false;
          this.saveButtonLoading = false;
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.success
              ? `${
                  url !== "saveProductInfoAsDraft"
                    ? this.currentStatus === "add" || this.fromBrand
                      ? this.isBrand
                        ? "新增产品模板成功"
                        : "新增产品成功,请前往设置中心对该产品进行提成设置！"
                      : this.isBrand
                      ? "编辑产品模板成功"
                      : "编辑产品成功"
                    : "存为草稿成功"
                }`
              : res.message,
            duration:
              url !== "saveProductInfoAsDraft" &&
              this.currentStatus === "add" &&
              !this.isBrand
                ? 5000
                : 3000
          });
          if (res.success) {
            this.$router.push(
              this.isBrand
                ? "/brand-inner/goods/product-list"
                : "/shop-inner/goods/product-list"
            );
          }
        })
        .catch(err => {
          this.publishButtonLoading = false;
          this.saveButtonLoading = false;
        });
    },
    saveProductInfoAsDraft(url) {
      this.saveOrSubmit(url);
    },
    addSpecification() {
      this.form.productSpecificationInfos.push({
        id: null,
        memberPrice: null,
        productId: null,
        shopPrice: null,
        specificationName: null,
        cardConstantPrice: null, // 持卡会员固定价格
        stock: null,
        stockAlert: null,
        paramList: [
          // 规格参数，---相当于商品的静态熟悉
          {
            title: "",
            content: ""
          }
        ]
      });
    },
    delSpecialForm(specialItem, index) {
      let list = JSON.parse(
        JSON.stringify(this.form.productSpecificationInfos)
      );
      if (specialItem.id) {
        list[index].deleted = true;
      } else {
        list.splice(index, 1);
      }
      this.form.productSpecificationInfos = list;
    },
    handleRichTextImagesSuccess(res, file, fileList) {
      this.form.richTextImages = fileList;
      this.$refs.form.validateField("richTextImages");
    },
    handleRichTextImagesRemove(file, fileList) {
      this.form.richTextImages = fileList;
      this.$refs.form.validateField("richTextImages");
    },
    memberLevelPrices(price) {
      if (!price) {
        return undefined;
      }
      let priceArray = [];
      let classification = this.form.classification;
      let selClassification = this.form.classification.length === 2;
      this.discountInfoList.forEach(item => {
        let discountList = item.lvlAppointProductDiscList;
        let matchDiscount = selClassification
          ? discountList.filter(discount => {
              return (
                discount.levelOne === classification[0] &&
                discount.levelTwo === classification[1]
              );
            })[0]
          : undefined;
        priceArray.push({
          levelName: item.levelName,
          memberLevelPrice: matchDiscount
            ? (price * matchDiscount.discount) / 10
            : (price * item.lvlAllProductDisc) / 10
        });
      });
      return priceArray;
    },
    // - 校验固定会员价时的会员价输入
    priceValidatorNew(rule, obj, callback) {
      if (!this.form.priceChangedWithLevel) {
        if (obj.memberPrice <= 0) {
          callback("成长会员价必填");
        }
        let str = obj.memberPrice + "";
        let l = str.indexOf(".") === -1 ? 0 : str.split(".").pop().length;
        if (l > 2) {
          callback("最多输入两位小数");
        } else {
          callback();
        }
      } else {
        callback();
      }
    },

    // 视频
    // handleVideoSuccess(res, file) {
    //   console.log('success', res, file)
    // },
    // beforeVideoUpload(file) {
    //   if (file.size / 1024 / 1024 > 10) {
    //     this.$message.error(`上传视频大小不能超过10M!`)
    //     return false
    //   }
    //   return true
    // },
    // handleVideoRemove(file) {
    //   console.log('remove', file)
    // },

    // 视频2
    onVideoUploaded(key) {
      this.form.video = key;
    },
    // 重名检测存在的条件 // 主要适应品牌创建商品模板和编辑商品时不一样的需求
    detectionCondition() {
      if (this.isBrand) {
        return false;
      } else {
        if (this.editTitle) {
          if (this.editTitle != this.form.title) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.pro-root {
  box-sizing: border-box;

  .form-wrap {
    padding: 0 20px;

    .form-content {
      max-width: 1440px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 55px 40px;
      border-radius: 4px;
      background: #ffffff;

      .el-form-item {
        /deep/ .el-form-item__content {
          .specialForm {
            width: 880px;
            background: #f1f2f7 100%;
            box-sizing: border-box;
            border-radius: 5px;
            padding: 20px 0;
            margin-bottom: 20px;
            position: relative;

            .el-form-item {
              width: 280px;

              /deep/ .el-form-item__error {
                white-space: nowrap;
              }
            }

            .specification-line {
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
              width: 600px;
              white-space: nowrap;
              .parameter-box {
                position: relative;
                border: 1px solid #dcdfe6;
                width: 640px;
                padding: 20px 0;
                /deep/ .el-input {
                  margin-bottom: 20px;
                }
                & + .parameter-box {
                  margin-top: 20px;
                }
                .parameter-icon {
                  position: absolute;
                  top: 85%;
                  right: -50px;
                  :nth-child(1) {
                    color: #58c9f3;
                    transition: all 0.6s;
                    cursor: pointer;
                  }
                }
              }
              .member-price {
                /deep/ .el-form-item__content {
                  .el-radio-group {
                    margin-top: 13px;

                    .el-radio {
                      display: block;
                      margin-left: 0;

                      .el-form-item {
                        display: inline-block;
                      }

                      &:nth-child(1) {
                        margin-bottom: 20px;
                      }

                      &:nth-child(2) {
                        color: #333333;

                        .reminder-text {
                          color: #58c9f3;
                          margin-left: 20px;
                        }
                      }
                    }
                  }
                }
              }
              /deep/ .el-input-group__append {
                border: none;
                padding: 0 13px;
                color: #333333;
              }
              .member-level-prices {
                line-height: 24px;
                margin-top: 15px;
                width: 600px;
                // white-space: pre-wrap;
                .member-level-name {
                  color: #999999;
                }
              }
            }

            .name {
              display: flex;
              width: 600px;
            }

            .icon-icon_operate_delete {
              &.price-delete {
                position: absolute;
                top: 10px;
                right: 15px;
                color: #999999;
                transition: all 0.6s;
                cursor: pointer;

                &:hover {
                  color: #666666;
                }
              }
            }
          }
        }

        .product-detail {
          transform: translateY(-35px);
          margin-bottom: 10px;
        }

        .addspec {
          font-size: 14px;
          color: #58c9f3;
          transition: all 0.6s;
          margin-top: -10px;
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
      }
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
          color: #f52d56;
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
}
.gray-text {
  color: #666;
  font-size: 12px;
}
.like-link {
  cursor: pointer;
  color: rgb(88, 201, 243);
}

.set-icon {
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
  color: #58c9f3;
  font-size: 14px;
}

.settem-dialog {
  /deep/ .el-dialog {
    border-radius: 10px;
    /deep/ .el-dialog__header {
      border-bottom: 1px solid #ccc;
    }
    /deep/ .el-dialog__body {
      padding: 0;
      .el-row {
        .el-col {
          // min-height: 500px;
          height: 100%;
          .tem-left {
            height: 100%;
            border-right: 1px solid #ccc;
            min-height: 500px;
            .el-menu {
              border: 0;
              .el-submenu__title {
                // position: relative;
                .icon-father {
                  .add-tem {
                    margin-left: 5px;
                    cursor: pointer;
                    color: #58c9f3;
                    z-index: 999;
                  }
                }
              }
              .el-menu--inline {
                .el-menu-item {
                  min-width: 0;
                  &:focus {
                    background-color: transparent;
                  }
                }
              }
            }
          }
          .tem-right {
            display: flex;
            justify-content: center;
            .tem-right-title {
              font-size: 16px;
              margin-top: 20px;
              /deep/ .el-tag {
                transform: scale(1.2);
              }
            }
          }
        }
      }
    }
  }
}

.detection-success {
  color: #67c23a !important;
  font-size: 16px;
  i {
    color: #67c23a !important;
  }
}

.detection-error {
  color: #f56c6c !important;
  font-size: 16px;
  i {
    color: #f56c6c !important;
  }
}
</style>