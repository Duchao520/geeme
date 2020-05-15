 <template>
  <div class="container">
    <!-- 热卖推荐 -->
    <div class="recommended">
      <div class="recommended-header">
        <img src="/static/images/market/icon_market_hot.png"/>
        <p>热卖推荐</p>
      </div>
      <ListTypeThree style="margin-top:20px;" :listOne="listOne"/>
    </div>
    <!-- 商品筛选 -->
    <div class="productFilter">
      
      <div class="p-f-header">
        <section>
          <img src="/static/images/market/icon_market_goods.png" alt="">
          <section>商品筛选</section>
          <dropdown name="全部" :list="['已上线','未上线']"></dropdown>
          <dropdown name="洗发水" :list="['呵护型','柔顺型','强韧型']"></dropdown>
        </section>
        <div>
          <search-input :placeholder="'请输入产品名称/品类/供应商'"></search-input>
        </div>
      </div>

      <div class="p-f-body">
        <Cate :type="type" :cateList="cateList"></Cate>
        <ListTypeThree style="margin-top:20px;" :listOne="listTwo"/>
      </div>

    </div>
  </div>
</template>
<script>
import BannerList from "@/components/supplyManagement/bannerList.vue";
import dropdown from "@/components/supplyManagement/dropdown.vue";
import Cate from "@/components/supplyManagement/Cate.vue";
import ListTypeThree from "@/components/supplyManagement/ListTypeThree.vue";
import searchInput from "@/components/stock/searchInput.vue"
// import "@";
export default {
  components: {
    BannerList,
    dropdown,
    Cate,
    ListTypeThree,
    searchInput
  },
  data() {
    return {
      cateList: [
        { title: "品牌：", imgUrl:[
          'static/images/supply/sup_img_brand21.png',
          'static/images/supply/sup_img_brand22.png',
          'static/images/supply/sup_img_brand23.png',
          'static/images/supply/sup_img_brand24.png',
          'static/images/supply/sup_img_brand25.png'
          ]
        },
        { title: "城市：", list: ["北京", "上海", "南京"] },
        { title: "价格：", list: ["100以下", "100-500", "500-1000","1000-1500","1500-2000","2000以上"] },
        { title: "服务：", list: ["货到付款", "先销后付", "直接上线","0起订量"] }
      ],
      type: 'img',
      listOne: [
        {
          id: 1,
          image: "https://p1.meituan.net/joymerchant/-7950125921377779510-1009029-1528952894558.jpg@220w_125h_1e_1c",
          dsc: "菲力伟周卡健身体验券",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://p0.meituan.net/merchantpic/204bd6248dc3a03ee809a6b8666c7230537720.jpg@220w_125h_1e_1c",
          dsc: "INLOVE爱上银乐迪欢唱券",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://p0.meituan.net/joymerchant/-8338598759672323638-43205807-1531794910501.jpg@220w_125h_1e_1c",
          dsc: "汉方足疗+古典泰式抵用券",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "https://p1.meituan.net/wedding/8a0bb4f8deadfbe590e9afbcaedf6eca1218975.png@220w_125h_1e_1c",
          dsc: "拾年影像豪华个人写真",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "https://p0.meituan.net/wedding/86a19a5d444acd8349b4c47e97dcdea3908598.png@220w_125h_1e_1c",
          dsc: "CinoStar外教欢乐互动课",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        }
      ],
      listTwo: [
        {
          id: 1,
          image: "https://p1.meituan.net/joymerchant/-7950125921377779510-1009029-1528952894558.jpg@220w_125h_1e_1c",
          dsc: "菲力伟周卡健身体验券",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://p0.meituan.net/merchantpic/204bd6248dc3a03ee809a6b8666c7230537720.jpg@220w_125h_1e_1c",
          dsc: "INLOVE爱上银乐迪欢唱券",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://p0.meituan.net/joymerchant/-8338598759672323638-43205807-1531794910501.jpg@220w_125h_1e_1c",
          dsc: "汉方足疗+古典泰式抵用券",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "https://p1.meituan.net/wedding/8a0bb4f8deadfbe590e9afbcaedf6eca1218975.png@220w_125h_1e_1c",
          dsc: "拾年影像豪华个人写真",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "https://p0.meituan.net/wedding/86a19a5d444acd8349b4c47e97dcdea3908598.png@220w_125h_1e_1c",
          dsc: "CinoStar外教欢乐互动课",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "https://p0.meituan.net/wedding/86a19a5d444acd8349b4c47e97dcdea3908598.png@220w_125h_1e_1c",
          dsc: "CinoStar外教欢乐互动课",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://p0.meituan.net/merchantpic/204bd6248dc3a03ee809a6b8666c7230537720.jpg@220w_125h_1e_1c",
          dsc: "INLOVE爱上银乐迪欢唱券",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        },
        {
          id: 1,
          image: "https://p0.meituan.net/merchantpic/204bd6248dc3a03ee809a6b8666c7230537720.jpg@220w_125h_1e_1c",
          dsc: "INLOVE爱上银乐迪欢唱券",
          specialPrice: 100,
          price: 300,tags:[''],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: ""
        }
      ],
      bannerList: [
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t14491/347/1359186704/152420/42dfca43/5a4d9689N460cc4da.jpg",
          dsc: "卡诗（KERASTASE）神仙精油 新双重精油 ",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img10.360buyimg.com/n7/jfs/t1/17071/16/3903/348753/5c2c3717E87f18040/7bf1b4b9f21f128d.jpg",
          dsc: "沙宣洗护套装修护水养洗发水护发素",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t17557/74/1426700612/231206/8dbc8036/5acafc63Nd669d6eb.jpg",
          dsc: "沙宣洗护套装修护水养洗发水护发素",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img10.360buyimg.com/n2/jfs/t1/11497/38/10594/154589/5c81e33bEf1bf4472/ad7c8017327d5e0e.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        }
      ],
      btnType: true,
      bannertype: 1
    };
  }
};
</script>
<style lang="scss" scoped>
  @import "@/assets/css/supply.scss";
</style>