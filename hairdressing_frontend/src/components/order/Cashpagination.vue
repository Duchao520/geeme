<template>
    <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          id="pagination"
        ></el-pagination>
    </div>
</template>

<script>
export default {
    props:{
        pageSize:Number,
        totalCount:Number,
        currentPage:Number
    },
    data(){
        return{
        }
    },
    mounted() {
    },
    methods:{
        handleSizeChange(e){
            this.$emit('handleSizeChange',e)
        },
        handleCurrentChange(e){
            this.$emit('handleCurrentChange',e)
        }
    }
}
</script>