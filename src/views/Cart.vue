<template>
    <div class="cart">
  <van-nav-bar
  title="购物车"
  left-text="返回"
  left-arrow
  @click-left="back"
  fixed
  placeholder
/>
<div v-if='cartData.length!=0'>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="亲,没有更多了~"
  @load="getMoreCartData"
  :offset='50'
>
<div class="address_bar_wrap">
    <div class="address_bar" @click="showAddress">
        <van-icon name="location" color='#6d411e'  />
        <div class="address">{{chosedAddress}}</div>
    </div>
    <span class="btn" @click="changeIsEdit">{{isEdit?'完成':'编辑'}}</span>
</div>
<div class="cart-content">
 <div class="cart-item" v-for='(v,k) in cartData' :key='v.sid'>
<van-swipe-cell :disabled='!isEdit'>
  <div class="box">
  <div class="checkbox">
  <van-checkbox v-model="v.checked" checked-color="#6d411e" @change="check"></van-checkbox>
  </div>
<van-card
  :price="v.price"
  :thumb="v.small_img"
>
<template #title>
    <div class="title-box">
        <div class="name">
            <div class="cname">{{v.name}}</div>
            <div class="ename">{{v.enname}}</div>
        </div>
        <div class="des">{{v.rule}}</div>
    </div>
  </template>
<template #num>
    <van-stepper theme="round" button-size="22" integer v-model="v.count" @change='changeNum(v.sid,v.count)'/>
  </template>
</van-card>
</div>
  <template #right>
    <div class="operate">
     <van-button type="danger"  class="btn" @click="deleteOne(k,[v.sid])" color='#c99065'>删除</van-button>
     </div>
  </template>
</van-swipe-cell>
    </div>
</div>
<van-submit-bar :price="totalPrice*100" button-text="提交订单"  class="my-submit" button-color="linear-gradient(to right, #c99065, #6d411e)" v-show='!isEdit' tip-icon="info-o" :disabled='addressData.length==0 || !ischecked' @submit='pay'>
  <van-checkbox v-model="checked" checked-color="#6d411e" @click="checkAll">全选</van-checkbox>
  <template #tip  v-if='addressData.length==0 || !ischecked'>
    {{!ischecked?'你还未选择任何商品':'你的收货地址还未选择,'}}<span @click="showAddress" v-if='addressData.length==0'>修改地址</span>
  </template>
</van-submit-bar>
<van-submit-bar  button-text="删除选择"  class="my-submit" v-show='isEdit' button-color="linear-gradient(to right, #c99065, #6d411e)" @submit='deleteAll'>
  <van-checkbox v-model="checked" checked-color="#6d411e" @click="checkAll">全选</van-checkbox>
</van-submit-bar>
 </van-list>
 </div>
 <div v-else>
  <van-empty description="你的购物车空空如也~" :image="require('../assets/images/cartNull.png')">
   <router-link class="bottom-button" to="/" tag='div'>去逛一逛</router-link>
  </van-empty>
</div>
<van-popup v-model="isShowAddress" position="bottom"
  :style="{ height: '60%' }" closeable round class="my-popup">
      <p>收货地址</p>
      <van-address-list
  v-model="chosenAddressId"
  :list="addressData"
  default-tag-text="默认"
  class="my-address"
  @select='changeAddress'
  @add='onAdd'
   @edit="onEdit"
/>
</van-popup>
</div>
</template>
<script>
import "../assets/less/cart.less";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      checked: false,
      isEdit: false, //是否进入编辑状态
      allCartData: [], //购物车中的所有数据
      cartData: [], //第一次展示的数据
      fristIndex: 0, //每一次加载的数据起始位置
      count: 5, //每一次加载的数据
      loading: true, //是否正在加载
      finished: false, //是否加载完成
      isShowAddress: false, //是否显示选择地址
      addressData: [], //地址列表
      chosenAddressId: "0", //当前选择的地址
      chosedAddress: "" //显示的地址名称
    };
  },
  computed: {
    ...mapState(["cartNum"]),
    // 总价
    totalPrice() {
      let totalPrice = 0;
      for (let v of this.cartData) {
        if (v.checked) {
          totalPrice += parseFloat(v.price) * parseInt(v.count);
        }
      }
      return totalPrice;
    },
     // 是否有选择商品
      ischecked(){
        if(this.cartData.filter(v=>v.checked).length!=0){
          return true;
        }else{
          return false;
        }
      }
  },
  methods: {
    ...mapMutations(["changeCartNum"]),
    // 返回
    showAddress() {
      this.isShowAddress = true;
    },
    back() {
      this.$router.back();
    },
    // 进入退出编辑状态
    changeIsEdit() {
      this.isEdit = !this.isEdit;
    },
    // 首次获取购物车数据
    getCartData() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAllShopcart",
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
              duration: 3000
            });
            return this.$router.push({ name: "Login" });
          }
          if (res.data.code == 5000) {
            if (res.data.result.length > 0) {
              // 开始都没有选中
              for (let r of res.data.result) {
                r.checked = false;
              }
              this.allCartData = res.data.result;
              this.cartData = this.allCartData.slice(
                this.fristIndex,
                this.fristIndex + this.count
              );
              // 判断取出的数据是否大于一页的数量，少于的话肯定没有下一页数据了
              if (this.cartData.length < this.count) {
                this.finished = true;
                return;
              }
              // 改变起始位置
              this.fristIndex += this.count;
            }
            //下次触底进行懒加载
            this.loading = false;
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 触底加载更多
    getMoreCartData() {
      setTimeout(() => {
        this.loading = true;
        let data = this.allCartData.slice(
          this.fristIndex,
          this.fristIndex + this.count
        );
        this.cartData.push(...data);
        this.fristIndex += this.count;
        //  判断取到的数据是否小于一页的数量，如果少于则表示下面没有数据了
        if (data.length < this.count) {
          this.finished = true;
        }
        this.loading = false;
      }, 1000);
    },
    // 改变商品数量
    changeNum(sid, num) {
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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: sid,
          count: num
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
              duration: 3000
            });
            return this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 全选
    checkAll() {
      for (let v of this.cartData) {
        v.checked = this.checked;
      }
    },
    // 单选
    check() {
      for (let v of this.cartData) {
        if (!v.checked) {
          this.checked = false;
          return;
        }
        this.checked = true;
      }
    },
    // 删除单个
    deleteOne(key, sid) {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      console.log(JSON.stringify(sid));
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
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sid)
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
              duration: 3000
            });
            return this.$router.push({ name: "Login" });
          }
          if (res.data.code == 7000) {
            //删除成功
            //  删除数组中的数据
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000
            });
            this.cartData.splice(key, 1);
            this.changeCartNum(this.cartNum - 1);
            this.check();
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    //删除多个
    deleteAll() {
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
      let sids = [];
      for (let v of this.cartData) {
        if (v.checked) {
          sids.push(v.sid);
        }
      }
      this.axios({
        method: "POST",
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
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
              duration: 3000
            });
            return this.$router.push({ name: "Login" });
          }
          if (res.data.code == 7000) {
            //删除成功
            //  删除数组中的数据
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000
            });
            this.cartData = this.cartData.filter(v => {
              return !sids.includes(v.sid);
            });
            this.changeCartNum(this.cartNum - sids.length);
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 查询用户添加的地址
    getAddress() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({name:"Login"});
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起查询地址请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: tokenString
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
          if (res.data.code == 20000) {
            let result = res.data.result;
            for (let v of result) {
              v.address =
                v.province + v.city + v.county + " " + v.addressDetail;
              v.isDefault = Boolean(v.isDefault);
            }
            this.addressData = result;
            // 初始显示的地址名
            if (this.addressData.length == 0) {
              this.chosedAddress = "未选择收货地址";
              return;
            }
            if (this.addressData.filter(v => v.isDefault).length == 0) {
              this.chosedAddress = this.addressData[0].address.split(" ")[0];
              this.chosenAddressId=this.addressData[0].id;
            } else {
               // 选中默认地址
            this.chosenAddressId = this.addressData.filter(
              v => v.isDefault
            )[0].id;
              let address = this.addressData.filter(v => v.isDefault)[0]
                .address;
              this.chosedAddress = address.split(" ")[0];
            }
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    //切换地址
    changeAddress(item, index) {
      this.chosedAddress = this.addressData[index].address.split(" ")[0];
    },
    //跳转到新增地址
    onAdd() {
      this.$router.push("/editaddress");
    },
   //跳转到编辑地址
    onEdit(item,index){
       this.$router.push({name:'EditAddress',params:{aid:this.addressData[index].aid}})
    },
    // 提交订单
    pay(){
      let dataObj={
        addressId:this.addressData.filter(v=>v.id==this.chosenAddressId)[0].aid,
        goodsId:[]
      };
      for (let v of this.cartData){
        if(v.checked) {
          dataObj.goodsId.push(v.sid);
        }  
      }
      this.$router.push({name:'Pay',params:{order:dataObj}})
    }
  },
  created() {
    this.getCartData();
    this.getAddress();
  },
};
</script>
