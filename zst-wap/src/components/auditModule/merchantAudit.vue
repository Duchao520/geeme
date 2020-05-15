<template>
  <div class="merchant">
    <toast ref="toast" :tip="tip"></toast>
    <album ref="album" :photos="imgs"></album>
    <div class="content">
      <transition name="alertMsg">
        <div class="bg" v-show="isPass || reject">
          <div class="isPass" v-if="isPass">
            <div class="close" @click="close">
              <img src="@/assets/imgs/common/close.png" alt="">
            </div>
            <p style="font-size: .34rem">审核提示</p>
            <p style="font-size: .3rem">确定该商家通过审核?</p>
            <div class="submit">
              <button @click="close">否</button>
              <button @click="submit(1)">是</button>
            </div>
          </div>
          <div class="reject" v-if="reject">
            <div class="close" @click="close">
              <img src="@/assets/imgs/common/close.png" alt="">
            </div>
            <p>请输入拒绝审核的原因</p>
            <textarea v-model="backstageRemark" placeholder="如资料不够完善"></textarea>
            <div class="btns">
              <button @click="close">取消</button>
              <button @click="submit(2)">拒绝审核</button>
            </div>
          </div>
        </div>
      </transition>
      <div class="detail">
        <div class="detail-item"><i>当前审核状态：{{detail.auditState == 0 ? '待审核' : detail.auditState == 1 ? '审核成功' : '审核失败'}}</i></div>
        <div class="detail-item">商家名称：{{detail.shopName}}</div>
        <div class="detail-item">行业类别：{{detail.dealCateMatchRow}}</div>
        <div class="detail-item">法人名称：{{detail.legalPerson}}</div>
        <div class="detail-item">法人电话：{{detail.legalPersonPhone}}</div>
        <div class="detail-item">联系电话：{{detail.contactPhone}}</div>
        <div class="detail-item flex_box"><p style="width: 1.6rem">详细地址：</p><p style="width: 5.3rem">{{detail.unitAddress}}</p></div>
        <div class="detail-item">位置信息：{{detail.latitude + ',' + detail.longitude}}</div>
        <div class="detail-item">门店简介：</div>
        <div class="detail-item remark">{{detail.shopRemark}}</div>
      </div>
      <div class="thumb">
        <div class="thumb-item" @click="showAlbum(0)">
          <div class="notHand" v-if="!detail.licensePhoto">未上传</div>
          <img v-lazy="detail.licensePhoto" alt="" v-if="detail.licensePhoto">
          <p>营业执照</p>
        </div>
        <div class="thumb-item" @click="showAlbum(1)">
          <div class="notHand" v-if="!detail.supplierLogo">未上传</div>
          <img v-lazy="detail.supplierLogo" alt="" v-if="detail.supplierLogo">
          <p>商户logo</p>
        </div>
        <div class="thumb-item" v-for="(item,index) in supplierImages" :key="index" @click="showAlbum(index + 2)">
          <div class="notHand" v-if="!item">未上传</div>
          <img v-lazy="item" alt="" v-if="item">
          <p>门店照片</p>
        </div>
      </div>
    </div>
    <div style="height: 1.2rem;"></div>
    <div class="btns pos_fix" v-if="detail.auditState==0">
      <button @click="reject=true">拒绝</button>
      <button @click="isPass=true">同意</button>
    </div>
  </div>
</template>

<script>
  import {getSignIn,reqAuditStatus , postTitle} from "@/assets/js/jsBridge";
  import {merchantDetail , merchantEditAudit} from "@/assets/js/comm";
  import toast from '@/components/common/toast';
  import album from '@/components/common/album';

  export default {
    name: "merchant",
    components: {
      toast,album
    },
    props: ['tokenPromise'],
    data() {
      return {
        isPass: false,
        reject: false,
        token: '',
        shopId: this.$route.query.shopId,
        auditorImAccount: this.$route.query.auditorImAccount,
        detail: '',
        supplierImages: '',   //门店场景图集合
        canReleaseGoods: 0,
        backstageRemark: '',
        tip: '',
        imgs: []
      }
    },
    methods: {
      close() {
        var _self = this;
        _self.isPass = false;
        _self.reject = false;
      },
      init(){
        var _self = this;
        postTitle('审核详情');
        _self.getDetail();
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      showAlbum(index){
        this.$refs.album.showAlbum(index);
      },
      getDetail(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          shopId: String(_self.shopId),
          auditorImAccount: String(_self.auditorImAccount)
        };
        getSignIn(_data).then(sec => {
          merchantDetail(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.detail = res.data.data;
              _self.supplierImages = _self.detail.supplierImage.split(',');
              var imgs=[];
              imgs.push(_self.detail.licensePhoto);
              imgs.push(_self.detail.supplierLogo);
              imgs = imgs.concat(_self.supplierImages);
              _self.imgs = imgs;
            }else{
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      changeCanReleaseGoods(){
        var _self = this;
        if(_self.detail.state == 0){
          if(_self.canReleaseGoods){
            _self.canReleaseGoods = 0;
          }else{
            _self.canReleaseGoods = 1;
          }
        }

      },
      /*审核提交*/
      submit(state){
        var _self = this;
        var _data = {
          token: _self.token,
          shopId: String(_self.shopId),
          auditState: String(state),
          auditOpinion: String(_self.backstageRemark)
        };
        getSignIn(_data).then(sec => {
          merchantEditAudit(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.close();
              _self.tip = '审核结果已提交';
              /*var status;
              if(state == 2){
                status = -1
              }else{
                status = 1
              }
              _data = {
                newsId: _self.pushLogId,
                state: status
              };
              reqAuditStatus(_data);*/
              _self.getDetail();
            }else{
              _self.tip = decodeURIComponent(res.data.msg);
            }
            _self.$refs.toast.toast();
          })
        })
      }
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
    }
  }
</script>

<style lang="scss" scoped>
  .merchant {
    .content {
      box-sizing: border-box;
      padding: .41rem .29rem;

      .bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 30;
        background: rgba(12, 12, 12, .5);

        .isPass {
          width: 5.5rem;
          height: 3.3rem;
          box-sizing: border-box;
          padding-top: .62rem;
          border-radius: .1rem;
          background: #FFFFFF;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          z-index: 888;

          .close {
            width: .55rem;
            height: .55rem;
            position: absolute;
            top: -1rem;
            right: -.55rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          p {
            text-align: center;
            margin-bottom: .47rem;
          }

          .submit {
            width: 100%;
            height: .9rem;
            display: flex;
            position: absolute;
            bottom: 0;
            border-bottom-left-radius: .1rem;
            border-bottom-right-radius: .1rem;
            overflow: hidden;

            button {
              width: 50%;
              display: block;
              height: 100%;
              font-size: .34rem;
            }

            button:first-child {
              background: #E5E5E5;
              color: #94969B;
            }

            button:last-child {
              background: #FF0049;
              color: #FFFFFF;
            }
          }
        }

        .reject {
          width: 100%;
          height: 5rem;
          box-sizing: border-box;
          padding: .29rem .33rem;
          background: #FFFFFF;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          border-radius: .2rem;

          .close {
            width: .55rem;
            height: .55rem;
            position: absolute;
            top: -.64rem;
            right: .44rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          p {
            font-size: .3rem;
            margin-bottom: .29rem;
          }

          textarea {
            display: block;
            width: 100%;
            height: 2.71rem;
            overflow-y: auto;
            font-size: .3rem;
            resize: none;
            border: 1px solid #E5E5E5;
            box-sizing: border-box;
            padding: .22rem .31rem;
          }

          textarea::placeholder {
            color: #94969B;
            font-size: .3rem;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
          }

          .btns {
            background: #FFFFFF;
            border-radius: .2rem;
            display: flex;
            justify-content: space-between;
          }
        }
      }

      .detail {
        margin-bottom: .67rem;

        .detail-item {
          width: 100%;
          display: flex;
          font-size: .3rem;
          margin-bottom: .3rem;

          i {
            color: #FF034B;
            font-size: .34rem;
          }
          .left{
            display: flex;
            align-items: center;
            b{
              color: #FF034B;
              font-size: .2rem;
            }
          }
          span{
            color: #DBDBDB;
            font-size: .36rem;
          }
          .active{
            color: #FEB623;
          }
        }
        .remark{
          width: 100%;
          background: #F4F5F6;
          color: #94969B;
          box-sizing: border-box;
          padding: .18rem .14rem;
        }

        .dashed {
          padding-bottom: .36rem;
          border-bottom: .01rem dashed #E5E5E5;
          margin-bottom: .36rem;
        }

        .space_between {
          justify-content: space-between;
          align-items: center;
          p {
            font-size: .28rem;
            color: #94969B;
            align-items: flex-end;

            i {
              font-size: .2rem;
              margin-left: .08rem;
            }
          }
        }
      }

      .thumb {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .thumb-item {
          margin-bottom: .8rem;
          width: 2.1rem;
          height: 2.1rem;
          img {
            display: block;
            width: 100%;
            height: 100%;
            margin-bottom: .15rem;
          }

          p {
            font-size: .28rem;
            text-align: center;
          }
          .notHand{
            width: 100%;
            height: 100%;
            background: #E5E5E5;
            color: #94969B;
            font-size: .36rem;
            line-height: 2.83rem;
            text-align: center;
          }
        }

        /*.thumb-item:first-child {
          img {
            display: block;
            width: 3.8rem;
            height: 2.83rem;
          }
          .notHand{
            width: 3.8rem;
            height: 2.83rem;
            background: #E5E5E5;
            color: #94969B;
            font-size: .36rem;
            line-height: 2.83rem;
            text-align: center;
          }
        }

        .thumb-item:nth-child(2), .thumb-item:last-child {
          img {
            display: block;
            width: 2.83rem;
            height: 2.83rem;
          }
          .notHand{
            width: 2.83rem;
            height: 2.83rem;
            background: #E5E5E5;
            color: #94969B;
            font-size: .36rem;
            line-height: 2.83rem;
            text-align: center;
          }
        }*/
      }
    }
    .pos_fix{
      position: fixed;
      bottom: 0;
    }
    .btns {
      width: 100%;
      height: 1.2rem;
      box-sizing: border-box;
      padding: .18rem .53rem;
      display: flex;
      justify-content: space-between;
      background: #EEEEEE;

      button {
        display: block;
        width: 3rem;
        height: .85rem;
        color: #FFFFFF;
        border-radius: .1rem;
        font-size: .36rem;
      }

      button:first-child {
        background: #FF0049;
      }

      button:last-child {
        background: #FEB623;
      }
    }
  }
</style>
