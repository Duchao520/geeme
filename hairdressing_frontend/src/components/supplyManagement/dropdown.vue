<template>
  <div>
    <el-dropdown trigger="click" style="margin-right:30px">
      <span class="el-dropdown-link">{{name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,index) in list" :key="index">{{item}}</el-dropdown-item>
       
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
    props:{
        name:String,
        list:Array
    },
    methods: {
        click(){

        }
    },
}
</script>