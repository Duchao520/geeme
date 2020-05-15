<template>
  <div class="shop-column-main scrollbar" v-loading="loading">
    <el-table
      :data="columndata"
      style="width: 100%"
      :span-method="arraySpanMethod"
    >
      <el-table-column label="位置">
        <template slot-scope="{ row }">{{ row.location | locationName }}</template>
      </el-table-column>
      <el-table-column prop="name" label="排序">
        <template slot-scope="{ row }">
          <number-input
            v-model="row.weight"
            class="input"
            :min="0"
            :max="999"
          ></number-input>
        </template>
      </el-table-column>
      <el-table-column label="栏目标题">
        <template slot-scope="{ row }">
          <el-input v-model="row.showName" maxlength="5" placeholder="请输入标题" style="width: 100px;"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="{ row }">
          <!-- <G-Upload-Pic
            :size="2"
            @success="(data) => { onSuccess(data, row) }"
            :defaultKey="row.icon"
            style="display:inline-block;"
            preview
            remove
            @remove="(data) => { onRemove(data, row) }"
          ></G-Upload-Pic>-->
          <g-upload-spic
            @change="(data) => { onSuccess(data, row) }"
            :photo="row.showIcon"
            :size="2"
            :showTip="false"
            v-if="row.type == 'normal' || !row.type"
          ></g-upload-spic>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="链接页面">
        <template slot-scope="{ row }">
          <el-select
            v-model="row.showLink"
            placeholder="请选择"
            style="width: 120px;"
            v-if="row.type == 'normal'"
          >
            <el-option
              v-for="item in linkOptions"
              :key="item.name"
              :label="item.showName"
              :value="item.name"
            ></el-option>
          </el-select>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="是否显示">
        <template slot-scope="{ row }">
          <el-checkbox
            v-if="row.type != 'title'"
            v-model="row.showFlag"
            :true-label="1"
            :false-label="0"
          >{{'显示'}}</el-checkbox>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row }">
          <!-- <G-OptButton type="add" @click="onAdd(row)" /> -->
          <g-button
            :name="'恢复默认'"
            type="mgreen"
            :icon="'icon_operate_recover'"
            @click="recover(row)"
          ></g-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      style="margin-top: 20px;"
      @click="saveEdit"
      :loading="btnLoad"
      class="normal_red_btn"
    >保存修改</el-button>
    <!-- 恢复默认提示框 -->
    <g-del-model
      :delTagDialogVisible="recoverDialogVisible"
      @close="recoverDialogVisible=false"
      @confirm="confirmRecover"
      :title="'确定要恢复默认吗？'"
      :content="'恢复默认后，现有的数据不做保留，请谨慎操作！'"
      :icon="'icon_popup_question'"
      :iconColor="'#FF6D61'"
      :btnLoad="btnLoad"
    ></g-del-model>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      linkOptions: [
        {
          name: "",
          showName: ""
        }
      ],
      columndata: [],
      loading: false,
      btnLoad: false,
      // 合并单元格需要的数字
      brandNum: 0,
      storeNum: 0,
      appNum: 0,
      optColumn: {
        // 选中的栏目
      },
      recoverDialogVisible: false,
      currentColumn: {}
    };
  },
  mounted() {
    this.getLinkInfo();
    this.getAllColumnInfo();
  },
  methods: {
    linkValid(rule, value, cb) {
      if (!value) {
        cb(new Error("请选择链接页面"));
      }
      cb();
    },
    iconValid(rule, value, cb) {
      if (!value) {
        cb(new Error("请上传图标"));
      }
      cb();
    },
    onReSort(val, row) {},
    // 获取链接页面信息
    getLinkInfo() {
      axios.get(`/getAppletColumnLinkList`).then(res => {
        this.linkOptions = res.appletColumnLinks;
      });
    },
    // 获取所有栏目配置信息
    async getAllColumnInfo() {
      this.loading = true;
      this.brandNum = 0;
      this.storeNum = 0;
      this.appNum = 0;
      const res = await axios.get(
        `/getBrandWeAppletColumnSettingSelfByBrandId/${this.currentInfo.brandId}`
      );
      this.columndata = res.settingSelfList;
      // 对数据进行处理
      this.columndata.forEach(item => {
        if (!item.id) {
          item.settingId = item.columnSettingInfo.id;
          item.showFlag = item.columnSettingInfo.defaultShow;
          item.showIcon = item.columnSettingInfo.icon;
          item.showLink = item.columnSettingInfo.link;
          item.showName = item.columnSettingInfo.name;
        }
          item.brandId = this.currentInfo.brandId;
          item.type = item.columnSettingInfo.type;
          item.location = item.columnSettingInfo.location;
      });
      // 合并单元格所需的数值
      this.columndata.forEach(item => {
        if (item.location == "brand") {
          this.brandNum++;
        } else if (item.location == "store") {
          this.storeNum++;
        } else if (item.location == "appointment") {
          this.appNum++;
        }
      });
      this.$nextTick(() => {
        setTimeout(()=>{
          this.loading = false
        },320)
      })
    },
    onSuccess(data, row) {
      row.showIcon = data;
    },
    async saveEdit(obj, type) {
      try {
        this.btnLoad = true;
        const res = await axios.post("/addOrModifyBrandWeAppletColumnSelf", {
          brandWeAppletColumnSelfList: type == 'single' ? [obj] : this.columndata
        });
        if (!res.success) return this.$message.error("修改失败" + res.message);
        this.$message.success("修改成功");
        this.btnLoad = false;
        this.columndata = []
        this.getAllColumnInfo();
        this.recoverDialogVisible = false
      } finally {
        this.btnLoad = false;
      }
    },
    // 排序
    onReSort(val, row) {},
    recover(row) {
      this.currentColumn = row;
      this.recoverDialogVisible = true;
    },
    confirmRecover() {
      let obj = this.currentColumn
      let recoverObj = obj.columnSettingInfo
      obj.showFlag = recoverObj.defaultShow
      obj.showIcon = recoverObj.icon
      obj.showLink = recoverObj.link
      obj.showName = recoverObj.name
      obj.weight = 0
      this.saveEdit(obj,'single')
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 && rowIndex < this.brandNum) {
        if (rowIndex == 0) {
          return [this.brandNum, 1];
        } else {
          return [0, 0];
        }
      } else if (columnIndex == 0 && rowIndex < this.brandNum + this.storeNum) {
        if (rowIndex == this.brandNum) {
          return [this.storeNum, 1];
        } else {
          return [0, 0];
        }
      } else if (
        columnIndex == 0 &&
        rowIndex < this.brandNum + this.storeNum + this.appNum
      ) {
        if (rowIndex == this.brandNum + this.storeNum) {
          return [this.appNum, 1];
        } else {
          return [0, 0];
        }
      }
    }
  },
  filters: {
    locationName(val) {
      switch (val) {
        case "brand":
          return "品牌中心";
        case "store":
          return "门店首页";
        default:
          return "预约";
      }
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.shop-column-main {
  box-sizing: border-box;
  height: calc(100% - 32px);
  padding: 32px 40px 20px;
  overflow-y: auto;
}

.input {
  /deep/ .el-input__inner {
    width: 40px;
    height: 35px;
    text-align: center;
    text-indent: 0 !important;
  }
}
</style>