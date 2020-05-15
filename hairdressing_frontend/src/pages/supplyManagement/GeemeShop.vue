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
          image: "https://img13.360buyimg.com/n7/jfs/t1/21924/10/5513/64399/5c3d991dE88128359/52ec27772486393d.jpg",
          dsc: "网易严选24寸 纯PC“铝框”（非全铝）拉杆箱",
          specialPrice: 100,
          price: 300,
          discount: '新秀丽制造商',
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t1/8498/13/4485/140119/5bdad06fE586ff4af/48bfbb25daa7873e.jpg",
          dsc: "素士(SOOCAS)电动牙刷 充电式超声波牙刷",
          specialPrice: 100,
          price: 300,
          discount: '小米生态链'
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t1/28372/13/2444/330814/5c1caa69Ee65f8af3/23222c098a97a68f.png",
          dsc: "严选·颐和园组合茶礼-东方草木大师精选",
          specialPrice: 100,
          price: 300,
          discount: '年货节特价'
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t1/6425/40/3887/217009/5bd716e9E4886d5d8/b3da975f4047ded3.jpg",
          dsc: "一加6T手机迈凯伦定制版 OnePlus/一加 A6010 …",
          specialPrice: 100,
          price: 300,
          discount: '顺丰包邮'
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
          image: "https://img13.360buyimg.com/n7/jfs/t1/21924/10/5513/64399/5c3d991dE88128359/52ec27772486393d.jpg",
          dsc: "网易严选24寸 纯PC“铝框”（非全铝）拉杆箱",
          specialPrice: 100,
          price: 300,
          tags:['半年内保价'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "http://img11.360buyimg.com/jdcms/s130x130_jfs/t18313/305/19551006/412663/4c30eae9/5a5817bbNef469df6.jpg!q80.webp",
          dsc: "韩国进口 海牌海苔 香脆紫菜烤海苔 休闲零食儿童零食经典原味2g*32包",
          specialPrice: 100,
          price: 300,
          tags:['五折起购', '赠送保险'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "http://img12.360buyimg.com/jdcms/s130x130_jfs/t1/25398/36/8030/112273/5c73614eEdf054207/1e008ab8599e1049.jpg!q80.webp",
          dsc: "花王（Merries）妙而舒 婴儿纸尿裤/尿不湿",
          specialPrice: 100,
          price: 300,            
          tags:['质量保障'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "http://img13.360buyimg.com/jdcms/s130x130_jfs/t1/31662/36/10430/524089/5caf145fEceead348/0a62868a34fbf64b.jpg!q80.webp",
          dsc: "中华牙膏套装 魔丽迅白 酷爽薄荷味170g*2送2支牙刷超值套装(新老包装随机发)",
          specialPrice: 100,
          price: 300,            
          tags:['正品保证'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1FYxzmpOWBuNjy0FirG4FxVXa_044620.jpg",
          dsc: "汰渍 Tide 焕彩护色洗衣液",
          specialPrice: 100,
          price: 300,            
          tags:['爆款直降'],
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
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五星评价'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i6/TB1rdC6GXXXXXXZXXXXymsM.XXX_101730.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/TB19Q7ZFFXXXXcJapXXeNM0.FXX_110712.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1.4.Ud_XYBeNkHFrd6coiuVXa_051530.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1yNFhOpXXXXczXpXXZxee8VXX_031711.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,           
           tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1viGQFVXXXXXjXFXXToel8VXX_032052.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i3/TB114o7mkKWBuNjy1zjta7OypXa_051200.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,           
           tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i1/TB1Ij50mCtYBeNjSspkPRjU8VXa_050931.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i4/TB1ZMNxFVXXXXb9XXXXlbtJ7VXX_014001.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,            
          tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        }
      ],
      btnType: false,
      bannertype: 1
    };
  }
};
</script>
