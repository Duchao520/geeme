<template>
  <div>
    <!--标题栏-->
    <header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">我的职员</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <span class="icon" style="display: flex;align-items: center">
				<router-link to="/addStaff" tatg="i" class="ico-add"></router-link>
				<i class="ico-select" @click="showSelect"></i>
        <!--<router-link to="/stafHistory" tatg="i" class="ico-history"></router-link>-->
        <!--<i class="ico-search" @click="showSearch"></i>-->
			</span>
      <!--搜索-->
      <div class="search-box bg-f" v-show="searchState">
        <form action="javascript:return true;">
          <input type="search bg-f" placeholder="请输入职员姓名或电话" @keyup.13="searchStaff" v-model="nameOrPhone"
                 ref="input1"/>
          <button type="button" class="fz15" @click="hideSearch">取消</button>
        </form>
      </div>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--职员列表-->
    <ul class="bg-f ">
      <div class="pd-lr-10 pd-tb-5 bg-c fz15 clearfix">
        <form action="javascript:return true;">
          <input class="search-input" type="search" placeholder="请输入职员姓名或电话" @keyup.13="searchStaff"
                 v-model="nameOrPhone" ref="input1"/>
        </form>
        <p class="clearfix">
          <span class="fl-l">当前职员{{count}}人</span>
          <span class="fl-r">最多可激活{{count-promoteCount > 0 ? (count-promoteCount) : 0}}人</span>
        </p>
      </div>
      <div class="nullImg" v-if="list.length == 0"><img src="@/assets/imgs/partnerCenter/null.png" width="50%"/></div>
      <div v-else v-for="(item,k) in list">
        <router-link :to="{path:'/staffDetail',query:{id: item.id}}" tag="div" class="relative border-buttom list-con">
          <img :src="item.staffImage" v-if="item.staffImage"/>
          <img src="@/assets/imgs/partnerCenter/head.png" v-else/>
          <p class="clearfix ">
            <span class="fl-l fz17">{{item.realName}}<i class="ico"
                                                        :class="item.gender == 0 ? 'ico-girl' : 'ico-man' "></i></span>
            <span class="fl-r fc-c fz14" v-if="item.state == 2">待审核</span>
            <span class="fl-r fc-c fz14" v-else-if="item.state == 0">已离职</span>
          </p>
          <p class="clearfix">
            <a :href="'tel:' + item.phone" class="fc-c fz14">手机号码：{{item.phone}}<i class="ico ico-phone"></i></a>
            <button type="button" class="fl-r btn-quit bg-r fc-f btn-reset" v-if='item.state == 0'
                    @click="setStaffState(item.id,item.state,item.promoteState,k)">离职
            </button>
            <button type="button" class="fl-r btn-quit bg-r fc-f" v-else-if="item.state == 1"
                    @click="setStaffState(item.id,item.state,item.promoteState,k)">入职
            </button>
          </p>
          <!--<p>入职时间：{{item.entryTime}}</p>
                    <p class="fz12">提成百分百：<span class="percentage fc-f" :class="item.state == 1 ? 'bg-yellow' : 'bg-c' ">{{item.royaltyRate || 0}}%</span></p>-->
        </router-link>
      </div>
      <!--等待-->
      <div class="loading-box" v-show="showLoad">
        <i class="loading"></i>
      </div>
    </ul>
    <!--筛选条件-->
    <div v-show="selectShow">
      <div class="mask" @click="hideSelect"></div>
      <div class="select-box bg-f fz14" :style="'top:' +(44+status_bar_height)+'px'">
        <!--tab-->
        <div class="flex-box border-buttom tab-box">
          <div class="item">
            <input type="radio" name="tabType" id="tabType1" value="0" checked="checked" v-model="tabCon"/>
            <label for="tabType1">状态</label>
          </div>
          <div class="item">
            <input type="radio" name="tabType" id="tabType2" value="1" v-model="tabCon"/>
            <label for="tabType2">性别</label>
          </div>
          <!--<div class="item">
                        <input type="radio" name="tabType" id="tabType3" value="2" v-model="tabCon"/>
                        <label for="tabType3">时间</label>
                    </div>-->
        </div>
        <!--状态-->
        <ul class="tab-con" v-if="tabCon == 0">
          <li class="relative">
            <input type="radio" name="selectstate" id="select0" value="" @change="selectType" v-model="state"/>
            <label for="select0">全部</label>
            <i class="icon-gou"></i>
          </li>
          <li class="relative">
            <input type="radio" name="selectstate" id="select1" value="1" @change="selectType" v-model="state"/>
            <label for="select1">已激活</label>
            <i class="icon-gou"></i>
          </li>
          <li class="relative">
            <input type="radio" name="selectstate" id="select2" value="0" @change="selectType" v-model="state"/>
            <label for="select2">已注销</label>
            <i class="icon-gou"></i>
          </li>
        </ul>
        <!--性别-->
        <ul class="tab-con" v-else-if="tabCon == 1">
          <li class="relative">
            <input type="radio" name="sex" id="sex0" value="" @change="selectType" v-model="Gender"/>
            <label for="sex0">全部</label>
            <i class="icon-gou"></i>
          </li>
          <li class="relative">
            <input type="radio" name="sex" id="sex1" value="1" @change="selectType" v-model="Gender"/>
            <label for="sex1">男</label>
            <i class="icon-gou"></i>
          </li>
          <li class="relative">
            <input type="radio" name="sex" id="sex2" value="0" @change="selectType" v-model="Gender"/>
            <label for="sex2">女</label>
            <i class="icon-gou"></i>
          </li>
        </ul>
        <!--时间-->
        <!--<div class="select-time" v-else-if="tabCon == 2">
                    <div class="clearfix">
                        <input class="" type="datetime" placeholder="请选择开始时间" v-model="begintime"/>
                        ———
                        <input class="" type="datetime" placeholder="请选择结束时间" v-model="endtime"/>
                    </div>
                    <div class="clearfix">
                        <button type="button" class="btn fl-l" @click="resetTime">重置</button>
                        <button type="button" class="btn fl-r" @click="selectType">完成</button>
                    </div>
                </div>-->
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>

  </div>
</template>

<script>
  import {getAgentStaff , setStaffState} from '@/assets/js/getData'
  import {postColor} from "@/assets/js/jsBridge";
  import {rule} from "@/assets/js/deal";
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        searchState: false, //搜索框显示
        selectShow: false, //筛选弹窗
        tabCon: 0,
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        list: [],//职员列表
        pageNum: 1, //list的页数
        limit: 20,
        nameOrPhone: '',
        state: '',
        Gender: '',
        beginhireDate: "",
        endhireDate: "",
        begintime: '',
        endtime: '',
        count: 0,
        promoteCount: 0,
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: ''
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.push({path: '/partnerCenter'}); //返回服务商中心
        //this.$router.go(-1);//返回上一层
      },
      //点击显示搜索框
      showSearch() {
        this.searchState = true;
      },
      //点击隐藏搜索框
      hideSearch() {
        this.searchState = false;
      },
      //点击显示选择框
      showSelect() {
        this.selectShow = true;
      },
      //点击隐藏选择框
      hideSelect() {
        this.selectShow = false;
      },
      //选择筛选条件后
      selectType() {
        let _self = this;
        _self.pageNum = 1;
        //_self.count = 0 ;
        _self.getAgentStaff();
        //_self.selectShow = false ;
      },
      //点击键盘搜索键，搜索内容
      searchStaff() {
        let _self = this;
        _self.$refs.input1.blur();
        if (rule.empty(_self.nameOrPhone, "搜索内容不能为空")) {
          _self.pageNum = 1;
          //_self.count = 0 ;
          _self.getAgentStaff();
        }
      },
      //重置时间输入框内容
      resetTime() {
        this.endtime = '';
        this.begintime = '';
      },
      /*获取职员列表信息*/
      getAgentStaff() {
        let _self = this;
        let _data = {
          token: _self.token,
          pageNum: _self.pageNum, //list的页数
          pageSize: _self.limit,
          nameOrPhone: _self.nameOrPhone, //搜索条件-姓名或者手机号
          promoteState: _self.state, //搜索条件-激活状态 (1 激活 0 注销)
          gender: _self.Gender, //搜索条件-性别 (1 男 0 女)
          beginhireDate: _self.beginhireDate, //入职时间 (开始时间戳)
          endhireDate: _self.endhireDate, //入职时间 (开始时间戳)
        };
        _self.$getSignIn(_data).then(sec => {
          getAgentStaff(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
              }
              if (_self.pageNum == 1) {
                _self.list = [];
              }
              ;
              _data.data.agStaffs.forEach(function (i, n) {
                i.entryTime = timestampToTime(i.createTime); // 将入职时间戳转为时间
              });
              _self.count = _data.data.count;
              _self.promoteCount = _data.data.promoteCount;
              _self.list = _self.list.concat(_data.data.agStaffs);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //员工离职
      setStaffState(id, state, promoteState, k) {
        state == 1 ? state = 0 : state = 1;
        let _self = this;
        let _data = {
          token: _self.token,
          id: id,
          state: state,
          promoteState: promoteState
        }
        _self.$getSignIn(_data).then(sec => {
          setStaffState(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.list[k].state = state;
              _self.toast('状态设置成功')
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getAgentStaff();
      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
    mounted() {
      let _self = this;
      window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // 判断是否滚动到底部
        if ((scrollTop + window.screen.availHeight) >= (document.body.offsetHeight - 100)) {
          if (_self.scrollState == true) { //加下状态
            _self.scrollState = false;
            _self.showLoad = true;
            _self.pageNum = _self.pageNum + 1;
            setTimeout(() => {
              _self.showLoad = false;
              _self.getAgentStaff();
            }, 1500);
          }
        }
      },true);
    },
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  /*head*/
  .ico-add {
    display: inline-block;
    height: 44px;
    width: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAMAAAAdgrsPAAAAVFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU4H24AAAAG3RSTlMA2aUV6Jx7h3BWaELh8LY3MMVOCV8pvpTQryLz3xdIAAABVElEQVQ4y52Ti7KCIBCGWUBULl7LMt7/Pc8vWSjBmaZ/xqbFj911L+wgoTlZ6uorK+si/a5bkVE+qiswkz+qykPWn9SXHUXxHFQlkJ0z0OgT5epwT6H+K+jXcDxhZC7xJoEWltE1gRqW03KGxO+9Y2PeUTkrXR66THfLTbbsH7U7ND4tHZ5U3WF4HxyjrnDBnJCZ1bG3rUNUNAe7oSJiVjRCOw+pEJmGWTdCdHF1zBZpQJDGcfMsLX/lWe9Lyd8fLlyz/SJwy9RW+AHn0wbLWGaCwzASNcq23nARb+m4lFVInWZA8CpHBlvAIFyICnw4X7GIhPLCUIB8KpzrLUHjafE1nGWhiYkLYepakor18D+coFhw8yqBDmXzn7puEyGn4cb7fgzzt35Cd3iil+F0HJB0eGeFZWjxV+w9qexHWg/GBhOet+Ze13y5k5XOOSktUX0a8j9bwz6BDaFvbQAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 100% auto;
    margin-right: 10px;
  }

  .ico-select {
    display: inline-block;
    height: 44px;
    width: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMA74CakxOf+ah7BYYNMBrnjP0BhAEAAACUSURBVEjH7dJBDsIwDETRaeo4gbZA739ZJDaoxmbqDUJq/3r0FCnGwdI2+DXFZ8satcCpB2OF1y1YV7h1SnO8IkidsSCqEprghmZ4m/Gl0awfQALf0AyfgP14u4Ikhia4T3P8At5saIq/aV4dXuP7hmbXUrAvcR7C/rOc6x+te2o9mTXDU2uMqTXEXBWprIJEKvjnng2uGd6bbMyqAAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% auto;
    margin-right: 10px;
  }

  .ico-search {
    display: inline-block;
    height: 44px;
    width: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 18px 18px;
  }

  .ico-history {
    display: inline-block;
    width: 20px;
    height: 44px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAlBAMAAAAzRe0NAAAAMFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/f0AAAD////ExMT09PTFxcUmJiYu70IaAAAACnRSTlMAj/nXliruvOHFUs3iSgAAAJdJREFUKM9jYMxahQSWCTCAgNQqFLAQLAhRiFAKFlyFBkgXPL0bCvYQEiRs5jBzUgNQAN32nazCSoYB6IJeQN4SVO0L2MFUAYpggxeYWoIiyKq1atW9VasWBSALMgLxPSAWQBZkhgoaIAsyQQUVUATXg9y1FyaIqR3TIoJOavACCy7B4c0s5LCEBYgUslJo0KGmeQNIGAMAfKWW0W9pe2wAAAAASUVORK5CYII=) no-repeat center;
    background-size: 100% auto;
  }


  header .search-box input {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .search-input {
    background: #fff url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat left 10px center;
    background-size: 15px;
    border-radius: 30px;
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    margin: 5px auto 10px;
    padding: 4px 10px 4px 40px;
    height: 30px;
    line-height: 1.5;
  }


  .btn-quit {
    padding: 5px;
    border-radius: 4px;
  }


  /*小图标*/
  .ico {
    display: inline-block;
    height: 14px;
    min-width: 10px;
    background: #ccc;
    vertical-align: unset;
    margin-left: 5px;
  }

  .ico-girl {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAARVBMVEUAAAD/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4tAlKIwAAAAFnRSTlMAv7AN9SdA4Y6aWMpq0oFionJNGuoykD4KbAAAAPlJREFUOMvdkttyhCAQRGG4CCjgbfv/PzVgmWzUgcpr9rxIFYe2aqbFh2ImGqN0q+paahlwoMn2wka8WdpaDZMOJ67lRRTMgm8yrx1BWoQfT2+ctmkUBiE8un+eUEnlFOj0Bm46MwpSnVOUNV2/GE+WC/8OML6YgfFG0PW51chsXrotR2NlPA8pLlhow3gBMLeHI9uBAfNli8AkOPLlQkVEwUO/xE0CttW+ckdHQ03a6/Ca+LosSVGXjxUdLO2ojEmJPpsNeX11lSwL5J1zM9Xj0urpnZnTzEPjJ5MYz7Nre7IrpgYcgakpBz0GDBZtnx34UyAaDOJ/8AUAzh+TTx9NgwAAAABJRU5ErkJggg==) no-repeat center;
    background-size: auto 100%;
  }

  .ico-man {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAASFBMVEUAAAAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheDjj8WMAAAAF3RSTlMAyL2tCOGOXzgm96FpVkpC79KYhHEZEgtRKNwAAADDSURBVDjL3dPLEoMgDIVhIAS8IN7N+79pO25syZFx2/4rF9/EmQDmT2sT2dmF7KvKbyxnHTW1YVautnvG8tl699NZvovYBSnqdsT2ScoCcklUjLbTa9eh5TjRDcBZ4OLDeRm4RbOpBW7QzsLjYOWSQcWSzd7AqHCNwXmrl4LhcinOptJIfCq7HqbePg4xN1WSnHWOlhBCT+79vT28p9Ij1opuBG5VCg48GLjpQKf26KJa6MiXC1YEvxASHBVObmLzG70AZiYt8xZFIsYAAAAASUVORK5CYII=) no-repeat center;
    background-size: auto 100%;
  }

  .ico-phone {
    height: 15px;
    width: 15px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAYFBMVEUAAAD3CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU2f/8QNAAAAH3RSTlMAFaTz6NxwQLWTMAzj18u+mYNiXFVLNwfPqZ6KIXke42QBUgAAAM9JREFUOMuN1NkSgjAMQNEApSxlU3ZB8/9/6ShtIw4JnOc7QyCl8GH0rEHWKUScAilZ8KsQojtaMZuMETohOwySnGkyJBnTNEhqptFIUqbJkQzAmHySAJw8LBqAZfzXEYTupQSrH0eQ2oGM0LxwU4El7WOWosgvjNejdROix5WovBAF/jguYEn7b9xBr6vwb4cJHSND/0ITMFHRAbS4Uf3+ccpXcYleux+8wiOH50RuQPMNSeLzBka3F/Ee6MvfRDH3ybOgZAXG2IbbXGkA8AY2DC9+ehlDvgAAAABJRU5ErkJggg==) no-repeat center;
    background-size: auto 100%;
  }

  /*list-con*/
  .list-con {
    margin-left: 10px;
    padding: 15px 15px 15px 80px;
  }

  .list-con img {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 6px;
    top: 12px;
    border-radius: 50%;
  }

  .con-title {
    line-height: 47px;
  }

  .list-con > p:not(.con-title) {
    line-height: 23px;
  }

  .percentage {
    display: inline-block;
    width: 45px;
    border-radius: 19px;
    height: 19px;
    line-height: 19px;
    text-align: center;
  }

  .border-buttom.list-con:last-of-type:before {
    content: none;
  }

  /*筛选条件*/
  .select-box {
    position: fixed;
    width: 100%;
    top: 44px;
    z-index: 8;
  }

  .select-box ul {
    padding: 10px 0;
  }

  .select-box li {
    padding: 0 10px;
  }

  .select-box li input[type="radio"]:checked + label:after {
    content: none;
  }

  .tab-con input[type="radio"] {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .select-box li input[type="radio"]:checked ~ .icon-gou {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAD3CEz3CEz/AE7/AEr3CEz5Bkz2CUz3CEz4B0z5Bkz3CE33CEv3CEz3CEz4B0v2CUz3CU0WS5bBAAAAEXRSTlMA9uUJFZpPz8OMJXta2qhtsgEYyOEAAADMSURBVDjLhZNbDsUgCEQHEfX27f43exNtxLYa5qdNziAiABWHIzoiF4/A+MoL5SYS/8K8VqyWlR/hKX+UvPLF5YHc0uIr/zr8nT/miWK9xy9P9SsJaG4gD0DGsWe5mAA8PGAD1nIEI0w4rvIXICOumQXprpl6rqUl7OV7sW+vEfrSd9TIFfBxwDOB2rtzUq6GkkIdFFAL1BQpd45LebukvLt75l6C0PdfuZbEpA7/4cSPZrnt3Xox220NjDly1tCaY28vjr169vKa6/8HLvot+ZG8C7AAAAAASUVORK5CYII=) no-repeat center;
    background-size: cover;
    position: absolute;
    right: 10px;
    top: 7px;
  }


</style>
