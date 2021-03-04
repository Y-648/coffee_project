<template>
    <div class="title">
        <div class="left-box">
        <span class="line"></span>
        <div class="name">
           <span class="text">{{name}}</span>
           <van-icon :name="icon" :color="iconColor"  size="18" v-if='icon'/>
        </div>
        </div>
        <div class="more" v-if='isMore'>
            <span class="text">查看更多</span>
            <van-icon name="arrow" color="#444444" size="14" />
        </div>
    </div>
</template>

<script>
export default {
    name:'Title',
    props:{
        name:String,//标题名
        icon:String,//标题后面的图标
        iconColor:String,//图标颜色
        isMore:{
            type:Boolean,
            default:true
        } //是否显示更多
    }
};
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  color: #444444;
  .left-box {
    display: flex;
    align-items: center;
    .line {
      height:20px;
      width: 4px;
      background-color: #c99065;
    }
    .name {
      display: flex;
      align-items: center;
      .text{
        font-size: 18px;
        color: #c99065;
        margin: 0 10px;
    }
    }
    }
  .more {
      display: flex;
      align-items: center;
      font-size: 12px;
  }
}
</style>