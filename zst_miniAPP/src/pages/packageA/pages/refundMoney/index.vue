<template>
    <div class="page">
        <div class="ref_top">
            <div class="re_top_inner">
                <div class="re_top_le">
                   <div>温馨</div>
                   <div>提示</div>
                </div>
                <div class="re_top_ri">
                  <div>退款成功后，订单内所需话呗一并返还</div>
                  <div>订单一旦取消，无法恢复</div>
                </div>
            </div>
        </div>
        <div class="ref_mid">
          <div class="ref_mid_con">
              <div class="re_mi_title">
                 退款商品
              </div>
              <div class="re_mi_inner">
                  <div class="re_mi_le">
                    <img :src="dataList.imgUrl" alt="">
                  </div>
                  <div class="re_mi_ri">
                      <div class="re_mi_ri_top">
                        {{dataList.goodsName}}
                      </div>
                      <div class="re_mi_ri_bot">
                         规格：{{dataList.specParamsName}}
                      </div>
                  </div>
              </div>
          </div>
        </div>

      <picker mode="selector"  @change="bindPickerChange"  :value="index" :range="array">
             <div class="picker">
                 <!--当前选择：-->
                 <div class="ref_resion">
                   <div>退款原因</div>
                   <div style="line-height:45rpx;">{{array[index]}} <i class="iconfont icon-youjiantou" style="float: right;"></i></div>
                 </div>
             </div>
           </picker>

      <div class="ref_price">
              <div class="ref_p_top">
                <div>退款总金额：</div>
                <div style="color:#F7094D;">￥{{dataList.goodsTotalPrice}}</div>
              </div>
              <div class="ref_p_top">
                <div>退款总话呗：</div>
                <div style="color:#F7094D;">{{dataList.usedIntegralCount}}</div>
              </div>
        </div>

      <div class="ref_price">
        <div class="ref_p_top">
          <div>退款联系人：</div>
          <div style="color:#050505;">{{dataList.receiverName}}</div>
        </div>
        <div class="ref_p_top">
          <div>退款联系电话：</div>
          <div style="color:#050505;">{{dataList.receiverPhone}}</div>
        </div>
        <picker mode="selector"  @change="bindPickerMes"  :value="ind" :range="typeMes" :range-key="'companyName'" v-if="stat == 1">
          <div class="picker">
            <div class="ref_p_top">
              <div>快递类型：</div>
              <div style="color:#050505;">{{mesType}}</div>
            </div>
          </div>
        </picker>

        <div class="ref_p_top" style="height:60rpx;" v-if="stat == 1">
          <div>物流单号：</div>
        </div>
        <div class="ref_p_top" style="height:60rpx;padding-bottom:20rpx;" v-if="stat == 1">
          <div><input type="number" v-model="innertext" placeholder="输入物流单号或则扫一扫" style="width:540rpx;"></div>
          <div style="color:#F7094D;" @click="scanGoods"><i class="iconfont icon-saoyisao" style="color:#FFA61A;"></i></div>
        </div>
      </div>

      <div class="ref_resion">
        <div style="float: left;">备注</div>
        <div style="float: left;">
          <input type="text" placeholder="请输入你的备注信息" v-model="textValue">
        </div>
      </div>

      <div v-if="stat == 1" style="padding:20rpx 20rpx;width:710rpx;">

        <div class="head_title" style="font-size: 28rpx;">
          上传凭证
        </div>

        <div class="head_con">
          <div class="weui-uploader__bd th-backwhite clearfix">
            <div class="weui-uploader__files" id="uploaderFiles">
              <block v-for="(item,index) in files" :key="index">
                <div class="weui-uploader__file posi-rela" @click="predivImage" :id="item">
                  <icon type="cancel" size="20" class="th-icon-cancel" @click.stop="deletImg(index)"/>
                  <image class="weui-uploader__img" :src="item" mode="aspectFill" />
                </div>
              </block>
            </div>
            <div class="weui-uploader__input-box" v-if="imgNum">
              <div class="weui-uploader__input" @click="chooseImage"></div>
            </div>
          </div>
        </div>

      </div>



      <div class="footer_btn">
         <div class="footer_le" @click="contactSer">
            <i class="iconfont icon-dianhua"></i>
            <span>联系商家</span>
         </div>
         <div class="footer_ri" @click="postBack(dataList)">
            申请退款
         </div>
      </div>
    </div>
</template>

<script>
  import { getQuery , getSignIn ,toDate } from '@/common/js/comm'
  import Tips from '@/common/js/tips'
    export default {
        name: "index",
        data(){
            return {
              orderNum:'',
              dataList:'',
              array: ['订单不能按预计时间送达', '操作有误(商品、地址等选错)', '重复下单/误下单', '不想买了','商品无货','其他原因'],
              index:0,
              textValue:'',
              stat:'',
              typeMes:'',
              ind:0,
              mesType:'',
              files: [],
              filesOnline: [],
              selecMes:'',
              innertext:'',
              imgNum:true,
            }
        },
        mounted(){
            var par = getQuery();
            this.orderNum = par.orderNum;
            this.stat = par.stat;
            this.getMes();
            this.getOrderDetail();
        },
        methods:{
          getOrderDetail(){
            var _this = this;
             var _data = {
               token:this.$store.state.token,
               orderNum:this.orderNum,
             }
             console.log(_data);
             getSignIn(_data).then(sec=>{
                _this.$http.getOrderDetail( _data , sec).then(res=>{
                  _this.dataList = res.data;
                })
             })
          },
          //获取物流信息
          getMes(){
              var _this = this;
              var _data = {
                a:'abc'
              }
              getSignIn(_data).then(sec=>{
                _this.$http.getTypeMes(_data,sec).then(res=>{
                   _this.typeMes = res.data;
                   _this.mesType = res.data[0].companyName;
                   _this.selecMes = res.data[0];
                })
              })
          },
          // 联系客服

          chooseImage(e) {
            var _this = this;
            wx.chooseImage({
              count:3,
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                _this.files = _this.files.concat(res.tempFilePaths);
                console.log(_this.files.length);
                if(_this.files.length == 3){
                  Tips.toast('最多三张哦', 'none');
                  _this.imgNum = false;
                }else{
                  _this.imgNum = true;
                }
              },
              fail: function () {
                console.log('fail');
              },
              complete: function (e) {
                console.log(e);
              }
            })

          },
          scanGoods(){
            wx.scanCode({
              onlyFromCamera: true,
              success(res) {
                this.innertext = res.result;
              }
            })
          },
          predivImage(e) {
            wx.previewImage({
              current: e.currentTarget.id, // 当前显示图片的http链接
              urls: this.files // 需要预览的图片http链接列表
            })
          },
          deletImg(index){
            this.files.splice(index,1)
            this.filesOnline.splice(index,1)
            if(this.files.length < 4){
              this.imgNum = true;
            }
          },
          contactSer(){
            wx.makePhoneCall({
              phoneNumber: '400-8090-775' // 仅为示例，并非真实的电话号码
            })
          },
          postBack(par){
            var _this = this;
            if(this.stat == 2) {
              var _data = {
                token: this.$store.state.token,
                goodsId: par.goodsId,
                onlineOrderId: par.onlineorderId,  //订单id
                onlineOrderGoodsId: par.id, //订单商品id
                // refundType:'',
                imgUrl: par.imgUrl,
                concacts: par.receiverName,    //退款联系人
                concactPhone: par.receiverPhone,
                refundReason: _this.array[this.index],
                refundRemark: _this.textValue,
              }
              getSignIn(_data).then(sec => {
                _this.$http.postApply(_data, sec).then(res => {
                  if(res.state == 1){
                    Tips.toast('申请成功', 'none');
                    wx.switchTab({
                      url:'../../pages/personal/main'
                    })
                  }else {
                    Tips.toast(decodeURIComponent(res.msg), 'none');
                  }
                })
              })
            }else if(this.stat == 1){
              if(_this.innertext == ''){
                Tips.toast('请填写物流单号','none');
                return false;
              }
              if(_this.files.length == 0){
                Tips.toast('请选择图片','none');
                return false;
              }
              var _data = {
                token: this.$store.state.token,
                goodsId: par.goodsId,
                onlineOrderId: par.onlineorderId,  //订单id
                onlineOrderGoodsId: par.id, //订单商品id
                imgUrl: par.imgUrl,
                concacts: par.receiverName,    //退款联系人
                concactPhone: par.receiverPhone,
                refundReason: _this.array[this.index],
                refundRemark: _this.textValue,
                couriercompanyCode:_this.selecMes.companyCode,  //退款物流公司编码
                deliveryNO:_this.innertext,  //退款物流单号
              }

              getSignIn(_data).then(sec=>{
                for (let i = 0; i < _this.files.length; i++) {
                  wx.uploadFile({
                    url: `https://zst.tenzhao.com/api/voip/zst/onlineorder/applyrefund`,
                    filePath: _this.files[i],
                    name: 'file',
                    formData: _data,
                    header: {
                      "Content-Type": "multipart/form-data",
                      sec: sec
                    },
                    success: function (res) {
                      var _data = JSON.parse(res.data);
                      Tips.toast(decodeURIComponent(_data.msg), 'none');
                      _this.filesOnline = _this.filesOnline.concat(JSON.parse(res.data).data);
                    }
                  })
                }
                Tips.toast('申请成功', 'none');
                wx.switchTab({
                  url:'../../pages/personal/main'
                })

              })
            }
          },
          bindPickerChange(e) {
              this.index = e.mp.detail.value;
          },
          bindPickerMes(e){
            this.ind = e.mp.detail.value;
            this.mesType = this.typeMes[this.ind].companyName;
            this.selecMes = this.typeMes[this.ind];
          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  width:750rpx;
  overflow: hidden;
  padding-bottom:160rpx;
  .ref_top{
     width:750rpx;
     height:152rpx;
     background:#FFA61A;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .re_top_inner{
      width:640rpx;
      margin:0 55rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .re_top_le{
         display: flex;
         flex-direction: column;
        div{
          font-size: 36rpx;
          color:#fff;
          line-height: 36rpx;
        }
      }
      .re_top_ri{
        font-size: 30rpx;
        div{
          color:#ffffff;
        }
      }
    }
  }
  .ref_mid{
    width:100%;
    border-bottom:10rpx solid rgba(242,242,242,1);
    overflow: hidden;
    .ref_mid_con{
      width:710rpx;
      margin:20rpx 20rpx;
      .re_mi_title{
        font-size: 30rpx;
        margin-bottom:20rpx;
      }
      .re_mi_inner{
        width:100%;
        overflow: hidden;
        .re_mi_le{
          width:170rpx;
          height:170rpx;
          background:#ff6700;
          margin-right:20rpx;
          float: left;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .re_mi_ri{
          width:520rpx;
          float: left;
          .re_mi_ri_top{
            font-size: 30rpx;
            margin-bottom:20rpx;
          }
          .re_mi_ri_bot{
            font-size: 24rpx;
            color:#8D8E98;
          }
        }
      }
    }
  }
  .ref_resion{
    width:710rpx;
    padding:0 20rpx;
    min-height:120rpx;
    border-bottom:10rpx solid rgba(242,242,242,1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    div{
      font-size: 28rpx;
    }
  }
  .ref_price{
    width:710rpx;
    padding:0 20rpx;
    border-bottom:10rpx solid rgba(242,242,242,1);
    .ref_p_top{
       width:100%;
       height:91rpx;
       display: flex;
       justify-content: space-between;
       align-items: center;
      div{
        font-size: 28rpx;
      }
    }
  }
  .footer_btn{
    position: fixed;
    left:0;
    bottom:0;
    width:100%;
    height:110rpx;
    display: flex;
    justify-content: space-between;
    z-index:999;
    .footer_le{
      width:264rpx;
      height:100%;
      background:#FFA61A;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        font-size: 30rpx;
        color:#fff;
      }
      i{
        font-size: 40rpx;
        color:#fff;
        margin-right:10rpx;
      }
    }
    .footer_ri{
      width:486rpx;
      height:100%;
      background:#F7094D;
      display: flex;
      justify-content: center;
      align-items: center;
      color:#ffffff;
      font-size:38rpx;
    }
  }


  .th-icon-cancel{
    position: absolute;
    background-color: #fff;
    border-radius: 50%;
    right: -14rpx;
    top: -14rpx;
  }
  .weui-uploader__input-box{
    margin-right: 0;
  }
  .weui-uploader__bd{
    margin-bottom: 0;
  }
  .posi-rela{
    position: relative;
    overflow: visible;
  }
  .weui-uploader__file:nth-child(4n){
    margin-right: 0;
  }
  .th-backwhite{
    box-sizing: border-box;
    padding:20rpx 0;
    background-color: #fff;
    border-bottom:4rpx solid #f5f5f5;
  }
  /* 绿色贯穿按钮 */
  .th-submit-btn{
    width: 690rpx;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #18c136;
    margin: 50rpx auto;
    color: #fff;
    font-size: 34rpx;
    text-align: center;
    border-radius: 6rpx;
  }

}
</style>
