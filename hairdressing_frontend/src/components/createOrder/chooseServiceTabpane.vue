<template>
  <ul class="top-tabs">
    <button
      class="tab-item"
      v-for="(item, index) in list"
      :class="{'active': sortGoodsObj[sortGoodsType] === item.id}"
      :disabled="sortGoodsType==='cardAdd'"
      @click="triggerTab(item)"
      :key="index"
    >
      <span>{{ item.name }}</span>
    </button>
    <div class="line" :style="{left:activePosition.left,width:activePosition.width}"></div>
  </ul>
</template>
<script>
  import {mapState, mapActions} from "vuex";

  export default {
    props: {
      list: Array,
    },
    data() {
      return {
        activePosition: {left: 0, width: 0}
      };
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        sortGoodsType: state => state.bill.currentChooseTypeAndSortOneId.sortGoodsType,
        sortGoodsObj: state => state.bill.currentChooseTypeAndSortOneId.sortOneId,
      }),
      
    },
    watch: {
      list(list) {
        this.$nextTick().then(() => {
          if (list.length > 0) {
            this.getPosition();
          }
        });
      }
    },
    methods: {
      ...mapActions(["setGoodsSortOneId"]),
      triggerTab(item) {
        let idObj = {};
        idObj[this.sortGoodsType] = item.id;
        this.setGoodsSortOneId(idObj);
        this.$emit("queryGoodsListsBySortOne");
        setTimeout(() => {
          this.getPosition();
        }, 0);
      },
      getPosition() {
        let activeIndex = 0;
        let array = this.list;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.id === this.sortGoodsObj[this.sortGoodsType]) {
            activeIndex = index;
            break;
          }
        }
        let dom = document.getElementsByClassName("tab-item")[activeIndex];
        if (!dom) {
          this.activePosition = {
            left: 0,
            width: 0
          };
          return;
        }
        let l = dom.offsetLeft;
        let w = dom.offsetWidth;
        this.activePosition = {
          left: l + 0.05 * w + "px",
          width: 0.9 * w + "px"
        };
      }
    }
  };
</script>
<style lang="scss" scoped>
  .top-tabs {
    width: 100%;
    height: 100%;
    position: relative;

    .tab-item {
      display: inline-block;
      height: 100%;
      margin-left: 40px;
      color: #999999;
      font-size: 16px;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }

      &.active {
        color: #2a2c44;
      }
    }

    .line {
      position: absolute;
      bottom: 1px;
      height: 3px;
      border-radius: 2px;
      background: #2a2c44;
      transition: all 0.3s;
    }
  }
</style>
