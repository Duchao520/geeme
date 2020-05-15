<template>
    <div class="cate-container">
        <div :class="[{item:true,active:index==0}]"  v-for="(item,index) in cateList" :key="index">
            <div class="cate-title">{{item.title}}</div>
            <div class="cate-item" v-for="(listitem,indexs) in item.list" :key="indexs">{{listitem}}</div>
            <div class="cate-img" v-for="(img,indexs) in item.imgUrl" :key="indexs"><div class="img"><img :src="img"   alt="" v-if="type==='img'"></div></div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        cateList:Array,
        type: String
    }
}
</script>
<style lang="scss">
    .cate-container{
        width: 100%;
        height: auto;
        padding: 20px 22px;
        background: white;
        border-radius: 3px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
        .cate-img{
            margin-left: 21px;
        }
        .img{
            width: 47px;
            height: 28px;
            // margin-right: 15px;
            border: 1px solid rgba(239, 239, 239, 1);
            img{
                width: 100%;
                height: 100%;
            }
        }
        .item{
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            margin-top: 15px;
            &.active{
                margin-top: 0;
            }
            .cate-title{
                color: #333333;
                font-size: 14px;
            }
            .cate-item{
                color: #999999;
                font-size: 14px;
                margin-left: 21px;
            }
        }
    }
</style>