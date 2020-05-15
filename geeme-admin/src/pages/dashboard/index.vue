<template>
  <div class="dashboard">
    <!-- 实时数据 -->
    <div class="module">
      <div class="title">
        <img class="icon" src="./assets/icon_home_date.png"/>
        <span>实时数据</span>
        <a-button-group style="margin:0 10px 0 20px;">
          <a-button type="primary">今天</a-button>
          <a-button>本月</a-button>
          <a-button>上月</a-button>
          <a-button>累计</a-button>
        </a-button-group>
        <a-range-picker :placeholder="['开始日期', '结束日期']"/>
      </div>
      <div class="content">
        <div class="item data">
          <img src="./assets/icon_con0101.png" />
          <p>
            <span class="amount">¥251680</span><br />
            <span class="info">新购门店业绩</span>
          </p>
        </div>
        <div class="item data">
           <img src="./assets/icon_con0102.png" />
          <p>
            <span class="amount">102</span><br />
            <span class="info">新购门店数</span>
          </p>
        </div>
        <div class="item data">
           <img src="./assets/icon_con0103.png" />
          <p>
            <span class="amount">¥255200</span><br />
            <span class="info">续费门店业绩</span>
          </p>
        </div>
        <div class="item data">
           <img src="./assets/icon_con0104.png" />
          <p>
            <span class="amount">90</span><br />
            <span class="info">续费门店数</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0201.png" />
          <p>
            <span class="amount">12850602</span><br />
            <span class="info">顾客用户数</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0202.png" />
          <p>
            <span class="amount">351245</span><br />
            <span class="info">服务者用户数</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0203.png" />
          <p>
            <span class="amount">¥1589402</span><br />
            <span class="info">服务交易总额</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0204.png" />
          <p>
            <span class="amount">¥3021803</span><br />
            <span class="info">产品交易总额</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0301.png" />
          <p>
            <span class="amount">125235</span><br />
            <span class="info">商家门店数</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0302.png" />
          <p>
            <span class="amount">16212</span><br />
            <span class="info">供应商数</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0305.png" />
          <p>
            <span class="amount">¥1290756</span><br />
            <span class="info">商家订单总额</span>
          </p>
        </div>
        <div class="item data">
          <img src="./assets/icon_con0304.png" />
          <p>
            <span class="amount">¥2678996</span><br />
            <span class="info">顾客订单总额</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 待办事项 -->
    <div class="module">
      <div class="title">
        <img class="icon" src="./assets/icon_home_waited.png"/>
        <span>待办事项</span>
      </div>
      <div class="content">
        <div class="item matter">
          <img src="./assets/icon_wait_01.png"/>
          <span>试用待回访</span>
        </div>
        <div class="item matter">
          <img src="./assets/icon_wait_02.png"/>
          <span>到期待回访</span>
        </div>
        <div class="item matter">
          <img src="./assets/icon_wait_03.png"/>
          <span>新购待开通</span>
        </div>
        <div class="item matter">
          <img src="./assets/icon_wait_04.png"/>
          <span>续费待确认</span>
        </div>
        <div class="item matter">
          <img src="./assets/icon_wait_05.png"/>
          <span>品牌待认证</span>
        </div>
        <div class="item matter">
          <img src="./assets/icon_wait_06.png"/>
          <span>意见待回复</span>
        </div>
      </div>
    </div>

    <!-- graph -->
    <div class="module">
      <div class="content">
        <div class="item comprise"></div>
        <div class="item trend"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.dashboard {
  .common-scrollbar();
  overflow-y: auto;
  .module {
    padding: 15px 0 0 0;
    .title {
      display: flex;
      align-items: center;
      margin: 0 0 15px 0;
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px 0 0;
      }
      span {
        color: #333333;
        font-size: 20px;
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        /* flex: 1; */
        margin: 0 0 20px 0;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
      }
      .data {
        width: calc(25% - 15px);
        height: 120px;
        display: flex;
        align-items: center;
        color: #666666;
        img {
          width: 60px;
          height: 60px;
          margin: 0 20px 0 10%;
        }
        span.amount {
          font-size: 32px;
        }
        span.info {
          font-size: 16px;
        }
      }
      .matter {
        width: calc(16.7% - 16.7px);
        height: 128px;
        display: flex;
        align-items: center;
        flex-direction: column;
        img {
          width: 56px;
          height: 56px;
          margin: 22px 0 14px 0;
        }
        span {
          color: #333333;
          font-size: 16px;
        }
      }
      .comprise {
        width: 39.5%;
        height: 490px;
      }
      .trend {
        width: 58.85%;
        height: 490px;
      }
    }
  }
}
</style>