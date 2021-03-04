<template>
    <div class="order-item">
    <van-card
  :num="productList.count"
  :price="productList.price"
  :desc="productList.enname"
  :thumb="productList.small_img"
  class="my-card"
>
 <template #title>
    <div class="box">
        <span class="name">{{productList.name}}</span>
        <span class="sku">{{productList.rule}}</span>
    </div>
  </template>
 </van-card>
           </div>
</template>

<script>
export default {
  props:{
      productList:{
          type:Object,
          default(){
              return {}
          }
      }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.order-item {
  .my-card {
    .box {
        display: flex;
        .name{
            color:#000;
            font-size: 16px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .sku{
            color:#666; 
            font-size: 14px;
        }
    }
  }
}
</style>