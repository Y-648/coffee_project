<template>
    <div class="order">
        <van-nav-bar
  title="我的订单"
  left-arrow
  fixed
  placeholder
  @click-left="back"
  class="my-nav"
/>
<div class="menu">
  <van-tabs v-model="active" @change='changeStatus'  color='#6d411e'>
  <van-tab :title="v.title" v-for='(v,k) in tabs' :key='k'>
      <div class="order-content" v-if='orderData.length!=0'>
          <div class="order-item" v-for='o in orderData' :key='o.oid'>
              <PayBox :proInfo='o.proInfo'>
                  <template #title>
                      <div class="title-box">
                          <span class="order-id">{{o.oid}}</span>
                          <div class="operate" v-if='o.status==2'>已完成<span  @click='deleteOrder(o.oid)'><van-icon name="delete" size='16' class="my-icon"/></span>
                          </div>
                          <span class="operate" v-if='o.status==1' @click='confirmOrder(o.oid)'>确认收货</span>
                      </div>
                      </template>
                   <template #item>
                       <OrderItem :productList='vl' v-for='(vl,k) in o.data' :key='k'></OrderItem>
                 </template>
              </PayBox>
          </div>
      </div>
      <div v-else>
        <van-empty
  class="custom-image"
  :image="require('../assets/images/orderNull.png')"
  description="没有该状态的订单"
/>
      </div>
  </van-tab>
</van-tabs>
</div>
    </div>
</template>

<script>
import "../assets/less/order.less";
import PayBox from "../components/PayBox";
import OrderItem from "../components/OrderItem";
export default {
  components: {
    PayBox,
    OrderItem
  },
  data() {
    return {
      active: 0,
      tabs: [
        {
          title: "全部",
          status: 0
        },
        {
          title: "待收货",
          status: 1
        },
        {
          title: "已完成",
          status: 2
        }
      ],
      // 查询到的订单数据
      orderData: []
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "My" });
    },
    // 切换不同状态的订单
    changeStatus(name) {
      this.getOrderData(name);
    },
    // 获取不同状态的订单数据
    getOrderData(status) {
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
      //   请求订单数据
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
          status
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
          if (res.data.code == 70000) {
            let result = res.data.result;
            let oids = [];//订单编号不重复
            let products = [];//订单结构数据
            result.forEach(v => {
              if (oids.indexOf(v.oid) == -1) {
                oids.push(v.oid);
              }
            });
            for (let i of oids) {
              let o = {
                oid: i,
                status: 0,
                proInfo: {
                  total: 0, //总价
                  count: 0, //总数量
                  date: ""
                },
                data: []
              };
              for (let r of result) {
                r.small_img=r.smallImg;
                if (i == r.oid) {
                 // 订单的每条商品数据
                  o.data.push(r);
                //状态
                 o.status=r.status;
                  //   总价
                  o.proInfo.total += r.price * r.count;
                  o.proInfo.total =parseFloat(o.proInfo.total).toFixed(2);
                //   总数量
                  o.proInfo.count += r.count;
                //   下单时间
                  o.proInfo.date = r.updatedAt;
                }
              }
              products.push(o);
            }
            this.orderData=products;
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 删除订单
    deleteOrder(oid){
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
      //   请求订单数据
      this.axios({
        method: "POST",
        url: this.baseUrl + "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          oid
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
          //   删除成功
          if (res.data.code == 90000) {
              this.orderData=this.orderData.filter(v=>v.oid!=oid);
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 确认收货
    confirmOrder(oid){
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
      //   请求订单数据
      this.axios({
        method: "POST",
        url: this.baseUrl + "/receive",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          oid
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
          console.log(res)
          //   确认收货成功
          if (res.data.code == 80000) {
              this.orderData.map(v=>{
                if(v.oid==oid){
                  return v.status=2;
                }
              })
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
    if(!this.$route.params.status){
      // 获取全部订单
      this.active=0;
    this.getOrderData(0);
    }else{
      this.active=this.$route.params.status;
       this.getOrderData(this.$route.params.status);
    }
    
  }
};
</script>