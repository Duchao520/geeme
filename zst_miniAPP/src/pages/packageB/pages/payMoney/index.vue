<template>
  <div class="index" @click.stop>

    <div class="back_index" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>

    <div class="pay">
      <div class="business">
          <div class="bus_left">
            <img :src="storeLogo" alt="">
          </div>
          <div class="bus_right">{{storeName}}</div>
      </div>

      <div class="inputContainer" :class="showLine?'okLine':'noLine'">
        <input type="text"
                name="shortprice"
                v-model="totalMoney"
                placeholder="输入本次需要支付金额"
                disabled="disabled">
          <div class="input_mask"  @click.stop="getfocus(1)" ></div>
      </div>

      <div class="input_inner" @click.stop="closeInner">
         <div class="in_in_le">
            <i  v-if="closeMes ==1"  class="iconfont icon-weigouxuanv2"></i>
            <i v-if="closeMes != 1" class="iconfont icon-tucenggouxuan" style="color:#FDB300;"></i>
         </div>
         <div class="in_in_ri">
            不参与打折金额
         </div>
      </div>
      <div class="input_mes" :class="showSecLine?'okSecLine':'noSecLine'" v-if="closeMes !=1">
         <input type="text"
                class="inputMoney"
                name="shortprice"
                v-model="noMoney"
                placeholder="输入不参与折扣的金额">
         <div class="input_mask" @click.stop="getfocus(2)"></div>
      </div>
    </div>
    <div class="first_active">
      <!--有卡主活动的时候显示，没有的话卡主就不显示-->
      <div class="all_car_pay" v-if="shareCardCount!=0 || selectCa ==3">
        <div class="carder_pay">
          <div class="all_le" @click.stop="selectCard">
            <div class="car_le">
              <i class="iconfont icon-duigou1" :class="ischeCar?'yesicon':'noicon'"></i>
            </div>
            <div class="car_mid">
              <div class="car_top"><span style="margin-right:10rpx;">选择共享卡</span> <span style="color:#fff;background:linear-gradient(268deg,rgba(214,146,92,1),rgba(214,155,109,1),rgba(243,214,179,1));font-size: 28rpx;padding:0 10rpx;">推荐使用</span> </div>
            </div>
          </div>
          <div class="car_ri" @click.stop="goSelectCard">
            <div style="margin-right:6rpx;" :style="{color:carColor}">-{{cardCountprice}}元</div>
            <i class="iconfont icon-iconfontjiantou5"></i>
          </div>
        </div>

        <div class="all_all_mid" @click.stop="goSelectCard">
          <div class="car_bot" style="margin-left:52rpx;">共享卡非会员也可使用，支付最低享{{lstSvipShareCard}}折</div>
        </div>
        <div class="carder_pay_bot" v-if="isShowcheCar" @click.stop="goSelectCard">
          <div class="carder_le">
            <div class="nickName_style">{{nick}}</div>
            <div style="font-size:24rpx;color:#8D8E98;">卡主</div>
          </div>
          <div class="use_num">
            <div>{{useNum}}次</div>
            <div style="font-size:24rpx;color:#8D8E98;">使用次数</div>
          </div>
          <div class="carder_mid">
            <div>{{money}}元</div>
            <div style="font-size:24rpx;color:#8D8E98;">卡主余额</div>
          </div>
          <div class="carder_ri">
            <div>{{shareCardDiscount * 1000/100}}折</div>
            <div style="font-size:24rpx;color:#8D8E98;">折扣</div>
          </div>
        </div>
      </div>
      <div class="showAcCou" v-if="showAcCou">
        <!--有商家活动的时候，并且满足条件的时候-->
        <div class="shop_active" v-if="biIntegralactiveCount!=0 && (sort_inner.length!=0  || biIntegralactive.discountType==1 || yesPay)"  :style="{marginTop:marginTop+'rpx'}" @click.stop="goShopActive">
          <div class="all_le">
            <div class="sh_le">
              <i class="iconfont icon-duigou1" :class="ischeShop?'yesicon':'noicon'"></i>
            </div>
            <div class="sh_ri">
              <div class="car_top">话呗抵扣活动</div>
              <div class="car_bot" v-if="biIntegralactive.discountType==1">商家折扣{{biIntegralactive.discountRate}}折，话呗抵扣{{worldDis}}元</div>
              <div class="car_bot" v-if="biIntegralactive.discountType==2">{{manJianActive}}</div>
              <div class="car_bot" style="color: #F7094D;" v-if="showWoFalse">话呗余额不足</div>
            </div>
          </div>
          <div class="all_ri" style="font-size: 28rpx;" :style="{color:activeColor}">
            {{ enjoyPrice }}
          </div>
        </div>
        <!--有商家活动，但是余额不足的时候-->
        <div class="shop_active" v-if="biIntegralactiveCount !=0 && sort_inner.length==0 && biIntegralactive.discountType==2 &&!yesPay"  :style="{marginTop:marginTop+'rpx'}"  @click.stop="payTerms">
          <div class="all_le">
            <div class="sh_le">
              <i class="iconfont icon-duigou1" :class="ischeShop?'yesicon':'noicon'"></i>
            </div>
            <div class="sh_ri">
              <div class="car_top">话呗抵扣活动</div>
              <div class="car_bot" v-if="biIntegralactive.discountType==1">话呗抵扣{{worldDis}}元</div>
              <div class="car_bot" v-if="biIntegralactive.discountType==2">{{manJianActive}}</div>
            </div>
          </div>
          <div class="all_ri" style="color:#F7094D;font-size: 28rpx" :class="selectCard">
            {{ enjoyPrice }}
          </div>
        </div>

        <!--没有商家活动的时候-->
        <div class="shop_active" v-if="biIntegralactiveCount ==0" :style="{marginTop:marginTop+'rpx'}" @click.stop="goShopActive">
        <div class="all_le">
          <div class="sh_le">
            <i class="iconfont icon-duigou1" :class="ischeShop?'yesicon':'noicon'"></i>
          </div>
          <div class="sh_ri">
            <div class="car_top">话呗抵扣活动</div>
            <div class="car_bot">暂无话呗抵扣活动</div>
          </div>
        </div>

        <div class="all_ri" style="color:#F7094D;font-size: 28rpx">
          {{ enjoyPrice }}
        </div>
      </div>
      </div>
    </div>

    <div class="showAcCou" v-if="showAcCou">

      <!--商家没有优惠券活动的时候-->
      <div class="cu_coupon" v-if='cardcouponCount ==0' @click.stop="goLogin">
        <div class="all_le">
          <div class="car_le">
            <i class="iconfont icon-duigou1" :class="ischeCou?'yesicon':'noicon'"></i>
          </div>
          <div class="car_mid">
            <div class="car_top">优惠券</div>
            <div class="car_bot">{{coupon_mes}}</div>
          </div>
        </div>
        <div class="car_ri">
          <div style="margin-right:6rpx;color:#8D8E98;">暂无优惠券</div>
        </div>
      </div>
      <!--商家有优惠券活动的时候-->
      <div class="cu_coupon" :class="clickIt?'okClick':'noClick'" v-if="cardcouponCount!=0" @click.stop="goCoupon">
        <div class="all_le" @click.stop="choseCoupon">
          <div class="car_le">
            <i class="iconfont icon-duigou1" :class="ischeCou?'yesicon':'noicon'"></i>
          </div>
          <div class="car_mid">
            <div class="car_top">优惠券</div>
            <div class="car_bot">{{coupon_mes}}</div>
            <div class="car_mid" style="color:#F7094D;font-size: 28rpx" v-if="coupon_notice!=''">{{coupon_notice}}</div>
          </div>
        </div>
        <div class="car_ri">
          <div style="margin-right:6rpx;" :style="{color:couColor}"> {{textInner}} </div>
          <i class="iconfont icon-iconfontjiantou5"></i>
        </div>
      </div>
    </div>
    <div class="btn_btn">
        <div class="btn_le">
            <span style="color:#F7094D;">已优惠{{disCountprice}}元，</span><span style="font-size: 30rpx">实需支付:{{shiji}}元</span>
        </div>
        <div class="btn_ri"  @click.stop="isSubmit">
           立即支付
        </div>
    </div>

    <div class='keyboard' v-if="InputHidden">
      <div class='left number'>
        <div data-key="1" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>1</div>
        <div data-key="2" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>2</div>
        <div data-key="3" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>3</div>
        <div data-key="4" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>4</div>
        <div data-key="5" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>5</div>
        <div data-key="6" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>6</div>
        <div data-key="7" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>7</div>
        <div data-key="8" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>8</div>
        <div data-key="9" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>9</div>
        <div data-key="X" :hover-class='active' :hover-stay-time='100' @click.stop=''></div>
        <div data-key="0" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>0</div>
        <div data-key="." :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>.</div>
      </div>
      <div class='right ctr-btn'>
        <div class='ctr-btn-item' :hover-class='active' :hover-stay-time='100' @click.stop='clear'>
          <label class='iconfont icon-shanchu'></label>
        </div>
        <div class='ctr-btn-item' :hover-class='active' :hover-stay-time='100' @click.stop='HiddenMes'>完成</div>
      </div>
    </div>

    <div class="pop_up" v-if="showItem">
      <div class="pop_up_inner">
        <div class="close_inner" @click="closeItInner">
          <img src="/static/img/close.png" alt="">
        </div>
        <div class="pop_up_top">
          <img src="../../static/img/paySuc.png" alt="">
        </div>
        <div class="pop_up_mid">
          <div class="mid_bot">
             共享卡余额不足，请选择其他活动或原价支付
          </div>
        </div>
        <div class="pop_up_bot">
          <div class="btn_le_le"  @click="originPay">
              原价支付
          </div>
          <button class="btn_ri" @click="againSelect">
              确定
          </button>
        </div>
      </div>
    </div>

    <div class="pop_up" v-if="showCardMesMes == 1">
      <div class="pop_up_inner">
        <div class="close_inner" @click="cancalMes">
          <img src="/static/img/close.png" alt="">
        </div>
        <div class="pop_up_top">
          <img src="../../static/img/paySuc.png" alt="">
        </div>
        <div class="pop_up_mid">
          <div class="mid_bot">
            {{noticeMesxinxi}}
          </div>
        </div>
        <div class="pop_up_bot">
          <div class="btn_le_le"  @click="cancalMes">
            取消
          </div>
          <button class="btn_ri" @click="confirmMes">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  import floatTo from '@/common/js/floatTo'
  import { mapMutations } from 'vuex'
  import { SHARECARDID , ISCOUPON ,ISSELECTCARD }  from '@/store/mutation-types'
  export default {
    name: "index",
    data(){
      return{
        noticeMesxinxi:'',
        par:{
          token:'',longitude:'',latitude:'',distance:'',shopStoreId:'',pageNum:1,pageSize:10,
        },
        totalMoney:'',
        noMoney:'',
        closeMes:1,
        storeLogo:'',
        storeName:'',
        money:'',
        sharecardId:'',
        shopStoreId:'',
        shareCardDiscount:'',
        InputHidden: false,
        lstSvipShareCard:'',
        shareCardCount:'',
        totOrno:'',
        inviterId:'',
        nick:'',
        ischeCar:false, //选中卡
        ischeShop:false,  //选中商家活动
        ischeCou:false,  //选中优惠券
        isShowcheCar:true,  //显示是否展示卡主优惠
        cardCountprice:0,
        disCountprice:0,   //优惠了多少
        shiji:0,           //实际支付了多少
        identification:'',
        cardcouponCount:'',
        textInner:'',
        biIntegralactive:{},
        worldDis:0,
        //在这里维护一下最下面显示的金额  优惠  实际支付
        disCou:0,
        marginTop:20,
        //优惠券
        couponNum:'',
        consumeMoney:0, //满多少
        couponMoney:0,  //减多少
        coupon_mes:'优惠券',
        biIntegralactiveCount:'',   //商家活动的数量
        worldUser:'',     //用户的话呗余额
        manJianActive:'商家有满减活动哦',
        showBtn:false,
        sortObj:[],  //满足条件的倒叙排序数组
        sort_inner:[],
        showAcCou:true,  //是否显示商家活动和优惠券
        yesPay:false,
        showLine:false,
        showSecLine:false,
        showShareId:'',
        showWoFalse:false,
        enjoyPrice:'- 0',
        shareuserId:'',
        id:'',
        // 按钮的控制
        clickIt:'',

        carColor:'#F7094D',
        activeColor:'#8D8E98',
        couColor:'#8D8E98',
        cardCouponActiveId:'',
        activeNum:'',
        isOriginPricePay:0,
        coupon_notice:'',
        dataList:[],
        showItem:false,
        useNum:'',
        // 维护一个共享卡是否足够的状态 1共享卡可匹配   0不可匹配
        yesMoney:1,
        onShowIt:1,

        scene:'',
        q:'',

        cardCalcu:'',      //最后计算完成后的实际金额
        newcardDiscount:'',    //最后计算完成后的优惠金额

        newActMoney:'',
        newActDiscount:'',

        newCouMoney:'',
        newCouDiscount:'',
        couponType:'',
        showCardMesMes:0,
        canPayMoney:'',
        selectCa:''
      }
    },
    onShow() {
      let sharecid= this.$store.state.shareCardId;
      let isCoupon = this.$store.state.isCoupon;
      if(sharecid && isCoupon ==0 && this.onShowIt ==1) {
        this.sharecardId = sharecid;
        this.getShareDetail();
      }
      if(this.totalMoney != '' && this.onShowIt ==1){
        if(this.ischeCar && this.$store.state.isSelectCard ==3){
          this.getShareDetail(8);
        }
      }
      let id = this.$store.state.id;
      let couponNum =this.$store.state.couponNum;
      let cardCouponActiveId = this.$store.state.cardCouponActiveId;
      if(id && couponNum && cardCouponActiveId && isCoupon ==1){
        this.couponNum = couponNum;
        this.id = id;
        this.cardCouponActiveId = cardCouponActiveId;
        this.getCoupond();
      }
    },
    onHide(){
       this.shareCardMes('');
       this.isCoupon('');
       this.isSelectCard('');
    },
    onUnload(){
      this.shareCardMes('');
      this.isCoupon('');
      this.isSelectCard('');
    },
    mounted(){
      var par = getQuery();
      let sharecid= this.$store.state.shareCardId;
      let isCoupon = this.$store.state.isCoupon;
      this.identification = par.identification ? par.identification : '';
       var token = this.$store.state.token;
       this.selectCa = this.$store.state.isSelectCard;
       /*if(token !='') {

       }else {
         if (par.scene) {
         this.scene = par.scene;
         const url = `../../../../pages/loginpage/main?scene=${par.scene}`;
         wx.navigateTo({url})
         }else{
           this.q = par.q;
           const url = `../../../../pages/loginpage/main?q=${par.q}`;
           wx.navigateTo({url})
         }
       }*/
      if(!(sharecid && isCoupon ==0) || (this.identification.indexOf('shopRecDet') > -1)) {
        this.shareCardMes('');
        this.isCoupon('');
        this.isSelectCard('');
      }
      this.sharecardId = this.$store.state.shareCardId ? this.$store.state.shareCardId : '';
      if (par.scene) {
        this.scene = par.scene;
        par.scene = decodeURIComponent(par.scene);
        var newArr = par.scene.split(',');
        this.shopStoreId = newArr[1];
        this.par.shopStoreId = newArr[1];
        this.selectCard();
      }else{
        this.shopStoreId = String(par.shopStoreId);
        this.par.shopStoreId = String(par.shopStoreId);
      }
      if(par.q){
        par.q = decodeURIComponent(par.q);
        var newObj = par.q.split('?');
        var newObjMes = newObj[1].split(',');
        this.shopStoreId = newObjMes[1];
        this.par.shopStoreId = newObjMes[1];
        this.selectCard();
      }
      this.par.token = token ? token : '';

      this.getList(this.par);
      this.getshareCardDetail();
      this.totalMoney = par.totalMoney ? par.totalMoney : '';
      this.shareuserId = par.shareuserId ? par.shareuserId : '';
      if (this.identification.indexOf('svipCard') > -1) {
        if (this.totalMoney != '') {
          this.getShareDetail();
        }
      }
      if (par.inviterId!='') {
        this.inviterId = par.inviterId ? par.inviterId:'';
      }
    },
    methods:{
      ...mapMutations({
        shareCardMes:'SHARECARDID',
        isCoupon:'ISCOUPON',      //是否是从优惠券过来的
        isSelectCard:'ISSELECTCARD',   //是否选过卡
      }),
      /**
       * 未登录前往登录
       */
      goLogin(){
        if(!this.$store.state.token){
          var par = getQuery();
          if (par.scene) {
            this.scene = par.scene;
            const url = `../../../../pages/loginpage/main?scene=${par.scene}`;
            wx.navigateTo({url})
          }else{
            this.q = par.q;
            const url = `../../../../pages/loginpage/main?q=${par.q}`;
            wx.navigateTo({url})
          }
        }

      },
      closeItInner(){
        this.showItem =false;
      },
      cancalMes(){
        this.showCardMesMes =0;
      },
      confirmMes(){
        this.ischeCar = false;
        this.choseCoupon(2);
        this.showCardMesMes =0;
      },
      backIndex(){
        wx.switchTab({
          url:'../../../../pages/index/main'
        })
      },
      getList(data){
        var _this = this;
        if(_this.$store.state.token){
          getSignIn(data).then(sec=>{
            _this.$http.recomShare(data,sec).then(res=>{
              if(res.state ==1) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].money = (res.data[i].money * 100 / 10000).toFixed(2);
                }
                _this.dataList = res.data;
                _this.currentData = res.data[0];
              }else{
                Tips.toast(decodeURIComponent(res.msg),'none');
              }
            })
          })
        }
      },
      inputPassword(e){
        if(this.totOrno ==1 ) {
          this.totalMoney = `${this.totalMoney}${e.target.dataset.key}`;
          if(String(this.totalMoney.length)>8){
            this.totalMoney = '';
          }
          this.totalMoney= /^[0-9]+([.]\d{1,2})?$/.test( this.totalMoney) ?
          this.totalMoney :  this.totalMoney.split('.')[1].length==2?
          this.totalMoney: this.totalMoney= this.totalMoney.split('.')[0]+'.'+ this.totalMoney.split('.')[1].substr(0,2)

          if(this.totalMoney !==e.target.dataset.key ){
             // this.HiddenMes();
          }
        }else if(this.totOrno == 2){
          this.noMoney = `${this.noMoney}${e.target.dataset.key}`;
          this.noMoney= /^[0-9]+([.]\d{1,2})?$/.test( this.noMoney) ?
          this.noMoney :  this.noMoney.split('.')[1].length==2?
          this.noMoney: this.noMoney= this.noMoney.split('.')[0]+'.'+ this.noMoney.split('.')[1].substr(0,2)
        }
      },
      HiddenMes() {
         this.InputHidden = false;  //取反 打开关闭小键盘
         this.showLine = false;
         this.showSecLine =false;
         this.showBtn = false;
         this.disCountprice = 0;
         this.shiji = 0;
        var totle,noMoney,disNumber,shiji;
        totle = Number(this.totalMoney);
        noMoney = Number(this.noMoney);
        if(this.shareCardCount!=0){
          let cardDisNumber = floatTo.multiply(Number(this.shareCardDiscount),10);  //折扣  0.9  *10 按整数计算防止精度丢失
          let wei = floatTo.subtract(totle,noMoney);
          this.cardCountprice = floatTo.divide(Math.floor((wei - wei * cardDisNumber / 10)*100),100);
        }
        else if(this.shareCardCount == 0){
          this.ischeCar = false;
          this.ischeShop = true;
          this.goShopActive(1);
        }
         if (Number(this.totalMoney) < Number(this.noMoney)) {
            Tips.toast('输入金额有误，请咨询商家确认', 'none');
            this.totalMoney = '';
            this.noMoney = '';
            this.disCountprice = 0;
            this.cardCountprice = 0;
            this.enjoyPrice = 0;
            return false
         }
         var _this = this;
         if(this.totalMoney !=''){
           if (_this.ischeCar) {
            if(_this.$store.state.isSelectCard !=3 ){  //这里是判断他是否选过卡
             let newObj = _this.cardBalance();
             let shiji = newObj.returnMoney;             //实际支付的金额
             if(shiji > _this.money){
               let list = [];
               let dataList = _this.dataList;
               dataList.forEach(function(e,index,array) {
                 //只考虑用总价格>满多少匹配到的活动
                 if ((Number(shiji)) <= e.money) {
                   list.push(array[index]);
                 }
               });
               if(list.length!=0){
                 _this.yesMoney = 1;
                 let id = list[0].id;
                 // 更新一下sharecardid
                 _this.shareCardMes(id);
                 _this.sharecardId = _this.$store.state.shareCardId;
                 _this.getShareDetail();
               }else{
                   _this.showItem = true;
                   _this.yesMoney =0;  //不可余额付款
               }
             }else{
               let list = [];
               let dataList = _this.dataList;
               dataList.forEach(function(e,index,array) {
                 //只考虑用总价格>满多少匹配到的活动
                 if ((Number(shiji)) <= e.money) {
                   list.push(array[index]);
                 }
               });
               if(list.length!=0){
                 let id = list[0].id;
                 this.yesMoney = 1;
                 // 更新一下sharecardid
                 _this.shareCardMes(id);
                 _this.sharecardId = _this.$store.state.shareCardId;
                 _this.getShareDetail();
               }
             }
             if(_this.ischeCou){
                 _this.choseCoupon(2);
             }else{
               _this.selectCard();
             }
           }else if(_this.$store.state.isSelectCard ==3){    //
              let newObj = _this.cardBalance();
              let shiji = newObj.returnMoney;             //实际支付的金额
              if(shiji > _this.money){
                this.showItem = true;
                this.yesMoney = 0;
              }else{
                this.yesMoney = 1;
              }
              _this.selectCard();
            }
           }
           if(_this.ischeCou){
             _this.choseCoupon(2);
           }else{
             if(_this.shareCardCount!=0) {
               _this.selectCard();
             }else{
               _this.goShopActive(1);
             }
           }
           if(_this.ischeCou && !_this.ischeCar && !_this.ischeShop){
             _this.choseCoupon();
           }
           if(!_this.ischeCar &&!_this.ischeShop &&!_this.ischeCou){
             totle = Number(_this.totalMoney);
             _this.shiji = totle;
             _this.disCountprice = 0;
           }
           if(_this.biIntegralactiveCount!=0){
             if(_this.biIntegralactive.discountType==1) {
               //判断是折扣的时候  这里是计算话呗抵扣了多少
               let disNumber = floatTo.divide(_this.biIntegralactive.discountRate*100,1000);
               let youhui = floatTo.multiply(_this.totalMoney,disNumber);
               let shifu = floatTo.subtract(_this.totalMoney,youhui);
               _this.worldDis = floatTo.divide((Math.floor(shifu * 100)),100);  //话呗抵扣多少钱
               if(!this.ischeShop) {
                 _this.enjoyPrice = -_this.worldDis;
               }
             }else if(_this.biIntegralactive.discountType==2){
               _this.sort_inner =[];
               // this.ischeShop = false;
               _this.getBalance(_this.totalMoney);    //如果是满减活动就去检测是否满足条件
             }
           }else{
             _this.enjoyPrice = 0;
           }
         }else{
           _this.disCountprice = 0;
           _this.cardCountprice = 0;
           let cuList = _this.dataList;
           if(cuList.length!=0) {
             let id = cuList[0].id;
             _this.sharecardId = id;
             _this.shareCardMes(id);
             _this.getShareDetail();
           }
         }
      },
      getBalance(par){
        var _this = this;
        if(_this.$store.state.token){
          var _data = {
            token:_this.$store.state.token,
          }
          getSignIn(_data).then(sec=>{
            _this.$http.getBalance(_data,sec).then(res=>{
              if(res.state == 1) {
                _this.worldUser = res.data.totalMoney;
                if(_this.biIntegralactive.discountType==2) {
                  _this.getshopDetail();
                }else if(_this.biIntegralactive.discountType==1){
                  _this.getDisActive(par);
                }else{
                  if(_this.shareCardCount == 0) {
                    _this.goShopActive(1);
                  }
                }
              }
            })
          })
        }
      },
      //如果是满减活动的情况下获取所有的满减活动，匹配是否有满足的
      getshopDetail(){
         var _data = {
           token:this.$store.state.token ? this.$store.state.token : '',
           storeId:this.shopStoreId,
         }
         var _this = this;
         _this.enjoyPrice = - 0;
         getSignIn(_data).then(sec=>{
            _this.$http.getActiveDetail(_data,sec).then(res=>{
              var dataList = res.data;
              if (dataList.length != 0) {
                let  sortNewObj = (dataList.sort(_this.compare('consumeMoney'))).reverse();
                // 判断话呗是否足够
                if(sortNewObj.length!=0){
                  let minConsumeMoney = sortNewObj[sortNewObj.length-1].consumeMoney;   //当前最小满多少
                  let noConsumeMoney = sortNewObj[sortNewObj.length-1].availableIntegral;   //当前最小减多少
                  if(_this.worldUser < noConsumeMoney){
                    _this.manJianActive = `话呗余额不足`;
                    _this.yesPay = false;
                    _this.enjoyPrice =0;
                    _this.isOriginPricePay = 1;
                  }else{
                    //话呗够最小的那个  输入金额和当前最小的满多少进行匹配，如果配不上无法享受优惠,enjoyPrice为0.此时应该是原价支付
                    var discountAmount;
                    if(_this.ischeCou){
                      discountAmount = floatTo.subtract(floatTo.subtract(Number(_this.totalMoney),Number(_this.noMoney)),_this.newCouDiscount);
                    }else{
                      discountAmount = floatTo.subtract(Number(_this.totalMoney),Number(_this.noMoney));
                    }
                    if(_this.totalMoney!='' && discountAmount < minConsumeMoney) {
                      let cha = floatTo.subtract(minConsumeMoney,discountAmount);     //还差多少满足优惠活动
                      _this.manJianActive = `满${minConsumeMoney}减${noConsumeMoney},当前还差${cha}元`;
                      _this.enjoyPrice = 0;
                      if(this.ischeShop){
                        this.goShopActive(1);
                      }
                     }else{
                          //如果满了最小满减，现在开始匹配活动，看看最大的是否满足
                          var list = [];
                          if(_this.ischeCou){
                            discountAmount = floatTo.subtract(floatTo.subtract(Number(_this.totalMoney),Number(_this.noMoney)),_this.newCouDiscount);
                          }else{
                            discountAmount = floatTo.subtract(Number(_this.totalMoney),Number(_this.noMoney));
                          }
                          dataList.forEach(function(e,index,array) {
                            //只考虑用总价格>满多少匹配到的活动
                            if (discountAmount >= e.consumeMoney) {
                              list.push(array[index]);
                            }
                          });
                          //找到当前满足条件的话呗满减活动，找到最大的那个匹配到的活动，以下的找到，取第一个，看看话呗是否足够
                          var sortObj = (list.sort(_this.compare('consumeMoney'))).reverse();  //倒叙排列
                          this.sortObj = sortObj;
                          if(sortObj.length!=0) {
                            if (_this.worldUser >= sortObj[0].availableIntegral) {  //话呗是否足够
                              _this.manJianActive = `满足优惠，满${sortObj[0].consumeMoney}减${sortObj[0].availableIntegral}`;
                              _this.enjoyPrice = `- ${sortObj[0].availableIntegral}`;
                              _this.activeNum = sortObj[0].id;
                              _this.yesPay = true;
                              _this.sort_inner = [];
                              if(this.ischeShop){
                                this.goShopActive(1);
                              }
                            } else {      //话呗不足的情况下，匹配下级活动
                              _this.pipei();
                              _this.yesPay = false;
                              if(this.ischeShop){
                                this.goShopActive(1);
                              }
                            }
                          }
                      }
                    }
                  }
              }else{
                 console.log('商家没有活动');
              }
            })
         })
      },
      //如果是折扣活动的情况下我们还需要更新一下
      getDisActive(par){
        var _this = this;
        let totle,noMoney,disNumber,disCou,shiji;
        totle = Number(_this.totalMoney);
        noMoney = Number(_this.noMoney);

        if (_this.biIntegralactive.discountType == 1) {
          // 找一下话呗的总金额是多少
          let worldMoney = _this.worldUser;   //总话呗金额
          // disNumber = _this.biIntegralactive.discountRate;   //7折
          //优惠了多少该怎么算  向下取整  0.01   0.7   0.007
          disNumber = floatTo.divide(_this.biIntegralactive.discountRate,10);  //折扣
          var youhui,discountAmount,newPage;
          if(_this.ischeCou) {
            discountAmount = floatTo.subtract(floatTo.subtract(_this.totalMoney,noMoney),_this.newCouDiscount);  //10.01
            youhui = floatTo.multiply(discountAmount, disNumber);  // 10.01  * 0.92  9.2092
            newPage = floatTo.divide((Math.ceil(floatTo.multiply(youhui,100))),100);  //9.21
            disCou =  floatTo.subtract(discountAmount,newPage); //话呗优惠了多少
          }else{
            discountAmount = floatTo.subtract(_this.totalMoney,noMoney);  //20
            youhui = floatTo.multiply(discountAmount, disNumber);   //20   0.92
            newPage = Math.ceil(youhui);    // 18.4
            disCou =(discountAmount * 100 - newPage)/100; //优惠了多少  1.6
          }
          if(worldMoney<disCou){
            _this.worldDis = disCou;
            _this.enjoyPrice = 0;
            _this.isOriginPricePay = 1;
            _this.showWoFalse = true;
          }else{
            _this.worldDis = disCou;
            _this.enjoyPrice = - disCou;
            _this.showWoFalse =false;
          }
          if(par==1){
            _this.goShopActive(1);
          }
        }
      },
      pipei(){
        var sortObj = this.sortObj;
        var sort_inner = [];
        for(let i=1;i<sortObj.length;i++){   //判断话呗是否匹配到一其中一个满减活动
          if(this.worldUser >= sortObj[i].availableIntegral){
            sort_inner.push(sortObj[i]);
          }
        }
        this.sort_inner = sort_inner;
        if(sort_inner.length!=0){  //如果能匹配到其中一个
          this.manJianActive = `话呗余额不足，已自动适配，满${sort_inner[0].consumeMoney}减${sort_inner[0].availableIntegral}`;
          this.enjoyPrice = `- ${sort_inner[0].availableIntegral}`
          this.activeNum = sort_inner[0].id;
          if(this.ischeShop){
            this.goShopActive(1);
          }
        }else{
          this.manJianActive = `话呗余额不足`;
          this.isOriginPricePay = 1;
          this.enjoyPrice = 0;
        }
      },
      payTerms(){
        if(this.totalMoney == ''){
           Tips.toast(`请输入金额`,'none');
           return false;
        }
      },
      compare (prop) {
        return function (obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
          }
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        }
      },
      getfocus(par){
        this.totOrno = par;
        this.InputHidden = true;
        if(this.totOrno == 1) {
          this.showLine = true;
          this.showSecLine = false;
        }
        else if(this.totOrno ==2){
          this.showLine = false;
          this.showSecLine = true;
        }
      },
      clear(){
        var str;
        if(this.totOrno == 1) {
          str = this.totalMoney;
          this.totalMoney = str.substr(0, str.length - 1);
          // this.selectCard();
        }else if(this.totOrno == 2){
          str = this.noMoney;
          this.noMoney = str.substr(0, str.length - 1);
        }
      },
      getonfocus(){
        this.HiddenMes();
      },
      isSubmit(){
        if(this.totalMoney == ''){
          Tips.toast('请输入金额','none');
          return false;
        }else if(this.totalMoney < 0.01){
          Tips.toast('你输入金额有点小哦', 'none');
          return false
        }else {
          if (Number(this.totalMoney) < 0.01) {
            Tips.toast('你输入金额有点小哦', 'none');
            this.totalMoney = '';
            return false
          }
          if ((!(/^\d+(\.\d{1,2})?$/.test(this.totalMoney) || /^\d$/.test(this.totalMoney)))) {
            Tips.toast('输入金额要精确到分', 'none');
            this.totalMoney = '';
            return false
          }
          if (Number(this.totalMoney) < Number(this.noMoney)) {
            Tips.toast('输入金额有误，请咨询商家确认', 'none');
            return false
          }
          if (this.noMoney != '') {
            if (!(/^\d+(\.\d{1,2})?$/.test(this.noMoney))) {
              Tips.toast('输入金额要精确到分', 'none');
              this.noMoney = '';
              return false
            }
          }
          /**
           * 消费总金额  this.totalMoney
           * 卡主抵扣  this.totalMoney - ((this.totalMoney - noMoney) * Number(this.shareCardDiscount)).toFixed(2);
           * 不参与打折金额
           * 实际支付
           * **/
          if(this.ischeCar && this.ischeCou && this.cardCountprice==0 && this.yesMoney==0){
             this.showCardMesMes = 1;
             this.noticeMesxinxi = ' 共享卡余额不足，你可以使用优惠券支付';
          }else if(this.ischeCar && this.ischeCou && this.cardCountprice==0 && this.yesMoney==1){
            this.showCardMesMes = 1;
            this.noticeMesxinxi = ' 共享卡不参与抵扣，你可以使用优惠券支付';
          }
          if (this.ischeCar && this.cardCountprice!=0 ) {
             let totle,noMoney,disNumber,disCou,shiji;
             totle = Number(this.totalMoney);   //总价格
             noMoney = Number(this.noMoney);    //不打折金额
             disNumber = Number(this.shareCardDiscount) * 10;    //折扣
             disCou =  this.disCountprice;
             shiji = this.shiji;
             this.payMoneyFun(totle,noMoney,disCou,shiji);
          }
          if(this.ischeShop && !this.ischeCou){
            var _this = this;
            if(_this.shareCardCount ==0){
              let totle,noMoney,disNumber,disCou,shiji;
              totle = Number(_this.totalMoney);
              noMoney = Number(_this.noMoney);
              disCou =  _this.disCountprice;
              shiji = _this.shiji;
              _this.payApiFun(totle,noMoney,disCou,shiji);
            }else{
              let totle,noMoney,disNumber,disCou,shiji;
              totle = Number(_this.totalMoney);
              noMoney = Number(_this.noMoney);
              disCou =  _this.disCountprice;
              shiji = _this.shiji;
              _this.payApiFun(totle,noMoney,disCou,shiji);
            }
          }
          if(this.ischeShop && this.ischeCou){
              var _this = this;
              let totle,noMoney,disNumber,disCou,shiji;
              totle = Number(_this.totalMoney);
              noMoney = Number(_this.noMoney);
              disCou =  _this.disCountprice;
              shiji = _this.shiji;
              _this.payApiFun(totle,noMoney,disCou,shiji);
          }
          if(this.ischeCou && !this.ischeShop && !this.ischeCar){
            var _this = this;
            if(_this.shareCardCount ==0){
                let totle,noMoney,disNumber,disCou,shiji;
                var consumeMoney = _this.consumeMoney;   //满多
                totle = Number(_this.totalMoney);
                noMoney = Number(_this.noMoney);
                disCou = _this.disCountprice;
                shiji = _this.shiji;
                // if(totle>=consumeMoney) {
                //   disCou = _this.couponMoney;
                //   _this.disCountprice = disCou;   //优惠的价格
                //   shiji = (totle - _this.couponMoney);
                //   shiji = (Math.round(shiji * 100) / 100); //实际支付的金额
                //   if(shiji<0){
                //     _this.shiji = 0;
                //   }else{
                //     _this.shiji = (Math.round(shiji * 100) / 100);
                //   }
                // }else{
                //   disCou = 0;
                //   shiji = totle;
                //   _this.disCountprice = 0;
                //   if(shiji<0){
                //     _this.shiji = 0;
                //   }else{
                //     _this.shiji = shiji;
                //   }
                // }
                _this.payApiFun(totle, noMoney, disCou, shiji);
            }else{
                let totle,noMoney,disNumber,disCou,shiji;
                // var consumeMoney = _this.consumeMoney;   //满多
                // totle = Number(_this.totalMoney);
                // noMoney = Number(_this.noMoney);
                // if(totle>=consumeMoney) {
                //   disCou = _this.couponMoney;
                //   _this.disCountprice = disCou;   //优惠的价格
                //   shiji = (totle - _this.couponMoney);
                //   shiji = (Math.round(shiji * 100) / 100); //实际支付的金额
                //   if(shiji<0){
                //     _this.shiji = 0;
                //   }else{
                //     _this.shiji = (Math.round(shiji * 100) / 100);
                //   }
                // }else{
                //   disCou = 0;
                //   shiji = totle;
                //   _this.disCountprice = 0;
                //   if(shiji<0){
                //     _this.shiji = 0;
                //   }else{
                //     _this.shiji = shiji;
                //   }
                // }
                totle = Number(_this.totalMoney);
                noMoney = Number(_this.noMoney);
                disCou = _this.disCountprice;
                shiji = _this.shiji;
                _this.payApiFun(totle, noMoney, disCou, shiji);
            }
          }
          if((!this.ischeCar || this.cardCountprice==0) &&!this.ischeShop &&!this.ischeCou){
            let totle,noMoney,disNumber,disCou,shiji;
            totle = Number(this.totalMoney);
            noMoney = Number(this.noMoney);
            shiji = totle;
            disCou = 0;
            this.shiji =totle;
            this.disCountprice = 0;
            this.payMoneyFun(totle,noMoney,disCou,totle);
          }
        }
      },
      //小程序支付确认框
      // 小程序支付的函数
      originPay(){
        let totle,noMoney,disNumber,disCou,shiji;
        totle = Number(this.totalMoney);   //总价格
        noMoney = Number(this.noMoney);    //不打折金额
        disNumber = floatTo.multiply(Number(this.shareCardDiscount),10);    //折扣
        disCou = 0;
        shiji = totle;
        this.payMoneyFun(totle,noMoney,disCou,shiji);
        this.showItem = false;
      },
      closeInner(){
        if(this.closeMes == 1) {
          this.closeMes = 0;
        }else{
          this.closeMes=1;
          this.noMoney = '';
          this.HiddenMes();
        }
      },
      getShareDetail(parma){
        var _data={
          token:this.$store.state.token,
          shareCardId:this.sharecardId
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getSvipDetail(_data,sec).then(res=>{
             if(res.state ==1){
               _this.nick = res.data.realName;
               _this.shareCardDiscount = '';
               _this.shareCardDiscount = res.data.shareCardDiscount;
               if(_this.shareCardCount ==0) {
                 _this.lstSvipShareCard = floatTo.multiply(_this.shareCardDiscount,10 )? floatTo.multiply(_this.shareCardDiscount,10 ) : 0;
               }
               _this.useNum = res.data.consumeAmount ? res.data.consumeAmount:0;
               _this.money =floatTo.divide(res.data.money,100);
               if(parma ==8 ){
                 _this.HiddenMes();
               }
               if(_this.ischeCou){

               }else{
                 _this.selectCard();
                 _this.ischeCar = true;
                 _this.ischeShop = false;
                 _this.ischeCou = false;
               }
             }
          })
        })
      },
      getCoupond(){
         var _data = {
            token:this.$store.state.token,
            couponNum:this.couponNum,
            id:this.id
         }
         var _this = this;
         getSignIn(_data).then(sec=>{
           _this.$http.getCouDetail(_data,sec).then(res=>{
              if(res.state==1){
                _this.consumeMoney = res.data.consumeMoney;   //满多少
                _this.couponMoney = res.data.couponMoney;    //减多少
                _this.textInner = '';
                _this.textInner = `-${_this.couponMoney}`;
                _this.couponType = res.data.couponType;
                if(res.data.couponType ==1) {
                  _this.coupon_mes = `满${_this.consumeMoney}减${_this.couponMoney}`;
                }else if(res.data.couponType ==2){
                  _this.coupon_mes = `现金券${_this.couponMoney}`;
                }
                _this.choseCoupon();
              }else{
                Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
              }
           })
         })
      },
      getshareCardDetail(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token ? _this.$store.state.token : '',
          shopStoreId:_this.shopStoreId,
          wxUnionId:_this.$store.state.unionid? _this.$store.state.unionid :'',
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getPayDetail(_data,sec).then(res=>{
            if(res.state ==1){
              _this.storeLogo = res.bishopStore.storeLogo;  //商家logo
              _this.storeName = res.bishopStore.storeName;   //商家名称
              //卡主相关
              if(_this.$store.state.shareCardId=='') {
                _this.nick = res.data.realName ? res.data.realName : '';
                _this.shareCardDiscount = res.data.shareCardDiscount;
                if(res.data.money) {
                  _this.money = floatTo.divide(res.data.money, 100);
                }
                _this.useNum = res.data.consumeAmount ? res.data.consumeAmount:0;
                if(res.data.id){
                  _this.shareCardMes(res.data.id ?res.data.id:'');
                  _this.sharecardId = _this.$store.state.shareCardId;
                  _this.getShareDetail();
                  // _this.sharecardId = res.data.id;
                }
              }else{
                _this.sharecardId = _this.$store.state.shareCardId;
                _this.getShareDetail();
              }
              _this.cardcouponCount = res.cardcouponCount;  //优惠券数量
              _this.biIntegralactiveCount = res.biIntegralactiveCount; //商家活动数量
              _this.activeNum = res.biIntegralactive.id;
              _this.showShareId = res.data.id;    //默认的最低折扣。永远不会变
              //商家活动  话呗抵扣多少钱
              _this.biIntegralactive = res.biIntegralactive;
              //判断商家活动类型
              _this.shareCardCount = res.shareCardCount;   //分享卡数量
              if(_this.shareCardCount ==0){
                 // _this.showClosePage = false;
                 _this.ischeCar = false;
                 _this.ischeShop = true;
              }
              _this.marginTop = _this.shareCardCount ==0 ? 26 : 0;
              //商家收银活动判断  1是有的    0没有                  _this.shopPayChannelCount
              //是否是卡主   判断是否有卡  _this.shareCardCount
              if(_this.shareCardCount !=0) {
                _this.lstSvipShareCard = floatTo.multiply(Number(res.data.shareCardDiscount), 10);   //显示最低折扣
              }
              _this.shopPayChannelCount = res.shopPayChannelCount;
              //卡主收银都开通
              if( _this.shopPayChannelCount==1 && _this.shareCardCount!=0){
                    _this.showAcCou = true;
              }
              // 卡主或则收银开通一个
              if(_this.shopPayChannelCount==1 ||_this.shareCardCount!=0){
                   if(_this.shopPayChannelCount==1){
                      _this.showAcCou = true;
                   }else{
                     _this.showAcCou =false;
                   }
              }
              //卡主收银都未开通
              if(_this.shopPayChannelCount==0 &&_this.shareCardCount==0){
                   _this.showAcCou =false;
                   wx.redirectTo({
                     url:`/pages/packageD/pages/noticeMes/main?storeLogo=${_this.storeLogo}&storeName=${_this.storeName}`
                   })
              }
              if(this.identification.indexOf('shopRecDet')>-1) {
                _this.textInner = `共${ _this.cardcouponCount}张`;
                if(_this.shareCardCount!=0) {
                  _this.getShareDetail();
                  _this.ischeCar = true;
                  _this.ischeShop = false;
                  _this.ischeCou = false;
                }else{
                  _this.ischeShop = true;
                  _this.ischeCou = false;
                }
              }else if(_this.identification.indexOf('svipCard')>-1){
                 _this.textInner = `共${ _this.cardcouponCount}张`;
                 _this.getShareDetail();
              }else if(_this.identification.indexOf('couponPage')>-1){
                console.log(`我是从${_this.identification}过来的`);
              }else{
                // _this.sharecardId = res.data.id;      //这里是真实的id
                console.log(`我是从${_this.identification}过来的`);
              }
              _this.getBalance();
            }else if(res.state == '10000'){
              if (_this.scene) {
                const url = `../../../../pages/loginpage/main?scene=${_this.scene}`;
                wx.navigateTo({url})
              }else{
                const url = `../../../../pages/loginpage/main?q=${_this.q}`;
                wx.navigateTo({url})
              }
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },
      goSelectCard(){
        var _this = this;
        if(_this.$store.state.token){
          _this.onShowIt = 1;
          if(_this.shareCardCount !=0) {
            wx.navigateTo({
              url: `../../pages/svipCard/main?shopStoreId=${_this.shopStoreId}&totalMoney=${_this.totalMoney}`
            })
          }
        }else{
          _this.goLogin();
        }
      },
      againSelect(){
       this.showItem = false;
      },
      //选卡
      selectCard(par){
        this.ischeShop = false;
        if(this.ischeCou && par!=1){   //如果没有选中优惠券并且 不是因为选中优惠券调用，就不切换状态
           if(this.ischeCar){
             this.ischeCar =!this.ischeCar;
             this.choseCoupon(2);
           }else{
             this.ischeCar =!this.ischeCar;
             this.choseCoupon(2);
             this.carColor='#F7094D';
             this.activeColor='#8D8E98';
             this.couColor='#8D8E98';
             // this.showClosePage = true;
             let newObj = this.cardBalance();
             this.shiji = newObj.shiji < 0 ? 0 : newObj.shiji;             //实际支付的金额
             this.disCountprice =  newObj.disCou;      //选择卡时显示的折扣金额
           }
        }else{
          this.ischeCar = true;
          this.carColor='#F7094D';
          this.activeColor='#8D8E98';
          this.couColor='#8D8E98';
          // this.showClosePage = true;
          let newObj = this.cardBalance();
          this.shiji = newObj.shiji <0? 0: newObj.shiji;             //实际支付的金额
          this.disCountprice =  newObj.disCou;      //选择卡时显示的折扣金额
        }
      },
      //选活动
      goShopActive(par){
        if(this.$store.state.token){
          var _this = this;
          _this.ischeCar = false;
          if(this.ischeCou && par!=1){
            if(this.ischeShop){
              this.ischeShop = !this.ischeShop;
              this.choseCoupon(2);
            }else{
              this.ischeShop = !this.ischeShop;
              this.choseCoupon(2);
            }
          }else{
            _this.ischeShop = true;
            if(par!=1) {
              _this.getBalance(1);
            }
          }
          // _this.showClosePage = false;
          if(_this.ischeShop) {
            _this.carColor = '#8D8E98';
            _this.activeColor = '#F7094D';
            _this.couColor = '#8D8E98';
            let totle, noMoney, disNumber, disCou, shiji, discountAmount, youHui, jianFa;
            //如果是折扣的话
            totle = Number(_this.totalMoney);
            noMoney = Number(_this.noMoney);
            if (_this.totalMoney != '') {
              if (_this.biIntegralactive.discountType == 1) {
                // 找一下话呗的总金额是多少
                let worldMoney = _this.worldUser;   //总话呗金额
                disNumber = _this.biIntegralactive.discountRate;   //7折
                //优惠了多少该怎么算  向下取整  0.01   0.7   0.007
                let zheKou = floatTo.divide(disNumber, 10);
                if (_this.ischeCou) {
                  discountAmount = floatTo.subtract(floatTo.subtract(totle, noMoney), _this.newCouDiscount);  //10.01
                  youHui = floatTo.multiply(discountAmount, zheKou);   //10.01 * 0.92
                  jianFa = floatTo.divide((Math.ceil(floatTo.multiply(youHui, 100))), 100);  //10.01 - 9.2092
                  disCou = floatTo.subtract(discountAmount, jianFa); //选择优惠卷时 花呗优惠的金额
                } else {
                  discountAmount = floatTo.subtract(totle, noMoney);
                  youHui = floatTo.multiply(discountAmount, zheKou);
                  jianFa = floatTo.subtract(discountAmount, youHui);
                  disCou = Math.floor(floatTo.multiply(jianFa, 100)) / 100; //打折的金额
                }
                if (worldMoney < disCou) {
                  shiji = totle;
                  _this.worldDis = 0;
                  _this.enjoyPrice = 0;
                  if (_this.ischeCou) {
                    _this.disCountprice = floatTo.add(0, _this.newCouDiscount);
                    _this.shiji = floatTo.subtract(shiji, _this.newCouDiscount) < 0 ? 0:floatTo.subtract(shiji, _this.newCouDiscount);
                    _this.showWoFalse = true;
                    _this.isOriginPricePay = 0;
                  } else {
                    _this.disCountprice = 0;
                    _this.shiji = shiji < 0 ? 0: shiji;
                    _this.showWoFalse = true;
                    _this.isOriginPricePay = 1;
                  }
                } else {
                  shiji = floatTo.subtract(totle, disCou);  //打完折之后的价格
                  _this.worldDis = disCou;
                  _this.enjoyPrice = disCou;
                  if (_this.ischeCou) {
                    let discountAmount = floatTo.subtract(floatTo.subtract(totle, noMoney), _this.newCouDiscount);  //10.01
                    _this.disCountprice = floatTo.add(disCou, _this.newCouDiscount);      //优惠了多少
                    if (!(_this.shiji < 0)) {
                      _this.shiji = floatTo.add(floatTo.subtract(discountAmount, disCou),noMoney);             //实际支付的金额
                    }else{
                      _this.shiji = 0;
                    }
                    _this.showWoFalse = false;
                    _this.isOriginPricePay = 0;
                  } else {
                    let discountAmount = floatTo.subtract(floatTo.subtract(totle, noMoney), disCou);
                    _this.disCountprice = disCou;      //优惠了多少
                    _this.shiji = floatTo.add(discountAmount,noMoney) < 0 ? 0:floatTo.add(discountAmount,noMoney);             //实际支付的金额
                    _this.showWoFalse = false;
                    _this.isOriginPricePay = 0;
                  }
                }

              }
              //如果是满减
              else if (_this.biIntegralactive.discountType == 2 && (_this.sort_inner.length != 0 || _this.yesPay) && _this.enjoyPrice != 0) {
                if (_this.sort_inner.length != 0) {
                  disCou = _this.sort_inner[0].availableIntegral;
                  shiji = floatTo.subtract(totle, _this.sort_inner[0].availableIntegral);
                }
                if (_this.yesPay && _this.enjoyPrice != 0) {
                  disCou = _this.sortObj[0].availableIntegral;
                  shiji = floatTo.subtract(totle, _this.sortObj[0].availableIntegral);
                }
                if (_this.ischeCou) {
                  shiji = floatTo.subtract(shiji, _this.newCouDiscount); //实际支付的金额
                  this.disCountprice = floatTo.add(disCou, _this.newCouDiscount);      //选择商家活动时应该显示的金额
                  this.shiji = shiji;             //实际支付的金额
                } else {
                  shiji = (floatTo.divide(Math.round(floatTo.multiply(shiji,100)),100)); //实际支付的金额
                  this.disCountprice = disCou;      //选择商家活动时应该显示的金额
                  this.shiji = shiji;             //实际支付的金额
                }
              } else {
                disCou = 0;
                shiji = totle;
                shiji = (Math.round(shiji * 100) / 100); //实际支付的金额
                if (_this.ischeCou) {
                  this.disCountprice = floatTo.add(disCou, _this.newCouDiscount);      //选择商家活动时应该显示的金额
                  this.shiji = floatTo.subtract(shiji, _this.newCouDiscount);             //实际支付的金额
                } else {
                  this.disCountprice = disCou;      //选择商家活动时应该显示的金额
                  this.shiji = shiji;             //实际支付的金额
                }
              }
            } else {
              _this.disCountprice = 0;      //选择商家活动时应该显示的金额
              _this.shiji = 0;             //实际支付的金额
            }
          }
        }else{
          this.goLogin();
        }

      },
      // 选优惠券
      choseCoupon(par){
        let totle,noMoney,disNumber,disCou,shiji;
        totle = Number(this.totalMoney);    //减多少
        noMoney =Number(this.noMoney);
        var couponMoney = Number(this.couponMoney);   //减多少
        var consumeMoney = Number(this.consumeMoney);  //满多少
        if(totle ==''){
          Tips.toast('请输入金额','none');
          return false
        }
        if(!couponMoney){
          Tips.toast('请选择优惠券','none');
          return false;
        }else{
          let newArr = [2,3]
          if(!newArr.includes(par)) {
            if (this.ischeCou) {
              this.ischeCou = !this.ischeCou
            } else {
              this.ischeCou = !this.ischeCou
            }
          }
          this.carColor='#8D8E98';
          this.activeColor='#8D8E98';
          this.couColor='#F7094D';
          let discountAmount = floatTo.subtract(totle,noMoney);  //10  不参与
          let canPayMoney = floatTo.subtract(discountAmount,couponMoney);    //不参与 - 代金券金额
          this.canPayMoney = canPayMoney;
          if(discountAmount < consumeMoney && this.couponType==1){   //20   10
            this.coupon_notice = '优惠券不可用';
            totle = Number(this.totalMoney);
            noMoney = Number(this.noMoney);
            this.disCountprice = 0;   //优惠的价格
            this.textInner = 0;
            shiji = totle;
            this.shiji = shiji;
            this.newCouMoney = shiji;
            this.newCouDiscount = 0;
            if(this.ischeShop){
               this.getBalance(1);
            }else if(this.ischeCar){
               this.selectCard(1);   //告诉选卡不要切换状态
            }else if(!this.ischeShop && !this.ischeCar &&!this.ischeCou){
              if(this.shareCardCount!=0) {
                this.selectCard();
              }else{
                this.ischeShop = true;
                this.getBalance(1);
              }
            }
          }else if(this.couponType==2 && canPayMoney < 0){
                this.disCountprice = discountAmount;  //参与
                let disCountprice = discountAmount;
                this.shiji = floatTo.subtract(totle,disCountprice);
                shiji = floatTo.subtract(totle,disCountprice);
                this.newCouMoney = shiji;
                this.newCouDiscount = disCountprice;
                this.textInner = disCountprice;
                if(this.ischeShop){
                  // this.goShopActive()
                  this.getBalance(1);
                }else if(this.ischeCar){
                  this.selectCard(1);
                }else if(!this.ischeShop && !this.ischeCar &&!this.ischeCou){
                  if(this.shareCardCount!=0) {
                    this.selectCard();
                  }else{
                    this.ischeShop = true;
                    this.getBalance(1);
                  }
                }
          }else{
            this.coupon_notice = '';
            totle = Number(this.totalMoney);
            noMoney = Number(this.noMoney);
            this.disCountprice = '';
            this.disCountprice = this.couponMoney;   //优惠的价格
            this.textInner = `-${this.disCountprice}`;
            shiji = floatTo.subtract(totle,Number(this.couponMoney));
            if(!(shiji<0)) {
              this.shiji = shiji;
            }else{
              this.shiji = 0;
            }
            this.newCouMoney = shiji;
            this.newCouDiscount = this.couponMoney;
            if(this.ischeShop){
              // this.goShopActive()
              this.getBalance(1);
            }else if(this.ischeCar){
              this.selectCard(1);
            }else if(!this.ischeShop && !this.ischeCar &&!this.ischeCou){
              if(this.shareCardCount!=0) {
                this.selectCard();
              }else{
                this.ischeShop = true;
                this.getBalance(1);
              }
            }
          }
        }
        // this.showClosePage = false;
      },
      goCoupon(){
        var _this = this;
        wx.navigateTo({
          url:`../../pages/couponPage/main?shopStoreId=${_this.shopStoreId}&sharecardId=${_this.sharecardId}&totalMoney=${_this.totalMoney}`
        })
      },
      cardBalance(){
        let totle=0,noMoney=0,disNumber=0,disCou=0,shiji=0,noEnjoy=0,actual=0,isCheckCard=0,returnMoney;
        if(this.ischeCou){
          // totle = floatTo.subtract(Number(this.totalMoney),this.newCouDiscount);   //总价格
          totle = Number(this.totalMoney);   //总价格
          noMoney = Number(this.noMoney);    //不打折金额
          disNumber = Number(this.shareCardDiscount);  //折扣
          isCheckCard =floatTo.subtract(totle,this.newCouDiscount);  // 如果选中优惠券先减去
          noEnjoy = Number(floatTo.subtract(isCheckCard,noMoney));    //参与打折的金额  20  10  10
          let enjoyMoneyDis = floatTo.multiply(noEnjoy , disNumber);   //参与打折的金额 * 折扣
          returnMoney = enjoyMoneyDis;
          let disVc = floatTo.subtract(noEnjoy,enjoyMoneyDis);   //优惠了多少
          if(this.couponType ==2) {
            if (this.canPayMoney < 0) {
              actual = 0;  //向下取整
            } else {
              actual = (Math.floor(floatTo.multiply(disVc, 100))) / 100;  //向下取整
            }
          }else{
            actual = (Math.floor(floatTo.multiply(disVc, 100))) / 100;  //向下取整
          }
        }else{
          totle = Number(this.totalMoney);   //总价格
          noMoney = Number(this.noMoney);    //不打折金额
          disNumber = Number(this.shareCardDiscount);  //折扣
          noEnjoy = Number(floatTo.subtract(totle,noMoney));  //参与打折的金额
          let enjoyMoneyDis = floatTo.multiply(noEnjoy , disNumber);
          returnMoney = enjoyMoneyDis;
          let disVc = floatTo.subtract(noEnjoy,enjoyMoneyDis);  //参与打折金额优惠的
          actual = (Math.floor(floatTo.multiply(disVc,100)))/100;
        }
        // 0.01   实际 （0.01- 0.01 * 0.88）  0.0088 0.88
        if(this.yesMoney ==1) {
          if(this.ischeCou) {
            disCou = floatTo.add(actual,this.newCouDiscount) ; //打折的金额
          }else{
            disCou = actual; //打折的金额
          }
          this.cardCountprice = actual;
          if(!(shiji<0)) {
            shiji = floatTo.subtract(totle, disCou);
          }else{
            shiji = 0;
          }
        }else{
          if(this.ischeCou){
            disCou = floatTo.add(0 ,this.newCouDiscount) ; //打折的金额
            shiji = floatTo.subtract(totle,disCou);
          }else{
            disCou = 0;
            shiji = floatTo.subtract(totle,disCou);
          }
          this.cardCountprice = 0;
        }
        return {shiji: shiji, disCou: disCou,returnMoney:returnMoney}
      },
      payMoneyFun(totle,noMoney,disCou,shiji){
        var _this = this;
        var ll = _this.shopStoreId;
        var _cd = {
          token: _this.$store.state.token,
          shopStoreId: ll.replace(/\s*/g, ""),
        }
        var couponId,couponIdMes;
        if(_this.ischeCou && _this.newCouDiscount!=0) {
          couponId = _this.id ? _this.id:'';
          couponIdMes = '优惠券活动';
        }else{
          couponId ='';
          couponIdMes = '';
        }
        getSignIn(_cd).then(sec => {
          _this.$http.payMoney(_cd, sec).then(res => {
            if (res.state == 1) {
              var _data = {
                // isShareDiscountCard:1,
                storeId: res.data.shopStoreId,
                trmNo: res.data.channelTrmNO,
                mercId: res.data.channelStoreNum,
                no: 0,
                openid: _this.$store.state.openId ? _this.$store.state.openId : '',
                amount: floatTo.multiply(shiji,100),
                totalAmount: floatTo.multiply(totle,100),
                subject: encodeURI(`${_this.storeName}共享卡付款,${couponIdMes}`),
                shareuserId:'',
                sharecardId: _this.sharecardId,
                userId: _this.$store.state.userLiId ? _this.$store.state.userLiId : '',
                miniAppId: 'wx5e11922e81e3951d',
                wxUnionId: _this.$store.state.unionid ? _this.$store.state.unionid : '',
                nonPartakeMoney: floatTo.multiply(_this.noMoney,100),
                isOriginPricePay:'',
                couponId:couponId ? couponId :'',
              }
              _data.isOriginPricePay = _this.yesMoney == 0 ? 1:0;  //共享卡是否可匹配  0 不可  原价支付
              _this.onShowIt = 1;
              if(_this.inviterId){
                _data.shareuserId = _this.inviterId;
              }else if(_this.shareuserId){
                _data.shareuserId = _this.shareuserId;
              }else{
                _data.shareuserId ='';
              }
              getSignIn(_data).then(sec => {
                _this.$http.wxPay(_data, sec).then(dd => {
                  if (dd.state == 1) {
                    if(dd.data.resultCode != -1) {
                      wx.requestPayment({
                        timeStamp: dd.data.apiTimestamp,
                        nonceStr: dd.data.apiNoncestr,
                        package: dd.data.apiPackage,
                        signType: dd.data.apiSigntype,
                        paySign: dd.data.apiPaysign,
                        success: function (cc) {
                          Tips.toast(`付款成功`, 'none');
                          _this.shareCardMes('');
                          _this.isCoupon('');
                          _this.isSelectCard('');
                          wx.navigateTo({
                            url: `../../pages/paySuc/main?orderNum=${dd.orderNum}&shopStoreId=${_this.shopStoreId}&shareCardId=${_this.sharecardId}`
                          })
                        },
                        fail: function (res) {
                          if (res.errMsg == 'requestPayment:fail cancel') {
                            _this.onShowIt = 0;      //来个开关用来告诉onshow是否要执行这个方法
                          }
                        },
                        complete: function (res) {
                          _this.showItem = false;
                        }
                      })
                    }else{
                      Tips.toast(`${dd.data.message}`, 'none');
                    }
                  }else if(dd.state == 900260){
                    _this.showItem = true;
                    // Tips.toast(`共享卡余额不足`, 'none');
                  }  else {
                    Tips.toast(`${dd.msg}`, 'none');
                  }

                })
              })
            } else {
              Tips.toast(`${decodeURIComponent(res.msg)}`, 'none');
            }
          })

        })
      },
      payApiFun(totle,noMoney,disCou,shiji){
        var _this = this;
        var ll = _this.shopStoreId;
        var _cd = {
          token: _this.$store.state.token ? _this.$store.state.token : '',
          shopStoreId: ll.replace(/\s*/g, ""),
        }
        getSignIn(_cd).then(sec => {
            _this.$http.payMoney(_cd, sec).then(res => {
              if (res.state == 1) {
                var activeNum,couponId,integralCount,couponActiveMes;
                if(_this.ischeShop && !_this.ischeCou) {
                  if(_this.enjoyPrice==0) {
                    activeNum = '';
                  }else{
                    activeNum = _this.activeNum ? _this.activeNum : '';
                  }
                   couponId = '';
                   couponActiveMes = '商家话呗活动'
                }else if(!_this.ischeShop && _this.ischeCou){
                  activeNum = '';
                  couponId = _this.id ? _this.id:'';
                  couponActiveMes = '优惠券活动'
                }else if(_this.ischeShop && _this.ischeCou){
                  if(_this.enjoyPrice ==0) {
                    activeNum = '';
                  }else{
                    activeNum = _this.activeNum ? _this.activeNum : '';
                  }
                  if(_this.newCouDiscount==0){
                    couponId = '';
                  }else{
                    couponId = _this.id ? _this.id:'';
                    couponActiveMes = '商家话呗活动,优惠券活动'
                  }
                }
                //判断是否是原价支付
                if(shiji != totle){
                  _this.isOriginPricePay =0;
                }else{
                  _this.isOriginPricePay =1;
                }
                var _data = {
                  storeId: _this.shopStoreId,
                  trmNo: res.activeBiShoppaychannel.channelTrmNO,
                  mercId: res.activeBiShoppaychannel.channelStoreNum,
                  no: 0,
                  openid: _this.$store.state.openId ? _this.$store.state.openId : '',
                  amount:floatTo.multiply(shiji,100),
                  totalAmount: floatTo.multiply(totle,100),
                  subject: encodeURI(`${_this.storeName}${couponActiveMes}`),
                  shareuserId: '',
                  sharecardId: _this.sharecardId,
                  userId: _this.$store.state.userLiId ? _this.$store.state.userLiId : '',
                  miniAppId: 'wx5e11922e81e3951d',
                  wxUnionId: _this.$store.state.unionid ? _this.$store.state.unionid : '',
                  nonPartakeMoney:floatTo.multiply(_this.noMoney,100),
                  activeNum:activeNum ? activeNum :'',
                  couponId:couponId ? couponId :'',
                  isOriginPricePay:_this.isOriginPricePay,
                  integralCount:disCou ? disCou : '',
                  totalmoney:_this.worldUser?_this.worldUser:'',
                }
                if(_this.inviterId){
                  _data.shareuserId = _this.inviterId;
                }else if(_this.shareuserId){
                  _data.shareuserId = _this.inviterId;
                }else{
                  _data.shareuserId ='';
                }
                _this.onShowIt = 1;
                getSignIn(_data).then(sec => {
                  _this.$http.scanPay(_data, sec).then(dd => {
                    if (dd.state == 1) {
                      if(_data.amount==0){
                        Tips.toast(`付款成功`, 'none');
                        wx.navigateTo({
                          url: `../../pages/paySuc/main?orderNum=${dd.orderNum}&shopStoreId=${_this.shopStoreId}`
                        })
                      }else{
                        wx.requestPayment({
                          timeStamp: dd.data.apiTimestamp,
                          nonceStr: dd.data.apiNoncestr,
                          package: dd.data.apiPackage,
                          signType: dd.data.apiSigntype,
                          paySign: dd.data.apiPaysign,
                          success: function (cc) {
                            Tips.toast(`付款成功`, 'none');
                            wx.navigateTo({
                              url: `../../pages/paySuc/main?orderNum=${dd.orderNum}&shopStoreId=${_this.shopStoreId}`
                            })
                          },
                          fail: function (res) {
                            if(res.errMsg == 'requestPayment:fail cancel'){
                              _this.onShowIt = 0;
                            }
                          },
                          complete: function (res) {
                          }
                        })
                      }
                    }else {
                      Tips.toast(`${dd.msg}`, 'none');
                    }

                  })
                })
              } else {
                Tips.toast(`${decodeURIComponent(res.msg)}`, 'none');
              }
            })
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .index{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F1F1F1;
    box-sizing: border-box;
    padding: 28rpx 15rpx;
    .back_index{
      position: fixed;
      width:116rpx;
      height:116rpx;
      display: block;
      left:30rpx;
      bottom:104rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .pop_up{
      position: fixed;
      left:0;
      top:0;
      right:0;
      bottom:0;
      background:rgba(0,0,0,0.5);
      width:100vw;
      height:100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      .pop_up_inner{
        width:600rpx;
        padding-bottom:30rpx;
        background:#fff;
        border-radius: 10rpx;
        position: relative;
        .pop_up_top{
          width:100%;
          height:182rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom:20rpx;
          img{
            width:298rpx;
            height:182rpx;
          }
        }
        .pop_up_mid{
          .mid_top{
            width:100%;
            text-align: center;
            font-weight: bold;
            font-size: 38rpx;
          }
          .mid_bot{
            padding:0 60rpx;
            width:480rpx;
            font-size: 30rpx;

          }
        }
        .pop_up_bot{
          width:544rpx;
          padding:0 28rpx;
          height:80rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top:20rpx;
          .btn_le_le{
            width:250rpx;
            height:80rpx;
            background:#FEB623;
            border-radius: 10rpx;
            color:#fff;
            font-size: 36rpx;
            text-align: center;
            line-height: 80rpx;
          }
          .btn_ri{
            width:250rpx;
            height:80rpx;
            background:#F7094D;
            border-radius: 10rpx;
            color:#fff;
            font-size: 30rpx;
            text-align: center;
            line-height: 80rpx;
          }
        }
      }
      .close_inner{
        position: absolute;
        right:-40rpx;
        top:-80rpx;
        width:54rpx;
        height:54rpx;
        img{
          width:54rpx;
          height:54rpx;
          display: block;
        }
      }
    }
    .pay{
      width: 100%;
      background: #FFFFFF;
      padding-bottom:10rpx;
      border-radius: 10rpx;
      box-shadow:1rpx 1rpx 30rpx rgba(0, 0, 0, 0.2);
      margin-bottom: 20rpx;
      .business{
        width:100%;
        height:80rpx;
        padding: 10rpx 0 0rpx 20rpx;
        display: flex;
        align-items: center;
        margin-bottom:30rpx;
        .bus_left{
          width:80rpx;
          height:80rpx;
          border-radius: 50%;
          margin-right:16rpx;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 50%;
          }
        }
        .bus_right{
          font-size: 30rpx;
        }
      }
      .remainMoney{
        font-size: 26rpx;
        padding: 0 45rpx 20rpx;
      }
      .inputContainer{
        width: 679rpx;
        border-bottom: 2rpx solid #EBECEE;
        box-sizing: border-box;
        margin: 30rpx 22rpx;
        padding:20rpx 0;
        display: flex;
        font-size: 30rpx;
        align-items: flex-end;
        border-bottom:2rpx solid #f2f2f2;
        margin-bottom:20rpx;
        position: relative;
        input{
          font-size: 40rpx;
          display: block;
          width: 100%;
          padding-left:14rpx;
          font-weight: bold;
        }
        .input_mask{
          position: absolute;
          left:0;right:0;
          bottom:0;top:0;
          z-index: 9999;
        }
        input::placeholder{
          font-size: 40rpx;
          text-align: center;
        }
      }
      .okLine{
        border-bottom:2rpx solid #F7094D;
      }
      .noline{
        border-bottom:2rpx solid #F2F2F2;
      }
      .input_inner{
        width:680rpx;
        margin:0 auto;
        height:38rpx;
        margin-bottom:16rpx;
        display: flex;
        align-items: center;
        .in_in_le{
          width:38rpx;
          height:38rpx;
          background:rgba(255,255,255,1);
          float: left;
          i{
            height:38rpx;
            line-height: 38rpx;
          }
        }
        .in_in_ri{
          float: left;
          font-size: 30rpx;
          line-height: 38rpx;
          margin-left:20rpx;
        }
      }
      .okSecLine{
        border-bottom:2rpx solid #F7094D;
      }
      .noSecline{
        border-bottom:2rpx solid #F2F2F2;
      }
      .input_mes{
        margin:20rpx 20rpx;
        margin-top:16rpx;
        margin-bottom:18rpx;
        position: relative;
        input{
          padding:20rpx 20rpx;
          border-bottom:2rpx solid #f2f2f2;
        }
        .input_mask{
          position: absolute;
          left:0;bottom:0;
          top:0;right:0;
          z-index: 999;
        }
      }
      .payMoney{
        font-size: 30rpx;
        color:rgba(13,13,15,1);
        padding: 22rpx 50rpx 65rpx;
      }
      .affirm{
        width: 690rpx;
        height: 91rpx;
        border-radius: 7rpx;
        display: block;
        background:rgba(247,9,77,1);
        color: #FFFFFF;
        font-size: 41rpx;
        margin: 0 auto;
      }
      .notice_text{
        font-size: 30rpx;
        padding:0 22rpx;
        margin-top:30rpx;
      }
    }
    .first_active{
      border-radius: 10rpx;
      box-shadow:1rpx 1rpx 30rpx rgba(0, 0, 0, 0.2);
      overflow: hidden;
      margin-bottom: 20rpx;
    }
    .all_car_pay{
      overflow: hidden;
      border-bottom: 1rpx solid #E5E5E5;
    }
    .carder_pay{
      width:680rpx;
      background:#ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding:20rpx;
      padding-bottom:0;
      .all_le{
        display: flex;
        align-items: center;
        .car_le{
          margin-right:20rpx;
          .yesicon{
            color:#F60F51;
          }
          .noicon{
            color:#D2D2D2;
          }
        }
        .car_mid{
          .car_top{
            font-size: 30rpx;
          }
          .car_bot{
            color:#8D8E98;
            font-size:28rpx;
          }
        }
      }

      .car_ri{
        display: flex;
        float: right;
        font-size: 28rpx;
        line-height: 28rpx;
      }
    }
    .all_all_mid{
      width:710rpx;
      background:#fff;
      color:#F7094D;
      font-size: 28rpx;
      padding:20rpx 20rpx;
      padding-top:0;
    }
    .carder_pay_bot{
      width:628rpx;
      background:#fff;
      display:flex;
      justify-content: space-between;
      color:#000;
      font-size: 28rpx;
      padding:10rpx 20rpx;
      padding-left:70rpx;
      .carder_le{


        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .nickName_style{
          @include ovh;
          max-width:124rpx;
        }
      }
      .use_num{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .carder_mid{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .carder_ri{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }
    .shop_active{
      width:680rpx;
      background:#ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding:20rpx;
      .all_le{
        display: flex;
        align-items: center;
      }
      .all_ri{
        .all_btn_btn{
          padding:10rpx 20rpx;
          background:#F60F51;
          color:#fff;
          font-size: 28rpx;
          border-radius: 10rpx;
        }
      }
      .sh_le{
        margin-right:20rpx;
        .yesicon{
          color:#F60F51;
        }
        .noicon{
          color:#D2D2D2;
        }
      }
      .sh_ri{
        .car_top{
          font-size: 30rpx;
        }
        .car_bot{
          color:#8D8E98;
          font-size:28rpx;
        }
      }
    }
    .cu_coupon{
      width:680rpx;
      background:#ffffff;
      border-radius: 10rpx;
      box-shadow:1rpx 1rpx 30rpx rgba(0, 0, 0, 0.2);
      padding:20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .all_le{
        display: flex;
        align-items: center;
        .car_le{
          margin-right:20rpx;
          .yesicon{
            color:#F60F51;
          }
          .noicon{
            color:#D2D2D2;
          }
        }
        .car_mid{
          .car_top{
            font-size: 30rpx;
          }
          .car_bot{
            color:#8D8E98;
            font-size:28rpx;
          }
        }
      }

      .car_ri{
        display: flex;
        float: right;
        font-size: 28rpx;
        line-height: 28rpx;
      }
    }

    .btn_btn{
      width:100%;
      height:100rpx;
      background:#ffffff;
      position: fixed;
      bottom:0;
      left:0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn_le{
        font-size: 28rpx;
        font-weight: bold;
        padding-left:40rpx;
      }
      .btn_ri{
         width:206rpx;
         height:70rpx;
         background:#F7094D;
         margin-right:40rpx;
         border-radius: 10rpx;
         color:#fff;
         line-height: 70rpx;
         text-align: center;
         font-size: 36rpx;
      }
    }
  }

  .keyboard {
    width: 100%;
    display: flex;
    background-color: #fff;
    border-top: 1px solid #eee;
    margin-top: 50 rpx;
    position: absolute;
    bottom:0;
    left:0;
  }
    .keyboard .number {
    display: flex;
    width: 570rpx;
    flex-wrap: wrap;
  }

  .keyboard .number div {
    width: 190rpx;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    font-size: 46rpx;
    font-weight: bold;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  .keyboard .ctr-btn {
    width: 174rpx;
  }

  .keyboard .ctr-btn div {
    height: 240rpx;
    line-height: 240rpx;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }

  .keyboard .ctr-btn div .iconfont {
    font-size: 44rpx !important;
    color: #c30;
  }

  .keyboard .ctr-btn div:nth-child(2) {
    font-size: 46rpx;
    color: #c30;
  }

  .keyboard .active {
    background-color: #e4e7ed;
  }

  .activity {
    background-color: #fff;
    padding: 25rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    border-bottom: 1px solid #f6f6f6;
  }

  .activity.activity-item {
    font-size: 26rpx;
  }

  .arrows-right {
    width: 30rpx;
    height: 30rpx;
  }

  .arrows-right.active {
    transform: rotate(270deg);
  }
</style>
