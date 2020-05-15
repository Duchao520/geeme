<template>
  <div class="edit-card-info">
    <el-form :model="form" :rules="rules" ref="form" class="form-root">
      <!-- 会员卡类型 只在编辑状态下显示-->
      <div class="form-line" v-if="onEdit">
        <div class="form-title">
          <span>卡项类型</span>
        </div>
        <div class="form-con">{{formatCardType(cardType)}}</div>
      </div>

      <!-- 会员卡名称 -->
      <div class="form-line">
        <div class="form-title">
          <span class="xing">卡项名称</span>
        </div>
        <div class="form-con sale-num">
          <el-form-item style="width:420px;" prop="cardName">
            <el-input v-model="form.cardName" placeholder="请输入会员卡名称，不超过16个中文字符" maxlength="16"></el-input>
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
      </div>

      <!-- 会员卡封面修改 只在编辑状态下显示 -->
      <div class="form-line" v-if="onEdit">
        <div class="form-title">
          <span class="xing">会员卡封面</span>
        </div>
        <div class="form-con">
          <img class="card-cover" :src="formatPicImage(currentCardCover, 'style', 70, 'brandLogo')" />
          <i
            class="icon iconfont icon-icon_operate_edit"
            @click="$emit('vipCardStep', {
              data:'select-card-cover'
            })"
          ></i>
        </div>
      </div>

      <!-- 首次充值金额 储值卡独有 -->
      <div class="form-line" v-if="cardType === 1">
        <div class="form-title">
          <span class="xing">首次充值金额</span>
        </div>
        <div class="form-con price" style="display: flex;">
          <el-form-item style="width:200px;" prop="firstNum">
            <el-input v-model.number="form.cardFirstRechargeNum" placeholder="金额" maxlength="12">
              <el-button slot="append">元</el-button>
            </el-input>
          </el-form-item>
          <el-checkbox-group v-model="cardUseforFirst" style="margin-left:10px;">
            <el-checkbox
              :label="goods.value"
              v-for="goods in canBuyType"
              :key="goods.value"
              :checked="!onEdit && goods.name ==='服务'"
            >{{goods.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <!-- 赠送金金额 储值卡独有 -->
      <div class="form-line" v-if="cardType === 1">
        <div class="form-title">
          <span>赠送金金额</span>
        </div>
        <div class="form-con price" style="display: flex;">
          <el-form-item style="width:200px;" prop="cardGiftNum">
            <el-input v-model.number="form.cardGiftNum" placeholder="金额" maxlength="12">
              <el-button slot="append">元</el-button>
            </el-input>
          </el-form-item>
          <el-checkbox-group v-model="cardUsefor" style="margin-left:10px;">
            <el-checkbox
              :label="goods.value"
              v-for="goods in canBuyType"
              :key="goods.value"
              :checked="!onEdit && goods.name ==='服务'"
            >{{goods.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <!-- 发售数量 -->
      <div class="form-line">
        <div class="form-title">
          <span>发售数量</span>
        </div>
        <div class="form-con sale-num">
          <el-form-item style="width:200px;" prop="cardSellNum">
            <el-input v-model.number="form.cardSellNum" placeholder="仅限数字" maxlength="12"></el-input>
          </el-form-item>
          <span style="color:#CCCCCC;font-size:14px;margin-left:10px;">不填写表示不限制数量</span>
        </div>
      </div>

      <!-- 单店限售数量 -->
      <div class="form-line">
        <div class="form-title">
          <span>单店限售数量</span>
        </div>
        <div class="form-con sale-num">
          <el-form-item style="width:200px;" prop="cardStoreSellNum">
            <el-input v-model.number="form.cardStoreSellNum" placeholder="仅限数字" maxlength="12"></el-input>
          </el-form-item>
          <span style="color:#CCCCCC;font-size:14px;margin-left:10px;">不填写表示不限制数量</span>
        </div>
      </div>

      <!-- 会员卡售价 储值卡没有 -->
      <div class="form-line" v-if="cardType !== 1">
        <div class="form-title">
          <span class="xing">会员卡售价</span>
        </div>
        <div class="form-con price">
          <el-form-item style="width:200px;" prop="cardPrice">
            <el-input v-model.number="form.cardPrice" placeholder="金额" maxlength="12">
              <el-button slot="append">元</el-button>
            </el-input>
          </el-form-item>
        </div>
      </div>

      <!-- 折扣权益 身份卡&储值卡 -->
      <div class="form-line" v-if="cardType < 2">
        <div class="form-title">
          <span class="xing">折扣权益</span>
        </div>
        <div class="form-con discount">
          <el-form-item prop="discount">
            <!-- 单选框组 -->
            <el-radio-group v-model="form.cardDiscountStrategy">
              <!-- 不打折 -->
              <el-radio :label="0">
                <span>不打折</span>
              </el-radio>
              <!-- 全部打折 -->
              <el-radio :label="1">
                <!-- 所有服务 .... 折 -->
                <span style="margin-right:10px">所有服务</span>
                <el-form-item style="width:100px;margin-right:30px">
                  <el-input
                    v-model="form.cardServiceDiscount"
                    maxlength="4"
                    placeholder="数字"
                    :disabled="form.cardDiscountStrategy!==1"
                  >
                    <el-button slot="append">折</el-button>
                  </el-input>
                </el-form-item>

                <!-- 所有产品 .... 折 -->
                <span style="margin-right:10px">所有产品</span>
                <el-form-item style="width:100px;margin-right:10px">
                  <el-input
                    v-model="form.cardProductDiscount"
                    maxlength="4"
                    placeholder="数字"
                    :disabled="form.cardDiscountStrategy!==1"
                  >
                    <el-button slot="append">折</el-button>
                  </el-input>
                </el-form-item>

                <span style="color:#CCCCCC;font-size:14px;">10表示不打折</span>
              </el-radio>
              <!-- 指定服务 ...  -->
              <el-radio :label="2">
                <span style="margin-right:10px">指定服务</span>
                <el-button
                  class="button"
                  :disabled="form.cardDiscountStrategy!==2"
                  @click="showClassSelect('service')"
                >选择服务</el-button>
                <span style="margin-right:10px">指定产品</span>
                <el-button
                  class="button"
                  :disabled="form.cardDiscountStrategy!==2"
                  @click="showClassSelect('product')"
                >选择产品</el-button>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 已选服务分类表 -->
          <class-table
            type="Service"
            :list="form.partServiceDiscountStrategy"
            v-if="form.partServiceDiscountStrategy instanceof Array && form.partServiceDiscountStrategy.length"
            v-show="form.cardDiscountStrategy === 2"
            @delete="delSelectClass"
            @change="onDiscountChange"
            @batch="onBatchChange"
          ></class-table>

          <!-- 已选产品分类表 -->
          <class-table
            type="Product"
            :list="form.partProductDiscountStrategy"
            v-show="form.cardDiscountStrategy === 2"
            v-if="form.partProductDiscountStrategy instanceof Array && this.form.partProductDiscountStrategy.length > 0"
            @delete="delSelectClass"
            @change="onDiscountChange"
            @batch="onBatchChange"
          ></class-table>
        </div>
      </div>
      <!-- 享受权益 次卡&时间卡 -->
      <div class="form-line" v-if="cardType > 1">
        <div class="form-title">
          <span class="xing">享受权益</span>
        </div>
        <div class="form-con discount">
          <el-button plain class="plain_blue_btn" @click="showTimesCardService">选择服务</el-button>
          <!-- 次卡 -->
          <div
            class="service-choosed-box"
            v-if="cardType === 2 && form.listServiceCountInfo.length"
          >
            <el-table :data="form.listServiceCountInfo" stripe>
              <el-table-column label="服务项目名称" show-overflow-tooltip prop="serviceName"></el-table-column>
              <el-table-column label="规格" show-overflow-tooltip prop="serviceSpecificationName"></el-table-column>
              <el-table-column label="门店价" show-overflow-tooltip prop="shopPrice">
                <template slot-scope="{ row }">
                  <p>{{ row.shopPrice ? `￥${row.shopPrice}` : '-'}}</p>
                </template>
              </el-table-column>
              <el-table-column label="次数" width="175">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'listServiceCountInfo.'+ scope.$index + '.countLimit'"
                    :rules="{validator: validateCountLimit, trigger: 'change'}"
                  >
                    <el-input
                      :maxlength="4"
                      v-model.number="form.listServiceCountInfo[scope.$index].countLimit"
                      class="count-input"
                      size="small"
                      :disabled="form.totalCountLimitStatus"
                    >
                      <template slot="append">次</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="单次耗卡业绩" prop="servicePerformance" width="175">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'listServiceCountInfo.'+ scope.$index + '.servicePerformance'"
                    :rules="{validator: validateServicePerformance, trigger: 'change'}"
                  >
                    <el-input
                      :maxlength="8"
                      v-model.number="form.listServiceCountInfo[scope.$index].servicePerformance"
                      class="count-input"
                      size="small"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否赠送">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-checkbox
                      class="giftRef"
                      v-model="scope.row.isGift"
                      @change="judgeGift(scope.$index)"
                      style="margin-top: 20px;"
                    >{{scope.row.isGift ? '是' : '否'}}</el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="48">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedService(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="common-count">
              <div class="left-box-under-table">
                <div class="top-line">
                  <el-checkbox
                    :disabled="hasGift"
                    v-model="form.totalCountLimitStatus"
                    @change="handleTotalCountChanged"
                  ></el-checkbox>共用次数:
                </div>
                <div class="bottom-line">勾选此项之后，以上项目将共用此次数，各项目单独设置的次数无效。</div>
              </div>
              <div class="right-box-under-table">
                <el-form-item
                  prop="totalCountLimit"
                  :rules="{validator: validateTotalCountLimit, trigger: 'change'}"
                >
                  <el-input
                    v-model.number="form.totalCountLimit"
                    :maxlength="4"
                    size="small"
                    class="count-input"
                    :disabled="!form.totalCountLimitStatus"
                  >
                    <template slot="append">次</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- 时间卡 -->
          <div
            class="service-choosed-box"
            v-if="cardType === 3 && form.listServiceCountInfo.length"
          >
            <el-table :data="form.listServiceCountInfo" stripe>
              <el-table-column label="服务项目名称" show-overflow-tooltip prop="serviceName"></el-table-column>
              <el-table-column
                label="规格"
                show-overflow-tooltip
                prop="serviceSpecificationName"
                width="100"
              ></el-table-column>
              <el-table-column label="门店价" show-overflow-tooltip prop="shopPrice" width="100">
                <template slot-scope="{ row }">
                  <p>{{ row.shopPrice ? `￥${row.shopPrice}` : '-'}}</p>
                </template>
              </el-table-column>
              <el-table-column label="限制次数">
                <template slot-scope="scope">
                  <!-- <span :class="`row${scope.row.$index}`">无限次</span> -->
                  <div>
                    <el-radio-group v-model="form.listServiceCountInfo[scope.$index].infiniteTime">
                      <el-radio :label="0">无限次</el-radio>
                      <el-radio :label="1">指定次数</el-radio>
                    </el-radio-group>
                    <el-form-item
                      :prop="`listServiceCountInfo.${scope.$index}.countLimit`"
                      :rules="{required: !!form.listServiceCountInfo[scope.$index].infiniteTime, validator: validateCountLimit, trigger: 'change'}"
                    >
                      <el-input
                        :maxlength="4"
                        v-model.number="form.listServiceCountInfo[scope.$index].countLimit"
                        class="count-input"
                        size="small"
                        :disabled="form.listServiceCountInfo[scope.$index].infiniteTime === 0"
                      >
                        <template slot="append">次</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单次耗卡业绩" prop="servicePerformance">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'listServiceCountInfo.'+ scope.$index + '.servicePerformance'"
                    :rules="{validator: validateServicePerformance, trigger: 'change'}"
                  >
                    <el-input
                      :maxlength="8"
                      v-model.number="form.listServiceCountInfo[scope.$index].servicePerformance"
                      class="count-input"
                      size="small"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否赠送" width="88">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-checkbox
                      class="giftRef"
                      v-model="scope.row.isGift"
                      @change="judgeGift(scope.$index)"
                      style="margin-top: 20px;"
                    >{{scope.row.isGift ? '是' : '否'}}</el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="48">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedService(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 绑定产品 次卡&时间卡 -->
      <div class="form-line" v-if="cardType > 1">
        <div class="form-title">
          <span>绑定产品</span>
        </div>
        <div class="form-con">
          <div>
            <el-button plain class="plain_blue_btn" @click="showBindProduct">选择产品</el-button>
            <span>销售该次卡时所选产品将自动出库！</span>
            <el-checkbox v-model="form.isOverSell">库存不足时允许销售（库存减为负数）</el-checkbox>
          </div>
          <div class="service-choosed-box" v-if="cardType > 1 && form.bindProductInfoList.length">
            <el-table :data="form.bindProductInfoList" stripe>
              <el-table-column label="产品名称" show-overflow-tooltip prop="productName"></el-table-column>
              <el-table-column label="规格" prop="productSpecificationName"></el-table-column>
              <el-table-column label="专柜价" prop="shopPrice"></el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'bindProductInfoList.'+ scope.$index + '.count'"
                    :rules="{validator: validateBindProductCount, trigger: 'change'}"
                  >
                    <el-input
                      :maxlength="4"
                      v-model.number="form.bindProductInfoList[scope.$index].count"
                      class="count-input"
                      size="small"
                    >
                      <template slot="append">件</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="48">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedBindProduct(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 有效期限 非时间卡-->
      <div class="form-line">
        <div class="form-title">
          <span class="xing">有效期限</span>
        </div>
        <div class="form-con discount">
          <!-- <el-form-item v-if="onEdit && form.validUsedNum > 0">
            {{'首次使用后'+ form.validUsedNum + dateTrans(form.validUnit)}}
          </el-form-item>-->
          <el-form-item prop="limitTime">
            <!-- 单选框组 -->
            <el-radio-group v-model="validPermanentFlag">
              <!-- 永久有效 -->
              <el-radio :label="1" style="width: 100px;" v-if="cardType !== 3">
                <span>永久有效</span>
              </el-radio>
              <!-- 开卡后有效 -->
              <el-radio :label="2" style="width: 200px;">
                <span style="margin-right:10px">开卡后</span>
                <el-form-item style="width:60px;margin-right:30px">
                  <el-input
                    v-model.number="form.validNum"
                    maxlength="4"
                    placeholder="数字"
                    :disabled="validPermanentFlag !== 2"
                    class="item-number-input"
                  ></el-input>
                  <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                    <el-button class="right-drowndown-btn">
                      {{showTimeUnit}}
                      <i class="icon iconfont icon-icon_back arrow-down"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="year">年</el-dropdown-item>
                      <el-dropdown-item command="month">月</el-dropdown-item>
                      <el-dropdown-item command="day">日</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>

                <!-- <span style="margin-right:10px">续卡后</span>
                <el-form-item style="width:100px;margin-right:10px">
                  <el-input
                    v-model.number="form.useLife.time.afterAddCard"
                    maxlength="4"
                    placeholder="数字"
                    :disabled="form.discount.discountType!=='all'"
                  >
                  <el-button slot="append">元</el-button>
                </el-input>
                </el-form-item>-->
              </el-radio>
              <!-- 首次使用后有效 -->
              <el-radio :label="3" style="width: 200px;">
                <span style="margin-right:10px">首次使用后</span>
                <el-form-item style="width:60px;margin-right:30px">
                  <el-input
                    v-model.number="form.validUsedNum"
                    maxlength="4"
                    placeholder="数字"
                    :disabled="validPermanentFlag !== 3"
                    class="item-number-input"
                  ></el-input>
                  <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                    <el-button class="right-drowndown-btn">
                      {{showTimeUnit}}
                      <i class="icon iconfont icon-icon_back arrow-down"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="year">年</el-dropdown-item>
                      <el-dropdown-item command="month">月</el-dropdown-item>
                      <el-dropdown-item command="day">日</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <!-- 有效期限 时间卡 之前时间卡的有效期限-->
      <!-- <div class="form-line" style="margin-top: 14px;" v-if="cardType === 3">
        <div class="form-title">
          <span class="xing">有效期限</span>
        </div>
        <div class="form-con">
          <el-form-item prop="limitTime">
            <div class="time-card-limit-line">
              <div style="margin-right:10px">开卡后</div>
              <el-input
                v-model.number="form.validNum"
                maxlength="4"
                placeholder="数字"
                class="item-number-input"
              ></el-input>
              <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                <el-button class="right-drowndown-btn">
                  {{showTimeUnit}}
                  <i class="icon iconfont icon-icon_back arrow-down"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="year">年</el-dropdown-item>
                  <el-dropdown-item command="month">月</el-dropdown-item>
                  <el-dropdown-item command="day">日</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-form-item>
        </div>
      </div>-->

      <!-- 上架门店 身份卡&储值卡 -->
      <div class="form-line" v-if="cardType < 2">
        <div class="form-title">
          <span class="xing">上架门店</span>
        </div>
        <div class="form-con">
          <el-form-item prop="upperStore">
            <el-radio-group v-model="form.upperStoreStrategy">
              <el-radio :label="0">
                <span>所有门店</span>
              </el-radio>
              <el-radio :label="1">
                <span>所有直营店</span>
              </el-radio>
              <el-radio :label="2">
                <span style="margin-right:10px">指定门店</span>
                <el-button
                  class="button"
                  :disabled="form.upperStoreStrategy!==2"
                  @click="selectUpperStore"
                >选择门店</el-button>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <shops-table
            v-if="showUpperStore"
            v-show="form.upperStoreStrategy === 2"
            @delete="deleteShop"
            :list="form.upperStore.storeIdList"
            name="upper"
          ></shops-table>-->
          <!-- 指定门店选择的结果 -->
          <div class="selected-shops">
            <el-table
              stripe
              height="286px"
              cell-class-name="shops-cell"
              header-row-class-name="goods-table-herder"
              :data="form.upperStore.storeIdList"
              v-if="form.upperStore && form.upperStore.storeIdList.length"
            >
              <!-- <el-table-column show-overflow-tooltip label="省份" prop="province"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip label="城市" prop="city"></el-table-column> -->
              <el-table-column show-overflow-tooltip label="门店名称" prop="storeName"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip label="门店性质"> -->
              <!-- <template slot-scope="scope"> -->
              <!-- {{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}} -->
              <!-- </template> -->
              <!-- </el-table-column> -->
              <el-table-column label="操作" width="48">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedUpperShops(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 上架门店 次卡&时间卡 -->
      <div class="form-line" v-if="cardType > 1">
        <div class="form-title">
          <span class="xing">上架门店</span>
        </div>
        <div class="form-con">
          <el-form-item prop="upperStore">
            <el-radio-group v-model="form.upperStoreStrategy">
              <el-radio :label="0" disabled>
                <span>所有门店</span>
              </el-radio>
              <el-radio :label="1" disabled>
                <span>所有直营店</span>
              </el-radio>
              <el-radio :label="2">
                <span>当前门店</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <!-- 适用门店 身份卡&储值卡 -->
      <div class="form-line" v-if="cardType < 2">
        <div class="form-title">
          <span class="xing">适用门店</span>
        </div>
        <div class="form-con">
          <el-form-item prop="suitStore">
            <el-radio-group v-model="form.suitStoreStrategy">
              <el-radio :label="0">
                <span>所有门店</span>
              </el-radio>
              <el-radio :label="1">
                <span>所有直营店</span>
              </el-radio>
              <el-radio :label="2">
                <span style="margin-right:10px">指定门店</span>
                <el-button
                  class="button"
                  :disabled="form.suitStoreStrategy!==2"
                  @click="selectSuitStore"
                >选择门店</el-button>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <shops-table
            v-if="showSuitStore"
            v-show="form.suitStoreStrategy === 2"
            @delete="deleteShop"
            :list="form.suitStore.storeIdList"
            name="suit"
          ></shops-table>-->
          <!-- 指定门店选择的结果 -->
          <div class="selected-shops">
            <el-table
              stripe
              height="286px"
              cell-class-name="shops-cell"
              header-row-class-name="goods-table-herder"
              :data="form.suitStore.storeIdList"
              v-if="form.suitStore && form.suitStore.storeIdList.length"
            >
              <!-- <el-table-column show-overflow-tooltip label="省份" prop="province"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip label="城市" prop="city"></el-table-column> -->
              <el-table-column show-overflow-tooltip label="门店名称" prop="storeName"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip label="门店性质"> -->
              <!-- <template slot-scope="scope"> -->
              <!-- {{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}} -->
              <!-- </template> -->
              <!-- </el-table-column> -->
              <el-table-column label="操作" width="48">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedSuitShops(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 适用门店 次卡&时间卡 -->
      <div class="form-line" v-if="cardType > 1">
        <div class="form-title">
          <span class="xing">适用门店</span>
        </div>
        <div class="form-con">
          <el-form-item prop="upperStore">
            <el-radio-group v-model="form.suitStoreStrategy">
              <el-radio :label="0" disabled>
                <span>所有门店</span>
              </el-radio>
              <el-radio :label="1" disabled>
                <span>所有直营店</span>
              </el-radio>
              <el-radio :label="2">
                <span>当前门店</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <!-- 网店展示 -->
      <div class="form-line">
        <div class="form-title">
          <span>网店展示</span>
        </div>
        <div class="form-con">
          <el-form-item>
            <el-radio-group v-model="form.onlineStoreShow">
              <el-radio :label="true">
                <span>展示</span>
              </el-radio>
              <el-radio :label="false">
                <span>隐藏</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <!-- 上架时间按 限编辑状态展示 -->
      <div class="form-line" v-if="onEdit">
        <div class="form-title">
          <span>上架时间</span>
        </div>
        <div class="form-con on-sale-time">
          <el-form-item prop="upperTime">
            <el-radio-group v-model="form.upperImmediately">
              <el-radio :label="true">立即上架</el-radio>
              <el-radio :label="false">指定时间</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-date-picker
            class="date-time"
            v-model="form.upperTime"
            type="datetime"
            placeholder="请选择日期和时间"
            default-time="12:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </div>
      </div>

      <!-- 是否超值推荐 -->
      <div class="form-line" v-if="onEdit">
        <div class="form-title">
          <span>超值推荐</span>
        </div>
        <div class="form-con">
          <el-form-item>
            <el-checkbox v-model="form.superRecommend">推荐</el-checkbox>
          </el-form-item>
        </div>
      </div>

      <!-- 会员卡说明 -->
      <div class="form-line">
        <div class="form-title">
          <span>使用说明</span>
        </div>
        <div class="form-con">
          <el-form-item style="width:420px;">
            <input-with-count
              v-model="form.cardInstruction"
              placeholder="请输入备注"
              :autosize="{ minRows: 4}"
            ></input-with-count>
          </el-form-item>
        </div>
      </div>

      <!-- 办卡须知 -------待进一步跟进 -->
      <div class="form-line">
        <div class="form-title">
          <span>办卡须知</span>
        </div>
        <div class="form-con notice">
          <el-form-item>
            <el-select v-model="form.cardNotesId" placeholder="默认模板">
              <el-option
                v-for="item in cardNoticeList"
                :key="item.id"
                :label="item.notesTitle"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <button class="button_set" @click.prevent="showSetNotice">
            <i style="margin-right:2px;" class="icon iconfont icon-info_set"></i>
            <span>设置模版</span>
          </button>
        </div>
      </div>

      <!-- 是否为礼品卡 -->
      <div class="form-line">
        <div class="form-title">
          <span>是否为礼品卡</span>
        </div>
        <div class="form-con">
          <el-form-item style="width:420px;">
            <el-checkbox v-model="form.giftCard">{{'礼品卡'}}</el-checkbox>
          </el-form-item>
        </div>
      </div>

      <!-- 新增状态操作 -->
      <div class="form-line" v-if="!onEdit">
        <div class="form-title"></div>
        <div class="form-con">
          <el-button type="primary" @click="next">下一步</el-button>
          <el-button @click="previous">上一步</el-button>
        </div>
      </div>
      <!-- 编辑状态操作 -->
      <div class="form-line" v-if="onEdit">
        <div class="form-title"></div>
        <div class="form-con">
          <el-button type="primary" @click="saveEdit">保存修改</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </div>
    </el-form>

    <!-- 设置须知模板 -->
    <set-notice :setNoticeModelVisible="setNoticeModelVisible" @close="closeNoticeSet"></set-notice>

    <!-- 新的上架门店组件 -->
    <selectShops
      v-if="selectUpperShopModelVisible"
      :shopsVisible="selectUpperShopModelVisible"
      :title="'选择上架门店'"
      :superCheckedShops="checkedUpperShopIds"
      @suberData="setUpperShopsTable"
      @close="selectUpperShopModelVisible=false"
    />
    <!-- 选择上架门店 -->
    <!-- <select-shop
      :selectShopModelVisible="selectUpperShopModelVisible"
      type="upper"
      :defualt="upperSelected"
      @change="getUpperSelection"
      @close="selectUpperShopModelVisible = false"
    ></select-shop>-->

    <!-- 新的上架门店组件 -->
    <selectShops
      v-if="selectSuitShopModelVisible"
      :shopsVisible="selectSuitShopModelVisible"
      :title="'选择上架门店'"
      :superCheckedShops="checkedSuitShopIds"
      @suberData="setSuitShopsTable"
      @close="selectSuitShopModelVisible=false"
    />
    <!-- 选择适用门店 -->
    <!-- <select-shop
      :selectShopModelVisible="selectSuitShopModelVisible"
      type="suit"
      :defualt="suitSelected"
      @change="getSuitSelection"
      @close="selectSuitShopModelVisible = false"
    ></select-shop>-->
    <!-- 选择指定服务/产品 -->
    <class-select
      :classSelectVisible="serviceSelectVisible"
      selectType="service"
      :oriList="serviceList"
      @close="serviceSelectVisible = false"
      @done="mergeClassData"
    ></class-select>
    <class-select
      :classSelectVisible="productSelectVisible"
      selectType="product"
      :oriList="productList"
      @close="productSelectVisible = false"
      @done="mergeClassData"
    ></class-select>
    <!-- 时间卡次卡选择服务对话框 -->
    <selectServiceForTimeCard
      :timesCardDialog="timesCardDialog"
      :superCheckedService="checkedServiceIds"
      v-if="timesCardDialog"
      @close="timesCardDialog=false"
      @suberData="setServiceTable"
    />
    <!-- 时间卡、次卡 绑定产品对话框 -->
    <!-- 拼团组件有过滤已上线的拼团产品, 这里引入的要去掉过滤 采用另一个接口 isGroupBuy: false -->
    <productDialog
      v-if="bindProductVIsible"
      :visible="bindProductVIsible"
      @close="bindProductVIsible=false"
      @suberData="getBindProductDataFromSuber"
      :superCheckedGoods="selectedBindProductIds"
      :isGroupBuy="false"
    />
  </div>
</template>
<script>
import InputWithCount from "@/components/common/InputWithCount";
import setNotice from "./component/setNotice";
// import selectShop from "./component/selectShop";
import selectShops from "../marketManagement/marketSoft/redPacket/components/selectShops";
import shopsTable from "./component/shopsTable";
import classSelect from "./component/classSelect";
import classTable from "./component/classTable";
import selectServiceForTimeCard from "./component/selectServiceForTimesCard";
// 拼团组件有过滤已上线的拼团产品, 这里引入的要去掉过滤 采用另一个接口 isGroupBuy: false
import productDialog from "@/pages/marketManagement/marketSoft/groupBuy_shop/components/productsDialog";

import * as rgxp from "@/util/regExp";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { reg } from "@/assets/js/RegExp";
import { mapActions, mapGetters, mapState } from "vuex";
import { deflate } from "zlib";
import { classBody } from "babel-types";
import { log } from "util";

export default {
  props: {
    firstUseFlag: {
      type: Boolean
    }
  },
  components: {
    "input-with-count": InputWithCount,
    "set-notice": setNotice,
    // "select-shop": selectShop,
    "shops-table": shopsTable,
    "class-select": classSelect,
    "class-table": classTable,
    selectShops,
    selectServiceForTimeCard,
    productDialog
  },
  data() {
    return {
      // 储存卡新增卡用途数据
      canBuyType: [
        {
          value: 2,
          name: "服务"
        },
        {
          value: 1,
          name: "产品"
        },
        {
          value: 4,
          name: "次卡"
        },
        {
          value: 8,
          name: "时间卡"
        },
        {
          value: 16,
          name: "身份卡"
        }
      ],
      // 充值金额用途数据
      cardUseforFirst: [],
      // 赠送金的用途
      cardUsefor: [],
      formatPicImage: utils.formatPicImage,
      form: {
        brandId: this.$store.state.manage.currentInfo.brandId,
        cardName: "",
        isOverSell: false, // 次卡、时间卡 - 是否允许是否允许超卖
        bindProductInfoList: [], // 次卡、时间卡 - 绑定的产品的
        cardSellNum: "",
        cardStoreSellNum: "",
        /* 身份卡售价 身份卡独有 */
        cardPrice: "",
        /* 会员卡优惠折扣策略:0-不打折，1-所有服务，所有产品，2-指定服务，指定产品 */
        cardDiscountStrategy: 0,
        /* 所有服务的折扣 */
        cardServiceDiscount: "",
        /* 所有产品的折扣 */
        cardProductDiscount: "",
        /* 指定服务优惠折扣信息列表-身份卡&储值卡 */
        partServiceDiscountStrategy: [],
        /* 指定服务消费权益-时间卡&次卡 */
        listServiceCountInfo: [],
        totalCountLimit: null, // 次卡共用次数
        totalCountLimitStatus: false, // 是否启用次卡共用次数, 该字段后端没有提供！！！！
        /* 指定产品优惠折扣信息列表 */
        partProductDiscountStrategy: [],
        /* 是否永久有效*/
        validPermanent: true,
        /* 开卡后有效期限 */
        validNum: "",
        /* 首次使用后有效期限 */
        validUsedNum: "",
        /* 有效期限单位 */
        validUnit: "year",
        /* 适用门店策略:0-所有门店，1-所有直营店，2指定门店 */
        suitStoreStrategy: 0,
        /* 指定适用门店策略 */
        suitStore: { storeIdList: [], type: 0 },
        /* 上架门店策略:0-所有门店，1-所有直营店，2指定门店 */
        upperStoreStrategy: 0,
        /* 指定上架门店策略 */
        upperStore: { storeIdList: [], type: 0 },
        /* 网店展示：true—展示，false—隐藏 */
        onlineStoreShow: true,
        /* 会员卡说明 */
        cardInstruction: "",
        /* 会员卡须知ID */
        cardNotesId: "",
        /* 首充金额  储值卡独有*/
        cardFirstRechargeNum: "",
        /* 赠送金额 储值卡独有*/
        cardGiftNum: "",
        /* 赠送金用途 */
        cardGiftMoneyUse: 2,
        /* 首充金用途 */
        cardRechargeMoneyUse: 2,
        // 是否为礼品卡
        giftCard: false
      },
      // 有效期是否永久有效中间监听判断
      validPermanentFlag: 1,
      rules: {
        cardName: [
          { validator: this.validateCardName, trigger: "blur" },
          { validator: this.validateCardName, trigger: "change" },
        ],
        cardPrice: [{ validator: this.validateCardPrice, trigger: "blur" }],
        firstNum: [{ validator: this.validatefirstNum, trigger: "blur" }],
        cardGiftNum: [{ validator: this.validateGiftNum, trigger: "blur" }],
        discount: [{ validator: this.validateDiscount, trigger: "submit" }],
        limitTime: [{ validator: this.validateLimitTime, trigger: "submit" }],
        upperStore: [{ validator: this.validateUpperStore, trigger: "submit" }],
        suitStore: [{ validator: this.validateSuitStore, trigger: "submit" }],
        /* 上架时间 -- 编辑状态 */
        upperTime: [{ validator: this.validateUpperTime, trigger: "submit" }],
        /* 通用非负数字校验 */
        cardSellNum: [{ validator: this.validateAmount, trigger: "blur" }],
        cardStoreSellNum: [{ validator: this.validateAmount, trigger: "blur" }]
      },
      /* 设置须知弹窗显隐*/
      setNoticeModelVisible: false,
      /* 会员卡须知列表 */
      cardNoticeList: [],
      /* 选择门店弹窗显隐 */
      selectSuitShopModelVisible: false,
      selectUpperShopModelVisible: false,
      /* 是否立即上架 -- 编辑状态 */
      upperImmediately: true,
      /* 上架时间 -- 编辑状态 */
      upperTime: null,
      /* 是否超值推荐 -- 编辑状态 */
      superRecommend: false,
      suitSelected: [],
      checkedSuitShopIds: new Set(), // ====> 适用门店选中的id
      checkedSuitShopObj: {}, // 键值对化的选上架中门店 key: shopId, value: shopObj
      upperSelected: [],
      checkedUpperShopIds: new Set(), // ====> 上架门店选中的id
      checkedUpperShopObj: {}, // 键值对化的选上架中门店 key: shopId, value: shopObj
      /* 服务/产品选择模块显/隐，及其类别 */
      serviceSelectVisible: false,
      productSelectVisible: false,
      classSelectType: "",
      serviceList: [],
      productList: [],

      // 次卡&时间卡 权益服务
      checkedServiceIds: new Set(), // ===> 选中的服务权益
      checkedServiceObj: {}, // 键值对化选中的服务权益
      // - 次卡时间卡选择服务对话框
      timesCardDialog: false,
      bindProductVIsible: false, // 次卡时间卡选择绑定产品-对话框
      selectedBindProductIds: new Set(), // 次卡时间卡选择绑定产品-id
      selectedBindProductObj: {}, // 次卡时间卡选择绑定产品-obj
      // 时间卡使用次数限制标识
      timeCardCountFlag: false,
      hasGift: false,
      btnLoad: false,
      isRepetition: false,
      isDetection: false,
      editTitle:''
    };
  },
  computed: {
    ...mapGetters(["currentCardCover"]),
    /* 展示的有效期限单位 */
    showTimeUnit() {
      if (this.form.validUnit === "year") {
        return "年";
      } else if (this.form.validUnit === "month") {
        return "月";
      } else if (this.form.validUnit === "day") {
        return "日";
      }
    },
    /* 标识当前处于哪种卡的新增/编辑界面 */
    cardType() {
      return this.$store.state.vipCard.addNewVipCard.cardType.type;
    },
    /* 是否处于编辑状态 */
    onEdit() {
      return this.$store.state.vipCard.addNewVipCard.onCardEdit;
    },
    /* 编辑状态会员卡id */
    editCardId() {
      return this.$store.state.vipCard.addNewVipCard.editCardId;
    },
    /* 编辑状态下，新的会员卡封面 */
    cardCoverUserDefined() {
      return this.$store.state.vipCard.cardCoverUserDefined;
    },
    /* 是否展示已选上架门店列表 */
    showUpperStore() {
      if (
        this.form.upperStore == null ||
        this.form.upperStore.storeIdList.length === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    /* 是否展示已选适用门店列表 */
    showSuitStore() {
      if (
        this.form.suitStore == null ||
        this.form.suitStore.storeIdList.length === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    cardCoverFromStorage: {
      get() {
        return this.$store.state.vipCard.cardCoverFromStorage;
      }
    },
    cardCoverType() {
      let v = this.$store.state.vipCard.cardCoverType;
      this.form.cardCoverType = v;
      this.form.cardCover = v
        ? this.cardCoverFromStorage
        : this.cardCoverUserDefined;
      return v;
    },
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  created() {
    // 如果是时间卡， 有效期限隐藏永久有效选项
    if (this.cardType === 3) {
      this.validPermanentFlag = 2;
      this.form.validPermanent = false;
    }
    // if (this.cardType === 1) {
    //   this.form.cardRechargeMoneyUse = 2
    //   this.form.cardGiftMoneyUse = 2
    // }
    this.getCardNoticeList();
    /* 当处于编辑状态时，获取会员卡详情；当不处于时，也要注意是否有留存数据*/
    if (this.onEdit) {
      this.getCardDetail();
    } else {
      this.prepareData();
    }
    // 时间卡&次卡 暂时仅支持当前门店
    if (this.cardType > 1) {
      // 此处以后 [时间卡、次卡] 总部也有的时候需要重新处理!!
      this.form.upperStoreStrategy = 2;
      this.form.suitStoreStrategy = 2;
      this.form.suitStore = {
        storeIdList: [
          {
            storeId: this.currentInfo.shopId,
            storeName: this.$store.state.manage.currentInfo.shopName
          }
        ],
        type: 0
      };
      this.form.upperStore = {
        storeIdList: [
          {
            storeId: this.currentInfo.shopId,
            storeName: this.$store.state.manage.currentInfo.shopName
          }
        ],
        type: 0
      };
    } else {
      this.queryServiceClass();
      this.queryProductClass();
    }
  },
  methods: {
    // 检测重名
    async detection() {
      if (!this.form.cardName) return this.$message.error("请先输入卡项名称！");
      this.btnLoad = true;
      try {
        const res = await axios.post("/checkNameForGoods", {
          goodsType: 2,
          storeId: this.currentInfo.shopId,
          title: this.form.cardName
        });
        this.isRepetition = res.success;
        this.isDetection = true;
        this.btnLoad = false;
      } finally {
        this.btnLoad = false;
        // 优化校验。。在此校验单条form信息
        this.$refs.form.validateField("cardName");
      }
    },
    // 英文年月日转为中文
    dateTrans(date) {
      switch (date) {
        case "year":
          return "年";
        case "month":
          return "月";
        default:
          return "日";
      }
    },
    // 支持购买数据求和
    submitTotal(arr) {
      if (arr.length > 1) {
        return arr.reduce((x, y) => x + y);
      } else {
        return arr.join("") * 1;
      }
    },
    ...mapActions([
      "storeCardKindInfo",
      "setCardType",
      "setEditStatus",
      "setEditCardId",
      "setCardCoverUserDefined",
      "setCardCoverType",
      "setCardCoverFromStorage"
    ]),
    /* 获取会员卡须知列表 */
    getCardNoticeList() {
      axios
        .get(`/getMembershipCardNotes/${this.form.brandId}`)
        .then(res => {
          this.cardNoticeList = res.listCardNotes;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 获取卡项详情 */
    getCardDetail() {
      console.log(this.validPermanentFlag);
      axios
        .get(`/getCardKindDetailInfo/${this.editCardId}`)
        .then(res => {
          this.form = res;
          this.form.bindProductInfoList = res.bindProductInfoList || []; // 这是新增的字段
          // 非永久有效，正确显示开卡后和首次使用逻辑
          if (res.validNum > 0) {
            this.validPermanentFlag = 2;
            this.form.validPermanent = false;
          }
          if (res.validUsedNum > 0) {
            this.validPermanentFlag = 3;
            this.form.validPermanent = false;
          }
          console.log(this.validPermanentFlag);
          if (
            res.cardType === 2 &&
            res.totalCountLimit &&
            res.totalCountLimit !== -1
          ) {
            this.$set(this.form, "totalCountLimitStatus", true);
          }
          this.setCardCoverType(res.cardCoverType);

          // 身份卡、储值卡才有适用门店、上架门店列表
          if (this.cardType < 2) {
            /* 已选中的门店列表 */
            this.suitSelected =
              res.suitStore &&
              this.setDefualtSelectedStore(res.suitStore.storeIdList);
            this.upperSelected =
              res.upperStore &&
              this.setDefualtSelectedStore(res.upperStore.storeIdList);
            // 请求到数据后要放到已选门店set / obj中
            res.upperStore &&
              res.upperStore.storeIdList.map(i => {
                this.checkedUpperShopIds.add(i.storeId);
                this.checkedUpperShopObj[i.storeId] = {
                  storeId: i.storeId,
                  storeName: i.storeName,
                  province: i.province,
                  city: i.city,
                  type: i.type
                };
              });
            res.suitStoreres &&
              suitStore.storeIdList.map(i => {
                this.checkedSuitShopIds.add(i.storeId);
                this.checkedSuitShopObj[i.storeId] = {
                  storeId: i.storeId,
                  storeName: i.storeName,
                  province: i.province,
                  city: i.city,
                  type: i.type
                };
              });
          } else {
            // 时间卡、次卡
            this.form.listServiceCountInfo &&
              this.form.listServiceCountInfo.map(i => {
                this.checkedServiceIds.add(i.serviceSpecificationId);
                this.checkedServiceObj[i.serviceSpecificationId] = {
                  ...i,
                  infiniteTime: i.countLimit === null ? 0 : 1
                }; // 后端没有是否无限次的字段
                this.$set(i, "infiniteTime", i.countLimit === null ? 0 : 1);
              });
            // 次卡公用次数编辑判断
            this.hasGift = this.form.listServiceCountInfo.some(i => i.isGift);
          }
          let arr = this.canBuyType.map(i => i.value);
          arr.map(i => {
            if (this.form.cardRechargeMoneyUse & i) {
              this.cardUseforFirst.push(i);
            }
            if (this.form.cardGiftMoneyUse & i) {
              this.cardUsefor.push(i);
            }
          });
          this.cardUseforFirst = this.cardUseforFirst.filter(
            (item, index) => this.cardUseforFirst.indexOf(item) === index
          );
          this.cardUsefor = this.cardUsefor.filter(
            (item, index) => this.cardUsefor.indexOf(item) === index
          );
          if (!!res.cardCoverType) {
            this.setCardCoverFromStorage(res.cardCover);
          } else {
            this.setCardCoverUserDefined(res.cardCover);
          }
          // 重名检测在编辑的时候记录下原名称，改动检测，不改动放行！
        this.editTitle = this.form.cardName;
        })
        .catch(err => {
          console.log(err);
        });
    },
    setDefualtSelectedStore(oriList) {
      if (!(oriList instanceof Array) || oriList.length === 0) {
        return [];
      }
      return JSON.parse(JSON.stringify(oriList));
    },
    /* 如果 vuex中的 cardKindInfo 为null，则视为开始新增。否则则视为从选择卡项封面出退回的 */

    prepareData() {
      const form = JSON.parse(
        JSON.stringify(this.$store.state.vipCard.addNewVipCard.cardKindInfo)
      );
      if (form === null) {
        return;
      }
      let arr = this.canBuyType.map(i => i.value);
      arr.map(i => {
        if (this.form.cardRechargeMoneyUse & i) {
          this.cardUseforFirst.push(i);
        }
        if (this.form.cardGiftMoneyUse & i) {
          this.cardUsefor.push(i);
        }
      });

      /* 已选中的门店列表 */
      this.suitSelected =
        form.suitStore &&
        this.setDefualtSelectedStore(form.suitStore.storeIdList);
      this.upperSelected =
        form.upperStore &&
        this.setDefualtSelectedStore(form.upperStore.storeIdList);
    },
    /* 进入设置封面模块 */
    next() {
      // 储值卡首充用途校验
      if (this.cardType === 1) {
        if (this.form.cardRechargeMoneyUse < 1) {
          return this.$message.error("首次充值金额请至少选择一种用途！");
        }
      }
      // 时间卡、次卡校验权益
      if (this.cardType > 1) {
        if (!this.form.listServiceCountInfo.length) {
          this.$message({ type: "error", message: "需要选择至少一个服务" });
          return false;
        }
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.checkSelectList()) {
            return false;
          }
          // 在此处理时间卡的服务次数
          if (this.cardType == 3) {
            // 如果选了指定次数但没给数据， 则改为无限次
            this.form.listServiceCountInfo.forEach((item, index) => {
              if (item.countLimit) {
                if (!item.infiniteTime) {
                  item.countLimit = null;
                }
              } else {
                item.infiniteTime = 0;
                item.countLimit = null;
              }
            });
          }
          this.storeCardKindInfo(JSON.parse(JSON.stringify(this.form)));
          // this.$router.push(`/brand-inner/add-new-vip-card/select-card-cover`);
          this.$emit("vipCardStep", {
            data: "select-card-cover",
            firstUseFlag: this.firstUseFlag
          });
        } else {
          console.log("error");
          return false;
        }
      });
    },
    previous() {
      // this.$router.go(-1)
      this.$emit("vipCardStep", {
        data: "select-card"
      });
    },
    /* 唤起选择门店弹窗 */
    selectSuitStore() {
      this.selectSuitShopModelVisible = true;
    },
    selectUpperStore() {
      this.selectUpperShopModelVisible = true;
    },
    /* getSuitSelection(data) {
        let obj = (this.form[`suitStore`] = {});
        if (data.data.shops) {
          obj.type = 0;
          obj.storeIdList = data.data.shops;
          const arr = JSON.parse(JSON.stringify(obj.storeIdList))
          this.suitSelected = arr
        } else {
          obj.type = 1;
          obj.province = data.data.province;
          obj.city = data.data.city;
        }
      }, */
    // 旧的上架门店
    /* getUpperSelection(data) {
        let obj = (this.form[`upperStore`] = {});
        if (data.data.shops) {
          obj.type = 0;
          obj.storeIdList = data.data.shops;
          const arr = JSON.parse(JSON.stringify(obj.storeIdList))
          this.upperSelected = arr
        } else {
          obj.type = 1;
          obj.province = data.data.province;
          obj.city = data.data.city;
        }
      }, */
    // 新的指定上架门店
    setUpperShopsTable(obj) {
      obj.yes.map(i => {
        if (!this.checkedUpperShopIds.has(i.id)) {
          this.checkedUpperShopIds.add(i.id);
          this.checkedUpperShopObj[i.id] = {
            storeId: i.id,
            storeName: i.name,
            province: i.province,
            city: i.city,
            type: i.type
          };
        }
      });
      obj.no.map(i => {
        if (this.checkedUpperShopIds.has(i.id)) {
          this.checkedUpperShopIds.delete(i.id);
          delete this.checkedUpperShopObj[i.id];
        }
      });
      this.form.upperStore = this.form.upperStore || {};
      this.form.upperStore.storeIdList = Object.values(
        this.checkedUpperShopObj
      );
    },
    // 新的指定适用门店
    setSuitShopsTable(obj) {
      obj.yes.map(i => {
        if (!this.checkedSuitShopIds.has(i.id)) {
          this.checkedSuitShopIds.add(i.id);
          this.checkedSuitShopObj[i.id] = {
            storeId: i.id,
            storeName: i.name,
            province: i.province,
            city: i.city,
            type: i.type
          };
        }
      });
      obj.no.map(i => {
        if (this.checkedSuitShopIds.has(i.id)) {
          this.checkedSuitShopIds.delete(i.id);
          delete this.checkedSuitShopObj[i.id];
        }
      });
      this.form.suitStore = this.form.suitStore || {};
      this.form.suitStore.storeIdList = Object.values(this.checkedSuitShopObj);
    },
    // 新的删除已选的上架门店
    delSelectedUpperShops(idx) {
      // 先执行删除set/obj
      let id = this.form.upperStore.storeIdList[idx].storeId;
      this.checkedUpperShopIds.delete(id);
      delete this.checkedUpperShopObj[id];
      // 再执行删除表格
      this.form.upperStore.storeIdList.splice(idx, 1);
    },
    // 新的删除已选的上架门店
    delSelectedSuitShops(idx) {
      // 先执行删除set/obj
      let id = this.form.suitStore.storeIdList[idx].storeId;
      this.checkedSuitShopIds.delete(id);
      delete this.checkedSuitShopObj[id];
      // 再执行删除表格
      this.form.suitStore.storeIdList.splice(idx, 1);
    },
    // 旧的删除已选门店
    /* deleteShop(data) {
        let obj = this.form[`${data.type}Store`];
        obj.storeIdList = obj.storeIdList.filter(i => i.storeId !== data.id);
        this[`${data.type}Selected`] = JSON.parse(JSON.stringify(obj.storeIdList))
        this.$forceUpdate();
      }, */
    /* 选择有效期限单位 */
    handleTimeUnitSelect(command) {
      this.form.validUnit = command;
    },
    showSetNotice() {
      this.setNoticeModelVisible = true;
    },
    /* format 会员卡类别 */
    formatCardType(type) {
      switch (type) {
        case 0:
          return "身份卡";
        case 1:
          return "储值卡";
        case 2:
          return "次卡";
        case 3:
          return "时间卡";
      }
    },
    /* 离开编辑状态并清空相关状态 */
    cancelEdit() {
      this.$router.push(`/${this.currentEntry}-inner/goods/card-list`);
      this.setCardType(null);
      this.setEditStatus(false);
      this.setEditCardId(null);
      this.setCardCoverUserDefined(null);
    },
    /* 保存编辑修改, 操作成功后执行离开编辑状态*/
    saveEdit() {
      // 储值卡首充用途校验
      if (this.cardType === 1 && this.form.cardRechargeMoneyUse < 1) {
        this.$message.error("首次充值金额请至少选择一种用途！");
        return false;
      }
      // 时间卡、次卡校验权益
      if (this.cardType > 1) {
        if (!this.form.listServiceCountInfo.length) {
          this.$message({ type: "error", message: "需要选择至少一个服务" });
          return false;
        }
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.checkSelectList()) {
            return false;
          }
          let url;
          switch (this.cardType) {
            case 0:
              url = "/modifyIdentityCardKindInfo";
              break;
            case 1:
              url = "/modifyPrePaidCardKindInfo";
              break;
            case 2:
              url = "/modifyCountCardKindInfo";
              break;
            case 3:
              url = "/modifyTimeCardKindInfo";
              break;
          }
          // 次卡共用次数时，将次卡的各服务次数设置为空,否则置空共用次数（必须）!!!
          if (this.cardType === 2) {
            if (this.form.totalCountLimitStatus) {
              this.form.listServiceCountInfo.map(v => {
                v.countLimit = null;
              });
            } else {
              this.form.totalCountLimit = null;
            }
          }
          if (this.cardType == 3) {
            // 如果选了指定次数但没给数据， 则改为无限次
            this.form.listServiceCountInfo.forEach((item, index) => {
              if (item.countLimit) {
                if (!item.infiniteTime) {
                  item.countLimit = null;
                }
              } else {
                item.infiniteTime = 0;
                item.countLimit = null;
              }
            });
          }

          if (this.validPermanentFlag == 2) {
            this.form.validUsedNum = -1;
          }
          if (this.validPermanentFlag == 3) {
            this.form.validNum = -1;
          }
          console.log(this.form);
          axios
            .post(url, {
              ...this.form,
              cardCoverType: this.cardCoverType,
              cardCover: this.currentCardCover,
              storeId:
                this.currentEntry === "shop" ? this.currentInfo.shopId : null
            })
            .then(res => {
              if (res.success) {
                this.$message({ type: "success", message: res.message });
                this.cancelEdit();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message({ type: "error", message: "检测到有非法输入, 请修改" });
          return false;
        }
      });
    },
    closeNoticeSet() {
      this.setNoticeModelVisible = false;
      this.getCardNoticeList();
    },
    /* 指定服务 指定产品相关方法 */
    showClassSelect(type) {
      if (this.cardType > 1) return false;
      let data = this[`${type}List`];
      this.initClassData(data, type);
      this[`${type}SelectVisible`] = true;
    },
    /* 获取服务分类列表 */
    queryServiceClass() {
      axios
        .post("/getStoreSortInfoWithFilter", { brandId: this.form.brandId })
        .then(res => {
          this.serviceList = res.sortInfos || [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 获取产品分类 */
    queryProductClass() {
      axios
        .post("/getProductSortListByNameAndBrandId", {
          brandId: this.form.brandId
        })
        .then(res => {
          this.productList = res.sortInfos || [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 加工分类数据 */
    initClassData(list, type) {
      // 考虑分类List为 null 的情况
      let choosen =
        type == "service"
          ? this.form.partServiceDiscountStrategy
          : this.form.partProductDiscountStrategy;
      choosen = choosen == null ? [] : choosen;
      choosen = JSON.parse(JSON.stringify(choosen)).map(i => (i = i.typeTwoId));
      this.searchTree(list, this.initTreeNode.bind(this, choosen));
    },
    initTreeNode(choosen, current, prev) {
      current.checked = false;
      current.indeterminate = false;
      if (choosen.length > 0 && current.jimeiParentId !== 0) {
        if (choosen.indexOf(current.jimeiClassId) > -1) {
          current.checked = true;
          const result = this.checkStatus(prev.sortTwo);
          if (result === prev.sortTwo.length) {
            prev.checked = true;
            prev.indeterminate = false;
          } else if (result > 0) {
            prev.checked = false;
            prev.indeterminate = true;
          }
        }
      }
    },
    checkStatus(current) {
      const result = current.filter(i => !!i.checked);
      return result.length;
    },
    mergeClassData(data) {
      this[`${data.type}List`] = data.data;
      this.filterCheckedData(data.data, data.type);
    },
    searchTree(tree, f, prev = null) {
      for (let i of tree) {
        f.call(this, i, prev);
        const sub = i.sortTwo;
        if (sub instanceof Array && sub.length > 0) {
          this.searchTree(sub, f, i);
        }
      }
    },
    filterCheckedData(tree, type) {
      let list;
      if (type === "service") {
        this.form.partServiceDiscountStrategy =
          this.form.partServiceDiscountStrategy == null
            ? []
            : this.form.partServiceDiscountStrategy;
        list = this.form.partServiceDiscountStrategy;
      } else {
        this.form.partProductDiscountStrategy =
          this.form.partProductDiscountStrategy == null
            ? []
            : this.form.partProductDiscountStrategy;
        list = this.form.partProductDiscountStrategy;
      }
      list.length = 0;
      this.searchTree(tree, (current, prev) => {
        if (current.jimeiParentId !== 0 && current.checked) {
          const node = {
            discount: null,
            typeOneId: current.jimeiParentId,
            typeOneName: prev.sortName,
            typeTwoId: current.jimeiClassId,
            typeTwoName: current.sortName
          };
          list.push(node);
        }
      });
    },
    delSelectClass(data) {
      let list = this.form[`part${data.type}DiscountStrategy`];
      this.form[`part${data.type}DiscountStrategy`] = list.filter(
        i => i.typeTwoId !== data.id
      );
      this.$forceUpdate();
    },
    onDiscountChange(data) {
      const target = this.form[`part${data.type}DiscountStrategy`].find(
        i => i.typeTwoId === data.data.typeTwoId
      );
      if (!rgxp.floatReg.test(data.data.discount)) {
        this.$message({ type: "error", message: "折扣值须为合法的数字" });
        target.discount = null;
        this.$forceUpdate();
      } else if (parseFloat(data.data.discount) > 10) {
        this.$message({ type: "error", message: "服务和产品折扣不能大于10" });
        target.discount = null;
        this.$forceUpdate();
      }
    },
    onBatchChange(data) {
      const list = this.form[`part${data.type}DiscountStrategy`];
      list.map(i => (i.discount = data.data));
      this.$forceUpdate();
    },
    checkSelectList() {
      if (this.form.cardDiscountStrategy !== 2) {
        return true;
      }
      const service = this.form.partServiceDiscountStrategy || [];
      const product = this.form.partProductDiscountStrategy || [];
      const checkList = [];
      checkList.push(...service, ...product);
      for (let i of checkList) {
        if (i.discount == null || i.discount == "") {
          this.$message({
            type: "error",
            message: "请将服务及产品分类的折扣填写完整"
          });
          return false;
        }
      }
      return true;
    },
    // ================================================次卡时间卡 start ==============================================
    // 次卡时间卡服务选择
    showTimesCardService() {
      this.timesCardDialog = true;
      // 编辑时在此传入数据
    },
    // 门店次卡的权益服务列表
    setServiceTable(obj) {
      // this.setServiceObj = obj
      obj.yes.map(i => {
        if (!this.checkedServiceIds.has(i.specificationId)) {
          this.checkedServiceIds.add(i.specificationId);
          this.checkedServiceObj[i.specificationId] = {
            serviceId: i.serviceId, // 服务id & 名称
            serviceName: i.serviceName,
            serviceSpecificationId: i.specificationId, // 规格id & 名称
            serviceSpecificationName: i.specificationName,
            typeOneId: i.sortLevelOne, // 一级分类 id & 名称
            typeOneName: "",
            typeTwoId: i.sortLevelTwo, // 二级分类 id & 名称
            typeTwoName: "",
            countLimit: null, // 限制使用次数
            isGift: false, // 在此增加字段 防止删除服务项目时报错
            infiniteTime: 0,
            shopPrice: i.shopPrice
          };
        }
      });
      obj.no.map(i => {
        if (this.checkedServiceIds.has(i.specificationId)) {
          this.checkedServiceIds.delete(i.specificationId);
          delete this.checkedServiceObj[i.specificationId];
        }
      });
      this.form.listServiceCountInfo = Object.values(this.checkedServiceObj);
    },
    // 删除已选权益服务
    delSelectedService(idx) {
      let id = this.form.listServiceCountInfo[idx].serviceSpecificationId;
      this.checkedServiceIds.delete(id);
      delete this.checkedServiceObj[id];
      // 再执行删除表格
      this.form.listServiceCountInfo.splice(idx, 1);
      // 次卡公用次数编辑判断
      this.hasGift = this.form.listServiceCountInfo.some(i => i.isGift);
    },
    // 绑定产品-产品选择模态框
    showBindProduct() {
      this.bindProductVIsible = true;
    },
    // 绑定产品
    delSelectedBindProduct(idx) {
      let id = this.form.bindProductInfoList[idx].productSpecificationId;
      this.selectedBindProductIds.delete(id);
      delete this.selectedBindProductObj[id];
      // 再执行删除表格
      this.form.bindProductInfoList.splice(idx, 1);
    },
    // 绑定产品
    getBindProductDataFromSuber(obj) {
      obj.yes.map(i => {
        if (!this.selectedBindProductIds.has(i.specificationId)) {
          this.selectedBindProductIds.add(i.specificationId);
          this.selectedBindProductObj[i.specificationId] = {
            count: null,
            productId: i.goodsId,
            productName: i.goodsName,
            productSpecificationId: i.specificationId,
            productSpecificationName: i.specificationName,
            shopPrice: i.shopPrice
            // ...i,
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedBindProductIds.has(i.specificationId)) {
          this.selectedBindProductIds.delete(i.specificationId);
          delete this.selectedBindProductObj[i.specificationId];
        }
      });
      this.form.bindProductInfoList = Object.values(
        this.selectedBindProductObj
      );
    },
    // ================================================次卡时间卡 end ==============================================
    //-------- 校验 --------
    // 次卡、时间卡绑定产品的商品件数
    validateBindProductCount(rule, value, callback) {
      if (Number(value) > 0) {
        callback();
      } else {
        callback("请输入一个大于0的数字!");
      }
    },
    validatefirstNum(rule, value, callback) {
      if (this.form.cardFirstRechargeNum === "") {
        return callback(new Error("首充金额不能为空"));
      } else if (!rgxp.naturalNumber.test(this.form.cardFirstRechargeNum)) {
        return callback(new Error("请输入自然数"));
      } else if (
        this.form.cardRechargeMoneyUse == null ||
        this.form.cardRechargeMoneyUse === -1
      ) {
        this.$message({ type: "error", message: "请选择首充金用途" });
        return callback(new Error("请选择首充金用途"));
      } else {
        callback();
      }
    },
    validateGiftNum(rule, value, callback) {
      if (this.form.cardGiftNum == "" || this.form.cardGiftNum == 0) {
        callback();
      } else if (!rgxp.naturalNumber.test(this.form.cardGiftNum)) {
        return callback(new Error("请输入自然数"));
      } else if (
        this.form.cardGiftNum &&
        (this.form.cardGiftMoneyUse == null ||
          this.form.cardGiftMoneyUse === -1)
      ) {
        return callback(new Error("请选择赠送金用途"));
      } else {
        callback();
      }
    },
    validateCardName(rule, value, callback) {
      if (this.editTitle && this.editTitle === value) {
        callback();
      }
      if (!value) {
        return callback(new Error("会员卡名称不能为空"));
      }
      if (!this.isDetection) {
        return callback("请先完成名称检测！");
      }
      if (!this.isRepetition) {
        return callback(" ");
      }
      if (value.length > 16) {
        return callback(new Error("会员卡名称不能大于16位"));
      } else {
        callback();
      }
    },
    validateCardPrice(rule, value, callback) {
      if (value === "") {
        return callback(new Error("会员卡售价不能为空"));
      } else if (!rgxp.naturalNumber.test(value)) {
        return callback(new Error("请输入自然数"));
      } else {
        callback();
      }
    },
    validateDiscount(rule, value, callback) {
      if (this.form.cardDiscountStrategy == "0") {
        callback();
      } else if (this.form.cardDiscountStrategy == "1") {
        if (
          this.form.cardServiceDiscount == "" ||
          this.form.cardProductDiscount == ""
        ) {
          return callback(new Error("请输入服务和产品的折扣"));
        } else if (
          !rgxp.floatReg.test(this.form.cardServiceDiscount) ||
          !rgxp.floatReg.test(this.form.cardProductDiscount)
        ) {
          return callback(new Error("服务和产品折扣须为合法数字"));
        } else if (
          parseFloat(this.form.cardServiceDiscount) > 10 ||
          parseFloat(this.form.cardProductDiscount) > 10
        ) {
          return callback(new Error("服务和产品折扣不能大于10"));
        } else {
          callback();
        }
      } else if (this.form.cardDiscountStrategy == "2") {
        if (
          this.form.partServiceDiscountStrategy.length == 0 &&
          this.form.partProductDiscountStrategy.length == 0
        ) {
          return callback(new Error("请至少选择一项产品或服务"));
        } else {
          callback();
        }
      }
    },
    validateLimitTime(rule, value, callback) {
      if (this.validPermanentFlag === 1 && this.cardType < 3) {
        // 不能是时间卡，且永久有效
        callback();
      } else {
        if (
          !(/^[1-9]\d{0,2}$/.test(this.form.validNum)) &&
          !(/^[1-9]\d{0,2}$/.test(this.form.validUsedNum))
        ) {
          return callback(new Error("请输入有效的时长: 1~999"));
        } else {
          callback();
        }
      }
    },
    validateServicePerformance(rule, value, callback) {
      if (!(/^(\d{1,8}(\.\d{0,2})?)$/.test(value))) {
        return callback("不小于0，且不大于8位数字");
      } else {
        callback();
      }
    },
    validateUpperStore(rule, value, callback) {
      if (this.form.upperStoreStrategy !== 2) {
        callback();
      } else {
        if (
          this.form.upperStore === null ||
          this.form.upperStore.storeIdList.length === 0
        ) {
          return callback(new Error("请指定门店"));
        } else {
          callback();
        }
      }
    },
    validateSuitStore(rule, value, callback) {
      if (this.form.suitStoreStrategy !== 2) {
        callback();
      } else {
        if (
          this.form.suitStore === null ||
          this.form.suitStore.storeIdList.length === 0
        ) {
          return callback(new Error("请指定门店"));
        } else {
          callback();
        }
      }
    },
    validateAmount(rule, value, callback) {
      if (value == null || value.length === 0) {
        callback();
      }
      if (!rgxp.intReg.test(value)) {
        return callback(new Error("请输入合法的非负数"));
      }
      callback();
    },
    validateUpperTime(rule, value, callback) {
      if (!this.form.upperImmediately && this.form.upperTime == null) {
        return callback(new Error("请指定具体上架时间"));
      } else if (!this.form.upperImmediately) {
        const now = new Date().getTime();
        let d = this.form.upperTime.replace(/-/g, "/");
        d = new Date(d).getTime();
        if (d < now) {
          return callback(new Error("上架时间不能早于当前日期"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 次卡相关 start
    validateTotalCountLimit(rule, value, callback) {
      // 仅次卡
      if (this.cardType === 2 && this.form.totalCountLimitStatus) {
        if (reg.time.test(this.form.totalCountLimit)) {
          callback();
        } else {
          return callback(new Error("请输入1~9999的数字"));
        }
      } else {
        callback();
      }
    },
    handleTotalCountChanged(val) {
      if (!val) {
        this.$refs.form.validateField("totalCountLimit");
      } else {
        this.form.listServiceCountInfo.map((v, i) => {
          this.$refs.form.validateField(
            "listServiceCountInfo." + i + ".countLimit"
          );
        });
      }
    },
    checkListServiceCountInfo() {},
    validateCountLimit(rule, value, callback) {
      if (this.cardType === 2 && !this.form.totalCountLimitStatus) {
        if (reg.time.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入1~9999的数字"));
        }
      } else if (this.cardType === 3) {
        if (rule.required) {
          if (reg.time.test(value)) {
            callback();
          } else {
            return callback(new Error("请输入1~9999的数字"));
          }
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 次卡相关 end
    // 判断是否赠送
    judgeGift(idx) {
      // this.$refs.refName.$el.click();
      this.hasGift = this.form.listServiceCountInfo.some(i => i.isGift);
      this.form.totalCountLimitStatus = false;
      this.handleTotalCountChanged(false);
    },
    // 重名检测存在的条件 // 主要适应品牌创建商品模板和编辑商品时不一样的需求
    detectionCondition() {
      if (this.editTitle) {
        if (this.editTitle != this.form.cardName) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  watch: {
    // 监听卡项是否永久有效的
    validPermanentFlag(val) {
      this.form.validPermanent = val === 1 ? true : false;
    },
    // 监听赠送金增加服务数据改变
    cardUsefor(val, old) {
      // 去除多的改变值
      if (val.length > old.length) {
        // 新增勾选
        let [data] = val.filter(item => old.indexOf(item) === -1);
        if (data && this.cardUseforFirst.indexOf(data) === -1) {
          this.cardUseforFirst.push(data);
        }
      }
      this.form.cardGiftMoneyUse = this.submitTotal(this.cardUsefor);
      this.form.cardRechargeMoneyUse = this.submitTotal(this.cardUseforFirst);
    },
    // 监听储值金减少服务数据改变
    cardUseforFirst(val, old) {
      // 去除多的改变值
      if (val.length < old.length) {
        // 取消勾选
        let [data] = old.filter(item => val.indexOf(item) === -1);
        let index = this.cardUsefor.findIndex(item => item === data);
        data = this.cardUsefor[index];
        // console.log(data)
        index = this.cardUsefor.findIndex(item => item === data);
        if (this.cardUsefor.indexOf(data) !== -1) {
          this.cardUsefor.splice(index, 1);
        }
      }
      this.form.cardGiftMoneyUse = this.submitTotal(this.cardUsefor);
      this.form.cardRechargeMoneyUse = this.submitTotal(this.cardUseforFirst);
    },
    // 修改名称后，需要重新检测重名
    'form.cardName'(val, old) {
      if (val != old) {
        this.isDetection = false
      this.isRepetition = false
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/* 目的是为了取消dialog body 的padding */
.edit-card-info {
  /deep/ .el-dialog__body {
    padding: 0;
  }
}

.form-root {
  margin-top: 20px;
}

.xing {
  &::before {
    content: "* ";
    color: #ff6d61;
  }
}

.form-line {
  display: flex;
  line-height: 40px;
  min-height: 60px;

  .form-title {
    width: 140px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
    color: #666666;
    font-size: 14px;
  }

  .form-con {
    flex: auto;
    font-size: 14px;
    color: #333333;

    .button {
      width: 74px;
      margin-right: 56px;
      height: 30 xp;
      box-sizing: border-box;
      padding: 0;
      line-height: 28px;
      border: 1px solid #58c9f3;
      color: #58c9f3;
      border-radius: 5px;
    }

    img.card-cover {
      width: 230px;
      height: 145.06px;
      border-radius: 6px;
    }

    i {
      color: #58c9f3;
      cursor: pointer;
    }
  }

  .form-con.sale-num {
    display: flex;
  }

  .form-con.price {
    /deep/ .el-input-group__append {
      box-sizing: border-box;
      width: 40px;
      color: white;
      padding: 0;
      text-align: center;
      background: #d5dadf;
    }
  }

  .form-con.discount {
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
          color: white;
          padding: 0;
          text-align: center;
          background: #d5dadf;
        }
      }

      .button {
        width: 74px;
        margin-right: 56px;
        height: 30 xp;
        box-sizing: border-box;
        line-height: 28px;
        border: 1px solid #58c9f3;
        color: #58c9f3;
        border-radius: 5px;
      }
    }

    /deep/ .el-radio:nth-child(1) {
      height: 40px;
    }
  }

  .form-con.notice {
    display: flex;
    align-items: flex-start;

    .button_set {
      margin-left: 6px;
      color: #58c9f3;
      font-size: 14px;
      line-height: 42px;
    }
  }

  .form-con.open-card-give {
    .button {
      margin: 0 10px 0 0;
    }
  }

  .form-con.on-sale-time {
    display: flex;

    .date-time {
      margin-left: 20px;
      width: 200px;
      height: 40px;
      animation: appear 10s 1 linear;
    }
  }

  /* 后期新增 届时再改 */
  i.arrow-down {
    display: inline-block;
    transform: rotate(270deg);
    font-size: 13px;
  }

  .right-drowndown-btn {
    padding-right: 9px;
    padding-left: 9px;
    margin: 0 0 0 -4px;
    background: #d5dadf;
    color: #ffffff;
    border-radius: 0 4px 4px 0;
  }

  .item-number-input {
    width: 70px;
    /deep/ .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }
}
.selected-shops {
  width: 550px;
  margin-top: 12px;
}
// 次卡&时间卡
.service-choosed-box {
  width: 760px;
  margin-bottom: 12px;
}
.time-card-limit-line {
  display: flex;
  height: 60px;
}
.common-count {
  display: flex;
  .left-box-under-table {
    flex: 1;
    display: flex;
    height: 60px;
    flex-direction: column;
    .top-line {
      font-size: 14px;
      color: #333;
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
    }
    .bottom-line {
      font-size: 12px;
      color: #999;
      height: 18px;
      line-height: 18px;
      margin-bottom: 10px;
      text-indent: 18px;
    }
  }
  .right-box-under-table {
    width: 214px;
  }
}
.count-input {
  margin-top: 20px;
  width: 120px;
  .el-input__inner {
    transform: translateY(20px);
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
