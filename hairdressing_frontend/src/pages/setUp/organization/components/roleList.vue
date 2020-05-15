<template>
  <div class="role-box">
    <!-- header -->
    <div class="header">权限角色</div>
    <!-- search -->
    <div class="search-box">
      <i class="el-icon-search"></i>
      <input 
        type="text" placeholder="请输入角色名称" 
        v-model="keyword" 
      >
        <!-- @input="search" -->
    </div>
    <!-- shops -->
    <div class="shop-box">
      <div class="shop-header">门店</div>
      <div class="shop-content">
        <ul>
          <li 
            class="list-item"
            v-for="item in shops" 
            :class="{'active': item.id === selectedItem}"
            :key="item.id"
            @click="selectOne(item)"
          >
            {{item.name}}
            <div v-show="item.id === selectedItem">
              <!-- <i class="el-icon-delete"></i>
              <i class="el-icon-edit-outline blue"></i> -->
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-box">
      <div class="main-header">总部</div>
      <div class="main-content">
        <ul>
          <li 
            class="list-item"
            v-for="item in brands" 
            :class="{'active': item.id === selectedItem}"
            :key="item.id"
            @click="selectOne(item)"
          >
            {{item.name}}
            <div v-show="item.id === selectedItem">
              <!-- <i class="el-icon-delete"></i>
              <i class="el-icon-edit-outline blue"></i> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/util/base.js";
import Bus from '@/util/bus'
export default {
  props: {
    brands: Array,
    shops: Array,
  },
  data() {
    return {
      keyword: "",
      selectedItem: null,
      activeRole: {},
    };
  },
  created() {},
  watch: {
    shops(val , oldV) { // 异步不稳定，监听
      if (val.length) {
        this.selectedItem = val[0].id
        this.activeRole = val[0]
        this.emitEvent(val[0])
      }
    }
  },
  computed: {},
  methods: {
    selectOne(role) {
      this.selectedItem = role.id
      this.activeRole = role
      this.emitEvent(role)
    },
    emitEvent(data) {
      Bus.$emit('auth_activeRoleData', data)
    },
    // search: util.debounce(function() {
    //   if (this.keyword === "") {
    //     this.data = JSON.parse(JSON.stringify(this.list))
    //     return
    //   }
    //   this.data = this.data.filter(item => item.label.search(this.keyword) >= 0)
    // }),
  }
};
</script>

<style lang='scss' scoped>
.role-box {
  width: 331px;
  height: 762px;
  border: 1px solid rgba(222, 225, 230, 1);
  border-radius: 5px;
  .header {
    height: 36px;
    background: #dee1e6;
    line-height: 36px;
    padding: 0 0 0 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .search-box {
    margin: 15px 15px 15px 15px;
    height: 30px;
    border: 1px solid rgba(222, 225, 230, 1);
    border-radius: 30px;
    display: flex;
    align-items: center;
    padding: 0 0 0 10px;
    i {
      color: rgba(222, 225, 230, 1);
    }
    input {
      background: none;
      outline: none;
      border: 0px;
      margin: 0 0 0 7px;
    }
    input::-webkit-input-placeholder {
      font-size: 13px;
      color: rgba(222, 225, 230, 1);
    }
  }
  .shop-box {
    padding: 0 15px;
    box-sizing: border-box;
    .shop-header {
      height: 32px;
      line-height: 32px;
      font-weight: 700;
      font-size: 14px;
      border-bottom: 1px dashed #999;
    }
    .shop-content {
      height: 250px;
      padding: 5px 0 0 0;
    }
  }
  .main-box {
    padding: 0 15px;
    box-sizing: border-box;
    .main-header {
      height: 32px;
      line-height: 32px;
      font-weight: 700;
      font-size: 14px;
      border-bottom: 1px dashed #999;
    }
    .main-content {
      height: 300px;
      padding: 5px 0 0 0;
    }
  }
  .list-item {
    font-size: 14px;
    padding: 0 15px 0 30px;
    color: #999;
    height: 36px;
    line-height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    &.active {
      background: #dee1e6;
    }
    i {
      font-size: 17px;
      margin: 5px;
    }
    i.blue {
      color: #58C9F3;
    }
  }
}
</style>