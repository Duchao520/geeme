<template>
  <div class="choose-image-root">
    <div class="img-list">
      <div class="image"
           v-for="(item,index) in medias"
           :key="index"
           :style="{
              backgroundImage:`url(${utils.imgFormatter(item)})`
           }"
           :class="{active:value===item}"
           @click="clickImage(item)"
      >
      </div>
    </div>
    <a-pagination showQuickJumper :pageSize="pageSize" :defaultCurrent="1" :total="total" @change="onChange"/>
  </div>
</template>
<script>
  import {getMediaByGroupKey} from '@/api/materialBase';
  import utils from '@/utils';
  /*
  *
  * 如您所见，该组件已经支持v-model绑定，但是上游组件太牛逼，无法配合尔
  *
  * */
  export default {
    props: {
      groupKey: Number,
      pageSize: {
        type: Number,
        default: 20
      },
      value:String
    },
    data() {
      return {
        pageNum: 1,
        medias: [],
        total:0,
        utils,
      }
    },
    mounted() {
      this.getImage()
    },
    methods: {
      async getImage() {
        const param = {
          groupKey: this.groupKey,
          keyWord: "",
          mediaType: "image",
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        const res = await getMediaByGroupKey(param);
        this.medias = (res.data.medias || []).map(item=>item.mediaKey);
        this.total = res.data.total;
      },
      onChange(num){
        this.pageNum = num;
        this.getImage()
      },
      clickImage(img){
        this.$emit('change',img);
        this.$emit('input',img);
      }
    }
  }
</script>
<style lang="less" scoped>
.choose-image-root{
  .img-list{
    display: flex;
    flex-wrap: wrap;
    width: 600px;
    .image{
      width: 50px;
      height: 50px;
      border: 1px solid rgba(220, 223, 230, 1);
      box-sizing: border-box;
      background-position: center;
      background-size: cover;
      margin: 0 10px 10px 0;
      cursor: pointer;
      transition: all 0.2s;
    }
    .active{
      border: 2px solid #58C9F3;
    }
  }
  .ant-pagination{
    float: right;
    margin-top: 10px;
  }
}
</style>
