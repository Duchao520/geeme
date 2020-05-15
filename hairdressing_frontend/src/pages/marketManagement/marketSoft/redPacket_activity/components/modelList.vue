<template>
  <div class="arp-model-main" v-loading="loading">
    <div class="arp-table-main">
      <div class="arp-table-box">
        <el-table :data="tableData" height="calc(100vh - 245px)" stripe>
          <el-table-column prop="templateName" label="模板名称"></el-table-column>
          <el-table-column prop="templateName" label="模板类型">
            <template slot-scope="{ row }">
              <!-- <p>{{ templateTypeName(row.packetType) }}</p> -->
              <span
                  class="red-packet-type-tag text-cant-copy"
                  :class="'tag-' + row.packetType"
                >{{ templateTypeName(row.packetType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="templateName" label="子红包">
            <template slot-scope="{ row }">
              <div v-if="redPackSon(row) === 3">
                <p>定额红包</p>
                <p>随机红包</p>
              </div>
              <div v-if="redPackSon(row) === 1">
                <p>定额红包</p>
              </div>
              <div v-if="redPackSon(row) === 2">
                <p>随机红包</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="templateName" label="子红包数量">
            <template slot-scope="{ row }">
              <div v-if="redPackSon(row) === 3">
                <p>X{{ fixSum(row) }}</p>
                <p>X{{ randomSum(row) }}</p>
              </div>
              <div v-if="redPackSon(row) === 1">
                <p>X{{ fixSum(row) }}</p>
              </div>
              <div v-if="redPackSon(row) === 2">
                <p>X{{ randomSum(row) }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="templateName" label="使用条件">
            <template slot-scope="{ row }">
              <p>{{ (row.redPacketDetailTemplateInfoList[0].packetUseCondition ? `满${row.redPacketDetailTemplateInfoList[0].leastMoney}元可用` : `无使用门槛`) }}{{row.redPacketDetailTemplateInfoList.length > 1 ? '等' : '' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <g-button
                :name="'编辑'"
                class="text-cant-copy"
                :type="'detail'"
                :icon="'icon_operate_edit'"
                @click="toEdit(row.id)"
              ></g-button>
              <g-button
                :name="'派发'"
                class="text-cant-copy"
                :type="'green'"
                :icon="'icon_ope_publish'"
                @click="toPublish(row)"
              ></g-button>
              <g-button
                class="text-cant-copy"
                :type="'delete'"
                :icon="'icon_operate_delete'"
                @click="toDelete(row)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="arp-pagination">
        <el-pagination
          style="margin: 5px 0px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="form.pageNum"
          :page-size="form.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 删除模板提示 -->
    <g-dialog-with-slot
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定要删除该模板吗？'"
      :dialogVisible="dialogVisible"
      @resolve="confirmDel"
      @close="dialogVisible=false"
      :btnLoad="btnLoad"
    >
      <div>删除后，该模板将不能使用来派发红包。已派发的红包不受影响</div>
    </g-dialog-with-slot>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      form: {
        // packetTypeName:null,
        // templateName: null,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialogVisible: false, // 删除提示框标识
      currentTem: {},
      btnLoad: false,
    };
  },
  created() {
    this.init();
  },

  methods: {
    // ...mapActions(['']),
    async init() {
      let data = {
        ...this.form,
        brandId: this.currentInfo.brandId
      };
      this.loading = true;
      let res = await axios.post("/pagedQueryRedPacketTemplateInfo", data);
      this.total = res.total;
      this.tableData = res.redPacketTemplateInfoList;
      this.loading = false;
    },
    handleCurrentChange(page) {
      this.form.pageNum = page;
      this.init();
    },
    // 模板类型名称
    templateTypeName(type) {
      switch (type) {
        case 1:
          return "新人红包";
          break;
        case 2:
          return "老客红包";
          break;
        case 3:
          return "生日红包";
          break;
        default:
          return "活动红包";
          break;
      }
    },
    // 子红包类型标识
    redPackSon(row) {
      let random = 0;
      let fix = 0;
      row.redPacketDetailTemplateInfoList.forEach(item => {
        if (item.redPacketDetailType === 1) {
          fix++;
        } else {
          random++;
        }
      });
      if (random > 0 && fix > 0) {
        return 3;
      }
      if (random > 0 && fix == 0) {
        return 2;
      }
      if (random == 0 && fix > 0) {
        return 1;
      }
    },
    // 子红包数量
    fixSum(row) {
      let count = 0;
      row.redPacketDetailTemplateInfoList.forEach(i => {
        if (i.redPacketDetailType === 1) {
          count += i.count;
        }
      });
      return count;
    },
    randomSum(row) {
      let count = 0;
      row.redPacketDetailTemplateInfoList.forEach(i => {
        if (i.redPacketDetailType === 2) {
          count += i.count;
        }
      });
      return count;
    },
    // 编辑红包模板
    toEdit(id) {
      this.$router.push({
        name: "/brand-inner/market/market-list/edit-red-packet-model",
        params: {
          id
        }
      });
    },
    toDelete(row) {
      this.currentTem = row;
      this.dialogVisible = true;
    },
    //  确认删除事件
    async confirmDel() {
      this.btnLoad = true;
      const res = await axios.post("/invalidRedPacketTemplate", {
        id: this.currentTem.id
      });
      if (!res.success) return this.$message.error("删除模板失败");
      this.$message.success("删除模板成功");
      this.init();
      this.dialogVisible = false;
      this.btnLoad = false;
    },
    // 派发模板
    toPublish(row) {
      this.$router.push({
        name: "/brand-inner/market/market-list/activity-red-packet-send",
        params: {
          row
        }
      });
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    })
  },
  watch: {
    packetName: function(v, o) {
      this.form.templateName = v;
      this.handleCurrentChange(1);
    }
  },
  props: {
    packetName: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang='scss' scoped>
$default_peacock_blue: #41cac0;
$default_blue: #58c9f3;
$default_green: #75c74f;
$default_red: #f52d56;
$default_yellow: #fcb322;
$hover_gray: #bec3c6;
/* arp ==> activity-red-packet */
.arp-model-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  /*.arp-filter-line {
    height: 75px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    .arp-form {
      display: flex;
      align-items: center;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .normal_blue_btn {
      margin-left: 12px;
    }
  }*/
  .arp-table-main {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    .arp-table-box {
      padding: 10px;
      flex: 1;
    }
    .arp-pagination {
      height: 75px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

.red-packet-type-tag {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    &.tag-1 {
      border: 1px solid $default_peacock_blue;
      color: $default_peacock_blue;
    }
    &.tag-2 {
      border: 1px solid $default_yellow;
      color: $default_yellow;
    }
    &.tag-3 {
      border: 1px solid $default_green;
      color: $default_green;
    }
    &.tag-4 {
      border: 1px solid $default_red;
      color: $default_red;
    }
  }
</style>
