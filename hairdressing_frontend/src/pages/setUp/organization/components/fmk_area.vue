<template>
  <div class="fmk-area-box">
    <div class="area-top-box" v-show='showArea'>
      <div class="title-line">
        <span class="office-name">{{tags.nodeName}}</span>
        <i></i>
        <span class="children-size">下级区域 ({{childrenSize}}个)</span>
        <el-button class="add-office" type="primary" size="small">新增门店</el-button>
      </div>
      <div class="out-side">
        <el-table :key="0" stripe>
          <el-table-column align="left" label="排序"></el-table-column>
          <el-table-column align="left" label="区域名称"></el-table-column>
          <el-table-column align="left" label="门店数"></el-table-column>
          <el-table-column align="left" label="总人数"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="area-bottom-box">
      <div class="title-line">
        <span class="office-name">{{tags.nodeName}}</span>
        <i></i>
        <span class="children-size">成员 ({{totalMembers}}人)</span>
      </div>
      <div class="out-side">
        <el-table :key="0" stripe>
          <el-table-column align="left" label="姓名">
          </el-table-column>
          <el-table-column align="left" label="登录手机号">
          </el-table-column>
          <el-table-column align="left" label="部门/门店">
          </el-table-column>
          <el-table-column align="left" label="职务身份">
          </el-table-column>
          <el-table-column align="left" label="角色">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      childrenSize: 4, // 子部门数, 需要改变
      totalMembers: 104, // 门数员工数, 需要改变
    };
  },
  computed: {
    showArea() {
      return this.tags.nodeId === ''
    }
  },
  created() {
    console.log("我在这里请求行政区域名称", this.tags.nodeName);
  },
  watch: {
    "tags.nodeName": (v, o) => {
      console.log("我在这里监听行政区域名称变化,用新的参数重新请求数据", v);
    }
  }
};
</script>

<style lang='scss' scoped>
.area-top-box {
  position: relative;
  margin-bottom: 12px;
  .title-line {
    height: 32px;
    .office-name {
      font-weight: bold;
    }
    .children-size {
      color: #666;
    }
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-right: 1px solid #999;
      border-top: 1px solid #999;
      transform: rotate(45deg);
      margin: 0 8px;
    }
  }
  .add-office {
    position: absolute;
    right: 0;
  }
}
.out-side {
  position: relative;
  min-width: 800px;
  margin-top: 12px;
  padding: 15px;
  box-sizing: border-box;
  height: 330px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
}
.area-bottom-box {
  position: relative;
  margin-top: 30px;
  margin-bottom: 20px;
  .title-line {
    height: 32px;
    .office-name {
      font-weight: bold;
    }
    .children-size {
      color: #666;
    }
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-right: 1px solid #999;
      border-top: 1px solid #999;
      transform: rotate(45deg);
      margin: 0 8px;
    }
  }
}
</style>
 