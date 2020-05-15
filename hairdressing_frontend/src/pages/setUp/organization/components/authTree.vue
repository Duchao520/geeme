<template>
  <div class="auth-box">
    <div class="header">
      <div class="bread-crumbs">
        <span class="role-title">权限设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="role-info">
          {{role.name}}&nbsp;
          <span v-if="role.description">({{role.description}})</span>
        </span>
      </div>
    </div>
    <div class="role-tree-box">
      <!-- el-tree 的属性 -->
      <!-- accordion -->
      <el-tree
        @node-drag-end="handleDragEnd"
        :draggable="draggable"
        ref="authTree"
        :data="treeData.privilege"
        :props="options"
        show-checkbox
        node-key="id"
        :default-checked-keys="treeData.leafNodeId"
        @node-click="handleEditNode"
      >
        <!-- jsx 语法 -->
        <!-- :render-content="renderContent" -->

        <!-- 按钮级权限控制预留 slot语法-->
        <span class="auth-tree-btn" slot-scope="{node, data}">
          <span>{{node.label}}</span>
          <span style="margin-left:14px;">
            <span v-for="item in data.power" :key="item.flag">
              <el-checkbox v-model="item.status"></el-checkbox>
              {{item.name}}
            </span>
          </span>
        </span>
      </el-tree>

      <!-- 这个是要删除的按钮 -->
      <!-- <el-button class="submit" type="primary" @click="submit">保存</el-button> -->
    </div>
    <el-dialog 
      title="权限节点编辑：警告, 如不清楚请勿乱操作!!!"
      :visible.sync="editAuthDialog"
    >
      <el-form :model="nodeDomDataInDialog">
        <el-form-item prop="父节点id(后端树节点)" label="parent_id">
          <el-input v-model="nodeDomDataInDialog.parent_id"></el-input>
        </el-form-item>
        <el-form-item prop="权限树层级" label="level">
          <el-input v-model="nodeDomDataInDialog.level"></el-input>
        </el-form-item>
        <el-form-item prop="功能归属" label="type">
          <el-input v-model="nodeDomDataInDialog.type"></el-input>
          <!-- <span> 类型较多，参考后端数据表, 不要瞎填!</span> -->
        </el-form-item>
        <el-form-item prop="父节点id(前端路由)" label="front_parent_id">
          <el-input v-model="nodeDomDataInDialog.front_parent_id"></el-input>
        </el-form-item>
        <el-form-item prop="路由层级" label="front_level">
          <el-input v-model="nodeDomDataInDialog.front_level"></el-input>
        </el-form-item>
        <el-form-item prop="按钮权限" label="power">
          <div v-for="btn in nodeDomDataInDialog.power" :key="btn.frontFlag" class="btn-auth-box">
            <el-form-item label="按钮名称">
              <el-input v-model="btn.name"></el-input>
            </el-form-item>
            <el-form-item label="按钮初始化">
              <el-input v-model="btn.status"></el-input>
            </el-form-item>
            <el-form-item label="按钮后端标记">
              <el-input v-model="btn.flag"></el-input>
            </el-form-item>
            <el-form-item label="按钮前端权限标记">
              <el-input v-model="btn.frontFlag"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item prop="排序" label="sort">
          <el-input v-model="nodeDomDataInDialog.sort"></el-input>
        </el-form-item>
        <el-form-item prop="生产环境部署" label="online">
          <el-input v-model="nodeDomDataInDialog.online"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAuthDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAuthTreeDom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bus from "@/util/bus";
import * as axios from '@/util/axios'
import * as utils from "@/assets/js/utils";
import { formatArrayToObjOrFlatArray } from "@/util/index";
export default {
  props: {},
  data() {
    return {
      role: {},
      options: {
        label: "name",
        children: "list",
        // 是否禁用树节点
        // disabled: (data, node) => {
        //   return true
        // }
      },
      treeData: [],
      draggable: false, // 允许拖放开关, 非数据库修改需要请勿开启!!! 上线确保为:false 
      editAuthDialog: false, // 编辑权限节点的对话框状态
      nodeDomDataInDialog: {},
    };
  },
  computed: {},
  created() {
    Bus.$on("auth_activeRoleData", data => {
      this.role = data;
      this.getDataById(data.id);
    });
  },
  beforeDestroy() {
    Bus.$off("auth_activeRoleData");
  },
  methods: {
   /*  renderContent(h, {node, data, store}) {
      // 按钮render-content jsx语法
      return (
        <span class="auth-tree-btn">
          <span>{node.label}</span>
          <span style="margin-left:14px;">
            {
              data.power && data.power.map(item => {
                return <el-checkbox value={item.status}>{item.name}</el-checkbox>
              })
            }
          </span>
        </span>
      )
    }, */

    submit() {
      this.$parent.loadingStatus(true);
      let halfCheckedKeys = this.$refs["authTree"].getHalfCheckedKeys();
      let checkedKeys = this.$refs["authTree"].getCheckedKeys();
      let cacheObj = {};
      formatArrayToObjOrFlatArray(
        this.treeData.privilege,
        cacheObj,
        "id",
        "list"
      );
      let params = [];
      checkedKeys.forEach(item => {
        if (cacheObj[item].power) {
          let r = [];
          cacheObj[item].power.forEach(btn => {
            btn.status && r.push(btn.flag);
          });
          params.push({
            privilegeId: cacheObj[item].id,
            roleId: this.role.id,
            selectedBt: r.join(",")
          });
        } else {
          params.push({
            privilegeId: cacheObj[item].id,
            roleId: this.role.id,
            selectedBt: ""
          });
        }
      });
      axios.post(
        `${SERVICE_URL}/service-api/saveRolePrivilege`,
        params
      ).then(res => {
        utils.showTip(this, { msg: res.message, type: "success" });
        this.$parent.loadingStatus(false);
      })
    },
    getDataById(id) {
      this.$parent.loadingStatus(true);
      axios.get(
        `${SERVICE_URL}/service-api/queryRolePrivilege/${id}`
      ).then(res => {
        this.$parent.loadingStatus(false);
        this.treeData = res.privilegeInfo;
      })
    },

    // 节点移动函数（上线不要用！！！）
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", draggingNode);
      console.log("tree drag end: ", dropNode.data);
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
      console.log("tree drag end: ", ev);
      if (!!dropType) {
        axios.post(
          `${SERVICE_URL}/service-api/moveTreeNode`,
          {
            id: draggingNode.data.id,
            parentId:
              dropType === "inner" ? dropNode.data.id : dropNode.data.parentId,
            root: false
          }
        ).then(res => {
            console.log(res);
        })
      }
    },
    // 权限树的点击-展开对话框
    handleEditNode(node) {
      if (!this.draggable) return
      this.editAuthDialog = true
      // 存储当前节点，存储当前节点的父节点
      this.nodeDomDataInDialog = node
    },
    // 权限树的数据编辑
    editAuthTreeDom() {

    }
  }
};
</script>
<style lang='scss' scoped>
.role-title {
  font-weight: 700;
  font-size: 16px;
  color: #333;
}
.role-info {
  font-size: 16px;
  color: #666;
}
.auth-box {
  .header {
    height: 36px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bread-crumbs {
    }
  }
}
.submit {
  margin-top: 20px;
}
.btn-auth-box {
  margin: 20px 0;
}
</style>

<style lang='scss'>
#gm_set_index .org-auth{
  .el-checkbox + .el-checkbox {
    margin-left: 10px;
  }
  .el-checkbox__label {
    padding-left: 2px;
  }
}
</style>
