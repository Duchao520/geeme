<template>
  <div class="page">
    <div class="back_index" :class="isIpx==1?'index-bottom-view-IPX':''" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>

    <div class="top_img">
      <detail-swiper :images="images"/>
    </div>

    <div class="top_con">
      <div class="top_detail">
        <div class="top_con_le">
          <div class="over_hid" style="font-size: 30rpx;font-weight: bold">
            <img src="/static/img/common/cat.png" alt="">{{dataDetail.goodsName}}
          </div>
          <div class="remake_ove" style="font-size: 26rpx;color:#F7094D;">
             {{dataDetail.goodsRemark}}
          </div>
        </div>
        <div class="top_con_ri">
          <div class="ico_sou" @click="songcang(collectionState)">
            <div class="ico_img">
              <i class="iconfont" style="font-size: 34rpx" :class="collectionState == 0?'icon-unie601':'icon-shoucang-tianchong'"></i>
            </div>
            <div class="ico_con" style="font-size:24rpx;color:#9A9DA5;">收藏</div>
          </div>
        </div>
      </div>
      <div class="pri_de">
        <div class="pri_le">
          <span class="pri_pri">￥{{dataDetail.presentPrice}}</span>
        </div>
      </div>

      <div class="say_money" v-if="dataDetail.integralNum !=0">
        ￥{{dataDetail.originalPrice}} - {{dataDetail.integralNum}}话呗
      </div>

      <div class="say_world">
        <div>{{dataDetail.freightPrice == 0?'免邮': dataDetail.freightPrice}}</div>
        <div>已售 {{dataDetail.salesVolume }}</div>
      </div>


      <div class="offer_inter" v-if="List !=[] && List[0] != ''">
        <div class="winter" style="font-size: 30rpx;color:#000;margin-left:0;">服务</div>
        <div class="winter" v-for="(item,index) in List" :key="index">
          <i class="iconfont icon-Shapecopy"></i>
          {{item}}
        </div>
      </div>
      <div class="hengxian"></div>
      <div class="offer_pro">
        <div class="of_pro_title">购 · 买 · 流 · 程</div>
        <div class="of_pro_con">

          <div class="of_pro_icon" v-for="(item,index) in buyPro" :key="index">
            <div class="pro_icon">
              <i class="iconfont" :class="item.icon"></i>
            </div>
            <div class="pro_text">{{item.text}}</div>
          </div>
        </div>

        <div class="of_pro_intro">
          <div class="of_pro_le">支付金额 = 商品价格 - 话呗抵扣价格 </div>
          <div class="of_pro_jj">
            <div class="all_con" @click="gopro">
              <div class="pr_le" style="margin-right:10rpx;">如话呗不够，需原价购买，如何得话呗请点击    如需退货，请拨打客服电话联系客服</div>
              <div class="pr_le" style="font-size: 36rpx;"><i class="iconfont icon-738bianjiqi_chaolianjie"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shop_par">
      <div class="shop_can" @click="newPopUp">
        <div class="can_title">商品参数</div>
        <div style="color:#9A9DA5;"><i class="iconfont icon-youjiantou"></i></div>
      </div>
    </div>

    <!--推荐商品暂时隐藏-->
    <!--<div class="recomm_shop" v-if="false">-->

      <!--<div class="shop_can" style="background: #f6f6f6;">-->
        <!--<div class="can_title">推荐商品</div>-->
      <!--</div>-->

      <!--<div class="recomm_sho">-->
        <!--<div class="rec_sh_goods" v-for="item in [1,2,3]">-->

          <!--<div class="rec_sh_top">-->

          <!--</div>-->

          <!--<div class="over_hid" style="width:220rpx;">-->
            <!--<img src="/static/img/common/cat.png" alt="">{{dataDetail.goodsName}}-->
          <!--</div>-->

          <!--<div class="eve_money">-->
            <!--<div class="mon_footer">-->
              <!--<span style="color:#F7094D;font-size: 30rpx;margin-right: 10rpx;">￥22222</span>-->
              <!--<span style="text-decoration:line-through;color:#9A9DA5;font-size: 18rpx;">原价￥22222</span>-->
            <!--</div>-->
          <!--</div>-->

        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

    <!--商品详情-->
    <div class="shop_detail">
      <div class="shop_can">
        <div class="can_title">商品详情</div>
      </div>
      <wxParse :content="dataDetail.detailMobile" @preview="preview" @navigate="navigate" />
    </div>

    <div class="detail_bottom" :class="isIpx==1?'feed-bottom-view-IPX':''">
      <div class="eve_de">
        <div class="ico_sou" @click="goinlieShop(shopinfo)">
          <div class="ico_img">
            <i class="iconfont icon-dianpu"></i>
          </div>
          <div class="ico_con">店铺</div>
        </div>
        <div class="ico_sou" @click="pickPhone">
          <div class="ico_img">
            <i class="iconfont icon-kefu"></i>
          </div>
          <div class="ico_con">客服</div>
        </div>
      </div>
      <button class='eve_de' @click="gocreatShare">分享</button>
      <div class="eve_de" @click="showPop">立即购买</div>
    </div>

    <!--弹出层-->
    <!--屏幕背景变暗的背景 -->
    <div class="commodity_screen" @click="hideModal"   catchtouchmove="move"  v-if="showModalStatus">

    </div>
    <!--弹出框  -->
    <div :animation="animationData" class="commodity_attr_box"  v-if="showModalStatus">
      <div class="fot_btn" v-if="okClick && inventoryNum!=0" @click="gobuy">立即购买</div>
      <div class="fot_btn" style="background:#c7c7c7;" v-if="noClick || inventoryNum ==0">立即购买</div>
      <div class="all_con_shop">
        <div class="de_img_top">
          <div class="le_de_im">
            <img :src="orderGoods.imgUrl" alt="">
          </div>
          <div class="ri_de_im">
            <div class="ri_de_pri">
              <span style="color:#F7074B;font-size: 48rpx;margin-right:20rpx;">￥{{orderGoods.presentPrice}}</span>
              <span style="background:#FFBD1D;color:#fff;font-size: 24rpx;padding:0 10rpx;@include jcc;border-radius: 20rpx">会员专享</span></div>
            <div class="ri_de_dec"> ￥{{orderGoods.originalPrice}} - {{orderGoods.integralNum}}话呗</div>

            <div class="ri_de_rul">
              已选<span style="margin-left:10rpx;margin-right:10rpx;" v-for="(item,index) in specParamNameSelect" :key="index"> {{item}}</span>
            </div>
          </div>

        </div>
        <!--规格切换-->
        <div  class="spec_selec" v-for="(item,index) in typeDataFir" :key="index">
          <div class="spec-title">{{item.specName}}</div>
          <div class="spec_type">
            <div  class="item"
                  v-for="(val,index1) in item.lstGoodsspecparams" :key="index"
                  :class="specParamIdSelect[index] == val.id ? 'active' : ''"
                  @click="selectSort(val.specParamName , val.id , index, val)" >
              <input    type="radio" :name="item.id"   :id="val.id"  :checked="specParamIdSelect[index] == val.id ? 'true' : ''">
              <label :for="val.id">{{val.specParamName}}</label>
            </div>
          </div>
        </div>
        <!--数量选择-->
        <div class="num_ad_can">
          <div class="num_le">购买数量</div>
          <div class="num_ri">
            <div @click="bindMinus" :disabled="minusStatus">-</div>
            <div>{{num}}</div>
            <div @click="bindPlus" v-if="yesAdd"  :disabled="minusStatus" >+</div>
            <div  v-if="noAdd" style="background:#c7c7c7;"  :disabled="minusStatus" >+</div>
          </div>
        </div>
      </div>

    </div>
    <!--规格参数弹出层-->
    <div class="commodity_screen" @click="hideNewModal"   catchtouchmove="move"  v-if="showNewStatus"></div>
    <!--规格参数弹出层-->
    <div :animation="animationData" class="commodity_attr_box"  v-if="showNewStatus">
      <div class="standard_page">
        <div class="stand_top">
          商品参数
        </div>
        <div class="all_stand_con">
          <div class="eve_mes" v-for="(item,index) in standardMes" :key="index">
            <span>{{item.attrName}}</span>
            <span>{{item.attrValue}}</span>
          </div>
        </div>
      </div>
      <div class="standFooter" @click="hideNew">
        完成
      </div>
    </div>
  </div>
</template>

<script>
  import {getQuery , getSignIn} from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  import wxParse from 'mpvue-wxparse'
  import detailSwiper from '@/components/detailSwiper'

  import { mapMutations } from 'vuex'
  import {   NAME , GOODSID , SELTYPE , PRICE , NUMBER ,
    DESCPRICE , FREIGHTPRICE , IMGURL , SHOPID, GOODSITEMNO ,
    SINGLEPRICE , COSTPRICE , TOTALMONEY , SPACPAEAM , ISBUYLIMITED , MAXBUYNUM ,SHAREUSERID ,SHOPNAME,SHOPLOGO ,GOODSTYPE, SHAREUSERNAME}  from '../../store/mutation-types'
  export default {
    name: "index",
    components: {
      wxParse , detailSwiper
    },
    data(){
      return {
        parData:{
          token:'',
          id:'',
          userId:'',
        },
        dataDetail:'',
        showModalStatus:false,
        showNewStatus:false,
        List:[
          {text:'行货正品'},
          {text:'行货正品'},
          {text:'行货正品'},
          {text:'行货正品'},
        ],
        // 点击购买       选择规格       下单付款         发货          签收完成
        buyPro:[
          {icon:'icon-dianji',text:'点击购买'},
          {icon:'icon-xuanze',text:'选择规格'},
          {icon:'icon-fukuan',text:'下单付款'},
          {icon:'icon-fahuojihua',text:'发货'},
          {icon:'icon-yiwancheng',text:'签收完成'}
        ],
        shopinfo:'',
        //轮播
        images:'',
        bcColor:true,
        // 弹出层动画
        animationData:'',
        animation:'',
        //规格选择
        typeDataFir:'',
        typeDataSec:'',
        typeDataThr:'',
        typeDataFou:'',
        firNum:0,
        SecNum:0,
        ForNum:0,
        ThrNum:0,
        //第一规格
        firType:'',
        num:1,
        specParamNameSelect:[] ,//查询库存所用的选中的所有的商品规格名称
        specParamIdSelect:[],//
        orderGoods:'',
        numberoth:'',
        goodinventoryId:'',
        //其他地方要用到的参数
        sjId:'',   //商家id
        sphNum:'',  //商品货号
        presentPrice:'', //商品价格
        cbPrice:'',   //成本价格
        gdid:'',
        isBuy:'',
        goodsUrl:'',
        collectionState:'',
        standardMes:'',
        maxBuy:'',   //最大购买数量
        goUrlId:'',
        inviterId:'',

        okClick:true,
        noClick:false,

        inventoryNum:'',   //这里是库存
        isBuyLi:'',   //这里是限购

        yesAdd:true,
        noAdd:false,
        scene:'',
        isIpx:this.$store.state.isIpx,
      }
    },
    mounted(){
      var par = getQuery();
      const pages = getCurrentPages();
      this.goUrlId = par.id;
      if(par.inviterId) {
        this.inviterId = par.inviterId;
      }
      if(par.userId){
        this.inviterId = par.userId;
      }
      if(pages.length == 2){
        this.goodsUrl = `${pages[1].route}?id=${par.id}`;
      }else{
        this.goodsUrl = `${pages[0].route}?id=${par.id}`;
      }
      if(!par.scene) {
        this.parData.id = par.id;
        this.parData.token = this.$store.state.token;
        this.parData.userId = this.$store.state.userLiId;
      }else{
         console.log('看看这个场景值',par.scene);
         this.scene = par.scene;
         var newScene = decodeURIComponent(par.scene);
         var newArr = newScene.split(',');
         console.log(newArr);
          this.parData.id = newArr[1];
          this.shareUsername(newArr[0]);
          console.log('看看这个id是多少',this.parData.id);
          this.parData.token = this.$store.state.token;
          this.parData.userId = this.$store.state.userLiId;
      }
      if(this.parData.token && this.parData.userId){
        this.getDetail(this.parData);
        this.getBalance();
      }else{
        if(!par.scene) {
          const url = `../../pages/loginpage/main?id=${par.id}&inviterId=${this.inviterId}`;
          wx.navigateTo({url})
        }else{
          const url = `../../pages/loginpage/main?id=${par.id}&scene=${par.scene}`;
          wx.navigateTo({url})
        }
      }
    },
    // var name,goodsId,selType,price,number,descPrice,freightPrice,imgUrl;
    methods: {
      ...mapMutations({
        name:'NAME',
        goodsId:'GOODSID',
        selType:'SELTYPE',
        price:'PRICE',
        number:'NUMBER',
        descPrice:'DESCPRICE',
        freightPrice:'FREIGHTPRICE',
        imgUrl:'IMGURL',
        shopId:'SHOPID',
        goodsItemNO:'GOODSITEMNO',
        singlePrice:'SINGLEPRICE',
        costPrice:'COSTPRICE',
        totalMoney:'TOTALMONEY',
        spacPaeam:'SPACPAEAM',
        isBuyLimited:'ISBUYLIMITED',
        maxBuyNum:'MAXBUYNUM',
        shareUserId:'SHAREUSERID',
        shopName:'SHOPNAME',
        shopLogo:'SHOPLOGO',
        goodsType:'GOODSTYPE',
        shareUsername:'SHAREUSERNAME'
      }),
      backIndex(){
        wx.switchTab({
          url:'../../pages/index/main'
        })
      },
      gocreatShare(){
        var _this = this;
        wx.navigateTo({
          url:`/pages/packageA/pages/createShare/main?id=${_this.parData.id}`
        })
      },
      getDetail(par) {
        var _this = this;
        getSignIn(par).then(sec => {
          _this.$http.getDetail(par, sec).then(res => {
            if(res.state ==1) {
              _this.standardMes = res.lstBiGoodsAttr;
              _this.dataDetail = res.data;
              var newArr;
              newArr = res.data.goodsServices.split('-');
              _this.List = newArr;
              _this.shopinfo = res.shopinfo;
              var arrMes=[];
              for(let i=0;i<res.lstBiGoodsimgs.length;i++){
                  if(res.lstBiGoodsimgs[i].isMain ==1){
                     arrMes.push(res.lstBiGoodsimgs[i])
                  }
              }
              _this.images = arrMes;
              _this.orderGoods = res.lstBiGoodsInventory[0];
              _this.goodinventoryId = res.lstBiGoodsInventory[0].id;
              _this.typeDataFir = res.goodsSpecsParams;
              _this.MENBERGOODS = res.data.isMemberArea;
              _this.ISBUYLIMITED = res.data.isBuyLimited;
              var arr = [];
              arr = res.data.inventoryName.split("|");
              _this.specParamNameSelect = arr; //默认选中的商品规格名称
              _this.specParamIdSelect = res.data.specParamsIds.split("|"); //默认选中的商品规格id
              //分割线 其他地方要用到
              _this.sjId = res.data.shopId;
              _this.sphNum = res.data.itemNO;
              _this.cbPrice = res.data.costPrice;
              _this.gdid = res.data.goodsId;
              _this.isBuy = res.data.isBuyLimited;
              _this.collectionState = res.collectionState;
              //最大购买数量
              _this.maxBuy = res.data.maxBuyNum;
              //限购数量
              _this.isBuyLi = res.data.maxBuyNum;
              _this.inventoryNum = res.data.inventoryNum;
            }else if(res.state ==10000){
              Tips.toast(`${decodeURIComponent(res.mes)}`)
            }
          })
        })

      },
      getBalance(){
        var _this = this;
        var _data = {
          token:this.$store.state.token,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getBalance(_data,sec).then(res=>{
            if(res.state ==1) {
              _this.totalMoney(res.data.totalMoney);
            }else if(res.state == 10000){
              if(!this.scene) {
                const url = `../../pages/loginpage/main?id=${this.parData.id}&inviterId=${this.inviterId}`;
                wx.navigateTo({url})
              }else{
                const url = `../../pages/loginpage/main?id=${this.parData.id}&scene=${this.scene}`;
                wx.navigateTo({url})
              }
            }
          })
        })
      },
      selectSort(name,id,index,vsl){
        let _self = this ;
        _self.specParamIdSelect[index] = id ;
        _self.$set( _self.specParamNameSelect,index,name);
        if(_self.specParamIdSelect.length == _self.typeDataFir.length){
          let _id = _self.specParamIdSelect.join("|");
          _self.selectType(_id);
        }
      },
      selectType(id){
        let _self = this ;
        _self.numberoth = 1 ;
        _self.goodinventoryId = id ;
        let _data ={
          token : _self.$store.state.token,
          specParamsIds:id
        };
        if(_self.ISBUYLIMITED){
          _data.isBuyLimited = _self.ISBUYLIMITED ;
        }
        if(_self.MENBERGOODS){
          _data.isMemberArea = _self.MENBERGOODS ;
        }
        if(_self.typeDataFir.maxBuyNum){
          _data.maxBuyNum = _self.typeDataFir.maxBuyNum ;
        }
        getSignIn(_data).then(sec =>{
          _self.$http.getgoods(_data,sec).then(res=>{
            _self.inventoryNum = res.data.inventoryNum;
            if(res.state == 1){
              _self.orderGoods = res.data;
              _self.sphNum = res.data.itemNO;
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })

      },

      //显示对话框
      showPop() {
        var _this = this;
        _this.showModalStatus = true;

        var animation = wx.createAnimation({
          duration: 600,
          timingFunction: "ease",
        });
        _this.animation = animation;

        setTimeout(function () {
          animation.translateY(0).step();
          this.animationData = animation.export();
        }.bind(this), 200)
      },
      //隐藏对话框
      hideModal() {
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })
        // this.animation = animation
        animation.translateY(300).step()

        this.animationData = animation.export();

        setTimeout(function () {
          animation.translateY(0).step()
          this.animationData = animation.export();
          this.showModalStatus = false;
        }.bind(this), 200)
      },
      //加减法
      bindMinus() {
        var num = this.num;
        // 如果大于1时，才可以减
        if (num > 1) {
          num--;
        }
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        if(this.isBuyLi !=0) {
          if (num > this.isBuyLi) {
            this.yesAdd = false;
            this.noAdd = true;
          } else {
            this.yesAdd = true;
            this.noAdd = false;
          }
        }
        // 将数值与状态写回
        this.num=num;
        this.minusStatus = minusStatus;
      },
      bindPlus() {
        var num = this.num;
        // 不作过多考虑自增1
        num++;
        // 只有大于一件的时候，才能normal状态，否则disable状态
        console.log(this.num);
        console.log(this.isBuyLi);
        this.num = num;
        if(this.isBuyLi !=0) {
          if (num > this.isBuyLi-1) {
            this.yesAdd = false;
            this.noAdd = true;
          } else {
            this.yesAdd = true;
            this.noAdd = false;
          }
          this.num = num;
        }
        // 将数值与状态写回
        var minusStatus = num < 1 ? 'disabled' :'normal';
        this.minusStatus = minusStatus;
      },
      gobuy(){
        // 跳转过去要带的东西  Goodsid 名字  选中的规格   单价  选中的数量   话呗的抵扣价格  邮费
        this.okClick = false;
        this.noClick = true;
        // var name,goodsId,selType,price,number,descPrice,freightPrice,imgUrl;
        this.name(this.dataDetail.goodsName);
        this.goodsId(this.gdid);
        this.goodsType(this.dataDetail.goodsType);
        console.log(this.$store.state.goodsType);
        this.selType(this.specParamNameSelect);
        this.price(this.orderGoods.originalPrice);
        this.descPrice(this.orderGoods.integralNum);
        this.number(this.num);
        this.imgUrl(this.orderGoods.imgUrl);
        this.freightPrice(this.dataDetail.freightPrice);
        //额外的参数
        this.shopId(this.sjId);
        this.goodsItemNO(this.sphNum);
        this.singlePrice(this.orderGoods.presentPrice);  //现价
        this.costPrice(this.cbPrice);   //成本价
        this.spacPaeam(this.specParamIdSelect);
        this.isBuyLimited(this.isBuy);
        this.maxBuyNum(this.maxBuy);
        this.shareUserId(this.inviterId);
        this.shopName(this.shopinfo.shopName);
        this.shopLogo(this.shopinfo.supplierLogo);
        console.log(this.$store.state.shopName);
        console.log(this.$store.state.shopLogo);

        var _this =this;
        setTimeout(function(){
          const url = `/pages/packageA/pages/orderpage/main?`;
          wx.navigateTo({
            url:url,
            complete(){
              _this.okClick = true;
              _this.noClick = false;
            }
          })
        },1000);
      },
      songcang(par){
        if(par == 0){
          var goodUrl = `http://zst-test.tenzhao.com:10087/zst-wap/app-shop/index.html?id=${this.goUrlId}&userId=${this.$store.state.userLiId}&isLogin=1`
          var _data = {
            token:this.$store.state.token,
            platform:3,
            goodsId:this.gdid,
            goodsUrl: goodUrl,
            goodsName:this.dataDetail.goodsName,
            originalPrice:this.orderGoods.originalPrice,
            cover:this.orderGoods.imgUrl,
            offerContent:`${String(this.orderGoods.integralNum)}话呗`,
            discountPrice:this.orderGoods.presentPrice,
          }
          var _this = this;
          getSignIn(_data).then(sec=>{
            _this.$http.addCollect(_data,sec).then(res=>{
              if(res.state==1){
                Tips.toast('收藏成功','none');
                _this.collectionState = 1;
              }
            })
          })
        }
        else if(par==1){
          var _data = {
            token:this.$store.state.token,
            platform:3,
            goodsId:this.gdid,
          }
          var _this = this;
          getSignIn(_data).then(sec=>{
            _this.$http.cancalCollect(_data , sec).then(res=>{
              if(res.state==1){
                Tips.toast('取消收藏','none')
                _this.collectionState = 0;
              }
            })
          })
        }

      },
      pickPhone(){
        var _this = this ;
        //这里找一下用户的信息  比如说商家的手机号码  用该都有的
        wx.makePhoneCall({
          phoneNumber:this.shopinfo.legalPersonPhone , // 仅为示例，并非真实的电话号码\
          success(res) {
            console.log(res);
          },
          fail(err){
            console.log(err);
          }
        })
      },
      goinlieShop(par){
        wx.navigateTo({
          url:`/pages/packageA/pages/inlineshop/main?shopId=${par.id}`
        })
      },
      goShopDetail(par){
        wx.navigateTo({
          url:`/pages/packageA/pages/inlineshop/main?shopId=${par.id}`
        })
      },
      gopro(){
        wx.navigateTo({
          url:'../../pages/comPro/main'
        })
      },
      newPopUp(){
        this.showNewStatus = true;
      },
      hideNew(){
        this.showNewStatus = false;
      }
    },
    onShareAppMessage(res){
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log('啦啦啦德玛西亚',res.target);
      }
      return {
        title:this.dataDetail.goodsName,
        path:`/pages/shopdetail/main?id=${this.parData.id}&inviterId=${this.$store.state.userLiId}`,
        success:function(res){
          console.log('成功转发的消息',res)
        },
        fail:function(res){
          console.log('失败转发的消息',res)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    height:100%;
    .back_index{
      position: fixed;
      width:116rpx;
      height:116rpx;
      display: block;
      right:40rpx;
      bottom:104rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .collect{
      color:$btnle;
    }
    .nocllect{
      color:$fontColor;
    }
    .shop_can{
      height: 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:0 20rpx;
      background: #fff;
      margin-bottom:16rpx;
      .can_title{
        height:40rpx;
        font-size: 34rpx;
        color:#000;
        .shop_bot{
          color:$iconColor;
        }
      }
    }
    .over_hid{
      overflow: hidden;
      padding:0 10rpx;
      font-size: 24rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin-top:16rpx;
      line-height: 46rpx;
      img{
        width:30rpx;
        height:30rpx;
        margin-right:10rpx;
      }
    }
    .top_img{
      width:750rpx;
      height:750rpx;
      border-bottom:1px solid rgba(229,229,229,1);
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .top_con{
      width:96%;
      margin:0 2%;
      background:#fff;
      margin-top:32rpx;
      margin-bottom:36rpx;
      overflow: hidden;
      .top_detail{
        display: flex;
        justify-content: space-between;
        .top_con_ri{
          width:152rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .ico_sou{
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .ico_img{
              width:50rpx;
              height:50rpx;
              margin-bottom:4rpx;
              @include jcc;
              i{
                font-size: 40rpx;
              }
              .icon-unie601{
                color:#9A9DA5;
              }
              .icon-shoucang-tianchong{
                color: $btnle;
              }
            }
            .ico_con{
              overflow: hidden;
            }
          }
        }
      }
      .pri_de{
        width:100%;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pri_le{
          overflow: hidden;
          display: flex;
          align-items: center;
          .pri_pri{
            color:#F7074B;
            font-size:48rpx;
            display: block;
            float: left;
            margin-right:20rpx;
          }
          .pri_vip{
            color:#fff;
            padding:4rpx 10rpx;
            background:#FFBD1D;
            border-radius: 20rpx;
            font-size:24rpx;
            display: block;
            float: left;
          }
        }
        .pri_ri{
          float:right;
          font-size:24rpx;
          display: flex;
          align-items: center;
        }
      }
      .say_money{
        font-size:24rpx;
        color:#9A9DA5;
        margin-bottom:15rpx;
      }
      .say_world{
        display:flex;
        justify-content: space-between;
        margin-bottom:70rpx;
        div{
          color:$fontColor;
          font-size: 24rpx;
        }

      }
      .offer_shop{
        width: 100%;
        margin-bottom:28rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .of_sh_le{
          width:200rpx;
          height:150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          img{
            width:150rpx;
            height:150rpx;
            display: block;
          }
        }
        .of_sh_mid{
          width:334rpx;
          height:100%;
          .off_shoper{
            width:334rpx;
            font-size: 28rpx;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .off_phone{
            font-size: 28rpx;
          }
        }
        .of_sh_ri{
          width:50rpx;
          height:57rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          i{
            color:#9A9DA5;
          }
        }
      }
      .offer_inter{
        width:100%;
        height:47rpx;
        margin-bottom:40rpx;
        /*display: flex;*/
        /*justify-content: space-around;*/
        /*align-items: center;*/
        .winter{
          display: flex;
          font-size: 20rpx;
          align-items: center;
          color:#9A9DA5;
          float: left;
          margin-left:40rpx;
          i{
            margin-right:10rpx;
            color:#F7074B;
          }
        }
      }
      .hengxian{
        width:100%;
        height:16rpx;
        background:#f6f6f6;
      }
      .offer_pro{
        width: 100%;
        float: left;
        .of_pro_title{
          text-align: center;
          font-size:30rpx;
          font-weight: 700;
          color:#F7094D;
          margin:35rpx 0;
        }
        .of_pro_con{
          width:100%;
          margin-bottom:44rpx;
          @include jcsb();
          .of_pro_icon{
            height:100%;
            width:109rpx;
            @include jcsa();
            flex-wrap: wrap;
            .pro_icon{
              width:108rpx;
              height:108rpx;
              border-radius: 50%;
              border:1rpx solid $iconColor;
              margin-bottom:24rpx;
              padding:0;
              @include jcc();
              .iconfont{
                font-size: 50rpx;
                color:$iconColor;
              }
            }
            .pro_text{
              font-size: 24rpx;
              color:#000;
            }
          }
        }
        .of_pro_intro{
          text-align: center;
          .of_pro_le{
            @include foSiCo(24rpx,$iconColor);
            font-weight: 700;
          }
        }
        .of_pro_jj{
          width:100%;
          height:60rpx;
          margin:15rpx 0;
          @include jcc();
          .all_con{
            width:600rpx;
            @include jcsb();
            .pr_le{
              @include foSiCo(24rpx,#000);
            }
          }
        }
      }
    }
    .shop_par{
      background:#f6f6f6;
      padding-top:16rpx;
      overflow: hidden;
      .shop_comm{
        width:100%;
        padding-bottom:20rpx;
        overflow: hidden;
        background:#fff;
        padding-top:40rpx;
        .shop_com_tit{
          display: flex;
          justify-content: space-between;
          padding:0 20rpx;
          font-size:34rpx;
          overflow: hidden;
          margin-bottom:42rpx;
          .shop_bot{
            color:#FF326D;
          }
        }
      }
      .sh_con{
        padding:0 20rpx;
        overflow: hidden;
        .sh_con_le{
          width:70rpx;
          height:70rpx;
          float: left;
          background:gold;
          margin-right:20rpx;
          border-radius: 50%;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 50%;
          }
        }
        .sh_con_ri{
          float: left;
          .sh_cion_name{
            font-size:30rpx;
          }
          .sh_con_time{
            font-size: 24rpx;
            color:#9A9DA5;
          }
        }
      }
      .sh_con_con{
        padding:0 20rpx;
        color:#B1B1B1;
        margin-top:34rpx;
      }
    }
    .recomm_shop{
      width:100%;
      overflow: hidden;
      .recomm_sho{
        width:98%;
        margin:0 1%;
        display: flex;
        justify-content: space-between;
        .rec_sh_goods{
          width:240rpx;
          height:380rpx;
          background:gold;
          border-radius: 10rpx;
          .rec_sh_top{
            width:240rpx;
            height:240rpx;
            background:purple;
            border-radius: 10rpx;
            border-bottom-left-radius:0;
            border-bottom-right-radius:0;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
        }
      }

    }
    .shop_detail{
      padding-top:17rpx;
      background:#f6f6f6;
      .photo{
        width:750rpx;
        background:purple;
        img{
          width:100%;
          display:block;
        }
      }
    }
    .detail_bottom{
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      height:100rpx;
      background:#fff;
      display: flex;
      .eve_de{
        flex: 1;
        border-radius: 0;
        background:purple;
        border:none;
        font-size:36rpx;
      }
      .eve_de:nth-child(1){
        background:#fff;
        display:flex;
        justify-content: space-around;
        align-items: center;
        font-size: 24rpx;
        color:#9A9DA5;
        .ico_sou{
          overflow: hidden;
          .ico_img{
            width:50rpx;
            height:50rpx;
            margin-bottom:4rpx;
            @include jcc;
            i{
              font-size: 40rpx;
            }
            .icon-shoucang-tianchong{
              color: $btnle;
            }
          }
          .ico_con{
            overflow: hidden;
          }
        }
      }
      .eve_de:nth-child(2){
        background:#FFB415;
        color:#fff;
        text-align: center;
        line-height: 100rpx;
      }
      .eve_de:nth-child(3){
        background:#F7094D;
        color:#fff;
        text-align: center;
        line-height: 100rpx;
      }
    }
    /* 弹出层 使屏幕变暗  */
    .commodity_screen {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      opacity: 0.2;
      overflow: hidden;
      z-index: 66;
      color: #fff;

    }
    /*对话框 */
    .commodity_attr_box {
      height: 760 rpx;
      width: 100%;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 999;
      background: #fff;
      padding-top: 20 rpx;
      /* 去掉默认滚动条 */
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }

      .fot_btn{
        position: absolute;
        width:710rpx;
        height:100rpx;
        background:$btnri;
        margin:10rpx 20rpx;
        text-align: center;
        line-height: 100rpx;
        color:#fff;
        left:0;
        bottom:10rpx;
        border-radius: 20rpx;
        z-index:9999;
      }
      .all_con_shop{
        width:710rpx;
        margin:0 20rpx;
        max-height:660rpx;
        float: left;
        overflow: scroll;
        padding-bottom:160rpx;
        .de_img_top{
          width:100%;
          height:200rpx;
          margin-top:20rpx;
          margin-bottom:34rpx;
          .le_de_im{
            width:200rpx;
            height:200rpx;
            background:gold;
            float: left;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
          .ri_de_im{
            float: left;
            width:450rpx;
            height:100%;
            margin:0 30rpx;
            .ri_de_pri{
              display: flex;
              align-items: center;
            }
            .ri_de_dec{
              font-size: 24rpx;
              color:$fontColor;
              margin-bottom:20rpx;
            }
            .ri_de_rul{
              font-size: 24rpx;
              color:#000;
            }
          }
        }
        .spec_selec{
          overflow: hidden;
          margin-bottom:30rpx;
          .spec_title{
            font-size: 32rpx;
            margin-bottom:20rpx;
          }
          .spec_type{
            div{
              color:#0D0D0F;
              background:rgba(237,237,237,1);
              float: left;
              font-size: 24rpx;
              padding:4rpx 24rpx;
              margin-right:22rpx;
              border-radius: 14rpx;
              margin-bottom:20rpx;
              position: relative;
              input{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                opacity: 0;
              }
              input:checked {
                background: #F7094D;
                color: #fff;
              }
            }
            .item.active{
              background: #F7094D;
              color: #fff;
            }
            .active{
              background:#F7094D;
              color:#fff;
            }
          }
        }
        .num_ad_can{
          overflow: hidden;
          @include jcsb;
          .num_ri{
            width:128rpx;
            height:38rpx;
            border:1px solid #AAAAAA;
            border-radius:6rpx;
            @include jcsb;
            div{
              border-right:1px solid #aaaaaa;
              height:38rpx;
              flex:1;
              text-align: center;
              line-height: 38rpx;
            }
            div:nth-child(3){
              border:0;
            }
          }
        }
        .fot_btn{
          position: fixed;
          width:710rpx;
          height:100rpx;
          background:$btnri;
          margin:10rpx 20rpx;
          text-align: center;
          line-height: 100rpx;
          color:#fff;
          left:0;
          bottom:10rpx;
          border-radius: 20rpx;
          z-index:999;
        }
      }
    }
    .active_type{
      background:#ed3269;
      color:#fff;
    }
    .standard_page{
      padding:0 20rpx;
      .stand_top{
        text-align: center;
        font-size:28rpx;
        padding:20rpx 0;
      }
      .all_stand_con{
        overflow: hidden;
        .eve_mes{
          display:flex;
          justify-content: space-between;
          border-bottom:2rpx solid #f6f6f6;
          padding:10rpx 0;
          span{
            font-size:28rpx;
          }
        }
      }
    }
    .standFooter{
      width:100%;
      height:80rpx;
      background: #f6829a;
      color: #fff;
      text-align: center;
      line-height:80rpx;
    }

    /* 解决滑动穿透问题，然而并没有完全解决 */
    .noscroll{
      top:0px;
      left: 0px;
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: fixed;
      z-index: 0;
    }
  }
</style>
