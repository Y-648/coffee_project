<template>
    <div class='my'>
        <div class="img-box" :style="{background:`url(${userInfo.userBg})`}">
            <div class="touxiang">
                <img :src="userInfo.userImg">
                <span class="name">{{userInfo.nickName}}</span>
            </div>
        </div>
        <div class="order">
            <van-cell title="我的订单" icon="todo-list" is-link color='#e94d5f' size='18' class="my-cell" :border='false' @click='showOrders(0)'/>
            <van-grid :border='false' class="my-grid" :column-num="3">
  <van-grid-item :icon="require('../assets/images/order.png')" text="全部" :badge="allOrderNum?allOrderNum:''"  @click='showOrders(0)'/>
  <van-grid-item :icon="require('../assets/images/order03.png')" text="待收货" :badge="unFinishOrderNum?unFinishOrderNum:''" @click='showOrders(1)' />
  <van-grid-item :icon="require('../assets/images/order01.png')" text="已完成" :badge="finishOrderNum?finishOrderNum:''"  @click='showOrders(2)'/>
</van-grid>
        </div>
        <div class="user-option">
             <van-cell :title="v.title" :icon="v.icon" is-link color='#e94d5f' size='18' class="my-cell" v-for='(v,k) in menuList' :key='k' :to='v.to'/> 
        </div>
        <div class="btn">
            <van-button type="danger" size="large" @click='out'>退出登录</van-button>
        </div>
    </div>
</template>

<script>
import "../assets/less/my.less";
export default {
  name: "My",
  data() {
    return {
        menuList:[
            {title:'我的收藏',icon:'star',to:'/collect'},
            {title:'个人资料',icon:require('../assets/images/mymsg.png'),to:'/mydatum'},
            {title:'收货地址',icon:require('../assets/images/address.png'),to:'/address'},
            {title:'设置',icon:'setting',to:'/setting'},
            {title:'关于我们',icon:'info'}
        ],
        userInfo:{},//用户信息
        allOrderNum:0,
        unFinishOrderNum:0,
        finishOrderNum:0

    };
  },
  methods: {
    //   获取我的一些信息
    getMyInfo(){
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return this.$router.push("/login");
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findMy",
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
           this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }
          if(res.data.code=='A001'){
              this.userInfo=res.data.result[0];
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    showOrders(status){
        this.$router.push({name:'Order',params:{status:status}})
    },
    // 获取不同状态的数量
    getOrderNum(){
       let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return this.$router.push("/login");
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status:0
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
          if(res.data.code==70000){
            let oids=[];
            let result=res.data.result;
            result.forEach(v=>{
              if(oids.indexOf(v.oid)==-1){
                oids.push(v.oid);
              }
            })
            this.allOrderNum=oids.length;
            for(let o of oids){
              if(result.filter(v=>v.oid==o)[0].status==1){
                this.unFinishOrderNum++;
              }else{
                 this.finishOrderNum++;
              }
            }
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    //退出登录
    out(){
       let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return this.$router.push("/login");
      }
       // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: this.baseUrl + "/logout",
        data: {
          appkey: this.appkey,
          tokenString,
        }
      }).then(res=>{
         // 关闭加载提示
          this.$toast.clear();
          console.log(res);
          if(res.data.code=='F001'){
            this.$router.push({name:'Login'})
             this.$cookies.remove("tokenString");
          }
      })
    }
  },
  created() {
      this.getMyInfo();
      this.getOrderNum();
  },
};
</script>