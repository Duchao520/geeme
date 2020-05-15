<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">商家入驻</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <div class="box bg-f">
      <!--申请入驻的返回状态-->
      <div class="flex-box fz17" v-if="state == 1">
        <div class="item bg-c fz14" :class=" num >= 1 ? 'bg-r fc-f' : '' ">基本信息</div>
        <div class="item bg-c fz14" :class=" num >= 2 ? 'bg-r fc-f' : '' ">登录信息</div>
        <div class="item bg-c fz14" :class=" num >= 2 ? 'bg-r fc-f' : '' ">收货信息</div>
        <div class="item bg-c fz14" :class=" num >= 3 ? 'bg-r fc-f' : '' ">资质</div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'subnav',
    data() {
      return {
        num: 0,
        state: 1,
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
      }
    },
    methods: {
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
    },
    created: function () {
      let _self = this;
      let _url = window.location.href;
    },
    watch: {
      $route(to, from) {
        if (to.path == '/loginInfo') {
          this.num = 1;
          this.state = 1;
        } else if (to.path == '/address') {
          this.num = 2;
          this.state = 1;
        } else if (to.path == '/aptitude') {
          this.num = 3;
          this.state = 1;
        } else if (to.path == '/preview') {
          this.state = 0;
          this.state = 0;
        } else {
          this.num = 0;
          this.state = 1;
        }
      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .bg-c {
    background: #e5e5e5;
  }

  .box {
    padding: 16px 23px;
  }

  .state {
    background: #0c8deb;
    color: #fff;
    text-align: center;
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 5px;
    margin-right: 5px;
  }

  .flex-box {
    display: flex;
  }

  .item {
    flex: 1;
    text-align: center;
    margin-right: 5px;
    height: 36px;
    line-height: 36px;
    position: relative;
    padding-left: 10px;
  }

  .item.bg-blue {
    color: #fff;
  }

  .item:before {
    content: '';
    display: block;
    height: 36px;
    width: 15px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAARVBMVEUAAADl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXyw35LAAAAFnRSTlMAFwr141fX7cytoJGCcmNINSTBuD4sB9hYyAAAAKlJREFUOMuV1ccRxCAQRFFh5QGhVecf6kbwD831FVWYmZ6lLLDWAKCdQIUgBwAdBOoEOQLoIFAnyBFAJ4F+BDUC6CTQIKgRQBeBBsFGoItAH8FGoJsgPQCaBLoJ0gOgSaBGkAKAXgI1gjUAaCdQIajujt09VTNvnoL5ui/+oPnn062r263dz+yPze3By+3zYWZJjWZenW4mdjN3czSz/XDnR6EZZU41nIN/mQhKuiJbkLkAAAAASUVORK5CYII=) no-repeat left center;
    background-size: auto 100%;
    position: absolute;
    right: -15px;
    z-index: 2;
  }

  .item.bg-r:before {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAATlBMVEUAAAD3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEz3CEw3wR2mAAAAGXRSTlMACtn1Vy7t5cytoJFIOxsUwbgkhX52b2dg3bXcwQAAAK1JREFUOMuV1VsSgyAQRFEBUVEBNcbY+99oVnA/mt9TVPGY6RnGAdbUAVQINBLMHUArgXaCOQBoJdBOEAOANgJVghgAtBGoEsQAoA+BMsFCoJtAmWAh0JcgZQAdBHoI0gWgg0A/gtQAdBLoJZgagAqBRoLo7ijuqV7z5qmZr3u6P/iYVZIusxIXt9pvt6Oy2bUxmMmwuelTzYSLwUzR1U3q3ZwGczcnTjGnGs7BP24DVMAXSUOcAAAAAElFTkSuQmCC) no-repeat left center;
    background-size: auto 100%;
  }

  .item:after {
    content: '';
    display: block;
    height: 36px;
    width: 15px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAAS1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////+DmQsHAAAAGHRSTlMA9RbjV9ftzMCtoIJjSDsNMCghtpSNdm9LFbWzAAAAq0lEQVQ4y5XVSRKEIBBEUQFRUMChbTvvf9I+wV8k2xdEMFRlTfMEa4kAqgSaCVIE0EagTpAOAG0E6gTpANBDoEGQCfQl0CDIBNoJdBKsBNoJwgmglUAvQbgAVAj0Iwg3gAqBGkG4AfQhUCNYIoAqgWaC7O6o7qmaefMQzdct+IPmnxe3rl6zdsNl9sfq9uDu9vkwsyS7efW4mdgpd92k7uY0SNGcONWcajgH/5IVUSErAzZaAAAAAElFTkSuQmCC) no-repeat center;
    background-size: auto 100%;
    position: absolute;
    left: -2px;
    top: 0;
    z-index: 1;
  }

  .item:nth-of-type(2) {
    padding-left: 8px;
  }

  .item:first-of-type:after {
    opacity: 0;
  }

  .item:last-of-type:before {
    opacity: 0;
  }

  .bg-r {
    background: #F7094D;
  }
</style>
