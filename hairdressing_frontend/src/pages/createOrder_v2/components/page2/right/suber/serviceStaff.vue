<template>
  <div class="service-staffs-box" :class="{single: total === 1}">
    <div class="single-staff-box" v-if="!staffList.length" @click="setStationStaff">
      工位{{count}}
    </div>
    <div class="single-staff-box" v-else @click="setStationStaff">
      <!-- 只显示两个, 切换状态去弹窗里处理 -->
      <div class="single-staff" v-for="(staff, index) in listStaff" :key="staff.id">
        <!-- 店内编号还没有 -->
        <p class="single-staff-top" :title="staff.shopNum || shopStaffsInfo[staff.id||staff.staffId] ? `${staff.name || staff.staffName || '-'}(${staff.shopNum || shopStaffsInfo[staff.id||staff.staffId]})` : ''">
          {{staff.name || staff.staffName || '-'}}
          <span v-if="staff.shopNum || shopStaffsInfo[staff.id||staff.staffId]">({{staff.shopNum || shopStaffsInfo[staff.id||staff.staffId]}})</span>
        </p>
        <p>
          <span class="send-type-tags text-cant-copy" :class="{active: staff.isChosen}" @click.stop="changeStaffChosen(index)">{{staff.isChosen ? '指 定' : '非指定'}}</span>
          <span>{{staff.ratio}}%</span>
        </p>
      </div>
    </div>
    <div class="top-flag"></div>
    <div class="top-count">{{count}}</div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: 'service-staff',
  props: {
    // 工位总数
    total: {
      type: Number,
      required: true
    },
    // 工位下标
    count: {
      type: Number,
      required: true
    },
    // 工位职工列表
    staffList: {
      type: Array
    }
  },
  methods: {
    ...mapActions(['setSelectedGoodsValue']),
    // 呼唤弹窗
    setStationStaff() {
      this.$emit('setStationStaff', this.count)
    },
    // 修改vuex中的工位指定非指定
    changeStaffChosen(idx) {
      let arr = ['stationOne', 'assistantOrSalers', 'stationThree']
      let currentKey = arr[this.count - 1]
      let goodsWorkStations = JSON.parse(JSON.stringify(this.billInfo.selectedGoods[this.$attrs.index][currentKey]))
      goodsWorkStations[idx].isChosen = !goodsWorkStations[idx].isChosen
      this.setSelectedGoodsValue({
        index: this.$attrs.index,
        [currentKey]: goodsWorkStations
      })
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
      shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
    }),
    listStaff() {
      if (this.total === 1) {
        // - 仅一个工位时 改成横向展示3个人
        return this.staffList.slice(0,3)
      }
      return this.staffList.slice(0,2)
    }
  }
}
</script>
<style lang='scss' scoped>
.service-staffs-box, .single-staff-box {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  position: relative;
}
.top-flag {
  position: absolute;
  top: 0;
  right: 0;
  width: 0px;
  height: 0px;
  border-style: solid;
  border-color: red red transparent transparent;
  border-width:  10px 10px 10px 10px;

}
.top-count {
  position: absolute;
  top: -2px;
  right: 1px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
}

// - 仅一个工位时 改成横向展示3个人 start -
.service-staffs-box.single {
  box-sizing: border-box;
  padding: 0 20px;
  .single-staff-box {
    flex-direction: row;
    justify-content: space-between;
  }
}
// = 仅一个工位时 改成横向展示3个人 end =

.single-staff-box {
  cursor: pointer;
  color: #C7CAD1;
}
.single-staff {
  height: 40px;
  color: #333;
  .single-staff-top {
    margin-bottom: 2px;
    width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .send-type-tags {
    border-radius: 12px;
    padding: 0px 4px;
    font-size: 12px;
    display: inline-block;
    width: 42px;
    text-align: center;
    // border: 1px solid rgba(193, 192, 201, 1);
    color: #fff;
    background: #BEC3C6;
    &.active {
      background: #58C9F3;
    }
  }
}
</style>
