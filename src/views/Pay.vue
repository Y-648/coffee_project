<template>
    <div class="pay">
<van-nav-bar
  title="订单确认"
  left-arrow
  fixed
  placeholder
  @click-left="back"
  class="my-nav"
/>
   <div class="address-box">
       <div class="user-info">
           <div class="name">{{addressInfo.name}}</div>
           <div class="phone">{{addressInfo.tel}}</div>
       </div>
       <div class="address">
           <span class="icon">默认</span>
           <span class="address-info">{{addressInfo.address}}</span>
       </div>
   </div>
   <div class="order-list">
      <PayBox :proInfo='proInfo'>
        <template #item>
          <OrderItem :productList='v' v-for='(v,k) in orderInfo' :key='k'></OrderItem>
        </template>
      </PayBox>
   </div>
   <div class="btn">
       <van-button round color="#6d411e" size="large" @click='pay'>立即结算</van-button>
   </div>
    </div>
 
</template>
<script>
import "../assets/less/pay.less";
import OrderItem from "../components/OrderItem";
import PayBox from "../components/PayBox";
export default {
  data() {
    return {
      addressInfo: {}, //地址信息
      orderInfo: [], //订单数据
      // 订单底部信息
      proInfo: {
        total: 0, //总价
        count: 0, //总数量
        date: ""
      }
    };
  },
  components: {
    OrderItem,
    PayBox
  },
  methods: {
    back() {
      this.$router.back();
    },
    // 获取订单数据
    getOrderData() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let sids = this.$route.params.order.goodsId;
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起查询订单请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(res => {
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
            return this.$router.push("/login");
          }
          //   获取订单成功
          if (res.data.code == 50000) {
            this.orderInfo = res.data.result;
            for (let v of res.data.result) {
              this.proInfo.count += v.count;
              this.proInfo.total += parseFloat(v.price) * v.count;
              this.proInfo.date = new Date();
            }
            this.proInfo.total = this.proInfo.total.toFixed(2);
            // 获取地址详情
            return this.axios({
              method: "GET",
              url: this.baseUrl + "/findAddressByAid",
              params: {
                appkey: this.appkey,
                tokenString: tokenString,
                aid: this.$route.params.order.addressId
              }
            });
          }
        })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          if (res.data.code == 40000) {
            let data = res.data.result[0];
            data.address =
              data.province + data.city + data.county + data.addressDetail;
            this.addressInfo = data;
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 结算
    pay() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let sids = this.$route.params.order.goodsId;
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起查询订单请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/pay",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          sids: JSON.stringify(sids),
          phone: this.addressInfo.tel,
          address: this.addressInfo.address,
          receiver: this.addressInfo.name
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
          //   结算订单成功
          if (res.data.code == 60000) {
            this.$router.push({ name: "Order" });
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    }
  },
  created() {
    this.getOrderData();
  }
};
</script>

<style lang="less" scoped>
</style>