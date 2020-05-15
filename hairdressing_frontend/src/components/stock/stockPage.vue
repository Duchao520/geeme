<template>
  <div>
    <el-pagination background layout="prev, pager, next" :total="total" @size-change="sizeChange" @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick"></el-pagination>
  </div>
</template>

<script>
export default {
    props:{
        total:{
            type:Number,
            default:100
        }
    },
    data(){
        return{

        }
    },
    methods: {
        sizeChange(){
            this.$emit('sizeChange');
        },
        currentChange(){
            this.$emit('currentChange');
        },
        prevClick(){
            this.$emit('prevClick');
        },
        nextClick(){
            this.$emit('nextClick');
        }
    },

}
</script>