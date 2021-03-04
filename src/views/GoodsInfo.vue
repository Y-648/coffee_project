<template>
    <div class="goods-info">
       <div class="img-wrap">
           <van-nav-bar :style="{background:`rgba(255,255,255,${hyaline})`}" fixed :border='false'>
           <template #left>
          <van-icon :name="hyaline>0?'arrow-left':require('../assets/images/back.png')" size="24" color='#000' @click="back"/>
           </template>
            <template #title>
            <span v-show='hyaline>0'>商品详情</span>
           </template>
          </van-nav-bar>
   <van-image :src="goodInfoList.large_img" height='100%'>
    <template v-slot:loading>
    <van-loading type="spinner" size="20" />
    </template>
</van-image>
<!-- 秒杀 -->
<!-- <div class="seckill-box">
  <div class="left">
    <div class="new-price">
      <span class="mark">￥</span>
      <span class="text">10.00</span>
    </div>
    <div class="old-price">
      <span class="text">12.00</span>
      <span class="icon">秒杀价</span>
    </div>
  </div>
   <div class="rigth">
     <span class="info">距离秒杀结束还有:</span>
  <div class="time">
  <van-count-down :time="time">
  <template #default="timeData">
    <span class="block">{{ timeData.days }}</span>
    <span class="colon">天</span>
    <span class="block">{{ timeData.hours }}</span>
    <span class="colon">:</span>
    <span class="block">{{ timeData.minutes }}</span>
    <span class="colon">:</span>
    <span class="block">{{ timeData.seconds }}</span>
  </template>
</van-count-down>
      </div>
   </div>
</div> -->
       </div>
       <div class="title-box">
           <div class="name van-ellipsis">
               <span class="cname">{{goodInfoList.name}}</span>
               <span class="ename">{{goodInfoList.enname}}</span>
           </div>
           <div class="price">
               <span class="tag">￥</span>
                <span class="text">{{goodInfoList.price}}</span>
           </div>
       </div>
       <div class="content">
        <div class="select-box">
            <div class="select-item" v-for='(v,k) in goodInfoList.rulesDatas' :key='k'>
                <span class="title">{{v.title}}</span>
                <div class="options" v-for='(val,key) in v.rules' :key='key'>
                    <span :class="{active:v.currentIndex==key}" @click="changeRule(k,key)">{{val}}</span>
                </div>
            </div>
        </div>
        <div class="num-box">
        <span>购买数量</span>
         <van-stepper  theme="round" button-size="22" v-model="buyNum" integer/>
         </div>
        </div>
        <div class="des-box">
            <div class="title">详细信息</div>
            <div class="des" v-for='(d,k) in goodInfoList.desc' :key='k'>
                <div class="des-item">{{k+1}}、{{d}}</div>
            </div>
        </div>
        <van-goods-action>
  <van-goods-action-icon :icon="isCollect?'like':'like-o'" :text="isCollect?'已收藏':'收藏'" :color="isCollect?'#6d411e':'#666666'" @click="collect" />
  <van-goods-action-icon :icon="cartNum>0?'cart':'cart-o'" text="购物车" :color="cartNum>0?'#6d411e':'#666666'" :badge="cartNum>0?cartNum:''" to='/cart'/>
  <van-goods-action-button color="#c99065" type="warning" text="加入购物车" @click="addCart"/>
  <van-goods-action-button color="#6d411e" type="danger" text="立即购买" />
</van-goods-action>
    </div>
</template>

<script>
import "../assets/less/goodsinfo.less";
import { mapState, mapMutations} from "vuex";
export default {
  name: "GoodsInfo",
  props: ["pid"],
  data() {
    return {
      time:20*1000,
      hyaline: 0, //背景色的透明度
      goodInfoList: {}, //商品详情对象
      isCollect: false, //是否收藏
      buyNum:0,//购买数量
    };
  },
  computed: {
    ...mapState(["cartNum","isLoadingCartNum"])
  },
  methods: {
    ...mapMutations(['changeCartNum',"changeIsLoading"]),
    // 返回
    back() {
      this.$router.back();
    },
    // 获取商品详情
    getGoodsInfo() {
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //  发起请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid
        }
      })
        .then(res => {
          // 关闭加载中
           this.$toast.clear();
          if (res.data.code === 600) {
            // 获取数据成功
            let data = res.data.result[0];
            // 处理规格数据
            data.rulesDatas = [];
            let rules = ["cream", "milk", "sugar", "tem"];
            for (let r of rules) {
              if (!data[r]) {
                continue;
              }
              // 切割规格样式变成数组
              let currentRules = data[r].split("/");
              let currentRule = {
                title: data[r + "_desc"], //规格名字
                currentIndex: 0, //当前选择的规格
                rules: [] //规格样式
              };
              for (let c of currentRules) {
                currentRule.rules.push(c);
              }
              data.rulesDatas.push(currentRule);
            }
            // 处理商品描述信息
            data.desc = data.desc.split(/\n/);
            this.goodInfoList = data;
          } else {
            this.$toast.clear();
            // 获取数据失败
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 改变规格
    changeRule(rulesDatasIndex, index) {
      this.goodInfoList.rulesDatas[rulesDatasIndex].currentIndex = index;
    },
    //收藏取消收藏商品
    collect() {
      if (!this.isCollect) {
        this.like();
      } else {
        this.notLike();
      }
    },
    // 收藏商品
    like() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push("/login");
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起收藏请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/like",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          pid: this.pid
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
            return this.$router.push("/login");
          }
          //   收藏成功
          if (res.data.code == 800) {
            this.isCollect = true;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 查询当前商品是否收藏
    getGoodsLike() {
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
      //   发起查询收藏请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findlike",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
          pid: this.pid
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          //  没有登录
          if (res.data.code == 700) {
            return;
          }
          // 查询收藏成功
          if (res.data.code == 1000) {
            //   收藏结果长度大于0,表示已经收藏
            if (res.data.result.length > 0) {
              this.isCollect = true;
            }
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 取消收藏
    notLike() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push("/login");
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起取消收藏请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          pid: this.pid
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
            return this.$router.push("/login");
          }
          //   查询成功
          if (res.data.code == 900) {
            //取消收藏成功
            if (res.data.result === 1) {
              this.isCollect = false;
            }
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
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
    },
    //商品添加到购物车
    addCart() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return this.$router.push("/login");
      }
      let rule=[];
      for(let g of this.goodInfoList.rulesDatas){
          rule.push(g.rules[g.currentIndex]);
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addShopcart",
        data: {
          pid: this.pid,
          count: this.buyNum,
          rule: rule.join('/'),
          appkey: this.appkey,
          tokenString
        }
      })
        .then(res => {
          // 关闭加载提示
          this.$toast.clear();
           //  没有登录
          if (res.data.code == 700) {
           this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }
          if(res.data.code==3000){
            if(res.data.status==1){
              // 1代表加入不同种类的商品
              // 0代表同种商品
              // 加入不同类型或者不同商品购物车数量加1
              this.changeCartNum(this.cartNum+1);
            }
          }
           this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    }
  },
  created() {
    //   获取商品详情
    this.getGoodsInfo();
    // 查询该商品是否被收藏
    this.getGoodsLike();
    // 查询购物车数量
    this.getCartNum();
  },
  mounted() {
    document.addEventListener("scroll", () => {
      this.hyaline = document.documentElement.scrollTop / 150;
    });
  }
};
</script>
