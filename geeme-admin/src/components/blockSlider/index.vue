<template>
  <div class="block-slider-wrapper" ref="box">
    <div class="bg" ref="bg"></div>
    <div class="text" onselectstart="return false;" ref="text">请按住滑块，拖动到最右边</div>
    <div class="drag" ref="drag"></div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      downX: null,
      success: false,
      drag: null,
      box: null,
      bg: null,
      text: null,
      distance: null
    };
  },
  mounted() {
    this.drag = this.$refs.drag;
    this.box = this.$refs.box;
    this.bg = this.$refs.bg;
    this.text = this.$refs.text;
    this.distance = this.box.offsetWidth - this.drag.offsetWidth; //滑动成功的宽度（距离）
    // 给滑块注册鼠标按下事件
    this.drag.onmousedown = e => {
      //1.鼠标按下之前必须清除掉后面设置的过渡属性
      this.drag.style.transition = "";
      this.bg.style.transition = "";
      // clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。
      // 当滑块位于初始位置时，得到鼠标按下时的水平位置
      e = e || window.event;
      this.downX = e.clientX;

      //给文档注册鼠标移动事件
      document.onmousemove = e => {
        e = e || window.event;
        // 获取鼠标移动后的水平位置
        let moveX = e.clientX;
        //得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
        let offsetX = moveX - this.downX;
        //在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
        if (offsetX > this.distance) {
          offsetX = this.distance; // 如果滑过了终点，就将它停留在终点位置
        } else if (offsetX < 0) {
          offsetX = 0; //如果滑到了起点的左侧，就将它重置为起点位置
        }
        //根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
        this.drag.style.left = offsetX + "px";
        this.bg.style.width = offsetX + "px";

        //如果鼠标的水平移动距离 = 滑动成功的宽度
        if (offsetX == this.distance) {
          //设置滑动成功后的样式
          this.text.innerHTML = "验证通过";
          this.text.style.color = "#fff";
          // ...
          // 设置滑动成功后的状态
          this.success = true;
          // 成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
          this.drag.onmousedown = null;
          document.onmousemove = null;

          // 派发成功事件
          this.$emit('done')
        }
      };

      //给文档注册鼠标松开事件
      document.onmouseup = () => {
        if (this.success) {
          return;
        } else {
          this.drag.style.left = 0;
          this.bg.style.width = 0;
          this.drag.style.transition = "left 1.7s ease";
          this.drag.style.transition = "width 1.7s ease";
        }
        //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.block-slider-wrapper {
  width: 353px;
  height: 44px;
  line-height: 44px;
  background: #f2f2f2;
  position: relative;
  border-radius: 4px;
  .bg {
    width: 44px;
    height: 100%;
    position: absolute;
    background-color: #00cf82;
    border-radius: 4px;
  }
  .text {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    user-select: none;
    color: #aaaaaa;
    font-size: 12px;
  }
  .drag {
    width: 44px;
    height: 44px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 4px;
    position: absolute;
    cursor: move;
    text-align: center;
    background-color: #ffffff;
    user-select: none;
    color: #cccccc;
  }
}
</style>