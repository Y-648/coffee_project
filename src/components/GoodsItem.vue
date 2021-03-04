<template>
<div>
    <routerLink class="goods-item-one" :to="to" tag='div' v-if='mode==1'>
      <div class="img-box">
<van-image :src="imgSrc">
  <template v-slot:loading>
    <van-loading type="spinner" size="20" />
  </template>
</van-image>
<span class="tag" v-if='tag'>{{tag}}</span>
 </div>
   
<div class="content">
    <div class='title'>
    <span class="name van-ellipsis">{{name}}</span>
    <span class="des van-multi-ellipsis--l2">{{des}}</span>
    </div>
    <div class="price-box">
        <div class="price">
            <span class="mark">￥</span>
            <span class="text">{{price}}</span>
        </div>
        <van-icon name="cart" color="#6d411e" size='24' @click.stop="addCart" v-if='!isCollect'/>
        <van-icon name="delete" color="#6d411e" size='24' @click.stop="deleteCollect"  v-if='isCollect'/>
    </div>
</div>
    </routerLink>
<router-link tag='div' class="goods-item-two" :to='to' v-if='mode==2'>
  <div class="img-box">
      <img :src="imgSrc">
      <span class="tag" v-if='tag'>{{tag}}</span>
  </div>
  <div class="content">
      <div class="title">
      <div class="name">{{name}}</div>
      <div class="des van-multi-ellipsis--l2">{{des}}</div>
      </div>
      <div class="bottom-box">
      <div class="price">
        <span class="sign">￥</span>
        <span class="text">{{price}}</span>
      </div>
      <van-icon name="cart" color="#6d411e" size='24' @click.stop="addCart"/>
      </div>
  </div>
</router-link>
</div>
</template>

<script>
export default {
  name: "GoodsItem",
  props: {
    mode: {
      type: Number,
      default: 1
    }, //展示样式
    name: String, //名字
    imgSrc: String, //图片
    des: String, //描述
    price: String, //价格
    tag: String, //标签
    isCollect:{
      type:Boolean,
      default:false
    },//是否是收藏
    to: {
      type:String || Object, //跳转路由
      default:''
  }
},
methods: {
  addCart(){
    this.$emit('addCart',0);
  },
  deleteCollect(){
     this.$emit('delete',0);
  }
},
}
</script>

<style lang="less" scoped>
.goods-item-one {
  padding: 0 10px;
  .img-box {
    position: relative;
    .van-image {
      height: 150px;
      width: 100%;
      border-radius: 7px;
      margin-bottom: 7px;
    }
    .tag {
      position: absolute;
      font-size: 12px;
      padding: 2px 5px;
      background: #6d411e;
      color: #fff;
      border-radius: 2px;
      left: 0;
      top: 10px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
    .title {
      .name {
        font-size: 16px;
        color: #444;
        display: block;
      }
      .des {
        font-size: 12px;
        color: rgb(169, 165, 166);
      }
    }

    .price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price {
        color: #6d411e;
        font-size: 18px;
        .mark {
          font-size: 12px;
        }
      }
    }
  }
}

.goods-item-two{
  display: flex;
  padding: 10px;
  background: #fff;
  .img-box{
    position: relative;
    img{
      height: 80px;
      width: 80px;
      border-radius: 5px;
    }
    .tag{
      position: absolute;
      line-height: 20px;
      padding: 0 6px;
      font-size: 10px;
      background: #6d411e;
      color: #fff;
      left: 0;
      top:10px;
    }
  }
  .content{
    margin-left:10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title{
      .name{
        font-size: 18px;
        color: #000;
      }
      .des{
        font-size: 12px;
        color: #666;
      }
    }
    .bottom-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price{
        color: #6d411e;
        .sign{
          font-size: 12px;
        }
        .text{
          font-size: 20px;
        }
      }
    }
  }
}
</style>