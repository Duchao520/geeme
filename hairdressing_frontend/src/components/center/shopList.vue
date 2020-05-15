<template>
  <div class="root-wrap">
    <!-- 放在父组件 -->
    <!-- <el-radio-group v-model="showRadio" size="medium">
      <el-radio-button label="NORMAL">全功能版</el-radio-button>
      <el-radio-button label="SUPPLIER">进销存版</el-radio-button>
    </el-radio-group> -->
    <el-table :data="list" style="width: 100%">
      <el-table-column label width="35" v-if="showBottomBtns">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.selected"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type='index' prop="orderNo" label="排序" width="78px">
        <template slot-scope="scope">

          <!-- 权限按钮注释1 -->
            <!-- @blur="changeStoreOrderNo(scope.row)" -->
          <el-input
            :disabled="(scope.row.operateCollection && !scope.row.operateCollection.includes('store_center_edit'))"
            @blur="(scope.row.operateCollection && scope.row.operateCollection.includes('store_center_edit')) && changeStoreOrderNo(scope.row)"
            :ref="'order-'+scope.row.shopId"
            type="number"
            class="input"
            maxlength="4"
            :min="0"
            v-model.number="scope.row.orderNo"
            placeholder
          ></el-input>

        </template>
      </el-table-column>
      <el-table-column prop="serialCode" label="门店编号" width="90"></el-table-column>
      <el-table-column prop="orderNo" label="门店信息" width="180px">
        <template slot-scope="scope">
          <div class="detail">
            <span class='spanImg' :style="{backgroundImage: 'url(' + utils.formatPicImg(scope.row.image, 'style') + ')'}"></span>
            <div>
              <p>{{scope.row.name}}</p>
              <span>{{scope.row.hotLine}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="140px">
        <template slot-scope="scope">
          <span style="color:#666666">{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="activeTime" label="开通时间" >
        <template slot-scope="scope">
          <span style="color:#333333">{{scope.row.activeTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dueToTime" label="到期时间" >
        <template slot-scope="scope">
          <span style="color:#333333">{{scope.row.dueToTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width='100'>
        <template slot-scope='scope'>
            <status-text :type="bgColor[scope.row.status]" :name="scope.row.status === 'ONLINE' ? '营业中' : scope.row.status === 'OFFLINE' || scope.row.status === 'TRY_OFF_LINE' ? '已下线': scope.row.status === 'INSTORE' ?'未上线' : scope.row.status === 'TRYING' ? '试用中': scope.row.status === 'TRY_OVER_DUE' ?'试用到期' : scope.row.status === 'OVER_DUE' ?'已到期' : ''"></status-text>
            <status-text v-if='scope.row.onlineRecommendation' type='mred' name='首页推荐'></status-text>
        </template>
      </el-table-column>
      <el-table-column prop="managerInfos" label="店长">
        <template slot-scope="scope">

          <!-- 权限按钮注释2 -->
          <span v-if="scope.row.operateCollection && scope.row.operateCollection.includes('store_center_assign')">
          <!-- <span> -->

            <span v-if="scope.row.managerInfos&&scope.row.managerInfos.length">
              <span
                style="color:#333333"
                v-for="(item,index) in scope.row.managerInfos"
                :key="index"
              >{{index===scope.row.managerInfos.length-1?item.name:item.name+','}}</span>
              <span style="color:#58C9F3;cursor:pointer" @click="getStaff(scope.row)">
                <i class="icon iconfont icon-icon_operate_edit"></i>
              </span>
            </span>
            <span v-else style="color:#58C9F3;cursor:pointer;" @click="getStaff(scope.row)">设置</span>
          </span>

          <!-- 权限按钮注释3 -->
          <span v-else>
            <span
              style="color:#333333"
              v-for="(item,index) in scope.row.managerInfos"
              :key="index"
            >{{index===scope.row.managerInfos.length-1?item.name:item.name+','}}</span>
          </span>

        </template>
      </el-table-column>
      <el-table-column label="操作" width="192px">
        <template slot-scope="scope">
          <div>

            <!-- 权限按钮注释4 -->
            <button
              v-if="scope.row.operateCollection && scope.row.operateCollection.includes('store_center_manage') && scope.row.status !== 'INSTORE'"
              class="manage-button"
              @click="toOpera(scope.row,'manage', scope.row.status)"
            >
              <i class="icon iconfont icon-icon_manage"></i>
              <span>管理</span>
            </button>

            <!-- 权限按钮注释5 -->
            <button class="edit-button"
              v-if="scope.row.operateCollection && scope.row.operateCollection.includes('store_center_edit')"
              @click="toOpera(scope.row, 'edit', scope.row.status)"
            >
              <i class="icon iconfont icon-icon_operate_edit"></i>
              <span>编辑</span>
            </button>

            <!-- 权限按钮注释6 -->
            <button class="del-button"
              v-if="scope.row.operateCollection && scope.row.operateCollection.includes('store_center_delete')"
              @click="toOpera(scope.row, 'delete')"
            >
              <i class="icon iconfont icon-icon_operate_delete"></i>
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <set-store-manage
      :setStoreManageModelVisible="setStoreManageModelVisible"
      @close="setStoreManageModelVisible = false"
      :addStoreManageInfoProto="addStoreManageInfo"
      v-on="$listeners"
    ></set-store-manage>
    <select-store-manage
      :selectStoreManageModelVisible="selectStoreManageModelVisible"
      :addStoreManageInfo="addStoreManageInfo"
      :staffs="staffs"
      @close="selectStoreManageModelVisible=false"
      v-on="$listeners"
    ></select-store-manage>

    <!-- 试用到期 & 正常到期 -->
    <g-dialog-with-slot
      v-if="dueVisible"
      :dialogVisible="dueVisible"
      :icon="'icon_popup_plaint'"
      :title="dueShopStatus === 'OVER_DUE' ? '已到期门店不支持管理!' : '该门店的试用已到期!'"
      :resolveInfo="dueShopStatus === 'OVER_DUE' ? '门店续期': '门店新购'"
      @close="dueVisible = false"
      @resolve="handleToBuySoft"
    >
      <!-- 以下是 shopCard pug 版转换的 orz -->
      <div v-if="dueShopStatus === 'OVER_DUE'">
        <span>查询历史数据请前往</span>
        <span class="blue-text page-router" @click="handleToMyBrands">品牌总部</span>
        <span>。如有疑问，</span>
        <br>
        <span>请联系及美客服电话:</span>
        <span class="blue-text text-for-copy">400-800-0650</span>
        <span>。</span>
      </div>
      <div v-else>
        <span>如需继续使用，请购买正式开通。如有疑</span>
        <br>
        <span>问，请联系及美客服电话:</span>
        <span class="blue-text text-for-copy">400-800-0650</span>
        <span>。</span>
      </div>
    </g-dialog-with-slot>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';
import * as utils from "@/assets/js/utils";
import SetStoreManage from "@/components/center/SetStoreManage";
import SelectStoreManage from "@/components/center/SelectStoreManage";
import { types } from 'util';

export default {
  components: {
    "set-store-manage": SetStoreManage,
    "select-store-manage": SelectStoreManage
  },
  props: {
    list: Array,
    showBottomBtns: Boolean
  },
  data() {
    return {
      utils: utils,
      setStoreManageModelVisible: false,
      selectStoreManageModelVisible: false,
      bgColor: {
        ONLINE: 'green',
        TRY_OVER_DUE: 'orange',
        OFFLINE: 'orange1',
        TRY_OFF_LINE: 'orange1',
        INSTORE: 'grey',
        TRYING:'sblue',
        OVER_DUE: 'orange',
      },
      storeName: "",
      staffs: [],
      addStoreManageInfo: {
        storeId: null,
        name: null,
        managerInfos: []
      },
      dueShopStatus: '', // 到期状态（试用或正常到期）
      dueVisible: false, // 对话框
      // showRadio: 'NORMAL'
    };
  },
  methods: {
    toOpera(item, type, status) {
      if (type === 'manage') {
        // 门店到期 & 试用到期 不能进入
        if (status === 'OVER_DUE' || status === 'TRY_OVER_DUE') {
          this.dueVisible = true
          this.dueShopStatus = status
          return 
        }
      }
      this.$emit("to-opera", {
        id: item.shopId,
        shopName: item.name,
        type: type,
        status: status,
        city: item.city,
        revenueType: item.revenueType,
        brandId: item.brandId,
        brandName: item.brandName,
        shopType: item.type
      });
    },
    setShopManager(data) {
      this.addStoreManageInfo = {
        storeId: data.shopId,
        name: data.name,
        managerInfos: data.managerInfos
      };
      this.setStoreManageModelVisible = true;
    },
    selectShopManager(data) {
      this.addStoreManageInfo = {
        storeId: data.shopId,
        name: data.name,
        managerInfos: data.managerInfos
      };
      this.selectStoreManageModelVisible = true;
    },
    changeStoreOrderNo(data) {
      // console.log(data, 789)
      if(data.orderNo<0) {
          this.$message({
            type: "error",
            message: "排序不能小于零！"
          });
          // this.$refs['order-'+data.shopId].focus()
      } else {
        axios.post(
          api.updateStoreOrderNo.URL,
          { orderNo: data.orderNo, storeId: data.shopId }
        ).then(res => {
          this.changeStoreOrderNoRes(res);
        })
      }
    },
    changeStoreOrderNoRes(res) {
      this.$emit("refresh");
      this.$message({
        type: "success",
        message: "改变门店排序成功！"
      });
    },
    getStaff(data) {
      axios.get("/getSimpleStaffListByShopId/" + data.shopId).then(res => {
        if (res.staffList.length) {
          this.staffs = res.staffList
          this.selectShopManager(data)
        } else {
          this.setShopManager(data)
        }
      })
    },
    // - 试用到期
    handleToMyBrands() {
      this.$router.push('/center/brands')
    },
    // - 续期-购买软件
    handleToBuySoft() {
      // if (this.dueShopStatus === 'OVER_DUE') {
      //   // 到期 - 购买续期券  
      // } else {
      //   // 试用 - 购买新开券
      // }
      this.$router.push("/center/buySoftware") // 暂时这么处理
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin button-icon-span($color, $bg, $border) {
  background: $bg;
  color: $color;
  padding: 0 6px;
  height: 28px;
  line-height: 26px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid $border;
  transition: all 0.6s;
  &:hover {
    opacity: 0.8;
  }
}
.root-wrap {
  .input {
    /deep/ .el-input__inner {
      width: 40px;
      height: 35px;
      padding: 3px;
      text-align: center;
    }
  }
  .detail {
    display: flex;
    &>div{
      flex: 1;
    }
    .spanImg {
      width: 40px;
      height: 40px;
      background-size: cover;
      background-position: center;
      border-radius: 4px;
      margin-right: 8px;
    }
    p {
      color: #333333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    span {
      color: #666666;
      font-size: 12px;
    }
  }
  .manage-button {
    @include button-icon-span(#ffffff, #ff6d61, #ff6d61);
  }
  .edit-button {
    @include button-icon-span(#58c9f3, transparent, #58c9f3);
  }
  .del-button {
    @include button-icon-span(#bec3c6, transparent, #bec3c6);
  }
}
.blue-text {
  color: #58c9f3;
}
.page-router {
  cursor: pointer;
}
</style>
