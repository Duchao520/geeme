<template>
  <div class="checkSale">
    <section class="box_padding flex_box justify_space_between"
             style="padding: 24rpx;border-bottom: 10rpx solid #EEEEEE">
      <img :src="bargainImg" alt="" class="thumb">
      <div class="flex_box flex_column justify_space_between"
           style="width: 475rpx">
        <p class="fz-30 txt-overflow">{{bargainTitle}}</p>
        <div class="flex_box justify_space_between align_center">
          <p class="iconfont icon-renminbi fz-48 font-weight fc-F7094D">{{prentPrice}} <span  class="fc-8D8E98" style="text-decoration: line-through;font-size: 24rpx;">{{price}}</span></p>
          <p class="fz-24 fc-F7094D">X{{helperNum}}</p>
        </div>
      </div>
    </section>
    <div class="comment">
      <p class="fz-30" style="margin-bottom: 38rpx">留言内容</p>
      <textarea class="comment-input" placeholder="您的评价至关重要"  @change="changeText"></textarea>
      <div class="all_contnent">
        <div class="form-file" v-for="(item,index) in prewImg" :key="index">
          <img :src="item" alt="">
          <div class="delete_btn" @click="deleteBtn(item,index)"><i class="iconfont icon-ziyuan1"></i></div>
        </div>
        <div class="img_Mes" v-if="imgNum == 1" @click="getFileList"><i style="line-height: 220rpx;font-size: 120rpx;">+</i></div>
      </div>

      <div class="confirm_btn">
        <div class="confirm_mes" v-if="okBtn==1"  @click="uploadimg">
          确认提交
        </div>
        <div class="confirm_mes" v-if="okBtn==0">
          确认提交
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import comment from './comment'
  import wxbarcode from 'wxbarcode'
  import Tips from '@/common/js/tips'
  export default {
    name: "checkSale",
    components: {
      comment
    },
    onUnload(){
      this.closeCurentPage = 'close';
      if(this.timer1){
        clearInterval(this.timer1);
      }
    },
    onHide(){
      this.prewImg=[];
      this.mes = '';
      this.imgNum =1;
      this.i = 0;
      this.okBtn = 1;
    },
    mounted(){
       var par = getQuery();
       this.bargainTasksId = par.bargainTasksId;
       this.bargainTitle = par.bargainTitle;
       this.helperNum = par.helperNum;
       this.bargainImg = par.bargainImg;
       this.price = par.price;
       this.prentPrice = par.prentPrice;
       this.getCodeMes();
    },
    data(){
      return{
        bargainTasksId: '',
        bargainTitle:'',
        helperNum:'',
        taskPrice:'',
        bargainImg:'',
        isUse:0,
        count1:'',
        timer1:'',
        closeCurentPage:'',
        useCode:'',
        bargainId:'',
        price:'',
        prentPrice:'',

        tempFilePaths:[],
        mes:'',
        filesOnline:[],
        inlineImg:'',
        imgNum:1,
        prewImg:[],
        okBtn:1,
      }
    },
    methods:{
      getCodeMes(){
        var _data = {
          token:this.$store.state.token,
          bargainTasksId:this.bargainTasksId,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
           _this.$http.bargainTaskswrteoff(_data,sec).then(res=>{
             if(res.state==1) {
               _this.isUse = res.data.isUse;
               _this.useCode = res.data.useCode;
               _this.bargainId = res.data.bargainId;
             }else if(res.state==916416){
                 this.isUse=1;
                 clearInterval(this.timer1);
             }else{
               Tips.toast(`${decodeURIComponent(res.msg)}`);
             }
           })
        })
      },
      //关于评论
      getFileList(e){
        var _this = this;
        wx.chooseImage({
          count: 3,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            var images = res.tempFilePaths;
            _this.prewImg = [..._this.prewImg,...res.tempFilePaths];
            if(_this.prewImg.length < 3){
              _this.imgNum = 1;
            }else{
              _this.imgNum = 0;
              let newArr = [];
              for(let i=0;i<3;i++){
                newArr.push( _this.prewImg[i]);
              }
              _this.prewImg = newArr;
            }
          }
        })
      },
      changeText(e){
        this.msg = e.target.value;
      },
      deleteBtn(par,inx){
        console.log(par,inx);
        var _this = this;
        let arr = _this.prewImg;
        arr.splice(inx,1);
        console.log(arr);
        _this.prewImg = arr;
        if(_this.prewImg.length < 4){
          _this.imgNum = 1;
        }else{
          _this.imgNum = 0;
        }
      },
      uploadimg(data){
        this.okBtn = 0;
        if(this.msg == ''){
          Tips.toast('你的评价至关重要哦','none');
          return false
        }
        if(this.prewImg.length ==0){
          Tips.toast('请上传你的图片','none');
          this.okBtn = 1;
          return false
        }
        var that=this,
          i= that.i ?that.i:0,
          success=that.success?that.success:0,
          fail=that.fail?that.fail:0;
        wx.uploadFile({
          url: 'https://zst.tenzhao.com/api/voip/img/upload',
          filePath: that.prewImg[i],
          name: 'file',
          success: (resp) => {
            success++;
            //这里可能有BUG，失败也会执行这里
          },
          fail: (res) => {
            fail++;
            console.log('fail:'+i+"fail:"+fail);
          },
          complete: (e) => {
            console.log(e);
            that.inlineImg += `${(JSON.parse(e.data)).data},`;
            i++;
            //1    3  2
            if(i==that.prewImg.length){   //当图片传完时，停止调用
              console.log('执行完毕');
              console.log('成功：'+success+" 失败："+fail);
              that.submitCommentData(that.inlineImg);
            }else{//若图片还没有传完，则继续调用函数
              console.log(i);
              that.i=i;
              that.success=success;
              that.fail=fail;
              that.uploadimg();
            }

          }
        });
      },
      submitCommentData(inlineImg){
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
          bargainTasksId:_this.bargainTasksId,
          comment:_this.msg,
          imgs:inlineImg,
        };
        getSignIn(_data).then(sec=>{
          _this.$http.bargaincomment(_data,sec).then(res=>{
            if(res.state==1){
              wx.redirectTo({
                url:`/pages/packageC/pages/goodsDetail/main?bargainTasksId=${_this.bargainTasksId}&bargainId=${_this.bargainId}&frompage=shopRecdet`,
                success(){
                  _this.tempFilePaths = [];
                  _this.mes='';
                  _this.okBtn = 1;
                }
              })
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkSale{
    .thumb{
      display: block;
      width: 200rpx;
      height: 200rpx;
      border-radius: 20rpx;
      background: #0d0d0f;
    }
    .qr{
      display: block;
      width: 420rpx;
      height: 420rpx;
      margin: 0 auto;
    }
  }
  .comment{
    box-sizing: border-box;
    padding: 20rpx;
    .comment-input{
      display: block;
      width: 100%;
      height: 250rpx;
      background: #EEEEEE;
      text-align: start;
      box-sizing: border-box;
      padding: 25rpx 36rpx;
      font-size: 30rpx;
      margin-bottom: 20rpx;
    }
    .img_Mes{
      width:220rpx;
      height:220rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background:#d9d9d9;
    }
    .comment-input::placeholder{
      font-size: 28rpx;
      color: #8D8E98;
    }
    .all_contnent{
      display: grid;
      grid-template-columns: 33.33% 33.33% 33.33%;
    }
    .form-file{
      width: 220rpx;
      height: 220rpx;
      border: 2rpx solid #E5E5E5;
      margin-bottom:10rpx;
      position: relative;
      img{
        width:100%;
        height:100%;
        display: block;
      }
      .delete_btn{
        position: absolute;
        right:20rpx;
        top:20rpx;
      }
      button{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .confirm_btn{
      width:100%;
      height:100rpx;
      display:flex;
      justify-content: center;
      align-items: center;
      margin-top:40rpx;
      .confirm_mes{
        width:710rpx;
        height:100rpx;
        background:#FA336C;
        border-radius: 20rpx;
        font-size:36rpx;
        color:#fff;
        text-align: center;
        line-height: 100rpx;
      }

    }
  }
</style>
