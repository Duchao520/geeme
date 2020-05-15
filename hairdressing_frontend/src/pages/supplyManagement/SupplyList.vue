 <template>
  <div class="container">
    <!-- 热卖推荐 -->
    <div class="recommended">
      <div class="recommended-header">
        <img src="/static/images/market/icon_market_hot.png"/>
        <p>热卖推荐</p>
      </div>
      <BannerList :bannertype="bannertype" :btnType="btnType" :bannerList="bannerList"></BannerList>
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
        <Cate :cateList="cateList"></Cate>
        <ListTypeOne style="margin-top:20px;" :listOne="listOne"/>
      </div>
    </div>
  </div>
</template>
<script>
import BannerList from "@/components/supplyManagement/bannerList.vue";
import dropdown from "@/components/supplyManagement/dropdown.vue";
import Cate from "@/components/supplyManagement/Cate.vue";
import ListTypeOne from "@/components/supplyManagement/ListTypeOne.vue";
import searchInput from "@/components/stock/searchInput.vue"

export default {
  components: {
    BannerList,
    dropdown,
    Cate,
    ListTypeOne,
    searchInput
  },
  data() {
    return {
       bannerList: [
        {
          id: 1,
          image: "https://img.alicdn.com/imgextra/i1/15037645/O1CN01zuSMkM26LSOnhymkQ_!!0-saturn_solar.jpg_220x220.jpg_.webp",
          dsc: "BEAVER/博柔维他深层滋养洗发水保湿柔顺滋养",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img.alicdn.com/imgextra/i2/15037645/O1CN01jBxRXM26LSOxS2bYw_!!0-saturn_solar.jpg_220x220.jpg_.webp",
          dsc: "博柔护发精油女护理改善防毛躁修护柔顺头发",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t1/3019/32/8763/121590/5bab3d1fE9c1ede51/83ee7489463facfa.jpg",
          dsc: "beaver/博柔马鲁拉无硅油护色固色锁色洗发露",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t22531/203/1138265122/212138/b75e17ff/5b529437N6fb2bc3b.jpg",
          dsc: "发膜正品修护干枯补水顺滑烫染受损倒膜焗油膏",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        }
      ],
      cateList: [
        { title: "城市：", list: ["北京", "上海", "南京"] },
        { title: "价格：", list: ["100以下", "100-500", "500-1000","1000-1500","1500-2000","2000以上"] },
        { title: "服务：", list: ["货到付款", "先销后付", "直接上线","0起订量"] }
      ],
      listOne: [
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1iGN5fRoHL1JjSZFwFAz6vpXa_115648.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i1/TB1YUlYfFcJL1JjSZFO7xAWlXXa_120143.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/TB10bRufoF7MKJjSZFLRVAMBVXa_115921.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i3/T12Z_7Fy4cXXczBEsT_013314.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1FYxzmpOWBuNjy0FirG4FxVXa_044620.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i6/TB1rdC6GXXXXXXZXXXXymsM.XXX_101730.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/TB19Q7ZFFXXXXcJapXXeNM0.FXX_110712.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1.4.Ud_XYBeNkHFrd6coiuVXa_051530.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1yNFhOpXXXXczXpXXZxee8VXX_031711.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1viGQFVXXXXXjXFXXToel8VXX_032052.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i3/TB114o7mkKWBuNjy1zjta7OypXa_051200.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i1/TB1Ij50mCtYBeNjSspkPRjU8VXa_050931.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i4/TB1ZMNxFVXXXXb9XXXXlbtJ7VXX_014001.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
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