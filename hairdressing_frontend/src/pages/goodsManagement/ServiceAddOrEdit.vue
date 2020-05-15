<template>
  <full-single-page
    type="service-set"
    :title="$route.path.indexOf('add') !== -1 ? isBrand ? '新增服务模板' : '新增服务' : isBrand ? '编辑服务模板' : '编辑服务'"
  >
    <div class="service-content" v-loading="loading">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="120px"
        style="padding-left: 80px;"
      >
        <!-- 服务标题 -->
        <div style="display: flex;">
          <el-form-item label="服务标题" prop="title">
            <el-input
              placeholder="请输入服务项目的标题，不超过30个中文字符"
              v-model.trim="form.title"
              maxlength="30"
              style="width:400px"
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

        <!-- 服务短标题 -->
        <el-form-item label="服务短标题" prop="simpleTitle" required>
          <el-input
            placeholder="2-20个字符"
            maxlength="20"
            style="width:200px"
            v-model.trim="form.simpleTitle"
          ></el-input>
        </el-form-item>
        <!-- 商品编号（系统） -->
        <el-form-item label="商品编号" v-if="form.serialNo">
          <el-input style="width:200px" v-model="form.serialNo" disabled></el-input>
        </el-form-item>
        <!-- 店内编码 -->
        <el-form-item label="店内编码" v-if="!isBrand">
          <el-input maxlength="16" placeholder="请输入店内编码" v-model="form.keyword" style="width:200px"></el-input>
        </el-form-item>
        <!-- 服务分类 -->
        <el-form-item label="服务分类" prop="classification" required>
          <el-cascader
            v-model="form.classification"
            :options="classifications"
            :props="{ expandTrigger: 'hover' ,label:'sortName',value:'jimeiClassId',children:'sortTwo'}"
            style="width:200px"
            :disabled="!!fromBrand"
          ></el-cascader>
        </el-form-item>
        <!-- 3工位版 关联职务 -->
        <el-form-item
          label="关联职务"
          prop="something"
          :rules="{required: true, validator: validatorJobs, trigger: 'change'}"
          v-if="!isBrand"
        >
          <div class="associate-jobs-box">
            <!-- 工位1 -->
            <div class="jobs-item">
              <div class="title">工位1:</div>
              <div class="jobs-content">
                <el-radio-group v-model="form.associateAllJobs">
                  <el-radio :label="'UN_LIMITED'">不限职务</el-radio>
                  <el-radio :label="'APPOINTED'">指定职务</el-radio>
                </el-radio-group>
                <el-select
                  v-model="form.staffLevel"
                  multiple
                  style="width:240px"
                  placeholder="请选择职务"
                  :popper-append-to-body="false"
                  v-show="form.associateAllJobs==='APPOINTED'"
                >
                  <el-option
                    v-for="item in ranks"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <!-- 工位2 -->
            <div class="jobs-item" v-show="jobsNum > 1">
              <div class="title">工位2:</div>
              <div class="jobs-content">
                <el-radio-group v-model="form.associateAllJobsTwo">
                  <el-radio :label="'UN_LIMITED'">不限职务</el-radio>
                  <el-radio :label="'APPOINTED'">指定职务</el-radio>
                </el-radio-group>
                <el-select
                  v-model="form.staffLevelTwo"
                  multiple
                  style="width:240px"
                  placeholder="请选择职务"
                  :popper-append-to-body="false"
                  v-show="form.associateAllJobsTwo==='APPOINTED'"
                >
                  <el-option
                    v-for="item in ranks"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <i
                  v-if="jobsNum === 2"
                  style="margin-left:2px;cursor:pointer;"
                  @click="delItem(1)"
                  class="icon iconfont icon-icon_operate_delete"
                ></i>
              </div>
            </div>
            <!-- 工位3 -->
            <div class="jobs-item" v-show="jobsNum === 3">
              <div class="title">工位3:</div>
              <div class="jobs-content">
                <el-radio-group v-model="form.associateAllJobsThree">
                  <el-radio :label="'UN_LIMITED'">不限职务</el-radio>
                  <el-radio :label="'APPOINTED'">指定职务</el-radio>
                </el-radio-group>
                <el-select
                  v-model="form.staffLevelThree"
                  multiple
                  style="width:240px"
                  placeholder="请选择职务"
                  :popper-append-to-body="false"
                  v-show="form.associateAllJobsThree==='APPOINTED'"
                >
                  <el-option
                    v-for="item in ranks"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <i
                  v-if="jobsNum===3"
                  style="margin-left:2px;cursor:pointer;"
                  @click="delItem(2)"
                  class="icon iconfont icon-icon_operate_delete"
                ></i>
              </div>
            </div>
          </div>
          <div class="add-button" @click="addJobs" v-if="jobsNum < 3">
            <i style="margin-right:2px;" class="icon iconfont icon-icon_ope_append"></i>
            <span>添加工位</span>
          </div>
        </el-form-item>
        <!-- 轮播图 -->
        <el-radio-group v-model="form.carouselImagesOrigin">
          <el-form-item label="轮播图" prop="carouselImagesOrigin" class="radio-form-item">
            <el-radio label="STORAGE" class="select-form-material-library">
              <div class="radio-title">
                <span>从素材库选择</span>
                <input-search
                  v-model="keyWordCarousel"
                  @search="$refs.chooseCarousel.getMediaByGroupKey(keyWordCarousel)"
                  placeholder="搜索素材名称"
                ></input-search>
              </div>
              <choose-images
                ref="chooseCarousel"
                width="800px"
                url="getMediaByGroupKey"
                type="square"
                v-model="form.fileListFromStorage"
                :param="{groupKey:3,mediaType:'image'}"
                :pageSize="10"
                :limits="5"
                showLists
                showImageName
                background-size="cover"
                @change="$refs.form.validateField('fileList')"
              ></choose-images>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <div>
              <el-radio label="NORMAL" class="user-defined-radio">
                <span>自定义</span>
                <el-form-item prop="fileList">
                  <el-upload
                    :action="uploadUrl"
                    :headers="{Authorization: token}"
                    list-type="picture-card"
                    multiple
                    :on-exceed="carouselExceed"
                    :on-success="handleLunBoSuccess"
                    :before-upload="beforeLunBoUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleLunBoRemove"
                    :file-list="form.fileList"
                    :limit="5"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-radio>

              <el-dialog :visible.sync="dialogVisible" width="790px">
                <img style="display:block;max-width: 750px" :src="dialogImageUrl" alt />
              </el-dialog>
              <p
                class="picture-tip"
              >支持jpg，png，gif格式，建议像素800*800px以上，大小不超过{{updateFileSizeLimit1}}M；最多5张</p>
            </div>
          </el-form-item>
        </el-radio-group>
        <el-form-item label="主图视频" prop="video">
          <!-- limit 10M == delete -->
          <video-upload :url="form.video" @onChanged="onVideoUploaded" :limit="10" />
          <!-- 10M  30s ==> 20M 60s -->
          <p style="color:#999999;font-size:12px;height:25px">仅支持mp4格式，大小不超过10M，建议不超过30秒</p>
        </el-form-item>
        <!-- 服务价格 -->
        <el-form-item label="服务价格">
          <div
            class="specification-box"
            v-for="(single, index) in form.specificationAndPrices"
            :key="index"
            v-show="!single.deleted"
          >
            <!-- 规格名称 & 服务时长 -->
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item
                  label-width="100px"
                  :label=" form.specificationAndPrices.length > 1 ? `规格${converter.toWords(index + 1)}` : '规格'"
                  :prop="'specificationAndPrices.'+index+'.specificationName'"
                  :rules="{required: form.specificationAndPrices.length > 1, validator: handleValidateSPname, trigger: 'blur'}"
                >
                  <el-input
                    v-model.trim="single.specificationName"
                    :placeholder="form.specificationAndPrices.length === 1 ? '不填即默认' : '多规格必填'"
                    style="width:200px"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="服务时长"
                  label-width="100px"
                  :prop="'specificationAndPrices.'+index+'.serviceTime'"
                  :rules="{ required: false, validator:serviceTimeValidator }"
                >
                  <el-input
                    v-model.number="single.serviceTime"
                    placeholder="请输入服务时长"
                    style="width: 200px;"
                  >
                    <!-- @mousewheel.native.prevent -->
                    <el-button slot="append">分钟</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 门店价 & 成本 -->
            <el-row>
              <el-col :span="12">
                <!-- 门店价 -->
                <el-form-item
                  label="门店价"
                  label-width="100px"
                  :prop="'specificationAndPrices.'+index+'.shopPrice'"
                  :rules="{ required: true, validator: priceValidator, trigger: 'change' }"
                >
                  <el-input
                    type="number"
                    v-model="single.shopPrice"
                    placeholder="请输入门店价"
                    style="width: 200px;"
                    @mousewheel.native.prevent
                  >
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- 成本 -->
                <el-form-item
                  label="成本"
                  label-width="100px"
                  :prop="'specificationAndPrices.'+index+'.cost'"
                  :rules="{ required: false, validator: costValidator }"
                >
                  <el-input
                    type="number"
                    v-model="single.cost"
                    placeholder="请输入成本"
                    style="width: 200px;"
                    @mousewheel.native.prevent
                  >
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 成长会员价 -->
            <el-form-item
              label="成长会员价"
              label-width="100px"
              :prop="'specificationAndPrices.'+index+'.memberPrice'"
              :rules="{ required: !form.priceChangedWithLevel, validator: costValidator }"
            >
              <!-- :rules="{ required: true, validator: priceValidator }" -->

              <el-input
                type="number"
                v-model="single.memberPrice"
                placeholder="成长会员价"
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
              <div class="level-price" v-if="form.priceChangedWithLevel">
                <span v-for="(item,idx) in memberLevelPrices(single.shopPrice)" :key="idx">
                  <span class="name">{{item.levelName}}：</span>
                  <span class="price">{{item.memberLevelPrice.toFixed(2) || '0'}}元；</span>
                </span>
              </div>
            </el-form-item>
            <!-- 持卡会员价 -->
            <el-form-item
              label="持卡会员价"
              label-width="100px"
              :prop="'specificationAndPrices.'+index+'.cardConstantPrice'"
              :rules="{ required: !form.enableCardDiscount, validator: costValidator }"
            >
              <el-input
                type="number"
                v-model="single.cardConstantPrice"
                @mousewheel.native.prevent
                placeholder="持卡会员价"
                style="width: 200px;"
              >
                <el-button slot="append">元</el-button>
              </el-input>
              <div class="checkbox-line">
                <el-checkbox v-model="form.enableCardDiscount">启用会员卡折扣</el-checkbox>
                <span class="gray-text">（启用后，上述持卡会员价将失效，按卡内设置折扣计算）</span>
              </div>
            </el-form-item>
            <!-- 规格参数 -->
            <el-form-item label="规格参数" label-width="100px">
              <div class="parameter-box" v-for="(item,idx) in single.paramList" :key="idx">
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
                  <i class="icon iconfont icon-icon_ope_append" @click="addParamter(single,index)"></i>
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delParamter(index,idx)"
                    v-if="single.paramList.length > 1"
                  ></i>
                </div>
              </div>
            </el-form-item>
            <i
              class="icon iconfont icon-icon_operate_delete price-delete"
              v-if="index > 0"
              @click="delSpecialForm(single,index)"
            ></i>
          </div>
          <p class="add-specification" @click="addSpecification">
            <i class="icon iconfont icon-icon_ope_append"></i>添加规格
          </p>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item label="排序" prop="orderBy" v-if="!isBrand">
          <number-input
            v-model="form.orderBy"
            width="200px"
            placeholder="请输入排序"
            :min="0"
            :max="9999"
          ></number-input>
        </el-form-item>
        <!-- 虚拟销量 -->
        <el-form-item label="虚拟销量" v-if="!isBrand">
          <number-input
            v-model="form.virtualSaleCount"
            :decimal="false"
            width="200px"
            placeholder="仅限填写数字"
            :min="0"
          ></number-input>
        </el-form-item>
        <!-- 服务详情 -->
        <el-radio-group v-model="form.detailImagesOrigin">
          <el-form-item label="服务详情" class="radio-form-item" required>
            <el-radio label="STORAGE" class="select-form-material-library">
              <div class="radio-title">
                <span>从素材库选择</span>
                <input-search
                  v-model="keyWordDetailImage"
                  @search="$refs.chooseDetailImage.getMediaByGroupKey(keyWordDetailImage)"
                ></input-search>
              </div>
              <choose-images
                ref="chooseDetailImage"
                width="800px"
                url="getMediaByGroupKey"
                type="square"
                v-model="form.richTextImagesFromStorage"
                :param="{groupKey:4,mediaType:'image'}"
                :pageSize="10"
                showLists
                showImageName
                background-size="contain"
                @change="$refs.form.validateField('richTextImages')"
              ></choose-images>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio label="NORMAL" class="user-defined-radio">
              <span>自定义</span>
              <el-form-item prop="richTextImages">
                <el-upload
                  :action="uploadUrl"
                  :headers="{Authorization: token}"
                  list-type="picture-card"
                  multiple
                  :on-success="handleRichImagesSuccess"
                  :before-upload="examineImage"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRichImagesRemove"
                  :file-list="form.richTextImages"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <p class="picture-tip">支持jpg，png，gif格式，大小不超过{{updateFileSizeLimit2}}M</p>
              </el-form-item>
            </el-radio>
          </el-form-item>
        </el-radio-group>
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
        <!-- 上架时间 -->
        <el-form-item label="上架时间" v-if="!isBrand">
          <el-radio-group v-model="form.shelveType">
            <el-radio :label="true">立即上架</el-radio>
            <el-radio :label="false">指定时间</el-radio>
          </el-radio-group>
          <el-date-picker
            v-if="!form.shelveType"
            v-model="form.shelveShopsTime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            style="margin-left:10px;"
            :append-to-body="false"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <!-- 网店展示 -->
        <el-form-item label="网店展示" v-if="!isBrand">
          <el-radio-group v-model="form.showInShop">
            <el-radio :label="true">展示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 是否特价 -->
        <el-form-item label="是否特价" v-if="!isBrand">
          <el-checkbox v-model="form.specialPrice">是</el-checkbox>
        </el-form-item>
        <!-- 首页推荐 -->
        <el-form-item label="首页推荐" v-if="!isBrand">
          <el-checkbox v-model="form.recommendInFirstPage">推荐</el-checkbox>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item label>
          <el-button
            type="primary"
            class="normal_blue_btn"
            :disabled="submitButtonLoading"
            :loading="submitButtonLoading"
            @click="submitForm"
          >{{$route.path.indexOf('add') !== -1 ? '发布' : '保存'}}</el-button>
          <el-button
            class="normal_light_gray_btn"
            :disabled="submitButtonLoading"
            v-show="$route.path==='/shop-inner/service-add' || $route.path==='/brand-inner/service-add'"
            @click="$router.go(-1)"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
                    <i class="icon iconfont icon-icon_open_on add-tem" @click.stop="addTem(1)"></i>
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
                    <i class="icon iconfont icon-icon_open_on add-tem" @click.stop="addTem(2)"></i>
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
  </full-single-page>
</template>
<script>
import { mapState } from "vuex";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import ChooseImages from "@/components/common/ChooseImages";
import converter from "number-to-chinese-words";
export default {
  data() {
    let validateFileList = (rule, value, callback, flag) => {
      if (flag) {
        if (Array.isArray(value) && value.length === 0) {
          callback(new Error("至少需要上传一张图片"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateFileListFileList = (rule, value, callback) => {
      let cycleImage = this.form[
        this.form.carouselImagesOrigin === "NORMAL"
          ? "fileList"
          : "fileListFromStorage"
      ];
      validateFileList(rule, cycleImage, callback);
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
    let validateFileListDetailImages = (rule, value, callback) => {
      let detailImages = this.form[
        this.form.detailImagesOrigin === "NORMAL"
          ? "richTextImages"
          : "richTextImagesFromStorage"
      ];
      validateFileList(rule, detailImages, callback, true);
    };
    let validTitle = (rule, value, callback) => {
      if (value.indexOf(" ") !== -1) {
        callback(new Error("不允许输入空格符"));
      } else if (value.trim().length > 8) {
        callback(new Error("不允许超过8个中文字符"));
      } else if (value.trim().length < 1) {
        callback(new Error("请输入标题内容"));
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
      discountInfoList: [],
      showMemberLevelSet: false, // 引导会员级别建立的图片
      loading: false,
      submitButtonLoading: false, //
      keyWordCarousel: null, // 轮播图搜索关键词
      converter: converter,
      token: "",
      form: {
        richTextImagesFromStorage: [], // ?
        title: "", // - 服务标题
        serialNo: "", // - 商品编号（系统）
        simpleTitle: "", // - 服务短标题
        keyword: "", // - 店内编码
        classification: [], // - 选择的服务分类， 编辑由serviceLevelOne, serviceLevelTwo 拼成, 提交时要拆成这2个字段
        serviceLeveleOneInfo: {}, // 选中的一级分类的的详细数据
        serviceLeveleTwoInfo: {}, // 选中的二级分类的的详细数据
        carouselImagesOrigin: "STORAGE", // 轮播图默认素材库 [ NORMAL, STORAGE ] // 提交 carouselImagesOrigin, 编辑获取 cycleImageOrigin
        detailImagesOrigin: "STORAGE", // 服务详情来源 [ NORMAL, STORAGE ] // 提交是这个字段 detailImagesOrigin， 编辑获取是 serviceDetailOrigin
        cycleImage: [], // 轮播图模板
        specificationAndPrices: [
          // 服务价格(n个规格)
          {
            id: null, // 规格id
            cost: "", // 成本
            deleted: false, // 是否删除 (编辑时的原有规格删除标记)
            specificationName: "", // 规格名称
            serviceTime: null, // 服务时长
            shopPrice: null, // 门店价
            memberPrice: null, // 成长会员价（固定）
            cardConstantPrice: null, // 持卡会员价
            bookingAmount: null, // 预约金 - 暂无
            // priceConstant: true, // 是否固定成长会员价 可以直接取外面的（联动的）
            // enableCardDiscount: true, // 是否持卡会员价 可以直接取外面的（联动的）
            paramList: [
              // 规格参数，---相当于商品的静态熟悉
              {
                title: "",
                content: ""
              }
            ]
          }
        ],
        richText: "", // 富文本内容， 大概就是一些图片的key字符串拼接
        fileListFromStorage: [],
        orderBy: null, // 排序
        virtualSaleCount: null, // 虚拟销量
        shelveType: true, // 上架时间类型 true:立即上架 false:指定时间上架
        shelveShopsTime: "", // 上架时间
        showInShop: true, // 网店展示
        richTextImages: [], // -
        needPrePay: false, // 预约支付
        specialPrice: false, // 是否特价
        recommendInFirstPage: false, // 是否首页推荐
        // -3个工位- 需求变更版: start
        associateAllJobs: "UN_LIMITED", // 工位1 APPOINTED - 指定; UN_LIMITED - 不限;  UN_ADD - 未添加, 这里没有，2,3工位才有.
        staffLevel: [],
        associateAllJobsTwo: "UN_ADD", // 工位2
        staffLevelTwo: [],
        associateAllJobsThree: "UN_ADD", // 工位3
        staffLevelThree: [],
        // -3个工位- 需求变更版: end
        enableCardDiscount: true, // 是否启用持卡会员折扣 // 默认勾选
        id: null, // 编辑时使用
        priceConstant: false, // !!!  这里要注意; 这是旧的单选框的false 现在要给勾选框取反 !!!
        priceChangedWithLevel: true, // !!! 这个字段给 priceConstant 取反用, 用于勾选框 !!!
        shareCopyWriting: "", // 分享文案 - 暂无
        detailType: "0", // 产品详情类型0-富文本,1-模板 - 暂无
        serviceDetailModel: null, // ? 服务详情模板  - 暂无
        fileList: [], // - 多选文件列表 (轮播图)
        video: "",
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
        goodsType: 1, // 服务还是产品
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
      classifications: [], // 服务分类级联
      ranks: [], // 职务列表
      uploadUrl: `${process.env.SERVICE_URL}/service-api/uploadPicture/`,
      jobsNum: 1, // 默认显示几个工位;  编辑时获取有这个,待验证 workStationCount
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        }
        // selectableRange: `${new Date().getHours()}:${new Date().getMinutes() + 1}:00 - 23:59:59`, // 这么写岂不是后面的任何一天都不能设置今天过去的小时分钟了
      },
      dialogVisible: false, //
      dialogImageUrl: "", // 图片预览url
      keyWordDetailImage: null, // 搜索关键词(服务详情)
      rules: {
        title: [
          {
            required: true,
            validator: validBigTitle,
            trigger: "blur"
          },
          {
            required: true,
            validator: validBigTitle,
            trigger: "change"
          }
        ],
        richText: [{ required: true, message: "请输入服务详情" }],
        simpleTitle: [
          { required: true, message: "请输入服务短标题", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        keyword: [
          { required: false, message: "请输入店内编码", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
        ],
        classification: { required: true, message: "请选择服务分类" },
        carouselImagesOrigin: { required: false, message: "请选择轮播图" },
        fileList: { required: true, validator: validateFileListFileList },
        richTextImages: {
          required: true,
          validator: validateFileListDetailImages
        }
      },
      updateFileSizeLimit1: 3, // 轮播
      updateFileSizeLimit2: 5, // 详情
      btnLoad: false,
      isRepetition: false,
      isDetection: false,
      editTitle: "" // 编辑记录title
    };
  },
  created() {
    this.getGoodBuyAndServiceGuarantee(); // 获取服务保障和购买须知列表
  },
  mounted() {
    this.token = utils.getCookieToken("geeme_pc_token")[2];
    this.getServiceSortListByBrandId(); // 初始化商品分类
    this.getSimpleStoreStaffLevelList(); // 初始化员工职务列表
    this.getBrandMemberLevelDiscount(); // 获取会员等级价格
  },
  methods: {
    // 检测重名
    async detection() {
      if (!this.form.title) return this.$message.error("请先输入卡项名称！");
      this.btnLoad = true;
      try {
        const res = await axios.post("/checkNameForGoods", {
          goodsType: 0,
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
        goodsType: 1,
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
              goodsType: 1,
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
      this.form.specificationAndPrices[index].paramList.push({
        title: "",
        content: ""
      });
    },
    delParamter(index, idx) {
      // 根据索引删除数组元素
      let arr = this.form.specificationAndPrices[index].paramList;
      arr.splice(idx, 1);
    },
    // 获取品牌下的服务分类级联数据
    getServiceSortListByBrandId() {
      // 名称允许显示已经修改的，但是选择的数量还是由bms来控制
      axios
        .get(`/getServiceSortListByBrandId/${this.currentInfo.brandId}`)
        .then(response => {
          axios
            .post(`/getStoreSortInfoWithFilter`, {
              brandId: this.currentInfo.brandId,
              sortName: ""
            })
            .then(res => {
              // this.classifications = res.sortInfos;
              res.sortInfos.forEach(item => {
                response.sortInfos.forEach(i => {
                  if (i.jimeiClassId == item.jimeiClassId) {
                    i.sortName = item.sortName || item.name;
                    item.sortTwo.forEach(element => {
                      i.sortTwo.forEach(e => {
                        if (e.jimeiClassId == element.jimeiClassId) {
                          e.sortName = element.sortName || element.name;
                        }
                      });
                    });
                  }
                });
              });
              this.classifications = response.sortInfos;
            });
        });
    },
    // 获取员工职位选项列表
    getSimpleStoreStaffLevelList() {
      axios
        .get(`/getSimpleStoreStaffLevelList/${this.currentInfo.brandId}`)
        .then(res => {
          this.ranks = res.levelList;
          let rankIds = [];
          res.levelList
            .filter(item => item.id !== null)
            .forEach(i => {
              rankIds.push(i.id);
            });
          this.rankIds = rankIds;
          // 在品牌和门店的编辑服务操作中，均获取数据
          if (
            this.$route.path === "/shop-inner/service-edit" ||
            this.$route.path === "/brand-inner/service-edit" ||
            this.fromBrand
          ) {
            this.initEdit();
          }
        });
    },
    // 编辑时获取数据
    initEdit() {
      let serviceId =
        this.isBrand || this.fromBrand
          ? this.$store.state.queryParams.serviceTemplateId
          : this.$store.state.queryParams.serviceId;
      // 后端在这里的请求方式不一样？。。。
      let queryType = this.isBrand || this.fromBrand ? "post" : "get";
      let url =
        this.isBrand || this.fromBrand
          ? "/getServiceTemplateById/"
          : "/getServiceInfo/";
      this.loading = true;
      axios[queryType](`${url}${serviceId}`).then(res => {
        this.form = { ...this.form, ...res };
        this.form.classification = [res.serviceLevelOne, res.serviceLevelTwo];
        this.form.detailImagesOrigin = res.serviceDetailOrigin;
        this.form.carouselImagesOrigin = res.cycleImageOrigin;
        this.$set(this.form, "priceChangedWithLevel", !res.priceConstant); // 取反!!!
        // 服务保障和产品须知的获取
        this.form.serverTempList = res.serverTempList || [];
        this.form.purchaseNoteList = res.purchaseNoteList || [];
        this.form.specificationAndPrices.forEach(item => {
          item.paramList = item.paramList || [
            {
              title: "",
              content: ""
            }
          ];
        });
        if (res.serviceDetailOrigin === "NORMAL") {
          this.form.richTextImages = res.richText.split(",").map(item => {
            return {
              name: `${Math.random()}`,
              url: utils.formatPicImg(item)
            };
          });
          this.form.richTextImagesFromStorage = [];
        } else {
          this.form.richTextImagesFromStorage = res.richText
            .split(",")
            .map(item => {
              return {
                name: `${Math.random()}`,
                url: utils.formatPicImg(item)
              };
            });
          this.form.richTextImages = [];
        }

        if (res.cycleImageOrigin === "NORMAL") {
          this.form.fileList = res.cycleImage.map(item => {
            return {
              name: `${Math.random()}`,
              url: utils.formatPicImg(item)
            };
          });
          this.form.fileListFromStorage = [];
        } else {
          this.form.fileListFromStorage = res.cycleImage.map(item => {
            return {
              name: `${Math.random()}`,
              url: utils.formatPicImg(item)
            };
          });
          this.form.fileList = [];
        }
        this.jobsNum = res.workStationCount;
        this.loading = false;
        // 重名检测在编辑的时候记录下原名称，改动检测，不改动放行！
        this.editTitle = this.form.title;
      });
    },
    // 获取会员等级价格
    getBrandMemberLevelDiscount() {
      axios
        .post("/getBrandMemberLevelDiscount", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          this.discountInfoList = res.discountInfoList;
        });
    },
    // 提交
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let cycleImage = this.form[
            this.form.carouselImagesOrigin === "NORMAL"
              ? "fileList"
              : "fileListFromStorage"
          ].map(item =>
            item.response ? item.response.fileKey : item.url.split("/").pop()
          );
          let richText = this.form[
            this.form.detailImagesOrigin === "NORMAL"
              ? "richTextImages"
              : "richTextImagesFromStorage"
          ]
            .map(item =>
              item.response ? item.response.fileKey : item.url.split("/").pop()
            )
            .join(",");
          let specificationss = this.form.specificationAndPrices.map(item => {
            return {
              id: item.id,
              deleted: item.deleted,
              cost: Number(item.cost),
              shopPrice: Number(item.shopPrice),
              memberPrice: Number(item.memberPrice),
              serviceTime: Number(item.serviceTime) || 0,
              bookingAmount: Number(item.bookingAmount),
              specificationName: item.specificationName,
              cardConstantPrice: Number(item.cardConstantPrice)
            };
          });
          let classification = this.form.classification;
          let serviceLeveleOneInfo, serviceLeveleTwoInfo;
          /**  * 分类 * */
          for (let i in this.classifications) {
            if (this.classifications[i].jimeiClassId === classification[0]) {
              let temServiceLeveleOneInfo = JSON.parse(
                JSON.stringify(this.classifications[i])
              );
              delete temServiceLeveleOneInfo.sortTwo;
              serviceLeveleOneInfo = temServiceLeveleOneInfo;
              let sortTwo = this.classifications[i].sortTwo;
              for (let j in sortTwo) {
                if (sortTwo[j].jimeiClassId === classification[1]) {
                  serviceLeveleTwoInfo = sortTwo[j];
                  break;
                }
              }
              break;
            }
          }
          serviceLeveleOneInfo.brandId = this.currentInfo.brandId;
          serviceLeveleTwoInfo.brandId = this.currentInfo.brandId;
          this.form.priceConstant = !this.form.priceChangedWithLevel; // 覆盖!!!
          // this.form.showInShop = this.shopShowDisabled ? this.form.showInShop : false // 验证数据是否能在小程序上使用微信支付
          let params = {
            ...this.form,
            storeId: this.currentInfo.shopId,
            serviceLevelOne: classification[0],
            serviceLevelTwo: classification[1],
            serviceLeveleOneInfo,
            serviceLeveleTwoInfo,
            richText: richText,
            cycleImage: cycleImage,
            shelveShopsTime:
              this.form.shelveShopsTime || utils.formatDateTime(new Date())
          };
          // return this.$message.success('提交成功~~~')
          this.submitButtonLoading = true;
          // 在此区分是门店创建服务还是品牌创建服务模板
          let url = this.isBrand
            ? "/addOrModifyServiceTemplate"
            : "/addService";
          if (this.isBrand) {
            delete params.storeId;
            params.brandId = this.currentInfo.brandId;
          }
          // 如果是来自模板的新建信息 清空参数中的id
          if (this.fromBrand) {
            delete params.id;
            params.specificationAndPrices.forEach(item => {
              delete item.id;
            });
          }
          axios
            .post(url, params)
            .then(res => {
              this.submitButtonLoading = false;
              if (
                this.$route.path.indexOf("add") !== -1 &&
                !this.isBrand &&
                res.success
              ) {
                this.$message({
                  type: "success",
                  message: "新增服务成功，请前往设置中心对该服务进行提成设置！",
                  duration: 5000
                });
              } else {
                this.$message({
                  message: res.message,
                  type: res.success ? "success" : "warning"
                });
              }
              res.success && this.$router.go(-1);
            })
            .catch(err => {
              this.submitButtonLoading = false;
            });
        } else {
          this.$message.error("检测到非法输入, 请修正后提交!");
        }
      });
    },
    // -- 图片相关 --
    handleRichImagesSuccess(res, file, fileList) {
      this.form.richTextImages = fileList;
      this.$refs.form.validateField("richTextImages");
    },
    examineImage(file) {
      return this.beforeUpload(file, this.updateFileSizeLimit2);
    },
    carouselExceed(files, fileList) {
      if (files.length + fileList.length > 5) {
        this.$message.error("最多上传5张");
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRichImagesRemove(file, fileList) {
      this.form.richTextImages = fileList;
      this.$refs.form.validateField("richTextImages");
    },
    handleLunBoSuccess(res, file, fileList) {
      this.form.fileList = fileList;
      this.$refs.form.validateField("fileList");
    },
    beforeLunBoUpload(file) {
      return this.beforeUpload(file, this.updateFileSizeLimit1);
    },
    beforeUpload(file, size) {
      const isJPG = utils.checkImgTypes(file.type);
      const isLt2M = file.size / 1024 / 1024 <= size;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过${size}M!`);
      }
      return isJPG && isLt2M;
    },
    handleLunBoRemove(file, fileList) {
      this.form.fileList = fileList;
      this.$refs.form.validateField("fileList");
    },
    // == 图片相关 ==
    // ================ 添加工位 ================
    addJobs() {
      if (this.jobsNum === 1) {
        this.form.associateAllJobsTwo = "UN_LIMITED";
      } else {
        this.form.associateAllJobsThree = "UN_LIMITED";
      }
      this.jobsNum++;
    },
    // ================ 删除工位 ================
    delItem(num) {
      this.jobsNum = num;
      if (this.jobsNum === 1) {
        this.form.associateAllJobsTwo = "UN_ADD";
      } else {
        this.form.associateAllJobsThree = "UN_ADD";
      }
    },
    // 按等级计会员价
    memberLevelPrices(price) {
      if (!price) {
        return undefined;
      }
      let priceArray = [];
      let classification = this.form.classification;
      let selClassification = this.form.classification.length === 2;
      this.discountInfoList.forEach(item => {
        let discountList = item.lvlAppointServiceDiscList;
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
            : (price * item.lvlAllServiceDisc) / 10
        });
      });
      return priceArray;
    },
    // 添加规格
    addSpecification() {
      this.form.specificationAndPrices.push({
        id: null, // 规格id
        cost: "", // 成本
        specificationName: "", // 规格名称
        serviceTime: null, // 服务时长
        shopPrice: null, // 门店价
        memberPrice: null, // 成长会员价（固定）
        cardConstantPrice: null, // 持卡会员价
        bookingAmount: null, // 预约金 - 暂无
        paramList: [
          // 规格参数，---相当于商品的静态熟悉
          {
            title: "",
            content: ""
          }
        ]
      });
    },
    // 删除规格
    delSpecialForm(specialItem, index) {
      let list = JSON.parse(JSON.stringify(this.form.specificationAndPrices));
      if (specialItem.id) {
        list[index].deleted = true;
      } else {
        list.splice(index, 1);
      }
      this.$refs.form.resetFields(); // 重置规格校验
      this.form.specificationAndPrices = list;
    },
    // - 校验关联职务
    validatorJobs(rule, value, callback) {
      if (
        this.form.associateAllJobs === "APPOINTED" &&
        this.form.staffLevel.length === 0
      ) {
        callback(new Error("工位1指定职务不能为空"));
      } else if (
        this.form.associateAllJobsTwo === "APPOINTED" &&
        this.form.staffLevelTwo.length === 0
      ) {
        callback(new Error("工位2指定职务不能为空"));
      } else if (
        this.form.associateAllJobsThree === "APPOINTED" &&
        this.form.staffLevelThree.length === 0
      ) {
        callback(new Error("工位3指定职务不能为空"));
      } else {
        callback();
      }
    },
    // 规格名称
    handleValidateSPname(rule, value, cb) {
      value = value || "";
      if (value.trim().length > 20) {
        return cb("规格名称不得超过20个中文");
      }
      if (this.form.specificationAndPrices.length == 1) {
        cb();
      } else {
        if (!value.trim()) {
          return cb("规格名不能为空");
        } else {
          cb();
        }
      }
    },
    // 成本 [成长会员价 ， 持卡会员价]
    costValidator(rule, value, callback) {
      let l = this.getLength(value);
      let value_ = Number(value);
      // console.log('')
      // console.log('1111')
      // console.log(value_)
      if (typeof value_ === "number" && value_ < 0) {
        callback("金额不可以小于0");
      } else if (l > 2) {
        callback("最多输入两位小数");
      } else {
        // console.log(rule.required, value === null)
        if (rule.required && (value === null || value === "")) {
          // 注意是 value  不是 value_
          callback("金额必填");
        } else {
          callback();
        }
      }
    },
    // 服务时长校验
    serviceTimeValidator(rule, value, callback) {
      let l = this.getLength(value);
      let value_ = Number(value);
      if (typeof value_ === "number" && (value_ < 0 || value_ > 720)) {
        callback("服务时长不小于0，且不能大于720分钟");
      } else if (l > 0) {
        callback("不可以输入小数");
      } else {
        callback();
      }
    },
    priceValidator(rule, value, callback) {
      console.log(value);
      if (value === null || value === "" || value < 0) {
        callback("价格必填, 且不能小于0");
      }
      let l = this.getLength(value);
      if (l > 2) {
        callback("最多输入两位小数");
      } else {
        callback();
      }
    },
    getLength(value) {
      let str = value ? value + "" : "";
      let l = str.indexOf(".") === -1 ? 0 : str.split(".").pop().length;
      return l;
    },
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
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 判断是品牌还是门店的标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
    fromBrand() {
      return this.$route.query.fromBrand;
    }
    // 计算是否网店展示（微信支付不能为0， 需要增加持卡会员价校验? 必填?）
    // shopShowDisabled() {
    //   return this.form.specificationAndPrices.every(item => {
    //     return item.memberPrice > 0 && item.shopPrice > 0 && (!this.form.enableCardDiscount && item.cardConstantPrice > 0 || this.form.enableCardDiscount);
    //   });
    // }
  },
  watch: {
    // checkSetTem(val) {
    //   this.getSingleTemInfo(val)
    // }
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
  components: {
    ChooseImages
  }
};
</script>
<style lang='scss' scoped>
.service-content {
  padding: 40px 0 20px;
}

.form-title,
.service-key-words {
  width: 580px;
}

.code {
  width: 360px;
}

.some-store {
  .some-store-select {
    max-width: 200px;
    display: inline-block;
    margin-left: 20px;
  }
}

.el-form-item {
  .el-form-item {
    margin-bottom: 16px;
  }
}

.el-radio-group {
  .el-form-item.radio-form-item {
    margin-bottom: 0;

    /deep/ .el-form-item__label {
      line-height: 35px;
    }

    /deep/ .select-form-material-library {
      display: flex;
      /deep/ .el-radio__inner {
        margin-top: 10px;
      }
      .radio-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .user-defined-radio {
    display: flex;

    .el-form-item {
      margin-top: 15px;

      /deep/ .el-form-item__content {
        .el-upload-list--picture-card {
          max-width: 780px;
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
}

.job-associated {
  display: flex;
  flex-wrap: wrap;

  .select {
    margin-left: 10px;
  }
}

.add-specification {
  font-size: 14px;
  color: #58c9f3;
  // margin: 0 0 20px 0;
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

// 3工位
.associate-jobs-box {
  padding-left: 4px;
}
.jobs-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
  .title {
    margin-right: 12px;
  }
  /deep/ .icon-icon_operate_delete {
    color: #dfe1e3;
    &:hover {
      color: #41cac0;
    }
  }
}
.add-button {
  color: #58c9f3;
  font-size: 14px;
  display: inline;
  cursor: pointer;
}

// 服务价格（规格）
.specification-box {
  position: relative;
  background: #f1f2f7;
  padding: 20px 0;
  width: 880px;
  border-radius: 6px;
  & + .specification-box {
    margin-top: 10px;
  }
  .icon-icon_operate_delete {
    &.price-delete {
      position: absolute;
      right: -24px;
      bottom: 2px;
      cursor: pointer;
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

.icon-icon_popup_question {
  margin-left: 4px;
  cursor: help;
  color: #ff6d61;
}

.tip-parent-box {
  position: relative;
  &:hover .g-tip {
    display: block;
    z-index: 100;
    background: #fff;
    transform: translate(110%, -40%);
  }
  &:hover .none-transform {
    transform: translate(110%, -40%);
  }
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
        min-height: 500px;
        .el-col {
          min-height: 500px;
          .tem-left {
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

.parameter-box {
  position: relative;
  border: 1px solid #dcdfe6;
  width: 640px;
  padding-top: 20px;
  & + .parameter-box {
    margin-top: 20px;
  }
  .parameter-icon {
    position: absolute;
    top: 85%;
    right: -50px;
    :nth-child(1) {
      font-size: 14px;
      color: #58c9f3;
      transition: all 0.6s;
      cursor: pointer;
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
