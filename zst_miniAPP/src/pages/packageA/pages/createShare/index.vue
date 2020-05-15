<template>
    <div class="page">
       <div class="page_img">
         <div class="over_hid" style="font-size: 30rpx;">
           <img src="/static/img/common/cat.png" alt="">{{resData.goodsName}}
         </div>
         <div class="share_vip">
              <div class="sha_vip_le">
                   <div class="vip_le" v-if="resData.isMemberArea == 1">
                     <img src="../../static/img/vipblong.png" alt="">
                   </div>
                   <div class="vip_ri">
                      <div class="vip_ri_top">
                         <span style="font-size: 48rpx;color:#F7074B;">￥{{resData.presentPrice}}</span>
                         <span v-if="resData.integralNum!=0" style="font-size: 24rpx;color:#F7074B;">+{{resData.integralNum}}话呗</span>
                      </div>
                      <div class="vip_ri_bot" v-if="resData.integralNum!=0">
                        原价：￥{{resData.originalPrice}}
                      </div>
                   </div>
              </div>
              <div class="sha_vip_ri">
                <div class="sha_con" v-if="resData.preIncome!=0">
                    预估赚￥{{resData.preIncome}}
                </div>
              </div>
         </div>
         <div class="share_text">
            <div class="sha_text_top">
               分享文案
            </div>
            <div class="text_con">
                <div>{{resData.goodsName}}</div>
                <div v-if="resData.integralNum ==0">【助商通价格】{{resData.presentPrice}}</div>
                <div v-if="resData.integralNum !=0">【助商通价格】{{resData.presentPrice}} + {{resData.integralNum}}话呗</div>
                <div v-if="resData.integralNum!=0">【商品原价】{{resData.originalPrice}}</div>
                <div v-if="resData.integralNum !=0" style="color:#F7094D;">【话呗抵扣】{{resData.integralNum}}</div>
                <div style="border-bottom: 2rpx dotted #000;width:308rpx;margin: 20rpx 0;"></div>
                <div>复制这条信息{{resData.goodsTicket}}</div>
                <div>打开【助商通】即可查看</div>
            </div>
         </div>
         <div class="select_pho">
           <div class="sel_pho_le">
             <img :src="bjtempFilePath" alt="">
           </div>
           <div class="sel_pho_ri">
              <div class="pho_con" v-for="(item,index) in imgList" :key="index" @click="selPho(item,index)">
                <img :src="item.imgUrl ? item.imgUrl:''" alt="">
                <div class="se_con">
                    <i class="iconfont icon-duigou1" :class="index==curIndex? 'redColor':'greyColor'"></i>
                </div>
              </div>
           </div>

         </div>
         <div class="bottom_btn">
            <div class="btn_le" @click="copyBtn">
                 <div class="btn_top">
                   <img src="../../static/img/copy.png" alt="">
                 </div>
                 <div class="btn_bot">
                    复制文案
                 </div>
            </div>


            <div class="btn_le" @click="save" v-if="saveImgBtnHidden">
              <div class="btn_top">
                <img src="../../static/img/downPhoto.png" alt="">
              </div>
              <div class="btn_bot">
                    保存图片
              </div>
            </div>

           <button type='primary' class='btn_le'
                   open-type="openSetting"
                   bindopensetting='handleSetting'
                   v-if='openSettingBtnHidden'>
             <div class="btn_top">
               <img src="../../static/img/downPhoto.png" alt="">
             </div>
             <div class="btn_bot">
                去授权
             </div>
           </button>

            <button class="btn_le" open-type="share">
              <div class="btn_top">
                <img src="../../static/img/weixin.png" alt="">
              </div>
              <div class="btn_bot">
                  分享好友
              </div>
            </button>
         </div>
       </div>
      <canvas class="canvas-hide" canvas-id="myCanvas" :style="{width: width +'px', height: height + 'px'}"></canvas>
    </div>
</template>

<script>
  import { getSignIn , getQuery , base64src , base64Name } from '@/common/js/comm'
  import zstPng from '@/images/zstPng.png'
  import vipblong from '@/images/vipblong.png'
  import cat from '@/images/cat.png'
  import Tips from '@/common/js/tips'
    export default {
        name: "index",
        data(){
            return {
               id:'',
               detailurl:'',
               resData:'',
               imgList:'',
               curIndex:0,
               width:375,
               height:667,
               imgMes:'',
               defImg:'',
               bjtempFilePath:'',
               saveImgBtnHidden:true,
               openSettingBtnHidden:false
            }
        },
        onShow(){
          this.saveImgBtnHidden=true;
          this.openSettingBtnHidden=false;
        },
        mounted(){
           var par = getQuery();
           this.id = par.id;
           this.postTimes();
        },
        methods:{
            postTimes(){
              var _data = {
                token:this.$store.state.token,
                id:this.id,
                userId:this.$store.state.userLiId,
                isShare:1,
              }
              var _this = this;
              getSignIn(_data).then(sec=>{
                _this.$http.getShareData(_data,sec).then(res=>{
                  _this.resData = res.data;
                  let newArr =[]
                  for(let i=0;i<4;i++){
                    if(res.lstBiGoodsimgs[i]){
                      newArr.push(res.lstBiGoodsimgs[i]);
                    }else{
                      console.log('抛出空');
                    }
                  }
                  _this.imgList = newArr;
                  _this.defImg = res.lstBiGoodsimgs[0].imgUrl;
                  _this.ewmImg = res.goodsDetailCode;
                  _this.postGene();
                })
              })
            },
            selPho(par,mes){
              this.curIndex = mes;
              this.defImg = par.imgUrl;
              this.postGene();
            },
            //小程序二维码转换成为本地路径
            swift64(par,ctx){
              let fileName,buffer,newNum;
              var getFile = wx.getFileSystemManager();
              buffer = wx.base64ToArrayBuffer(par);
              fileName = '';
              newNum = Math.random().toString(36).substr(2);
              fileName = `${wx.env.USER_DATA_PATH}/${newNum}.png`
              var _this = this;
              getFile.writeFile({
                filePath:fileName,
                data: buffer,
                encoding:'base64',
                success: res => {
                   ctx.drawImage(fileName,10,537,117,117);
                   ctx.setFontSize(12);
                   ctx.fillStyle="#9A9DA5";
                   ctx.fillText(`长按或扫描查看`, 140, 638);
                   Tips.loaded();
                   ctx.draw(true,_this.canvaToimg);
                }, fail: err => {
                  console.log('2222',err)
                }
              })

            },
            postGene(){
              var info = wx.getSystemInfoSync();
              var _this = this;
              Tips.loading('生成中...');
              var ctx= wx.createCanvasContext('myCanvas');
              ctx.setFillStyle('#ffffff');
              ctx.fillRect(0, 0, _this.width, _this.height);
              ctx.drawImage(zstPng, 12 , 16, 120, 40);
              _this.downloadLogoFile( _this.defImg , ctx)

            },
            //放置图片
            drawLogo(filePage, dx, dy, iw, ih){
              ctx.drawImage(filePage, dx, dy, iw, ih)
            },
            downloadLogoFile(imghref,ctx){
            var _this = this;
            wx.downloadFile({
              url: imghref,
              success(res){
                if(res.statusCode== 200) {
                    ctx.drawImage(res.tempFilePath, 12 , 69, 350, 350);
                    base64Name(cat).then(res=>{
                      ctx.drawImage(res,16, 428 , 13 , 13 );
                    })
                    ctx.setFontSize(12);
                    ctx.fillStyle="#000000";
                    _this.wrapText(ctx,`${_this.resData.goodsName}`,34,440,330,26);
                    _this.wrapText(ctx,`${_this.resData.goodsRemark}`,34,460,330,20);
                    if(_this.resData.isMemberArea ==1) {
                      base64src(vipblong).then(res => {
                        ctx.drawImage(res, 12, 489, 35, 35);
                      })
                      ctx.setFontSize(24);
                      ctx.fillStyle="#F7074B";
                      ctx.fillText(`￥${_this.resData.presentPrice}`, 46, 508);
                      if(_this.resData.integralNum !=0 ) {
                        ctx.setFontSize(12);
                        ctx.fillStyle = "#9A9DA5";
                        ctx.fillText(`原价：￥${_this.resData.originalPrice}`, 50, 524);
                      }
                      if(_this.resData.integralNum !=0) {
                        ctx.setFontSize(12);
                        ctx.fillStyle = "#F7074B";
                        ctx.fillText(`+${_this.resData.integralNum}话呗`, 130, 506);
                      }
                    }else{
                      ctx.setFontSize(24);
                      ctx.fillStyle="#F7074B";
                      if(_this.resData.goodsRemark =='') {
                        ctx.fillText(`￥${_this.resData.presentPrice}`, 18, 508);
                      }else{
                        ctx.fillText(`￥${_this.resData.presentPrice}`, 18, 528);
                      }
                      if(_this.resData.integralNum !=0 ) {
                        ctx.setFontSize(12);
                        ctx.fillStyle = "#9A9DA5";
                        ctx.fillText(`原价：￥${_this.resData.originalPrice}`, 22, 524);
                      }
                      if(_this.resData.integralNum !=0) {
                        ctx.setFontSize(12);
                        ctx.fillStyle = "#F7074B";
                        ctx.fillText(`+${_this.resData.integralNum}话呗`, 100, 506);
                      }
                    }

                    if(_this.resData.preIncome!=0) {
                      ctx.strokeStyle = '#F7074B'; ctx.fillStyle = '#fff2f6'; ctx.lineWidth = 1;
                      ctx.beginPath();
                      ctx.moveTo(260,503);
                      ctx.lineTo(360,503);
                      ctx.lineTo(360,520);
                      ctx.lineTo(260,520);
                      ctx.closePath();
                      ctx.stroke();
                      ctx.fill();
                      ctx.setFontSize(12);
                      ctx.fillStyle = "#F7074B";
                      ctx.fillText(`预估赚￥${_this.resData.preIncome}`, 268, 516);
                    }
                    _this.swift64(_this.ewmImg,ctx);
                }
              },
              fail(res){
                return res;
              }
            })
          },
            canvaToimg(){
              var _this = this;
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 375,
                height: 667,
                destWidth: 1125,  //375
                destHeight: 2001,  //667
                canvasId: "myCanvas",
                success: function(e) {
                  _this.bjtempFilePath = e.tempFilePath;  // 拿到要保存的图片路径
                },
                fail: function(e) {
                  console.log(e);
                }
              })
            },
            saveImgs(){
              var _this = this;
              wx.saveImageToPhotosAlbum({
                filePath: _this.bjtempFilePath,
                success(result) {
                  if(result.errMsg == "saveImageToPhotosAlbum:ok"){
                    Tips.toast('保存成功','none')
                  }
                },
                fail(res){
                    Tips.toast('保存失败','none');
                }
              })
            },
            save() {
              var _this = this;
              //获取相册授权
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {//这里是用户同意授权后的回调
                        _this.saveImgs();
                      },
                      fail() {//这里是用户拒绝授权后的回调
                        _this.saveImgBtnHidden = false;
                        _this.openSettingBtnHidden = true;

                      }
                    })
                  }else{
                    _this.saveImgs();
                  }
                }
              })
            },
            wrapText(context,text, x, y, maxWidth, lineHeight) {
              if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
                return;
              }

              var canvas = context.canvas;
              if (typeof maxWidth == 'undefined') {
                maxWidth = (canvas && canvas.width) || 300;
              }
              if (typeof lineHeight == 'undefined') {
                lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
              }

              // 字符分隔为数组
              var arrText = text.split('');
              var line = '';
              var second_height = y + lineHeight;
              var ry = y;

              for (var n = 0; n < arrText.length; n++) {
                var testLine = line + arrText[n];
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                  ry += lineHeight;
                  if (ry > second_height) {
                    line = line.slice(0, -1);
                    line = line + ' ...';
                    context.fillText(line, x, y);
                    return;
                  }
                  context.fillText(line, x, y);
                  line = arrText[n];
                  y += lineHeight;
                } else {
                  line = testLine;
                }
              }
              context.fillText(line, x, y);
            },
            copyBtn() {
              var _this = this;
              wx.setClipboardData({
                data: `${_this.resData.goodsName}【助商通价格】${_this.resData.presentPrice}+${_this.resData.integralNum}话呗【商品原价${_this.resData.originalPrice}【话呗抵扣】${_this.resData.integralNum}复制这条信息${_this.resData.goodsTicket}打开【助商通】即可查看`,
                success: function (res) {
                  wx.showToast({
                    title: '复制成功',
                  });
                }
              })
            }
        },
        onShareAppMessage(res){
        if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log('啦啦啦德玛西亚',res.target);
        }
        return {
          title:this.resData.goodsName,
          path:`/pages/shopdetail/main?id=${this.id}&inviterId=${this.$store.state.userLiId}`,
          imageUrl:`${this.defImg}`,
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
  padding-bottom:150rpx;
  position: relative;
  .page_img{
    width:710rpx;
    padding:0 20rpx;
    background:#ffffff;
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
    .share_vip{
      width:100%;
      height:84rpx;
      display: flex;
      justify-content: space-between;
      padding:34rpx 0;
      border-bottom:10rpx solid #eeeeee;
      .sha_vip_le{
        width:490rpx;
        display: flex;
        align-items: center;
        .vip_le{
          float: left;
          width:70rpx;
          height:70rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .vip_ri{
          float: left;
          display: flex;
          margin-left:10rpx;
          justify-content: center;
          flex-direction: column;
          .vip_ri_top{
            line-height: 48rpx;
          }
          .vip_ri_bot{
            font-size: 24rpx;
            color:#9A9DA5;
            line-height: 24rpx;
          }
        }
      }
      .sha_vip_ri{
        width:220rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .sha_con{
          background:rgba(255,242,246,1);
          border:2rpx solid rgba(247,9,77,1);
          border-radius:10rpx;
          color:#F7094D;
          font-size:24rpx;
          padding:0 10rpx;
        }
      }
    }
    .share_text{
      width:100%;
      .sha_text_top{
        font-size: 34rpx;
        font-weight: bold;
        padding:30rpx 0;
        border-bottom:2rpx dotted #D2D2D2;
      }
      .text_con{
        padding:20rpx 0;
        border-bottom: 10rpx solid #eeeeee;
      }
    }
    .select_pho{
      width:100%;
      display: flex;
      .sel_pho_le{
        width:240rpx;
        height:428rpx;
        background:#eeeeee;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .sel_pho_ri{
        margin-left:20rpx;
        width:426rpx;
        display: grid;
        grid-template-columns: 200rpx 200rpx;
        grid-template-rows: 200rpx 200rpx;
        grid-row-gap: 26rpx;
        grid-column-gap: 26rpx;
        .pho_con{
          width:200rpx;
          height:200rpx;
          background:#eeeeee;
          position: relative;
          img{
            width:100%;
            height:100%;
            display: block;
          }
          .se_con{
            position: absolute;
            width:34rpx;
            height:34rpx;
            border-radius: 50%;
            right:10rpx;
            top:10rpx;
            line-height: 34rpx;
            i{
              font-size: 34rpx;
            }
            .greyColor{
              color:#333333;
            }
            .redColor{
              color:#F7094D;
            }
          }
        }
      }
    }
    .bottom_btn{
      width:690rpx;
      position: fixed;
      bottom:0;
      left:0;
      height:130rpx;
      display: flex;
      justify-content: space-between;
      padding:0 30rpx;
      z-index: 99;
      background:#fff;
      .btn_le{
        display:flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background:#fff;
        outline: none;
        border: 1px solid transparent;  //自定义边框
        padding:0;
        color:#000;
        margin:0;
        .btn_top{
          width:80rpx;
          height:80rpx;
          img{
            width:100%;
            height:100%;
          }
        }
        .btn_bot{
          font-size: 24rpx;
          line-height: 36rpx;
        }
      }
      button::after{ border: none; }
    }
  }
  .canvas-hide{
    position: absolute;
    left:750rpx;
    top:0;
  }
}
</style>
