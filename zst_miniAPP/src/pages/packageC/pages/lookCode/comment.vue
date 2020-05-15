<template>
  <div class="comment">
    <p class="fz-30" style="margin-bottom: 38rpx">留言内容</p>
    <textarea class="comment-input" placeholder="您的评价至关重要"  @change="changeText"></textarea>
    <div class="all_contnent">
      <div class="form-file" v-for="(item,index) in tempFilePaths" :key="index">
        <img :src="item" alt="">
        <div class="delete_btn" @click="deleteBtn(item,index)"><i class="iconfont icon-ziyuan1"></i></div>
      </div>
      <div class="img_Mes" v-if="imgNum == 1" @click="getFileList"><i style="line-height: 220rpx;font-size: 120rpx;">+</i></div>
    </div>

      <div class="confirm_btn">
          <div class="confirm_mes" @click="uploadImg">
              确认提交
          </div>
      </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  export default {
    name: "comment",
    props:['bargainTasksId','bargainId'],
    data(){
      return {
        tempFilePaths:[],
        mes:'',
        filesOnline:[],
        bargainTasksId:'',
        bargainId:'',
        inlineImg:'',
        imgNum:1,
      }
    },
    methods: {
      getFileList(e){
        var _this = this;
        wx.chooseImage({
          count: 3,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            console.log(res.tempFilePaths);
            _this.tempFilePaths = _this.tempFilePaths.concat(res.tempFilePaths);
            if(_this.tempFilePaths.length < 4){
              _this.imgNum = 1;
            }else{
              Tips.toast('最多三张哦，亲','none');
              // _this.imgNum = 0;
              let newArr = [];
              for(let i=0;i<3;i++){
                 newArr.push( _this.tempFilePaths[i]);
              }
              _this.tempFilePaths = newArr;
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
        let arr = _this.tempFilePaths;
        arr = arr.splice(arr.findIndex((item,index) => index == inx), 1);
        if(_this.tempFilePaths.length < 4){
          _this.imgNum = 1;
        }else{
          // _this.imgNum = 0;
        }
      },
      uploadImg(){
        var _this = this;
        if(_this.msg == ''){
          Tips.toast('你的评价至关重要哦','none');
          return false
        }
        if(_this.tempFilePaths.length ==0){
          Tips.toast('请上传你的图片');
          return false
        }
        console.log('文件上传新',_this.tempFilePaths);
        for (let i = 0; i < _this.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: `https://zst.tenzhao.com/api/voip/img/upload`,
            filePath: _this.tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
            },
            success: function (res) {
              console.log('服务器地址图片',res);
              _this.inlineImg += `${(JSON.parse(res.data)).data},`;
              if((i+1)== _this.tempFilePaths.length){
                _this.submitCommentData(_this.inlineImg);
              }
            }
          })
        }


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
                      url:`/pages/packageC/pages/goodsDetail/main?bargainTasksId=${_this.bargainTasksId}&bargainId=${_this.bargainId}`
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
