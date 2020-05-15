<template>
<div class="pages-main-box scrollbar">
  <div class="pages-edit-container">
    <div class="red-packet-card-list" v-loading.fullscreen="loading">
      <div class="red-packet-tabs-line">
        <div v-for="tag in tags" :key="tag.id" class="tags" :class="{active: active === tag.id}" @click="setCurrentActive(tag.id, 1)">
          {{tag.name}}
          <div class="flag-line"></div>
        </div>
      </div>
      <div class="red-packet-list-box" ref="cardBox">
        <div class="has-info" v-if="hasinfo">
          <singleRedpacket 
            v-for="(item, idx) in list" 
            :key="idx" 
            :superData="item.customerRedPacketBasicInfo" 
            :singleData="item.customerRedPacketDetailInfo"
            :customerEntry="{type: active, sTime: item.validStartTime, eTime: item.validFinishTime, startValid: item.startValid}"
          />
          <div class="bottom-page-line">
            <i></i>
            <el-pagination
              style="margin: 5px 0px 5px 0;"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
        <div class="no-info" v-else>
          <img :src="require('@/assets/img/bg_default_goods.png')">
          <p>暂无该类型的红包</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import * as axios from '@/util/axios'
import { mapActions, mapState } from "vuex"
import singleRedpacket from '@/pages/marketManagement/marketSoft/redPacket/components/singleRedPacket'
export default {
  data() {
    return {
      active: null,
      tags: [
        {name: '未使用', id: 1},
        {name: '已使用', id: 2},
        {name: '已过期', id: 3},
      ],
      pageSize: 0,
      currentPage: 1,
      total: 0,
      loading: false,
      hasinfo: true, // 
      list: [],
    }
  },
  mounted() {
    this.calculateItems()
    this.setCurrentActive(this.tags[0].id, 1)
  },
  methods: {
    setCurrentActive(id, page) {
      if (this.active !== id) {
        this.active = id
        this.currentPage = page
        this.loading = true
        let url = ''
        switch (id) {
          case 1:
            url = '/pcPagedQueryBrandEffectiveCustomerRedPacketInfo'
            break
          case 2:
            url = '/pcPagedQueryBrandUsedCustomerRedPacketInfo'
            break
          case 3:
            url = '/pcPagedQueryBrandExpiredCustomerRedPacketInfo'
            break
          default:
            url = '/pcPagedQueryBrandEffectiveCustomerRedPacketInfo'
        }
        console.log(this.currentEntry)
        let customerId = 
        this.currentEntry === "shop"
          ? "customerId"
          : "brandCustomerId";
        let params = {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          pageNum: this.currentPage - 1,
          // customerId: this.customerId,
          // customerId: this.$route.params.id * 1,
          pageSize: this.pageSize,
        }
        params[customerId] = this.$route.params.id * 1,
        this.hasinfo = true
        axios.post(url, params).then(res => {
          this.list = res.listRedPacket || []
          this.hasinfo = !!this.list.length
          this.total = res.total
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.hasinfo = false
        })
      }
    },
    calculateItems() {
      // big-box
      let bw = this.$refs.cardBox.clientWidth
      let bh = this.$refs.cardBox.clientHeight
      // single-box
      let sw = 185
      let sh = 234
      let col = Math.floor(bw / sw)
      let row = Math.floor(bh / sh)
      this.pageSize = col * row
      console.log(bh, col, row)
    },
    handleCurrentChange(page) {
      this.setCurrentActive(this.active, page)
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
      // customerId: state => state.queryParams.beautyRecordId
    })
  },
  components: {singleRedpacket}
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}
.red-packet-card-list {
  padding: 0 20px;

  max-width: 1440px;
  // min-height: 100%;
  min-height: calc(100vh - 105px);
  box-sizing: border-box;
  // padding: 40px 70px;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  .red-packet-tabs-line {
    height: 49px;
    line-height: 49px;
    border-bottom: solid 1px #d8d8d8;
    display: flex;
    .tags {
      width: 76px;
      margin-right: 15px;
      height: 100%;
      text-align: center;
      font-size: 14px;
      color: #999;
      position: relative;
      &:hover {cursor: pointer;}
      .flag-line {
        visibility: hidden;
        position: absolute;
        width: 40px;
        height: 3px;
        bottom: 0;
        left: 18px;
        background-color: #E4393C;
      }
      &.active {
        color: #E33443;
        .flag-line {
          visibility: visible;
        }
      }
    }
  }
  .red-packet-list-box {
    height: calc(100vh - 228px);
    margin: 10px 0;
    .has-info {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      position: relative;
    }
    .no-info {
      height: 100%;
      text-align: center;
      img{
        width: 276px;
        margin: 200px auto 0;
      }
      p {
        color: rgba(153, 153, 153, 1);
        font-size: 16px;
        text-align: center;
        margin-top: 40px;
      }
    }
  }
  .bottom-page-line {
    width: 100%;
    display: flex;
    position: absolute;
    bottom: -52px;
    right: 0;
    justify-content: space-between;
  }
}
.single {
  width: 165px;
  height: 214px;
  // background: goldenrod;
  margin: 10px 20px 10px 0;
}
</style>
