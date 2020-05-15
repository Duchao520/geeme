<template>
  <ul class="top-tabs">
    <li
      class="tab-item"
      v-for="(item, index) in list"
      :class="{'active': current === item.id}"
      @click="triggerTab(item)"
      :key="index"
    >
      <span>{{ item.name }}</span>
    </li>
    <div class="line" :style="{left:activePosition.left,width:activePosition.width}"></div>
  </ul>
</template>
<script>
export default {
  props: {
    list: Array,
    current: [Number, String,Object]
  },
  data() {
    return {
      activePosition:{left:0,width:0}
    };
  },
  watch: {
    list(list){
      this.$nextTick().then(
        () =>{
          if(list.length>0){
            this.getPosition()
          }
        }
      )
    }
  },
  computed: {
    currentInfo(){
      return this.$store.state.manage.currentInfo
    }
  },
  methods: {
    triggerTab(item) {
      this.$emit("change", item.id)
      this.getPosition()
    },
    getPosition(){
      let activeIndex = 0;
      let array = this.list;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.id === this.currentInfo.cpLevelId) {
          activeIndex = index;
          break
        }
      }
      let dom = document.getElementsByClassName("tab-item")[activeIndex];
      if (!dom) {
        this.activePosition = {
          left: 0,
          width: 0
        };
        return
      }
      let l = dom.offsetLeft;
      let w = dom.offsetWidth;
      this.activePosition = {
        left: l + 0.05 * w +'px',
        width: 0.9 * w +'px'
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
