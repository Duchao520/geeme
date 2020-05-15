<template>
  <div class="mchpar">
    <v-toast ref="toast" :tip="tips"></v-toast>
    <div v-transfer-dom class="search">
      <popup v-model="searchBank" position="left" width="100%">
        <group label-width="2rem" gutter="0">
          <x-header @on-click-back="searchBank = false" :left-options="{preventGoBack: true}" style="position: fixed;top: 0;width: 100%;z-index: 5">选择支行</x-header>
          <div style="height: .8rem"></div>
          <search auto-scroll-to-top position="fixed" top=".8rem" @on-submit="getBankList" @on-blur="getBankList" v-model="bankName" auto-fixed></search>
          <div class="scroll" ref="scroll">
            <div class="scroll-container">
              <radio :options="BANK_BRANCH" v-model="bankBranch"></radio>
            </div>
          </div>
        </group>
      </popup>
    </div>
    <div style="padding-bottom: 1.5rem">
      <div style="height: .1rem"></div>
      <group title="信息验证" label-width="2rem">
        <x-input title="手机号码" required v-model="formData.mobilePhone" placeholder="请输入手机号码" type="tel" keyboard="number" is-type="china-mobile"></x-input>
        <x-input title="验证码" required v-model="formData.smsSecurityCode" placeholder="请输入验证码" keyboard="number" type="number">
          <x-button slot="right" type="primary" plain mini @click.native="sendMsCode">{{time == 60 ? '获取验证码' : time + 's'}}</x-button>
        </x-input>
      </group>

      <group title="商户信息" label-width="2.5rem">
        <x-input text-align="right" required title="营业执照注册号" v-model="formData.businessLicenseNumber" placeholder="请输入营业执照注册号" type="text"></x-input>
        <x-input text-align="right" required title="商户名称" v-model="formData.shopName" placeholder="请输入商户名称" type="text"></x-input>
        <x-input text-align="right" required title="商户简称" v-model="formData.shopShortName" placeholder="请输入商户简称" type="text"></x-input>
        <x-input  title="联系人" required v-model="formData.contact" placeholder="请输入联系人姓名" type="text" is-type="china-name" text-align="right"></x-input>
        <x-input title="联系邮箱" required v-model="formData.contactEmail" placeholder="请输入联系人邮箱"  is-type="email" type="email" text-align="right"></x-input>
        <popup-picker required placeholder="请选择组织类型" title="组织类型" :data="ORGANIZATION_TYPE" :show-name="true" v-model="organizationType"></popup-picker>
        <popup-picker required placeholder="请选择营业执照类型" title="营业执照类型" :data="BUSINESS_TYPE" show-name v-model="businessLicenceType" ></popup-picker>
        <popup-picker required placeholder="请选择经营场景" title="经营场景" :data="SCENE_TYPE" show-name v-model="businessScene" ></popup-picker>
        <popup-picker required placeholder="请选择经营类目" title="经营类目" :data="MERCHANT_TYPE" show-name :columns="3" v-model="mccCode" @on-change="MerchantType"></popup-picker>
        <x-input title="注册地址" required v-model="formData.companyAddress" placeholder="请输入注册地址" type="text" text-align="right"></x-input>
        <x-input title="法人" required v-model="formData.legalPerson" placeholder="请输入企业法人" type="text" text-align="right"></x-input>
        <x-switch title="营业期限" inline-desc="若营业期限为永久请选中" @on-change="idCardValidTimeLong" v-model="dateFlag"></x-switch>
        <div class="flex_box box_padding justify_space_between" style="padding: .25rem;border-top: .01rem solid #e0e0e0">
          <p>营业期限</p>
          <div class="flex_box">
            <div style="width: 1.7rem;border-bottom: .02rem solid #e0e0e0;">
              <datetime title="开始日期" :max-year=2050 clear-text="today" required style="padding: 0;width: 1.7rem;height: .5rem" v-model="startDate">
                <x-button class="fz-22" style="padding: 0">{{startDate}}</x-button>
              </datetime>
            </div>
            -
            <div style="width: 1.7rem;border-bottom: .02rem solid #e0e0e0;" v-if="!dateFlag">
              <datetime title="结束日期" :max-year=2050 clear-text="today" style="padding: 0;width: 1.7rem;height: .5rem" v-model="endDate">
                <x-button class="fz-22" style="padding: 0">{{endDate}}</x-button>
              </datetime>
            </div>
            <div class="fz-32" v-else>
              长期
            </div>
          </div>
        </div>
      </group>

      <group title="组织机构代码证" label-width="2rem">
        <x-input text-align="right" required title="组织机构代码" v-model="formData.organizationNumber" placeholder="请输入组织机构代码" type="text"></x-input>
        <x-switch title="组织机构代码有效期" inline-desc="若有效期为永久请选中" @on-change="organizationTimeLong" v-model="ordateFlag"></x-switch>
        <div class="flex_box box_padding justify_space_between" style="padding: .25rem;border-top: .01rem solid #e0e0e0;border-bottom: .01rem solid #e0e0e0">
          <p>组织机构代码有效期</p>
          <div class="flex_box">
            <div style="width: 1.7rem;border-bottom: .02rem solid #e0e0e0;">
              <datetime title="开始日期" :max-year=2050 clear-text="today" required style="padding: 0;width: 1.7rem;height: .5rem" v-model="orstartDate">
                <x-button class="fz-22" style="padding: 0">{{orstartDate}}</x-button>
              </datetime>
            </div>
            -
            <div style="width: 1.7rem;border-bottom: .02rem solid #e0e0e0;" v-if="!ordateFlag">
              <datetime title="结束日期" :max-year=2050 clear-text="today" style="padding: 0;width: 1.7rem;height: .5rem" v-model="orendDate">
                <x-button class="fz-22" style="padding: 0">{{orendDate}}</x-button>
              </datetime>
            </div>
            <div class="fz-32" v-else>
              长期
            </div>
          </div>
        </div>

      </group>

      <group title="结算信息" label-width="2rem">
        <popup-picker title="开户行" required :data="BANKLIST" v-model="accountBank" placeholder="请选择开户行"></popup-picker>
        <x-input type="text" required title="开户账户" v-model="formData.accountNumber" placeholder="请输入开户账户" text-align="right" ></x-input>
        <x-input type="text" required title="开户人" v-model="formData.accountName" placeholder="开户人姓名必须与身份证一致" text-align="right" is-type="china-name"></x-input>
        <!--<x-input type="text" required title="身份证号" v-model="formData.idCardNumber" placeholder="请输入身份证号" text-align="right"></x-input>-->
        <!--<x-input type="text" required title="身份证姓名" v-model="formData.idCardName" name="mobile" placeholder="请输入身份证姓名" text-align="right" is-type="china-name"></x-input>-->

        <x-address title="开户地区" :list="addressData" required  placeholder="请选择开户地区" @on-shadow-change="getBankAddress"></x-address>
        <cell title="开户支行" required is-link @click.native="showSearchBank" :value="formData.bankName"></cell>
      </group>

      <group title="基础信息照片" label-width="2rem">
        <div class="box_padding flex_box justify_space_between" style="padding: .32rem">
          <div style="width: 3.26rem;height: 2.16rem;position: relative;border-radius: .1rem;overflow: hidden">
            <img :src="businessLicenseCopy ? businessLicenseCopy : require('@/assets/imgs/mchpar/geti.jpg')" alt="" style="position: absolute;display: block;width: 3.26rem;height: 2.16rem;z-index: 1">
            <input type="file" required style="display: block;position: absolute;width: 3.26rem;height: 2.16rem;opacity: 0;z-index: 3" id="businessLicenseCopy" @change="IMG_UPLOAD">
            <div class="box_padding" style="padding-top: .16rem;position: absolute;width: 3.26rem;height: 2.16rem;z-index: 2;background: rgba(12,12,12,.1);">
              <p class="text-center" style="color: #dbdbdb;font-size: .64rem;margin-bottom: .24rem">camera</p>
              <p class="text-center fc-ffffff fz-28">营业执照</p>
            </div>
          </div>
          <div style="width: 3.26rem;height: 2.16rem;position: relative;border-radius: .1rem;overflow: hidden">
            <img :src="organizationCopy ? organizationCopy : require('@/assets/imgs/mchpar/organizationCopy.jpg')" alt="" style="position: absolute;display: block;width: 3.26rem;height: 2.16rem;z-index: 1">
            <input type="file" required style="display: block;position: absolute;width: 3.26rem;height: 2.16rem;opacity: 0;z-index: 3" id="organizationCopy" @change="IMG_UPLOAD">
            <div class="box_padding" style="padding-top: .16rem;position: absolute;width: 3.26rem;height: 2.16rem;z-index: 2;background: rgba(12,12,12,.3);">
              <p class="text-center" style="color: #dbdbdb;font-size: .64rem;margin-bottom: .24rem">camera</p>
              <p class="text-center fc-ffffff fz-28">组织机构代码证</p>
            </div>
          </div>
        </div>
      </group>
      <group title="特殊资质(非必传)" label-width="2rem">
        <div class="box_padding flex_box justify_space_between" style="padding: .32rem;flex-wrap: wrap">
          <div style="width: 3.26rem;height: 2.16rem;margin-bottom:.4rem;position: relative;border-radius: .1rem;overflow: hidden" v-for="(item,index) in qualificationImgs" @click="delQualiImg(index)">
            <img :src="item ? item : require('@/assets/imgs/mchpar/mentou.jpg')" alt="" style="position: absolute;display: block;width: 3.26rem;height: 2.16rem;z-index: 1">
            <div class="box_padding" style="padding-top: .16rem;position: absolute;width: 3.26rem;height: 2.16rem;z-index: 2;background: rgba(12,12,12,.5);">
              <p class="text-center" style="color: #dbdbdb;font-size: .4rem;line-height: 2.16rem;margin-bottom: .24rem">点击删除</p>
            </div>
          </div>
          <div style="width: 3.26rem;height: 2.16rem;margin-bottom:.4rem;position: relative;border-radius: .1rem;overflow: hidden">
            <input type="file" required style="display: block;position: absolute;width: 3.26rem;height: 2.16rem;opacity: 0;z-index: 3" @change="qualificationUploads">
            <div class="box_padding" style="position: absolute;width: 3.26rem;height: 2.16rem;z-index: 2;background: rgba(12,12,12,.5);">
              <p class="text-center" style="color: #FFFFFF;font-size: 1.2rem;">+</p>
              <p class="text-center fc-ffffff fz-28">新增图片</p>
            </div>
          </div>
        </div>
      </group>
      <group title="补充材料图,最多可上传5张照片(非必传)" label-width="2rem">
        <div class="box_padding flex_box justify_space_between" style="padding: .32rem;flex-wrap: wrap">
          <div style="width: 3.26rem;height: 2.16rem;margin-bottom:.4rem;position: relative;border-radius: .1rem;overflow: hidden" v-for="(item,index) in otherImgs" @click="delImg(index)">
            <img :src="item ? item : require('@/assets/imgs/mchpar/mentou.jpg')" alt="" style="position: absolute;display: block;width: 3.26rem;height: 2.16rem;z-index: 1">
            <div class="box_padding" style="padding-top: .16rem;position: absolute;width: 3.26rem;height: 2.16rem;z-index: 2;background: rgba(12,12,12,.5);">
              <p class="text-center" style="color: #dbdbdb;font-size: .4rem;line-height: 2.16rem;margin-bottom: .24rem">点击删除</p>
            </div>
          </div>
          <div style="width: 3.26rem;height: 2.16rem;margin-bottom:.4rem;position: relative;border-radius: .1rem;overflow: hidden">
            <input type="file" required style="display: block;position: absolute;width: 3.26rem;height: 2.16rem;opacity: 0;z-index: 3" @change="anotherUploads">
            <div class="box_padding" style="position: absolute;width: 3.26rem;height: 2.16rem;z-index: 2;background: rgba(12,12,12,.5);">
              <p class="text-center" style="color: #FFFFFF;font-size: 1.2rem;">+</p>
              <p class="text-center fc-ffffff fz-28">新增图片</p>
            </div>
          </div>
        </div>
      </group>
      <x-button type="primary" style="width: 6.8rem;margin-top: .6rem;margin-bottom: .6rem" @click.native="submit">提交信息</x-button>
      <p class="fz-28 fc-8D8E98 text-center">Copyright © 助商通 2015-2019</p>
    </div>
  </div>

</template>

<script>
  import { XInput,Group,XButton , Selector ,PopupPicker,Datetime ,
    XAddress , ChinaAddressV4Data , Cell ,Search , Radio , XHeader , XSwitch ,
    TransferDom, Popup , PopupRadio} from 'vux';
  import BScroll from 'better-scroll';
  import {dataURLtoBlob} from "@/assets/js/deal";
  import axios from 'axios';
  import {getBankList , sendMsCode , mchparSave , getAliType} from "@/assets/js/comm";
  export default {
    name: "mchpar",
    directives: {
      TransferDom
    },
    components: {
      XInput,Group,XButton , Selector , PopupPicker,Datetime , XAddress,Cell,Search , Radio ,
      XHeader , XSwitch , Popup , PopupRadio
    },
    data(){
      return{
        timer: null,
        time: 60,
        bankName: '',
        ORGANIZATION_TYPE: [[{name: '企业',value: '2'}, {name: '党政、机关及事业单位',value: '3'}, {name: '个体工商户',value: '4'}, {name: '其他组织',value: '1708'}]],
        BUSINESS_TYPE: [[{name: '已三证合一',value: '1762'},{name: '未三证合一',value: '1763'}]],
        SCENE_TYPE: [[{name: '线下',value: '1721'},{name: '公众号',value: '1837'},{name: '小程序',value: '1838'},{name: 'APP',value: '1724'},{name: 'PC网站',value: '1840'}]],
        BANKLIST: [['工商银行','中国银行','建设银行','农业银行','招商银行','光大银行','兴业银行',"北京银行","宁波银行",
          '平安银行','广发银行','中信银行','交通银行','民生银行','华夏银行','邮政储蓄银行','浦发银行','其他银行']],
        MERCHANT_TYPE: [],
        mccCode: [],
        addressData: ChinaAddressV4Data,
        showAddress: false,
        BANK_BRANCH: new Array(),
        organizationType: [],
        businessLicenceType: new Array(),
        businessScene: new Array(),
        accountBank: new Array(),
        searchBank: false,
        startDate: '',
        endDate: '',
        orstartDate: '',
        orendDate: '',
        dateFlag: false,
        ordateFlag: false,
        bankBranch: '',
        tips: '',
        otherImgs: [],
        otherImgsId: [],
        qualificationImgs: [],
        qualificationImgsId: [],
        formData: {
          mobilePhone: '',
          smsSecurityCode: '',
          businessLicenseNumber: '',
          shopName: '',
          shopShortName: '',
          contact: '',
          contactEmail: '',
          organizationType: '',
          businessLicenceType: '',
          companyAddress: '',
          legalPerson: '',
          businessTime: '',
          organizationNumber: '',
          organizationTime: '',
          accountBank: '',
          accountNumber: '',
          accountName: '',
          mccCode: '',
          // idCardNumber: '',
          // idCardName: '',
          bankName: '',
          bankAddressCode: '',
          businessLicenseCopy: '',
          businessLicenseCopyMediaId: '',
          organizationCopy: '',
          organizationCopyMediaId: '',
          businessAdditionDesc: '1',
          qualifications: '',
          qualificationsMediaId: '',
          businessAdditionPics: '',
          businessAdditionPicsMediaId: ''
        },
        /*formData: {
          mobilePhone: '13934410514',
          smsSecurityCode: '472667',
          businessLicenseNumber: '1558417031',
          shopName: '杭州市西湖区鸿思图文工作室',
          shopShortName: '鸿思图文',
          contact: '陈罗军',
          contactEmail: '13934410514@163.com',
          organizationType: '',
          businessLicenceType: '',
          companyAddress: '杭州市西湖区紫霞路176号互联网园2号楼101',
          legalPerson: '陈罗军',
          businessTime: '',
          organizationNumber: '',
          organizationTime: '',
          accountBank: '',
          accountNumber: '6217003860016269696',
          accountName: '杜超',
          // idCardNumber: '',
          // idCardName: '',
          bankName: '',
          bankAddressCode: '',
          businessLicenseCopy: '',
          businessLicenseCopyMediaId: '',
          organizationCopy: '',
          organizationCopyMediaId: '',
          businessAdditionDesc: '1',
          qualifications: '',
          qualificationsMediaId: '',
          businessAdditionPics: '',
          businessAdditionPicsMediaId: ''
        },*/
        businessLicenseCopy: '',
        organizationCopy: '',
        pageNum: 1
      }
    },
    beforeCreate(){
      /*this.$nextTick(() => {
        var provinceList = citys.provinceList;
        var CITYS = [];
        provinceList.forEach(province => {
          province.value = province.code;
          province.parent = 0;
          CITYS.push(province);
          province.city.forEach(city => {
            city.value = city.code;
            city.parent = city.citycode;
            CITYS.push(city);
            city.district.forEach(district => {
              district.value = district.code;
              district.parent = district.areacode;
              CITYS.push(district)
            })
          })
        });
        CITYS.forEach(ele => {
          delete ele.city;
          delete ele.district;
        });
        this.CITYS = CITYS;
      });*/
    },

    mounted() {
      var _self = this;
      window.document.title = '企业进件';
      this.getAliType();
      this.$nextTick(() => {
        this.initScroll();
      })
    },
    watch: {
      startDate() {
        if(this.dateFlag){
          this.formData.businessTime = this.startDate + ',' + '长期';
        }else{
          this.formData.businessTime = this.startDate + ',' + this.endDate;
        }
      },
      endDate() {
        this.formData.businessTime = this.startDate + ',' + this.endDate;
      },
      orstartDate() {
        if(this.dateFlag){
          this.formData.businessTime = this.orstartDate + ',' + '长期';
        }else{
          this.formData.businessTime = this.orstartDate + ',' + this.orendDate;
        }
      },
      orendDate() {
        this.formData.businessTime = this.orstartDate + ',' + this.orendDate;
      },
      BANK_BRANCH: {
        handler() {
          this.$nextTick(() => {
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          })
        },
        deep: true
      },
      bankBranch(){
        this.formData.bankName = this.bankBranch;
        this.searchBank = false;
      },
      organizationType(){
        this.formData.organizationType = this.organizationType[0];
      },
      businessLicenceType(){
        this.formData.businessLicenceType = this.businessLicenceType[0];
      },
      businessScene(){
        this.formData.businessScene = this.businessScene[0];
      },
      accountBank(){
        this.formData.accountBank = this.accountBank[0];
      }
    },
    methods: {
      toast(tip){
        this.tips = tip;
        this.$refs.toast.toast();
      },
      showSearchBank(){
        this.searchBank = true;
        this.getBankList();

      },
      getAliType(){
        var _self = this,_data;
        _data = {}
        getAliType(_data).then(res => {
          if(res.data.state == 1){
            _self.MERCHANT_TYPE = res.data.data;
          }
        })
      },
      organization(key,name){
        console.log(key,name)
      },
      MerchantType(){
        var mccCode;
        mccCode = this.MERCHANT_TYPE.filter(ele => ele.id == this.mccCode[2]);
        this.formData['mccCode'] = mccCode[0].code;
      },
      sendMsCode(){
        var _self = this,_data;
        if(_self.time == 60){
          if(/^(1)[0-9]{10}$/.test(this.formData.mobilePhone)){
            _data = {
              type: 11,
              userName: _self.formData.mobilePhone,
              mobilePhone: _self.formData.mobilePhone
            };
            _self.timer = setInterval(() => {
              _self.time--;
              if(_self.time == 0){
                clearInterval(_self.timer);
                _self.time = 60;
              }
            },1000);
            sendMsCode(_data).then(res => {
              if(res.data.state != 1){
                _self.toast(decodeURIComponent(res.data.msg));
              }
            })
          }else{
            _self.toast("请输入规范手机号")
          }
        }
      },
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['scroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.nextBank();
        });
      },
      getStoreAddress(areacodes,citys){
        var address = citys.join('');
        this.formData.companyAddress = address + this.formData.detailAddress;
      },
      getBankAddress(areacodes,citys){
        areacodes.forEach(ele => {
          if(ele != '--'){
            this.formData.bankAddressCode = ele
          }
        });
      },
      idCardValidTimeLong(currentValue){
        if(currentValue){
          this.formData.businessTime = this.startDate + ',' + '长期';
        }else{
          this.formData.businessTime = this.startDate + ',' + this.endDate;
        }
      },
      organizationTimeLong(currentValue){
        if(currentValue){
          this.formData.organizationTime = this.startDate + ',' + '长期';
        }else{
          this.formData.organizationTime = this.startDate + ',' + this.endDate;
        }
      },
      getBankList(){
        var _self = this , _data , bankList;
        _self.pageNum = 1;
        _data = {
          bankName: _self.bankName,
          pageNum: _self.pageNum,
          pageSize: 20
        };
        this.BANK_BRANCH = [];
        getBankList(_data).then(res => {
          if(res.data.state == 1){
            bankList = res.data.data;
            bankList.push({
              value: _self.bankName,
              key: _self.bankName
            })
            _self.BANK_BRANCH = _self.BANK_BRANCH.concat(bankList);
          }
        })
      },
      nextBank(){
        var _self = this , _data , bankList;
        _self.pageNum++;
        _data = {
          bankName: _self.bankName,
          pageNum: _self.pageNum,
          pageSize: 20
        };
        getBankList(_data).then(res => {
          if(res.data.state == 1){
            bankList = res.data.data;
            _self.BANK_BRANCH = _self.BANK_BRANCH.concat(bankList);
          }
        })
      },
      verifyFormData(){
        Array.prototype.S = String.fromCharCode(2);
        Array.prototype.in_array = function (e) {
          var r = new RegExp(this.S + e + this.S);
          return (r.test(this.S + this.join(this.S) + this.S));
        };
        var arr = ['shopId','qualifications','qualificationsMediaId','businessAdditionPics','businessAdditionPicsMediaId','organizationNumber','organizationTime','organizationCopy','organizationCopyMediaId']
        for(let i in this.formData){
          if(!this.formData[i] && !arr.in_array(i)){
            console.log(i);
            switch (i) {
              case 'mobilePhone':
                this.toast('请填写手机号码');break;
              case 'smsSecurityCode':
                this.toast('请填写验证码');break;
              case 'shopName':
                this.toast('请输入商家名称');break;
              case 'shopShortName':
                this.toast('请输入商家简称');break;
              case 'contact':
                this.toast('请输入联系人');break;
              case 'contactEmail':
                this.toast('请输入联系邮箱');break;
              case 'organizationType':
                this.toast('请选择组织类型');break;
              case 'businessLicenceType':
                this.toast('请选择营业执照类型');break;
              case 'companyAddress':
                this.toast('请输入注册地址');break;
              case 'legalPerson':
                this.toast('请输入法人');break;
              case 'businessTime':
                this.toast('请选择营业执照有效期');break;
              case 'accountBank':
                this.toast('请选择开户行');break;
              case 'accountNumber':
                this.toast('请输入开户账户');break;
              case 'accountName':
                this.toast('请输入开户人');break;
              case 'bankName':
                this.toast('请输入开户支行');break;
              case 'bankAddressCode':
                this.toast('请选择开户地区');break;
              case 'businessLicenseCopy':
                this.toast('请上传营业执照');break;
              case 'mccCode':
                this.toast('请选择经营类目');break;
            }
            return false;
          }else if(i == 'mobilePhone'){
            if(!(/^(1)[0-9]{10}$/.test(this.formData[i]))){
              this.toast('请输入规范电话')
              return false;
            }
          }
        }
        return true;
      },
      submit(){
        var _self = this,formData = new FormData();
        if(this.verifyFormData()){
          console.log(this.formData);
          for(let i in this.formData){
            formData.append(i,this.formData[i])
          }
          _self.$vux.loading.show({
            text: '加载中'
          });
          axios({
            method: 'post',
            url: '/sapi/voip/onlineentry/enterprise/save',
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
          }).then(res => {
            _self.$vux.loading.hide();
            if(res.data.state == 1){
              _self.toast('已提交审核')
            }else{
              _self.toast(decodeURIComponent(res.data.msg));
            }
          }).catch(error => {
            _self.$vux.loading.hide();
          })
        }
      },
      IMG_UPLOAD(event) {
        var _self = this;
        if(_self.formData.mobilePhone){
          var file = event.target.files[0],
            id = event.target.id,
            reader = new FileReader(),
            name = event.target.name;
          if(file.size > 1024 * 1024 * 2){
            this.toast('图片最大为2M')
          }else{
            reader.readAsDataURL(file);
            reader.onload=function(e){
              _self[id] = e.target.result;
              var formData = new FormData();
              formData.append('mobilePhone',_self.formData.mobilePhone);
              formData.append('file',file);
              axios({
                method: 'post',
                url: '/sapi/voip/onlineentry/img/upload',
                headers: { 'content-type': 'multipart/form-data' },
                data: formData
              }).then(res => {
                if(res.data.state == 1){
                  _self.formData[id] = res.data.data;
                  _self.formData[id+'MediaId'] = res.data.media_id;
                }else{
                  _self.toast(decodeURIComponent(res.data.msg))
                }
              })
            }
          }
        }else{
          _self.toast('请输入手机号码')
        }

      },
      anotherUploads(){
        var _self = this;
        if(_self.formData.mobilePhone){
          var file = event.target.files[0],
            id = event.target.id,
            reader = new FileReader(),
            name = event.target.name;
          if(file.size > 1024 * 1024 * 2){
            this.toast('图片最大为2M')
          }else{
            reader.readAsDataURL(file);
            reader.onload=function(e){
              var formData = new FormData();
              formData.append('mobilePhone',_self.formData.mobilePhone);
              formData.append('file',file);
              axios({
                method: 'post',
                url: '/sapi/voip/onlineentry/img/upload',
                headers: { 'content-type': 'multipart/form-data' },
                data: formData
              }).then(res => {
                if(res.data.state == 1){
                  _self.otherImgs.push(res.data.data);
                  _self.otherImgsId.push(res.data.media_id);
                  _self.formData['businessAdditionPics'] = _self.otherImgs.join(',');
                  _self.formData['businessAdditionPicsMediaId'] = _self.otherImgsId.join(',');
                }else{
                  _self.toast(decodeURIComponent(res.data.msg))
                }
              })
            }
          }
        }else{
          _self.toast('请输入手机号码')
        }
      },
      qualificationUploads(){
        var _self = this;
        if(_self.formData.mobilePhone){
          var file = event.target.files[0],
            id = event.target.id,
            reader = new FileReader(),
            name = event.target.name;
          if(file.size > 1024 * 1024 * 2){
            this.toast('图片最大为2M')
          }else{
            reader.readAsDataURL(file);
            reader.onload=function(e){
              var formData = new FormData();
              formData.append('mobilePhone',_self.formData.mobilePhone);
              formData.append('file',file);
              axios({
                method: 'post',
                url: '/sapi/voip/onlineentry/img/upload',
                headers: { 'content-type': 'multipart/form-data' },
                data: formData
              }).then(res => {
                if(res.data.state == 1){
                  _self.qualificationImgs.push(res.data.data);
                  _self.qualificationImgsId.push(res.data.media_id);
                  _self.formData['qualifications'] = _self.otherImgs.join(',');
                  _self.formData['qualificationsMediaId'] = _self.otherImgsId.join(',');
                }else{
                  _self.toast(decodeURIComponent(res.data.msg))
                }
              })
            }
          }
        }else{
          _self.toast('请输入手机号码')
        }
      },
      delImg(index){
        var _self = this;
        _self.otherImgs = _self.otherImgs.filter((ele,idx) => idx != index);
        _self.otherImgsId = _self.otherImgsId.filter((ele,idx) => idx != index);
        _self.formData['businessAdditionPics'] = _self.otherImgs.join(',');
        _self.formData['businessAdditionPicsMediaId'] = _self.otherImgsId.join(',');
      },
      delQualiImg(index){
        var _self = this;
        _self.qualificationImgs = _self.qualificationImgs.filter((ele,idx) => idx != index);
        _self.qualificationImgsId = _self.qualificationImgsId.filter((ele,idx) => idx != index);
        _self.formData['qualifications'] = _self.otherImgs.join(',');
        _self.formData['qualificationsMediaId'] = _self.otherImgsId.join(',');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mchpar{
    background: #ECECEC;
    .search{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
      background: #FFFFFF;
      overflow: scroll;
    }

  }
  .scroll{
    position: fixed;
    top: 1.7rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: #FFFFFF;
  }
</style>
