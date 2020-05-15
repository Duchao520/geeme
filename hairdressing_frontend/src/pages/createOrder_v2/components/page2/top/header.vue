<template>
  <div class="choose-goods-header" v-loading.fullscreen="loading">
    <div class="left">
      <div class="title">{{title}}</div>
      <div class="back" @click="() => { $router.go(-1); }">上一步</div>
    </div>
    <div class="middle">
      <div class="goods-suber-box">
        <div 
          class="single-suber" 
          v-for="level in list" 
          :key="`${ billInfo.currentLeftType + level.id }`"
          :class="{active: level.id === billInfo.currentTopStatus[billInfo.currentLeftType] }"
          @click="changeTopNavId(level.id)"
        >
          <span>{{level.name}}</span>
          <div class="active-line"></div>
        </div>
      </div>
    </div>
    <!-- .right 不要删 -->
    <div class="right"></div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  props: {

  },
  data() {
    return {
      title: '',
      list: [], // 根据当前是服务产品，还是卡项、续卡来确定顶部导航内容
      loading: false, // 
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['setCurrentTopStatus']),
    init() {
      this.loading = true
      if (this.billInfo.currentLeftType === 'service') { // 服务
        this.title = '选择服务'
        this.getServicesList()
      } else if (this.billInfo.currentLeftType === 'product') { // 产品
        this.title = '选择产品'
        this.getProductsList()
      } else if (this.billInfo.currentLeftType === 'card') { // 开卡，自由卡
        this.title = '选择卡项'
        this.getCardsTypeList()
      } else { // 续卡升级 renewal_card
        this.title = '续卡升级'
        this.list = [
          { id: null, name: '全部' }, // 注意id, 隐式转换
          { id: 0, name: '身份卡' }, // 注意id, 隐式转换
          { id: 1, name: '储值卡' },
        ]
        this.setCurrentTopStatus({renewal_card: this.list[0].id}) // 刷新或者切换分类时,重置为全部
        this.loading = false
      }
    },
    
    // 获取服务的顶部分类
    getServicesList() {
      axios.post('/getServiceSortLevelOneList', {storeId: this.currentInfo.shopId}).then(res => {
        this.list = res.sortLevelOneList
        this.setCurrentTopStatus({service: this.list[0].id}) // 刷新或者切换分类时,重置为全部
        this.loading = false
      })
    },
    // 获取产品的顶部分类
    getProductsList() {
      axios.post('/getProductSortLevelOneList', {storeId: this.currentInfo.shopId, levelId: 1}).then(res => {
        this.list = res.sortLevelOneList
        this.setCurrentTopStatus({product: this.list[0].id}) // 刷新或者切换分类时,重置为全部
        this.loading = false
      })
    },
    // 获取卡项的顶部类型
    getCardsTypeList() {
      axios.get(`/getCardTypeInfo/${this.currentInfo.shopId}`).then(res => {
        this.list = res.listCardTypeBean.map(i => {
          return {
            id: i.type || null,
            name: i.typeName
          }
        })
        this.setCurrentTopStatus({card: this.list[0].id}) // 刷新或者切换分类时,重置为全部
        this.loading = false
      })
    },
    changeTopNavId(id) {
      this.setCurrentTopStatus({[this.billInfo.currentLeftType]: id})
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    })
  },
  watch: {
    'billInfo.currentLeftType': {
      handler: function(v, o) {
        if (v !== o) {
          this.init()
        }
      },
      immediate: true,
    }
  }
}
</script>
<style lang='scss' scoped>
.choose-goods-header {
  height: 65px;
  width: 100%;
  min-width: 800px;
  background: #fff;
  position: fixed;
  top: 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.left {
  margin: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    font-size: 18px;
    color: #333333;
    font-weight: 600;
    text-align: left;
  }
  .back {
    position: relative;
    font-size: 14px;
    color: #959595;
    cursor: pointer;
    text-indent: 12px;
    &:before {
      content: '';
      width: 7px;
      height: 7px;
      position: absolute;
      left: 3px;
      top: 6px;
      bottom: 0;
      transform: rotate(-45deg);
      border-left: 2px solid #959595;
      border-top: 2px solid #959595;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
}

.middle {
  flex: 1;
  position: relative;
  height: 65px;
  .goods-suber-box {
    height: 65px;
    overflow: hidden;
    position: absolute;
    background: #fff;
    // border-bottom: 1px solid #333;
    top: 0;
    z-index: 1;
    &:hover {
      height: auto;
      overflow: auto;
    }
  }
  .single-suber {
    display: inline-block;
    height: 65px;
    color: #999;
    line-height: 65px;
    position: relative;
    margin: 0 6px;
    cursor: pointer;
    .active-line {
      position: absolute;
      width: 100%;
      bottom: 0;
      height: 2px;
      background: #fff;
    }
  }
  .single-suber.active {
    color: #333;
    .active-line {
      background: #2a2c44;
    }
  }
}
.right {
  width: 450px; /* 右侧预留购物列表 width410 + margin20 */
  height: 100%;
}
</style>
