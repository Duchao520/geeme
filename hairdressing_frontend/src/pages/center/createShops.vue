<template lang="pug">
  .create-page(
    v-loading="confirmLoading"
  )
    operate-dialog(
      :showDialog="showDialog",
      :title="'恭喜，门店创建成功！'",
      :name="''",
      :firstBtn="'创建门店'",
      :secondBtn="'返回'",
      @close="todo"
    )
    g-del-model(
      :delTagDialogVisible="openVisible"
      @close="openVisible=false"
      @confirm="openNewBuy"
      :title="infoData.title"
      :content="infoData.content"
      :icon="infoData.icon"
      :confirmButton="infoData.btn"
      :iconColor="infoData.color"
    )
    g-del-model(
      :delTagDialogVisible="confirmDialogVisible",
      title="确认修改营业时间?"
      content="可预约时间将同步修改，由此可能造成部分预约单异常，请前往“预约列表-异常预约单”查看。"
      icon="icon_popup_plaint",
      iconColor="#FCB322",
      confirmButton="确定修改"
      @confirm="sendEditInfo()",
      @close="confirmDialogVisible=false"
    )
    center-header(
      :title="operateEnter.clickEnter === 'edit' ? '编辑门店' : '创建门店'",
      :backing="'返回'"
      :isSelfSite="true"
    )
    el-dialog(
      :visible.sync="dialogVisible"
    )
      img(
        width="100%",
        :src="dialogImageUrl"
      )
    .body-center
      .body-container.media.scrollbar
        .form_area
          el-form(
            :model="myForm",
            :rules="rules",
            ref="myForm",
            label-width="1.53rem"
          )
            <el-row :gutter="12">
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                <el-form-item label="品牌名称" prop="brandId" name='brandId'>
                  <el-select :popper-append-to-body="false" :disabled="operateEnter.clickEnter === 'edit'" v-model="myForm.brandId" placeholder="请选择品牌" style="width:206.5px">
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            el-form-item.shop-name_input(
              label="门店名称",
              prop="shopName"
            )
              el-row
                el-col(
                  :span="12"
                )
                  el-input.input_shop(
                    v-model="myForm.shopName",
                    placeholder="请输入门店名称"
                    :maxlength="30"
                  )
                  g-tip(
                    :list="list",
                    :position="'right'"
                  )
            <el-row :gutter="12"  v-if="isMarket">
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                <el-form-item label="店铺分类" prop="businessCategorySet" name='businessCategorySet'>
                  <el-select :popper-append-to-body="false" v-model="myForm.businessCategorySet" multiple placeholder="请选择分类" style="width:300px">
                    <el-option v-for="item in shopClassList" :key="item.id" :label="item.showName ? item.showName : item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            el-form-item.shop-name_input(
              label="门店性质",
              prop="type"
            )
              el-row
                el-col(
                  :span="12"
                )
                  el-radio-group(
                    v-model="myForm.type"
                  )
                    el-radio(
                      v-for="(item,index) in [{label:'DIRECT',name:'直营'},{label:'JOIN',name:'加盟'}]",
                      :label="item.label",
                      :key="index"
                    ) {{item.name}}
            el-form-item.shop-name_input(
              label="进销存版",
              prop="revenueType"
            )
              el-row
                el-col(
                  :span="18"
                )
                  el-radio-group(
                    v-model="myForm.revenueType"
                    :disabled="operateEnter.clickEnter === 'edit'"
                  )
                    el-radio(
                      v-for="(item,index) in [{label:'NORMAL',name:'否'},{label:'SUPPLIER',name:'是(网店默认隐藏)'}]",
                      :label="item.label",
                      :key="index"
                    ) {{item.name}}
            el-form-item.shop-name_input(
              label="门店形象",
              prop="image"
            )
              g-upload-spic(
                @change="uploadPic",
                :photo="myForm.image",
                :width="'160px'",
                :height="'80px'",
                :size="5"
              )
            el-form-item.shop-name_input(
              label="客服电话",
              prop="phone"
            )
              el-row
                el-col(
                  :span="12"
                )
                  .tip-parent-box
                    el-input(
                      v-model="myForm.phone",
                      placeholder="请输入客服咨询电话",
                      :min="0"
                    )
                    g-tip(
                      :position="'top'"
                    )
                el-col(
                  :offset="1",
                  :span="6"
                )
                  el-radio(
                    :label="myForm.brandPhone"
                    v-model="myForm.phone"
                  ) 与品牌客服电话一致
            //- 新组件 - 
            el-form-item(
              label="行政区域"
              required
              prop="address"
            )
              el-cascader(
                placeholder="请选择省市区"
                :options="options"
                :props='prop'
                v-model="myForm.address"
                :disabled="isdisabled"
              )
            el-form-item(
              label="门店详细地址"
              required
              prop="addressDetail"
            )
              el-row
                el-col.address-line(:span="14")
                  el-input(
                    placeholder="请输入含省市区(可简称)的详细地址"
                    v-model="myForm.addressDetail"
                    maxlength="42"
                  )
                  el-checkbox(
                    v-model="manual"
                    label="手动地图定位"
                  )
                  .tip-parent-box
                    i(
                      class="icon iconfont icon-icon_popup_question"
                    )
                    g-tip(
                      :list="addressReminder"
                      :position="'top'"
                      :transform="'none-transform'"
                    )
              .map-cover(
                v-show="!manual"
              )
              #map_container(
                style="width:500px;height:300px;margin-top:4px;"
              )
            <el-row :gutter="12" v-if="isMarket">
              <el-col :xs="10" :sm="10" :md="10" :lg="10":xl="10">
                <el-form-item label="门牌号"prop="mallLocation"name='businessCategorySet' style="width: 800px;">
                  <el-select :popper-append-to-body="false"v-model="floorOneId" placeholder="请选择分区"style="width:150px;margin-right:10px;" v-if="mallVisi">
                    <el-option v-for="item in mallPartitionList":key="item.id" :label="item.name":value="item.id"></el-option>
                  </el-select>
                  <el-select :popper-append-to-body="false"v-model="floorTwoId" placeholder="请选择楼层"style="width:150px;margin-right:10px;">
                    <el-option v-for="item in mallFloorInformationList":key="item.id" :label="item.name":value="item.id"></el-option>
                  </el-select>
                  <el-input style="display: inline-block;width: 150px;" v-model="storeNum" placeholder="请输入门牌号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            el-form-item(
              label="营业时间",
              required
            )
              el-popover(
                placement="bottom-start"
                trigger="click"
                v-model="visible"
              )
                .weekday_popover(
                  style="{maxWidth:400px, margin:20px}"
                )
                  el-checkbox-group(
                    v-model="myForm.businessDays",
                    size="large",
                    v-if='weekToChina'
                  )
                    el-checkbox( 
                      v-for="(value, key) in weekToData",
                      :key="value",
                      :label="value",
                      border
                    ) {{ value | weekDay}}
                  el-button(
                    type="primary",
                    @click="chooseWeekday"
                  ) 确定
                el-input(
                  style="width:460px",
                  v-model="businessDaysString",
                  readonly="readonly",
                  placeholder="请选择营业时间",
                  slot="reference"
                )
            el-form-item
              el-time-select(
                placeholder="起始时间",
                v-model="myForm.businessStartTime",
                :picker-options="{start: '00:00',step: '00:30',end: '23:30'}"
              )
              span &nbsp;—&nbsp;
              el-time-select(
                placeholder="结束时间",
                v-model="myForm.businessEndTime",
                :picker-options="{start: '00:00',step: '00:30',end: '23:30',minTime: myForm.businessStartTime}"
              )
            el-form-item(
              label="门店简介"
            )
              el-input(
                style="max-width:820px",
                v-model="myForm.introduction",
                type="textarea",
                :rows="4",
                :maxlength="500",
                placeholder="请输入门店简介（不超过500字）"
              )
            el-form-item(
              label="门店相册"
            )
              //g-upload-mpic(
                //:tip="'支持jpg,png格式，大小不超过1M，最多上传5张'",
                //:photo-list="myForm.photoList",
                //:size="1",
                //:limit="5",
                //:hasPhoto="isneed",
                //@change="getPhotoList"
              //)
              el-upload(
                :action="uploadUrl"
                :headers="myHeaders"
                list-type="picture-card"
                multiple
                :on-preview="handlePictureCardPreview",
                :on-exceed="lunboExceed"
                :on-success="handleLunBoSuccess"
                :before-upload="beforeLunBoUpload"
                :on-remove="handleLunBoRemove"
                :limit="8"
                :file-list="shopAlbum"
                :class='{hideUpload:myForm.photoList.length>=8}'
              )
                i(class="el-icon-plus")
            el-form-item(
              label="是否上线",
              prop="stateVal"
            )
              el-radio-group(
                v-model="myForm.stateVal"
              )
                el-radio(
                  v-for ="(item,index) in showStatus",
                  :key="index",
                  :label="item.value"
                ) {{item.name}}
              p.Perror(
                v-if='isShowInfo && myForm.stateVal == "ONLINE" && !sample'
              ) {{this.limitNum > 0 ? `当前可用新开券 ${limitNum} 张，确定开通后将消耗 1 张新开券且操作不可撤销！` : '可用新开券不够，立即购买！'}}
            el-form-item(
              label="首页推荐",
            )
              el-checkbox(
                v-model="myForm.onlineRecommendation"
                :disabled="firstRecomFlag"
              ) 推荐(进销存版默认不推荐)
            el-form-item(
              label="",
              required
            )
              el-row

                el-button(
                  style="margin: 0 20px 0 0;"
                  size="medium",
                  class='normal_blue_btn'
                  @click="operate({mark:'confirm'})"
                ) 确认提交
                //- g-btn(
                //-   :name="'取消'",
                //-   :size="'large'",
                //-   :type="'black'",
                //-   @click.native="operate({mark:'cacel'})"
                //- )
                el-button.normal_light_gray_btn(
                  style='width: 100px;'
                  @click.native="operate({mark:'cacel'})"
                ) 取消
          
</template>
<script>
import CenterHeader from "@/components/common/CenterHeader";
import GaoMap from "@/components/loginCommon/GaoMap.vue";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { reg } from "@/assets/js/RegExp";
import { mapActions, mapState } from "vuex";
import { switchCase } from "babel-types";

import Axios from "axios"; // 高德用
import AMap from "AMap";
var map, marker;
export default {
  data() {
    let phoneValidator = (rule, value, callback) => {
      if (reg.tel.test(value)) {
        callback();
      } else {
        callback(new Error("请按悬浮窗提示格式输入正确的号码"));
      }
    };
    let mallLocationValidator = (rule, value, callback) => {
      if (this.floorOneId && this.floorTwoId && this.storeNum) {
        callback();
      } else {
        callback(new Error("请输入完整的楼层信息"));
      }
    };
    // let addressDetailVaildator = (rule,value,callBack) => {
    //   console.log(this.myForm.addressDetail)
    //   if(value == '') {
    //     console.log(1111)
    //     callback(new Error("请输入详细地址"));
    //   } else {
    //     callback();
    //   }
    // }
    return {
      firstLoad: true, // 第一次加载页面， 主要是编辑页面，地图定位问题
      manual: false, // 是否手动修改坐标值, 为ture则断开地图抓取数据返回到详细地址.
      firstRecomFlag: false, // 首页推荐进销存版标识
      myForm: {
        businessCategorySet: [], // 经营类别
        mallLocation: "", // 楼层信息参数
        brandId: null, // 品牌id
        shopName: "", // 门店名称
        image: "", // 门店形象
        phone: "", // 客服电话
        brandPhone: "", // 从后台获取的品牌电话
        address: [],
        latitude: null, // 纬度
        longitude: null, // 经度
        addressDetail: "", // 详细地址
        mapAddressDetail: "", // 地图的详细地址，包括省份、城市、地区、街道等
        city: "", // 城市名
        area: "", // 地区名
        province: "", // 省份名
        businessDays: [], // 营业时间周几
        businessStartTime: "", // 营业时间的起始时间
        businessEndTime: "", // 营业时间的起始时间
        introduction: "", // 门店简介
        photoList: [], // 门店相册列表
        version: "", // 版本
        year: null, // 购买年份
        stateVal: "", // 上线值
        type: "DIRECT",
        onlineRecommendation: true,
        // _LBSByAMap: '', // 高德地图复制来的经纬度
        revenueType: "NORMAL" // 门店营收类型
      },
      options: [],
      isdisabled: false,
      prop: {
        label: "name",
        value: "name",
        children: "districts"
      },
      businessDaysString: "", // 营业时间字符串列表
      visible: false, // 营业时间下拉框是否显示
      showDialog: false, // 是否显示弹窗
      weekToChina: {
        MONDAY: "周一",
        TUESDAY: "周二",
        WEDNESDAY: "周三",
        THURSDAY: "周四",
        FRIDAY: "周五",
        SATURDAY: "周六",
        SUNDAY: "周日"
      },
      weekToData: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
      ],
      list: [
        {
          // 提示
          name: "无须输入品牌名称"
        },
        {
          name: "无须输入城市名称"
        },
        {
          name: "规范格式：×××店，最好不超过30个汉字"
        }
      ],
      versionList: [
        {
          id: 1,
          name: "标准版"
        },
        {
          id: 2,
          name: "专业版"
        },
        {
          id: 3,
          name: "旗舰版"
        }
      ], // 版本列表
      rules: {
        shopName: [
          { required: true, message: "请输入门店名称", trigger: "blur" },
          { required: true, message: "请输入门店名称", trigger: "change" }
        ],
        image: [
          { required: true, message: "请上传门店形象照", trigger: "blur" },
          { required: true, message: "请上传门店形象照", trigger: "change" }
        ],
        version: [{ required: true, message: "请选择版本", trigger: "blur" }],
        intro: [{ required: true, message: "请填写品牌简介", trigger: "blur" }],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        businessCategorySet: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        address: [
          { required: true, message: "请选择门店地址", trigger: "blur" }
        ], // new
        addressDetail: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ], // new
        type: [{ required: true, message: "", trigger: "change" }],
        revenueType: [{ required: true, message: "", trigger: "change" }],
        phone: [
          { required: true, validator: phoneValidator, trigger: "change" },
          { required: true, validator: phoneValidator, trigger: "blur" }
        ],
        mallLocation: [
          {
            required: true,
            validator: mallLocationValidator,
            trigger: "change"
          },
          { required: true, validator: mallLocationValidator, trigger: "blur" }
        ],
        stateVal: [
          { required: true, message: "请选择上下线", trigger: "change" }
        ]
      },
      confirmDialogVisible: false,
      oriBusinessDays: [],
      oriBusinessStartTime: "",
      oriBusinessEndTime: "",
      defaultLat: "",
      defaultLng: "",
      shopAlbum: [],
      confirmLoading: false,
      shopState: "",
      openVisible: false,
      infoData: {
        title: "暂时不能开通！",
        content: "没有可用的新购券，请前往购买！",
        icon: "icon_popup_plaint",
        btn: "立即购买",
        color: "#FCB322",
        type: "error"
      },
      parentDetails: {}, //传给子组件地址信息
      isSure: true, //详细地址是否正确
      isShowInfo: false,
      limitNum: 0,
      sample: false,
      dialogVisible: false,
      dialogImageUrl: "",
      hasLBS: false, // 用于判断经纬度是否能准确获取到, 如无则不允许提交
      addressReminder: [
        { name: "部分地区如广东东莞、海南文昌市可能需要手动调节定位点" },
        { name: "勾选手动定位后：" },
        { name: "1: 详细地址不再跟随地图位置变化" },
        { name: "2: 地图拾取的坐标用于门店真实位置的定位(蓝色标记)" },
        { name: "3: 请确保行政区域地址和详细地址同属于一个省市区" }
      ],
      // 门店分类列表
      shopClassList: [],
      // 楼层级联信息
      mallPartitionList: [], // 一级
      mallFloorInformationList: [], // 二级
      floorOneId: null,
      floorTwoId: '',
      storeNum: null, // 门牌号
      isMarket: false,
      editFloorId: null,
      mallVisi : true, // 楼层输入框显示标识
    };
  },
  filters: {
    weekDay(val) {
      return val == "MONDAY"
        ? "周一"
        : val == "TUESDAY"
        ? "周二"
        : val == "WEDNESDAY"
        ? "周三"
        : val == "THURSDAY"
        ? "周四"
        : val == "FRIDAY"
        ? "周五"
        : val == "SATURDAY"
        ? "周六"
        : val == "SUNDAY"
        ? "周日"
        : "";
    }
  },
  computed: {
    inCreate() {
      return this.$route.path.search("create") >= 0;
    },
    operateEnter() {
      return this.$store.state.manage.operate;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    brandList() {
      return this.$store.state.manage.userInfo.brandList;
    },
    isneed() {
      return this.$route.path.search("create") >= 0;
    },
    ifTimeUnchanged() {
      let arr = this.oriBusinessDays.filter(
        i => this.myForm.businessDays.indexOf(i) < 0
      );
      let flag =
        arr.length == 0 &&
        this.oriBusinessDays.length == this.myForm.businessDays.length;
      return (
        flag &&
        this.oriBusinessStartTime == this.myForm.businessStartTime &&
        this.oriBusinessEndTime == this.myForm.businessEndTime
      );
    },
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    showStatus() {
      let Data = this.operateEnter.clickEnter === "add" ? "" : this.shopState;
      console.log(Data);
      let arr = [];
      switch (Data) {
        case "ONLINE":
          arr = [
            { name: "上线", value: Data },
            { name: "下线", value: "OFFLINE" }
          ];
          break;
        case "OFFLINE":
          arr = [
            { name: "上线", value: "ONLINE" },
            { name: "下线", value: Data }
          ];
          break;
        case "INSTORE":
          arr = [
            { name: "上线", value: "ONLINE" },
            { name: "保存入库", value: Data }
          ];
          break;
        case "TRYING":
          arr = [
            { name: "上线", value: Data },
            { name: "下线", value: "OFFLINE" }
          ];
          break;
        case "TRY_OVER_DUE":
          arr = [
            { name: "上线", value: "ONLINE" },
            { name: "下线", value: Data }
          ];
          break;
        case "TRY_OFF_LINE":
          arr = [
            { name: "上线", value: "ONLINE" },
            { name: "下线", value: Data }
          ];
          break;
        case "OVER_DUE":
          arr = [
            { name: "上线", value: "ONLINE" },
            { name: "下线", value: Data }
          ];
        default:
          arr = [
            { name: "上线", value: "ONLINE" },
            { name: "保存入库", value: "INSTORE" }
          ];
          break;
      }
      return arr;
    }
  },
  created() {
    // 如果页面来自软件订购的新购门店创建，则brandId为携带过来的brandId
    this.myForm.brandId = this.$route.query.brandId
      ? this.$route.query.brandId
      : this.currentInfo.brandId;
    this.getCityData();
    axios.get(api.getMyBrands.URL).then(res => {
      this.getMyBrandsRes(res);
    });
  },
  mounted() {
    this.amapView();
    if (this.myForm.brandId) {
      this.getStoreSortList();
    }
    if (this.operateEnter.clickEnter === "edit") {
      axios.get(api.getShopInfoById.URL + this.currentInfo.shopId).then(res => {
        this.getShopInfoByIdRes(res);
      });
    } else {
      this.firstLoad = false; // 新建门店时的详细地址定位问题
    }
    this.getCreateAbleStoreNum();
    axios
      .get(api.getCustomerServicePhone.URL + this.currentInfo.brandId)
      .then(res => {
        this.getCustomerServicePhoneRes(res);
      });
  },
  methods: {
    ...mapActions(["saveCurrentInfo", "saveUserBrand"]),
    // 获取经营分类信息
    async getStoreSortList() {
      const res = await axios.get("/getAllStoreBusinessCategory");
      if (res.code !== 1200) return this.$message.error(res.message);
      this.shopClassList = res.data;
    },
    // 获取商场的楼层分布信息
    async getFloorInfo() {
      const res = await axios.get(
        `/getMallBrandFloorHierarchyList/${this.myForm.brandId}`
      );
      this.mallPartitionList = res.mallPartitionList;
      // 当只有一个楼分区时， 则用户不用选择
      if (this.mallPartitionList.length === 1) {
        this.mallVisi = false
        this.floorOneId = this.mallPartitionList[0].id
        this.mallFloorInformationList = this.mallPartitionList[0].mallFloorInformationList
      } else {
        this.mallVisi = true
      }
      if (this.operateEnter.clickEnter === "edit") {
      this.mallPartitionList.forEach(item => {
          if (item.id === this.floorOneId) {
            this.mallFloorInformationList = item.mallFloorInformationList;
          }
        });
        this.floorTwoId = this.editFloorId
      }
    },
    getMyBrandsRes(res) {
      this.saveUserBrand(res.myBrandList);
    },
    getShopInfoByIdRes(res) {
      let myForm = res;
      this.myForm.address = myForm.address;
      this.myForm.province = myForm.province;
      this.myForm.area = myForm.area;
      this.myForm.city = myForm.city;
      this.myForm.businessDays = myForm.businessDays;
      this.oriBusinessDays = JSON.parse(JSON.stringify(myForm.businessDays));
      this.oriBusinessEndTime = this.myForm.businessEndTime =
        myForm.businessEndTime;
      this.oriBusinessStartTime = this.myForm.businessStartTime =
        myForm.businessStartTime;
      this.myForm.phone = myForm.customerServicePhone;
      this.myForm.image = myForm.image;
      this.myForm.introduction = myForm.introduction;
      this.myForm.shopName = myForm.name;
      // this.myForm._LBSByAMap = `${res.longitude},${res.latitude}`;
      // this.myForm.occupyDuration = "免费试用"; // 占用时长未做，传固定值
      this.myForm.photoList = myForm.shopAlbum;
      this.shopAlbum = this.formatPhotoList(this.myForm.photoList);
      this.myForm.stateVal = myForm.status;
      this.isShowInfo = myForm.status == "INSTORE" ? true : false; // 编辑保存入库状态的提示
      this.shopState = myForm.status;
      this.myForm.type = myForm.type;
      this.myForm.revenueType = myForm.revenueType;
      this.myForm.addressDetail = myForm.addressDetail;
      this.myForm.businessCategorySet = myForm.businessCategorySet
      this.floorOneId = myForm.mallFloorInfo ? myForm.mallFloorInfo.partitionId : ''
      // 此处先对楼层id做记录
      this.floorTwoId = myForm.mallFloorInfo ? myForm.mallFloorInfo.floorId : ''
      this.editFloorId = myForm.mallFloorInfo ? myForm.mallFloorInfo.floorId : ''
      this.storeNum = myForm.mallFloorInfo ? myForm.mallFloorInfo.doorNum : ''
      this.parentDetails = {
        address: [this.myForm.province, this.myForm.city, this.myForm.area],
        addressDetail: this.myForm.addressDetail
      };
      // 编辑时第一次进入页面的地图定位由后端经纬度数据实现
      this.addMarker(
        this.myForm.longitude * 1,
        this.myForm.latitude * 1,
        this.myForm.addressDetail
      );
      this.firstLoad = false;
    },
    getCustomerServicePhoneRes(data) {
      this.myForm.brandPhone = data.customerServicePhone;
    },
    todo(data) {
      // console.log(data);
    },
    uploadPic(data) {
      this.myForm.image = data;
      this.$refs.myForm.validateField("image");
    },
    // 初始化地图
    amapView() {
      map = new AMap.Map("map_container", {
        zoom: 11,
        resizeEnable: true
      });
      if (this.needPos) {
        // 调用定位
        this.getCurrentPos(map);
      }
      AMap.plugin(["AMap.ToolBar", "AMap.Scale"], function() {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
      });
      if (!this.isdisabled) {
        this.showInfoClick();
      }
    },
    getCurrentPos(map) {
      let _this = this;
      // 获取当前定位信息
      map.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: false, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          _this.toGeolocation(data);
        });
        //返回定位信息
        AMap.event.addListener(geolocation, "error", err => {
          console.log(err);
        });
        //返回定位出错信息
      });
    },
    // 点击地图获取当前经纬度 - 此操作需要在用户确认坐标定位错误时修改坐标阻止门店详细地址变更
    showInfoClick() {
      let that = this;
      AMap.event.addListener(map, "click", function(e) {
        that.getAddress(e.lnglat.getLng(), e.lnglat.getLat());
      });
    },
    // 根据经纬度获取当前地址信息 - 此操作需要在用户确认坐标定位错误时修改坐标阻止门店详细地址变更
    getAddress(lng, lat) {
      let that = this;
      Axios.get(
        "//restapi.amap.com/v3/geocode/regeo?key=f211857599047852b425815b7d4a29e7&location=" +
          lng +
          "," +
          lat +
          "&radius=1000&extensions=all&batch=false&roadlevel=0"
      )
        .then(function(res) {
          if (res.data.status == 1) {
            if (!that.manual) {
              that.myForm.addressDetail = res.data.regeocode.formatted_address;
            } else {
              that.addMarker(lng, lat, res.data.regeocode.formatted_address);
            }
            that.myForm.latitude = lat + "";
            that.myForm.longitude = lng + "";
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 根据用户输入的地址获取当前的经纬度信息 - 此操作不需要阻止地图焦点获取
    getLngAndLat(address) {
      let that = this;
      //  5b638921d27c314409a6f6a47dc22838
      Axios.get(
        `//restapi.amap.com/v3/geocode/geo?key=5b638921d27c314409a6f6a47dc22838&s=rsv3&city=35&address=${address}`
      )
        .then(function(res) {
          if (res.data.status == 1 && res.data.geocodes.length) {
            let geocodes = res.data.geocodes[0];
            let location = geocodes.location.split(",");
            that.myForm.longitude = location[0];
            that.myForm.latitude = location[1];
            map.setCenter([location[0] * 1, location[1] * 1]); //设置地图中心点
            that.addMarker(location[0], location[1], that.myForm.addressDetail);
            that.hasLBS = true; // 获取到经纬度
          } else {
            that.hasLBS = false; // 获取到经纬度, 不能提交请求
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 点击后在该地点添加点标记及其label标签
    addMarker(lng, lat, detail) {
      //如果存在上一个marker，则先删除，之后再添加新的marker
      if (marker) {
        map.remove(marker);
      }
      marker = new AMap.Marker({
        icon: new AMap.Icon({
          size: new AMap.Size(20, 25), // 图标尺寸
          image:
            "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png", // Icon的图像
          imageSize: new AMap.Size(20, 25) // 根据所设置的大小拉伸或压缩图片
        }),
        position: [lng, lat]
        // offset: new AMap.Pixel(-13,-30)
      });
      marker.setMap(map);
      marker.setLabel({
        //修改label相对于maker的位置
        offset: new AMap.Pixel(-60, -22),
        content: "<div class='info'>" + detail + "</div>"
      });
    },
    // 获取地图组件传值 - 弃用?
    getMapValue(mapInfo) {
      this.myForm.province = mapInfo.province;
      this.myForm.city = mapInfo.city;
      this.myForm.area = mapInfo.area;
      this.myForm.latitude = mapInfo.lat;
      this.myForm.longitude = mapInfo.lng;
      this.myForm.address = [mapInfo.province, mapInfo.city, mapInfo.area];
      this.myForm.addressDetail = mapInfo.addressDetail;
      this.isSure = mapInfo.isSure;
    },
    // 选择营业时间
    chooseWeekday() {
      this.visible = false;
    },
    // 获取门店相册列表
    getPhotoList(data) {
      this.myForm.photoList = data;
    },
    // 检测用户信息
    checkBandInfo(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        // 如果填了客服电话，要检测客服电话是否合格
        if (arr[i] === "phone" && !utils.checkSerPhone(this.myForm[arr[i]])) {
          this.message = "客服电话有误，请重填";
          return false;
        } else if (arr[i] === "businessDays" && !this.myForm[arr[i]].length) {
          this.message = "营业时间有误，请检查";
          return false;
        } else if (
          arr[i] === "businessStartTime" &&
          !this.myForm[arr[i]].length
        ) {
          this.message = "营业时间有误，请检查";
          return false;
        } else if (
          arr[i] === "businessEndTime" &&
          !this.myForm[arr[i]].length
        ) {
          this.message = "营业时间有误，请检查";
          return false;
        }
      }
      return true;
    },
    // 准备回传参数
    prepareParams() {
      let myForm = this.myForm;
      return {
        address: myForm.address,
        addressDetail: myForm.addressDetail,
        province: myForm.address[0],
        city: myForm.address[1],
        area: myForm.address[2],
        brandId: myForm.brandId,
        // brandId: this.currentInfo.brandId,
        id:
          this.operateEnter.clickEnter === "edit"
            ? this.currentInfo.shopId
            : null,
        businessDays: myForm.businessDays,
        businessEndTime: myForm.businessEndTime,
        businessStartTime: myForm.businessStartTime,
        customerServicePhone: myForm.phone,
        image: myForm.image,
        introduction: myForm.introduction,
        name: myForm.shopName,
        shopAlbum: myForm.photoList,
        status: myForm.stateVal,
        type: myForm.type,
        latitude: myForm.latitude,
        longitude: myForm.longitude,
        onlineRecommendation: myForm.onlineRecommendation,
        revenueType: myForm.revenueType,
        businessCategorySet: myForm.businessCategorySet,
      };
    },
    // 提交
    submit() {
      if (
        this.operateEnter.clickEnter == "add" &&
        this.myForm.stateVal == "ONLINE"
      ) {
        if (!this.sample && this.limitNum <= 0) {
          this.openVisible = true;
          return false;
        }
      } else if (this.operateEnter.clickEnter == "edit") {
        if (
          this.myForm.stateVal == "ONLINE" &&
          this.isShowInfo &&
          !this.sample
        ) {
          if (this.limitNum <= 0) {
            this.openVisible = true;
            return false;
          }
        }
      }

      this.$refs.myForm.validate(valid => {
        if (valid && this.hasLBS) {
          // 手动检测客服电话和营业时间
          if (
            this.checkBandInfo([
              "phone",
              "businessDays",
              "businessEndTime",
              "businessStartTime"
            ])
          ) {
            if (
              this.operateEnter.clickEnter === "edit" &&
              !this.ifTimeUnchanged
            ) {
              /* this.$confirm('营业时间如有修改，预约设置中的可预约时间将同步修改，由此造成的部分未完成预约异常请注意查看系统消息提醒并及时处理, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 提交用户信息
                axios.post(api.createShop.URL, params).then(res => { this.createShop(res) })
              }) */

              this.confirmDialogVisible = true;
            } else {
              let params = this.prepareParams();
              if (this.isMarket) {
                params.mallLocation =  this.floorTwoId + ":" + this.storeNum
              }
              if (this.isSure) {
                this.confirmLoading = true;
                axios
                  .post(api.createShop.URL, params)
                  .then(res => {
                    this.createShop(res);
                  })
                  .catch(err => {
                    this.confirmLoading = false;
                  });
              }
            }
          } else {
            // 提示
            utils.showTip(this, { msg: this.message, type: "error" });
          }
        } else {
          console.log("error submit!!");
          utils.showTip(this, {
            msg: this.hasLBS
              ? "请核查信息是否输入完整"
              : "未能根据详细地址查到经纬度，请确认详细地址包含省市级行政区域内容",
            type: "error"
          });
          return false;
        }
      });
    },
    sendEditInfo() {
      let params = this.prepareParams();
      if (this.isSure) {
        axios.post(api.createShop.URL, params).then(res => {
          this.createShop(res);
        });
      }
    },
    // 处理创建门店信息
    createShop(res) {
      if (res.success) {
        // 是否提交，提交就跳转
        this.$router.push("/center/shops");
        // 提示
        utils.showTip(this, {
          msg: res.message ? res.message : "操作成功",
          type: "success"
        });
      } else {
        // 提示
        this.confirmLoading = false;
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    },
    operate(data) {
      if (data.mark === "confirm") {
        this.submit();
      } else {
        this.$router.go(-1);
      }
    },
    input(num) {
      console.log(num);
      var len = num.match(/[-]/g) ? num.match(/[-]/g).length + 10 : 11;
      this.myForm.phone = num.slice(0, len);
    },
    /* 周日期排序依据 */
    weekSort(first, second) {
      const week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      if (week.indexOf(first) < week.indexOf(second)) {
        return -1;
      } else if (week.indexOf(first) < week.indexOf(second)) {
        return 1;
      } else {
        return 0;
      }
    },
    /* 超出8张的提示  可能不会被用到*/
    lunboExceed(files, fileList) {
      if (files.length + fileList.length > 5) {
        this.$message.error("最多上传8张");
      }
    },
    getCreateAbleStoreNum() {
      axios
        .post("/getCreateAbleStoreNum", {
          brandId: this.currentInfo.brandId,
          type: "BUY_NEW"
        })
        .then(res => {
          if (res) {
            this.limitNum = res.num ? res.num : 0;
            this.sample = res.sample;
          }
        });
    },
    handleLunBoSuccess(res, file, fileList) {
      let images = [];
      fileList.forEach((item, index) => {
        let fileKey = item.response
          ? item.response.fileKey
          : item.url.split("/").pop();
        images.push(fileKey);
      });
      this.myForm.photoList = images;
    },
    toggleUpload() {},
    /* 上传前检查 */
    beforeLunBoUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5M!");
      }
      return isJPG && isLt2M;
    },
    /* 删除相册 */
    handleLunBoRemove(file) {
      let fileKey;
      if (file.response) {
        fileKey = file.response.fileKey;
      } else {
        let arr = file.url.split("/");
        fileKey = arr[arr.length - 1];
      }
      this.myForm.photoList = this.myForm.photoList.filter(i => i !== fileKey);
    },
    formatPhotoList(photoList) {
      let arr = [];
      photoList.forEach(item => {
        arr.push({
          name: `${Math.random()}`,
          url: utils.formatPicImg(item)
        });
      });
      return arr;
    },
    openNewBuy() {
      // this.$router.push('/shop-inner/newBuy') // 这里需要软件购买的时候绑定currentInfo.brandId
      this.$router.push("/center/buySoftware");
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 新的区域级联变更
    changeCityData(address) {},
    //从高德地图拉取城市数据
    // - 2019-9-19  webApi key: 0ee95e63e7ef04ac814f5653981273ba  账号：13588732250   /// f211857599047852b425815b7d4a29e7
    getCityData() {
      Axios.get(
        `//restapi.amap.com/v3/config/district?key=f211857599047852b425815b7d4a29e7&keywords=&subdistrict=3&extensions=base`
      ).then(res => {
        if (res.data.status == "1") {
          this.options = res.data.districts[0].districts;
          this.forEachCityData(this.options);
        }
      });
    },
    //遍历城市数据
    forEachCityData(data) {
      data.forEach(res => {
        if (res.districts.length == 0) {
          res.districts = null;
        } else {
          this.forEachCityData(res.districts);
        }
      });
    }
  },
  components: {
    "center-header": CenterHeader,
    "v-map": GaoMap
  },
  watch: {
    // 当选择进销存版时，门店不能首页推荐
    "myForm.revenueType"(val) {
      if (val === "SUPPLIER") {
        // 进销存版不能首页推荐
        this.myForm.onlineRecommendation = false;
        // 禁用推荐复选框
        this.firstRecomFlag = true;
      } else {
        this.firstRecomFlag = false;
        this.myForm.onlineRecommendation = true;
      }
    },
    // 监听品牌Id的改变
    async "myForm.brandId"(val) {
      // 根据Id 获取对应的品牌信息
      const res = await axios.post("/getBrandInfo", {
        brandId: val
      });
      this.isMarket = res.industry === 18;
      if(res.industry === 18) {
        this.getFloorInfo()
      }
    },
    "myForm.businessDays"(val) {
      let days = [];
      for (let i = 0, len = val.length; i < len; i++) {
        days.push(this.weekToChina[val[i]]);
      }
      days.sort(this.weekSort);
      this.businessDaysString = days.join("、");
    },
    "myForm.addressDetail"(val, old) {
      if (val != old) {
        if (!this.firstLoad) {
          this.getLngAndLat(val);
        }
      }
    },
    // 楼层区、楼下拉框联动
    floorOneId(val) {
      if (val) {
        this.mallPartitionList.forEach(item => {
          if (item.id === val) {
            this.mallFloorInformationList = item.mallFloorInformationList;
          }
        });
      } else {
        this.mallFloorInformationList = [];
      }
        this.floorTwoId = null
    }
  }
};
</script>
<style lang="scss" scoped>
.shop-name_input {
  width: 572px;
}
.Perror {
  color: #f52d56;
  position: relative;
  line-height: 0;
  top: 10px;
}
#app .tip-parent-box {
  display: inline-block;
  position: relative;
  &:hover .g-tip {
    display: block;
    z-index: 100;
    background: #fff;
    transform: translate(150%, -10%);
  }
  &:hover .none-transform {
    transform: translate(116%, -10%);
  }
}
.icon-icon_popup_question {
  margin-left: 4px;
  cursor: help;
  color: #ff6d61;
}
.amap-pages {
  text-indent: 12px;
  display: inline-block;
  color: red;
  cursor: pointer;
}

// -地图修复
/deep/ .address-line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  .el-input {
    margin-right: 24px;
  }
}
.map-cover {
  position: absolute;
  width: 500px;
  height: 306px;
  background: rgba(64, 64, 64, 0.5);
  z-index: 200; // 地图控件为150
}
</style>
<style lang="scss">
.hideUpload .el-upload--picture-card {
  display: none;
}
</style>
