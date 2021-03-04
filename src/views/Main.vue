<template>
    <div class="main">
   <router-view></router-view>
<van-tabbar route active-color='#6d411e' inactive-color='#c99065'  placeholder fixed>
  <van-tabbar-item 
  :badge="val.badge>0?val.badge:''" 
  v-for='(val,key) in menuList' 
  :key="key" route 
  :dot='val.dot' 
  :to="val.to"
  >
    <span>{{val.title}}</span>
    <template #icon="props">
      <img :src="props.active ? val.icon.active : val.icon.inactive" />
    </template>
  </van-tabbar-item>
</van-tabbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Main",
  data() {
    return {
    };
  },
  computed: {
    ...mapState(["cartNum","isLoadingCartNum"]),
    menuList(){
     return [
        {
          icon: {
            active: require("../assets/images/home2.png"),
            inactive: require("../assets/images/home.png")
          },
          title: "主页",
          to: "/home"
        },
        {
          icon: {
            active: require("../assets/images/classify2.png"),
            inactive: require("../assets/images/classify.png")
          },
          title: "分类",
          to: "/classify"
        },
        {
          icon: {
            active: require("../assets/images/cart2.png"),
            inactive: require("../assets/images/cart.png")
          },
          title: "购物车",
          badge: this.cartNum,
          to: "/cart"
        },
        {
          icon: {
            active: require("../assets/images/my2.png"),
            inactive: require("../assets/images/my.png")
          },
          title: "我的",
          // dot: true,
          to: "/my"
        }
      ]
    }
  },
  methods: {
    ...mapMutations(["changeCartNum","changeIsLoading"]),
    // 查询购物车数量
    getCartNum() {
      if(this.isLoadingCartNum){
         let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return;
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(res => {
          // 关闭加载提示
          this.$toast.clear();
          //  没有登录
          if (res.data.code == 700) {
            return;
          }
          if (res.data.code == 8000) {
             // 不需要再次查询购物车数量
            this.changeIsLoading('false');
            // 修改购物车数量
            this.changeCartNum(res.data.result);
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
      }
    }
  },
  created() {
    //调用查询购物车数量方法
    this.getCartNum();
  }
};
</script>