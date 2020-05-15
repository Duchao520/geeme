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
        <Cate :type="type" :cateList="cateList"></Cate>
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
      cateList: [
        { title: "品牌：", imgUrl:[
          'static/images/supply/sup_img_brand01.png',
          'static/images/supply/sup_img_brand02.png',
          'static/images/supply/sup_img_brand03.png',
          'static/images/supply/sup_img_brand04.png',
          'static/images/supply/sup_img_brand05.png'
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
          image: "https://img12.360buyimg.com/n7/jfs/t1/31705/14/2339/44737/5c6a16c1E09df13e1/ffd3d5b7104fb30f.jpg",
          dsc: "飞利浦（PHILIPS）卷发棒 直发器 直发梳造型梳按摩梳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
       {
          id: 1,
          image: "https://img11.360buyimg.com/n7/jfs/t20992/182/405051629/136990/af07d5b7/5b0d1cdcN95a24e20.jpg",
          dsc: "松下负离子美发梳子 按摩梳负离子梳卷发直发",
          specialPrice: 100,
          price: 300,            
          tags:['狂欢特惠'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t1/20569/27/15620/204276/5cb0718fE6e901086/64bf82d3118df096.jpg",
          dsc: "丽霸（LYBRR）卷发棒卷直两用陶瓷电小夹板烫发",
          specialPrice: 100,
          price: 300,            
          tags:['100%真陶瓷'],
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
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
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
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
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
          image: "//img.alicdn.com/bao/uploaded/i2/TB1.4.Ud_XYBeNkHFrd6coiuVXa_051530.jpg",
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
