<template>
    <div class="address">
        <van-nav-bar
  title="我的收货地址"
  left-arrow
  fixed
  placeholder
  @click-left="back"
  class="my-nav"
/>
<van-address-list
  v-model="chosenAddressId"
  :list="addressList"
  default-tag-text="默认"
  @add="onAdd"
  @edit="onEdit"
  class="my-address"
/>
</div>
</template>

<script>
export default {
  name: "Address",
  data() {
    return {
      chosenAddressId:'0',
      addressList: []
    };
  },
  methods: {
    back(){
      this.$router.back();
    },
    onAdd() {
      this.$router.push('/editaddress')
    },
    onEdit(item,index) {
     this.$router.push({name:'EditAddress',params:{aid:this.addressList[index].aid}})
    },
    // 查询用户添加的地址
    getAddress(){
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
      //   发起查询地址请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAddress",
        params:{
          appkey: this.appkey,
          tokenString: tokenString,
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
            let result=res.data.result;
            for(let v of result){
              v.address=v.province+v.city+v.county+' '+v.addressDetail;
              v.isDefault=Boolean(v.isDefault);
            }
            this.addressList=result;
            this.chosenAddressId=this.addressList.filter(v=>v.isDefault)[0].id;
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
    this.getAddress();
  },
};
</script>

<style lang="less" scoped>
.address {
  .my-nav {
    /deep/.van-icon {
      color: #000;
    }
  }
  .my-address {
    /deep/.van-radio__icon--checked .van-icon {
      background-color: #6d411e;
      border-color: #6d411e;
    }
    /deep/.van-tag--danger {
      background-color: #6d411e;
    }
    /deep/.van-button--danger {
      background-color: #6d411e;
      border-color: #6d411e;
    }
  }
}
</style>