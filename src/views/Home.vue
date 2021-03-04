<template>
  <div class="home">
    <!-- 搜索区 -->
     <TopNav :name='userName'/>
    <!-- 轮播区 -->
    <div class="wrap-img">
   <van-swipe @change="changecurrentIndex" :autoplay="3000">
     <van-swipe-item v-for='(v,k) in bannerList' :key='k'>
       <routerLink class="img-box" tag='div' :to="`/goodsinfo/${v.pid}`">
         <img v-lazy="v.bannerImg">
         <span class="tag">{{v.name}}</span>
       </routerLink>
     </van-swipe-item>
  <template #indicator>
    <ul class="dot">
      <li :class="{active:currentIndex==k}" v-for='(v,k) in bannerList' :key='k'></li>
    </ul>
  </template>
</van-swipe>
    </div>
    <!-- 金刚区 -->
    <van-grid :column-num="3" :border='false'>
  <van-grid-item v-for="(value,k) in iconList" :key="k" :icon="value.imgSrc" :text="value.title" />
</van-grid>
<!-- 滚动资讯 -->
<div class="my-notice">
<van-notice-bar
  left-icon="volume-o"
  text="饮品上新,焦糖拿铁,棒果拿铁,抹茶瑞纳冰等各种饮品等你来品尝!"
/>
</div>
<!-- 胶囊区 -->
<!-- <div class="cachet">
  <img src="../assets/images/cachet.webp" alt="">
</div> -->
<!-- 精选区 -->
<div class="choiceness">
  <Title name='精选' :icon="require('../assets/images/recommend.png')" :isMore='false'/>
  <div class="content">
    <div class="item" v-for="(v,k) in choicenessList" :key='k' :style="{background:`url(${v.bg})`}">
      <div class="text">
        <span class="title">{{v.title}}</span>
        <span class="des">{{v.des}}</span>
      </div>
    </div>
  </div>
</div>
<!-- 秒杀区 -->
<div class="seckill">
 <Title name='限时秒杀' :icon="require('../assets/images/kill.png')" :isMore='false'/>
  <div class="content">
    <SecKill 
    v-for="val in secKillGoodsInfo" :key='val.id'
    :img-src='val.pic'
    :name='val.name'
    :time='val.time'
    :new-price='val.newPrice'
    :old-rice='val.oldPrice'
    :total-num='val.totalNum'
    :sell-num='val.sellNum'
    :to='`/goodsinfo/${val.id}`'
    />
  </div>
 </div>
 <!-- 热门推荐 -->
 <div class="hot">
 <Title name='热门推荐' :icon="require('../assets/images/hot.png')"/>
 <van-grid :border="false" :column-num="2" class='my-grid' :gutter="5">
  <van-grid-item v-for='v in hotList' :key='v.pid'> 
    <GoodsItem 
    :img-src='v.smallImg'
    :name='v.name'
    :des='v.desc'
    :price='v.price'
    :tag="v.isHot?'hot':''"
    :to='`./goodsinfo/${v.pid}`'
    />
  </van-grid-item>
</van-grid>
 </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import TopNav from "../components/Topnav";
import Title from "../components/Title";
import SecKill from "../components/SecKill";
import GoodsItem from "../components/GoodsItem";
export default {
  name: "Home",
  components: {
    Title,
    SecKill,
    GoodsItem,
    TopNav
  },
  data() {
    return {
      currentIndex: 0, //当前轮播图片
      bannerList: [], //轮播图数组
      showSku: false,
      iconList: [
        { title: "橙汁", imgSrc: require("../assets/images/menu01.png") },
        { title: "冰淇淋", imgSrc: require("../assets/images/menu02.png") },
        { title: "果汁", imgSrc: require("../assets/images/menu03.png") },
        { title: "咖啡", imgSrc: require("../assets/images/menu04.png") },
        { title: "拿铁", imgSrc: require("../assets/images/menu05.png") },
        { title: "啤酒", imgSrc: require("../assets/images/menu06.png") }
      ], //金刚区数据
      // 精选数据
      choicenessList: [
        {
          bg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0380_02p.jpg",
          title: "咖啡",
          des: "生活饮我而乐"
        },
        {
          bg:
            "http://www.kangliuyong.com:10002/images/product_large/IMG_0378_02.jpg",
          title: "拿铁",
          des: "每一口都欢乐"
        }
      ],
      secKillId: ["coffee003", "coffee004", "latte003", "latte004"], //加入秒杀的商品pid
      secKillGoodsInfo: [], //加入秒杀的商品详情
      hotList: [], //热门推荐数据
      userName: "" //当前登录用户
    };
  },
  created() {
    this.getBannerData();
    // 获取秒杀数据
    for (let v of this.secKillId) {
      this.axios({
        method: "get",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: v
        }
      })
        .then(res => {
          let data = res.data.result[0];
          this.secKillGoodsInfo.push({
            id: data.pid,
            pic: data.small_img,
            name: data.name,
            newPrice: parseFloat(data.price) - 10,
            oldPrice: parseFloat(data.price),
            time: 10 * 1000,
            totalNum: 100,
            sellNum: 0
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    // 获取热门推荐数据
    this.axios({
      method: "get",
      url: this.baseUrl + "/typeProducts",
      params: {
        appkey: this.appkey,
        key: "isHot",
        value: 1
      }
    })
      .then(res => {
        this.hotList = res.data.result;
      })
      .catch(err => {
        console.log(err);
      });
    // 获取用户昵称
    this.axios({
      method: "get",
      url: this.baseUrl + "/findAccountInfo",
      params: {
        appkey: this.appkey,
        tokenString: this.$cookies.get("tokenString")
      }
    })
      .then(res => {
        if (res.data.result) {
          this.userName = res.data.result[0].nickName;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    changecurrentIndex(index) {
      this.currentIndex = index;
    },
    // 获取轮播图数据
    getBannerData() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "get",
        url: this.baseUrl + "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(res => {
          // 清除加载提示
          this.$toast.clear();
          this.bannerList = res.data.result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 商品加入购物车
    addCart() {
      this.showSku = true;
    }
  }
};
</script>

