<template>
    <el-dialog
        :visible="delTagDialogVisible"
        width="500px"
        :before-close="dialogBeforeClose">
        <div class="con">
            <div class="con-center">
                <p class="icon-wrap">
                    <i style="font-size: 50px;" class="icon iconfont icon-icon_popup_question"></i>
                </p>
                <div class="text">
                    <p class="title">确定要删除吗？</p>
                    <p class="context">删除后，所有使用该标签的客户都不再显示该标签，不可恢复。 </p>
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button @click="$emit('close')">取 消</el-button>
            <el-button style="background:#58C9F3;border-color:transparent" type="primary" @click="$emit('confirm')">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        delTagDialogVisible:Boolean
    },
    methods: {
        dialogBeforeClose(){
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.con{
    display: flex;
    justify-content: center;
    .con-center{
        display: flex;
        .icon-wrap{
            font-size: 50px;
            color: #FF6D61;
            margin-right: 15px; 
        }
        .text{
            width: 275px;
            .title{
                font-size: 20px;
                color: #333333;
                font-weight: 600;
                line-height: 30px;
            }
            .context{   
                font-size: 14px;
                color: #666666;
            }
        }
    }
}
.footer{
    margin-top: -30px;
    margin-bottom: -10px;
}
</style>
